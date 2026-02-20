/**
 * Leads Import Widget
 * Rich UI for CSV import with results display, job management navigation, and guidance
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  ExternalLink,
  FileText,
  Info,
  List,
  Loader2,
  RefreshCcw,
  Search,
  Square,
  Upload,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Li } from "next-vibe-ui/ui/li";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { Code } from "next-vibe-ui/ui/typography";
import { Ul } from "next-vibe-ui/ui/ul";
import React from "react";

import {
  useWidgetContext,
  useWidgetLocale,
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
      {t("app.api.leads.import.post.widget.importGuideNote", {
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
      {t("app.api.leads.import.post.widget.fileRequirementChunked", {
        chunkedProcessing: t(
          "app.api.leads.import.post.widget.chunkedProcessingLabel",
        ),
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
    <Span className="text-xs text-blue-600 dark:text-blue-400">
      {t("app.api.leads.import.post.widget.backgroundProcessingNote", {
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
  const t = useWidgetTranslation();
  const { endpointMutations } = useWidgetContext();
  const router = useRouter();
  const locale = useWidgetLocale();
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
    router.push(`/${locale}/admin/leads/import?jobId=${jobId}`);
  };

  const handleStopJob = (jobId: string): void => {
    router.push(`/${locale}/admin/leads/import?jobId=${jobId}&action=stop`);
  };

  const handleRetryFailed = (jobId: string): void => {
    router.push(`/${locale}/admin/leads/import?jobId=${jobId}&action=retry`);
  };

  const handleViewList = (): void => {
    router.push(`/${locale}/admin/leads/list`);
  };

  const handleFindLead = (): void => {
    router.push(`/${locale}/admin/leads/list`);
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
            {t("app.api.leads.import.post.widget.headerTitle")}
          </Span>
        </Div>
        <Link
          href={buildTemplateCsvDataUri()}
          download="leads-import-template.csv"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border rounded-md px-2.5 py-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          {t("app.api.leads.import.post.widget.exportTemplateButton")}
        </Link>
      </Div>

      {/* Form */}
      {!data && !isLoading && (
        <>
          {/* Guidance */}
          <Div className="rounded-lg border border-dashed bg-muted/30 p-6 flex flex-col gap-4">
            <Div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <Div className="flex flex-col gap-1">
                <Span className="font-medium text-sm">
                  {t("app.api.leads.import.post.widget.importGuideTitle")}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.import.post.widget.importGuideSubtitle")}
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
                  {t("app.api.leads.import.post.widget.fileRequirementsTitle")}
                </Span>
                <Ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                  <Li>
                    {t(
                      "app.api.leads.import.post.widget.fileRequirementFormat",
                    )}
                  </Li>
                  <Li>
                    {t(
                      "app.api.leads.import.post.widget.fileRequirementHeader",
                    )}
                  </Li>
                  <Li>
                    {t("app.api.leads.import.post.widget.fileRequirementSize")}
                  </Li>
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

          <SubmitButtonWidget
            field={{
              text: "app.api.leads.import.post.widget.headerTitle",
              loadingText: "app.api.leads.import.post.widget.loadingText",
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
            {t("app.api.leads.import.post.widget.loadingText")}
          </Span>
        </Div>
      )}

      {/* Chunked processing notice + job actions */}
      {data?.isChunkedProcessing && data.jobId && !isLoading && (
        <Div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4 flex flex-col gap-3">
          <Div className="flex items-start gap-3">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
            <Div>
              <Span className="font-medium text-sm block text-blue-700 dark:text-blue-300">
                {t(
                  "app.api.leads.import.post.widget.backgroundProcessingTitle",
                )}
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
              className="h-7 text-xs gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/40"
              onClick={() => {
                handleCheckJobStatus(data.jobId!);
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("app.api.leads.import.post.widget.checkJobStatusButton")}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
              onClick={() => {
                handleStopJob(data.jobId!);
              }}
            >
              <Square className="h-3.5 w-3.5" />
              {t("app.api.leads.import.post.widget.stopJobButton")}
            </Button>

            {hasFailures && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
                onClick={() => {
                  handleRetryFailed(data.jobId!);
                }}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                {t("app.api.leads.import.post.widget.retryFailedButton")}
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
                {t("app.api.leads.import.post.widget.statTotalRows")}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-4 text-center">
              <Span className="block text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
                {data.successfulImports}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.import.post.widget.statImported")}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-4 text-center">
              <Span className="block text-2xl font-bold tabular-nums text-yellow-600 dark:text-yellow-400">
                {data.duplicateEmails}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.import.post.widget.statDuplicates")}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-4 text-center">
              <Span className="block text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                {data.failedImports}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.import.post.widget.statFailed")}
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
                {t("app.api.leads.import.post.widget.viewImportedLeadsButton")}
              </Button>
            )}

            {hasFailures && data.jobId && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5 border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
                onClick={() => {
                  handleRetryFailed(data.jobId!);
                }}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                {t(
                  "app.api.leads.import.post.widget.retryFailedWithCountButton",
                  { count: data.failedImports },
                )}
              </Button>
            )}
          </Div>

          {summary && (
            <Div className="rounded-lg border bg-card p-4">
              <Span className="text-sm font-semibold block mb-3">
                {t("app.api.leads.import.post.widget.summaryTitle")}
              </Span>
              <Div className="grid grid-cols-3 gap-4">
                <Div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Div>
                    <Span className="font-medium text-sm">
                      {summary.newLeads}
                    </Span>
                    <Span className="text-xs text-muted-foreground block">
                      {t("app.api.leads.import.post.widget.summaryNewLeads")}
                    </Span>
                  </Div>
                </Div>
                <Div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <Div>
                    <Span className="font-medium text-sm">
                      {summary.updatedLeads}
                    </Span>
                    <Span className="text-xs text-muted-foreground block">
                      {t("app.api.leads.import.post.widget.summaryUpdated")}
                    </Span>
                  </Div>
                </Div>
                <Div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <Div>
                    <Span className="font-medium text-sm">
                      {summary.skippedDuplicates}
                    </Span>
                    <Span className="text-xs text-muted-foreground block">
                      {t("app.api.leads.import.post.widget.summarySkipped")}
                    </Span>
                  </Div>
                </Div>
              </Div>
              {successRate !== null && (
                <Div className="mt-3">
                  <Div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <Span>
                      {t("app.api.leads.import.post.widget.successRateLabel")}
                    </Span>
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
            <Div className="rounded-lg border border-red-200 bg-card">
              <Div className="px-4 py-3 border-b border-red-200 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <Span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {t("app.api.leads.import.post.widget.importErrorsTitle", {
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
                      {t("app.api.leads.import.post.widget.errorRowLabel", {
                        row: err.row,
                      })}
                    </Span>
                    {err.email && (
                      <Span className="text-muted-foreground truncate max-w-[140px]">
                        {err.email}
                      </Span>
                    )}
                    <Span className="text-red-600 dark:text-red-400 flex-1">
                      {err.error}
                    </Span>
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
                        {t("app.api.leads.import.post.widget.findLeadButton")}
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
