/// <reference types="Cypress" />

context("Click", () => {
  it("Should make the XHR call", () => {
    cy.visit("/");
    cy.get("button").as("button");
    cy.server();

    let requestStarted = false;
    cy.route({
      method: "post",
      url: "/example",
      onRequest: () => (requestStarted = true)
    }).as("sendCommand");

    cy.waitUntil(() =>
      cy
        .get("@button")
        .click()
        .then(() => requestStarted)
    );

    cy.wait("@sendCommand");
  });
});
