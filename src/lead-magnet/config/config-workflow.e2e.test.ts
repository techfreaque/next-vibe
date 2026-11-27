import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { leadMagnetConfigs } from "../db";
import { scopedTranslation as providerTranslation } from "../i18n";
import platformEmail from "../providers/platform-email/definition";
import configDefinition from "./definition";
import { scopedTranslation } from "./i18n";
import { LeadMagnetConfigRepository } from "./repository";

describe("E2E: email list configuration", () => {
  const e2e = useE2E("lead-magnet/config");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(
      `switches providers and disconnects in ${locale}`,
      async (fixture) => {
        const { page } = fixture;
        const email = fixture.uniqueEmail("email-list");
        const account = await createTestUser(email);
        expect(account.success).toBe(true);
        if (!account.success) {
          return;
        }
        const { user } = account.data;
        fixture.cleanup(() => deleteTestUser(user.id));

        const [seed] = await db
          .insert(leadMagnetConfigs)
          .values({
            userId: user.id,
            provider: "SHOPIFY",
            credentials: {
              shopifyDomain: "fixture.myshopify.com",
              shopifyAccessToken: "fixture-shopify-token",
              googleAccessToken: "fixture-google-access",
              googleRefreshToken: "fixture-google-refresh",
            },
            listId: "fixture-list",
            isActive: false,
          })
          .returning({ id: leadMagnetConfigs.id });
        const config = await LeadMagnetConfigRepository.getConfig(user.id);
        expect(config).toMatchObject({
          success: true,
          data: {
            config: {
              publicCredentials: { shopifyDomain: "fixture.myshopify.com" },
            },
          },
        });
        if (config.success) {
          expect(config.data.config?.publicCredentials).toEqual({
            shopifyDomain: "fixture.myshopify.com",
          });
        }

        const { t } = scopedTranslation.scopedT(locale);
        const providerT = providerTranslation.scopedT(locale).t;
        await authAtlas(fixture, user);
        await fixture.goto("/tools/lead-magnet/config/GET", locale);
        const providerSelector = page.getByRole("combobox", {
          name: t("widget.switchPlatform"),
          exact: true,
        });
        const shopify = page.getByRole("textbox", {
          name: providerT("providers.shopify.shopifyDomain.label"),
          exact: true,
        });
        await shopify.waitFor();
        expect(await shopify.inputValue()).toBe("fixture.myshopify.com");
        await saveAdminReviewScreenshots(
          page,
          "lead-magnet_config_GET",
          locale,
        );

        await providerSelector.click();
        await page
          .getByRole("option", {
            name: t("widget.providers.PLATFORM_EMAIL"),
            exact: true,
          })
          .click();
        const address = page.getByRole("textbox", {
          name: providerT("providers.platformEmail.notifyEmail.label"),
          exact: true,
        });
        expect(await address.inputValue()).toBe("");
        await address.fill(email);
        await page
          .getByRole("textbox", {
            name: providerT("providers.platformEmail.notifyEmailName.label"),
            exact: true,
          })
          .fill("Fixture recipient");
        const save = page
          .getByTestId("endpoint-submit")
          .filter({ visible: true });
        await saveAdminReviewScreenshots(
          page,
          "lead-magnet_providers_platform-email_POST",
          locale,
        );
        const saved = await fixture.capture(platformEmail.POST, () =>
          save.click(),
        );
        expect(saved.response.success).toBe(true);
        const [updated] = await db
          .select({
            provider: leadMagnetConfigs.provider,
            credentials: leadMagnetConfigs.credentials,
          })
          .from(leadMagnetConfigs)
          .where(eq(leadMagnetConfigs.id, seed.id));
        expect(updated?.provider).toBe("PLATFORM_EMAIL");
        expect(updated?.credentials).toEqual({
          notifyEmail: email,
          notifyEmailName: "Fixture recipient",
        });

        const disconnect = page.getByRole("button", {
          name: t("widget.delete"),
          exact: true,
        });
        await disconnect.click();
        const dialog = page.getByRole("alertdialog", {
          name: t("widget.confirmDelete.title", {
            provider: t("widget.providers.PLATFORM_EMAIL"),
          }),
        });
        await dialog.waitFor();
        await saveAdminReviewScreenshots(
          page,
          "lead-magnet_config_DELETE",
          locale,
        );
        await dialog
          .getByRole("button", { name: t("widget.confirmDelete.cancel") })
          .click();
        expect(await findConfigIds(user.id)).toEqual([seed.id]);

        await disconnect.click();
        const removed = await fixture.capture(configDefinition.DELETE, () =>
          dialog
            .getByRole("button", { name: t("widget.confirmDelete.proceed") })
            .click(),
        );
        expect(removed.response.success).toBe(true);
        await page
          .getByRole("combobox", {
            name: t("widget.choosePlatform"),
            exact: true,
          })
          .waitFor();
        expect(await findConfigIds(user.id)).toEqual([]);
      },
    );
  }
});

async function findConfigIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ id: leadMagnetConfigs.id })
    .from(leadMagnetConfigs)
    .where(eq(leadMagnetConfigs.userId, userId));
  return rows.map(({ id }) => id);
}
