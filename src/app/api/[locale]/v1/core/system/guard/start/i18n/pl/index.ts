import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Uruchom Guard",
  description: "Uruchom środowiska guard dla projektów VSCode",
  tag: "Uruchom",
  category: "Guard",
  container: {
    title: "Konfiguracja uruchomienia",
    description: "Skonfiguruj parametry uruchomienia guard",
  },
  fields: {
    projectPath: {
      title: "Ścieżka projektu",
      description: "Ścieżka do projektu VSCode",
      placeholder: "/home/user/projects/moj-projekt",
    },
    guardId: {
      title: "ID Guard",
      description: "Unikalny identyfikator środowiska guard",
      placeholder: "guard_moj_projekt_abc123",
    },
    startAll: {
      title: "Uruchom wszystkie Guard",
      description: "Uruchom wszystkie dostępne środowiska guard",
    },
    totalStarted: {
      title: "Całkowita liczba uruchomionych",
    },
    output: {
      title: "Wynik",
    },
    startedGuards: {
      columns: {
        username: "Nazwa użytkownika",
        projectPath: "Ścieżka projektu",
      },
    },
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
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Środowisko guard nie zostało znalezione",
    },
    conflict: {
      title: "Konflikt",
      description: "Środowisko guard jest już uruchomione",
    },
  },
  success: {
    title: "Sukces",
    description: "Guard uruchomiony pomyślnie",
  },
};
