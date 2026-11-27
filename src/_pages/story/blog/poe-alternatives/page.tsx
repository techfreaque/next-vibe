import type { Metadata } from "next";
import type { JSX } from "react";

import {
  MultiModelArticle,
  type MultiModelPageData,
} from "../_multi-model/article";
import type { MultiModelProps } from "../_multi-model/loader";

export const revalidate = 3600;

export async function generateMetadata(
  props: MultiModelProps,
): Promise<Metadata> {
  const { multiModelMetadata } = await import("../_multi-model/loader");
  return multiModelMetadata("poe", props);
}

export async function tanstackLoader(
  props: MultiModelProps,
): Promise<MultiModelPageData> {
  const { loadMultiModelPage } = await import("../_multi-model/loader");
  return loadMultiModelPage("poe", props);
}

export function TanstackPage(data: MultiModelPageData): JSX.Element {
  return <MultiModelArticle {...data} subject="poe" />;
}

export default async function PostPage(
  props: MultiModelProps,
): Promise<JSX.Element> {
  const data = await tanstackLoader(props);
  return <TanstackPage {...data} />;
}
