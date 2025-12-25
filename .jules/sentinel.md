## 2024-05-22 - [SSRF via Headless Browser]
**Vulnerability:** The server passed raw, unsanitized HTML input directly to `puppeteer.page.setContent()`.
**Learning:** Even server-side headless browsers are vulnerable to XSS and SSRF if they render untrusted content. Attackers could use `<script>` or `<iframe src="file:///">` to access local files or internal networks.
**Prevention:** Always sanitize HTML input destined for a headless browser using a library like `sanitize-html`. Explicitly whitelist allowed schemes (e.g., `http`, `https`, `data`) and block `file` or `javascript` schemes.
