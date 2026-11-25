import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    error: {
      title: "Niečo sa pokazilo",
      message: "Vyskytla sa neočakávaná chyba.",
      errorId: "ID chyby: {{id}}",
      error_message: "Chyba: {{message}}",
      stackTrace: "Zásobník volaní: {{stack}}",
      tryAgain: "Skúsiť znova",
      backToHome: "Späť na hlavnú stránku",
    },
    frame: {
      endpointNotFound: "Koncový bod „{{endpointId}}“ sa nenašiel",
      endpointLoadFailed: "Koncový bod sa nepodarilo načítať",
    },
    notFound: {
      title: "Stránka sa nenašla",
      description: "Hľadaná stránka neexistuje alebo má novú adresu.",
      goBack: "Späť",
      goHome: "Na hlavnú stránku",
    },
  },
  meta: {
    title: "404: Stránka sa nenašla",
    category: "Chyba",
    description: "Hľadaná stránka neexistuje",
    imageAlt: "404: Stránka sa nenašla",
    keywords: "404, stránka sa nenašla, chyba",
  },
  post: {
    title: "[...notFound]",
    description: "Koncový bod [...notFound]",
    form: {
      title: "Nastavenie [...notFound]",
      description: "Nastaviť parametre [...notfound]",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede [...notFound]",
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
