/**
 * CLI auth-bypass user - no env, no DB, no i18n, no auth imports.
 * Used when an endpoint has CLI_AUTH_BYPASS and the platform is not MCP.
 */

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

const CLI_BYPASS_USER_ID = "00000000-0000-0000-0000-000000000001";

export function createCliBypassUser(): JwtPrivatePayloadType {
  return {
    id: CLI_BYPASS_USER_ID,
    leadId: CLI_BYPASS_USER_ID,
    isPublic: false,
    roles: [UserPermissionRole.ADMIN],
  };
}
