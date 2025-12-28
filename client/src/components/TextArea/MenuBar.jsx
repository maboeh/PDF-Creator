import "./../../styles/menuBar.css"

const MenuBar = ({ editor }) => {
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
          aria-pressed={editor.isActive("bold")}
          title="Fett (Ctrl+B)"
        >
          𝐁
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          aria-pressed={editor.isActive("italic")}
          title="Kursiv (Ctrl+I)"
        >
          𝐼
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          aria-pressed={editor.isActive("strike")}
          title="Durchgestrichen (Ctrl+Shift+S)"
        >
          S̶
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
          aria-pressed={editor.isActive("underline")}
          title="Unterstrichen"
        >
          U̲
        </button>
        <span className="menu-separator">|</span>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
          title="Linksbündig"
        >
          ⬅
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
          title="Zentriert"
        >
          ⬌
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
          title="Rechtsbündig"
        >
          ➡
        </button>
        <span className="menu-separator">|</span>
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setMark("textStyle", { fontFamily: e.target.value }).run()
            }
          }}
          defaultValue=""
          title="Schriftart"
          style={{ marginRight: "4px" }}
        >
          <option value="" disabled>Schriftart</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run()
            }
          }}
          defaultValue=""
          title="Schriftgröße"
        >
          <option value="" disabled>Größe</option>
          <option value="10px">10</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>
        <span className="menu-separator">|</span>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
          aria-pressed={editor.isActive("code")}
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
          aria-pressed={editor.isActive("paragraph")}
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
          aria-pressed={editor.isActive("heading", { level: 1 })}
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
          aria-pressed={editor.isActive("heading", { level: 2 })}
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
          aria-pressed={editor.isActive("heading", { level: 3 })}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          aria-pressed={editor.isActive("bulletList")}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          aria-pressed={editor.isActive("orderedList")}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
          aria-pressed={editor.isActive("codeBlock")}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          aria-pressed={editor.isActive("blockquote")}
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
          aria-pressed={editor.isActive("textStyle", { color: "#958DF1" })}
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
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                Add row after
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                Delete table
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().mergeCells().run()}
              >
                Merge cells
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().splitCell().run()}
              >
                Split cell
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
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
                className="dropdown-item"
                href="#"
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                Toggle header row
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
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
