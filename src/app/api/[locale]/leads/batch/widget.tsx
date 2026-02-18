/**
 * Leads Batch Operations Widget
 * Rich UI for batch update/delete with dry-run preview
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  List,
  Loader2,
  Trash2,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type PatchResponseOutput = typeof definition.PATCH.types.ResponseOutput;
type DeleteResponseOutput = typeof definition.DELETE.types.ResponseOutput;

interface PatchWidgetProps {
  field: {
    value: PatchResponseOutput | null | undefined;
  } & (typeof definition.PATCH)["fields"];
  fieldName: string;
}

interface DeleteWidgetProps {
  field: {
    value: DeleteResponseOutput | null | undefined;
  } & (typeof definition.DELETE)["fields"];
  fieldName: string;
}

export function LeadsBatchUpdateContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();
  const isSubmitting = endpointMutations?.update?.isSubmitting;

  const response = data?.response;
  const preview = response?.preview ?? [];
  const errors = response?.errors ?? [];

  const totalMatched = response?.totalMatched ?? 0;
  const totalProcessed = response?.totalProcessed ?? 0;
  const isPartialBatch =
    Boolean(response) && totalProcessed < totalMatched && totalProcessed > 0;
  const isHighVolume =
    Boolean(response) && preview.length > 0 && totalMatched > 100;

  const handleViewLead = useCallback(
    (lead: { id?: string | null }): void => {
      if (!lead.id) {
        return;
      }
      router.push(`/${locale}/admin/leads/${lead.id}/edit`);
    },
    [router, locale],
  );

  const handleViewAllAffected = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base mr-auto">
          {t("app.api.leads.batch.widget.update.headerTitle")}
        </Span>
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </Div>

      {/* Filter Criteria Section */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <Span className="font-medium text-sm text-muted-foreground">
          {t("app.api.leads.batch.widget.update.sectionFilter")}
        </Span>
        <Div className="grid grid-cols-2 gap-3">
          <Div className="col-span-2">
            <TextFieldWidget field={children.search} fieldName="search" />
          </Div>
          <SelectFieldWidget field={children.status} fieldName="status" />
          <SelectFieldWidget
            field={children.currentCampaignStage}
            fieldName="currentCampaignStage"
          />
          <SelectFieldWidget field={children.source} fieldName="source" />
          <SelectFieldWidget field={children.scope} fieldName="scope" />
          <NumberFieldWidget
            field={children.maxRecords}
            fieldName="maxRecords"
          />
          <BooleanFieldWidget field={children.dryRun} fieldName="dryRun" />
        </Div>
      </Div>

      {/* Updates Section */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <Span className="font-medium text-sm text-muted-foreground">
          {t("app.api.leads.batch.widget.update.sectionUpdates")}
        </Span>
        <Div className="grid grid-cols-2 gap-3">
          <SelectFieldWidget
            field={children.updates.children.status}
            fieldName="updates.status"
          />
          <SelectFieldWidget
            field={children.updates.children.currentCampaignStage}
            fieldName="updates.currentCampaignStage"
          />
          <SelectFieldWidget
            field={children.updates.children.source}
            fieldName="updates.source"
          />
          <Div className="col-span-2">
            <TextFieldWidget
              field={children.updates.children.notes}
              fieldName="updates.notes"
            />
          </Div>
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget
        field={{
          text: "app.api.leads.batch.widget.update.submitButton" as const,
          loadingText:
            "app.api.leads.batch.widget.update.submitButtonLoading" as const,
          icon: "refresh-cw",
          variant: "primary",
        }}
      />

      {/* High-volume warning for dry-run with many matches */}
      {isHighVolume && (
        <Div className="rounded-lg border border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              {t("app.api.leads.batch.widget.update.highVolumeTitle", {
                count: totalMatched,
              })}
            </Span>
            <Span className="text-xs text-yellow-700 dark:text-yellow-400">
              {t("app.api.leads.batch.widget.update.highVolumeDescription")}
            </Span>
          </Div>
        </Div>
      )}

      {/* Partial batch progress info */}
      {isPartialBatch && (
        <Div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-3 flex items-start gap-2">
          <Span className="text-sm font-medium text-blue-800 dark:text-blue-300">
            {t("app.api.leads.batch.widget.update.partialBatchTitle")}
          </Span>
          <Span className="text-xs text-blue-700 dark:text-blue-400">
            {t("app.api.leads.batch.widget.update.partialBatchDescription", {
              processed: totalProcessed,
              matched: totalMatched,
            })}
          </Span>
        </Div>
      )}

      {/* Success / result summary */}
      {response && (
        <Div
          className={cn(
            "rounded-lg border p-4 flex flex-col gap-3",
            response.success
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20",
          )}
        >
          <Div className="flex items-center gap-2">
            {response.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <Span className="font-medium text-sm">
              {response.success
                ? t("app.api.leads.batch.widget.update.successTitle")
                : t("app.api.leads.batch.widget.update.failureTitle")}
            </Span>
          </Div>
          <Div className="grid grid-cols-3 gap-3">
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums">
                {totalMatched}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.batch.widget.update.statMatched")}
              </Span>
            </Div>
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums">
                {totalProcessed}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.batch.widget.update.statProcessed")}
              </Span>
            </Div>
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
                {response.totalUpdated ?? 0}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.batch.widget.update.statUpdated")}
              </Span>
            </Div>
          </Div>

          {/* Post-result action buttons */}
          {response.success && (
            <Div className="flex flex-wrap gap-2 pt-1 border-t border-current/10">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-xs"
                onClick={handleViewAllAffected}
              >
                <List className="h-3.5 w-3.5" />
                {t("app.api.leads.batch.widget.update.btnViewAllAffected")}
              </Button>
            </Div>
          )}
        </Div>
      )}

      {/* Dry-run preview */}
      {preview.length > 0 && (
        <Div className="rounded-lg border bg-card">
          <Div className="px-4 py-3 border-b flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <Span className="text-sm font-medium">
              {t("app.api.leads.batch.widget.update.dryRunPreviewTitle", {
                count: preview.length,
              })}
            </Span>
          </Div>
          <Div className="divide-y">
            {preview.map((lead, i) => (
              <Div
                key={lead.id ?? i}
                className={cn(
                  "px-4 py-2 flex items-center gap-3 text-sm",
                  lead.id
                    ? "cursor-pointer hover:bg-muted/50 transition-colors"
                    : "",
                )}
                onClick={() => {
                  handleViewLead(lead);
                }}
              >
                <Span className="flex-1 truncate text-muted-foreground">
                  {lead.email ??
                    lead.id ??
                    t("app.api.leads.batch.widget.update.leadFallback", {
                      number: i + 1,
                    })}
                </Span>
                {lead.businessName && (
                  <Span className="truncate max-w-[120px]">
                    {lead.businessName}
                  </Span>
                )}
                {lead.currentStatus && (
                  <Span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-muted">
                    {t(
                      `app.api.leads.batch.widget.update.status.${String(lead.currentStatus)}`,
                    )}
                  </Span>
                )}
                {lead.id && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </Div>
            ))}
          </Div>
        </Div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20 p-4">
          <Span className="text-sm font-medium text-red-700 dark:text-red-300 block mb-2">
            {t("app.api.leads.batch.widget.update.errorsTitle", {
              count: errors.length,
            })}
          </Span>
          <Div className="flex flex-col gap-1">
            {errors.map((err, i) => (
              <Div key={i} className="text-xs text-red-600 dark:text-red-400">
                {t("app.api.leads.batch.widget.update.errorRow", {
                  leadId: err.leadId,
                  error: err.error,
                })}
              </Div>
            ))}
          </Div>
        </Div>
      )}
    </Div>
  );
}

export function LeadsBatchDeleteContainer({
  field,
}: DeleteWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();

  const response = data?.response;
  const preview = response?.preview ?? [];
  const errors = response?.errors ?? [];

  const totalMatched = response?.totalMatched ?? 0;

  const handleViewLead = useCallback(
    (lead: { id?: string | null }): void => {
      if (!lead.id) {
        return;
      }
      router.push(`/${locale}/admin/leads/${lead.id}/edit`);
    },
    [router, locale],
  );

  const handleViewRemainingLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base mr-auto text-destructive">
          {t("app.api.leads.batch.widget.delete.headerTitle")}
        </Span>
      </Div>

      {/* Filter Criteria Section */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <Span className="font-medium text-sm text-muted-foreground">
          {t("app.api.leads.batch.widget.delete.sectionFilter")}
        </Span>
        <Div className="flex flex-col gap-3">
          <TextFieldWidget field={children.search} fieldName="search" />
          <SelectFieldWidget field={children.status} fieldName="status" />
          <NumberFieldWidget
            field={children.maxRecords}
            fieldName="maxRecords"
          />
          <BooleanFieldWidget field={children.dryRun} fieldName="dryRun" />
          <BooleanFieldWidget
            field={children.confirmDelete}
            fieldName="confirmDelete"
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget
        field={{
          text: "app.api.leads.batch.widget.delete.submitButton" as const,
          loadingText:
            "app.api.leads.batch.widget.delete.submitButtonLoading" as const,
          icon: "trash",
          variant: "destructive",
        }}
      />

      {/* Prominent danger warning with lead count — shown when preview has entries and no result yet */}
      {preview.length > 0 && !response?.success && (
        <Div className="rounded-lg border-2 border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40 p-4 flex items-start gap-3">
          <Div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="font-semibold text-sm text-red-800 dark:text-red-200">
              {preview.length !== 1
                ? t("app.api.leads.batch.widget.delete.warningTitlePlural", {
                    count: preview.length,
                  })
                : t("app.api.leads.batch.widget.delete.warningTitle", {
                    count: preview.length,
                  })}
            </Span>
            <Span className="text-xs text-red-700 dark:text-red-300">
              {t("app.api.leads.batch.widget.delete.warningDescription")}
            </Span>
          </Div>
        </Div>
      )}

      {response && (
        <Div
          className={cn(
            "rounded-lg border p-4",
            response.success
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20",
          )}
        >
          <Div className="flex items-center gap-2 mb-3">
            {response.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <Span className="font-medium text-sm">
              {response.success
                ? t("app.api.leads.batch.widget.delete.successTitle")
                : t("app.api.leads.batch.widget.delete.failureTitle")}
            </Span>
          </Div>
          <Div className="grid grid-cols-2 gap-3">
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums">
                {totalMatched}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.batch.widget.delete.statMatched")}
              </Span>
            </Div>
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                {response.totalDeleted ?? 0}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("app.api.leads.batch.widget.delete.statDeleted")}
              </Span>
            </Div>
          </Div>

          {/* Post-deletion action buttons */}
          {response.success && (
            <Div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-current/10">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-xs"
                onClick={handleViewRemainingLeads}
              >
                <List className="h-3.5 w-3.5" />
                {t("app.api.leads.batch.widget.delete.btnViewRemainingLeads")}
              </Button>
            </Div>
          )}
        </Div>
      )}

      {preview.length > 0 && (
        <Div className="rounded-lg border border-red-200 bg-card">
          <Div className="px-4 py-3 border-b border-red-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <Span className="text-sm font-medium text-red-700 dark:text-red-300">
              {t("app.api.leads.batch.widget.delete.previewTitle", {
                count: preview.length,
              })}
            </Span>
          </Div>
          <Div className="divide-y">
            {preview.map((lead, i) => (
              <Div
                key={lead.id ?? i}
                className={cn(
                  "px-4 py-2 flex items-center gap-3 text-sm",
                  lead.id
                    ? "cursor-pointer hover:bg-muted/50 transition-colors"
                    : "",
                )}
                onClick={() => {
                  handleViewLead(lead);
                }}
              >
                <Span className="flex-1 truncate">
                  {lead.email ??
                    lead.id ??
                    t("app.api.leads.batch.widget.delete.leadFallback", {
                      number: i + 1,
                    })}
                </Span>
                {lead.businessName && (
                  <Span className="text-muted-foreground truncate max-w-[120px]">
                    {lead.businessName}
                  </Span>
                )}
                {lead.id && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </Div>
            ))}
          </Div>
        </Div>
      )}

      {errors.length > 0 && (
        <Div className="text-xs text-red-600 dark:text-red-400 flex flex-col gap-1">
          {errors.map((err, i) => (
            <Span key={i}>
              {t("app.api.leads.batch.widget.delete.errorRow", {
                leadId: err.leadId,
                error: err.error,
              })}
            </Span>
          ))}
        </Div>
      )}
    </Div>
  );
}
