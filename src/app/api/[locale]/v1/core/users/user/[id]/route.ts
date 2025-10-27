/**
 * Individual User API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";

import type {
  UserDeleteRequestOutput,
  UserDeleteResponseOutput,
  UserDeleteUrlParamsTypeOutput,
  UserGetRequestOutput,
  UserGetResponseOutput,
  UserGetUrlParamsTypeOutput,
  UserPutRequestOutput,
  UserPutResponseOutput,
  UserPutUrlParamsTypeOutput,
} from "./definition";
import definitions from "./definition";
import { userByIdRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async (
      props: ApiHandlerProps<
        UserGetRequestOutput,
        UserGetUrlParamsTypeOutput,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<UserGetResponseOutput>> => {
      return await userByIdRepository.getUserById(
        { id: props.urlPathParams.id },
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        UserPutRequestOutput,
        UserPutUrlParamsTypeOutput,
        typeof definitions.PUT.allowedRoles
      >,
    ): Promise<ResponseType<UserPutResponseOutput>> => {
      return await userByIdRepository.updateUser(
        props.data,
        props.urlPathParams.id,
        props.user,
        props.logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        UserDeleteRequestOutput,
        UserDeleteUrlParamsTypeOutput,
        typeof definitions.DELETE.allowedRoles
      >,
    ): Promise<ResponseType<UserDeleteResponseOutput>> => {
      return await userByIdRepository.deleteUser(
        { id: props.urlPathParams.id },
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
