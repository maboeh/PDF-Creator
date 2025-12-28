import { useState, useEffect, useCallback, createContext, useContext } from "react"
import "./Toast.css"

const ToastContext = createContext(null)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = "success", duration = 3000) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, duration)
    }, [])

    const success = useCallback((message) => showToast(message, "success"), [showToast])
    const error = useCallback((message) => showToast(message, "error"), [showToast])
    const info = useCallback((message) => showToast(message, "info"), [showToast])

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <span className="toast-icon">
                            {toast.type === "success" && "✓"}
                            {toast.type === "error" && "✕"}
                            {toast.type === "info" && "ℹ"}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export default ToastProvider
