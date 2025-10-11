"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Mail,
  TrendingUp,
  Video,
} from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Progress } from "next-vibe-ui/ui/progress";
import type { JSX } from "react";

import type { BusinessDataResponse } from "@/app/api/[locale]/v1/core/business-data/schema";
import { BUSINESS_FORM_TIME } from "@/app/api/[locale]/v1/core/consultation/constants";
import { useConsultationSuccess } from "@/app/api/[locale]/v1/core/consultation/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CustomConsultationSuccessProps {
  locale: CountryLanguage;
  scheduledDate?: string;
  scheduledTime?: string;
  businessDataCompletionStatus: BusinessDataResponse | null;
}

export function ConsultationSuccess({
  locale,
  scheduledDate,
  scheduledTime,
  businessDataCompletionStatus,
}: CustomConsultationSuccessProps): JSX.Element {
  const { t } = simpleT(locale);

  // Use the consultation success hook for all business logic
  const {
    formattedDate,
    formattedTime,
    isBusinessDataComplete,
    completionPercentage,
    handleUpdate,
    handleContinue,
    navigateToBusinessInfo,
  } = useConsultationSuccess({
    locale,
    scheduledDate,
    scheduledTime,
    businessDataCompletionStatus,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center border border-green-200 dark:border-green-800">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-100">
            {t("onboarding.consultation.booked.title")}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {t("onboarding.consultation.booked.description")}
          </p>
        </div>
      </div>

      {/* Consultation Details */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
            <Video className="h-5 w-5" />
            {t("onboarding.consultation.card.title")}
          </CardTitle>
          <CardDescription>
            {t("onboarding.consultation.card.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium">
                  {t("onboarding.consultation.booked.success.selectedDate")}
                </p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium">
                  {t("onboarding.consultation.booked.success.selectedTime")}
                </p>
                <p className="text-sm text-muted-foreground">{formattedTime}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-green-200 dark:border-green-800">
            <Button
              onClick={handleUpdate}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t("onboarding.consultation.scheduled.updateMeeting")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Data Recommendation */}
      {isBusinessDataComplete ? null : (
        <Card
          className={
            "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t("onboarding.tasks.businessInfo.title")}
            </CardTitle>
            <CardDescription>
              {t("onboarding.tasks.businessInfo.description", {
                minutes: BUSINESS_FORM_TIME.COMPLETION_TIME_MINUTES,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("onboarding.progress.label")}</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {t("onboarding.nextSteps.startBusinessInfo")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("onboarding.tasks.businessInfo.description", {
                      minutes: BUSINESS_FORM_TIME.COMPLETION_TIME_MINUTES,
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={navigateToBusinessInfo}
                >
                  {t("onboarding.actions.start")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>{t("onboarding.consultation.nextSteps.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium">
                  {t("onboarding.consultation.nextSteps.labels.email")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("onboarding.consultation.nextSteps.email")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium">
                  {t("onboarding.consultation.nextSteps.labels.strategy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("onboarding.consultation.nextSteps.strategy")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button
          onClick={handleContinue}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {t("onboarding.consultation.booked.returnToDashboard")}
        </Button>
      </div>
    </div>
  );
}
