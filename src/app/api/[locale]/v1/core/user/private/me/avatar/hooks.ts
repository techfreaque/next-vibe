import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";
import type { EnhancedMutationResult } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import {
  useApiForm,
  useApiMutation,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

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
