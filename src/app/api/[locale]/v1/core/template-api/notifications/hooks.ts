/**
 * Template Notifications Hooks
 * Client-side hooks for template notification operations with proper useEndpoint patterns
 */

import { useMemo } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import definitions from "./definition";

/**
 * Hook for template notification operations with enhanced TypeScript typing
 */
export function useTemplateNotificationsEndpoint(
  logger: EndpointLogger,
  params?: {
    enabled?: boolean;
  },
): EndpointReturn<typeof definitions> {
  const queryOptions = useMemo(
    () => ({
      enabled: params?.enabled !== false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Always fresh for notifications
    }),
    [params?.enabled],
  );

  const formOptions = useMemo(
    () => ({
      persistForm: false, // Don't persist notification forms
    }),
    [],
  );

  return useEndpoint(
    definitions,
    {
      queryOptions,
      formOptions,
    },
    logger,
  );
}
