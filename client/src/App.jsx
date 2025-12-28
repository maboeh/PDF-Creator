import { useState, useCallback } from "react"
import HeaderArea from "./components/MainArea/HeaderArea"
import Navigation from "./components/MainArea/Navigation"
import EditorArea from "./components/TextArea/EditorArea"
import PreviewAreaView from "./components/PreviewArea/PreviewAreaView"
import ErrorBoundary from "./components/ErrorBoundary"
import DraftRecoveryModal from "./components/DraftRecoveryModal"
import { useAutoSave } from "./hooks/useAutoSave"

function App() {
  const [content, setContent] = useState("")
  const [editorInstance, setEditorInstance] = useState(null)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [pendingDraft, setPendingDraft] = useState(null)

  const handleDraftFound = useCallback((draft) => {
    setPendingDraft(draft)
    setShowRecoveryModal(true)
  }, [])

  const { lastSaved, clearDraft } = useAutoSave(content, handleDraftFound)

  const handleContentChange = useCallback(({ editor }) => {
    setContent(editor.getHTML())
  }, [])

  const handleClearContent = useCallback(() => {
    if (window.confirm("Neues Dokument erstellen? Alle Änderungen werden gelöscht.")) {
      setContent("")
      clearDraft()
      if (editorInstance?.commands) {
        editorInstance.commands.clearContent(true)
      }
    }
  }, [editorInstance, clearDraft])

  const handleRestoreDraft = useCallback(() => {
    if (pendingDraft?.content && editorInstance?.commands) {
      editorInstance.commands.setContent(pendingDraft.content)
      setContent(pendingDraft.content)
    }
    setShowRecoveryModal(false)
    setPendingDraft(null)
  }, [pendingDraft, editorInstance])

  const handleDiscardDraft = useCallback(() => {
    clearDraft()
    setShowRecoveryModal(false)
    setPendingDraft(null)
  }, [clearDraft])

  return (
    <ErrorBoundary>
      <DraftRecoveryModal
        isOpen={showRecoveryModal}
        lastSaved={pendingDraft?.timestamp}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />

      <Navigation />
      <div className="container-fluid px-4" style={{ backgroundColor: "#F5F5F5" }}>
        <HeaderArea
          content={content}
          handleClearContent={handleClearContent}
          lastSaved={lastSaved}
        />

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <ErrorBoundary>
              <EditorArea
                content={content}
                handleContentChange={handleContentChange}
                editorInstance={editorInstance}
                setEditorInstance={setEditorInstance}
              />
            </ErrorBoundary>

            <div className="row">
              <div className="col-12">
                <ErrorBoundary>
                  <PreviewAreaView content={content} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
