import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { scopedTranslation as company } from "@/companies/create/i18n";
import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as outreach } from "@/leads/outreach/i18n";
import { scopedTranslation as tracking } from "@/leads/tracking/i18n";

import { scopedTranslation as remote } from "../../../remote-connection/connect/i18n";

describe("Shared field description tooltips", () => {
  const e2e = useE2E("unified-ui/field-description-tooltips");

  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      `names description controls and inputs independently in ${locale}`,
      async (fixture) => {
        const { baseUrl, page } = fixture;
        await authAtlas(fixture, await resolveTestAdminUser());
        const { t: companyT } = company.scopedT(locale);
        const { t: remoteT } = remote.scopedT(locale);
        const { t: outreachT } = outreach.scopedT(locale);
        const { t: trackingT } = tracking.scopedT(locale);
        const cases = [
          {
            alias: "companies_create_POST",
            inputType: "tel",
            label: companyT("post.phone.label"),
            description: companyT("post.phone.description"),
          },
          {
            alias: "companies_create_POST",
            inputType: "url",
            label: companyT("post.website.label"),
            description: companyT("post.website.description"),
          },
          {
            alias: "record-engagement",
            inputType: "text",
            label: trackingT("post.campaignId.label"),
            description: trackingT("post.campaignId.description"),
          },
          {
            alias: "outreach-contact-upsert",
            // Localized date text input ("26 Nov 2026"); the time sits beside it.
            inputType: "text",
            label: outreachT("contact.post.fields.at.label"),
            description: outreachT("contact.post.fields.at.description"),
          },
        ];

        await page.goto(`${baseUrl}/${locale}/tools/remote-connect`, {
          waitUntil: "commit",
          timeout: 60_000,
        });
        const remoteUrl = page.getByLabel(remoteT("post.remoteUrl.label"), {
          exact: true,
        });
        await remoteUrl.waitFor();
        expect(await remoteUrl.getAttribute("type")).toBe("url");
        await page
          .getByText(remoteT("post.remoteUrl.description"), { exact: true })
          .waitFor();

        for (const sample of cases) {
          await page.goto(`${baseUrl}/${locale}/tools/${sample.alias}`, {
            waitUntil: "commit",
            timeout: 60_000,
          });
          const input = page.getByLabel(sample.label, { exact: true });
          await input.waitFor();
          expect(await input.getAttribute("type")).toBe(sample.inputType);

          const help = page.getByRole("button", {
            name: sample.description,
            exact: true,
          });
          await help.waitFor();
          expect(await help.getAttribute("type")).toBe("button");
          expect(
            await help.evaluate((button) => Boolean(button.closest("label"))),
          ).toBe(false);

          await help.focus();
          const tooltip = page.getByRole("tooltip");
          await tooltip.waitFor();
          expect(await tooltip.textContent()).toBe(sample.description);
          await help.press("Escape");
          await tooltip.waitFor({ state: "hidden" });
        }
      },
    );
  }
});
