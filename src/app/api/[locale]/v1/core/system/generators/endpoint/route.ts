/**
 * Endpoint Generator Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";

import definitions from "./definition";
import { endpointGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        typeof definitions.POST.types.RequestOutput,
        Record<string, never>,
        typeof definitions.POST.allowedRoles
      >,
    ): Promise<ResponseType<typeof definitions.POST.types.ResponseOutput>> => {
      return await endpointGeneratorRepository.generateEndpoint(
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
