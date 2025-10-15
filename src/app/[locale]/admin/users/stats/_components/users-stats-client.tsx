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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import { useUsersStats } from "@/app/api/[locale]/v1/core/users/stats/hooks";
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
  const {
    stats: data,
    isLoading,
    refreshStats,
    formatPercentage,
    formatNumber,
    form,
    alert,
  } = useUsersStats(locale);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <UsersStatsFiltersContainer
        locale={locale}
        onRefresh={refreshStats}
        form={form}
      >
        <FormAlert alert={alert} />
        <UsersStatsFilters control={form.control} />
      </UsersStatsFiltersContainer>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.totalUsers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(data?.newUsers || 0)}{" "}
              {t("users.admin.stats.newThisMonth")}
            </p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.activeUsers")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.activeUsers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (data?.activeUsers || 0) / (data?.totalUsers || 1),
              )}{" "}
              {t("users.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Email Verified Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.emailVerifiedUsers")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.emailVerifiedUsers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(data?.verificationRate || 0)}{" "}
              {t("users.admin.stats.verificationRate")}
            </p>
          </CardContent>
        </Card>

        {/* Users with Stripe ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.usersWithStripeId")}
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.usersWithStripeId || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(data?.stripeIntegrationRate || 0)}{" "}
              {t("users.admin.stats.stripeIntegrationRate")}
            </p>
          </CardContent>
        </Card>

        {/* Users with Lead ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.usersWithLeadId")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.usersWithLeadId || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(data?.leadAssociationRate || 0)}{" "}
              {t("users.admin.stats.leadAssociationRate")}
            </p>
          </CardContent>
        </Card>

        {/* Growth Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.growthRate")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(data?.growthRate || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("users.admin.stats.newThisMonth")}
            </p>
          </CardContent>
        </Card>

        {/* Inactive Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.inactiveUsers")}
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.inactiveUsers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (data?.inactiveUsers || 0) / (data?.totalUsers || 1),
              )}{" "}
              {t("users.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Retention Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.retentionRate")}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(data?.retentionRate || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("users.admin.stats.userRetention")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats with Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">
            {t("users.admin.stats.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="roles">
            {t("users.admin.stats.tabs.roles")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("users.admin.stats.emailStats")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.emailVerifiedUsers")}</span>
                    <span>{formatNumber(data?.emailVerifiedUsers || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.emailUnverifiedUsers")}</span>
                    <span>{formatNumber(data?.emailUnverifiedUsers || 0)}</span>
                  </div>
                  <Progress
                    value={
                      data?.verificationRate ? data.verificationRate * 100 : 0
                    }
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(data?.verificationRate || 0)}{" "}
                    {t("users.admin.stats.verificationRate")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Integration Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("users.admin.stats.integrationStatus")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersWithStripeId")}</span>
                    <span>{formatNumber(data?.usersWithStripeId || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersWithLeadId")}</span>
                    <span>{formatNumber(data?.usersWithLeadId || 0)}</span>
                  </div>
                  <Progress
                    value={
                      data?.stripeIntegrationRate
                        ? data.stripeIntegrationRate * 100
                        : 0
                    }
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(data?.stripeIntegrationRate || 0)}{" "}
                    {t("users.admin.stats.stripeIntegration")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Time-based Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t("users.admin.stats.timeStats")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersCreatedToday")}</span>
                    <span>{formatNumber(data?.usersCreatedToday || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersCreatedThisWeek")}</span>
                    <span>{formatNumber(data?.usersCreatedThisWeek || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersCreatedThisMonth")}</span>
                    <span>
                      {formatNumber(data?.usersCreatedThisMonth || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersCreatedLastMonth")}</span>
                    <span>
                      {formatNumber(data?.usersCreatedLastMonth || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("users.admin.stats.performanceRates")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.growthRate")}</span>
                    <span>{formatPercentage(data?.growthRate || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      {t("users.admin.stats.leadToUserConversionRate")}
                    </span>
                    <span>
                      {formatPercentage(data?.leadToUserConversionRate || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.retentionRate")}</span>
                    <span>{formatPercentage(data?.retentionRate || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t("users.admin.stats.roleDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("users.admin.role.public")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(data?.publicUsers || 0)}
                      </span>
                    </div>
                    <Progress
                      value={
                        ((data?.publicUsers || 0) / (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("users.admin.role.customer")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(data?.customerUsers || 0)}
                      </span>
                    </div>
                    <Progress
                      value={
                        ((data?.customerUsers || 0) / (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("users.admin.role.partner_admin")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(data?.partnerAdminUsers || 0)}
                      </span>
                    </div>
                    <Progress
                      value={
                        ((data?.partnerAdminUsers || 0) /
                          (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("users.admin.role.partner_employee")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(data?.partnerEmployeeUsers || 0)}
                      </span>
                    </div>
                    <Progress
                      value={
                        ((data?.partnerEmployeeUsers || 0) /
                          (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("users.admin.role.admin")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(data?.adminUsers || 0)}
                      </span>
                    </div>
                    <Progress
                      value={
                        ((data?.adminUsers || 0) / (data?.totalUsers || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
