import PDFPreview from "./PDFPreview"

const PreviewAreaView = ({ content }) => {
  return (
    <div>
      <div className="card ">
        <div
          className="card-header"
          style={{
            backgroundColor: "#F5F5F5",
            color: "#333333",
            position: "sticky",
            top: 0,
            zIndex: 1,
            borderTop: "1px solid #dee2e6",
          }}
        >
          Real-time Preview
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <PDFPreview content={content} />
        </div>
      </div>
    </div>
  )
}

export default PreviewAreaView
