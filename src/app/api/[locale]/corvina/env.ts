/**
 * Corvina Module Environment Configuration
 *
 * Service-account credentials for talking to the Corvina platform API
 * (Keycloak client_credentials flow). All values come from .env.local —
 * never commit real credentials.
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const {
  env: corvinaEnv,
  schema: corvinaEnvSchema,
  examples: corvinaEnvExamples,
} = defineEnv({
  CORVINA_API_BASE_URL: {
    schema: z.string().url().default("https://connex.app.corvina-de.io"),
    example: "https://connex.app.corvina-de.io",
    comment:
      "Corvina tenant base URL (the host that serves /svc/* endpoints).",
    commented: true,
  },
  CORVINA_AUTH_BASE_URL: {
    schema: z.string().url().default("https://auth.corvina-de.io"),
    example: "https://auth.corvina-de.io",
    comment: "Keycloak base URL serving the token endpoint.",
    commented: true,
  },
  CORVINA_REALM: {
    schema: z.string().min(1).default("CorvinaAccounts"),
    example: "CorvinaAccounts",
    comment: "Keycloak realm. Confirmed from the login-actions URL.",
    commented: true,
  },
  CORVINA_CLIENT_ID: {
    schema: z.string().min(1).optional(),
    example: "your-corvina-service-account-client-id",
    comment:
      "Service-account client ID created in the Corvina dev portal.",
    commented: true,
    sensitive: true,
  },
  CORVINA_CLIENT_SECRET: {
    schema: z.string().min(1).optional(),
    example: "your-corvina-service-account-client-secret",
    comment:
      "Service-account client secret. Store in .env.local only - never commit.",
    commented: true,
    sensitive: true,
  },
  CORVINA_ORG_SCOPE: {
    schema: z.string().min(1).default("connex"),
    example: "connex",
    comment:
      "Scope appended to the token request as scope=org:<value>. Usually the tenant subdomain.",
    commented: true,
  },
  CORVINA_ORGANIZATIONS_PATH: {
    schema: z.string().min(1).default("/svc/platform/organizations"),
    example: "/svc/platform/organizations",
    comment:
      "Path on CORVINA_API_BASE_URL that returns the organization list. Adjust once the OpenAPI spec confirms the canonical path.",
    commented: true,
  },
});
