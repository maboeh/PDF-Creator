import ExportButton from "./ExportButton"

const HeaderArea = ({ content }) => {
  return (
    <div>
      {" "}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Text to PDF Converter</h2>
        <ExportButton content={content} />
      </div>
    </div>
  )
}

export default HeaderArea
