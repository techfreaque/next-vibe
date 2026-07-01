import { useTranslation } from "next-vibe/core/i18n/core/client";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { ApiFormReturn } from "next-vibe/platforms/react/hooks/types";

import {
  type EnhancedMutationResult,
  useApiMutation,
} from "../../../../system/platforms/react/hooks/use-api-mutation";
import { useApiForm } from "../../../../system/platforms/react/hooks/use-api-mutation-form";
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
  const { locale } = useTranslation();
  return useApiForm(avatarEndpoints.POST, logger, user, locale);
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
