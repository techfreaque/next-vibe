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
  },
  response: {
    overviewStats: {
      title: "Statystyki przeglądowe",
      description: "Przegląd ogólnych statystyk użytkowników",
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
    },
    emailStats: {
      title: "Statystyki e-mail",
      description: "Statystyki weryfikacji e-mail użytkowników",
      emailVerifiedUsers: {
        content: "Użytkownicy z weryfikowanym e-mailem",
      },
      emailUnverifiedUsers: {
        content: "Użytkownicy z nieweryfikowanym e-mailem",
      },
      verificationRate: {
        content: "Wskaźnik weryfikacji e-mail",
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
    integrationStats: {
      title: "Statystyki integracji",
      description: "Statystyki integracji z zewnętrznymi serwisami",
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
    },
    roleStats: {
      title: "Statystyki ról",
      description: "Statystyki dystrybucji ról użytkowników",
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
    },
    timeStats: {
      title: "Statystyki czasowe",
      description: "Statystyki tworzenia użytkowników i wzrostu w czasie",
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
    },
    performanceRates: {
      title: "Wskaźniki wydajności",
      description: "Metryki wydajności i konwersji użytkowników",
      growthRate: {
        content: "Wskaźnik wzrostu",
      },
      leadToUserConversionRate: {
        content: "Wskaźnik konwersji lead-użytkownik",
      },
      retentionRate: {
        content: "Wskaźnik zatrzymania użytkowników",
      },
    },
    businessInsights: {
      title: "Wgląd biznesowy",
      description: "Business intelligence i analityka",
      uniqueCompanies: {
        content: "Unikalne firmy",
      },
      generatedAt: {
        content: "Statystyki wygenerowane o",
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
  success: {
    title: "Statystyki zostały wygenerowane pomyślnie",
    description: "Statystyki użytkowników zostały wygenerowane pomyślnie",
  },
};
