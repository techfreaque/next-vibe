import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { Platform } from "./platform";

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
