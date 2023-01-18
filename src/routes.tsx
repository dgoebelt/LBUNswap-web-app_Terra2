import Dashboard from "pages/Dashboard"
import PairPage from "pages/Dashboard/Pair"
import { Route, Routes, Navigate } from "react-router-dom"
import Swap from "./pages/Swap"
import Whitepaper from "./pages/Whitepaper"

export default () => (
  <Routes>
    <Route index element={<Dashboard />} />
    <Route path="/pairs/:address" element={<PairPage />} />
    <Route path="/swap" element={<Swap />} />
    {/*<Route path="/whitepaper" element={"/WP_v3_LBUN.pdf"}/>*/}
    <Route path="/whitepaper" element={<Whitepaper />}/>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
