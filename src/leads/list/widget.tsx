/**
 * Custom Widget for Leads List
 * Provides a rich admin UI with navigation stack integration
 */

"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { CountriesOptions } from "next-vibe/core/i18n/core/config";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Download } from "next-vibe/ui/components/icons/Download";
import { GitBranch } from "next-vibe/ui/components/icons/GitBranch";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Sliders } from "next-vibe/ui/components/icons/Sliders";
import { Upload } from "next-vibe/ui/components/icons/Upload";
import { User } from "next-vibe/ui/components/icons/User";
import { Users } from "next-vibe/ui/components/icons/Users";
import { X } from "next-vibe/ui/components/icons/X";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
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
import { AnalyticsFilterPanel } from "next-vibe/unified-ui/analytics/filter-panel";
import { CompactFieldHelpContext } from "next-vibe/unified-ui/widgets/form-fields/_shared/description-style";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { MultiSelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/multiselect-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import React, { useCallback, useId, useMemo, useState } from "react";
import { z } from "zod";

import { FunnelReach, isBotFamily, LeadChannelFilter } from "../analytics/enum";
import { type LeadDrillFilters, SEGMENT_KEYS } from "../analytics/filters";
import {
  dimensionValueLabel,
  segmentChips,
  SegmentFilterInputs,
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
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  leadsT: ReturnType<typeof leadsScopedTranslation.scopedT>["t"];
  st: ReturnType<typeof useLeadAnalyticsT>;
  isPickerMode: boolean;
}

/** Display name: business, contact, email, else an anonymous visitor label. */
function leadName(
  lead: Lead,
  t: LeadRowProps["t"],
): { name: string; anonymous: boolean } {
  const name =
    lead.businessName?.trim() || lead.contactName?.trim() || lead.email?.trim();
  return name
    ? { name, anonymous: false }
    : { name: t("widget.anonymousLead"), anonymous: true };
}

/** Country label in the viewer's locale; GLOBAL (unknown) renders nothing. */
function countryLabel(
  code: string | null | undefined,
  t: LeadRowProps["t"],
): string | null {
  if (!code || code === "GLOBAL") {
    return null;
  }
  const option = CountriesOptions.find((entry) => entry.value === code);
  return option ? t(option.label) : code;
}

/** One funnel pill that adds information beyond the lead status. */
function FunnelPill({
  lead,
  t,
}: {
  lead: Lead;
  t: LeadRowProps["t"];
}): React.JSX.Element | null {
  const triage = lead.triage;
  if (triage?.paid) {
    return <StatusPill status={t("widget.paid")} variant="success" />;
  }
  const statusSaysSignedUp =
    lead.status === "enums.leadStatus.signedUp" ||
    lead.status === "enums.leadStatus.subscriptionConfirmed";
  if ((triage?.signedUp || lead.convertedUserId) && !statusSaysSignedUp) {
    return <StatusPill status={t("widget.signedUp")} variant="success" />;
  }
  if (triage?.chatted && !triage.signedUp) {
    return <StatusPill status={t("widget.chatted")} variant="info" />;
  }
  return null;
}

function LeadTableRow({
  lead,
  locale,
  onView,
  t,
  leadsT,
  st,
  isPickerMode,
}: LeadRowProps): React.JSX.Element {
  const triage = lead.triage;
  const isBot = lead.isBot || (triage ? isBotFamily(triage.botFamily) : false);
  const { name, anonymous } = leadName(lead, t);
  const secondary =
    lead.email && lead.email !== name
      ? lead.email
      : triage?.landingPath || triage?.referrerHost || null;
  const country = countryLabel(lead.country, t);
  // Untracked first touch says nothing; only show a known channel.
  const origin = triage
    ? [
        triage.channel && triage.channel !== "direct"
          ? triage.channel
          : triage.channelType &&
              triage.channelType !== LeadChannelFilter.UNATTRIBUTED
            ? dimensionValueLabel(triage.channelType, st)
            : null,
        triage.referrerHost,
      ].filter((part): part is string => Boolean(part))
    : [];
  const visits = lead.acquisition?.visits ?? 0;
  const created = lead.createdAt
    ? new Date(lead.createdAt).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;
  const statusPill = lead.status ? (
    <StatusPill
      status={leadsT(lead.status)}
      variant={STATUS_VARIANT[lead.status] ?? "default"}
    />
  ) : null;

  return (
    <TableRow
      className="cursor-pointer hover:bg-accent/50"
      onClick={() => onView(lead)}
    >
      <TableCell className="whitespace-normal">
        <Div className="flex min-w-0 items-center gap-3">
          <Div
            aria-hidden="true"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              anonymous
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            {anonymous ? <User className="size-4" /> : initials(name)}
          </Div>
          <Div className="min-w-0 flex-1">
            <Button
              type="button"
              variant="ghost"
              onClick={(event) => {
                event.stopPropagation();
                onView(lead);
              }}
              aria-label={t("widget.openLead")}
              className={cn(
                "h-auto max-w-full justify-start p-0 text-left text-sm font-medium hover:bg-transparent hover:underline",
                anonymous && "font-normal text-muted-foreground",
              )}
            >
              <Span className="block min-w-0 truncate">{name}</Span>
            </Button>
            {secondary && (
              <Span className="block min-w-0 text-xs text-muted-foreground [overflow-wrap:anywhere] @3xl:truncate">
                {secondary}
              </Span>
            )}
            {/* Compact (phone / narrow) summary line */}
            <Div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground @3xl:hidden">
              {statusPill}
              <FunnelPill lead={lead} t={t} />
              {isBot && triage && (
                <StatusPill
                  status={dimensionValueLabel(triage.botFamily, st)}
                  variant="danger"
                />
              )}
              {created && <Span className="tabular-nums">{created}</Span>}
            </Div>
          </Div>
          {!isPickerMode && (
            <ChevronRight
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground @3xl:hidden"
            />
          )}
        </Div>
      </TableCell>
      <TableCell className="hidden @3xl:table-cell">
        <Div className="flex flex-wrap items-center gap-1">
          {statusPill}
          <FunnelPill lead={lead} t={t} />
        </Div>
      </TableCell>
      <TableCell className="hidden max-w-[220px] text-xs @3xl:table-cell">
        <Span className="block truncate">
          {lead.source ? leadsT(lead.source) : "-"}
        </Span>
        {origin.length > 0 && (
          <Span className="block truncate text-muted-foreground">
            {origin.join(" · ")}
          </Span>
        )}
      </TableCell>
      <TableCell className="hidden text-xs @3xl:table-cell">
        {triage ? (
          isBot ? (
            <StatusPill
              status={dimensionValueLabel(triage.botFamily, st)}
              variant="danger"
            />
          ) : (
            <Span className="text-muted-foreground">
              {dimensionValueLabel(triage.botFamily, st)}
            </Span>
          )
        ) : (
          <Span className="text-muted-foreground">-</Span>
        )}
      </TableCell>
      <TableCell className="hidden whitespace-nowrap text-xs @3xl:table-cell">
        {country ?? <Span className="text-muted-foreground">-</Span>}
      </TableCell>
      <TableCell
        className={cn(
          "hidden whitespace-nowrap text-right text-sm tabular-nums @3xl:table-cell",
          visits === 0 && "text-muted-foreground",
        )}
      >
        {visits.toLocaleString(locale)}
      </TableCell>
      <TableCell className="hidden whitespace-nowrap text-right text-xs tabular-nums text-muted-foreground @3xl:table-cell">
        {created ?? "-"}
      </TableCell>
    </TableRow>
  );
}

function initials(name: string): string {
  const parts = name.split(/[\s@._-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
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
  const isBot = lead.isBot || (triage ? isBotFamily(triage.botFamily) : false);
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
  const t = useWidgetTranslation<typeof definition.GET>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const st = useLeadAnalyticsT(locale);
  const form = useWidgetForm<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const widgetData = useWidgetValue<typeof definition.GET>();
  const onPick = usePickerCallback<Lead>();
  const isPickerMode = !!onPick;

  const onSubmit = useWidgetOnSubmit();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersId = useId();

  const activeStatuses: (typeof LeadStatusFilterValue)[] =
    form.watch("statusFilters.status") ?? [];

  const leads = useMemo(
    () => widgetData?.response?.leads ?? [],
    [widgetData?.response?.leads],
  );
  const paginationInfo = widgetData?.paginationInfo;
  const serverCountsByStatus = widgetData?.countsByStatus;
  const isLoadingFresh = endpointMutations?.read?.isLoadingFresh ?? false;
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
  const totalPages = Math.max(
    1,
    paginationInfo?.pageCount ?? Math.ceil(totalCount / limit),
  );

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
  const includeBots = form.watch("includeBots") === true;

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
    browserLanguage: form.watch("browserLanguage"),
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
    includeBots ||
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
    form.setValue("includeBots", false, { shouldDirty: true });
    for (const key of DRILL_KEYS) {
      form.setValue(key, undefined, { shouldDirty: true });
    }
    handlePageChange(1);
  };

  const filterCount =
    activeSources.length +
    (form.watch("statusFilters.currentCampaignStage")?.length ?? 0) +
    (form.watch("locationFilters.country")?.length ?? 0) +
    (form.watch("locationFilters.language")?.length ?? 0) +
    (includeBots ? 1 : 0);

  const moreActions = [
    {
      key: "search",
      label: t("widget.search"),
      icon: Search,
      run: handleSearch,
    },
    {
      key: "stats",
      label: t("widget.stats"),
      icon: BarChart3,
      run: handleStats,
    },
    {
      key: "graphs",
      label: t("widget.graphs"),
      icon: GitBranch,
      run: handleGraphs,
    },
    {
      key: "batch",
      label: t("widget.batchUpdate"),
      icon: Users,
      run: handleBatchUpdate,
    },
    {
      key: "refresh",
      label: t("widget.refresh"),
      icon: RefreshCw,
      run: handleRefresh,
    },
  ] as const;

  const headerActions = !isPickerMode ? (
    <Div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleImport}
        aria-label={t("widget.import")}
        className="gap-1.5"
      >
        <Upload className="size-4" />
        <Span className="hidden @md:inline">{t("widget.import")}</Span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleExport}
        aria-label={t("widget.export")}
        className="gap-1.5"
      >
        <Download className="size-4" />
        <Span className="hidden @md:inline">{t("widget.export")}</Span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={t("widget.more")}
            className="gap-1.5"
          >
            <MoreHorizontal className="size-4" />
            <Span className="hidden @sm:inline">{t("widget.more")}</Span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          {moreActions.map(({ key, label, icon: ActionIcon, run }) => (
            <DropdownMenuItem key={key} onSelect={() => run()}>
              <ActionIcon className="size-4" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        size="sm"
        onClick={handleCreate}
        className="gap-1.5"
      >
        <Plus className="size-4" />
        {t("widget.newLead")}
      </Button>
    </Div>
  ) : undefined;

  const selectAllStatuses = (): void => {
    form.setValue("statusFilters.status", []);
    form.setValue("paginationInfo.page", 1);
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        subtitle={
          totalCount > 0
            ? t("widget.leadCount", {
                count: totalCount.toLocaleString(locale),
              })
            : undefined
        }
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={headerActions}
      />

      {/* Status tabs */}
      {!isPickerMode && (
        <Div
          role="tablist"
          aria-label={t("get.title")}
          className="-mx-1 flex items-end gap-1 overflow-x-auto border-b px-1"
        >
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
                role="tab"
                aria-selected={isActive}
                variant="ghost"
                size="sm"
                onClick={() =>
                  tab.value === null
                    ? selectAllStatuses()
                    : handleToggleStatus(tab.value)
                }
                className={cn(
                  "-mb-px h-10 shrink-0 gap-1.5 rounded-none border-b-2 px-3 text-sm font-medium hover:bg-transparent",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t(tab.labelKey)}
                {widgetData && !isLoading && (
                  <Span className="text-xs font-normal tabular-nums text-muted-foreground">
                    {count.toLocaleString(locale)}
                  </Span>
                )}
              </Button>
            );
          })}
        </Div>
      )}

      {/* Search + filters */}
      <Div className="flex flex-col gap-3">
        <Div className="flex items-center gap-2">
          <Div className="min-w-0 flex-1 [&_label]:sr-only">
            <TextFieldWidget
              fieldName="statusFilters.search"
              field={{
                ...children.statusFilters.children.search,
                description: undefined,
              }}
            />
          </Div>
          {!isPickerMode && drillChips.length === 0 && (
            <Button
              type="button"
              variant="outline"
              aria-expanded={filtersOpen}
              aria-controls={filtersId}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="h-10 shrink-0 gap-1.5"
            >
              <Sliders className="size-4" />
              <Span className="hidden @sm:inline">{t("widget.filters")}</Span>
              {filterCount > 0 && (
                <Span className="rounded-full bg-primary px-1.5 text-xs tabular-nums text-primary-foreground">
                  {filterCount}
                </Span>
              )}
            </Button>
          )}
        </Div>

        {!isPickerMode && drillChips.length === 0 && filtersOpen && (
          <Div
            id={filtersId}
            className="flex flex-col gap-3 rounded-lg border bg-card p-4"
          >
            <CompactFieldHelpContext.Provider value>
              <Div className="grid gap-3 @sm:grid-cols-2 @3xl:grid-cols-3">
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
                <BooleanFieldWidget
                  fieldName="includeBots"
                  field={{
                    ...children.includeBots,
                    schema: z.boolean().optional(),
                  }}
                />
              </Div>
            </CompactFieldHelpContext.Provider>
            <SectionGroup
              title={t("widget.analyticsFilters")}
              collapsible
              defaultOpen={false}
            >
              <AnalyticsFilterPanel
                fields={ADVANCED_FILTER_FIELDS}
                onApply={() => handlePageChange(1)}
                applyLabel={t("widget.apply")}
              >
                <SegmentFilterInputs />
                <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
                  <TextFieldWidget
                    fieldName="createdFrom"
                    field={children.createdFrom}
                  />
                  <TextFieldWidget
                    fieldName="createdTo"
                    field={children.createdTo}
                  />
                  <SelectFieldWidget
                    fieldName="reached"
                    field={children.reached}
                  />
                </Div>
                <Div className="border-t pt-3">
                  <Span className="mb-2 block text-xs font-medium text-muted-foreground">
                    {t("acquisition.title")}
                  </Span>
                  <AcquisitionFilterInputs />
                </Div>
              </AnalyticsFilterPanel>
            </SectionGroup>
            {hasActiveFilters && (
              <Div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  {t("widget.clearFilters")}
                </Button>
              </Div>
            )}
          </Div>
        )}

        {!isPickerMode && drillChips.length > 0 && (
          <Div>
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
                  signups:
                    widgetData.drillSummary.signups.toLocaleString(locale),
                  paid: widgetData.drillSummary.paid.toLocaleString(locale),
                  agents: widgetData.drillSummary.agents.toLocaleString(locale),
                })}
              </Div>
            )}
          </Div>
        )}
      </Div>

      {/* Lead list */}
      {response?.success === false ? (
        <EmptyBlock
          title={t("get.errors.server.title")}
          message={response.message}
          action={{ label: t("widget.refresh"), onClick: handleRefresh }}
        />
      ) : isLoading || !widgetData ? (
        <Div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((row) => (
            <Skeleton key={row} className="h-12 w-full" />
          ))}
        </Div>
      ) : leads.length > 0 ? (
        drillChips.length > 0 ? (
          <Div className="flex flex-col gap-2">
            <Div className="hidden @3xl:grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,1fr)] gap-3 border-b px-3 pb-1.5 text-xs font-medium text-muted-foreground">
              <Span>{t("widget.colLead")}</Span>
              <Span>{t("widget.colAgent")}</Span>
              <Span>{t("widget.colOrigin")}</Span>
              <Span>{t("widget.colClient")}</Span>
              <Span className="text-right">{t("widget.colCreated")}</Span>
            </Div>
            {leads.map((lead) => (
              <DrillRow
                key={lead.id}
                lead={lead}
                onView={handleView}
                t={t}
                st={st}
              />
            ))}
          </Div>
        ) : (
          <Div
            className={cn(
              "min-w-0 rounded-lg border bg-card transition-opacity",
              endpointMutations?.read?.isFetching && "opacity-60",
            )}
          >
            <Table scrollLabel={t("get.title")}>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>{t("widget.colLead")}</TableHead>
                  <TableHead className="hidden @3xl:table-cell">
                    {t("widget.colStatus")}
                  </TableHead>
                  <TableHead className="hidden @3xl:table-cell">
                    {t("widget.colSource")}
                  </TableHead>
                  <TableHead className="hidden @3xl:table-cell">
                    {t("widget.colAgent")}
                  </TableHead>
                  <TableHead className="hidden @3xl:table-cell">
                    {t("widget.colCountry")}
                  </TableHead>
                  <TableHead className="hidden text-right @3xl:table-cell">
                    {t("widget.colVisits")}
                  </TableHead>
                  <TableHead className="hidden text-right @3xl:table-cell">
                    {t("widget.colCreated")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <LeadTableRow
                    key={lead.id}
                    lead={lead}
                    locale={locale}
                    onView={handleView}
                    t={t}
                    leadsT={leadsT}
                    st={st}
                    isPickerMode={isPickerMode}
                  />
                ))}
              </TableBody>
            </Table>
          </Div>
        )
      ) : (
        <EmptyBlock
          title={hasActiveFilters ? t("get.emptySearch") : t("get.emptyState")}
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

      {/* Pagination footer */}
      {!isPickerMode && totalPages > 1 && (
        <Div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <Span className="tabular-nums">
            {t("widget.pagination", {
              page: currentPage.toLocaleString(locale),
              totalPages: totalPages.toLocaleString(locale),
              total: totalCount.toLocaleString(locale),
            })}
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-10 min-w-10"
              aria-label={t("acquisition.previous")}
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-10 min-w-10"
              aria-label={t("acquisition.next")}
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

const ADVANCED_FILTER_FIELDS = [
  ...SEGMENT_KEYS,
  "createdFrom",
  "createdTo",
  "reached",
  "acquisitionFilters",
  "acquisitionCurrency",
] as const;

const DRILL_KEYS = [
  ...SEGMENT_KEYS,
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
