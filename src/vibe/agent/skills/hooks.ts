/**
 * Skills Hooks
 * React hooks for skill operations and model selection
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook to fetch all skills (default + custom)
 * - All users use API (endpoint is public)
 * - Public users: read-only access to defaults
 * - Authenticated users: can create/edit custom skills
 */
export function useSkills(
  user: JwtPayloadType,
  logger: EndpointLogger,
): ReturnType<typeof useEndpoint<typeof definitions>> {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    },
    logger,
    user,
  );
}
