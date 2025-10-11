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
  PieChart,
  Shield,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import { useUsersStats } from "@/app/api/[locale]/v1/core/users/stats/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UsersStatsChart } from "./users-stats-chart";
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

        {/* Unique Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users.admin.stats.uniqueCompanies")}
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.uniqueCompanies || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
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

      {/* Comprehensive Stats with Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            {t("users.admin.stats.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            {t("users.admin.stats.tabs.distribution")}
          </TabsTrigger>
          <TabsTrigger value="engagement">
            {t("users.admin.stats.tabs.engagement")}
          </TabsTrigger>
          <TabsTrigger value="activity">
            {t("users.admin.stats.tabs.activity")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Historical Chart */}
          {data?.historicalData && (
            <UsersStatsChart
              locale={locale}
              data={{
                series: Object.entries(data.historicalData).map(
                  ([, value]) => ({
                    name: value.name,
                    data: Array.isArray(value) ? value : value.data || [],
                    type: value?.type,
                    color: value?.color,
                  }),
                ),
                title: t("users.admin.stats.chart.title"),
                subtitle: t("users.admin.stats.historicalSubtitle"),
              }}
              isLoading={isLoading}
              height={400}
            />
          )}

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("users.admin.stats.profileCompleteness")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersWithBio")}</span>
                    <span>{formatNumber(data?.usersWithBio || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersWithWebsite")}</span>
                    <span>{formatNumber(data?.usersWithWebsite || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersWithJobTitle")}</span>
                    <span>{formatNumber(data?.usersWithJobTitle || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersWithImage")}</span>
                    <span>{formatNumber(data?.usersWithImage || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("users.admin.stats.contactMethods")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("users.admin.stats.usersWithPhone")}</span>
                    <span>{formatNumber(data?.usersWithPhone || 0)}</span>
                  </div>
                  {data?.usersByContactMethod &&
                    Object.entries(data.usersByContactMethod).map(
                      ([method, count]) => (
                        <div
                          key={method}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {/* Use type-safe translation key or fallback */}
                            {method === "email" &&
                              t("users.admin.stats.contactMethod.email")}
                            {method === "phone" &&
                              t("users.admin.stats.contactMethod.phone")}
                            {method === "sms" &&
                              t("users.admin.stats.contactMethod.sms")}
                            {method === "whatsapp" &&
                              t("users.admin.stats.contactMethod.whatsapp")}
                            {method === "telegram" &&
                              t("users.admin.stats.contactMethod.telegram")}
                            {method === "facebook" &&
                              t("users.admin.stats.contactMethod.facebook")}
                            {method === "instagram" &&
                              t("users.admin.stats.contactMethod.instagram")}
                            {method === "twitter" &&
                              t("users.admin.stats.contactMethod.twitter")}
                            {method === "linkedin" &&
                              t("users.admin.stats.contactMethod.linkedin")}
                            {method === "discord" &&
                              t("users.admin.stats.contactMethod.discord")}
                            {method === "slack" &&
                              t("users.admin.stats.contactMethod.slack")}
                            {method === "teams" &&
                              t("users.admin.stats.contactMethod.teams")}
                            {method === "zoom" &&
                              t("users.admin.stats.contactMethod.zoom")}
                            {method === "skype" &&
                              t("users.admin.stats.contactMethod.skype")}
                            {![
                              "email",
                              "phone",
                              "sms",
                              "whatsapp",
                              "telegram",
                              "facebook",
                              "instagram",
                              "twitter",
                              "linkedin",
                              "discord",
                              "slack",
                              "teams",
                              "zoom",
                              "skype",
                            ].includes(method) &&
                              t("users.admin.stats.contactMethod.other")}
                          </span>
                          <span>{formatNumber(count)}</span>
                        </div>
                      ),
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
                  {t("users.admin.stats.statusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.groupedStats?.byStatus?.map((status, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {status.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t("users.admin.stats.countWithPercentage", {
                            count: formatNumber(status.count),
                            percentage: formatPercentage(
                              status.percentage / 100,
                            ),
                          })}
                        </span>
                      </div>
                      <Progress value={status.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                  {data?.groupedStats?.byRole?.map((role, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{role.role}</span>
                        <span className="text-sm text-muted-foreground">
                          {t("users.admin.stats.countWithPercentage", {
                            count: formatNumber(role.count),
                            percentage: formatPercentage(role.percentage / 100),
                          })}
                        </span>
                      </div>
                      <Progress value={role.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Country Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("users.admin.stats.countryDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.groupedStats?.byCountry
                    ?.slice(0, 5)
                    .map((country, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {country.country}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(country.count)}
                          </span>
                        </div>
                        <Progress value={country.percentage} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Method Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("users.admin.stats.contactMethodDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.groupedStats?.byContactMethod?.map((method, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {method.contactMethod}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(method.count)}
                        </span>
                      </div>
                      <Progress value={method.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("users.admin.stats.statusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.groupedStats?.byLanguage
                    ?.slice(0, 5)
                    .map((language, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {language.language}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(language.count)}
                          </span>
                        </div>
                        <Progress value={language.percentage} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("users.admin.stats.roleDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.groupedStats?.byCompany
                    ?.slice(0, 5)
                    .map((company, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {company.company}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(company.count)}
                          </span>
                        </div>
                        <Progress value={company.percentage} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("users.admin.stats.profileCompletenessDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.groupedStats?.byProfileCompleteness?.map(
                    (level, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {level.completenessLevel}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(level.count)}
                          </span>
                        </div>
                        <Progress value={level.percentage} className="h-2" />
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("users.admin.stats.integrationStatusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.groupedStats?.byIntegrationStatus?.map(
                    (status, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {status.integrationType}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(status.count)}
                          </span>
                        </div>
                        <Progress
                          value={status.percentage * 100}
                          className="h-2"
                        />
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t("users.admin.stats.recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.recentActivity?.slice(0, 10).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{activity.type}</Badge>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.userEmail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  {t("users.admin.stats.roleDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.topPerformingCompanies
                    ?.slice(0, 5)
                    .map((company, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">#{index + 1}</Badge>
                          <div>
                            <p className="text-sm font-medium">
                              {company.company}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatNumber(company.userCount)}{" "}
                              {t("users.admin.stats.totalUsers")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPercentage(company.verificationRate)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("users.admin.stats.verificationRate")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Active Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {t("users.admin.stats.activeUsers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.mostActiveUsers?.slice(0, 5).map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <p className="text-sm font-medium">
                            {user.userEmail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("users.admin.stats.ofTotal")}:{" "}
                            {formatNumber(user.activityScore)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatPercentage(user.profileCompleteness)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("users.admin.stats.profileCompleteness")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
