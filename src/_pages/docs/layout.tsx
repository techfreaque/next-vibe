// The docs pages share the public site chrome (navbar + footer) with /story.
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX, ReactNode } from "react";

import {
  type SiteLayoutData,
  tanstackLoader as storyLayoutLoader,
  TanstackPage as StoryLayoutPage,
} from "../story/layout";

export const dynamic = "force-dynamic";

export type DocsLayoutData = SiteLayoutData;

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<DocsLayoutData, "children">> {
  return storyLayoutLoader({ params });
}

export function TanstackPage(props: DocsLayoutData): JSX.Element {
  return <StoryLayoutPage {...props} />;
}

export default async function DocsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
