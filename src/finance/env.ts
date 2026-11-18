/**
 * Finance Environment Configuration
 * Optional extras for read-only revenue ingestion. Provider balance keys
 * (OPENROUTER_API_KEY, NANO_GPT_API_KEY, ...) live in the agent env,
 * Stripe / NOWPayments keys in the payment env.
 */

import "server-only";

import { coreEnv } from "next-vibe/core/env";
import { defineEnv } from "next-vibe/env/define-env";
import { Environment } from "next-vibe/env/env-util";
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

/**
 * True only on the production instance (Thea): NODE_ENV production without
 * --hermes/--preview. Atlas dev and Hermes run with Stripe test keys and test
 * data, so their finance crons stay off and their alerts never mail the ops
 * inboxes (a test-mode cancellation burst once mailed a false prod alert).
 */
export const isFinanceProductionInstance =
  coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE;
