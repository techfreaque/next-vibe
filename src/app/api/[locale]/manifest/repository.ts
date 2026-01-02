/**
 * Manifest Repository
 * Handles web app manifest generation logic
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ManifestResponseOutput } from "./definition";
import { IconPurpose, WebAppCategory, WebAppDisplayMode, WebAppOrientation } from "./enum";

// Constants for manifest values (non-translatable)
const MANIFEST_CONSTANTS = {
  DISPLAY: WebAppDisplayMode.STANDALONE,
  BACKGROUND_COLOR: "#ffffff",
  THEME_COLOR: "#0EA5E9",
  ORIENTATION: WebAppOrientation.PORTRAIT_PRIMARY,
  CATEGORIES: [WebAppCategory.SOCIAL, WebAppCategory.PRODUCTIVITY, WebAppCategory.BUSINESS],
  ICON_SIZES: {
    SMALL: "192x192",
    LARGE: "512x512",
  },
  ICON_TYPE: "image/png",
  ICON_PURPOSE: IconPurpose.MASKABLE_ANY,
  CACHE_CONTROL: "public, max-age=3600",
  CONTENT_TYPE: "application/manifest+json",
} as const;

/**
 * Manifest Repository
 */
export class ManifestRepository {
  /**
   * Generate localized web app manifest
   */
  static generateManifest(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<ManifestResponseOutput> {
    try {
      logger.debug("Generating manifest for locale", { locale });

      // Create translation function for the current locale
      const { t } = simpleT(locale);

      // Extract language from locale (e.g., "en" from "en-GLOBAL")
      const language = locale.split("-")[0];

      // Get language info from config
      const countryInfo = Object.values(languageConfig.countryInfo).find(
        (info) => info.language === language,
      );

      // Fallback to English if language not found
      const manifestLang = countryInfo?.language || "en";

      // Get app name for interpolation
      const appName = t("config.appName");

      // Create localized manifest
      const manifest = {
        name: t("config.appName", { appName }),
        short_name: t("config.appName"),
        description: t("app.api.manifest.description"),
        start_url: `/${locale}`,
        display: t(MANIFEST_CONSTANTS.DISPLAY),
        background_color: MANIFEST_CONSTANTS.BACKGROUND_COLOR,
        theme_color: MANIFEST_CONSTANTS.THEME_COLOR,
        orientation: t(MANIFEST_CONSTANTS.ORIENTATION),
        scope: `/${locale}/`,
        lang: manifestLang,
        categories: MANIFEST_CONSTANTS.CATEGORIES.map((category) => t(category)),
        icons: [
          {
            src: "/images/placeholder-logo.png",
            sizes: MANIFEST_CONSTANTS.ICON_SIZES.SMALL,
            type: MANIFEST_CONSTANTS.ICON_TYPE,
            purpose: t(MANIFEST_CONSTANTS.ICON_PURPOSE),
          },
          {
            src: "/images/placeholder-logo.png",
            sizes: MANIFEST_CONSTANTS.ICON_SIZES.LARGE,
            type: MANIFEST_CONSTANTS.ICON_TYPE,
            purpose: t(MANIFEST_CONSTANTS.ICON_PURPOSE),
          },
        ],
      };

      logger.debug("Generated localized manifest successfully", {
        locale,
        language: manifestLang,
      });

      return success(manifest, {
        headers: {
          "Content-Type": MANIFEST_CONSTANTS.CONTENT_TYPE,
          "Cache-Control": MANIFEST_CONSTANTS.CACHE_CONTROL,
        },
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to generate manifest", {
        error: parsedError.message,
        locale,
      });

      return fail({
        message: "app.api.manifest.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message, locale },
      });
    }
  }
}
