import RichTextEditor from "./richTextEditor"
import UploadButton from "./uploadButton"
import { useState } from "react"

const EditorArea = ({ content, handleContentChange }) => {
  const [editorInstance, setEditorInstance] = useState(null)

  const handleTextUpload = (fileContent, fileType) => {
    if (!editorInstance) return

    console.log("Importing content of type:", fileType)

    // Editor fokussieren, damit der Cursor sichtbar ist
    editorInstance.commands.focus()

    // HTML oder Text-Inhalt einfügen
    if (fileType === "text/markdown" || fileType === "text/html") {
      // Bei HTML-Dateien: direkt einfügen
      editorInstance.commands.insertContent(fileContent, {
        parseOptions: {
          preserveWhitespace: "full",
        },
      })
    } else {
      // Normalen Text einfügen
      editorInstance.commands.insertContent(fileContent)
    }

    // Update des Editor-Inhalts erzwingen
    const updatedContent = editorInstance.getHTML()
    handleContentChange({ editor: { getHTML: () => updatedContent } })
  }

  return (
    <div>
      {" "}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div
              className="card-header"
              style={{ backgroundColor: "#F5F5F5", color: "#333333" }}
            >
              Text Editor
            </div>
            <div className="card-body p-0">
              <RichTextEditor
                content={content}
                handleContentChange={handleContentChange}
                onReady={(editor) => setEditorInstance(editor)}
              />
            </div>

            <div className="text-end" style={{ backgroundColor: "#FFFFFF" }}>
              <UploadButton onTextUpload={handleTextUpload} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorArea
