import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
  },
  post: {
    title: "Wyślij fakturę",
    titleShort: "Wyślij fakturę",
    description:
      "Oznacz fakturę szkic jako wysłaną — status zmienia się na Otwarta",
    form: {
      title: "Wyślij fakturę",
      description: "Wysyła fakturę do klienta",
    },
    response: {
      success: "Faktura wysłana",
      message: "Komunikat statusu",
      viewUrl: "URL widoku klienta",
    },
    errors: {
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
    submit: "Wyślij fakturę",
    sent: "Faktura wysłana",
    viewUrl: "Link widoku klienta",
  },
};
