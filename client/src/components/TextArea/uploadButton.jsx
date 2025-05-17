import { marked } from "marked"

const UploadButton = ({ onTextUpload }) => {
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
            },
          },
        ],
      }

      const [fileHandle] = await window.showOpenFilePicker(opts)
      const file = await fileHandle.getFile()
      let fileContent = await file.text()

      // Bestimme den Dateityp anhand der Erweiterung
      const fileType = getFileTypeFromExtension(file.name)

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

      if (onTextUpload && typeof onTextUpload === "function") {
        onTextUpload(fileContent, fileType)
      }
    } catch (error) {
      console.error("Error importing file:", error)
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
      style={{
        backgroundColor: "#26B9C8",
        borderColor: "#26B9C8",
        color: "#FFFFFF",
      }}
    >
      Upload Text
    </button>
  )
}

export default UploadButton
