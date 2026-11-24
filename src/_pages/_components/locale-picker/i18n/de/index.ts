import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  trigger: "Sprache und Region: {{language}}, {{region}}",
  title: "Sprache und Region",
  description:
    "Wähle deine Anzeigesprache und die Region, die Währung und Preise bestimmt.",
  language: "Sprache",
  region: "Region",
  regionHint: "Bestimmt Währung und Preise.",
  pricesIn: "Preise in {{currency}}",
  searchRegions: "Land suchen",
  noResults: "Kein Land gefunden. Versuch einen anderen Namen.",
};
