## 2024-05-23 - [Puppeteer SSRF/XSS Mitigation]
**Vulnerability:** Unsanitized HTML input passed directly to `page.setContent()` in Puppeteer allows for Server-Side XSS and potential SSRF/LFI.
**Learning:** Puppeteer's headless browser executes scripts and loads resources just like a real browser. Even with `--no-sandbox`, it presents a large attack surface if inputs are not trusted.
**Prevention:** Always sanitize HTML input destined for PDF generation using a library like `sanitize-html`. Define a strict allowlist that permits necessary rich-text formatting but blocks active content (scripts, iframes) and dangerous protocols (`file://`, `javascript:`).
