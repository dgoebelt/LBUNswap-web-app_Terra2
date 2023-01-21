import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import Container from "components/Container"
import { SubmitHandler, useForm, WatchObserver } from "react-hook-form"
import Result from "./Result"
import TabView from "components/TabView"
import { useSearchParams } from "react-router-dom"
import { DEFAULT_MAX_SPREAD, LUNA, ULUNA } from "constants/constants"
import { useNetwork, useAddress, useConnectModal } from "hooks"
import {
  lookup,
  decimal,
  toAmount,
  findTokenInfoBySymbolOrContractAddr,
} from "libs/parse"
import calc from "helpers/calc"
import { PriceKey, BalanceKey } from "hooks/contractKeys"
import Count from "components/Count"
import { validate as v, placeholder, step, renderBalance } from "./formHelpers"
import useSwapSelectToken from "./useSwapSelectToken"
import SwapFormGroup from "./SwapFormGroup"
import usePairs, { InitLP, useLpTokenInfos, useTokenInfos } from "rest/usePairs"
import useBalance from "rest/useBalance"
import { minus, gte, times, ceil, div } from "libs/math"
import { TooltipIcon } from "components/Tooltip"
import Tooltip from "lang/Tooltip.json"
import useGasPrice from "rest/useGasPrice"
import { Coins, CreateTxOptions } from "@terra-money/terra.js"
import { MsgExecuteContract } from "@terra-money/terra.js"
import { Type } from "pages/Swap"
import usePool from "rest/usePool"
import { insertIf, isNativeToken } from "libs/utils"
import { percent } from "libs/num"
import SvgArrow from "images/arrow.svg"
import SvgPlus from "images/plus.svg"
import Button from "components/Button"
import MESSAGE from "lang/MESSAGE.json"
import SwapConfirm from "./SwapConfirm"
import useAPI from "rest/useAPI"
import { TxResult, useLCDClient, useWallet } from "@terra-money/wallet-provider"
import iconSettings from "images/icon-settings.svg"
import iconReload from "images/icon-reload.svg"
import { useModal } from "components/Modal"
import Settings, { SettingValues } from "components/Settings"
import useLocalStorage from "libs/useLocalStorage"
import useAutoRouter from "rest/useAutoRouter"
import WarningModal from "components/Warning"
import Disclaimer from "components/DisclaimerAgreement"
import useTBC from "rest/useTBC"
import { formatMoney } from "libs/parse"

enum Key {
  value1 = "value1",
  value2 = "value2",
  feeValue = "feeValue",
  feeSymbol = "feeSymbol",
  load = "load",
  symbol1 = "symbol1",
  symbol2 = "symbol2",
  max1 = "max1",
  max2 = "max2",
  maxFee = "maxFee",
  gasPrice = "gasPrice",
  poolLoading = "poolLoading",
}

const priceKey = PriceKey.PAIR

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
`

const Warning = {
  color: "red",
  FontWeight: "bold",
}

const SwapForm = ({ type, tabs }: { type: Type; tabs: TabViewProps }) => {
  const connectModal = useConnectModal()
  const [isWarningModalConfirmed, setIsWarningModalConfirmed] = useState(true)
  const warningModal = useModal()

  const [searchParams, setSearchParams] = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""

  const tokenInfos = useTokenInfos()
  const lpTokenInfos = useLpTokenInfos()

  const taxRate = 0.048

  //const { generateContractMessages } = useAPI()
  const { fee } = useNetwork()
  const walletAddress = useAddress()
  const { post: terraExtensionPost } = useWallet()
  const terra = useLCDClient()
  const settingsModal = useModal()
  const [slippageSettings, setSlippageSettings] =
    useLocalStorage<SettingValues>("slippage", {
      slippage: `${DEFAULT_MAX_SPREAD}`,
      custom: "",
    })
  const slippageTolerance = useMemo(() => {
    // 1% = 0.01
    return `${(
      parseFloat(
        (slippageSettings?.slippage === "custom"
          ? slippageSettings.custom
          : slippageSettings.slippage) || `${DEFAULT_MAX_SPREAD}`
      ) / 100
    ).toFixed(3)}`
  }, [slippageSettings])

 const balanceKey = {
    [Type.SWAP]: BalanceKey.TOKEN,
    [Type.PROVIDE]: BalanceKey.TOKEN,
    [Type.WITHDRAW]: BalanceKey.LPSTAKABLE,
  }[type]

  const form = useForm({
    defaultValues: {
      [Key.value1]: "",
      [Key.value2]: "",
      [Key.feeValue]: "",
      [Key.feeSymbol]: ULUNA,
      [Key.load]: "",
      [Key.symbol1]: "",
      [Key.symbol2]: "LBUN",
      [Key.max1]: "",
      [Key.max2]: "",
      [Key.maxFee]: "",
      [Key.gasPrice]: "",
      [Key.poolLoading]: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  })
  const {
    register,
    watch,
    setValue,
    setFocus,
    formState,
    trigger,
    resetField,
  } = form
  const [isReversed, setIsReversed] = useState(false)
  const formData = watch()
 

  useEffect(() => {
    if (!from && !to) {
      setTimeout(() => {
        searchParams.set("from", type === Type.WITHDRAW ? InitLP : ULUNA)
        //made LBUN/LUNA the only pair - rbh
        searchParams.set(
          "to",
          "terra1ulr678u52qwt27dsgxrftthq20a8v8t9s8f3hz5z8s62wsu6rslqyezul4"
        )
        setSearchParams(searchParams, { replace: true })
      }, 100)
    }
  }, [from, searchParams, setSearchParams, to, type])

  const handleToken1Select = (token: string, isUnable?: boolean) => {
    searchParams.set("from", token)
    if (!formData[Key.value1]) {
      setFocus(Key.value1)
    }
    if (isUnable) {
      searchParams.set("to", "")
    }
    setSearchParams(searchParams, { replace: true })
  }
  const handleToken2Select = (token: string, isUnable?: boolean) => {
    searchParams.set("to", token)
    if (!formData[Key.value2]) {
      setFocus(Key.value2)
    }
    if (isUnable) {
      searchParams.set("from", "")
    }
    setSearchParams(searchParams, { replace: true })
  }
  const handleSwitchToken = () => {
    if (!pairSwitchable) {
      return
    }
    const value = formData[Key.value2]
    handleToken1Select(to)
    handleToken2Select(from)
    setIsReversed(!isReversed)
    setTimeout(() => {
      setValue(Key.value1, value)
    }, 250)
  }

  const tokenInfo1 = useMemo(() => {
    return tokenInfos.get(from)
  }, [from, tokenInfos])

  const tokenInfo2 = useMemo(() => {
    return tokenInfos.get(to)
  }, [to, tokenInfos])

  const pairSwitchable = useMemo(() => from !== "" && to !== "", [from, to])

  const { balance: balance1 } = useBalance(from, formData[Key.symbol1])
  const { balance: balance2 } = useBalance(to, formData[Key.symbol2])

  const [feeAddress, setFeeAddress] = useState("")
  const fetchFeeAddress = useCallback(() => {
    return setFeeAddress(
      tokenInfos.get(formData[Key.feeSymbol])?.contract_addr || ""
    )
  }, [formData, tokenInfos])

  useEffect(() => {
    if (!feeAddress) {
      fetchFeeAddress()
    }
  }, [feeAddress, fetchFeeAddress])

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchFeeAddress()
    }, 3000)

    fetchFeeAddress()
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [formData, fetchFeeAddress])

  const { balance: maxFeeBalance } = useBalance(
    feeAddress,
    formData[Key.feeSymbol]
  )

  const selectToken1 = useSwapSelectToken(
    {
      value: from,
      symbol: formData[Key.symbol1],
      onSelect: handleToken1Select,
      priceKey,
      balanceKey,
      isFrom: true,
      oppositeValue: to,
      onSelectOpposite: handleToken2Select,
    },
    type
  )

  const selectToken2 = useSwapSelectToken(
    {
      value: to,
      symbol: formData[Key.symbol2],
      onSelect: handleToken2Select,
      priceKey,
      balanceKey,
      isFrom: false,
      oppositeValue: from,
      onSelectOpposite: handleToken1Select,
    },
    type
  )

  const { isLoading: isAutoRouterLoading, profitableQuery } = useTBC({
    from: from,
    to: to,
    amount: formData[Key.value1],
    type: formState.isSubmitted ? undefined : type,
    slippageTolerance,
  })

  const simulationContents = useMemo(() => {


    if (isNaN(Number(formData[Key.value1])) || isNaN(Number(formData[Key.value2]))) {
      return []
    }


    return [
      ...insertIf(type === Type.SWAP, {
        title: <TooltipIcon content={Tooltip.Swap.Rate}>Rate</TooltipIcon>,
        content:
          formData[Key.symbol2] === "LBUN"
            ? `${decimal(profitableQuery?.price, tokenInfo1?.decimals)} ${
                formData[Key.symbol1]
              } = 1  ${formData[Key.symbol2]}`
            : `${decimal(
                profitableQuery?.lunaLbunPrice,
                tokenInfo1?.decimals
              )} ${formData[Key.symbol1]} = 1  ${formData[Key.symbol2]}`,
      }),

      ...insertIf(type === Type.SWAP, {
        title: (
          <TooltipIcon content={Tooltip.Swap.MinimumReceived}>
            Rate (in USD)
          </TooltipIcon>
        ),
        content:
          formData[Key.symbol2] === "LBUN"
            ? `$${formatMoney(
                //Number(profitableQuery?.price) *
                //  Number(profitableQuery?.lunaUsdPrice),
              (Number(formData[Key.value1]) *
                Number(profitableQuery?.lunaUsdPrice)) /
                Number(formData[Key.value2]),
                4,
                true
              )} USD = 1 ${formData[Key.symbol2]}`
            : `$${formatMoney(
                (Number(formData[Key.value2]) *
                  Number(profitableQuery?.lunaUsdPrice)) /
                  Number(formData[Key.value1]),
                4,
                true
              )} USD = 1 ${formData[Key.symbol1]}`,
      }),

      {
        title: <TooltipIcon content={Tooltip.Swap.TxFee}>Tx Fee</TooltipIcon>,
        content: (
          <Count symbol={formData[Key.feeSymbol]}>
            {lookup(formData[Key.feeValue])}
          </Count>
        ),
      },
      ...insertIf(type === Type.SWAP && profitableQuery?.tokenRoutes?.length, {
        title: (
          <TooltipIcon content="Optimized route for your optimal gain">
            Route
          </TooltipIcon>
        ),
        content: (
          <span
            title={profitableQuery?.tokenRoutes
              ?.map((token) => tokenInfos.get(token)?.symbol)
              .join(" → ")}
          >
            {profitableQuery?.tokenRoutes
              ?.map((token) => tokenInfos.get(token)?.symbol)
              .join(" → ")}
          </span>
        ),
      }),
    ]
  }, [
    formData,
    type,
    profitableQuery,
    slippageTolerance,
    tokenInfo1?.decimals,
    tokenInfos,
  ])

  const { gasPrice } = useGasPrice(formData[Key.feeSymbol])

  const validateForm = async (
    key: Key.value1 | Key.value2 | Key.feeValue | Key.feeSymbol | Key.load,
    newValues?: Partial<typeof formData>
  ) => {
    const {
      value1,
      value2,
      symbol1,
      symbol2,
      max1,
      max2,
      feeValue,
      feeSymbol,
      maxFee,
    } = { ...formData, ...(newValues || {}) }

    if (key === Key.value1) {
      return (
        v.amount(value1, {
          symbol: symbol1,
          max: max1,
          refvalue: value2,
          refsymbol: symbol2,
          isFrom: true,
          feeValue,
          feeSymbol,
          maxFee,
          type,
          decimals: tokenInfo1?.decimals,
        }) || true
      )
    }

    if (key === Key.value2) {
      if (!symbol2) {
        return true
      }
      if (type !== Type.WITHDRAW) {
        return (
          v.amount(value2, {
            symbol: symbol2,
            max: max2,
            refvalue: value1,
            refsymbol: symbol1,
            isFrom: false,
            feeValue: "0",
            feeSymbol,
            maxFee: "0",
            type,
            decimals: tokenInfo2?.decimals,
          }) || true
        )
      }
      if (isReversed || type === Type.WITHDRAW) {
        return v.required(value2) || true
      }
    }
    return true
  }

  useEffect(() => {
    resetField(Key.value1)
    resetField(Key.value2)
  }, [type, resetField])

  useEffect(() => {
    setValue(Key.value1, "")
  }, [from, setValue])

  useEffect(() => {
    setValue(Key.value2, "")
  }, [to, setValue])

  useEffect(() => {
    setValue(Key.symbol1, tokenInfo1?.symbol || "")
  }, [setValue, tokenInfo1])

  useEffect(() => {
    setValue(Key.symbol2, tokenInfo2?.symbol || "")
  }, [setValue, tokenInfo2])

  useEffect(() => {
    setValue(Key.max1, balance1 || "")
  }, [balance1, setValue])

  useEffect(() => {
    setValue(Key.max2, balance2 || "")
  }, [balance2, setValue])

  useEffect(() => {
    setValue(Key.maxFee, maxFeeBalance || "")
  }, [maxFeeBalance, setValue])

  const watchCallback = useCallback<WatchObserver<Record<Key, string>>>(
    (data, { name: watchName, value: watchValue, type: eventType }) => {
      if (!eventType && [Key.value1, Key.value2].includes(watchName as Key)) {
        return
      }
      if (type === Type.SWAP) {
        if ([Key.value1, Key.feeSymbol].includes(watchName as Key)) {
          setValue(
            Key.value2,
            lookup(`${profitableQuery?.simulatedAmount}`, to)
          )
          trigger(Key.value2)
          setIsWarningModalConfirmed(false)
        }
        if (watchName === Key.value2) {
          setValue(
            Key.value1,
            lookup(
              div(
                toAmount(`${data[Key.value2]}`, to),
                `${profitableQuery?.simulatedAmount}`
              )
            )
          )
          trigger(Key.value1)
        }
      }
    },
    [profitableQuery, setValue, to, trigger, type]
  )

  useEffect(() => {
    watchCallback(form.getValues(), { name: Key.value1, type: "blur" })
  }, [form, profitableQuery, watchCallback])

  useEffect(() => {
    watch()
    const subscription = watch(watchCallback)
    return () => subscription.unsubscribe()
  }, [watch, watchCallback, profitableQuery])

  useEffect(() => {
    setValue(Key.gasPrice, gasPrice || "")
    setValue(Key.feeValue, gasPrice ? ceil(times(fee?.gas, gasPrice)) : "")
  }, [fee?.gas, gasPrice, setValue])

  useEffect(() => {
    setValue(Key.feeValue, ceil(times(fee?.gas, gasPrice)) || "")
  }, [fee, gasPrice, setValue])

  const handleFailure = useCallback(() => {
    setTimeout(() => {
      form.reset(form.getValues(), {
        keepIsSubmitted: false,
        keepSubmitCount: false,
      })
    }, 125)
    setResult(undefined)
    window.location.reload()
  }, [form])

  const handleSubmit = useCallback<SubmitHandler<Partial<Record<Key, string>>>>(
    async (values) => {
      const { value1, value2, feeSymbol, gasPrice } = values

      try {
        settingsModal.close()

        let msgs: any = {}
        if (type === Type.SWAP) {
          if (!profitableQuery?.msg) {
            return
          }
          //get the Tx Msgs
          msgs = profitableQuery.msg
        }

        console.log(msgs)

        let txOptions: CreateTxOptions = {
          msgs: [msgs],
          memo: undefined,
          gasPrices: `${gasPrice}${
            findTokenInfoBySymbolOrContractAddr(feeSymbol)?.contract_addr
          }`,
        }

        const signMsg = await terra.tx.create(
          [{ address: walletAddress }],
          txOptions
        )

        txOptions.fee = signMsg.auth_info.fee
        setValue(
          Key.feeValue,
          txOptions.fee.amount.get(feeAddress)?.amount.toString() || ""
        )

        const extensionResult = await terraExtensionPost(txOptions)

        if (extensionResult) {
          setResult(extensionResult)
          return
        }
      } catch (error) {
        console.error(error)
        setResult(error as any)
      }
    },
    [
      settingsModal,
      type,
      terra,
      walletAddress,
      terraExtensionPost,
      from,
      to,
      slippageTolerance,
      tokenInfo1,
      profitableQuery,
    ]
  )

  const [result, setResult] = useState<TxResult | undefined>()
  // hotfix: prevent modal closing when virtual keyboard is opened
  const lastWindowWidth = useRef(window.innerWidth)
  useEffect(() => {
    const handleResize = () => {
      if (lastWindowWidth.current !== window.innerWidth) {
        settingsModal.close()
      }
      lastWindowWidth.current = window.innerWidth
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [settingsModal])

  return (
    <Wrapper>
      <Disclaimer />
      {formState.isSubmitted && result && (
        <Container sm>
          <Result
            response={result}
            error={result instanceof Error ? result : undefined}
            parserKey={type || "default"}
            onFailure={handleFailure}
          />
        </Container>
      )}
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleFailure)}
        style={{ display: formState.isSubmitted ? "none" : "block" }}
      >
        <TabView
          {...tabs}
          extra={[
            {
              iconUrl: iconReload,
              onClick: () => {
                searchParams.set("to", "")
                searchParams.set("from", "")
                setSearchParams(searchParams, { replace: true })
                resetField(Key.value1)
                resetField(Key.value2)
                resetField(Key.feeSymbol)
                setFeeAddress("")
              },
              disabled: formState.isSubmitting,
            },
          ]}
          side={[]}
        >
          <Container sm>
            <SwapFormGroup
              input={{
                ...register(Key.value1, {
                  validate: {
                    asyncValidate: async (value) =>
                      await validateForm(Key.value1, { [Key.value1]: value }),
                  },
                }),
                step: step(tokenInfo1?.decimals),
                placeholder: placeholder(tokenInfo1?.decimals),
                autoComplete: "off",
                type: "number",
                onKeyDown: () => {
                  setIsReversed(false)
                },
              }}
              error={
                formState.dirtyFields[Key.value1]
                  ? formState?.errors?.[Key.value1]?.message
                  : undefined
              }
              feeSelect={(symbol) => {
                setValue(Key.feeSymbol, symbol)
                setFocus(Key.value1)
                setTimeout(() => {
                  trigger(Key.value1)
                }, 250)
              }}
              feeSymbol={formData[Key.feeSymbol]}
              help={renderBalance(balance1 || "0", formData[Key.symbol1])}
              label={
                {
                  [Type.SWAP]: "From",
                  [Type.PROVIDE]: "Asset",
                  [Type.WITHDRAW]: "LP",
                }[type]
              }
              unit={selectToken1.button}
              assets={selectToken1.assets}
              focused={selectToken1.isOpen}
              max={
                formData[Key.symbol1]
                  ? async () => {
                      if (type === Type.WITHDRAW) {
                        setValue(Key.value1, lookup(formData[Key.max1], from))
                        trigger(Key.value1)
                        return
                      }

                      let maxBalance = formData[Key.max1]
                      // fee
                      if (formData[Key.symbol1] === formData[Key.feeSymbol]) {
                        if (gte(maxBalance, formData[Key.feeValue])) {
                          maxBalance = minus(maxBalance, formData[Key.feeValue])
                        } else {
                          maxBalance = minus(maxBalance, maxBalance)
                        }
                      }

                      maxBalance = lookup(maxBalance, from)
                      setValue(Key.value1, maxBalance)
                      trigger(Key.value1)
                    }
                  : undefined
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 22,
                marginTop: 22,
                alignContent: "center",
              }}
            >
              {type === Type.PROVIDE ? (
                <img src={SvgPlus} width={24} height={24} alt="Provide" />
              ) : (
                <img
                  src={SvgArrow}
                  width={24}
                  height={24}
                  alt="To"
                  onClick={handleSwitchToken}
                  style={{
                    cursor: pairSwitchable ? "pointer" : "auto",
                  }}
                />
              )}
            </div>
            <SwapFormGroup
              input={{
                ...register(Key.value2, {
                  validate: {
                    asyncValidate: async (value) =>
                      await validateForm(Key.value2, { [Key.value2]: value }),
                  },
                }),
                ...(type !== Type.WITHDRAW
                  ? {
                      step: step(tokenInfo2?.decimals),
                      placeholder: placeholder(tokenInfo2?.decimals),
                      type: "number",
                    }
                  : {
                      placeholder: "-",
                      type: "text",
                    }),
                autoComplete: "off",
                readOnly: true,
                onKeyDown: () => {
                  setIsReversed(true)
                },
              }}
              error={
                formState.dirtyFields[Key.value2]
                  ? formState?.errors?.[Key.value2]?.message
                  : undefined
              }
              help={
                type !== Type.WITHDRAW
                  ? renderBalance(balance2 || "0", formData[Key.symbol2])
                  : undefined
              }
              label={
                {
                  [Type.SWAP]: "To",
                  [Type.PROVIDE]: "Asset",
                  [Type.WITHDRAW]: "Received",
                }[type]
              }
              unit={type !== Type.WITHDRAW && selectToken2.button}
              assets={type !== Type.WITHDRAW && selectToken2.assets}
              focused={selectToken2.isOpen}
              isLoading={
                type === Type.SWAP &&
                !!Number(formData[Key.value1]) &&
                !!from &&
                !!to &&
                isAutoRouterLoading
              }
            />
            <SwapConfirm list={simulationContents} />
            <div>
              <div
                style={{
                  paddingTop: "20px"
                }}
              >
                <p style={{color: "#000"}}>
                  The displayed number is the simulated result and can be
                  different from the actual swap rate. Trade at your own risk.
                </p>
              </div>
              <Button
                {...(walletAddress
                  ? {
                      children: type || "Submit",
                      loading: formState.isSubmitting,
                      disabled:
                        !formState.isValid || 

                        
                        formState.isValidating ||
                        simulationContents?.length <= 0 ||
                        (type === Type.SWAP &&
                          (!profitableQuery || isAutoRouterLoading)),
                      type: "submit",
                    }
                  : {
                      onClick: () => connectModal.open(),
                      type: "button",
                      children: MESSAGE.Form.Button.ConnectWallet,
                    })}
                size="swap"
                submit
              />
            </div>
          </Container>
        </TabView>
      </form>
      <WarningModal {...warningModal} />
    </Wrapper>
  )
}

export default SwapForm
