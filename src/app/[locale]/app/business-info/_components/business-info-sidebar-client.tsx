/**
 * Business Info Sidebar Client Component
 * Enhanced navigation sidebar with completion tracking and current section indication
 */

"use client";

import { Building, Check, ChevronRight, Share2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import { useBusinessDataEndpoint } from "@/app/api/[locale]/v1/core/business-data/hooks";
import type { SectionCompletionStatus } from "@/app/api/[locale]/v1/core/business-data/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { NavItem } from "../layout";

interface BusinessInfoSidebarClientProps {
  locale: CountryLanguage;
}

interface SectionCompletionData {
  profile?: SectionCompletionStatus;
  businessInfo?: SectionCompletionStatus;
  goals?: SectionCompletionStatus;
  social?: SectionCompletionStatus;
  brand?: SectionCompletionStatus;
  audience?: SectionCompletionStatus;
  challenges?: SectionCompletionStatus;
  competitors?: SectionCompletionStatus;
}

export function BusinessInfoSidebarClient({
  locale,
}: BusinessInfoSidebarClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const pathname = usePathname();
  const businessData = useBusinessDataEndpoint();

  const navItems: NavItem[] = [
    {
      href: `/app/business-info`,
      icon: <Building className="h-4 w-4" />,
      title: t("businessInfo.nav.overview.title"),
      description: t("businessInfo.nav.overview.description"),
      segment: "",
    },
    {
      href: `/app/business-info/profile`,
      icon: <User className="h-4 w-4" />,
      title: t("businessInfo.nav.profile.title"),
      description: t("businessInfo.nav.profile.description"),
      segment: "profile",
    },
    {
      href: `/app/business-info/business`,
      icon: <Building className="h-4 w-4" />,
      title: t("businessInfo.nav.business.title"),
      description: t("businessInfo.nav.business.description"),
      segment: "business",
    },
    // {
    //   href: `/app/business-info/brand`,
    //   icon: <Palette className="h-4 w-4" />,
    //   title: t("businessInfo.nav.brand.title"),
    //   description: t("businessInfo.nav.brand.description"),
    //   segment: "brand",
    // },
    // {
    //   href: `/app/business-info/goals`,
    //   icon: <Target className="h-4 w-4" />,
    //   title: t("businessInfo.nav.goals.title"),
    //   description: t("businessInfo.nav.goals.description"),
    //   segment: "goals",
    // },
    // {
    //   href: `/app/business-info/audience`,
    //   icon: <Users className="h-4 w-4" />,
    //   title: t("businessInfo.nav.audience.title"),
    //   description: t("businessInfo.nav.audience.description"),
    //   segment: "audience",
    // },
    // {
    //   href: `/app/business-info/challenges`,
    //   icon: <AlertTriangle className="h-4 w-4" />,
    //   title: t("businessInfo.nav.challenges.title"),
    //   description: t("businessInfo.nav.challenges.description"),
    //   segment: "challenges",
    // },
    // {
    //   href: `/app/business-info/competitors`,
    //   icon: <Trophy className="h-4 w-4" />,
    //   title: t("businessInfo.nav.competitors.title"),
    //   description: t("businessInfo.nav.competitors.description"),
    //   segment: "competitors",
    // },
    {
      href: `/app/business-info/social`,
      icon: <Share2 className="h-4 w-4" />,
      title: t("businessInfo.nav.social.title"),
      description: t("businessInfo.nav.social.description"),
      segment: "social",
    },
  ];

  const isLoading = businessData.read.isLoading;
  const completionData: SectionCompletionData | undefined = businessData.read
    .response?.success
    ? businessData.read.response.data?.completionStatus
    : undefined;

  // Map section segments to completion data keys
  const getCompletionStatus = (segment: string): SectionCompletionStatus => {
    const defaultStatus: SectionCompletionStatus = {
      isComplete: false,
      completedFields: 0,
      totalFields: 1,
      completionPercentage: 0,
      missingRequiredFields: [],
    };

    if (!completionData) {
      return defaultStatus;
    }

    switch (segment) {
      case "profile":
        return completionData.profile || defaultStatus;
      case "business":
        return completionData.businessInfo || defaultStatus;
      case "goals":
        return completionData.goals || defaultStatus;
      case "social":
        return completionData.social || defaultStatus;
      case "brand":
        return completionData.brand || defaultStatus;
      case "audience":
        return completionData.audience || defaultStatus;
      case "challenges":
        return completionData.challenges || defaultStatus;
      case "competitors":
        return completionData.competitors || defaultStatus;
      default:
        return defaultStatus;
    }
  };

  // Determine if a nav item is currently active
  const isActiveSection = (item: NavItem): boolean => {
    if (item.segment === "") {
      // Overview page - exact match
      return pathname === `/${locale}/app/business-info`;
    }
    // Section pages - check if pathname contains the segment
    return pathname.includes(`/app/business-info/${item.segment}`);
  };

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = isActiveSection(item);
        const completionStatus = getCompletionStatus(item.segment);
        const isCompleted = completionStatus.isComplete;
        const completionPercentage = completionStatus.completionPercentage;

        return (
          <div key={item.href} className="relative">
            <Link
              href={`/${locale}${item.href}`}
              className={cn(
                "flex items-start gap-3 rounded-lg p-3 text-sm transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isActive &&
                  "bg-primary/10 text-primary border border-primary/20 shadow-sm",
                !isActive && "hover:shadow-sm",
              )}
            >
              {/* Icon with completion indicator */}
              <div className="flex-shrink-0 mt-0.5 relative">
                {item.icon}
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className={cn(
                      "font-medium truncate",
                      isActive && "font-semibold",
                    )}
                  >
                    {item.title}
                  </p>

                  {/* Completion badge */}
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : completionPercentage > 0 ? (
                    <Badge
                      variant={isCompleted ? "default" : "secondary"}
                      className={cn(
                        "ml-2 text-xs",
                        isCompleted && "bg-green-500 hover:bg-green-600",
                      )}
                    >
                      {completionPercentage}%
                    </Badge>
                  ) : null}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {item.description}
                </p>

                {/* Progress bar */}
                {isLoading ? (
                  <Skeleton className="h-1 w-full" />
                ) : completionPercentage > 0 ? (
                  <div className="space-y-1">
                    <Progress
                      value={completionPercentage}
                      className={cn(
                        "h-1",
                        isCompleted && "[&>div]:bg-green-500",
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {completionStatus.completedFields} of{" "}
                        {completionStatus.totalFields} fields
                      </span>
                      {isCompleted && (
                        <span className="text-green-600 font-medium">
                          {t("businessInfo.overview.badge.completed")}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-1 bg-muted rounded-full" />
                )}
              </div>

              {/* Current section indicator */}
              {isActive && (
                <div className="flex-shrink-0 mt-0.5">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              )}
            </Link>

            {/* Active section left border indicator */}
            {isActive && (
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
