/**
 * IMAP Accounts List Component
 * Component for displaying and managing IMAP accounts list
 * Follows leads/cron patterns - no useState, all state through useEndpoint
 */

"use client";

import { useRouter } from "next/navigation";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
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

import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useTranslation } from "@/i18n/core/client";

import imapAccountsListDefinition from "../../../../../api/[locale]/v1/core/emails/imap-client/accounts/list/definition";
import imapAccountTestDefinition from "../../../../../api/[locale]/v1/core/emails/imap-client/accounts/test/definition";
import { ImapSyncStatus } from "../../../../../api/[locale]/v1/core/emails/imap-client/enum";

/**
 * IMAP Accounts List Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapAccountsList(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  // All state managed through useEndpoint - no local useState
  const accountsEndpoint = useEndpoint(imapAccountsListDefinition, {
    queryOptions: {
      enabled: true,
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000, // 1 minute
    },
    filterOptions: {
      initialFilters: {
        page: 1,
        limit: 20,
      },
    },
  });
  const testEndpoint = useEndpoint(imapAccountTestDefinition);

  // Access data through the read operation following leads pattern
  const apiResponse = accountsEndpoint.read.response;
  const accounts = apiResponse?.success ? apiResponse.data.accounts : [];
  const totalAccounts = apiResponse?.success ? apiResponse.data.total : 0;
  const queryLoading = accountsEndpoint.read.isLoading || false;
  const queryError = accountsEndpoint.read.error;

  // Get form for search and pagination state
  const form = accountsEndpoint.read.form;
  const searchValue = form?.watch("search") || "";
  const currentPage = form?.watch("page") || 1;
  const limit = form?.watch("limit") || 20;

  const getStatusBadge = (status: ImapSyncStatus): JSX.Element => {
    switch (status) {
      case ImapSyncStatus.SYNCED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t("imap.account.status.connected")}
          </Badge>
        );
      case ImapSyncStatus.SYNCING:
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            {t("imap.account.status.syncing")}
          </Badge>
        );
      case ImapSyncStatus.ERROR:
        return (
          <Badge variant="destructive">{t("imap.account.status.error")}</Badge>
        );
      case ImapSyncStatus.PENDING:
        return (
          <Badge variant="secondary">{t("imap.account.status.pending")}</Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("imap.account.status.disconnected")}
          </Badge>
        );
    }
  };

  if (queryLoading) {
    return <div>{t("imap.common.loading")}</div>;
  }

  if (queryError) {
    return (
      <div>{t("imap.account.list_error", { error: queryError.message })}</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder={t("imap.account.search_placeholder")}
          value={searchValue}
          onChange={(e) => form?.setValue("search", e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => accountsEndpoint.read?.refetch?.()}
        >
          {t("imap.common.refresh")}
        </Button>
      </div>

      {/* Accounts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("imap.account.table.name")}</TableHead>
              <TableHead>{t("imap.account.table.email")}</TableHead>
              <TableHead>{t("imap.account.table.host")}</TableHead>
              <TableHead>{t("imap.account.table.status")}</TableHead>
              <TableHead>{t("imap.account.table.last_sync")}</TableHead>
              <TableHead>{t("imap.account.table.max_messages")}</TableHead>
              <TableHead>{t("imap.account.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchValue
                    ? t("imap.account.no_results")
                    : t("imap.account.no_accounts")}
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
                      : t("imap.dashboard.never")}
                  </TableCell>
                  <TableCell>{account.maxMessages}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(
                            `/admin/emails/imap/accounts/${account.id}/edit`,
                          );
                        }}
                      >
                        {t("imap.common.edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          testEndpoint.create.form.setValue(
                            "accountId",
                            account.id,
                          );
                          await testEndpoint.create.submitForm(undefined);
                        }}
                      >
                        {t("imap.account.test")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalAccounts > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {t("imap.account.pagination.showing", {
              start: (currentPage - 1) * limit + 1,
              end: Math.min(currentPage * limit, totalAccounts),
              total: totalAccounts,
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => form?.setValue("page", currentPage - 1)}
            >
              {t("imap.common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * limit >= totalAccounts}
              onClick={() => form?.setValue("page", currentPage + 1)}
            >
              {t("imap.common.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
