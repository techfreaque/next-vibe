import type { ApiFormReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import {
  type EnhancedMutationResult,
  useApiMutation,
} from "../../../../system/unified-interface/react/hooks/use-api-mutation";
import { useApiForm } from "../../../../system/unified-interface/react/hooks/use-api-mutation-form";
import type { JwtPayloadType } from "../../../auth/types";
import avatarEndpoints, {
  type AvatarDeleteResponseOutput,
  type AvatarPostRequestOutput,
  type AvatarPostResponseOutput,
} from "./definition";

/**
 * Hook for uploading user avatar
 */
export function useUploadAvatar(
  logger: EndpointLogger,
  user: JwtPayloadType,
): ApiFormReturn<AvatarPostRequestOutput, AvatarPostResponseOutput, never> {
  return useApiForm(avatarEndpoints.POST, logger, user);
}

/**
 * Hook for deleting user avatar
 */
export function useDeleteAvatar(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EnhancedMutationResult<AvatarDeleteResponseOutput, never, never> {
  return useApiMutation(avatarEndpoints.DELETE, logger, user);
}
