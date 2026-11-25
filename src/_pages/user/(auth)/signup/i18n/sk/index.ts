import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    failedToLoadBrowserIdentity:
      "Nepodarilo sa načítať identitu prehliadača. Obnovte stránku.",
  },
  meta: {
    title: "Registrácia | {{appName}}",
    description:
      "Vytvorte si účet na {{appName}} a začnite tvoriť vlastné aplikácie.",
    category: "Autentifikácia",
    imageAlt: "Registrácia na {{appName}}",
    keywords: "registrácia, zaregistrovať sa, vytvoriť účet, {{appName}}",
    ogTitle: "Zaregistrujte sa na {{appName}}",
    ogDescription:
      "Zaregistrujte sa na {{appName}} a začnite tvoriť aplikácie ešte dnes.",
    twitterTitle: "Zaregistrujte sa na {{appName}}",
    twitterDescription: "Vytvorte si účet a začnite tvoriť na {{appName}}.",
  },
  post: {
    title: "Registrácia",
    description: "Koncový bod registrácie",
    form: {
      title: "Nastavenia registrácie",
      description: "Nastaviť parametre registrácie",
    },
    response: {
      title: "Odpoveď",
      description: "Výsledné údaje registrácie",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na pokračovanie sa musíte prihlásiť",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Požiadavka má neplatné parametre",
      },
      server: {
        title: "Chyba servera",
        description: "Na serveri sa vyskytla interná chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na tento prístup nemáte oprávnenie",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Údaje sú v konflikte",
      },
    },
    success: {
      title: "Hotovo",
      description: "Operácia prebehla úspešne",
    },
  },
};
