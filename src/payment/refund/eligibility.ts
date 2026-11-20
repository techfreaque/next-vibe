import { CheckoutMode, PaymentProvider, PaymentStatus } from "../enum";

export function canStartStripeRefund(transaction: {
  provider: string;
  status: string;
  mode: string;
  amount: string | number;
  providerPaymentIntentId: string | null;
  providerSessionId: string | null;
}): boolean {
  const amount = Number(transaction.amount);
  return (
    transaction.provider === PaymentProvider.STRIPE &&
    transaction.status === PaymentStatus.SUCCEEDED &&
    transaction.mode !== CheckoutMode.SETUP &&
    Number.isFinite(amount) &&
    amount > 0 &&
    (transaction.providerPaymentIntentId?.startsWith("pi_") === true ||
      transaction.providerSessionId?.startsWith("cs_") === true)
  );
}
