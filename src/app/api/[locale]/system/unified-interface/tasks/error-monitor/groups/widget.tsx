/**
 * Custom Widget for Error Groups
 * Card list with status badges, occurrence counts, and resolve/reopen actions
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
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
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";

import type endpoints from "./definition";
import type { ErrorGroupsGetResponseOutput } from "./definition";

type ErrorGroup = ErrorGroupsGetResponseOutput["groups"][number];

interface WidgetProps {
  field: {
    value: ErrorGroupsGetResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
}

const LIMIT = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(s: string): string {
  return s.slice(0, 19).replace("T", " ");
}

function truncateMessage(message: string, maxLength: number): string {
  if (message.length <= maxLength) {
    return message;
  }
  return `${message.slice(0, maxLength)}...`;
}

// ---------------------------------------------------------------------------
// ErrorGroupCard
// ---------------------------------------------------------------------------

function ErrorGroupCard({
  group,
  onToggleResolved,
  isUpdating,
  t,
}: {
  group: ErrorGroup;
  onToggleResolved: (fingerprint: string, resolved: boolean) => void;
  isUpdating: boolean;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      <Div className="flex items-start gap-3 p-3">
        {/* Status badge */}
        <Span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5",
            group.resolved
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
          )}
        >
          {group.resolved
            ? t("widget.status.resolved")
            : t("widget.status.active")}
        </Span>

        {/* Message + meta */}
        <Div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <Span className="text-sm font-medium break-words">
            {truncateMessage(group.message, 100)}
          </Span>
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-mono">
            {group.errorType && (
              <Span className="bg-muted px-1 rounded">{group.errorType}</Span>
            )}
            <Span>
              {t("widget.col.occurrences")}:{" "}
              <Span className="font-bold">{group.occurrences}</Span>
            </Span>
            <Span>
              {t("widget.col.firstSeen")}: {formatDate(group.firstSeen)}
            </Span>
            <Span>
              {t("widget.col.lastSeen")}: {formatDate(group.lastSeen)}
            </Span>
          </Div>
        </Div>

        {/* Action button */}
        <Div className="flex items-center gap-1 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isUpdating}
            onClick={() => onToggleResolved(group.fingerprint, !group.resolved)}
            className={cn(
              "h-7 px-2 text-xs gap-1",
              group.resolved
                ? "text-orange-600 hover:text-orange-700 dark:text-orange-400"
                : "text-green-600 hover:text-green-700 dark:text-green-400",
            )}
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : group.resolved ? (
              <RotateCcw className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            {group.resolved
              ? t("widget.action.reopen")
              : t("widget.action.resolve")}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function ErrorGroupsContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();

  const [updatingFingerprint, setUpdatingFingerprint] = useState<string | null>(
    null,
  );

  const value = field.value;
  const totalCount = value?.totalCount ?? 0;
  const groups = value?.groups ?? [];

  const activeCount = groups.filter((g) => !g.resolved).length;

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
        // Refetch the groups list
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
              {activeCount} {t("widget.header.activeGroups")}
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
      <Div className="flex flex-col gap-2 px-4 py-3 border-b">
        <Div className="grid grid-cols-12 gap-2">
          <Div className="col-span-4">
            <SelectFieldWidget fieldName={"status"} field={children.status} />
          </Div>
          <Div className="col-span-4">
            <TextFieldWidget
              fieldName={"errorType"}
              field={children.errorType}
            />
          </Div>
          <Div className="col-span-4">
            <TextFieldWidget fieldName={"search"} field={children.search} />
          </Div>
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
          {groups.length === 0 ? (
            <Div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              <Span className="text-sm text-muted-foreground">
                {t("widget.empty")}
              </Span>
            </Div>
          ) : (
            groups.map((group) => (
              <ErrorGroupCard
                key={group.fingerprint}
                group={group}
                onToggleResolved={handleToggleResolved}
                isUpdating={updatingFingerprint === group.fingerprint}
                t={t}
              />
            ))
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
