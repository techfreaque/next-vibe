import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    lines: "pozycje",
  },
  post: {
    title: "Dodaj pozycję faktury",
    titleShort: "Dodaj linię",
    description: "Dodaj pozycję do faktury w trybie szkicu",
    form: {
      title: "Pozycja faktury",
      description: "Określ pozycję do rozliczenia",
    },
    response: {
      success: "Pozycja dodana",
      message: "Komunikat statusu",
      line: {
        title: "Szczegóły pozycji",
        subtitle: "Utworzona pozycja faktury",
        id: "ID pozycji",
        invoiceId: "ID faktury",
        lineDescription: "Opis",
        productId: "ID produktu",
        quantity: "Ilość",
        unitPrice: "Cena jednostkowa",
        taxRate: "Stawka podatku",
        taxAmount: "Kwota podatku",
        lineTotal: "Suma pozycji",
        sortOrder: "Kolejność sortowania",
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
        description: "Nieprawidłowe parametry pozycji",
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
      description: "Pozycja dodana do faktury",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "Faktura szkic, do której dodajesz pozycję",
    placeholder: "Wprowadź ID faktury",
  },
  description: {
    label: "Opis",
    description: "Co reprezentuje ta pozycja",
    placeholder: "np. Tworzenie stron – 10 godzin",
  },
  productId: {
    label: "ID produktu",
    description: "Opcjonalne powiązanie z produktem",
    placeholder: "Wprowadź ID produktu",
  },
  quantity: {
    label: "Ilość",
    description: "Liczba jednostek",
    placeholder: "1",
  },
  unitPrice: {
    label: "Cena jednostkowa",
    description: "Cena za jednostkę",
    placeholder: "0,00",
  },
  taxRate: {
    label: "Stawka podatku",
    description: "Stawka podatku jako ułamek dziesiętny (np. 0,23 dla 23%)",
    placeholder: "0,00",
  },
  widget: {
    searchProduct: "Szukaj w katalogu produktów",
    searchPlaceholder: "Nazwa lub SKU…",
    searchButton: "Szukaj",
    clearProduct: "Wyczyść",
    noProductResults: "Brak wyników — wpisz dane ręcznie poniżej.",
    orManual: "Lub wpisz ręcznie",
    multiplier: "×",
    taxLabel: "podatek",
    linePreview: "Suma pozycji",
    lineAdded: "Pozycja dodana",
    addAnotherLine: "Dodaj kolejną pozycję",
    viewInvoice: "Wyświetl fakturę",
    submit: "Dodaj pozycję",
  },
};
