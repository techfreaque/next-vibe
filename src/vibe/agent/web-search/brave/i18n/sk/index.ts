import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Informácie",
  get: {
    title: "Hľadať na webe",
    titleShort: "Brave Search",
    dynamicTitle: "Hľadať: {{query}}",
    description:
      "Vyhľadá aktuálne informácie, správy, fakty alebo nedávne udalosti. Pomôže získať aktuálne informácie alebo overiť fakty.",
    form: {
      title: "Parametre vyhľadávania",
      description: "Nastavenie vyhľadávania na webe",
    },
    submitButton: {
      label: "Hľadať",
      loadingText: "Vyhľadáva sa…",
    },
    backButton: {
      label: "Späť",
    },
    fields: {
      query: {
        title: "Hľadaný text",
        description: "Zadaj konkrétny dopyt pomocou kľúčových slov.",
        placeholder: "Zadaj hľadaný text…",
      },
      maxResults: {
        title: "Najviac výsledkov",
        description: "Počet výsledkov (1 až 10)",
      },
      includeNews: {
        title: "Zahrnúť správy",
        description: "Zahrnúť správy o aktuálnych udalostiach",
      },
      freshness: {
        title: "Obdobie",
        description: "Filtrovať výsledky podľa času zverejnenia",
        options: {
          day: "Posledný deň",
          week: "Posledný týždeň",
          month: "Posledný mesiac",
          year: "Posledný rok",
        },
      },
    },
    response: {
      success: {
        title: "Úspech",
        description: "Či sa vyhľadávanie podarilo",
      },
      message: {
        title: "Správa",
        description: "Správa o stave vyhľadávania",
      },
      query: {
        title: "Dopyt",
        description: "Použitý vyhľadávací dopyt",
      },
      results: {
        title: "Výsledky",
        description: "Pole výsledkov vyhľadávania",
        result: "Výsledok",
        item: {
          title: "Výsledok vyhľadávania",
          description: "Jednotlivý výsledok vyhľadávania",
          url: "URL",
          snippet: "Úryvok",
          age: "Čas od zverejnenia",
          source: "Zdroj",
        },
      },
      cached: {
        title: "Z vyrovnávacej pamäte",
        description: "Či sa výsledky načítali z vyrovnávacej pamäte",
      },
      timestamp: {
        title: "Časová pečiatka",
        description: "Čas vyhľadávania",
      },
    },
    errors: {
      queryEmpty: {
        title: "Vyhľadávací dopyt je povinný",
        description: "Zadaj text, ktorý chceš vyhľadať.",
      },
      queryTooLong: {
        title:
          "Hľadaný text je príliš dlhý. Najvyšší počet znakov: {{maxLength}}.",
        description: "Hľadaný text môže mať najviac 400 znakov.",
      },
      timeout: {
        title: "Vypršal čas vyhradený na vyhľadávanie",
        description: "Vyhľadávanie trvalo príliš dlho",
      },
      searchFailed: {
        title: "Hľadanie zlyhalo",
        description: "Pri vyhľadávaní nastala chyba",
      },
      validation: {
        title: "Neplatné vyhľadávanie",
        description: "Skontroluj parametre vyhľadávania a skús znova",
      },
      internal: {
        title: "Niečo sa pokazilo",
        description: "Vyhľadávanie sa nepodarilo dokončiť. Skús znova.",
      },
      notConfigured: {
        title:
          "Chýba kľúč API pre {{label}}. Do súboru .env pridaj {{envKey}}=<your-key>. Kľúč získaš na {{url}}.",
        description: "Pre vyhľadávanie na webe nastav {{label}}",
      },
    },
    success: {
      title: "Vyhľadávanie dokončené",
      description: "Vyhľadávanie na webe sa dokončilo.",
    },
  },
  tags: {
    search: "Hľadať",
    web: "Web",
    internet: "Internet",
  },
};
