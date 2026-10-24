import {
  Given,
  When,
  Then,
} from "@cucumber/cucumber";

import assert from "node:assert/strict";
import LoginPage from "../pages/loginPage.ts";
import CustomWorld from "../support/world.ts";

Given(
  "User navigates to the sign in page",
  async function (this: CustomWorld) {
    this.testContext.loginPage = new LoginPage(this.page);

    await this.testContext.loginPage.navigateToSignIn();
  },
);

Given(
  "the login API accepts valid buyer credentials",
  async function (this: CustomWorld) {
    await this.page.route(
      "**/v2/auth/login",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            access_token: createBuyerToken(),
          }),
        });
      },
    );
  },
);

Given(
  "the login API rejects the credentials",
  async function (this: CustomWorld) {
    await this.page.route(
      "**/v2/auth/login",
      async (route) => {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Invalid credentials",
          }),
        });
      },
    );
  },
);

When(
  "User enters email {string}",
  async function (
    this: CustomWorld,
    email: string,
  ) {
    await this.testContext.loginPage!.enterEmail(email);
  },
);

When(
  "User enters password {string}",
  async function (
    this: CustomWorld,
    password: string,
  ) {
    await this.testContext.loginPage!.enterPassword(password);
  },
);

When(
  "User clicks the Sign In button",
  async function (this: CustomWorld) {
    await this.testContext.loginPage!.clickSignIn();
  },
);

Then(
  "the Sign In button should be disabled",
  async function (this: CustomWorld) {
    const isDisabled =
      await this.testContext.loginPage!
        .isSignInButtonDisabled();

    assert.equal(isDisabled, true);
  },
);

Then(
  "User should see the sign in message {string}",
  async function (
    this: CustomWorld,
    expectedMessage: string,
  ) {
    const actualMessage =
      await this.testContext.loginPage!.getMessage();

    assert.ok(
      actualMessage.includes(expectedMessage),
      `Expected "${actualMessage}" to include "${expectedMessage}"`,
    );
  },
);

Then(
  "User should be redirected to the sale item gallery",
  async function (this: CustomWorld) {
    await this.testContext.loginPage!
      .waitForSaleItemGallery();

    assert.match(
      this.page.url(),
      /\/sale-items$/,
    );
  },
);

function createBuyerToken(): string {
  const header = encodeBase64Url(
    JSON.stringify({
      alg: "none",
      typ: "JWT",
    }),
  );

  const payload = encodeBase64Url(
    JSON.stringify({
      sub: "1",
      role: "BUYER",
    }),
  );

  return `${header}.${payload}.signature`;
}

function encodeBase64Url(value: string): string {
  return Buffer
    .from(value)
    .toString("base64url");
}