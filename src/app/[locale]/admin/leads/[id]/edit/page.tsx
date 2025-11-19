/**
 * Lead Edit Page
 * Server-side initial data loading with client-side form management
 */

import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadEditForm } from "@/app/api/[locale]/v1/core/leads/_components/lead-edit-form";

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
    <Div className="flex flex-col gap-8">
      {/* Header */}
      <Div>
        <H1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.leads.leads.edit.success.title")}
        </H1>
        <P className="text-muted-foreground mt-2">
          {t("app.admin.leads.leads.edit.success.description")}
        </P>
      </Div>

      {/* Edit Form */}
      <LeadEditForm locale={locale} leadId={id} lead={leadResponse.data} />
    </Div>
  );
}
