import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Aktualizovať všetky ceny modelu",
    titleShort: "Aktualizovať ceny",
    description:
      "Prineste živé provider ceny a zobraziť navrhované zmeny katalógu. Prejdite na --write v miestnej CLI ich aplikovať.",
    form: {
      title: "Modelová aktualizácia cien",
      write: "Zapísať zmeny do zdrojových súborov",
    },
    response: {
      diff: "Zdrojová diff",
      summary: {
        status: "Stav",
        notConfigured:
          "Cenové porovnanie preskočené. Poskytovateľ API klávesy nie sú nakonfigurované.",
        title: "Aktualizovať zhrnutie",
        totalProviders: "Spustiť poskytovateľov",
        totalModels: "Modely spolu",
        modelsUpdated: "Navrhované zmeny",
        fileUpdated: "Aktualizované",
      },
      updates: {
        title: "Aktualizované modely",
        model: {
          modelId: "ID modelu",
          name: "Názov modelu",
          provider: "Poskytovateľ",
          field: "Cenové pole",
          value: "Nová hodnota",
          source: "Zdroj cien",
        },
      },
      failures: {
        title: "Zlyhanie ceny",
        model: {
          modelId: "ID modelu",
          provider: "Poskytovateľ",
          reason: "Dôvod",
        },
      },
      providerResults: {
        title: "Výsledky poskytovateľa",
        model: {
          provider: "Poskytovateľ",
          modelsFound: "Nájdené modely",
          modelsUpdated: "Aktualizované",
          error: "Chyba",
        },
      },
    },
    errors: {
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa aktualizovať ceny modelu",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k cenovej API",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
        // `title` doubles as the generic errorTypes label - detail lives here so
        // no raw placeholder leaks into those labels.
        detail: "Neznáma chyba: {{error}}",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Nie ste oprávnení vykonať túto akciu",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup k tomuto zdroju je zakázaný",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný zdroj sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri spracovaní žiadosti nastal konflikt",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Získal ceny pre poskytovateľov a porovnal ich s katalógom.",
    },
  },
  tags: {
    models: "Modely",
  },
  updateAllModelPrices: {
    name: "Aktualizovať všetky ceny modelu",
    description:
      "Nahlási zdrojový diff od živého poskytovateľa cien na preskúmanie.",
  },
};
