/**
 * Business Info Overview Client Component
 * Shows completion status and quick actions for all business info sections
 */

"use client";

import {
  ArrowRight,
  Building,
  CheckCircle,
  Circle,
  Share2,
  User,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import type { NavPaths } from "@/app/[locale]/_components/nav/nav-constants";
import { useBusinessDataEndpoint } from "@/app/api/[locale]/v1/core/business-data/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

interface BusinessInfoOverviewClientProps {
  locale: CountryLanguage;
}

interface CompletionStatus {
  isComplete: boolean;
  completedFields: number;
  totalFields: number;
  completionPercentage: number;
  missingRequiredFields: string[];
}

interface SectionInfo {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  href: NavPaths;
  completionStatus: CompletionStatus;
  isLoading: boolean;
}

export function BusinessInfoOverviewClient({
  locale,
}: BusinessInfoOverviewClientProps): JSX.Element {
  const { t } = simpleT(locale);

  // Load business data with completion status
  const businessData = useBusinessDataEndpoint();

  // Default completion status for endpoints that don't have it yet
  const defaultCompletionStatus: CompletionStatus = {
    isComplete: false,
    completedFields: 0,
    totalFields: 1,
    completionPercentage: 0,
    missingRequiredFields: [],
  };

  const isLoading = businessData.read?.isLoading ?? true;
  const completionData = businessData.read?.response?.success
    ? businessData.read.response.data?.completionStatus
    : undefined;

  const sections: SectionInfo[] = [
    {
      id: "profile",
      title: t("businessInfo.business_info.sections.profile.title"),
      description: t("businessInfo.business_info.sections.profile.description"),
      icon: <User className="h-5 w-5" />,
      href: "/app/business-info/profile",
      completionStatus: completionData?.profile || defaultCompletionStatus,
      isLoading,
    },
    {
      id: "business",
      title: t("businessInfo.business_info.sections.business.title"),
      description: t(
        "businessInfo.business_info.sections.business.description",
      ),
      icon: <Building className="h-5 w-5" />,
      href: "/app/business-info/business",
      completionStatus: completionData?.businessInfo || defaultCompletionStatus,
      isLoading,
    },
    // {
    //   id: "brand",
    //   title: t("businessInfo.business_info.sections.brand.title"),
    //   description: t("businessInfo.business_info.sections.brand.description"),
    //   icon: <Palette className="h-5 w-5" />,
    //   href: "/app/business-info/brand",
    //   completionStatus: completionData?.brand || defaultCompletionStatus,
    //   isLoading,
    // },
    // {
    //   id: "goals",
    //   title: t("businessInfo.business_info.sections.goals.title"),
    //   description: t("businessInfo.business_info.sections.goals.description"),
    //   icon: <Target className="h-5 w-5" />,
    //   href: "/app/business-info/goals",
    //   completionStatus: completionData?.goals || defaultCompletionStatus,
    //   isLoading,
    // },
    // {
    //   id: "audience",
    //   title: t("businessInfo.business_info.sections.audience.title"),
    //   description: t(
    //     "businessInfo.business_info.sections.audience.description",
    //   ),
    //   icon: <Users className="h-5 w-5" />,
    //   href: "/app/business-info/audience",
    //   completionStatus: completionData?.audience || defaultCompletionStatus,
    //   isLoading,
    // },
    // {
    //   id: "challenges",
    //   title: t("businessInfo.business_info.sections.challenges.title"),
    //   description: t(
    //     "businessInfo.business_info.sections.challenges.description",
    //   ),
    //   icon: <AlertTriangle className="h-5 w-5" />,
    //   href: "/app/business-info/challenges",
    //   completionStatus: completionData?.challenges || defaultCompletionStatus,
    //   isLoading,
    // },
    // {
    //   id: "competitors",
    //   title: t("businessInfo.business_info.sections.competitors.title"),
    //   description: t(
    //     "businessInfo.business_info.sections.competitors.description",
    //   ),
    //   icon: <Trophy className="h-5 w-5" />,
    //   href: "/app/business-info/competitors",
    //   completionStatus: completionData?.competitors || defaultCompletionStatus,
    //   isLoading,
    // },
    {
      id: "social",
      title: t("businessInfo.business_info.sections.social.title"),
      description: t("businessInfo.business_info.sections.social.description"),
      icon: <Share2 className="h-5 w-5" />,
      href: "/app/business-info/social",
      completionStatus: completionData?.social || defaultCompletionStatus,
      isLoading,
    },
  ];

  // Calculate overall completion
  const overallStatus = completionData?.overall;
  const completedSections = overallStatus?.completedSections ?? 0;
  const totalSections = overallStatus?.totalSections ?? sections.length;
  const overallCompletion = overallStatus?.completionPercentage ?? 0;

  // Get next recommended section
  const nextSection = sections.find(
    (section) => !section.completionStatus.isComplete,
  );

  return (
    <div className="space-y-8">
      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t("businessInfo.business_info.overview.overall_progress")}
          </CardTitle>
          <CardDescription>
            {t("businessInfo.business_info.overview.complete_all_sections")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-full" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("businessInfo.business_info.overview.sections_completed", {
                    completed: completedSections,
                    total: totalSections,
                  })}
                </span>
                <Badge
                  variant={overallCompletion === 100 ? "default" : "secondary"}
                >
                  {overallCompletion}%
                </Badge>
              </div>
              <Progress value={overallCompletion} className="h-3" />

              {nextSection && (
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    {t("businessInfo.business_info.overview.next")}:{" "}
                    {nextSection.title}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/${locale}${nextSection.href}`}>
                      {t("businessInfo.business_info.overview.continue")}{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            locale={locale}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

interface SectionCardProps {
  section: SectionInfo;
  t: TFunction;
  locale: CountryLanguage;
}

function SectionCard({ section, t, locale }: SectionCardProps): JSX.Element {
  const { completionStatus, isLoading } = section;

  return (
    <Card className="relative group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {section.icon}
            <CardTitle className="text-base">{section.title}</CardTitle>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-12" />
          ) : (
            <div className="flex items-center gap-2">
              {completionStatus.isComplete ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <Badge variant="secondary" className="text-xs">
                {completionStatus.completionPercentage}%
              </Badge>
            </div>
          )}
        </div>
        <CardDescription className="text-sm">
          {section.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-8 w-20" />
          </div>
        ) : (
          <div className="space-y-3">
            <Progress
              value={completionStatus.completionPercentage}
              className="h-2"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {completionStatus.completedFields} of{" "}
                {completionStatus.totalFields} fields
              </span>
              <Button asChild size="sm" variant="outline">
                <Link href={`/${locale}${section.href}`}>
                  {completionStatus.isComplete
                    ? t("businessInfo.business_info.overview.actions.review")
                    : t("businessInfo.business_info.overview.actions.complete")}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
