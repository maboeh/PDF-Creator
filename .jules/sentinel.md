## 2024-05-23 - [Puppeteer SSRF/XSS Mitigation]
**Vulnerability:** Unsanitized HTML input passed directly to `page.setContent()` in Puppeteer allows for Server-Side XSS and potential SSRF/LFI.
**Learning:** Puppeteer's headless browser executes scripts and loads resources just like a real browser. Even with `--no-sandbox`, it presents a large attack surface if inputs are not trusted.
**Prevention:** Always sanitize HTML input destined for PDF generation using a library like `sanitize-html`. Define a strict allowlist that permits necessary rich-text formatting but blocks active content (scripts, iframes) and dangerous protocols (`file://`, `javascript:`).

## 2024-05-24 - [Information Leakage in Error Responses]
**Vulnerability:** Stack traces and internal error messages were leaked to the client in API responses.
**Learning:** Returning `error.stack` or `error.message` directly in production responses helps attackers understand the backend structure and potential weaknesses.
**Prevention:** Use generic error messages (e.g. "Error creating PDF") for client responses and log the full details only to the server console or logs.
