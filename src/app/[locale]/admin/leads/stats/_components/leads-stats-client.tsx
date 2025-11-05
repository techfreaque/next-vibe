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
} from 'next-vibe-ui/ui/icons';
import type { HistoricalDataSeriesType } from "next-vibe/shared/types/stats-filtering.schema";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";  
import { H4 } from "next-vibe-ui/ui/typography";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

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
      <Div className="space-y-6">
        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </Div>
          </CardContent>
        </Card>

        {/* Overview Cards Skeleton */}
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </Div>

        {/* Tabs Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Div className="flex space-x-2 mt-4">
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
    <Div className="space-y-6">
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
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.totalLeads")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.totalLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(stats?.newLeads || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.newThisMonth")}
            </P>
          </CardContent>
        </Card>

        {/* Active Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.activeLeads")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.activeLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.activeLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.conversionRate")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatPercentage(stats?.conversionRate || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(stats?.convertedLeads || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.convertedLeads")}
            </P>
          </CardContent>
        </Card>

        {/* Email Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.emailEngagement")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatPercentage(stats?.averageOpenRate || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatNumber(stats?.totalEmailsSent || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.emailsSent")}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Secondary Metrics */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Campaign Running Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.leads.leads.admin.stats.metrics.campaign_running_leads",
              )}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.campaignRunningLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.campaignRunningLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Consultation Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.consultationBookings")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.consultationBookedLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.consultationBookingRate || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.bookingRate")}
            </P>
          </CardContent>
        </Card>

        {/* Data Completeness */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.dataCompleteness")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatPercentage(stats?.dataCompletenessRate || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.leads.leads.admin.stats.profileCompleteness")}
            </P>
          </CardContent>
        </Card>

        {/* Lead Velocity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.leadVelocity")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.leadVelocity || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.leads.leads.admin.stats.leadsPerDay")}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Additional Lead Status Metrics */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Converted Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.convertedLeads")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.convertedLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.conversionRate || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.conversionRate")}
            </P>
          </CardContent>
        </Card>

        {/* Signed Up Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.signedUpLeads")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.signedUpLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.signupRate || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.signupRate")}
            </P>
          </CardContent>
        </Card>

        {/* Consultation Booked */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.consultationBookedLeads")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.consultationBookedLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.consultationBookingRate || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.bookingRate")}
            </P>
          </CardContent>
        </Card>

        {/* Subscription Confirmed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.leads.leads.admin.stats.subscriptionConfirmedLeads",
              )}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.subscriptionConfirmedLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(stats?.subscriptionConfirmationRate || 0)}{" "}
              {t("app.admin.leads.leads.admin.stats.confirmationRate")}
            </P>
          </CardContent>
        </Card>

        {/* Website User Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.leads.leads.admin.stats.metrics.website_user_leads",
              )}
            </CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.websiteUserLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.websiteUserLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Newsletter Subscriber Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.leads.leads.admin.stats.metrics.newsletter_subscriber_leads",
              )}
            </CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.newsletterSubscriberLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.newsletterSubscriberLeads || 0) /
                  (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Negative Status Metrics */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Unsubscribed Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.unsubscribedLeads")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.unsubscribedLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.unsubscribedLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Bounced Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.bouncedLeads")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.bouncedLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.bouncedLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Invalid Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.invalidLeads")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.invalidLeads || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.invalidLeads || 0) / (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Email Engagement Metrics */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leads with Email Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.leadsWithEmailEngagement")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.leadsWithEmailEngagement || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.leadsWithEmailEngagement || 0) /
                  (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Leads without Email Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.leads.leads.admin.stats.leadsWithoutEmailEngagement",
              )}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.leadsWithoutEmailEngagement || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {formatPercentage(
                (stats?.leadsWithoutEmailEngagement || 0) /
                  (stats?.totalLeads || 1),
              )}{" "}
              {t("app.admin.leads.leads.admin.stats.ofTotal")}
            </P>
          </CardContent>
        </Card>

        {/* Average Email Engagement Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(
                "app.admin.leads.leads.admin.stats.averageEmailEngagementScore",
              )}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.averageEmailEngagementScore || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.leads.leads.admin.stats.engagementScore")}
            </P>
          </CardContent>
        </Card>

        {/* Total Email Engagements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.stats.totalEmailEngagements")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {formatNumber(stats?.totalEmailEngagements || 0)}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("app.admin.leads.leads.admin.stats.totalEngagements")}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Time-based Metrics */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("app.admin.leads.leads.admin.stats.todayActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Div className="flex items-center justify-between">
              <Span className="text-sm font-medium">
                {t("app.admin.leads.leads.admin.stats.leadsCreatedToday")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsCreatedToday || 0)}
              </Span>
            </Div>
            <Div className="flex items-center justify-between">
              <Span className="text-sm font-medium">
                {t("app.admin.leads.leads.admin.stats.leadsUpdatedToday")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsUpdatedToday || 0)}
              </Span>
            </Div>
          </CardContent>
        </Card>

        {/* This Week's Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("app.admin.leads.leads.admin.stats.weekActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Div className="flex items-center justify-between">
              <Span className="text-sm font-medium">
                {t("app.admin.leads.leads.admin.stats.leadsCreatedThisWeek")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsCreatedThisWeek || 0)}
              </Span>
            </Div>
            <Div className="flex items-center justify-between">
              <Span className="text-sm font-medium">
                {t("app.admin.leads.leads.admin.stats.leadsUpdatedThisWeek")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsUpdatedThisWeek || 0)}
              </Span>
            </Div>
          </CardContent>
        </Card>

        {/* This Month's Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("app.admin.leads.leads.admin.stats.monthActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Div className="flex items-center justify-between">
              <Span className="text-sm font-medium">
                {t("app.admin.leads.leads.admin.stats.leadsCreatedThisMonth")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsCreatedThisMonth || 0)}
              </Span>
            </Div>
            <Div className="flex items-center justify-between">
              <Span className="text-sm font-medium">
                {t("app.admin.leads.leads.admin.stats.leadsUpdatedThisMonth")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {formatNumber(stats?.leadsUpdatedThisMonth || 0)}
              </Span>
            </Div>
          </CardContent>
        </Card>
      </Div>

      {/* Campaign Stage Distribution */}
      <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {t("app.admin.leads.leads.admin.stats.campaignStageDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="space-y-3">
              {stats?.leadsByCampaignStage &&
                Object.entries(stats.leadsByCampaignStage).map(
                  ([stage, count]) => (
                    <Div key={stage} className="space-y-2">
                      <Div className="flex items-center justify-between">
                        <Span className="text-sm font-medium">{stage}</Span>
                        <Span className="text-sm text-muted-foreground">
                          {formatNumber(count)}
                        </Span>
                      </Div>
                      <Progress
                        value={(count / (stats?.totalLeads || 1)) * 100}
                        className="h-2"
                      />
                    </Div>
                  ),
                )}
              <Div className="mt-4 pt-3 border-t">
                <Div className="flex items-center justify-between">
                  <Span className="text-sm font-medium">
                    {t(
                      "app.admin.leads.leads.admin.stats.leadsInActiveCampaigns",
                    )}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {formatNumber(stats?.leadsInActiveCampaigns || 0)}
                  </Span>
                </Div>
                <Div className="flex items-center justify-between">
                  <Span className="text-sm font-medium">
                    {t("app.admin.leads.leads.admin.stats.leadsNotInCampaigns")}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {formatNumber(stats?.leadsNotInCampaigns || 0)}
                  </Span>
                </Div>
              </Div>
            </Div>
          </CardContent>
        </Card>

        {/* Journey Variant Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t(
                "app.admin.leads.leads.admin.stats.journeyVariantDistribution",
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="space-y-3">
              {stats?.leadsByJourneyVariant &&
                Object.entries(stats.leadsByJourneyVariant).map(
                  ([variant, count]) => (
                    <Div key={variant} className="space-y-2">
                      <Div className="flex items-center justify-between">
                        <Span className="text-sm font-medium">
                          {variant.replace("_", " ")}
                        </Span>
                        <Span className="text-sm text-muted-foreground">
                          {t(
                            "app.admin.leads.leads.admin.stats.countWithPercentage",
                            {
                              count: formatNumber(count),
                              percentage: formatPercentage(
                                count / (stats?.totalLeads || 1),
                              ),
                            },
                          )}
                        </Span>
                      </Div>
                      <Progress
                        value={(count / (stats?.totalLeads || 1)) * 100}
                        className="h-2"
                      />
                    </Div>
                  ),
                )}
            </Div>
          </CardContent>
        </Card>
      </Div>

      {/* Comprehensive Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            {t("app.admin.leads.leads.admin.stats.overview")}
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            {t("app.admin.leads.leads.admin.stats.campaigns")}
          </TabsTrigger>
          <TabsTrigger value="performance">
            {t("app.admin.leads.leads.admin.stats.performance")}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            {t("app.admin.leads.leads.admin.stats.distribution")}
          </TabsTrigger>
          <TabsTrigger value="activity">
            {t("app.admin.leads.leads.admin.stats.activity")}
          </TabsTrigger>
          <TabsTrigger value="topPerformers">
            {t("app.admin.leads.leads.admin.stats.topPerformers")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Historical Chart */}
          {stats?.historicalData && (
            <LeadsStatsChart
              locale={locale}
              data={{
                series: Object.entries(stats.historicalData).map(
                  ([, value]) =>
                    ({
                      name: value.name,
                      nameParams: undefined,
                      data: value.data,
                      type: value.type,
                      color: value.color,
                    }) as HistoricalDataSeriesType,
                ),
                title: t("app.admin.leads.leads.admin.stats.chart.title"),
                subtitle: t(
                  "app.admin.leads.leads.admin.stats.historicalSubtitle",
                ),
              }}
              isLoading={isLoading}
              height={400}
            />
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.campaignPerformance")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Div className="grid grid-cols-2 gap-4">
                  <Div className="space-y-2">
                    <P className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.emailsSent")}
                    </P>
                    <P className="text-2xl font-bold">
                      {formatNumber(stats?.totalEmailsSent || 0)}
                    </P>
                  </Div>
                  <Div className="space-y-2">
                    <P className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.emailsOpened")}
                    </P>
                    <P className="text-2xl font-bold">
                      {formatNumber(stats?.totalEmailsOpened || 0)}
                    </P>
                  </Div>
                  <Div className="space-y-2">
                    <P className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.open_rate")}
                    </P>
                    <P className="text-2xl font-bold">
                      {formatPercentage(stats?.averageOpenRate || 0)}
                    </P>
                  </Div>
                  <Div className="space-y-2">
                    <P className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.click_rate")}
                    </P>
                    <P className="text-2xl font-bold">
                      {formatPercentage(stats?.averageClickRate || 0)}
                    </P>
                  </Div>
                </Div>
              </CardContent>
            </Card>

            {/* Top Performing Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.topCampaigns")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-3">
                  {stats?.topPerformingCampaigns
                    ?.slice(0, 5)
                    .map((campaign, index) => (
                      <Div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <Div className="space-y-1">
                          <P className="text-sm font-medium">
                            {campaign.campaignName}
                          </P>
                          <P className="text-xs text-muted-foreground">
                            {formatNumber(campaign.leadsGenerated)}{" "}
                            {t(
                              "app.admin.leads.leads.admin.stats.leadsGenerated",
                            )}
                          </P>
                        </Div>
                        <Badge variant="secondary">
                          {formatPercentage(campaign.conversionRate)}
                        </Badge>
                      </Div>
                    ))}
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.performanceMetrics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Div className="space-y-3">
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t(
                        "app.admin.leads.leads.admin.stats.avgTimeToConversion",
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.averageTimeToConversion || 0)} days
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.avgTimeToSignup")}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.averageTimeToSignup || 0)} days
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t(
                        "app.admin.leads.leads.admin.stats.avgTimeToConsultation",
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.averageTimeToConsultation || 0)} days
                    </Span>
                  </Div>
                </Div>
              </CardContent>
            </Card>

            {/* Top Performing Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.topSources")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-3">
                  {stats?.topPerformingSources
                    ?.slice(0, 5)
                    .map((source, index) => (
                      <Div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <Div className="space-y-1">
                          <P className="text-sm font-medium">{source.source}</P>
                          <P className="text-xs text-muted-foreground">
                            {formatNumber(source.leadsGenerated)}{" "}
                            {t(
                              "app.admin.leads.leads.admin.stats.leadsGenerated",
                            )}
                          </P>
                        </Div>
                        <Div className="text-right">
                          <Badge variant="secondary">
                            {formatPercentage(source.conversionRate)}
                          </Badge>
                          <P className="text-xs text-muted-foreground mt-1">
                            {t(
                              "app.admin.leads.leads.admin.stats.qualityScore",
                            )}
                            : {formatNumber(source.qualityScore)}
                          </P>
                        </Div>
                      </Div>
                    ))}
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.statusDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-3">
                  {stats?.groupedStats?.byStatus?.map((status, index) => (
                    <Div key={index} className="space-y-2">
                      <Div className="flex items-center justify-between">
                        <Span className="text-sm font-medium">
                          {status.label}
                        </Span>
                        <Span className="text-sm text-muted-foreground">
                          {t(
                            "app.admin.leads.leads.admin.stats.countWithPercentage",
                            {
                              count: formatNumber(status.value),
                              percentage: formatPercentage(
                                status.percentage / 100,
                              ),
                            },
                          )}
                        </Span>
                      </Div>
                      <Progress value={status.percentage} className="h-2" />
                    </Div>
                  ))}
                </Div>
              </CardContent>
            </Card>

            {/* Source Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.sourceDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-3">
                  {stats?.groupedStats?.bySource?.map((source, index) => (
                    <Div key={index} className="space-y-2">
                      <Div className="flex items-center justify-between">
                        <Span className="text-sm font-medium">
                          {source.label}
                        </Span>
                        <Span className="text-sm text-muted-foreground">
                          {t(
                            "app.admin.leads.leads.admin.stats.countWithPercentage",
                            {
                              count: formatNumber(source.value),
                              percentage: formatPercentage(
                                source.percentage / 100,
                              ),
                            },
                          )}
                        </Span>
                      </Div>
                      <Progress value={source.percentage} className="h-2" />
                    </Div>
                  ))}
                </Div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t(
                    "app.admin.leads.leads.admin.stats.geographicDistribution",
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-3">
                  {stats?.groupedStats?.byCountry?.map((country, index) => (
                    <Div key={index} className="space-y-2">
                      <Div className="flex items-center justify-between">
                        <Span className="text-sm font-medium">
                          {country.label}
                        </Span>
                        <Span className="text-sm text-muted-foreground">
                          {t(
                            "app.admin.leads.leads.admin.stats.countWithPercentage",
                            {
                              count: formatNumber(country.value),
                              percentage: formatPercentage(
                                country.percentage / 100,
                              ),
                            },
                          )}
                        </Span>
                      </Div>
                      <Progress value={country.percentage} className="h-2" />
                    </Div>
                  ))}
                </Div>
              </CardContent>
            </Card>

            {/* Data Completeness Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t(
                    "app.admin.leads.leads.admin.stats.dataCompletenessBreakdown",
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-3">
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.withBusinessName")}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithBusinessName || 0)}
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.withContactName")}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithContactName || 0)}
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.withPhone")}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithPhone || 0)}
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between">
                    <Span className="text-sm font-medium">
                      {t("app.admin.leads.leads.admin.stats.withWebsite")}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.leadsWithWebsite || 0)}
                    </Span>
                  </Div>
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-4">
                  {stats?.recentActivity
                    ?.slice(0, 10)
                    .map((activity, index) => (
                      <Div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg border"
                      >
                        <Div className="flex-1 space-y-1">
                          <Div className="flex items-center justify-between">
                            <P className="text-sm font-medium">
                              {activity.leadBusinessName || activity.leadEmail}
                            </P>
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </Div>
                          <P className="text-xs text-muted-foreground">
                            {activity.leadEmail}
                          </P>
                          <P className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </P>
                        </Div>
                      </Div>
                    ))}
                </Div>
              </CardContent>
            </Card>

            {/* Engagement Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t(
                    "app.admin.leads.leads.admin.stats.engagementLevelDistribution",
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-3">
                  {stats?.groupedStats?.byEngagementLevel?.map(
                    (engagement, index) => (
                      <Div key={index} className="space-y-2">
                        <Div className="flex items-center justify-between">
                          <Span className="text-sm font-medium">
                            {engagement.label}
                          </Span>
                          <Span className="text-sm text-muted-foreground">
                            {t(
                              "app.admin.leads.leads.admin.stats.countWithPercentage",
                              {
                                count: formatNumber(engagement.value),
                                percentage: formatPercentage(
                                  engagement.percentage / 100,
                                ),
                              },
                            )}
                          </Span>
                        </Div>
                        <Progress
                          value={engagement.percentage}
                          className="h-2"
                        />
                      </Div>
                    ),
                  )}
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>

        <TabsContent value="topPerformers" className="space-y-4">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t(
                    "app.admin.leads.leads.admin.stats.topPerformingCampaigns",
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-4">
                  {stats?.topPerformingCampaigns?.map((campaign, index) => (
                    <Div
                      key={index}
                      className="p-3 rounded-lg border space-y-2"
                    >
                      <Div className="flex items-center justify-between">
                        <H4 className="text-sm font-medium">
                          {campaign.campaignName}
                        </H4>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </Div>
                      <Div className="grid grid-cols-2 gap-4 text-xs">
                        <Div>
                          <Span className="text-muted-foreground">
                            {t(
                              "app.admin.leads.leads.admin.stats.leadsGenerated",
                            )}
                            :
                          </Span>
                          <Span className="ml-1 font-medium">
                            {formatNumber(campaign.leadsGenerated)}
                          </Span>
                        </Div>
                        <Div>
                          <Span className="text-muted-foreground">
                            {t(
                              "app.admin.leads.leads.admin.stats.conversionRate",
                            )}
                            :
                          </Span>
                          <Span className="ml-1 font-medium">
                            {formatPercentage(campaign.conversionRate)}
                          </Span>
                        </Div>
                        <Div>
                          <Span className="text-muted-foreground">
                            {t("app.admin.leads.leads.admin.stats.openRate")}:
                          </Span>
                          <Span className="ml-1 font-medium">
                            {formatPercentage(campaign.openRate)}
                          </Span>
                        </Div>
                        <Div>
                          <Span className="text-muted-foreground">
                            {t("app.admin.leads.leads.admin.stats.clickRate")}:
                          </Span>
                          <Span className="ml-1 font-medium">
                            {formatPercentage(campaign.clickRate)}
                          </Span>
                        </Div>
                      </Div>
                    </Div>
                  ))}
                </Div>
              </CardContent>
            </Card>

            {/* Top Performing Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("app.admin.leads.leads.admin.stats.topPerformingSources")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Div className="space-y-4">
                  {stats?.topPerformingSources?.map((source, index) => (
                    <Div
                      key={index}
                      className="p-3 rounded-lg border space-y-2"
                    >
                      <Div className="flex items-center justify-between">
                        <H4 className="text-sm font-medium">{source.source}</H4>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </Div>
                      <Div className="grid grid-cols-3 gap-4 text-xs">
                        <Div>
                          <Span className="text-muted-foreground">
                            {t(
                              "app.admin.leads.leads.admin.stats.leadsGenerated",
                            )}
                            :
                          </Span>
                          <Span className="ml-1 font-medium">
                            {formatNumber(source.leadsGenerated)}
                          </Span>
                        </Div>
                        <Div>
                          <Span className="text-muted-foreground">
                            {t(
                              "app.admin.leads.leads.admin.stats.conversionRate",
                            )}
                            :
                          </Span>
                          <Span className="ml-1 font-medium">
                            {formatPercentage(source.conversionRate)}
                          </Span>
                        </Div>
                        <Div>
                          <Span className="text-muted-foreground">
                            {t(
                              "app.admin.leads.leads.admin.stats.qualityScore",
                            )}
                            :
                          </Span>
                          <Span className="ml-1 font-medium">
                            {formatNumber(source.qualityScore)}
                          </Span>
                        </Div>
                      </Div>
                    </Div>
                  ))}
                </Div>
              </CardContent>
            </Card>
          </Div>
        </TabsContent>
      </Tabs>
    </Div>
  );
}
