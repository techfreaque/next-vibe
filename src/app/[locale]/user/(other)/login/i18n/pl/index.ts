import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  auth: {
    login: {
      title: "Zaloguj się",
      subtitle: "Powrót do społeczności",
      signInButton: "Zaloguj się",
    },
  },
  meta: {
    title: "Logowanie - {{appName}}",
    description: "Zaloguj się do swojego konta {{appName}}",
    category: "Uwierzytelnianie",
    imageAlt: "Logowanie",
    keywords: "logowanie, konto, {{appName}}",
    ogTitle: "Zaloguj się do {{appName}}",
    ogDescription: "Uzyskaj dostęp do swojego konta {{appName}}",
    twitterTitle: "Zaloguj się do {{appName}}",
    twitterDescription: "Uzyskaj dostęp do swojego konta i rozmów",
  },
  errors: {
    failedToLoadBrowserIdentity:
      "Nie udało się załadować tożsamości przeglądarki. Proszę odświeżyć stronę.",
  },
};
