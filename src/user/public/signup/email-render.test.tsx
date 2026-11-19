import { Buffer } from "node:buffer";

import { render } from "@react-email/render";
import { expect, spyOn, test } from "bun:test";
import { coreClientEnv } from "next-vibe/core/env-client";
import { success } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { SmtpSendingRepository } from "@/messenger/providers/email/smtp-client/sending/repository";

import { sendSignupChallenge } from "./confirmation-mail";
import { signupWelcomeEmailTemplate } from "./email";

const locale = "en-US";
const recipientEmail = "creator@example.invalid";
const logoUrl = new URL(
  "/images/unbottled-icon.png",
  coreClientEnv.NEXT_PUBLIC_APP_URL,
);

function expectUnclippedEmail(html: string): void {
  expect(html).toContain(`src="${logoUrl.href}"`);
  expect(html).not.toContain("data:image/");
  expect(Buffer.byteLength(html, "utf8")).toBeLessThan(100_000);
}

test("signup confirmation keeps the code and link within the email size limit", async () => {
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
    expect(html).toContain("/en-US/user/signup?confirm=1#test-token");
    expectUnclippedEmail(html);
  } finally {
    send.mockRestore();
  }
});

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
        t={scopedTranslation.scopedT(locale).t}
        locale={locale}
        recipientEmail={address}
        tracking={createTrackingContext(locale, exampleProps.leadId)}
      />,
    );

    expectUnclippedEmail(html);
  },
);
