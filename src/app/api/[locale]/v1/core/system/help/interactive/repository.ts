import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { getAllEndpointPaths } from "@/app/api/[locale]/v1/core/system/generated/endpoint";
import { interactiveModeHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/interactive-mode-handler";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

export interface InteractiveRepository {
  startInteractiveMode(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ started: boolean }>>;
}

class InteractiveRepositoryImpl implements InteractiveRepository {
  async startInteractiveMode(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ started: boolean }>> {
    if (!user) {
      return {
        success: false,
        error: "Authentication required for interactive mode",
        errorType: "unauthorized",
      };
    }

    try {
      // Get all routes from generated index
      const routes = getAllEndpointPaths().map((alias) => ({ alias }));

      await interactiveModeHandler.startInteractiveMode(
        user,
        locale,
        routes,
        logger,
      );

      return {
        success: true,
        data: { started: true },
      };
    } catch (error) {
      logger.error("Failed to start interactive mode", { error });
      return {
        success: false,
        error: "Failed to start interactive mode",
        errorType: "server_error",
      };
    }
  }
}

export const interactiveRepository: InteractiveRepository =
  new InteractiveRepositoryImpl();
