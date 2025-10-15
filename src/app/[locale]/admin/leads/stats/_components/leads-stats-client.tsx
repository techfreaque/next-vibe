/**
 * Leads Stats Client Component
 * Displays comprehensive leads statistics and analytics with modular design
 */

"use client";

import {
  BarChart3,
  Globe,
  Mail,
  MailOpen,
  Monitor,
  PieChart,
  Send,
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
import type { Control } from "react-hook-form";

import type { LeadsStatsRequestType } from "@/app/api/[locale]/v1/core/leads/stats/definition";
import { useLeadsStats } from "@/app/api/[locale]/v1/core/leads/stats/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadsStatsChart } from "./leads-stats-chart";
import {
  LeadsStatsFilters,
  LeadsStatsFiltersContainer,
} from "./leads-stats-filters";

interface LeadsStatsClientProps {
  locale: CountryLanguage;
}

export function LeadsStatsClient({
  locale,
}: LeadsStatsClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const {
    stats,
    isLoading,
    refreshStats,
    formatPercentage,
    formatNumber,

    form,
    alert,
  } = useLeadsStats(locale);

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
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      <LeadsStatsFiltersContainer
        locale={locale}
        onRefresh={refreshStats}
        form={form}
      >
        <FormAlert alert={alert} />
        <LeadsStatsFilters control={form.control} />
      </LeadsStatsFiltersContainer>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.totalLeads")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.totalLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.newLeads || 0)}{" "}
              {t("leads.admin.stats.newThisMonth")}
            </p>
          </CardContent>
        </Card>

        {/* Active Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.activeLeads")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.activeLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.activeLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.conversionRate")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(stats?.conversionRate || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.convertedLeads || 0)}{" "}
              {t("leads.admin.stats.convertedLeads")}
            </p>
          </CardContent>
        </Card>

        {/* Email Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.emailEngagement")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(stats?.averageOpenRate || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.totalEmailsSent || 0)}{" "}
              {t("leads.admin.stats.emailsSent")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Campaign Running Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.metrics.campaign_running_leads")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.campaignRunningLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.campaignRunningLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Consultation Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.consultationBookings")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.consultationBookedLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.consultationBookingRate || 0)}{" "}
              {t("leads.admin.stats.bookingRate")}
            </p>
          </CardContent>
        </Card>

        {/* Data Completeness */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.dataCompleteness")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(stats?.dataCompletenessRate || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("leads.admin.stats.profileCompleteness")}
            </p>
          </CardContent>
        </Card>

        {/* Lead Velocity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.leadVelocity")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.leadVelocity || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("leads.admin.stats.leadsPerDay")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Lead Status Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Converted Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.convertedLeads")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.convertedLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.conversionRate || 0)}{" "}
              {t("leads.admin.stats.conversionRate")}
            </p>
          </CardContent>
        </Card>

        {/* Signed Up Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.signedUpLeads")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.signedUpLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.signupRate || 0)}{" "}
              {t("leads.admin.stats.signupRate")}
            </p>
          </CardContent>
        </Card>

        {/* Consultation Booked */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.consultationBookedLeads")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.consultationBookedLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.consultationBookingRate || 0)}{" "}
              {t("leads.admin.stats.bookingRate")}
            </p>
          </CardContent>
        </Card>

        {/* Subscription Confirmed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.subscriptionConfirmedLeads")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.subscriptionConfirmedLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.subscriptionConfirmationRate || 0)}{" "}
              {t("leads.admin.stats.confirmationRate")}
            </p>
          </CardContent>
        </Card>

        {/* Website User Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.metrics.website_user_leads")}
            </CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.websiteUserLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.websiteUserLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Newsletter Subscriber Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.metrics.newsletter_subscriber_leads")}
            </CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.newsletterSubscriberLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.newsletterSubscriberLeads || 0) /
                  (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Negative Status Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Unsubscribed Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.unsubscribedLeads")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.unsubscribedLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.unsubscribedLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Bounced Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.bouncedLeads")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.bouncedLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.bouncedLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Invalid Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.invalidLeads")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.invalidLeads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.invalidLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Email Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leads with Email Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.leadsWithEmailEngagement")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.leadsWithEmailEngagement || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.leadsWithEmailEngagement || 0) /
                  (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Leads without Email Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.leadsWithoutEmailEngagement")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.leadsWithoutEmailEngagement || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.leadsWithoutEmailEngagement || 0) /
                  (stats?.totalLeads || 1),
              )}{" "}
              {t("leads.admin.stats.ofTotal")}
            </p>
          </CardContent>
        </Card>

        {/* Average Email Engagement Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.averageEmailEngagementScore")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.averageEmailEngagementScore || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("leads.admin.stats.engagementScore")}
            </p>
          </CardContent>
        </Card>

        {/* Total Email Engagements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("leads.admin.stats.totalEmailEngagements")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.totalEmailEngagements || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("leads.admin.stats.totalEngagements")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("leads.admin.stats.todayActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t("leads.admin.stats.leadsCreatedToday")}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsCreatedToday || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t("leads.admin.stats.leadsUpdatedToday")}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsUpdatedToday || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* This Week's Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("leads.admin.stats.weekActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t("leads.admin.stats.leadsCreatedThisWeek")}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsCreatedThisWeek || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t("leads.admin.stats.leadsUpdatedThisWeek")}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsUpdatedThisWeek || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* This Month's Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("leads.admin.stats.monthActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t("leads.admin.stats.leadsCreatedThisMonth")}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsCreatedThisMonth || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t("leads.admin.stats.leadsUpdatedThisMonth")}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsUpdatedThisMonth || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {t("leads.admin.stats.campaignStageDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.leadsByCampaignStage &&
                Object.entries(stats.leadsByCampaignStage).map(
                  ([stage, count]) => (
                    <div key={stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stage}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(count)}
                        </span>
                      </div>
                      <Progress
                        value={(count / (stats?.totalLeads || 1)) * 100}
                        className="h-2"
                      />
                    </div>
                  ),
                )}
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("leads.admin.stats.leadsInActiveCampaigns")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(stats?.leadsInActiveCampaigns || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("leads.admin.stats.leadsNotInCampaigns")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(stats?.leadsNotInCampaigns || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Variant Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t("leads.admin.stats.journeyVariantDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.leadsByJourneyVariant &&
                Object.entries(stats.leadsByJourneyVariant).map(
                  ([variant, count]) => (
                    <div key={variant} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {variant.replace("_", " ")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t("leads.admin.stats.countWithPercentage", {
                            count: formatNumber(count),
                            percentage: formatPercentage(
                              count / (stats?.totalLeads || 1),
                            ),
                          })}
                        </span>
                      </div>
                      <Progress
                        value={(count / (stats?.totalLeads || 1)) * 100}
                        className="h-2"
                      />
                    </div>
                  ),
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            {t("leads.admin.stats.overview")}
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            {t("leads.admin.stats.campaigns")}
          </TabsTrigger>
          <TabsTrigger value="performance">
            {t("leads.admin.stats.performance")}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            {t("leads.admin.stats.distribution")}
          </TabsTrigger>
          <TabsTrigger value="activity">
            {t("leads.admin.stats.activity")}
          </TabsTrigger>
          <TabsTrigger value="topPerformers">
            {t("leads.admin.stats.topPerformers")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Historical Chart */}
          {stats?.historicalData && (
            <LeadsStatsChart
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
                title: t("leads.admin.stats.chart.title"),
                subtitle: t("leads.admin.stats.historicalSubtitle"),
              }}
              isLoading={isLoading}
              height={400}
            />
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t("leads.admin.stats.campaignPerformance")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {t("leads.admin.stats.emailsSent")}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(stats?.totalEmailsSent || 0)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {t("leads.admin.stats.emailsOpened")}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(stats?.totalEmailsOpened || 0)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {t("leads.admin.stats.open_rate")}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(stats?.averageOpenRate || 0)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {t("leads.admin.stats.click_rate")}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(stats?.averageClickRate || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t("leads.admin.stats.topCampaigns")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topPerformingCampaigns
                    ?.slice(0, 5)
                    .map((campaign, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {campaign.campaignName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatNumber(campaign.leadsGenerated)}{" "}
                            {t("leads.admin.stats.leadsGenerated")}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {formatPercentage(campaign.conversionRate)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("leads.admin.stats.performanceMetrics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("leads.admin.stats.avgTimeToConversion")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.averageTimeToConversion || 0)} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("leads.admin.stats.avgTimeToSignup")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.averageTimeToSignup || 0)} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("leads.admin.stats.avgTimeToConsultation")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.averageTimeToConsultation || 0)} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("leads.admin.stats.topSources")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topPerformingSources
                    ?.slice(0, 5)
                    .map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{source.source}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatNumber(source.leadsGenerated)}{" "}
                            {t("leads.admin.stats.leadsGenerated")}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            {formatPercentage(source.conversionRate)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("leads.admin.stats.qualityScore")}:{" "}
                            {formatNumber(source.qualityScore)}
                          </p>
                        </div>
                      </div>
                    ))}
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
                  {t("leads.admin.stats.statusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.groupedStats?.byStatus?.map((status, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {status.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t("leads.admin.stats.countWithPercentage", {
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

            {/* Source Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("leads.admin.stats.sourceDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.groupedStats?.bySource?.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {source.source}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t("leads.admin.stats.countWithPercentage", {
                            count: formatNumber(source.count),
                            percentage: formatPercentage(
                              source.percentage / 100,
                            ),
                          })}
                        </span>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("leads.admin.stats.geographicDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.groupedStats?.byCountry?.map((country, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {country.country}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t("leads.admin.stats.countWithPercentage", {
                            count: formatNumber(country.count),
                            percentage: formatPercentage(
                              country.percentage / 100,
                            ),
                          })}
                        </span>
                      </div>
                      <Progress value={country.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Completeness Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("leads.admin.stats.dataCompletenessBreakdown")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("leads.admin.stats.withBusinessName")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithBusinessName || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("leads.admin.stats.withContactName")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithContactName || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("leads.admin.stats.withPhone")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithPhone || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("leads.admin.stats.withWebsite")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithWebsite || 0)}
                    </span>
                  </div>
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
                  <Users className="h-4 w-4" />
                  {t("leads.admin.stats.recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity
                    ?.slice(0, 10)
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg border"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {activity.leadBusinessName || activity.leadEmail}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {activity.leadEmail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("leads.admin.stats.engagementLevelDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.groupedStats?.byEngagementLevel?.map(
                    (engagement, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {engagement.level}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {t("leads.admin.stats.countWithPercentage", {
                              count: formatNumber(engagement.count),
                              percentage: formatPercentage(
                                engagement.percentage / 100,
                              ),
                            })}
                          </span>
                        </div>
                        <Progress
                          value={engagement.percentage}
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

        <TabsContent value="topPerformers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t("leads.admin.stats.topPerformingCampaigns")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topPerformingCampaigns?.map((campaign, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {campaign.campaignName}
                        </h4>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            {t("leads.admin.stats.leadsGenerated")}:
                          </span>
                          <span className="ml-1 font-medium">
                            {formatNumber(campaign.leadsGenerated)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("leads.admin.stats.conversionRate")}:
                          </span>
                          <span className="ml-1 font-medium">
                            {formatPercentage(campaign.conversionRate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("leads.admin.stats.openRate")}:
                          </span>
                          <span className="ml-1 font-medium">
                            {formatPercentage(campaign.openRate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("leads.admin.stats.clickRate")}:
                          </span>
                          <span className="ml-1 font-medium">
                            {formatPercentage(campaign.clickRate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("leads.admin.stats.topPerformingSources")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topPerformingSources?.map((source, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{source.source}</h4>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            {t("leads.admin.stats.leadsGenerated")}:
                          </span>
                          <span className="ml-1 font-medium">
                            {formatNumber(source.leadsGenerated)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("leads.admin.stats.conversionRate")}:
                          </span>
                          <span className="ml-1 font-medium">
                            {formatPercentage(source.conversionRate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("leads.admin.stats.qualityScore")}:
                          </span>
                          <span className="ml-1 font-medium">
                            {formatNumber(source.qualityScore)}
                          </span>
                        </div>
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
