import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Statystyki tłumaczeń",
    description: "Pobierz statystyki i analizy tłumaczeń",
    container: {
      title: "Statystyki tłumaczeń",
      description: "Wyświetl użycie plików tłumaczeń i metryki kluczy",
    },
    response: {
      title: "Statystyki",
      description: "Dane statystyk tłumaczeń",
    },
    success: {
      title: "Statystyki pobrane",
      description: "Statystyki tłumaczeń pobrane pomyślnie",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },
};
