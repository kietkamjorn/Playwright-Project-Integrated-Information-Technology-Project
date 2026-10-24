import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "playwright";
import TestContext from "../context/testContext.ts";

export default class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  testContext: TestContext;

  constructor(options: any) {
    super(options);
    this.testContext = new TestContext();
  }
}

setWorldConstructor(CustomWorld);
