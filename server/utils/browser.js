const puppeteer = require("puppeteer")

let browserPromise = null

/**
 * Returns a singleton instance of the Puppeteer browser.
 * Launches a new browser if one doesn't exist or is disconnected.
 */
function getBrowser() {
  if (!browserPromise) {
    console.log("Launching new Puppeteer browser instance...")
    browserPromise = puppeteer
      .launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
      .then((browser) => {
        // Reset the promise if the browser disconnects so we can relaunch next time
        browser.on("disconnected", () => {
          console.log("Puppeteer browser disconnected. Resetting promise.")
          browserPromise = null
        })
        return browser
      })
      .catch((err) => {
        console.error("Failed to launch browser:", err)
        browserPromise = null
        throw err
      })
  }
  return browserPromise
}

module.exports = { getBrowser }
