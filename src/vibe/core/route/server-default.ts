import type { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";

/**
 * Context passed to `serverDefault` callbacks on fields.
 * Available in the route handler after validation, for all platforms.
 */
export interface ServerDefaultContext {
  readonly user: JwtPayloadType;
  readonly locale: CountryLanguage;
  readonly platform: Platform;
  readonly streamContext: ToolExecutionContext;
}
