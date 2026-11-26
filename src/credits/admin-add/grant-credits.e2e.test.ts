import { and, eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";

import { creditPacks, creditWallets } from "../db";
import { scopedTranslation as creditsCopy } from "../i18n";
import definitions from "./definition";

const SHOTS = "../coverage/catalog/e2e";

describe("Admin credit grant", () => {
  const e2e = useE2E("credits/admin-grant");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`${locale}: verifies a disposable account and grants it credits`, async (fixtures) => {
      const { page, capture } = fixtures;
      let userId: string | undefined;
      fixtures.cleanup(async () => {
        if (userId) {
          await deleteTestUser(userId);
        }
      });
      const email = fixtures.uniqueEmail(`grant-${locale}`);
      const account = await createTestUser(email, "Grant fixture");
      if (!account.success) {
        expect.fail(account.message);
      }
      userId = account.data.user.id;
      await authAtlas(fixtures, await resolveTestAdminUser());
      const { t } = creditsCopy.scopedT(locale);
      // Scoped to the tool body: the admin sidebar also has a "Grant credits" entry.
      const tool = page.locator('[id^="admin-tool-"]');
      const button = (name: string) => tool.getByRole("button", { name, exact: true }).filter({ visible: true });

      // Step 1: verify the recipient by email.
      await fixtures.goto(`/tools/${endpointToUrlSegment(definitions.GET)}`, locale);
      const lookup = page.getByRole("textbox", { name: t("adminAdd.recipient.lookup"), exact: true }).filter({ visible: true });
      await lookup.fill(email);
      const verified = await capture(definitions.GET, () => button(t("adminAdd.recipient.verify")).click());
      expect(verified.response.success).toBe(true);
      const grant = button(t("adminAdd.recipient.grant"));
      await grant.waitFor();
      await saveAdminViewMatrix(page, SHOTS, `grant-verified-${locale}`, async () => {
        await grant.waitFor();
      });

      // Step 2: amount, preview, submit.
      await grant.click();
      const amount = page.getByRole("spinbutton", { name: t("adminAdd.post.amount.label"), exact: true })
        .or(page.getByRole("textbox", { name: t("adminAdd.post.amount.label"), exact: true }))
        .filter({ visible: true }).first();
      await amount.fill("1234");
      const submit = button(t("adminAdd.post.submitButton.label"));
      await submit.waitFor();
      await saveAdminViewMatrix(page, SHOTS, `grant-amount-${locale}`, async () => {
        await submit.waitFor();
      });
      const granted = await capture(definitions.POST, () => submit.click());
      expect(granted.response.success).toBe(true);
      expect(granted.requestBody).toMatchObject({ targetUserId: userId, amount: 1234 });

      const packs = await db
        .select({ originalAmount: creditPacks.originalAmount, remaining: creditPacks.remaining, source: creditPacks.source })
        .from(creditPacks)
        .innerJoin(creditWallets, eq(creditWallets.id, creditPacks.walletId))
        .where(and(eq(creditWallets.userId, userId), eq(creditPacks.originalAmount, 1234)));
      expect(packs).toHaveLength(1);
      expect(packs[0]?.remaining).toBe(1234);

      const ledger = button(t("adminAdd.recipient.openLedger"));
      await ledger.waitFor();
      await saveAdminViewMatrix(page, SHOTS, `grant-done-${locale}`, async () => {
        await ledger.waitFor();
      });
    }, 420_000);
  }
});
