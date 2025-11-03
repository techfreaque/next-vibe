import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Anmelden - {{appName}}",
    description: "Melden Sie sich bei Ihrem {{appName}} Konto an",
    category: "Authentifizierung",
    imageAlt: "{{appName}} Anmeldung",
    keywords: "anmelden, einloggen, authentifizierung, {{appName}}",
    ogTitle: "Bei {{appName}} anmelden",
    ogDescription: "Greifen Sie auf Ihr {{appName}} Konto zu",
    twitterTitle: "Bei {{appName}} anmelden",
    twitterDescription: "Melden Sie sich bei Ihrem Konto an",
  },
  auth: {
    login: {
      title: "Willkommen zurück",
      subtitle: "Melden Sie sich bei Ihrem Konto an, um fortzufahren",
      signInButton: "Anmelden",
      forgotPassword: "Passwort vergessen?",
      createAccount: "Konto erstellen",
      orContinueWith: "Oder fortfahren mit",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "Geben Sie Ihre E-Mail ein",
      passwordLabel: "Passwort",
      passwordPlaceholder: "Geben Sie Ihr Passwort ein",
      rememberMe: "Angemeldet bleiben",
    },
  },
  login: {
    dontHaveAccount: "Noch kein Konto?",
  },
};
