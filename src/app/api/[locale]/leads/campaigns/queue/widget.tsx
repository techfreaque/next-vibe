/**
 * Campaign Queue Widget
 * Table view of leads currently active in email campaigns
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { List } from "next-vibe-ui/ui/icons/List";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

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

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "blue" | "purple";
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "blue"
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
      )}
    >
      {children}
    </Span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CampaignQueueWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = field.value;

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

      {/* Table */}
      {items.length === 0 ? (
        <Div className="rounded-lg border bg-card p-8 text-center">
          <Span className="text-muted-foreground text-sm">
            {t("widget.noData")}
          </Span>
        </Div>
      ) : (
        <Div className="rounded-lg border bg-card overflow-x-auto">
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
                <Badge variant="blue">{item.campaignType}</Badge>
              </Div>
              <Div className="px-3 py-2 text-sm">
                <Badge variant="purple">{item.currentStage}</Badge>
              </Div>
              <Div className="px-3 py-2 text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                {item.journeyVariant}
              </Div>
              <Div className="px-3 py-2 text-xs">
                {formatDate(item.nextScheduledAt) ?? t("widget.never")}
              </Div>
              <Div className="px-3 py-2 text-sm tabular-nums text-center">
                {item.emailsSent}
              </Div>
              <Div className="px-3 py-2 text-sm tabular-nums text-center text-green-600 dark:text-green-400">
                {item.emailsOpened}
              </Div>
              <Div className="px-3 py-2 text-sm tabular-nums text-center text-blue-600 dark:text-blue-400">
                {item.emailsClicked}
              </Div>
              <Div className="px-3 py-2 text-xs text-muted-foreground">
                {formatDate(item.startedAt) ?? t("widget.never")}
              </Div>
            </Div>
          ))}
        </Div>
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
