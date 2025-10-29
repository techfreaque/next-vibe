/**
 * Chat Threads API Route Handler
 * Handles GET (list) and POST (create) requests for threads
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";

import type {
  ThreadCreateRequestOutput,
  ThreadCreateResponseOutput,
  ThreadListRequestOutput,
  ThreadListResponseOutput,
} from "./definition";
import definitions from "./definition";
import { threadsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        ThreadListRequestOutput,
        Record<string, never>,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<ThreadListResponseOutput>> => {
      return await threadsRepository.listThreads(
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        ThreadCreateRequestOutput,
        Record<string, never>,
        typeof definitions.POST.allowedRoles
      >,
    ): Promise<ResponseType<ThreadCreateResponseOutput>> => {
      return await threadsRepository.createThread(
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
