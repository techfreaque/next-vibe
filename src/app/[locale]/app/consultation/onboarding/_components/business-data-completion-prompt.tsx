"use client";

import { Building, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Progress } from "next-vibe-ui/ui/progress";
import type { JSX } from "react";

import type { BusinessDataResponse } from "@/app/api/[locale]/v1/core/business-data/schema";
import { clientConsultationRepository } from "@/app/api/[locale]/v1/core/consultation/client-repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface BusinessDataCompletionPromptProps {
  locale: CountryLanguage;
  businessDataCompletionStatus: BusinessDataResponse | null;
}

export function BusinessDataCompletionPrompt({
  locale,
  businessDataCompletionStatus,
}: BusinessDataCompletionPromptProps): JSX.Element | null {
  const { t } = simpleT(locale);

  // Use the business logic from the API repository
  const completionData =
    clientConsultationRepository.processBusinessDataCompletion(
      businessDataCompletionStatus,
    );

  // Don't show if business logic determines it shouldn't be shown
  if (!completionData.shouldShow) {
    return null;
  }

  // Show completion message if business data is complete
  if (completionData.showCompleteMessage) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              {t("consultation.businessData.complete.message")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show completion prompt for incomplete business data
  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 shrink-0">
            <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  {t("consultation.businessData.preparation.title")}
                </h3>
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  {completionData.completionPercentage}%
                </span>
              </div>
              <Progress
                value={completionData.completionPercentage}
                className="h-1.5"
              />
            </div>

            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              {t("consultation.businessData.preparation.description")}
            </p>

            <div className="flex gap-2">
              <Button asChild size="sm" className="text-xs">
                <Link href={`/${locale}/app/business-info`}>
                  {t("consultation.businessData.actions.complete")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
