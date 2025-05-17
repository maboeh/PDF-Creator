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

    // Debug: Log table presence
    console.log(
      "Received HTML content includes table:",
      htmlContent.includes("<table")
    )

    // Start browser with Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    const page = await browser.newPage()

    // Set content with more waiting options
    await page.setContent(htmlContent, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    })

    // Additional styling injection to ensure tables are visible
    await page.addStyleTag({
      content: `
        table { 
          border-collapse: collapse; 
          width: 100%; 
          margin-bottom: 20px;
          border: 2px solid black !important;
        }
        th, td { 
          border: 1px solid black !important; 
          padding: 8px; 
          text-align: left;
        }
        th { 
          background-color: #f2f2f2; 
        }
      `,
    })

    // Wait to ensure rendering is complete
    await page.waitForTimeout(1000)

    // Generate PDF with more options
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      preferCSSPageSize: false,
      displayHeaderFooter: false,
    })

    await browser.close()

    // Send PDF for download
    res.contentType("application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf")
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Error creating PDF:", error)
    res
      .status(500)
      .json({ error: "Error creating PDF", details: error.message })
  }
})

module.exports = router
