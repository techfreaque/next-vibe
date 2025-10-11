/**
 * Enhanced Template Stats Hooks
 * Custom hooks for enhanced template statistics with UI metadata support
 */

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for enhanced template statistics operations with UI metadata
 */
export function useEnhancedTemplateStatsEndpoint(params: {
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof definitions> {
  const queryOptions = useMemo(
    () => ({
      enabled: params?.enabled !== false,
      refetchOnWindowFocus: true, // Refresh stats when window gains focus
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    [params?.enabled],
  );

  const formOptions = useMemo(
    () => ({
      persistForm: true,
      persistenceKey: "enhanced-template-stats-form",
    }),
    [],
  );

  return useEndpoint(
    definitions,
    {
      queryOptions,
      formOptions,
    },
    params.logger,
  );
}

/**
 * Enhanced hook with additional utilities for form and CLI integration
 */
export function useEnhancedTemplateStats(params: {
  enabled?: boolean;
  autoSubmit?: boolean;
  logger: EndpointLogger;
}) {
  const endpoint = useEnhancedTemplateStatsEndpoint(params);

  // Auto-submit form when enabled
  const { autoSubmit = false } = params || {};

  // Submit form automatically on mount if autoSubmit is true
  useMemo(() => {
    if (autoSubmit && endpoint.read.form) {
      // Small delay to ensure form is ready
      setTimeout(() => {
        endpoint.read.form.handleSubmit(() => {
          // Form submission is handled by the endpoint
        })();
      }, 100);
    }
  }, [autoSubmit, endpoint.read.form]);

  return {
    // Core endpoint functionality
    ...endpoint,

    // Enhanced utilities
    utils: {
      // Get field UI configuration
      getFieldConfig: (fieldName: string) => {
        const definition = definitions.GET;
        return definition.ui?.form?.fields?.[fieldName];
      },

      // Get form groups
      getFormGroups: () => {
        const definition = definitions.GET;
        return definition.ui?.form?.groups || [];
      },

      // Get CLI configuration
      getCliConfig: () => {
        const definition = definitions.GET;
        return definition.ui?.cli;
      },

      // Get loading states
      getLoadingStates: () => {
        const definition = definitions.GET;
        return definition.ui?.loading;
      },

      // Format field value for display
      formatFieldValue: (fieldName: string, value: any) => {
        const fieldConfig = definitions.GET.ui?.form?.fields?.[fieldName];
        if (!fieldConfig) {
          return String(value);
        }

        if (fieldConfig.type === "select" && fieldConfig.options) {
          const option = fieldConfig.options.find((opt) => opt.value === value);
          return option?.label || String(value);
        }

        if (fieldConfig.type === "multiselect" && Array.isArray(value)) {
          return value
            .map((v) => {
              const option = fieldConfig.options?.find(
                (opt) => opt.value === v,
              );
              return option?.label || String(v);
            })
            .join(", ");
        }

        return String(value);
      },
    },
  };
}

export type EnhancedTemplateStatsEndpointReturn = EndpointReturn<
  typeof definitions
>;
export type UseEnhancedTemplateStatsReturn = ReturnType<
  typeof useEnhancedTemplateStats
>;
