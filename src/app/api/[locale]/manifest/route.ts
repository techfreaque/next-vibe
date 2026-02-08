/**
 * Manifest API Route
 * GET /api/[locale]/manifest
 * Returns a standard web app manifest in JSON format
 */

import { NextResponse } from "next/server";

import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";
import { simpleT } from "@/i18n/core/shared";

// Constants for manifest values (non-translatable)
const MANIFEST_CONSTANTS = {
  DISPLAY: "standalone" as const,
  BACKGROUND_COLOR: "#d1dff5",
  THEME_COLOR: "#4f46e5",
  ORIENTATION: "portrait-primary" as const,
  CATEGORIES: ["social", "productivity", "business"] as const,
  ICON_SIZES: {
    SMALL: "192x192",
    LARGE: "512x512",
  },
  ICON_TYPE: "image/png",
  ICON_PURPOSE: "any" as const,
  CACHE_CONTROL: "public, max-age=3600",
  CONTENT_TYPE: "application/manifest+json",
} as const;

export async function GET(
  // oxlint-disable-next-line no-unused-vars
  request: Request,
  { params }: { params: Promise<{ locale: CountryLanguage }> },
): Promise<NextResponse> {
  const { locale } = await params;

  // Create translation function for the current locale
  const { t } = simpleT(locale);

  // Extract language from locale (e.g., "en" from "en-GLOBAL")
  const language = getLanguageFromLocale(locale);

  // Fallback to English if language not found
  const manifestLang = language.toLowerCase();

  // Create localized manifest
  const manifest = {
    name: t("config.appName"),
    short_name: t("config.appName"),
    description: t("config.appDescription"),
    start_url: `/${locale}/`,
    display: MANIFEST_CONSTANTS.DISPLAY,
    background_color: MANIFEST_CONSTANTS.BACKGROUND_COLOR,
    theme_color: MANIFEST_CONSTANTS.THEME_COLOR,
    orientation: MANIFEST_CONSTANTS.ORIENTATION,
    scope: `/${locale}/`,
    lang: manifestLang,
    categories: [...MANIFEST_CONSTANTS.CATEGORIES],
    icons: [
      {
        src: "/images/unbottled-icon.png",
        sizes: MANIFEST_CONSTANTS.ICON_SIZES.SMALL,
        type: MANIFEST_CONSTANTS.ICON_TYPE,
        purpose: MANIFEST_CONSTANTS.ICON_PURPOSE,
      },
      {
        src: "/images/unbottled-icon.png",
        sizes: MANIFEST_CONSTANTS.ICON_SIZES.LARGE,
        type: MANIFEST_CONSTANTS.ICON_TYPE,
        purpose: MANIFEST_CONSTANTS.ICON_PURPOSE,
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": MANIFEST_CONSTANTS.CONTENT_TYPE,
      "Cache-Control": MANIFEST_CONSTANTS.CACHE_CONTROL,
    },
  });
}
