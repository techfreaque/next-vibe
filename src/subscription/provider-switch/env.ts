/**
 * Subscription provider switch environment
 *
 * Moves card subscribers from a paused processor (Stripe, 2026-11-27) to a
 * new provider. Off until both keys are set, so neither the switch card nor
 * the one-time notice can go live early.
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: providerSwitchEnv,
  schema: providerSwitchEnvSchema,
  examples: providerSwitchEnvExamples,
} = defineEnv({
  SUBSCRIPTION_SWITCH_PROVIDER: {
    schema: z.enum(["NOWPAYMENTS", "WHOP"]).optional(),
    example: "WHOP",
    comment:
      "Payment provider card subscribers move to (key of the PaymentProvider enum, never STRIPE). Unset = no switch offer anywhere.",
    commented: true,
  },
  SUBSCRIPTION_SWITCH_ENABLED: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment:
      "Set to true once the switch provider takes live payments. Gates the switch card on the subscription page and the subscription-provider-switch-notify mail.",
    commented: true,
  },
});
