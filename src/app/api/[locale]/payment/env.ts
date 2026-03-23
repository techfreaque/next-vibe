/**
 * Payment Module Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

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
