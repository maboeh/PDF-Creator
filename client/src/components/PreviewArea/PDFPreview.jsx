import { useEffect, useState } from "react"
import "./../../styles/PDFPreview.css"
import DOMPurify from "dompurify"

const PdfPreview = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState("")

  useEffect(() => {
    if (!content) {
      setHtmlContent("")
      return
    }

    // Erweiterte DOMPurify-Konfiguration für Markdown-generiertes HTML
    DOMPurify.addHook("beforeSanitizeAttributes", function (node) {
      // Styles für Tabellen
      if (node.nodeName === "TABLE") {
        node.setAttribute("border", "1")
        node.setAttribute(
          "style",
          "border-collapse: collapse; width: 100%; margin-bottom: 1em;"
        )
      }
      if (node.nodeName === "TD" || node.nodeName === "TH") {
        node.setAttribute("style", "border: 1px solid #dee2e6; padding: 8px;")
      }

      // Styles für Code-Blöcke aus Markdown
      if (node.nodeName === "PRE") {
        node.setAttribute(
          "style",
          "background-color: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto;"
        )
      }
      if (node.nodeName === "CODE") {
        node.setAttribute(
          "style",
          "font-family: monospace; background-color: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px;"
        )
      }

      // Styles für Überschriften
      if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.nodeName)) {
        node.setAttribute(
          "style",
          "margin-top: 1em; margin-bottom: 0.5em; font-weight: bold;"
        )
      }

      // Styles für Blockquotes
      if (node.nodeName === "BLOCKQUOTE") {
        node.setAttribute(
          "style",
          "border-left: 4px solid #ccc; margin: 1em 0; padding-left: 1em; color: #666;"
        )
      }
    })

    const sanitizedContent = DOMPurify.sanitize(content, {
      ADD_TAGS: [
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "colgroup",
        "col",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "pre",
        "code",
        "em",
        "strong",
        "del",
        "sup",
        "sub",
        "br",
        "hr",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "figure",
        "figcaption",
        "span",
        "div",
        "p",
      ],
      ADD_ATTR: [
        "colspan",
        "rowspan",
        "style",
        "border",
        "cellpadding",
        "cellspacing",
        "width",
        "height",
        "class",
        "id",
        "src",
        "href",
        "alt",
        "title",
        "target",
        "rel",
        "color",
        "bgcolor",
      ],
      FORBID_TAGS: ["script", "iframe", "form", "input", "button"],
      FORBID_ATTR: ["onerror", "onload", "onclick"],
      ALLOW_DATA_ATTR: true,
    })

    console.log(
      "Sanitized content:",
      sanitizedContent.substring(0, 200) + "..."
    )
    setHtmlContent(sanitizedContent)
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
