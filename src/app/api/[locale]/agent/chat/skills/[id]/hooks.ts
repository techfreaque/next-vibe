/**
 * Single Skill Hooks
 * React hooks for single skill operations (get, update, delete)
 */

"use client";

import { useMemo } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { SkillGetResponseOutput } from "./definition";
import definitions from "./definition";

/**
 * Hook for fetching a single skill by ID
 *
 * Features:
 * - Fetches default or custom skill
 * - Returns full skill details
 */
export function useSkill(
  skillId: string | undefined,
  user: JwtPayloadType,
  logger: EndpointLogger,
  /** SSR-prefetched skill data - pre-populates React Query cache, skips initial fetch */
  initialData?: SkillGetResponseOutput | null,
): SkillEndpointReturn {
  const options = useMemo(
    () => ({
      read: {
        queryOptions: {
          // Only enable during SSR if we have initialData to hydrate from.
          // Without it, SSR would fetch and render skill content that the client can't
          // match on initial render (no data yet) → hydration mismatch → blank flash.
          enabled:
            !!skillId &&
            ((initialData !== null && initialData !== undefined) ||
              typeof window !== "undefined"),
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
        urlPathParams: { id: skillId ?? "" },
        initialData: initialData ?? undefined,
      },
      update: {
        urlPathParams: { id: skillId ?? "" },
      },
      delete: {
        urlPathParams: { id: skillId ?? "" },
      },
    }),
    [skillId, initialData],
  );
  return useEndpoint(definitions, options, logger, user);
}

export type SkillEndpointReturn = EndpointReturn<typeof definitions>;
