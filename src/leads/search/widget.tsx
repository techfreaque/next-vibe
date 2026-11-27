/**
 * Leads Search Widget
 * Rich search interface with results list and navigation
 */

"use client";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { LeadStatus } from "next-vibe/identity/lead/enum";
import { scopedTranslation as leadTranslation } from "next-vibe/identity/lead/i18n";
import type { ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { X } from "next-vibe/ui/components/icons/X";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useTouchDevice } from "next-vibe/ui/hooks/use-touch-device";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useCallback, useState } from "react";

import type definition from "./definition";

type Lead = NonNullable<
  (typeof definition.GET.types.ResponseOutput)["response"]
>["leads"][number];

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

// ─── Colour maps ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  [LeadStatus.NEW]: "bg-info/10 text-info",
  [LeadStatus.PENDING]: "bg-warning/10 text-warning",
  [LeadStatus.CAMPAIGN_RUNNING]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [LeadStatus.WEBSITE_USER]:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  [LeadStatus.NEWSLETTER_SUBSCRIBER]:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  [LeadStatus.IN_CONTACT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [LeadStatus.SIGNED_UP]:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  [LeadStatus.SUBSCRIPTION_CONFIRMED]: "bg-success/10 text-success",
  [LeadStatus.UNSUBSCRIBED]:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  [LeadStatus.BOUNCED]: "bg-destructive/10 text-destructive",
  [LeadStatus.INVALID]: "bg-destructive/10 text-destructive",
};

type SearchTranslationKey =
  (typeof definition.GET)["scopedTranslation"]["ScopedTranslationKey"];

// Status label i18n keys for filter chips (concise)
const STATUS_LABEL_KEYS: Record<string, SearchTranslationKey> = {
  [LeadStatus.NEW]: "widget.statusNew",
  [LeadStatus.PENDING]: "widget.statusPending",
  [LeadStatus.CAMPAIGN_RUNNING]: "widget.statusCampaign",
  [LeadStatus.WEBSITE_USER]: "widget.statusWebUser",
  [LeadStatus.NEWSLETTER_SUBSCRIBER]: "widget.statusNewsletter",
  [LeadStatus.IN_CONTACT]: "widget.statusInContact",
  [LeadStatus.SIGNED_UP]: "widget.statusSignedUp",
  [LeadStatus.SUBSCRIPTION_CONFIRMED]: "widget.statusSubscribed",
  [LeadStatus.UNSUBSCRIBED]: "widget.statusUnsub",
  [LeadStatus.BOUNCED]: "widget.statusBounced",
  [LeadStatus.INVALID]: "widget.statusInvalid",
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
  const isTouch = useTouchDevice();
  const logger = useWidgetLogger();

  const handleCopy = useCallback(
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      void copyToClipboard(email, logger).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
        return undefined;
      });
    },
    [email, logger],
  );

  return (
    <Button
      type="button"
      onClick={handleCopy}
      title={copyEmailTitle}
      className="group/copy relative z-10 flex items-center gap-1 hover:text-foreground transition-colors"
    >
      <Span className="truncate max-w-[160px]">{email}</Span>
      {copied ? (
        <Check className="h-3 w-3 text-success flex-shrink-0" />
      ) : (
        <Copy
          className={cn(
            "h-3 w-3 flex-shrink-0",
            isTouch
              ? "opacity-100"
              : "opacity-0 group-hover/copy:opacity-100 transition-opacity",
          )}
        />
      )}
    </Button>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────

export function LeadsSearchContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.GET>();
  const { endpointMutations, response } = useWidgetContext();
  const locale = useWidgetLocale();
  const { push: navigate, pop } = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.GET>();
  const isLoadingFresh = endpointMutations?.read?.isLoadingFresh ?? false;
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const isLoading = isLoadingFresh;
  const submit = useWidgetOnSubmit();

  const t = useWidgetTranslation<typeof definition.GET>();
  const { t: leadT } = leadTranslation.scopedT(locale);

  const onPick = usePickerCallback<Omit<Lead, "metadata">>();
  const isPickerMode = !!onPick;

  const leads = data?.response?.leads ?? [];
  const total = data?.response?.total ?? 0;
  const hasMore = data?.response?.hasMore ?? false;

  const activeStatus = form.watch("status");
  const search = form.watch("search");
  const offset = form.watch("offset") ?? 0;
  const limit = form.watch("limit") ?? 10;
  const filtered = Boolean(search?.trim() || activeStatus);

  // ── Navigation helpers ────────────────────────────────────────────────────

  const handleViewLead = useCallback(
    (lead: Lead): void => {
      if (isPickerMode && onPick) {
        onPick(lead);
        pop();
        return;
      }
      void (async (): Promise<void> => {
        const leadDef = await import("@/leads/[id]/definition");
        navigate(leadDef.default.GET, { urlPathParams: { id: lead.id } });
      })();
    },
    [isPickerMode, onPick, pop, navigate],
  );

  const handleEditLead = useCallback(
    (lead: Lead): void => {
      void (async (): Promise<void> => {
        const leadDef = await import("@/leads/[id]/definition");
        navigate(leadDef.default.PATCH, {
          urlPathParams: { id: lead.id },
          prefillFromGet: true,
          getEndpoint: leadDef.default.GET,
        });
      })();
    },
    [navigate],
  );

  const handleDeleteLead = useCallback(
    (lead: Lead): void => {
      void (async (): Promise<void> => {
        const leadDef = await import("@/leads/[id]/definition");
        navigate(leadDef.default.DELETE, { urlPathParams: { id: lead.id } });
      })();
    },
    [navigate],
  );

  const handleCreateLead = useCallback((): void => {
    void (async (): Promise<void> => {
      const createDef = await import("@/leads/create/definition");
      navigate(createDef.default.POST);
    })();
  }, [navigate]);

  const changePage = (nextOffset: number): void => {
    form.setValue("offset", nextOffset, { shouldDirty: true });
    submit?.();
  };
  const clearFilters = (): void => {
    form.setValue("search", "", { shouldDirty: true });
    form.setValue("status", undefined, { shouldDirty: true });
    changePage(0);
  };
  return (
    <WidgetShell layout={isPickerMode ? "compact" : "page"}>
      <WidgetHeader
        title={t("get.title")}
        size={isPickerMode ? undefined : "page"}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          isFetching ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : undefined
        }
      />

      <Div className="flex flex-wrap items-end gap-3">
        <Div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="lead-search-query">{t("get.search.label")}</Label>
          <Input
            id="lead-search-query"
            value={search ?? ""}
            placeholder={t("get.search.placeholder")}
            className="min-h-10"
            onChange={(event) => {
              form.setValue("search", event.target.value, {
                shouldDirty: true,
              });
              form.setValue("offset", 0, { shouldDirty: true });
            }}
          />
        </Div>
        <SubmitButtonWidget<typeof definition.GET>
          field={{
            text: "get.search.label",
            loadingText: "get.search.label",
            icon: "search",
            variant: "primary",
            className: "min-h-10",
          }}
        />
      </Div>
      <FormAlertWidget field={{}} />

      {/* ── Results ── */}
      <Div className="flex min-w-0 flex-col gap-3">
        {/* Status filter chips — full mode only */}
        {!isPickerMode && (
          <Div className="flex flex-wrap items-center gap-1.5 pt-3 pb-1">
            <Span className="text-xs text-muted-foreground mr-0.5">
              {t("widget.filterLabel")}
            </Span>
            {Object.values(LeadStatus).map((status) => {
              const isActive = activeStatus === status;
              return (
                <Button
                  key={status}
                  type="button"
                  onClick={() => {
                    form.setValue("status", isActive ? undefined : status, {
                      shouldDirty: true,
                    });
                    changePage(0);
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
                    : leadT(status)}
                  {isActive && <X className="h-2.5 w-2.5" />}
                </Button>
              );
            })}
            {activeStatus && (
              <Button
                type="button"
                onClick={() => {
                  form.setValue("status", undefined, { shouldDirty: true });
                  changePage(0);
                }}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
              >
                {t("widget.clearFilter")}
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

        {data &&
          !isFetching &&
          response?.success !== false &&
          leads.length === 0 && (
            <EmptyBlock
              icon={<Search className="h-6 w-6" />}
              title={t("widget.noResultsTitle")}
              message={t("widget.noResultsSubtitle")}
              action={
                filtered
                  ? { label: t("widget.clearFilter"), onClick: clearFilters }
                  : !isPickerMode
                    ? {
                        label: t("widget.createLead"),
                        onClick: handleCreateLead,
                      }
                    : undefined
              }
            />
          )}

        {/* Result rows */}
        {leads.length > 0 && (
          <Div
            className={cn(
              "flex flex-col gap-2 pt-2",
              isFetching && !isLoadingFresh && "opacity-50 pointer-events-none",
            )}
          >
            {leads.map((lead) => {
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
                  className="group/row relative flex min-w-0 flex-wrap items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  {/* Avatar */}
                  <Div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {initials}
                  </Div>

                  {/* Info */}
                  <Div className="flex-1 min-w-0">
                    {/* Row 1 - name + status badges */}
                    <Div className="flex items-center gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleViewLead(lead)}
                        className="h-auto min-w-0 p-0 font-semibold text-sm hover:bg-transparent hover:underline before:absolute before:inset-0 before:rounded-lg focus-visible:before:ring-2 focus-visible:before:ring-ring"
                      >
                        <Span className="truncate">
                          {lead.businessName ||
                            lead.email ||
                            t("widget.unnamedLead")}
                        </Span>
                      </Button>

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
                            : leadT(lead.status)}
                        </Span>
                      )}

                      {/* Converted badge - prominent green */}
                      {lead.convertedUserId && (
                        <Span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-success text-white">
                          <Check className="h-3 w-3" />
                          {t("widget.converted")}
                        </Span>
                      )}

                      {/* Campaign stage chip */}
                      {lead.currentCampaignStage && (
                        <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                          {leadT(lead.currentCampaignStage)}
                        </Span>
                      )}
                    </Div>

                    {/* Row 2 - email (copyable) + country + source */}
                    <Div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                      {lead.email && (
                        <CopyEmail
                          email={lead.email}
                          copyEmailTitle={t("widget.copyEmailTitle")}
                        />
                      )}
                      {lead.country && <Span>{lead.country}</Span>}
                      {lead.source && <Span>{leadT(lead.source)}</Span>}
                    </Div>

                    {/* Row 3 - created date */}
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
                        {lead.emailsSent} {t("widget.emailsSentSuffix")}
                      </Span>
                    )}
                    {openRate !== null ? (
                      <OpenRateBar
                        pct={openRate}
                        openRateSuffix={t("widget.openRateSuffix")}
                      />
                    ) : (
                      lead.emailsSent !== null &&
                      lead.emailsSent === 0 && (
                        <Span className="text-muted-foreground/50">
                          {t("widget.noEmails")}
                        </Span>
                      )
                    )}
                  </Div>

                  {/* Inline hover action buttons - hidden in picker mode */}
                  {!isPickerMode && (
                    <Div
                      className="relative z-10 ms-auto flex shrink-0 items-center gap-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/row:opacity-100 [@media(hover:hover)]:focus-within:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Button
                        type="button"
                        title={t("widget.editLeadTitle")}
                        aria-label={t("widget.editLeadTitle")}
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
                        title={t("widget.deleteLeadTitle")}
                        aria-label={t("widget.deleteLeadTitle")}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLead(lead);
                        }}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </Div>
                  )}
                </Div>
              );
            })}
          </Div>
        )}

        {(offset > 0 || hasMore) && (
          <Div className="flex flex-wrap items-center justify-between gap-2 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("widget.page", {
                page: Math.floor(offset / limit) + 1,
                pages: Math.max(1, Math.ceil(total / limit)),
              })}
            </Span>
            <Div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={offset === 0 || isFetching}
                onClick={() => changePage(Math.max(0, offset - limit))}
              >
                {t("widget.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasMore || isFetching}
                onClick={() => changePage(offset + limit)}
              >
                {t("widget.next")}
              </Button>
            </Div>
          </Div>
        )}
        {/* Loading more indicator */}
        {isLoading && leads.length > 0 && (
          <Div className="flex justify-center pt-3 pb-1">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </Div>
        )}
      </Div>
    </WidgetShell>
  );
}
