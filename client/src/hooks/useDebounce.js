import { useEffect, useState, useRef } from "react"

/**
 * Dynamic debounce delay based on content length
 */
const calculateDelay = (value) => {
  const len = typeof value === "string" ? value.length : 0
  if (len < 500) return 300
  if (len < 2000) return 500
  if (len < 5000) return 1000
  return 1500
}

/**
 * useDebounce - debounces value with optional dynamic delay
 */
export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      setDebounced(value)
      return
    }

    const effectiveDelay = delay ?? calculateDelay(value)
    const handler = setTimeout(() => setDebounced(value), effectiveDelay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}

export default useDebounce
