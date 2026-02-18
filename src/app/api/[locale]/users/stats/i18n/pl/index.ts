import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Statystyki użytkowników",
  description: "Kompleksowe analizy i statystyki użytkowników",
  category: "Użytkownicy",
  tag: "Statystyki",
  container: {
    title: "Panel statystyk użytkowników",
    description: "Wyświetl kompleksowe analizy i statystyki użytkowników",
  },
  actions: {
    refresh: "Odśwież",
    refreshing: "Odświeżanie...",
  },
  basicFilters: {
    title: "Podstawowe filtry",
    description: "Filtruj użytkowników według statusu i roli",
  },
  subscriptionFilters: {
    title: "Filtry subskrypcji",
    description: "Filtruj według subskrypcji i płatności",
  },
  locationFilters: {
    title: "Filtry lokalizacji",
    description: "Filtruj według kraju i języka",
  },
  timePeriodOptions: {
    title: "Opcje okresu czasu",
    description: "Skonfiguruj okres czasu i ustawienia wykresów",
  },
  sections: {
    filterOptions: {
      title: "Opcje filtrów",
      description: "Skonfiguruj filtry dla statystyk użytkowników",
    },
  },
  fields: {
    status: {
      label: "Filtr statusu",
      description: "Filtruj statystyki według statusu użytkownika",
    },
    role: {
      label: "Filtr ról",
      description: "Filtruj statystyki według roli użytkownika",
    },
    country: {
      label: "Filtr kraju",
      description: "Filtruj statystyki według kraju",
      placeholder: "Wybierz kraj...",
    },
    language: {
      label: "Filtr języka",
      description: "Filtruj statystyki według języka",
      placeholder: "Wybierz język...",
    },
    search: {
      label: "Wyszukaj",
      description: "Wyszukaj użytkowników do statystyk",
      placeholder: "Wprowadź wyszukiwany termin...",
    },
    chartType: {
      label: "Typ wykresu",
      description: "Wybierz typ wykresu do wyświetlenia",
    },
    dateRangePreset: {
      label: "Szablon zakresu dat",
      description: "Wybierz predefiniowany zakres dat",
    },
    includeComparison: {
      label: "Uwzględnij porównanie",
      description: "Uwzględnij porównanie z poprzednim okresem",
    },
    timePeriod: {
      label: "Okres czasu",
      description: "Wybierz okres czasu dla statystyk",
    },
    subscriptionStatus: {
      label: "Status subskrypcji",
      description: "Filtruj według statusu subskrypcji",
    },
    paymentMethod: {
      label: "Metoda płatności",
      description: "Filtruj według metody płatności",
    },
  },
  response: {
    overviewStats: {
      title: "Statystyki przeglądowe",
      description: "Przegląd ogólnych statystyk użytkowników",
      totalUsers: {
        label: "Łącznie użytkowników",
      },
      activeUsers: {
        label: "Aktywni użytkownicy",
      },
      inactiveUsers: {
        label: "Nieaktywni użytkownicy",
      },
      newUsers: {
        label: "Nowi użytkownicy",
      },
    },
    emailStats: {
      title: "Statystyki e-mail",
      description: "Statystyki weryfikacji e-mail użytkowników",
      emailVerifiedUsers: {
        label: "Zweryfikowane e-maile",
      },
      emailUnverifiedUsers: {
        label: "Niezweryfikowane e-maile",
      },
      verificationRate: {
        label: "Wskaźnik weryfikacji",
      },
    },
    profileStats: {
      title: "Statystyki profili",
      description: "Statystyki kompletności profili użytkowników",
      complete: {
        title: "Kompletność profilu",
        description: "Szczegółowe metryki kompletności profilu",
        usersWithPhone: {
          content: "Użytkownicy z numerem telefonu",
        },
        usersWithBio: {
          content: "Użytkownicy z biografią",
        },
        usersWithWebsite: {
          content: "Użytkownicy ze stroną internetową",
        },
        usersWithJobTitle: {
          content: "Użytkownicy ze stanowiskiem",
        },
        usersWithImage: {
          content: "Użytkownicy ze zdjęciem profilowym",
        },
        completionRate: {
          content: "Wskaźnik kompletności profilu",
        },
      },
    },
    subscriptionStats: {
      title: "Statystyki subskrypcji",
      description: "Statystyki dystrybucji subskrypcji użytkowników",
      activeSubscriptions: {
        label: "Aktywne",
      },
      canceledSubscriptions: {
        label: "Anulowane",
      },
      expiredSubscriptions: {
        label: "Wygasłe",
      },
      noSubscription: {
        label: "Brak subskrypcji",
      },
      subscriptionChart: {
        label: "Dystrybucja subskrypcji",
        description: "Wizualny podział statusów subskrypcji",
      },
    },
    paymentStats: {
      title: "Statystyki płatności",
      description: "Statystyki przychodów i transakcji",
      totalRevenue: {
        label: "Całkowity przychód",
      },
      transactionCount: {
        label: "Transakcje",
      },
      averageOrderValue: {
        label: "Śr. wart. zamówienia",
      },
      refundRate: {
        label: "Wskaźnik zwrotów",
      },
    },
    roleStats: {
      title: "Statystyki ról",
      description: "Statystyki dystrybucji ról użytkowników",
      publicUsers: {
        label: "Publiczni",
      },
      customerUsers: {
        label: "Klienci",
      },
      partnerAdminUsers: {
        label: "Admini partnerów",
      },
      partnerEmployeeUsers: {
        label: "Personel partnerów",
      },
      adminUsers: {
        label: "Admini",
      },
      roleChart: {
        label: "Dystrybucja ról",
        description: "Wizualny podział użytkowników według roli",
      },
    },
    timeStats: {
      title: "Statystyki czasowe",
      description: "Statystyki tworzenia użytkowników i wzrostu w czasie",
      usersCreatedToday: {
        label: "Dzisiaj",
      },
      usersCreatedThisWeek: {
        label: "Ten tydzień",
      },
      usersCreatedThisMonth: {
        label: "Ten miesiąc",
      },
      usersCreatedLastMonth: {
        label: "Zeszły miesiąc",
      },
      growthRate: {
        label: "Wskaźnik wzrostu",
      },
    },
    companyStats: {
      title: "Statystyki firm",
      description: "Statystyki użytkowników związane z firmami",
      uniqueCompanies: {
        content: "Unikalne firmy",
      },
    },
    // Keep the flat structure for backward compatibility
    totalUsers: {
      content: "Łączna liczba użytkowników",
    },
    activeUsers: {
      content: "Aktywni użytkownicy",
    },
    inactiveUsers: {
      content: "Nieaktywni użytkownicy",
    },
    newUsers: {
      content: "Nowi użytkownicy",
    },
    emailVerifiedUsers: {
      content: "Użytkownicy z weryfikowanym e-mailem",
    },
    emailUnverifiedUsers: {
      content: "Użytkownicy z nieweryfikowanym e-mailem",
    },
    verificationRate: {
      content: "Wskaźnik weryfikacji e-mail",
    },
    usersWithPhone: {
      content: "Użytkownicy z numerem telefonu",
    },
    usersWithBio: {
      content: "Użytkownicy z biografią",
    },
    usersWithWebsite: {
      content: "Użytkownicy ze stroną internetową",
    },
    usersWithJobTitle: {
      content: "Użytkownicy ze stanowiskiem pracy",
    },
    usersWithImage: {
      content: "Użytkownicy ze zdjęciem profilowym",
    },
    usersWithStripeId: {
      content: "Użytkownicy z identyfikatorem Stripe",
    },
    usersWithoutStripeId: {
      content: "Użytkownicy bez identyfikatora Stripe",
    },
    stripeIntegrationRate: {
      content: "Wskaźnik integracji ze Stripe",
    },
    usersWithLeadId: {
      content: "Użytkownicy z identyfikatorem leada",
    },
    usersWithoutLeadId: {
      content: "Użytkownicy bez identyfikatora leada",
    },
    leadAssociationRate: {
      content: "Wskaźnik powiązania z leadami",
    },
    publicUsers: {
      content: "Użytkownicy publiczni",
    },
    customerUsers: {
      content: "Użytkownicy-klienci",
    },
    partnerAdminUsers: {
      content: "Administratorzy partnerów",
    },
    partnerEmployeeUsers: {
      content: "Pracownicy partnerów",
    },
    adminUsers: {
      content: "Administratorzy",
    },
    uniqueCompanies: {
      content: "Unikalne firmy",
    },
    usersCreatedToday: {
      content: "Użytkownicy utworzeni dzisiaj",
    },
    usersCreatedThisWeek: {
      content: "Użytkownicy utworzeni w tym tygodniu",
    },
    usersCreatedThisMonth: {
      content: "Użytkownicy utworzeni w tym miesiącu",
    },
    usersCreatedLastMonth: {
      content: "Użytkownicy utworzeni w zeszłym miesiącu",
    },
    growthRate: {
      content: "Wskaźnik wzrostu",
    },
    leadToUserConversionRate: {
      content: "Wskaźnik konwersji lead-użytkownik",
    },
    retentionRate: {
      content: "Wskaźnik retencji użytkowników",
    },
    generatedAt: {
      content: "Statystyki wygenerowane o",
    },
    growthMetrics: {
      title: "Metryki wzrostu",
      description: "Metryki wzrostu i konwersji użytkowników",
      growthChart: {
        label: "Wzrost użytkowników w czasie",
        description: "Wizualna reprezentacja trendów tworzenia użytkowników",
      },
    },
    performanceRates: {
      title: "Wskaźniki wydajności",
      description: "Metryki wydajności i konwersji użytkowników",
      growthRate: {
        label: "Wskaźnik wzrostu",
      },
      leadToUserConversionRate: {
        label: "Konwersja leadów",
      },
      retentionRate: {
        label: "Wskaźnik retencji",
      },
    },
    businessInsights: {
      title: "Wgląd biznesowy",
      description: "Business intelligence i analityka",
      uniqueCompanies: {
        label: "Unikalne firmy",
      },
      generatedAt: {
        label: "Wygenerowano",
      },
    },
  },
  errors: {
    validation: {
      title: "Walidacja nie powiodła się",
      description: "Podano nieprawidłowe parametry statystyk",
    },
    unauthorized: {
      title: "Nieautoryzowany dostęp",
      description: "Musisz być zalogowany, aby wyświetlić statystyki",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Nie masz uprawnień do wyświetlania statystyk",
    },
    notFound: {
      title: "Statystyki nie zostały znalezione",
      description: "Żądane statystyki nie mogły zostać znalezione",
    },
    conflict: {
      title: "Błąd konfliktu",
      description:
        "Nie można wygenerować statystyk z powodu istniejących konfliktów",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie można połączyć się z serwerem",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które zostaną utracone",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie można wygenerować statystyk z powodu błędu serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd podczas generowania statystyk",
    },
  },
  enums: {
    subscriptionStatusFilter: {
      all: "Wszystkie",
      active: "Aktywne",
      trialing: "Okres próbny",
      pastDue: "Zaległy",
      canceled: "Anulowane",
      unpaid: "Niezapłacone",
      paused: "Wznowione",
      noSubscription: "Brak subskrypcji",
    },
    paymentMethodFilter: {
      all: "Wszystkie",
      card: "Karta",
      bankTransfer: "Transfer bankowy",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "Polecenie zapłaty SEPA",
      crypto: "Kryptowaluta",
      noPaymentMethod: "Brak metody płatności",
    },
  },
  success: {
    title: "Statystyki zostały wygenerowane pomyślnie",
    description: "Statystyki użytkowników zostały wygenerowane pomyślnie",
  },
  widget: {
    headerTitle: "Statystyki u\u017cytkownik\u00f3w",
    refresh: "Od\u015bwie\u017c",
    labelTotalUsers: "\u0141\u0105cznie u\u017cytkownik\u00f3w",
    labelActiveUsers: "Aktywni u\u017cytkownicy",
    labelNewToday: "Nowi dzi\u015b",
    labelNewThisWeek: "Nowi w tym tygodniu",
    labelNewThisMonth: "Nowi w tym miesi\u0105cu",
    labelTotalRevenue: "Ca\u0142kowity prych\u00f3d",
    labelAvgRevenuePerUser: "\u015aredn. prych\u00f3d / u\u017cytkownik",
    labelEmailVerified: "E-mail zweryfikowany",
    labelVerificationRate: "Wska\u017anik weryfikacji",
    labelEmailUnverified: "E-mail niezweryfikowany",
    labelGrowthRate: "Wska\u017anik wzrostu",
    labelLeadUserCvr: "Lead \u2192 Konwersja u\u017cytkownik\u00f3w",
    labelRetentionRate: "Wska\u017anik retencji",
    chartByRole: "Wed\u0142ug roli",
    chartBySubscriptionStatus: "Wed\u0142ug statusu subskrypcji",
    chartGrowthOverTime: "Wzrost w czasie",
    recentSignupsSummary: "Podsumowanie ostatnich rejestracji",
    rowToday: "Dzi\u015b",
    rowThisWeek: "Ten tydzie\u0144",
    rowThisMonth: "Ten miesi\u0105c",
    rowLastMonth: "Zesz\u0142y miesi\u0105c",
    generatedAt: "Wygenerowano:",
  },
};
