import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",

  post: {
    title: "Generuj metadane endpointów",
    description:
      "Generuj zlokalizowane metadane endpointów dla modalu narzędzi",
    container: {
      title: "Konfiguracja metadanych endpointów",
    },
    fields: {
      outputDir: {
        label: "Katalog wyjściowy",
        description: "Katalog dla plików metadanych per-locale",
      },
      dryRun: {
        label: "Próba uruchomienia",
        description: "Podgląd zmian bez zapisu",
      },
      success: {
        title: "Sukces",
      },
      message: {
        title: "Wiadomość",
      },
      duration: {
        title: "Czas trwania",
      },
      endpointsFound: {
        title: "Znalezione endpointy",
      },
      filesWritten: {
        title: "Zapisane pliki",
      },
    },
    success: {
      title: "Sukces",
      description: "Metadane endpointów wygenerowane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt zasobów",
      },
    },
  },
  success: {
    generated: "Metadane endpointów wygenerowane pomyślnie",
  },
};
