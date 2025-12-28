describe("PDF Creator - Hauptfunktionen", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("sollte die App laden und Editor anzeigen", () => {
    cy.get(".tiptap").should("be.visible")
    cy.get(".tiptap-menu").should("be.visible")
  })

  it("sollte Text im Editor eingeben können", () => {
    cy.get(".ProseMirror").click().type("Hallo Welt! Dies ist ein Testdokument.")
    cy.get(".ProseMirror").should("contain", "Hallo Welt!")
  })

  it("sollte Formatierungs-Buttons haben", () => {
    // Check für die neuen PRD-Features
    cy.get(".tiptap-menu button").should("have.length.greaterThan", 10)
    
    // Prüfe Keyboard-Shortcut Tooltips
    cy.get('button[title*="Fett"]').should("exist")
    cy.get('button[title*="Kursiv"]').should("exist")
    cy.get('button[title*="Unterstrichen"]').should("exist")
  })

  it("sollte Text fett formatieren können", () => {
    cy.get(".ProseMirror").click().type("Test")
    cy.get(".ProseMirror").type("{selectall}")
    cy.get('button[title*="Fett"]').click()
    cy.get(".ProseMirror strong").should("exist")
  })

  it("sollte Textausrichtung ändern können", () => {
    cy.get(".ProseMirror").click().type("Zentrierter Text")
    cy.get(".ProseMirror").type("{selectall}")
    cy.get('button[title*="Zentriert"]').click()
    // TextAlign setzt ein style Attribut
    cy.get('.ProseMirror p[style*="text-align"]').should("exist")
  })

  it("sollte Schriftart-Dropdown haben", () => {
    cy.get('select[title="Schriftart"]').should("exist")
    cy.get('select[title="Schriftart"] option').should("have.length.greaterThan", 3)
  })

  it("sollte Schriftgröße-Dropdown haben", () => {
    cy.get('select[title="Schriftgröße"]').should("exist")
    cy.get('select[title="Schriftgröße"] option').should("have.length.greaterThan", 5)
  })

  it("sollte PDF Export Button anzeigen", () => {
    cy.contains("button", /PDF exportieren/i).should("be.visible")
  })

  it("sollte Text hochladen Button anzeigen", () => {
    cy.contains("button", /Text hochladen/i).should("be.visible")
  })
})
