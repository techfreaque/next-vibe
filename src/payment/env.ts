/**
 * Payment Module Environment Configuration
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: paymentEnv,
  schema: paymentEnvSchema,
  examples: paymentEnvExamples,
} = defineEnv({
  // Stripe
  STRIPE_SECRET_KEY: {
    schema: z.string().min(1).optional(),
    example: "sk_test_your_stripe_secret_key",
    comment: "Stripe",
    commented: true,
  },
  STRIPE_WEBHOOK_SECRET: {
    schema: z.string().min(1).optional(),
    example: "whsec_your_stripe_webhook_secret",
    commented: true,
  },
  STRIPE_CHECKOUT_PAUSED: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment:
      "Stop offering Stripe for new checkouts (subscriptions and credit packs). Checkout falls back to crypto. Existing subscriptions keep renewing. Stripe is also skipped automatically while the Stripe account reports charges disabled.",
    commented: true,
  },

  // NOWPayments
  NOWPAYMENTS_API_KEY: {
    schema: z.string().min(1).optional(),
    example: "your_nowpayments_api_key",
    comment: "NOWPayments (crypto)",
    commented: true,
  },
  NOWPAYMENTS_IPN_SECRET: {
    schema: z.string().min(1).optional(),
    example: "your_nowpayments_ipn_secret",
    commented: true,
  },
  NOWPAYMENTS_FIAT_ENABLED: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment:
      "Set to true once card payments (fiat operations) are enabled in the NOWPayments Partner Profile. The buy page then labels NOWPayments as card or crypto.",
    commented: true,
  },
  NOWPAYMENTS_CALLBACK_DOMAIN: {
    schema: z.string().url().optional(),
    example: "https://your-domain.com",
    comment:
      "Public domain NOWPayments uses to reach the IPN webhook. Falls back to NEXT_PUBLIC_APP_URL when unset — set this when that URL is not externally reachable (e.g. localhost during preview).",
    commented: true,
    fieldType: "url",
  },
  NOWPAYMENTS_API_URL: {
    schema: z
      .enum([
        "https://api-sandbox.nowpayments.io/v1",
        "https://api.nowpayments.io/v1",
      ])
      .default("https://api-sandbox.nowpayments.io/v1"),
    example: "https://api-sandbox.nowpayments.io/v1",
    comment:
      "NOWPayments API endpoint - sandbox for testing, production for live payments",
    commented: true,
    fieldType: "select" as const,
    options: [
      "https://api-sandbox.nowpayments.io/v1",
      "https://api.nowpayments.io/v1",
    ] as const,
  },
});
