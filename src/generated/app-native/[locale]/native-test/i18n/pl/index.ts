import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    welcome: "Witaj w {{appName}}",
    description: "Język:",
    locale: {
      title: "Bieżący język",
      description: "Ta strona demonstruje obsługę języków",
    },
    features: {
      title: "Funkcje platformy",
      description: "Ta platforma obsługuje wiele powierzchni",
      unified: {
        title: "Zunifikowana powierzchnia",
        description:
          "Jedna baza kodu dla web, natywnych, CLI i narzędzi wywoływanych przez AI",
      },
      types: {
        title: "Bezpieczeństwo typów",
        description:
          "Pełna obsługa TypeScript ze ścisłym sprawdzaniem typów na wszystkich platformach",
      },
      async: {
        title: "Obsługa async",
        description: "Komponenty serwerowe z asynchronicznym ładowaniem danych",
      },
    },
    links: {
      chat: "Przejdź do czatu",
      help: "Pomoc",
      about: "O nas",
      story: "Nasza historia",
      designTest: "Test projektu",
    },
    status: {
      title: "Status platformy",
      platform: "Platforma",
      universal: "Uniwersalna",
      routing: "Routing",
      filebased: "Plikowy",
      styling: "Stylowanie",
      nativewind: "NativeWind",
    },
  },
};
