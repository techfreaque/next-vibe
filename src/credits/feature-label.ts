/**
 * credit_transactions.feature: stable ids in, labels in the viewer's locale out.
 *
 * Stored ids (never user-visible text):
 * - an endpoint charge stores that endpoint's preferred tool name (first alias
 *   or canonical path), e.g. "generate_image", "web-search";
 * - a charge without an endpoint stores a CreditFeature value
 *   ("enums.creditFeature.textToSpeech"), which is also its i18n key.
 *
 * Rows written before 2026-11-22 hold the endpoint title or feature label in
 * the request locale. LEGACY_FEATURE_IDS folds those onto the ids above so
 * grouping and display treat them as the same feature.
 */

import "server-only";

import { FETCH_URL_ALIAS } from "next-vibe/agent/fetch-url-content/constants";
import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import { MUSIC_GEN_ALIAS } from "next-vibe/agent/music-generation/constants";
import { VIDEO_GEN_ALIAS } from "next-vibe/agent/video-generation/constants";
import { WEB_SEARCH_ALIAS } from "next-vibe/agent/web-search/constants";
import type { EndpointMeta } from "next-vibe/core/definition/endpoints-meta";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

import { CreditFeature, type CreditFeatureValue } from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Localized labels found in legacy rows (prod, every locale we ship) -> id.
 * Frozen: new rows store ids, so this list never grows.
 */
export const LEGACY_FEATURE_IDS: Readonly<Record<string, string>> = {
  "Fetch URL Content": FETCH_URL_ALIAS,
  "URL-Inhalt Abrufen": FETCH_URL_ALIAS,
  "Récupérer le contenu d'une URL": FETCH_URL_ALIAS,
  "Pobierz Zawartość URL": FETCH_URL_ALIAS,
  "Search the Web": WEB_SEARCH_ALIAS,
  "Im Web suchen": WEB_SEARCH_ALIAS,
  "Rechercher sur le web": WEB_SEARCH_ALIAS,
  "Wyszukaj w sieci": WEB_SEARCH_ALIAS,
  "Buscar en la Web": WEB_SEARCH_ALIAS,
  "Generate Image": IMAGE_GEN_ALIAS,
  "Bild generieren": IMAGE_GEN_ALIAS,
  "Générer une image": IMAGE_GEN_ALIAS,
  "Generate Video": VIDEO_GEN_ALIAS,
  "Générer une vidéo": VIDEO_GEN_ALIAS,
  "Generate Music": MUSIC_GEN_ALIAS,
  "Text-to-Speech": CreditFeature.TEXT_TO_SPEECH,
  "Text-zu-Sprache": CreditFeature.TEXT_TO_SPEECH,
  "Synthèse vocale": CreditFeature.TEXT_TO_SPEECH,
  "Tekst na mowę": CreditFeature.TEXT_TO_SPEECH,
  "Texto a texto": CreditFeature.TEXT_TO_SPEECH,
  "Testo a velocità": CreditFeature.TEXT_TO_SPEECH,
  "Speech-to-Text": CreditFeature.SPEECH_TO_TEXT,
  "Sprache-zu-Text": CreditFeature.SPEECH_TO_TEXT,
  "Reconnaissance vocale": CreditFeature.SPEECH_TO_TEXT,
  "Mowa na tekst": CreditFeature.SPEECH_TO_TEXT,
  "Discurso a texto": CreditFeature.SPEECH_TO_TEXT,
  "Discorso a testo": CreditFeature.SPEECH_TO_TEXT,
  Write: CreditFeature.MEMORY_WRITE,
  Schreiben: CreditFeature.MEMORY_WRITE,
  Écriture: CreditFeature.MEMORY_WRITE,
  Zapis: CreditFeature.MEMORY_WRITE,
  Escribir: CreditFeature.MEMORY_WRITE,
  Scrivi: CreditFeature.MEMORY_WRITE,
  Edit: CreditFeature.MEMORY_EDIT,
  Bearbeiten: CreditFeature.MEMORY_EDIT,
  Modification: CreditFeature.MEMORY_EDIT,
  Edycja: CreditFeature.MEMORY_EDIT,
  Editar: CreditFeature.MEMORY_EDIT,
  Modifica: CreditFeature.MEMORY_EDIT,
  Search: CreditFeature.MEMORY_SEARCH,
  Suche: CreditFeature.MEMORY_SEARCH,
  Recherche: CreditFeature.MEMORY_SEARCH,
  Wyszukiwanie: CreditFeature.MEMORY_SEARCH,
  Buscar: CreditFeature.MEMORY_SEARCH,
  Cerca: CreditFeature.MEMORY_SEARCH,
  Embedding: CreditFeature.MEMORY_EMBEDDING,
  Einbettung: CreditFeature.MEMORY_EMBEDDING,
  Osadzanie: CreditFeature.MEMORY_EMBEDDING,
};

/** Stored feature (id or legacy label) -> id. */
export function normalizeCreditFeature(feature: string): string {
  return LEGACY_FEATURE_IDS[feature] ?? feature;
}

const CREDIT_FEATURES: readonly string[] = Object.values(CreditFeature);

function isCreditFeature(value: string): value is typeof CreditFeatureValue {
  return CREDIT_FEATURES.includes(value);
}

const META_LOADERS: Record<
  ReturnType<typeof getLanguageFromLocale>,
  () => Promise<{ endpointsMeta: EndpointMeta[] }>
> = {
  en: () => import("@/generated/endpoints/meta/en"),
  de: () => import("@/generated/endpoints/meta/de"),
  pl: () => import("@/generated/endpoints/meta/pl"),
  fr: () => import("@/generated/endpoints/meta/fr"),
  it: () => import("@/generated/endpoints/meta/it"),
  es: () => import("@/generated/endpoints/meta/es"),
  sk: () => import("@/generated/endpoints/meta/sk"),
};

/**
 * Display labels in `locale` for stored features (ids or legacy labels).
 * Endpoint ids resolve to the endpoint's title, CreditFeature ids to their
 * translation; anything else (e.g. "model:x") is returned unchanged.
 */
export async function creditFeatureLabels(
  features: readonly string[],
  locale: CountryLanguage,
): Promise<Record<string, string>> {
  const { t } = scopedTranslation.scopedT(locale);
  const ids = [...new Set(features)];
  const needsMeta = ids.some(
    (feature) => !isCreditFeature(normalizeCreditFeature(feature)),
  );
  const meta = needsMeta
    ? (await META_LOADERS[getLanguageFromLocale(locale)]()).endpointsMeta
    : [];
  const labels: Record<string, string> = {};
  for (const feature of ids) {
    const id = normalizeCreditFeature(feature);
    if (isCreditFeature(id)) {
      labels[feature] = t(id);
      continue;
    }
    const endpoint = meta.find(
      (entry) => entry.toolName === id || entry.aliases[0] === id,
    );
    labels[feature] = endpoint?.title ?? feature;
  }
  return labels;
}
