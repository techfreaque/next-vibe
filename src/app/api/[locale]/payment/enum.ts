/**
 * Payment enums
 * Defines the enums used in the payment module using createEnumOptions pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Payment provider enum
 * Supports Stripe and NOWPayments (crypto)
 */
export const {
  enum: PaymentProvider,
  options: PaymentProviderOptions,
  Value: PaymentProviderValue,
} = createEnumOptions({
  STRIPE: "app.api.payment.enums.paymentProvider.stripe",
  NOWPAYMENTS: "app.api.payment.enums.paymentProvider.nowpayments",
});

/**
 * Payment status enum
 * Tracks the lifecycle of payment transactions
 */
export const {
  enum: PaymentStatus,
  options: PaymentStatusOptions,
  Value: PaymentStatusValue,
} = createEnumOptions({
  PENDING: "app.api.payment.enums.paymentStatus.pending",
  PROCESSING: "app.api.payment.enums.paymentStatus.processing",
  SUCCEEDED: "app.api.payment.enums.paymentStatus.succeeded",
  FAILED: "app.api.payment.enums.paymentStatus.failed",
  CANCELED: "app.api.payment.enums.paymentStatus.canceled",
  REFUNDED: "app.api.payment.enums.paymentStatus.refunded",
});

/**
 * Payment method type enum
 * Supported payment method types
 */
export const {
  enum: PaymentMethodType,
  options: PaymentMethodTypeOptions,
  Value: PaymentMethodTypeValue,
} = createEnumOptions({
  CARD: "app.api.payment.enums.paymentMethodType.card",
  BANK_TRANSFER: "app.api.payment.enums.paymentMethodType.bankTransfer",
  PAYPAL: "app.api.payment.enums.paymentMethodType.paypal",
  APPLE_PAY: "app.api.payment.enums.paymentMethodType.applePay",
  GOOGLE_PAY: "app.api.payment.enums.paymentMethodType.googlePay",
  SEPA_DEBIT: "app.api.payment.enums.paymentMethodType.sepaDebit",
});

/**
 * Payment intent status enum
 * Stripe payment intent statuses
 */
export const {
  enum: PaymentIntentStatus,
  options: PaymentIntentStatusOptions,
  Value: PaymentIntentStatusValue,
} = createEnumOptions({
  REQUIRES_PAYMENT_METHOD: "app.api.payment.enums.paymentIntentStatus.requiresPaymentMethod",
  REQUIRES_CONFIRMATION: "app.api.payment.enums.paymentIntentStatus.requiresConfirmation",
  REQUIRES_ACTION: "app.api.payment.enums.paymentIntentStatus.requiresAction",
  PROCESSING: "app.api.payment.enums.paymentIntentStatus.processing",
  REQUIRES_CAPTURE: "app.api.payment.enums.paymentIntentStatus.requiresCapture",
  CANCELED: "app.api.payment.enums.paymentIntentStatus.canceled",
  SUCCEEDED: "app.api.payment.enums.paymentIntentStatus.succeeded",
});

/**
 * Checkout session mode enum
 * Stripe checkout session modes
 */
export const {
  enum: CheckoutMode,
  options: CheckoutModeOptions,
  Value: CheckoutModeValue,
} = createEnumOptions({
  PAYMENT: "app.api.payment.enums.checkoutMode.payment",
  SUBSCRIPTION: "app.api.payment.enums.checkoutMode.subscription",
  SETUP: "app.api.payment.enums.checkoutMode.setup",
});

/**
 * Refund status enum
 * Tracks refund lifecycle
 */
export const {
  enum: RefundStatus,
  options: RefundStatusOptions,
  Value: RefundStatusValue,
} = createEnumOptions({
  PENDING: "app.api.payment.enums.refundStatus.pending",
  SUCCEEDED: "app.api.payment.enums.refundStatus.succeeded",
  FAILED: "app.api.payment.enums.refundStatus.failed",
  CANCELED: "app.api.payment.enums.refundStatus.canceled",
});

/**
 * Dispute status enum
 * Tracks dispute/chargeback lifecycle
 */
export const {
  enum: DisputeStatus,
  options: DisputeStatusOptions,
  Value: DisputeStatusValue,
} = createEnumOptions({
  WARNING_NEEDS_RESPONSE: "app.api.payment.enums.disputeStatus.warningNeedsResponse",
  WARNING_UNDER_REVIEW: "app.api.payment.enums.disputeStatus.warningUnderReview",
  WARNING_CLOSED: "app.api.payment.enums.disputeStatus.warningClosed",
  NEEDS_RESPONSE: "app.api.payment.enums.disputeStatus.needsResponse",
  UNDER_REVIEW: "app.api.payment.enums.disputeStatus.underReview",
  CHARGE_REFUNDED: "app.api.payment.enums.disputeStatus.chargeRefunded",
  WON: "app.api.payment.enums.disputeStatus.won",
  LOST: "app.api.payment.enums.disputeStatus.lost",
});

/**
 * Invoice status enum
 * Tracks invoice lifecycle
 */
export const {
  enum: InvoiceStatus,
  options: InvoiceStatusOptions,
  Value: InvoiceStatusValue,
} = createEnumOptions({
  DRAFT: "app.api.payment.enums.invoiceStatus.draft",
  OPEN: "app.api.payment.enums.invoiceStatus.open",
  PAID: "app.api.payment.enums.invoiceStatus.paid",
  VOID: "app.api.payment.enums.invoiceStatus.void",
  UNCOLLECTIBLE: "app.api.payment.enums.invoiceStatus.uncollectible",
});

/**
 * Tax calculation status enum
 */
export const {
  enum: TaxStatus,
  options: TaxStatusOptions,
  Value: TaxStatusValue,
} = createEnumOptions({
  COMPLETE: "app.api.payment.enums.taxStatus.complete",
  FAILED: "app.api.payment.enums.taxStatus.failed",
  REQUIRES_LOCATION: "app.api.payment.enums.taxStatus.requiresLocation",
});

// Create DB enum arrays for Drizzle
export const PaymentProviderDB = [PaymentProvider.STRIPE, PaymentProvider.NOWPAYMENTS] as const;

export const PaymentStatusDB = [
  PaymentStatus.PENDING,
  PaymentStatus.PROCESSING,
  PaymentStatus.SUCCEEDED,
  PaymentStatus.FAILED,
  PaymentStatus.CANCELED,
  PaymentStatus.REFUNDED,
] as const;

export const PaymentMethodTypeDB = [
  PaymentMethodType.CARD,
  PaymentMethodType.BANK_TRANSFER,
  PaymentMethodType.PAYPAL,
  PaymentMethodType.APPLE_PAY,
  PaymentMethodType.GOOGLE_PAY,
  PaymentMethodType.SEPA_DEBIT,
] as const;

export const PaymentIntentStatusDB = [
  PaymentIntentStatus.REQUIRES_PAYMENT_METHOD,
  PaymentIntentStatus.REQUIRES_CONFIRMATION,
  PaymentIntentStatus.REQUIRES_ACTION,
  PaymentIntentStatus.PROCESSING,
  PaymentIntentStatus.REQUIRES_CAPTURE,
  PaymentIntentStatus.CANCELED,
  PaymentIntentStatus.SUCCEEDED,
] as const;

export const CheckoutModeDB = [
  CheckoutMode.PAYMENT,
  CheckoutMode.SUBSCRIPTION,
  CheckoutMode.SETUP,
] as const;

export const RefundStatusDB = [
  RefundStatus.PENDING,
  RefundStatus.SUCCEEDED,
  RefundStatus.FAILED,
  RefundStatus.CANCELED,
] as const;

export const DisputeStatusDB = [
  DisputeStatus.WARNING_NEEDS_RESPONSE,
  DisputeStatus.WARNING_UNDER_REVIEW,
  DisputeStatus.WARNING_CLOSED,
  DisputeStatus.NEEDS_RESPONSE,
  DisputeStatus.UNDER_REVIEW,
  DisputeStatus.CHARGE_REFUNDED,
  DisputeStatus.WON,
  DisputeStatus.LOST,
] as const;

export const InvoiceStatusDB = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.OPEN,
  InvoiceStatus.PAID,
  InvoiceStatus.VOID,
  InvoiceStatus.UNCOLLECTIBLE,
] as const;

export const TaxStatusDB = [
  TaxStatus.COMPLETE,
  TaxStatus.FAILED,
  TaxStatus.REQUIRES_LOCATION,
] as const;
