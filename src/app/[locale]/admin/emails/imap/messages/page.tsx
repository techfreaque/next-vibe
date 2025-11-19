/**
 * IMAP Messages Admin Page
 * Page for managing and viewing IMAP messages
 */

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { ImapMessagesManagement } from "@/app/api/[locale]/v1/core/emails/imap-client/_components/imap-messages-management";

/**
 * IMAP Messages Page Component
 */
export default function ImapMessagesPage(): JSX.Element {
  return (
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      <ImapMessagesManagement />
    </Div>
  );
}
