import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
  },
  post: {
    title: "Wystaw fakturę",
    titleShort: "Wystaw fakturę",
    description: "Wystaw szkic i zaksięguj należność.",
    form: {
      title: "Wystaw fakturę",
      description: "Po wystawieniu otrzymasz link dla klienta.",
    },
    response: {
      success: "Faktura wysłana",
      message: "Komunikat statusu",
      viewUrl: "URL widoku klienta",
    },
    errors: {
      invoiceLines: "Przed wystawieniem dodaj pozycje o dodatniej sumie.",
      posting:
        "Sprawdź kwotę faktury, walutę firmy, okres księgowy i konta księgowe.",
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Faktura nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Faktura nie jest w trybie szkicu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Faktura oznaczona jako wysłana",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "ID faktury do wysłania",
    placeholder: "Wprowadź ID faktury",
  },
  widget: {
    back: "Wróć",
    submit: "Wystaw fakturę",
    sent: "Faktura wystawiona",
    viewUrl: "Link widoku klienta",
  },
};
