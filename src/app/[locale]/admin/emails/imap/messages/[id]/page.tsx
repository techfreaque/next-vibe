/**
 * IMAP Message Detail Page
 * Page for viewing individual IMAP message details
 */

import { Div } from "next-vibe-ui/ui/div";
import { notFound } from "next-vibe-ui/lib/not-found";
import { H1 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { imapMessagesRepository } from "@/app/api/[locale]/v1/core/emails/imap-client/messages/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImapMessageDetail } from "../../_components/imap-message-detail";

interface ImapMessageDetailPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

/**
 * IMAP Message Detail Page Component
 */
export default async function ImapMessageDetailPage({
  params,
}: ImapMessageDetailPageProps): Promise<JSX.Element> {
  const { locale, id } = await params;
  const { t } = simpleT(locale);

  // Require admin user authentication
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/emails/imap/messages/${id}`,
  );

  // Extract JWT payload for repository call
  const jwtUser = {
    id: user.id,
    leadId: user.leadId ?? user.id,
    isPublic: false as const,
  };

  // Fetch message data
  const logger = createEndpointLogger(false, Date.now(), locale);
  const messageResponse = await imapMessagesRepository.getMessageById(
    { id },
    jwtUser,
    locale,
    logger,
  );

  if (!messageResponse.success) {
    notFound();
  }

  return (
    <Div className="container mx-auto py-6 space-y-6">
      <Div className="flex items-center justify-between">
        <H1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("app.admin.emails.imap.messages.detail.title")}
        </H1>
      </Div>

      <ImapMessageDetail messageId={id} />
    </Div>
  );
}
