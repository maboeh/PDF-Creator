const express = require("express")
const router = express.Router()
const puppeteer = require("puppeteer")

router.post("/export-pdf", async (req, res) => {
  try {
    // HTML-Inhalt aus der Anfrage extrahieren
    const { htmlContent } = req.body

    if (!htmlContent) {
      return res.status(400).json({ error: "Kein HTML-Inhalt vorhanden" })
    }

    // Browser mit Puppeteer starten
    const browser = await puppeteer.launch({ headless: "new" })
    const page = await browser.newPage()

    // HTML-Inhalt in die Seite laden
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // PDF generieren
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

    // PDF zum Download senden
    res.contentType("application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=dokument.pdf")
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Fehler bei der PDF-Erstellung:", error)
    res.status(500).json({ error: "Fehler bei der PDF-Erstellung" })
  }
})

module.exports = router
