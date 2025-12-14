/**
 * Payment Module Client Environment Configuration
 */

import { z } from "zod";

import { defineEnvClient } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env-client";

export const { envClient: paymentClientEnv } = defineEnvClient({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    schema: z.string().min(1),
    value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    example: "pk_test_your_stripe_publishable_key",
  },
});
