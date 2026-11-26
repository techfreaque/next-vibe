import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  AnalyticsGranularity,
  AnalyticsRange,
} from "next-vibe/unified-ui/analytics/enum";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { ERROR_LOG_DAILY_SINCE } from "../daily";
import { errorLogDaily, errorLogs } from "../db";
import { scopedTranslation } from "./i18n";

describe("Error-log period grammar", () => {
  const e2e = useE2E("error-log-period-grammar");

  e2e.it(
    "shows grammatical periods and a single sentence period after history dates",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      await authAtlas(fixtures, await resolveTestAdminUser());
      const fingerprint = randomUUID();
      const marker = `Disposable history fixture ${fingerprint.slice(0, 8)}`;
      fixtures.cleanup(async () => {
        await db
          .delete(errorLogs)
          .where(eq(errorLogs.fingerprint, fingerprint));
      });
      const day = ERROR_LOG_DAILY_SINCE.toISOString().slice(0, 10);
      const from = new Date(ERROR_LOG_DAILY_SINCE.getTime() - 2 * 86_400_000)
        .toISOString()
        .slice(0, 10);
      await db.insert(errorLogs).values({
        fingerprint,
        message: marker,
        level: "error",
        firstSeen: ERROR_LOG_DAILY_SINCE,
        createdAt: ERROR_LOG_DAILY_SINCE,
      });
      await db.insert(errorLogDaily).values({
        fingerprint,
        day: ERROR_LOG_DAILY_SINCE,
        occurrences: 3,
      });

      const schema = z.object({
        success: z.literal(true),
        data: z.object({
          historySince: z.string(),
          window: z.object({ bucket: z.literal("day") }),
        }),
      });
      for (const [locale, grouping] of [
        ["en-US", "by day"],
        ["de-DE", "pro Tag"],
        ["sk-SK", "po dňoch"],
      ] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const url = new URL(`/${locale}/tools/error-logs`, baseUrl);
        url.search = new URLSearchParams({
          "arg.search": marker,
          "arg.range": AnalyticsRange.CUSTOM,
          "arg.from": from,
          "arg.to": day,
          "arg.granularity": AnalyticsGranularity.DAY,
        }).toString();
        await page.setViewportSize({ width: 390, height: 844 });
        const report = page
          .waitForResponse(
            (reply) =>
              reply.ok() &&
              new URL(reply.url()).pathname.endsWith(
                "/vibe/logger/error-monitor/logs",
              ) &&
              new URL(reply.url()).searchParams.get("search") === marker,
            { timeout: 60_000 },
          )
          .catch(() => null);
        let navigation = await page.goto(url.toString(), {
          waitUntil: "commit",
          timeout: 60_000,
        });
        if (navigation && navigation.status() >= 500) {
          navigation = await page.goto(url.toString(), {
            waitUntil: "commit",
            timeout: 60_000,
          });
        }
        expect(navigation?.ok()).toBe(true);
        const received = await report;
        if (!received) {
          expect.fail("Scoped error log did not load");
        }
        const { data } = schema.parse(await received.json());
        expect(data.historySince).toBe(day);
        await page
          .getByText(marker, { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        await page
          .getByText(new RegExp(`\\b${grouping}\\b`, "u"))
          .first()
          .waitFor();
        const date = new Intl.DateTimeFormat(locale, {
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        }).format(ERROR_LOG_DAILY_SINCE);
        const history = page.getByText(
          t("widget.chart.historyNote", { date }),
          { exact: true },
        );
        await history.waitFor();
        expect(await history.textContent()).not.toContain("..");
        if (locale === "de-DE") {
          expect(await history.textContent()).toContain("ab 22. November.");
        }
        if (process.env["ERROR_LOG_GRAMMAR_SHOTS"] === "1") {
          await history.scrollIntoViewIfNeeded();
          await saveAdminViewMatrix(
            page,
            "serviceHealth",
            `error-logs-grammar-${locale}`,
          );
        }
      }
    },
    180_000,
  );
});
