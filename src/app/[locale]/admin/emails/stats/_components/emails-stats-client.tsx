/**
 * Email Stats Client Component
 * Pure UI component - all business logic is in hooks.ts
 */

"use client";

import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Eye,
  Globe,
  Mail,
  MousePointer,
  PieChart,
  Send,
  Target,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import { useEmailStats } from "@/app/api/[locale]/v1/core/emails/messages/stats/hooks";
import { ActivityType } from "@/app/api/[locale]/v1/core/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EmailStatsChart } from "./email-stats-chart";
import {
  EmailStatsFilters,
  EmailStatsFiltersContainer,
} from "./email-stats-filters";

interface EmailsStatsClientProps {
  locale: CountryLanguage;
}

export function EmailsStatsClient({
  locale,
}: EmailsStatsClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const {
    stats,
    isLoading,
    refreshStats,
    formatPercentage,
    formatNumber,
    form,
    alert,
  } = useEmailStats(locale);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <div className="flex space-x-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <EmailStatsFiltersContainer
        locale={locale}
        onRefresh={refreshStats}
        form={form}
      >
        <FormAlert alert={alert} />
        <EmailStatsFilters control={form.control} />
      </EmailStatsFiltersContainer>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.totalEmails")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.totalEmails || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.sentEmails || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.metrics.sent")}
            </p>
          </CardContent>
        </Card>

        {/* Delivered Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.deliveredEmails")}
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.deliveredEmails || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.deliveryRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.metrics.deliveryRate")}
            </p>
          </CardContent>
        </Card>

        {/* Opened Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.openedEmails")}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.openedEmails || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.openRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.openRate")}
            </p>
          </CardContent>
        </Card>

        {/* Clicked Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.clickedEmails")}
            </CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.clickedEmails || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.clickRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.clickRate")}
            </p>
          </CardContent>
        </Card>

        {/* Bounced Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.bouncedEmails")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.bouncedEmails || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.bounceRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.bounceRate")}
            </p>
          </CardContent>
        </Card>

        {/* Failed Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.failedEmails")}
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.failedEmails || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.failureRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.failureRate")}
            </p>
          </CardContent>
        </Card>

        {/* Draft Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.draftEmails")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.draftEmails || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.emails.stats.admin.stats.pendingToSend")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Emails with User ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.emailsWithUserId")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.emailsWithUserId || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.emailsWithoutUserId || 0)}{" "}
              {t(
                "app.admin.emails.stats.admin.stats.metrics.emailsWithoutUserId",
              )}
            </p>
          </CardContent>
        </Card>

        {/* Emails with Lead ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.emailsWithLeadId")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.emailsWithLeadId || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.emailsWithoutLeadId || 0)}{" "}
              {t(
                "app.admin.emails.stats.admin.stats.metrics.emailsWithoutLeadId",
              )}
            </p>
          </CardContent>
        </Card>

        {/* Emails with Errors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.emailsWithErrors")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.emailsWithErrors || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.emailsWithoutErrors || 0)}{" "}
              {t(
                "app.admin.emails.stats.admin.stats.metrics.emailsWithoutErrors",
              )}
            </p>
          </CardContent>
        </Card>

        {/* Average Retry Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.averageRetryCount",
              )}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.averageRetryCount || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.emails.stats.admin.stats.metrics.maxRetryCount")}:{" "}
              {stats?.maxRetryCount || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Average Processing Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.averageProcessingTime",
              )}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.averageProcessingTime || 0).toFixed(2)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.processingTimeDescription",
              )}
            </p>
          </CardContent>
        </Card>

        {/* Average Delivery Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.averageDeliveryTime",
              )}
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.averageDeliveryTime || 0).toFixed(2)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.deliveryTimeDescription",
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics with Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            {t("app.admin.emails.stats.admin.stats.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="performance">
            {t("app.admin.emails.stats.admin.stats.tabs.performance")}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            {t("app.admin.emails.stats.admin.stats.tabs.distribution")}
          </TabsTrigger>
          <TabsTrigger value="providers">
            {t("app.admin.emails.stats.admin.stats.tabs.providers")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Historical Chart */}
          {stats?.historicalData && (
            <EmailStatsChart
              locale={locale}
              data={{
                series: Object.entries(stats.historicalData).map(
                  ([, value]) => ({
                    name: value.name,
                    data: Array.isArray(value) ? value : value.data || [],
                    type: value?.type,
                    color: value?.color,
                  }),
                ),
                title: t("app.admin.emails.stats.admin.stats.chart.title"),
                subtitle: t(
                  "app.admin.emails.stats.admin.stats.chart.subtitle",
                ),
              }}
              isLoading={isLoading}
              height={400}
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.performance.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.deliveryRate",
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.deliveryRate || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.openRate",
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.openRate || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.clickRate",
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.clickRate || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.bounceRate",
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.bounceRate || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t(
                    "app.admin.emails.stats.admin.stats.topPerformingTemplates",
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topPerformingTemplates?.map((template, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {template.templateName}
                        </span>
                        <Badge variant="secondary">
                          {formatNumber(template.emailsSent)}{" "}
                          {t("app.admin.emails.stats.admin.stats.sent")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {t("app.admin.emails.stats.admin.stats.openRate")}:{" "}
                          {formatPercentage(template.openRate)}
                        </span>
                        <span>
                          {t("app.admin.emails.stats.admin.stats.clickRate")}:{" "}
                          {formatPercentage(template.clickRate)}
                        </span>
                      </div>
                      <Progress
                        value={template.openRate * 100}
                        className="h-1"
                      />
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noTemplateData")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.statusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(stats?.emailsByStatus &&
                    Object.entries(stats.emailsByStatus).map(
                      ([status, count], index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">
                              {((): string => {
                                const statusKey = status.toLowerCase();
                                const statusTranslations = {
                                  sent: t(
                                    "app.admin.emails.stats.admin.stats.statuses.sent",
                                  ),
                                  delivered: t(
                                    "app.admin.emails.stats.admin.stats.statuses.delivered",
                                  ),
                                  opened: t(
                                    "app.admin.emails.stats.admin.stats.statuses.opened",
                                  ),
                                  clicked: t(
                                    "app.admin.emails.stats.admin.stats.statuses.clicked",
                                  ),
                                  bounced: t(
                                    "app.admin.emails.stats.admin.stats.statuses.bounced",
                                  ),
                                  failed: t(
                                    "app.admin.emails.stats.admin.stats.statuses.failed",
                                  ),
                                  queued: t(
                                    "app.admin.emails.stats.admin.stats.statuses.queued",
                                  ),
                                  processing: t(
                                    "app.admin.emails.stats.admin.stats.statuses.processing",
                                  ),
                                  scheduled: t(
                                    "app.admin.emails.stats.admin.stats.statuses.scheduled",
                                  ),
                                  pending: t(
                                    "app.admin.emails.stats.admin.stats.statuses.pending",
                                  ),
                                  unsubscribed: t(
                                    "app.admin.emails.stats.admin.stats.statuses.unsubscribed",
                                  ),
                                  draft: t(
                                    "app.admin.emails.stats.admin.stats.statuses.draft",
                                  ),
                                };
                                return (
                                  statusTranslations[
                                    statusKey as keyof typeof statusTranslations
                                  ] || status
                                );
                              })()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatNumber(count)}
                            </span>
                          </div>
                          <Progress
                            value={
                              stats.totalEmails
                                ? (count / stats.totalEmails) * 100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                      ),
                    )) || (
                    <p className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noStatusData")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.typeDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(stats?.emailsByType &&
                    Object.entries(stats.emailsByType).map(
                      ([type, count], index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">
                              {((): string => {
                                const typeKey = type.toLowerCase();
                                const typeTranslations = {
                                  transactional: t(
                                    "app.admin.emails.stats.admin.stats.types.transactional",
                                  ),
                                  marketing: t(
                                    "app.admin.emails.stats.admin.stats.types.marketing",
                                  ),
                                  notification: t(
                                    "app.admin.emails.stats.admin.stats.types.notification",
                                  ),
                                  system: t(
                                    "app.admin.emails.stats.admin.stats.types.system",
                                  ),
                                  lead_campaign: t(
                                    "app.admin.emails.stats.admin.stats.types.lead_campaign",
                                  ),
                                  user_communication: t(
                                    "app.admin.emails.stats.admin.stats.types.user_communication",
                                  ),
                                };
                                return (
                                  typeTranslations[
                                    typeKey as keyof typeof typeTranslations
                                  ] || type
                                );
                              })()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatNumber(count)}
                            </span>
                          </div>
                          <Progress
                            value={
                              stats.totalEmails
                                ? (count / stats.totalEmails) * 100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                      ),
                    )) || (
                    <p className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noTypeData")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Provider Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.providerPerformance")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topPerformingProviders?.map((provider, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {provider.provider}
                        </span>
                        <Badge variant="outline">
                          {formatNumber(provider.emailsSent)}{" "}
                          {t("app.admin.emails.stats.admin.stats.sent")}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <span>
                          {t("app.admin.emails.stats.admin.stats.delivery")}:{" "}
                          {formatPercentage(provider.deliveryRate)}
                        </span>
                        <span>
                          {t("app.admin.emails.stats.admin.stats.open")}:{" "}
                          {formatPercentage(provider.openRate)}
                        </span>
                        <span>
                          {t("app.admin.emails.stats.admin.stats.click")}:{" "}
                          {formatPercentage(provider.clickRate)}
                        </span>
                      </div>
                      <Progress
                        value={provider.reliability * 100}
                        className="h-1"
                      />
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noProviderData")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recentActivity?.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {(activity.details?.subject as string) ||
                            activity.templateName ||
                            t("app.admin.emails.stats.admin.stats.noSubject")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.recipientEmail} • {activity.type}
                        </p>
                      </div>
                      <Badge
                        variant={
                          activity.type === ActivityType.EMAIL_SENT ||
                          activity.type === ActivityType.EMAIL_OPENED ||
                          activity.type === ActivityType.LEAD_CONVERTED
                            ? "default"
                            : "secondary"
                        }
                      >
                        {((): string => {
                          const typeKey = activity.type.toLowerCase();
                          const activityTranslations = {
                            lead_created: t(
                              "app.admin.emails.stats.admin.stats.statuses.pending",
                            ),
                            lead_updated: t(
                              "app.admin.emails.stats.admin.stats.statuses.pending",
                            ),
                            email_sent: t(
                              "app.admin.emails.stats.admin.stats.statuses.sent",
                            ),
                            email_opened: t(
                              "app.admin.emails.stats.admin.stats.statuses.opened",
                            ),
                            email_clicked: t(
                              "app.admin.emails.stats.admin.stats.statuses.clicked",
                            ),
                            lead_converted: t(
                              "app.admin.emails.stats.admin.stats.statuses.delivered",
                            ),
                            lead_unsubscribed: t(
                              "app.admin.emails.stats.admin.stats.statuses.unsubscribed",
                            ),
                          };
                          return (
                            activityTranslations[
                              typeKey as keyof typeof activityTranslations
                            ] || activity.type
                          );
                        })()}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noRecentActivity")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
