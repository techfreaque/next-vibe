/**
 * Leads List Client Component
 * Client-side leads list with filtering, sorting, and pagination using form-based filtering
 */

"use client";

import { Filter, List, RefreshCw, Table, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import React, { useCallback, useState } from "react";

import { useBatchOperations } from "@/app/api/[locale]/v1/core/leads/batch/hooks";
import type {
  BatchOperationScope,
  EmailCampaignStage,
  LeadSource,
  LeadStatus,
} from "@/app/api/[locale]/v1/core/leads/enum";
import {
  EmailCampaignStageFilter,
  LeadSortField,
  LeadSourceFilter,
  LeadStatusFilter,
  SortOrder,
} from "@/app/api/[locale]/v1/core/leads/enum";
import type { LeadListGetResponseTypeOutput } from "@/app/api/[locale]/v1/core/leads/list/definition";
import { useLeadsListEndpoint } from "@/app/api/[locale]/v1/core/leads/list/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
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
  const leads: LeadType[] = apiResponse?.success
    ? apiResponse.data.response.leads
    : [];
  const totalLeads = apiResponse?.success ? apiResponse.data.response.total : 0;
  const totalPages = apiResponse?.success
    ? apiResponse.data.response.totalPages
    : 0;
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
      sortingOptions: {
        sortBy: LeadSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
    });
  };

  // Batch operations handlers
  const handleBatchUpdate = useCallback(
    async (
      updates: {
        status?: (typeof LeadStatus)[keyof typeof LeadStatus];
        currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
        source?: (typeof LeadSource)[keyof typeof LeadSource];
        notes?: string;
      },
      scope: (typeof BatchOperationScope)[keyof typeof BatchOperationScope],
    ) => {
      const currentFilters = leadsEndpoint.read.form.getValues();
      await batchOperations.handleBatchUpdate(updates, currentFilters, scope);
    },
    [batchOperations, leadsEndpoint.read.form],
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
      scope: (typeof BatchOperationScope)[keyof typeof BatchOperationScope],
    ) => {
      const currentFilters = leadsEndpoint.read.form.getValues();
      await batchOperations.handleBatchDelete(currentFilters, scope);
    },
    [batchOperations, leadsEndpoint.read.form],
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
        <Div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {t("app.admin.leads.leads.list.titleWithCount", {
              count: totalLeads,
            })}
          </CardTitle>

          <Div className="flex items-center space-x-2">
            {/* View Toggle */}
            <Div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
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
            </Div>

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
          </Div>
        </Div>
      </CardHeader>
      <CardContent>
        {/* Filter Form */}
        <Div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Div className="flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("app.admin.leads.leads.list.filters.title")}:
            </Span>
          </Div>

          <Div className="space-y-4">
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            </Div>

            {/* Second row of filters */}
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                      label: "app.admin.leads.leads.filter.sources.website",
                    },
                    {
                      value: LeadSourceFilter.REFERRAL,
                      label: "app.admin.leads.leads.filter.sources.referral",
                    },
                    {
                      value: LeadSourceFilter.SOCIAL_MEDIA,
                      label:
                        "app.admin.leads.leads.filter.sources.social_media",
                    },
                    {
                      value: LeadSourceFilter.EMAIL_CAMPAIGN,
                      label:
                        "app.admin.leads.leads.filter.sources.email_campaign",
                    },
                    {
                      value: LeadSourceFilter.CSV_IMPORT,
                      label: "app.admin.leads.leads.filter.sources.csv_import",
                    },
                    {
                      value: LeadSourceFilter.API,
                      label: "app.admin.leads.leads.filter.sources.api",
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
                name="sortingOptions.sortBy"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.sort.placeholder",
                  options: [
                    {
                      value: LeadSortField.CREATED_AT,
                      label: "app.admin.leads.leads.sort.created",
                    },
                    {
                      value: LeadSortField.UPDATED_AT,
                      label: "app.admin.leads.leads.sort.updated",
                    },
                    {
                      value: LeadSortField.EMAIL,
                      label: "app.admin.leads.leads.sort.email",
                    },
                    {
                      value: LeadSortField.BUSINESS_NAME,
                      label: "app.admin.leads.leads.sort.business",
                    },
                    {
                      value: LeadSortField.LAST_ENGAGEMENT_AT,
                      label: "app.admin.leads.leads.sort.last_engagement",
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
                name="sortingOptions.sortOrder"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "app.admin.leads.leads.sort.placeholder",
                  options: [
                    {
                      value: SortOrder.DESC,
                      label: "app.admin.leads.leads.sort.desc",
                    },
                    {
                      value: SortOrder.ASC,
                      label: "app.admin.leads.leads.sort.asc",
                    },
                  ],
                }}
                control={leadsEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </Div>

            {/* Quick filter buttons */}
            <Div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {t("app.admin.leads.leads.filter.quick_filters")}:
              </Span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  leadsEndpoint.read.form.setValue("statusFilters.status", [
                    LeadStatusFilter.NEW,
                  ]);
                }}
              >
                {t("app.admin.leads.leads.filter.quick.new_leads")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  leadsEndpoint.read.form.setValue("statusFilters.status", [
                    LeadStatusFilter.CAMPAIGN_RUNNING,
                  ]);
                }}
              >
                {t("app.admin.leads.leads.filter.quick.campaign_running")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  leadsEndpoint.read.form.setValue("statusFilters.source", [
                    LeadSourceFilter.CSV_IMPORT,
                  ]);
                }}
              >
                {t("app.admin.leads.leads.filter.quick.imported")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                {t("app.admin.leads.leads.admin.filters.clear")}
              </Button>
            </Div>

            {/* Form Alert for any filter errors */}
            <FormAlert alert={leadsEndpoint.alert} />
          </Div>
        </Div>

        {/* Batch Operations Toolbar */}
        {viewMode === "table" && leads.length > 0 && (
          <BatchOperationsToolbar
            locale={locale}
            totalCount={
              leadsEndpoint.read.response?.success
                ? leadsEndpoint.read.response.data.response.total
                : leads.length
            }
            currentPage={
              leadsEndpoint.read.form.watch("searchPagination.page") || 1
            }
            pageSize={
              leadsEndpoint.read.form.watch("searchPagination.limit") || 20
            }
            onBatchUpdate={handleBatchUpdate}
            onBatchDelete={handleBatchDelete}
            resetTrigger={resetTrigger}
            isLoading={
              batchOperations.batchUpdateEndpoint.create.isSubmitting ||
              batchOperations.batchDeleteEndpoint.create.isSubmitting
            }
          />
        )}

        {/* Leads Content - List or Table View */}
        {leads.length === 0 ? (
          <Div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {queryLoading ? (
              <Div className="flex items-center justify-center">
                <Div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100 mr-2" />
                {t("app.admin.leads.leads.list.loading")}
              </Div>
            ) : (
              t("app.admin.leads.leads.list.noResults")
            )}
          </Div>
        ) : viewMode === "table" ? (
          <LeadsTable locale={locale} leads={leads} isLoading={queryLoading} />
        ) : (
          <Div className="space-y-3">
            {leads.map((lead) => (
              <Div
                key={lead.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Div className="flex items-center justify-between">
                  <Div className="flex items-center space-x-4">
                    <Div>
                      <Link
                        href={`/${locale}/admin/leads/${lead.id}/edit`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {lead.businessName}
                      </Link>
                      <P className="text-sm text-gray-500 dark:text-gray-400">
                        {lead.email}
                      </P>
                    </Div>
                  </Div>

                  <Div className="flex items-center space-x-4">
                    <Div className="text-right">
                      <Div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {lead.status}
                      </Div>
                      {lead.currentCampaignStage && (
                        <Div className="text-xs text-gray-500 dark:text-gray-400">
                          {lead.currentCampaignStage}
                        </Div>
                      )}
                    </Div>
                  </Div>
                </Div>

                {lead.notes && (
                  <Div className="mt-2">
                    <P className="text-sm text-gray-600 dark:text-gray-300">
                      {lead.notes}
                    </P>
                  </Div>
                )}
              </Div>
            ))}
          </Div>
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
              ? "app.admin.leads.leads.admin.batch.delete_preview_title"
              : "app.admin.leads.leads.admin.batch.preview_title"
            : batchOperations.batchDialogMode === "result"
              ? "app.admin.leads.leads.admin.batch.results.title"
              : batchOperations.operationType === "delete"
                ? "app.admin.leads.leads.admin.batch.delete_confirm.title"
                : "app.admin.leads.leads.admin.batch.confirm.title"
        }
        description={
          batchOperations.batchDialogMode === "preview"
            ? batchOperations.operationType === "delete"
              ? "app.admin.leads.leads.admin.batch.delete_preview_description"
              : "app.admin.leads.leads.admin.batch.preview_description"
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
                  ?.response
              : undefined
            : batchOperations.batchUpdateEndpoint.create.response?.success
              ? batchOperations.batchUpdateEndpoint.create.response.data
                  ?.response
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
