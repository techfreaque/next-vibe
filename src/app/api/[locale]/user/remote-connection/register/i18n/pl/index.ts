import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  post: {
    title: "Zarejestruj lokalną instancję",
    description:
      "Wywoływane przez lokalną instancję podczas łączenia, aby zarejestrować się w chmurze",
    instanceId: {
      label: "ID instancji",
      description: "Unikalny identyfikator lokalnej instancji",
      placeholder: "hermes",
      validation: {
        invalid: "Używaj tylko małych liter, cyfr i myślników",
      },
    },
    localUrl: {
      label: "Lokalny URL",
      description: "Adres URL aplikacji lokalnej instancji",
      placeholder: "http://localhost:3000",
      validation: {
        required: "Proszę podać lokalny URL",
        invalid: "Proszę podać prawidłowy URL",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Proszę sprawdzić dane i spróbować ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany, aby zarejestrować instancję",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do rejestracji instancji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas rejestracji instancji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "ID instancji już zarejestrowane",
        description:
          "Instancja z tym ID jest już zarejestrowana dla twojego konta. Wybierz inny ID instancji.",
      },
    },
    success: {
      title: "Instancja zarejestrowana",
      description: "Lokalna instancja została pomyślnie zarejestrowana",
    },
  },
};
