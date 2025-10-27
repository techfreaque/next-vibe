/**
 * IMAP Messages Management Component
 * Component for managing IMAP messages with search, filtering, and actions
 * Follows leads/cron patterns - uses useEndpoint for all state management
 */

"use client";

import { Filter, RefreshCw } from "lucide-react";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";

import { useImapAccountsListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/list/hooks";
import {
  ImapAccountFilter,
  ImapMessageSortField,
  ImapMessageStatusFilter,
  SortOrder,
} from "@/app/api/[locale]/v1/core/emails/imap-client/enum";
import { useImapMessagesListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/messages/list/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.messages.title", {
            count: totalMessages,
          })}
        </h1>
        <p className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.messages.description")}
        </p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>{t("app.admin.emails.imap.admin.messages.filters")}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form
              form={messagesEndpoint.read.form}
              onSubmit={() => {}}
              className="space-y-6"
            >
              <FormAlert alert={messagesEndpoint.alert} />

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              </div>

              {/* Date Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Search Bar */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
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
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Messages Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {t("app.admin.emails.imap.admin.messages.title", {
                  count: totalMessages,
                })}
              </span>
              <div className="text-sm text-muted-foreground">
                {t("app.admin.emails.imap.common.page")} {currentPage}{" "}
                {t("app.admin.emails.imap.common.of")} {totalPages}
              </div>
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
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {t("app.admin.emails.imap.common.showing")}{" "}
                    {(currentPage - 1) * currentLimit + 1}{" "}
                    {t("app.admin.emails.imap.common.to")}{" "}
                    {Math.min(currentPage * currentLimit, totalMessages)}{" "}
                    {t("app.admin.emails.imap.common.of")}{" "}
                    {totalMessages.toLocaleString()}{" "}
                    {t(
                      "app.admin.emails.imap.admin.messages.title",
                    ).toLowerCase()}
                  </div>
                  <div className="flex items-center space-x-2">
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
                    <span className="text-sm">
                      {currentPage} / {totalPages}
                    </span>
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
                  </div>
                </div>
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {totalMessages.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.dashboard.totalMessages")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {messages
                    .filter((msg) => !msg.isRead)
                    .length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.messages.unread")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {messages
                    .filter((msg) => msg.isFlagged)
                    .length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.messages.flagged")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {messages
                    .filter((msg) => msg.hasAttachments)
                    .length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.messages.withAttachments")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
