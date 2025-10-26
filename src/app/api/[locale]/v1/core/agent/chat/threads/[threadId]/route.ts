/**
 * Chat Thread by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual threads
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import type {
  ThreadDeleteRequestOutput,
  ThreadDeleteResponseOutput,
  ThreadDeleteUrlParamsTypeOutput,
  ThreadGetRequestOutput,
  ThreadGetResponseOutput,
  ThreadGetUrlParamsTypeOutput,
  ThreadPatchRequestOutput,
  ThreadPatchResponseOutput,
  ThreadPatchUrlParamsTypeOutput,
} from "./definition";
import definitions from "./definition";
import { threadByIdRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        ThreadGetRequestOutput,
        ThreadGetUrlParamsTypeOutput,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<ThreadGetResponseOutput>> => {
      return await threadByIdRepository.getThreadById(
        { id: props.urlPathParams.threadId },
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        ThreadPatchRequestOutput,
        ThreadPatchUrlParamsTypeOutput,
        typeof definitions.PATCH.allowedRoles
      >,
    ): Promise<ResponseType<ThreadPatchResponseOutput>> => {
      const dataWithId: ThreadPatchRequestOutput & { id: string } = {
        ...props.data,
        id: props.urlPathParams.threadId,
      };
      return await threadByIdRepository.updateThread(
        dataWithId,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        ThreadDeleteRequestOutput,
        ThreadDeleteUrlParamsTypeOutput,
        typeof definitions.DELETE.allowedRoles
      >,
    ): Promise<ResponseType<ThreadDeleteResponseOutput>> => {
      return await threadByIdRepository.deleteThread(
        { id: props.urlPathParams.threadId },
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
