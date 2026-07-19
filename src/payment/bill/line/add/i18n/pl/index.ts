import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "płatność", bill: "faktura", ap: "zobowiązania" },
  post: {
    title: "Dodaj pozycję faktury",
    titleShort: "Dodaj linię",
    description: "Dodaj pozycję kosztową do szkicu faktury dostawcy",
    form: {
      title: "Nowa pozycja faktury",
      description: "Wprowadź szczegóły kosztu",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wszystkie pola",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby dodawać pozycje",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Księgowy lub Administrator",
      },
      conflict: {
        title: "Faktura nie do edycji",
        description: "Tylko faktury w stanie Szkic można edytować",
      },
      server: { title: "Błąd serwera", description: "Nie można dodać pozycji" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: { title: "Błąd sieci", description: "Sprawdź połączenie" },
      notFound: {
        title: "Faktura nie znaleziona",
        description: "Ta faktura nie istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Pozycja dodana",
      description: "Pozycja kosztowa dodana do faktury",
    },
    response: {
      success: "Sukces",
      message: "Wiadomość",
      line: {
        title: "Szczegóły pozycji",
        subtitle: "Dodana pozycja",
        id: "ID pozycji",
        billId: "ID faktury",
        lineDescription: "Opis",
        productId: "ID produktu",
        quantity: "Ilość",
        unitPrice: "Cena jedn.",
        taxRate: "Stawka VAT",
        taxAmount: "Kwota VAT",
        lineTotal: "Wartość pozycji",
        expenseAccountId: "Konto kosztowe",
        sortOrder: "Kolejność",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
  },
  billId: {
    label: "ID faktury",
    description: "Faktura, do której dodajesz tę pozycję",
    placeholder: "UUID faktury",
  },
  description: {
    label: "Opis",
    description: "Co zostało zakupione",
    placeholder: "Materiały biurowe",
  },
  productId: {
    label: "ID produktu",
    description: "Opcjonalna referencja produktu",
    placeholder: "UUID produktu",
  },
  quantity: {
    label: "Ilość",
    description: "Liczba jednostek",
    placeholder: "1",
  },
  unitPrice: {
    label: "Cena jednostkowa",
    description: "Cena za jednostkę",
    placeholder: "100,00",
  },
  taxRate: {
    label: "Stawka VAT",
    description: "Stawka VAT (0–1, np. 0,23 dla 23%)",
    placeholder: "0,23",
  },
  expenseAccountId: {
    label: "Konto kosztowe",
    description: "Na jakie konto kosztowe ta pozycja zostanie zaksięgowana",
    placeholder: "UUID konta",
  },
  widget: {
    submit: "Dodaj pozycję",
    searchProduct: "Wyszukaj produkt",
    searchPlaceholder: "Nazwa produktu lub SKU…",
    searchButton: "Szukaj",
    clearProduct: "Wyczyść",
    noProductResults: "Brak wyników.",
    orManual: "lub wprowadź ręcznie",
    multiplier: "×",
    taxLabel: "VAT",
    linePreview: "Suma pozycji (podgląd)",
    addAnotherLine: "Dodaj kolejną pozycję",
    viewBill: "Wyświetl rachunek",
  },
};
