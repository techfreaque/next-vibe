/**
 * IMAP Messages Admin Page
 * Page for managing and viewing IMAP messages
 */

import type { JSX } from "react";

import { ImapMessagesManagement } from "../_components/imap-messages-management";

/**
 * IMAP Messages Page Component
 */
export default function ImapMessagesPage(): JSX.Element {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ImapMessagesManagement />
    </div>
  );
}
