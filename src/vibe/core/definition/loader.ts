import { reloadPage } from "next-vibe/ui/lib/location";

import { getEndpoint as globalGetEndpoint } from "@/generated/endpoints/endpoint";

import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation } from "../i18n/shared";
import { resolveEndpointAccessDenial } from "../permissions/denial-message";
import { permissionsRegistry } from "../permissions/registry";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../route/response.schema";
import { parseError } from "../utils/parse-error";
import type { CreateApiEndpointAny } from "./endpoint-base";

export type GetEndpointFn = (
  path: string,
) => Promise<CreateApiEndpointAny | null>;

interface LoadEndpointOptions {
  identifier: string;
  platform: Platform;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Skip role/platform access validation (e.g. for remote execution where the remote server handles auth) */
  skipAccessValidation?: boolean;
}

interface LoadEndpointsOptions {
  identifiers: string[];
  platform: Platform;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
}

export interface IDefinitionLoader {
  load<TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny>(
    options: LoadEndpointOptions,
  ): Promise<ResponseType<TEndpoint>>;

  loadMany<TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny>(
    options: LoadEndpointsOptions,
  ): Promise<ResponseType<TEndpoint[]>>;
}

export class DefinitionLoader implements IDefinitionLoader {
  private readonly getEndpoint: GetEndpointFn;

  constructor(getEndpoint: GetEndpointFn = globalGetEndpoint) {
    this.getEndpoint = getEndpoint;
  }

  async load<TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny>(
    options: LoadEndpointOptions,
  ): Promise<ResponseType<TEndpoint>> {
    const { identifier, platform, user, logger, locale, skipAccessValidation } =
      options;
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const endpoint = await this.getEndpoint(identifier);

      if (!endpoint) {
        return fail({
          message: t(
            "shared.endpoints.definition.loader.errors.endpointNotFound",
            { identifier },
          ),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Validate endpoint access using consolidated method
      // Skip for remote execution - the remote server handles its own auth
      if (!skipAccessValidation) {
        const accessValidation = permissionsRegistry.validateEndpointAccess(
          endpoint,
          user,
          platform,
        );

        if (!accessValidation.allowed) {
          return resolveEndpointAccessDenial(accessValidation.denial, locale);
        }
      }

      return success(endpoint as TEndpoint);
    } catch (error) {
      const parsed = parseError(error);
      // Chunk load failures happen on the client after a deployment when the old
      // JS bundle references a chunk hash that no longer exists on the CDN.
      // Force a full page reload so the client fetches the new bundle.
      const isChunkLoadError =
        parsed.message.includes("Loading chunk") ||
        parsed.name === "ChunkLoadError";
      if (isChunkLoadError && typeof window !== "undefined") {
        logger.warn(
          `[Definition Loader] Stale chunk detected - reloading page (identifier: ${identifier})`,
        );
        reloadPage();
        // Return a non-resolving promise - reload is in flight
        return new Promise<ResponseType<TEndpoint>>((resolve) => {
          // Never resolves - page reload is in flight
          void resolve;
        });
      }
      logger.error(
        `[Definition Loader] Failed to load definition (identifier: ${identifier}, error: ${parsed.message})`,
      );
      return fail({
        message: t("shared.endpoints.definition.loader.errors.loadFailed", {
          identifier,
          error: parsed.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async loadMany<TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny>(
    options: LoadEndpointsOptions,
  ): Promise<ResponseType<TEndpoint[]>> {
    const { identifiers, platform, user, logger, locale } = options;
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const results = await Promise.all(
        identifiers.map((identifier) =>
          this.load<TEndpoint>({
            identifier,
            platform,
            user,
            logger,
            locale,
          }),
        ),
      );

      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        const firstFailure = failures.find((r) => !r.success);
        return fail({
          message: t(
            "shared.endpoints.definition.loader.errors.batchLoadFailed",
            {
              failedCount: failures.length,
              totalCount: identifiers.length,
            },
          ),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          // Spread rather than `cause: ... : undefined` so the key is absent when
          // there is no cause, instead of present-and-undefined.
          ...(firstFailure?.success === false ? { cause: firstFailure } : {}),
        });
      }

      const data = results
        .map((r) => (r.success ? r.data : null))
        .filter((d): d is TEndpoint => d !== null);
      return success(data);
    } catch (error) {
      logger.debug(`[Definition Loader] Batch load failed`, {
        identifiersCount: identifiers.length,
        error: parseError(error).message,
      });
      return fail({
        // Distinct key from the per-failure branch above: this one also carries
        // the thrown error, and a key must never leave a placeholder unfilled.
        message: t("shared.endpoints.definition.loader.errors.batchLoadError", {
          failedCount: identifiers.length,
          totalCount: identifiers.length,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const definitionLoader = new DefinitionLoader();
