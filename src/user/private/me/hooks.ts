/**
 * User API Hooks
 * User API Hooks
 * Hooks for interacting with the User API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { useEffect, useRef } from "react";

import {
  createCustomStateKey,
  useCustomState,
} from "../../../vibe/platforms/react/hooks/store";
import { useApiQuery } from "../../../vibe/platforms/react/hooks/use-api-query";
import meEndpoints, { type MeGetResponseOutput } from "./definition";

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
interface UseUserReturn {
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
    user,
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
