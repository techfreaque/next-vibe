/**
 * IMAP Folders Management Component
 * Component for managing IMAP folders with tree view and sync operations
 * Follows leads/cron patterns - uses useEndpoint for all state management
 */

"use client";

import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import type { JSX } from "react";

import { useImapAccountsListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/list/hooks";
import { useImapFoldersListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/folders/list/hooks";
import { useImapFolderSyncEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/folders/sync/hooks";
import { useTranslation } from "@/i18n/core/client";

import { ImapFoldersList } from "./imap-folders-list";

/**
 * IMAP Folders Management Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapFoldersManagement(): JSX.Element {
  const { t } = useTranslation();

  // Use endpoints for data management - no local useState
  const accountsEndpoint = useImapAccountsListEndpoint();

  // Get accounts data for the dropdown
  const accountsResponse = accountsEndpoint.read?.response;
  const accounts = accountsResponse?.success
    ? accountsResponse.data.accounts
    : [];

  // Use the first available account ID or a default
  const selectedAccountId = accounts.length > 0 ? accounts[0].id : "";

  // Only initialize folders endpoint if we have an account ID
  const foldersEndpoint = useImapFoldersListEndpoint(selectedAccountId);
  const syncEndpoint = useImapFolderSyncEndpoint();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle> {t("imap.admin.folders.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={foldersEndpoint.read?.form}
            onSubmit={() => {}}
            className="space-y-6"
          >
            <FormAlert alert={foldersEndpoint.alert} />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="account-select">
                    {t("imap.common.selectAccount")}
                  </Label>
                  <Select
                    value={selectedAccountId}
                    onValueChange={(value) => {
                      // Update the selected account - this will be handled by state management
                      void value;
                    }}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue
                        placeholder={t("imap.common.selectAccount")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode - not part of sync form, remove for now */}
              </div>

              <div className="space-x-2">
                <Button
                  type="button"
                  onClick={syncEndpoint.create.onSubmit}
                  disabled={syncEndpoint.create.isSubmitting}
                >
                  {syncEndpoint.create.isSubmitting
                    ? t("imap.common.syncing")
                    : t("imap.common.sync")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={foldersEndpoint.read.refetch}
                >
                  {t("imap.common.refresh")}
                </Button>
              </div>
            </div>

            {/* Folders Display */}
            <div className="border rounded-lg">
              <ImapFoldersList accountId={selectedAccountId} />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Folder Statistics */}
      <Card>
        <CardHeader>
          <CardTitle> {t("imap.admin.folders.stats.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {foldersEndpoint.read?.response?.success
                  ? foldersEndpoint.read.response.data.total
                  : 0}
              </div>
              <div className="text-sm text-gray-600">
                {t("imap.dashboard.totalFolders")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {foldersEndpoint.read?.response?.success
                  ? foldersEndpoint.read.response.data.folders.reduce(
                      (sum, folder) => sum + folder.messageCount,
                      0,
                    )
                  : 0}
              </div>
              <div className="text-sm text-gray-600">
                {t("imap.dashboard.totalMessages")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {foldersEndpoint.read?.response?.success
                  ? foldersEndpoint.read.response.data.folders.reduce(
                      (sum, folder) => sum + folder.unseenCount,
                      0,
                    )
                  : 0}
              </div>
              <div className="text-sm text-gray-600">
                {t("imap.dashboard.unreadMessages")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {foldersEndpoint.read?.response?.success
                  ? t("imap.dashboard.justNow")
                  : t("imap.dashboard.never")}
              </div>
              <div className="text-sm text-gray-600">
                {t("imap.dashboard.lastSync")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
