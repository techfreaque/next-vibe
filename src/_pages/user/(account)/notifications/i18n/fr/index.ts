import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Notifications",
  metaTitle: "Notifications : {{appName}}",
  description:
    "Tâches terminées, gains de parrainage et actus du compte. Les plus récentes en haut.",
  unauthenticated: {
    title: "Connectez-vous pour voir vos notifications",
    subtitle:
      "Les tâches de fond terminées et les gains de parrainage arrivent ici.",
    logIn: "Se connecter",
    signUp: "Créer un compte",
  },
};
