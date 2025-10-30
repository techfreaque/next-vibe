/**
 * Leads List Page
 * Uses form-based filtering pattern similar to cron execution history
 */

import type { JSX } from "react";
import { Div, P } from "next-vibe-ui/ui";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadsListClient } from "./_components/leads-list-client";

export default async function LeadsListPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="space-y-6">
      {/* Page Description */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.leads.leads.list.description")}
        </P>
      </Div>

      {/* Client Component handles all interactions */}
      <LeadsListClient locale={locale} />
    </Div>
  );
}
