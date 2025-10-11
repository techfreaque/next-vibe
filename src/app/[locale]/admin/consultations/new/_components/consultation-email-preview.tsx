"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Label } from "next-vibe-ui/ui/label";
import type React from "react";
import { useMemo, useState } from "react";

import { renderConsultationAdminEmail } from "@/app/api/[locale]/v1/core/consultation/create/email-client";
import type { StandardUserType } from "@/app/api/[locale]/v1/core/user/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLocaleString } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

interface ConsultationEmailPreviewProps {
  consultationData: {
    name?: string;
    email?: string;
    message?: string;
    preferredDate?: string;
    preferredTime?: string;
    businessName?: string;
    businessType?: string;
  };
  locale: CountryLanguage;
}

export function ConsultationEmailPreview({
  consultationData,
  locale,
}: ConsultationEmailPreviewProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = simpleT(locale);

  // Create mock user data for preview
  const mockUser: StandardUserType = useMemo(
    () => ({
      id: "preview-user",
      leadId: null,
      isPublic: false,
      firstName:
        consultationData.name?.split(" ")[0] ||
        t("consultations.admin.emailPreview.defaultFirstName"),
      lastName:
        consultationData.name?.split(" ").slice(1).join(" ") ||
        t("consultations.admin.emailPreview.defaultLastName"),
      company:
        consultationData.businessName ||
        t("consultations.admin.emailPreview.defaultCompany"),
      email:
        consultationData.email ||
        t("consultations.admin.emailPreview.defaultEmail"),
      isActive: true,
      emailVerified: true,
      requireTwoFactor: false,
      marketingConsent: true,
      userRoles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    [
      consultationData.name,
      consultationData.email,
      consultationData.businessName,
      t,
    ],
  );

  // Format preferred date for display
  const formattedPreferredDate = useMemo(() => {
    if (!consultationData.preferredDate) {
      return t("consultation.email.noScheduledDate");
    }
    return new Date(consultationData.preferredDate).toLocaleDateString(
      getLocaleString(locale),
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  }, [consultationData.preferredDate, locale, t]);

  // Generate email subject
  const emailSubject = useMemo(
    () => t("consultation.email.subject", { appName: t("app.appName") }),
    [t],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("consultations.admin.emailPreview.title")}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto flex items-center gap-2"
        >
          {isExpanded
            ? t("consultations.admin.emailPreview.collapse")
            : t("consultations.admin.emailPreview.preview")}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="w-16 text-muted-foreground">
              {t("consultations.admin.emailPreview.to")}
            </Label>
            <span className="text-sm">{mockUser.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <Label className="w-16 text-muted-foreground">
              {t("consultations.admin.emailPreview.subject")}
            </Label>
            <span className="text-sm font-medium">{emailSubject}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("consultations.admin.emailPreview.content")}
              </span>
            </div>
            <div className="border rounded-md p-4 bg-white dark:bg-gray-900">
              {renderConsultationAdminEmail(
                t,
                locale,
                mockUser,
                {
                  preferredDate: consultationData.preferredDate,
                  preferredTime: consultationData.preferredTime,
                  message: consultationData.message,
                },
                formattedPreferredDate,
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("consultations.admin.emailPreview.note")}
          </p>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-sm">
              <strong>
                {t("consultations.admin.emailPreview.subjectPrefix")}
              </strong>{" "}
              {emailSubject}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
