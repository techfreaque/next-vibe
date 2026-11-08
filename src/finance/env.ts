/**
 * Finance Environment Configuration
 * Optional extras for read-only revenue ingestion. Provider balance keys
 * (OPENROUTER_API_KEY, NANO_GPT_API_KEY, ...) live in the agent env,
 * Stripe / NOWPayments keys in the payment env.
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: financeEnv,
  schema: financeEnvSchema,
  examples: financeEnvExamples,
} = defineEnv({
  NOWPAYMENTS_EMAIL: {
    schema: z.string().optional(),
    example: "you@example.com",
    comment:
      "NOWPayments dashboard login. Only used to obtain a read-only JWT for the payment list (GET /payment needs a JWT, an API key is not enough). Without it, crypto revenue falls back to the local IPN ledger.",
    commented: true,
    fieldType: "email",
  },
  NOWPAYMENTS_PASSWORD: {
    schema: z.string().optional(),
    example: "your-nowpayments-password",
    comment: "NOWPayments dashboard password (see NOWPAYMENTS_EMAIL).",
    commented: true,
    sensitive: true,
  },
});
