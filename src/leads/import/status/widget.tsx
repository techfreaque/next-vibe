/**
 * Import Status Widget
 * Rich UI for monitoring import jobs
 */

"use client";
import { formatTimestamp } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { ListItem } from "next-vibe/ui/components/list-item";
import { ProgressBlock } from "next-vibe/ui/components/progress-block";
import { Span } from "next-vibe/ui/components/span";
import { Strong } from "next-vibe/ui/components/strong";
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
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React from "react";

import { CsvImportJobStatus, type CsvImportJobStatusValue } from "../enum";
import type definition from "./definition";
import type { ImportJobsStatusGetResponseOutput } from "./definition";

type Job = NonNullable<
  ImportJobsStatusGetResponseOutput["jobs"]
>["items"][number];

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type TFunc = ReturnType<typeof useWidgetTranslation>;

// ---------------------------------------------------------------------------
// Status badge config
// ---------------------------------------------------------------------------

const STATUS_ICON_CLASS_MAP: Record<string, string> = {
  [CsvImportJobStatus.PENDING]: "bg-warning/10 text-warning",
  [CsvImportJobStatus.PROCESSING]: "bg-info/10 text-info",
  [CsvImportJobStatus.COMPLETED]: "bg-success/10 text-success",
  [CsvImportJobStatus.FAILED]: "bg-destructive/10 text-destructive",
};

function getStatusIcon(
  status: typeof CsvImportJobStatusValue,
): React.JSX.Element | null {
  if (status === CsvImportJobStatus.PENDING) {
    return <Clock className="h-3 w-3" />;
  }
  if (status === CsvImportJobStatus.PROCESSING) {
    return <Loader2 className="h-3 w-3 animate-spin" />;
  }
  if (status === CsvImportJobStatus.COMPLETED) {
    return <CheckCircle className="h-3 w-3" />;
  }
  if (status === CsvImportJobStatus.FAILED) {
    return <XCircle className="h-3 w-3" />;
  }
  return null;
}

const STATUS_FILTER_VALUES = [
  { key: "widget.filter.all", value: null },
  {
    key: "widget.filter.pending",
    value: CsvImportJobStatus.PENDING,
  },
  {
    key: "widget.filter.running",
    value: CsvImportJobStatus.PROCESSING,
  },
  {
    key: "widget.filter.completed",
    value: CsvImportJobStatus.COMPLETED,
  },
  {
    key: "widget.filter.failed",
    value: CsvImportJobStatus.FAILED,
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StatusBadge({
  status,
  t,
}: {
  status: typeof CsvImportJobStatusValue;
  t: TFunc;
}): React.JSX.Element {
  const className =
    STATUS_ICON_CLASS_MAP[status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  const icon = getStatusIcon(status);
  const label = t(status);
  return (
    <Span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        className,
      )}
    >
      {icon}
      {label}
    </Span>
  );
}

// ---------------------------------------------------------------------------
// Job row
// ---------------------------------------------------------------------------

function JobRow({
  job,
  onViewJob,
  t,
}: {
  job: Job;
  onViewJob: (jobId: string) => void;
  t: TFunc;
}): React.JSX.Element {
  const isRunning = job.status === CsvImportJobStatus.PROCESSING;
  const locale = useWidgetLocale();

  return (
    <ListItem
      title={job.fileName}
      badges={<StatusBadge status={job.status} t={t} />}
      className="min-h-14 bg-card"
      onClick={() => onViewJob(job.id)}
      meta={
        <Div className="flex w-full min-w-0 flex-col gap-2">
          {/* Row counts */}
          <Div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Span>
              {t("widget.job.total")}{" "}
              <Strong className="text-foreground">
                {job.totalRows ?? "?"}
              </Strong>
            </Span>
            <Span className="text-info">
              {t("widget.job.processed")} <Strong>{job.processedRows}</Strong>
            </Span>
            <Span className="text-success">
              {t("widget.job.ok")} <Strong>{job.successfulImports}</Strong>
            </Span>
            <Span className="text-destructive">
              {t("widget.job.fail")} <Strong>{job.failedImports}</Strong>
            </Span>
          </Div>

          {/* Timestamps */}
          <Div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Span>
              {t("widget.job.created")} {formatTimestamp(job.createdAt, locale)}
            </Span>
            {job.completedAt && (
              <Span>
                {t("widget.job.done")}{" "}
                {formatTimestamp(job.completedAt, locale)}
              </Span>
            )}
          </Div>
          {isRunning && job.totalRows && (
            <ProgressBlock
              value={job.processedRows}
              max={job.totalRows}
              label={`${job.processedRows.toLocaleString(locale)} / ${job.totalRows.toLocaleString(locale)} ${t("widget.progress.rows")}`}
            />
          )}
          {job.error && (
            <Span className="text-xs text-destructive">{job.error}</Span>
          )}
        </Div>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function ImportStatusContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.GET>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();

  const isLoading = endpointMutations?.read?.isLoading;

  const activeFilter: typeof CsvImportJobStatusValue | null =
    form.watch("filters.status") ?? null;

  const allJobs: Job[] = data?.jobs?.items ?? [];
  const onPick = usePickerCallback<Job>();

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  const handleViewJob = (jobId: string): void => {
    if (onPick) {
      const job = allJobs.find((item) => item.id === jobId);
      if (job) {
        onPick(job);
      }
      return;
    }

    void (async (): Promise<void> => {
      const jobDef = await import("@/leads/import/jobs/[jobId]/definition");
      navigate(jobDef.default.GET, { urlPathParams: { jobId } });
    })();
  };

  const handleNewImport = (): void => {
    void (async (): Promise<void> => {
      const importDef = await import("../definition");
      navigate(importDef.default.POST);
    })();
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("widget.header.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <Div className="flex flex-wrap gap-2">
            <SubmitButtonWidget field={children.submitButton} />
            <Button
              type="button"
              size="sm"
              className="min-h-10 gap-1.5"
              onClick={handleNewImport}
            >
              <Plus className="size-4" />
              {t("widget.header.newImport")}
            </Button>
          </Div>
        }
      />

      {/* Status filter chips */}
      <Div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTER_VALUES.map((tab) => (
          <Button
            key={String(tab.value)}
            variant="ghost"
            size="sm"
            onClick={() => {
              form.setValue("filters.status", tab.value ?? undefined, {
                shouldDirty: true,
              });
              if (onSubmit) {
                onSubmit();
              }
            }}
            className={cn(
              "min-h-10 px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              activeFilter === tab.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:border-border",
            )}
          >
            {t(tab.key)}
            {tab.value !== null && (
              <Span className="ml-1 opacity-70">
                ({data?.jobs?.statusCounts?.[tab.value] ?? 0})
              </Span>
            )}
          </Button>
        ))}
      </Div>

      {/* Loading */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.loading")}
          </Span>
        </Div>
      )}

      {/* Job list */}
      {!isLoading && (
        <Div className="grid gap-2">
          {allJobs.length === 0 ? (
            <Div className="flex flex-col items-center justify-center gap-3 py-10 text-center px-4">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
              <Div>
                <Span className="block text-sm font-medium">
                  {t("widget.empty.title")}
                </Span>
                <Span className="block text-xs text-muted-foreground mt-1">
                  {activeFilter !== null
                    ? t("widget.empty.withFilter")
                    : t("widget.empty.withoutFilter")}
                </Span>
              </Div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleNewImport}
              >
                <Plus className="h-4 w-4" />
                {t("widget.empty.newImport")}
              </Button>
            </Div>
          ) : (
            allJobs.map((job) => (
              <JobRow key={job.id} job={job} onViewJob={handleViewJob} t={t} />
            ))
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
