import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

import { render } from "@react-email/render";
import { expect, test } from "bun:test";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { getAllTemplateIds, getTemplate } from "@/generated/email/index";
import { emailRendererService } from "@/leads/campaigns/emails/services/renderer";
import { renderTemplateComponent } from "@/messenger/registry/template";

import { createTrackingContext } from "./components/tracking_context.email";

const locales: CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "fr-FR",
];
const recipientEmail = "recipient@example.invalid";

function expectCompactBody(html: string, templateId: string): void {
  expect(html, templateId).toContain('src="cid:logo@unbottled.ai"');
  expect(html, templateId).not.toContain("data:image/");
  expect(Buffer.byteLength(html, "utf8"), templateId).toBeLessThan(100_000);
}

test.each(locales)(
  "registered email templates fit within the HTML limit in %s",
  async (locale) => {
    for (const id of getAllTemplateIds()) {
      const template = await getTemplate(id);
      assert(template, `Missing registered email template ${id}`);
      const jsx = renderTemplateComponent(template, {
        rawProps: template.exampleProps,
        locale,
        recipientEmail,
        tracking: createTrackingContext(locale, "test-lead"),
      });
      expectCompactBody(await render(jsx), id);
    }
  },
);

test.each(locales)(
  "campaign email templates fit within the HTML limit in %s",
  async (locale) => {
    for (const journey of emailRendererService.getAvailableJourneys()) {
      for (const stage of emailRendererService.getAvailableStages(journey)) {
        const id = `${journey}/${stage}`;
        const email = await emailRendererService.generatePreview(
          journey,
          stage,
          {
            locale,
            companyName: "Test Company",
            companyEmail: recipientEmail,
          },
        );
        assert(email, `Missing campaign email template ${id}`);
        expectCompactBody(await render(email.jsx), id);
      }
    }
  },
);
