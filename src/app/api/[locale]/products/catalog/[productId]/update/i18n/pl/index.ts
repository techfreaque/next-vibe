import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    productType: {
      service: "Usługa",
      physical: "Fizyczny",
      digital: "Cyfrowy",
    },
  },
  tags: {
    products: "Produkty",
    catalog: "Katalog",
    update: "Aktualizuj",
  },
  patch: {
    title: "Aktualizuj produkt",
    titleShort: "Zaktualizuj produkt",
    description: "Zaktualizuj pola istniejącego produktu w katalogu.",
    productId: {
      label: "ID produktu",
      description: "ID produktu do zaktualizowania",
    },
    name: {
      label: "Nazwa produktu",
      description: "Nowa nazwa produktu",
      placeholder: "Pakiet projektowania stron",
    },
    productDescription: {
      label: "Opis",
      description: "Zaktualizowany opis produktu",
      placeholder: "Pełny projekt strony internetowej do 5 podstron",
    },
    sku: {
      label: "SKU",
      description: "Zaktualizowany wewnętrzny kod produktu",
      placeholder: "WD-001",
    },
    type: {
      label: "Typ produktu",
      description: "Zaktualizowany typ produktu",
      placeholder: "Wybierz typ",
    },
    unit: {
      label: "Jednostka",
      description: "Zaktualizowana jednostka rozliczeniowa",
      placeholder: "godzina",
    },
    basePrice: {
      label: "Cena bazowa",
      description: "Zaktualizowana cena bazowa",
      placeholder: "150,00",
    },
    currency: {
      label: "Waluta",
      description: "Zaktualizowany 3-literowy kod waluty ISO",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Domyślna stawka podatku",
      description: "Zaktualizowana domyślna stawka VAT jako ułamek dziesiętny",
      placeholder: "0,23",
    },
    categoryId: {
      label: "Kategoria",
      description: "Zaktualizowana kategoria produktu",
    },
    imageUrl: {
      label: "URL obrazu",
      description: "Zaktualizowany adres URL zdjęcia produktu",
      placeholder: "https://example.com/produkt.jpg",
    },
    isActive: {
      label: "Aktywny",
      description: "Czy produkt jest dostępny w katalogu",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź pola i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby zaktualizować produkt",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do aktualizacji tego produktu",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      server: {
        title: "Błąd serwera",
        description: "Coś poszło nie tak — spróbuj ponownie",
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
        title: "Nie znaleziono",
        description: "Produkt nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Produkt zaktualizowany",
      description: "Szczegóły produktu zostały zapisane.",
    },
    response: {
      id: "ID produktu",
      name: "Nazwa produktu",
    },
    widget: {
      backToList: "Powrót do produktów",
      back: "Wróć",
    },
  },
};
