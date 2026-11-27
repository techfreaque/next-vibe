import { mkdir } from "node:fs/promises";

import type { Page } from "playwright";

import type { CountryLanguage } from "../../../core/i18n/core/config";

export async function saveAdminReviewScreenshots(
  page: Page,
  view: string,
  locale: CountryLanguage,
): Promise<void> {
  if (
    process.env["NIGHT_COVERAGE_SHOTS"] !== "1" ||
    (locale !== "en-US" && locale !== "de-DE")
  ) {
    return;
  }
  const directory = "scratchpad/erp/shots/coverage/night";
  await mkdir(directory, { recursive: true });
  const originalViewport = page.viewportSize();
  await page.emulateMedia({ colorScheme: "dark" });
  /* oxlint-disable restricted/no-browser-globals -- browser screenshot setup */
  await page.evaluate(() => {
    const key = "theme_v2";
    const oldValue = localStorage.getItem(key);
    localStorage.setItem(key, "dark");
    window.dispatchEvent(
      new StorageEvent("storage", { key, oldValue, newValue: "dark" }),
    );
  });
  await page.waitForFunction(() => {
    const root = document.documentElement;
    return (
      root.classList.contains("dark") &&
      getComputedStyle(root).colorScheme === "dark"
    );
  });
  try {
    for (const { device, width, height } of [
      { device: "desktop", width: 1440, height: 900 },
      { device: "phone", width: 390, height: 844 },
    ]) {
      await page.setViewportSize({ width, height });
      const tool = page
        .locator('[id^="admin-tool-"]')
        .filter({ visible: true })
        .last();
      const contentHeight = await tool.evaluate((anchor) => {
        let lastVisiblePixel =
          anchor.getBoundingClientRect().top + anchor.scrollHeight;
        for (const element of anchor.querySelectorAll("*")) {
          const bounds = element.getBoundingClientRect();
          if (bounds.height > 0) {
            lastVisiblePixel = Math.max(lastVisiblePixel, bounds.bottom);
          }
          if (
            element.scrollHeight > element.clientHeight + 4 &&
            /auto|scroll/u.test(getComputedStyle(element).overflowY)
          ) {
            lastVisiblePixel = Math.max(
              lastVisiblePixel,
              bounds.top + element.scrollHeight,
            );
            element.setAttribute("data-review-scroll", "");
          }
        }
        for (
          let element = anchor.parentElement;
          element;
          element = element.parentElement
        ) {
          if (
            element !== document.body &&
            element.scrollHeight > element.clientHeight + 4 &&
            /auto|scroll|hidden/u.test(getComputedStyle(element).overflowY)
          ) {
            lastVisiblePixel = Math.max(
              lastVisiblePixel,
              element.getBoundingClientRect().top + element.scrollHeight,
            );
            element.setAttribute("data-review-scroll", "");
          }
        }
        return Math.ceil(lastVisiblePixel);
      });
      if (contentHeight > height) {
        await page.setViewportSize({ width, height: contentHeight });
      }
      try {
        await page.screenshot({
          path: `${directory}/${view}-${device}-dark-${locale}.png`,
          fullPage: true,
          animations: "disabled",
          style:
            "[data-review-scroll] { height: auto !important; max-height: none !important; overflow: visible !important; flex-shrink: 0 !important; }",
        });
      } finally {
        await page.locator("[data-review-scroll]").evaluateAll((elements) => {
          for (const element of elements) {
            element.removeAttribute("data-review-scroll");
          }
        });
      }
    }
  } finally {
    if (originalViewport) {
      await page.setViewportSize(originalViewport);
    }
  }
  /* oxlint-enable restricted/no-browser-globals */
}
