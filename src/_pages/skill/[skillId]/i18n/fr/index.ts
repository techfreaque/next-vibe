import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}} : skill IA sur {{appName}}",
    description:
      "{{tagline}}. Discutez avec {{name}} sur {{appName}} : {{modelCount}} modèles d'IA au choix, sans filtres.",
    category: "Skills IA",
    imageAlt: "Skill IA {{name}} sur {{appName}}",
    keywords: "skill IA, {{name}}, {{appName}}, assistant IA",
  },
  removed: {
    title: "Skill retiré",
    body: "Ce skill a été retiré. Les conversations auxquelles il a participé restent lisibles. Choisis un skill actif pour continuer.",
    cta: "Voir les skills",
  },
};
