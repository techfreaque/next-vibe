/**
 * Leads Batch Operations Widget
 * Rich UI for batch update/delete with dry-run preview
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { List } from "next-vibe-ui/ui/icons/List";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { scopedTranslation as leadsScopedTranslation } from "@/app/api/[locale]/leads/i18n";
import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
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
}

interface DeleteWidgetProps {
  field: {
    value: DeleteResponseOutput | null | undefined;
  } & (typeof definition.DELETE)["fields"];
}

export function LeadsBatchUpdateContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof definition.PATCH>();
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

  // Read active filters from the hidden prefilled fields
  const activeSearch = form.watch("search") ?? "";
  const activeStatus = form.watch("status") ?? [];
  const activeCampaignStage = form.watch("currentCampaignStage") ?? [];
  const activeSource = form.watch("source") ?? [];
  const hasActiveFilters =
    Boolean(activeSearch) ||
    activeStatus.length > 0 ||
    activeCampaignStage.length > 0 ||
    activeSource.length > 0;

  const handleViewLead = useCallback(
    (lead: { id?: string | null }): void => {
      if (!lead.id) {
        return;
      }
      void (async (): Promise<void> => {
        const leadDef =
          await import("@/app/api/[locale]/leads/lead/[id]/definition");
        navigate(leadDef.default.GET, { urlPathParams: { id: lead.id! } });
      })();
    },
    [navigate],
  );

  const handleViewAllAffected = useCallback((): void => {
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
        <Span className="font-semibold text-base mr-auto">
          {t("widget.update.headerTitle")}
        </Span>
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </Div>

      {/* Active Filter Summary (prefilled from list, read-only display) */}
      {hasActiveFilters && (
        <Div className="rounded-lg border border-info/20 bg-info/10 p-3 flex flex-col gap-2">
          <Span className="text-xs font-medium text-info">
            {t("widget.update.activeFiltersLabel")}
          </Span>
          <Div className="flex flex-wrap gap-1.5">
            {activeSearch && (
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
                {t("widget.update.filterSearch")}: {activeSearch}
              </Span>
            )}
            {activeStatus.map((s) => (
              <Span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info"
              >
                {leadsT(s)}
              </Span>
            ))}
            {activeCampaignStage.map((s) => (
              <Span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info"
              >
                {leadsT(s)}
              </Span>
            ))}
            {activeSource.map((s) => (
              <Span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info"
              >
                {leadsT(s)}
              </Span>
            ))}
          </Div>
        </Div>
      )}

      {/* Updates Section */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <Span className="font-medium text-sm text-muted-foreground">
          {t("widget.update.sectionUpdates")}
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

      {/* Operation Settings Section */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <Span className="font-medium text-sm text-muted-foreground">
          {t("widget.update.sectionSettings")}
        </Span>
        <Div className="grid grid-cols-2 gap-3">
          <SelectFieldWidget field={children.scope} fieldName="scope" />
          <NumberFieldWidget
            field={children.maxRecords}
            fieldName="maxRecords"
          />
          <BooleanFieldWidget field={children.dryRun} fieldName="dryRun" />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.PATCH>
        field={{
          text: "widget.update.submitButton" as const,
          loadingText: "widget.update.submitButtonLoading" as const,
          icon: "refresh-cw",
          variant: "primary",
        }}
      />

      {/* High-volume warning for dry-run with many matches */}
      {isHighVolume && (
        <Div className="rounded-lg border border-warning/30 bg-warning/10 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-medium text-warning-foreground">
              {t("widget.update.highVolumeTitle", {
                count: totalMatched,
              })}
            </Span>
            <Span className="text-xs text-warning">
              {t("widget.update.highVolumeDescription")}
            </Span>
          </Div>
        </Div>
      )}

      {/* Partial batch progress info */}
      {isPartialBatch && (
        <Div className="rounded-lg border border-info/20 bg-info/10 p-3 flex items-start gap-2">
          <Span className="text-sm font-medium text-info">
            {t("widget.update.partialBatchTitle")}
          </Span>
          <Span className="text-xs text-info">
            {t("widget.update.partialBatchDescription", {
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
              ? "border-success/30 bg-success/10"
              : "border-destructive/30 bg-destructive/10",
          )}
        >
          <Div className="flex items-center gap-2">
            {response.success ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            <Span className="font-medium text-sm">
              {response.success
                ? t("widget.update.successTitle")
                : t("widget.update.failureTitle")}
            </Span>
          </Div>
          <Div className="grid grid-cols-3 gap-3">
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums">
                {totalMatched}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("widget.update.statMatched")}
              </Span>
            </Div>
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums">
                {totalProcessed}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("widget.update.statProcessed")}
              </Span>
            </Div>
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums text-success">
                {response.totalUpdated ?? 0}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("widget.update.statUpdated")}
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
                {t("widget.update.btnViewAllAffected")}
              </Button>
            </Div>
          )}
        </Div>
      )}

      {/* Dry-run preview */}
      {preview.length > 0 && (
        <Div className="rounded-lg border bg-card">
          <Div className="px-4 py-3 border-b flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <Span className="text-sm font-medium">
              {t("widget.update.dryRunPreviewTitle", {
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
                    t("widget.update.leadFallback", {
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
                    {leadsT(lead.currentStatus)}
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
        <Div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <Span className="text-sm font-medium text-destructive block mb-2">
            {t("widget.update.errorsTitle", {
              count: errors.length,
            })}
          </Span>
          <Div className="flex flex-col gap-1">
            {errors.map((err, i) => (
              <Div key={i} className="text-xs text-destructive">
                {t("widget.update.errorRow", {
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
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof definition.DELETE>();

  const response = data?.response;
  const preview = response?.preview ?? [];
  const errors = response?.errors ?? [];

  const totalMatched = response?.totalMatched ?? 0;

  // Read active filters from the hidden prefilled fields
  const activeSearch = form.watch("search") ?? "";
  const activeStatus = form.watch("status") ?? [];
  const activeCampaignStage = form.watch("currentCampaignStage") ?? [];
  const activeSource = form.watch("source") ?? [];
  const hasActiveFilters =
    Boolean(activeSearch) ||
    activeStatus.length > 0 ||
    activeCampaignStage.length > 0 ||
    activeSource.length > 0;

  const handleViewLead = useCallback(
    (lead: { id?: string | null }): void => {
      if (!lead.id) {
        return;
      }
      void (async (): Promise<void> => {
        const leadDef =
          await import("@/app/api/[locale]/leads/lead/[id]/definition");
        navigate(leadDef.default.GET, { urlPathParams: { id: lead.id! } });
      })();
    },
    [navigate],
  );

  const handleViewRemainingLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base mr-auto text-destructive">
          {t("widget.delete.headerTitle")}
        </Span>
      </Div>

      {/* Active Filter Summary (prefilled from list, read-only display) */}
      {hasActiveFilters && (
        <Div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 p-3 flex flex-col gap-2">
          <Span className="text-xs font-medium text-orange-700 dark:text-orange-300">
            {t("widget.delete.activeFiltersLabel")}
          </Span>
          <Div className="flex flex-wrap gap-1.5">
            {activeSearch && (
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
                {t("widget.delete.filterSearch")}: {activeSearch}
              </Span>
            )}
            {activeStatus.map((s) => (
              <Span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
              >
                {leadsT(s)}
              </Span>
            ))}
            {activeCampaignStage.map((s) => (
              <Span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
              >
                {leadsT(s)}
              </Span>
            ))}
            {activeSource.map((s) => (
              <Span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
              >
                {leadsT(s)}
              </Span>
            ))}
          </Div>
        </Div>
      )}

      {/* Operation Settings Section */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <Span className="font-medium text-sm text-muted-foreground">
          {t("widget.delete.sectionSettings")}
        </Span>
        <Div className="flex flex-col gap-3">
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
      <SubmitButtonWidget<typeof definition.DELETE>
        field={{
          text: "widget.delete.submitButton" as const,
          loadingText: "widget.delete.submitButtonLoading" as const,
          icon: "trash",
          variant: "destructive",
        }}
      />

      {/* Prominent danger warning with lead count - shown when preview has entries and no result yet */}
      {preview.length > 0 && !response?.success && (
        <Div className="rounded-lg border-2 border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
          <Div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <Trash2 className="h-5 w-5 text-destructive" />
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="font-semibold text-sm text-destructive">
              {preview.length !== 1
                ? t("widget.delete.warningTitlePlural", {
                    count: preview.length,
                  })
                : t("widget.delete.warningTitle", {
                    count: preview.length,
                  })}
            </Span>
            <Span className="text-xs text-destructive/80">
              {t("widget.delete.warningDescription")}
            </Span>
          </Div>
        </Div>
      )}

      {response && (
        <Div
          className={cn(
            "rounded-lg border p-4",
            response.success
              ? "border-success/30 bg-success/10"
              : "border-destructive/30 bg-destructive/10",
          )}
        >
          <Div className="flex items-center gap-2 mb-3">
            {response.success ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            <Span className="font-medium text-sm">
              {response.success
                ? t("widget.delete.successTitle")
                : t("widget.delete.failureTitle")}
            </Span>
          </Div>
          <Div className="grid grid-cols-2 gap-3">
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums">
                {totalMatched}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("widget.delete.statMatched")}
              </Span>
            </Div>
            <Div className="text-center">
              <Span className="block text-2xl font-bold tabular-nums text-destructive">
                {response.totalDeleted ?? 0}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("widget.delete.statDeleted")}
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
                {t("widget.delete.btnViewRemainingLeads")}
              </Button>
            </Div>
          )}
        </Div>
      )}

      {preview.length > 0 && (
        <Div className="rounded-lg border border-destructive/30 bg-card">
          <Div className="px-4 py-3 border-b border-destructive/30 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <Span className="text-sm font-medium text-destructive">
              {t("widget.delete.previewTitle", {
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
                    t("widget.delete.leadFallback", {
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
        <Div className="text-xs text-destructive flex flex-col gap-1">
          {errors.map((err, i) => (
            <Span key={i}>
              {t("widget.delete.errorRow", {
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
