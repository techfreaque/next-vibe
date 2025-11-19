/**
 * Emails List Client Component
 * Client-side emails list with filtering, sorting, and pagination using form-based filtering
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Filter, Mail, RefreshCw } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type React from "react";

import type { EmailsListResponseType } from "@/app/api/[locale]/v1/core/emails/messages/list/definition";
import { useEmailMessagesList } from "@/app/api/[locale]/v1/core/emails/messages/list/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EmailsListFilters } from "./emails-list-filters";
import { EmailsListPagination } from "./emails-list-pagination";
import { EmailsListTable } from "./emails-list-table";

interface EmailsListClientProps {
  locale: CountryLanguage;
}

export function EmailsListClient({
  locale,
}: EmailsListClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const emailsEndpoint = useEmailMessagesList(logger);

  const apiResponse = emailsEndpoint.read?.response;
  const emails: EmailsListResponseType["emails"] = apiResponse?.success
    ? apiResponse.data.emails
    : [];
  const totalEmails = apiResponse?.success
    ? apiResponse.data.pagination.total
    : 0;
  const totalPages = apiResponse?.success
    ? apiResponse.data.pagination.totalPages
    : 0;
  const queryLoading = emailsEndpoint.read?.isLoading || false;

  // Get current form values for pagination display
  const currentPage =
    emailsEndpoint.read?.form.getValues("displayOptions.page") || 1;
  const currentLimit =
    emailsEndpoint.read?.form.getValues("displayOptions.limit") || 20;

  return (
    <Card>
      <CardHeader>
        <Div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            {t("app.admin.emails.list.admin.title")} {totalEmails}
          </CardTitle>

          <Div className="flex items-center flex flex-row gap-2">
            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={emailsEndpoint.read.refetch}
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
              {t("app.admin.emails.list.admin.filters.title")}:
            </Span>
          </Div>

          <Div className="flex flex-col gap-4">
            <EmailsListFilters
              form={emailsEndpoint.read.form}
              locale={locale}
            />
          </Div>
        </Div>

        {/* Results */}
        <EmailsListTable
          emails={emails}
          loading={queryLoading}
          locale={locale}
        />

        {/* Pagination */}
        <EmailsListPagination
          currentPage={currentPage}
          currentLimit={currentLimit}
          totalEmails={totalEmails}
          totalPages={totalPages}
          form={emailsEndpoint.read.form}
          locale={locale}
        />
      </CardContent>
    </Card>
  );
}
