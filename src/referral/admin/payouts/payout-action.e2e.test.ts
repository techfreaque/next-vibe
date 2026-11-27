import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { type E2EFixtures, useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { PayoutAction } from "@/subscription/admin/enum";
import subscription from "@/subscription/admin/referrals/definition";
import { scopedTranslation as subscriptionTranslation } from "@/subscription/admin/referrals/i18n";

import { payoutRequests } from "../../db";
import { PayoutCurrency, PayoutStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import definition from "./definition";

async function seedPendingPayout(fixture: E2EFixtures): Promise<string> {
  const id = randomUUID();
  const admin = await resolveTestAdminUser();
  fixture.cleanup(async () => {
    await db.delete(payoutRequests).where(eq(payoutRequests.id, id));
  });
  await db.insert(payoutRequests).values({
    id,
    userId: admin.id,
    amountCents: 0,
    currency: PayoutCurrency.CREDITS,
    status: PayoutStatus.PENDING,
  });
  await authAtlas(fixture, admin);
  return id;
}

describe("E2E: stand-alone payout review", () => {
  const e2e = useE2E("referral/admin/payout-action");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`releases a stuck credit payout in ${locale}`, async (fixture) => {
      const id = await seedPendingPayout(fixture);
      const { t } = scopedTranslation.scopedT(locale);
      const { page } = fixture;
      await fixture.goto(
        `/tools/referral/admin/payouts/POST?arg.requestId=${id}`,
        locale,
      );
      const actions = page.getByRole("combobox", {
        name: t("admin.payouts.fields.action.label"),
        exact: true,
      });
      await actions.click();
      const choices = page.getByRole("option");
      expect(await choices.count()).toBe(1);
      await choices
        .getByText(t("admin.payouts.widget.reject"), { exact: true })
        .click();
      const reason = page.getByRole("textbox", {
        name: t("admin.payouts.fields.rejectionReason.label"),
        exact: true,
      });
      await reason.fill("Fixture payout rejection");
      await saveAdminReviewScreenshots(
        page,
        "referral_admin_payouts_POST",
        locale,
      );
      const submit = page
        .getByTestId("endpoint-submit")
        .filter({ visible: true });
      const saved = await fixture.capture(definition.POST, () =>
        submit.click(),
      );
      expect(saved.response.success).toBe(true);
      await page
        .getByText(t("admin.payouts.widget.actionSaved"), { exact: true })
        .waitFor();
      const [row] = await db
        .select({
          status: payoutRequests.status,
          rejectionReason: payoutRequests.rejectionReason,
        })
        .from(payoutRequests)
        .where(eq(payoutRequests.id, id));
      expect(row).toEqual({
        status: PayoutStatus.REJECTED,
        rejectionReason: "Fixture payout rejection",
      });
    });

    e2e.it(`rejects a subscription referral payout in ${locale}`, async (fixture) => {
      const id = await seedPendingPayout(fixture);
      const { t } = subscriptionTranslation.scopedT(locale);
      const { page } = fixture;
      await fixture.goto(
        `/tools/subscription/admin/referrals/POST?arg.requestId=${id}`,
        locale,
      );
      await page
        .getByRole("combobox", { name: t("post.action.label"), exact: true })
        .click();
      await page
        .getByRole("option", { name: t(PayoutAction.REJECT), exact: true })
        .click();
      const rejectionReason = "Fixture subscription referral rejection";
      await page
        .getByRole("textbox", { name: t("post.rejectionReason.label"), exact: true })
        .fill(rejectionReason);
      await saveAdminReviewScreenshots(
        page,
        "subscription_admin_referrals_POST",
        locale,
      );
      const saved = await fixture.capture(subscription.POST, () =>
        page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
      );
      expect(saved.response).toMatchObject({
        success: true,
        data: { message: t("post.success.description") },
      });
      const [row] = await db
        .select({
          status: payoutRequests.status,
          rejectionReason: payoutRequests.rejectionReason,
        })
        .from(payoutRequests)
        .where(eq(payoutRequests.id, id));
      expect(row).toEqual({ status: PayoutStatus.REJECTED, rejectionReason });
    });
  }
});
