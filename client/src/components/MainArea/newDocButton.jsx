const NewDocButton = ({ handleClearContent }) => {
  const handleClick = () => {
    if (
      window.confirm(
        "Are you sure you want to create a new document? All unsaved changes will be lost."
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
        onClick={handleClick}
        aria-label="Create new document"
        title="Create a new blank document"
      >
        New Document
      </button>
    </div>
  )
}

export default NewDocButton
