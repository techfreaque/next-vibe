import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { scopedTranslation as statusTranslation } from "next-vibe/identity/lead/i18n";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import createDefinition from "../create/definition";
import { scopedTranslation as createTranslation } from "../create/i18n";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("E2E: edit a lead", () => {
  const e2e = useE2E("leads/lead-edit");

  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(
      `creates, updates, and deletes a lead in ${locale}`,
      async (fixture) => {
        const email = fixture.uniqueEmail("lead-management");
        const businessName = "Fixture contact";
        const updatedName = "Fixture contact updated";
        fixture.cleanup(async () => {
          await db.delete(leads).where(eq(leads.email, email));
        });

        const { page } = fixture;
        const { t } = scopedTranslation.scopedT(locale);
        const { t: statusT } = statusTranslation.scopedT(locale);
        const { t: createT } = createTranslation.scopedT(locale);
        await authAtlas(fixture, await resolveTestAdminUser());
        await fixture.goto("/tools/leads/create/POST", locale);
        await page
          .getByRole("textbox", {
            name: createT("post.businessName.label"),
            exact: true,
          })
          .fill(businessName);
        await page
          .getByRole("textbox", {
            name: createT("post.email.label"),
            exact: true,
          })
          .fill(email);
        await page
          .getByRole("combobox", {
            name: createT("post.source.label"),
            exact: true,
          })
          .click();
        await page
          .getByRole("option", {
            name: createT(LeadSource.WEBSITE),
            exact: true,
          })
          .click();
        await saveAdminReviewScreenshots(page, "leads_create_POST", locale);
        const created = await fixture.capture(createDefinition.POST, () =>
          page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
        );
        expect(created.response.success).toBe(true);
        if (!created.response.success) {
          return;
        }
        const id = created.response.data.lead.summary.id;
        await page
          .getByRole("heading", { name: businessName, exact: true })
          .waitFor();
        await db
          .update(leads)
          .set({
            status: LeadStatus.IN_CONTACT,
            subscriptionConfirmedAt: new Date("2026-11-01T11:00:00Z"),
            metadata: { origin: "fixture" },
          })
          .where(eq(leads.id, id));

        await fixture.goto(`/tools/leads/[id]/PATCH?arg.id=${id}`, locale);
        const name = page.getByRole("textbox", {
          name: t("patch.businessName.label"),
          exact: true,
        });
        await name.waitFor();
        expect(await name.inputValue()).toBe(businessName);
        const save = page
          .getByTestId("endpoint-submit")
          .filter({ visible: true });
        await saveAdminReviewScreenshots(page, "leads_id_PATCH", locale);

        const advanced = page.getByRole("button", {
          name: t("widget.tabAdvanced"),
          exact: true,
        });
        await advanced.click();
        const confirmedAt = page.getByLabel(
          t("patch.subscriptionConfirmedAt.label"),
          {
            exact: true,
          },
        );
        expect(await confirmedAt.inputValue()).toMatch(
          /^2026-11-01T\d{2}:\d{2}$/u,
        );
        const metadata = page.getByRole("textbox", {
          name: t("patch.metadata.label"),
          exact: true,
        });
        await metadata.fill('{"origin":');
        expect(await metadata.inputValue()).toBe('{"origin":');
        expect(await save.isDisabled()).toBe(true);
        await metadata.fill('{"origin":"updated"}');
        expect(await save.isEnabled()).toBe(true);

        const status = page.getByRole("combobox", {
          name: t("patch.status.label"),
          exact: true,
        });
        await status.click();
        await page
          .getByRole("option", { name: statusT(LeadStatus.NEW), exact: true })
          .click();
        const rejected = await fixture.capture(definition.PATCH, () =>
          save.click(),
        );
        expect(rejected.response.success).toBe(false);
        const successMessage = page.getByText(t("patch.success.description"), {
          exact: true,
        });
        expect(await successMessage.count()).toBe(0);

        await status.click();
        await page
          .getByRole("option", {
            name: statusT(LeadStatus.IN_CONTACT),
            exact: true,
          })
          .click();
        await name.fill(updatedName);
        const updated = await fixture.capture(definition.PATCH, () =>
          save.click(),
        );
        expect(updated.response.success).toBe(true);
        await successMessage.waitFor();
        const [row] = await db
          .select({
            businessName: leads.businessName,
            metadata: leads.metadata,
          })
          .from(leads)
          .where(eq(leads.id, id));
        expect(row).toEqual({
          businessName: updatedName,
          metadata: { origin: "updated" },
        });

        await page
          .getByRole("button", { name: t("get.titleShort"), exact: true })
          .click();
        const heading = page.getByRole("heading", {
          name: updatedName,
          exact: true,
        });
        await heading.waitFor({ timeout: 60_000 });
        await saveAdminReviewScreenshots(page, "leads_id_GET", locale);
        await page
          .getByRole("button", { name: t("widget.more"), exact: true })
          .click();
        await page
          .getByRole("menuitem", { name: t("widget.delete"), exact: true })
          .click();
        const dialog = page.getByRole("dialog");
        await dialog.waitFor();
        await saveAdminReviewScreenshots(page, "leads_id_DELETE", locale);
        const removed = await fixture.capture(definition.DELETE, () =>
          dialog.getByTestId("endpoint-submit").click(),
        );
        expect(removed.response.success).toBe(true);
        await heading.waitFor({ state: "hidden" });
        expect(
          await db.select({ id: leads.id }).from(leads).where(eq(leads.id, id)),
        ).toEqual([]);
      },
    );
  }
});
