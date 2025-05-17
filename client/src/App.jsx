import PDFPreview from "./components/PreviewArea/PDFPreview"
import { useState } from "react"
import HeaderArea from "./components/MainArea/HeaderArea"
import Navigation from "./components/MainArea/Navigation"
import EditorArea from "./components/TextArea/EditorArea"
import PreviewAreaView from "./components/PreviewArea/PreviewAreaView"

function App() {
  const [content, setContent] = useState("")
  const [editorInstance, setEditorInstance] = useState(null)

  const handleContentChange = ({ editor }) => {
    setContent(editor.getHTML())
  }

  return (
    <>
      {/* Vollbreite Navigationsleiste */}
      <Navigation />
      <div
        className="container-fluid px-4"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        {/* Seitenheader bleibt über die volle Breite */}
        <HeaderArea content={content} />
        {/* Neue Zeile für die Zentrierung */}
        <div className="row justify-content-center">
          {/* Neue Spalte, um die Breite zu begrenzen (ca. 83% auf lg-Screens) */}
          <div className="col-lg-10">
            {/* Editor innerhalb der schmaleren Spalte */}
            <EditorArea
              content={content}
              handleContentChange={handleContentChange}
              editorInstance={editorInstance}
              setEditorInstance={setEditorInstance}
            />
            {/* Vorschau-Zeile ebenfalls innerhalb der schmaleren Spalte */}
            <div className="row">
              <div className="col-12">
                <PreviewAreaView content={content} />
              </div>
            </div>
          </div>{" "}
          {/* Ende col-lg-10 */}
        </div>{" "}
        {/* Ende der zentrierenden Zeile */}
      </div>
    </>
  )
}

export default App
