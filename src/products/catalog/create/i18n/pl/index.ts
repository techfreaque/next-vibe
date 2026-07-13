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
    create: "Utwórz",
  },
  post: {
    title: "Utwórz produkt",
    titleShort: "Utwórz produkt",
    description: "Dodaj produkt lub usługę do swojego katalogu.",
    name: {
      label: "Nazwa produktu",
      description: "Nazwa produktu lub usługi",
      placeholder: "Pakiet projektowania stron",
    },
    productDescription: {
      label: "Opis",
      description: "Krótki opis zakresu produktu lub usługi",
      placeholder: "Pełny projekt strony internetowej do 5 podstron",
    },
    sku: {
      label: "SKU",
      description: "Wewnętrzny kod produktu",
      placeholder: "WD-001",
    },
    type: {
      label: "Typ produktu",
      description: "Usługa, towar fizyczny lub produkt cyfrowy",
      placeholder: "Wybierz typ",
    },
    unit: {
      label: "Jednostka",
      description: "Jednostka rozliczeniowa (np. godzina, sztuka, licencja)",
      placeholder: "godzina",
    },
    basePrice: {
      label: "Cena bazowa",
      description: "Domyślna cena w wybranej walucie",
      placeholder: "150,00",
    },
    currency: {
      label: "Waluta",
      description: "3-literowy kod waluty ISO",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Domyślna stawka podatku",
      description:
        "Domyślna stawka VAT jako ułamek dziesiętny (np. 0,23 dla 23%)",
      placeholder: "0,23",
    },
    companyId: {
      label: "Firma",
      description: "Przypisz produkt do firmy",
    },
    categoryId: {
      label: "Kategoria",
      description: "Kategoria produktu",
    },
    imageUrl: {
      label: "URL obrazu",
      description: "Adres URL do zdjęcia produktu",
      placeholder: "https://example.com/produkt.jpg",
    },
    isSubscription: {
      label: "Produkt subskrypcyjny",
      description: "Klienci są rozliczani cyklicznie",
    },
    billingInterval: {
      label: "Okres rozliczeniowy",
      description: "Jak często klienci są obciążani",
      placeholder: "Wybierz okres",
      monthly: "Miesięcznie",
      yearly: "Rocznie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź pola formularza i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby utworzyć produkt",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do tworzenia tego produktu",
      },
      conflict: {
        title: "Już istnieje",
        description: "Produkt z tym SKU już istnieje",
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
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Produkt utworzony",
      description: "Twój produkt jest teraz w katalogu.",
    },
    response: {
      id: "ID produktu",
      name: "Nazwa produktu",
    },
    widget: {
      viewProduct: "Zobacz produkt",
      backToList: "Powrót do produktów",
      back: "Wróć",
    },
  },
};
