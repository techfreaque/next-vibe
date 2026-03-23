/**
 * Threads Root Page
 * Shows all folders - redirects to first folder
 */

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface ThreadsRootPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface ThreadsRootPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: ThreadsRootPageProps): Promise<ThreadsRootPageData> {
  const { locale } = await params;
  // Redirect to private folder by default
  redirect(`/${locale}/threads/private`);
}

export function TanstackPage({ locale }: ThreadsRootPageData): JSX.Element {
  redirect(`/${locale}/threads/private`);
}

export default async function ThreadsRootPage({
  params,
}: ThreadsRootPageProps): Promise<never> {
  const { locale } = await params;

  // Redirect to private folder by default
  redirect(`/${locale}/threads/private`);
}
