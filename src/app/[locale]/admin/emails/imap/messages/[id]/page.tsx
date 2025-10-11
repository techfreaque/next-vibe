/**
 * IMAP Message Detail Page
 * Page for viewing individual IMAP message details
 */

import { notFound } from "next/navigation";
import type { JSX } from "react";

import { imapMessagesRepository } from "@/app/api/[locale]/v1/core/emails/imap-client/messages/repository";
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

  const messageResponse = await imapMessagesRepository.getMessageById(id);

  if (!messageResponse.success) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("imap.messages.detail.title")}
        </h1>
      </div>

      <ImapMessageDetail messageId={id} />
    </div>
  );
}
