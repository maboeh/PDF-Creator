/**
 * Validation Middleware for PDF-App
 * Input validation and size limits
 */

const MAX_CONTENT_SIZE = 1 * 1024 * 1024 // 1MB

/**
 * Validates HTML content for PDF generation
 */
const validateHtmlContent = (req, res, next) => {
  const { htmlContent } = req.body

  if (!htmlContent) {
    return res.status(400).json({
      error: "Validation Error",
      message: "No HTML content provided",
    })
  }

  if (typeof htmlContent !== "string") {
    return res.status(400).json({
      error: "Validation Error",
      message: "HTML content must be a string",
    })
  }

  if (Buffer.byteLength(htmlContent, "utf8") > MAX_CONTENT_SIZE) {
    return res.status(413).json({
      error: "Payload Too Large",
      message: "Content exceeds maximum size of 1MB",
    })
  }

  next()
}

module.exports = {
  validateHtmlContent,
}
