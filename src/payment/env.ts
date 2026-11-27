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

  // Whop (card)
  WHOP_ENVIRONMENT: {
    schema: z.enum(["production", "sandbox"]).optional().default("production"),
    example: "production",
    comment:
      "Whop (card payments). production = api.whop.com with WHOP_API_KEY / WHOP_WEBHOOK_SECRET; sandbox = sandbox-api.whop.com (test cards, no real money) with WHOP_SANDBOX_API_KEY / WHOP_SANDBOX_WEBHOOK_SECRET. Use sandbox on dev machines.",
    commented: true,
    fieldType: "select" as const,
    options: ["production", "sandbox"] as const,
  },
  WHOP_API_KEY: {
    schema: z.string().min(1).optional(),
    example: "your_whop_account_api_key",
    comment:
      "Whop production account API key (dashboard, Developer, API keys). Whop shows as card checkout once the key and the webhook secret of the active environment are set.",
    commented: true,
  },
  WHOP_WEBHOOK_SECRET: {
    schema: z.string().min(1).optional(),
    example: "ws_your_whop_webhook_secret",
    comment:
      "Signing secret (ws_...) of the production Whop webhook pointing at https://<domain>/api/en-GLOBAL/payment/providers/whop/webhook.",
    commented: true,
  },
  WHOP_COMPANY_ID: {
    schema: z.string().min(1).optional(),
    example: "biz_your_account_id",
    comment:
      "Optional: Whop account id (biz_...) that owns the products. Looked up from the API key when unset.",
    commented: true,
  },
  WHOP_SANDBOX_API_KEY: {
    schema: z.string().min(1).optional(),
    example: "your_whop_sandbox_api_key",
    comment:
      "Whop sandbox account API key (sandbox.whop.com), used when WHOP_ENVIRONMENT=sandbox.",
    commented: true,
  },
  WHOP_SANDBOX_WEBHOOK_SECRET: {
    schema: z.string().min(1).optional(),
    example: "ws_your_whop_sandbox_webhook_secret",
    comment:
      "Signing secret of the sandbox Whop webhook, used when WHOP_ENVIRONMENT=sandbox.",
    commented: true,
  },
  WHOP_SANDBOX_COMPANY_ID: {
    schema: z.string().min(1).optional(),
    example: "biz_your_sandbox_account_id",
    comment:
      "Optional: sandbox account id. Looked up from the sandbox key when unset.",
    commented: true,
  },
  WHOP_CHECKOUT_PAUSED: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment:
      "Stop offering Whop for new checkouts. Existing Whop memberships keep renewing.",
    commented: true,
  },
});
