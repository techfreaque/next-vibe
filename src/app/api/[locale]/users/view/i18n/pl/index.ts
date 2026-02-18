import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  badge: "Szczegóły użytkownika",
  get: {
    title: "Zobacz użytkownika",
    description: "Zobacz szczegółowe informacje o użytkowniku",
  },
  errors: {
    validation: {
      title: "Nieprawidłowe żądanie",
      description: "Sprawdź ID użytkownika i spróbuj ponownie",
    },
    network: {
      title: "Błąd połączenia",
      description: "Sprawdź połączenie internetowe",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby zobaczyć szczegóły użytkownika",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Nie masz uprawnień do przeglądania tego użytkownika",
    },
    notFound: {
      title: "Nie znaleziono użytkownika",
      description: "Nie mogliśmy znaleźć tego użytkownika",
    },
    serverError: {
      title: "Coś poszło nie tak",
      description:
        "Nie udało się załadować szczegółów użytkownika. Spróbuj ponownie",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz zmiany, które nie zostały zapisane",
    },
    conflict: {
      title: "Konflikt danych",
      description:
        "Dane użytkownika się zmieniły. Odśwież stronę i spróbuj ponownie",
    },
  },
  success: {
    title: "Użytkownik załadowany",
    description: "Szczegóły użytkownika załadowane pomyślnie",
  },
  widget: {
    actions: {
      edit: "Edytuj",
      delete: "Usuń",
      viewCreditHistory: "Historia kredytów",
      viewSubscription: "Subskrypcja",
      viewReferralCodes: "Kody polecające",
      viewReferralEarnings: "Zarobki z poleceń",
      addCredits: "Dodaj kredyty",
      viewLead: "Zobacz lead",
      copyUserId: "Kopiuj ID użytkownika",
      copied: "Skopiowano!",
    },
    sections: {
      quickActions: "Szybkie akcje",
    },
    stats: {
      totalThreads: "Wątki łącznie",
      totalMessages: "Wiadomości łącznie",
      userMessages: "Wiadomości użytkownika",
      lastActivity: "Ostatnia aktywność",
      never: "Nigdy",
      freeCredits: "Darmowe kredyty",
      freePeriod: "Okres",
      totalSpent: "Łącznie wydano",
      totalPurchased: "Łącznie zakupiono",
      totalRevenue: "Łączny przychód",
      payments: "płatności",
      successful: "Udane",
      failed: "Nieudane",
      totalRefunds: "Zwroty łącznie",
      lastPayment: "Ostatnia płatność",
    },
  },
};
