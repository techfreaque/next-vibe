import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    catalog: "Katalog",
    list: "Lista",
  },
  enums: {
    productType: {
      service: "Usługa",
      physical: "Fizyczny",
      digital: "Cyfrowy",
    },
  },
  get: {
    title: "Lista produktów katalogu",
    description:
      "Pobierz wszystkie produkty ze swojego katalogu. Filtruj według firmy, kategorii, typu lub statusu.",
    companyId: {
      label: "ID firmy",
      description: "Filtruj produkty należące do tej firmy",
    },
    categoryId: {
      label: "ID kategorii",
      description: "Filtruj produkty w tej kategorii",
    },
    type: {
      label: "Typ produktu",
      description: "Filtruj według usługi, fizycznego lub cyfrowego",
      placeholder: "Wszystkie typy",
    },
    isActive: {
      label: "Tylko aktywne",
      description: "Pokaż tylko aktywne produkty",
    },
    page: {
      label: "Strona",
      description: "Numer strony (zaczyna się od 1)",
    },
    pageSize: {
      label: "Na stronie",
      description: "Wyniki na stronie (max 100)",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź parametry filtrów i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby wyświetlić katalog",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do wyświetlenia tego katalogu",
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
        description: "Nie znaleziono produktów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Produkty pobrane",
      description: "Produkty z Twojego katalogu są wymienione poniżej.",
    },
    response: {
      id: "ID produktu",
      name: "Nazwa produktu",
      type: "Typ",
      sku: "SKU",
      basePrice: "Cena bazowa",
      currency: "Waluta",
      unit: "Jednostka",
      isActive: "Aktywny",
      isSubscription: "Subskrypcja",
      billingInterval: "Okres rozliczeniowy",
      categoryId: "Kategoria",
      createdAt: "Utworzono",
      total: "Łącznie",
    },
    widget: {
      addProduct: "Dodaj produkt",
      active: "Aktywny",
      inactive: "Nieaktywny",
      empty: "Nie znaleziono produktów. Zmień filtry lub dodaj nowy produkt.",
      columnProduct: "Produkt",
      columnTypePrice: "Typ / Cena / Status",
      filterLoad: "Załaduj",
      filterAllTypes: "Wszystkie typy",
      filterActiveOnly: "Tylko aktywne",
      filterAllStatus: "Wszystkie statusy",
      recurring: "Cykliczny",
      billingMonthly: "Miesięcznie",
      billingYearly: "Rocznie",
      navCategories: "Kategorie",
      navTaxRates: "Stawki podatkowe",
      back: "Wróć",
    },
  },
};
