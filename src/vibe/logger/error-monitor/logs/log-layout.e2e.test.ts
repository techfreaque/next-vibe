import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { scopedTranslation as operationsTranslation } from "../../operations-summary/i18n";
import { errorLogs } from "../db";
import { ErrorLogLevelFilter, ErrorLogSourceFilter, ErrorLogStatusFilter } from "./enum";
import { scopedTranslation } from "./i18n";

const locales = [
  { locale: "en-US", short: "en" },
  { locale: "de-DE", short: "de" },
  { locale: "sk-SK", short: "sk" },
] as const;

const isLogsApi = (url: string): boolean =>
  new URL(url).pathname.endsWith("/vibe/logger/error-monitor/logs");

async function save(
  page: Page,
  state: string,
  verify?: () => Promise<void>,
): Promise<void> {
  if (process.env["LOG_LAYOUT_SHOTS"] !== "1") {
    await verify?.();
    return;
  }
  const path = "scratchpad/erp/shots/v2/serviceHealth";
  await mkdir(path, { recursive: true });
  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((value) => {
      const key = "theme_v2";
      const oldValue = localStorage.getItem(key);
      localStorage.setItem(key, value);
      window.dispatchEvent(new StorageEvent("storage", { key, oldValue, newValue: value }));
    }, theme);
    await page.locator(`html.${theme}`).waitFor({ state: "attached" });
    await verify?.();
    await page.screenshot({ path: `${path}/${state}-${theme}.png` });
  }
}

describe("Error log filters and System health on Atlas", () => {
  const e2e = useE2E("logger/log-layout");
  for (const { locale, short } of locales) {
    e2e.it(`filters alert records on a phone and opens System health in ${locale}`, async (fixture) => {
      await authAtlas(fixture, await resolveTestAdminUser());
      const { baseUrl, cleanup, page } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const { t: ops } = operationsTranslation.scopedT(locale);
      const marker = `Browser fixture ${randomUUID().slice(0, 8)}`;
      const fingerprints = [randomUUID(), randomUUID(), randomUUID()];
      const [errorId, warningId, resolvedId] = fingerprints;
      if (!errorId || !warningId || !resolvedId) {
        return;
      }
      cleanup(async () => {
        await db.delete(errorLogs).where(inArray(errorLogs.fingerprint, fingerprints));
      });
      await db.insert(errorLogs).values([
        { fingerprint: errorId, message: `${marker} server error`, level: "error" },
        { fingerprint: warningId, message: `[client] ${marker} browser warning`, level: "warn" },
        { fingerprint: resolvedId, message: `[client] ${marker} resolved warning`, level: "warn", resolved: true },
      ]);
      const logsPath = `${baseUrl}/${locale}/tools/error-logs?arg.search=${encodeURIComponent(marker)}`;
      const warning = page.getByText(`${marker} browser warning`, { exact: true }).first();
      const server = page.getByText(`${marker} server error`, { exact: true }).first();

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(logsPath, { waitUntil: "domcontentloaded" });
      await warning.waitFor({ timeout: 60_000 });
      await server.waitFor();
      await page.getByText(t("widget.kpi.unresolvedInScope"), { exact: true }).waitFor();
      expect(await page.getByText(t("widget.chart.emptyFiltered"), { exact: true }).count()).toBe(0);
      expect(await page.getByText(t("widget.chart.endpointTitle"), { exact: true }).count()).toBe(0);
      const button = page.getByRole("button", { name: t("widget.filter.more"), exact: true });
      expect(await button.isVisible()).toBe(true);
      expect(await page.getByRole("button", { name: t(ErrorLogLevelFilter.WARN), exact: true }).count()).toBe(0);
      await save(page, `error-logs-populated-${short}-phone`);
      await button.click();
      const sheet = page.getByRole("dialog");
      await sheet.waitFor();
      await sheet.getByRole("button", { name: t(ErrorLogStatusFilter.ALL), exact: true }).first().click();
      await sheet.getByRole("button", { name: t(ErrorLogLevelFilter.WARN), exact: true }).click();
      const sources = sheet.getByRole("group", { name: t("get.fields.source.label") });
      const clientSource = sources.getByRole("button", { name: t(ErrorLogSourceFilter.CLIENT), exact: true });
      await clientSource.click();
      expect(await sources.locator('[aria-pressed="true"]').count()).toBe(1);
      expect(await clientSource.getAttribute("aria-pressed")).toBe("true");
      expect(await sources.getByRole("button", { name: t(ErrorLogSourceFilter.ALL), exact: true }).getAttribute("aria-pressed")).toBe("false");
      await save(page, `error-logs-filters-${short}-phone`, async () => {
        const contrast = await sheet.evaluate((element) => {
          const title = element.querySelector("h2");
          const context = document.createElement("canvas").getContext("2d");
          if (!title || !context) {
            return 0;
          }
          const luminance = (color: string): number => {
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            const pixels = context.getImageData(0, 0, 1, 1).data;
            const channel = (index: number): number => {
              const srgb = (pixels[index] ?? 0) / 255;
              return srgb <= 0.04045
                ? srgb / 12.92
                : ((srgb + 0.055) / 1.055) ** 2.4;
            };
            return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
          };
          const background = luminance(getComputedStyle(element).backgroundColor);
          const foreground = luminance(getComputedStyle(title).color);
          return (Math.max(background, foreground) + 0.05) /
            (Math.min(background, foreground) + 0.05);
        });
        expect(contrast).toBeGreaterThanOrEqual(4.5);
      });
      const loaded = page.waitForResponse((reply) => {
        const url = new URL(reply.url());
        return reply.ok() && isLogsApi(reply.url()) &&
          url.searchParams.get("status") === ErrorLogStatusFilter.ALL &&
          url.searchParams.get("level") === ErrorLogLevelFilter.WARN &&
          url.searchParams.get("source") === ErrorLogSourceFilter.CLIENT;
      });
      await sheet.getByRole("button", { name: t("widget.filter.apply"), exact: true }).click();
      expect((await loaded).ok()).toBe(true);
      await sheet.waitFor({ state: "hidden" });
      await page.getByRole("button", { name: t("widget.filter.moreCount", { count: 3 }), exact: true }).waitFor();
      await warning.waitFor();
      expect(await server.count()).toBe(0);
      await page.getByText(`${marker} resolved warning`, { exact: true }).first().waitFor();

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(logsPath, { waitUntil: "domcontentloaded" });
      await server.waitFor({ timeout: 60_000 });
      await save(page, `error-logs-populated-${short}-desktop`);

      if (short === "en") {
        let failRead = true;
        await page.route("**/vibe/logger/error-monitor/logs?**", async (route) => {
          if (failRead && route.request().method() === "GET") {
            await route.fulfill({ status: 503, json: { success: false, message: "Fixture transport failure" } });
          } else {
            await route.continue();
          }
        });
        await page.goto(logsPath, { waitUntil: "domcontentloaded" });
        const error = page.getByText(t("get.errors.server.title"), { exact: true }).last();
        await error.waitFor({ timeout: 45_000 });
        await save(page, "error-logs-transport-error-en-desktop");
        failRead = false;
        await page.getByRole("button", { name: t("widget.header.refresh"), exact: true }).last().click();
        await server.waitFor({ timeout: 45_000 });
      }

      await page.goto(`${baseUrl}/${locale}/tools?cat=serviceHealth`, { waitUntil: "domcontentloaded" });
      const review = page.getByRole("button", { name: ops("reviewErrors"), exact: true });
      await review.waitFor({ timeout: 60_000 });
      await save(page, `operations-actionable-${short}-desktop`);
      await page.setViewportSize({ width: 390, height: 844 });
      await review.waitFor();
      await save(page, `operations-actionable-${short}-phone`);
      if (short === "en") {
        const response = page.waitForResponse((reply) => reply.ok() && isLogsApi(reply.url()) &&
          new URL(reply.url()).searchParams.get("level") === ErrorLogLevelFilter.ERROR);
        await review.click();
        expect((await response).ok()).toBe(true);
      }
    });
  }
});
