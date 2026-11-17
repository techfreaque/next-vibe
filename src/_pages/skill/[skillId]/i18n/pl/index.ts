import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}} - Skill AI na {{appName}}",
    description:
      "{{tagline}}. Porozmawiaj z {{name}} na {{appName}} - wybierz spośród {{modelCount}} modeli AI, bez filtrów.",
    category: "Skille AI",
    imageAlt: "Skill AI {{name}} na {{appName}}",
    keywords: "skill AI, {{name}}, {{appName}}, asystent AI",
  },
  removed: {
    title: "Skill wycofany",
    body: "Ten skill został wycofany. Rozmowy, w których brał udział, nadal możesz przeczytać. Wybierz aktywny skill i działaj dalej.",
    cta: "Zobacz skille",
  },
};
