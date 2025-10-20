import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zniszcz Guard",
  description: "Zniszcz środowiska guard i wyczyść zasoby",
  tag: "zarządzanie-guard",
  container: {
    title: "Konfiguracja niszczenia Guard",
    description: "Skonfiguruj parametry niszczenia środowisk guard",
  },
  fields: {
    projectPath: {
      title: "Ścieżka projektu",
      description: "Ścieżka do katalogu projektu",
      placeholder: "/home/user/projects/moj-projekt",
    },
    guardId: {
      title: "ID Guard",
      description: "Unikalny identyfikator guard",
      placeholder: "guard_moj_projekt_abc123",
    },
    force: {
      title: "Wymuś niszczenie",
      description: "Wymuś niszczenie nawet jeśli guard jest uruchomiony",
    },
    cleanupFiles: {
      title: "Wyczyść pliki",
      description: "Usuń wszystkie pliki związane z guard",
    },
    dryRun: {
      title: "Próbny przebieg",
      description: "Podgląd co zostałoby zniszczone bez faktycznego niszczenia",
    },
    success: {
      title: "Sukces",
    },
    output: {
      title: "Wynik",
    },
    destroyedGuards: {
      title: "Zniszczone Guards",
    },
    warnings: {
      title: "Ostrzeżenia",
    },
    totalDestroyed: {
      title: "Łącznie zniszczonych",
    },
  },
  form: {
    title: "Konfiguracja",
    description: "Skonfiguruj parametry",
  },
  response: {
    title: "Odpowiedź",
    description: "Dane odpowiedzi",
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
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd wewnętrzny",
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
  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
  },
};
