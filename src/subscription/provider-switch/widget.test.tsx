import { expect, it, mock } from "bun:test";
import { Methods } from "next-vibe/core/definition/enums";
import { renderToStaticMarkup } from "react-dom/server";

import { PaymentProvider } from "../../payment/enum";
import { BillingInterval, SubscriptionPlan } from "../enum";
import definitions from "./definition";
import { SwitchCarryOver, SwitchOfferState } from "./enum";

type Offer = (typeof definitions.GET)["types"]["ResponseOutput"];

let response: Offer | null = null;

const available: Offer = {
  offer: SwitchOfferState.AVAILABLE,
  targetProvider: PaymentProvider.NOWPAYMENTS,
  plan: SubscriptionPlan.PLUS,
  billingInterval: BillingInterval.MONTHLY,
  pastDue: false,
  deadline: new Date("2026-12-15T00:00:00.000Z"),
  billingStartAt: new Date("2026-12-15T00:00:00.000Z"),
  firstPeriodEnd: new Date("2027-01-14T00:00:00.000Z"),
  carryOver: SwitchCarryOver.EXTEND_FIRST_PERIOD,
};

async function renderCard(): Promise<string> {
  const context = {
    ...(await import("next-vibe/unified-ui/_shared/use-widget-context")),
  };
  void mock.module("next-vibe/unified-ui/_shared/use-widget-context", () => ({
    ...context,
    useWidgetValue: () => response,
    useWidgetTranslation: () => (key: string) => key,
    useWidgetLocale: () => "en-US",
    useWidgetLogger: () => ({}),
    useWidgetUser: () => ({ id: "u", leadId: "l", roles: [], isPublic: false }),
    useWidgetEndpoint: () => ({ method: Methods.GET }),
  }));
  void mock.module("next-vibe/unified-ui/hooks/use-api-mutation", () => ({
    useApiMutation: () => ({ isPending: false, mutateAsync: () => undefined }),
  }));
  const { ProviderSwitchWidget } = await import("./widget");
  return renderToStaticMarkup(
    <ProviderSwitchWidget field={definitions.GET.fields} />,
  );
}

it("renders nothing while no switch provider is live", async () => {
  response = { offer: SwitchOfferState.NOT_ELIGIBLE, pastDue: false };
  const markup = await renderCard();
  expect(markup).not.toContain("widget.title");
  expect(markup).not.toContain("<button");
});

it("shows the move card with deadline, carry-over and one move button", async () => {
  response = available;
  const markup = await renderCard();
  expect(markup).toContain('id="move-plan"');
  expect(markup).toContain("widget.title");
  expect(markup).toContain("widget.deadline");
  expect(markup).toContain("widget.carryExtend");
  expect(markup).toContain("widget.cta");
  expect(markup).toContain("widget.noDoubleCharge");
  expect(markup.match(/<button\b[^>]*type="button"/g)).toHaveLength(1);
});

it("explains an unsupported plan without a move button", async () => {
  response = { ...available, offer: SwitchOfferState.PLAN_NOT_SUPPORTED };
  const markup = await renderCard();
  expect(markup).toContain("widget.unsupportedPlan");
  expect(markup).not.toContain("widget.cta");
  expect(markup).toContain("widget.otherOptions");
});

it("leads with the failed renewal for a past-due plan", async () => {
  response = { ...available, pastDue: true };
  const markup = await renderCard();
  expect(markup).toContain("widget.pastDue");
  expect(markup).not.toContain("widget.deadline");
});
