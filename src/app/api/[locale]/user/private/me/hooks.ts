/**
 * User API Hooks
 * User API Hooks
 * Hooks for interacting with the User API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useEffect, useRef } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import {
  createCustomStateKey,
  useCustomState,
} from "../../../system/unified-interface/react/hooks/store";
import {
  type EnhancedMutationResult,
  useApiMutation,
} from "../../../system/unified-interface/react/hooks/use-api-mutation";
import { useApiQuery } from "../../../system/unified-interface/react/hooks/use-api-query";
import type { JwtPayloadType } from "../../auth/types";
import meEndpoints, {
  type MeDeleteRequestOutput,
  type MeDeleteResponseOutput,
  type MeGetResponseOutput,
  type MePostRequestOutput,
  type MePostResponseOutput,
} from "./definition";

/****************************
 * STATE KEYS
 ****************************/

// Constants for state keys to avoid literal strings
const USER_QUERY_ENABLED_KEY = "user_query_enabled";

// Create typed state keys for user-related state
const queryEnabledKey = createCustomStateKey<boolean>(USER_QUERY_ENABLED_KEY);

/****************************
 * QUERY HOOKS
 ****************************/

/**
 * Hook for fetching and managing user data
 *
 * Features:
 * - Automatically checks authentication status
 * - Fetches user data if authenticated
 * - Transforms user data to include roles array
 * - Handles errors with toast notifications
 * - Uses API store instead of useState to prevent re-renders
 *
 * @returns User data and loading state
 */
export interface UseUserReturn {
  user: MeGetResponseOutput | undefined;
  isLoggedIn: boolean;
  isLoading: boolean;
  refetch: () => Promise<ResponseType<MeGetResponseOutput>>;
  error: ErrorResponseType | undefined;
}

export function useUser(
  user: JwtPayloadType,
  logger: EndpointLogger,
): UseUserReturn {
  const [queryEnabled, setQueryEnabled] = useCustomState(
    queryEnabledKey,
    !!user.isPublic,
  );
  const {
    data: userResponse,
    isLoading,
    isError,
    refetch,
    error,
  } = useApiQuery({
    endpoint: meEndpoints.GET,
    logger,
    options: {
      enabled: queryEnabled, // Enable immediately - server handles auth
    },
  });

  // Transform user data to match AuthUser interface with proper typing
  const authUser = userResponse;

  // Enable query immediately - server will return 401 if not authenticated
  const hasEnabledQuery = useRef(false);
  useEffect(() => {
    if (!user.isPublic && !hasEnabledQuery.current) {
      hasEnabledQuery.current = true;
      logger.debug("Enabling /me query - server will handle auth");
      setQueryEnabled(true);
    }
  }, [user.isPublic, logger, setQueryEnabled]);

  return {
    user: authUser,
    isLoggedIn: !!userResponse && !isError,
    isLoading: isLoading,
    refetch,
    error,
  };
}

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for updating user profile
 *
 * Features:
 * - Handles success and error toasts
 * - Automatically re-fetches user data on success
 * - Properly handles error responses from server
 *
 * @returns Profile update mutation
 */
export function useUpdateProfile(
  logger: EndpointLogger,
): EnhancedMutationResult<MePostResponseOutput, MePostRequestOutput, never> {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useApiMutation(meEndpoints.POST, logger, {
    onSuccess: async () => {
      toast({
        title: t("app.api.user.notifications.profileUpdated.title"),
        description: t("app.api.user.notifications.profileUpdated.description"),
        variant: "default",
      });
    },
    onError: ({ error }) => {
      toast({
        title: t("app.api.user.notifications.updateFailed.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for deleting user account
 *
 * Features:
 * - Handles success and error toasts
 * - Properly handles error responses from server
 *
 * @returns Account deletion mutation
 */
export function useDeleteAccount(
  logger: EndpointLogger,
): EnhancedMutationResult<
  MeDeleteResponseOutput,
  MeDeleteRequestOutput,
  never
> {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useApiMutation(meEndpoints.DELETE, logger, {
    onSuccess: () => {
      toast({
        title: t("app.api.user.private.me.delete.success.title"),
        description: t("app.api.user.private.me.delete.success.description"),
        variant: "default",
      });

      // Note: Redirect should be handled in the component that uses this hook
    },
    onError: ({ error }) => {
      toast({
        title: t("app.api.user.private.me.delete.errors.unknown.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
