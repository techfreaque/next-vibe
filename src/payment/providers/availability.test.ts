import { createEndpointLogger } from "next-vibe/logger/server";
import Stripe from "stripe";
import { afterEach, expect, it, vi } from "vitest";

import { PaymentProvider } from "../enum";
import {
  checkCheckoutProviderAvailable,
  getCheckoutProviders,
  resetCheckoutAvailabilityCache,
  resolveCheckoutProviders,
  stripeKeyMode,
} from "./availability";
import { StripeProvider } from "./stripe/repository";

type StripeHttpRequest = InstanceType<typeof Stripe.HttpClient>["makeRequest"];

function fakeStripe(account: { charges_enabled: boolean } | "error"): {
  stripe: Stripe;
  calls: () => number;
} {
  let count = 0;
  const stripe = new Stripe("sk_test_availability_fixture", {
    maxNetworkRetries: 0,
    httpClient: {
      getClientName: (): string => "availability-fixture",
      async makeRequest(): ReturnType<StripeHttpRequest> {
        count += 1;
        const failed = account === "error";
        const response = failed
          ? { error: { type: "api_error", message: "fixture outage" } }
          : { id: "acct_fixture", object: "account", ...account };
        return {
          getStatusCode: (): number => (failed ? 500 : 200),
          getHeaders: (): Record<string, string> => ({}),
          getRawResponse: (): typeof response => response,
          toStream: (): null => null,
          toJSON: async (): Promise<typeof response> => response,
        };
      },
    },
  });
  return { stripe, calls: () => count };
}

const logger = createEndpointLogger(false, "en-GLOBAL");

afterEach(() => {
  vi.restoreAllMocks();
  resetCheckoutAvailabilityCache();
});

it("drops Stripe when paused by env or when the account has charges disabled", () => {
  const all = [PaymentProvider.STRIPE, PaymentProvider.NOWPAYMENTS];
  const cryptoOnly = [PaymentProvider.NOWPAYMENTS];
  expect(
    resolveCheckoutProviders({ stripePaused: false, stripeChargesEnabled: true }),
  ).toEqual(all);
  expect(
    resolveCheckoutProviders({ stripePaused: false, stripeChargesEnabled: null }),
  ).toEqual(all);
  expect(
    resolveCheckoutProviders({
      stripePaused: false,
      stripeChargesEnabled: false,
    }),
  ).toEqual(cryptoOnly);
  expect(
    resolveCheckoutProviders({ stripePaused: true, stripeChargesEnabled: true }),
  ).toEqual(cryptoOnly);
});

it("refuses a Stripe checkout while the account reports charges disabled, and caches the check", async () => {
  const fake = fakeStripe({ charges_enabled: false });
  vi.spyOn(StripeProvider, "getStripe").mockReturnValue(fake.stripe);
  vi.spyOn(stripeKeyMode, "isTest").mockReturnValue(false);

  const refused = await checkCheckoutProviderAvailable(
    PaymentProvider.STRIPE,
    "en-GLOBAL",
    logger,
  );
  expect(refused?.success).toBe(false);
  expect(refused?.message).toContain("Card payments are paused");

  const crypto = await checkCheckoutProviderAvailable(
    PaymentProvider.NOWPAYMENTS,
    "en-GLOBAL",
    logger,
  );
  expect(crypto).toBeNull();
  // One account lookup serves both checks (5 min cache).
  expect(fake.calls()).toBe(1);
});

it("ignores the live account state with a test key", async () => {
  const fake = fakeStripe({ charges_enabled: false });
  vi.spyOn(StripeProvider, "getStripe").mockReturnValue(fake.stripe);
  vi.spyOn(stripeKeyMode, "isTest").mockReturnValue(true);
  expect(await getCheckoutProviders(logger)).toContain(PaymentProvider.STRIPE);
  expect(fake.calls()).toBe(0);
});

it("keeps Stripe on when the account is fine or the lookup fails", async () => {
  const healthy = fakeStripe({ charges_enabled: true });
  vi.spyOn(StripeProvider, "getStripe").mockReturnValue(healthy.stripe);
  expect(await getCheckoutProviders(logger)).toContain(PaymentProvider.STRIPE);

  resetCheckoutAvailabilityCache();
  vi.restoreAllMocks();
  const broken = fakeStripe("error");
  vi.spyOn(StripeProvider, "getStripe").mockReturnValue(broken.stripe);
  expect(await getCheckoutProviders(logger)).toContain(PaymentProvider.STRIPE);
});
