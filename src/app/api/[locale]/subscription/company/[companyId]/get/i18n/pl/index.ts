import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Subskrypcja",
    company: "Firma",
    get: "Pobierz",
  },
  get: {
    title: "Subskrypcja firmy",
    description: "Pobierz aktywną subskrypcję firmy",
    companyId: {
      label: "ID firmy",
      description: "Firma, której subskrypcję należy pobrać",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID firmy",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby wyświetlić subskrypcje firmy",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz dostępu do subskrypcji tej firmy",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt danych",
      },
      server: {
        title: "Błąd serwera",
        description: "Coś poszło nie tak — spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Sprawdź połączenie i spróbuj ponownie",
      },
      notFound: {
        title: "Brak subskrypcji",
        description: "Ta firma nie ma żadnej subskrypcji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Subskrypcja załadowana",
      description: "Subskrypcja firmy pobrana",
    },
  },
};
