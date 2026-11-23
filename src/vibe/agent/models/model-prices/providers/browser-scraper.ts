/**
 * Shared Playwright browser scraping utility for price fetchers.
 *
 * Uses headless Chromium to render JS-heavy pricing pages and extract text content.
 */

import "server-only";

import { join } from "node:path";
import { Worker } from "node:worker_threads";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { getVibeDir } from "@/env/paths";

export const OPENAI_PRICING_URL =
  "https://developers.openai.com/api/docs/pricing";

export const scrapeOptionsSchema = z.object({
  url: z.url(),
  clickButtonTexts: z.array(z.string()),
  waitForText: z.array(z.string()),
  timeout: z.number().positive().default(15_000),
});
type ScrapeOptions = z.infer<typeof scrapeOptionsSchema>;

const browserWorkerMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("log"),
    message: z.string(),
    details: z.record(z.string(), z.json()),
  }),
  z.object({ type: z.literal("result"), text: z.string().optional() }),
]);

let pricingPage: Promise<string | undefined> | undefined;

export function fetchOpenAiPricingPage(
  logger: EndpointLogger,
): Promise<string | undefined> {
  pricingPage ??= scrapeWithBrowser(logger, {
    url: OPENAI_PRICING_URL,
    clickButtonTexts: ["All models"],
    waitForText: ["tts-1", "whisper"],
    timeout: 15_000,
  }).finally(() => {
    pricingPage = undefined;
  });
  return pricingPage;
}

export async function scrapeWithBrowser(
  logger: EndpointLogger,
  options: ScrapeOptions,
): Promise<string | undefined> {
  if (!process.versions.bun) {
    return scrapeBrowserPage((message, details) => {
      logger.debug(message, details);
    }, options);
  }

  try {
    // The cron runner shares the dev server's event loop. Playwright's cold
    // import and browser setup run in their own worker.
    const worker = new Worker(
      join(
        getVibeDir(),
        "agent/models/model-prices/providers/browser-scraper-worker.ts",
      ),
      { workerData: options },
    );
    return await new Promise<string | undefined>((resolve) => {
      let result: { text?: string } | undefined;
      let workerError: Error | undefined;
      worker.on("message", (message) => {
        const parsed = browserWorkerMessageSchema.safeParse(message);
        if (!parsed.success) {
          workerError = parsed.error;
        } else if (parsed.data.type === "log") {
          logger.debug(parsed.data.message, parsed.data.details);
        } else {
          result = parsed.data;
        }
      });
      worker.once("error", (error) => {
        workerError = parseError(error);
      });
      worker.once("exit", (code) => {
        if (workerError || code !== 0 || !result) {
          logger.warn("Browser scrape worker failed", {
            url: options.url,
            exitCode: code,
            error: workerError?.message ?? "Missing scrape result",
          });
          resolve(undefined);
        } else {
          resolve(result.text);
        }
      });
    });
  } catch (error) {
    logger.warn("Browser scrape worker failed", {
      url: options.url,
      error: parseError(error).message,
    });
    return undefined;
  }
}

/**
 * Scrape a JS-rendered page using Playwright headless Chromium.
 */
export async function scrapeBrowserPage(
  debug: (
    message: string,
    details: Record<string, string | string[] | number>,
  ) => void,
  options: ScrapeOptions,
): Promise<string | undefined> {
  const { url, clickButtonTexts, waitForText, timeout } = options;

  let browser;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle", timeout });

    // Click buttons by text using JS (more reliable than locator for hidden/off-screen buttons)
    for (const buttonText of clickButtonTexts) {
      const clicked = await page.evaluate((text: string) => {
        // eslint-disable-next-line restricted/no-browser-globals -- Playwright evaluate runs inside browser context, cannot use vibe-ui abstractions
        const buttons = [...document.querySelectorAll("button")].filter(
          (b) => b.textContent?.trim() === text && b.offsetParent !== null,
        );
        buttons.forEach((b) => b.click());
        return buttons.length;
      }, buttonText);
      if (clicked > 0) {
        await page.waitForTimeout(500);
        debug("Browser scrape: clicked buttons", {
          buttonText,
          count: clicked,
        });
      }
    }

    if (waitForText.length > 0) {
      try {
        await page.waitForFunction(
          (markers: string[]) => {
            // oxlint-disable-next-line restricted/no-browser-globals -- Playwright runs this callback in Chromium
            const bodyText = document.body.innerText.toLowerCase();
            return markers.every((marker) =>
              bodyText.includes(marker.toLowerCase()),
            );
          },
          waitForText,
          { timeout: 5000 },
        );
      } catch {
        debug("Browser scrape: waitForText timed out", {
          url,
          waitForText,
        });
      }
    }

    // eslint-disable-next-line restricted/no-browser-globals -- Playwright evaluate runs inside browser context, cannot use vibe-ui abstractions
    const text = await page.evaluate(() => document.body.innerText);
    debug("Browser scrape successful", {
      url,
      textLength: text.length,
    });
    return text;
  } catch (err) {
    debug("Browser scrape failed", {
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
