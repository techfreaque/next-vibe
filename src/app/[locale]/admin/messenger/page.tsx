/**
 * Emails Admin Page
 * Main emails admin page that redirects to stats
 */

import { redirect } from "next-vibe-ui/lib/redirect";

import type { CountryLanguage } from "@/i18n/core/config";

interface EmailsAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface EmailsAdminPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: EmailsAdminPageProps): Promise<never> {
  const { locale } = await params;

  // Redirect to the inbox
  redirect(`/${locale}/admin/messenger/inbox`);
}

export function TanstackPage(props: EmailsAdminPageData): never {
  redirect(`/${props.locale}/admin/messenger/inbox`);
}

export default async function EmailsAdminPage({
  params,
}: EmailsAdminPageProps): Promise<never> {
  const { locale } = await params;

  // Redirect to the inbox
  redirect(`/${locale}/admin/messenger/inbox`);
}
