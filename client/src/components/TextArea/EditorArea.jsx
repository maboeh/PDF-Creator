import RichTextEditor from "./richTextEditor"
import UploadButton from "./uploadButton"

const EditorArea = ({ content, handleContentChange }) => {
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
              Texteditor
            </div>
            <div className="card-body p-0">
              <RichTextEditor
                content={content}
                handleContentChange={handleContentChange}
              />
            </div>

            <div className=" text-end" style={{ backgroundColor: "#FFFFFF" }}>
              <UploadButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorArea
