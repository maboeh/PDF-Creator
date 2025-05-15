import { useEffect, useState } from "react"
import "./../../styles/PDFPreview.css"
import DOMPurify from "dompurify"

const PdfPreview = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState("")

  useEffect(() => {
    // Wenn Content vorhanden ist, setze den HTML-Inhalt
    if (content) {
      // Konfiguriere DOMPurify, um Tabellen zu erlauben
      const sanitizedContent = DOMPurify.sanitize(content, {
        ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td"],
        ADD_ATTR: ["colspan", "rowspan"],
      })
      setHtmlContent(sanitizedContent)
    }
  }, [content])

  return (
    <div className="pdf-preview-container">
      <div className="a4-paper">
        <div
          className="a4-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  )
}

export default PdfPreview
