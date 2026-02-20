/**
 * Leads Search Widget
 * Rich search interface with results list and navigation
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import type { ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Check,
  ChevronDown,
  Copy,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;
type Lead = NonNullable<GetResponseOutput["response"]>["leads"][number];

interface CustomWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

// ─── Colour maps ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  CAMPAIGN_RUNNING:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  WEBSITE_USER:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  NEWSLETTER_SUBSCRIBER:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  IN_CONTACT:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  SIGNED_UP: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  SUBSCRIPTION_CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  UNSUBSCRIBED:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  BOUNCED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  INVALID: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200",
};

// Status label i18n keys for filter chips (concise)
const STATUS_LABEL_KEYS: Record<string, string> = {
  NEW: "app.api.leads.search.widget.statusNew",
  PENDING: "app.api.leads.search.widget.statusPending",
  CAMPAIGN_RUNNING: "app.api.leads.search.widget.statusCampaign",
  WEBSITE_USER: "app.api.leads.search.widget.statusWebUser",
  NEWSLETTER_SUBSCRIBER: "app.api.leads.search.widget.statusNewsletter",
  IN_CONTACT: "app.api.leads.search.widget.statusInContact",
  SIGNED_UP: "app.api.leads.search.widget.statusSignedUp",
  SUBSCRIPTION_CONFIRMED: "app.api.leads.search.widget.statusSubscribed",
  UNSUBSCRIBED: "app.api.leads.search.widget.statusUnsub",
  BOUNCED: "app.api.leads.search.widget.statusBounced",
  INVALID: "app.api.leads.search.widget.statusInvalid",
};

// ─── Bar colour helper ─────────────────────────────────────────────────────────

function getOpenRateColor(pct: number): string {
  if (pct >= 50) {
    return "#22c55e"; // green-500
  }
  if (pct >= 20) {
    return "#eab308"; // yellow-500
  }
  return "rgba(100,100,100,0.4)";
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow(): React.JSX.Element {
  return (
    <Div className="flex items-center gap-3 p-3 rounded-lg border animate-pulse">
      <Div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted" />
      <Div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Div className="h-3.5 w-40 rounded bg-muted" />
        <Div className="h-3 w-56 rounded bg-muted" />
        <Div className="h-3 w-24 rounded bg-muted" />
      </Div>
      <Div className="hidden md:flex flex-col items-end gap-1.5">
        <Div className="h-3 w-16 rounded bg-muted" />
        <Div className="h-2.5 w-24 rounded bg-muted" />
      </Div>
    </Div>
  );
}

// ─── Open-rate mini progress bar ──────────────────────────────────────────────

function OpenRateBar({
  pct,
  openRateSuffix,
}: {
  pct: number;
  openRateSuffix: string;
}): React.JSX.Element {
  const barStyle: React.CSSProperties = {
    width: `${Math.min(pct, 100)}%`,
    height: "100%",
    borderRadius: "9999px",
    transition: "all 0.15s",
    backgroundColor: getOpenRateColor(pct),
  };

  return (
    <Div className="flex flex-col items-end gap-0.5">
      <Span className="text-xs tabular-nums">
        {pct}
        {openRateSuffix}
      </Span>
      <Div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
        <Div style={barStyle} />
      </Div>
    </Div>
  );
}

// ─── Copy-to-clipboard email ──────────────────────────────────────────────────

function CopyEmail({
  email,
  copyEmailTitle,
}: {
  email: string;
  copyEmailTitle: string;
}): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      void navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
        return undefined;
      });
    },
    [email],
  );

  return (
    <Button
      type="button"
      onClick={handleCopy}
      title={copyEmailTitle}
      className="group/copy flex items-center gap-1 hover:text-foreground transition-colors"
    >
      <Span className="truncate max-w-[160px]">{email}</Span>
      {copied ? (
        <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
      ) : (
        <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-100 flex-shrink-0 transition-opacity" />
      )}
    </Button>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────

export function LeadsSearchContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  const t = useWidgetTranslation();

  const leads = data?.response?.leads ?? [];
  const total = data?.response?.total ?? 0;
  const hasMore = data?.response?.hasMore ?? false;

  // Track which status values are currently active as client-side filter chips.
  // An empty set means "show all".
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(new Set());

  // ── Navigation helpers ────────────────────────────────────────────────────

  const handleViewLead = useCallback(
    (lead: Lead): void => {
      router.push(`/${locale}/admin/leads/${lead.id}/edit`);
    },
    [router, locale],
  );

  const handleEditLead = useCallback(
    (lead: Lead): void => {
      router.push(`/${locale}/admin/leads/${lead.id}/edit`);
    },
    [router, locale],
  );

  const handleDeleteLead = useCallback(
    (lead: Lead): void => {
      router.push(`/${locale}/admin/leads/${lead.id}/edit`);
    },
    [router, locale],
  );

  const handleCreateLead = useCallback((): void => {
    router.push(`/${locale}/admin/leads/create`);
  }, [router, locale]);

  // ── "Load more" – advances the offset field in the parent form ────────────

  const handleLoadMore = useCallback((): void => {
    if (!form) {
      return;
    }
    const currentOffset = form.getValues("offset") ?? 0;
    const currentLimit = form.getValues("limit") ?? 10;
    form.setValue("offset", currentOffset + currentLimit);
    // Trigger re-submission
    if (typeof onSubmit === "function") {
      onSubmit();
    }
  }, [form, onSubmit]);

  // ── Status filter chip toggles ────────────────────────────────────────────

  const toggleStatus = useCallback((status: string): void => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  const clearStatusFilter = useCallback((): void => {
    setActiveStatuses(new Set());
  }, []);

  // ── Derive visible statuses present in current result set ─────────────────

  const presentStatuses = [...new Set(leads.map((l) => l.status))];

  // ── Apply client-side status filter ──────────────────────────────────────

  const filteredLeads =
    activeStatuses.size === 0
      ? leads
      : leads.filter((l) => l.status && activeStatuses.has(l.status));

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <Div className="flex items-center gap-2 p-4 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.search.widget.title")}
          </Span>
          {total > 0 && (
            <Span className="text-sm text-muted-foreground font-normal">
              ({total}
              {hasMore ? "+" : ""})
            </Span>
          )}
        </Div>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </Div>

      {/* ── Search form ── */}
      <Div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <Div className="flex-1">
          <TextFieldWidget fieldName="search" field={children.search} />
        </Div>
        <SubmitButtonWidget
          field={{
            text: "app.api.leads.search.get.search.label",
            loadingText: "app.api.leads.search.get.search.label",
            icon: "search",
            variant: "primary",
          }}
        />
      </Div>
      <FormAlertWidget field={{}} />

      {/* ── Results ── */}
      <Div className="px-4 pb-2 overflow-y-auto max-h-[min(700px,calc(100dvh-260px))]">
        {/* Status filter chips – only shown when results are present */}
        {presentStatuses.length > 1 && (
          <Div className="flex flex-wrap items-center gap-1.5 pt-3 pb-1">
            <Span className="text-xs text-muted-foreground mr-0.5">
              {t("app.api.leads.search.widget.filterLabel")}
            </Span>
            {presentStatuses.map((status) => {
              const isActive = activeStatuses.has(status);
              return (
                <Button
                  key={status}
                  type="button"
                  onClick={() => {
                    toggleStatus(status);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all",
                    isActive
                      ? `${STATUS_COLORS[status] ?? "bg-primary text-primary-foreground"} border-transparent`
                      : "bg-transparent border-border text-muted-foreground hover:border-foreground/40",
                  )}
                >
                  {STATUS_LABEL_KEYS[status]
                    ? t(STATUS_LABEL_KEYS[status])
                    : status.replace(/_/g, " ")}
                  {isActive && <X className="h-2.5 w-2.5" />}
                </Button>
              );
            })}
            {activeStatuses.size > 0 && (
              <Button
                type="button"
                onClick={clearStatusFilter}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
              >
                {t("app.api.leads.search.widget.clearFilter")}
              </Button>
            )}
          </Div>
        )}

        {/* Loading skeleton */}
        {isLoading && leads.length === 0 && (
          <Div className="flex flex-col gap-2 pt-2">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </Div>
        )}

        {/* Empty state */}
        {!isLoading && leads.length === 0 && (
          <Div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Div className="rounded-full bg-muted p-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </Div>
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-medium">
                {t("app.api.leads.search.widget.noResultsTitle")}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.search.widget.noResultsSubtitle")}
              </Span>
            </Div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 mt-1"
              onClick={handleCreateLead}
            >
              <Plus className="h-3.5 w-3.5" />
              {t("app.api.leads.search.widget.createLead")}
            </Button>
          </Div>
        )}

        {/* No results after client-side filter */}
        {!isLoading && leads.length > 0 && filteredLeads.length === 0 && (
          <Div className="text-center text-muted-foreground py-8 text-sm">
            {t("app.api.leads.search.widget.noLeadsMatchFilter")}{" "}
            <Button
              type="button"
              className="underline"
              onClick={clearStatusFilter}
            >
              {t("app.api.leads.search.widget.clearFilters")}
            </Button>
          </Div>
        )}

        {/* Result rows */}
        {filteredLeads.length > 0 && (
          <Div className="flex flex-col gap-2 pt-2">
            {filteredLeads.map((lead) => {
              const openRate =
                lead.emailsSent !== null &&
                lead.emailsOpened !== null &&
                lead.emailsSent > 0
                  ? Math.round((lead.emailsOpened / lead.emailsSent) * 100)
                  : null;

              const initials = (lead.businessName ?? lead.email ?? "?")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Div
                  key={lead.id}
                  className="group/row relative flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    handleViewLead(lead);
                  }}
                >
                  {/* Avatar */}
                  <Div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {initials}
                  </Div>

                  {/* Info */}
                  <Div className="flex-1 min-w-0">
                    {/* Row 1 – name + status badges */}
                    <Div className="flex items-center gap-2 flex-wrap">
                      <Span className="font-semibold text-sm truncate">
                        {lead.businessName ?? lead.email ?? "—"}
                      </Span>

                      {/* Status chip */}
                      {lead.status && (
                        <Span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            STATUS_COLORS[lead.status] ??
                              "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                          )}
                        >
                          {lead.status && STATUS_LABEL_KEYS[lead.status]
                            ? t(STATUS_LABEL_KEYS[lead.status])
                            : lead.status.replace(/_/g, " ")}
                        </Span>
                      )}

                      {/* Converted badge – prominent green */}
                      {lead.convertedUserId && (
                        <Span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white dark:bg-green-600">
                          <Check className="h-3 w-3" />
                          {t("app.api.leads.search.widget.converted")}
                        </Span>
                      )}

                      {/* Campaign stage chip */}
                      {lead.currentCampaignStage && (
                        <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                          {lead.currentCampaignStage.replace(/_/g, " ")}
                        </Span>
                      )}
                    </Div>

                    {/* Row 2 – email (copyable) + country + source */}
                    <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      {lead.email && (
                        <CopyEmail
                          email={lead.email}
                          copyEmailTitle={t(
                            "app.api.leads.search.widget.copyEmailTitle",
                          )}
                        />
                      )}
                      {lead.country && <Span>{lead.country}</Span>}
                      {lead.source && (
                        <Span>{lead.source.replace(/_/g, " ")}</Span>
                      )}
                    </Div>

                    {/* Row 3 – created date */}
                    {lead.createdAt && (
                      <Div className="text-xs text-muted-foreground mt-0.5">
                        {formatSimpleDate(lead.createdAt, locale)}
                      </Div>
                    )}
                  </Div>

                  {/* Stats column */}
                  <Div className="hidden md:flex flex-col items-end gap-1.5 flex-shrink-0 text-xs text-muted-foreground">
                    {lead.emailsSent !== null && (
                      <Span>
                        {lead.emailsSent}{" "}
                        {t("app.api.leads.search.widget.emailsSentSuffix")}
                      </Span>
                    )}
                    {openRate !== null ? (
                      <OpenRateBar
                        pct={openRate}
                        openRateSuffix={t(
                          "app.api.leads.search.widget.openRateSuffix",
                        )}
                      />
                    ) : (
                      lead.emailsSent !== null &&
                      lead.emailsSent === 0 && (
                        <Span className="text-muted-foreground/50">
                          {t("app.api.leads.search.widget.noEmails")}
                        </Span>
                      )
                    )}
                  </Div>

                  {/* Inline hover action buttons */}
                  <Div
                    className="hidden group-hover/row:flex items-center gap-1 absolute right-3 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm border rounded-md px-1 py-0.5 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Button
                      type="button"
                      title={t("app.api.leads.search.widget.editLeadTitle")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLead(lead);
                      }}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      title={t("app.api.leads.search.widget.deleteLeadTitle")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLead(lead);
                      }}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </Div>
                </Div>
              );
            })}
          </Div>
        )}

        {/* Load more */}
        {hasMore && !isLoading && leads.length > 0 && (
          <Div className="flex justify-center pt-3 pb-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 w-full max-w-xs"
              onClick={handleLoadMore}
            >
              <ChevronDown className="h-4 w-4" />
              {t("app.api.leads.search.widget.loadMore")}
            </Button>
          </Div>
        )}

        {/* Loading more indicator */}
        {isLoading && leads.length > 0 && (
          <Div className="flex justify-center pt-3 pb-1">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </Div>
        )}
      </Div>
    </Div>
  );
}
