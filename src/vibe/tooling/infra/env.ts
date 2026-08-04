/**
 * Infra Deploy Tooling Environment
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "../../env/define-env";

export const {
  env: infraEnv,
  schema: infraEnvSchema,
  examples: infraEnvExamples,
} = defineEnv({
  PULUMI_BIN: {
    schema: z.string().optional(),
    example: "/root/.pulumi/bin/pulumi",
    comment:
      "Path to the pulumi binary. Defaults to <HOME>/.pulumi/bin/pulumi.",
    commented: true,
  },
  PULUMI_PASSPHRASE: {
    schema: z.string().optional(),
    example: "your-pulumi-stack-passphrase",
    comment: "Passphrase for the Pulumi local-state stack config secrets.",
    commented: true,
    sensitive: true,
  },
});
