/**
 * English translations for WS Provider Models endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Modely AI",
  tags: {
    models: "modely",
    aiModels: "ai-models",
  },
  get: {
    title: "Zoznam modelov AI",
    titleShort: "Modely AI",
    description:
      "Vráti všetky dostupné modely AI s cenami a podporovanými funkciami",
    response: {
      models: {
        title: "Modely",
      },
      id: {
        content: "ID modelu",
      },
      name: {
        content: "Názov",
      },
      provider: {
        content: "Poskytovateľ",
      },
      category: {
        content: "Kategória",
      },
      description: {
        content: "Opis",
      },
      contextWindow: {
        content: "Kontextové okno",
      },
      supportsTools: {
        content: "Podporuje nástroje",
      },
      creditCost: {
        content: "Cena v kreditoch",
      },
    },
    success: {
      title: "Modely načítané",
      description: "Zoznam modelov AI sa načítal",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Modely sa nenašli",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať modely",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
  },
};
