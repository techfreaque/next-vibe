import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Subskrypcja",
    company: "Firma",
    list: "Lista",
  },
  get: {
    title: "Subskrypcje firmy",
    titleShort: "Subskrypcje firmy",
    description: "Wyświetl wszystkie subskrypcje firmy",
    companyId: {
      label: "ID firmy",
      description: "Firma, której subskrypcje należy wyświetlić",
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
        title: "Firma nie znaleziona",
        description: "Ta firma nie istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Subskrypcje załadowane",
      description: "Subskrypcje firmy pobrane",
    },
  },
};
