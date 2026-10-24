# Playwright-Project-Integrated-Information-Technology-Project
# ITB MShop — Playwright Cucumber E2E Tests

This project contains an end-to-end test automation suite for the ITB MShop e-commerce web application.

The test suite is built with Playwright, Cucumber, and TypeScript. It uses Gherkin scenarios to describe business behavior and the Page Object Model to keep page interactions and locators maintainable.

---

## Purpose

This project was created as a QA Automation portfolio project to demonstrate:

- Behavior-driven development using Cucumber
- End-to-end browser testing with Playwright
- TypeScript-based test automation
- Page Object Model design
- Positive and negative test scenarios
- Form validation testing
- Authentication flow testing
- API mocking for deterministic tests
- Test isolation using browser contexts
- Failure screenshots and HTML test reports

---

## Application Under Test

The tests target the ITB MShop web application.

### Local Frontend

```text
http://localhost:5173/kp4
```

### Sign In Page

```text
http://localhost:5173/kp4/signin
```

---

## Tech Stack

- **Test Framework:** Cucumber
- **Browser Automation:** Playwright
- **Programming Language:** TypeScript
- **Runtime:** Node.js
- **Application Frontend:** Vue.js 3
- **Build Tool:** Vite
- **Report:** Cucumber HTML Report
- **Test Design:** Page Object Model

---

## Project Structure

```text
.
├── context/
│   └── testContext.ts
├── features/
│   └── signin.feature
├── pages/
│   └── loginPage.ts
├── steps/
│   └── loginstep.ts
├── support/
│   ├── hooks.ts
│   └── world.ts
├── artifacts/
├── cucumber.js
├── package.json
├── tsconfig.json
└── .env
```

### Folder Responsibilities

- **features/** — Gherkin feature files that describe business scenarios.
- **steps/** — Step definitions that connect Gherkin steps to test actions.
- **pages/** — Page Object classes containing locators and page interactions.
- **context/** — Shared test data and Page Object instances within a scenario.
- **support/world.ts** — Custom Cucumber World containing browser objects and test context.
- **support/hooks.ts** — Browser lifecycle, context setup, timeout configuration, and failure screenshots.
- **artifacts/** — Screenshots generated when a scenario fails.

---

## Test Scenarios

The current test suite covers the Sign In feature:

- **Successful buyer sign in:** Verify that a buyer is redirected to the sale item gallery after signing in.
- **Empty form validation:** Verify that the Sign In button is disabled when no data is entered.
- **Invalid credentials:** Verify that an error message is displayed when login credentials are rejected.
- **Missing password validation:** Verify that the Sign In button remains disabled when the password is empty.
- **Missing email validation:** Verify that the Sign In button remains disabled when the email is empty.

Authentication responses are mocked with Playwright request interception, so the tests do not use real credentials.

---

## Prerequisites

- Node.js 18 or later
- npm
- A running instance of the frontend application

---

## Installation

```bash
npm install
npx playwright install chromium
```

---

## Environment Configuration

Create a `.env` file in the project root:

```env
BASE_URL=http://localhost:5173/kp4
HEADLESS=true
```

| Variable | Description |
| --- | --- |
| `BASE_URL` | Base URL of the frontend application |
| `HEADLESS` | Set to `true` to hide the browser or `false` to display it |

Start the frontend application:

```bash
npm run dev
```

The backend is not required for the current mocked authentication scenarios.

---

## Running Tests

Run all scenarios:

```bash
npx cucumber-js
```

Run smoke scenarios:

```bash
npx cucumber-js --tags "@smoke"
```

Run tests with the browser visible:

```bash
HEADLESS=false npx cucumber-js
```

Run a specific feature file:

```bash
npx cucumber-js features/signin.feature
```

---

## Test Reports

The test command generates:

```text
cucumber-report.html
```

Open the report on macOS:

```bash
open cucumber-report.html
```

If a scenario fails, a full-page screenshot is saved in:

```text
artifacts/
```

---

## Test Architecture

### Cucumber

Gherkin feature files describe expected behavior in a readable format:

```gherkin
Scenario: Sign in button is disabled when form is incomplete
  Then the Sign In button should be disabled
```

### Page Object Model

Page-specific locators and actions are encapsulated in page classes:

```ts
await loginPage.enterEmail("buyer@example.com");
await loginPage.enterPassword("password123");
await loginPage.clickSignIn();
```

This keeps selectors out of the feature files and reduces duplication in step definitions.

### API Mocking

Authentication requests are mocked to make tests repeatable, fast, and independent from backend availability.

```ts
await page.route("**/v2/auth/login", async (route) => {
  await route.fulfill({
    status: 401,
    contentType: "application/json",
    body: JSON.stringify({
      message: "Invalid credentials",
    }),
  });
});
```

### Test Isolation

Each Cucumber scenario receives a new Playwright browser context. This prevents cookies, local storage, and authentication state from leaking between scenarios.

### Failure Handling

When a scenario fails, the `After` hook captures a full-page screenshot and saves it in the `artifacts` directory for debugging.

---

## Example Test Result

```text
5 scenarios (5 passed)
30 steps (30 passed)
```

---

## Future Improvements

- Add registration scenarios.
- Add forgot-password scenarios.
- Add product browsing and product detail tests.
- Add seller product management tests.
- Add shopping cart and order workflow tests.
- Add cross-browser testing with Firefox and WebKit.
- Add CI execution with GitHub Actions.
- Add API-level test data setup.
- Add test tags for smoke, regression, and validation suites.
