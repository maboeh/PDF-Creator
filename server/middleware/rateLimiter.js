/**
 * Rate Limiting Configuration for PDF-App
 * Protects API endpoints from abuse and DoS attacks
 */

const rateLimit = require("express-rate-limit")

/**
 * General API rate limiter
 * Allows 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too Many Requests",
    message: "Rate limit exceeded. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * PDF generation rate limiter (stricter)
 * PDF generation is resource-intensive
 */
const pdfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: "Too Many Requests",
    message: "Too many PDF requests. Please wait before generating more.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * PDF export rate limiter (most strict)
 */
const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too Many Requests",
    message: "Too many export requests. Please wait before exporting again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = {
  generalLimiter,
  pdfLimiter,
  exportLimiter,
}
