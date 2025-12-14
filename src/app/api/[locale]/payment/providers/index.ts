/**
 * Payment Provider Registry
 */

import { NOWPaymentsProvider } from "./nowpayments/repository";
import { StripeProvider } from "./stripe/repository";
import type { PaymentProvider } from "./types";

export * from "./types";

const providers = new Map<string, PaymentProvider>();

// Register payment providers
providers.set("stripe", new StripeProvider());
providers.set("nowpayments", new NOWPaymentsProvider());

export function getPaymentProvider(name = "stripe"): PaymentProvider {
  const provider = providers.get(name);
  if (!provider) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error, oxlint-plugin-restricted/restricted-syntax
    throw new Error(`Payment provider "${name}" not found`);
  }
  return provider;
}

export function registerPaymentProvider(provider: PaymentProvider): void {
  providers.set(provider.name, provider);
}
