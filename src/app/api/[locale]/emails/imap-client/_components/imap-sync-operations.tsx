/**
 * IMAP Sync Operations Component
 * Component for monitoring and managing email synchronization operations
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Pause,
  Play,
  RefreshCw,
  Square,
} from "next-vibe-ui/ui/icons";
import { Progress } from "next-vibe-ui/ui/progress";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import imapAccountsListDefinition, {
  type ImapAccountsListResponseOutput,
} from "@/app/api/[locale]/emails/imap-client/accounts/list/definition";
import { ImapSyncStatus } from "@/app/api/[locale]/emails/imap-client/enum";
import imapSyncDefinition from "@/app/api/[locale]/emails/imap-client/sync/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";

interface ImapSyncOperationsProps {
  user: JwtPayloadType;
}

/**
 * IMAP Sync Operations Component
 */
export function ImapSyncOperations({
  user,
}: ImapSyncOperationsProps): JSX.Element {
  const { t, locale } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);

  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  // Use accounts endpoint to get sync status information
  const accountsEndpoint = useEndpoint(
    imapAccountsListDefinition,
    {
      enabled: true,
    },
    logger,
    user,
  );

  // Use sync endpoint for triggering sync operations
  const syncEndpoint = useEndpoint(
    imapSyncDefinition,
    {
      enabled: false,
    },
    logger,
    user,
  );

  // Extract sync status from accounts data
  const accountsResponse = accountsEndpoint.read.response;
  let accounts: ImapAccountsListResponseOutput["accounts"] = [];
  if (accountsResponse?.success === true) {
    accounts = accountsResponse.data.accounts;
  }

  const syncingAccounts = accounts.filter(
    (acc) => acc.syncStatus === ImapSyncStatus.SYNCING,
  );
  const lastSyncTimes = accounts
    .map((acc) => acc.lastSyncAt)
    .filter((time): time is string => time !== null)
    .toSorted((a, b) => new Date(b).getTime() - new Date(a).getTime());

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
    setIsSyncing(true);
    // Trigger sync using the sync endpoint
    // Set form values and submit using the form's handleSubmit
    syncEndpoint.create.form.setValue("accountIds", []);
    syncEndpoint.create.form.setValue("force", false);
    syncEndpoint.create.form.setValue("dryRun", false);
    syncEndpoint.create.form.setValue("maxMessages", 1000);

    // Submit the form directly
    void syncEndpoint.create.onSubmit();
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
    <Div className="flex flex-col gap-6">
      {/* Sync Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle> {t("app.admin.emails.imap.sync.controlPanel")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="flex flex-col gap-6">
            {/* Current Status */}
            <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Div className="text-center">
                <Div className="text-2xl font-bold text-blue-600">
                  {syncStatus.isRunning
                    ? t("app.admin.emails.imap.sync.status.syncing")
                    : t("app.admin.emails.imap.sync.idle")}
                </Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.currentStatus")}
                </Div>
              </Div>
              <Div className="text-center">
                <Div className="text-2xl font-bold">{syncStatus.lastSync}</Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.lastSync")}
                </Div>
              </Div>
              <Div className="text-center">
                <Div className="text-2xl font-bold">{syncStatus.nextSync}</Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.nextSync")}
                </Div>
              </Div>
              <Div className="text-center">
                <Div className="text-2xl font-bold">
                  {syncStatus.currentOperation}
                </Div>
                <Div className="text-sm text-gray-600">
                  {t("app.admin.emails.imap.sync.currentOperation")}
                </Div>
              </Div>
            </Div>

            {/* Progress Bar */}
            {syncStatus.isRunning && (
              <Div className="flex flex-col gap-2">
                <Div className="flex justify-between text-sm">
                  <Span>{t("app.admin.emails.imap.sync.progress")}</Span>
                  <Span>{syncStatus.progress}%</Span>
                </Div>
                <Progress value={syncStatus.progress} className="w-full" />
              </Div>
            )}

            {/* Control Buttons */}
            <Div className="flex items-center flex flex-row gap-4">
              <Button
                onClick={handleStartSync}
                disabled={isSyncing}
                className="flex items-center flex flex-row gap-2"
              >
                <Play className="h-4 w-4" />
                <Span>{t("app.admin.emails.imap.sync.start")}</Span>
              </Button>
              <Button
                variant="outline"
                onClick={handlePauseSync}
                disabled={!isSyncing}
                className="flex items-center flex flex-row gap-2"
              >
                <Pause className="h-4 w-4" />
                <Span>{t("app.admin.emails.imap.sync.pause")}</Span>
              </Button>
              <Button
                variant="outline"
                onClick={handleStopSync}
                disabled={!isSyncing}
                className="flex items-center flex flex-row gap-2"
              >
                <Square className="h-4 w-4" />
                <Span>{t("app.admin.emails.imap.sync.stop")}</Span>
              </Button>
              <Button variant="outline">
                {t("app.admin.emails.imap.sync.manual")}
              </Button>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* Sync Statistics */}
      <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.totalSyncsToday")}
                </P>
                <P className="text-2xl font-bold">24</P>
              </Div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </Div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.successfulSyncs")}
                </P>
                <P className="text-2xl font-bold text-green-600">22</P>
              </Div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </Div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.failedSyncs")}
                </P>
                <P className="text-2xl font-bold text-red-600">2</P>
              </Div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </Div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.sync.statistics.avgDuration")}
                </P>
                <P className="text-2xl font-bold">
                  {t("app.admin.emails.imap.common.never")}
                </P>
              </Div>
              <Clock className="h-8 w-8 text-gray-600" />
            </Div>
          </CardContent>
        </Card>
      </Div>

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
                    <Div className="flex items-center flex flex-row gap-2">
                      {getStatusIcon(sync.status)}
                      {getStatusBadge(sync.status)}
                    </Div>
                  </TableCell>
                  <TableCell>{sync.duration}</TableCell>
                  <TableCell>{sync.accountsProcessed}</TableCell>
                  <TableCell>{sync.foldersProcessed}</TableCell>
                  <TableCell>{sync.messagesProcessed}</TableCell>
                  <TableCell>
                    {sync.errors > 0 ? (
                      <Badge variant="destructive">{sync.errors}</Badge>
                    ) : (
                      <Span className="text-gray-400">0</Span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Div>
  );
}
