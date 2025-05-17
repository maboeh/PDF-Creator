import { useState } from "react"

const ExportButton = ({ content }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    try {
      setIsLoading(true)

      const opts = {
        types: [
          {
            description: "PDF File",
            accept: {
              "application/pdf": [".pdf"],
            },
          },
        ],
      }

      const file = await window.showSaveFilePicker(opts)

      // Erstelle ein vollständiges HTML-Dokument mit Styling für Tabellen
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

      const response = await fetch("http://localhost:3000/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent: completeHtml }),
      })

      if (!response.ok) {
        throw new Error("Error exporting PDF")
      }

      const pdfBlob = await response.blob()

      const writable = await file.createWritable()
      await writable.write(pdfBlob)
      await writable.close()
    } catch (error) {
      console.error("Error exporting PDF:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <button
      className="btn mt-3 me-3"
      style={{
        backgroundColor: "#26B9C8",
        borderColor: "#26B9C8",
        color: "#FFFFFF",
      }}
      disabled={isLoading}
      onClick={handleExport}
    >
      {isLoading ? "Exporting..." : "Export PDF"}
    </button>
  )
}

export default ExportButton
