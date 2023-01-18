import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import styles from "./SwapPage.module.scss"
import styled from "styled-components"

const Wrapper = styled.div`
  width: 70%;
  height: auto;
  position: relative;
`
const WhitePaper = () => {
  const [content, setContent] = useState("")

  useEffect(() => {
    fetch("/LBUN_Paper_Terra2.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
  }, [])

  return (
    <Wrapper>
      <article className={styles.article}>
        <div className="post">
          <ReactMarkdown children={content} />
        </div>
      </article>
    </Wrapper>
  )
}

export default WhitePaper
