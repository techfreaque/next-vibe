import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    ar: "należności",
  },
  post: {
    title: "Nowa faktura",
    titleShort: "Nowa faktura",
    description: "Przygotuj fakturę dla klienta.",
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
      details: "Dane faktury",
      draftHint: "Zapisz szkic i sprawdź go przed wystawieniem.",
      items: "Pozycje",
      itemsDescription:
        "Opcjonalne pozycje szkicu. Podaj stawkę VAT jako ułamek od 0 do 1.",
      itemsHint: "Dodaj towary lub usługi, aby obliczyć sumę faktury.",
      item: "Opis",
      quantity: "Ilość",
      unitPrice: "Cena jednostkowa",
      manualTaxRate: "Inna stawka",
      taxRate: "VAT %",
      addItem: "Dodaj pozycję",
      removeItem: "Usuń pozycję",
      itemError: "Podaj opis, dodatnią ilość, cenę i stawkę VAT od 0 do 100%.",
      itemsTotalError: "Suma jest za wysoka na jedną fakturę.",
      summary: "Podsumowanie",
      net: "Netto",
      tax: "VAT",
      total: "Razem",
      clearCustomer: "Usuń wybór klienta",
      lineTotal: "Suma pozycji",
      companyCurrencyValue: "Waluta firmy: {{currency}}",
      companyCurrency: "Bez wyboru obowiązuje waluta firmy.",
      back: "Wróć",
      submit: "Zapisz szkic",
      viewButton: "Zobacz fakturę",
    },
  },
  companyId: {
    label: "Firma",
    description: "Firma wystawiająca tę fakturę",
    placeholder: "Wprowadź ID firmy",
  },
  customerId: {
    label: "Klient",
    description: "Wyszukaj klienta według nazwy.",
    placeholder: "Wprowadź ID klienta",
  },
  dueDate: {
    label: "Termin płatności",
    description: "Kiedy faktura jest wymagalna",
    placeholder: "Wybierz datę",
  },
  currency: {
    code: "{{code}}",
    label: "Waluta",
    description: "Waluta faktury",
    placeholder: "Waluta firmy",
  },
  notes: {
    label: "Uwagi",
    description: "Opcjonalne uwagi widoczne na fakturze",
    placeholder: "np. Termin płatności: 30 dni",
  },
};
