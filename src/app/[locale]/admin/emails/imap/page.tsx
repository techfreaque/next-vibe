/**
 * IMAP Admin Main Page
 * Main page for IMAP administration - redirects to overview
 */

import { redirect } from "next/navigation";

/**
 * IMAP Admin Main Page Component
 * Redirects to the overview page
 */
export default function ImapAdminPage(): never {
  redirect("/admin/emails/imap/overview");
}
