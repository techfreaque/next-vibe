import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Okresy księgowe",
    titleShort: "Okresy",
    description: "Lista wszystkich okresów księgowych firmy",
    companyId: {
      label: "ID firmy",
      description: "Firma, której okresy mają być wyświetlone",
      placeholder: "Podaj UUID firmy",
    },
    response: {
      periods: "Okresy",
      id: "ID",
      name: "Nazwa",
      startDate: "Początek",
      endDate: "Koniec",
      status: "Status",
      closedAt: "Zamknięty",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID firmy",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Niewystarczające uprawnienia",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować okresów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono okresów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Okresy załadowane",
      description: "Okresy księgowe pobrane",
    },
    widget: {
      loading: "Ładowanie okresów...",
      empty: "Nie znaleziono okresów księgowych.",
      createButton: "Utwórz okres",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "Otwarty",
      CLOSED: "Zamknięty",
      LOCKED: "Zablokowany",
    },
  },
  title: "Lista okresów",
  description: "Lista okresów księgowych",
  category: "Plan kont",
  tag: "Okres",
};
