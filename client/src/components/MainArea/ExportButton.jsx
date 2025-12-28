import { useState } from "react"
import { API_ENDPOINTS } from "../../config/api"

const ExportButton = ({ content }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleExport = async () => {
    if (!content || content === "<p></p>") {
      setError("Bitte fügen Sie zuerst Inhalt hinzu")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      if (!window.showSaveFilePicker) {
        throw new Error("Browser unterstützt diese Funktion nicht")
      }

      const file = await window.showSaveFilePicker({
        suggestedName: `dokument-${new Date().toISOString().split("T")[0]}.pdf`,
        types: [{ description: "PDF File", accept: { "application/pdf": [".pdf"] } }],
      })

      const completeHtml = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `

      const response = await fetch(API_ENDPOINTS.EXPORT_PDF, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: completeHtml }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Export fehlgeschlagen")
      }

      const pdfBlob = await response.blob()
      const writable = await file.createWritable()
      await writable.write(pdfBlob)
      await writable.close()
    } catch (err) {
      if (err.name === "AbortError") return
      console.error("Export error:", err)
      setError(err.message || "Fehler beim Export")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="d-inline-block">
      <button
        className="btn mt-3 me-3"
        style={{
          backgroundColor: isLoading ? "#ccc" : "#26B9C8",
          borderColor: isLoading ? "#ccc" : "#26B9C8",
          color: "#FFFFFF",
        }}
        disabled={isLoading}
        onClick={handleExport}
      >
        {isLoading ? "Exportiert..." : "Export PDF"}
      </button>
      {error && (
        <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default ExportButton
