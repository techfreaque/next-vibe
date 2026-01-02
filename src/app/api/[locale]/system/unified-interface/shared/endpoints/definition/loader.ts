import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { EndpointLogger } from "../../logger/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint";
import type { Platform } from "../../types/platform";
import { permissionsRegistry } from "../permissions/registry";

export interface LoadEndpointOptions {
  identifier: string;
  platform: Platform;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export interface LoadEndpointsOptions {
  identifiers: string[];
  platform: Platform;
  user: JwtPayloadType;
  logger: EndpointLogger;
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
  async load<TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny>(
    options: LoadEndpointOptions,
  ): Promise<ResponseType<TEndpoint>> {
    const { identifier, platform, user, logger } = options;

    logger.debug(`[Definition Loader] Loading endpoint definition`, {
      identifier,
      hasUser: !!user,
    });

    try {
      const endpoint = await getEndpoint(identifier);

      if (!endpoint) {
        logger.debug(`[Definition Loader] No endpoint found`, { identifier });
        return fail({
          message:
            "app.api.system.unifiedInterface.shared.endpoints.definition.loader.errors.endpointNotFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { identifier },
        });
      }

      // Validate endpoint access using consolidated method
      const accessValidation = permissionsRegistry.validateEndpointAccess(endpoint, user, platform);

      if (!accessValidation.success) {
        logger.debug("[Definition Loader] Endpoint access denied", {
          identifier,
          userId: user.isPublic ? "public" : user.id,
          reason: accessValidation.message,
        });
        return accessValidation;
      }

      logger.debug(`[Definition Loader] Found definition`, { identifier });
      return success(endpoint as TEndpoint);
    } catch (error) {
      logger.debug(`[Definition Loader] Failed to load definition`, {
        identifier,
        error: parseError(error).message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.shared.endpoints.definition.loader.errors.loadFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { identifier, error: parseError(error).message },
      });
    }
  }

  async loadMany<TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny>(
    options: LoadEndpointsOptions,
  ): Promise<ResponseType<TEndpoint[]>> {
    const { identifiers, platform, user, logger } = options;

    try {
      const results = await Promise.all(
        identifiers.map((identifier) =>
          this.load<TEndpoint>({
            identifier,
            platform,
            user,
            logger,
          }),
        ),
      );

      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        const firstFailure = failures[0];
        return fail({
          message:
            "app.api.system.unifiedInterface.shared.endpoints.definition.loader.errors.batchLoadFailed",
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
        message:
          "app.api.system.unifiedInterface.shared.endpoints.definition.loader.errors.batchLoadFailed",
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
