import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    companies: "Firmy",
    members: "Członkowie",
    list: "Lista",
  },
  get: {
    title: "Członkowie zespołu",
    titleShort: "Członkowie zespołu",
    description: "Lista wszystkich członków tej firmy",
    companyId: {
      label: "ID firmy",
      description: "Firma, której członków wyświetlić",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID firmy",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby wyświetlić członków firmy",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie jesteś członkiem tej firmy",
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
      title: "Członkowie załadowani",
      description: "Lista członków pobrana",
    },
    response: {
      id: "ID członka",
      userId: "ID użytkownika",
      email: "E-mail",
      name: "Imię i nazwisko",
      role: "Rola",
      isActive: "Aktywny",
      joinedAt: "Dołączył",
    },
    widget: {
      back: "Wstecz",
      loading: "Ładowanie członków...",
      title: "Członkowie zespołu",
      memberSingular: "członek",
      memberPlural: "członków",
      invite: "Zaproś członka",
      updateRole: "Zmień rolę",
      remove: "Usuń",
      active: "Aktywny",
      inactive: "Nieaktywny",
      empty: {
        title: "Brak członków zespołu",
        hint: "Zaproś współpracowników do pracy nad księgowością i operacjami firmy.",
        cta: "Zaproś pierwszego członka",
      },
    },
  },
};
