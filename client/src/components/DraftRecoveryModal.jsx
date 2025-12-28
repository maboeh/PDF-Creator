import { useState } from "react"

const DraftRecoveryModal = ({ isOpen, lastSaved, onRestore, onDiscard }) => {
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "Unbekannt"

    const handleRestore = async () => {
        setLoading(true)
        await onRestore()
        setLoading(false)
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    maxWidth: "400px",
                    width: "90%",
                }}
            >
                <h3 style={{ margin: "0 0 12px" }}>📄 Entwurf gefunden</h3>
                <p style={{ color: "#666", marginBottom: "8px" }}>
                    Ein gespeichertes Dokument wurde gefunden.
                </p>
                <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "20px" }}>
                    Zuletzt gespeichert: {formatDate(lastSaved)}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                        onClick={onDiscard}
                        disabled={loading}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            backgroundColor: "white",
                            cursor: "pointer",
                        }}
                    >
                        Verwerfen
                    </button>
                    <button
                        onClick={handleRestore}
                        disabled={loading}
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#26B9C8",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Lädt..." : "Wiederherstellen"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DraftRecoveryModal
