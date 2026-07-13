/**
 * Payment Module Client Environment Configuration
 */

import { defineEnvClient } from "next-vibe/env/define-env-client";
import { z } from "zod";

export const {
  envClient: paymentClientEnv,
  schema: paymentClientEnvSchema,
  examples: paymentClientEnvExamples,
} = defineEnvClient({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    schema: z.string().min(1).optional(),
    value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    example: "pk_test_your_stripe_publishable_key",
    commented: true,
  },
});
