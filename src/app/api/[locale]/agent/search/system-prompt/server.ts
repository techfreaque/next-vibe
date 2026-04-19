import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";

import type { WebData } from "./prompt";

/**
 * Load web fragment data for the system prompt.
 * Determines browser availability and cloud/local status.
 */
export async function loadWebData(
  params: SystemPromptServerParams,
): Promise<WebData> {
  const { user } = params;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;

  // Browser is available for admin users in local mode or when Chrome is configured
  let hasBrowser = false;
  if (isAdmin) {
    try {
      const { browserEnv } = await import("@/app/api/[locale]/browser/env");
      hasBrowser =
        isLocalMode || browserEnv.CHROME_EXECUTABLE_PATH !== undefined;
    } catch {
      // Browser module not available
    }
  }

  return {
    hasBrowser,
    isCloud: !isLocalMode,
  };
}
