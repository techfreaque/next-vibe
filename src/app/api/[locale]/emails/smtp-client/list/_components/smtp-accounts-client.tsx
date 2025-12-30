/**
 * SMTP Accounts Client Component
 * Client-side SMTP accounts list with filtering, sorting, and pagination following leads patterns
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import {
  Filter,
  List,
  Plus,
  RefreshCw,
  Table,
  Users,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useState } from "react";

import { SortOrder } from "@/app/api/[locale]/emails/messages/enum";
import {
  CampaignTypeFilter,
  SmtpAccountSortField,
  SmtpAccountStatusFilter,
  SmtpHealthStatusFilter,
} from "@/app/api/[locale]/emails/smtp-client/enum";
import type { SmtpAccountsListGETResponseOutput } from "@/app/api/[locale]/emails/smtp-client/list/definition";
import smtpListDefinitions from "@/app/api/[locale]/emails/smtp-client/list/definition";
import { useSmtpAccountsListEndpoint } from "@/app/api/[locale]/emails/smtp-client/list/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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
  const logger = createEndpointLogger(false, Date.now(), locale);
  const smtpAccountsEndpoint = useSmtpAccountsListEndpoint(logger);
  const [viewMode, setViewMode] = useState<"list" | "table">("list");

  const apiResponse = smtpAccountsEndpoint.read?.response;
  const accounts: SmtpAccountsListGETResponseOutput["accounts"] =
    apiResponse?.success ? apiResponse.data.accounts : [];
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
      campaignType: CampaignTypeFilter.ANY,
      status: SmtpAccountStatusFilter.ANY,
      healthStatus: SmtpHealthStatusFilter.ANY,
      page: 1,
      limit: 20,
      sortBy: SmtpAccountSortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });
  };

  return (
    <Card>
      <CardHeader>
        <Div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {t("app.admin.emails.smtp.list.titleWithCount", {
              count: totalAccounts,
            })}
          </CardTitle>
          <Div className="flex items-center flex flex-row gap-2">
            {/* View Mode Toggle */}
            <Div className="flex items-center border rounded-lg">
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

            {/* Create Account */}
            <Button asChild>
              <Link href={`/${locale}/admin/emails/smtp/create`}>
                <Plus className="h-4 w-4 mr-2" />
                {t("app.admin.emails.smtp.list.actions.create")}
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
          </Div>
        </Div>
      </CardHeader>
      <CardContent>
        {/* Filter Form */}
        <Div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Div className="flex items-center flex flex-row gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("app.admin.emails.smtp.list.filters.title")}:
            </Span>
          </Div>

          <Form form={smtpAccountsEndpoint.read?.form}>
            <Div className="flex flex-col gap-4">
              <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Search Field */}
                <EndpointFormField
                  name="search"
                  control={smtpAccountsEndpoint.read?.form.control}
                  endpoint={smtpListDefinitions.GET}
                  locale={locale}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Purpose Filter */}
                <EndpointFormField
                  name="campaignType"
                  control={smtpAccountsEndpoint.read?.form.control}
                  endpoint={smtpListDefinitions.GET}
                  locale={locale}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Status Filter */}
                <EndpointFormField
                  name="status"
                  control={smtpAccountsEndpoint.read?.form.control}
                  endpoint={smtpListDefinitions.GET}
                  locale={locale}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Health Status Filter */}
                <EndpointFormField
                  name="healthStatus"
                  control={smtpAccountsEndpoint.read?.form.control}
                  endpoint={smtpListDefinitions.GET}
                  locale={locale}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Div>

              <Div className="flex justify-between items-center mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                >
                  {t("app.admin.emails.smtp.list.actions.clearFilters")}
                </Button>

                <Div className="flex items-center flex flex-row gap-2">
                  <Span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("app.admin.emails.smtp.list.results.showing", {
                      start: (currentPage - 1) * currentLimit + 1,
                      end: Math.min(currentPage * currentLimit, totalAccounts),
                      total: totalAccounts,
                    })}
                  </Span>
                </Div>
              </Div>
            </Div>
          </Form>
        </Div>

        {/* SMTP Accounts Content - List or Table View */}
        {accounts.length === 0 ? (
          <Div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {queryLoading ? (
              <Div className="flex items-center justify-center">
                <Div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100 mr-2" />
                {t("app.admin.emails.smtp.list.loading")}
              </Div>
            ) : (
              <Div>
                <P>{t("app.admin.emails.smtp.list.noResults")}</P>
                <Link href={`/${locale}/admin/emails/smtp/create`}>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("app.admin.emails.smtp.list.actions.createFirst")}
                  </Button>
                </Link>
              </Div>
            )}
          </Div>
        ) : viewMode === "table" ? (
          <SmtpAccountsTable
            locale={locale}
            accounts={accounts}
            isLoading={queryLoading}
          />
        ) : (
          <Div className="flex flex-col gap-3">
            {accounts.map((account) => (
              <Div
                key={account.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Div className="flex items-center justify-between">
                  <Div className="flex items-center flex flex-row gap-4">
                    <Div>
                      <Link
                        href={`/${locale}/admin/emails/smtp/edit/${account.id}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {account.name}
                      </Link>
                      <P className="text-sm text-gray-500 dark:text-gray-400">
                        {account.id.slice(0, 13)}...
                      </P>
                    </Div>
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Div className="flex justify-center mt-6">
            <Div className="flex items-center flex flex-row gap-2">
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
                {t("app.admin.emails.smtp.list.pagination.previous")}
              </Button>
              <Span className="text-sm text-gray-600 dark:text-gray-400">
                {t("app.admin.emails.smtp.list.pagination.pageOf", {
                  current: currentPage,
                  total: totalPages,
                })}
              </Span>
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
                {t("app.admin.emails.smtp.list.pagination.next")}
              </Button>
            </Div>
          </Div>
        )}
      </CardContent>
    </Card>
  );
}
