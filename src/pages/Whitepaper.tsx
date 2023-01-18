import React from "react"
import { memo, useEffect } from "react"
import Container from "../components/Container"
import WhitePaper from "../components/PaperPage"

const Whitepaper = () => {

  return (
    <Container>
      <WhitePaper></WhitePaper>
    </Container>
  )
}

export default memo(Whitepaper)
