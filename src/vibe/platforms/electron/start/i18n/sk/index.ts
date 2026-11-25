import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronStart: "Spustenie Electronu",
  },
  post: {
    title: "Spustiť aplikáciu Electron",
    titleShort: "Spustiť Electron",
    description:
      "Skompiluje main a preload a otvorí okno Electronu vo vývojovom režime bez vytvárania balíka.",
    form: {
      title: "Nastavenia spustenia Electronu",
      description: "Nastaviť spôsob spustenia aplikácie Electron",
    },
    response: {
      title: "Odpoveď",
      description: "Výsledok spustenia",
    },
    fields: {
      port: {
        title: "Port",
        description: "Port servera Vibe (predvolený: 3000)",
      },
      vibeStart: {
        title: "Spustiť vibe start",
        description: "Pred otvorením okna spustiť vibe start na pozadí",
      },
      success: {
        title: "Úspech",
      },
      output: {
        title: "Výstup",
      },
      duration: {
        title: "Trvanie (ms)",
      },
      errors: {
        title: "Chyby",
      },
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera",
        compileFailed: "Kompilácia Electronu zlyhala: {{error}}",
        startFailed: "Spustenie Electronu zlyhalo: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
    success: {
      title: "Úspech",
      description: "Aplikácia Electron bola spustená",
    },
  },
};
