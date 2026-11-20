import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Accedi a {{appName}}",
    description: "Accedi al tuo account {{appName}}",
    category: "Autenticazione",
    imageAlt: "Accedi",
    keywords: "accesso, login, account, {{appName}}",
    ogTitle: "Accedi a {{appName}}",
    ogDescription: "Accedi al tuo account {{appName}}",
    twitterTitle: "Accedi a {{appName}}",
    twitterDescription: "Accedi al tuo account e alle tue conversazioni",
  },
  errors: {
    failedToLoadBrowserIdentity:
      "Impossibile caricare l’identità del browser. Ricarica la pagina.",
  },
};
