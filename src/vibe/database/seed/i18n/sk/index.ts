import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operácie s databázou",

  tag: "počiatočné údaje",
  post: {
    title: "Naplniť databázu počiatočnými údajmi",
    titleShort: "Naplniť databázu",
    description: "Vloží počiatočné údaje do databázy.",
    form: {
      title: "Nastavenie počiatočných údajov",
      description: "Nastavenie parametrov vkladania počiatočných údajov",
    },
    response: {
      title: "Výsledok vkladania údajov",
      description: "Výsledky vkladania počiatočných údajov do databázy",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description:
          "Ak chceš vložiť počiatočné údaje do databázy, prihlás sa.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre vkladania údajov",
      },
      server: {
        title: "Chyba servera",
        description: "Pri vkladaní údajov sa vyskytla interná chyba servera.",
        detail: "Vkladanie počiatočných údajov zlyhalo: {{error}}",
      },
      internal: {
        title: "Interná chyba",
        description: "Počiatočné údaje sa nepodarilo vložiť.",
      },
      database: {
        title: "Chyba databázy",
        description: "Pri vkladaní počiatočných údajov nastala chyba databázy.",
      },
      unknown: {
        title: "Neznáma chyba",
        description:
          "Pri vkladaní počiatočných údajov sa vyskytla neznáma chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vkladaní počiatočných údajov nastala chyba siete.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáš oprávnenie vkladať počiatočné údaje do databázy.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroje počiatočných údajov sa nenašli.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vkladaní počiatočných údajov nastal konflikt.",
      },
    },
    success: {
      title: "Databáza bola naplnená",
      description: "Počiatočné údaje boli vložené do databázy.",
    },
  },
  fields: {
    environment: {
      title: "Prostredie",
      description: "Cieľové prostredie (dev, test alebo prod)",
    },
    success: {
      title: "Výsledok",
    },
    seedsExecuted: {
      title: "Spustené operácie vloženia údajov",
    },
    collections: {
      title: "Kolekcie počiatočných údajov",
      item: {
        title: "Kolekcia",
      },
      name: {
        title: "Názov kolekcie",
      },
      status: {
        title: "Stav",
      },
      recordsCreated: {
        title: "Vytvorené záznamy",
      },
    },
    totalRecords: {
      title: "Celkový počet záznamov",
    },
    duration: {
      title: "Trvanie (ms)",
    },
  },
};
