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
    get: "Pobierz",
  },
  get: {
    title: "Szczegóły firmy",
    titleShort: "Firma",
    description: "Wyświetl informacje o firmie",
    companyId: {
      label: "ID firmy",
      description: "Firma do wyświetlenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID firmy",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby wyświetlić szczegóły firmy",
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
        description: "Coś poszło nie tak. Spróbuj ponownie.",
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
        description: "Ta firma nie istnieje lub utracono dostęp",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Firma załadowana",
      description: "Szczegóły firmy pobrane",
    },
    widget: {
      address: "Adres",
      activeMembers: "Aktywni członkowie",
      backToList: "Firmy",
      type: "Typ klienta",
      loadFailed: "Nie udało się wczytać firmy",
      retry: "Spróbuj ponownie",
      related: "Praca w tej firmie",
      setupAccounting: "Skonfiguruj księgowość",
      back: "Wstecz",
      loading: "Ładowanie firmy...",
      edit: "Edytuj",
      members: "Członkowie",
      invite: "Zaproś członka",
      chartOfAccounts: "Plan kont",
      viewInvoices: "Pokaż faktury",
      viewTerminals: "Pokaż terminale POS",
      active: "Aktywna",
      inactive: "Nieaktywna",
      country: "Kraj",
      currency: "Waluta",
      vatNumber: "NIP",
      taxId: "ID podatkowe",
      email: "E-mail",
      phone: "Telefon",
      website: "Strona",
      createdAt: "Utworzono",
      actions: "Akcje",
      modules: {
        accounting: {
          label: "Księgowość",
        },
        invoices: {
          label: "Faktury",
        },
        estimates: {
          label: "Oferty",
        },
        bills: {
          label: "Rachunki",
        },
        pos: {
          label: "Punkt sprzedaży",
        },
        purchasing: {
          label: "Zakupy",
        },
        inventory: {
          label: "Magazyn",
        },
        team: {
          label: "Zespół",
        },
      },
    },
  },
};
