import { type Page } from "playwright";

export default class LoginPage {
  private page: Page;

  private elements = {
    emailInput: ".itbms-email",
    passwordInput: ".itbms-password",
    signInButton: ".itbms-signin-button",
    message: ".itbms-message",
  };

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToSignIn(): Promise<void> {
    const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");

    if (!baseUrl) {
      throw new Error("BASE_URL is not set");
    }

    await this.page.goto(`${baseUrl}/signin`, {
      waitUntil: "domcontentloaded",
    });

    await this.page.locator(this.elements.emailInput).waitFor({
      state: "visible",
    });
  }

  async enterEmail(email: string): Promise<void> {
    await this.page.locator(this.elements.emailInput).fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.locator(this.elements.passwordInput).fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.page.locator(this.elements.signInButton).click();
  }

  async isSignInButtonDisabled(): Promise<boolean> {
    return this.page
      .locator(this.elements.signInButton)
      .isDisabled();
  }

  async getMessage(): Promise<string> {
    const message = this.page.locator(this.elements.message);

    await message.waitFor({
      state: "visible",
      timeout: 10_000,
    });

    return (await message.textContent())?.trim() || "";
  }

  async waitForSaleItemGallery(): Promise<void> {
    await this.page.waitForURL(/\/sale-items$/);
  }
}