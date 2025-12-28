import { useState } from "react"
import { marked } from "marked"
import mammoth from "mammoth"

const UploadButton = ({ onTextUpload }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    try {
      const opts = {
        types: [
          {
            description: "Text Files",
            accept: {
              "text/plain": [".txt"],
              "text/html": [".html", ".htm"],
              "text/markdown": [".md", ".markdown"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
              "application/msword": [".doc"],
            },
          },
        ],
      }

      const [fileHandle] = await window.showOpenFilePicker(opts)
      setIsLoading(true)
      const file = await fileHandle.getFile()

      // Bestimme den Dateityp anhand der Erweiterung
      const fileType = getFileTypeFromExtension(file.name)
      let fileContent = ""

      // DOC/DOCX-Konvertierung mit mammoth
      if (fileType === "application/docx" || fileType === "application/doc") {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          fileContent = result.value

          // Warnungen ausgeben falls vorhanden
          if (result.messages.length > 0) {
            console.warn("DOCX conversion warnings:", result.messages)
          }
        } catch (docError) {
          console.error("Error converting DOCX:", docError)
          throw new Error("Fehler beim Konvertieren der Word-Datei")
        }
      } else {
        fileContent = await file.text()

        // Konvertiere Markdown zu HTML
        if (fileType === "text/markdown") {
          // Konfiguriere marked für bessere Kompatibilität
          marked.setOptions({
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Füge <br> für Zeilenumbrüche ein
            headerIds: true, // IDs für Überschriften generieren
            mangle: false, // Links nicht verändern
          })

          // Konvertiere Markdown zu HTML
          fileContent = marked.parse(fileContent)
          console.log("Converted Markdown:", fileContent)
        } else if (fileType === "text/plain") {
          // Für Textdateien: Erhalte Zeilenumbrüche
          fileContent = formatPlainText(fileContent)
        }
      }

      if (onTextUpload && typeof onTextUpload === "function") {
        onTextUpload(fileContent, fileType)
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error importing file:", error)
        alert(error.message || "Fehler beim Importieren der Datei")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Helfer-Funktion zur Bestimmung des Dateityps
  const getFileTypeFromExtension = (filename) => {
    const extension = filename.split(".").pop().toLowerCase()
    const typeMap = {
      md: "text/markdown",
      markdown: "text/markdown",
      txt: "text/plain",
      html: "text/html",
      htm: "text/html",
      docx: "application/docx",
      doc: "application/doc",
    }
    return typeMap[extension] || "text/plain"
  }

  // Helfer-Funktion zum Formatieren von Klartext
  const formatPlainText = (text) => {
    return text
      .split("\n")
      .map((line) => (line.trim() ? `<p>${line}</p>` : "<p>&nbsp;</p>"))
      .join("")
  }

  return (
    <button
      onClick={handleImport}
      type="button"
      className="btn me-3 mb-3"
      disabled={isLoading}
      aria-busy={isLoading}
      style={{
        backgroundColor: "#26B9C8",
        borderColor: "#26B9C8",
        color: "#FFFFFF",
      }}
    >
      {isLoading ? "Importiert..." : "Text hochladen"}
    </button>
  )
}

export default UploadButton

