import { useState, useMemo, ReactElement, useEffect } from "react"
import styled from "styled-components"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

import useDashboardAPI from "rest/useDashboardAPI"
import { formatMoney, lookup } from "libs/parse"

import Chart from "components/Chart"
import Card from "components/Card"
import List from "components/List"
import Input from "components/Input"
import Table from "components/Table"
import AssetIcon from "components/AssetIcon"
import Select from "components/Select"
import container from "components/Container"

import Summary from "./Summary"
import LatestBlock from "components/LatestBlock"
import Tooltip from "components/Tooltip"
import Loading from "components/Loading"
import { USDC } from "constants/constants"

import About_website from "components/About_website"



const Wrapper = styled(container)`
  width: 100%;
  height: auto;
  position: relative;
  color: ${({ theme }) => theme.primary};
  z-index: 1;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Row = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: space-between;

  & > div {
    flex: 1;
  }

  .left {
    width: 1vw;
    float: left;
    margin-right: 10px;
  }
  .right {
    width: 1vw;
    float: right;
    margin-left: 10px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    gap: unset;

    & > div {
      flex: unset;
      margin-bottom: unset;
    }

    .left {
      width: 100%;
      float: left;
      margin: unset;
    }

    .right {
      width: 100%;
      float: left;
      margin-left: 0px;
      margin-top: 20px;
    }
  }
`

const Footer = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & span {
    opacity: 0.7;
    font-family: OpenSans;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    flex-direction: column;
    justify-content: center;
  }
`

const Dashboard = () => {
  const navigate = useNavigate()
  const { api } = useDashboardAPI()
  const { data: recent } = useQuery("recent", api.terraswap.getRecent)
  const { data: pairs, isLoading: isPairsLoading } = useQuery(
    "pairs",
    api.pairs.list
  )
  const { data: chart } = useQuery("terraswap", async () => {
    const now = Date.now()
    const fromDate = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const res = await api.terraswap.getChartData({
      unit: "day",
      from: fromDate.toISOString().split("T")[0],
      to: new Date(now).toISOString().split("T")[0],
    })

    return res
  })
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedVolumeLength, setSelectedVolumeLength] = useState(7)
  const [selectedLiquidityLength, setSelectedLiquidityLength] = useState(7)

  const [tableVisibleFlag, setTableVisibleFlag] = useState(false)
  const [autoRefreshTicker, setAutoRefreshTicker] = useState(false)

  let [currentSupply, setCurrentSupply] = useState(0)
  let [currentPrice, setCurrentPrice] = useState(0)
  let [currentReserve, setCurrentReserve] = useState(0)
  let [taxCollected, setTaxCollected] = useState(0)
  let [luna1Price, setLuna1Price] = useState(0)
  let [luna2Price, setLuna2Price] = useState(0)

  /*useEffect(() => {
    const timerId = setTimeout(() => {
      setTableVisibleFlag(true)
    }, 1000)
    return () => {
      clearTimeout(timerId)
    }
  }, [])*/

  useEffect(() => {
    const timerId = setInterval(() => {
      if (
        window?.navigator?.onLine &&
        window?.document?.hasFocus()
      ) {
        setAutoRefreshTicker((current) => !current)
      }
    }, 30000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  useEffect(() => {
    const url =
      "https://phoenix-lcd.terra.dev/cosmwasm/wasm/v1/contract/terra1ulr678u52qwt27dsgxrftthq20a8v8t9s8f3hz5z8s62wsu6rslqyezul4/smart/eyJjdXJ2ZV9pbmZvIjp7fX0="
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const tbcData = JSON.parse(text)
        setCurrentSupply(Number(tbcData.data.supply) / 1000000)
        setCurrentPrice(Number(tbcData.data.spot_price))
        setCurrentReserve(Number(tbcData.data.reserve) / 1000000)
        setTaxCollected(Number(tbcData.data.tax_collected) / 1000000)
      })

      const url2 =
        "https://api.coingecko.com/api/v3/simple/price?ids=terra-luna-2&vs_currencies=usd"
      fetch(url2)
        .then((response) => response.text())
        .then((text) => {
          console.log(text)
          const apiCoinGeckoLuna = JSON.parse(text)
          setLuna2Price(Number(apiCoinGeckoLuna["terra-luna-2"]["usd"]))     
        })

      const url3 =
          "https://api.coingecko.com/api/v3/simple/price?ids=terra-luna&vs_currencies=usd"
        fetch(url3)
          .then((response) => response.text())
          .then((text) => {
            console.log(text)
            const apiCoinGeckoLunc = JSON.parse(text)
            setLuna1Price(Number(apiCoinGeckoLunc["terra-luna"]["usd"]))    
      })
    return
  }, [autoRefreshTicker])

  const selectedVolumeChart = useMemo(() => {
    return (chart || []).slice(0, selectedVolumeLength)
  }, [chart, selectedVolumeLength])

  const selectedLiquidityChart = useMemo(() => {
    return (chart || []).slice(0, selectedLiquidityLength)
  }, [chart, selectedLiquidityLength])

  const topLiquidity = useMemo(() => {
    return pairs
      ?.sort((a, b) => Number(b.liquidityUst) - Number(a.liquidityUst))
      .slice(0, 5)
  }, [pairs])

  const topTrading = useMemo(() => {
    return pairs
      ?.sort((a, b) => Number(b.volumeUst) - Number(a.volumeUst))
      .slice(0, 5)
  }, [pairs])

  const restLiquidityUst = useMemo(() => {
    return (
      pairs
        ?.sort((a, b) => Number(b.liquidityUst) - Number(a.liquidityUst))
        .slice(6)
        .reduce((prev, current) => {
          return prev + Number(current.liquidityUst)
        }, 0) || 0
    )
  }, [pairs])

  const restTradingUst = useMemo(() => {
    return (
      pairs
        ?.sort((a, b) => Number(b.volumeUst) - Number(a.volumeUst))
        .slice(6)
        .reduce((prev, current) => {
          return prev + Number(current.volumeUst)
        }, 0) || 0
    )
  }, [pairs])

  return (
    <Wrapper>
      <Container>
        <Summary
          data={[
            {
              label: "LBUN / LUNC",
              //value: recent?.daily?.volume
              //  ? `${lookup(recent?.daily?.volume, USDC)}`
              //  : "",
              value: ((currentPrice * 0.25 * luna2Price)/luna1Price).toString(),
              isCurrency: false,
              decimals: 6,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.daily?.volumeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
            {
              label: "LBUN / USD",
              //value: recent?.daily?.volume
              //  ? `${lookup(recent?.daily?.volume, USDC)}`
              //  : "",
              value: (currentPrice * luna2Price).toString(),
              isCurrency: true,
              decimals: 2,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.daily?.volumeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
            {
              label: "Circulating Supply",
              //value: recent?.weekly?.volume
              //  ? `${lookup(recent?.weekly?.volume, USDC)}`
              //  : "",
              value: `${currentSupply}`,
              isCurrency: false,
              decimals: 6,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.weekly?.volumeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
            {
              label: "Market Cap",
              //value: recent?.weekly?.volume
              //  ? `${lookup(recent?.weekly?.volume, USDC)}`
              //  : "",
              value: (currentSupply * currentPrice * luna2Price).toString(),
              isCurrency: true,
              decimals: 2,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.weekly?.volumeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
 
          ]}
        />

      <Summary
          data={[
            {
              label: "Dev Donations",
              //value: recent?.daily?.fee
              //  ? `${lookup(recent?.daily?.fee, USDC)}`
              //  : "",
              value: (taxCollected * 0.25 * luna2Price).toString(),
              isCurrency: true,
              decimals: 2,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.daily?.feeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
            {
              label: "LUNC Burned",
              //value: recent?.daily?.fee
              //  ? `${lookup(recent?.daily?.fee, USDC)}`
              //  : "",
              value: ((taxCollected * 0.25 * luna2Price)/luna1Price).toString(),
              isCurrency: false,
              decimals: 4,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.daily?.liquidityIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
            {
              label: "Raffle Winnings",
              //value: recent?.daily?.liquidity
              //  ? `${lookup(recent?.daily?.liquidity, USDC)}`
              //  : "",
              value: (taxCollected * 0.25 * luna2Price).toString(),
              isCurrency: true,
              decimals: 2,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.daily?.liquidityIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
            {
              label: "Tax Collected",
              //value: recent?.daily?.liquidity
              //  ? `${lookup(recent?.daily?.liquidity, USDC)}`
              //  : "",
              value: `${taxCollected * luna2Price}`,
              isCurrency: true,
              decimals: 2,
              /*variation: parseFloat(
                (
                  parseFloat(recent?.daily?.liquidityIncreasedRate || "0") * 100
                ).toFixed(2)
              ),*/
            },
          ]}
        />
     {/*}   <Row>
          <Card className="left">
            <Row
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "unset", fontSize: 18, color: "#0d0d2b" }}>
                <b>LBUN Price</b>
              </div>
              <div style={{ flex: "unset"}}>
                <Select
                  value={selectedVolumeLength}
                  onChange={(e) =>
                    setSelectedVolumeLength(parseInt(e?.target?.value, 10))
                  }
                >
                  {[30, 15, 7].map((value) => (
                    <option key={value} value={value}>
                      {value} days
                    </option>
                  ))}
                </Select>
              </div>
            </Row>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: "#0d0d2b" }}>
              {formatMoney(
                Number(
                  lookup(
                    selectedVolumeChart.reduce((prev, current) => {
                      return prev + parseInt(current.volumeUst, 10)
                    }, 0),
                    USDC
                  )
                )
              )}
              &nbsp;USDC
            </div>
            <Chart
              type="line"
              height={178}
              data={selectedVolumeChart?.map((volume) => {
                return {
                  t: new Date(volume.timestamp),
                  y: Number(lookup(volume.volumeUst, USDC)),
                }
              })}
            />
          </Card>
          <Card className="right">
            <Row
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "unset", fontSize: 18, color: "#0d0d2b"  }}>
                <b>Total Liquidity</b>
              </div>
              <div style={{ flex: "unset" }}>
                <Select
                  value={selectedLiquidityLength}
                  onChange={(e) =>
                    setSelectedLiquidityLength(parseInt(e?.target?.value, 10))
                  }
                >
                  {[30, 15, 7].map((value) => (
                    <option key={value} value={value}>
                      {value} days
                    </option>
                  ))}
                </Select>
              </div>
            </Row>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: "#0d0d2b" }}>
              {formatMoney(
                Number(
                  lookup(
                    selectedVolumeChart.reduce((prev, current) => {
                      return prev + parseInt(current.volumeUst, 10)
                    }, 0),
                    USDC
                  )
                )
              )}
              &nbsp;USDC
            </div>
            <Chart
              type="line"
              height={178}
              data={selectedLiquidityChart?.map((liquidity) => {
                return {
                  t: new Date(liquidity.timestamp),
                  y: Number(lookup(liquidity.liquidityUst, USDC)),
                }
              })}
            />
          </Card>
        </Row>      Uncomment to see charts*/}

        <About_website></About_website>

        <Footer>
          <LatestBlock
            currentHeight={recent?.daily?.height || 0}
            isLoading={!recent?.daily?.height}
          />
          <span>
            DASHBOARD IS FOR REFERENCE PURPOSES ONLY AND DOES NOT REPRESENT
          </span>
        </Footer>
      </Container>
    </Wrapper>
  )
}

export default Dashboard
