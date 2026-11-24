import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  trigger: "Langue et région : {{language}}, {{region}}",
  title: "Langue et région",
  description:
    "Choisissez la langue de l’interface et la région qui détermine votre devise et vos prix.",
  language: "Langue",
  region: "Région",
  regionHint: "Définit votre devise et vos prix.",
  pricesIn: "Prix en {{currency}}",
  searchRegions: "Rechercher un pays",
  noResults: "Aucun pays trouvé. Essayez un autre nom.",
};
