import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    category: "Kategoria",
    list: "Lista",
  },
  get: {
    title: "Kategorie",
    titleShort: "Kategorie",
    description: "Pobierz kategorie produktów dla firmy lub właściciela.",
    companyId: {
      label: "ID firmy",
      description: "Filtruj kategorie należące do tej firmy",
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
        description: "Zaloguj się, aby wyświetlić kategorie",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do wyświetlenia tych kategorii",
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
        description: "Nie znaleziono kategorii",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Kategorie pobrane",
      description: "Kategorie produktów są wymienione poniżej.",
    },
    response: {
      id: "ID kategorii",
      name: "Nazwa kategorii",
      parentId: "Kategoria nadrzędna",
      sortOrder: "Kolejność sortowania",
      isActive: "Aktywna",
      createdAt: "Utworzono",
      total: "Łącznie",
    },
    widget: {
      addCategory: "Dodaj kategorię",
      active: "Aktywna",
      inactive: "Nieaktywna",
      empty: "Nie znaleziono kategorii. Dodaj pierwszą kategorię.",
      viewProducts: "Pokaż produkty →",
      backToCatalog: "← Produkty",
      back: "Wróć",
    },
  },
};
