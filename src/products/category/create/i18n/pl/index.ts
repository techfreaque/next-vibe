import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    category: "Kategoria",
    create: "Utwórz",
  },
  post: {
    title: "Utwórz kategorię produktu",
    titleShort: "Utwórz kategorię",
    description: "Dodaj kategorię do organizowania produktów w katalogu.",
    name: {
      label: "Nazwa kategorii",
      description: "Nazwa kategorii produktu",
      placeholder: "Usługi projektowe",
    },
    companyId: {
      label: "Firma",
      description: "Przypisz tę kategorię do firmy",
    },
    parentId: {
      label: "Kategoria nadrzędna",
      description:
        "Opcjonalna kategoria nadrzędna dla hierarchicznej organizacji",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description:
        "Kolejność wyświetlania — niższe liczby pojawiają się pierwsze",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź pola formularza i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby utworzyć kategorię",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do tworzenia tej kategorii",
      },
      conflict: {
        title: "Już istnieje",
        description: "Kategoria o tej nazwie już istnieje",
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
      title: "Kategoria utworzona",
      description: "Twoja kategoria produktu jest gotowa.",
    },
    response: {
      id: "ID kategorii",
      name: "Nazwa kategorii",
    },
    widget: {
      backToList: "Powrót do kategorii",
      back: "Wróć",
    },
  },
};
