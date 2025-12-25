# Bolt's Journal

## 2024-05-22 - [Singleton Puppeteer]
**Learning:** The memory stated that the server *already* uses a singleton Puppeteer instance, but code inspection revealed it launches a new browser for every request.
**Action:** Always verify "known facts" against the actual code. Assumptions are the enemy of optimization.
