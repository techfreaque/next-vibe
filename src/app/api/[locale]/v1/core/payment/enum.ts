/**
 * Payment enums
 * Defines the enums used in the payment module using createEnumOptions pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

/**
 * Payment provider enum
 * Currently only Stripe is supported
 */
export const {
  enum: PaymentProvider,
  options: PaymentProviderOptions,
  Value: PaymentProviderValue,
} = createEnumOptions({
  STRIPE: "app.api.v1.core.payment.enums.paymentProvider.stripe",
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
  PENDING: "app.api.v1.core.payment.enums.paymentStatus.pending",
  PROCESSING: "app.api.v1.core.payment.enums.paymentStatus.processing",
  SUCCEEDED: "app.api.v1.core.payment.enums.paymentStatus.succeeded",
  FAILED: "app.api.v1.core.payment.enums.paymentStatus.failed",
  CANCELED: "app.api.v1.core.payment.enums.paymentStatus.canceled",
  REFUNDED: "app.api.v1.core.payment.enums.paymentStatus.refunded",
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
  CARD: "app.api.v1.core.payment.enums.paymentMethodType.card",
  BANK_TRANSFER: "app.api.v1.core.payment.enums.paymentMethodType.bankTransfer",
  PAYPAL: "app.api.v1.core.payment.enums.paymentMethodType.paypal",
  APPLE_PAY: "app.api.v1.core.payment.enums.paymentMethodType.applePay",
  GOOGLE_PAY: "app.api.v1.core.payment.enums.paymentMethodType.googlePay",
  SEPA_DEBIT: "app.api.v1.core.payment.enums.paymentMethodType.sepaDebit",
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
  REQUIRES_PAYMENT_METHOD:
    "app.api.v1.core.payment.enums.paymentIntentStatus.requiresPaymentMethod",
  REQUIRES_CONFIRMATION:
    "app.api.v1.core.payment.enums.paymentIntentStatus.requiresConfirmation",
  REQUIRES_ACTION:
    "app.api.v1.core.payment.enums.paymentIntentStatus.requiresAction",
  PROCESSING: "app.api.v1.core.payment.enums.paymentIntentStatus.processing",
  REQUIRES_CAPTURE:
    "app.api.v1.core.payment.enums.paymentIntentStatus.requiresCapture",
  CANCELED: "app.api.v1.core.payment.enums.paymentIntentStatus.canceled",
  SUCCEEDED: "app.api.v1.core.payment.enums.paymentIntentStatus.succeeded",
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
  PAYMENT: "app.api.v1.core.payment.enums.checkoutMode.payment",
  SUBSCRIPTION: "app.api.v1.core.payment.enums.checkoutMode.subscription",
  SETUP: "app.api.v1.core.payment.enums.checkoutMode.setup",
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
  PENDING: "app.api.v1.core.payment.enums.refundStatus.pending",
  SUCCEEDED: "app.api.v1.core.payment.enums.refundStatus.succeeded",
  FAILED: "app.api.v1.core.payment.enums.refundStatus.failed",
  CANCELED: "app.api.v1.core.payment.enums.refundStatus.canceled",
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
  WARNING_NEEDS_RESPONSE:
    "app.api.v1.core.payment.enums.disputeStatus.warningNeedsResponse",
  WARNING_UNDER_REVIEW:
    "app.api.v1.core.payment.enums.disputeStatus.warningUnderReview",
  WARNING_CLOSED: "app.api.v1.core.payment.enums.disputeStatus.warningClosed",
  NEEDS_RESPONSE: "app.api.v1.core.payment.enums.disputeStatus.needsResponse",
  UNDER_REVIEW: "app.api.v1.core.payment.enums.disputeStatus.underReview",
  CHARGE_REFUNDED: "app.api.v1.core.payment.enums.disputeStatus.chargeRefunded",
  WON: "app.api.v1.core.payment.enums.disputeStatus.won",
  LOST: "app.api.v1.core.payment.enums.disputeStatus.lost",
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
  DRAFT: "app.api.v1.core.payment.enums.invoiceStatus.draft",
  OPEN: "app.api.v1.core.payment.enums.invoiceStatus.open",
  PAID: "app.api.v1.core.payment.enums.invoiceStatus.paid",
  VOID: "app.api.v1.core.payment.enums.invoiceStatus.void",
  UNCOLLECTIBLE: "app.api.v1.core.payment.enums.invoiceStatus.uncollectible",
});

/**
 * Tax calculation status enum
 */
export const {
  enum: TaxStatus,
  options: TaxStatusOptions,
  Value: TaxStatusValue,
} = createEnumOptions({
  COMPLETE: "app.api.v1.core.payment.enums.taxStatus.complete",
  FAILED: "app.api.v1.core.payment.enums.taxStatus.failed",
  REQUIRES_LOCATION: "app.api.v1.core.payment.enums.taxStatus.requiresLocation",
});

// Create DB enum arrays for Drizzle
export const PaymentProviderDB = [PaymentProvider.STRIPE] as const;

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
