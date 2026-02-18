/**
 * Leads Export Widget
 * Rich UI for lead export with download functionality
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Copy,
  Download,
  FileText,
  List,
  Loader2,
  Upload,
} from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { MimeType } from "@/app/api/[locale]/leads/enum";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

function formatFileSize(base64Length: number): string {
  const bytes = Math.round(base64Length * 0.75);
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = Math.round(bytes / 1024);
  if (kb < 1024) {
    return `${kb} KB`;
  }
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

export function LeadsExportContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const onSubmit = useWidgetOnSubmit();
  const form = useWidgetForm();
  const isLoading = endpointMutations?.read?.isLoading;

  const dateFrom: string = form?.watch("dateFrom") ?? "";
  const dateTo: string = form?.watch("dateTo") ?? "";
  const includeMetadata: boolean = form?.watch("includeMetadata") ?? true;
  const includeEngagementData: boolean =
    form?.watch("includeEngagementData") ?? false;

  const [copied, setCopied] = useState(false);

  const handleDownload = useCallback((): void => {
    if (!data?.fileContent || !data.fileName || !data.mimeType) {
      return;
    }
    const byteChars = atob(data.fileContent);
    const byteArray = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteArray[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: data.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = data.fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const handleCopyToClipboard = useCallback((): void => {
    if (!data?.fileContent) {
      return;
    }
    const text = atob(data.fileContent);
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      return undefined;
    });
  }, [data]);

  const handleViewList = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const handleImport = useCallback((): void => {
    router.push(`/${locale}/admin/leads/import`);
  }, [router, locale]);

  const handleRunExport = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.refetch?.();
    }
  }, [onSubmit, endpointMutations]);

  const isCsv = data?.mimeType === MimeType.CSV;

  const fileLabel =
    data?.mimeType === MimeType.XLSX
      ? t("app.api.leads.export.widget.excelSpreadsheet")
      : t("app.api.leads.export.widget.csvFile");

  const exportedAtFormatted = data?.exportedAt
    ? new Date(data.exportedAt).toLocaleString()
    : null;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Download className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.export.widget.exportLeads")}
          </Span>
        </Div>
        {/* Navigation shortcuts always visible in header */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImport}
          className="gap-1 text-xs"
          title={t("app.api.leads.export.widget.importLeadsTitle")}
        >
          <Upload className="h-4 w-4" />
          {t("app.api.leads.export.widget.import")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewList}
          className="gap-1 text-xs"
          title={t("app.api.leads.export.widget.viewLeadsListTitle")}
        >
          <List className="h-4 w-4" />
          {t("app.api.leads.export.widget.viewList")}
        </Button>
      </Div>

      {/* Export configuration form */}
      <Div className="rounded-lg border p-4 flex flex-col gap-3">
        <Span className="text-sm font-semibold">
          {t("app.api.leads.export.widget.configureExport")}
        </Span>
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectFieldWidget
            fieldName={`${fieldName}.format`}
            field={children.format}
          />
          <SelectFieldWidget
            fieldName={`${fieldName}.status`}
            field={children.status}
          />
          <SelectFieldWidget
            fieldName={`${fieldName}.source`}
            field={children.source}
          />
          <SelectFieldWidget
            fieldName={`${fieldName}.country`}
            field={children.country}
          />
          <SelectFieldWidget
            fieldName={`${fieldName}.language`}
            field={children.language}
          />
          <TextFieldWidget
            fieldName={`${fieldName}.search`}
            field={children.search}
          />
          <Div className="flex flex-col gap-1">
            <Span className="text-xs text-muted-foreground">
              {children.dateFrom.label}
            </Span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                form?.setValue("dateFrom", e.target.value);
              }}
              className="h-9"
            />
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="text-xs text-muted-foreground">
              {children.dateTo.label}
            </Span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                form?.setValue("dateTo", e.target.value);
              }}
              className="h-9"
            />
          </Div>
        </Div>
        <Div className="flex items-center gap-4 flex-wrap">
          <Label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={includeMetadata}
              onCheckedChange={(checked) => {
                form?.setValue("includeMetadata", checked === true);
              }}
            />
            <Span className="text-sm">{children.includeMetadata.label}</Span>
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={includeEngagementData}
              onCheckedChange={(checked) => {
                form?.setValue("includeEngagementData", checked === true);
              }}
            />
            <Span className="text-sm">
              {children.includeEngagementData.label}
            </Span>
          </Label>
        </Div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleRunExport}
          className="self-start gap-1"
        >
          <Download className="h-4 w-4" />
          {t("app.api.leads.export.widget.download")}
        </Button>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-40 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("app.api.leads.export.widget.generatingExport")}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("app.api.leads.export.widget.generatingExportHint")}
          </Span>
        </Div>
      )}

      {/* Result */}
      {data?.fileContent && !isLoading && (
        <Div className="rounded-lg border bg-card p-6 flex flex-col gap-5">
          {/* Success header */}
          <Div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
            <Div>
              <Span className="font-semibold block">
                {t("app.api.leads.export.widget.exportReady")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {t("app.api.leads.export.widget.fileReadyToDownload")}
              </Span>
            </Div>
          </Div>

          {/* Summary stats */}
          <Div className="grid grid-cols-3 gap-3">
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("app.api.leads.export.widget.records")}
              </Span>
              <Span className="text-xl font-bold tabular-nums">
                {data.totalRecords?.toLocaleString() ?? "—"}
              </Span>
            </Div>
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("app.api.leads.export.widget.format")}
              </Span>
              <Span className="text-xl font-bold">{fileLabel}</Span>
            </Div>
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("app.api.leads.export.widget.fileSize")}
              </Span>
              <Span className="text-xl font-bold tabular-nums">
                {formatFileSize(data.fileContent.length)}
              </Span>
            </Div>
          </Div>

          {/* File row with download */}
          <Div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 w-full">
            <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
            <Div className="flex-1 min-w-0">
              <Span className="text-sm font-medium block truncate">
                {data.fileName}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {fileLabel}
                {exportedAtFormatted && <> {exportedAtFormatted}</>}
              </Span>
            </Div>
            <Div className="flex items-center gap-2 flex-shrink-0">
              {isCsv && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToClipboard}
                  className="gap-1"
                  title={t("app.api.leads.export.widget.copyCsvTitle")}
                >
                  <Copy className="h-4 w-4" />
                  {copied
                    ? t("app.api.leads.export.widget.copied")
                    : t("app.api.leads.export.widget.copy")}
                </Button>
              )}
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleDownload}
                className="gap-1"
              >
                <Download className="h-4 w-4" />
                {t("app.api.leads.export.widget.download")}
              </Button>
            </Div>
          </Div>

          {/* Exported timestamp */}
          {exportedAtFormatted && (
            <Div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <Span>
                {t("app.api.leads.export.widget.exportedAt")}{" "}
                {exportedAtFormatted}
              </Span>
            </Div>
          )}

          {/* Post-export actions */}
          <Div className="flex items-center gap-2 pt-1 border-t">
            <Span className="text-xs text-muted-foreground mr-auto">
              {t("app.api.leads.export.widget.nextSteps")}
            </Span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewList}
              className="gap-1"
            >
              <List className="h-4 w-4" />
              {t("app.api.leads.export.widget.viewLeads")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="gap-1"
            >
              <Upload className="h-4 w-4" />
              {t("app.api.leads.export.widget.importLeads")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
