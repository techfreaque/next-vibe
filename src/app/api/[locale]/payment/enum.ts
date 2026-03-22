/**
 * Payment enums
 * Defines the enums used in the payment module using createEnumOptions pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Payment provider enum
 * Supports Stripe and NOWPayments (crypto)
 */
export const {
  enum: PaymentProvider,
  options: PaymentProviderOptions,
  Value: PaymentProviderValue,
} = createEnumOptions(scopedTranslation, {
  STRIPE: "enums.paymentProvider.stripe",
  NOWPAYMENTS: "enums.paymentProvider.nowpayments",
});

/**
 * Payment status enum
 * Tracks the lifecycle of payment transactions
 */
export const {
  enum: PaymentStatus,
  options: PaymentStatusOptions,
  Value: PaymentStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.paymentStatus.pending",
  PROCESSING: "enums.paymentStatus.processing",
  SUCCEEDED: "enums.paymentStatus.succeeded",
  FAILED: "enums.paymentStatus.failed",
  CANCELED: "enums.paymentStatus.canceled",
  REFUNDED: "enums.paymentStatus.refunded",
});

/**
 * Payment method type enum
 * Supported payment method types
 */
export const {
  enum: PaymentMethodType,
  options: PaymentMethodTypeOptions,
  Value: PaymentMethodTypeValue,
} = createEnumOptions(scopedTranslation, {
  CARD: "enums.paymentMethodType.card",
  BANK_TRANSFER: "enums.paymentMethodType.bankTransfer",
  PAYPAL: "enums.paymentMethodType.paypal",
  APPLE_PAY: "enums.paymentMethodType.applePay",
  GOOGLE_PAY: "enums.paymentMethodType.googlePay",
  SEPA_DEBIT: "enums.paymentMethodType.sepaDebit",
});

/**
 * Payment intent status enum
 * Stripe payment intent statuses
 */
export const {
  enum: PaymentIntentStatus,
  options: PaymentIntentStatusOptions,
  Value: PaymentIntentStatusValue,
} = createEnumOptions(scopedTranslation, {
  REQUIRES_PAYMENT_METHOD: "enums.paymentIntentStatus.requiresPaymentMethod",
  REQUIRES_CONFIRMATION: "enums.paymentIntentStatus.requiresConfirmation",
  REQUIRES_ACTION: "enums.paymentIntentStatus.requiresAction",
  PROCESSING: "enums.paymentIntentStatus.processing",
  REQUIRES_CAPTURE: "enums.paymentIntentStatus.requiresCapture",
  CANCELED: "enums.paymentIntentStatus.canceled",
  SUCCEEDED: "enums.paymentIntentStatus.succeeded",
});

/**
 * Checkout session mode enum
 * Stripe checkout session modes
 */
export const {
  enum: CheckoutMode,
  options: CheckoutModeOptions,
  Value: CheckoutModeValue,
} = createEnumOptions(scopedTranslation, {
  PAYMENT: "enums.checkoutMode.payment",
  SUBSCRIPTION: "enums.checkoutMode.subscription",
  SETUP: "enums.checkoutMode.setup",
});

/**
 * Refund status enum
 * Tracks refund lifecycle
 */
export const {
  enum: RefundStatus,
  options: RefundStatusOptions,
  Value: RefundStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.refundStatus.pending",
  SUCCEEDED: "enums.refundStatus.succeeded",
  FAILED: "enums.refundStatus.failed",
  CANCELED: "enums.refundStatus.canceled",
});

/**
 * Dispute status enum
 * Tracks dispute/chargeback lifecycle
 */
export const {
  enum: DisputeStatus,
  options: DisputeStatusOptions,
  Value: DisputeStatusValue,
} = createEnumOptions(scopedTranslation, {
  WARNING_NEEDS_RESPONSE: "enums.disputeStatus.warningNeedsResponse",
  WARNING_UNDER_REVIEW: "enums.disputeStatus.warningUnderReview",
  WARNING_CLOSED: "enums.disputeStatus.warningClosed",
  NEEDS_RESPONSE: "enums.disputeStatus.needsResponse",
  UNDER_REVIEW: "enums.disputeStatus.underReview",
  CHARGE_REFUNDED: "enums.disputeStatus.chargeRefunded",
  WON: "enums.disputeStatus.won",
  LOST: "enums.disputeStatus.lost",
});

/**
 * Invoice status enum
 * Tracks invoice lifecycle
 */
export const {
  enum: InvoiceStatus,
  options: InvoiceStatusOptions,
  Value: InvoiceStatusValue,
} = createEnumOptions(scopedTranslation, {
  DRAFT: "enums.invoiceStatus.draft",
  OPEN: "enums.invoiceStatus.open",
  PAID: "enums.invoiceStatus.paid",
  VOID: "enums.invoiceStatus.void",
  UNCOLLECTIBLE: "enums.invoiceStatus.uncollectible",
});

/**
 * Tax calculation status enum
 */
export const {
  enum: TaxStatus,
  options: TaxStatusOptions,
  Value: TaxStatusValue,
} = createEnumOptions(scopedTranslation, {
  COMPLETE: "enums.taxStatus.complete",
  FAILED: "enums.taxStatus.failed",
  REQUIRES_LOCATION: "enums.taxStatus.requiresLocation",
});

// Create DB enum arrays for Drizzle
export const PaymentProviderDB = [
  PaymentProvider.STRIPE,
  PaymentProvider.NOWPAYMENTS,
] as const;

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

/**
 * Payment interval enum
 * Billing frequency for subscription and one-time payments
 */
export const {
  enum: PaymentInterval,
  options: PaymentIntervalOptions,
  Value: PaymentIntervalValue,
} = createEnumOptions(scopedTranslation, {
  MONTH: "enums.paymentInterval.month",
  YEAR: "enums.paymentInterval.year",
  ONE_TIME: "enums.paymentInterval.one_time",
} as const);

export type PaymentIntervalType = typeof PaymentIntervalValue;

export const PaymentIntervalDB = [
  PaymentInterval.MONTH,
  PaymentInterval.YEAR,
  PaymentInterval.ONE_TIME,
] as const;
