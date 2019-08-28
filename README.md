# wait-until-click-xhr

To run it locally:
```bash
$ npm install
$ npm test
```
To open Cypress
```bash
$ npm start
$ npm run cy:open
```

## The problem I received:

*At a very high level, we click a button which commands a building-control point; turns a light on or off. The click is supposed to send a POST request to the server. The issue is sometimes, the button is clicked and the POST request does not go out. The button has no functionality to indicate if it has been clicked (minor enhancement) . For the time being, I want to work around this using waitUntil.

Here is the code sample*

```javascript
// define routes
cy.server();
cy.route('POST', '\*\*/pointcommands').as('sendCommand');
// setup checkFunction for cy.waitUntil()
const waitForPost200 = () => cy.wait('@sendCommand', {timeout: 10000}).then(xhr => cy.wrap(xhr).its('status').should('eq', 200));
// setup jQuery for cy.pipe()
const click = $el => $el.click();
// click the button
cy.get('.marengo-ok')
  .should('be.visible')
  .pipe(click);
  // need to pass in a synchronous should() check so that the click is retried. How can we achieve this with waitUntil ?
// wait until checkFunction waitForPost200() returns truthy
cy.waitUntil( (): any => waitForPost200(), {
  timeout: 10000,
  interval: 1000,
  errorMsg: 'POST not sent within time limit'
});
```

### My solution

```javascript
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
```
