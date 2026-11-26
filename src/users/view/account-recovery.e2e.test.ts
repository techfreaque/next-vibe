import { randomUUID } from "node:crypto";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { USERS_VIEW_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

describe("Account detail recovery", () => {
  const e2e = useE2E("users/account-detail-recovery");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      `retries a temporary read then returns from the missing ${locale} account`,
      async (fixtures) => {
        const { page, baseUrl } = fixtures;
        const auth = await authAtlas(fixtures, await resolveTestAdminUser());
        const absent = randomUUID();
        const target = `/api/${locale}/users/view`;
        const { t } = scopedTranslation.scopedT(locale);
        let reads = 0;
        await page.route(
          (url) =>
            url.origin === new URL(baseUrl).origin && url.pathname === target,
          async (route) => {
            reads++;
            if (reads === 1) {
              await route.fulfill({
                status: 503,
                json: {
                  success: false,
                  message: t("errors.network.description"),
                  errorType: {
                    ...ErrorResponseTypes.INTERNAL_ERROR,
                    errorCode: 503,
                  },
                },
              });
            } else {
              await route.continue({
                headers: {
                  ...route.request().headers(),
                  authorization: auth.authorization,
                },
              });
            }
          },
        );
        await fixtures.goto(
          `/tools/${USERS_VIEW_ALIAS}?arg.userId=${absent}`,
          locale,
        );
        const retry = page
          .getByRole("button", { name: t("widget.actions.retry"), exact: true })
          .filter({ visible: true });
        await retry.waitFor();
        const repeatRead = () =>
          Promise.all([
            page.waitForResponse((r) => new URL(r.url()).pathname === target),
            retry.click(),
          ]);
        let [response] = await repeatRead();
        for (
          let attempt = 0;
          [502, 503, 504].includes(response.status()) && attempt < 2;
          attempt++
        ) {
          await retry.waitFor();
          await Bun.sleep(3000);
          [response] = await repeatRead();
        }
        expect(response.status()).toBe(404);
        await page
          .getByText(t("errors.notFound.description"), { exact: true })
          .waitFor();
        expect(await retry.count()).toBe(0);
        expect(
          await page
            .getByText(absent, { exact: false })
            .filter({ visible: true })
            .count(),
        ).toBe(0);
        await saveAdminViewMatrix(
          page,
          "usersDirectory",
          `account-missing-verified-${locale.split("-")[0]}`,
        );
        await page
          .getByRole("button", {
            name: t("widget.actions.browse"),
            exact: true,
          })
          .filter({ visible: true })
          .last()
          .click();
        await page.waitForURL("**/tools/users-list**");
      },
    );
  }
});
