import { useCurrentEditor } from "@tiptap/react"
import "./../../styles/menuBar.css"

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }
  return (
    <div>
      <div className="tiptap-menu">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          Paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          Redo
        </button>
        <button
          onClick={() => {
            const url = window.prompt("Enter image URL:")
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
        >
          Image
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          Purple
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          Table
        </button>
        <div className="dropdown">
          <button
            className="btn dropdown-toggle"
            data-bs-toggle="dropdown"
            type="button"
          >
            Table Functions
          </button>
          <ul className="dropdown-menu">
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
              >
                Add column before
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                Add column after
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().addRowBefore().run()}
              >
                Add row before
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                Add row after
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                Delete table
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().mergeCells().run()}
              >
                Merge cells
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().splitCell().run()}
              >
                Split cell
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                onClick={() =>
                  editor.chain().focus().toggleHeaderColumn().run()
                }
              >
                Toggle header column
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                Toggle header row
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
              >
                Toggle header cell
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() =>
                  editor.chain().focus().setCellAttribute("colspan", 2).run()
                }
              >
                Set Cell Attribute
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().fixTables().run()}
              >
                Fix Tables
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().goToNextCell().run()}
              >
                Go to Next Cell
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().goToPreviousCell().run()}
              >
                Go to Previous Cell
              </a>
            </li>
          </ul>
        </div>

        <button onClick={() => editor.chain().focus().deleteColumn().run()}>
          Delete column
        </button>
        <button onClick={() => editor.chain().focus().deleteRow().run()}>
          Delete row
        </button>
        <button onClick={() => editor.chain().focus().mergeOrSplit().run()}>
          Merge or split
        </button>
      </div>
    </div>
  )
}

export default MenuBar
