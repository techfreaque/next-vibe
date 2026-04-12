/**
 * Leads Import Widget
 * Rich UI for CSV import with results display, job management navigation, and guidance
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { ExternalLink as ExternalLinkIcon } from "next-vibe-ui/ui/icons/ExternalLink";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { List } from "next-vibe-ui/ui/icons/List";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCcw } from "next-vibe-ui/ui/icons/RefreshCcw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Upload } from "next-vibe-ui/ui/icons/Upload";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Li } from "next-vibe-ui/ui/li";
import { Span } from "next-vibe-ui/ui/span";
import { Code } from "next-vibe-ui/ui/typography";
import { Ul } from "next-vibe-ui/ui/ul";
import React from "react";

import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { FileFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/file-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

/** CSV column list shown to users in the guidance section */
const CSV_COLUMNS = [
  "email",
  "businessName",
  "phone",
  "website",
  "country",
  "language",
  "status",
  "source",
  "notes",
] as const;

/** Generate a plain-text CSV template header line for download */
function buildTemplateCsvDataUri(): string {
  const header = CSV_COLUMNS.join(",");
  const exampleRow =
    "user@example.com,Acme Corp,+1-555-0100,https://acme.example,GLOBAL,en,NEW,CSV_IMPORT,";
  const content = `${header}\n${exampleRow}\n`;
  return `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`;
}

/** Renders a single CSV column badge */
function CsvColumnBadge({ col }: { col: string }): React.JSX.Element {
  return (
    <Code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
      {col}
    </Code>
  );
}

/** Renders the import guide note with an inline code element for the email column */
function ImportGuideNote({
  t,
}: {
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  return (
    <Span className="text-xs text-muted-foreground mt-1">
      {t("post.widget.importGuideNote", {
        email: "email",
      })}
    </Span>
  );
}

/** Renders the chunked file requirement note with inline italic label */
function FileRequirementChunked({
  t,
}: {
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  return (
    <Li>
      {t("post.widget.fileRequirementChunked", {
        chunkedProcessing: t("post.widget.chunkedProcessingLabel"),
      })}
    </Li>
  );
}

/** Renders the background processing note with inline code element for the job ID */
function BackgroundProcessingNote({
  t,
  jobId,
  totalRows,
}: {
  t: ReturnType<typeof useWidgetTranslation>;
  jobId: string;
  totalRows: number;
}): React.JSX.Element {
  return (
    <Span className="text-xs text-info">
      {t("post.widget.backgroundProcessingNote", {
        jobId,
        totalRows,
      })}
    </Span>
  );
}

export function LeadsImportContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation<typeof definition.POST>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const isLoading = endpointMutations?.create?.isSubmitting;

  const errors = data?.errors ?? [];
  const summary = data?.summary;
  const successRate =
    data?.totalRows && data.totalRows > 0
      ? Math.round((data.successfulImports / data.totalRows) * 100)
      : null;
  const hasFailures = (data?.failedImports ?? 0) > 0;
  const hasSuccesses = (data?.successfulImports ?? 0) > 0;

  const handleCheckJobStatus = (jobId: string): void => {
    void (async (): Promise<void> => {
      const jobDef =
        await import("@/app/api/[locale]/leads/import/jobs/[jobId]/definition");
      navigate(jobDef.default.GET, { urlPathParams: { jobId } });
    })();
  };

  const handleStopJob = (jobId: string): void => {
    void (async (): Promise<void> => {
      const stopDef =
        await import("@/app/api/[locale]/leads/import/jobs/[jobId]/stop/definition");
      navigate(stopDef.default.POST, { urlPathParams: { jobId } });
    })();
  };

  const handleRetryFailed = (jobId: string): void => {
    void (async (): Promise<void> => {
      const retryDef =
        await import("@/app/api/[locale]/leads/import/jobs/[jobId]/retry/definition");
      navigate(retryDef.default.POST, { urlPathParams: { jobId } });
    })();
  };

  const handleViewList = (): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  };

  const handleFindLead = (): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  };

  const progressBarColor =
    successRate !== null && successRate >= 90
      ? "#22c55e"
      : successRate !== null && successRate >= 70
        ? "#eab308"
        : "#ef4444";

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("post.widget.headerTitle")}
          </Span>
        </Div>
        <ExternalLink
          href={buildTemplateCsvDataUri()}
          download="leads-import-template.csv"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border rounded-md px-2.5 py-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          {t("post.widget.exportTemplateButton")}
        </ExternalLink>
      </Div>

      {/* Form */}
      {!data && !isLoading && (
        <>
          {/* Guidance */}
          <Div className="rounded-lg border border-dashed bg-muted/30 p-6 flex flex-col gap-4">
            <Div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <Div className="flex flex-col gap-1">
                <Span className="font-medium text-sm">
                  {t("post.widget.importGuideTitle")}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("post.widget.importGuideSubtitle")}
                </Span>
                <Div className="flex flex-wrap gap-1 mt-1">
                  {CSV_COLUMNS.map((col) => (
                    <CsvColumnBadge key={col} col={col} />
                  ))}
                </Div>
                <ImportGuideNote t={t} />
              </Div>
            </Div>

            <Div className="flex items-start gap-3 border-t pt-3">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <Div className="flex flex-col gap-0.5">
                <Span className="font-medium text-sm">
                  {t("post.widget.fileRequirementsTitle")}
                </Span>
                <Ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                  <Li>{t("post.widget.fileRequirementFormat")}</Li>
                  <Li>{t("post.widget.fileRequirementHeader")}</Li>
                  <Li>{t("post.widget.fileRequirementSize")}</Li>
                  <FileRequirementChunked t={t} />
                </Ul>
              </Div>
            </Div>
          </Div>

          <FormAlertWidget field={{}} />

          <FileFieldWidget fieldName="file" field={children.file} />

          <SelectFieldWidget
            fieldName="defaultCountry"
            field={children.defaultCountry}
          />
          <SelectFieldWidget
            fieldName="defaultLanguage"
            field={children.defaultLanguage}
          />
          <SelectFieldWidget
            fieldName="defaultStatus"
            field={children.defaultStatus}
          />
          <SelectFieldWidget
            fieldName="defaultCampaignStage"
            field={children.defaultCampaignStage}
          />
          <SelectFieldWidget
            fieldName="defaultSource"
            field={children.defaultSource}
          />
          <BooleanFieldWidget
            fieldName="skipDuplicates"
            field={children.skipDuplicates}
          />
          <BooleanFieldWidget
            fieldName="updateExisting"
            field={children.updateExisting}
          />
          <BooleanFieldWidget
            fieldName="useChunkedProcessing"
            field={children.useChunkedProcessing}
          />
          <NumberFieldWidget fieldName="batchSize" field={children.batchSize} />

          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "post.widget.headerTitle",
              loadingText: "post.widget.loadingText",
              icon: "upload",
              variant: "primary",
            }}
          />
        </>
      )}

      {/* Loading */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("post.widget.loadingText")}
          </Span>
        </Div>
      )}

      {/* Chunked processing notice + job actions */}
      {data?.isChunkedProcessing && data.jobId && !isLoading && (
        <Div className="rounded-lg border border-info/20 bg-info/10 p-4 flex flex-col gap-3">
          <Div className="flex items-start gap-3">
            <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0 mt-0.5" />
            <Div>
              <Span className="font-medium text-sm block text-info">
                {t("post.widget.backgroundProcessingTitle")}
              </Span>
              <BackgroundProcessingNote
                t={t}
                jobId={data.jobId}
                totalRows={data.totalRows}
              />
            </Div>
          </Div>

          <Div className="flex flex-wrap gap-2 pl-8">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 border-info/30 text-info hover:bg-info/10"
              onClick={() => {
                handleCheckJobStatus(data.jobId!);
              }}
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              {t("post.widget.checkJobStatusButton")}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => {
                handleStopJob(data.jobId!);
              }}
            >
              <Square className="h-3.5 w-3.5" />
              {t("post.widget.stopJobButton")}
            </Button>

            {hasFailures && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-warning/30 text-warning hover:bg-warning/10"
                onClick={() => {
                  handleRetryFailed(data.jobId!);
                }}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                {t("post.widget.retryFailedButton")}
              </Button>
            )}
          </Div>
        </Div>
      )}

      {/* Results summary */}
      {data && !data.isChunkedProcessing && !isLoading && (
        <>
          <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Div className="rounded-lg border bg-card p-4 text-center">
              <Span className="block text-2xl font-bold tabular-nums">
                {data.totalRows}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("post.widget.statTotalRows")}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-4 text-center">
              <Span className="block text-2xl font-bold tabular-nums text-success">
                {data.successfulImports}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("post.widget.statImported")}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-4 text-center">
              <Span className="block text-2xl font-bold tabular-nums text-warning">
                {data.duplicateEmails}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("post.widget.statDuplicates")}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-4 text-center">
              <Span className="block text-2xl font-bold tabular-nums text-destructive">
                {data.failedImports}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("post.widget.statFailed")}
              </Span>
            </Div>
          </Div>

          <Div className="flex flex-wrap gap-2">
            {hasSuccesses && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5"
                onClick={handleViewList}
              >
                <List className="h-3.5 w-3.5" />
                {t("post.widget.viewImportedLeadsButton")}
              </Button>
            )}

            {hasFailures && data.jobId && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5 border-warning/30 text-warning hover:bg-warning/10"
                onClick={() => {
                  handleRetryFailed(data.jobId!);
                }}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                {t("post.widget.retryFailedWithCountButton", {
                  count: data.failedImports,
                })}
              </Button>
            )}
          </Div>

          {summary && (
            <Div className="rounded-lg border bg-card p-4">
              <Span className="text-sm font-semibold block mb-3">
                {t("post.widget.summaryTitle")}
              </Span>
              <Div className="grid grid-cols-3 gap-4">
                <Div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <Div>
                    <Span className="font-medium text-sm">
                      {summary.newLeads}
                    </Span>
                    <Span className="text-xs text-muted-foreground block">
                      {t("post.widget.summaryNewLeads")}
                    </Span>
                  </Div>
                </Div>
                <Div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <Div>
                    <Span className="font-medium text-sm">
                      {summary.updatedLeads}
                    </Span>
                    <Span className="text-xs text-muted-foreground block">
                      {t("post.widget.summaryUpdated")}
                    </Span>
                  </Div>
                </Div>
                <Div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <Div>
                    <Span className="font-medium text-sm">
                      {summary.skippedDuplicates}
                    </Span>
                    <Span className="text-xs text-muted-foreground block">
                      {t("post.widget.summarySkipped")}
                    </Span>
                  </Div>
                </Div>
              </Div>
              {successRate !== null && (
                <Div className="mt-3">
                  <Div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <Span>{t("post.widget.successRateLabel")}</Span>
                    <Span>{successRate}%</Span>
                  </Div>
                  <Div className="h-2 bg-muted rounded-full overflow-hidden">
                    <Div
                      style={{
                        width: `${successRate}%`,
                        height: "100%",
                        borderRadius: "9999px",
                        backgroundColor: progressBarColor,
                      }}
                    />
                  </Div>
                </Div>
              )}
            </Div>
          )}

          {errors.length > 0 && (
            <Div className="rounded-lg border border-destructive/30 bg-card">
              <Div className="px-4 py-3 border-b border-destructive/30 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <Span className="text-sm font-medium text-destructive">
                  {t("post.widget.importErrorsTitle", {
                    count: errors.length,
                  })}
                </Span>
              </Div>
              <Div className="divide-y max-h-64 overflow-y-auto">
                {errors.map((err, i) => (
                  <Div
                    key={i}
                    className="px-4 py-2 flex items-center gap-3 text-xs"
                  >
                    <Span className="text-muted-foreground w-12 flex-shrink-0">
                      {t("post.widget.errorRowLabel", {
                        row: err.row,
                      })}
                    </Span>
                    {err.email && (
                      <Span className="text-muted-foreground truncate max-w-[140px]">
                        {err.email}
                      </Span>
                    )}
                    <Span className="text-destructive flex-1">{err.error}</Span>
                    {err.email && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs gap-1 flex-shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          handleFindLead();
                        }}
                      >
                        <Search className="h-3 w-3" />
                        {t("post.widget.findLeadButton")}
                      </Button>
                    )}
                  </Div>
                ))}
              </Div>
            </Div>
          )}
        </>
      )}
    </Div>
  );
}
