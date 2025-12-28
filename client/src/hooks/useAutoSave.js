/**
 * useAutoSave Hook
 * Auto-saves content to localStorage with debouncing
 */

import { useState, useEffect, useRef, useCallback } from "react"

const STORAGE_KEY = "pdf-app-document"
const AUTO_SAVE_DELAY = 2000

export const useAutoSave = (content, onRestore) => {
  const [lastSaved, setLastSaved] = useState(null)
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false)
  const timeoutRef = useRef(null)
  const initialCheckDone = useRef(false)

  const saveDraft = useCallback((contentToSave) => {
    if (!contentToSave || contentToSave === "<p></p>") return

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          content: contentToSave,
          timestamp: Date.now(),
        })
      )
      setLastSaved(new Date())
      setHasUnsavedDraft(false)
    } catch (err) {
      console.error("Save failed:", err)
    }
  }, [])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setLastSaved(null)
      setHasUnsavedDraft(false)
    } catch (err) {
      console.error("Clear failed:", err)
    }
  }, [])

  const getSavedDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }, [])

  // Check for draft on mount
  useEffect(() => {
    if (initialCheckDone.current) return
    initialCheckDone.current = true

    const draft = getSavedDraft()
    if (draft?.content) {
      setHasUnsavedDraft(true)
      setLastSaved(new Date(draft.timestamp))
      if (onRestore) onRestore(draft)
    }
  }, [getSavedDraft, onRestore])

  // Auto-save with debounce
  useEffect(() => {
    if (!initialCheckDone.current || !content || content === "<p></p>") return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => saveDraft(content), AUTO_SAVE_DELAY)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [content, saveDraft])

  return { lastSaved, hasUnsavedDraft, clearDraft, saveDraft: () => saveDraft(content), getSavedDraft }
}

export default useAutoSave
