import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  enums: {
    invoiceStatus: {
      draft: "Szkic",
      open: "Otwarta",
      paid: "Opłacona",
      void: "Unieważniona",
      uncollectible: "Nieściągalna",
    },
  },
  tags: {
    payment: "płatność",
    invoice: "faktura",
  },
  get: {
    title: "Faktury sprzedażowe",
    titleShort: "Faktury sprzedażowe",
    description:
      "Szukaj po numerze dokumentu, identyfikatorze faktury lub klienta. Filtruj według firmy lub statusu.",
    form: {
      title: "Filtry faktur",
      description: "Filtruj listę faktur",
    },
    response: {
      customerName: "Klient",
      total: "Łącznie",
      invoices: "Faktury",
      id: "ID faktury",
      invoiceSequenceNumber: "Numer faktury",
      customerId: "ID klienta",
      currency: "Waluta",
      status: "Status",
      amount: "Kwota",
      dueDate: "Termin płatności",
      notes: "Uwagi",
      lineCount: "Liczba pozycji",
      amountPaid: "Zapłacono",
      amountDue: "Do zapłaty",
      isOverdue: "Przeterminowana",
      createdAt: "Utworzono dnia",
      updatedAt: "Zaktualizowano dnia",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry filtrów",
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
        description: "Musisz być członkiem tej firmy",
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
      title: "Sukces",
      description: "Lista faktur pobrana",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Filtruj faktury tej firmy",
    placeholder: "Wprowadź ID firmy",
  },
  search: {
    label: "Szukaj dokumentów",
    description: "Szukaj według numeru faktury, nazwy klienta lub ID.",
    placeholder: "Numer faktury lub klient",
  },
  status: {
    label: "Status",
    description:
      "Filtruj według statusu faktury lub pokaż przeterminowane faktury z kwotą do zapłaty.",
    placeholder: "Wszystkie statusy",
  },
  customerId: {
    label: "ID klienta",
    description: "Filtruj według klienta",
    placeholder: "Wprowadź ID klienta",
  },
  page: {
    label: "Strona",
    description: "Numer strony",
  },
  pageSize: {
    label: "Rozmiar strony",
    description: "Wyniki na stronie",
  },
  widget: {
    creditNote: "Korekta",
    creditable: "Wybierz fakturę do korekty",
    noCreditable: "Brak faktur z kwotą dostępną do korekty.",
    filters: "Filtry",
    partlyPaid: "Częściowo zapłacona",
    pageCount: "Liczba stron",
    title: "Faktury sprzedażowe",
    newInvoice: "Nowa faktura",
    loading: "Ładowanie faktur...",
    noInvoices: "Brak faktur.",
    noInvoicesHint: "Utwórz pierwszą fakturę, aby zacząć.",
    overdue: "Przeterminowana",
    due: "Termin",
    lines: "pozycji",
    line: "pozycja",
    view: "Podgląd",
    back: "Wróć",
    empty: {
      title: "Brak faktur.",
      hint: "Utwórz pierwszą fakturę, aby zacząć.",
      cta: "Nowa faktura",
    },
    status: {
      draft: "Szkic",
      open: "Otwarta",
      paid: "Opłacona",
      void: "Anulowana",
      uncollectible: "Nieściągalna",
    },
  },
};
