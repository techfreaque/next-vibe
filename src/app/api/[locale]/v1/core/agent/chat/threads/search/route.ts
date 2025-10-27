/**
 * Thread Search API Route Handler
 * Handles GET requests for searching threads
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";

import type {
  ThreadSearchGetRequestOutput,
  ThreadSearchGetResponseOutput,
} from "./definition";
import { definitions } from "./definition";
import { searchThreads } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        ThreadSearchGetRequestOutput,
        Record<string, never>,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<ThreadSearchGetResponseOutput>> => {
      return {
        success: true,
        data: await searchThreads(props.user.id, props.data),
      };
    },
  },
});
