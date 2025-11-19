import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/types";
import type { EnhancedMutationResult } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import {
  useApiForm,
  useApiMutation,
} from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

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
