import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Ulubione",
  },
  post: {
    title: "Zmień kolejność ulubionych",
    description: "Zaktualizuj kolejność swoich ulubionych konfiguracji",
    positions: {
      label: "Pozycje",
    },
    errors: {
      validation: {
        title: "Nieprawidłowa kolejność",
        description: "Sprawdź ustawienia i spróbuj ponownie",
      },
      network: {
        title: "Błąd połączenia",
        description: "Nie udało się zapisać nowej kolejności. Spróbuj ponownie",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby zmienić kolejność ulubionych",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do zmiany kolejności ulubionych",
      },
      notFound: {
        title: "Nie znaleziono ulubionych",
        description: "Nie mogliśmy znaleźć Twoich ulubionych",
      },
      server: {
        title: "Coś poszło nie tak",
        description: "Nie udało się zapisać nowej kolejności. Spróbuj ponownie",
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
        title: "Konflikt kolejności",
        description:
          "Kolejność się zmieniła. Odśwież stronę i spróbuj ponownie",
      },
    },
    success: {
      title: "Kolejność zapisana",
      description: "Twoje ulubione zostały pomyślnie uporządkowane",
    },
  },
};
