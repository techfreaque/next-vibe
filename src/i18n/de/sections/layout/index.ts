import type { layoutTranslations as EnglishLayoutTranslations } from "../../../en/sections/layout";
import { metadataTranslations } from "./metadata";
import { openGraphTranslations } from "./openGraph";
import { structuredDataTranslations } from "./structuredData";
import { twitterTranslations } from "./twitter";

export const layoutTranslations: typeof EnglishLayoutTranslations = {
  metadata: metadataTranslations,
  openGraph: openGraphTranslations,
  structuredData: structuredDataTranslations,
  twitter: twitterTranslations,
};
