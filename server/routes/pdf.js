const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const { getBrowser } = require("../utils/browser")

// Read CSS files once at startup to avoid blocking file I/O on every request
const editorCssPath = path.join(
  __dirname,
  "../../client/src/styles/richTextEditor.css"
)
// Ensure CSS file exists and can be read; otherwise fail fast
const editorCss = fs.readFileSync(editorCssPath, "utf8")

const pdfSpecificStyles = `
    * {
      box-sizing: border-box !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: auto !important;
      height: auto !important;
      min-height: initial !important;
      background: none !important;
    }
    .tiptap, .ProseMirror,
    .tiptap .ProseMirror,
    .tiptap > .ProseMirror {
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      background: none !important;
      min-height: initial !important;
      width: auto !important;
      border: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }
    p, div {
      page-break-inside: avoid;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
`

router.post("/export-pdf", async (req, res) => {
  console.log("--- PDF EXPORT ROUTE HIT ---")
  let page = null
  try {
    const { htmlContent } = req.body
    console.log("Received HTML content for PDF export:", htmlContent)

    if (!htmlContent) {
      console.log("--- NO HTML CONTENT PROVIDED ---")
      return res.status(400).json({ error: "No HTML content provided" })
    }

    const browser = await getBrowser()
    page = await browser.newPage()

    await page.setContent(htmlContent, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    })

    await page.addStyleTag({ content: editorCss })
    await page.addStyleTag({ content: pdfSpecificStyles })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      scale: 0.97,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
    })

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
  } finally {
    if (page) {
      await page.close()
    }
  }
})

// Neue Route für die PDF-Vorschau Generierung
router.post("/generate-preview-pdf", async (req, res) => {
  console.log("--- PDF PREVIEW ROUTE HIT ---")
  let page = null
  try {
    const { htmlContent } = req.body

    if (!htmlContent) {
      console.log("--- NO HTML CONTENT PROVIDED FOR PREVIEW ---")
      return res.status(400).json({ error: "No HTML content provided" })
    }

    const browser = await getBrowser()
    page = await browser.newPage()

    await page.setContent(htmlContent, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    })

    await page.addStyleTag({ content: editorCss })
    await page.addStyleTag({ content: pdfSpecificStyles })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      scale: 1,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
    })

    res.contentType("application/pdf")
    res.send(pdfBuffer)
  } catch (error) {
    console.error("--- PDF PREVIEW ERROR CAUGHT ---")
    console.error("Error Message:", error.message)
    console.error("Error Stack:", error.stack)
    res
      .status(500)
      .json({ error: "Error creating PDF preview", details: error.message })
  } finally {
    if (page) {
      await page.close()
    }
  }
})

module.exports = router
