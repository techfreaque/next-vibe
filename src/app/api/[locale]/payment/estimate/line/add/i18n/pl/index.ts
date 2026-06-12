import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: { payment: "płatność", estimate: "oferta", lines: "pozycje" },
  post: {
    title: "Dodaj pozycję oferty",
    titleShort: "Dodaj linię",
    description: "Dodaj pozycję do oferty",
    form: {
      title: "Dodaj pozycję oferty",
      description: "Dodaj produkt lub usługę do tej oferty",
    },
    response: {
      success: "Sukces",
      message: "Komunikat statusu",
      line: {
        title: "Pozycja",
        subtitle: "Dodana pozycja",
        id: "ID pozycji",
        estimateId: "ID oferty",
        lineDescription: "Opis",
        productId: "ID produktu",
        quantity: "Ilość",
        unitPrice: "Cena jednostkowa",
        taxRate: "Stawka VAT",
        taxAmount: "Kwota VAT",
        lineTotal: "Suma pozycji",
        sortOrder: "Kolejność",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź dane pozycji",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Oferta nie znaleziona",
      },
      conflict: {
        title: "Konflikt",
        description: "Oferta musi być w statusie szkicu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Pozycja dodana",
      description: "Pozycja została dodana do oferty",
    },
  },
  estimateId: {
    label: "ID oferty",
    description: "Oferta, do której dodawana jest pozycja",
    placeholder: "UUID oferty",
  },
  description: {
    label: "Opis",
    description: "Opis produktu lub usługi",
    placeholder: "np. Tworzenie stron - 10 godzin",
  },
  productId: {
    label: "ID produktu",
    description: "Opcjonalne odwołanie do produktu",
    placeholder: "UUID produktu",
  },
  quantity: {
    label: "Ilość",
    description: "Liczba jednostek",
    placeholder: "1",
  },
  unitPrice: {
    label: "Cena jednostkowa",
    description: "Cena za jednostkę (bez VAT)",
    placeholder: "0,00",
  },
  taxRate: {
    label: "Stawka VAT",
    description: "Stawka VAT jako liczba dziesiętna (np. 0,23 dla 23%)",
    placeholder: "0,23",
  },
  widget: {
    searchProduct: "Szukaj produktu",
    searchPlaceholder: "Nazwa produktu lub SKU...",
    searchButton: "Szukaj",
    clearProduct: "Usuń",
    noProductResults: "Nie znaleziono produktów.",
    orManual: "lub wpisz ręcznie",
    multiplier: "×",
    taxLabel: "VAT",
    linePreview: "Suma pozycji",
    addAnotherLine: "Dodaj kolejną pozycję",
    viewEstimate: "Wróć do oferty",
    submit: "Dodaj pozycję",
  },
};
