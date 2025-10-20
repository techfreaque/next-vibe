/**
 * Guard Destroy Route Handler
 * Handles POST requests for destroying guard environments
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import type {
  GuardDestroyRequestOutput,
  GuardDestroyResponseOutput,
} from "./definition";
import guardDestroyEndpoints from "./definition";
import { guardDestroyRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: guardDestroyEndpoints,
  [Methods.POST]: {
    handler: (
      props: ApiHandlerProps<
        GuardDestroyRequestOutput,
        Record<string, never>,
        typeof guardDestroyEndpoints.POST.allowedRoles
      >,
    ): ResponseType<GuardDestroyResponseOutput> => {
      return guardDestroyRepository.destroyGuard(
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
