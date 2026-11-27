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

import { scopedTranslation } from "../config/i18n";
import { leadMagnetConfigs } from "../db";
import { LeadMagnetProviderDB } from "../enum";
import { scopedTranslation as providerTranslation } from "../i18n";
import acumbamail from "./acumbamail/definition";
import adobecampaign from "./adobecampaign/definition";
import cleverreach from "./cleverreach/definition";
import connectif from "./connectif/definition";
import datanext from "./datanext/definition";
import edrone from "./edrone/definition";
import emarsys from "./emarsys/definition";
import expertsender from "./expertsender/definition";
import freshmail from "./freshmail/definition";
import getresponse from "./getresponse/definition";
import klaviyo from "./klaviyo/definition";
import mailup from "./mailup/definition";
import mapp from "./mapp/definition";
import sailthru from "./sailthru/definition";
import salesmanago from "./salesmanago/definition";
import shopify from "./shopify/definition";
import spotler from "./spotler/definition";
import youlead from "./youlead/definition";

const groups = [
  {
    ACUMBAMAIL: acumbamail.POST,
    ADOBECAMPAIGN: adobecampaign.POST,
    CLEVERREACH: cleverreach.POST,
    CONNECTIF: connectif.POST,
    DATANEXT: datanext.POST,
    EDRONE: edrone.POST,
  },
  {
    EMARSYS: emarsys.POST,
    EXPERTSENDER: expertsender.POST,
    FRESHMAIL: freshmail.POST,
    GETRESPONSE: getresponse.POST,
    KLAVIYO: klaviyo.POST,
    MAILUP: mailup.POST,
  },
  {
    MAPP: mapp.POST,
    SAILTHRU: sailthru.POST,
    SALESMANAGO: salesmanago.POST,
    SHOPIFY: shopify.POST,
    SPOTLER: spotler.POST,
    YOULEAD: youlead.POST,
  },
];

describe("Email provider settings", () => {
  const e2e = useE2E("lead-magnet/provider-settings");
  for (const locale of ["en-US", "de-DE"] as const) {
    for (const [index, group] of groups.entries()) {
      e2e.it(`saves inactive provider settings in ${locale}, group ${index + 1}`, async (fixture) => {
        let userId: string | undefined;
        fixture.cleanup(async () => {
          if (userId) {
            await db.delete(leadMagnetConfigs).where(eq(leadMagnetConfigs.userId, userId));
            await deleteTestUser(userId);
          }
        });
        const account = await createTestUser(fixture.uniqueEmail("email-provider"));
        expect(account.success).toBe(true);
        if (!account.success) {
          return;
        }
        const { page } = fixture;
        const { user } = account.data;
        userId = user.id;
        await authAtlas(fixture, user);
        await fixture.goto("/tools/lead-magnet/config/GET", locale);

        const { t } = scopedTranslation.scopedT(locale);
        const { t: providerT } = providerTranslation.scopedT(locale);
        const selector = page.getByRole("combobox", {
          name: t("widget.choosePlatform"),
          exact: true,
        }).or(page.getByRole("combobox", {
          name: t("widget.switchPlatform"),
          exact: true,
        }));
        for (const [provider, endpoint] of Object.entries(group)) {
          const example = endpoint.examples.requests?.default;
          expect(example).toBeDefined();
          const providerKey = LeadMagnetProviderDB.find((name) => name === provider);
          expect(providerKey).toBeDefined();
          if (!providerKey) {
            continue;
          }
          const path = `/${endpoint.path.join("/")}`;
          await selector.click();
          await page.getByRole("option", {
            name: t(`widget.providers.${providerKey}`),
            exact: true,
          }).click();
          const save = page.getByTestId("endpoint-submit").filter({ visible: true });
          await save.waitFor();

          const sharedFields = ["headline", "buttonText", "listId"];
          const credentials: Record<string, string> = {};
          for (const [key, value] of Object.entries(example ?? {})) {
            if (typeof value === "string" && value !== "") {
              await page.locator(`input[name="${key}"]`).fill(value);
              if (!sharedFields.includes(key)) {
                credentials[key] = value;
              }
            }
          }
          const active = page.getByRole("checkbox", {
            name: providerT("providers.shared.isActive.label"),
          });
          if (await active.isChecked()) {
            await active.click();
          }
          await saveAdminReviewScreenshots(
            page,
            `${endpoint.path.join("_")}_POST`,
            locale,
          );
          const [response] = await Promise.all([
            page.waitForResponse((result) =>
              new URL(result.url()).pathname.endsWith(path) &&
              result.request().method() === "POST",
            ),
            save.click(),
          ]);
          expect(response.ok()).toBe(true);
          expect(await response.json()).toMatchObject({
            success: true,
            data: { provider, isActiveResponse: false },
          });
          const [record] = await db.select()
            .from(leadMagnetConfigs)
            .where(eq(leadMagnetConfigs.userId, user.id));
          expect(record).toMatchObject({ provider, isActive: false, credentials });
          expect(record?.credentials).toEqual(credentials);
          await page.getByText(t("widget.inactive"), { exact: true }).first().waitFor();
        }
      });
    }
  }
});
