import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Informácie",
  get: {
    title: "Vyhľadávať cez Kagi",
    titleShort: "Vyhľadávanie Kagi",
    dynamicTitle: "Kagi: {{query}}",
    description:
      "Vyhľadávaj na webe pomocou Kagi. FastGPT pripraví odpoveď AI so zdrojmi. Režim vyhľadávania vráti priame výsledky.",
    form: {
      title: "Parametre vyhľadávania",
      description: "Nastaviť vyhľadávanie Kagi",
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
        description: "Zadaj konkrétnu otázku alebo hľadaný výraz.",
        placeholder: "Zadaj hľadaný text…",
      },
      mode: {
        title: "Režim vyhľadávania",
        description:
          "Vyber si odpovede od AI (FastGPT) alebo priame výsledky vyhľadávania",
        options: {
          fastgpt: "FastGPT (odpovede AI)",
          search: "Vyhľadávanie (priame výsledky)",
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
      output: {
        title: "Odpoveď",
        description: "Odpoveď vytvorená pomocou FastGPT",
      },
      query: {
        title: "Dopyt",
        description: "Použitý vyhľadávací dopyt",
      },
      references: {
        title: "Odkazy",
        description: "Odkazy a citácie zdrojov",
        reference: "Odkaz",
        item: {
          title: "Odkaz",
          description: "Odkaz na zdroj s citáciou",
          url: "URL",
          snippet: "Úryvok",
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
        description: "Pre vyhľadávanie cez Kagi nastav {{label}}",
      },
    },
    success: {
      title: "Vyhľadávanie dokončené",
      description: "Vyhľadávanie cez Kagi sa dokončilo.",
    },
  },
  tags: {
    search: "Hľadať",
    web: "Web",
    ai: "AI",
  },
};
