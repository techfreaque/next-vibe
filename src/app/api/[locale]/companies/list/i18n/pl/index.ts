import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Osoba fizyczna",
    },
    companyMemberRole: {
      owner: "Właściciel",
      admin: "Administrator",
      member: "Członek",
      accountant: "Księgowy",
      viewer: "Obserwator",
    },
  },
  tags: {
    companies: "Firmy",
    list: "Lista",
  },
  get: {
    title: "Moje firmy",
    titleShort: "Moje firmy",
    description: "Firmy, których jesteś członkiem",
    page: {
      label: "Strona",
      description: "Numer strony (zaczyna się od 1)",
    },
    pageSize: {
      label: "Na stronie",
      description: "Wyniki na stronie (max 100)",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby zobaczyć swoje firmy",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Dostęp zabroniony",
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
        title: "Nie znaleziono",
        description: "Nie znaleziono firm",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Firmy załadowane",
      description: "Lista firm pobrana",
    },
    widget: {
      back: "Wstecz",
      loading: "Ładowanie firm...",
      title: "Moje firmy",
      create: "Nowa firma",
      total: "firm",
      totalSingular: "firma",
      inactive: "Nieaktywna",
      empty: {
        title: "Brak firm",
        hint: "Utwórz firmę, żeby zarządzać księgowością, fakturami i zespołem.",
        cta: "Utwórz pierwszą firmę",
      },
    },
    response: {
      total: "Łącznie",
      id: "ID",
      name: "Nazwa",
      type: "Typ",
      role: "Twoja rola",
      isActive: "Aktywna",
      country: "Kraj",
      currency: "Waluta",
      email: "E-mail",
      createdAt: "Utworzono",
    },
  },
};
