/**
 * Custom Widget for Leads List
 * Provides a rich admin UI with navigation stack integration
 */

"use client";

import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EmptyBlock } from "next-vibe-ui/ui/empty-block";
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
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { Span } from "next-vibe-ui/ui/span";
import { StatusPill } from "next-vibe-ui/ui/status-pill";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import { usePickerCallback } from "next-vibe-ui/unified/_shared/picker-context";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { MultiSelectFieldWidget } from "next-vibe-ui/unified/form-fields/multiselect-field/widget";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe-ui/unified/interactive/navigate-button/widget";
import React, { useCallback, useMemo } from "react";

import {
  type LeadsTranslationKey,
  scopedTranslation as leadsScopedTranslation,
} from "@/app/api/[locale]/leads/i18n";
import { cn, objectEntries } from "@/app/api/[locale]/shared/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import { type LeadStatusFilter, type LeadStatusFilterValue } from "../enum";
import type definition from "./definition";
import type { LeadListGetResponseTypeOutput } from "./definition";

type Lead = NonNullable<
  LeadListGetResponseTypeOutput["response"]
>["leads"][number];

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type PillVariant = "default" | "success" | "warning" | "danger" | "info";

const STATUS_VARIANT: Record<string, PillVariant> = {
  "enums.leadStatus.new": "info",
  "enums.leadStatus.pending": "warning",
  "enums.leadStatus.campaignRunning": "info",
  "enums.leadStatus.websiteUser": "info",
  "enums.leadStatus.newsletterSubscriber": "info",
  "enums.leadStatus.inContact": "warning",
  "enums.leadStatus.signedUp": "success",
  "enums.leadStatus.subscriptionConfirmed": "success",
  "enums.leadStatus.unsubscribed": "default",
  "enums.leadStatus.bounced": "danger",
  "enums.leadStatus.invalid": "danger",
};

const STATUS_DOT_COLORS: Record<string, string> = {
  "enums.leadStatus.new": "bg-info",
  "enums.leadStatus.pending": "bg-warning",
  "enums.leadStatus.campaignRunning": "bg-purple-500",
  "enums.leadStatus.websiteUser": "bg-cyan-500",
  "enums.leadStatus.newsletterSubscriber": "bg-indigo-500",
  "enums.leadStatus.inContact": "bg-orange-500",
  "enums.leadStatus.signedUp": "bg-teal-500",
  "enums.leadStatus.subscriptionConfirmed": "bg-success",
  "enums.leadStatus.unsubscribed": "bg-gray-400",
  "enums.leadStatus.bounced": "bg-destructive",
  "enums.leadStatus.invalid": "bg-destructive",
};

const CAMPAIGN_STAGE_VARIANT: Record<string, PillVariant> = {
  "enums.emailCampaignStage.notStarted": "default",
  "enums.emailCampaignStage.initial": "info",
  "enums.emailCampaignStage.followup1": "info",
  "enums.emailCampaignStage.followup2": "info",
  "enums.emailCampaignStage.followup3": "info",
  "enums.emailCampaignStage.nurture": "success",
  "enums.emailCampaignStage.reactivation": "warning",
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

interface LeadRowProps {
  lead: Lead;
  locale: CountryLanguage;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  leadsT: ReturnType<typeof leadsScopedTranslation.scopedT>["t"];
  isTouch: boolean;
  isPickerMode: boolean;
}

function LeadRow({
  lead,
  locale,
  onView,
  onEdit,
  onDelete,
  t,
  leadsT,
  isTouch,
  isPickerMode,
}: LeadRowProps): React.JSX.Element {
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
            <StatusPill
              status={leadsT(lead.status)}
              variant={STATUS_VARIANT[lead.status] ?? "default"}
            />
          )}
          {isConverted && (
            <StatusPill status={t("widget.converted")} variant="warning" />
          )}
          {lead.linkedLeadsCount > 0 && (
            <StatusPill
              status={t("widget.linkedCount", { count: lead.linkedLeadsCount })}
              variant="info"
            />
          )}
          {lead.hasLinkedUser && (
            <StatusPill status={t("widget.hasLinkedUser")} variant="info" />
          )}
          {lead.currentCampaignStage && (
            <StatusPill
              status={leadsT(lead.currentCampaignStage)}
              variant={
                CAMPAIGN_STAGE_VARIANT[lead.currentCampaignStage] ?? "default"
              }
            />
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
      <Div className="hidden @md:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
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

      {/* Actions - hidden in picker mode */}
      {!isPickerMode && (
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
      )}
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
  const widgetData = useWidgetValue<typeof definition.GET>();
  const onPick = usePickerCallback<Lead>();
  const isPickerMode = !!onPick;

  const onSubmit = useWidgetOnSubmit();

  const activeStatuses: (typeof LeadStatusFilterValue)[] =
    form.watch("statusFilters.status") ?? [];

  const leads = useMemo(
    () => widgetData?.response?.leads ?? [],
    [widgetData?.response?.leads],
  );
  const paginationInfo = widgetData?.paginationInfo;
  const serverCountsByStatus = widgetData?.countsByStatus;
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
      if (onPick) {
        onPick(lead);
        navigation.pop();
        return;
      }
      void (async (): Promise<void> => {
        const leadDef =
          await import("@/app/api/[locale]/leads/lead/[id]/definition");
        navigation.push(leadDef.default.GET, {
          urlPathParams: { id: lead.id },
        });
      })();
    },
    [navigation, onPick],
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

  const headerActions = (
    <Div className="flex items-center gap-1 flex-wrap">
      {isFetching && !isLoadingFresh && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {!isPickerMode && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleStats}
            title={t("widget.stats")}
            className="gap-1"
          >
            <BarChart3 className="h-4 w-4" />
            <Span className="hidden @sm:inline">{t("widget.stats")}</Span>
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
            <Span className="hidden @sm:inline">{t("widget.graphs")}</Span>
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
            <Span className="hidden @sm:inline">{t("widget.search")}</Span>
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
            <Span className="hidden @sm:inline">{t("widget.export")}</Span>
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
            <Span className="hidden @sm:inline">{t("widget.import")}</Span>
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
            <Span className="hidden @sm:inline">{t("widget.batch")}</Span>
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
        </>
      )}
    </Div>
  );

  return (
    <WidgetShell padding="none">
      {/* Header */}
      <Div className="px-4 pt-4">
        <WidgetHeader
          title={`${t("get.title")}${totalCount > 0 ? ` (${totalCount})` : ""}`}
          backButton={<NavigateButtonWidget field={children.backButton} />}
          actions={headerActions}
        />
      </Div>

      {/* Status quick-filter tabs — full mode only */}
      {!isPickerMode && (
        <Div className="flex items-center gap-1 px-4 pt-3 pb-1 flex-wrap">
          {STATUS_TAB_VALUES.map((tab) => {
            const isActive =
              tab.value === null
                ? activeStatuses.length === 0
                : activeStatuses.includes(tab.value);
            const count =
              tab.value !== null
                ? (statusCounts[tab.value] ?? 0)
                : leads.length;
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
      )}

      {/* Search — always visible; full filters only in normal mode */}
      <Div className="px-4 pt-2 pb-0 grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 gap-2">
        <TextFieldWidget
          fieldName="statusFilters.search"
          field={children.statusFilters.children.search}
        />
        {!isPickerMode && (
          <>
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
          </>
        )}
      </Div>

      {/* Status breakdown subtitle — full mode only */}
      {!isPickerMode && !isLoading && leads.length > 0 && (
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
                      STATUS_DOT_COLORS[status] ?? "bg-gray-400",
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
          <LoadingBlock />
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
                isPickerMode={isPickerMode}
              />
            ))}
          </Div>
        ) : (
          <EmptyBlock
            title={
              hasActiveFilters ? t("get.emptySearch") : t("get.emptyState")
            }
            action={
              !hasActiveFilters && !isPickerMode
                ? {
                    label: t("widget.addLead"),
                    onClick: handleCreate,
                  }
                : undefined
            }
          />
        )}
      </Div>

      {/* Pagination footer — full mode only */}
      {!isPickerMode && totalPages > 1 && (
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
    </WidgetShell>
  );
}
