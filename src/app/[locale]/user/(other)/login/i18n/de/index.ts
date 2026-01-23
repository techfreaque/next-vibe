import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  auth: {
    login: {
      title: "Anmelden",
      subtitle: "Willkommen in der Gemeinschaft zurück",
      signInButton: "Anmelden",
    },
  },
  meta: {
    title: "Anmelden - {{appName}}",
    description: "Melden Sie sich in Ihrem {{appName}} Konto an",
    category: "Authentifizierung",
    imageAlt: "Anmelden",
    keywords: "anmelden, konto, {{appName}}",
    ogTitle: "Melden Sie sich bei {{appName}} an",
    ogDescription: "Greifen Sie auf Ihr {{appName}} Konto zu",
    twitterTitle: "Melden Sie sich bei {{appName}} an",
    twitterDescription: "Greifen Sie auf Ihr Konto und Ihre Gespräche zu",
  },
  errors: {
    failedToLoadBrowserIdentity:
      "Browseridentität konnte nicht geladen werden. Bitte aktualisieren Sie die Seite.",
  },
};
