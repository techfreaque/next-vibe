/**
 * Leads List Client Component
 * Client-side leads list with filtering, sorting, and pagination using form-based filtering
 */

"use client";

import { Filter, List, RefreshCw, Table, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import React, { useCallback, useState } from "react";

import { useBatchOperations } from "@/app/api/[locale]/v1/core/leads/batch/hooks";
import {
  BatchOperationScope,
  EmailCampaignStage,
  EmailCampaignStageFilter,
  LeadSortField,
  LeadSource,
  LeadSourceFilter,
  LeadStatus,
  LeadStatusFilter,
  SortOrder,
} from "@/app/api/[locale]/v1/core/leads/enum";
import type { LeadListGetResponseTypeOutput } from "@/app/api/[locale]/v1/core/leads/list/definition";
import { useLeadsListEndpoint } from "@/app/api/[locale]/v1/core/leads/list/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import {
  CountryFilter,
  type CountryLanguage,
  LanguageFilter,
} from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CsvImportButton } from "../../_components/csv-import-button";
import { BatchOperationsDialog } from "../../_components/shared/batch-operations-dialog";
import { BatchOperationsToolbar } from "../../_components/shared/batch-operations-toolbar";
import { LeadsPagination } from "./leads-pagination";
import { LeadsTable } from "./leads-table";

interface LeadsListClientProps {
  locale: CountryLanguage;
}

export function LeadsListClient({
  locale,
}: LeadsListClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const leadsEndpoint = useLeadsListEndpoint(logger);
  const [viewMode, setViewMode] = useState<"list" | "table">("list");

  type LeadType = NonNullable<
    LeadListGetResponseTypeOutput["response"]["leads"]
  >[number];

  const apiResponse = leadsEndpoint.read.response;
  const leads: LeadType[] = apiResponse?.success ? apiResponse.data.leads : [];
  const totalLeads = apiResponse?.success ? apiResponse.data.total : 0;
  const totalPages = apiResponse?.success ? apiResponse.data.totalPages : 0;
  const queryLoading = leadsEndpoint.read.isLoading || false;

  // Reset trigger for toolbar state
  const [resetTrigger, setResetTrigger] = useState(0);

  // Batch operations hook
  const batchOperations = useBatchOperations(() => {
    // Reset toolbar state when operation completes
    setResetTrigger((prev) => prev + 1);
  });

  // Get current form values for pagination display
  const currentPage =
    leadsEndpoint.read.form.getValues("searchPagination.page") || 1;
  const currentLimit =
    leadsEndpoint.read.form.getValues("searchPagination.limit") || 20;

  // Refresh handler for CSV import
  const handleRefresh = React.useCallback(() => {
    void leadsEndpoint.read.refetch?.();
  }, [leadsEndpoint.read]);

  const handleClearFilters = (): void => {
    leadsEndpoint.read.form.reset({
      searchPagination: {
        search: undefined,
        page: 1,
        limit: 20,
      },
      statusFilters: {
        status: [LeadStatusFilter.ALL],
        currentCampaignStage: undefined,
        source: undefined,
      },
      locationFilters: {
        country: undefined,
        language: undefined,
      },
      sorting: {
        sortBy: LeadSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
    });
  };

  // Batch operations handlers
  const handleBatchUpdate = useCallback(
    async (
      updates: {
        status?: LeadStatus;
        currentCampaignStage?: EmailCampaignStage;
        source?: LeadSource;
        notes?: string;
      },
      scope: typeof BatchOperationScope,
      currentFilters: Record<string, string | number | boolean | undefined>,
    ) => {
      // Add scope and pagination info to filters
      const filtersWithScope = {
        ...currentFilters,
        scope,
        page: currentFilters.page || 1,
        pageSize: currentFilters.limit || 20,
      };

      await batchOperations.handleBatchUpdate(updates, filtersWithScope);
    },
    [batchOperations],
  );

  const handleConfirmBatchUpdate = useCallback(async () => {
    const currentFilters = leadsEndpoint.read.form.getValues();
    await batchOperations.handleConfirmBatchUpdate(
      currentFilters,
      handleRefresh,
    );
  }, [batchOperations, leadsEndpoint.read.form, handleRefresh]);

  const handleBatchDelete = useCallback(
    async (
      scope: typeof BatchOperationScope,
      currentFilters: Record<string, string | number | boolean | undefined>,
    ) => {
      // Add scope and pagination info to filters
      const filtersWithScope = {
        ...currentFilters,
        scope,
        page: currentFilters.page || 1,
        pageSize: currentFilters.limit || 20, // This is correct - pageSize should match limit
      };

      await batchOperations.handleBatchDelete(filtersWithScope);
    },
    [batchOperations],
  );

  const handleConfirmBatchDelete = useCallback(async () => {
    const currentFilters = leadsEndpoint.read.form.getValues();
    await batchOperations.handleConfirmBatchDelete(
      currentFilters,
      handleRefresh,
    );
  }, [batchOperations, leadsEndpoint.read.form, handleRefresh]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {t("app.admin.leads.leads.list.titleWithCount", {
              count: totalLeads,
            })}
          </CardTitle>

          <div className="flex items-center space-x-2">
            {/* View Toggle */}
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>

            {/* CSV Import */}
            <CsvImportButton onImportComplete={handleRefresh} locale={locale} />

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={leadsEndpoint.read.refetch}
              disabled={queryLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4", queryLoading && "animate-spin")}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Form */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("app.admin.leads.leads.list.filters.title")}:
            </span>
          </div>

          <Form
            form={leadsEndpoint.read.form}
            onSubmit={() => {}}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Search Field */}
              <EndpointFormField
                name="searchPagination.search"
                config={{
                  type: "text",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.search.placeholder",
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Status Filter */}
              <EndpointFormField
                name="statusFilters.status"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.filter.status",
                  options: [
                    {
                      value: LeadStatusFilter.ALL,
                      label: "app.admin.leads.leads.filter.all_statuses",
                    },
                    {
                      value: LeadStatusFilter.NEW,
                      label: "app.admin.leads.leads.admin.status.new",
                    },
                    {
                      value: LeadStatusFilter.PENDING,
                      label: "app.admin.leads.leads.admin.status.pending",
                    },
                    {
                      value: LeadStatusFilter.CAMPAIGN_RUNNING,
                      label:
                        "app.admin.leads.leads.admin.status.campaign_running",
                    },
                    {
                      value: LeadStatusFilter.WEBSITE_USER,
                      label: "app.admin.leads.leads.admin.status.website_user",
                    },
                    {
                      value: LeadStatusFilter.NEWSLETTER_SUBSCRIBER,
                      label:
                        "app.admin.leads.leads.admin.status.newsletter_subscriber",
                    },
                    {
                      value: LeadStatusFilter.IN_CONTACT,
                      label: "app.admin.leads.leads.admin.status.in_contact",
                    },
                    {
                      value: LeadStatusFilter.SIGNED_UP,
                      label: "app.admin.leads.leads.admin.status.signed_up",
                    },
                    {
                      value: LeadStatusFilter.CONSULTATION_BOOKED,
                      label:
                        "app.admin.leads.leads.admin.status.consultation_booked",
                    },
                    {
                      value: LeadStatusFilter.SUBSCRIPTION_CONFIRMED,
                      label:
                        "app.admin.leads.leads.admin.status.subscription_confirmed",
                    },
                    {
                      value: LeadStatusFilter.UNSUBSCRIBED,
                      label: "app.admin.leads.leads.admin.status.unsubscribed",
                    },
                    {
                      value: LeadStatusFilter.BOUNCED,
                      label: "app.admin.leads.leads.admin.status.bounced",
                    },
                    {
                      value: LeadStatusFilter.INVALID,
                      label: "app.admin.leads.leads.admin.status.invalid",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Campaign Stage Filter */}
              <EndpointFormField
                name="statusFilters.currentCampaignStage"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.filter.campaign_stage",
                  options: [
                    {
                      value: EmailCampaignStageFilter.ALL,
                      label:
                        "app.admin.leads.leads.admin.filters.campaign_stage.all",
                    },
                    {
                      value: EmailCampaignStageFilter.INITIAL,
                      label: "app.admin.leads.leads.admin.stage.initial",
                    },
                    {
                      value: EmailCampaignStageFilter.FOLLOWUP_1,
                      label: "app.admin.leads.leads.admin.stage.followup_1",
                    },
                    {
                      value: EmailCampaignStageFilter.FOLLOWUP_2,
                      label: "app.admin.leads.leads.admin.stage.followup_2",
                    },
                    {
                      value: EmailCampaignStageFilter.FOLLOWUP_3,
                      label: "app.admin.leads.leads.admin.stage.followup_3",
                    },
                    {
                      value: EmailCampaignStageFilter.NURTURE,
                      label: "app.admin.leads.leads.admin.stage.nurture",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Country Filter */}
              <EndpointFormField
                name="locationFilters.country"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.filter.country",
                  options: [
                    {
                      value: CountryFilter.ALL,
                      label: "app.admin.leads.leads.filter.all_countries",
                    },
                    {
                      value: CountryFilter.GLOBAL,
                      label:
                        "app.admin.leads.leads.admin.filters.countries.global",
                    },
                    {
                      value: CountryFilter.DE,
                      label: "app.admin.leads.leads.admin.filters.countries.de",
                    },
                    {
                      value: CountryFilter.PL,
                      label: "app.admin.leads.leads.admin.filters.countries.pl",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </div>

            {/* Second row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Language Filter */}
              <EndpointFormField
                name="locationFilters.language"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.filter.language",
                  options: [
                    {
                      value: LanguageFilter.ALL,
                      label: "app.admin.leads.leads.filter.all_languages",
                    },
                    {
                      value: LanguageFilter.EN,
                      label: "app.admin.leads.leads.admin.filters.languages.en",
                    },
                    {
                      value: LanguageFilter.DE,
                      label: "app.admin.leads.leads.admin.filters.languages.de",
                    },
                    {
                      value: LanguageFilter.PL,
                      label: "app.admin.leads.leads.admin.filters.languages.pl",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Source Filter */}
              <EndpointFormField
                name="statusFilters.source"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.filter.source",
                  options: [
                    {
                      value: LeadSourceFilter.ALL,
                      label: "app.admin.leads.leads.filter.all_sources",
                    },
                    {
                      value: LeadSourceFilter.WEBSITE,
                      label: "leads.filter.sources.website",
                    },
                    {
                      value: LeadSourceFilter.REFERRAL,
                      label: "leads.filter.sources.referral",
                    },
                    {
                      value: LeadSourceFilter.SOCIAL_MEDIA,
                      label: "leads.filter.sources.social_media",
                    },
                    {
                      value: LeadSourceFilter.EMAIL_CAMPAIGN,
                      label: "leads.filter.sources.email_campaign",
                    },
                    {
                      value: LeadSourceFilter.CSV_IMPORT,
                      label: "leads.filter.sources.csv_import",
                    },
                    {
                      value: LeadSourceFilter.API,
                      label: "leads.filter.sources.api",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Sort By */}
              <EndpointFormField
                name="sortBy"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "leads.sort.placeholder",
                  options: [
                    {
                      value: LeadSortField.CREATED_AT,
                      label: "leads.sort.created",
                    },
                    {
                      value: LeadSortField.UPDATED_AT,
                      label: "leads.sort.updated",
                    },
                    {
                      value: LeadSortField.EMAIL,
                      label: "leads.sort.email",
                    },
                    {
                      value: LeadSortField.BUSINESS_NAME,
                      label: "leads.sort.business",
                    },
                    {
                      value: LeadSortField.LAST_ENGAGEMENT_AT,
                      label: "leads.sort.last_engagement",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Sort Order */}
              <EndpointFormField
                name="sortOrder"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "leads.sort.placeholder",
                  options: [
                    {
                      value: SortOrder.DESC,
                      label: "leads.sort.desc",
                    },
                    {
                      value: SortOrder.ASC,
                      label: "leads.sort.asc",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </div>

            {/* Quick filter buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {t("leads.filter.quick_filters")}:
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  leadsEndpoint.read.form.setValue(
                    "status",
                    LeadStatusFilter.NEW,
                  );
                }}
              >
                {t("leads.filter.quick.new_leads")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  leadsEndpoint.read.form.setValue(
                    "status",
                    LeadStatusFilter.CAMPAIGN_RUNNING,
                  );
                }}
              >
                {t("leads.filter.quick.campaign_running")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  leadsEndpoint.read.form.setValue(
                    "source",
                    LeadSourceFilter.CSV_IMPORT,
                  );
                }}
              >
                {t("leads.filter.quick.imported")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                {t("leads.admin.filters.clear")}
              </Button>
            </div>

            {/* Form Alert for any filter errors */}
            <FormAlert alert={leadsEndpoint.alert} />
          </Form>
        </div>

        {/* Batch Operations Toolbar */}
        {viewMode === "table" && leads.length > 0 && (
          <BatchOperationsToolbar
            locale={locale}
            totalCount={
              leadsEndpoint.read.response?.success
                ? leadsEndpoint.read.response.data.total
                : leads.length
            }
            currentPage={leadsEndpoint.read.form.watch("page") || 1}
            pageSize={leadsEndpoint.read.form.watch("limit") || 20}
            onBatchUpdate={handleBatchUpdate}
            onBatchDelete={handleBatchDelete}
            currentFilters={leadsEndpoint.read.form.getValues()}
            resetTrigger={resetTrigger}
            isLoading={
              batchOperations.batchUpdateEndpoint.create.isSubmitting ||
              batchOperations.batchDeleteEndpoint.create.isSubmitting
            }
          />
        )}

        {/* Leads Content - List or Table View */}
        {leads.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {queryLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100 mr-2" />
                {t("app.admin.leads.leads.list.loading")}
              </div>
            ) : (
              t("app.admin.leads.leads.list.noResults")
            )}
          </div>
        ) : viewMode === "table" ? (
          <LeadsTable locale={locale} leads={leads} isLoading={queryLoading} />
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <Link
                        href={`/${locale}/admin/leads/${lead.id}/edit`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {lead.businessName}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lead.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {lead.status}
                      </div>
                      {lead.currentCampaignStage && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {lead.currentCampaignStage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {lead.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {lead.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalLeads > 0 && (
          <LeadsPagination
            locale={locale}
            leadsEndpoint={leadsEndpoint}
            totalItems={totalLeads}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          />
        )}
      </CardContent>

      {/* Batch Operations Dialog */}
      <BatchOperationsDialog
        locale={locale}
        isOpen={batchOperations.batchDialogOpen}
        onClose={batchOperations.handleCloseDialog}
        mode={batchOperations.batchDialogMode}
        operationType={batchOperations.operationType}
        title={
          batchOperations.batchDialogMode === "preview"
            ? batchOperations.operationType === "delete"
              ? "leads.admin.batch.delete_preview_title"
              : "leads.admin.batch.preview_title"
            : batchOperations.batchDialogMode === "result"
              ? "leads.admin.batch.results.title"
              : batchOperations.operationType === "delete"
                ? "leads.admin.batch.delete_confirm.title"
                : "leads.admin.batch.confirm.title"
        }
        description={
          batchOperations.batchDialogMode === "preview"
            ? batchOperations.operationType === "delete"
              ? "leads.admin.batch.delete_preview_description"
              : "leads.admin.batch.preview_description"
            : undefined
        }
        leads={batchOperations.previewLeads.filter(
          (lead): lead is typeof lead & { email: string } =>
            Boolean(lead.email),
        )}
        updates={batchOperations.pendingUpdates}
        result={
          batchOperations.operationType === "delete"
            ? batchOperations.batchDeleteEndpoint.create.response?.success
              ? batchOperations.batchDeleteEndpoint.create.response.data
              : undefined
            : batchOperations.batchUpdateEndpoint.create.response?.success
              ? batchOperations.batchUpdateEndpoint.create.response.data
              : undefined
        }
        onConfirm={
          batchOperations.batchDialogMode === "preview"
            ? batchOperations.operationType === "delete"
              ? handleConfirmBatchDelete
              : handleConfirmBatchUpdate
            : undefined
        }
        isLoading={
          batchOperations.batchUpdateEndpoint.create.isSubmitting ||
          batchOperations.batchDeleteEndpoint.create.isSubmitting
        }
      />
    </Card>
  );
}
