/**
 * Campaign Queue Widget
 * Table view of leads currently active in email campaigns
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { List } from "next-vibe-ui/ui/icons/List";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

// ── Date formatter ────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) {
    return null;
  }
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Label maps ───────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<string, string> = {
  "enums.emailCampaignStage.notStarted": "Not Started",
  "enums.emailCampaignStage.initial": "Initial Contact",
  "enums.emailCampaignStage.followup1": "Follow-up 1",
  "enums.emailCampaignStage.followup2": "Follow-up 2",
  "enums.emailCampaignStage.followup3": "Follow-up 3",
  "enums.emailCampaignStage.nurture": "Nurture",
  "enums.emailCampaignStage.reactivation": "Reactivation",
};

const VARIANT_LABELS: Record<string, string> = {
  "enums.emailJourneyVariant.uncensoredConvert": "Uncensored Convert",
  "enums.emailJourneyVariant.sideHustle": "Side Hustle",
  "enums.emailJourneyVariant.quietRecommendation": "Quiet Recommendation",
  "enums.emailJourneyVariant.signupNurture": "Signup Nurture",
  "enums.emailJourneyVariant.retention": "Retention",
  "enums.emailJourneyVariant.winback": "Winback",
};

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  "enums.campaignType.leadCampaign": "Lead Campaign",
  "enums.campaignType.signupNurture": "Signup Nurture",
  "enums.campaignType.retention": "Retention",
  "enums.campaignType.winback": "Winback",
};

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "blue" | "purple" | "green";
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "blue" && "bg-info/10 text-info",
        variant === "purple" &&
          "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
        variant === "green" && "bg-success/10 text-success-foreground",
      )}
    >
      {children}
    </Span>
  );
}

// ── Lead card (responsive mobile view) ────────────────────────────────────────

type QueueItem = (typeof definition.GET.types.ResponseOutput)["items"][number];
type QueueTranslation = ReturnType<
  typeof useWidgetTranslation<typeof definition.GET>
>;

function LeadCard({
  item,
  t,
}: {
  item: QueueItem;
  t: QueueTranslation;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
      {/* Top: email + business */}
      <Div className="flex flex-col gap-1">
        <Span className="text-sm font-mono font-medium truncate">
          {item.leadEmail ?? t("widget.never")}
        </Span>
        <Span className="text-xs text-muted-foreground truncate">
          {item.businessName}
        </Span>
      </Div>

      {/* Badges row */}
      <Div className="flex flex-wrap gap-1.5">
        <Badge variant="blue">
          {CAMPAIGN_TYPE_LABELS[item.campaignType] ?? item.campaignType}
        </Badge>
        <Badge variant="purple">
          {STAGE_LABELS[item.currentStage] ?? item.currentStage}
        </Badge>
        <Badge variant="green">
          {VARIANT_LABELS[item.journeyVariant] ?? item.journeyVariant}
        </Badge>
      </Div>

      {/* Stats row */}
      <Div className="grid grid-cols-3 gap-2 text-center">
        <Div className="flex flex-col">
          <Span className="text-lg font-bold tabular-nums">
            {item.emailsSent}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("widget.columnSent")}
          </Span>
        </Div>
        <Div className="flex flex-col">
          <Span className="text-lg font-bold tabular-nums text-success">
            {item.emailsOpened}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("widget.columnOpen")}
          </Span>
        </Div>
        <Div className="flex flex-col">
          <Span className="text-lg font-bold tabular-nums text-info">
            {item.emailsClicked}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("widget.columnClick")}
          </Span>
        </Div>
      </Div>

      {/* Dates */}
      <Div className="flex justify-between text-xs text-muted-foreground">
        <Span>
          {t("widget.columnStarted")}:{" "}
          {formatDate(item.startedAt) ?? t("widget.never")}
        </Span>
        <Span>
          {t("widget.columnNext")}:{" "}
          {formatDate(item.nextScheduledAt) ?? t("widget.never")}
        </Span>
      </Div>
    </Div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CampaignQueueWidget(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const items = data?.items ?? [];

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <List className="h-5 w-5 text-muted-foreground" />
        <Span className="font-semibold text-base mr-auto">
          {t("widget.title")}
        </Span>
        {data && (
          <Span className="text-sm text-muted-foreground">
            {data.totalCount} {t("get.response.total")}
          </Span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => endpointMutations?.read?.refetch?.()}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Empty state or content */}
      {items.length === 0 ? (
        <Div className="rounded-xl border bg-card p-12 text-center flex flex-col items-center gap-4">
          <Div className="rounded-full bg-muted p-4">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </Div>
          <Div className="flex flex-col gap-2 max-w-md">
            <Span className="font-semibold text-base">
              {t("widget.noData")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("widget.emptyDescription")}
            </Span>
          </Div>
          <Div className="flex flex-row gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => endpointMutations?.read?.refetch?.()}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {t("widget.refresh")}
            </Button>
          </Div>
        </Div>
      ) : (
        <>
          {/* Mobile card view */}
          <Div className="flex flex-col gap-3 md:hidden">
            {items.map((item) => (
              <LeadCard key={item.leadId} item={item} t={t} />
            ))}
          </Div>

          {/* Desktop table view */}
          <Div className="hidden md:block rounded-lg border bg-card overflow-x-auto">
            {/* Header row */}
            <Div className="grid grid-cols-[2fr_1.5fr_1.2fr_1.2fr_1.2fr_1.2fr_1fr_1fr_1fr_1.2fr] border-b bg-muted/30 min-w-[900px]">
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnEmail")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnBusiness")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnType")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnStage")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnVariant")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnNext")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnSent")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnOpen")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnClick")}
              </Div>
              <Div className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("widget.columnStarted")}
              </Div>
            </Div>

            {/* Data rows */}
            {items.map((item, idx) => (
              <Div
                key={item.leadId}
                className={cn(
                  "grid grid-cols-[2fr_1.5fr_1.2fr_1.2fr_1.2fr_1.2fr_1fr_1fr_1fr_1.2fr] border-b last:border-b-0 hover:bg-muted/20 transition-colors min-w-[900px]",
                  idx % 2 === 0 ? "bg-card" : "bg-muted/10",
                )}
              >
                <Div className="px-3 py-2 text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.leadEmail ?? t("widget.never")}
                </Div>
                <Div className="px-3 py-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.businessName}
                </Div>
                <Div className="px-3 py-2 text-sm">
                  <Badge variant="blue">
                    {CAMPAIGN_TYPE_LABELS[item.campaignType] ??
                      item.campaignType}
                  </Badge>
                </Div>
                <Div className="px-3 py-2 text-sm">
                  <Badge variant="purple">
                    {STAGE_LABELS[item.currentStage] ?? item.currentStage}
                  </Badge>
                </Div>
                <Div className="px-3 py-2 text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {VARIANT_LABELS[item.journeyVariant] ?? item.journeyVariant}
                </Div>
                <Div className="px-3 py-2 text-xs">
                  {formatDate(item.nextScheduledAt) ?? t("widget.never")}
                </Div>
                <Div className="px-3 py-2 text-sm tabular-nums text-center">
                  {item.emailsSent}
                </Div>
                <Div className="px-3 py-2 text-sm tabular-nums text-center text-success">
                  {item.emailsOpened}
                </Div>
                <Div className="px-3 py-2 text-sm tabular-nums text-center text-info">
                  {item.emailsClicked}
                </Div>
                <Div className="px-3 py-2 text-xs text-muted-foreground">
                  {formatDate(item.startedAt) ?? t("widget.never")}
                </Div>
              </Div>
            ))}
          </Div>
        </>
      )}

      {/* Pagination info */}
      {data && data.totalCount > 0 && (
        <Div className="flex justify-between items-center text-sm text-muted-foreground">
          <Span>
            {t("widget.pagination", {
              page: data.currentPage,
              totalPages: Math.ceil(data.totalCount / data.pageSize),
              total: data.totalCount,
            })}
          </Span>
        </Div>
      )}
    </Div>
  );
}
