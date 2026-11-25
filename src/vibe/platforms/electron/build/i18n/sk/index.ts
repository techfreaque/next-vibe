import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronBuild: "Zostavenie Electronu",
  },
  post: {
    title: "Zostaviť aplikáciu Electron",
    titleShort: "Zostaviť Electron",
    description:
      "Skompiluje main a preload pomocou Bun, spustí vibe build a vytvorí balík pomocou electron-builder.",
    form: {
      title: "Nastavenia zostavenia Electronu",
      description: "Nastaviť parametre zostavenia Electronu",
    },
    response: {
      title: "Odpoveď",
      description: "Výsledok zostavenia",
    },
    fields: {
      viBuild: {
        title: "Spustiť vibe build",
        description: "Spustiť vibe build (Next.js + migrácie) pred balením",
      },
      generate: {
        title: "Generovať koncové body",
        description: "Pred zostavením znova vygenerovať index koncových bodov",
      },
      platform: {
        title: "Cieľová platforma",
        description: "Platforma, pre ktorú sa vytvorí balík",
        options: {
          current: "Aktuálny operačný systém",
          linux: "Linux",
          mac: "macOS",
          win: "Windows",
          all: "Všetky platformy",
        },
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
        viBuildFailed: "vibe build zlyhalo: {{error}}",
        compileFailed: "Kompilácia Electronu zlyhala: {{error}}",
        builderFailed: "electron-builder zlyhal: {{error}}",
        buildFailed: "Zostavenie Electronu zlyhalo: {{error}}",
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
      description: "Aplikácia Electron bola zostavená",
    },
  },
};
