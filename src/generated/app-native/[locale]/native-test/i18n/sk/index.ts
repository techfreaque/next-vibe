import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    welcome: "Vitajte v {{appName}}",
    description: "Jazyk a región:",
    locale: {
      title: "Aktuálny jazyk a región",
      description:
        "Táto stránka ukazuje, ako aplikácia používa nastavenia jazyka a regiónu.",
    },
    features: {
      title: "Funkcie platformy",
      description: "Platformu možno používať cez viacero rozhraní.",
      unified: {
        title: "Jednotné rozhranie",
        description:
          "Jeden zdrojový kód pre web, natívne aplikácie, príkazový riadok aj nástroje volané z AI.",
      },
      types: {
        title: "Typová bezpečnosť",
        description:
          "TypeScript s prísnou kontrolou typov na každej platforme.",
      },
      async: {
        title: "Asynchrónne spracovanie",
        description: "Serverové komponenty načítavajú údaje asynchrónne.",
      },
    },
    links: {
      chat: "Prejsť na čet",
      help: "Pomoc",
      about: "O nás",
      story: "Náš príbeh",
      designTest: "Test vzhľadu",
    },
    status: {
      title: "Stav platformy",
      platform: "Platforma",
      universal: "Univerzálna",
      routing: "Smerovanie",
      filebased: "Podľa štruktúry súborov",
      styling: "Štýly",
      nativewind: "NativeWind",
    },
  },
};
