## 2024-05-23 - Confirmation Dialogs for Destructive Actions
**Learning:** Users can easily lose work if "Clear" or "New" actions don't have confirmation dialogs.
**Action:** Always wrap destructive actions like `handleClearContent` with a confirmation step (e.g., `window.confirm` or a modal).

## 2025-12-25 - Feedback for Async File Operations
**Learning:** File system API operations (like `showOpenFilePicker`) pause execution, but processing large files afterwards can cause a UI freeze without feedback.
**Action:** Always implement a loading state that triggers *after* the user selection but *before* heavy processing (reading/parsing) begins. Use `aria-busy` to communicate this state.
