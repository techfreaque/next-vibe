import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { getEndpoint as globalGetEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import { scopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../logger/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import type { Platform } from "../../types/platform";
import { permissionsRegistry } from "../permissions/registry";

export type GetEndpointFn = (
  path: string,
) => Promise<CreateApiEndpointAny | null>;

export interface LoadEndpointOptions {
  identifier: string;
  platform: Platform;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Skip role/platform access validation (e.g. for remote execution where the remote server handles auth) */
  skipAccessValidation?: boolean;
}

export interface LoadEndpointsOptions {
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
          ),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { identifier },
        });
      }

      // Validate endpoint access using consolidated method
      // Skip for remote execution — the remote server handles its own auth
      if (!skipAccessValidation) {
        const accessValidation = permissionsRegistry.validateEndpointAccess(
          endpoint,
          user,
          platform,
          locale,
        );

        if (!accessValidation.success) {
          return accessValidation;
        }
      }

      return success(endpoint as TEndpoint);
    } catch (error) {
      logger.error(
        `[Definition Loader] Failed to load definition (identifier: ${identifier}, error: ${parseError(error).message})`,
      );
      return fail({
        message: t("shared.endpoints.definition.loader.errors.loadFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { identifier, error: parseError(error).message },
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
        const firstFailure = failures[0];
        return fail({
          message: t(
            "shared.endpoints.definition.loader.errors.batchLoadFailed",
          ),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            failedCount: failures.length,
            totalCount: identifiers.length,
          },
          cause: firstFailure.success === false ? firstFailure : undefined,
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
        message: t("shared.endpoints.definition.loader.errors.batchLoadFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          failedCount: identifiers.length,
          totalCount: identifiers.length,
          error: parseError(error).message,
        },
      });
    }
  }
}

export const definitionLoader = new DefinitionLoader();
