/**
 * Release Tooling Environment
 */

import "server-only";

import { defineEnv } from "../../env/define-env";
import { z } from "zod";

export const {
  env: releaseEnv,
  schema: releaseEnvSchema,
  examples: releaseEnvExamples,
} = defineEnv({
  SNYK_TOKEN: {
    schema: z.string().optional(),
    example: "your-snyk-api-token",
    comment: "Snyk API token. Enables vulnerability scanning during release.",
    commented: true,
    sensitive: true,
  },
  SNYK_ORG_KEY: {
    schema: z.string().optional(),
    example: "your-snyk-org-key",
    comment: "Snyk organization key used for `snyk monitor` during release.",
    commented: true,
  },
  GITHUB_TOKEN: {
    schema: z.string().optional(),
    example: "ghp_your_github_token",
    comment:
      "GitHub token used to create/update the weekly dependency-update PR. Set automatically in GitHub Actions.",
    commented: true,
    sensitive: true,
  },
});
