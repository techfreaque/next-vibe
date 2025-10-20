import type { MetadataConfig } from "@/i18n/core/metadata";

import { envClient } from "./env-client";

/**
 * Metadata configuration for the application
 *
 * This file provides global metadata configuration for the application.
 * It's imported by the metadata.ts utility.
 */

/**
 * Base configuration for metadata generation
 */
export const METADATA_CONFIG: MetadataConfig = {
  // Basic metadata
  baseUrl: envClient.NEXT_PUBLIC_APP_URL,
  twitterHandle: "@socialmediaservice",
  defaultImage: "https://socialmediaservice.center/images/social-share.jpg",
  defaultImageAlt: "app.common.appName",

  // Authors and publisher
  authors: [{ name: "nextVibe Team" }],
  creator: "nextVibe",
  publisher: "nextVibe Inc.",

  // Verification
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
    other: {
      me: ["support@socialmediaservice.center"],
    },
  },

  // Format detection
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      "index": true,
      "follow": true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
