const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
const pdfRoutes = require("./routes/pdf")

// Middleware für JSON-Parsing
app.use(express.json())
// Middleware für CORS
app.use(cors())

app.get("/", (req, res) => {
  res.send("Express läuft! Startseite gefunden.")
})

// PDF-Routen einbinden
app.use("/api", pdfRoutes)

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`)
})
