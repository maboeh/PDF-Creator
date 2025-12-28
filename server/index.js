const express = require("express")
const helmet = require("helmet")
const app = express()
const port = process.env.PORT || 3000
const cors = require("cors")
const pdfRoutes = require("./routes/pdf")
const { generalLimiter } = require("./middleware/rateLimiter")

// Security: Helmet für HTTP-Security-Header
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    }
  },
  crossOriginEmbedderPolicy: false, // Für PDF-Worker
}))

// Middleware für JSON-Parsing mit Größenlimit
app.use(express.json({ limit: "2mb" }))

// Middleware für CORS mit eingeschränkten Origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"]

app.use(cors({
  origin: (origin, callback) => {
    // Erlaube Requests ohne Origin (z.B. mobile Apps, curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("CORS nicht erlaubt"))
    }
  },
  credentials: true
}))

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
