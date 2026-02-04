/**
 * IMAP Messages Admin Page
 * Page for managing and viewing IMAP messages
 */

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { ImapMessagesManagement } from "@/app/api/[locale]/emails/imap-client/_components/imap-messages-management";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface ImapMessagesPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Messages Page Component
 */
export default async function ImapMessagesPage({
  params,
}: ImapMessagesPageProps): Promise<JSX.Element> {
  const { locale } = await params;

  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/emails/imap/messages`,
  );

  return (
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      <ImapMessagesManagement user={user} />
    </Div>
  );
}
