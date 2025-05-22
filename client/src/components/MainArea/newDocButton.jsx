const NewDocButton = ({ handleClearContent }) => {
  return (
    <div>
      <button
        className="btn mt-3 me-3"
        style={{
          backgroundColor: "#26B9C8",
          borderColor: "#26B9C8",
          color: "#FFFFFF",
        }}
        onClick={handleClearContent}
      >
        New Document
      </button>
    </div>
  )
}

export default NewDocButton
