import { Event, TxInfo, TxLog } from "@terra-money/terra.js"

interface FeeAmount {
  amount: string
  denom: string
}

interface SwapAttribute extends EventKV {
  key: string
  value: string
}