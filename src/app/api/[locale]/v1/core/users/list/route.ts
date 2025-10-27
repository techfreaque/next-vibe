/**
 * Users List API Route Handler
 * Handles GET requests for listing users with filtering and pagination
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";

import type {
  UserListRequestOutput,
  UserListResponseOutput,
} from "./definition";
import definitions from "./definition";
import { userListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        UserListRequestOutput,
        Record<string, never>,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<UserListResponseOutput>> => {
      return await userListRepository.listUsers(
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
