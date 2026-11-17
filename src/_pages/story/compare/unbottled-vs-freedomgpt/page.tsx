/**
 * unbottled.ai vs freedomGpt: /[locale]/story/compare/unbottled-vs-freedomgpt
 * Rendered by ../_shared/versus-page.tsx, loaded by ../_shared/versus-loader.ts.
 */

import type { Metadata } from "next";
import type { JSX } from "react";

import {
  buildVersusMetadata,
  loadVersusPage,
  type VersusProps,
} from "../_shared/versus-loader";
import { VersusPage, type VersusPageData } from "../_shared/versus-page";

export const revalidate = 3600;

const VERSUS = "freedomGpt";

export const generateMetadata = (props: VersusProps): Promise<Metadata> =>
  buildVersusMetadata(VERSUS, props);

export function tanstackLoader(props: VersusProps): Promise<VersusPageData> {
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
