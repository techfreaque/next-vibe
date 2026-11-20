/** Tool pages keep the same catalog sidebar as the index. */

export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import type { ToolsPageData, ToolsPageProps } from "../page";
import { tanstackLoader as loadToolsPage, TanstackPage } from "../page";

interface Props {
  params: Promise<{ locale: CountryLanguage; toolPath: string[] }>;
  searchParams?: ToolsPageProps["searchParams"];
}

export { TanstackPage };

export async function tanstackLoader({
  params,
  searchParams,
}: Props): Promise<ToolsPageData> {
  return loadToolsPage({ params, searchParams });
}

export default async function ToolDetailPage(
  props: Props,
): Promise<JSX.Element> {
  const data = await tanstackLoader(props);
  return <TanstackPage {...data} />;
}
