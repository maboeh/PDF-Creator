# Palette's Journal

## 2024-05-21 - Toggle Button Accessibility
**Learning:** Toolbar buttons in `MenuBar.jsx` use visual-only state indication (`.is-active` class) without semantic attributes.
**Action:** Added `aria-pressed` attribute to all toggle buttons to expose state to assistive technologies.
