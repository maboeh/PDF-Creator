const express = require("express")
const router = express.Router()
const puppeteer = require("puppeteer")

router.post("/export-pdf", async (req, res) => {
  console.log("--- PDF EXPORT ROUTE HIT ---")
  try {
    // Extract HTML content from the request
    const { htmlContent } = req.body

    console.log("Received HTML content for PDF export:", htmlContent)

    if (!htmlContent) {
      console.log("--- NO HTML CONTENT PROVIDED ---")
      return res.status(400).json({ error: "No HTML content provided" })
    }

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
        body { font-family: Arial, sans-serif; line-height: 1.6; } /* Vorhandenes CSS für den Body */
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

        /* --- NEUE CSS-REGELN FÜR SEITENUMBRÜCHE --- */
        p, div {
          page-break-inside: avoid; /* Versucht, Absätze und Divs nicht zu zerschneiden */
        }
        /* Du könntest hier spezifischere Selektoren verwenden, 
           z.B. für bestimmte Klassen, die dein Rich-Text-Editor generiert */
      `,
    })

    // Wait to ensure rendering is complete
    await new Promise((resolve) => setTimeout(resolve, 1000))

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
      scale: 0.975,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
    })

    await browser.close()

    // Send PDF for download
    res.contentType("application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf")
    res.send(pdfBuffer)
  } catch (error) {
    console.error("--- PDF EXPORT ERROR CAUGHT ---")
    console.error("Error Message:", error.message)
    console.error("Error Stack:", error.stack)
    res
      .status(500)
      .json({ error: "Error creating PDF", details: error.message })
  }
})

module.exports = router
