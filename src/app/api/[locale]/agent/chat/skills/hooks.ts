/**
 * Skills Hooks
 * React hooks for skill operations and model selection
 */

"use client";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
