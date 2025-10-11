"use client";

import { Clock, Video } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import type { JSX } from "react";

import { CONSULTATION_DURATION } from "@/app/api/[locale]/v1/core/consultation/constants";
import { useTranslation } from "@/i18n/core/client";

interface ConsultationInfoCardProps {
  isUpdate?: boolean;
}

export function ConsultationInfoCard({
  isUpdate = false,
}: ConsultationInfoCardProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Video className="h-6 w-6 text-primary" />
          {isUpdate
            ? t("onboarding.consultation.update.title")
            : t("onboarding.consultation.card.title")}
        </CardTitle>
        <CardDescription className="text-base">
          {isUpdate
            ? t("onboarding.consultation.update.description")
            : t("onboarding.consultation.card.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Badge
            variant="secondary"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
          >
            <Clock className="h-3 w-3 mr-1" />
            {t("onboarding.consultation.card.duration", {
              minDuration: CONSULTATION_DURATION.MIN_DURATION_MINUTES,
              maxDuration: CONSULTATION_DURATION.MAX_DURATION_MINUTES,
            })}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
          >
            {t("onboarding.consultation.card.price")}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
          >
            {t("onboarding.consultation.card.type")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
