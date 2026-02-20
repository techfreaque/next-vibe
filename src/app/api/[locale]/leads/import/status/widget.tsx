/**
 * Import Status Widget
 * Rich UI for monitoring import jobs
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  CheckCircle,
  Clock,
  Loader2,
  Plus,
  RefreshCw,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { Strong } from "next-vibe-ui/ui/strong";
import React from "react";

import {
  CsvImportJobStatus,
  type CsvImportJobStatusValue,
} from "@/app/api/[locale]/leads/import/enum";
import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import type { TFunction } from "@/i18n/core/static-types";

import type definition from "./definition";
import type { ImportJobsStatusGetResponseOutput } from "./definition";

type Job = NonNullable<
  ImportJobsStatusGetResponseOutput["jobs"]
>["items"][number];

interface CustomWidgetProps {
  field: {
    value: ImportJobsStatusGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

type TFunc = TFunction;

// ---------------------------------------------------------------------------
// Status badge config
// ---------------------------------------------------------------------------

const STATUS_ICON_CLASS_MAP: Record<string, string> = {
  [CsvImportJobStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [CsvImportJobStatus.PROCESSING]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [CsvImportJobStatus.COMPLETED]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [CsvImportJobStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
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
  { key: "app.api.leads.import.status.widget.filter.all", value: null },
  {
    key: "app.api.leads.import.status.widget.filter.pending",
    value: CsvImportJobStatus.PENDING,
  },
  {
    key: "app.api.leads.import.status.widget.filter.running",
    value: CsvImportJobStatus.PROCESSING,
  },
  {
    key: "app.api.leads.import.status.widget.filter.completed",
    value: CsvImportJobStatus.COMPLETED,
  },
  {
    key: "app.api.leads.import.status.widget.filter.failed",
    value: CsvImportJobStatus.FAILED,
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return "—";
  }
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return dateStr;
  }
}

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

function ProgressBar({
  processed,
  total,
  t,
}: {
  processed: number;
  total: number | null;
  t: TFunc;
}): React.JSX.Element | null {
  if (!total || total === 0) {
    return null;
  }
  const pct = Math.min(100, Math.round((processed / total) * 100));
  return (
    <Div className="mt-1.5">
      <Div className="flex justify-between text-xs text-muted-foreground mb-0.5">
        <Span>
          {processed} / {total}{" "}
          {t("app.api.leads.import.status.widget.progress.rows")}
        </Span>
        <Span>{pct}%</Span>
      </Div>
      <Div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <Div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "9999px",
            backgroundColor: "#3b82f6",
            transition: "all",
          }}
        />
      </Div>
    </Div>
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

  return (
    <Div
      className="flex flex-col gap-1 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => {
        onViewJob(job.id);
      }}
    >
      <Div className="flex items-center gap-3 flex-wrap">
        {/* Job ID */}
        <Span className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
          {job.id}
        </Span>

        {/* Status badge */}
        <StatusBadge status={job.status} t={t} />

        <Div className="flex items-center gap-4 ml-auto flex-shrink-0">
          {/* Row counts */}
          <Div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Span title="Total rows">
              {t("app.api.leads.import.status.widget.job.total")}{" "}
              <Strong className="text-foreground">
                {job.totalRows ?? "?"}
              </Strong>
            </Span>
            <Span
              title="Processed rows"
              className="text-blue-600 dark:text-blue-400"
            >
              {t("app.api.leads.import.status.widget.job.processed")}{" "}
              <Strong>{job.processedRows}</Strong>
            </Span>
            <Span
              title="Successful imports"
              className="text-green-600 dark:text-green-400"
            >
              {t("app.api.leads.import.status.widget.job.ok")}{" "}
              <Strong>{job.successfulImports}</Strong>
            </Span>
            <Span
              title="Failed imports"
              className="text-red-600 dark:text-red-400"
            >
              {t("app.api.leads.import.status.widget.job.fail")}{" "}
              <Strong>{job.failedImports}</Strong>
            </Span>
          </Div>

          {/* Timestamps */}
          <Div className="hidden sm:flex flex-col text-xs text-muted-foreground text-right">
            <Span>
              {t("app.api.leads.import.status.widget.job.created")}{" "}
              {formatDate(job.createdAt)}
            </Span>
            {job.completedAt && (
              <Span>
                {t("app.api.leads.import.status.widget.job.done")}{" "}
                {formatDate(job.completedAt)}
              </Span>
            )}
          </Div>
        </Div>
      </Div>

      {/* Progress bar for running jobs */}
      {isRunning && (
        <ProgressBar
          processed={job.processedRows}
          total={job.totalRows}
          t={t}
        />
      )}

      {/* Error message */}
      {job.error && (
        <Span className="text-xs text-red-600 dark:text-red-400 mt-0.5">
          {job.error}
        </Span>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function ImportStatusContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();

  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();

  const isLoading = endpointMutations?.read?.isLoading;

  const activeFilter: string | null = form?.watch("filters.status") ?? null;

  const allJobs: Job[] = data?.jobs?.items ?? [];

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  const handleViewJob = (jobId: string): void => {
    router.push(`/${locale}/admin/leads/import?jobId=${jobId}`);
  };

  const handleNewImport = (): void => {
    router.push(`/${locale}/admin/leads/import`);
  };

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.import.status.widget.header.title")}
          </Span>
          {allJobs.length > 0 && (
            <Span className="text-xs text-muted-foreground">
              ({allJobs.length})
            </Span>
          )}
        </Div>

        {/* Refresh button */}
        <NavigateButtonWidget field={children.submitButton} />

        {/* New Import button */}
        <Button
          size="sm"
          variant="default"
          className="gap-1.5"
          onClick={handleNewImport}
        >
          <Plus className="h-4 w-4" />
          {t("app.api.leads.import.status.widget.header.newImport")}
        </Button>
      </Div>

      {/* Status filter chips */}
      <Div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTER_VALUES.map((tab) => (
          <Button
            key={String(tab.value)}
            variant="ghost"
            size="sm"
            onClick={() => {
              form?.setValue("filters.status", tab.value ?? undefined);
              if (onSubmit) {
                onSubmit();
              }
            }}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              activeFilter === tab.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:border-border",
            )}
          >
            {t(tab.key)}
            {tab.value !== null && (
              <Span className="ml-1 opacity-70">
                ({allJobs.filter((j) => j.status === tab.value).length})
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
            {t("app.api.leads.import.status.widget.loading")}
          </Span>
        </Div>
      )}

      {/* Job list */}
      {!isLoading && (
        <Div className="rounded-lg border overflow-hidden divide-y">
          {allJobs.length === 0 ? (
            <Div className="flex flex-col items-center justify-center gap-3 py-10 text-center px-4">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
              <Div>
                <Span className="block text-sm font-medium">
                  {t("app.api.leads.import.status.widget.empty.title")}
                </Span>
                <Span className="block text-xs text-muted-foreground mt-1">
                  {activeFilter !== null
                    ? t("app.api.leads.import.status.widget.empty.withFilter")
                    : t(
                        "app.api.leads.import.status.widget.empty.withoutFilter",
                      )}
                </Span>
              </Div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleNewImport}
              >
                <Plus className="h-4 w-4" />
                {t("app.api.leads.import.status.widget.empty.newImport")}
              </Button>
            </Div>
          ) : (
            allJobs.map((job) => (
              <JobRow key={job.id} job={job} onViewJob={handleViewJob} t={t} />
            ))
          )}
        </Div>
      )}
    </Div>
  );
}
