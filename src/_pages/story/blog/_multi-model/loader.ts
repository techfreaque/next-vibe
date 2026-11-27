import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";

import { configScopedTranslation } from "@/env/i18n";

import { loadUsFacts, usParams } from "../../compare/_shared/us-facts";
import type { MultiModelPageData } from "./article";
import { scopedTranslation } from "./i18n";
import { POST_SLUGS, type Subject } from "./platforms";

export interface MultiModelProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function loadMultiModelPage(
  subject: Subject,
  { params }: MultiModelProps,
): Promise<MultiModelPageData> {
  const { locale } = await params;
  const { loadRelatedModels } = await import("../related-models-data");
  return {
    locale,
    us: usParams(await loadUsFacts(locale)),
    relatedModels: await loadRelatedModels(POST_SLUGS[subject]),
  };
}

export async function multiModelMetadata(
  subject: Subject,
  { params }: MultiModelProps,
): Promise<ReturnType<typeof metadataGenerator>> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const stats = { appName: configT("appName") };

  return metadataGenerator(locale, {
    path: `story/blog/${POST_SLUGS[subject]}`,
    title: t(`posts.${subject}.metaTitle`),
    description: t(`posts.${subject}.description`, stats),
    category: t("common.category"),
    imageAlt: t(`posts.${subject}.title`),
    keywords: [t(`posts.${subject}.keywords`, stats)],
  });
}
