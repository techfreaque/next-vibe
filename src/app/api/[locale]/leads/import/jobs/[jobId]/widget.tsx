/**
 * Import Job Widget
 * Rich UI for monitoring import job status, retrying, and stopping jobs
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { List } from "next-vibe-ui/ui/icons/List";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { CsvImportJobStatus } from "@/app/api/[locale]/leads/import/enum";
import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";

import type definition from "./definition";
import type retryDefinition from "./retry/definition";
import type stopDefinition from "./stop/definition";

// ============================================================
// ImportJobStatusContainer (for GET)
// ============================================================

interface ImportJobStatusWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function ImportJobStatusContainer({
  field,
}: ImportJobStatusWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.GET>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const isLoading = endpointMutations?.read?.isLoading;

  const job = data?.job;
  const info = job?.info;
  const jobId = info?.id;

  const handleStop = useCallback((): void => {
    if (!jobId) {
      return;
    }
    void (async (): Promise<void> => {
      const stopDef = await import("./stop/definition");
      navigate(stopDef.default.POST, { urlPathParams: { jobId } });
    })();
  }, [navigate, jobId]);

  const handleRetry = useCallback((): void => {
    if (!jobId) {
      return;
    }
    void (async (): Promise<void> => {
      const retryDef = await import("./retry/definition");
      navigate(retryDef.default.POST, { urlPathParams: { jobId } });
    })();
  }, [navigate, jobId]);

  const handleViewLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  const progress = job?.progress;
  const configuration = job?.configuration;
  const timestamps = job?.timestamps;

  const progressPercent =
    progress?.totalRows && progress.totalRows > 0
      ? Math.round((progress.processedRows / progress.totalRows) * 100)
      : null;

  const statusColorMap: Record<string, string> = {
    [CsvImportJobStatus.PENDING]: "bg-warning/10 text-warning",
    [CsvImportJobStatus.PROCESSING]: "bg-info/10 text-info",
    [CsvImportJobStatus.COMPLETED]: "bg-success/10 text-success",
    [CsvImportJobStatus.FAILED]: "bg-destructive/10 text-destructive",
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
              isRunning && "animate-spin text-primary",
            )}
          />
          <Span className="font-semibold text-base">
            {t("widget.status.title")}
          </Span>
          {info?.fileName && (
            <Span className="text-sm text-muted-foreground">
              - {info.fileName}
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
              {t("get.actions.retry")}
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
              {t("get.actions.stop")}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewLeads}
            className="gap-1.5"
          >
            <List className="h-4 w-4" />
            {t("get.actions.viewLeads")}
          </Button>
        </Div>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.status.loadingJobStatus")}
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
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                {info?.status === CsvImportJobStatus.FAILED && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                {info?.status === CsvImportJobStatus.PROCESSING && (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
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
                    ? t(`widget.status.jobStatus.${info.status}`)
                    : "—"}
                </Span>
              </Div>
              <Span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                {info?.id}
              </Span>
            </Div>
            {configuration?.error && (
              <Div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <Span className="text-xs text-destructive">
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
                  {t("widget.status.totalRows")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums">
                  {progress.processedRows}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("widget.status.processed")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums text-success">
                  {progress.successfulImports}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("widget.status.imported")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums text-destructive">
                  {progress.failedImports}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("widget.status.failed")}
                </Span>
              </Div>
              <Div className="rounded-lg border bg-card p-4 text-center">
                <Span className="block text-2xl font-bold tabular-nums text-warning">
                  {progress.duplicateEmails}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("widget.status.duplicates")}
                </Span>
              </Div>
            </Div>
          )}

          {/* Progress bar */}
          {progressPercent !== null && (
            <Div className="rounded-lg border bg-card p-4">
              <Div className="flex justify-between text-xs text-muted-foreground mb-2">
                <Span>{t("widget.status.progress")}</Span>
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
                    {t("widget.status.configurationTitle")}
                  </Span>
                  <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <Span className="text-muted-foreground">
                      {t("widget.status.batchSize")}
                    </Span>
                    <Span className="tabular-nums">
                      {configuration.batchSize}
                    </Span>
                    <Span className="text-muted-foreground">
                      {t("widget.status.batchStart")}
                    </Span>
                    <Span className="tabular-nums">
                      {configuration.currentBatchStart}
                    </Span>
                    <Span className="text-muted-foreground">
                      {t("widget.status.retries")}
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
                    {t("widget.status.timestampsTitle")}
                  </Span>
                  <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <Span className="text-muted-foreground">
                      {t("widget.status.created")}
                    </Span>
                    <Span>{timestamps.createdAt ?? "—"}</Span>
                    <Span className="text-muted-foreground">
                      {t("widget.status.started")}
                    </Span>
                    <Span>{timestamps.startedAt ?? "—"}</Span>
                    <Span className="text-muted-foreground">
                      {t("widget.status.completed")}
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

interface ImportJobRetryWidgetProps {
  field: (typeof retryDefinition.POST)["fields"];
}

export function ImportJobRetryContainer({
  field,
}: ImportJobRetryWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof retryDefinition.POST>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const result = data?.result;
  const jobId = data?.result
    ? (field as { urlPathParams?: { jobId?: string } }).urlPathParams?.jobId
    : undefined;

  const handleViewJob = useCallback((): void => {
    if (!jobId) {
      return;
    }
    void (async (): Promise<void> => {
      const jobDef = await import("./definition");
      navigate(jobDef.default.GET, { urlPathParams: { jobId } });
    })();
  }, [navigate, jobId]);

  const handleViewLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("widget.retry.title")}
          </Span>
        </Div>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.retry.loadingRetrying")}
          </Span>
        </Div>
      )}

      {/* Retry result */}
      {result && !isLoading && (
        <Div
          className={cn(
            "rounded-lg border p-4 flex items-start gap-3",
            result.success
              ? "border-success/30 bg-success/10"
              : "border-destructive/30 bg-destructive/10",
          )}
        >
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          )}
          <Div>
            <Span
              className={cn(
                "font-medium text-sm block",
                result.success ? "text-success-foreground" : "text-destructive",
              )}
            >
              {result.success
                ? t("widget.retry.successMessage")
                : t("widget.retry.failureMessage")}
            </Span>
            {result.message && (
              <Span
                className={cn(
                  "text-xs",
                  result.success ? "text-success" : "text-destructive",
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
                  {t("widget.retry.viewJobStatus")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewLeads}
                  className="gap-1.5 text-xs"
                >
                  <List className="h-3.5 w-3.5" />
                  {t("widget.retry.viewLeads")}
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

interface ImportJobStopWidgetProps {
  field: (typeof stopDefinition.POST)["fields"];
}

export function ImportJobStopContainer({
  field,
}: ImportJobStopWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof stopDefinition.POST>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const result = data?.result;

  const handleViewLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  const handleStartNewImport = useCallback((): void => {
    void (async (): Promise<void> => {
      const importDef =
        await import("@/app/api/[locale]/leads/import/definition");
      navigate(importDef.default.POST);
    })();
  }, [navigate]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <XCircle className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("widget.stop.title")}
          </Span>
        </Div>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.stop.loadingStopping")}
          </Span>
        </Div>
      )}

      {/* Stop result */}
      {result && !isLoading && (
        <Div
          className={cn(
            "rounded-lg border p-4 flex items-start gap-3",
            result.success
              ? "border-success/30 bg-success/10"
              : "border-destructive/30 bg-destructive/10",
          )}
        >
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          )}
          <Div>
            <Span
              className={cn(
                "font-medium text-sm block",
                result.success ? "text-success-foreground" : "text-destructive",
              )}
            >
              {result.success
                ? t("widget.stop.successMessage")
                : t("widget.stop.failureMessage")}
            </Span>
            {result.message && (
              <Span
                className={cn(
                  "text-xs",
                  result.success ? "text-success" : "text-destructive",
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
                  {t("widget.stop.viewLeads")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartNewImport}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t("widget.stop.startNewImport")}
                </Button>
              </Div>
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}
