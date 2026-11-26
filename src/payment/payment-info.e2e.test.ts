import { mkdir } from "node:fs/promises";

import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import type { Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { paymentTransactions } from "./db";
import definitions from "./definition";
import { CheckoutMode, PaymentProvider, PaymentStatus } from "./enum";
import { scopedTranslation } from "./i18n";

const locales = [
  { locale: "en-US", slug: "en" },
  { locale: "de-DE", slug: "de" },
  { locale: "sk-SK", slug: "sk" },
] as const;

async function capture(page: Page, name: string): Promise<void> {
  if (process.env["PAYMENT_INFO_SHOTS"] !== "1") {
    return;
  }

  const root = "scratchpad/erp/shots/v2/payments";
  await mkdir(root, { recursive: true });
  for (const { viewport, width, height } of [
    { viewport: "desktop", width: 1440, height: 900 },
    { viewport: "phone", width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width, height });
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate((value) => {
        const key = "theme_v2";
        const oldValue = localStorage.getItem(key);
        localStorage.setItem(key, value);
        window.dispatchEvent(
          new StorageEvent("storage", { key, oldValue, newValue: value }),
        );
      }, theme);
      await page.locator(`html.${theme}`).waitFor({ state: "attached" });
      await page.screenshot({ path: `${root}/${name}-${viewport}-${theme}.png` });
    }
  }
}

describe("Read-only account payments on Atlas", () => {
  const e2e = useE2E("payment/own-history");

  for (const { locale, slug } of locales) {
    e2e.it(`lists only the signed-in account’s payments in ${locale}`, async (fixture) => {
      const { page, cleanup, baseUrl } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const created = await createTestUser(fixture.uniqueEmail("payment-summary"));
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }

      const { user } = created.data;
      cleanup(async () => deleteTestUser(user.id));
      const apiPath = `/api/${locale}/payment`;
      const segment = endpointToUrlSegment(definitions.GET);
      const url = `${baseUrl}/${locale}/tools/${segment}`;
      if (slug === "en") {
        const regular = await authAtlas(fixture, user);
        const http = atlasRequest(regular.authorization.slice("Bearer ".length), regular.cookie);
        expect((await http.get(apiPath)).status).toBe(403);

        const other = await createTestUser(fixture.uniqueEmail("payment-other"));
        expect(other.success).toBe(true);
        if (!other.success) {
          return;
        }
        cleanup(async () => deleteTestUser(other.data.user.id));
        await db.insert(paymentTransactions).values({
          userId: other.data.user.id,
          amount: "891.21",
          currency: "EUR",
          status: PaymentStatus.SUCCEEDED,
        });
      }

      await db.insert(userRoles).values({ userId: user.id, role: UserPermissionRole.ADMIN });
      const headers = await authAtlas(fixture, {
        ...user,
        roles: [UserPermissionRole.ADMIN, ...user.roles],
      });
      const http = atlasRequest(headers.authorization.slice("Bearer ".length), headers.cookie);
      const apiSchema = z.object({
        success: z.literal(true),
        data: definitions.GET.responseSchema,
      });
      const empty = await http.get(apiPath);
      expect(empty.ok).toBe(true);
      expect(apiSchema.parse(await empty.json()).data.transactions).toEqual([]);

      if (slug === "en") {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.getByText(t("get.summary.empty"), { exact: true }).waitFor({ timeout: 60_000 });
        await capture(page, "account-payments-empty-en");
      }

      await db.insert(paymentTransactions).values([
        {
          userId: user.id,
          amount: "24.95",
          currency: "EUR",
          status: PaymentStatus.SUCCEEDED,
          mode: CheckoutMode.SUBSCRIPTION,
          providerSessionId: "fixture_session_omitted",
          providerPaymentIntentId: "fixture_intent_omitted",
          metadata: { checkoutUrl: "https://example.test/private-checkout" },
          createdAt: new Date("2026-10-22T10:35:00.000Z"),
        },
        {
          userId: user.id,
          amount: "19.99",
          currency: "USD",
          status: PaymentStatus.REFUNDED,
          provider: PaymentProvider.NOWPAYMENTS,
          createdAt: new Date("2026-10-21T09:20:00.000Z"),
        },
        {
          userId: user.id,
          amount: "0.00",
          currency: "USD",
          status: PaymentStatus.PENDING,
          createdAt: new Date("2026-10-20T08:00:00.000Z"),
        },
      ]);
      if (slug === "en") {
        await db.insert(paymentTransactions).values(
          Array.from({ length: 8 }, (_, index): typeof paymentTransactions.$inferInsert => ({
            userId: user.id,
            amount: "3.21",
            currency: "PLN",
            status: PaymentStatus.FAILED,
            createdAt: new Date(Date.UTC(2026, 9, 1 + index)),
          })),
        );
      }

      const recent = await http.get(apiPath);
      expect(recent.ok).toBe(true);
      const payload = await recent.text();
      for (const omitted of ["fixture_session_omitted", "fixture_intent_omitted", "private-checkout", "891.21"]) {
        expect(payload).not.toContain(omitted);
      }
      const { data } = apiSchema.parse(JSON.parse(payload));
      expect(data.transactions).toHaveLength(slug === "en" ? 10 : 3);
      expect(data.mode).toBe(CheckoutMode.SUBSCRIPTION);
      expect(data.priceId).toBeUndefined();
      expect(data.sessionId).toBeUndefined();
      expect(data.sessionUrl).toBeUndefined();
      expect(data.transactions.slice(0, 3)).toMatchObject([
        { amount: "24.95", currency: "EUR", status: PaymentStatus.SUCCEEDED, createdAt: "2026-10-22T10:35:00.000Z" },
        { amount: "19.99", currency: "USD", status: PaymentStatus.REFUNDED },
        { amount: null, currency: null, status: PaymentStatus.PENDING },
      ]);

      await page.goto(url, { waitUntil: "domcontentloaded" });
      const paid = page.getByText(formatMoney("24.95", "EUR", locale), { exact: true });
      await paid.waitFor({ timeout: 60_000 });
      await page.getByText(formatMoney("19.99", "USD", locale), { exact: true }).waitFor();
      await page.getByText(t(PaymentStatus.SUCCEEDED), { exact: true }).waitFor();
      await page.getByText(t(PaymentStatus.REFUNDED), { exact: true }).waitFor();
      await page.getByText(t("get.summary.amountUnavailable"), { exact: true }).waitFor();
      expect(await page.locator(`[id="admin-tool-${segment}"]`).getByRole("textbox").count()).toBe(0);
      await capture(page, `account-payments-populated-${slug}`);

      if (slug === "en") {
        let failRead = true;
        await page.route((requestUrl) => requestUrl.pathname === apiPath, async (route) => {
          if (route.request().method() === "GET" && failRead) {
            await route.fulfill({ status: 503, json: { success: false, message: "Fixture unavailable" } });
          } else {
            await route.continue();
          }
        });
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.getByText(t("get.summary.error"), { exact: true }).waitFor();
        await capture(page, "account-payments-error-en");
        failRead = false;
        await page.getByRole("button", { name: t("get.summary.retry"), exact: true }).click();
        await paid.waitFor({ timeout: 45_000 });
      }
    });
  }
});
