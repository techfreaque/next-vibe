import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    welcome: "Benvenuti a {{appName}}",
    description: "Locale:",
    locale: {
      title: "Locale attuale",
      description: "Questa pagina dimostra il supporto locale",
    },
    features: {
      title: "Caratteristiche della piattaforma",
      description: "Questa piattaforma supporta più superfici",
      unified: {
        title: "Superficie unificata",
        description: "Una base di codice per web, nativo, CLI, e AI -callable strumenti",
      },
      types: {
        title: "Tipo di sicurezza",
        description:
          "Supporto TypeScript completo con controllo di tipo rigoroso su piattaforme",
      },
      async: {
        title: "Supporto asincastro",
        description: "Componenti server con caricamento dati asincastro",
      },
    },
    links: {
      chat: "Vai a Chat",
      help: "Aiuto",
      about: "Informazioni su di noi",
      story: "La nostra storia",
      designTest: "Test di progettazione",
    },
    status: {
      title: "Stato della piattaforma",
      platform: "Piattaforma",
      universal: "Universale universale",
      routing: "Routing",
      filebased: "Basato su file",
      styling: "Styling",
      nativewind: "NativeWind",
    },
  },
};
