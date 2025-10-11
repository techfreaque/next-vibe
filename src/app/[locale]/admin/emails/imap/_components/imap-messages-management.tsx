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
import { imapMessageQuerySchema } from "@/app/api/[locale]/v1/core/emails/imap-client/schema";
import { useTranslation } from "@/i18n/core/client";

import { ImapMessagesTable } from "./imap-messages-table";

/**
 * IMAP Messages Management Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapMessagesManagement(): JSX.Element {
  const { t } = useTranslation();

  // Use endpoints for data management - no local useState
  const messagesEndpoint = useImapMessagesListEndpoint();
  const accountsEndpoint = useImapAccountsListEndpoint();

  // Get data from endpoints
  const apiResponse = messagesEndpoint.read?.response;
  const messages = apiResponse?.success ? apiResponse.data.messages : [];
  const totalMessages = apiResponse?.success ? apiResponse.data.total : 0;
  const totalPages = apiResponse?.success ? apiResponse.data.totalPages : 0;
  const queryLoading = messagesEndpoint.read?.isLoading || false;

  // Get accounts data for the dropdown
  const accountsResponse = accountsEndpoint.read?.response;
  const accounts = accountsResponse?.success
    ? accountsResponse.data.accounts
    : [];

  // Get current form values for pagination display
  const currentPage = messagesEndpoint.read?.form.getValues("page") || 1;
  const currentLimit = messagesEndpoint.read?.form.getValues("limit") || 20;

  const handleClearFilters = (): void => {
    messagesEndpoint.read?.form.reset({
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
          {t("imap.admin.messages.title", {
            count: totalMessages,
          })}
        </h1>
        <p className="text-muted-foreground">
          {t("imap.admin.messages.description")}
        </p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>{t("imap.admin.messages.filters")}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  {t("imap.common.clearFilters")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={messagesEndpoint.read.refetch}
                  disabled={queryLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("common.refresh")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form
              form={messagesEndpoint.read?.form}
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
                    label: "imap.common.account",
                    placeholder: "imap.common.selectAccount",
                    options: [
                      {
                        value: ImapAccountFilter.ALL,
                        label: "imap.forms.allAccounts",
                      },
                      ...accounts.map((account) => ({
                        value: account.id,
                        label: "imap.common.accountEmail" as const,
                        labelParams: { email: account.email },
                      })),
                    ],
                  }}
                  control={messagesEndpoint.read?.form.control}
                  schema={imapMessageQuerySchema}
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
                    label: "imap.common.status",
                    options: [
                      {
                        value: ImapMessageStatusFilter.ALL,
                        label: "imap.common.all",
                      },
                      {
                        value: ImapMessageStatusFilter.UNREAD,
                        label: "imap.messages.unread",
                      },
                      {
                        value: ImapMessageStatusFilter.READ,
                        label: "imap.messages.read",
                      },
                      {
                        value: ImapMessageStatusFilter.FLAGGED,
                        label: "imap.messages.flagged",
                      },
                      {
                        value: ImapMessageStatusFilter.HAS_ATTACHMENTS,
                        label: "imap.messages.withAttachments",
                      },
                    ],
                  }}
                  control={messagesEndpoint.read?.form.control}
                  schema={imapMessageQuerySchema}
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
                    label: "imap.common.sortBy",
                    options: [
                      {
                        value: ImapMessageSortField.SENT_AT,
                        label: "imap.messages.sentAt",
                      },
                      {
                        value: ImapMessageSortField.SUBJECT,
                        label: "imap.messages.subject",
                      },
                      {
                        value: ImapMessageSortField.SENDER_EMAIL,
                        label: "imap.messages.sender",
                      },
                      {
                        value: ImapMessageSortField.CREATED_AT,
                        label: "imap.common.createdAt",
                      },
                    ],
                  }}
                  control={messagesEndpoint.read?.form.control}
                  schema={imapMessageQuerySchema}
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
                    label: "imap.common.sortOrder",
                    options: [
                      { value: SortOrder.DESC, label: "imap.common.newest" },
                      { value: SortOrder.ASC, label: "imap.common.oldest" },
                    ],
                  }}
                  control={messagesEndpoint.read?.form.control}
                  schema={imapMessageQuerySchema}
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
                    label: "imap.common.dateFrom",
                    placeholder: "common.selectDate",
                  }}
                  control={messagesEndpoint.read?.form.control}
                  schema={imapMessageQuerySchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="dateTo"
                  config={{
                    type: "date",
                    label: "imap.common.dateTo",
                    placeholder: "common.selectDate",
                  }}
                  control={messagesEndpoint.read?.form.control}
                  schema={imapMessageQuerySchema}
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
                      placeholder: "imap.messages.searchPlaceholder",
                    }}
                    control={messagesEndpoint.read?.form.control}
                    schema={imapMessageQuerySchema}
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
                {t("imap.admin.messages.title", { count: totalMessages })}
              </span>
              <div className="text-sm text-muted-foreground">
                {t("imap.common.page")} {currentPage} {t("imap.common.of")}{" "}
                {totalPages}
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
                    {t("imap.common.showing")}{" "}
                    {(currentPage - 1) * currentLimit + 1} {t("imap.common.to")}{" "}
                    {Math.min(currentPage * currentLimit, totalMessages)}{" "}
                    {t("imap.common.of")} {totalMessages.toLocaleString()}{" "}
                    {t("imap.admin.messages.title").toLowerCase()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1 || queryLoading}
                      onClick={() => {
                        messagesEndpoint.read?.form.setValue(
                          "page",
                          currentPage - 1,
                        );
                      }}
                    >
                      {t("imap.common.previous")}
                    </Button>
                    <span className="text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages || queryLoading}
                      onClick={() => {
                        messagesEndpoint.read?.form.setValue(
                          "page",
                          currentPage + 1,
                        );
                      }}
                    >
                      {t("imap.common.next")}
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
            <CardTitle>{t("imap.admin.messages.statistics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {totalMessages.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("imap.dashboard.totalMessages")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {messages
                    .filter((msg) => !msg.isRead)
                    .length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("imap.messages.unread")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {messages
                    .filter((msg) => msg.isFlagged)
                    .length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("imap.messages.flagged")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {messages
                    .filter((msg) => msg.hasAttachments)
                    .length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t("imap.messages.withAttachments")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
