import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  trigger: "Język i region: {{language}}, {{region}}",
  title: "Język i region",
  description:
    "Wybierz język interfejsu i region, od którego zależą waluta i ceny.",
  language: "Język",
  region: "Region",
  regionHint: "Od tego zależą waluta i ceny.",
  pricesIn: "Ceny w {{currency}}",
  searchRegions: "Szukaj kraju",
  noResults: "Nie znaleziono kraju. Wpisz inną nazwę.",
};
