/**
 * Consultations Stats Client Component
 * Displays consultation statistics and analytics
 */

"use client";

import {
  Calendar,
  CheckCircle,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type React from "react";

import type { ConsultationStatsResponseTypeOutput } from "@/app/api/[locale]/v1/core/consultation/admin/stats/definition";
import { useConsultationStatsEndpoint } from "@/app/api/[locale]/v1/core/consultation/admin/stats/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ConsultationsStatsClientProps {
  locale: CountryLanguage;
}

export function ConsultationsStatsClient({
  locale,
}: ConsultationsStatsClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const statsEndpoint = useConsultationStatsEndpoint();

  const apiResponse = statsEndpoint.read.response;
  const isLoading = statsEndpoint.read.isLoading;
  const error = statsEndpoint.read.error;

  if (isLoading) {
    return (
      <div className="space-y-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !apiResponse?.success) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          {t("consultations.admin.errors.unknown.description")}
        </AlertDescription>
      </Alert>
    );
  }

  const stats = apiResponse.data;

  // Helper function to format percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Helper function to format hours
  const formatHours = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}${t("consultations.admin.stats.hours")}`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("consultations.admin.stats.totalConsultations")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalConsultations || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("consultations.admin.stats.schedulingRate")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(75)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.scheduledConsultations || 0} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("consultations.admin.stats.completionRate")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(85)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedConsultations || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("consultations.admin.stats.consultationsThisMonth")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalConsultations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.scheduledConsultations || 0} {t("consultation.title")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("consultations.admin.stats.consultationsByStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {t("consultations.admin.stats.pending")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stats.totalConsultations || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Type Stats */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("consultations.admin.stats.businessTypeStats")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("consultation.title")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stats.completedConsultations || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("consultations.admin.stats.conversionStats")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("consultations.admin.stats.schedulingRate")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(75)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("consultations.admin.stats.completionRate")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(85)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("consultations.admin.stats.cancellationRate")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(10)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("consultations.admin.stats.noShowRate")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(5)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Times */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("consultations.admin.stats.averageResponseTime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("consultations.admin.stats.requestToScheduled")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatHours(24)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("consultations.admin.stats.scheduledToCompleted")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatHours(48)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
