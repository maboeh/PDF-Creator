import ExportButton from "./ExportButton"
import NewDocButton from "./newDocButton"

const HeaderArea = ({ content, handleClearContent }) => {
  return (
    <div>
      {" "}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Text to PDF Converter</h2>
        <div className="d-flex justify-content-end">
          <NewDocButton handleClearContent={handleClearContent} />
          <ExportButton content={content} />
        </div>
      </div>
    </div>
  )
}

export default HeaderArea
