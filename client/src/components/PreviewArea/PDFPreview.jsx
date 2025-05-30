import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "./../../styles/PDFPreview.css"
import DOMPurify from "dompurify"

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`

const PdfPreview = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState("")
  const [pdfData, setPdfData] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Memoize options to prevent unnecessary reloads
  const pdfOptions = useMemo(
    () => ({
      workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    }),
    []
  )

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

  const fetchPdf = useCallback(async () => {
    if (!htmlContent) {
      setPdfData(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setPageNumber(1) // Reset auf Seite 1 bei neuem Inhalt

    try {
      const response = await fetch(
        "http://localhost:3000/api/generate-preview-pdf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ htmlContent }),
        }
      )

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Fehler beim Abrufen des PDFs" }))
        throw new Error(
          errData.details ||
            errData.message ||
            `HTTP-Fehler: ${response.status}`
        )
      }

      const arrayBuffer = await response.arrayBuffer()
      // Store as object with data property for react-pdf
      setPdfData({ data: arrayBuffer })
    } catch (e) {
      console.error("Fehler beim Laden der PDF-Vorschau:", e)
      setError(e.message)
      setPdfData(null)
    } finally {
      setIsLoading(false)
    }
  }, [htmlContent])

  useEffect(() => {
    // Debouncing, um nicht bei jeder Tastenanschlagsänderung ein PDF anzufordern
    const debounceTimeout = setTimeout(fetchPdf, 500) // 500ms Verzögerung

    return () => clearTimeout(debounceTimeout) // Cleanup-Funktion
  }, [fetchPdf])

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages)
  }

  const goToPrevPage = () =>
    setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1))
  const goToNextPage = () =>
    setPageNumber((prevPageNumber) => Math.min(numPages, prevPageNumber + 1))

  if (isLoading) {
    return <div>PDF-Vorschau wird geladen...</div>
  }

  if (error) {
    return (
      <div style={{ color: "red" }}>Fehler bei der PDF-Vorschau: {error}</div>
    )
  }

  if (!pdfData) {
    return <div>Keine Vorschau verfügbar. Bitte Inhalt im Editor eingeben.</div>
  }

  return (
    <div className="pdf-preview-container">
      {/* Navigation Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          gap: "15px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
        }}
      >
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          style={{
            padding: "8px 16px",
            backgroundColor: pageNumber <= 1 ? "#e9ecef" : "#007bff",
            color: pageNumber <= 1 ? "#6c757d" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
          }}
        >
          ← Vorherige
        </button>
        <span
          style={{
            margin: "0 15px",
            fontWeight: "bold",
            fontSize: "16px",
            color: "#495057",
          }}
        >
          Seite {pageNumber} von {numPages || "--"}
        </span>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          style={{
            padding: "8px 16px",
            backgroundColor: pageNumber >= numPages ? "#e9ecef" : "#007bff",
            color: pageNumber >= numPages ? "#6c757d" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: pageNumber >= numPages ? "not-allowed" : "pointer",
          }}
        >
          Nächste →
        </button>
      </div>

      {/* PDF Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          overflow: "auto",
          maxHeight: "calc(80vh - 80px)", // Abzug für Navigation
        }}
      >
        <Document
          file={pdfData}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(e) => {
            console.error("Document load error:", e)
            setError("Fehler beim Laden des Dokuments.")
          }}
          options={pdfOptions}
        >
          <Page
            pageNumber={pageNumber}
            width={600} // Breite der Seite, z.B. 600px oder dynamisch
            renderTextLayer={true} // Ermöglicht Textauswahl
            renderAnnotationLayer={true} // Zeigt Annotationen an
          />
        </Document>
      </div>
    </div>
  )
}

export default PdfPreview
