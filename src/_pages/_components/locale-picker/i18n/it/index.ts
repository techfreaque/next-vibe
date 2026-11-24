import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  trigger: "Lingua e regione: {{language}}, {{region}}",
  title: "Lingua e regione",
  description:
    "Scegli la lingua dell’interfaccia e la regione che determina la valuta e i prezzi.",
  language: "Lingua",
  region: "Regione",
  regionHint: "Decide valuta e prezzi.",
  pricesIn: "Prezzi in {{currency}}",
  searchRegions: "Cerca un paese",
  noResults: "Nessun paese trovato. Prova un altro nome.",
};
