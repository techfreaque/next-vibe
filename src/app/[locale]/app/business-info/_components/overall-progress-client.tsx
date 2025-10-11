/**
 * Overall Progress Client Component
 * Shows overall completion status for all business info sections
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import { useBusinessDataEndpoint } from "@/app/api/[locale]/v1/core/business-data/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface OverallProgressClientProps {
  locale: CountryLanguage;
}

export function OverallProgressClient({
  locale,
}: OverallProgressClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const businessData = useBusinessDataEndpoint();

  const isLoading = businessData.read.isLoading;
  const overallStatus = businessData.read.response?.success
    ? businessData.read.response.data?.completionStatus?.overall
    : undefined;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-3 w-48" />
      </div>
    );
  }

  const completionPercentage = overallStatus?.completionPercentage ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {t("businessInfo.progress.overall")}
        </span>
        <Badge variant="secondary">
          {t("businessInfo.progress.percentage", {
            percentage: completionPercentage,
          })}
        </Badge>
      </div>
      <Progress value={completionPercentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {t("businessInfo.progress.description")}
      </p>
    </div>
  );
}
