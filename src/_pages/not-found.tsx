import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import { NotFoundBackButton } from "./[...notFound]/not-found-client";

/**
 * Fallback not-found page at the locale level.
 * Renders the proper 404 UI - localized not-found is handled by [...notFound] catch-all.
 */
export default function NotFound(): JSX.Element {
  return <NotFoundBackButton locale={defaultLocale} />;
}
