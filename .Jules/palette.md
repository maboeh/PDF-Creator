## 2024-05-23 - Confirmation Dialogs for Destructive Actions
**Learning:** Users can easily lose work if "Clear" or "New" actions don't have confirmation dialogs.
**Action:** Always wrap destructive actions like `handleClearContent` with a confirmation step (e.g., `window.confirm` or a modal).
