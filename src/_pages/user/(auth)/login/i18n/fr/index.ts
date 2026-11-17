import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Connexion - {{appName}}",
    description: "Connectez-vous à votre compte {{appName}}",
    category: "Authentification",
    imageAlt: "Connexion",
    keywords: "connexion, se connecter, compte, {{appName}}",
    ogTitle: "Se connecter à {{appName}}",
    ogDescription: "Accédez à votre compte {{appName}}",
    twitterTitle: "Se connecter à {{appName}}",
    twitterDescription: "Accédez à votre compte et à vos discussions",
  },
  errors: {
    failedToLoadBrowserIdentity:
      "Impossible de charger l'identité du navigateur. Veuillez actualiser la page.",
  },
};
