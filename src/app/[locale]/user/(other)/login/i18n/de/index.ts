import { translations as componentsTranslations } from "../../_components/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  meta: {
    title: "Anmelden - Next Vibe",
    description: "Melden Sie sich bei Ihrem Next Vibe Konto an",
    category: "Authentifizierung",
    imageAlt: "Next Vibe Anmeldung",
    keywords: "anmelden, einloggen, authentifizierung, next vibe",
    ogTitle: "Bei Next Vibe anmelden",
    ogDescription: "Greifen Sie auf Ihr Next Vibe Konto zu",
    twitterTitle: "Bei Next Vibe anmelden",
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
