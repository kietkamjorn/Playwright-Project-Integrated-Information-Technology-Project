import "dotenv/config";
import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout,
  type ITestCaseHookParameter,
} from "@cucumber/cucumber";

import { chromium, type Browser } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import CustomWorld from "./world.ts";
setDefaultTimeout(30_000);
let browser!: Browser;

BeforeAll(async () => {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== "false",
  });
});

Before(async function (this: CustomWorld) {
  this.browser = browser;

  this.context = await browser.newContext({
    viewport: {
      width: 1280,
      height: 720,
    },
  });

  this.page = await this.context.newPage();

  this.page.setDefaultTimeout(10_000);
  this.page.setDefaultNavigationTimeout(15_000);
});

After(async function (
  this: CustomWorld,
  scenarioResult: ITestCaseHookParameter
) {
  if (scenarioResult.result?.status === Status.FAILED && this.page) {
    await saveFailureScreenshot(this.page, scenarioResult.pickle.name);
  }

  await this.context?.close();
});

AfterAll(async () => {
  await browser?.close();
});

async function saveFailureScreenshot(
  page: CustomWorld["page"],
  scenarioName: string
): Promise<void> {
  const screenshotDirectory = path.resolve("artifacts");

  await fs.mkdir(screenshotDirectory, {
    recursive: true,
  });

  const fileName = scenarioName
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  await page.screenshot({
    path: path.join(
      screenshotDirectory,
      `${fileName || "failed-scenario"}.png`
    ),
    fullPage: true,
  });
}
