"use client";

import { Button } from "next-vibe/ui/ui/button";
import { DetailField } from "next-vibe/ui/ui/detail-grid";
import { Div } from "next-vibe/ui/ui/div";
import { AlertCircle } from "next-vibe/ui/ui/icons/AlertCircle";
import { CheckCircle } from "next-vibe/ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe/ui/ui/icons/Clock";
import { List } from "next-vibe/ui/ui/icons/List";
import { Loader2 } from "next-vibe/ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe/ui/ui/icons/RefreshCw";
import { RotateCcw } from "next-vibe/ui/ui/icons/RotateCcw";
import { XCircle } from "next-vibe/ui/ui/icons/XCircle";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { MetricCard } from "next-vibe/ui/ui/metric-card";
import { MetricGrid } from "next-vibe/ui/ui/metric-grid";
import { ProgressBlock } from "next-vibe/ui/ui/progress-block";
import { ResultBanner } from "next-vibe/ui/ui/result-banner";
import { SectionGroup } from "next-vibe/ui/ui/section-group";
import { StatusPill } from "next-vibe/ui/ui/status-pill";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/interactive/navigate-button/widget";
import React, { useCallback } from "react";

import { CsvImportJobStatus } from "@/leads/import/enum";

import type definition from "./definition";
import type retryDefinition from "./retry/definition";
import type stopDefinition from "./stop/definition";

// ─── Status mapping ──────────────────────────────────────────────────────────

type PillVariant = "default" | "success" | "warning" | "danger" | "info";

const STATUS_VARIANT: Record<string, PillVariant> = {
  [CsvImportJobStatus.PENDING]: "warning",
  [CsvImportJobStatus.PROCESSING]: "info",
  [CsvImportJobStatus.COMPLETED]: "success",
  [CsvImportJobStatus.FAILED]: "danger",
};

function formatTimestamp(value: Date | null | undefined): string {
  if (!value) {
    return "—";
  }
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value.toISOString();
  }
}

function StatusIcon({ status }: { status: string }): React.JSX.Element | null {
  switch (status) {
    case CsvImportJobStatus.COMPLETED:
      return <CheckCircle className="h-5 w-5 text-success" />;
    case CsvImportJobStatus.FAILED:
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case CsvImportJobStatus.PROCESSING:
      return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    case CsvImportJobStatus.PENDING:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
    default:
      return null;
  }
}

function progressVariant(pct: number): "success" | "default" | "warning" {
  if (pct >= 90) {
    return "success";
  }
  if (pct >= 50) {
    return "default";
  }
  return "warning";
}

// ─── GET: Import Job Status ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ImportJobStatusContainer(_props: {
  field: (typeof definition.GET)["fields"];
}): React.JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const isLoading = endpointMutations?.read?.isLoading;

  const job = data?.job;
  const info = job?.info;
  const jobId = info?.id;
  const progress = job?.progress;
  const configuration = job?.configuration;
  const timestamps = job?.timestamps;

  const isRunning = info?.status === CsvImportJobStatus.PROCESSING;
  const isFailed = info?.status === CsvImportJobStatus.FAILED;

  const progressPct =
    progress?.totalRows && progress.totalRows > 0
      ? Math.round((progress.processedRows / progress.totalRows) * 100)
      : null;

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleStop = useCallback((): void => {
    if (!jobId) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./stop/definition");
      navigate(def.default.POST, { urlPathParams: { jobId } });
    })();
  }, [navigate, jobId]);

  const handleRetry = useCallback((): void => {
    if (!jobId) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./retry/definition");
      navigate(def.default.POST, { urlPathParams: { jobId } });
    })();
  }, [navigate, jobId]);

  const handleViewLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("@/leads/list/definition");
      navigate(def.default.GET);
    })();
  }, [navigate]);

  // ── Header actions ────────────────────────────────────────────────────────

  const headerActions = (
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
  );

  return (
    <WidgetShell>
      <FormAlertWidget field={{}} />

      <WidgetHeader
        title={
          info?.fileName
            ? `${t("widget.status.title")} - ${info.fileName}`
            : t("widget.status.title")
        }
        backButton={
          <NavigateButtonWidget field={_props.field.children.backButton} />
        }
        actions={headerActions}
      />

      {isLoading ? (
        <LoadingBlock message={t("widget.status.loadingJobStatus")} />
      ) : !data ? null : (
        <>
          {/* Status + Job ID */}
          <Div className="flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2">
              {info?.status ? <StatusIcon status={info.status} /> : null}
              {info?.status ? (
                <StatusPill
                  status={t(`widget.status.jobStatus.${info.status}`)}
                  variant={STATUS_VARIANT[info.status] ?? "default"}
                />
              ) : null}
            </Div>
            {info?.id ? (
              <DetailField
                label={t("widget.status.jobId")}
                value={info.id}
                mono
                copyable
                className="items-end"
              />
            ) : null}
          </Div>

          {/* Error message */}
          {configuration?.error ? (
            <ResultBanner
              variant="danger"
              icon={<XCircle className="h-4 w-4" />}
              title={configuration.error}
            />
          ) : null}

          {/* Progress counters */}
          {progress ? (
            <MetricGrid columns={3}>
              <MetricCard
                label={t("widget.status.totalRows")}
                value={progress.totalRows ?? 0}
              />
              <MetricCard
                label={t("widget.status.processed")}
                value={progress.processedRows}
              />
              <MetricCard
                label={t("widget.status.imported")}
                value={progress.successfulImports}
                variant="success"
              />
              <MetricCard
                label={t("widget.status.failed")}
                value={progress.failedImports}
                variant={progress.failedImports > 0 ? "danger" : "default"}
              />
              <MetricCard
                label={t("widget.status.duplicates")}
                value={progress.duplicateEmails}
                variant={progress.duplicateEmails > 0 ? "warning" : "default"}
              />
            </MetricGrid>
          ) : null}

          {/* Progress bar */}
          {progressPct !== null ? (
            <ProgressBlock
              value={progressPct}
              label={t("widget.status.progress")}
              variant={progressVariant(progressPct)}
            />
          ) : null}

          {/* Configuration + Timestamps */}
          <Div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
            {configuration ? (
              <SectionGroup title={t("widget.status.configurationTitle")}>
                <DetailField
                  label={t("widget.status.batchSize")}
                  value={configuration.batchSize}
                  mono
                />
                <DetailField
                  label={t("widget.status.batchStart")}
                  value={configuration.currentBatchStart}
                  mono
                />
                <DetailField
                  label={t("widget.status.retries")}
                  value={`${configuration.retryCount} / ${configuration.maxRetries}`}
                  mono
                />
              </SectionGroup>
            ) : null}
            {timestamps ? (
              <SectionGroup title={t("widget.status.timestampsTitle")}>
                <DetailField
                  label={t("widget.status.created")}
                  value={formatTimestamp(timestamps.createdAt)}
                />
                <DetailField
                  label={t("widget.status.started")}
                  value={formatTimestamp(timestamps.startedAt)}
                />
                <DetailField
                  label={t("widget.status.completed")}
                  value={formatTimestamp(timestamps.completedAt)}
                />
              </SectionGroup>
            ) : null}
          </Div>
        </>
      )}
    </WidgetShell>
  );
}

// ─── POST: Retry Job ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ImportJobRetryContainer(_props: {
  field: (typeof retryDefinition.POST)["fields"];
}): React.JSX.Element {
  const data = useWidgetValue<typeof retryDefinition.POST>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const result = data?.result;
  const jobId = data?.result
    ? (_props.field as { urlPathParams?: { jobId?: string } }).urlPathParams
        ?.jobId
    : undefined;

  const handleViewJob = useCallback((): void => {
    if (!jobId) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.GET, { urlPathParams: { jobId } });
    })();
  }, [navigate, jobId]);

  const handleViewLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("@/leads/list/definition");
      navigate(def.default.GET);
    })();
  }, [navigate]);

  return (
    <WidgetShell>
      <FormAlertWidget field={{}} />

      <WidgetHeader
        title={t("widget.retry.title")}
        backButton={
          <NavigateButtonWidget field={_props.field.children.backButton} />
        }
      />

      {isLoading ? (
        <LoadingBlock message={t("widget.retry.loadingRetrying")} />
      ) : result ? (
        <ResultBanner
          variant={result.success ? "success" : "danger"}
          icon={
            result.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )
          }
          title={
            result.success
              ? t("widget.retry.successMessage")
              : t("widget.retry.failureMessage")
          }
          message={result.message ?? undefined}
        >
          {result.success ? (
            <>
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
            </>
          ) : null}
        </ResultBanner>
      ) : null}
    </WidgetShell>
  );
}

// ─── POST: Stop Job ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ImportJobStopContainer(_props: {
  field: (typeof stopDefinition.POST)["fields"];
}): React.JSX.Element {
  const data = useWidgetValue<typeof stopDefinition.POST>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const result = data?.result;

  const handleViewLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("@/leads/list/definition");
      navigate(def.default.GET);
    })();
  }, [navigate]);

  const handleStartNewImport = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("@/leads/import/definition");
      navigate(def.default.POST);
    })();
  }, [navigate]);

  return (
    <WidgetShell>
      <FormAlertWidget field={{}} />

      <WidgetHeader
        title={t("widget.stop.title")}
        backButton={
          <NavigateButtonWidget field={_props.field.children.backButton} />
        }
      />

      {isLoading ? (
        <LoadingBlock message={t("widget.stop.loadingStopping")} />
      ) : result ? (
        <ResultBanner
          variant={result.success ? "success" : "danger"}
          icon={
            result.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )
          }
          title={
            result.success
              ? t("widget.stop.successMessage")
              : t("widget.stop.failureMessage")
          }
          message={result.message ?? undefined}
        >
          {result.success ? (
            <>
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
            </>
          ) : null}
        </ResultBanner>
      ) : null}
    </WidgetShell>
  );
}
