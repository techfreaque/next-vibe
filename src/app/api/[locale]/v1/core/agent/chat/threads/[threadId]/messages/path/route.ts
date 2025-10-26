import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import type { PathGetResponseOutput } from "./definition";
import { definitions } from "./definition";
import { pathRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        typeof definitions.GET.types.RequestOutput,
        typeof definitions.GET.types.UrlVariablesOutput,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<PathGetResponseOutput>> => {
      return await pathRepository.getPath(
        props.urlPathParams,
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
