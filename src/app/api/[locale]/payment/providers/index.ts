/**
 * Payment Provider Registry
 */

import type { PaymentProviderValue } from "../enum";
import { PaymentProvider as PaymentProviderEnum } from "../enum";
import { NOWPaymentsProvider } from "./nowpayments/repository";
import { StripeProvider } from "./stripe/repository";
import type { PaymentProvider } from "./types";

export * from "./types";

const providers = new Map<typeof PaymentProviderValue, PaymentProvider>();

// Register payment providers using enum keys (matching DB-stored values)
providers.set(PaymentProviderEnum.STRIPE, new StripeProvider());
providers.set(PaymentProviderEnum.NOWPAYMENTS, new NOWPaymentsProvider());

export function getPaymentProvider(
  name: typeof PaymentProviderValue,
): PaymentProvider {
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
