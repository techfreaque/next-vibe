import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  tags: {
    user: "Użytkownik",
    view: "Zobacz",
  },

  badge: "Szczegóły użytkownika",
  get: {
    title: "Zobacz użytkownika",
    description: "Zobacz szczegółowe informacje o użytkowniku",
    userId: {
      label: "ID użytkownika",
    },
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
  empty: "Nie znaleziono danych użytkownika",
  sections: {
    basicInfo: "Podstawowe informacje",
    chatActivity: "Aktywność czatu",
    credits: "Kredyty",
    payments: "Płatności",
    newsletter: "Newsletter",
    referrals: "Polecenia",
    recentActivity: "Ostatnia aktywność",
  },
  status: {
    active: "Aktywny",
    banned: "Zablokowany",
    inactive: "Nieaktywny",
    verified: "Zweryfikowany",
  },
  fields: {
    userId: "ID użytkownika",
    locale: "Język",
    twoFactor: "Weryfikacja dwuetapowa",
    enabled: "Włączone",
    disabled: "Wyłączone",
    marketing: "Marketing",
    optedIn: "Zgoda",
    optedOut: "Rezygnacja",
    created: "Utworzono",
    lastUpdated: "Ostatnia aktualizacja",
    banReason: "Powód blokady",
    roles: "Role",
  },
  credits: {
    currentBalance: "Aktualny stan",
    availableCredits: "Dostępne kredyty",
    packBreakdown: "Podział pakietów kredytów",
    subscription: "Subskrypcja",
    permanent: "Stałe",
    bonus: "Bonus",
    earned: "Zarobione",
    expires: "Wygasa",
  },
  payment: {
    stripeCustomerId: "ID klienta Stripe",
    activeSubscription: "Aktywna subskrypcja",
  },
  common: {
    yes: "Tak",
    no: "Nie",
  },
  newsletter: {
    status: "Status",
    subscribed: "Zapisany",
    notSubscribed: "Niezapisany",
    subscribedAt: "Zapisano dnia",
    confirmedAt: "Potwierdzono dnia",
    lastEmailSent: "Ostatni e-mail wysłany",
  },
  referrals: {
    totalReferrals: "Polecenia łącznie",
    activeCodes: "Aktywne kody",
    revenue: "Przychód",
    earnings: "Zarobki",
  },
  activity: {
    lastLogin: "Ostatnie logowanie",
    lastThread: "Ostatni wątek",
    lastMessage: "Ostatnia wiadomość",
    lastPayment: "Ostatnia płatność",
  },
  tabs: {
    overview: "Przegląd",
    credits: "Kredyty",
    referrals: "Polecenia",
    earnings: "Zarobki",
  },
  modelUsage: {
    title: "Użycie modeli",
    model: "Model",
    spent: "Wydane kredyty",
    messages: "Wiadomości",
    noUsage: "Brak danych o użyciu modeli",
  },
  ban: {
    banUser: "Zablokuj użytkownika",
    unbanUser: "Odblokuj użytkownika",
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
