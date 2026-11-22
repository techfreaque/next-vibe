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

import { useApiQuery } from "../../../vibe/unified-ui/hooks/use-api-query";
import meEndpoints, { type MeGetResponseOutput } from "./definition";

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
      enabled: !user.isPublic,
    },
  });

  return {
    user: user.isPublic ? undefined : userResponse,
    isLoggedIn: !user.isPublic && !!userResponse && !isError,
    isLoading: !user.isPublic && isLoading,
    refetch,
    error: user.isPublic ? undefined : error,
  };
}
