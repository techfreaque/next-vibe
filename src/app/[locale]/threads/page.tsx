/**
 * Threads Root Page
 * Shows all folders - redirects to first folder
 */

import { redirect } from "next/navigation";

import type { CountryLanguage } from "@/i18n/core/config";

interface ThreadsRootPageProps {
  params: {
    locale: CountryLanguage;
  };
}

export default function ThreadsRootPage({
  params,
}: ThreadsRootPageProps): never {
  const { locale } = params;

  // Redirect to private folder by default
  redirect(`/${locale}/threads/private`);
}
