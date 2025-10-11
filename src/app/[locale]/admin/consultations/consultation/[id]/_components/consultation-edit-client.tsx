"use client";

/**
 * Consultation Edit Client Component
 * Client-side component for editing consultations
 */

import { useRouter } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import type { ConsultationGetResponseType } from "@/app/api/[locale]/v1/core/consultation/admin/consultation/[id]/definition";
import { useConsultationAdminEndpoint } from "@/app/api/[locale]/v1/core/consultation/admin/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationEditForm } from "./consultation-edit-form";

interface ConsultationEditClientProps {
  consultationId: string;
  locale: CountryLanguage;
  initialData: ConsultationGetResponseType;
}

export function ConsultationEditClient({
  consultationId,
  locale,
  initialData,
}: ConsultationEditClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  // Get update endpoint for form handling
  const consultationUpdateEndpoint = useConsultationAdminEndpoint({
    id: consultationId,
    enabled: true,
    defaultValues: {
      status: initialData.status,
      scheduledDate: initialData.scheduledDate,
      scheduledTime: initialData.scheduledTime,
      calendarEventId: initialData.calendarEventId,
      meetingLink: initialData.meetingLink,
      icsAttachment: initialData.icsAttachment,
      isNotified: initialData.isNotified,
      message: initialData.message,
    },
  });

  const handleBack = (): void => {
    router.push(`/${locale}/admin/consultations/list`);
  };
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("consultations.admin.list.table.edit")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {initialData.userEmail} • {initialData.userName}
          </p>
        </div>
        <Button onClick={handleBack} variant="outline">
          {t("consultations.admin.list.table.view")}
        </Button>
      </div>

      {/* Edit form */}
      <ConsultationEditForm
        consultation={initialData}
        updateEndpoint={consultationUpdateEndpoint}
        locale={locale}
      />
    </div>
  );
}
