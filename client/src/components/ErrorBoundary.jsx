import React from "react"

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback

            return (
                <div
                    style={{
                        padding: "20px",
                        margin: "20px",
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffc107",
                        borderRadius: "8px",
                        textAlign: "center",
                    }}
                >
                    <h3 style={{ color: "#856404", marginBottom: "10px" }}>
                        ⚠️ Etwas ist schief gelaufen
                    </h3>
                    <p style={{ color: "#856404", marginBottom: "15px" }}>
                        Ein unerwarteter Fehler ist aufgetreten.
                    </p>
                    <button
                        onClick={this.handleRetry}
                        style={{
                            backgroundColor: "#ffc107",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Erneut versuchen
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
