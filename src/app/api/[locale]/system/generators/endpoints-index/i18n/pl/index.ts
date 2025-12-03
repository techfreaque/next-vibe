import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Generuj indeks endpointów",
    description: "Generuj plik indeksu endpointów",
    container: {
      title: "Konfiguracja indeksu endpointów",
    },
    fields: {
      outputFile: {
        label: "Plik wyjściowy",
        description: "Ścieżka do pliku wyjściowego",
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
    },
    success: {
      title: "Sukces",
      description: "Indeks endpointów wygenerowany pomyślnie",
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
};
