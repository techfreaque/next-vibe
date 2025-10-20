/**
 * Lead Edit Page
 * Server-side initial data loading with client-side form management
 */

import { redirect } from "next/navigation";
import type React from "react";

import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadEditForm } from "./_components/lead-edit-form";

interface LeadEditPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function LeadEditPage({
  params,
}: LeadEditPageProps): Promise<React.JSX.Element> {
  const { locale, id } = await params;
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Require admin user authentication
  await requireAdminUser(locale, `/${locale}/admin/leads/${id}/edit`);

  // Fetch lead data
  const leadResponse = await leadsRepository.getLeadByIdInternal(id, logger);

  // Handle lead not found
  if (!leadResponse.success) {
    redirect(`/${locale}/admin/leads`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.leads.leads.edit.success.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("app.admin.leads.leads.edit.success.description")}
        </p>
      </div>

      {/* Edit Form */}
      <LeadEditForm locale={locale} leadId={id} lead={leadResponse.data} />
    </div>
  );
}
