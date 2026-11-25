import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    awaitTask: "Počkať na úlohu",
  },
  post: {
    title: "Počkať na úlohu",
    titleShort: "Počkať na úlohu",
    description:
      "Počká na spustenú úlohu na pozadí. Ak je hotová, výsledok vráti ihneď. Inak pozastaví prenos odpovede AI, kým sa úloha nedokončí.",
    fields: {
      taskId: {
        label: "ID úlohy",
        description:
          "ID úlohy, ktoré vrátil execute-tool v režime detach alebo wakeUp.",
      },
      status: {
        title: "Stav",
        description: "Aktuálny stav úlohy.",
      },
      result: {
        title: "Výsledok",
        description: "Výstup nástroja. K dispozícii po dokončení.",
      },
      waiting: {
        title: "Čakanie",
        description:
          "Hodnota true znamená, že prenos je pozastavený a čaká sa na dokončenie úlohy.",
      },
      originalToolName: {
        title: "Nástroj",
        description: "Nástroj, ktorý sa spustil.",
      },
      originalArgs: {
        title: "Argumenty",
        description: "Vstupné argumenty spusteného nástroja.",
      },
    },
    dynamicTitle: "Čaká sa na {{toolName}}",
    widget: {
      noToolName: "Názov nástroja nie je k dispozícii.",
      resolving: "Vyhľadáva sa nástroj…",
      unknownTool: "Neznámy nástroj: {{toolName}}",
    },
    status: {
      waiting: "Čakanie",
      complete: "Dokončené",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatná hodnota taskId",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      internal: {
        title: "Interná chyba",
        description: "Nepodarilo sa zaregistrovať čakanie na dokončenie úlohy",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na čakanie na túto úlohu nemáte oprávnenie.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Úloha sa nenašla.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Zostali neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt stavu úlohy",
      },
    },
    success: {
      title: "Hotovo",
      description: "Úloha dokončená",
    },
  },
};
