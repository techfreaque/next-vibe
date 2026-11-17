import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unknown: "Une erreur inconnue s'est produite",
    title: "Erreur",
  },
  meta: {
    passwordReset: {
      title: "Réinitialiser le mot de passe - {{appName}}",
      description: "Réinitialisez le mot de passe de votre compte {{appName}}",
      category: "Authentification",
      imageAlt: "Réinitialisation du mot de passe",
      keywords:
        "réinitialiser le mot de passe, mot de passe oublié, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      errors: {
        loadingError:
          "Impossible de charger le formulaire de réinitialisation du mot de passe",
      },
    },
  },
};
