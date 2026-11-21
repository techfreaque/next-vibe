/**
 * Custom Widget for Leads List
 * Provides a rich admin UI with navigation stack integration
 */

"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  formatCurrency,
  formatSimpleDate,
} from "next-vibe/core/i18n/core/localization-utils";
import { objectEntries } from "next-vibe/core/utils/object";
import {
  type LeadStatusFilter,
  type LeadStatusFilterValue,
} from "next-vibe/identity/lead/enum";
import {
  type LeadsTranslationKey,
  scopedTranslation as leadsScopedTranslation,
} from "next-vibe/identity/lead/i18n";
import type { AnalyticsFilterChip } from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Download } from "next-vibe/ui/components/icons/Download";
import { GitBranch } from "next-vibe/ui/components/icons/GitBranch";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Upload } from "next-vibe/ui/components/icons/Upload";
import { Users } from "next-vibe/ui/components/icons/Users";
import { X } from "next-vibe/ui/components/icons/X";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useTouchDevice } from "next-vibe/ui/hooks/use-touch-device";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { MultiSelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/multiselect-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import React, { useCallback, useMemo } from "react";

import { BotFamily, FunnelReach } from "../analytics/enum";
import type { LeadDrillFilters } from "../analytics/filters";
import {
  dimensionValueLabel,
  segmentChips,
  SegmentFilterPanel,
  useLeadAnalyticsT,
} from "../analytics/widget-parts";
import { AcquisitionSourceFilter } from "../growth/acquisition";
import { AcquisitionFilterInputs } from "../growth/acquisition-filter-inputs";
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
  st: ReturnType<typeof useLeadAnalyticsT>;
  isDrill: boolean;
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
  st,
  isDrill,
  isTouch,
  isPickerMode,
}: LeadRowProps): React.JSX.Element {
  const isConverted = Boolean(lead.convertedUserId);
  const acquisition = lead.acquisition;
  const triage = lead.triage;
  const isBot = triage ? triage.botFamily !== BotFamily.HUMAN : false;
  const origin = triage
    ? [
        dimensionValueLabel(triage.channelType, st),
        triage.channel && triage.channel !== "direct" ? triage.channel : null,
        triage.source,
        triage.referrerHost,
        triage.landingPath,
      ].filter((part): part is string => Boolean(part))
    : [];
  const client = triage
    ? [
        triage.geoCountry ? dimensionValueLabel(triage.geoCountry, st) : null,
        dimensionValueLabel(triage.device, st),
        triage.browser,
        triage.os,
        triage.ipPrefix,
      ].filter((part): part is string => Boolean(part))
    : [];
  return (
    <Div className="group relative flex min-w-0 flex-wrap items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
      {/* Avatar / Initials */}
      <Div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
        {(lead.businessName ?? lead.email ?? "?").slice(0, 2).toUpperCase()}
      </Div>

      {/* Main content */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onView(lead)}
            className="h-auto min-w-0 p-0 font-semibold text-sm hover:bg-transparent hover:underline before:absolute before:inset-0 before:rounded-lg focus-visible:before:ring-2 focus-visible:before:ring-ring"
          >
            <Span className="truncate">
              {lead.businessName || lead.email || lead.id}
            </Span>
          </Button>
          {lead.status && (
            <StatusPill
              status={leadsT(lead.status)}
              variant={STATUS_VARIANT[lead.status] ?? "default"}
            />
          )}
          {triage && (
            <StatusPill
              status={dimensionValueLabel(triage.botFamily, st)}
              variant={isBot ? "danger" : "default"}
            />
          )}
          {triage?.paid ? (
            <StatusPill status={t("widget.paid")} variant="success" />
          ) : triage?.signedUp ? (
            <StatusPill status={t("widget.signedUp")} variant="success" />
          ) : isConverted ? (
            <StatusPill status={t("widget.converted")} variant="warning" />
          ) : null}
          {triage?.chatted && !triage.signedUp && (
            <StatusPill status={t("widget.chatted")} variant="info" />
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
          {!isDrill && lead.currentCampaignStage && (
            <StatusPill
              status={leadsT(lead.currentCampaignStage)}
              variant={
                CAMPAIGN_STAGE_VARIANT[lead.currentCampaignStage] ?? "default"
              }
            />
          )}
        </Div>
        <Div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
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
        {origin.length > 0 && (
          <Div className="mt-0.5 truncate text-xs text-foreground/80">
            {origin.join(" · ")}
          </Div>
        )}
        <Div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground tabular-nums">
          {lead.createdAt && (
            <Span>
              {isDrill
                ? `${new Date(lead.createdAt).toISOString().slice(0, 16).replace("T", " ")} UTC`
                : formatSimpleDate(lead.createdAt, locale)}
            </Span>
          )}
          {client.length > 0 && (
            <Span className="truncate">{client.join(" · ")}</Span>
          )}
        </Div>
      </Div>

      {/* Stats */}
      <Div className="hidden @md:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground tabular-nums">
        {acquisition && acquisition.revenue > 0 && (
          <Span className="font-medium text-foreground">
            {formatCurrency(acquisition.revenue, acquisition.currency, locale)}
          </Span>
        )}
        {acquisition && acquisition.visits > 0 && (
          <Span>
            {st("leadAnalytics.metrics.visits")}:{" "}
            {acquisition.visits.toLocaleString(locale)}
          </Span>
        )}
        {!isDrill &&
          lead.emailsSent !== null &&
          lead.emailsSent !== undefined && (
            <Span>
              {t("widget.emailsSent", {
                count: lead.emailsSent,
              })}
            </Span>
          )}
        {lead.emailsOpened !== null &&
          lead.emailsOpened !== undefined &&
          !isDrill &&
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
            "relative z-10 ms-auto flex-shrink-0 flex gap-0.5",
            isTouch
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lead)}
            title={t("widget.edit")}
            aria-label={t("widget.edit")}
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
            aria-label={t("widget.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Div>
      )}
    </Div>
  );
}

/** Dense one-line row for report drill-downs: who, what agent, from where. */
function DrillRow({
  lead,
  onView,
  t,
  st,
}: {
  lead: Lead;
  onView: (lead: Lead) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  st: ReturnType<typeof useLeadAnalyticsT>;
}): React.JSX.Element {
  const triage = lead.triage;
  const isBot = triage ? triage.botFamily !== BotFamily.HUMAN : false;
  const origin = triage
    ? [
        dimensionValueLabel(triage.channelType, st),
        triage.channel && triage.channel !== "direct" ? triage.channel : null,
        triage.referrerHost,
        triage.landingPath,
      ].filter((part): part is string => Boolean(part))
    : [];
  const client = triage
    ? [
        triage.geoCountry ? dimensionValueLabel(triage.geoCountry, st) : null,
        dimensionValueLabel(triage.device, st),
        triage.browser,
        triage.ipPrefix,
      ].filter((part): part is string => Boolean(part))
    : [];
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onView(lead)}
      className="grid h-auto w-full grid-cols-1 items-center gap-1 rounded-md border px-3 py-2 text-left text-xs font-normal @3xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,1fr)] @3xl:gap-3"
    >
      <Span className="flex min-w-0 items-center gap-1.5">
        <Span className="truncate text-sm font-medium text-foreground">
          {lead.email ?? lead.businessName ?? lead.id.slice(0, 8)}
        </Span>
        {triage?.paid ? (
          <StatusPill status={t("widget.paid")} variant="success" />
        ) : triage?.signedUp ? (
          <StatusPill status={t("widget.signedUp")} variant="success" />
        ) : triage?.chatted ? (
          <StatusPill status={t("widget.chatted")} variant="info" />
        ) : null}
      </Span>
      <Span className="min-w-0">
        {triage && (
          <StatusPill
            status={dimensionValueLabel(triage.botFamily, st)}
            variant={isBot ? "danger" : "default"}
          />
        )}
      </Span>
      <Span className="truncate text-muted-foreground">
        {origin.join(" · ")}
      </Span>
      <Span className="truncate text-muted-foreground">
        {client.join(" · ")}
      </Span>
      <Span className="tabular-nums text-muted-foreground @3xl:text-right">
        {`${new Date(lead.createdAt).toISOString().slice(0, 16).replace("T", " ")} UTC`}
      </Span>
    </Button>
  );
}

export function LeadsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations, response } = useWidgetContext();
  const locale = useWidgetLocale();
  const isTouch = useTouchDevice();
  const t = useWidgetTranslation<typeof definition.GET>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const st = useLeadAnalyticsT(locale);
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

  // "All" tab: every lead matching the non-status filters (not just this page).
  const allStatusesCount = serverCountsByStatus
    ? Object.values(serverCountsByStatus).reduce(
        (total, count) => total + count,
        0,
      )
    : leads.length;

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
        const leadDef = await import("@/leads/[id]/definition");
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
        const leadDef = await import("@/leads/[id]/definition");
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
        const leadDef = await import("@/leads/[id]/definition");
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
      const createDef = await import("@/leads/create/definition");
      navigation.push(createDef.default.POST);
    })();
  }, [navigation]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleExport = useCallback((): void => {
    void (async (): Promise<void> => {
      const exportDef = await import("@/leads/export/definition");
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
      const importDef = await import("@/leads/import/definition");
      navigation.push(importDef.default.POST);
    })();
  }, [navigation]);

  const handleBatchUpdate = useCallback((): void => {
    void (async (): Promise<void> => {
      const batchDef = await import("@/leads/batch/definition");
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
      const statsDef = await import("@/leads/stats/definition");
      navigation.push(statsDef.default.GET);
    })();
  }, [navigation]);

  const handleGraphs = useCallback((): void => {
    void (async (): Promise<void> => {
      const graphsDef = await import("next-vibe/dataflow/graphs/definition");
      navigation.push(graphsDef.default.GET, {
        data: { search: "lead" },
      });
    })();
  }, [navigation]);

  const handleSearch = useCallback((): void => {
    void (async (): Promise<void> => {
      const searchDef = await import("@/leads/search/definition");
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
      form.setValue("paginationInfo.page", newPage, { shouldDirty: true });
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const { sourceType, ...acquisitionFilters } =
    form.watch("acquisitionFilters") ?? {};
  const activeSources = form.watch("statusFilters.source") ?? [];

  const drillValues: LeadDrillFilters = {
    traffic: form.watch("traffic"),
    botFamily: form.watch("botFamily"),
    channelType: form.watch("channelType"),
    channel: form.watch("channel"),
    source: form.watch("source"),
    medium: form.watch("medium"),
    campaign: form.watch("campaign"),
    referrerHost: form.watch("referrerHost"),
    landingPath: form.watch("landingPath"),
    refCode: form.watch("refCode"),
    country: form.watch("country"),
    localeCountry: form.watch("localeCountry"),
    device: form.watch("device"),
    browser: form.watch("browser"),
    os: form.watch("os"),
    ipPrefix: form.watch("ipPrefix"),
    uaFingerprint: form.watch("uaFingerprint"),
    createdFrom: form.watch("createdFrom"),
    createdTo: form.watch("createdTo"),
    reached: form.watch("reached"),
    reachedFrom: form.watch("reachedFrom"),
    reachedTo: form.watch("reachedTo"),
  };
  const removeDrill = (key: DrillKey): void => {
    form.setValue(key, undefined, { shouldDirty: true });
    if (key === "createdFrom") {
      form.setValue("createdTo", undefined, { shouldDirty: true });
    }
    if (key === "reached") {
      form.setValue("reachedFrom", undefined, { shouldDirty: true });
      form.setValue("reachedTo", undefined, { shouldDirty: true });
    }
    handlePageChange(1);
  };
  const drillChips = [
    ...segmentChips(drillValues, st, removeDrill),
    ...drillRangeChips(drillValues, st, t, removeDrill),
  ];
  const clearDrill = (): void => {
    for (const key of DRILL_KEYS) {
      form.setValue(key, undefined, { shouldDirty: true });
    }
    handlePageChange(1);
  };

  const hasActiveFilters = Boolean(
    (sourceType && sourceType !== AcquisitionSourceFilter.ALL) ||
    Object.values(acquisitionFilters).some(Boolean) ||
    activeStatuses.length ||
    activeSources.length ||
    form.watch("statusFilters.search")?.trim() ||
    form.watch("statusFilters.currentCampaignStage")?.length ||
    form.watch("locationFilters.country")?.length ||
    form.watch("locationFilters.language")?.length ||
    drillChips.length,
  );

  const clearFilters = (): void => {
    form.setValue("statusFilters.search", "", { shouldDirty: true });
    form.setValue("statusFilters.status", [], { shouldDirty: true });
    form.setValue("statusFilters.source", [], { shouldDirty: true });
    form.setValue("statusFilters.currentCampaignStage", [], {
      shouldDirty: true,
    });
    form.setValue("locationFilters.country", [], { shouldDirty: true });
    form.setValue("locationFilters.language", [], { shouldDirty: true });
    form.setValue("acquisitionFilters", {}, { shouldDirty: true });
    for (const key of DRILL_KEYS) {
      form.setValue(key, undefined, { shouldDirty: true });
    }
    handlePageChange(1);
  };

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
            aria-label={t("widget.stats")}
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
            aria-label={t("widget.graphs")}
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
            aria-label={t("widget.search")}
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
            aria-label={t("widget.export")}
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
            aria-label={t("widget.import")}
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
            aria-label={t("widget.batch")}
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
            aria-label={t("widget.refresh")}
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
                : allStatusesCount;
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
        {!isPickerMode && drillChips.length === 0 && (
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

      {!isPickerMode && drillChips.length > 0 && (
        <Div className="px-4 pt-2">
          <Div className="flex flex-wrap items-center gap-1.5 rounded-md border border-dashed bg-muted/30 px-2 py-1.5">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("widget.drillTitle")}
            </Span>
            {drillChips.map((chip) => (
              <Button
                key={chip.key}
                type="button"
                variant="outline"
                size="sm"
                onClick={chip.onRemove}
                className="h-6 gap-1 rounded-full px-2 text-xs"
                title={t("widget.clearDrill")}
              >
                <Span className="text-muted-foreground">{chip.label}:</Span>
                <Span className="max-w-[220px] truncate font-medium">
                  {chip.value}
                </Span>
                <X className="h-3 w-3" />
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearDrill}
              className="h-6 px-2 text-xs"
            >
              {t("widget.clearDrill")}
            </Button>
          </Div>
          {widgetData?.drillSummary && (
            <Div className="px-1 pt-1.5 text-xs tabular-nums text-muted-foreground">
              {t("widget.drillSummary", {
                total: widgetData.drillSummary.total.toLocaleString(locale),
                humans: widgetData.drillSummary.humans.toLocaleString(locale),
                signups: widgetData.drillSummary.signups.toLocaleString(locale),
                paid: widgetData.drillSummary.paid.toLocaleString(locale),
                agents: widgetData.drillSummary.agents.toLocaleString(locale),
              })}
            </Div>
          )}
        </Div>
      )}

      {!isPickerMode && (
        <Div className="flex flex-col gap-2 px-4 py-2">
          <SectionGroup
            title={t("widget.analyticsFilters")}
            collapsible
            defaultOpen={false}
          >
            <SegmentFilterPanel
              onApply={() => handlePageChange(1)}
              applyLabel={t("widget.apply")}
            />
            <Div className="mt-3 grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
              <TextFieldWidget
                fieldName="createdFrom"
                field={children.createdFrom}
              />
              <TextFieldWidget
                fieldName="createdTo"
                field={children.createdTo}
              />
              <SelectFieldWidget fieldName="reached" field={children.reached} />
            </Div>
            <Div className="mt-4 border-t pt-3">
              <Span className="mb-2 block text-xs font-medium text-muted-foreground">
                {t("acquisition.title")}
              </Span>
              <AcquisitionFilterInputs />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isFetching}
                onClick={() => handlePageChange(1)}
              >
                {t("acquisition.apply")}
              </Button>
            </Div>
          </SectionGroup>
        </Div>
      )}

      {/* Status breakdown subtitle — full mode only */}
      {!isPickerMode &&
        !isLoading &&
        leads.length > 0 &&
        drillChips.length === 0 && (
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
          "px-4 pb-2 overflow-y-auto @md:max-h-[min(700px,calc(100dvh-320px))]",
          isFetching && !isLoadingFresh && "opacity-50 pointer-events-none",
        )}
      >
        {response?.success === false ? (
          <EmptyBlock
            title={t("get.errors.server.title")}
            message={response.message}
            action={{ label: t("widget.refresh"), onClick: handleRefresh }}
          />
        ) : isLoading || !widgetData ? (
          <LoadingBlock />
        ) : leads.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {drillChips.length > 0 && (
              <Div className="hidden @3xl:grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,1fr)] gap-3 border-b px-3 pb-1.5 text-xs font-medium text-muted-foreground">
                <Span>{t("widget.colLead")}</Span>
                <Span>{t("widget.colAgent")}</Span>
                <Span>{t("widget.colOrigin")}</Span>
                <Span>{t("widget.colClient")}</Span>
                <Span className="text-right">{t("widget.colCreated")}</Span>
              </Div>
            )}
            {drillChips.length > 0
              ? leads.map((lead) => (
                  <DrillRow
                    key={lead.id}
                    lead={lead}
                    onView={handleView}
                    t={t}
                    st={st}
                  />
                ))
              : leads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    locale={locale}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    t={t}
                    leadsT={leadsT}
                    st={st}
                    isDrill={drillChips.length > 0}
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
              hasActiveFilters
                ? { label: t("widget.clearFilters"), onClick: clearFilters }
                : !isPickerMode
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

const DRILL_KEYS = [
  "traffic",
  "botFamily",
  "channelType",
  "channel",
  "source",
  "medium",
  "campaign",
  "referrerHost",
  "landingPath",
  "refCode",
  "country",
  "localeCountry",
  "device",
  "browser",
  "os",
  "ipPrefix",
  "uaFingerprint",
  "createdFrom",
  "createdTo",
  "reached",
  "reachedFrom",
  "reachedTo",
] as const;

type DrillKey = (typeof DRILL_KEYS)[number];

function range(from?: string, to?: string): string {
  return from && to && from !== to ? `${from} → ${to}` : (from ?? to ?? "");
}

/** Chips for the creation window and the reached step (with its window). */
function drillRangeChips(
  values: LeadDrillFilters,
  st: ReturnType<typeof useLeadAnalyticsT>,
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>,
  onRemove: (key: DrillKey) => void,
): AnalyticsFilterChip[] {
  const chips: AnalyticsFilterChip[] = [];
  if (values.createdFrom || values.createdTo) {
    chips.push({
      key: "createdFrom",
      label: t("widget.drillCreated"),
      value: range(values.createdFrom, values.createdTo),
      onRemove: () => onRemove("createdFrom"),
    });
  }
  if (values.reached && values.reached !== FunnelReach.ANY) {
    const when = range(values.reachedFrom, values.reachedTo);
    chips.push({
      key: "reached",
      label: t("widget.drillReached"),
      value: when ? `${st(values.reached)} (${when})` : st(values.reached),
      onRemove: () => onRemove("reached"),
    });
  }
  return chips;
}
