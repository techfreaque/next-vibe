import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Prihlásenie | {{appName}}",
    description: "Prihláste sa do svojho účtu na {{appName}}.",
    category: "Autentifikácia",
    imageAlt: "Prihlásiť sa",
    keywords: "prihlásenie, prihlásiť sa, účet, {{appName}}",
    ogTitle: "Prihlásenie do {{appName}}",
    ogDescription: "Otvorte si svoj účet na {{appName}}.",
    twitterTitle: "Prihlásenie do {{appName}}",
    twitterDescription: "Otvorte si svoj účet a konverzácie.",
  },
  errors: {
    failedToLoadBrowserIdentity:
      "Nepodarilo sa načítať identitu prehliadača. Obnovte stránku.",
  },
};
