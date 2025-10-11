import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Stwórz lead",
    description: "Stwórz nowy lead w systemie",
    form: {
      title: "Formularz nowego leada",
      description: "Wprowadź informacje o leadzie aby stworzyć nowy lead",
    },
    response: {
      title: "Stworzony lead",
      description: "Szczegóły nowo stworzonego leada",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Autoryzacja wymagana do tworzenia leadów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe informacje o leadzie",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas tworzenia leada",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas tworzenia leada",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas tworzenia leada",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla tworzenia leadów",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wymagany zasób nie został znaleziony do tworzenia leada",
      },
      conflict: {
        title: "Konflikt",
        description: "Lead już istnieje lub wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w formularzu leada",
      },
    },
    success: {
      title: "Lead stworzony",
      description: "Lead stworzony pomyślnie",
    },
  },
} ;
