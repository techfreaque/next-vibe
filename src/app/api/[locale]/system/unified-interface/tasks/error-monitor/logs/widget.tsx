/**
 * Custom Widget for Error Logs
 * Card list with collapsible stack trace / metadata and live filtering
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";

import type endpoints from "./definition";
import type { ErrorLogsResponseOutput } from "./definition";

type ErrorLog = ErrorLogsResponseOutput["logs"][number];

interface WidgetProps {
  field: {
    value: ErrorLogsResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
}

const LIMIT = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(s: string): string {
  return s.slice(0, 19).replace("T", " ");
}

// ---------------------------------------------------------------------------
// Level / Source badges
// ---------------------------------------------------------------------------

const LEVEL_CLASS: Record<string, string> = {
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  warn: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

const SOURCE_CLASS: Record<string, string> = {
  backend: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  task: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  chat: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

const DEFAULT_BADGE =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

// ---------------------------------------------------------------------------
// ErrorLogCard
// ---------------------------------------------------------------------------

function ErrorLogCard({
  log,
  expandedSection,
  onToggle,
  t,
}: {
  log: ErrorLog;
  expandedSection: "stack" | "meta" | null;
  onToggle: (section: "stack" | "meta") => void;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): React.JSX.Element {
  const hasStack = Boolean(log.stackTrace);
  const hasMeta = log.metadata && Object.keys(log.metadata).length > 0;

  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      {/* Main row */}
      <Div className="flex items-start gap-3 p-3">
        {/* Level badge */}
        <Span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5",
            LEVEL_CLASS[log.level] ?? DEFAULT_BADGE,
          )}
        >
          {log.level}
        </Span>

        {/* Source badge */}
        <Span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5",
            SOURCE_CLASS[log.source] ?? DEFAULT_BADGE,
          )}
        >
          {log.source}
        </Span>

        {/* Message + meta */}
        <Div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <Span className="text-sm font-medium break-words">{log.message}</Span>
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-mono">
            <Span>{formatDate(log.createdAt)}</Span>
            {log.endpoint && <Span>{log.endpoint}</Span>}
            {log.errorType && (
              <Span className="bg-muted px-1 rounded">{log.errorType}</Span>
            )}
            {log.errorCode && (
              <Span className="bg-muted px-1 rounded">{log.errorCode}</Span>
            )}
          </Div>
        </Div>

        {/* Expand buttons */}
        <Div className="flex items-center gap-1 flex-shrink-0">
          {hasStack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggle("stack")}
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              {t("widget.detail.stackTrace")}
              {expandedSection === "stack" ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
          {hasMeta && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggle("meta")}
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              {t("widget.detail.metadata")}
              {expandedSection === "meta" ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
        </Div>
      </Div>

      {/* Expanded: stack trace */}
      {expandedSection === "stack" && hasStack && (
        <Div className="border-t bg-muted/40 p-3">
          <Pre className="text-xs font-mono text-foreground overflow-auto max-h-48 whitespace-pre-wrap break-words">
            {log.stackTrace}
          </Pre>
        </Div>
      )}

      {/* Expanded: metadata */}
      {expandedSection === "meta" && hasMeta && (
        <Div className="border-t bg-muted/40 p-3">
          <Pre className="text-xs font-mono text-foreground overflow-auto max-h-48 whitespace-pre-wrap break-words">
            {JSON.stringify(log.metadata, null, 2)}
          </Pre>
        </Div>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function ErrorLogsContainer({ field }: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const value = field.value;
  const totalCount = value?.totalCount ?? 0;
  const logs = value?.logs ?? [];

  const offset = Number(form?.watch("offset") ?? 0);
  const isLoading = endpointMutations?.read?.isLoading;

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handlePageChange = useCallback(
    (newOffset: number): void => {
      form?.setValue("offset", newOffset);
      if (onSubmit) {
        onSubmit();
      } else {
        endpointMutations?.read?.refetch?.();
      }
    },
    [form, onSubmit, endpointMutations],
  );

  const handleToggle = useCallback(
    (logId: string, section: "stack" | "meta"): void => {
      const key = `${logId}:${section}`;
      setExpandedId((prev) => (prev === key ? null : key));
    },
    [],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-base mr-auto">
          {t("widget.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </Span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.header.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* ── Filters ── */}
      <Div className="flex flex-col gap-2 px-4 py-3 border-b">
        <Div className="grid grid-cols-2 gap-2">
          <TextFieldWidget fieldName={"source"} field={children.source} />
          <TextFieldWidget fieldName={"level"} field={children.level} />
        </Div>
        <Div className="grid grid-cols-2 gap-2">
          <TextFieldWidget fieldName={"endpoint"} field={children.endpoint} />
          <TextFieldWidget fieldName={"errorType"} field={children.errorType} />
        </Div>
      </Div>

      {/* ── Loading state ── */}
      {isLoading && (
        <Div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      )}

      {/* ── Card list ── */}
      {!isLoading && (
        <Div className="flex flex-col gap-2 px-4 py-3">
          <FormAlertWidget field={{}} />
          {logs.length === 0 ? (
            <Div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              <Span className="text-sm text-muted-foreground">
                {t("widget.empty")}
              </Span>
            </Div>
          ) : (
            logs.map((log) => {
              const key = expandedId?.startsWith(log.id)
                ? (expandedId.split(":")[1] as "stack" | "meta")
                : null;
              return (
                <ErrorLogCard
                  key={log.id}
                  log={log}
                  expandedSection={key}
                  onToggle={(section) => handleToggle(log.id, section)}
                  t={t}
                />
              );
            })
          )}
        </Div>
      )}

      {/* ── Pagination footer ── */}
      <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <Span>
          {t("widget.pagination.info", {
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
            disabled={offset <= 0}
            onClick={() => handlePageChange(Math.max(0, offset - LIMIT))}
          >
            <ChevronLeft className="h-4 w-4" />
            <Span className="hidden sm:inline ml-1">
              {t("widget.pagination.prev")}
            </Span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(offset + LIMIT)}
          >
            <Span className="hidden sm:inline mr-1">
              {t("widget.pagination.next")}
            </Span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
