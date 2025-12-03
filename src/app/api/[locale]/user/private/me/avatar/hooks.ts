import type { ApiFormReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import avatarEndpoints, {
  type AvatarDeleteResponseOutput,
  type AvatarPostRequestOutput,
  type AvatarPostResponseOutput,
} from "./definition";
import { useApiForm } from "../../../../system/unified-interface/react/hooks/use-api-mutation-form";
import {
  type EnhancedMutationResult,
  useApiMutation,
} from "../../../../system/unified-interface/react/hooks/use-api-mutation";

/**
 * Hook for uploading user avatar
 */
export function useUploadAvatar(
  logger: EndpointLogger,
): ApiFormReturn<AvatarPostRequestOutput, AvatarPostResponseOutput, never> {
  return useApiForm(avatarEndpoints.POST, logger);
}

/**
 * Hook for deleting user avatar
 */
export function useDeleteAvatar(
  logger: EndpointLogger,
): EnhancedMutationResult<AvatarDeleteResponseOutput, never, never> {
  return useApiMutation(avatarEndpoints.DELETE, logger);
}
