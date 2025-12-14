/**
 * Leads Import Page
 * Upload CSV files and monitor import job status
 */

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadsImportClient } from "./_components/leads-import-client";

export default async function LeadsImportPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  await requireAdminUser(locale, `/${locale}/admin/leads/import`);

  return (
    <Div className="flex flex-col gap-6">
      {/* Page Description */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.leads.leads.admin.import.description")}
        </P>
      </Div>

      {/* Client Component handles all interactions */}
      <LeadsImportClient locale={locale} />
    </Div>
  );
}
