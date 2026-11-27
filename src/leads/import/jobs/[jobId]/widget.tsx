"use client";

import { formatTimestamp } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { DetailField } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { List } from "next-vibe/ui/components/icons/List";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { ProgressBlock } from "next-vibe/ui/components/progress-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useCallback } from "react";

import { CsvImportJobStatus } from "@/leads/import/enum";

import type definition from "./definition";
import { scopedTranslation } from "./i18n";
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
  const locale = useWidgetLocale();
  const isLoading = endpointMutations?.read?.isLoading;

  const job = data?.job;
  const info = job?.info;
  const jobId = info?.id;
  const progress = job?.progress;
  const configuration = job?.configuration;
  const timestamps = job?.timestamps;

  const canStop =
    info?.status === CsvImportJobStatus.PROCESSING ||
    info?.status === CsvImportJobStatus.PENDING;
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

  const handleSettings = useCallback((): void => {
    if (jobId) {
      void (async (): Promise<void> => {
        const { default: jobDefinition } = await import("./definition");
        navigate(jobDefinition.PATCH, { urlPathParams: { jobId } });
      })();
    }
  }, [navigate, jobId]);

  const handleRemove = useCallback((): void => {
    if (jobId) {
      void (async (): Promise<void> => {
        const { default: jobDefinition } = await import("./definition");
        navigate(jobDefinition.DELETE, { urlPathParams: { jobId } });
      })();
    }
  }, [navigate, jobId]);

  // ── Header actions ────────────────────────────────────────────────────────

  const headerActions = (
    <Div className="flex flex-wrap items-center gap-2">
      {jobId && (
        <Button size="sm" variant="outline" onClick={handleSettings}>
          {t("patch.titleShort")}
        </Button>
      )}
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
      {canStop && (
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
      {jobId && !canStop && (
        <Button size="sm" variant="outline" onClick={handleRemove}>
          {t("delete.titleShort")}
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
    <WidgetShell layout="page">
      <FormAlertWidget field={{}} />

      <WidgetHeader
        size="page"
        title={info?.fileName ?? t("widget.status.title")}
        subtitle={info?.fileName ? t("widget.status.title") : undefined}
        backButton={
          <NavigateButtonWidget field={_props.field.children.backButton} />
        }
        actions={headerActions}
      />

      {isLoading ? (
        <LoadingBlock message={t("widget.status.loadingJobStatus")} />
      ) : !data ? null : (
        <>
          {info?.status && (
            <Div className="flex items-center gap-2">
              <StatusIcon status={info.status} />
              <StatusPill
                status={t(`widget.status.jobStatus.${info.status}`)}
                variant={STATUS_VARIANT[info.status] ?? "default"}
              />
            </Div>
          )}

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
                  value={formatTimestamp(timestamps.createdAt, locale)}
                />
                <DetailField
                  label={t("widget.status.started")}
                  value={
                    timestamps.startedAt
                      ? formatTimestamp(timestamps.startedAt, locale)
                      : undefined
                  }
                />
                <DetailField
                  label={t("widget.status.completed")}
                  value={
                    timestamps.completedAt
                      ? formatTimestamp(timestamps.completedAt, locale)
                      : undefined
                  }
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
  const t = useWidgetTranslation<typeof retryDefinition.POST>();
  const { t: jobT } = scopedTranslation.scopedT(useWidgetLocale());
  const form = useWidgetForm<typeof retryDefinition.POST>();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const result = data?.result;
  const jobId = form.watch("jobId");

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
    <WidgetShell layout="page">
      <FormAlertWidget field={{}} />

      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.description")}
        backButton={
          <NavigateButtonWidget field={_props.field.children.backButton} />
        }
      />

      {isLoading ? (
        <LoadingBlock message={t("post.description")} />
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
              ? t("widget.successMessage")
              : t("post.errors.server.title")
          }
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
                {jobT("widget.retry.viewJobStatus")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewLeads}
                className="gap-1.5 text-xs"
              >
                <List className="h-3.5 w-3.5" />
                {jobT("widget.retry.viewLeads")}
              </Button>
            </>
          ) : null}
        </ResultBanner>
      ) : (
        <SubmitButtonWidget<typeof retryDefinition.POST>
          field={{
            text: "post.titleShort",
            variant: "primary",
            className: "min-h-10 self-stretch @md:self-end",
          }}
        />
      )}
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
  const t = useWidgetTranslation<typeof stopDefinition.POST>();
  const { t: jobT } = scopedTranslation.scopedT(useWidgetLocale());
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
    <WidgetShell layout="page">
      <FormAlertWidget field={{}} />

      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.description")}
        backButton={
          <NavigateButtonWidget field={_props.field.children.backButton} />
        }
      />

      {isLoading ? (
        <LoadingBlock message={t("post.description")} />
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
              ? t("widget.successMessage")
              : t("post.errors.server.title")
          }
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
                {jobT("widget.stop.viewLeads")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStartNewImport}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {jobT("widget.stop.startNewImport")}
              </Button>
            </>
          ) : null}
        </ResultBanner>
      ) : (
        <SubmitButtonWidget<typeof stopDefinition.POST>
          field={{
            text: "post.titleShort",
            variant: "destructive",
            className: "min-h-10 self-stretch @md:self-end",
          }}
        />
      )}
    </WidgetShell>
  );
}
