export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { permanentRedirect } from "next-vibe/ui/lib/redirect";

import { isCreateKind } from "../../create/_shared/create-kinds";

interface MediaStudioPathPageProps {
  params: Promise<{ locale: CountryLanguage; path: string[] }>;
}

/**
 * /[locale]/media-studio/<kind>/... - old Media Studio deep links.
 * A known kind (image, video, ...) keeps its page, anything else goes to
 * the Studio hub.
 */
export async function tanstackLoader({
  params,
}: MediaStudioPathPageProps): Promise<never> {
  const { locale, path } = await params;
  const kind = path[0];
  permanentRedirect(
    kind && isCreateKind(kind)
      ? `/${locale}/create/${kind}`
      : `/${locale}/create`,
  );
}

export function TanstackPage(): never {
  return null as never;
}

export default async function MediaStudioPathPage({
  params,
}: MediaStudioPathPageProps): Promise<never> {
  return tanstackLoader({ params });
}
