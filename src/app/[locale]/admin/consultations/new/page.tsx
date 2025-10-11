/**
 * Admin Consultation Creation Page
 * Page for creating new consultations from admin panel
 */

import type { Metadata } from "next";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationsNavigation } from "../_components/consultations-navigation";
import { AdminConsultationForm } from "./_components/admin-consultation-form";

interface AdminConsultationCreatePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: AdminConsultationCreatePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("consultations.admin.create.title"),
    description: t("consultations.admin.create.description"),
  };
}

export default async function AdminConsultationCreatePage({
  params,
}: AdminConsultationCreatePageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  // Require admin authentication
  await requireAdminUser(locale, "/admin/consultations/new");

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Navigation */}
      <ConsultationsNavigation locale={locale} currentPage="list" />

      {/* Form */}
      <AdminConsultationForm locale={locale} />
    </div>
  );
}
