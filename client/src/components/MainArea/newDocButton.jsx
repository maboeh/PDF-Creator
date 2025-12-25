const NewDocButton = ({ handleClearContent }) => {
  const handleClick = () => {
    if (
      window.confirm(
        "Are you sure you want to create a new document? This will clear your current work.",
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
      >
        New Document
      </button>
    </div>
  )
}

export default NewDocButton
