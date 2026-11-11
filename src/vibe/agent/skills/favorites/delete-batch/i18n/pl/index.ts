import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Ulubione",
  },
  post: {
    title: "Usuń ulubione",
    titleShort: "Usuń",
    description: "Usuń kilka ulubionych za jednym razem",
    ids: {
      label: "Identyfikatory ulubionych",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź, co usuwasz, i spróbuj ponownie",
      },
      network: {
        title: "Błąd połączenia",
        description: "Nie udało się usunąć ulubionych. Spróbuj ponownie",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby usunąć swoje ulubione",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do usunięcia tych ulubionych",
      },
      notFound: {
        title: "Nie znaleziono ulubionych",
        description: "Nie mogliśmy znaleźć ulubionych do usunięcia",
      },
      server: {
        title: "Coś poszło nie tak",
        description: "Nie udało się usunąć ulubionych. Spróbuj ponownie",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Twoje zmiany nie zostały jeszcze zapisane",
      },
      conflict: {
        title: "Konflikt usuwania",
        description:
          "Te ulubione się zmieniły. Odśwież stronę i spróbuj ponownie",
      },
    },
    success: {
      title: "Ulubione usunięte",
      description: "Wybrane ulubione zostały usunięte",
    },
  },
};
