import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "Analizator zależności dla plików definicji. Mapuje grafy importów na poziomie pliku i kategorii: kto zależy od czego, nieużywane eksporty, kandydaci do wspólnej biblioteki. Użyj --focus aby skupić się na module, --mode=categories dla ogólnego widoku, --mode=unused dla martwego kodu.",
  category: "Narzędzia Deweloperskie",
  tag: "analiza",

  mode: {
    files: "Pliki",
    categories: "Kategorie",
    unused: "Nieużywane",
  },

  container: {
    title: "Analiza Zależności",
    description: "Skonfiguruj zakres i tryb skanowania zależności",
  },

  fields: {
    focus: {
      label: "Ścieżka Focusu",
      description:
        "Zawęź do konkretnego pliku lub katalogu (np. 'agent/ai-stream' lub 'user'). Zostaw puste, aby analizować całą bazę kodu.",
      placeholder: "np. agent/ai-stream lub user",
    },
    mode: {
      label: "Tryb",
      description:
        "files: graf importów pliku. categories: zestawienie według katalogu najwyższego poziomu. unused: pliki bez importerów.",
    },
    depth: {
      label: "Głębokość",
      description:
        "Ile poziomów zależności przechodnich uwzględnić (domyślnie: 1, tylko bezpośrednie). 0 = bez ograniczeń.",
    },
    limit: {
      label: "Limit",
      description: "Maksymalna liczba zwracanych wpisów (domyślnie: 100).",
    },
  },

  response: {
    success: "Analiza zależności zakończona",
    entries: {
      title: "Wpisy Zależności",
      emptyState: {
        description: "Brak plików pasujących do podanego filtru.",
      },
      importedBy: "importowany przez",
    },
    summary: {
      title: "Podsumowanie",
      totalFiles: "Łączna liczba przeskanowanych plików",
      totalEdges: "Łączna liczba krawędzi importu",
      unusedCount: "Nieużywane eksporty",
    },
  },

  errors: {
    validation: {
      title: "Nieprawidłowe parametry",
      description: "Parametry analizy zależności są nieprawidłowe",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Podczas analizy zależności wystąpił błąd wewnętrzny",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do uruchomienia analizy zależności",
    },
    forbidden: {
      title: "Zabroniony",
      description: "Dostęp do analizy zależności jest zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Podana ścieżka focusu nie została znaleziona",
    },
    server: {
      title: "Błąd serwera",
      description: "Podczas analizy zależności wystąpił błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Podczas analizy zależności wystąpił nieznany błąd",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Podczas analizy zależności wystąpił konflikt",
    },
  },

  success: {
    title: "Analiza zakończona",
    description: "Analiza zależności zakończona pomyślnie",
  },
};
