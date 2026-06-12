import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    ar: "należności",
  },
  post: {
    title: "Utwórz fakturę sprzedaży",
    titleShort: "Utwórz fakturę",
    description: "Utwórz nową fakturę sprzedaży dla klienta",
    form: {
      title: "Nowa faktura",
      description: "Uzupełnij dane faktury",
    },
    response: {
      success: "Faktura utworzona",
      message: "Komunikat statusu",
      invoice: {
        title: "Faktura",
        subtitle: "Utworzona faktura",
        id: "ID faktury",
        companyId: "ID firmy",
        customerId: "ID klienta",
        invoiceSequenceNumber: "Numer faktury",
        currency: "Waluta",
        status: "Status",
        dueDate: "Termin płatności",
        notes: "Uwagi",
        amount: "Kwota",
        createdAt: "Utworzono dnia",
        updatedAt: "Zaktualizowano dnia",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry faktury",
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
        description: "Musisz być administratorem lub księgowym tej firmy",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Firma nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Faktura utworzona",
      description: "Faktura utworzona w trybie szkicu",
    },
    widget: {
      back: "Wróć",
      submit: "Utwórz fakturę",
      viewButton: "Zobacz fakturę",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Firma wystawiająca tę fakturę",
    placeholder: "Wprowadź ID firmy",
  },
  customerId: {
    label: "ID klienta",
    description: "Opcjonalne: UUID klienta (miękkie odwołanie do użytkownika)",
    placeholder: "Wprowadź ID klienta",
  },
  dueDate: {
    label: "Termin płatności",
    description: "Kiedy faktura jest wymagalna",
    placeholder: "Wybierz datę",
  },
  currency: {
    label: "Waluta",
    description: "Waluta faktury",
    placeholder: "EUR",
  },
  notes: {
    label: "Uwagi",
    description: "Opcjonalne uwagi widoczne na fakturze",
    placeholder: "np. Termin płatności: 30 dni",
  },
};
