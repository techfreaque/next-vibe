/**
 * Server half of a versus page: loader + metadata. Kept apart from
 * ./versus-page.tsx because it reads env availability (server-only): the
 * client strip only removes server exports from page.tsx itself, so a shared
 * module must not mix both.
 */

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";

import { scopedTranslation } from "../i18n";
import { type VersusKey, versusPath } from "./platforms";
import { loadUsFacts, usParams } from "./us-facts";
import { pageParams, type VersusPageData } from "./versus-page";

export interface VersusProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function loadVersusPage(
  versus: VersusKey,
  { params }: VersusProps,
): Promise<VersusPageData> {
  const { locale } = await params;
  const facts = await loadUsFacts(locale);
  return { locale, versus, params: usParams(facts) };
}

export async function buildVersusMetadata(
  versus: VersusKey,
  props: VersusProps,
): Promise<Metadata> {
  const data = await loadVersusPage(versus, props);
  const { t } = scopedTranslation.scopedT(data.locale);
  const stats = pageParams(data);
  return metadataGenerator(data.locale, {
    path: versusPath(versus).slice(1),
    title: t(`versus.${versus}.meta.title`, stats),
    category: t("common.category"),
    description: t(`versus.${versus}.meta.description`, stats),
    imageAlt: t("common.versusImageAlt", stats),
    keywords: [t(`versus.${versus}.meta.keywords`, stats)],
  });
}
