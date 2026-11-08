/**
 * Public model pages layout - same site chrome (navbar + footer) as the
 * story pages, so /models reads as part of the marketing site.
 */

export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX, ReactNode } from "react";

import {
  type SiteLayoutData,
  tanstackLoader as siteLayoutLoader,
  TanstackPage as SiteLayoutPage,
} from "../story/layout";

export type ModelsLayoutData = SiteLayoutData;

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<ModelsLayoutData, "children">> {
  return siteLayoutLoader({ params });
}

export function TanstackPage(props: ModelsLayoutData): JSX.Element {
  return <SiteLayoutPage {...props} />;
}

export default async function ModelsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
