import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    ar: "należności",
  },
  post: {
    title: "Duplikuj fakturę",
    titleShort: "Duplikuj fakturę",
    description:
      "Sklonuj istniejącą fakturę jako nowy szkic. Kopiuje wszystkie pozycje, klienta, firmę i walutę. Nowa faktura otrzymuje nowy numer i dzisiejszą datę.",
    form: {
      title: "Duplikuj fakturę",
      description: "Tworzy nową fakturę szkic na podstawie tej faktury",
    },
    response: {
      success: "Faktura zduplikowana",
      message: "Komunikat statusu",
      invoice: {
        title: "Nowa faktura",
        subtitle: "Zduplikowana faktura szkic",
        id: "ID faktury",
        companyId: "ID firmy",
        customerId: "ID klienta",
        invoiceSequenceNumber: "Numer faktury",
        currency: "Waluta",
        status: "Status",
        dueDate: "Termin płatności",
        notes: "Uwagi",
        amount: "Kwota",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
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
        description: "Wystąpił konflikt",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Faktura zduplikowana jako nowy szkic",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "ID faktury do zduplikowania",
    placeholder: "Wprowadź ID faktury",
  },
  widget: {
    back: "Wróć",
    submit: "Duplikuj fakturę",
    duplicated: "Faktura zduplikowana",
    invoiceNumber: "Faktura nr",
    viewDuplicate: "Zobacz duplikat",
  },
};
