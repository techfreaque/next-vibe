import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  tags: {
    create: "Utwórz",
    admin: "Administrator",
    user: "Użytkownik",
    view: "Zobacz",
    stats: "Statystyki",
  },
  create: {
    category: "Użytkownicy",
    tags: {
      create: "Utwórz",
      admin: "Administrator",
    },
    post: {
      title: "Utwórz użytkownika",
      description: "Utwórz nowe konto użytkownika",
      form: {
        title: "Formularz tworzenia użytkownika",
        description: "Wypełnij szczegóły, aby utworzyć nowego użytkownika",
      },
      email: {
        label: "Adres e-mail",
        description: "Adres e-mail użytkownika do logowania i komunikacji",
      },
      password: {
        label: "Hasło",
        description: "Bezpieczne hasło dla konta użytkownika",
      },
      privateName: {
        label: "Nazwa prywatna",
        description:
          "Pełne imię i nazwisko użytkownika (widoczne tylko dla administratorów)",
      },
      publicName: {
        label: "Nazwa publiczna",
        description:
          "Nazwa wyświetlana użytkownika (widoczna dla wszystkich użytkowników)",
      },
      firstName: {
        label: "Imię",
        description: "Imię użytkownika",
      },
      lastName: {
        label: "Nazwisko",
        description: "Nazwisko użytkownika",
      },
      company: {
        label: "Firma",
        description: "Firma lub organizacja użytkownika",
      },
      phone: {
        label: "Numer telefonu",
        description: "Numer telefonu kontaktowego użytkownika",
      },
      preferredContactMethod: {
        label: "Preferowana metoda kontaktu",
        description: "Jak użytkownik woli być kontaktowany",
      },
      roles: {
        label: "Role użytkownika",
        description: "Przypisz role użytkownikowi",
      },
      imageUrl: {
        label: "URL zdjęcia profilowego",
        description: "URL do zdjęcia profilowego użytkownika",
      },
      bio: {
        label: "Biografia",
        description: "Krótki opis użytkownika",
      },
      website: {
        label: "Strona internetowa",
        description: "Osobista lub firmowa strona internetowa użytkownika",
      },
      jobTitle: {
        label: "Stanowisko",
        description: "Stanowisko lub pozycja użytkownika",
      },
      emailVerified: {
        label: "E-mail zweryfikowany",
        description: "Czy e-mail użytkownika jest zweryfikowany",
      },
      isActive: {
        label: "Status aktywności",
        description: "Czy konto użytkownika jest aktywne",
      },
      leadId: {
        label: "ID leada",
        description: "Powiązany identyfikator leada",
      },
      country: {
        label: "Kraj",
        description: "Kraj zamieszkania użytkownika",
      },
      language: {
        label: "Język",
        description: "Preferowany język użytkownika",
      },
      response: {
        title: "Użytkownik utworzony",
        description: "Szczegóły nowo utworzonego użytkownika",
        id: {
          content: "ID użytkownika",
        },
        leadId: {
          content: "Powiązane ID leada",
        },
        country: {
          label: "Kraj",
          description: "Kraj zamieszkania użytkownika",
        },
        language: {
          label: "Język",
          description: "Preferowany język użytkownika",
        },
        email: {
          content: "Adres e-mail",
        },
        privateName: {
          content: "Nazwa prywatna",
        },
        publicName: {
          content: "Nazwa publiczna",
        },
        firstName: {
          content: "Imię",
        },
        lastName: {
          content: "Nazwisko",
        },
        company: {
          content: "Firma",
        },
        phone: {
          content: "Numer telefonu",
        },
        preferredContactMethod: {
          content: "Preferowana metoda kontaktu",
        },
        imageUrl: {
          content: "Zdjęcie profilowe",
        },
        bio: {
          content: "Biografia",
        },
        website: {
          content: "Strona internetowa",
        },
        jobTitle: {
          content: "Stanowisko",
        },
        emailVerified: {
          content: "E-mail zweryfikowany",
        },
        isActive: {
          content: "Status aktywności",
        },
        stripeCustomerId: {
          content: "ID klienta Stripe",
        },
        userRoles: {
          content: "Role użytkownika",
          id: {
            content: "ID roli",
          },
          role: {
            content: "Rola",
          },
        },
        createdAt: {
          content: "Utworzono",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak dostępu",
          description: "Musisz być zalogowany, aby tworzyć użytkowników",
        },
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Sprawdź dane formularza i spróbuj ponownie",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można utworzyć użytkownika z powodu błędu serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description:
            "Wystąpił nieoczekiwany błąd podczas tworzenia użytkownika",
        },
        network: {
          title: "Błąd sieci",
          description:
            "Połączenie sieciowe nie powiodło się podczas tworzenia użytkownika",
        },
        forbidden: {
          title: "Dostęp zabroniony",
          description: "Nie masz uprawnień do tworzenia użytkowników",
        },
        notFound: {
          title: "Zasób nie znaleziony",
          description:
            "Wymagany zasób do tworzenia użytkownika nie został znaleziony",
        },
        conflict: {
          title: "Użytkownik już istnieje",
          description: "Użytkownik z tym adresem e-mail już istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany, które zostaną utracone",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Wystąpił błąd wewnętrzny podczas tworzenia użytkownika",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "SMS powitalny nie powiódł się",
            description:
              "Nie udało się wysłać SMS-a powitalnego do użytkownika",
          },
          verification_failed: {
            title: "SMS weryfikacyjny nie powiódł się",
            description:
              "Nie udało się wysłać SMS-a weryfikacyjnego do użytkownika",
          },
        },
      },
      success: {
        title: "Użytkownik utworzony pomyślnie",
        description: "Nowe konto użytkownika zostało utworzone",
        message: {
          content: "Użytkownik utworzony pomyślnie",
        },
        created: {
          content: "Utworzony",
        },
      },
    },
    widget: {
      headerCreated: "Użytkownik utworzony",
      headerCreate: "Utwórz użytkownika",
      headerSubtitle: "Utwórz nowe konto administratora lub klienta",
      activeBadge: "Aktywny",
      verifiedBadge: "Zweryfikowany",
      copiedTooltip: "Skopiowano!",
      copyUserIdTooltip: "Kopiuj ID użytkownika",
      copyIdButton: "Kopiuj ID",
      copiedButton: "Skopiowano!",
      viewUserButton: "Zobacz użytkownika",
      fullProfileButton: "Pełny profil",
      creditHistoryButton: "Historia kredytów",
      createAnotherButton: "Utwórz kolejnego użytkownika",
      createdPrefix: "Utworzony",
    },
    email: {
      users: {
        welcome: {
          greeting: "Witamy na naszej platformie, {{firstName}}!",
          preview: "Twoje konto zostało pomyślnie utworzone",
          subject: "Witamy w {{companyName}} - Twoje konto jest gotowe!",
          introduction:
            "Cześć {{firstName}}, cieszymy się, że jesteś z nami! Twoje konto zostało pomyślnie utworzone i możesz teraz korzystać ze wszystkich naszych funkcji.",
          accountDetails: "Szczegóły konta",
          email: "E-mail",
          name: "Nazwa",
          publicName: "Nazwa wyświetlana",
          company: "Firma",
          phone: "Telefon",
          nextSteps: "Następne kroki",
          loginButton: "Zaloguj się do swojego konta",
          support:
            "Jeśli masz jakieś pytania, nasz zespół wsparcia jest tutaj, aby pomóc. Skontaktuj się z nami w każdej chwili!",
        },
        admin: {
          newUser: "Nowy użytkownik utworzony",
          preview:
            "Nowy użytkownik {{firstName}} {{lastName}} został utworzony",
          subject:
            "Nowe konto użytkownika utworzone - {{firstName}} {{lastName}}",
          notification:
            "Nowe konto użytkownika zostało utworzone w systemie. Oto szczegóły:",
          userDetails: "Szczegóły użytkownika",
          viewUser: "Zobacz profil użytkownika",
        },
        errors: {
          missing_data:
            "Brakuje wymaganych danych użytkownika dla szablonu e-mail",
        },
        error: {
          general: {
            internal_server_error: "Wystąpił wewnętrzny błąd serwera",
          },
        },
        labels: {
          id: "ID:",
          email: "E-mail:",
          name: "Nazwa:",
          privateName: "Pełna nazwa:",
          publicName: "Nazwa wyświetlana:",
          company: "Firma:",
          created: "Utworzono:",
          leadId: "ID leada:",
        },
      },
    },
    sms: {
      welcome: {
        message:
          "Witamy {{firstName}}! Twoje konto zostało pomyślnie utworzone. Odwiedź nas pod adresem {{appUrl}}",
      },
      verification: {
        message:
          "{{firstName}}, Twój kod weryfikacyjny to: {{code}}. Wprowadź kod w ciągu 10 minut.",
      },
      errors: {
        welcome_failed: {
          title: "Nieudane SMS powitalne",
          description: "Nie udało się wysłać SMS powitalnego do użytkownika",
        },
        verification_failed: {
          title: "Nieudane SMS weryfikacyjne",
          description:
            "Nie udało się wysłać SMS weryfikacyjnego do użytkownika",
        },
      },
    },
  },
  list: {
    get: {
      title: "Lista użytkowników",
      description: "Wyszukaj i filtruj użytkowników",
      form: {
        title: "Zarządzanie użytkownikami",
        description: "Zarządzaj i filtruj użytkowników",
      },
      actions: {
        refresh: "Odśwież",
        refreshing: "Odświeżanie...",
      },
      // Search & Filters section
      searchFilters: {
        title: "Wyszukiwanie i filtry",
        description: "Wyszukaj i filtruj użytkowników według kryteriów",
      },
      search: {
        label: "Wyszukaj",
        description: "Wyszukaj użytkowników po nazwie lub e-mailu",
        placeholder: "Wyszukaj użytkowników...",
      },
      status: {
        label: "Status",
        description: "Filtruj użytkowników według statusu",
        placeholder: "Wybierz status...",
      },
      role: {
        label: "Rola",
        description: "Filtruj użytkowników według roli",
        placeholder: "Wybierz rolę...",
      },
      subscription: {
        label: "Subskrypcja",
        description: "Filtruj według statusu subskrypcji",
        placeholder: "Dowolny status subskrypcji",
      },
      creditActivity: {
        label: "Aktywność kredytowa",
        description: "Filtruj według zakupu lub wydatków kredytowych",
        placeholder: "Dowolna aktywność kredytowa",
      },
      threads: {
        label: "Wątki",
        description: "Filtruj według tego, czy użytkownik ma wątki czatu",
        placeholder: "Dowolny status",
      },
      referralActivity: {
        label: "Aktywność referencyjna",
        description:
          "Filtruj według linku, kliknięć, rejestracji lub płacących subskrybentów",
        placeholder: "Dowolna aktywność referencyjna",
      },
      // Sorting section
      sortingOptions: {
        title: "Sortowanie",
        description: "Skonfiguruj sortowanie wyników",
      },
      sortBy: {
        label: "Sortuj według",
        description: "Pole do sortowania",
        placeholder: "Wybierz pole sortowania...",
      },
      sortOrder: {
        label: "Kolejność sortowania",
        description: "Kierunek sortowania",
        placeholder: "Wybierz kolejność sortowania...",
      },
      // Response section
      response: {
        title: "Użytkownicy",
        description: "Lista użytkowników spełniających kryteria",
        users: {
          id: "ID użytkownika",
          email: "E-mail",
          privateName: "Nazwa prywatna",
          publicName: "Nazwa publiczna",
          isActive: "Aktywny",
          emailVerified: "Zweryfikowany",
          createdAt: "Utworzono",
          updatedAt: "Zaktualizowano",
          referralCode: "Użyty kod ref.",
          referredByUserId: "Polecony przez",
          totalReferrals: "Poleceni użytkownicy",
        },
        totalCount: "Łączna liczba użytkowników",
        pageCount: "Łączna liczba stron",
      },
      // Pagination section
      page: {
        label: "Strona",
      },
      limit: {
        label: "Na stronę",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany, aby przeglądać użytkowników",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Podano nieprawidłowe parametry",
        },
        forbidden: {
          title: "Dostęp zabroniony",
          description: "Nie masz uprawnień do przeglądania użytkowników",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można pobrać użytkowników",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        conflict: {
          title: "Błąd konfliktu",
          description: "Nie można wyświetlić użytkowników z powodu konfliktów",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono użytkowników",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Sukces",
        description: "Użytkownicy zostali pomyślnie pobrani",
      },
    },
    // Legacy keys for backward compatibility
    title: "Lista użytkowników",
    description: "Lista i wyszukiwanie użytkowników z filtrowaniem",
    category: "Użytkownicy",
    tag: "Lista",
    container: {
      title: "Lista użytkowników",
      description: "Wyszukaj i filtruj użytkowników",
    },
    response: {
      summary: {
        title: "Podsumowanie użytkowników",
        description: "Statystyki podsumowujące listę użytkowników",
      },
      users: {
        title: "Użytkownicy",
      },
      user: {
        title: "Użytkownik",
        id: "ID użytkownika",
        email: "E-mail",
        privateName: "Nazwa prywatna",
        publicName: "Nazwa publiczna",
        firstName: "Imię",
        lastName: "Nazwisko",
        company: "Firma",
        phone: "Telefon",
        isActive: "Aktywny",
        emailVerified: "E-mail zweryfikowany",
        role: "Rola",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
      total: {
        content: "Łączna liczba użytkowników",
      },
      page: {
        content: "Bieżąca strona",
      },
      limit: {
        content: "Użytkowników na stronę",
      },
      totalPages: {
        content: "Łączna liczba stron",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Dostęp zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobu",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd wewnętrzny podczas listowania użytkowników",
      },
    },
    post: {
      title: "Lista",
      description: "Endpoint listy",
      form: {
        title: "Konfiguracja listy",
        description: "Skonfiguruj parametry listy",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi listy",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
    widget: {
      statusActive: "Aktywny",
      statusInactive: "Nieaktywny",
      statusUnverified: "Niezweryfikowany",
      joined: "Do\u0142\u0105czy\u0142",
      creditHistory: "Historia kredyt\u00f3w",
      view: "Podgl\u0105d",
      edit: "Edytuj",
      delete: "Usu\u0144",
      stats: "Statystyki",
      graphs: "Wykresy",
      newUser: "Nowy u\u017cytkownik",
      searchPlaceholder: "Szukaj po nazwie lub e-mailu\u2026 (Ctrl+F)",
      roleFilterLabel: "Rola",
      sortLabel: "Sortuj:",
      clearFilters: "Wyczy\u015b\u0107 filtry",
      noUsersMatchFilters:
        "Brak u\u017cytkownik\u00f3w pasuj\u0105cych do filtr\u00f3w.",
      noUsersFound: "Nie znaleziono u\u017cytkownik\u00f3w.",
      userStatistics: "Statystyki u\u017cytkownik\u00f3w",
      refresh: "Od\u015bwie\u017c",
      roleAll: "Wszyscy",
      roleAdmin: "Administrator",
      roleCustomer: "Klient",
      rolePartnerAdmin: "Administrator Partnera",
      rolePartnerEmployee: "Pracownik Partnera",
      statusAll: "Wszystkie",
      sortNewest: "Najnowsze",
      sortOldest: "Najstarsze",
      sortNameAZ: "Nazwa A-Z",
      sortNameZA: "Nazwa Z-A",
      sortEmailAZ: "E-mail A-Z",
      of: "z",
      usersShown: "użytkowników wyświetlono",
      paginationPage: "Strona",
      paginationOf: "z",
      paginationSeparator: "·",
      paginationUsers: "użytkowników",
    },
    enums: {
      userSortField: {
        createdAt: "Data utworzenia",
        updatedAt: "Data aktualizacji",
        email: "E-mail",
        privateName: "Nazwa prywatna",
        publicName: "Nazwa publiczna",
        firstName: "Imię",
        lastName: "Nazwisko",
        company: "Firma",
        lastLogin: "Ostatnie logowanie",
      },
      sortOrder: {
        asc: "Rosnąco",
        desc: "Malejąco",
      },
      userStatusFilter: {
        all: "Wszystkie",
        active: "Aktywny",
        inactive: "Nieaktywny",
        pending: "Oczekujący",
        suspended: "Zawieszony",
        emailVerified: "E-mail zweryfikowany",
        emailUnverified: "E-mail niezweryfikowany",
      },
      userStatus: {
        active: "Aktywny",
        inactive: "Nieaktywny",
        pending: "Oczekujący",
        suspended: "Zawieszony",
      },
      userRoleFilter: {
        all: "Wszystkie",
        user: "Użytkownik",
        public: "Publiczny",
        customer: "Klient",
        moderator: "Moderator",
        partnerAdmin: "Administrator Partnera",
        partnerEmployee: "Pracownik Partnera",
        admin: "Administrator",
        superAdmin: "Super Administrator",
      },
      subscriptionPresenceFilter: {
        any: "Dowolny",
        hasActive: "Ma aktywną subskrypcję",
        hadAny: "Miał subskrypcję (kiedykolwiek)",
        never: "Nigdy nie subskrybował",
      },
      creditActivityFilter: {
        any: "Dowolna",
        boughtPack: "Kupił pakiet kredytów",
        spentCredits: "Wydał kredyty",
        neverSpent: "Nigdy nie wydał kredytów",
      },
      threadsFilter: {
        any: "Dowolny",
        hasThreads: "Ma wątki",
        noThreads: "Brak wątków",
      },
      referralActivityFilter: {
        any: "Dowolna",
        hasCode: "Ma link referencyjny",
        hasClicks: "Ma kliknięcia referecyjne",
        hasSignups: "Ma rejestracje referencyjne",
        hasSubscribers: "Ma płacących poleconych",
      },
    },
  },
  stats: {
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
        description:
          "Wystąpił nieoczekiwany błąd podczas generowania statystyk",
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
      filters: "Filtry",
      filtersTitle: "Opcje filtrowania",
      applyFilters: "Zastosuj filtry",
      viewUsers: "Zobacz użytkowników",
      createUser: "Utwórz użytkownika",
    },
  },
  user: {
    category: "Użytkownicy",
    tag: "Zarządzanie użytkownikami",
    errors: {
      not_found: {
        title: "Użytkownik nie znaleziony",
        description: "Żądany użytkownik nie mógł zostać znaleziony",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description:
          "Wystąpił błąd wewnętrzny podczas przetwarzania żądania użytkownika",
      },
    },
    id: {
      category: "Użytkownicy",
      tag: "Zarządzanie użytkownikami",

      id: {
        roles: {
          post: {
            title: "Dodaj rolę użytkownika",
            description: "Przyznaj rolę do określonego konta użytkownika",
            container: {
              title: "Dodaj rolę",
              description: "Wybierz rolę do przyznania temu użytkownikowi",
            },
            id: {
              label: "ID użytkownika",
              description:
                "Unikalny identyfikator użytkownika, któremu ma być przyznana rola",
              placeholder: "Wprowadź ID użytkownika...",
            },
            role: {
              label: "Rola",
              description: "Rola do przyznania użytkownikowi",
              placeholder: "Wybierz rolę...",
            },
            submit: {
              label: "Dodaj rolę",
            },
            response: {
              roleId: {
                content: "ID przypisania roli",
              },
              userId: {
                content: "ID użytkownika",
              },
              assignedRole: {
                content: "Przypisana rola",
              },
            },
            errors: {
              unauthorized: {
                title: "Brak autoryzacji",
                description:
                  "Musisz być zalogowany, aby zarządzać rolami użytkowników",
              },
              validation: {
                title: "Błąd walidacji",
                description: "Podaj prawidłowe ID użytkownika i rolę",
              },
              forbidden: {
                title: "Brak dostępu",
                description:
                  "Tylko administratorzy mogą zarządzać rolami użytkowników",
              },
              notFound: {
                title: "Użytkownik nie znaleziony",
                description: "Nie można znaleźć podanego użytkownika",
              },
              conflict: {
                title: "Rola już przypisana",
                description: "Ten użytkownik ma już podaną rolę",
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
                description: "Nie można dodać roli z powodu błędu serwera",
              },
              unknown: {
                title: "Nieznany błąd",
                description:
                  "Wystąpił nieoczekiwany błąd podczas dodawania roli",
              },
            },
            success: {
              title: "Rola dodana",
              description: "Rola została pomyślnie przyznana użytkownikowi",
            },
          },
          delete: {
            title: "Usuń rolę użytkownika",
            description: "Odwołaj rolę od określonego konta użytkownika",
            container: {
              title: "Usuń rolę",
              description: "Wybierz rolę do odwołania od tego użytkownika",
            },
            id: {
              label: "ID użytkownika",
              description:
                "Unikalny identyfikator użytkownika, któremu ma być odwołana rola",
              placeholder: "Wprowadź ID użytkownika...",
            },
            role: {
              label: "Rola",
              description: "Rola do odwołania od użytkownika",
              placeholder: "Wybierz rolę...",
            },
            submit: {
              label: "Usuń rolę",
            },
            response: {
              success: {
                content: "Rola usunięta",
              },
            },
            errors: {
              unauthorized: {
                title: "Brak autoryzacji",
                description:
                  "Musisz być zalogowany, aby zarządzać rolami użytkowników",
              },
              validation: {
                title: "Błąd walidacji",
                description: "Podaj prawidłowe ID użytkownika i rolę",
              },
              forbidden: {
                title: "Brak dostępu",
                description:
                  "Tylko administratorzy mogą zarządzać rolami użytkowników",
              },
              notFound: {
                title: "Użytkownik nie znaleziony",
                description: "Nie można znaleźć podanego użytkownika",
              },
              conflict: {
                title: "Błąd konfliktu",
                description:
                  "Nie można usunąć roli z powodu istniejących zależności",
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
                description: "Nie można usunąć roli z powodu błędu serwera",
              },
              unknown: {
                title: "Nieznany błąd",
                description:
                  "Wystąpił nieoczekiwany błąd podczas usuwania roli",
              },
            },
            success: {
              title: "Rola usunięta",
              description: "Rola została pomyślnie odwołana od użytkownika",
            },
          },
        },
        get: {
          title: "Pobierz użytkownika",
          description:
            "Pobierz szczegółowe informacje o konkretnym użytkowniku",
          container: {
            title: "Szczegóły użytkownika",
            description: "Wyświetl szczegółowe informacje o użytkowniku",
          },
          id: {
            label: "ID użytkownika",
            description: "Unikalny identyfikator użytkownika",
            placeholder: "Wprowadź ID użytkownika...",
          },
          response: {
            userProfile: {
              title: "Profil użytkownika",
              description: "Szczegółowe informacje o profilu użytkownika",
              basicInfo: {
                title: "Informacje podstawowe",
                description: "Główne informacje o użytkowniku",
                id: {
                  content: "ID użytkownika",
                },
                email: {
                  content: "Adres e-mail",
                },
                privateName: {
                  content: "Nazwa prywatna",
                },
                publicName: {
                  content: "Nazwa publiczna",
                },
                firstName: {
                  content: "Imię",
                },
                lastName: {
                  content: "Nazwisko",
                },
                company: {
                  content: "Firma",
                },
              },
              contactDetails: {
                title: "Dane kontaktowe",
                description: "Informacje kontaktowe użytkownika",
                phone: {
                  content: "Numer telefonu",
                },
                preferredContactMethod: {
                  content: "Preferowana metoda kontaktu",
                },
                website: {
                  content: "Strona internetowa",
                },
              },
            },
            profileDetails: {
              title: "Szczegóły profilu",
              description: "Dodatkowe informacje o profilu",
              imageUrl: {
                content: "Zdjęcie profilowe",
              },
              bio: {
                content: "Biografia",
              },
              jobTitle: {
                content: "Stanowisko",
              },
              leadId: {
                content: "ID powiązanego leada",
              },
            },
            accountStatus: {
              title: "Status konta",
              description: "Informacje o statusie konta użytkownika",
              isActive: {
                content: "Status aktywności",
              },
              emailVerified: {
                content: "E-mail zweryfikowany",
              },
              stripeCustomerId: {
                content: "ID klienta Stripe",
              },
              userRoles: {
                content: "Role użytkownika",
              },
            },
            timestamps: {
              title: "Znaczniki czasu",
              description: "Znaczniki czasu utworzenia i aktualizacji",
              createdAt: {
                content: "Utworzono",
              },
              updatedAt: {
                content: "Zaktualizowano",
              },
            },
            referralInfo: {
              title: "Info o poleceniach",
              description: "Łańcuch poleceń i zarobki",
              referredByUserId: {
                content: "Polecony przez (ID użytkownika)",
              },
              referredByCode: {
                content: "Użyty kod polecający",
              },
              totalReferrals: {
                content: "Poleceni użytkownicy",
              },
              totalEarnedCents: {
                content: "Łączne zarobki (centy)",
              },
            },
            leadId: {
              content: "ID powiązanego leada",
            },
            email: {
              content: "Adres e-mail",
            },
            privateName: {
              content: "Nazwa prywatna",
            },
            publicName: {
              content: "Nazwa publiczna",
            },
            firstName: {
              content: "Imię",
            },
            lastName: {
              content: "Nazwisko",
            },
            company: {
              content: "Firma",
            },
            phone: {
              content: "Numer telefonu",
            },
            preferredContactMethod: {
              content: "Preferowana metoda kontaktu",
            },
            imageUrl: {
              content: "Zdjęcie profilowe",
            },
            bio: {
              content: "Biografia",
            },
            website: {
              content: "Strona internetowa",
            },
            jobTitle: {
              content: "Stanowisko",
            },
            emailVerified: {
              content: "E-mail zweryfikowany",
            },
            isActive: {
              content: "Status aktywności",
            },
            stripeCustomerId: {
              content: "ID klienta Stripe",
            },
            userRoles: {
              content: "Role użytkownika",
            },
            createdAt: {
              content: "Utworzono",
            },
            updatedAt: {
              content: "Zaktualizowano",
            },
          },
          errors: {
            unauthorized: {
              title: "Brak autoryzacji",
              description:
                "Musisz być zalogowany, aby wyświetlić szczegóły użytkownika",
            },
            validation: {
              title: "Walidacja nie powiodła się",
              description: "Podano nieprawidłowy ID użytkownika",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description:
                "Nie masz uprawnień do wyświetlenia tego użytkownika",
            },
            notFound: {
              title: "Użytkownik nie znaleziony",
              description: "Żądany użytkownik nie został znaleziony",
            },
            server: {
              title: "Błąd serwera",
              description:
                "Nie można pobrać użytkownika z powodu błędu serwera",
            },
            unknown: {
              title: "Nieznany błąd",
              description:
                "Wystąpił nieoczekiwany błąd podczas pobierania użytkownika",
            },
            conflict: {
              title: "Błąd konfliktu",
              description:
                "Nie można pobrać użytkownika z powodu istniejących konfliktów",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany, które zostaną utracone",
            },
          },
          success: {
            title: "Użytkownik pobrany pomyślnie",
            description: "Informacje o użytkowniku zostały pobrane pomyślnie",
          },
        },
        put: {
          title: "Aktualizuj użytkownika",
          description:
            "Aktualizuj informacje o użytkowniku i szczegóły profilu",
          container: {
            title: "Aktualizuj użytkownika",
            description: "Modyfikuj informacje o użytkowniku i ustawienia",
          },
          id: {
            label: "ID użytkownika",
            description: "Unikalny identyfikator użytkownika do aktualizacji",
            placeholder: "Wprowadź ID użytkownika...",
          },
          sections: {
            basicInfo: {
              title: "Informacje podstawowe",
              description: "Aktualizuj podstawowe informacje o użytkowniku",
            },
            contactInfo: {
              title: "Informacje kontaktowe",
              description: "Aktualizuj dane kontaktowe",
            },
            profileDetails: {
              title: "Szczegóły profilu",
              description: "Aktualizuj dodatkowe informacje o profilu",
            },
            adminSettings: {
              title: "Ustawienia administracyjne",
              description: "Aktualizuj ustawienia administracyjne",
            },
          },
          email: {
            label: "Adres e-mail",
            description: "Adres e-mail użytkownika do logowania i komunikacji",
            placeholder: "Wprowadź adres e-mail...",
          },
          privateName: {
            label: "Nazwa prywatna",
            description:
              "Pełne imię i nazwisko użytkownika (widoczne tylko dla administratorów)",
          },
          publicName: {
            label: "Nazwa publiczna",
            description:
              "Nazwa wyświetlana użytkownika (widoczna dla wszystkich użytkowników)",
          },
          firstName: {
            label: "Imię",
            description: "Imię użytkownika",
            placeholder: "Wprowadź imię...",
          },
          lastName: {
            label: "Nazwisko",
            description: "Nazwisko użytkownika",
            placeholder: "Wprowadź nazwisko...",
          },
          company: {
            label: "Firma",
            description: "Firma lub organizacja użytkownika",
            placeholder: "Wprowadź nazwę firmy...",
          },
          phone: {
            label: "Numer telefonu",
            description: "Numer telefonu kontaktowego użytkownika",
            placeholder: "Wprowadź numer telefonu...",
          },
          preferredContactMethod: {
            label: "Preferowana metoda kontaktu",
            description: "W jaki sposób użytkownik preferuje być kontaktowany",
          },
          bio: {
            label: "Biografia",
            description: "Krótki opis użytkownika",
            placeholder: "Wprowadź biografię...",
          },
          website: {
            label: "Strona internetowa",
            description: "Osobista lub firmowa strona internetowa użytkownika",
            placeholder: "Wprowadź URL strony...",
          },
          jobTitle: {
            label: "Stanowisko",
            description: "Stanowisko lub pozycja użytkownika",
            placeholder: "Wprowadź stanowisko...",
          },
          emailVerified: {
            label: "E-mail zweryfikowany",
            description: "Czy e-mail użytkownika jest zweryfikowany",
          },
          isActive: {
            label: "Status aktywności",
            description: "Czy konto użytkownika jest aktywne",
          },
          leadId: {
            label: "ID leada",
            description: "Identyfikator powiązanego leada",
            placeholder: "Wprowadź ID leada...",
          },
          isBanned: {
            label: "Zablokowany",
            description: "Czy użytkownik jest zablokowany na platformie",
          },
          bannedReason: {
            label: "Powód blokady",
            description: "Powód zablokowania użytkownika",
          },
          response: {
            leadId: {
              content: "ID powiązanego leada",
            },
            email: {
              content: "Adres e-mail",
            },
            privateName: {
              content: "Nazwa prywatna",
            },
            publicName: {
              content: "Nazwa publiczna",
            },
            firstName: {
              content: "Imię",
            },
            lastName: {
              content: "Nazwisko",
            },
            company: {
              content: "Firma",
            },
            phone: {
              content: "Numer telefonu",
            },
            preferredContactMethod: {
              content: "Preferowana metoda kontaktu",
            },
            imageUrl: {
              content: "Zdjęcie profilowe",
            },
            bio: {
              content: "Biografia",
            },
            website: {
              content: "Strona internetowa",
            },
            jobTitle: {
              content: "Stanowisko",
            },
            emailVerified: {
              content: "E-mail zweryfikowany",
            },
            isActive: {
              content: "Status aktywności",
            },
            stripeCustomerId: {
              content: "ID klienta Stripe",
            },
            userRoles: {
              content: "Role użytkownika",
            },
            createdAt: {
              content: "Utworzono",
            },
            updatedAt: {
              content: "Zaktualizowano",
            },
          },
          errors: {
            unauthorized: {
              title: "Brak autoryzacji",
              description:
                "Musisz być zalogowany, aby aktualizować użytkowników",
            },
            validation: {
              title: "Walidacja nie powiodła się",
              description: "Sprawdź dane formularza i spróbuj ponownie",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description:
                "Nie masz uprawnień do aktualizacji tego użytkownika",
            },
            notFound: {
              title: "Użytkownik nie znaleziony",
              description: "Użytkownik do aktualizacji nie został znaleziony",
            },
            conflict: {
              title: "Konflikt aktualizacji",
              description:
                "Dane użytkownika są w konflikcie z istniejącymi rekordami",
            },
            server: {
              title: "Błąd serwera",
              description:
                "Nie można zaktualizować użytkownika z powodu błędu serwera",
            },
            unknown: {
              title: "Nieznany błąd",
              description:
                "Wystąpił nieoczekiwany błąd podczas aktualizacji użytkownika",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany, które zostaną utracone",
            },
          },
          success: {
            title: "Użytkownik zaktualizowany pomyślnie",
            description:
              "Informacje o użytkowniku zostały pomyślnie zaktualizowane",
          },
        },
        delete: {
          title: "Usuń użytkownika",
          description: "Trwale usuń konto użytkownika",
          container: {
            title: "Usuń użytkownika",
            description: "Trwale usuń użytkownika z systemu",
          },
          id: {
            label: "ID użytkownika",
            description: "Unikalny identyfikator użytkownika do usunięcia",
            placeholder: "Wprowadź ID użytkownika...",
            helpText: "OSTRZEŻENIE: Ta akcja nie może być cofnięta",
          },
          submitButton: {
            label: "Usuń użytkownika",
            loadingText: "Usuwanie...",
          },
          response: {
            deletionResult: {
              title: "Wynik usunięcia",
              description: "Wynik operacji usunięcia",
              success: {
                content: "Sukces usunięcia",
              },
              message: {
                content: "Wiadomość o usunięciu",
              },
              deletedAt: {
                content: "Usunięto o",
              },
            },
            success: {
              content: "Sukces usunięcia",
            },
            message: {
              content: "Wiadomość o usunięciu",
            },
          },
          errors: {
            unauthorized: {
              title: "Brak autoryzacji",
              description: "Musisz być zalogowany, aby usuwać użytkowników",
            },
            validation: {
              title: "Walidacja nie powiodła się",
              description: "Podano nieprawidłowy ID użytkownika do usunięcia",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description: "Nie masz uprawnień do usuwania użytkowników",
            },
            notFound: {
              title: "Użytkownik nie znaleziony",
              description: "Użytkownik do usunięcia nie został znaleziony",
            },
            server: {
              title: "Błąd serwera",
              description:
                "Nie można usunąć użytkownika z powodu błędu serwera",
            },
            unknown: {
              title: "Nieznany błąd",
              description:
                "Wystąpił nieoczekiwany błąd podczas usuwania użytkownika",
            },
            conflict: {
              title: "Błąd konfliktu",
              description:
                "Nie można usunąć użytkownika z powodu istniejących zależności",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany, które zostaną utracone",
            },
          },
          success: {
            title: "Użytkownik usunięty pomyślnie",
            description: "Użytkownik został pomyślnie usunięty",
          },
        },
        widget: {
          userProfile: "Profil użytkownika",
          active: "Aktywny",
          inactive: "Nieaktywny",
          leadId: "ID leada:",
          viewLead: "Zobacz leada",
          created: "Utworzono",
          lastUpdated: "Ostatnia aktualizacja",
          fullProfile: "Pełny profil",
          referrals: "Polecenia",
          subscription: "Subskrypcja",
          creditHistory: "Historia kredytów",
          deleteUser: "Usuń użytkownika",
          userDeletedSuccessfully: "Użytkownik usunięty pomyślnie",
          deletedAt: "Usunięto o",
          confirmDeletion: "Potwierdź usunięcie",
          confirmDeletionMessage:
            "Spowoduje to trwałe usunięcie użytkownika i wszystkich powiązanych danych. Tej akcji nie można cofnąć.",
          titleReferralCodes: "Kody polecenia i statystyki",
          titleSubscription: "Wyświetl subskrypcję",
          titleCopyUserId: "Kopiuj ID użytkownika",
        },
      },
    },
  },
  view: {
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
      subscriptionPlan: "Plan",
      subscriptionStatus: "Status subskrypcji",
      nextBilling: "Następna płatność",
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
      connections: "Połączenia",
      favorites: "Ulubione",
      skills: "Umiejętności",
    },
    modelUsage: {
      title: "Użycie modeli",
      model: "Model",
      spent: "Wydane kredyty",
      messages: "Wiadomości",
      noUsage: "Brak danych o użyciu modeli",
    },
    connections: {
      title: "Połączenia",
      leadsTitle: "Powiązane leady",
      usersTitle: "Powiązani użytkownicy",
      noLeads: "Brak powiązanych leadów",
      noUsers: "Brak powiązanych użytkowników",
      leadEmail: "E-mail",
      leadBusiness: "Firma",
      leadStatus: "Status",
      ipAddress: "Adres IP",
      device: "Urządzenie",
      linkReason: "Powód powiązania",
      linkedAt: "Powiązano",
      userId: "ID użytkownika",
      userEmail: "E-mail",
      userPublicName: "Nazwa użytkownika",
      viewLead: "Zobacz lead",
      viewUser: "Zobacz użytkownika",
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
  },
};
