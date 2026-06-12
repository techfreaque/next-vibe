import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    catalog: "Katalog",
    deactivate: "Dezaktywuj",
  },
  post: {
    title: "Dezaktywuj produkt",
    titleShort: "Dezaktywuj",
    description:
      "Oznacz produkt z katalogu jako nieaktywny. Dane produktu zostają zachowane.",
    productId: {
      label: "ID produktu",
      description: "ID produktu do dezaktywacji",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź ID produktu i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby dezaktywować produkt",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do dezaktywacji tego produktu",
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
      title: "Produkt dezaktywowany",
      description: "Produkt został usunięty z aktywnego katalogu.",
    },
    response: {
      id: "ID produktu",
      isActive: "Status aktywności",
    },
    widget: {
      backToList: "Powrót do produktów",
      back: "Wróć",
      warning:
        "Produkt zostanie dezaktywowany i usunięty z aktywnego katalogu. Dane zostaną zachowane.",
    },
  },
};
