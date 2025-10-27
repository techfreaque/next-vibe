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
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { useImapAccountsList } from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/list/hooks";
import { useImapHealth } from "@/app/api/[locale]/v1/core/emails/imap-client/health/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { useTranslation } from "@/i18n/core/client";

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

  const getStatusBadge = (status: string): JSX.Element => {
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
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {t("app.admin.emails.imap.admin.overview.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p>{t("app.admin.emails.imap.common.loading")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const connectedAccounts = accounts.filter((a) => a.isConnected);
  const disconnectedAccounts = accounts.filter((a) => !a.isConnected);
  const totalErrors = accounts.reduce(
    (sum, a) => sum + (a.syncError ? 1 : 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.dashboard.totalAccounts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData?.accountsTotal ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthData?.accountsHealthy ?? 0}{" "}
              {t(
                "app.admin.emails.imap.dashboard.activeAccounts",
              ).toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.dashboard.totalMessages")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData?.syncStats?.totalSyncs?.toLocaleString() ?? "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.emails.imap.dashboard.synchronizedMessages")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.dashboard.lastSync")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData?.syncStats?.lastSyncTime ||
                t("app.admin.emails.imap.dashboard.never")}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.emails.imap.dashboard.syncStatus")}:{" "}
              {healthData?.serverStatus ?? "unknown"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.imap.admin.health.uptime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData?.uptime ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.emails.imap.admin.health.serverStatus")}:{" "}
              {healthData?.serverStatus ?? "unknown"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Server Health Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(healthData?.serverStatus ?? "unknown")}
              <span>
                {t("app.admin.emails.imap.admin.health.serverStatus")}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {t("app.admin.emails.imap.admin.health.lastUpdate", {
                  lastUpdate: lastUpdate.toLocaleTimeString(),
                })}
              </span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                {t("app.admin.emails.imap.common.refresh")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getStatusColor(healthData?.serverStatus ?? "unknown")}`}
              >
                {(healthData?.serverStatus ?? "unknown").toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.serverStatus")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {healthData?.uptime ?? "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.uptime")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {healthData?.syncedAccounts ?? 0}/
                {healthData?.totalAccounts ?? 0}
              </div>
              <div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.accounts")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {healthData?.activeConnections ?? 0}
              </div>
              <div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.admin.health.activeConnections")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.admin.emails.imap.admin.health.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {healthData.avgResponseTime}
                <span className="text-sm ml-1">ms</span>
              </div>
              <div className="text-sm text-gray-600">
                {t(
                  "app.api.v1.core.emails.imapClient.health.health.get.response.data.performanceMetrics.avgResponseTime",
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.accounts")}
                </p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.connectedAccounts")}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {connectedAccounts.length}
                </p>
              </div>
              <Wifi className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.disconnectedAccounts")}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {disconnectedAccounts.length}
                </p>
              </div>
              <WifiOff className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("app.admin.emails.imap.admin.health.errors")}
                </p>
                <p className="text-2xl font-bold text-red-600">{totalErrors}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-gray-500">
                        {account.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(
                        account.isConnected ? "connected" : "disconnected",
                      )}
                      {getStatusBadge(
                        account.isConnected ? "connected" : "disconnected",
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(account.syncStatus)}</TableCell>
                  <TableCell>
                    {account.lastSyncAt
                      ? new Date(account.lastSyncAt).toLocaleString()
                      : t("app.admin.emails.imap.common.never")}
                  </TableCell>
                  <TableCell>
                    {account.syncError ? (
                      <Badge variant="destructive">1</Badge>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        {t("app.admin.emails.imap.account.test")}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t("app.admin.emails.imap.common.sync")}
                      </Button>
                    </div>
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
