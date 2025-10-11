/**
 * Template Item Hooks
 * Client-side hooks for template item operations with proper useEndpoint patterns
 */

"use client";

import { useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useTranslation } from "@/i18n/core/client";

import definitions from "./definition";

/**
 * Hook for template item operations with enhanced TypeScript typing
 */
export function useTemplateItemEndpoint(params: {
  templateId: string;
  enabled?: boolean;
}): EndpointReturn<typeof definitions> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useEndpoint(
    definitions,
    {
      enabled: params?.enabled !== false && !!params.templateId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      formOptions: {
        persistForm: false,
        persistenceKey: `template-${params.templateId}-form`,
      },
    },
    logger,
  );
}
