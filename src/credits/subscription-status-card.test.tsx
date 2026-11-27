import { expect, it, mock } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { renderToStaticMarkup } from "react-dom/server";

import { PaymentProvider } from "@/payment/enum";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "@/subscription/enum";

void mock.module("@/payment/portal/hooks", () => ({
  useCustomerPortal: () => ({}),
}));

it("renders plan management as a non-submit action inside the checkout form", async () => {
  const { SubscriptionStatusCard } = await import("./subscription-status-card");
  const markup = renderToStaticMarkup(
    <form>
      <SubscriptionStatusCard
        locale={defaultLocale}
        user={{ id: "fixture-user", leadId: "fixture-lead", roles: [], isPublic: false }}
        logger={createEndpointLogger(false, defaultLocale)}
        initialSubscription={{
          hasSubscription: true,
          status: SubscriptionStatus.ACTIVE,
          billingInterval: BillingInterval.MONTHLY,
          plan: SubscriptionPlan.PLUS,
          provider: PaymentProvider.STRIPE,
        }}
      />
    </form>,
  );
  expect(markup.match(/<button\b[^>]*>/g)).toEqual([
    expect.stringContaining('type="button"'),
  ]);
});

it("shows the past-due notice with retry, pack and crypto paths", async () => {
  const { SubscriptionStatusCard } = await import("./subscription-status-card");
  const { scopedTranslation } = await import("@/subscription/i18n");
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const markup = renderToStaticMarkup(
    <SubscriptionStatusCard
      locale={defaultLocale}
      user={{ id: "fixture-user", leadId: "fixture-lead", roles: [], isPublic: false }}
      logger={createEndpointLogger(false, defaultLocale)}
      initialSubscription={{
        hasSubscription: true,
        status: SubscriptionStatus.PAST_DUE,
        billingInterval: BillingInterval.MONTHLY,
        plan: SubscriptionPlan.SUBSCRIPTION,
        provider: PaymentProvider.STRIPE,
        gracePeriodEndsAt: "2026-12-28T00:00:00.000Z",
        retryPaymentUrl: "https://invoice.stripe.com/i/fixture",
        cardCountry: "IN",
      }}
    />,
  );
  expect(markup).toContain(t("pastDue.title").replaceAll("'", "&#x27;"));
  expect(markup).toContain(t("pastDue.retry"));
  expect(markup).toContain(t("pastDue.buyPack"));
  expect(markup).toContain(t("pastDue.payCrypto"));
  expect(markup).toContain(`/${defaultLocale}/subscription/buy`);
  expect(markup).toContain(t("pastDue.indiaMandate").replaceAll("'", "&#x27;"));
  // Every button stays a non-submit action inside forms.
  for (const button of markup.match(/<button\b[^>]*>/g) ?? []) {
    expect(button).toContain('type="button"');
  }
});

it("shows the Indian e-mandate line only for Indian cards", async () => {
  const { SubscriptionPastDueNotice } = await import("@/subscription/past-due-notice");
  const { CheckoutCardTip } = await import("@/subscription/checkout-card-tip");
  const { scopedTranslation } = await import("@/subscription/i18n");
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const escape = (text: string): string => text.replaceAll("'", "&#x27;");
  const notice = (cardCountry: string | undefined): string =>
    renderToStaticMarkup(
      <SubscriptionPastDueNotice
        locale={defaultLocale}
        gracePeriodEndsAt={undefined}
        retryPaymentUrl={undefined}
        cardCountry={cardCountry}
        onUpdatePaymentMethod={() => undefined}
      />,
    );
  expect(notice("SG")).not.toContain(escape(t("pastDue.indiaMandate")));
  expect(notice(undefined)).toContain(escape(t("pastDue.reason")));
  const tip = (cardCountry: string | undefined): string =>
    renderToStaticMarkup(
      <CheckoutCardTip locale={defaultLocale} cardCountry={cardCountry} />,
    );
  expect(tip("IN")).toContain(escape(t("checkoutTip.india")));
  expect(tip("DE")).not.toContain(escape(t("checkoutTip.india")));
  expect(tip("DE")).toContain(escape(t("checkoutTip.body")));
});

it("renders the past-due notice and checkout tip in every locale without English fallback", async () => {
  const { SubscriptionPastDueNotice } = await import("@/subscription/past-due-notice");
  const { CheckoutCardTip } = await import("@/subscription/checkout-card-tip");
  const { scopedTranslation } = await import("@/subscription/i18n");
  const { t: enT } = scopedTranslation.scopedT(defaultLocale);
  const locales = ["de-DE", "pl-PL", "fr-FR", "it-IT", "es-ES", "sk-SK", "hi-IN"] as const;
  const keys = [
    "pastDue.title",
    "pastDue.reason",
    "pastDue.indiaMandate",
    "pastDue.retry",
    "pastDue.buyPack",
    "pastDue.payCrypto",
    "checkoutTip.title",
    "checkoutTip.body",
    "checkoutTip.india",
    "checkoutTip.other",
  ] as const;
  for (const locale of locales) {
    const { t } = scopedTranslation.scopedT(locale);
    for (const key of keys) {
      expect(t(key)).not.toBe(enT(key));
      expect(t(key)).not.toContain("—");
    }
    const markup =
      renderToStaticMarkup(
        <SubscriptionPastDueNotice
          locale={locale}
          gracePeriodEndsAt="2026-12-28T00:00:00.000Z"
          retryPaymentUrl={undefined}
          cardCountry="IN"
          onUpdatePaymentMethod={() => undefined}
        />,
      ) + renderToStaticMarkup(<CheckoutCardTip locale={locale} cardCountry="IN" />);
    expect(markup).not.toContain(enT("pastDue.retry"));
    expect(markup).not.toContain("{{date}}");
    // Western digits only (Hindi copy included).
    expect(markup).not.toMatch(/[०-९]/);
  }
});
