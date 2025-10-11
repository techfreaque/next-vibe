/**
 * SMTP Accounts Client Component
 * Client-side SMTP accounts list with filtering, sorting, and pagination following leads patterns
 */

"use client";

import { Filter, List, Plus, RefreshCw, Table, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Form } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import React, { useState } from "react";

import { SortOrder } from "@/app/api/[locale]/v1/core/emails/messages/enum";
import {
  CampaignTypeFilter,
  SmtpAccountSortField,
  SmtpAccountStatusFilter,
  SmtpHealthStatusFilter,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import { useSmtpAccountsListEndpoint } from "@/app/api/[locale]/v1/core/emails/smtp-client/list/hooks";
import type { SmtpAccountResponseType } from "@/app/api/[locale]/v1/core/emails/smtp-client/schema";
import { smtpAccountListFilterSchema } from "@/app/api/[locale]/v1/core/emails/smtp-client/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { SmtpAccountsTable } from "./smtp-accounts-table";

interface SmtpAccountsClientProps {
  locale: CountryLanguage;
}

export function SmtpAccountsClient({
  locale,
}: SmtpAccountsClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const smtpAccountsEndpoint = useSmtpAccountsListEndpoint();
  const [viewMode, setViewMode] = useState<"list" | "table">("list");

  const apiResponse = smtpAccountsEndpoint.read.response;
  const accounts: SmtpAccountResponseType[] = apiResponse?.success
    ? apiResponse.data.accounts
    : [];
  const totalAccounts = apiResponse?.success
    ? apiResponse.data.pagination.total
    : 0;
  const totalPages = apiResponse?.success
    ? apiResponse.data.pagination.totalPages
    : 0;
  const queryLoading = smtpAccountsEndpoint.read.isLoading || false;

  // Get current form values for pagination display
  const currentPage = smtpAccountsEndpoint.read.form.getValues("page") || 1;
  const currentLimit = smtpAccountsEndpoint.read.form.getValues("limit") || 20;

  const handleClearFilters = (): void => {
    smtpAccountsEndpoint.read.form.reset({
      search: undefined,
      campaignType: CampaignTypeFilter.ALL,
      status: SmtpAccountStatusFilter.ALL,
      healthStatus: SmtpHealthStatusFilter.ALL,
      page: 1,
      limit: 20,
      sortBy: SmtpAccountSortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {t("smtp.list.titleWithCount", { count: totalAccounts })}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg">
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

            {/* Create Account */}
            <Button asChild>
              <Link href={`/${locale}/admin/emails/smtp/create`}>
                <Plus className="h-4 w-4 mr-2" />
                {t("smtp.list.actions.create")}
              </Link>
            </Button>

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={smtpAccountsEndpoint.read.refetch}
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
              {t("smtp.list.filters.title")}:
            </span>
          </div>

          <Form
            form={smtpAccountsEndpoint.read.form}
            onSubmit={() => {}}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Search Field */}
              <EndpointFormField
                name="search"
                config={{
                  type: "text",
                  label: undefined,
                  placeholder: "smtp.search.placeholder",
                }}
                control={smtpAccountsEndpoint.read.form.control}
                schema={smtpAccountListFilterSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Purpose Filter */}
              <EndpointFormField
                name="campaignType"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "smtp.admin.fields.campaignTypes" as const,
                  options: [
                    {
                      value: CampaignTypeFilter.ALL,
                      label: "common.all" as const,
                    },
                    {
                      value: CampaignTypeFilter.LEAD_CAMPAIGN,
                      label: "smtp.admin.campaignTypes.leadCampaign" as const,
                    },
                    {
                      value: CampaignTypeFilter.NEWSLETTER,
                      label: "smtp.admin.campaignTypes.newsletter" as const,
                    },
                    {
                      value: CampaignTypeFilter.TRANSACTIONAL,
                      label: "smtp.admin.campaignTypes.transactional" as const,
                    },
                    {
                      value: CampaignTypeFilter.NOTIFICATION,
                      label: "smtp.admin.campaignTypes.notification" as const,
                    },
                    {
                      value: CampaignTypeFilter.SYSTEM,
                      label: "smtp.admin.campaignTypes.system" as const,
                    },
                  ],
                }}
                control={smtpAccountsEndpoint.read.form.control}
                schema={smtpAccountListFilterSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Status Filter */}
              <EndpointFormField
                name="status"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "smtp.filter.status.placeholder",
                  options: [
                    {
                      value: SmtpAccountStatusFilter.ALL,
                      label: "smtp.filter.status.all",
                    },
                    {
                      value: SmtpAccountStatusFilter.ACTIVE,
                      label: "smtp.filter.status.active",
                    },
                    {
                      value: SmtpAccountStatusFilter.INACTIVE,
                      label: "smtp.filter.status.inactive",
                    },
                    {
                      value: SmtpAccountStatusFilter.ERROR,
                      label: "smtp.filter.status.error",
                    },
                    {
                      value: SmtpAccountStatusFilter.TESTING,
                      label: "smtp.filter.status.testing",
                    },
                  ],
                }}
                control={smtpAccountsEndpoint.read.form.control}
                schema={smtpAccountListFilterSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Health Status Filter */}
              <EndpointFormField
                name="healthStatus"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "smtp.filter.health.placeholder",
                  options: [
                    {
                      value: SmtpHealthStatusFilter.ALL,
                      label: "smtp.filter.health.all",
                    },
                    {
                      value: SmtpHealthStatusFilter.HEALTHY,
                      label: "smtp.filter.health.healthy",
                    },
                    {
                      value: SmtpHealthStatusFilter.DEGRADED,
                      label: "smtp.filter.health.degraded",
                    },
                    {
                      value: SmtpHealthStatusFilter.UNHEALTHY,
                      label: "smtp.filter.health.unhealthy",
                    },
                    {
                      value: SmtpHealthStatusFilter.UNKNOWN,
                      label: "smtp.filter.health.unknown",
                    },
                  ],
                }}
                control={smtpAccountsEndpoint.read.form.control}
                schema={smtpAccountListFilterSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                {t("smtp.list.actions.clearFilters")}
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("smtp.list.results.showing", {
                    start: (currentPage - 1) * currentLimit + 1,
                    end: Math.min(currentPage * currentLimit, totalAccounts),
                    total: totalAccounts,
                  })}
                </span>
              </div>
            </div>
          </Form>
        </div>

        {/* SMTP Accounts Content - List or Table View */}
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {queryLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100 mr-2" />
                {t("smtp.list.loading")}
              </div>
            ) : (
              <div>
                <p>{t("smtp.list.noResults")}</p>
                <Link href={`/${locale}/admin/emails/smtp/create`}>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("smtp.list.actions.createFirst")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : viewMode === "table" ? (
          <SmtpAccountsTable
            locale={locale}
            accounts={accounts}
            isLoading={queryLoading}
          />
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <Link
                        href={`/${locale}/admin/emails/smtp/edit/${account.id}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {account.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {account.host}:{account.port}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() =>
                  smtpAccountsEndpoint.read.form.setValue(
                    "page",
                    currentPage - 1,
                  )
                }
              >
                {t("smtp.list.pagination.previous")}
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("smtp.list.pagination.pageOf", {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  smtpAccountsEndpoint.read.form.setValue(
                    "page",
                    currentPage + 1,
                  )
                }
              >
                {t("smtp.list.pagination.next")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
