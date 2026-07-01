import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",

  post: {
    title: "Generuj indeks kategorii",
    description: "Generuj rejestr kategorii admina z plików category.ts",
    container: {
      title: "Generowanie indeksu kategorii",
      description: "Konfiguracja parametrów generowania indeksu kategorii",
    },
    fields: {
      outputFile: {
        label: "Plik wyjściowy",
        description: "Ścieżka do generowanego pliku rejestru kategorii",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Podgląd bez zapisu plików",
      },
      duration: { title: "Czas trwania" },
      success: { title: "Sukces" },
      message: { title: "Wiadomość" },
      categoriesFound: { title: "Znalezione kategorie" },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
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
        description: "Wystąpił błąd sieci",
      },
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Rejestr kategorii wygenerowany pomyślnie",
    },
  },
};
