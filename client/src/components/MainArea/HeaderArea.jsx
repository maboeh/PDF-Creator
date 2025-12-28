import ExportButton from "./ExportButton"
import NewDocButton from "./newDocButton"

const HeaderArea = ({ content, handleClearContent, lastSaved }) => {
  const formatTime = (date) =>
    date?.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center gap-3">
        <h2 className="h4 mb-0">Text to PDF Converter</h2>
        {lastSaved && (
          <span
            style={{
              fontSize: "0.8rem",
              color: "#6c757d",
              backgroundColor: "#e9ecef",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            ✓ {formatTime(lastSaved)}
          </span>
        )}
      </div>
      <div className="d-flex">
        <NewDocButton handleClearContent={handleClearContent} />
        <ExportButton content={content} />
      </div>
    </div>
  )
}

export default HeaderArea
