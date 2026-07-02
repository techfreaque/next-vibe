import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    welcome: "Willkommen bei {{appName}}",
    description: "Sprache:",
    locale: {
      title: "Aktuelle Sprache",
      description: "Diese Seite demonstriert Sprachunterstützung",
    },
    features: {
      title: "Plattform-Funktionen",
      description: "Diese Plattform unterstützt mehrere Oberflächen",
      unified: {
        title: "Einheitliche Oberfläche",
        description:
          "Eine Codebasis für Web, Native, CLI und KI-aufrufbare Tools",
      },
      types: {
        title: "Typsicherheit",
        description:
          "Vollständige TypeScript-Unterstützung mit strikter Typprüfung",
      },
      async: {
        title: "Async-Unterstützung",
        description: "Server-Komponenten mit asynchronem Datenladen",
      },
    },
    links: {
      chat: "Zum Chat",
      help: "Hilfe",
      about: "Über uns",
      story: "Unsere Geschichte",
      designTest: "Design-Test",
    },
    status: {
      title: "Plattformstatus",
      platform: "Plattform",
      universal: "Universal",
      routing: "Routing",
      filebased: "Dateibasiert",
      styling: "Styling",
      nativewind: "NativeWind",
    },
  },
};
