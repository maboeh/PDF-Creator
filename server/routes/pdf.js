const express = require("express")
const router = express.Router()
const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

// Cache CSS content once at startup
const editorCssPath = path.join(
  __dirname,
  "../../client/src/styles/richTextEditor.css"
)

let editorCss = ""
try {
  editorCss = fs.readFileSync(editorCssPath, "utf8")
} catch (err) {
  console.warn("Warning: Could not read richTextEditor.css at startup", err)
}

// Singleton browser instance
let browserInstance = null

async function getBrowser() {
  if (!browserInstance || !browserInstance.isConnected()) {
    console.log("Launching new Puppeteer browser instance...")
    browserInstance = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  }
  return browserInstance
}

router.post("/export-pdf", async (req, res) => {
  console.log("--- PDF EXPORT ROUTE HIT ---")
  try {
    const { htmlContent } = req.body
    console.log("Received HTML content for PDF export:", htmlContent)

    if (!htmlContent) {
      console.log("--- NO HTML CONTENT PROVIDED ---")
      return res.status(400).json({ error: "No HTML content provided" })
    }

    // Reuse browser instance
    const browser = await getBrowser()
    const page = await browser.newPage()

    try {
      await page.setContent(htmlContent, {
        waitUntil: ["domcontentloaded", "networkidle0"],
        timeout: 30000,
      })

      if (editorCss) {
        await page.addStyleTag({ content: editorCss })
      }

      await page.addStyleTag({
        content: `
          /* --- Basic PDF Reset and Box Sizing --- */
          * {
            box-sizing: border-box !important;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: auto !important; /* Allow content to determine width within PDF margins */
            height: auto !important; /* Allow content to flow naturally */
            min-height: initial !important;
            background: none !important; /* Ensure no body background interferes */
          }

          /* PDF-specific overrides for .ProseMirror and its container (Tiptap wrapper) */
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

          /* --- Removed previous specific overrides for p, h1-h6, table details --- */
          /* Let editorCss handle the primary styling as much as possible */

          /* Temporarily remove page-break-inside: avoid to observe raw breaking behavior */
          /*
          p, div {
            page-break-inside: avoid;
          }
          */
          p, div { /* Re-enable page-break-inside: avoid */
            page-break-inside: avoid;
          }

          /* Base table styling - ensure it doesn't add excessive margins conflicting with editorCss */
          table {
            border-collapse: collapse;
            width: 100%;
            /* margin-bottom: 20px; /* Potentially problematic margin from original overrides - rely on editorCss */
            /* border: 2px solid black !important; /* Let editorCss define table borders */
          }
          th, td {
            /* border: 1px solid black !important; /* Let editorCss define cell borders */
            padding: 8px; /* This can be a sensible default if editorCss doesn't specify */
            text-align: left;
          }
          th {
            /* background-color: #f2f2f2; /* Let editorCss define header background */
          }
        `,
      })

      // Removed unnecessary 1s timeout - networkidle0 handles wait
      // await new Promise((resolve) => setTimeout(resolve, 1000))

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
    } finally {
      // Always close the page to free up memory, but keep browser open
      await page.close()
    }

  } catch (error) {
    console.error("--- PDF EXPORT ERROR CAUGHT ---")
    console.error("Error Message:", error.message)
    console.error("Error Stack:", error.stack)
    res
      .status(500)
      .json({ error: "Error creating PDF", details: error.message })
  }
})

// Neue Route für die PDF-Vorschau Generierung
router.post("/generate-preview-pdf", async (req, res) => {
  console.log("--- PDF PREVIEW ROUTE HIT ---")
  try {
    const { htmlContent } = req.body
    // console.log("Received HTML content for PDF preview:", htmlContent) // Optional: für Debugging

    if (!htmlContent) {
      console.log("--- NO HTML CONTENT PROVIDED FOR PREVIEW ---")
      return res.status(400).json({ error: "No HTML content provided" })
    }

    // Die PDF-spezifischen Inline-Stile, die wir vorher hatten
    // Diese müssen wir hier wieder definieren, da sie nicht mehr in richTextEditor.css sind
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

    const browser = await getBrowser()
    const page = await browser.newPage()

    try {
      await page.setContent(htmlContent, {
        waitUntil: ["domcontentloaded", "networkidle0"],
        timeout: 30000,
      })

      if (editorCss) {
        await page.addStyleTag({ content: editorCss })
      }
      await page.addStyleTag({ content: pdfSpecificStyles })

      // Kurze Wartezeit, um sicherzustellen, dass Stile angewendet werden
      // await new Promise((resolve) => setTimeout(resolve, 1000)) // Kann oft entfernt oder reduziert werden

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
        scale: 1, // Zurückgesetzt auf 1 für den Anfang
        preferCSSPageSize: false, // Wichtig für korrekte A4-Anwendung mit Rändern
        displayHeaderFooter: false,
      })

      res.contentType("application/pdf")
      res.send(pdfBuffer)
    } finally {
      await page.close()
    }
  } catch (error) {
    console.error("--- PDF PREVIEW ERROR CAUGHT ---")
    console.error("Error Message:", error.message)
    console.error("Error Stack:", error.stack)
    res
      .status(500)
      .json({ error: "Error creating PDF preview", details: error.message })
  }
})

module.exports = router
