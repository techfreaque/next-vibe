import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { scopedTranslation } from "../layout-i18n";

export interface BreadcrumbEntry {
  name: string;
  /** Locale-less path, e.g. "/models". */
  path: string;
}

/**
 * Include the home crumb so top-level pages have two breadcrumb items.
 * Points at `/story` (the final URL): the bare locale root 307-redirects there,
 * and a redirecting breadcrumb is a "Page with redirect" entry in Search Console.
 */
export function withHomeBreadcrumb(
  locale: CountryLanguage,
  crumbs: readonly BreadcrumbEntry[],
): BreadcrumbEntry[] {
  const { t } = scopedTranslation.scopedT(locale);
  return [{ name: t("breadcrumbs.home"), path: "/story" }, ...crumbs];
}
