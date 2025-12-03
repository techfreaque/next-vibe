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
} from "next-vibe-ui/ui/icons";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect } from "react";

import type { EmailStatsGetResponseTypeOutput } from "@/app/api/[locale]/emails/messages/stats/definition";
import { useEmailMessagesStats } from "@/app/api/[locale]/emails/messages/stats/hooks";
import { ActivityType } from "@/app/api/[locale]/leads/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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

// Format percentage with 2 decimal places
function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

// Format number with commas
function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function EmailsStatsClient({
  locale,
}: EmailsStatsClientProps): JSX.Element {
  const { t } = simpleT(locale);

  // Create logger and endpoint
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useEmailMessagesStats(logger);

  // Auto-fetch on mount
  useEffect(() => {
    void endpoint.read.refetch();
  }, [endpoint.read]);

  const stats = endpoint.read.response as
    | EmailStatsGetResponseTypeOutput
    | undefined;
  const isLoading = endpoint.read.isLoading;
  const form = endpoint.read.form;
  const alert = endpoint.alert;

  // Loading state
  if (isLoading) {
    return (
      <Div className="flex flex-col gap-6">
        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </Div>
          </CardContent>
        </Card>

        {/* Key Metrics Skeleton */}
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </Div>

        {/* Tabs Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Div className="flex flex flex-row gap-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </Div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-6">
      {/* Filters */}
      <EmailStatsFiltersContainer
        locale={locale}
        onRefresh={() => {
          void endpoint.read.refetch();
        }}
        form={form}
      >
        <FormAlert alert={alert} />
        <EmailStatsFilters control={form.control} />
      </EmailStatsFiltersContainer>

      {/* Key Metrics Overview */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.totalEmails")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.totalEmails || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(stats?.sentEmails || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.metrics.sent")}
            </P>
          </CardContent>
        </Card>

        {/* Delivered Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.deliveredEmails")}
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.deliveredEmails || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.deliveryRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.metrics.deliveryRate")}
            </P>
          </CardContent>
        </Card>

        {/* Opened Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.openedEmails")}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.openedEmails || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.openRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.openRate")}
            </P>
          </CardContent>
        </Card>

        {/* Clicked Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.clickedEmails")}
            </CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.clickedEmails || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.clickRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.clickRate")}
            </P>
          </CardContent>
        </Card>

        {/* Bounced Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.bouncedEmails")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.bouncedEmails || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.bounceRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.bounceRate")}
            </P>
          </CardContent>
        </Card>

        {/* Failed Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.failedEmails")}
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.failedEmails || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.failureRate || 0)}{" "}
              {t("app.admin.emails.stats.admin.stats.failureRate")}
            </P>
          </CardContent>
        </Card>

        {/* Draft Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.draftEmails")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.draftEmails || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.emails.stats.admin.stats.pendingToSend")}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Additional Metrics Row */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Emails with User ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.emailsWithUserId")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.emailsWithUserId || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(stats?.emailsWithoutUserId || 0)}{" "}
              {t(
                "app.admin.emails.stats.admin.stats.metrics.emailsWithoutUserId",
              )}
            </P>
          </CardContent>
        </Card>

        {/* Emails with Lead ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.emailsWithLeadId")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.emailsWithLeadId || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(stats?.emailsWithoutLeadId || 0)}{" "}
              {t(
                "app.admin.emails.stats.admin.stats.metrics.emailsWithoutLeadId",
              )}
            </P>
          </CardContent>
        </Card>

        {/* Emails with Errors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.emails.stats.admin.stats.metrics.emailsWithErrors")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.emailsWithErrors || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(stats?.emailsWithoutErrors || 0)}{" "}
              {t(
                "app.admin.emails.stats.admin.stats.metrics.emailsWithoutErrors",
              )}
            </P>
          </CardContent>
        </Card>

        {/* Average Retry Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.averageRetryCount",
              )}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {(stats?.averageRetryCount || 0).toFixed(1)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.emails.stats.admin.stats.metrics.maxRetryCount")}:{" "}
              {stats?.maxRetryCount || 0}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Performance Metrics Row */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Average Processing Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.averageProcessingTime",
              )}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {(stats?.averageProcessingTime || 0).toFixed(2)}ms
            </Div>
            <P className="text-xs text-muted-foreground">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.processingTimeDescription",
              )}
            </P>
          </CardContent>
        </Card>

        {/* Average Delivery Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.averageDeliveryTime",
              )}
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {(stats?.averageDeliveryTime || 0).toFixed(2)}ms
            </Div>
            <P className="text-xs text-muted-foreground">
              {t(
                "app.admin.emails.stats.admin.stats.metrics.deliveryTimeDescription",
              )}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Detailed Analytics with Tabs */}
      <Tabs defaultValue="overview" className="flex flex-col gap-4">
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

        <TabsContent value="overview" className="flex flex-col gap-4">
          {/* Historical Chart */}
          {stats?.historicalData && (
            <EmailStatsChart
              locale={locale}
              data={stats.historicalData}
              isLoading={isLoading}
              height={400}
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="flex flex-col gap-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.performance.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Div className="flex flex-col gap-3">
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.deliveryRate",
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.deliveryRate || 0)}
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.openRate",
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.openRate || 0)}
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.clickRate",
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.clickRate || 0)}
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t(
                        "app.admin.emails.stats.admin.stats.performance.bounceRate",
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatPercentage(stats?.bounceRate || 0)}
                    </Span>
                  </Div>
                </Div>
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
                <Div className="flex flex-col gap-3">
                  {stats?.topPerformingTemplates &&
                  Array.isArray(stats.topPerformingTemplates) &&
                  stats.topPerformingTemplates.length > 0 ? (
                    stats.topPerformingTemplates.map(
                      (
                        template: {
                          templateName: string;
                          emailsSent: number;
                          openRate: number;
                          clickRate: number;
                        },
                        index: number,
                      ) => (
                        <Div key={index} className="flex flex-col gap-2">
                          <Div className="flex items-center justify-between">
                            <Span className="text-sm font-medium">
                              {template.templateName}
                            </Span>
                            <Badge variant="secondary">
                              {formatNumber(template.emailsSent)}{" "}
                              {t("app.admin.emails.stats.admin.stats.sent")}
                            </Badge>
                          </Div>
                          <Div className="flex items-center justify-between text-xs text-muted-foreground">
                            <Span>
                              {t("app.admin.emails.stats.admin.stats.openRate")}
                              : {formatPercentage(template.openRate)}
                            </Span>
                            <Span>
                              {t(
                                "app.admin.emails.stats.admin.stats.clickRate",
                              )}
                              : {formatPercentage(template.clickRate)}
                            </Span>
                          </Div>
                          <Progress
                            value={template.openRate * 100}
                            className="h-1"
                          />
                        </Div>
                      ),
                    )
                  ) : (
                    <P className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noTemplateData")}
                    </P>
                  )}
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>

        <TabsContent value="distribution" className="flex flex-col gap-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.statusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="flex flex-col gap-3">
                  {stats?.emailsByStatus &&
                  typeof stats.emailsByStatus === "object" &&
                  Object.keys(stats.emailsByStatus).length > 0 ? (
                    Object.entries(stats.emailsByStatus).map(
                      ([status, count], index) => (
                        <Div key={index} className="flex flex-col gap-2">
                          <Div className="flex items-center justify-between">
                            <Span className="text-sm font-medium capitalize">
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
                            </Span>
                            <Span className="text-sm text-muted-foreground">
                              {formatNumber(count)}
                            </Span>
                          </Div>
                          <Progress
                            value={
                              stats.totalEmails
                                ? (count / stats.totalEmails) * 100
                                : 0
                            }
                            className="h-2"
                          />
                        </Div>
                      ),
                    )
                  ) : (
                    <P className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noStatusData")}
                    </P>
                  )}
                </Div>
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
                <Div className="flex flex-col gap-3">
                  {stats?.emailsByType &&
                  typeof stats.emailsByType === "object" &&
                  Object.keys(stats.emailsByType).length > 0 ? (
                    Object.entries(stats.emailsByType).map(
                      ([type, count], index) => (
                        <Div key={index} className="flex flex-col gap-2">
                          <Div className="flex items-center justify-between">
                            <Span className="text-sm font-medium capitalize">
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
                            </Span>
                            <Span className="text-sm text-muted-foreground">
                              {formatNumber(count)}
                            </Span>
                          </Div>
                          <Progress
                            value={
                              stats.totalEmails
                                ? (count / stats.totalEmails) * 100
                                : 0
                            }
                            className="h-2"
                          />
                        </Div>
                      ),
                    )
                  ) : (
                    <P className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noTypeData")}
                    </P>
                  )}
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>

        <TabsContent value="providers" className="flex flex-col gap-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Provider Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("app.admin.emails.stats.admin.stats.providerPerformance")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="flex flex-col gap-3">
                  {stats?.topPerformingProviders &&
                  Array.isArray(stats.topPerformingProviders) &&
                  stats.topPerformingProviders.length > 0 ? (
                    stats.topPerformingProviders.map(
                      (
                        provider: {
                          provider: string;
                          emailsSent: number;
                          deliveryRate: number;
                          openRate: number;
                          clickRate: number;
                          reliability: number;
                        },
                        index: number,
                      ) => (
                        <Div key={index} className="flex flex-col gap-2">
                          <Div className="flex items-center justify-between">
                            <Span className="text-sm font-medium capitalize">
                              {provider.provider}
                            </Span>
                            <Badge variant="outline">
                              {formatNumber(provider.emailsSent)}{" "}
                              {t("app.admin.emails.stats.admin.stats.sent")}
                            </Badge>
                          </Div>
                          <Div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <Span>
                              {t("app.admin.emails.stats.admin.stats.delivery")}
                              : {formatPercentage(provider.deliveryRate)}
                            </Span>
                            <Span>
                              {t("app.admin.emails.stats.admin.stats.open")}:{" "}
                              {formatPercentage(provider.openRate)}
                            </Span>
                            <Span>
                              {t("app.admin.emails.stats.admin.stats.click")}:{" "}
                              {formatPercentage(provider.clickRate)}
                            </Span>
                          </Div>
                          <Progress
                            value={provider.reliability * 100}
                            className="h-1"
                          />
                        </Div>
                      ),
                    )
                  ) : (
                    <P className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noProviderData")}
                    </P>
                  )}
                </Div>
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
                <Div className="flex flex-col gap-3">
                  {stats?.recentActivity &&
                  Array.isArray(stats.recentActivity) &&
                  stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map(
                      (
                        activity: {
                          details?: { subject?: string };
                          templateName?: string;
                          recipientEmail: string;
                          type: string;
                        },
                        index: number,
                      ) => (
                        <Div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <Div className="flex flex-col gap-1">
                            <P className="text-sm font-medium">
                              {(activity.details?.subject as string) ||
                                activity.templateName ||
                                t(
                                  "app.admin.emails.stats.admin.stats.noSubject",
                                )}
                            </P>
                            <P className="text-xs text-muted-foreground">
                              {activity.recipientEmail} • {activity.type}
                            </P>
                          </Div>
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
                        </Div>
                      ),
                    )
                  ) : (
                    <P className="text-sm text-muted-foreground">
                      {t("app.admin.emails.stats.admin.stats.noRecentActivity")}
                    </P>
                  )}
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>
      </Tabs>
    </Div>
  );
}
