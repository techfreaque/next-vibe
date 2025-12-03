import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  post: {
    title: "Kup kredyty",
    description: "Utwórz sesję płatności Stripe dla zakupu pakietu kredytów",
    container: {
      title: "Kup kredyty",
      description: "Kup pakiety kredytów do korzystania z funkcji AI",
    },
    quantity: {
      label: "Ilość",
      description: "Liczba pakietów kredytów do zakupu (1-10)",
      placeholder: "Wprowadź ilość (1-10)",
    },
    provider: {
      label: "Dostawca płatności",
      description: "Wybierz sposób płatności",
      placeholder: "Wybierz dostawcę płatności",
    },
    checkoutUrl: {
      content: "URL płatności",
    },
    sessionId: {
      content: "ID sesji",
    },
    totalAmount: {
      content: "Kwota całkowita (centy)",
    },
    totalCredits: {
      content: "Całkowita liczba kredytów",
    },
    success: {
      title: "Płatność utworzona",
      description: "Sesja płatności Stripe została pomyślnie utworzona",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowa ilość zakupu",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby kupić kredyty",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do zakupu kredytów",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się utworzyć sesji płatności",
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
        title: "Konflikt",
        description: "Wystąpił konflikt zasobów",
      },
      noActiveSubscription: {
        title: "Wymagana aktywna subskrypcja",
        description:
          "Musisz mieć aktywną subskrypcję, aby kupić pakiety kredytów",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "Nie znaleziono użytkownika",
      description: "Nie można znaleźć konta użytkownika",
    },
    checkoutFailed: {
      title: "Płatność nie powiodła się",
      description: "Nie udało się utworzyć sesji płatności dla zakupu kredytów",
    },
  },
};
