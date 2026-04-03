/**
 * Shared Playwright browser scraping utility for price fetchers.
 *
 * Uses headless Chromium to render JS-heavy pricing pages and extract text content.
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

interface ScrapeOptions {
  /** URL to navigate to */
  url: string;
  /**
   * Optional: click buttons whose visible textContent matches these strings.
   * Uses page.evaluate for reliability (works even if buttons are off-screen).
   */
  clickButtonTexts?: string[];
  /** Optional: wait for this text to appear in the page body before extracting */
  waitForText?: string;
  /** Timeout in ms for page load (default: 15000) */
  timeout?: number;
}

/**
 * Scrape a JS-rendered page using Playwright headless Chromium.
 * Returns the full innerText of the page body after JS execution.
 * Returns undefined if scraping fails.
 */
export async function scrapeWithBrowser(
  logger: EndpointLogger,
  options: ScrapeOptions,
): Promise<string | undefined> {
  const { url, clickButtonTexts, waitForText, timeout = 15000 } = options;

  let browser;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle", timeout });

    // Click buttons by text using JS (more reliable than locator for hidden/off-screen buttons)
    if (clickButtonTexts) {
      for (const buttonText of clickButtonTexts) {
        const clicked = await page.evaluate((text: string) => {
          const buttons = [...document.querySelectorAll("button")].filter(
            (b) => b.textContent?.trim() === text && b.offsetParent !== null,
          );
          buttons.forEach((b) => b.click());
          return buttons.length;
        }, buttonText);
        if (clicked > 0) {
          await page.waitForTimeout(500);
          logger.debug("Browser scrape: clicked buttons", {
            buttonText,
            count: clicked,
          });
        }
      }
    }

    // Wait for specific text if requested
    if (waitForText) {
      try {
        await page.waitForFunction(
          (text: string) =>
            document.body.innerText.toLowerCase().includes(text.toLowerCase()),
          waitForText,
          { timeout: 5000 },
        );
      } catch {
        logger.debug("Browser scrape: waitForText timed out", {
          url,
          waitForText,
        });
      }
    }

    const text = await page.evaluate(() => document.body.innerText);
    logger.debug("Browser scrape successful", {
      url,
      textLength: text.length,
    });
    return text;
  } catch (err) {
    logger.debug("Browser scrape failed", {
      url,
      error: parseError(err).message,
    });
    return undefined;
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
}
