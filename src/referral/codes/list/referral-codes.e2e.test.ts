/**
 * E2E: referral dashboard on /user/referral — the signed-in earner sees their
 * stats and codes first, and one tap copies the share link.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { referralCodes } from "../../db";
import { scopedTranslation } from "../../i18n";

const REFERRAL_PAGE = "/user/referral";
/** Pixels the page sticks out sideways (evaluated in the browser). */
const OVERFLOW_PROBE =
  "document.documentElement.scrollWidth - window.innerWidth";
/** What the page just put on the clipboard. */
const CLIPBOARD_PROBE = "navigator.clipboard.readText()";
const PHONE = { width: 390, height: 844 };
const { t } = scopedTranslation.scopedT(defaultLocale);

describe("E2E: referral codes", () => {
  const e2e = useE2E("referral/codes/list");

  e2e.it(
    "lists the earner's code and copies its share link",
    async (fixtures) => {
      const { page, context, baseUrl } = fixtures;
      const created = await createTestUser(
        fixtures.uniqueEmail("referral-codes"),
        "E2E Referrer",
      );
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {
        return;
      }
      const account = created.data;
      fixtures.cleanup(() => deleteTestUser(account.user.id));

      const code = `E2E${account.user.id.slice(0, 6).toUpperCase()}`;
      await db.insert(referralCodes).values({
        code,
        ownerUserId: account.user.id,
        label: "E2E launch",
      });

      await fixtures.loginAs(account.user);
      await context.grantPermissions(["clipboard-read", "clipboard-write"], {
        origin: baseUrl,
      });
      await page.setViewportSize(PHONE);
      await fixtures.gotoReady(REFERRAL_PAGE, async () => {
        await page
          .getByText(code, { exact: true })
          .first()
          .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 });
      });

      const overflow = await page.evaluate<number>(OVERFLOW_PROBE);
      expect(overflow).toBeLessThanOrEqual(0);

      await page
        .getByRole("button", { name: t("codes.list.widget.copy"), exact: true })
        .first()
        .click();
      await page.getByText(t("codes.list.widget.copied")).first().waitFor();

      const clipboard = await page.evaluate<string>(CLIPBOARD_PROBE);
      expect(clipboard).toContain(`/track?ref=${code}`);
    },
  );
});
