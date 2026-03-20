/**
 * Custom Widget for Error Logs
 * Card list with collapsible stack trace / metadata, resolve/reopen actions,
 * and pagination.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
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
// ErrorLogCard
// ---------------------------------------------------------------------------

function ErrorLogCard({
  log,
  expandedSection,
  onToggle,
  onToggleResolved,
  isUpdating,
  t,
}: {
  log: ErrorLog;
  expandedSection: "stack" | "meta" | null;
  onToggle: (section: "stack" | "meta") => void;
  onToggleResolved: (fingerprint: string, resolved: boolean) => void;
  isUpdating: boolean;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): React.JSX.Element {
  const hasStack = Boolean(log.stackTrace);
  const hasMeta = log.metadata && log.metadata.length > 0;

  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      {/* Main row */}
      <Div className="flex items-start gap-3 p-3">
        {/* Resolved badge */}
        {log.resolved && (
          <Span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <Check className="h-3 w-3" />
            {t("widget.detail.resolved")}
          </Span>
        )}

        {/* Occurrences badge */}
        {log.occurrences > 1 && (
          <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5 bg-muted text-muted-foreground">
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- simple count */}
            {"x"}
            {log.occurrences}
          </Span>
        )}

        {/* Message + meta */}
        <Div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <Span className="text-sm font-medium break-words">{log.message}</Span>
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-mono">
            <Span>
              {t("widget.col.firstSeen")}: {formatDate(log.firstSeen)}
            </Span>
            {log.firstSeen !== log.createdAt && (
              <Span>
                {t("widget.col.createdAt")}: {formatDate(log.createdAt)}
              </Span>
            )}
            {log.level === "warn" && (
              <Span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-1 rounded">
                {"WARN"}
              </Span>
            )}
            {log.errorType && (
              <Span className="bg-muted px-1 rounded">{log.errorType}</Span>
            )}
          </Div>
        </Div>

        {/* Action buttons */}
        <Div className="flex items-center gap-1 flex-shrink-0">
          {/* Resolve / Reopen */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isUpdating}
            onClick={() => onToggleResolved(log.fingerprint, !log.resolved)}
            className={cn(
              "h-7 px-2 text-xs gap-1",
              log.resolved
                ? "text-orange-600 hover:text-orange-700 dark:text-orange-400"
                : "text-green-600 hover:text-green-700 dark:text-green-400",
            )}
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : log.resolved ? (
              <RotateCcw className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            {log.resolved
              ? t("widget.action.reopen")
              : t("widget.action.resolve")}
          </Button>

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
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingFingerprint, setUpdatingFingerprint] = useState<string | null>(
    null,
  );

  const value = field.value;
  const totalCount = value?.totalCount ?? 0;
  const logs = value?.logs ?? [];

  const activeCount = value?.unresolvedCount ?? 0;

  const offset = form.watch("offset") ?? 0;
  const fingerprintFilter = form.watch("fingerprint");
  const isLoading = endpointMutations?.read?.isLoading;

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handlePageChange = useCallback(
    (newOffset: number): void => {
      form.setValue("offset", newOffset);
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

  const handleToggleResolved = useCallback(
    async (fingerprint: string, resolved: boolean): Promise<void> => {
      if (!user) {
        return;
      }
      setUpdatingFingerprint(fingerprint);
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const endpointsDef = await import("./definition");
        await apiClient.mutate(
          endpointsDef.PATCH,
          logger,
          user,
          { fingerprint, resolved },
          undefined,
          locale,
        );
        // Refetch the logs list to reflect updated status
        endpointMutations?.read?.refetch?.();
      } finally {
        setUpdatingFingerprint(null);
      }
    },
    [user, logger, locale, endpointMutations],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* -- Header -- */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-base mr-auto">
          {t("widget.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
          {activeCount > 0 && (
            <Span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              {activeCount} {t("widget.header.activeCount")}
            </Span>
          )}
          {fingerprintFilter && (
            <Span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground font-mono">
              {fingerprintFilter}
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

      {/* -- Filters -- */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Div className="w-48">
          <SelectFieldWidget fieldName={"status"} field={children.status} />
        </Div>
      </Div>

      {/* -- Loading state -- */}
      {isLoading && (
        <Div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      )}

      {/* -- Card list -- */}
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
              const expandedSection = expandedId?.startsWith(log.id)
                ? expandedId.split(":")[1]
                : undefined;
              const key: "stack" | "meta" | null =
                expandedSection === "stack" || expandedSection === "meta"
                  ? expandedSection
                  : null;
              return (
                <ErrorLogCard
                  key={log.id}
                  log={log}
                  expandedSection={key}
                  onToggle={(section) => handleToggle(log.id, section)}
                  onToggleResolved={handleToggleResolved}
                  isUpdating={updatingFingerprint === log.fingerprint}
                  t={t}
                />
              );
            })
          )}
        </Div>
      )}

      {/* -- Pagination footer -- */}
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
