import { randomUUID } from "node:crypto";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { BillingInterval } from "@/subscription/enum";
import { scopedTranslation as subscriptionLocale } from "@/subscription/i18n";

import detail from "../view/definition";
import { scopedTranslation as detailLocale } from "../view/i18n";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

const parsedList = z.object({
  success: z.literal(true),
  data: definition.GET.responseSchema,
});

describe("Users directory empty and recovery states", () => {
  const e2e = useE2E("users/directory-recovery");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`recovers users list and detail in ${locale}`, async (fixture) => {
      const { page, baseUrl } = fixture;
      const auth = await authAtlas(fixture, await resolveTestAdminUser());
      const listPath = `/api/${locale}/users/list`;
      const detailPath = `/api/${locale}/users/view`;
      const origin = new URL(baseUrl).origin;
      const responseMessage = "Fixture service response";
      const search = `no-such-user-${randomUUID()}`;
      const unavailableId = randomUUID();
      let failList = true;
      let failDetail = true;
      let displayIntervalFixture = false;

      await page.route(
        (url) => url.origin === origin && [listPath, detailPath].includes(url.pathname),
        async (route) => {
          if (route.request().method() !== "GET") {
            await route.fallback();
            return;
          }
          const path = new URL(route.request().url()).pathname;
          if ((path === listPath && failList) || (path === detailPath && failDetail)) {
            await route.fulfill({
              status: 503,
              json: {
                success: false,
                message: responseMessage,
                errorType: { ...ErrorResponseTypes.UNKNOWN_ERROR, errorCode: 503 },
              },
            });
            return;
          }
          if (path === detailPath && displayIntervalFixture) {
            const sample = detail.GET.examples.responses.default;
            await route.fulfill({
              status: 200,
              json: {
                success: true,
                data: {
                  ...sample,
                  paymentStats: { ...sample.paymentStats, subscriptionInterval: "monthly" },
                },
              },
            });
            return;
          }
          await route.continue({
            headers: { ...route.request().headers(), authorization: auth.authorization },
          });
        },
      );

      const { t } = scopedTranslation.scopedT(locale);
      const { t: userT } = detailLocale.scopedT(locale);
      const short = locale.slice(0, 2);
      const show = (route: string) => page.goto(
        `${baseUrl}/${locale}/tools/${route}`, { waitUntil: "commit", timeout: 60_000 },
      );
      const read = (path: string) => page.waitForResponse(
        (response) => response.request().method() === "GET" && new URL(response.url()).pathname === path,
        { timeout: 55_000 },
      );

      await show(`users-list?arg.search=${search}`);
      const retryList = page.getByRole("button", { name: t("widget.actions.refresh"), exact: true });
      await page.getByText(responseMessage, { exact: true }).waitFor();
      expect(await page.getByText(responseMessage, { exact: true }).count()).toBe(1);
      expect(await retryList.count()).toBe(1);
      if (process.env["USERS_RECOVERY_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `users-list-recovery-error-${short}`);
      }

      failList = false;
      const [list] = await Promise.all([read(listPath), retryList.click()]);
      expect(list.status()).toBe(200);
      const { data } = parsedList.parse(await list.json());
      expect(data.users).toEqual([]);
      expect(data.summary).toMatchObject({
        totalCount: 0,
        payingCount: 0,
        activeMonthCount: 0,
        creditsSpent30d: 0,
        totalPaidUsd: 0,
      });
      await page.getByText(t("widget.empty.filtered"), { exact: true }).waitFor();
      if (process.env["USERS_RECOVERY_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `users-list-recovery-empty-${short}`);
      }

      await show(`users-view?arg.userId=${unavailableId}`);
      await page.getByText(responseMessage, { exact: true }).waitFor();
      await page.getByRole("button", { name: userT("widget.actions.retry"), exact: true }).waitFor();
      const back = page.getByRole("button", { name: userT("widget.actions.browse"), exact: true });
      await back.waitFor();
      if (process.env["USERS_RECOVERY_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `users-view-recovery-error-${short}`);
      }
      await back.click();
      await page.waitForURL((url) => url.pathname.endsWith("/tools/users-list"));

      failDetail = false;
      displayIntervalFixture = true;
      await show(`users-view?arg.userId=${unavailableId}`);
      const monthly = subscriptionLocale.scopedT(locale).t(BillingInterval.MONTHLY);
      await page.getByText(monthly, { exact: true }).first().waitFor();
      if (locale !== "en-US") {
        expect(await page.getByText("monthly", { exact: true }).count()).toBe(0);
      }
    }, 120_000);
  }
});
