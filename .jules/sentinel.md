## 2024-05-23 - [Sanitizing HTML Input in PDF Generation]
**Vulnerability:** Unsanitized HTML input in Puppeteer PDF generation allowing potential XSS/SSRF.
**Learning:** Even in headless browsers, rendering arbitrary HTML from user input is dangerous as it can execute scripts. `sanitize-html` is crucial for stripping dangerous tags while allowing rich text.
**Prevention:** Always sanitize HTML input before passing it to `page.setContent()` in Puppeteer or any other renderer.
