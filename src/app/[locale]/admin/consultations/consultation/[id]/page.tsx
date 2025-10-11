/**
 * Consultation Edit Page
 * Admin page for editing a specific consultation
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";

import { consultationUpdateAdminRepository } from "@/app/api/[locale]/v1/core/consultation/admin/consultation/[id]/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationEditClient } from "./_components/consultation-edit-client";

interface ConsultationEditPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function ConsultationEditPage({
  params,
}: ConsultationEditPageProps): Promise<React.JSX.Element> {
  const { locale, id } = await params;
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Require admin user authentication
  const user = await authRepository.requireAdminUser(
    locale,
    `/${locale}/admin/consultations/consultation/${id}`,
    logger,
  );

  // Fetch consultation data to verify it exists
  const consultationResponse =
    await consultationUpdateAdminRepository.getConsultationById(
      id,
      user,
      locale,
      logger,
    );

  // Handle consultation not found
  if (!consultationResponse.success) {
    notFound();
  }

  const consultation = consultationResponse.data;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("consultations.admin.list.table.edit")}
        </h1>
        <p className="text-muted-foreground">
          {t("consultations.admin.list.title")}
        </p>
      </div>

      <ConsultationEditClient
        consultationId={id}
        locale={locale}
        initialData={consultation}
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: ConsultationEditPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("consultations.admin.list.table.edit"),
    description: t("consultations.admin.list.title"),
  };
}
