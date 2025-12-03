/**
 * Users Stats Client Component
 * Displays users statistics and analytics following leads stats pattern
 */

"use client";

import {
  BarChart3,
  Crown,
  Globe,
  Mail,
  Shield,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useUsersStats } from "@/app/api/[locale]/users/stats/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import {
  UsersStatsFilters,
  UsersStatsFiltersContainer,
} from "./users-stats-filters";

interface UsersStatsClientProps {
  locale: CountryLanguage;
}

export function UsersStatsClient({
  locale,
}: UsersStatsClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const {
    stats: data,
    isLoading,
    refreshStats,
    formatPercentage,
    formatNumber,
    form,
    alert,
  } = useUsersStats(locale, logger);

  if (isLoading) {
    return (
      <Div className="flex flex-col gap-6">
        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </Div>
          </CardContent>
        </Card>

        {/* Overview Cards Skeleton */}
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
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
      <UsersStatsFiltersContainer
        locale={locale}
        onRefresh={refreshStats}
        form={form}
      >
        <FormAlert alert={alert} />
        <UsersStatsFilters control={form.control} />
      </UsersStatsFiltersContainer>

      {/* Key Metrics Overview */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(data?.totalUsers || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(data?.newUsers || 0)}{" "}
              {t("app.admin.users.stats.newUsers")}
            </P>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.activeUsers")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(data?.activeUsers || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (data?.activeUsers || 0) / (data?.totalUsers || 1),
              )}{" "}
              {t("app.admin.users.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Email Verified Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.emailVerifiedUsers")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(data?.emailVerifiedUsers || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(data?.verificationRate || 0)}{" "}
              {t("app.admin.users.stats.verificationRate")}
            </P>
          </CardContent>
        </Card>

        {/* Users with Stripe ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.usersWithStripeId")}
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(data?.usersWithStripeId || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(data?.stripeIntegrationRate || 0)}{" "}
              {t("app.admin.users.stats.stripeIntegrationRate")}
            </P>
          </CardContent>
        </Card>

        {/* Users with Lead ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.usersWithLeadId")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(data?.usersWithLeadId || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(data?.leadAssociationRate || 0)}{" "}
              {t("app.admin.users.stats.leadAssociationRate")}
            </P>
          </CardContent>
        </Card>

        {/* Growth Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.growthRate")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatPercentage(data?.growthRate || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.users.stats.newUsers")}
            </P>
          </CardContent>
        </Card>

        {/* Inactive Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.inactiveUsers")}
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(data?.inactiveUsers || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (data?.inactiveUsers || 0) / (data?.totalUsers || 1),
              )}{" "}
              {t("app.admin.users.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Retention Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.users.stats.retentionRate")}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatPercentage(data?.retentionRate || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.users.stats.userRetention")}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Detailed Stats with Tabs */}
      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">
            {t("app.admin.users.stats.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            {t("app.admin.users.stats.tabs.distribution")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4">
          {/* Additional Metrics */}
          <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("app.admin.users.stats.emailVerified")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="flex flex-col gap-2">
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.emailVerifiedUsers")}</Span>
                    <Span>{formatNumber(data?.emailVerifiedUsers || 0)}</Span>
                  </Div>
                  <Div className="flex justify-between text-sm">
                    <Span>
                      {t("app.admin.users.stats.emailUnverifiedUsers")}
                    </Span>
                    <Span>{formatNumber(data?.emailUnverifiedUsers || 0)}</Span>
                  </Div>
                  <Progress
                    value={
                      data?.verificationRate ? data.verificationRate * 100 : 0
                    }
                    className="mt-2"
                  />
                  <P className="text-xs text-muted-foreground">
                    {formatPercentage(data?.verificationRate || 0)}{" "}
                    {t("app.admin.users.stats.verificationRate")}
                  </P>
                </Div>
              </CardContent>
            </Card>

            {/* Integration Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("app.admin.users.stats.integrationStatusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="flex flex-col gap-2">
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.usersWithStripeId")}</Span>
                    <Span>{formatNumber(data?.usersWithStripeId || 0)}</Span>
                  </Div>
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.usersWithLeadId")}</Span>
                    <Span>{formatNumber(data?.usersWithLeadId || 0)}</Span>
                  </Div>
                  <Progress
                    value={
                      data?.stripeIntegrationRate
                        ? data.stripeIntegrationRate * 100
                        : 0
                    }
                    className="mt-2"
                  />
                  <P className="text-xs text-muted-foreground">
                    {formatPercentage(data?.stripeIntegrationRate || 0)}{" "}
                    {t("app.admin.users.stats.stripeIntegrationRate")}
                  </P>
                </Div>
              </CardContent>
            </Card>

            {/* Time-based Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t("app.admin.users.stats.additionalMetrics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="flex flex-col gap-2">
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.newUsers")}</Span>
                    <Span>{formatNumber(data?.usersCreatedToday || 0)}</Span>
                  </Div>
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.activeUsers")}</Span>
                    <Span>{formatNumber(data?.usersCreatedThisWeek || 0)}</Span>
                  </Div>
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.totalUsers")}</Span>
                    <Span>
                      {formatNumber(data?.usersCreatedThisMonth || 0)}
                    </Span>
                  </Div>
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.inactiveUsers")}</Span>
                    <Span>
                      {formatNumber(data?.usersCreatedLastMonth || 0)}
                    </Span>
                  </Div>
                </Div>
              </CardContent>
            </Card>

            {/* Performance Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("app.admin.users.stats.verificationRate")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="flex flex-col gap-2">
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.growthRate")}</Span>
                    <Span>{formatPercentage(data?.growthRate || 0)}</Span>
                  </Div>
                  <Div className="flex justify-between text-sm">
                    <Span>
                      {t("app.admin.users.stats.leadToUserConversionRate")}
                    </Span>
                    <Span>
                      {formatPercentage(data?.leadToUserConversionRate || 0)}
                    </Span>
                  </Div>
                  <Div className="flex justify-between text-sm">
                    <Span>{t("app.admin.users.stats.retentionRate")}</Span>
                    <Span>{formatPercentage(data?.retentionRate || 0)}</Span>
                  </Div>
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>

        <TabsContent value="distribution" className="flex flex-col gap-4">
          <Div className="grid grid-cols-1 gap-6">
            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t("app.admin.users.stats.usersByRole")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="flex flex-col gap-3">
                  <Div className="flex flex-col gap-2">
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm font-medium">
                        {t("app.admin.users.role.public")}
                      </Span>
                      <Span className="text-sm text-muted-foreground">
                        {formatNumber(data?.publicUsers || 0)}
                      </Span>
                    </Div>
                    <Progress
                      value={
                        ((data?.publicUsers || 0) / (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </Div>

                  <Div className="flex flex-col gap-2">
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm font-medium">
                        {t("app.admin.users.role.customer")}
                      </Span>
                      <Span className="text-sm text-muted-foreground">
                        {formatNumber(data?.customerUsers || 0)}
                      </Span>
                    </Div>
                    <Progress
                      value={
                        ((data?.customerUsers || 0) / (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </Div>

                  <Div className="flex flex-col gap-2">
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm font-medium">
                        {t("app.admin.users.role.partner_admin")}
                      </Span>
                      <Span className="text-sm text-muted-foreground">
                        {formatNumber(data?.partnerAdminUsers || 0)}
                      </Span>
                    </Div>
                    <Progress
                      value={
                        ((data?.partnerAdminUsers || 0) /
                          (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </Div>

                  <Div className="flex flex-col gap-2">
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm font-medium">
                        {t("app.admin.users.role.partner_employee")}
                      </Span>
                      <Span className="text-sm text-muted-foreground">
                        {formatNumber(data?.partnerEmployeeUsers || 0)}
                      </Span>
                    </Div>
                    <Progress
                      value={
                        ((data?.partnerEmployeeUsers || 0) /
                          (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </Div>

                  <Div className="flex flex-col gap-2">
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm font-medium">
                        {t("app.admin.users.role.admin")}
                      </Span>
                      <Span className="text-sm text-muted-foreground">
                        {formatNumber(data?.adminUsers || 0)}
                      </Span>
                    </Div>
                    <Progress
                      value={
                        ((data?.adminUsers || 0) / (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </Div>
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>
      </Tabs>
    </Div>
  );
}
