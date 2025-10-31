/**
 * IMAP Overview Dashboard Component
 * Consolidated dashboard showing comprehensive IMAP server status, health metrics, and account details
 */

"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Server,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
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
import { useEffect, useState } from "react";

import { useImapAccountsList } from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/list/hooks";
import { useImapHealth } from "@/app/api/[locale]/v1/core/emails/imap-client/health/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

const getStatusIcon = (status: string): JSX.Element => {
  switch (status) {
    case "healthy":
    case "good":
    case "online":
    case "connected":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "error":
    case "disconnected":
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    default:
      return <Server className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "healthy":
    case "good":
    case "online":
    case "connected":
      return "text-green-600";
    case "warning":
      return "text-yellow-600";
    case "error":
    case "disconnected":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusBadge = (
  status: string,
  t: ReturnType<typeof useTranslation>["t"],
): JSX.Element => {
  switch (status) {
    case "online":
    case "connected":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          {t("app.admin.emails.imap.account.status.connected")}
        </Badge>
      );
    case "synced":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          {t("app.admin.emails.imap.account.status.completed")}
        </Badge>
      );
    case "syncing":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          {t("app.admin.emails.imap.account.status.syncing")}
        </Badge>
      );
    case "disconnected":
      return (
        <Badge variant="destructive">
          {t("app.admin.emails.imap.account.status.disconnected")}
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive">
          {t("app.admin.emails.imap.account.status.error")}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary">
          {t("app.admin.emails.imap.account.status.pending")}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {t("app.admin.emails.imap.account.status.pending")}
        </Badge>
      );
  }
};

/**
 * IMAP Overview Dashboard Component
 * Consolidated component that replaces separate health, status, and overview components
 */
export function ImapOverviewDashboard(): JSX.Element {
  const { t, locale } = useTranslation();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use real health monitoring API endpoint
  const healthEndpoint = useImapHealth(logger);

  // Use real accounts list API endpoint
  const accountsEndpoint = useImapAccountsList(logger);

  const healthResponse = healthEndpoint.read.response;
  const accountsResponse = accountsEndpoint.read.response;
  const healthData = healthResponse?.success ? healthResponse.data : null;
  const accounts = accountsResponse?.success
    ? accountsResponse.data.accounts
    : [];
  const isLoading =
    healthEndpoint.read.isLoading || accountsEndpoint.read.isLoading;

  const handleRefresh = (): void => {
    setLastUpdate(new Date());
    void healthEndpoint.read.refetch();
    void accountsEndpoint.read.refetch();
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      void healthEndpoint.read.refetch();
      void accountsEndpoint.read.refetch();
    }, 30000);

    return (): void => clearInterval(interval);
  }, [healthEndpoint.read, accountsEndpoint.read]);

  // Show loading state if no data
  if (isLoading || !healthData) {
    return (
      <Div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {t("app.admin.emails.imap.admin.overview.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="text-center py-8">
              <P>{t("app.admin.emails.imap.common.loading")}</P>
            </Div>
          </CardContent>
        </Card>
      </Div>
    );
  }

  const connectedAccounts = accounts.filter((a) => a.isConnected);
  const disconnectedAccounts = accounts.filter((a) => !a.isConnected);
  const totalErrors = accounts.reduce(
    (sum, a) => sum + (a.syncError ? 1 : 0),
    0,
  );

  return (
    <Div className="space-y-6">
      {/* Key Metrics Cards */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.dashboard.totalAccounts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {healthData?.accountsTotal ?? 0}
            </Div>
            <P className="text-xs text-muted-foreground">
              {healthData?.accountsHealthy ?? 0}{" "}
              {t(
                "app.admin.emails.imap.dashboard.activeAccounts",
              ).toLowerCase()}
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.dashboard.totalMessages")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {healthData?.syncStats?.totalSyncs?.toLocaleString() ?? "0"}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.emails.imap.dashboard.synchronizedMessages")}
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.dashboard.lastSync")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {healthData?.syncStats?.lastSyncTime ||
                t("app.admin.emails.imap.dashboard.never")}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.emails.imap.dashboard.syncStatus")}:{" "}
              {healthData?.serverStatus ?? "unknown"}
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.admin.health.uptime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {healthData?.uptime ?? "N/A"}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.emails.imap.admin.health.serverStatus")}:{" "}
              {healthData?.serverStatus ?? "unknown"}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Server Health Status */}
      <Card>
        <CardHeader>
          <Div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(healthData?.serverStatus ?? "unknown")}
              <Span>
                {t("app.admin.emails.imap.admin.health.serverStatus")}
              </Span>
            </CardTitle>
            <Div className="flex items-center space-x-4">
              <Span className="text-sm text-gray-500">
                {t("app.admin.emails.imap.admin.health.lastUpdate", {
                  lastUpdate: lastUpdate.toLocaleTimeString(),
                })}
              </Span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                {t("app.admin.emails.imap.common.refresh")}
              </Button>
            </Div>
          </Div>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Div className="text-center">
              <Div
                className={`text-2xl font-bold ${getStatusColor(healthData?.serverStatus ?? "unknown")}`}
              >
                {(healthData?.serverStatus ?? "unknown").toUpperCase()}
              </Div>
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.serverStatus")}
              </Div>
            </Div>
            <Div className="text-center">
              <Div className="text-2xl font-bold">
                {healthData?.uptime ?? "N/A"}
              </Div>
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.uptime")}
              </Div>
            </Div>
            <Div className="text-center">
              <Div className="text-2xl font-bold">
                {healthData?.syncedAccounts ?? 0}/
                {healthData?.totalAccounts ?? 0}
              </Div>
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.accounts")}
              </Div>
            </Div>
            <Div className="text-center">
              <Div className="text-2xl font-bold">
                {healthData?.activeConnections ?? 0}
              </Div>
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.activeConnections")}
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.admin.emails.imap.admin.health.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Div className="text-center">
              <Div className="text-2xl font-bold">
                {healthData.avgResponseTime}
                <Span className="text-sm ml-1">ms</Span>
              </Div>
              <Div className="text-sm text-gray-600">
                {t(
                  "app.api.v1.core.emails.imapClient.health.health.get.response.data.performanceMetrics.avgResponseTime",
                )}
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* Account Status Summary */}
      <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.accounts")}
                </P>
                <P className="text-2xl font-bold">{accounts.length}</P>
              </Div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </Div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.connectedAccounts")}
                </P>
                <P className="text-2xl font-bold text-green-600">
                  {connectedAccounts.length}
                </P>
              </Div>
              <Wifi className="h-8 w-8 text-green-600" />
            </Div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.disconnectedAccounts")}
                </P>
                <P className="text-2xl font-bold text-red-600">
                  {disconnectedAccounts.length}
                </P>
              </Div>
              <WifiOff className="h-8 w-8 text-red-600" />
            </Div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.errors")}
                </P>
                <P className="text-2xl font-bold text-red-600">{totalErrors}</P>
              </Div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </Div>
          </CardContent>
        </Card>
      </Div>

      {/* Account Status Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("app.admin.emails.imap.admin.status.accountStatusDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("app.admin.emails.imap.common.account")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.common.connection")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.common.syncStatus")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.common.lastSync")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.common.errors")}
                </TableHead>
                <TableHead>
                  {t("app.admin.emails.imap.common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <Div>
                      <Div className="font-medium">{account.name}</Div>
                      <Div className="text-sm text-gray-500">
                        {account.email}
                      </Div>
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className="flex items-center space-x-2">
                      {getStatusIcon(
                        account.isConnected ? "connected" : "disconnected",
                      )}
                      {getStatusBadge(
                        account.isConnected ? "connected" : "disconnected",
                        t,
                      )}
                    </Div>
                  </TableCell>
                  <TableCell>{getStatusBadge(account.syncStatus, t)}</TableCell>
                  <TableCell>
                    {account.lastSyncAt
                      ? new Date(account.lastSyncAt).toLocaleString()
                      : t("app.admin.emails.imap.common.never")}
                  </TableCell>
                  <TableCell>
                    {account.syncError ? (
                      <Badge variant="destructive">1</Badge>
                    ) : (
                      <Span className="text-gray-400">0</Span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        {t("app.admin.emails.imap.account.test")}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t("app.admin.emails.imap.common.sync")}
                      </Button>
                    </Div>
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
