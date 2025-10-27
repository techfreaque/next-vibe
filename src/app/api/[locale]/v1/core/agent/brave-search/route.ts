/**
 * Brave Search API Route Handler
 * Handles GET requests for web search
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";

import type {
  BraveSearchGetRequestOutput,
  BraveSearchGetResponseOutput,
  BraveSearchGetUrlVariablesOutput,
} from "./definition";
import braveSearchDefinition from "./definition";
import { braveSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: braveSearchDefinition,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        BraveSearchGetRequestOutput,
        BraveSearchGetUrlVariablesOutput,
        typeof braveSearchDefinition.GET.allowedRoles
      >,
    ): Promise<ResponseType<BraveSearchGetResponseOutput>> => {
      return await braveSearchRepository.search(
        props.data.query,
        {
          maxResults: props.data.maxResults,
          includeNews: props.data.includeNews,
          freshness: props.data.freshness,
        },
        props.logger,
      );
    },
  },
});
