/**
 * Custom Widget for Leads List
 * Provides a rich admin UI with navigation stack integration
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Users,
} from "next-vibe-ui/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import {
  LeadSortField,
  LeadSortFieldOptions,
  LeadSourceFilter,
  LeadSourceFilterOptions,
  type LeadStatusFilter,
  SortOrder,
  SortOrderOptions,
} from "../enum";
import type definition from "./definition";
import type { LeadListGetResponseTypeOutput } from "./definition";

type Lead = NonNullable<
  LeadListGetResponseTypeOutput["response"]
>["leads"][number];

interface CustomWidgetProps {
  field: {
    value: LeadListGetResponseTypeOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const STATUS_COLORS: Record<string, string> = {
  "app.api.leads.enums.leadStatus.new":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "app.api.leads.enums.leadStatus.pending":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "app.api.leads.enums.leadStatus.campaignRunning":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "app.api.leads.enums.leadStatus.websiteUser":
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "app.api.leads.enums.leadStatus.newsletterSubscriber":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "app.api.leads.enums.leadStatus.inContact":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "app.api.leads.enums.leadStatus.signedUp":
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "app.api.leads.enums.leadStatus.subscriptionConfirmed":
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "app.api.leads.enums.leadStatus.unsubscribed":
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  "app.api.leads.enums.leadStatus.bounced":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "app.api.leads.enums.leadStatus.invalid":
    "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200",
};

const CAMPAIGN_STAGE_COLORS: Record<string, string> = {
  "app.api.leads.enums.emailCampaignStage.notStarted":
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "app.api.leads.enums.emailCampaignStage.initial":
    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  "app.api.leads.enums.emailCampaignStage.followup1":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "app.api.leads.enums.emailCampaignStage.followup2":
    "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "app.api.leads.enums.emailCampaignStage.followup3":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "app.api.leads.enums.emailCampaignStage.nurture":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "app.api.leads.enums.emailCampaignStage.reactivation":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

/** Status tab values for quick filtering */
const STATUS_TAB_VALUES = [
  { labelKey: "app.api.leads.list.widget.tabAll", value: null },
  {
    labelKey: "app.api.leads.list.widget.tabNew",
    value: "app.api.leads.enums.leadStatusFilter.new",
  },
  {
    labelKey: "app.api.leads.list.widget.tabCampaign",
    value: "app.api.leads.enums.leadStatusFilter.campaignRunning",
  },
  {
    labelKey: "app.api.leads.list.widget.tabConfirmed",
    value: "app.api.leads.enums.leadStatusFilter.subscriptionConfirmed",
  },
  {
    labelKey: "app.api.leads.list.widget.tabUnsubscribed",
    value: "app.api.leads.enums.leadStatusFilter.unsubscribed",
  },
  {
    labelKey: "app.api.leads.list.widget.tabBounced",
    value: "app.api.leads.enums.leadStatusFilter.bounced",
  },
] as const;

const SOURCE_ALL = LeadSourceFilter.ALL;

function LeadRow({
  lead,
  locale,
  onView,
  onEdit,
  onDelete,
  t,
}: {
  lead: Lead;
  locale: CountryLanguage;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
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
              {t(lead.status)}
            </Span>
          )}
          {isConverted && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {t("app.api.leads.list.widget.converted")}
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
              {t(lead.currentCampaignStage)}
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
            <Span className="flex-shrink-0">{t(lead.source)}</Span>
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
            {t("app.api.leads.list.widget.emailsSent", {
              count: lead.emailsSent,
            })}
          </Span>
        )}
        {lead.emailsOpened !== null &&
          lead.emailsOpened !== undefined &&
          lead.emailsSent !== null &&
          lead.emailsSent !== undefined && (
            <Span>
              {t("app.api.leads.list.widget.openRate", {
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
              {t("app.api.leads.list.widget.clicks", {
                count: lead.emailsClicked,
              })}
            </Span>
          )}
      </Div>

      {/* Actions */}
      <Div
        className="flex-shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onView(lead)}
          title={t("app.api.leads.list.widget.view")}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(lead)}
          title={t("app.api.leads.list.widget.edit")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(lead)}
          title={t("app.api.leads.list.widget.delete")}
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
  const router = useRouter();
  const t = useWidgetTranslation();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const navigation = useWidgetNavigation();

  const activeStatuses: string[] = form?.watch("statusFilters.status") ?? [];
  const activeSources: string[] = form?.watch("statusFilters.source") ?? [];
  const sortBy: string =
    form?.watch("sortingOptions.sortBy") ?? LeadSortField.CREATED_AT;
  const sortOrder: string =
    form?.watch("sortingOptions.sortOrder") ?? SortOrder.DESC;

  const leads = useMemo(
    () => field.value?.response?.leads ?? [],
    [field.value?.response?.leads],
  );
  const paginationInfo = field.value?.paginationInfo;
  const isLoading = field.value === null || field.value === undefined;

  // Status breakdown counts from current page (display only)
  const statusCounts = useMemo((): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      if (lead.status) {
        counts[lead.status] = (counts[lead.status] ?? 0) + 1;
      }
    }
    return counts;
  }, [leads]);

  const handleToggleStatus = useCallback(
    (status: string): void => {
      const current = form?.getValues("statusFilters.status") ?? [];
      const typed =
        status as (typeof LeadStatusFilter)[keyof typeof LeadStatusFilter];
      const next = current.includes(typed)
        ? current.filter((s) => s !== typed)
        : [...current, typed];
      form?.setValue("statusFilters.status", next);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSourceChange = useCallback(
    (value: string): void => {
      const typed =
        value as (typeof LeadSourceFilter)[keyof typeof LeadSourceFilter];
      if (value === SOURCE_ALL) {
        form?.setValue("statusFilters.source", []);
      } else {
        form?.setValue("statusFilters.source", [typed]);
      }
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortByChange = useCallback(
    (value: string): void => {
      form?.setValue(
        "sortingOptions.sortBy",
        value as (typeof LeadSortField)[keyof typeof LeadSortField],
      );
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form?.setValue(
        "sortingOptions.sortOrder",
        value as (typeof SortOrder)[keyof typeof SortOrder],
      );
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleView = useCallback(
    (lead: Lead): void => {
      router.push(`/${locale}/admin/leads/${lead.id}/edit`);
    },
    [router, locale],
  );

  const handleEdit = useCallback(
    (lead: Lead): void => {
      router.push(`/${locale}/admin/leads/${lead.id}/edit`);
    },
    [router, locale],
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
        });
      })();
    },
    [navigation],
  );

  const handleCreate = useCallback((): void => {
    router.push(`/${locale}/admin/leads/create`);
  }, [router, locale]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleExport = useCallback((): void => {
    void (async (): Promise<void> => {
      const exportDef =
        await import("@/app/api/[locale]/leads/export/definition");
      const currentSearch = form?.getValues("statusFilters.search") ?? "";
      navigation.push(exportDef.default.GET, {
        renderInModal: true,
        data: {
          search: currentSearch || undefined,
        },
      });
    })();
  }, [navigation, form]);

  const handleImport = useCallback((): void => {
    router.push(`/${locale}/admin/leads/import`);
  }, [router, locale]);

  const handleBatchUpdate = useCallback((): void => {
    void (async (): Promise<void> => {
      const batchDef =
        await import("@/app/api/[locale]/leads/batch/definition");
      const currentSearch = form?.getValues("statusFilters.search") ?? "";
      const currentStatus = form?.getValues("statusFilters.status") ?? [];
      const currentSource = form?.getValues("statusFilters.source") ?? [];
      const currentCampaignStage =
        form?.getValues("statusFilters.currentCampaignStage") ?? [];
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
    router.push(`/${locale}/admin/leads/stats`);
  }, [router, locale]);

  const handleSearch = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  // Pagination
  const currentPage: number = form?.watch("paginationInfo.page") ?? 1;
  const totalCount = paginationInfo?.totalCount ?? 0;
  const limit: number = form?.watch("paginationInfo.limit") ?? 20;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handlePageChange = useCallback(
    (newPage: number): void => {
      form?.setValue("paginationInfo.page", newPage);
      if (onSubmit) {
        onSubmit();
      } else {
        endpointMutations?.read?.refetch?.();
      }
    },
    [form, onSubmit, endpointMutations],
  );

  const activeSource = activeSources[0] ?? SOURCE_ALL;
  const hasActiveFilters =
    activeStatuses.length > 0 || activeSources.length > 0;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.leads.list.get.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </Span>

        {/* Spacer */}
        <Div className="flex-1" />

        {/* Action buttons */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleStats}
          title={t("app.api.leads.list.widget.stats")}
          className="gap-1"
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t("app.api.leads.list.widget.stats")}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSearch}
          title={t("app.api.leads.list.widget.search")}
          className="gap-1"
        >
          <Search className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t("app.api.leads.list.widget.search")}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleExport}
          title={t("app.api.leads.list.widget.export")}
          className="gap-1"
        >
          <Download className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t("app.api.leads.list.widget.export")}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImport}
          title={t("app.api.leads.list.widget.import")}
          className="gap-1"
        >
          <Upload className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t("app.api.leads.list.widget.import")}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBatchUpdate}
          title={t("app.api.leads.list.widget.batch")}
          className="gap-1"
        >
          <Users className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t("app.api.leads.list.widget.batch")}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.leads.list.widget.refresh")}
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
          {t("app.api.leads.list.get.createButton.label")}
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
                  form?.setValue("statusFilters.status", []);
                } else {
                  handleToggleStatus(tab.value);
                }
                if (onSubmit) {
                  onSubmit();
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
      <Div className="px-4 pt-2 pb-2 flex items-center gap-2 flex-wrap">
        {/* Text search */}
        <Div className="relative flex-1 min-w-[160px]">
          <TextFieldWidget
            fieldName="statusFilters.search"
            field={children.statusFilters.children.search}
          />
        </Div>

        {/* Source filter */}
        <Select value={activeSource} onValueChange={handleSourceChange}>
          <SelectTrigger className="h-9 min-w-[120px]">
            <SelectValue
              placeholder={t("app.api.leads.list.widget.allSources")}
            />
          </SelectTrigger>
          <SelectContent>
            {LeadSourceFilterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort by */}
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="h-9 min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LeadSortFieldOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort order */}
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="h-9 min-w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SortOrderOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>

      {/* Status breakdown subtitle */}
      {!isLoading && leads.length > 0 && (
        <Div className="px-4 pb-1 flex items-center gap-3 flex-wrap">
          {Object.entries(statusCounts)
            .toSorted(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([status, count]) => (
              <Button
                key={status}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStatus(status)}
                className={cn(
                  "text-xs text-muted-foreground hover:text-foreground transition-colors",
                  activeStatuses.includes(status) &&
                    "text-foreground font-medium",
                )}
              >
                <Span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full mr-1",
                    STATUS_COLORS[status]?.split(" ")[0] ?? "bg-gray-400",
                  )}
                />
                {t(status)}: {count}
              </Button>
            ))}
        </Div>
      )}

      {/* Lead list */}
      <Div className="px-4 pb-2 overflow-y-auto max-h-[min(700px,calc(100dvh-320px))]">
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
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            <Div className="mb-2">
              {hasActiveFilters
                ? t("app.api.leads.list.get.emptySearch")
                : t("app.api.leads.list.get.emptyState")}
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
                  {t("app.api.leads.list.widget.addLead")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImport}
                  className="gap-1"
                >
                  <Upload className="h-4 w-4" />
                  {t("app.api.leads.list.widget.importCsv")}
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
            {t("app.api.leads.list.widget.pagination", {
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
