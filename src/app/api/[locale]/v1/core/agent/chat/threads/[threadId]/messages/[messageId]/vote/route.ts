import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import type { VotePostResponseOutput } from "./definition";
import { definitions } from "./definition";
import { voteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        typeof definitions.POST.types.RequestOutput,
        typeof definitions.POST.types.UrlVariablesOutput,
        typeof definitions.POST.allowedRoles
      >,
    ): Promise<ResponseType<VotePostResponseOutput>> => {
      return await voteRepository.voteMessage(
        props.urlVariables,
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
