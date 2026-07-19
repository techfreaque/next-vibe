/**
 * CLI remote target — local-only seam.
 *
 * Same contract as ./remote-target, with the whole `--thea` / `--hermes` leg
 * removed: no HTTP dispatch to another instance, no remote session/cookies, no
 * remote login bookkeeping. Drops remote-connection + the database from the CLI
 * runtime entirely.
 *
 * This is never reached on a local-only build: ./route-executor only calls it
 * when `cliTarget === REMOTE`, which such a build has no way to select. It fails
 * loudly rather than silently running the command locally — a caller that asked
 * for a remote target and got local execution would be a genuinely dangerous
 * surprise (wrong machine, wrong data).
 *
 * HOW TO USE IT: point ./route-executor's `./remote-target` import at this file.
 * That ONE line is the switch; ./remote-target.ts and ./auth/remote-session-cache.ts
 * can then be deleted.
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { scopedTranslation as cliScopedTranslation } from "next-vibe/platforms/cli/i18n";
import type { Platform } from "next-vibe/platforms/platforms";

/** Remote targets are not built into this CLI. See the note above on failing loudly. */
export function executeRemoteEndpoint(params: {
  endpoint: CreateApiEndpointAny;
  data: Record<string, WidgetData>;
  urlPathParams?: Record<string, string | number | boolean | null | undefined>;
  locale: CountryLanguage;
  logger: EndpointLogger;
  remoteUrl: string;
  userId: string | undefined;
  user: JwtPayloadType;
  signal: AbortSignal;
  platform: Platform;
}): Promise<ResponseType<WidgetData>> {
  const { t } = cliScopedTranslation.scopedT(params.locale);
  return Promise.resolve(
    fail({
      message: t("vibe.errors.remoteNotAvailable"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    }),
  );
}
