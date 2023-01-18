import { MsgExecuteContract } from "@terra-money/terra.js"
import { useAddress } from "hooks"
import { div, times } from "libs/math"
import { toAmount } from "libs/parse"
import { Type } from "pages/Swap"
import { useEffect, useMemo, useState } from "react"
import { tokenInfos } from "./usePairs"

type Params = {
  from: string
  to: string
  amount: number | string
  type?: Type
  slippageTolerance?: string | number
}

const useTBC = (params: Params) => {
    //console.log(Error('Trace me baby 1...'))
    const walletAddress = useAddress()
    const { from, to, type, amount: _amount, slippageTolerance } = params
    const amount = Number(_amount)
    const debouncedAmount = useDebounce(amount, 500);
    const [isLoading, setIsLoading] = useState(false)
    const [msgs, setMsgs] = useState <(MsgExecuteContract[] | MsgExecuteContract)[]> ([])
    const [autoRefreshTicker, setAutoRefreshTicker] = useState(false)
    const [simulatedAmounts, setSimulatedAmounts] = useState<number[]>([])
    
    // From api to smart contract
    let [currentSupply, setCurrentSupply] = useState(0);
    let [currentPrice, setCurrentPrice] = useState(0);
    let [currentReserve, setCurrentReserve] = useState(0);
    let [taxCollected, setTaxCollected] = useState(0);
    let [luna2Price, setLuna2Price] = useState(0)
   

    let currentMarketCap = 0;
    const tokenInfo = tokenInfos.get(to);
    
    // Will calculate new values 
    let tokensToMint = 0;
    let reserveReturned = 0;
    let newMarketCap = 0;
    
    const profitableQuery = useMemo(() => {
    
      let lunaUsdPrice = 0;
      let lunaLbunPrice = 0;
      let coinDeposit = 0;
      let msg = undefined;
      
      let newReserve;
      let newSupply;
      let newPrice;
      let simulatedAmount;
      let rate;

      setIsLoading(true);    
      if (!to || !debouncedAmount) {
        return undefined;
      } else if (from === "uluna" ){
          const taxPercentage = .048;
          const k = 0.000001;
          coinDeposit = debouncedAmount * (1 - taxPercentage);

          newReserve = currentReserve + coinDeposit;
          newSupply = ((3 * newReserve) / k) ** (1/3);
          tokensToMint = newSupply - currentSupply;
          newPrice = k * Math.pow(newSupply, 2);
          newMarketCap = newPrice * newSupply;
          simulatedAmount = (tokensToMint * 1000000); //cuz 6 decimals
          rate = coinDeposit/tokensToMint;

          const buyAmount = parseFloat(`${debouncedAmount}`) * 1000000;
          msg = new MsgExecuteContract(
            walletAddress, //sender
            "terra1ulr678u52qwt27dsgxrftthq20a8v8t9s8f3hz5z8s62wsu6rslqyezul4", //LBUN TBC contract
            { "buy":{} }, // execute msg for handle msg
            { uluna: buyAmount.toString()},
          );

      } else if (from === "terra1ulr678u52qwt27dsgxrftthq20a8v8t9s8f3hz5z8s62wsu6rslqyezul4" ){
          const taxPercentage = .048;
          const k = 0.000001;  
          coinDeposit = debouncedAmount;  

          //Don't use spot_price from API, cuz different k value
          currentPrice = k * Math.pow(currentSupply, 2); 
          currentMarketCap = currentPrice * currentSupply;
          currentReserve = (1/3) * currentMarketCap;
          newSupply = currentSupply - coinDeposit; //sending in LBUN
          newPrice = k * Math.pow(newSupply, 2); 
          newMarketCap = newPrice * newSupply;
          newReserve = (1/3) * newMarketCap
          reserveReturned = currentReserve - newReserve;
          reserveReturned = reserveReturned * (1 - taxPercentage);
          simulatedAmount = (reserveReturned * 1000000); //cuz 6 decimals*/
          rate = reserveReturned/coinDeposit;

          //Tried to use newReserve = (k * Math.pow(newSupply,3))/3 above,
          //but newReserve was higher than it should be
 
          const burnAmount = parseFloat(`${coinDeposit}`) * 1000000;
          msg = new MsgExecuteContract(
            walletAddress, //sender
            "terra1ulr678u52qwt27dsgxrftthq20a8v8t9s8f3hz5z8s62wsu6rslqyezul4", //LBUN TBC contract
            { "burn":{"amount": burnAmount.toString()}} , // execute msg for handle msg
           );


      } else {
        return undefined;
    }
    
    
    lunaUsdPrice = luna2Price
    lunaLbunPrice = 1/rate

    const tokenRoutes: string[] = []
    setIsLoading(false)
    return {
        msg,
        lunaUsdPrice,
        lunaLbunPrice: lunaLbunPrice.toString(),
        simulatedAmount,
        tokenRoutes,
        price: rate.toString()
    }
  }, [to, debouncedAmount, msgs, simulatedAmounts, autoRefreshTicker]) //end of useMemo


  useEffect(() => {
    const url = 'https://phoenix-lcd.terra.dev/cosmwasm/wasm/v1/contract/terra1ulr678u52qwt27dsgxrftthq20a8v8t9s8f3hz5z8s62wsu6rslqyezul4/smart/eyJjdXJ2ZV9pbmZvIjp7fX0='
    fetch(url)
        .then(response => response.text())
        .then(text => {
            console.log(text);
            const tbcData = JSON.parse(text);
            setCurrentSupply(Number(tbcData.data.supply)/1000000);
            setCurrentPrice(Number(tbcData.data.spot_price));
            setCurrentReserve(Number(tbcData.data.reserve)/1000000);
            setTaxCollected(Number(tbcData.data.tax_collected)/1000000);
        })
        
      const url2 ="https://api.coingecko.com/api/v3/simple/price?ids=terra-luna-2&vs_currencies=usd"
      fetch(url2)
        .then((response) => response.text())
        .then((text) => {
          console.log(text)
          const apiCoinGeckoLuna = JSON.parse(text)
          setLuna2Price(Number(apiCoinGeckoLuna["terra-luna-2"]["usd"]))     
        })
    return
  }, [debouncedAmount, from, to, type, isLoading]) 


  useEffect(() => {
    const timerId = setInterval(() => {
 
  setAutoRefreshTicker((current) => !current)

    }, 30000)
    return () => {
      clearInterval(timerId)
    }
  //}, [amount, from, to, type, isLoading]) rbh 
  }, [debouncedAmount, from])  


    const result = useMemo(() => {
        if (!from || !to || !type || !debouncedAmount) {
          return { profitableQuery: undefined, isLoading: false }
        }
        return {
          isLoading,
          profitableQuery,
        }
      }, [debouncedAmount, from, isLoading, profitableQuery, to, type])
    
      return result   

}

// Generic deBounce Hook ( https://usehooks.com/useDebounce/ )
function useDebounce(value: number, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}



export default useTBC