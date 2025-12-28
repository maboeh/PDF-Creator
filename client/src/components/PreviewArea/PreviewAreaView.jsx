import { lazy, Suspense } from "react"

const PDFPreview = lazy(() => import("./PDFPreview"))

const LoadingSpinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
    <div style={{
      width: "32px",
      height: "32px",
      border: "3px solid #e9ecef",
      borderTop: "3px solid #26B9C8",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
)

const PreviewAreaView = ({ content }) => (
  <div className="card">
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
      style={{ overflowY: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <PDFPreview content={content} />
      </Suspense>
    </div>
  </div>
)

export default PreviewAreaView
