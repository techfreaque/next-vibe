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
    schema: z.string().min(1),
    example: "sk_test_your_stripe_secret_key",
    comment: "Stripe",
  },
  STRIPE_WEBHOOK_SECRET: {
    schema: z.string().min(1),
    example: "whsec_your_stripe_webhook_secret",
  },

  // NOWPayments
  NOWPAYMENTS_API_KEY: {
    schema: z.string().min(1),
    example: "your_nowpayments_api_key",
    comment: "NOWPayments (crypto)",
  },
  NOWPAYMENTS_IPN_SECRET: {
    schema: z.string().min(1),
    example: "your_nowpayments_ipn_secret",
  },
  NOWPAYMENTS_API_URL: {
    schema: z.string().url().default("https://api-sandbox.nowpayments.io/v1"),
    example: "https://api-sandbox.nowpayments.io/v1",
    comment: "Use https://api.nowpayments.io/v1 for production",
  },
});
