import { and, eq } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import {
  emailCampaigns,
  leadEngagements,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
  EngagementTypes,
  LeadSource,
  LeadStatus,
} from "next-vibe/identity/lead/enum";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import {
  type E2EFixtures,
  useE2E,
} from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import attribution from "@/leads/attribution/definition";
import { scopedTranslation as attributionTranslation } from "@/leads/attribution/i18n";
import { GeoUpdateStatus } from "@/leads/geo/enum";
import { scopedTranslation as geoTranslation } from "@/leads/geo/i18n";
import geoUpdate from "@/leads/geo/update/definition";
import { MessageStatus } from "@/messenger/messages/enum";

import { scopedTranslation } from "./i18n";

const locale = "en-US";

async function seedLead(fixture: E2EFixtures): Promise<string> {
  const id = crypto.randomUUID();
  fixture.cleanup(async () => {
    await db.delete(leads).where(eq(leads.id, id));
  });
  await db.insert(leads).values({
    id,
    email: fixture.uniqueEmail("tracking"),
    contactName: "River Mitchell",
    businessName: "Studio Books",
    country: Countries.GLOBAL,
    language: Languages.EN,
    status: LeadStatus.NEW,
    source: LeadSource.WEBSITE,
  });
  await authAtlas(fixture, await resolveTestAdminUser());
  return id;
}

describe("E2E: lead tracking and attribution administration", () => {
  const e2e = useE2E("leads/tracking-admin");

  e2e.it(
    "records a selected event and opens the lead record",
    async (fixture) => {
      const { page } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const id = await seedLead(fixture);
      await fixture.goto(`/tools/record-engagement?arg.leadId=${id}`, locale);
      await page
        .getByRole("combobox", {
          name: t("post.engagementType.label"),
          exact: true,
        })
        .click();
      await page
        .getByRole("option", {
          name: t(EngagementTypes.FORM_SUBMIT),
          exact: true,
        })
        .click();
      const [response] = await Promise.all([
        page.waitForResponse((candidate) => {
          const request = candidate.request();
          return (
            new URL(candidate.url()).pathname ===
              `/api/${locale}/leads/tracking` &&
            request.method() === "POST" &&
            request.postDataJSON()?.engagementType ===
              EngagementTypes.FORM_SUBMIT
          );
        }),
        page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
      ]);
      expect(await response.json()).toMatchObject({
        success: true,
        data: {
          responseLeadId: id,
          responseEngagementType: EngagementTypes.FORM_SUBMIT,
          relationshipEstablished: false,
        },
      });
      await page
        .getByText(t("widget.post.successTitle"), { exact: true })
        .waitFor();
      const [event] = await db
        .select()
        .from(leadEngagements)
        .where(
          and(
            eq(leadEngagements.leadId, id),
            eq(leadEngagements.engagementType, EngagementTypes.FORM_SUBMIT),
          ),
        );
      expect(event?.id).toBeDefined();
      expect(
        await db
          .select()
          .from(userLeadLinks)
          .where(eq(userLeadLinks.leadId, id)),
      ).toHaveLength(0);
      expect(await page.getByText(id, { exact: true }).count()).toBe(0);
      await saveAdminReviewScreenshots(page, "record-engagement", locale);
      await page
        .getByRole("button", {
          name: t("widget.post.viewLeadButton"),
          exact: true,
        })
        .click();
      await page
        .getByRole("heading", { name: "Studio Books", exact: true })
        .waitFor();
    },
  );

  e2e.it(
    "records a click and opens the verified destination",
    async (fixture) => {
      const { page } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const id = await seedLead(fixture);
      const campaign = crypto.randomUUID();
      const sentAt = new Date();
      await db.insert(emailCampaigns).values({
        id: campaign,
        leadId: id,
        stage: EmailCampaignStage.INITIAL,
        journeyVariant: EmailJourneyVariant.QUIET_RECOMMENDATION,
        status: MessageStatus.SENT,
        subject: "Studio Books newsletter",
        templateName: "tracking-fixture",
        scheduledAt: sentAt,
        sentAt,
      });
      const destination = `/${locale}/story/newsletter`;
      await fixture.goto(`/tools/track-click?arg.leadId=${id}`, locale);
      await page
        .getByLabel(t("post.campaignId.label"), { exact: true })
        .fill(campaign);
      await page
        .getByLabel(t("get.url.label"), { exact: true })
        .fill(destination);
      const [response] = await Promise.all([
        page.waitForResponse((candidate) => {
          const url = new URL(candidate.url());
          return (
            url.pathname === `/api/${locale}/leads/tracking` &&
            candidate.request().method() === "GET" &&
            url.searchParams.get("url") === destination
          );
        }),
        page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
      ]);
      expect(await response.json()).toMatchObject({
        success: true,
        data: {
          redirectUrl: destination,
          engagementRecorded: true,
          leadStatusUpdated: false,
        },
      });
      expect(
        await db
          .select()
          .from(userLeadLinks)
          .where(eq(userLeadLinks.leadId, id)),
      ).toHaveLength(0);
      const [event] = await db
        .select()
        .from(leadEngagements)
        .where(
          and(
            eq(leadEngagements.campaignId, campaign),
            eq(leadEngagements.engagementType, EngagementTypes.EMAIL_CLICK),
          ),
        );
      expect(event?.leadId).toBe(id);
      const open = page.getByRole("button", {
        name: t("widget.get.openUrlButton"),
        exact: true,
      });
      await open.waitFor();
      await saveAdminReviewScreenshots(page, "track-click", locale);
      const [popup] = await Promise.all([
        page.waitForEvent("popup"),
        open.click(),
      ]);
      await popup.waitForURL((url) => url.pathname === destination);
      await popup.close();
    },
  );

  e2e.it(
    "previews IP matching without linking any records",
    async (fixture) => {
      const { page } = fixture;
      const { t } = attributionTranslation.scopedT(locale);
      await authAtlas(fixture, await resolveTestAdminUser());
      const path = `/api/${locale}/${attribution.POST.path.join("/")}`;
      await page.route(
        (url) => url.pathname === path,
        (route) =>
          route.request().postDataJSON()?.dryRun === true
            ? route.continue()
            : route.abort(),
      );
      await fixture.goto("/tools/ip-match-linking", locale);
      await page
        .getByLabel(t("post.fields.dryRun.label"), { exact: true })
        .setChecked(true);
      const [response] = await Promise.all([
        page.waitForResponse(
          (candidate) =>
            new URL(candidate.url()).pathname === path &&
            candidate.request().method() === "POST",
        ),
        page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
      ]);
      expect(await response.json()).toMatchObject({
        success: true,
        data: { pairsLinked: 0 },
      });
      await page
        .getByText(t("post.response.pairsLinked"), { exact: true })
        .waitFor();
      await saveAdminReviewScreenshots(page, "ip-match-linking", locale);
    },
  );

  e2e.it(
    "shows the saved result of a visitor country database update",
    async (fixture) => {
      const { page } = fixture;
      const { t } = geoTranslation.scopedT(locale);
      const release = geoUpdate.POST.responseSchema.parse(
        geoUpdate.POST.examples.responses?.default,
      );
      const path = `/api/${locale}/${geoUpdate.POST.path.join("/")}`;
      await page.route(
        (url) => url.pathname === path,
        (route) =>
          route.fulfill({
            json: {
              success: true,
              data: { ...release, status: GeoUpdateStatus.UPDATED },
            },
          }),
      );
      await authAtlas(fixture, await resolveTestAdminUser());
      await fixture.goto("/tools/geo-ip-update", locale);
      await page
        .getByLabel(t("update.post.fields.force.label"), { exact: true })
        .setChecked(true);
      const [request] = await Promise.all([
        page.waitForRequest(
          (candidate) =>
            new URL(candidate.url()).pathname === path &&
            candidate.method() === "POST",
        ),
        page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
      ]);
      expect(request.postDataJSON()).toMatchObject({ force: true });
      await page.getByText(release.version ?? "", { exact: true }).waitFor();
      await saveAdminReviewScreenshots(page, "geo-ip-update", locale);
    },
  );
});
