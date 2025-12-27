const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const sanitizeHtml = require("sanitize-html")

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "span",
    "div",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "u",
    "s",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "br",
    "p",
    "strong",
    "em",
    "blockquote",
    "code",
    "pre",
    "ul",
    "ol",
    "li",
  ]),
  allowedAttributes: {
    "*": ["style", "class", "id", "align"],
    a: ["href", "name", "target"],
    img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
    table: ["border", "cellpadding", "cellspacing"],
    td: ["colspan", "rowspan", "width", "height"],
    th: ["colspan", "rowspan", "width", "height"],
  },
  allowedSchemes: ["http", "https", "data", "mailto"],
}

const cleanHtml = (dirty) => {
  return sanitizeHtml(dirty, sanitizeOptions)
}

// --- Optimization: Cache CSS ---
const editorCssPath = path.join(
  __dirname,
  "../../client/src/styles/richTextEditor.css"
)
// Lazily load CSS or load at startup. We'll load lazily but cache it.
let cachedEditorCss = null
function getEditorCss() {
  if (!cachedEditorCss) {
    try {
      cachedEditorCss = fs.readFileSync(editorCssPath, "utf8")
    } catch (err) {
      console.error("Failed to read editor CSS:", err)
      return "" // Fallback
    }
  }
  return cachedEditorCss
}

// --- Optimization: Singleton Browser ---
let browserInstance = null

async function getBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance
  }

  console.log("Launching new Puppeteer browser instance...")
  browserInstance = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  // Ensure browser closes on process exit
  const closeBrowser = async () => {
    if (browserInstance) {
      console.log("Closing Puppeteer browser...")
      await browserInstance.close()
      browserInstance = null
    }
  }

  process.once("SIGINT", closeBrowser)
  process.once("SIGTERM", closeBrowser)

  // Listen for disconnection to clear the variable
  browserInstance.on("disconnected", () => {
    console.log("Browser disconnected.")
    if (browserInstance && !browserInstance.isConnected()) {
        browserInstance = null
    }
  })

  return browserInstance
}

router.post("/export-pdf", async (req, res) => {
  console.log("--- PDF EXPORT ROUTE HIT ---")
  let page = null
  try {
    const { htmlContent } = req.body
    console.log("Received HTML content for PDF export:", htmlContent)

    // Security: Sanitize HTML input to prevent XSS and SSRF
    const sanitizedHtml = cleanHtml(htmlContent)

    const editorCss = getEditorCss()

    const browser = await getBrowser()
    page = await browser.newPage()

    try {
      await page.setContent(sanitizedHtml, {
        waitUntil: "domcontentloaded", // Optimization: networkidle0 is too slow
        timeout: 30000,
      })

    await page.addStyleTag({ content: editorCss })

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

    // Optimization: Removed arbitrary 1000ms timeout
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
  } catch (error) {
    console.error("--- PDF EXPORT ERROR CAUGHT ---")
    console.error("Error ID:", Date.now()) // Log an ID to correlate
    console.error("Error Message:", error.message)
    console.error("Error Stack:", error.stack)
    // Security: Do not expose error details to client
    res
      .status(500)
      .json({ error: "Error creating PDF" })
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

    if (!htmlContent || typeof htmlContent !== 'string') {
      console.log("--- INVALID OR MISSING HTML CONTENT FOR PREVIEW ---")
      return res.status(400).json({ error: "Invalid HTML content provided" })
    }

    // Security: Sanitize HTML input to prevent XSS and SSRF
    const sanitizedHtml = cleanHtml(htmlContent)

    const editorCss = getEditorCss()

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
      await page.setContent(sanitizedHtml, {
        waitUntil: "domcontentloaded", // Optimization
        timeout: 30000,
      })

      await page.addStyleTag({ content: editorCss })
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
    // Security: Do not expose error details to client
    res
      .status(500)
      .json({ error: "Error creating PDF preview" })
  } finally {
    if (page) {
      await page.close()
    }
  }
})

module.exports = router
