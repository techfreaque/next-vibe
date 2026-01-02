/**
 * Leads Stats API Hooks
 * React hooks for interacting with the Leads Stats API following user stats pattern
 */

"use client";

import {
  ChartType,
  DateRangePreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { useCallback, useMemo } from "react";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { CountryFilter, type CountryLanguage, LanguageFilter } from "@/i18n/core/config";

import type {
  EndpointReturn,
  FormAlertState,
} from "../../system/unified-interface/react/hooks/endpoint-types";
import {
  EmailCampaignStageFilter,
  LeadSortField,
  LeadSourceFilter,
  LeadStatusFilter,
  SortOrder,
} from "../enum";
import type { LeadsStatsResponseOutput } from "./definition";
import definitions from "./definition";

/**
 * Basic endpoint hook for leads statistics
 */
export type LeadsStatsEndpointReturn = EndpointReturn<typeof definitions>;
export function useLeadsStatsEndpoint(
  logger: EndpointLogger,
  enabled = true,
): LeadsStatsEndpointReturn {
  const queryOptions = useMemo(
    () => ({
      queryOptions: {
        enabled: enabled !== false,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
      filterOptions: {
        initialFilters: {
          timePeriod: TimePeriod.DAY,
          dateRangePreset: DateRangePreset.LAST_30_DAYS,
          chartType: ChartType.LINE,
          includeComparison: false,
          status: LeadStatusFilter.ALL,
          campaignStage: EmailCampaignStageFilter.ALL,
          country: CountryFilter.ALL,
          language: LanguageFilter.ALL,
          source: LeadSourceFilter.ALL,
          sortBy: LeadSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
      },
    }),
    [enabled],
  );

  return useEndpoint(definitions, queryOptions, logger);
}

/**
 * Advanced hook for leads statistics with all business logic
 * Handles filtering, data transformation, and state management
 */
export function useLeadsStats(
  locale: CountryLanguage,
  logger: EndpointLogger,
): UseLeadsStatsReturn {
  const endpoint = useLeadsStatsEndpoint(logger);

  /**
   * Refresh stats data
   */
  const refreshStats = useCallback(() => {
    void endpoint.read.refetch();
  }, [endpoint.read]);

  /**
   * Get current stats data
   */
  const stats = useMemo(() => {
    const response = endpoint.read.response;
    return response?.success ? response.data : null;
  }, [endpoint.read.response]);

  // Loading and error states
  const isLoading = endpoint.read.isLoading;
  const hasError = !endpoint.read.response?.success;
  const hasData = !!stats;

  // Utility functions
  const formatPercentage = useCallback((value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  }, []);

  const formatNumber = useCallback(
    (value: number): string => {
      const GLOBAL_SUFFIX = "-GLOBAL";
      return new Intl.NumberFormat(locale.replace(GLOBAL_SUFFIX, "")).format(value);
    },
    [locale],
  );

  const calculatePercentageChange = useCallback((current: number, previous: number): number => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }, []);

  const getTrendIndicator = useCallback(
    (current: number, previous: number): "up" | "down" | "neutral" => {
      const change = calculatePercentageChange(current, previous);
      if (change > 0) {
        return "up";
      }
      if (change < 0) {
        return "down";
      }
      return "neutral";
    },
    [calculatePercentageChange],
  );

  // No transformation needed - use stats directly

  return {
    // Core data
    stats,

    // State
    isLoading,
    hasError,
    hasData,

    // Actions
    refreshStats,

    // Utilities
    formatPercentage,
    formatNumber,
    calculatePercentageChange,
    getTrendIndicator,

    // Form control for filters
    form: endpoint.read.form,

    // Alert for notifications
    alert: endpoint.alert,
  };
}

export interface UseLeadsStatsReturn {
  stats: LeadsStatsResponseOutput | null;
  isLoading: boolean;
  hasError: boolean;
  hasData: boolean;
  refreshStats: () => void;
  formatPercentage: (num: number) => string;
  formatNumber: (num: number) => string;
  calculatePercentageChange: (current: number, previous: number) => number;
  getTrendIndicator: (current: number, previous: number) => "up" | "down" | "neutral";
  form: LeadsStatsEndpointReturn["read"]["form"];
  alert: FormAlertState | null;
}
