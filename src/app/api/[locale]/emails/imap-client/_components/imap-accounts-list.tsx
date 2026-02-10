/**
 * IMAP Accounts List Component
 * Component for displaying and managing IMAP accounts list
 * Follows leads/cron patterns - no useState, all state through useEndpoint
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import type { JSX } from "react";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import imapAccountsListDefinitions, {
  type ImapAccountsListResponseOutput,
} from "../accounts/list/definition";
import imapAccountTestDefinition from "../accounts/test/definition";
import { ImapSyncStatus, type ImapSyncStatusValue } from "../enum";

interface ImapAccountsListProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

/**
 * IMAP Accounts List Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapAccountsList({
  locale,
  user,
}: ImapAccountsListProps): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const logger = createEndpointLogger(false, Date.now(), locale);

  // All state managed through useEndpoint - no local useState
  const accountsEndpoint = useEndpoint(
    imapAccountsListDefinitions,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 1 * 60 * 1000, // 1 minute
        },
        initialState: {
          page: 1,
          limit: 20,
        },
      },
    },
    logger,
    user,
  );
  const testEndpoint = useEndpoint(
    imapAccountTestDefinition,
    undefined,
    logger,
    user,
  );

  // Access data through the read operation following leads pattern
  // Discriminated union allows TypeScript to infer read is defined
  const apiResponse = accountsEndpoint.read.response;
  let accounts: ImapAccountsListResponseOutput["accounts"] = [];
  let totalAccounts = 0;
  if (apiResponse && apiResponse.success === true) {
    accounts = apiResponse.data.accounts;
    totalAccounts = apiResponse.data.pagination.total;
  }
  const queryLoading = accountsEndpoint.read.isLoading || false;
  const queryError = accountsEndpoint.read.error;

  // Get form for search and pagination state
  const form = accountsEndpoint.read.form;
  const searchValue = form.watch("search") || "";
  const currentPage = form.watch("page") || 1;
  const limit = form.watch("limit") || 20;

  const getStatusBadge = (status: typeof ImapSyncStatusValue): JSX.Element => {
    switch (status) {
      case ImapSyncStatus.SYNCED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t("app.admin.emails.imap.account.status.connected")}
          </Badge>
        );
      case ImapSyncStatus.SYNCING:
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            {t("app.admin.emails.imap.account.status.syncing")}
          </Badge>
        );
      case ImapSyncStatus.ERROR:
        return (
          <Badge variant="destructive">
            {t("app.admin.emails.imap.account.status.error")}
          </Badge>
        );
      case ImapSyncStatus.PENDING:
        return (
          <Badge variant="secondary">
            {t("app.admin.emails.imap.account.status.pending")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("app.admin.emails.imap.account.status.disconnected")}
          </Badge>
        );
    }
  };

  if (queryLoading) {
    return <Div>{t("app.admin.emails.imap.common.loading")}</Div>;
  }

  if (queryError) {
    return (
      <Div>
        {t("app.admin.emails.imap.account.list_error", {
          error: queryError.message,
        })}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {/* Search and Filters */}
      <Div className="items-center flex flex-row gap-4">
        <Input
          placeholder={t("app.admin.emails.imap.account.search_placeholder")}
          value={searchValue}
          onChange={(e) => form?.setValue("search", e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => accountsEndpoint.read?.refetch()}
        >
          {t("app.admin.emails.imap.common.refresh")}
        </Button>
      </Div>

      {/* Accounts Table */}
      <Div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t("app.admin.emails.imap.account.table.name")}
              </TableHead>
              <TableHead>
                {t("app.admin.emails.imap.account.table.email")}
              </TableHead>
              <TableHead>
                {t("app.admin.emails.imap.account.table.host")}
              </TableHead>
              <TableHead>
                {t("app.admin.emails.imap.account.table.status")}
              </TableHead>
              <TableHead>
                {t("app.admin.emails.imap.account.table.last_sync")}
              </TableHead>
              <TableHead>
                {t("app.admin.emails.imap.account.table.max_messages")}
              </TableHead>
              <TableHead>
                {t("app.admin.emails.imap.account.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchValue
                    ? t("app.admin.emails.imap.account.no_results")
                    : t("app.admin.emails.imap.account.no_accounts")}
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.host}</TableCell>
                  <TableCell>{getStatusBadge(account.syncStatus)}</TableCell>
                  <TableCell>
                    {account.lastSyncAt
                      ? new Date(account.lastSyncAt).toLocaleString()
                      : t("app.admin.emails.imap.dashboard.never")}
                  </TableCell>
                  <TableCell>{account.maxMessages}</TableCell>
                  <TableCell>
                    <Div className="flex items-center flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(
                            `/admin/emails/imap/accounts/${account.id}/edit`,
                          );
                        }}
                      >
                        {t("app.admin.emails.imap.common.edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          testEndpoint.create.form.setValue(
                            "accountId",
                            account.id,
                          );
                          await testEndpoint.create.onSubmit();
                        }}
                      >
                        {t("app.admin.emails.imap.account.test")}
                      </Button>
                    </Div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Div>

      {/* Pagination */}
      {totalAccounts > 0 && (
        <Div className="flex items-center justify-between">
          <Div className="text-sm text-gray-600">
            {t("app.admin.emails.imap.account.pagination.showing", {
              start: (currentPage - 1) * limit + 1,
              end: Math.min(currentPage * limit, totalAccounts),
              total: totalAccounts,
            })}
          </Div>
          <Div className="flex items-center flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => form?.setValue("page", currentPage - 1)}
            >
              {t("app.admin.emails.imap.common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * limit >= totalAccounts}
              onClick={() => form?.setValue("page", currentPage + 1)}
            >
              {t("app.admin.emails.imap.common.next")}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
