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
import { useEffect } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { EnhancedMutationResult } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation";
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";
import {
  createCustomStateKey,
  useCustomState,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/store";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/core/client";

import { authClientRepository } from "../../auth/repository-client";
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
const USER_AUTH_CHECKED_KEY = "user_auth_checked";

// Create typed state keys for user-related state
const queryEnabledKey = createCustomStateKey<boolean>(USER_QUERY_ENABLED_KEY);
const authCheckedKey = createCustomStateKey<boolean>(USER_AUTH_CHECKED_KEY);

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

export function useUser(logger: EndpointLogger): UseUserReturn {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [queryEnabled, setQueryEnabled] = useCustomState(
    queryEnabledKey,
    false,
  );
  const [authChecked, setAuthChecked] = useCustomState(authCheckedKey, false);

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
      enabled: queryEnabled, // Enable based on auth status
      onError: ({ error }: { error: { message: string } }) => {
        // Only show toast for client errors, not connection errors
        // as those are already handled by the hooks
        // Suppress toast for unauthorized errors (403) when JWT token contains non-existent user ID
        if (
          [
            "error.unauthorized",
            "app.api.errors.authentication_required",
          ].includes(error.message)
        ) {
          return;
        }
        toast({
          title: t("common.error.title"),
          description: error.message,
          variant: "destructive",
        });
      },
      onSuccess: () => {
        // Set auth status when user data is successfully fetched
        const authStatusResult = authClientRepository.setAuthStatus(logger);
        if (!authStatusResult.success) {
          logger.error("user.auth.status.set.failed", authStatusResult);
        }
      },
    },
  });

  // Transform user data to match AuthUser interface with proper typing
  const authUser = userResponse;

  // Check authentication status only once on mount
  useEffect(() => {
    if (authChecked) {
      return;
    }

    const checkInitialAuthState = (): void => {
      try {
        // Check if we have client-side auth status
        const authResponse = authClientRepository.hasAuthStatus(logger);

        if (authResponse.success && authResponse.data) {
          logger.debug("Client-side auth status found, enabling query");
          setQueryEnabled(true);
        } else {
          logger.debug("No client-side auth status, disabling query");
          setQueryEnabled(false);
        }

        setAuthChecked(true);
      } catch (error) {
        logger.error("user.auth.initial.check.failed", error);
        setAuthChecked(true);
      }
    };

    checkInitialAuthState();
  }, [authChecked, setQueryEnabled, setAuthChecked, logger]);

  return {
    user: authUser,
    isLoggedIn: !!userResponse && !isError,
    isLoading: isLoading || !authChecked,
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
  const { refetch } = useUser(logger);
  const { t } = useTranslation();

  return useApiMutation(meEndpoints.POST, logger, {
    onSuccess: async () => {
      toast({
        title: t("app.api.v1.core.user.notifications.profileUpdated.title"),
        description: t(
          "app.api.v1.core.user.notifications.profileUpdated.description",
        ),
        variant: "default",
      });

      await refetch();
    },
    onError: ({ error }) => {
      toast({
        title: t("app.api.v1.core.user.notifications.updateFailed.title"),
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
        title: t("user.account.delete.success.title"),
        description: t("user.account.delete.success.description"),
        variant: "default",
      });

      // Note: Redirect should be handled in the component that uses this hook
    },
    onError: ({ error }) => {
      toast({
        title: t("user.account.delete.error.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
