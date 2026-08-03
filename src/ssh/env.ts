/**
 * SSH Module Environment
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: sshEnv,
  schema: sshEnvSchema,
  examples: sshEnvExamples,
} = defineEnv({
  SSH_CONNECT_TIMEOUT_MS: {
    schema: z.coerce.number().int().positive().optional().default(10000),
    example: "10000",
    comment: "Timeout for establishing an SSH connection, in milliseconds.",
    commented: true,
    fieldType: "number",
  },
  SSH_IDLE_TIMEOUT_MS: {
    schema: z.coerce.number().int().positive().optional().default(300000),
    example: "300000",
    comment:
      "How long an idle SSH exec session is kept open before being closed.",
    commented: true,
    fieldType: "number",
  },
});
