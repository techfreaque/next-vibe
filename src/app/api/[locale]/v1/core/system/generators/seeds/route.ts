/**
 * Seeds Generator API Route
 * Route handler for database seed generation
 */

import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { seedsGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: (props: ApiHandlerProps) =>
      seedsGeneratorRepository.generateSeeds(props.data, props.user, props.locale, props.logger),
  },
});
