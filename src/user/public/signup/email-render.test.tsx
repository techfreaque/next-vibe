import { Buffer } from "node:buffer";

import { render } from "@react-email/render";
import { expect, spyOn, test } from "bun:test";
import { coreClientEnv } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { EMAIL_LOGO_FALLBACK_PATH } from "@/messenger/providers/email/smtp-client/email-logo";
import { SmtpSendingRepository } from "@/messenger/providers/email/smtp-client/sending/repository";

import { sendSignupChallenge } from "./confirmation-mail";
import { signupWelcomeEmailTemplate } from "./email";

const recipientEmail = "creator@example.invalid";
const locales: CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "fr-FR",
  "it-IT",
  "es-ES",
];
const logoUrl = new URL(
  EMAIL_LOGO_FALLBACK_PATH,
  coreClientEnv.NEXT_PUBLIC_APP_URL,
);

function expectUnclippedEmail(html: string): void {
  expect(html).toContain('src="cid:logo@unbottled.ai"');
  expect(html).not.toContain(logoUrl.href);
  expect(html).not.toContain("data:image/");
  expect(Buffer.byteLength(html, "utf8")).toBeLessThan(100_000);
}

function expectStyledWordmark(html: string): void {
  const row = html.match(
    /<tr><td style="vertical-align:middle"><img[^>]*src="cid:logo@unbottled\.ai"[^>]*\/><\/td><td style="vertical-align:middle;padding-left:6px"><strong style="([^"]+)">unbottled\.ai<\/strong><\/td><\/tr>/,
  );
  const style = row?.[1];
  expect(style).toContain("font-family:");
  expect(style).toContain("Helvetica, Arial, sans-serif");
  expect(style).toContain("font-size:16px");
  expect(style).toContain("font-weight:700");
  expect(style).toContain("color:#111827");
  expect(style).toContain("line-height:16px");
  expect(style).toContain("letter-spacing:-0.025em");
}

test.each(locales)(
  "signup confirmation fits within the email size limit in %s",
  async (locale) => {
    const messageId = "<signup-test@example.invalid>";
    let html = "";
    const send = spyOn(SmtpSendingRepository, "sendEmail").mockImplementation(
      async ({ html: renderedHtml }) => {
        html = renderedHtml;
        return success({
          messageId,
          accountId: "test-account",
          accountName: "Test account",
          accepted: [recipientEmail],
          rejected: [],
          response: "Accepted",
        });
      },
    );
    try {
      const result = await sendSignupChallenge(
        {
          email: recipientEmail,
          privateName: "Test Creator",
          leadId: "test-lead",
          subscribeToNewsletter: false,
        },
        { code: "123456", token: "test-token" },
        locale,
        createEndpointLogger(false, locale),
      );

      expect(result).toBe(messageId);
      expect(html).toContain("123456");
      expect(html).toContain(`/${locale}/user/signup?confirm=1#test-token`);
      expectUnclippedEmail(html);
      expectStyledWordmark(html);
    } finally {
      send.mockRestore();
    }
  },
);

test.each([recipientEmail, "creator@gmail.com"])(
  "signup welcome fits within the email size limit for %s",
  async (address) => {
    const {
      component: Welcome,
      exampleProps,
      scopedTranslation,
    } = signupWelcomeEmailTemplate;
    const html = await render(
      <Welcome
        props={exampleProps}
        t={scopedTranslation.scopedT("en-US").t}
        locale="en-US"
        recipientEmail={address}
        tracking={createTrackingContext("en-US", exampleProps.leadId)}
      />,
    );

    expectUnclippedEmail(html);
    expectStyledWordmark(html);
  },
);
