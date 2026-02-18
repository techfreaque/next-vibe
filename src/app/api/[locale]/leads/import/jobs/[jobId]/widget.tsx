/**
 * Import Job Widget
 * Rich UI for monitoring import job status, retrying, and stopping jobs
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  List,
  Loader2,
  RefreshCw,
  RotateCcw,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { CsvImportJobStatus } from "@/app/api/[locale]/leads/import/enum";
import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";
import type retryDefinition from "./retry/definition";
import type stopDefinition from "./stop/definition";

// ============================================================
// ImportJobStatusContainer (for GET)
// ============================================================

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface ImportJobStatusWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

export function ImportJobStatusContainer({
  field,
}: ImportJobStatusWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();
  const isLoading = endpointMutations?.read?.isLoading;

  const job = data?.job;
  const info = job?.info;
  const jobId = info?.id;

  const handleStop = useCallback((): void => {
    if (!jobId) {
      return;
    }
    router.push(`/${locale}/admin/leads/import?jobId=${jobId}&action=stop`);
  }, [router, locale, jobId]);

  const handleRetry = useCallback((): void => {
    if (!jobId) {
      return;
    }
    router.push(`/${locale}/admin/leads/import?jobId=${jobId}&action=retry`);
  }, [router, locale, jobId]);

  const handleViewLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const progress = job?.progress;
  const configuration = job?.configuration;
  const timestamps = job?.timestamps;

  const progressPercent =
    progress?.totalRows && progress.totalRows > 0
      ? Math.round((progress.processedRows / progress.totalRows) * 100)
      : null;

  const statusColorMap: Record<string, string> = {
    [CsvImportJobStatus.PENDING]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [CsvImportJobStatus.PROCESSING]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [CsvImportJobStatus.COMPLETED]:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [CsvImportJobStatus.FAILED]:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  const statusColor = info?.status
    ? (statusColorMap[info.status] ??
      statusColorMap[CsvImportJobStatus.PENDING])
    : "";
  const isRunning = info?.status === CsvImportJobStatus.PROCESSING;
  const isFailed = info?.status === CsvImportJobStatus.FAILED;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Loader2
            className={cn(
              "h-5 w-5 text-muted-foreground",
              isRunning && "animate-spin text-blue-500",
            )}
          />
          <Span className="font-semibold text-base">
            {t("app.api.leads.import.jobs.widget.status.title")}
          </Span>
          {info?.fileName && (
            <Span className="text-sm text-muted-foreground">
              — {info.fileName}
            </Span>
          )}
        </Div>
        {/* Action buttons on the right */}
        <Div className="flex items-center gap-2">
          {isFailed && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              {t("app.api.leads.import.jobs.jobId.get.actions.retry")}
            </Button>
          )}
          {isRunning && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleStop}
              className="gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              {t("app.api.leads.import.jobs.jobId.get.actions.stop")}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewLeads}
            className="gap-1.5"
          >
            <List className="h-4 w-4" />
            {t("app.api.leads.import.jobs.jobId.get.actions.viewLeads")}
          </Button>
        </Div>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("app.api.leads.import.jobs.widget.status.loadingJobStatus")}
          </Span>
        </Div>
      )}

      {/* Job status content */}
      {data && !isLoading && (
        <>
          {/* Status badge + basic info */}
          <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
            <Div className="flex items-center justify-between">
              <Div className="flex items-center gap-2">
                {info?.status === CsvImportJobStatus.COMPLETED && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {info?.status === CsvImportJobStatus.FAILED && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {info?.status === CsvImportJobStatus.PROCESSING && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {info?.status === CsvImportJobStatus.PENDING && (
                  <Clock className="h-5 w-5 text-muted-foreground" />
                )}
                <Span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    statusColor,
                  )}
                >
                  {info?.status
                    ? t(
                        `app.api.leads.import.jobs.widget.status.jobStatus.${info.status}`,
                      )
                    : "—"}
                </Span>
              </Div>
              <Span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                {info?.id}
              </Span>
            </Div>
            {configuration?.error && (
              <Div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 px-3 py-2 flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <Span className="text-xs text-red-700 dark:text-red-300">
                  {configuration.error}
                </Span>
              </Div>
            )}
          </Div>

          {/* Progress stats */}
          {progress && (
            <Div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums">
                  {progress.totalRows ?? "—"}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.import.jobs.widget.status.totalRows")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums">
                  {progress.processedRows}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.import.jobs.widget.status.processed")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
                  {progress.successfulImports}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.import.jobs.widget.status.imported")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                  {progress.failedImports}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.import.jobs.widget.status.failed")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums text-yellow-600 dark:text-yellow-400">
                  {progress.duplicateEmails}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.import.jobs.widget.status.duplicates")}
                </Span>
              </Div>
            </Div>
          )}

          {/* Progress bar */}
          {progressPercent !== null && (
            <Div className="rounded-lg border bg-card p-4">
              <Div className="flex justify-between text-xs text-muted-foreground mb-2">
                <Span>
                  {t("app.api.leads.import.jobs.widget.status.progress")}
                </Span>
                <Span>{progressPercent}%</Span>
              </Div>
              <Div className="h-2 bg-muted rounded-full overflow-hidden">
                <Div
                  style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    borderRadius: "9999px",
                    transition: "width 0.3s ease",
                    backgroundColor:
                      progressPercent >= 90
                        ? "#22c55e"
                        : progressPercent >= 50
                          ? "#3b82f6"
                          : "#eab308",
                  }}
                />
              </Div>
            </Div>
          )}

          {/* Configuration + timestamps */}
          {(configuration || timestamps) && (
            <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {configuration && (
                <Div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
                  <Span className="text-sm font-semibold">
                    {t(
                      "app.api.leads.import.jobs.widget.status.configurationTitle",
                    )}
                  </Span>
                  <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <Span className="text-muted-foreground">
                      {t("app.api.leads.import.jobs.widget.status.batchSize")}
                    </Span>
                    <Span className="tabular-nums">
                      {configuration.batchSize}
                    </Span>
                    <Span className="text-muted-foreground">
                      {t("app.api.leads.import.jobs.widget.status.batchStart")}
                    </Span>
                    <Span className="tabular-nums">
                      {configuration.currentBatchStart}
                    </Span>
                    <Span className="text-muted-foreground">
                      {t("app.api.leads.import.jobs.widget.status.retries")}
                    </Span>
                    <Span className="tabular-nums">
                      {configuration.retryCount} / {configuration.maxRetries}
                    </Span>
                  </Div>
                </Div>
              )}
              {timestamps && (
                <Div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
                  <Span className="text-sm font-semibold">
                    {t(
                      "app.api.leads.import.jobs.widget.status.timestampsTitle",
                    )}
                  </Span>
                  <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <Span className="text-muted-foreground">
                      {t("app.api.leads.import.jobs.widget.status.created")}
                    </Span>
                    <Span>{timestamps.createdAt ?? "—"}</Span>
                    <Span className="text-muted-foreground">
                      {t("app.api.leads.import.jobs.widget.status.started")}
                    </Span>
                    <Span>{timestamps.startedAt ?? "—"}</Span>
                    <Span className="text-muted-foreground">
                      {t("app.api.leads.import.jobs.widget.status.completed")}
                    </Span>
                    <Span>{timestamps.completedAt ?? "—"}</Span>
                  </Div>
                </Div>
              )}
            </Div>
          )}
        </>
      )}
    </Div>
  );
}

// ============================================================
// ImportJobRetryContainer (for POST retry)
// ============================================================

type RetryResponseOutput = typeof retryDefinition.POST.types.ResponseOutput;

interface ImportJobRetryWidgetProps {
  field: {
    value: RetryResponseOutput | null | undefined;
  } & (typeof retryDefinition.POST)["fields"];
  fieldName: string;
}

export function ImportJobRetryContainer({
  field,
}: ImportJobRetryWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const result = data?.result;
  const jobId = data?.result
    ? (field as { urlPathParams?: { jobId?: string } }).urlPathParams?.jobId
    : undefined;

  const handleViewJob = useCallback((): void => {
    if (!jobId) {
      return;
    }
    router.push(`/${locale}/admin/leads/import?jobId=${jobId}`);
  }, [router, locale, jobId]);

  const handleViewLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.import.jobs.widget.retry.title")}
          </Span>
        </Div>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("app.api.leads.import.jobs.widget.retry.loadingRetrying")}
          </Span>
        </Div>
      )}

      {/* Retry result */}
      {result && !isLoading && (
        <Div
          className={cn(
            "rounded-lg border p-4 flex items-start gap-3",
            result.success
              ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
              : "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800",
          )}
        >
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <Div>
            <Span
              className={cn(
                "font-medium text-sm block",
                result.success
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300",
              )}
            >
              {result.success
                ? t("app.api.leads.import.jobs.widget.retry.successMessage")
                : t("app.api.leads.import.jobs.widget.retry.failureMessage")}
            </Span>
            {result.message && (
              <Span
                className={cn(
                  "text-xs",
                  result.success
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {result.message}
              </Span>
            )}
            {result.success && (
              <Div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewJob}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t("app.api.leads.import.jobs.widget.retry.viewJobStatus")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewLeads}
                  className="gap-1.5 text-xs"
                >
                  <List className="h-3.5 w-3.5" />
                  {t("app.api.leads.import.jobs.widget.retry.viewLeads")}
                </Button>
              </Div>
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ============================================================
// ImportJobStopContainer (for POST stop)
// ============================================================

type StopResponseOutput = typeof stopDefinition.POST.types.ResponseOutput;

interface ImportJobStopWidgetProps {
  field: {
    value: StopResponseOutput | null | undefined;
  } & (typeof stopDefinition.POST)["fields"];
  fieldName: string;
}

export function ImportJobStopContainer({
  field,
}: ImportJobStopWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const result = data?.result;

  const handleViewLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const handleStartNewImport = useCallback((): void => {
    router.push(`/${locale}/admin/leads/import`);
  }, [router, locale]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <XCircle className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.import.jobs.widget.stop.title")}
          </Span>
        </Div>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("app.api.leads.import.jobs.widget.stop.loadingStopping")}
          </Span>
        </Div>
      )}

      {/* Stop result */}
      {result && !isLoading && (
        <Div
          className={cn(
            "rounded-lg border p-4 flex items-start gap-3",
            result.success
              ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
              : "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800",
          )}
        >
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <Div>
            <Span
              className={cn(
                "font-medium text-sm block",
                result.success
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300",
              )}
            >
              {result.success
                ? t("app.api.leads.import.jobs.widget.stop.successMessage")
                : t("app.api.leads.import.jobs.widget.stop.failureMessage")}
            </Span>
            {result.message && (
              <Span
                className={cn(
                  "text-xs",
                  result.success
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {result.message}
              </Span>
            )}
            {result.success && (
              <Div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewLeads}
                  className="gap-1.5 text-xs"
                >
                  <List className="h-3.5 w-3.5" />
                  {t("app.api.leads.import.jobs.widget.stop.viewLeads")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartNewImport}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t("app.api.leads.import.jobs.widget.stop.startNewImport")}
                </Button>
              </Div>
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}
