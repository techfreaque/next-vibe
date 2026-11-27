/**
 * Lifecycle journey mails render through the regular branded transactional
 * template (EmailTemplate): logo + wordmark header, the shared footer, the
 * opt-out line per mail type and the sender identification.
 */

import { Buffer } from "node:buffer";

import { expect, test } from "bun:test";

import { renderLifecycleEmail } from "./emails";
import type { LifecycleTemplateValue } from "./enum";
import { LifecycleTemplate } from "./enum";
import { scopedTranslation } from "./i18n";

const BASE_URL = "https://unbottled.ai";
const NOW = new Date("2026-11-27T12:00:00Z");
const TEMPLATES: (typeof LifecycleTemplateValue)[] = [
  LifecycleTemplate.FIRST_CHAT_PROMPTS,
  LifecycleTemplate.FIRST_CHAT_SKILLS,
  LifecycleTemplate.OUT_OF_CREDITS,
  LifecycleTemplate.PAYMENT_FAILED,
  LifecycleTemplate.CUSTOMER_LIKES,
  LifecycleTemplate.CUSTOMER_BUILD_NEXT,
  LifecycleTemplate.LAPSED_WINBACK,
  LifecycleTemplate.WHATS_NEW,
  LifecycleTemplate.WIN_BACK,
  LifecycleTemplate.INVITE_SIGNUP,
  LifecycleTemplate.INVITE_REMINDER,
];

test.each(TEMPLATES)("%s renders in the branded template", async (template) => {
  const { t } = scopedTranslation.scopedT("en-US");
  const mail = await renderLifecycleEmail({
    template,
    locale: "en-US",
    email: "jonas@example.invalid",
    leadId: null,
    userId: null,
    name: "Jonas",
    baseUrl: BASE_URL,
    lastActiveAt: new Date(NOW.getTime() - 9 * 86_400_000),
    marketingOk: true,
    graceEndsAt: new Date(NOW.getTime() + 7 * 86_400_000),
    now: NOW,
  });
  const { html } = mail;

  // Header: logo + wordmark row of EmailTemplate, title = subject.
  expect(html).toMatch(
    /<img[^>]*src="cid:logo@unbottled\.ai"[^>]*\/><\/td><td style="vertical-align:middle;padding-left:6px"><strong[^>]*>unbottled\.ai<\/strong>/,
  );
  expect(html.match(/<img\b/g)).toHaveLength(1); // logo only (no lead: no pixel)
  expect(html).toContain("All rights reserved.");
  expect(html).toContain("Legal notice");
  expect(html).not.toContain("data:image/");
  expect(Buffer.byteLength(html, "utf8")).toBeLessThan(100_000);
  // CTA is an absolute link on the configured base URL (or a mailto).
  expect(
    mail.ctaUrl.startsWith(`${BASE_URL}/en-US/`) ||
      mail.ctaUrl.startsWith("mailto:"),
  ).toBe(true);

  if (template === LifecycleTemplate.PAYMENT_FAILED) {
    expect(mail.unsubscribeUrl).toBeNull();
    expect(html).toContain(t("emails.footerBilling"));
    expect(html).not.toContain("unsubscribe");
  } else {
    expect(mail.unsubscribeUrl).toContain("/story/newsletter/unsubscribe/");
    expect(html).toContain("unsubscribe");
  }
});
