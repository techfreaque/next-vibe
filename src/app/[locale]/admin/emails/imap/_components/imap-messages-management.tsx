/**
 * IMAP Messages Management Component
 * Component for managing IMAP messages with search, filtering, and actions
 * Follows leads/cron patterns - uses useEndpoint for all state management
 */

"use client";

import { Filter, RefreshCw } from 'next-vibe-ui/ui/icons';
import { Div } from "next-vibe-ui/ui/div";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Span } from "next-vibe-ui/ui/span";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { useImapAccountsListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/list/hooks";
import {
  ImapAccountFilter,
  ImapMessageSortField,
  ImapMessageStatusFilter,
  SortOrder,
} from "@/app/api/[locale]/v1/core/emails/imap-client/enum";
import { useImapMessagesListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/messages/list/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import { ImapMessagesTable } from "./imap-messages-table";

/**
 * IMAP Messages Management Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapMessagesManagement(): JSX.Element {
  const { t, locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use endpoints for data management - no local useState
  const messagesEndpoint = useImapMessagesListEndpoint(logger);
  const accountsEndpoint = useImapAccountsListEndpoint(logger);

  // Get data from endpoints
  const apiResponse = messagesEndpoint.read.response;
  const messages = apiResponse?.success ? apiResponse.data.messages : [];
  const totalMessages = apiResponse?.success ? apiResponse.data.total : 0;
  const totalPages = apiResponse?.success ? apiResponse.data.totalPages : 0;
  const queryLoading = messagesEndpoint.read.isLoading || false;

  // Get accounts data for the dropdown
  const accountsResponse = accountsEndpoint.read.response;
  const accounts = accountsResponse?.success
    ? accountsResponse.data.accounts
    : [];

  // Get current form values for pagination display
  const currentPage: number = messagesEndpoint.read.form.getValues("page") || 1;
  const currentLimit: number =
    messagesEndpoint.read.form.getValues("limit") || 20;

  const handleClearFilters = (): void => {
    messagesEndpoint.read.form.reset({
      search: undefined,
      status: ImapMessageStatusFilter.ALL,
      accountId: undefined,
      folderId: undefined,
      page: 1,
      limit: 20,
      sortBy: ImapMessageSortField.SENT_AT,
      sortOrder: SortOrder.DESC,
    });
  };
  return (
    <Div>
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.messages.title", {
            count: totalMessages,
          })}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.messages.description")}
        </P>
      </Div>
      <Div className="space-y-6">
        <Card>
          <CardHeader>
            <Div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <Span>{t("app.admin.emails.imap.admin.messages.filters")}</Span>
              </CardTitle>
              <Div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  {t("app.admin.emails.imap.common.clearFilters")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={messagesEndpoint.read.refetch}
                  disabled={queryLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("app.admin.emails.imap.common.refresh")}
                </Button>
              </Div>
            </Div>
          </CardHeader>
          <CardContent>
            <Div className="space-y-6">
              <FormAlert alert={messagesEndpoint.alert} />

              {/* Filters Grid */}
              <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Account Filter */}
                <EndpointFormField
                  name="accountId"
                  config={{
                    type: "select",
                    label: "app.admin.emails.imap.common.account",
                    placeholder: "app.admin.emails.imap.common.selectAccount",
                    options: [
                      {
                        value: ImapAccountFilter.ALL,
                        label: "app.admin.emails.imap.forms.allAccounts",
                      },
                      ...accounts.map((account) => ({
                        value: account.id,
                        label:
                          "app.admin.emails.imap.common.accountEmail" as const,
                        labelParams: { email: account.email },
                      })),
                    ],
                  }}
                  control={messagesEndpoint.read.form.control}
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
                    label: "app.admin.emails.imap.common.status",
                    options: [
                      {
                        value: ImapMessageStatusFilter.ALL,
                        label: "app.admin.emails.imap.common.all",
                      },
                      {
                        value: ImapMessageStatusFilter.UNREAD,
                        label: "app.admin.emails.imap.messages.unread",
                      },
                      {
                        value: ImapMessageStatusFilter.READ,
                        label: "app.admin.emails.imap.messages.read",
                      },
                      {
                        value: ImapMessageStatusFilter.FLAGGED,
                        label: "app.admin.emails.imap.messages.flagged",
                      },
                      {
                        value: ImapMessageStatusFilter.HAS_ATTACHMENTS,
                        label: "app.admin.emails.imap.messages.withAttachments",
                      },
                    ],
                  }}
                  control={messagesEndpoint.read.form.control}
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
                    label: "app.admin.emails.imap.common.sortBy",
                    options: [
                      {
                        value: ImapMessageSortField.SENT_AT,
                        label: "app.admin.emails.imap.messages.sentAt",
                      },
                      {
                        value: ImapMessageSortField.SUBJECT,
                        label: "app.admin.emails.imap.messages.subject",
                      },
                      {
                        value: ImapMessageSortField.SENDER_EMAIL,
                        label: "app.admin.emails.imap.messages.sender",
                      },
                      {
                        value: ImapMessageSortField.CREATED_AT,
                        label: "app.admin.emails.imap.common.createdAt",
                      },
                    ],
                  }}
                  control={messagesEndpoint.read.form.control}
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
                    label: "app.admin.emails.imap.common.sortOrder",
                    options: [
                      {
                        value: SortOrder.DESC,
                        label: "app.admin.emails.imap.common.newest",
                      },
                      {
                        value: SortOrder.ASC,
                        label: "app.admin.emails.imap.common.oldest",
                      },
                    ],
                  }}
                  control={messagesEndpoint.read.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Div>

              {/* Date Range Filters */}
              <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="dateFrom"
                  config={{
                    type: "date",
                    label: "app.admin.emails.imap.common.dateFrom",
                    placeholder: "app.common.selectDate",
                  }}
                  control={messagesEndpoint.read.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="dateTo"
                  config={{
                    type: "date",
                    label: "app.admin.emails.imap.common.dateTo",
                    placeholder: "app.common.selectDate",
                  }}
                  control={messagesEndpoint.read.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Div>

              {/* Search Bar */}
              <Div className="flex items-center space-x-4">
                <Div className="flex-1">
                  <EndpointFormField
                    name="search"
                    config={{
                      type: "text",
                      label: undefined,
                      placeholder:
                        "app.admin.emails.imap.messages.searchPlaceholder",
                    }}
                    control={messagesEndpoint.read.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </Div>
              </Div>
            </Div>
          </CardContent>
        </Card>

        {/* Messages Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Span>
                {t("app.admin.emails.imap.admin.messages.title", {
                  count: totalMessages,
                })}
              </Span>
              <Div className="text-sm text-muted-foreground">
                {t("app.admin.emails.imap.common.page")} {currentPage}{" "}
                {t("app.admin.emails.imap.common.of")} {totalPages}
              </Div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImapMessagesTable
              messages={messages.map((msg) => ({
                ...msg,
                headers: msg.headers || {},
              }))}
              loading={queryLoading}
            />

            {/* Pagination */}
            {totalMessages > 0 && (
              <Div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Div className="flex items-center justify-between">
                  <Div className="text-sm text-muted-foreground">
                    {t("app.admin.emails.imap.common.showing")}{" "}
                    {(currentPage - 1) * currentLimit + 1}{" "}
                    {t("app.admin.emails.imap.common.to")}{" "}
                    {Math.min(currentPage * currentLimit, totalMessages)}{" "}
                    {t("app.admin.emails.imap.common.of")}{" "}
                    {totalMessages.toLocaleString()}{" "}
                    {t(
                      "app.admin.emails.imap.admin.messages.title",
                    ).toLowerCase()}
                  </Div>
                  <Div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1 || queryLoading}
                      onClick={() => {
                        messagesEndpoint.read.form.setValue(
                          "page",
                          currentPage - 1,
                        );
                      }}
                    >
                      {t("app.admin.emails.imap.common.previous")}
                    </Button>
                    <Span className="text-sm">
                      {currentPage} / {totalPages}
                    </Span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages || queryLoading}
                      onClick={() => {
                        messagesEndpoint.read.form.setValue(
                          "page",
                          currentPage + 1,
                        );
                      }}
                    >
                      {t("app.admin.emails.imap.common.next")}
                    </Button>
                  </Div>
                </Div>
              </Div>
            )}
          </CardContent>
        </Card>

        {/* Message Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("app.admin.emails.imap.admin.messages.statistics")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Div className="text-center">
                <Div className="text-2xl font-bold">
                  {totalMessages.toLocaleString()}
                </Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.dashboard.totalMessages")}
                </Div>
              </Div>
              <Div className="text-center">
                <Div className="text-2xl font-bold text-blue-600">
                  {messages
                    .filter((msg) => !msg.isRead)
                    .length.toLocaleString()}
                </Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.messages.unread")}
                </Div>
              </Div>
              <Div className="text-center">
                <Div className="text-2xl font-bold text-yellow-600">
                  {messages
                    .filter((msg) => msg.isFlagged)
                    .length.toLocaleString()}
                </Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.messages.flagged")}
                </Div>
              </Div>
              <Div className="text-center">
                <Div className="text-2xl font-bold text-green-600">
                  {messages
                    .filter((msg) => msg.hasAttachments)
                    .length.toLocaleString()}
                </Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.messages.withAttachments")}
                </Div>
              </Div>
            </Div>
          </CardContent>
        </Card>
      </Div>
    </Div>
  );
}
