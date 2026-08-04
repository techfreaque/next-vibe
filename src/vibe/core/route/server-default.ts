import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import type { JwtPayloadType } from "../../identity/auth/types";
import type { Platform } from "../../platforms/platforms";
import type { CountryLanguage } from "../i18n/core/config";

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
