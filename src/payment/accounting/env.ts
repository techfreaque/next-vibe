import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: paymentAccountingEnv,
  schema: paymentAccountingEnvSchema,
  examples: paymentAccountingEnvExamples,
} = defineEnv({
  PAYMENT_ACCOUNTING_WEBHOOK_CAPTURE: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment:
      "Opt in to saving verified payment webhooks as accounting evidence and posting them for configured offers. Leave disabled until a dry run has been reviewed.",
    commented: true,
  },
});
