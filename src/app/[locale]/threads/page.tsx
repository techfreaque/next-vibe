/**
 * Threads Root Page
 * Shows all folders - redirects to first folder
 */

import { redirect } from "next-vibe-ui/lib/redirect";

import type { CountryLanguage } from "@/i18n/core/config";

interface ThreadsRootPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function ThreadsRootPage({ params }: ThreadsRootPageProps): Promise<never> {
  const { locale } = await params;

  // Redirect to private folder by default
  redirect(`/${locale}/threads/private`);
}
