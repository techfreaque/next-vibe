/**
 * unbottled.ai vs characterAi: /[locale]/story/compare/unbottled-vs-character-ai
 * Rendered by ../_shared/versus-page.tsx, loaded by ../_shared/versus-loader.ts.
 */

import type { Metadata } from "next";
import type { JSX } from "react";

import type { VersusProps } from "../_shared/versus-loader";
import { VersusPage, type VersusPageData } from "../_shared/versus-page";

export const revalidate = 3600;

const VERSUS = "characterAi";

export async function generateMetadata(props: VersusProps): Promise<Metadata> {
  const { buildVersusMetadata } = await import("../_shared/versus-loader");
  return buildVersusMetadata(VERSUS, props);
}

export async function tanstackLoader(
  props: VersusProps,
): Promise<VersusPageData> {
  const { loadVersusPage } = await import("../_shared/versus-loader");
  return loadVersusPage(VERSUS, props);
}

export function TanstackPage(data: VersusPageData): JSX.Element {
  return <VersusPage {...data} />;
}

export default async function UnbottledVsPage(
  props: VersusProps,
): Promise<JSX.Element> {
  const data = await tanstackLoader(props);
  return <TanstackPage {...data} />;
}
