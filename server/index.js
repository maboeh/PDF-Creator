const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const cors = require("cors")
const pdfRoutes = require("./routes/pdf")
const { generalLimiter } = require("./middleware/rateLimiter")

// Middleware für JSON-Parsing mit Größenlimit
app.use(express.json({ limit: "2mb" }))
// Middleware für CORS
app.use(cors())
// Rate Limiting für alle Routen
app.use(generalLimiter)

app.get("/", (req, res) => {
  res.send("Express läuft! Startseite gefunden.")
})

// PDF-Routen einbinden
app.use("/api", pdfRoutes)

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`)
})
