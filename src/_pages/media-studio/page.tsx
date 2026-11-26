export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { permanentRedirect } from "next-vibe/ui/lib/redirect";

interface MediaStudioPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * /[locale]/media-studio - old Media Studio address, still in sent emails.
 * 308 to the Studio hub. Locale-less /media-studio gets its locale from the
 * middleware first, then lands here.
 */
export async function tanstackLoader({
  params,
}: MediaStudioPageProps): Promise<never> {
  const { locale } = await params;
  permanentRedirect(`/${locale}/create`);
}

export function TanstackPage(): never {
  return null as never;
}

export default async function MediaStudioPage({
  params,
}: MediaStudioPageProps): Promise<never> {
  return tanstackLoader({ params });
}
