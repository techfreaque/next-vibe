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
