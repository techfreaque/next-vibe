import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Informácie",
  enums: {
    provider: {
      AUTO: "Automatické (odporúčané)",
      BRAVE: "Brave Search",
      KAGI: "Kagi FastGPT",
    },
  },
  get: {
    title: "Hľadať na webe",
    titleShort: "Hľadanie na webe",
    dynamicTitle: "Hľadať: {{query}}",
    description:
      "Vyhľadá aktuálne informácie, správy, fakty alebo nedávne udalosti. Automaticky použije tvojho preferovaného poskytovateľa.",
    form: {
      title: "Hľadanie na webe",
      description: "Vyhľadávať na webe cez preferovaného poskytovateľa",
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
      provider: {
        title: "Poskytovateľ vyhľadávania",
        description:
          "Vyber vyhľadávač. Automatický režim zvolí predvoleného alebo najlacnejšieho dostupného poskytovateľa.",
        options: {
          auto: "Automatické (odporúčané)",
          brave: "Brave Search",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "Najviac výsledkov",
        description: "Počet výsledkov (1 až 10). Iba pre Brave.",
      },
      includeNews: {
        title: "Zahrnúť správy",
        description: "Zahrnúť správy o aktuálnych udalostiach. Iba pre Brave.",
      },
      freshness: {
        title: "Obdobie",
        description:
          "Filtrovať výsledky podľa času zverejnenia. Iba pre Brave.",
        options: {
          day: "Posledný deň",
          week: "Posledný týždeň",
          month: "Posledný mesiac",
          year: "Posledný rok",
        },
      },
    },
    response: {
      provider: {
        title: "Poskytovateľ",
        description: "Poskytovateľ, cez ktorého prebehlo vyhľadávanie",
      },
      output: {
        title: "Odpoveď AI",
        description: "Súhrn vytvorený AI (iba Kagi)",
      },
      results: {
        title: "Výsledky",
        description: "Výsledky vyhľadávania na webe",
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
    },
    widget: {
      aiDefaultLabel: "Predvolené pre AI",
      switchTo: "Prepnúť na",
      separatorDot: "·",
      via: "prostredníctvom {{provider}}",
      braveBanner: "Tvoja AI vyhľadáva cez Kagi",
      kagiBanner: "Tvoja AI vyhľadáva cez Brave",
      useBrave: "Použiť Brave",
      useKagi: "Použiť Kagi",
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
      noProvider: {
        title: "Nie je k dispozícii žiadny vyhľadávač",
        description:
          "Chýbajú kľúče API na vyhľadávanie. V súbore .env nastav Brave Search alebo Kagi.",
      },
      noProviderAdmin: {
        title:
          "Chýba poskytovateľ vyhľadávania. Do súboru .env pridaj BRAVE_SEARCH_API_KEY alebo KAGI_API_KEY.",
        description:
          "Brave Search (https://api.search.brave.com/app/keys) a Kagi (https://kagi.com/settings?p=api)",
      },
      noProviderUser: {
        title: "Webové vyhľadávanie nie je teraz k dispozícii.",
        description:
          "Správca zatiaľ nenakonfiguroval poskytovateľa vyhľadávania.",
      },
      providerUnavailable: {
        title: "Poskytovateľ vyhľadávania nie je k dispozícii",
        description:
          "Vybraný poskytovateľ nie je nastavený. Vyber iného alebo použi automatický režim (auto).",
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
