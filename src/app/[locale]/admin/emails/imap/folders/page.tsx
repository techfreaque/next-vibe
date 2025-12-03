/**
 * IMAP Folders Admin Page
 * Page for managing IMAP folders and monitoring sync status
 */

import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImapFoldersManagement } from "@/app/api/[locale]/emails/imap-client/_components/imap-folders-management";

interface ImapFoldersPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Folders Page Component
 */
export default async function ImapFoldersPage({
  params,
}: ImapFoldersPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  return (
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.folders.title")}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.folders.description")}
        </P>
      </Div>

      <ImapFoldersManagement logger={logger} />
    </Div>
  );
}
