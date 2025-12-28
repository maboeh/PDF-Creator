import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useAutoSave } from "./useAutoSave"

describe("useAutoSave", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should initialize with null lastSaved", () => {
    const { result } = renderHook(() => useAutoSave("", vi.fn()))
    expect(result.current.lastSaved).toBeNull()
  })

  it("should provide clearDraft function", () => {
    const { result } = renderHook(() => useAutoSave("", vi.fn()))
    expect(typeof result.current.clearDraft).toBe("function")
  })

  it("should call onRestore when draft exists", () => {
    const draft = { content: "<p>Test</p>", timestamp: Date.now() }
    window.localStorage.setItem("pdf-app-document", JSON.stringify(draft))

    const onRestore = vi.fn()
    renderHook(() => useAutoSave("", onRestore))

    expect(onRestore).toHaveBeenCalled()
  })

  it("should save content after debounce delay", async () => {
    const { rerender } = renderHook(
      ({ content }) => useAutoSave(content, vi.fn()),
      { initialProps: { content: "" } }
    )

    rerender({ content: "<p>Test</p>" })

    act(() => { vi.advanceTimersByTime(2500) })

    expect(window.localStorage.getItem("pdf-app-document")).toBeTruthy()
  })

  it("should clear draft from storage", () => {
    window.localStorage.setItem("pdf-app-document", "test")
    const { result } = renderHook(() => useAutoSave("", vi.fn()))

    act(() => { result.current.clearDraft() })

    expect(window.localStorage.getItem("pdf-app-document")).toBeNull()
  })
})
