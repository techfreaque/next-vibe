/**
 * IMAP Sync Operations Component
 * Component for monitoring and managing email synchronization operations
 */

"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Pause,
  Play,
  RefreshCw,
  Square,
} from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Progress } from "next-vibe-ui/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import imapAccountsListDefinition, {
  type ImapAccountsListResponseOutput,
} from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/list/definition";
import { ImapSyncStatus } from "@/app/api/[locale]/v1/core/emails/imap-client/enum";
import imapSyncDefinition from "@/app/api/[locale]/v1/core/emails/imap-client/sync/definition";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useTranslation } from "@/i18n/core/client";

/**
 * IMAP Sync Operations Component
 */
export function ImapSyncOperations(): JSX.Element {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);

  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), "en-GLOBAL"),
    [],
  );

  // Use accounts endpoint to get sync status information
  const accountsEndpoint = useEndpoint(
    imapAccountsListDefinition,
    {
      enabled: true,
    },
    logger,
  );

  // Use sync endpoint for triggering sync operations
  const syncEndpoint = useEndpoint(
    imapSyncDefinition,
    {
      enabled: false,
    },
    logger,
  );

  // Extract sync status from accounts data
  const accountsResponse = accountsEndpoint.read?.response;
  let accounts: ImapAccountsListResponseOutput["accounts"] = [];
  if (accountsResponse) {
    if (accountsResponse.success === true) {
      accounts = accountsResponse.data.accounts;
    }
  }

  const syncingAccounts = accounts.filter(
    (acc) => acc.syncStatus === ImapSyncStatus.SYNCING,
  );
  const lastSyncTimes = accounts
    .map((acc) => acc.lastSyncAt)
    .filter((time): time is string => time !== null)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const syncStatus = {
    isRunning: syncingAccounts.length > 0 || isSyncing,
    currentOperation:
      syncingAccounts.length > 0
        ? t("app.admin.emails.imap.sync.status.syncing")
        : t("app.admin.emails.imap.sync.idle"),
    progress: isSyncing ? 50 : 0, // Progress will be calculated from actual sync data
    startTime: null,
    estimatedCompletion: null,
    lastSync:
      lastSyncTimes.length > 0
        ? lastSyncTimes[0]
        : t("app.admin.emails.imap.common.never"),
    nextSync: t("app.admin.emails.imap.sync.nextSync"),
  };

  const syncHistory = [
    {
      id: "1",
      startTime: "2023-12-01T10:30:00Z",
      endTime: "2023-12-01T10:32:15Z",
      status: t("app.admin.emails.imap.sync.status.synced"),
      accountsProcessed: 3,
      foldersProcessed: 12,
      messagesProcessed: 145,
      errors: 0,
      duration: 135, // seconds
    },
    {
      id: "2",
      startTime: "2023-12-01T10:25:00Z",
      endTime: "2023-12-01T10:27:30Z",
      status: t("app.admin.emails.imap.sync.status.synced"),
      accountsProcessed: 3,
      foldersProcessed: 12,
      messagesProcessed: 89,
      errors: 1,
      duration: 150, // seconds
    },
    {
      id: "3",
      startTime: "2023-12-01T10:20:00Z",
      endTime: "2023-12-01T10:20:45Z",
      status: t("app.admin.emails.imap.sync.status.error"),
      accountsProcessed: 1,
      foldersProcessed: 4,
      messagesProcessed: 0,
      errors: 3,
      duration: 45, // seconds
    },
  ];

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case t("app.admin.emails.imap.sync.status.synced"):
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case t("app.admin.emails.imap.sync.status.syncing"):
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case t("app.admin.emails.imap.sync.status.error"):
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case t("app.admin.emails.imap.sync.status.pending"):
        return <Pause className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case t("app.admin.emails.imap.sync.status.synced"):
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {status}
          </Badge>
        );
      case t("app.admin.emails.imap.sync.status.syncing"):
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            {status}
          </Badge>
        );
      case t("app.admin.emails.imap.sync.status.error"):
        return <Badge variant="destructive">{status}</Badge>;
      case t("app.admin.emails.imap.sync.status.pending"):
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStartSync = (): void => {
    const createEndpoint = syncEndpoint.create;
    if (!createEndpoint) {
      return;
    }

    setIsSyncing(true);
    // Trigger sync using the sync endpoint
    // Set form values and submit using the form's handleSubmit
    createEndpoint.form.setValue("accountIds", []);
    createEndpoint.form.setValue("force", false);
    createEndpoint.form.setValue("dryRun", false);
    createEndpoint.form.setValue("maxMessages", 1000);

    // Create a synthetic form event and submit
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as React.FormEvent<HTMLFormElement>;

    void createEndpoint.onSubmit(syntheticEvent);
  };

  const handleStopSync = (): void => {
    setIsSyncing(false);
    // Stop sync functionality would be implemented here when cancel endpoint is available
  };

  const handlePauseSync = (): void => {
    // Pause sync functionality would be implemented here when pause endpoint is available
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      {/* Sync Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle> {t("app.admin.emails.imap.sync.controlPanel")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {syncStatus.isRunning
                    ? t("app.admin.emails.imap.sync.status.syncing")
                    : t("app.admin.emails.imap.sync.idle")}
                </div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.currentStatus")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{syncStatus.lastSync}</div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.lastSync")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{syncStatus.nextSync}</div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.nextSync")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {syncStatus.currentOperation}
                </div>
                <div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.currentOperation")}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {syncStatus.isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("app.admin.emails.imap.sync.progress")}</span>
                  <span>{syncStatus.progress}%</span>
                </div>
                <Progress value={syncStatus.progress} className="w-full" />
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleStartSync}
                disabled={isSyncing}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{t("app.admin.emails.imap.sync.start")}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handlePauseSync}
                disabled={!isSyncing}
                className="flex items-center space-x-2"
              >
                <Pause className="h-4 w-4" />
                <span>{t("app.admin.emails.imap.sync.pause")}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleStopSync}
                disabled={!isSyncing}
                className="flex items-center space-x-2"
              >
                <Square className="h-4 w-4" />
                <span>{t("app.admin.emails.imap.sync.stop")}</span>
              </Button>
              <Button variant="outline">
                {t("app.admin.emails.imap.sync.manual")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.totalSyncsToday")}
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.successfulSyncs")}
                </p>
                <p className="text-2xl font-bold text-green-600">22</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.failedSyncs")}
                </p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.avgDuration")}
                </p>
                <p className="text-2xl font-bold">
                  {t("app.admin.emails.imap.common.never")}
                </p>
              </div>
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.admin.emails.imap.sync.history.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("app.admin.emails.imap.sync.history.startTime")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.sync.history.status")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.sync.history.duration")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.sync.history.accounts")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.sync.history.folders")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.sync.history.messages")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.sync.history.errors")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncHistory.map((sync) => (
                <TableRow key={sync.id}>
                  <TableCell>
                    {new Date(sync.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(sync.status)}
                      {getStatusBadge(sync.status)}
                    </div>
                  </TableCell>
                  <TableCell>{sync.duration}</TableCell>
                  <TableCell>{sync.accountsProcessed}</TableCell>
                  <TableCell>{sync.foldersProcessed}</TableCell>
                  <TableCell>{sync.messagesProcessed}</TableCell>
                  <TableCell>
                    {sync.errors > 0 ? (
                      <Badge variant="destructive">{sync.errors}</Badge>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
