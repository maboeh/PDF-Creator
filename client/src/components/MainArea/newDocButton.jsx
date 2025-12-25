const NewDocButton = ({ handleClearContent }) => {
  const handleConfirmClear = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the document? This action cannot be undone."
      )
    ) {
      handleClearContent()
    }
  }

  return (
    <div>
      <button
        className="btn mt-3 me-3"
        style={{
          backgroundColor: "#26B9C8",
          borderColor: "#26B9C8",
          color: "#FFFFFF",
        }}
        onClick={handleConfirmClear}
        aria-label="Create new document (clears current content)"
      >
        New Document
      </button>
    </div>
  )
}

export default NewDocButton
