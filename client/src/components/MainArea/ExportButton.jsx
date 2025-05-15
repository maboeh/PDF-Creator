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
      console.log(file)

      const response = await fetch("http://localhost:3000/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent: content }),
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
