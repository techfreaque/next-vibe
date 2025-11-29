/**
 * Message Search Route Handler
 * Handles GET requests for searching messages within a thread
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/handler";

import type { MessageSearchResponseOutput } from "./definition";
import definitions from "./definition";
import { MessageSearchRepositoryImpl } from "./repository";

const messageSearchRepository = new MessageSearchRepositoryImpl();

/**
 * Export route handlers
 */
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
    ): Promise<ResponseType<MessageSearchResponseOutput>> => {
      return await messageSearchRepository.searchMessages(
        props.data,
        props.urlPathParams,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
