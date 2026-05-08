describe("Home page", () => {
  it("loads the deployed home page", { retries: 3 }, () => {
    cy.visit("/");

    cy.document().its("readyState").should("eq", "complete");
    cy.get("body")
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).not.to.eq("");
      });
  });
});
