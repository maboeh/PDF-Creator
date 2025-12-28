import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

// Mock localStorage
const store = {}
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]) }),
  },
})

beforeEach(() => {
  vi.clearAllMocks()
  Object.keys(store).forEach((k) => delete store[k])
})
