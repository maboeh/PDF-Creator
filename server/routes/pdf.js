const express = require("express")
const router = express.Router()
const puppeteer = require("puppeteer")

router.post("/export-pdf", async (req, res) => {
  try {
    // Extract HTML content from the request
    const { htmlContent } = req.body

    if (!htmlContent) {
      return res.status(400).json({ error: "No HTML content provided" })
    }

    // Start browser with Puppeteer
    const browser = await puppeteer.launch({ headless: "new" })
    const page = await browser.newPage()

    // Load HTML content to the page
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    })

    await browser.close()

    // Send PDF for download
    res.contentType("application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf")
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Error creating PDF:", error)
    res.status(500).json({ error: "Error creating PDF" })
  }
})

module.exports = router
