import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Otwórz okres księgowy",
    description: "Utwórz nowy okres księgowy dla firmy",
    companyId: {
      label: "ID firmy",
      description: "Firma, dla której otwierany jest okres",
      placeholder: "UUID firmy",
    },
    name: {
      label: "Nazwa okresu",
      description: "np. Styczeń 2026",
      placeholder: "Styczeń 2026",
    },
    startDate: {
      label: "Data początkowa",
      description: "Początek okresu",
      placeholder: "",
    },
    endDate: {
      label: "Data końcowa",
      description: "Koniec okresu",
      placeholder: "",
    },
    response: { id: "ID okresu", name: "Nazwa" },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź daty początku/końca",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Niewystarczające uprawnienia",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się utworzyć okresu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Nakładanie się",
        description: "Zakres dat nakłada się z istniejącym okresem",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Firma nie znaleziona",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Okres utworzony",
      description: "Okres księgowy otwarty",
    },
    widget: {
      viewButton: "Pokaż okres",
      back: "Wstecz",
    },
  },
  title: "Utwórz okres",
  description: "Otwórz nowy okres księgowy",
  category: "Plan kont",
  tag: "Okres",
};
