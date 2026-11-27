import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { creditPacks, creditWallets } from "@/credits/db";
import { CreditPackType } from "@/credits/enum";
import { growthCampaignLinks } from "@/leads/growth/db";

import bonus from "./admin/code-bonus/definition";
import { scopedTranslation as bonusTranslation } from "./admin/code-bonus/i18n";
import { payoutRequests, referralCodes } from "./db";
import referral from "./definition";
import { PayoutCurrency, PayoutStatus } from "./enum";
import { scopedTranslation } from "./i18n";
import links from "./links/definition";
import { scopedTranslation as linksTranslation } from "./links/i18n";
import payout from "./payout/definition";

describe("E2E: referral operator actions", () => {
  const e2e = useE2E("referral/operator-actions");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(
      `creates a referral code and link, converts earnings, and sets a bonus in ${locale}`,
      async (fixture) => {
        const { page } = fixture;
        const { t } = scopedTranslation.scopedT(locale);
        const { t: linkT } = linksTranslation.scopedT(locale);
        const { t: bonusT } = bonusTranslation.scopedT(locale);
        let userId: string | undefined;
        fixture.cleanup(async () => {
          if (userId) {
            await db
              .delete(growthCampaignLinks)
              .where(eq(growthCampaignLinks.createdByUserId, userId));
            await deleteTestUser(userId);
          }
        });
        const created = await createTestUser(
          fixture.uniqueEmail("operator-referral"),
          "River Mitchell",
        );
        expect(created.success).toBe(true);
        if (!created.success) {
          return;
        }
        const { user } = created.data;
        userId = user.id;
        const code = `RIVER${user.id.slice(0, 6).toUpperCase()}`;
        const submit = page
          .getByTestId("endpoint-submit")
          .filter({ visible: true });
        await authAtlas(fixture, user);

        await fixture.goto("/tools/referral/POST", locale);
        const codeField = page.locator('input[name="fieldsGrid.code"]');
        await codeField.fill(code);
        await page
          .locator('input[name="fieldsGrid.label"]')
          .fill("River's community");
        await saveAdminReviewScreenshots(page, "referral_POST", locale);
        const codeResult = await fixture.capture(referral.POST, () =>
          submit.click(),
        );
        expect(codeResult.response.success).toBe(true);
        const [savedCode] = await db
          .select()
          .from(referralCodes)
          .where(eq(referralCodes.code, code));
        expect(savedCode?.ownerUserId).toBe(user.id);

        await fixture.goto("/tools/referral-link-create", locale);
        await page
          .getByLabel(linkT("post.fields.name.label"), { exact: true })
          .fill("Studio newsletter");
        await page
          .getByLabel(linkT("post.fields.source.label"), { exact: true })
          .fill("newsletter");
        await page
          .getByLabel(linkT("post.fields.campaign.label"), { exact: true })
          .fill("winter-release");
        await page
          .getByLabel(linkT("post.fields.code.label"), { exact: true })
          .fill(code);
        await saveAdminReviewScreenshots(page, "referral-link-create", locale);
        const link = await fixture.capture(links.POST, () => submit.click());
        expect(link.response).toMatchObject({
          success: true,
          data: { refCode: code },
        });
        const [savedLink] = await db
          .select()
          .from(growthCampaignLinks)
          .where(
            and(
              eq(growthCampaignLinks.createdByUserId, user.id),
              eq(growthCampaignLinks.name, "Studio newsletter"),
            ),
          );
        expect(savedLink?.campaign).toBe("winter-release");
        expect(savedLink?.refCode).toBe(code);

        const [wallet] = await db
          .insert(creditWallets)
          .values({ userId: user.id, balance: 5000, freeCreditsRemaining: 0 })
          .onConflictDoUpdate({
            target: creditWallets.userId,
            set: { balance: 5000 },
          })
          .returning({ id: creditWallets.id });
        await db.insert(creditPacks).values({
          walletId: wallet.id,
          type: CreditPackType.EARNED,
          originalAmount: 5000,
          remaining: 5000,
        });
        await fixture.goto("/tools/referral/payout/POST", locale);
        await page
          .getByLabel(t("payout.fields.amountCents.label"), { exact: true })
          .fill("4500");
        await page
          .getByRole("combobox", {
            name: t("payout.fields.currency.label"),
            exact: true,
          })
          .click();
        await page
          .getByRole("option", { name: t(PayoutCurrency.CREDITS), exact: true })
          .click();
        await saveAdminReviewScreenshots(page, "referral_payout_POST", locale);
        const request = await fixture.capture(payout.POST, () =>
          submit.click(),
        );
        expect(request.response.success).toBe(true);
        const [savedPayout] = await db
          .select()
          .from(payoutRequests)
          .where(eq(payoutRequests.userId, user.id));
        expect(savedPayout).toMatchObject({
          amountCents: 4500,
          currency: PayoutCurrency.CREDITS,
          status: PayoutStatus.COMPLETED,
        });

        await authAtlas(fixture, await resolveTestAdminUser());
        await fixture.goto("/tools/referral-code-bonus", locale);
        await page
          .getByLabel(bonusT("post.fields.code.label"), { exact: true })
          .fill(code);
        await page
          .getByLabel(bonusT("post.fields.bonusCredits.label"), { exact: true })
          .fill("100");
        await saveAdminReviewScreenshots(page, "referral-code-bonus", locale);
        const updatedBonus = await fixture.capture(bonus.POST, () =>
          submit.click(),
        );
        expect(updatedBonus.response).toMatchObject({
          success: true,
          data: { subscriptionBonusCredits: 100 },
        });
        const [savedBonus] = await db
          .select({ bonus: referralCodes.subscriptionBonusCredits })
          .from(referralCodes)
          .where(eq(referralCodes.code, code));
        expect(savedBonus?.bonus).toBe(100);
      },
      180_000,
    );
  }
});
