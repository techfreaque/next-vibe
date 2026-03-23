/**
 * Custom Widget for Leads List
 * Provides a rich admin UI with navigation stack integration
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Upload } from "next-vibe-ui/ui/icons/Upload";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import {
  type LeadsTranslationKey,
  scopedTranslation as leadsScopedTranslation,
} from "@/app/api/[locale]/leads/i18n";
import { cn, objectEntries } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { MultiSelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import { type LeadStatusFilter, type LeadStatusFilterValue } from "../enum";
import type definition from "./definition";
import type { LeadListGetResponseTypeOutput } from "./definition";

type Lead = NonNullable<
  LeadListGetResponseTypeOutput["response"]
>["leads"][number];

interface CustomWidgetProps {
  field: {
    value: LeadListGetResponseTypeOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

const STATUS_COLORS: Record<string, string> = {
  "enums.leadStatus.new":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "enums.leadStatus.pending":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "enums.leadStatus.campaignRunning":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "enums.leadStatus.websiteUser":
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "enums.leadStatus.newsletterSubscriber":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "enums.leadStatus.inContact":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "enums.leadStatus.signedUp":
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "enums.leadStatus.subscriptionConfirmed":
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "enums.leadStatus.unsubscribed":
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  "enums.leadStatus.bounced":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "enums.leadStatus.invalid":
    "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200",
};

const CAMPAIGN_STAGE_COLORS: Record<string, string> = {
  "enums.emailCampaignStage.notStarted":
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "enums.emailCampaignStage.initial":
    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  "enums.emailCampaignStage.followup1":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "enums.emailCampaignStage.followup2":
    "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "enums.emailCampaignStage.followup3":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "enums.emailCampaignStage.nurture":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "enums.emailCampaignStage.reactivation":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

/** Status tab values for quick filtering */
const STATUS_TAB_VALUES = [
  { labelKey: "widget.tabAll", value: null },
  {
    labelKey: "widget.tabNew",
    value: "enums.leadStatusFilter.new",
  },
  {
    labelKey: "widget.tabCampaign",
    value: "enums.leadStatusFilter.campaignRunning",
  },
  {
    labelKey: "widget.tabConfirmed",
    value: "enums.leadStatusFilter.subscriptionConfirmed",
  },
  {
    labelKey: "widget.tabUnsubscribed",
    value: "enums.leadStatusFilter.unsubscribed",
  },
  {
    labelKey: "widget.tabBounced",
    value: "enums.leadStatusFilter.bounced",
  },
] as const;

function LeadRow({
  lead,
  locale,
  onView,
  onEdit,
  onDelete,
  t,
  leadsT,
  isTouch,
}: {
  lead: Lead;
  locale: CountryLanguage;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  leadsT: ReturnType<typeof leadsScopedTranslation.scopedT>["t"];
  isTouch: boolean;
}): React.JSX.Element {
  const isConverted = Boolean(lead.convertedUserId);

  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onView(lead)}
    >
      {/* Avatar / Initials */}
      <Div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
        {(lead.businessName ?? lead.email ?? "?").slice(0, 2).toUpperCase()}
      </Div>

      {/* Main content */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm truncate">
            {lead.businessName ?? lead.email ?? "—"}
          </Span>
          {lead.status && (
            <Span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                STATUS_COLORS[lead.status] ??
                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
              )}
            >
              {leadsT(lead.status)}
            </Span>
          )}
          {isConverted && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {t("widget.converted")}
            </Span>
          )}
          {lead.linkedLeadsCount > 0 && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              {t("widget.linkedCount", { count: lead.linkedLeadsCount })}
            </Span>
          )}
          {lead.hasLinkedUser && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
              <Users className="h-2.5 w-2.5 mr-1" />
              {t("widget.hasLinkedUser")}
            </Span>
          )}
          {lead.currentCampaignStage && (
            <Span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                CAMPAIGN_STAGE_COLORS[lead.currentCampaignStage] ??
                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
              )}
            >
              {leadsT(lead.currentCampaignStage)}
            </Span>
          )}
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          {lead.email && (
            <Span className="truncate max-w-[180px]">{lead.email}</Span>
          )}
          {lead.country && (
            <Span className="flex-shrink-0">{lead.country}</Span>
          )}
          {lead.source && (
            <Span className="flex-shrink-0">{leadsT(lead.source)}</Span>
          )}
        </Div>
        {lead.createdAt && (
          <Div className="text-xs text-muted-foreground mt-0.5">
            {formatSimpleDate(lead.createdAt, locale)}
          </Div>
        )}
      </Div>

      {/* Stats */}
      <Div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
        {lead.emailsSent !== null && lead.emailsSent !== undefined && (
          <Span>
            {t("widget.emailsSent", {
              count: lead.emailsSent,
            })}
          </Span>
        )}
        {lead.emailsOpened !== null &&
          lead.emailsOpened !== undefined &&
          lead.emailsSent !== null &&
          lead.emailsSent !== undefined && (
            <Span>
              {t("widget.openRate", {
                percent:
                  lead.emailsSent > 0
                    ? Math.round((lead.emailsOpened / lead.emailsSent) * 100)
                    : 0,
              })}
            </Span>
          )}
        {lead.emailsClicked !== null &&
          lead.emailsClicked !== undefined &&
          lead.emailsClicked > 0 && (
            <Span>
              {t("widget.clicks", {
                count: lead.emailsClicked,
              })}
            </Span>
          )}
      </Div>

      {/* Actions */}
      <Div
        className={cn(
          "flex-shrink-0 flex gap-0.5",
          isTouch
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onView(lead)}
          title={t("widget.view")}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(lead)}
          title={t("widget.edit")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(lead)}
          title={t("widget.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Div>
    </Div>
  );
}

export function LeadsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const isTouch = useTouchDevice();
  const t = useWidgetTranslation<typeof definition.GET>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof definition.GET>();
  const navigation = useWidgetNavigation();

  const onSubmit = useWidgetOnSubmit();

  const activeStatuses: (typeof LeadStatusFilterValue)[] =
    form.watch("statusFilters.status") ?? [];

  const leads = useMemo(
    () => field.value?.response?.leads ?? [],
    [field.value?.response?.leads],
  );
  const paginationInfo = field.value?.paginationInfo;
  const serverCountsByStatus = field.value?.countsByStatus;
  const isLoadingFresh = endpointMutations?.read?.isLoadingFresh ?? false;
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const isLoading = isLoadingFresh;

  // Status counts - from server (accurate across full DB, not just current page)
  const statusCounts = useMemo((): Partial<
    Record<LeadsTranslationKey, number>
  > => {
    if (serverCountsByStatus) {
      return {
        "enums.leadStatusFilter.new": serverCountsByStatus.new,
        "enums.leadStatusFilter.pending": serverCountsByStatus.pending,
        "enums.leadStatusFilter.campaignRunning":
          serverCountsByStatus.campaignRunning,
        "enums.leadStatusFilter.subscriptionConfirmed":
          serverCountsByStatus.subscriptionConfirmed,
        "enums.leadStatusFilter.unsubscribed":
          serverCountsByStatus.unsubscribed,
        "enums.leadStatusFilter.bounced": serverCountsByStatus.bounced,
      };
    }
    // Fallback: count from current page (stale until server data arrives)
    const counts: Partial<Record<LeadsTranslationKey, number>> = {};
    for (const lead of leads) {
      if (lead.status) {
        counts[lead.status] = (counts[lead.status] ?? 0) + 1;
      }
    }
    return counts;
  }, [serverCountsByStatus, leads]);

  const handleToggleStatus = useCallback(
    (status: string): void => {
      const current = form.getValues("statusFilters.status") ?? [];
      // status may be a LeadStatus key ("enums.leadStatus.xxx") or already a LeadStatusFilter key
      // Normalize to LeadStatusFilter key space ("enums.leadStatusFilter.xxx")
      const filterKey = status.replace(
        "enums.leadStatus.",
        "enums.leadStatusFilter.",
      );
      const typed =
        filterKey as (typeof LeadStatusFilter)[keyof typeof LeadStatusFilter];
      const next = current.includes(typed)
        ? current.filter((s) => s !== typed)
        : [...current, typed];
      form.setValue("statusFilters.status", next);
      form.setValue("paginationInfo.page", 1);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleView = useCallback(
    (lead: Lead): void => {
      void (async (): Promise<void> => {
        const leadDef =
          await import("@/app/api/[locale]/leads/lead/[id]/definition");
        navigation.push(leadDef.default.GET, {
          urlPathParams: { id: lead.id },
        });
      })();
    },
    [navigation],
  );

  const handleEdit = useCallback(
    (lead: Lead): void => {
      void (async (): Promise<void> => {
        const leadDef =
          await import("@/app/api/[locale]/leads/lead/[id]/definition");
        navigation.push(leadDef.default.PATCH, {
          urlPathParams: { id: lead.id },
          prefillFromGet: true,
          getEndpoint: leadDef.default.GET,
          data: {
            email: lead.email ?? undefined,
            businessName: lead.businessName ?? undefined,
            contactName: lead.contactName ?? undefined,
            status: lead.status ?? undefined,
            phone: lead.phone ?? undefined,
            website: lead.website ?? undefined,
            country: lead.country ?? undefined,
            language: lead.language ?? undefined,
            source: lead.source ?? undefined,
            notes: lead.notes ?? undefined,
          },
        });
      })();
    },
    [navigation],
  );

  const handleDelete = useCallback(
    (lead: Lead): void => {
      void (async (): Promise<void> => {
        const leadDef =
          await import("@/app/api/[locale]/leads/lead/[id]/definition");
        navigation.push(leadDef.default.DELETE, {
          urlPathParams: { id: lead.id },
          renderInModal: true,
          popNavigationOnSuccess: 1,
          onSuccessCallback: () => {
            endpointMutations?.read?.refetch?.();
          },
        });
      })();
    },
    [navigation, endpointMutations],
  );

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const createDef =
        await import("@/app/api/[locale]/leads/create/definition");
      navigation.push(createDef.default.POST);
    })();
  }, [navigation]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleExport = useCallback((): void => {
    void (async (): Promise<void> => {
      const exportDef =
        await import("@/app/api/[locale]/leads/export/definition");
      const currentSearch = form.getValues("statusFilters.search") ?? "";
      navigation.push(exportDef.default.GET, {
        renderInModal: true,
        data: {
          search: currentSearch || undefined,
        },
      });
    })();
  }, [navigation, form]);

  const handleImport = useCallback((): void => {
    void (async (): Promise<void> => {
      const importDef =
        await import("@/app/api/[locale]/leads/import/definition");
      navigation.push(importDef.default.POST);
    })();
  }, [navigation]);

  const handleBatchUpdate = useCallback((): void => {
    void (async (): Promise<void> => {
      const batchDef =
        await import("@/app/api/[locale]/leads/batch/definition");
      const currentSearch = form.getValues("statusFilters.search") ?? "";
      const currentStatus = form.getValues("statusFilters.status") ?? [];
      const currentSource = form.getValues("statusFilters.source") ?? [];
      const currentCampaignStage =
        form.getValues("statusFilters.currentCampaignStage") ?? [];
      navigation.push(batchDef.default.PATCH, {
        renderInModal: true,
        data: {
          search: currentSearch || undefined,
          status: currentStatus,
          currentCampaignStage: currentCampaignStage,
          source: currentSource,
        },
      });
    })();
  }, [navigation, form]);

  const handleStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const statsDef =
        await import("@/app/api/[locale]/leads/stats/definition");
      navigation.push(statsDef.default.GET);
    })();
  }, [navigation]);

  const handleGraphs = useCallback((): void => {
    void (async (): Promise<void> => {
      const graphsDef =
        await import("@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/definition");
      navigation.push(graphsDef.default.GET, {
        data: { search: "lead" },
      });
    })();
  }, [navigation]);

  const handleSearch = useCallback((): void => {
    void (async (): Promise<void> => {
      const searchDef =
        await import("@/app/api/[locale]/leads/search/definition");
      navigation.push(searchDef.default.GET);
    })();
  }, [navigation]);

  // Pagination
  const currentPage = form.watch("paginationInfo.page") ?? 1;
  const totalCount = paginationInfo?.totalCount ?? 0;
  const limit = form.watch("paginationInfo.limit") ?? 20;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handlePageChange = useCallback(
    (newPage: number): void => {
      form.setValue("paginationInfo.page", newPage);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const activeSources = form.watch("statusFilters.source") ?? [];
  const hasActiveFilters =
    activeStatuses.length > 0 || activeSources.length > 0;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("get.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </Span>
        {isFetching && !isLoadingFresh && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}

        {/* Spacer */}
        <Div className="flex-1" />

        {/* Action buttons */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleStats}
          title={t("widget.stats")}
          className="gap-1"
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.stats")}</Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGraphs}
          title={t("widget.graphs")}
          className="gap-1"
        >
          <GitBranch className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.graphs")}</Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSearch}
          title={t("widget.search")}
          className="gap-1"
        >
          <Search className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.search")}</Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleExport}
          title={t("widget.export")}
          className="gap-1"
        >
          <Download className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.export")}</Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImport}
          title={t("widget.import")}
          className="gap-1"
        >
          <Upload className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.import")}</Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBatchUpdate}
          title={t("widget.batch")}
          className="gap-1"
        >
          <Users className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.batch")}</Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleCreate}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          {t("get.createButton.label")}
        </Button>
      </Div>

      {/* Status quick-filter tabs */}
      <Div className="flex items-center gap-1 px-4 pt-3 pb-1 flex-wrap">
        {STATUS_TAB_VALUES.map((tab) => {
          const isActive =
            tab.value === null
              ? activeStatuses.length === 0
              : activeStatuses.includes(tab.value);
          const count =
            tab.value !== null ? (statusCounts[tab.value] ?? 0) : leads.length;
          return (
            <Button
              key={tab.value ?? "all"}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (tab.value === null) {
                  form.setValue("statusFilters.status", []);
                  form.setValue("paginationInfo.page", 1);
                  if (onSubmit) {
                    onSubmit();
                  }
                } else {
                  handleToggleStatus(tab.value);
                }
              }}
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {t(tab.labelKey)}
              {count > 0 && (
                <Span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-[10px] font-semibold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </Span>
              )}
            </Button>
          );
        })}
      </Div>

      {/* Search + Filters row */}
      <Div className="px-4 pt-2 pb-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <TextFieldWidget
          fieldName="statusFilters.search"
          field={children.statusFilters.children.search}
        />
        <MultiSelectFieldWidget
          fieldName="statusFilters.source"
          field={children.statusFilters.children.source}
        />
        <MultiSelectFieldWidget
          fieldName="statusFilters.currentCampaignStage"
          field={children.statusFilters.children.currentCampaignStage}
        />
        <MultiSelectFieldWidget
          fieldName="locationFilters.country"
          field={children.locationFilters.children.country}
        />
        <MultiSelectFieldWidget
          fieldName="locationFilters.language"
          field={children.locationFilters.children.language}
        />
        <SelectFieldWidget
          fieldName="sortingOptions.sortBy"
          field={children.sortingOptions.children.sortBy}
        />
        <SelectFieldWidget
          fieldName="sortingOptions.sortOrder"
          field={children.sortingOptions.children.sortOrder}
        />
      </Div>

      {/* Status breakdown subtitle */}
      {!isLoading && leads.length > 0 && (
        <Div className="px-4 pb-1 flex items-center gap-3 flex-wrap">
          {objectEntries(statusCounts)
            .toSorted(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([status, count]) => {
              const filterKey = status.replace(
                "enums.leadStatus.",
                "enums.leadStatusFilter.",
              ) as (typeof LeadStatusFilter)[keyof typeof LeadStatusFilter];
              return (
                <Button
                  key={status}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus(status)}
                  className={cn(
                    "text-xs text-muted-foreground hover:text-foreground transition-colors",
                    activeStatuses.includes(filterKey) &&
                      "text-foreground font-medium",
                  )}
                >
                  <Span
                    className={cn(
                      "inline-block w-2 h-2 rounded-full mr-1",
                      STATUS_COLORS[status]?.split(" ")[0] ?? "bg-gray-400",
                    )}
                  />
                  {leadsT(status)}: {count}
                </Button>
              );
            })}
        </Div>
      )}

      {/* Lead list */}
      <Div
        className={cn(
          "px-4 pb-2 overflow-y-auto max-h-[min(700px,calc(100dvh-320px))]",
          isFetching && !isLoadingFresh && "opacity-50 pointer-events-none",
        )}
      >
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : leads.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                locale={locale}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                t={t}
                leadsT={leadsT}
                isTouch={isTouch}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            <Div className="mb-2">
              {hasActiveFilters ? t("get.emptySearch") : t("get.emptyState")}
            </Div>
            {!hasActiveFilters && (
              <Div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCreate}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {t("widget.addLead")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImport}
                  className="gap-1"
                >
                  <Upload className="h-4 w-4" />
                  {t("widget.importCsv")}
                </Button>
              </Div>
            )}
          </Div>
        )}
      </Div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {t("widget.pagination", {
              page: currentPage,
              totalPages,
              total: totalCount,
            })}
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
