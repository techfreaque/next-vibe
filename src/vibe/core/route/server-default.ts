import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";

/**
 * Context passed to `serverDefault` callbacks on fields.
 * Available in the route handler after validation, for all platforms.
 */
export interface ServerDefaultContext {
  readonly user: JwtPayloadType;
  readonly locale: CountryLanguage;
  readonly platform: Platform;
  readonly toolExecutionContext: ToolExecutionContext;
}
