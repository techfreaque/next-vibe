import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leady",
    batch: "Wsadowe",
    campaigns: "Kampanie",
    management: "Zarządzanie",
    create: "Utwórz",
    search: "Szukaj",
    export: "Eksportuj",
    import: "Importuj",
    csv: "CSV",
    jobs: "Zadania",
    list: "Lista",
  },
  admin: {
    title: "Zarządzanie Leadami",
    tabs: {
      overview: "Nawigacja Leadów",
      stats: "Przegląd",
      stats_description: "Przeglądaj statystyki i analizy leadów",
      leads: "Leady",
      leads_description: "Przeglądaj i zarządzaj wszystkimi leadami",
      emails: "Kampanie E-mail",
      emails_description: "Zarządzaj kampaniami e-mail i szablonami",
      abTesting: "Testy A/B",
      abTesting_description: "Konfiguruj warianty testów A/B",
      campaignStarter: "Starter Kampanii",
      campaignStarter_description: "Konfiguruj i uruchamiaj kampanie leadów",
    },
    import: {
      label: "Importuj",
      description: "Importuj leady z plików CSV",
    },
    emails: {
      preview: {
        error: "Błąd renderowania podglądu e-maila",
        live: "Podgląd na żywo",
        actions: {
          title: "Podgląd E-maila",
          description: "Podgląd jak e-mail będzie wyglądał dla odbiorców",
        },
      },
      preview_title: "Podgląd E-maila",
      testEmail: {
        button: "Wyślij testowy e-mail",
      },
      from: "Od",
      recipient: "Odbiorca",
      subject: "Temat",
      email_preview: "Podgląd E-maila",
      stage_of: "z",
      stages: "etapów",
      journey: "Ścieżka",
      back: "Wróć",
      previous: "Poprzedni",
      next: "Następny",
    },
  },
  auth: {
    public: {
      validCookie: "Znaleziono ważny lead z cookie",
      invalidCookie: "Nieprawidłowy lead z cookie",
      created: "Utworzono anonimowy lead",
      error: "Błąd w autoryzacji publicznego leada",
    },
    authenticated: {
      primaryFound: "Znaleziono główny lead dla użytkownika",
      noPrimary: "Nie znaleziono głównego leada dla użytkownika",
      error: "Błąd w autoryzacji uwierzytelnionego leada",
    },
    link: {
      alreadyExists: "Połączenie leadów już istnieje",
      created: "Utworzono połączenie leadów",
      error: "Błąd łączenia leadów",
    },
    validate: {
      error: "Błąd walidacji leada",
    },
    getOrCreate: {
      invalid: "Nieprawidłowy ID leada",
      error: "Błąd pobierania lub tworzenia leada",
    },
    create: {
      existingFound: "Znaleziono istniejący anonimowy lead",
      success: "Lead utworzony pomyślnie",
      error: "Błąd tworzenia leada",
    },
    createForUser: {
      success: "Lead utworzony dla użytkownika",
      error: "Błąd tworzenia leada dla użytkownika",
    },
    cookie: {
      set: "Ustawiono cookie leada",
      error: "Błąd ustawiania cookie leada",
    },
    getUserLeads: {
      error: "Błąd pobierania leadów użytkownika",
    },
    linkLeads: {
      sameId: "Nie można połączyć leada z samym sobą",
      alreadyExists: "Połączenie leadów już istnieje",
      created: "Leady połączone pomyślnie",
      error: "Błąd łączenia leadów",
    },
    getLinkedLeads: {
      error: "Błąd pobierania połączonych leadów",
    },
    getAllLinkedLeads: {
      error: "Błąd pobierania wszystkich połączonych leadów",
    },
  },
  errors: {
    cannotLinkLeadToItself: "Nie można powiązać leada z samym sobą",
    linkFailed: "Nie udało się powiązać leadów",
  },
  filters: {
    search: {
      label: "Wyszukaj",
      description: "Szukaj leadów po e-mailu lub nazwie firmy",
      placeholder: "Wpisz e-mail lub nazwę firmy...",
    },
    status: {
      label: "Status",
      description: "Filtruj po statusie leada",
      placeholder: "Wszystkie statusy",
    },
    currentCampaignStage: {
      label: "Etap kampanii",
      description: "Filtruj po etapie kampanii e-mailowej",
      placeholder: "Wszystkie etapy",
    },
    source: {
      label: "Źródło",
      description: "Filtruj po źródle leada",
      placeholder: "Wszystkie źródła",
    },
    country: {
      label: "Kraj",
      description: "Filtruj po kraju",
      placeholder: "Wszystkie kraje",
    },
    language: {
      label: "Język",
      description: "Filtruj po języku",
      placeholder: "Wszystkie języki",
    },
    sortBy: {
      label: "Sortuj po",
      description: "Wybierz pole do sortowania",
      placeholder: "Pole sortowania",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Sortuj rosnąco lub malejąco",
      placeholder: "Kolejność",
    },
    statusFilters: {
      title: "Filtry statusu i kampanii",
      description: "Filtruj po statusie, etapie kampanii i źródle",
    },
    locationFilters: {
      title: "Filtry lokalizacji",
      description: "Filtruj po kraju i języku",
    },
    sortingOptions: {
      title: "Opcje sortowania",
      description: "Skonfiguruj kolejność sortowania",
    },
  },
  batch: {
    category: "Leads",
    tags: {
      leads: "Leady",
      batch: "Wsadowe",
    },

    patch: {
      title: "Aktualizacja wsadowa",
      description:
        "Aktualizacja leadów wsadowo na podstawie kryteriów filtrowania",
      form: {
        title: "Konfiguracja aktualizacji wsadowej",
        description: "Skonfiguruj parametry aktualizacji wsadowej",
      },
      search: {
        label: "Wyszukaj",
        description: "Szukaj leadów po e-mailu lub nazwie firmy",
        placeholder: "Wprowadź e-mail lub nazwę firmy",
      },
      status: {
        label: "Filtr statusu",
        description: "Filtruj leady według obecnego statusu",
      },
      currentCampaignStage: {
        label: "Filtr etapu kampanii",
        description: "Filtruj leady według obecnego etapu kampanii",
      },
      source: {
        label: "Filtr źródła",
        description: "Filtruj leady według źródła",
      },
      scope: {
        label: "Zakres operacji",
        description: "Określ zakres operacji wsadowej",
      },
      dryRun: {
        label: "Test",
        description: "Podgląd zmian bez ich zastosowania",
      },
      maxRecords: {
        label: "Maks. rekordów",
        description: "Maksymalna liczba rekordów do przetworzenia",
      },
      updates: {
        title: "Pola do aktualizacji",
        description: "Określ, które pola zaktualizować",
        status: {
          label: "Nowy status",
          description: "Zaktualizuj status leada do tej wartości",
        },
        currentCampaignStage: {
          label: "Nowy etap kampanii",
          description: "Zaktualizuj etap kampanii do tej wartości",
        },
        source: {
          label: "Nowe źródło",
          description: "Zaktualizuj źródło leada do tej wartości",
        },
        notes: {
          label: "Notatki",
          description: "Dodaj lub zaktualizuj notatki dla leada",
        },
      },
      response: {
        title: "Odpowiedź aktualizacji",
        description: "Dane odpowiedzi aktualizacji wsadowej",
        success: "Sukces",
        totalMatched: "Całkowita Liczba Dopasowanych",
        totalProcessed: "Całkowita Liczba Przetworzonych",
        totalUpdated: "Całkowita Liczba Zaktualizowanych",
        preview: "Podgląd",
        errors: "Błędy",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Autoryzacja wymagana dla operacji wsadowych",
        },
        validation: {
          title: "Błąd walidacji",
          description:
            "Nieprawidłowe parametry żądania dla aktualizacji wsadowej",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas aktualizacji wsadowej",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas aktualizacji wsadowej",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas aktualizacji wsadowej",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla operacji wsadowych",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony dla aktualizacji wsadowej",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych podczas aktualizacji wsadowej",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany w aktualizacji wsadowej",
        },
      },
      success: {
        title: "Aktualizacja udała się",
        description: "Operacja aktualizacji wsadowej zakończona pomyślnie",
      },
    },
    delete: {
      title: "Usuwanie wsadowe",
      description: "Usuwanie leadów wsadowo na podstawie kryteriów filtrowania",
      form: {
        title: "Konfiguracja usuwania wsadowego",
        description: "Skonfiguruj parametry usuwania wsadowego",
      },
      search: {
        label: "Wyszukaj",
        description: "Szukaj leadów po e-mailu lub nazwie firmy",
      },
      status: {
        label: "Filtr statusu",
        description: "Filtruj leady według obecnego statusu",
      },
      confirmDelete: {
        label: "Potwierdź usunięcie",
        description: "Potwierdź, że chcesz usunąć wybrane leady",
      },
      dryRun: {
        label: "Test",
        description: "Podgląd usunięć bez rzeczywistego usuwania rekordów",
      },
      maxRecords: {
        label: "Maks. rekordów",
        description: "Maksymalna liczba rekordów do usunięcia",
      },
      response: {
        title: "Odpowiedź usunięcia",
        description: "Dane odpowiedzi usuwania wsadowego",
        success: "Sukces",
        totalMatched: "Całkowita Liczba Dopasowanych",
        totalProcessed: "Całkowita Liczba Przetworzonych",
        totalDeleted: "Całkowita Liczba Usuniętych",
        preview: "Podgląd",
        errors: "Błędy",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Autoryzacja wymagana dla operacji usuwania wsadowego",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania dla usuwania wsadowego",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas usuwania wsadowego",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas usuwania wsadowego",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas usuwania wsadowego",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla operacji usuwania wsadowego",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony dla usuwania wsadowego",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych podczas usuwania wsadowego",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany w usuwaniu wsadowym",
        },
      },
      success: {
        title: "Usunięcie udało się",
        description: "Operacja usuwania wsadowego zakończona pomyślnie",
      },
    },
    widget: {
      update: {
        headerTitle: "Wsadowa aktualizacja leadów",
        emptyStateTitle: "Wsadowa aktualizacja leadów",
        emptyStateDescription:
          "Zastosuj aktualizację pola do wielu leadów naraz na podstawie kryteriów filtrowania. Użyj",
        emptyStateDescriptionStrong: "Testu",
        emptyStateDescriptionSuffix:
          "aby wyświetlić podgląd leadów, których to dotyczy, przed zatwierdzeniem zmian.",
        emptyStateTip1:
          "Ustaw filtry i kliknij Wyślij, aby najpierw uruchomić podgląd testu",
        emptyStateTip2: "Odznacz Test, aby zastosować zmiany naprawdę",
        highVolumeTitle: "Duża partia: {{count}} pasujących leadów",
        highVolumeDescription:
          "Dotyczy to dużej liczby rekordów. Sprawdź uważnie podgląd przed wyłączeniem Testu i ostatecznym przesłaniem.",
        partialBatchTitle: "Przetworzono częściową partię",
        partialBatchDescription:
          "Przetworzono {{processed}} z {{matched}} pasujących leadów. Zwiększ Maks. rekordy lub uruchom ponownie, aby przetworzyć więcej.",
        successTitle: "Operacja wsadowa zakończona",
        failureTitle: "Operacja wsadowa nie powiodła się",
        statMatched: "Dopasowane",
        statProcessed: "Przetworzone",
        statUpdated: "Zaktualizowane",
        btnRunAgain: "Uruchom ponownie",
        btnViewAllAffected: "Wyświetl wszystkie dotknięte leady",
        btnViewInList: "Wyświetl na liście",
        dryRunPreviewTitle:
          "Podgląd testu ({{count}} leadów zostałoby dotkniętych)",
        leadFallback: "Lead {{number}}",
        errorsTitle: "{{count}} błąd(ów)",
        errorRow: "Lead {{leadId}}: {{error}}",
        sectionFilter: "Kryteria filtrowania",
        sectionUpdates: "Pola do aktualizacji",
        sectionSettings: "Ustawienia operacji",
        activeFiltersLabel: "Aktywne filtry z listy (wstępnie wypełnione)",
        filterSearch: "Wyszukaj",
        submitButton: "Zastosuj aktualizacje",
        submitButtonLoading: "Stosowanie...",
      },
      delete: {
        headerTitle: "Wsadowe usuwanie leadów",
        warningTitle: "Ostrzeżenie: {{count}} lead zostanie trwale usunięty",
        warningTitlePlural:
          "Ostrzeżenie: {{count}} leady zostaną trwale usunięte",
        warningDescription:
          "Tej akcji nie można cofnąć. Wszystkie dane pasujących leadów zostaną trwale usunięte. Wyłącz Test i potwierdź, aby kontynuować.",
        successTitle: "Usuwanie zakończone",
        failureTitle: "Usuwanie nie powiodło się",
        statMatched: "Dopasowane",
        statDeleted: "Usunięte",
        btnRunAgain: "Uruchom ponownie",
        btnViewRemainingLeads: "Wyświetl pozostałe leady",
        previewTitle: "{{count}} leadów zostanie trwale usuniętych",
        leadFallback: "Lead {{number}}",
        errorRow: "Lead {{leadId}}: {{error}}",
        sectionFilter: "Kryteria filtrowania",
        sectionSettings: "Ustawienia usuwania",
        activeFiltersLabel: "Aktywne filtry z listy (wstępnie wypełnione)",
        filterSearch: "Wyszukaj",
        submitButton: "Usuń leady",
        submitButtonLoading: "Usuwanie...",
      },
    },
    enums: {
      batchOperationScope: {
        currentPage: "Bieżąca strona",
        allPages: "Wszystkie strony",
      },
      leadStatus: {
        new: "Nowy",
        pending: "Oczekujący",
        campaignRunning: "Kampania aktywna",
        websiteUser: "Użytkownik strony",
        newsletterSubscriber: "Subskrybent newslettera",
        inContact: "W kontakcie",
        signedUp: "Zarejestrowany",
        subscriptionConfirmed: "Subskrypcja potwierdzona",
        unsubscribed: "Wypisany",
        bounced: "Odrzucony",
        invalid: "Nieprawidłowy",
      },
      emailCampaignStage: {
        notStarted: "Nie rozpoczęto",
        initial: "Pierwszy kontakt",
        followup1: "Follow-up 1",
        followup2: "Follow-up 2",
        followup3: "Follow-up 3",
        nurture: "Pielęgnowanie",
        reactivation: "Reaktywacja",
      },
      leadSource: {
        website: "Strona WWW",
        socialMedia: "Media społecznościowe",
        emailCampaign: "Kampania e-mail",
        referral: "Polecenie",
        csvImport: "Import CSV",
      },
    },
    email: {
      admin: {
        batchUpdate: {
          title: "Aktualizacja Wsadowa Zakończona",
          subject: "Wyniki Aktualizacji Wsadowej",
          preview: "Przetworzono {{totalProcessed}} leadów",
          message:
            "Operacja aktualizacji wsadowej została zakończona z {{totalProcessed}} przetworzonymi leadami.",
          operationSummary: "Podsumowanie Operacji",
          totalMatched: "Całkowita Liczba Dopasowanych",
          totalProcessed: "Całkowita Liczba Przetworzonych",
          totalUpdated: "Całkowita Liczba Zaktualizowanych",
          errors: "Błędy",
          dryRunNote: "To był test - nie dokonano żadnych rzeczywistych zmian.",
          viewLeads: "Wyświetl Zaktualizowane Leady",
          error: {
            noData: "Brak danych aktualizacji wsadowej",
          },
        },
        batchDelete: {
          title: "Usuwanie Wsadowe Zakończone",
          subject: "Wyniki Usuwania Wsadowego",
          preview: "Przetworzono {{totalProcessed}} leadów do usunięcia",
          message:
            "Operacja usuwania wsadowego została zakończona z {{totalProcessed}} przetworzonymi leadami.",
          operationSummary: "Podsumowanie Operacji",
          totalMatched: "Całkowita Liczba Dopasowanych",
          totalProcessed: "Całkowita Liczba Przetworzonych",
          totalDeleted: "Całkowita Liczba Usuniętych",
          errors: "Błędy",
          dryRunNote:
            "To był test - nie dokonano żadnych rzeczywistych usunięć.",
          viewLeads: "Wyświetl Leady",
          error: {
            noData: "Brak danych usuwania wsadowego",
          },
        },
      },
      error: {
        general: {
          internal_server_error: "Wystąpił wewnętrzny błąd serwera",
        },
      },
    },
  },
  campaigns: {
    category: "Zarządzanie Kampaniami",
    tags: {
      campaigns: "Kampanie",
      management: "Zarządzanie",
    },
    campaignStarter: {
      category: "Zarządzanie Kampaniami",
      tag: "Starter kampanii",
      task: {
        description:
          "Uruchamia kampanie dla nowych leadów, przenosząc je do statusu OCZEKUJĄCE",
      },
      errors: {
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił błąd podczas przetwarzania żądania startera kampanii",
        },
        invalidTransition:
          "Nieprawidłowe przejście statusu dla startu kampanii",
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Dostęp zabroniony",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
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
          description: "Zasób nie znaleziony",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
      },
      post: {
        title: "Starter kampanii",
        description: "Uruchom kampanie dla nowych leadów",
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry żądania",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas uruchamiania kampanii",
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
            description: "Zasób nie znaleziony",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt danych",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
        },
        fields: {
          timezone: {
            label: "Strefa czasowa",
            description: "Strefa czasowa przeglądarki do przeliczania godzin",
          },
          dryRun: {
            label: "Próbny przebieg",
            description: "Uruchom bez wprowadzania zmian",
          },
          force: {
            label: "Wymuś",
            description: "Pomiń ograniczenia harmonogramu dni/godzin",
          },
        },
        response: {
          leadsProcessed: "Przetworzone leady",
          leadsStarted: "Uruchomione leady",
          leadsSkipped: "Pominięte leady",
          executionTimeMs: "Czas wykonania (ms)",
          errors: "Błędy",
          quotaDetails: "Szczegóły limitu",
        },
        success: {
          title: "Starter kampanii zakończony",
          description: "Starter kampanii został uruchomiony pomyślnie",
        },
      },
      get: {
        title: "Pobierz konfigurację startera kampanii",
        description: "Załaduj konfigurację startera kampanii",
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
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
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie znaleziony",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt danych",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
        },
        fields: {
          timezone: {
            label: "Strefa czasowa",
            description: "Strefa czasowa przeglądarki do przeliczania godzin",
          },
        },
        response: {
          dryRun: "Tryb próbny",
          minAgeHours: "Minimalny wiek w godzinach",
          localeConfig: "Konfiguracja języków",
          enabledDays: "Aktywne dni tygodnia",
          enabledHours: "Aktywne godziny",
          leadsPerWeek: "Leady na tydzień",
          schedule: "Harmonogram",
          enabled: "Włączono",
          priority: "Priorytet",
          timeout: "Limit czasu",
          retries: "Ponowne próby",
          retryDelay: "Opóźnienie ponownej próby",
        },
        success: {
          title: "Konfiguracja załadowana pomyślnie",
          description: "Konfiguracja startera kampanii załadowana pomyślnie",
        },
      },
      put: {
        title: "Konfiguracja startera kampanii",
        description: "Zaktualizuj konfigurację startera kampanii",
        dryRun: {
          label: "Tryb próbny (Dry Run)",
          description: "Włącz tryb próbny bez wysyłania prawdziwych e-maili",
        },
        minAgeHours: {
          label: "Minimalny wiek w godzinach",
          description: "Minimalny wiek w godzinach przed przetworzeniem leadów",
        },
        enabledDays: {
          label: "Aktywne dni tygodnia",
          description: "Dni tygodnia, gdy kampanie są aktywne",
          monday: "Poniedziałek",
          tuesday: "Wtorek",
          wednesday: "Środa",
          thursday: "Czwartek",
          friday: "Piątek",
          saturday: "Sobota",
          sunday: "Niedziela",
        },
        enabledHours: {
          label: "Aktywne godziny",
          description: "Godziny dnia, gdy kampanie są aktywne",
          start: {
            label: "Godzina startowa",
            description: "Godzina dnia, o której kampanie się zaczynają (0-23)",
          },
          end: {
            label: "Godzina końcowa",
            description: "Godzina dnia, o której kampanie się kończą (0-23)",
          },
        },
        localeConfig: {
          label: "Konfiguracja języków",
          description:
            "Ustawienia dla każdego języka: leady na tydzień, aktywne dni i aktywne godziny",
        },
        leadsPerWeek: {
          label: "Leady na tydzień",
          description: "Maksymalna liczba leadów do przetworzenia tygodniowo",
        },
        schedule: {
          label: "Harmonogram",
          description: "Harmonogram wykonywania kampanii",
        },
        enabled: {
          label: "Włączono",
          description: "Włącz lub wyłącz starter kampanii",
        },
        priority: {
          label: "Priorytet",
          description: "Poziom priorytetu wykonywania kampanii",
        },
        timeout: {
          label: "Limit czasu",
          description: "Wartość limitu czasu w milisekundach",
        },
        retries: {
          label: "Ponowne próby",
          description: "Liczba prób ponowienia",
        },
        retryDelay: {
          label: "Opóźnienie ponownej próby",
          description: "Opóźnienie między próbami ponowienia w milisekundach",
        },
        success: {
          title: "Konfiguracja zapisana",
          description: "Konfiguracja startera kampanii zapisana pomyślnie",
        },
      },
      priority: {
        critical: "Krytyczny",
        high: "Wysoki",
        medium: "Średni",
        low: "Niski",
        background: "Tło",
        filter: {
          all: "Wszystkie priorytety",
          highAndAbove: "Wysoki i wyżej",
          mediumAndAbove: "Średni i wyżej",
        },
      },
      widget: {
        title: "Konfiguracja startera kampanii",
        titleSaved: "Konfiguracja zapisana",
        description:
          "Uruchamia kampanie dla nowych leadów, które są gotowe do kontaktu.",
        saving: "Zapisywanie...",
        save: "Zapisz ustawienia",
        addLocale: "+ Dodaj język",
        guidanceTitle: "Skonfiguruj starter kampanii",
        guidanceDescription:
          "Ustaw harmonogram, aktywne dni/godziny i cele leadów na tydzień.",
        runButton: "Uruchom kampanie",
        running: "Uruchamianie...",
        done: "Gotowe",
        perRunBudget:
          "~{{perRunBudget}} leadów/uruchomienie · {{totalRunsPerWeek}} uruchomień/tydzień",
        perRunBudgetFractional:
          "{{exactBudget}}/uruchomienie · {{totalRunsPerWeek}} uruchomień/tydz. (ułamkowe - akumuluje między uruchomieniami)",
        perRunBudgetZeroHint:
          "— zwiększ liczbę leadów/tydzień lub zmniejsz częstotliwość harmonogramu",
        sections: {
          general: "Ogólne",
          generalDescription:
            "Główne kontrolki do włączania startera kampanii i trybu próbnego.",
          schedule: "Harmonogram",
          scheduleDescription:
            "Kiedy kampanie powinny działać? Ustaw harmonogram cron, aktywne dni i godziny.",
          hoursTimezoneNote:
            "Godziny w strefie czasowej przeglądarki ({{offset}}). Przechowywane jako UTC na serwerze.",
          quotas: "Limity",
          quotasDescription:
            "Ile leadów przetwarzać tygodniowo, w podziale na język.",
          advanced: "Zaawansowane",
          advancedDescription:
            "Ustawienia wykonywania zadań, takie jak priorytet, limity czasu i zachowanie ponownych prób.",
        },
        days: {
          mon: "Pon",
          tue: "Wt",
          wed: "Śr",
          thu: "Czw",
          fri: "Pt",
          sat: "Sob",
          sun: "Nd",
        },
      },
    },
    emailCampaigns: {
      category: "Zarządzanie Kampaniami",
      tag: "Kampanie e-mailowe",
      task: {
        description:
          "Wysyła automatyczne kampanie e-mailowe do leadów na podstawie ich etapu i harmonogramu",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
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
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany",
        },
      },
      post: {
        title: "Kampanie e-mailowe",
        description: "Przetwarzaj kampanie e-mailowe dla leadów",
        errors: {
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagana autoryzacja",
          },
          forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
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
          network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie został znaleziony",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt danych",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
        },
        fields: {
          batchSize: {
            label: "Rozmiar partii",
            description: "Liczba leadów do przetworzenia na partię",
          },
          maxEmailsPerRun: {
            label: "Maks. e-maili na przebieg",
            description: "Maksymalna liczba e-maili do wysłania na przebieg",
          },
          dryRun: {
            label: "Próbny przebieg",
            description: "Uruchom bez wysyłania e-maili",
          },
        },
        response: {
          emailsScheduled: "Zaplanowane e-maile",
          emailsSent: "Wysłane e-maile",
          emailsFailed: "Nieudane e-maile",
          leadsProcessed: "Przetworzone leady",
        },
        success: {
          title: "Sukces",
          description: "Operacja zakończona pomyślnie",
        },
      },
      get: {
        title: "Pobierz konfigurację kampanii e-mailowych",
        description: "Załaduj konfigurację cron kampanii e-mailowych",
        errors: {
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagana autoryzacja",
          },
          forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
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
          network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie został znaleziony",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt danych",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
        },
        response: {
          enabled: "Włączono",
          dryRun: "Tryb próbny",
          batchSize: "Rozmiar partii",
          maxEmailsPerRun: "Maks. e-maili na przebieg",
          schedule: "Harmonogram",
          priority: "Priorytet",
          timeout: "Limit czasu",
          retries: "Ponowne próby",
          retryDelay: "Opóźnienie ponownej próby",
        },
        success: {
          title: "Konfiguracja załadowana pomyślnie",
          description: "Konfiguracja kampanii e-mailowych załadowana pomyślnie",
        },
      },
      put: {
        title: "Konfiguracja kampanii e-mailowych",
        description: "Zaktualizuj konfigurację cron kampanii e-mailowych",
        enabled: {
          label: "Włączono",
          description: "Włącz lub wyłącz zadanie cron kampanii e-mailowych",
        },
        dryRun: {
          label: "Tryb próbny",
          description: "Przetwarzaj e-maile bez ich wysyłania",
        },
        batchSize: {
          label: "Rozmiar partii",
          description: "Liczba leadów do przetworzenia na partię (1–100)",
        },
        maxEmailsPerRun: {
          label: "Maks. e-maili na przebieg",
          description:
            "Maksymalna liczba e-maili do wysłania na przebieg cron (1–1000)",
        },
        schedule: {
          label: "Harmonogram",
          description: "Wyrażenie cron dla kampanii e-mailowych",
        },
        priority: {
          label: "Priorytet",
          description: "Poziom priorytetu wykonywania zadania",
        },
        timeout: {
          label: "Limit czasu (ms)",
          description: "Maksymalny czas wykonywania w milisekundach",
        },
        retries: {
          label: "Ponowne próby",
          description: "Liczba prób ponowienia przy błędzie",
        },
        retryDelay: {
          label: "Opóźnienie ponownej próby (ms)",
          description: "Opóźnienie między próbami ponowienia w milisekundach",
        },
        success: {
          title: "Konfiguracja zapisana",
          description: "Konfiguracja kampanii e-mailowych zapisana pomyślnie",
        },
      },
      priority: {
        critical: "Krytyczny",
        high: "Wysoki",
        medium: "Średni",
        low: "Niski",
        background: "Tło",
      },
      widget: {
        title: "Konfiguracja kampanii e-mailowych",
        titleSaved: "Konfiguracja zapisana",
        saving: "Zapisywanie...",
        save: "Zapisz ustawienia",
        guidanceTitle: "Skonfiguruj cron kampanii e-mailowych",
        guidanceDescription:
          "Włącz/wyłącz zadanie cron kampanii e-mailowych i skonfiguruj harmonogram oraz rozmiar partii.",
        runButton: "Uruchom teraz",
        running: "Uruchamianie...",
        done: "Gotowe",
        sections: {
          general: "Ogólne",
          generalDescription:
            "Główne kontrolki dla zadania kampanii e-mailowych i trybu próbnego.",
          schedule: "Harmonogram",
          scheduleDescription: "Ustaw harmonogram cron dla wysyłania e-maili.",
          processing: "Przetwarzanie",
          processingDescription:
            "Skonfiguruj ile leadów i e-maili przetwarzać na przebieg.",
          advanced: "Zaawansowane",
          advancedDescription:
            "Ustawienia wykonywania zadań, takie jak priorytet, limity czasu i zachowanie ponownych prób.",
        },
      },
    },
    emails: {
      common: {
        logoPart1: "Next",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "Twórz lepsze produkty szybciej",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}. Wszelkie prawa zastrzeżone.",
            helpText:
              "Jeśli masz pytania, skontaktuj się z nami pod adresem {{config.emails.support}}",
            unsubscribeText: "Nie chcesz otrzymywać tych wiadomości?",
            unsubscribeLink: "Wypisz się",
          },
          socialProof: {
            quotePrefix: "„",
            quoteSuffix: "201D",
            attribution: "— Imię klienta, Firma",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "Inny użytkownik unbottled.ai",
              previewLeadId: "podglad-lead-id",
              previewEmail: "podglad@przyklad.pl",
              previewBusinessName: "Przykładowa Firma",
              previewContactName: "Użytkownik Podglądu",
              previewPhone: "+48123456789",
              previewCampaignId: "podglad-kampania-id",
            },
            footer: {
              unsubscribeText:
                "Otrzymujesz tę wiadomość, ponieważ wyraziłeś zgodę.",
              unsubscribeLink: "Wypisz się",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "Niecenzurowana konwersja",
                description:
                  "Entuzjasta dzielący się swoim odkryciem unbottled.ai",
                longDescription:
                  "Entuzjasta dzielący się prawdziwym odkryciem z transparentnością afiliacyjną",
                characteristics: {
                  tone: "Swobodny, spiskowczy ton",
                  story: "Prawdziwa osobista historia",
                  transparency: "Transparentność afiliacyjna",
                  angle: "Kąt anty-cenzury",
                  energy: "Energia entuzjasty",
                },
              },
              sideHustle: {
                name: "Dodatkowy zarobek",
                description:
                  "Transparentny afiliant dzielący się prawdziwymi przypadkami użycia",
                longDescription:
                  "Transparentny marketer afiliacyjny dzielący się prawdziwymi cotygodniowymi przypadkami użycia",
                characteristics: {
                  disclosure: "Pełne ujawnienie afiliacji od początku",
                  updates: "Cotygodniowe aktualizacje przypadków użycia",
                  income: "Historia pasywnego dochodu",
                  proof: "Praktyczny dowód, nie hype",
                  energy: "Uczciwa energia hustle",
                },
              },
              quietRecommendation: {
                name: "Cicha rekomendacja",
                description:
                  "Spokojny profesjonalista przekazujący przetestowane narzędzie",
                longDescription:
                  "Spokojny profesjonalista przekazujący narzędzie testowane przez tygodnie",
                characteristics: {
                  signal: "Krótki, wysoki stosunek sygnału do szumu",
                  specifics: "Bez hype, tylko konkrety",
                  testing: "Historia testowania przez 3 tygodnie",
                  comparison: "Uczciwe porównanie z ChatGPT",
                  affiliate: "Minimalne wzmianki o afiliacji",
                },
              },
              signupNurture: {
                name: "Nurturing po rejestracji",
                description: "Sekwencja onboardingowa dla nowych użytkowników",
                longDescription:
                  "E-maile powitalne i onboardingowe pomagające nowym użytkownikom rozpocząć pracę",
              },
              retention: {
                name: "Retencja",
                description: "Reaktywacja dla istniejących subskrybentów",
                longDescription:
                  "E-maile oparte na wartości, aby utrzymać aktywnych subskrybentów i eksplorować funkcje",
              },
              winback: {
                name: "Odzyskiwanie klientów",
                description:
                  "Odzyskaj nieaktywnych lub odchodzących użytkowników",
                longDescription:
                  "Kampania reaktywacyjna skierowana do użytkowników, którzy stali się nieaktywni lub zrezygnowali",
              },
              newsletterMay2026: {
                name: "Newsletter maj 2026",
                description:
                  "Jednorazowy newsletter o Cortex, Dreamer, Autopilot i generowaniu mediów",
                longDescription:
                  "Newsletter z aktualizacją produktu maj 2026 dla wszystkich zarejestrowanych użytkowników z szczerym przyznaniem się do błędów i przeglądem funkcji",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "Anulowane przez system",
        },
        abTesting: {
          invalidWeights: "Całkowita waga wariantów musi wynosić 100%",
          negativeWeight: "Waga wariantu musi być dodatnia",
        },
        post: {
          title: "Tytuł",
          description: "Opis endpointu",
          form: {
            title: "Konfiguracja",
            description: "Skonfiguruj parametry",
          },
          response: {
            title: "Odpowiedź",
            description: "Dane odpowiedzi",
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
      },
      testMail: {
        category: "Leads",
        tags: {
          campaigns: "Campaigns",
          leads: "Leads",
        },
        post: {
          title: "Test Mail",
          description: "Wyślij testowy e-mail z niestandardowymi danymi leadu",
          form: {
            title: "Konfiguracja Test Mail",
            description: "Skonfiguruj parametry test mail i dane leadu",
          },
          campaignType: {
            label: "Typ kampanii",
            description: "Typ kampanii e-mailowej",
            placeholder: "Wprowadź typ kampanii",
          },
          emailJourneyVariant: {
            label: "Wariant podróży e-mail",
            description: "Wariant testowy A/B dla podróży e-mail",
            placeholder: "Wybierz wariant podróży",
          },
          emailCampaignStage: {
            label: "Etap kampanii e-mail",
            description: "Aktualny etap kampanii e-mail",
            placeholder: "Wybierz etap kampanii",
          },
          testEmail: {
            label: "Adres testowy e-mail",
            description: "Adres e-mail, na który zostanie wysłany test mail",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "Dane leadu",
            description: "Informacje o leadzie dla renderowania szablonu",
            businessName: {
              label: "Nazwa firmy",
              description: "Nazwa firmy",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "Nazwa kontaktu",
              description: "Nazwa osoby kontaktowej",
              placeholder: "Jan Kowalski",
            },
            website: {
              label: "Strona internetowa",
              description: "URL strony internetowej firmy",
              placeholder: "https://example.com",
            },
            country: {
              label: "Kraj",
              description: "Kod kraju",
              placeholder: "GLOBAL",
            },
            language: {
              label: "Język",
              description: "Preferowany kod języka",
              placeholder: "pl",
            },
            status: {
              label: "Status",
              description: "Status leadu",
              placeholder: "NEW",
            },
            source: {
              label: "Źródło",
              description: "Źródło leadu",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "Notatki",
              description: "Dodatkowe notatki o leadzie",
              placeholder: "Wprowadź dodatkowe notatki",
            },
          },
          response: {
            title: "Wynik testowego e-maila",
            description: "Wynik wysłania testowego e-maila",
            success: {
              content: "Sukces",
            },
            messageId: {
              content: "ID wiadomości",
            },
            testEmail: {
              content: "Testowy e-mail",
            },
            subject: {
              content: "Temat e-maila",
            },
            sentAt: {
              content: "Wysłano o",
            },
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
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Istnieją niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt",
              description: "Wystąpił konflikt danych",
            },
            templateNotFound: {
              title: "Nie znaleziono szablonu",
              description:
                "Nie znaleziono szablonu e-mail dla podanych parametrów",
            },
            sendingFailed: {
              title: "Wysyłanie nie powiodło się",
              description: "Nie udało się wysłać testowego e-maila",
            },
          },
          success: {
            title: "Sukces",
            description: "Testowy e-mail wysłany pomyślnie",
          },
          selectionCriteria: "Kryteria wyboru SMTP",
          widget: {
            title: "Wyślij testowy e-mail",
            send: "Wyślij testowy e-mail",
            sending: "Wysyłanie...",
            successMessage: "Testowy e-mail wysłany pomyślnie",
            sentTo: "Wysłano do: ",
            subject: "Temat: ",
            sentAt: "Wysłano o: ",
            campaignConfig: "Konfiguracja kampanii",
            sendAnother: "Wyślij kolejny",
          },
        },
      },
    },
  },
  create: {
    category: "Leads",
    tags: {
      leads: "Leady",
      create: "Utwórz",
    },

    enums: {
      leadSource: {
        website: "Strona WWW",
        socialMedia: "Media społecznościowe",
        emailCampaign: "Kampania e-mail",
        referral: "Polecenie",
        csvImport: "Import CSV",
      },
    },
    widget: {
      headerLeadCreated: "Lead stworzony",
      headerCreateLead: "Stwórz lead",
      subheaderFillDetails: "Wypełnij poniższe szczegóły",
      fallbackLeadName: "Lead",
      buttonCopyId: "Kopiuj ID",
      buttonViewLead: "Zobacz lead",
      buttonEditLead: "Edytuj lead",
      buttonBackToList: "Powrót do listy",
    },
    post: {
      title: "Stwórz lead",
      description: "Stwórz nowy lead w systemie",
      backButton: {
        label: "Powrót do leadów",
      },
      submitButton: {
        label: "Stwórz leada",
        loadingText: "Tworzenie leada...",
      },
      form: {
        title: "Formularz nowego leada",
        description: "Wprowadź informacje o leadzie aby stworzyć nowy lead",
      },
      contactInfo: {
        title: "Informacje kontaktowe",
        description: "Główne dane kontaktowe dla leada",
      },
      email: {
        label: "Adres e-mail",
        description: "Główny adres e-mail do komunikacji",
        placeholder: "jan@przyklad.pl",
      },
      businessName: {
        label: "Nazwa firmy",
        description: "Nazwa firmy lub przedsiębiorstwa",
        placeholder: "Przykład Sp. z o.o.",
      },
      phone: {
        label: "Numer telefonu",
        description: "Numer telefonu kontaktowego z kodem kraju",
        placeholder: "+48123456789",
      },
      website: {
        label: "Strona internetowa",
        description: "Adres URL strony internetowej firmy",
        placeholder: "https://przyklad.pl",
      },
      locationPreferences: {
        title: "Lokalizacja i preferencje",
        description: "Preferencje geograficzne i językowe",
      },
      country: {
        label: "Kraj",
        description: "Lokalizacja firmy lub rynek docelowy",
        placeholder: "Wybierz kraj",
      },
      language: {
        label: "Język",
        description: "Preferowany język komunikacji",
        placeholder: "Wybierz język",
      },
      leadDetails: {
        title: "Szczegóły leada",
        description: "Dodatkowe informacje o leadzie",
      },
      source: {
        label: "Źródło leada",
        description: "Jak lead został pozyskany",
        placeholder: "Wybierz źródło",
      },
      notes: {
        label: "Notatki",
        description: "Dodatkowe notatki lub komentarze",
        placeholder: "Wprowadź dodatkowe informacje...",
      },
      response: {
        title: "Stworzony lead",
        description: "Szczegóły nowo stworzonego leada",
        summary: {
          title: "Podsumowanie leada",
          id: "ID leada",
          businessName: "Nazwa firmy",
          email: "Adres e-mail",
          status: "Status leada",
        },
        contactDetails: {
          title: "Szczegóły kontaktowe",
          phone: "Numer telefonu",
          website: "URL strony",
          country: "Kraj",
          language: "Język",
        },
        trackingInfo: {
          title: "Informacje śledzenia",
          source: "Źródło leada",
          emailsSent: "Liczba e-maili",
          currentCampaignStage: "Etap kampanii",
        },
        metadata: {
          title: "Metadane",
          notes: "Notatki",
          createdAt: "Data utworzenia",
          updatedAt: "Ostatnia aktualizacja",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Autoryzacja wymagana do tworzenia leadów",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Podano nieprawidłowe informacje o leadzie",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas tworzenia leada",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas tworzenia leada",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas tworzenia leada",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla tworzenia leadów",
        },
        notFound: {
          title: "Nie znaleziono",
          description:
            "Wymagany zasób nie został znaleziony do tworzenia leada",
        },
        conflict: {
          title: "Konflikt",
          description: "Lead już istnieje lub wystąpił konflikt danych",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany w formularzu leada",
        },
      },
      success: {
        title: "Lead stworzony",
        description: "Lead stworzony pomyślnie",
      },
    },
    email: {
      welcome: {
        subject: "Witamy w {{companyName}}",
        title: "Witamy w {{companyName}}, {{businessName}}!",
        preview: "Witamy w naszym serwisie - zaczynajmy",
        greeting:
          "Witamy w {{companyName}}, {{businessName}}! Cieszymy się, że możemy pomóc w rozwoju Twojej firmy.",
        defaultName: "tam",
        introduction:
          "Dziękujemy za zainteresowanie naszymi usługami. Otrzymaliśmy Twoje informacje i nasz zespół jest gotowy pomóc Ci osiągnąć cele biznesowe.",
        nextSteps: {
          title: "Co dalej?",
          step1Number: "1.",
          step1: "Nasz zespół przejrzy profil i cele Twojej firmy",
          step2Number: "2.",
          step2:
            "Otrzymasz spersonalizowaną propozycję konsultacji w ciągu 24 godzin",
          step3Number: "3.",
          step3: "Umówimy rozmowę, aby omówić Twoje konkretne potrzeby i cele",
        },
        cta: {
          getStarted: "Zaplanuj konsultację",
        },
        support:
          "Masz pytania? Odpowiedz na ten e-mail lub skontaktuj się z nami pod adresem {{supportEmail}}",
        error: {
          noEmail:
            "Nie można wysłać e-maila powitalnego - nie podano adresu e-mail",
        },
      },
      admin: {
        newLead: {
          subject: "Nowy lead: {{businessName}}",
          title: "Stworzono nowy lead",
          preview: "Nowy lead od {{businessName}} wymaga działania",
          message:
            "Nowy lead został stworzony w systemie od {{businessName}} i wymaga Twojej uwagi.",
          leadDetails: "Szczegóły leada",
          businessName: "Nazwa firmy",
          email: "E-mail",
          phone: "Telefon",
          website: "Strona internetowa",
          source: "Źródło",
          status: "Status",
          notes: "Notatki",
          notProvided: "Nie podano",
          viewLead: "Zobacz szczegóły leada",
          viewAllLeads: "Zobacz wszystkie leady",
          error: {
            noData:
              "Nie można wysłać powiadomienia administracyjnego - nie podano danych leada",
          },
          defaultName: "Nowy lead",
        },
      },
      error: {
        general: {
          internal_server_error: "Wystąpił wewnętrzny błąd serwera",
        },
      },
    },
  },
  export: {
    category: "Leads",
    tags: {
      leads: "Leady",
      export: "Eksportuj",
    },

    get: {
      title: "Eksportuj leady",
      description: "Eksportuj dane leadów do pliku",
      form: {
        title: "Konfiguracja eksportu",
        description: "Skonfiguruj parametry eksportu leadów i filtry",
      },
      format: {
        label: "Format eksportu",
        description: "Format pliku dla eksportu",
      },
      status: {
        label: "Status leada",
        description: "Filtruj według statusu leada",
      },
      country: {
        label: "Kraj",
        description: "Filtruj według kraju",
        placeholder: "Wybierz kraj",
      },
      language: {
        label: "Język",
        description: "Filtruj według języka",
        placeholder: "Wybierz język",
      },
      source: {
        label: "Źródło leada",
        description: "Filtruj według źródła leada",
        placeholder: "Wybierz źródło",
      },
      search: {
        label: "Szukaj",
        description: "Szukaj leadów według tekstu",
        placeholder: "Szukaj leadów...",
      },
      dateFrom: {
        label: "Data początkowa",
        description: "Eksportuj leady utworzone od tej daty",
      },
      dateTo: {
        label: "Data końcowa",
        description: "Eksportuj leady utworzone do tej daty",
      },
      includeMetadata: {
        label: "Uwzględnij metadane",
        description: "Uwzględnij znaczniki czasu utworzenia i aktualizacji",
      },
      includeEngagementData: {
        label: "Uwzględnij dane zaangażowania",
        description: "Uwzględnij śledzenie e-maili i dane kampanii",
      },
      response: {
        title: "Plik eksportu",
        description: "Wygenerowany plik eksportu z danymi leadów",
        fileName: "Nazwa pliku",
        fileContent: "Zawartość pliku (Base64)",
        mimeType: "Typ MIME",
        totalRecords: "Łączna liczba rekordów",
        exportedAt: "Wyeksportowano o",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja do eksportu leadów",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry eksportu lub filtry",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera podczas eksportu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas eksportu",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas eksportu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla eksportu leadów",
        },
        notFound: {
          title: "Brak danych",
          description: "Nie znaleziono leadów spełniających kryteria eksportu",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych podczas eksportu",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany w formularzu eksportu",
        },
      },
      success: {
        title: "Eksport zakończony",
        description: "Eksport leadów zakończony pomyślnie",
      },
    },
    widget: {
      exportLeads: "Eksportuj leady",
      import: "Importuj",
      viewList: "Zobacz listę",
      importLeadsTitle: "Importuj leady",
      viewLeadsListTitle: "Zobacz listę leadów",
      copyCsvTitle: "Kopiuj zawartość CSV do schowka",
      generatingExport: "Generowanie eksportu…",
      generatingExportHint:
        "Może to chwilę potrwać przy dużych zbiorach danych",
      exportReady: "Eksport gotowy",
      fileReadyToDownload: "Twój plik jest gotowy do pobrania",
      records: "Rekordy",
      format: "Format",
      fileSize: "Rozmiar pliku",
      copied: "Skopiowano!",
      copy: "Kopiuj",
      download: "Pobierz",
      exportedAt: "Wyeksportowano:",
      nextSteps: "Następne kroki:",
      viewLeads: "Zobacz leady",
      importLeads: "Importuj leady",
      configureExport: "Konfiguruj eksport",
      configureExportHint:
        "Wybierz format i filtry poniżej, a następnie kliknij Eksportuj aby wygenerować plik",
      formatLabel: "Format",
      formatHint: "Wybierz CSV lub Excel (XLSX)",
      statusFilter: "Filtr statusu",
      statusFilterHint: "Eksportuj tylko leady o określonym statusie",
      dateRange: "Zakres dat",
      dateRangeHint: "Ogranicz eksport do określonego okna czasowego",
      metadataEngagement: "Metadane i zaangażowanie",
      metadataEngagementHint:
        "Opcjonalnie uwzględnij dodatkowe kolumny dla zaawansowanej analizy",
      viewLeadsList: "Zobacz listę leadów",
      excelSpreadsheet: "Arkusz Excel",
      csvFile: "Plik CSV",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
      },
      leadStatus: {
        new: "Nowy",
        pending: "Oczekujący",
        campaignRunning: "Kampania aktywna",
        websiteUser: "Użytkownik strony",
        newsletterSubscriber: "Subskrybent newslettera",
        inContact: "W kontakcie",
        signedUp: "Zarejestrowany",
        subscriptionConfirmed: "Subskrypcja potwierdzona",
        unsubscribed: "Wypisany",
        bounced: "Odrzucony",
        invalid: "Nieprawidłowy",
      },
      leadSource: {
        website: "Strona WWW",
        socialMedia: "Media społecznościowe",
        emailCampaign: "Kampania e-mail",
        referral: "Polecenie",
        csvImport: "Import CSV",
      },
    },
    headers: {
      email: "E-mail",
      businessName: "Nazwa Firmy",
      contactName: "Imię Kontaktu",
      phone: "Telefon",
      country: "Kraj",
      language: "Język",
      status: "Status",
      source: "Źródło",
      website: "Strona WWW",
      notes: "Notatki",
      campaignStage: "Etap Kampanii",
      emailsSent: "Wysłane E-maile",
      emailsOpened: "Otwarte E-maile",
      emailsClicked: "Kliknięte E-maile",
      lastEmailSent: "Ostatni Wysłany E-mail",
      lastEngagement: "Ostatnie Zaangażowanie",
      unsubscribedAt: "Data Rezygnacji",
      createdAt: "Data Utworzenia",
      updatedAt: "Data Aktualizacji",
      lastEngagementAt: "Ostatnie Zaangażowanie",
      metadata: "Metadane",
      ipAddress: "Adres IP",
      userAgent: "User Agent",
      deviceType: "Typ Urządzenia",
      browser: "Przeglądarka",
      os: "System Operacyjny",
      referralCode: "Kod Polecający",
    },
  },
  import: {
    tags: {
      import: "Importuj",
      leads: "Leady",
      csv: "CSV",
    },

    category: "Import danych",
    post: {
      title: "Importuj leady",
      description: "Importuj leady z pliku CSV",
      form: {
        title: "Konfiguracja importu",
        description: "Skonfiguruj parametry importu leadów",
      },
      file: {
        label: "Plik CSV",
        description: "Zawartość pliku CSV (zakodowana base64)",
        placeholder: "Wklej zawartość CSV zakodowaną base64",
        helpText: "Prześlij plik CSV z danymi leadów",
      },
      fileName: {
        label: "Nazwa pliku",
        description: "Nazwa pliku CSV",
        placeholder: "leads.csv",
        helpText: "Podaj opisową nazwę pliku",
      },
      skipDuplicates: {
        label: "Pomiń duplikaty",
        description: "Pomiń leady z duplikowanymi adresami e-mail",
        helpText: "Włącz aby automatycznie pomijać istniejące adresy e-mail",
      },
      updateExisting: {
        label: "Aktualizuj istniejące",
        description: "Aktualizuj istniejące leady nowymi danymi",
        helpText: "Włącz aby aktualizować istniejące leady zamiast pomijać",
      },
      defaultCountry: {
        label: "Domyślny kraj",
        description: "Domyślny kraj dla leadów bez określonego kraju",
        helpText: "Wybierz domyślny kod kraju",
      },
      defaultLanguage: {
        label: "Domyślny język",
        description: "Domyślny język dla leadów bez określonego języka",
        helpText: "Wybierz domyślny kod języka",
      },
      defaultStatus: {
        label: "Domyślny status",
        description: "Domyślny status dla importowanych leadów",
        helpText: "Wybierz początkowy status dla nowych leadów",
      },
      defaultCampaignStage: {
        label: "Domyślny etap kampanii",
        description:
          "Domyślny etap kampanii e-mailowej dla importowanych leadów",
        helpText: "Wybierz początkowy etap kampanii",
      },
      defaultSource: {
        label: "Domyślne źródło",
        description: "Domyślna atrybucja źródła dla importowanych leadów",
        helpText: "Wybierz źródło leada do śledzenia",
      },
      useChunkedProcessing: {
        label: "Użyj przetwarzania fragmentami",
        description: "Przetwarzaj duże importy w tle fragmentami",
        helpText: "Włącz dla plików z więcej niż 1000 wierszami",
      },
      batchSize: {
        label: "Rozmiar partii",
        description: "Liczba wierszy do przetworzenia na partię",
        helpText: "Zalecane: 2000 wierszy na partię",
      },
      response: {
        batchId: "ID partii",
        totalRows: "Całkowita liczba wierszy",
        successfulImports: "Udane importy",
        failedImports: "Nieudane importy",
        duplicateEmails: "Duplikaty e-mail",
        errors: "Błędy importu",
        summary: "Podsumowanie importu",
        isChunkedProcessing: "Przetwarzanie fragmentami",
        jobId: "ID zadania w tle",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry importu lub format CSV",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja do importu leadów",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla importu leadów",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Plik CSV nie został znaleziony lub jest nieprawidłowy",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt danych podczas importu",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera podczas importu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas importu",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas importu",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany w formularzu importu",
        },
      },
      success: {
        title: "Import rozpoczęty",
        description: "Import leadów został pomyślnie zainicjowany",
      },
      widget: {
        headerTitle: "Importuj leady z CSV",
        exportTemplateButton: "Eksportuj szablon",
        importGuideTitle: "Przewodnik importu",
        importGuideSubtitle: "Prześlij plik CSV z następującymi kolumnami:",
        importGuideNote:
          "Tylko {{email}} jest wymagany. Wszystkie inne kolumny są opcjonalne i przyjmą domyślne wartości skonfigurowane poniżej.",
        fileRequirementsTitle: "Wymagania pliku",
        fileRequirementFormat:
          "Format: CSV (wartości rozdzielone przecinkami, kodowanie UTF-8)",
        fileRequirementHeader:
          "Pierwszy wiersz musi być wierszem nagłówkowym z nazwami kolumn",
        fileRequirementSize: "Zalecany maksymalny rozmiar: 50 MB na upload",
        fileRequirementChunked:
          "Dla plików większych niż ~5 000 wierszy włącz {{chunkedProcessing}}, aby uniknąć limitów czasowych",
        chunkedProcessingLabel: "Przetwarzanie fragmentami",
        downloadTemplateLink: "Pobierz szablon CSV",
        loadingText: "Importowanie lead\u00f3w\u2026",
        backgroundProcessingTitle: "Przetwarzanie w tle",
        backgroundProcessingNote:
          "Duży import umieszczony w kolejce jako zadanie: {{jobId}}. Przetwarzanie {{totalRows}} wierszy w tle.",
        checkJobStatusButton: "Sprawdź status zadania",
        stopJobButton: "Zatrzymaj zadanie",
        retryFailedButton: "Ponów nieudane",
        statTotalRows: "Wiersze łącznie",
        statImported: "Zaimportowane",
        statDuplicates: "Duplikaty",
        statFailed: "Nieudane",
        viewImportedLeadsButton: "Zobacz zaimportowane leady",
        retryFailedWithCountButton: "Ponów nieudane ({{count}})",
        summaryTitle: "Podsumowanie",
        summaryNewLeads: "Nowe leady",
        summaryUpdated: "Zaktualizowane",
        summarySkipped: "Pominięte",
        successRateLabel: "Wskaźnik sukcesu",
        importErrorsTitle: "{{count}} błędów importu",
        errorRowLabel: "Wiersz {{row}}",
        findLeadButton: "Znajdź lead",
      },
    },
    process: {
      tag: "Przetwarzanie importu",
      post: {
        title: "Przetwarzaj zadania importu",
        titleShort: "Przetwórz import",
        description: "Przetwarzaj oczekujące zadania importu CSV",
        container: {
          title: "Konfiguracja przetwarzania importu",
          description: "Skonfiguruj parametry przetwarzania importu",
        },
        fields: {
          maxJobsPerRun: {
            label: "Maks. zadań na przebieg",
            description: "Maksymalna liczba zadań do przetworzenia na przebieg",
          },
          maxRetriesPerJob: {
            label: "Maks. ponowień na zadanie",
            description: "Maksymalna liczba ponowień na zadanie",
          },
          dryRun: {
            label: "Próbny przebieg",
            description: "Uruchom bez wprowadzania zmian",
          },
          selfTaskId: {
            label: "Własne ID zadania",
            description:
              "Wewnętrzne ID zadania do samoczyszczenia po przetworzeniu",
          },
        },
        response: {
          jobsProcessed: "Przetworzone zadania",
          totalRowsProcessed: "Łącznie przetworzone wiersze",
          successfulImports: "Udane importy",
          failedImports: "Nieudane importy",
        },
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Dostęp zabroniony",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas przetwarzania importów",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry żądania",
          },
        },
        success: {
          title: "Przetwarzanie importu zakończone",
          description: "Zadania importu zostały pomyślnie przetworzone",
        },
      },
    },
    widget: {
      header: {
        title: "Zadania importu",
        newImport: "Nowy import",
      },
      filter: {
        all: "Wszystkie",
        completed: "Zako\u0144czone",
        failed: "Nieudane",
        pending: "Oczekuj\u0105ce",
        running: "W trakcie",
      },
      loading: "Wczytywanie zada\u0144 importu\u2026",
      empty: {
        title: "Nie znaleziono zada\u0144 importu",
        withFilter: "Spr\u00f3buj innego filtru lub rozpocznij nowy import.",
        withoutFilter:
          "Rozpocznij sw\u00f3j pierwszy import, aby zobaczy\u0107 go tutaj.",
        newImport: "Nowy import",
      },
    },
    jobs: {
      jobId: {
        category: "Import danych",
        tags: {
          leads: "Leady",
          management: "Zarządzanie",
        },

        get: {
          title: "Pobierz zadanie importu",
          description: "Pobierz szczegóły konkretnego zadania importu",
          actions: {
            retry: "Ponów",
            stop: "Zatrzymaj",
            viewLeads: "Zobacz leady",
          },
          jobId: {
            label: "ID zadania",
            description: "Unikalny identyfikator zadania importu",
          },
          form: {
            title: "Status zadania importu",
            description: "Bieżący status i postęp zadania importu",
          },
          response: {
            title: "Informacje o zadaniu",
            description: "Bieżące szczegóły zadania importu",
            info: {
              title: "Informacje o zadaniu",
              description: "Podstawowe szczegóły zadania",
            },
            id: {
              content: "ID zadania",
            },
            fileName: {
              content: "Nazwa pliku",
            },
            status: {
              content: "Status zadania",
            },
            progress: {
              title: "Postęp importu",
              description: "Bieżący postęp importu i statystyki",
            },
            totalRows: {
              content: "Łączna liczba wierszy",
            },
            processedRows: {
              content: "Przetworzone wiersze",
            },
            successfulImports: {
              content: "Udane importy",
            },
            failedImports: {
              content: "Nieudane importy",
            },
            duplicateEmails: {
              content: "Zduplikowane e-maile",
            },
            configuration: {
              title: "Konfiguracja zadania",
              description: "Bieżące ustawienia konfiguracji zadania",
            },
            currentBatchStart: {
              content: "Start bieżącej partii",
            },
            batchSize: {
              content: "Rozmiar partii",
            },
            retryCount: {
              content: "Liczba ponowień",
            },
            maxRetries: {
              content: "Maksymalna liczba ponowień",
            },
            error: {
              content: "Komunikat błędu",
            },
            timestamps: {
              title: "Znaczniki czasu zadania",
              description: "Znaczniki czasu cyklu życia zadania",
            },
            createdAt: {
              content: "Utworzono",
            },
            updatedAt: {
              content: "Zaktualizowano",
            },
            startedAt: {
              content: "Rozpoczęto",
            },
            completedAt: {
              content: "Ukończono",
            },
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Podane ID zadania jest nieprawidłowe",
            },
            unauthorized: {
              title: "Nieautoryzowany",
              description: "Wymagane uwierzytelnienie do przeglądania zadań",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description: "Nie masz uprawnień do przeglądania tego zadania",
            },
            notFound: {
              title: "Zadanie nie znalezione",
              description: "Nie znaleziono zadania importu o podanym ID",
            },
            server: {
              title: "Błąd serwera",
              description: "Wystąpił błąd podczas pobierania zadania",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt",
              description: "Wystąpił konflikt podczas pobierania zadania",
            },
          },
          success: {
            title: "Sukces",
            description: "Zadanie importu zostało pomyślnie pobrane",
          },
        },
        patch: {
          title: "Zaktualizuj zadanie importu",
          description: "Zaktualizuj ustawienia konfiguracji zadania importu",
          jobId: {
            label: "ID zadania",
            description: "Unikalny identyfikator zadania importu",
          },
          form: {
            title: "Zaktualizuj ustawienia zadania",
            description: "Zmodyfikuj konfigurację zadania importu",
          },
          settings: {
            title: "Ustawienia zadania",
            description: "Ustawienia konfiguracji dla zadania importu",
          },
          batchSize: {
            label: "Rozmiar partii",
            description: "Liczba wierszy do przetworzenia w każdej partii",
            placeholder: "100",
          },
          maxRetries: {
            label: "Maksymalna liczba ponowień",
            description:
              "Maksymalna liczba prób ponowienia dla nieudanych wierszy",
            placeholder: "3",
          },
          response: {
            title: "Zaktualizowane informacje o zadaniu",
            description: "Zaktualizowane szczegóły zadania importu",
            info: {
              title: "Informacje o zadaniu",
              description: "Podstawowe szczegóły zadania",
            },
            id: {
              content: "ID zadania",
            },
            fileName: {
              content: "Nazwa pliku",
            },
            status: {
              content: "Status zadania",
            },
            progress: {
              title: "Postęp importu",
              description: "Bieżący postęp importu i statystyki",
            },
            totalRows: {
              content: "Łączna liczba wierszy",
            },
            processedRows: {
              content: "Przetworzone wiersze",
            },
            successfulImports: {
              content: "Udane importy",
            },
            failedImports: {
              content: "Nieudane importy",
            },
            duplicateEmails: {
              content: "Zduplikowane e-maile",
            },
            configuration: {
              title: "Konfiguracja zadania",
              description: "Bieżące ustawienia konfiguracji zadania",
            },
            currentBatchStart: {
              content: "Start bieżącej partii",
            },
            batchSize: {
              content: "Rozmiar partii",
            },
            retryCount: {
              content: "Liczba ponowień",
            },
            maxRetries: {
              content: "Maksymalna liczba ponowień",
            },
            error: {
              content: "Komunikat błędu",
            },
            timestamps: {
              title: "Znaczniki czasu zadania",
              description: "Znaczniki czasu cyklu życia zadania",
            },
            createdAt: {
              content: "Utworzono",
            },
            updatedAt: {
              content: "Zaktualizowano",
            },
            startedAt: {
              content: "Rozpoczęto",
            },
            completedAt: {
              content: "Ukończono",
            },
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Podane dane są nieprawidłowe",
            },
            unauthorized: {
              title: "Nieautoryzowany",
              description: "Wymagane uwierzytelnienie do aktualizacji zadań",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description: "Nie masz uprawnień do aktualizacji tego zadania",
            },
            notFound: {
              title: "Zadanie nie znalezione",
              description: "Nie znaleziono zadania importu o podanym ID",
            },
            server: {
              title: "Błąd serwera",
              description: "Wystąpił błąd podczas aktualizacji zadania",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt aktualizacji",
              description:
                "Zadanie zostało zmodyfikowane przez innego użytkownika",
            },
          },
          success: {
            title: "Sukces",
            description: "Zadanie importu zostało pomyślnie zaktualizowane",
          },
        },
        delete: {
          title: "Usuń zadanie importu",
          description: "Usuń konkretne zadanie importu",
          jobId: {
            label: "ID zadania",
            description: "Unikalny identyfikator zadania importu do usunięcia",
          },
          form: {
            title: "Usuń zadanie importu",
            description: "Potwierdź usunięcie zadania importu",
          },
          response: {
            title: "Wynik usunięcia",
            description: "Wynik operacji usunięcia",
            success: {
              content: "Status sukcesu",
            },
            message: {
              content: "Komunikat usunięcia",
            },
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Podane ID zadania jest nieprawidłowe",
            },
            unauthorized: {
              title: "Nieautoryzowany",
              description: "Wymagane uwierzytelnienie do usuwania zadań",
            },
            forbidden: {
              title: "Dostęp zabroniony",
              description: "Nie masz uprawnień do usunięcia tego zadania",
            },
            notFound: {
              title: "Zadanie nie znalezione",
              description: "Nie znaleziono zadania importu o podanym ID",
            },
            server: {
              title: "Błąd serwera",
              description: "Wystąpił błąd podczas usuwania zadania",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            network: {
              title: "Błąd sieci",
              description: "Nie można połączyć się z serwerem",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Masz niezapisane zmiany",
            },
            conflict: {
              title: "Konflikt usuwania",
              description:
                "Nie można usunąć zadania, które jest obecnie przetwarzane",
            },
          },
          success: {
            title: "Sukces",
            description: "Zadanie importu zostało pomyślnie usunięte",
          },
        },
        retry: {
          category: "Import danych",
          tags: {
            leads: "Leady",
            management: "Zarządzanie",
          },

          post: {
            title: "Ponów zadanie importu",
            description: "Ponów nieudane zadanie importu",
            jobId: {
              label: "ID zadania",
              description:
                "Unikalny identyfikator zadania importu do ponowienia",
            },
            form: {
              title: "Ponów zadanie importu",
              description: "Ponów nieudane zadanie importu",
            },
            response: {
              title: "Wynik ponowienia",
              description: "Wynik operacji ponowienia",
              success: {
                content: "Status sukcesu",
              },
              message: {
                content: "Wiadomość o ponowieniu",
              },
            },
            errors: {
              validation: {
                title: "Błąd walidacji",
                description: "Podane ID zadania jest nieprawidłowe",
              },
              unauthorized: {
                title: "Brak autoryzacji",
                description: "Wymagana autoryzacja do ponowienia zadań",
              },
              forbidden: {
                title: "Dostęp zabroniony",
                description: "Nie masz uprawnień do ponowienia tego zadania",
              },
              notFound: {
                title: "Zadanie nie znalezione",
                description: "Nie znaleziono zadania importu o podanym ID",
              },
              server: {
                title: "Błąd serwera",
                description: "Wystąpił błąd podczas ponowienia zadania",
              },
              unknown: {
                title: "Nieznany błąd",
                description: "Wystąpił nieoczekiwany błąd",
              },
              network: {
                title: "Błąd sieci",
                description: "Nie można połączyć się z serwerem",
              },
              unsavedChanges: {
                title: "Niezapisane zmiany",
                description: "Masz niezapisane zmiany",
              },
              conflict: {
                title: "Konflikt ponowienia",
                description:
                  "Nie można ponowić zadania, które jest obecnie przetwarzane",
              },
            },
            success: {
              title: "Sukces",
              description: "Zadanie importu zostało pomyślnie ponowione",
            },
          },
          widget: {
            title: "Ponów zadanie importu",
            successMessage: "Ponowienie zadania zostało pomyślnie zainicjowane",
          },
        },
        stop: {
          category: "Import danych",
          tags: {
            leads: "Leady",
            management: "Zarządzanie",
          },

          post: {
            title: "Zatrzymaj zadanie importu",
            description: "Zatrzymaj uruchomione zadanie importu",
            jobId: {
              label: "ID zadania",
              description:
                "Unikalny identyfikator zadania importu do zatrzymania",
            },
            form: {
              title: "Zatrzymaj zadanie importu",
              description: "Zatrzymaj uruchomione zadanie importu",
            },
            response: {
              title: "Wynik zatrzymania",
              description: "Wynik operacji zatrzymania",
              success: {
                content: "Status sukcesu",
              },
              message: {
                content: "Wiadomość o zatrzymaniu",
              },
            },
            errors: {
              validation: {
                title: "Błąd walidacji",
                description: "Podane ID zadania jest nieprawidłowe",
              },
              unauthorized: {
                title: "Brak autoryzacji",
                description: "Wymagana autoryzacja do zatrzymania zadań",
              },
              forbidden: {
                title: "Dostęp zabroniony",
                description: "Nie masz uprawnień do zatrzymania tego zadania",
              },
              notFound: {
                title: "Zadanie nie znalezione",
                description: "Nie znaleziono zadania importu o podanym ID",
              },
              server: {
                title: "Błąd serwera",
                description: "Wystąpił błąd podczas zatrzymywania zadania",
              },
              unknown: {
                title: "Nieznany błąd",
                description: "Wystąpił nieoczekiwany błąd",
              },
              network: {
                title: "Błąd sieci",
                description: "Nie można połączyć się z serwerem",
              },
              unsavedChanges: {
                title: "Niezapisane zmiany",
                description: "Masz niezapisane zmiany",
              },
              conflict: {
                title: "Konflikt zatrzymania",
                description:
                  "Nie można zatrzymać zadania, które nie jest obecnie przetwarzane",
              },
            },
            success: {
              title: "Sukces",
              description: "Zadanie importu zostało pomyślnie zatrzymane",
            },
          },
          widget: {
            title: "Zatrzymaj zadanie importu",
            successMessage: "Zadanie zostało pomyślnie zatrzymane",
          },
        },
        widget: {
          status: {
            title: "Status zadania importu",
            loadingJobStatus: "Ładowanie statusu zadania…",
            totalRows: "Łączna liczba wierszy",
            processed: "Przetworzone",
            imported: "Zaimportowane",
            failed: "Nieudane",
            duplicates: "Duplikaty",
            progress: "Postęp",
            configurationTitle: "Konfiguracja",
            batchSize: "Rozmiar partii",
            batchStart: "Start partii",
            retries: "Ponowienia",
            timestampsTitle: "Znaczniki czasu",
            created: "Utworzono",
            started: "Rozpoczęto",
            completed: "Ukończono",
            jobStatus: {
              enums: {
                csvImportJobStatus: {
                  pending: "Oczekujące",
                  processing: "W trakcie przetwarzania",
                  completed: "Ukończone",
                  failed: "Nieudane",
                },
              },
            },
          },
          retry: {
            title: "Powtórz zadanie importu",
            loadingRetrying: "Powtarzanie zadania…",
            successMessage: "Zadanie powtórzone pomyślnie",
            failureMessage: "Powtarzanie nieudane",
            viewJobStatus: "Zobacz status zadania",
            viewLeads: "Zobacz leady",
          },
          stop: {
            title: "Zatrzymaj zadanie importu",
            loadingStopping: "Zatrzymywanie zadania…",
            successMessage: "Zadanie zatrzymane pomyślnie",
            failureMessage: "Zatrzymanie nieudane",
            viewLeads: "Zobacz leady",
            startNewImport: "Rozpocznij nowy import",
          },
        },
      },
    },
    status: {
      category: "Import danych",
      tags: {
        import: "Importuj",
        jobs: "Zadania",
        list: "Lista",
      },

      get: {
        title: "Status Zadań Importu",
        description: "Wyświetl i monitoruj zadania importu CSV",
        form: {
          title: "Filtry Zadań",
          description: "Filtruj zadania importu według statusu i paginacji",
        },
        filters: {
          title: "Filtry",
          description: "Opcje filtrowania dla zadań importu",
        },
        status: {
          label: "Status Zadania",
          description: "Filtruj według statusu zadania",
          placeholder: "Wybierz status",
        },
        limit: {
          label: "Wyników na Stronę",
          description: "Liczba zadań do zwrócenia",
          placeholder: "50",
        },
        offset: {
          label: "Przesunięcie Strony",
          description: "Liczba zadań do pominięcia",
          placeholder: "0",
        },
        response: {
          title: "Zadania Importu",
          description: "Lista zadań importu z ich aktualnym statusem",
          items: {
            title: "Lista Zadań",
          },
        },
        errors: {
          validation: {
            title: "Błąd Walidacji",
            description: "Nieprawidłowe parametry filtrowania",
          },
          unauthorized: {
            title: "Brak Autoryzacji",
            description: "Wymagana autoryzacja do wyświetlania zadań importu",
          },
          forbidden: {
            title: "Zabronione",
            description: "Dostęp zabroniony dla zadań importu",
          },
          notFound: {
            title: "Nie Znaleziono",
            description: "Nie znaleziono zadań importu",
          },
          server: {
            title: "Błąd Serwera",
            description: "Wewnętrzny błąd serwera podczas pobierania zadań",
          },
          unknown: {
            title: "Nieznany Błąd",
            description: "Wystąpił nieznany błąd",
          },
          network: {
            title: "Błąd Sieci",
            description: "Błąd sieci podczas pobierania zadań",
          },
          unsavedChanges: {
            title: "Niezapisane Zmiany",
            description: "Są niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt danych",
          },
        },
        success: {
          title: "Pobrano Zadania",
          description: "Lista zadań importu została pobrana pomyślnie",
        },
      },
      widget: {
        status: {
          pending: "Oczekujące",
          running: "W toku",
          completed: "Zakończone",
          failed: "Nieudane",
          stopped: "Zatrzymane",
        },
        filter: {
          all: "Wszystkie",
          pending: "Oczekujące",
          running: "W toku",
          completed: "Zakończone",
          failed: "Nieudane",
        },
        progress: {
          rows: "wierszy",
        },
        job: {
          total: "Łącznie:",
          processed: "Przetworzono:",
          ok: "OK:",
          fail: "Błąd:",
          created: "Utworzono:",
          done: "Gotowe:",
        },
        header: {
          title: "Zadania Importu",
          newImport: "Nowy Import",
        },
        loading: "Ładowanie zadań importu\u2026",
        empty: {
          title: "Nie znaleziono zadań importu",
          withFilter: "Spróbuj innego filtra lub rozpocznij nowy import.",
          withoutFilter: "Rozpocznij pierwszy import, aby go tutaj zobaczyć.",
          newImport: "Nowy Import",
        },
      },
    },
    csv: {
      post: {
        title: "Importuj Dane CSV",
        description:
          "Importuj dane z plików CSV z inteligentnym przetwarzaniem i walidacją",
        form: {
          title: "Konfiguracja Importu CSV",
          description:
            "Skonfiguruj ustawienia importu CSV dla optymalnych rezultatów",
        },
        fileSection: {
          title: "Wgrywanie Pliku",
          description: "Wybierz plik CSV i określ domenę docelową",
        },
        file: {
          label: "Plik CSV",
          description: "Wybierz plik CSV do wgrania (max 10MB)",
          placeholder: "Wybierz plik CSV...",
          helpText:
            "Obsługiwany format: CSV z wartościami oddzielonymi przecinkami. Pierwszy wiersz powinien zawierać nagłówki kolumn.",
        },
        fileName: {
          label: "Nazwa Pliku",
          description: "Nazwa tego importu (dla referencji)",
          placeholder: "np. Import Leadów Styczeń 2024",
        },
        domain: {
          label: "Domena Importu",
          description: "Jaki typ danych importujesz?",
          placeholder: "Wybierz typ danych...",
        },
        processingSection: {
          title: "Opcje Przetwarzania",
          description: "Skonfiguruj sposób przetwarzania twoich danych",
        },
        skipDuplicates: {
          label: "Pomiń Duplikaty",
          description: "Pomiń rekordy z duplikowanymi adresami email",
          helpText:
            "Zalecane: Zapobiega importowaniu tego samego kontaktu dwukrotnie",
        },
        updateExisting: {
          label: "Aktualizuj Istniejące",
          description: "Aktualizuj istniejące rekordy nowymi danymi z CSV",
          helpText:
            "Jeśli niezaznaczone, istniejące rekordy pozostaną niezmienione",
        },
        useChunkedProcessing: {
          label: "Przetwarzanie w Tle",
          description: "Przetwarzaj duże pliki w tle",
          helpText: "Zalecane dla plików z więcej niż 500 rekordami",
        },
        batchSize: {
          label: "Rozmiar Partii",
          description: "Liczba rekordów przetwarzanych jednocześnie",
          placeholder: "100",
          helpText: "Mniejsze partie są stabilniejsze, większe szybsze",
        },
        defaultsSection: {
          title: "Wartości Domyślne (Opcjonalne)",
          description:
            "Ustaw domyślne wartości dla rekordów bez tych informacji",
        },
        defaultCountry: {
          label: "Domyślny Kraj",
          description: "Kraj dla rekordów bez lokalizacji",
          placeholder: "Wybierz kraj...",
        },
        defaultLanguage: {
          label: "Domyślny Język",
          description: "Język dla rekordów bez preferencji językowych",
          placeholder: "Wybierz język...",
        },
        response: {
          title: "Wyniki Importu",
          description: "Podsumowanie operacji importu CSV",
          basicResults: {
            title: "Podstawowe Wyniki",
            description: "Podstawowe statystyki importu",
          },
          batchId: {
            label: "ID Partii",
          },
          totalRows: {
            label: "Całkowita liczba wierszy",
          },
          isChunkedProcessing: {
            label: "Przetwarzanie w tle",
          },
          jobId: {
            label: "ID Joba",
          },
          statistics: {
            title: "Statystyki Importu",
            description: "Szczegółowy podział operacji importu",
          },
          successfulImports: {
            label: "Udane Importy",
          },
          failedImports: {
            label: "Nieudane Importy",
          },
          duplicateEmails: {
            label: "Zduplikowane E-maile",
          },
          processingTimeMs: {
            label: "Czas przetwarzania (ms)",
          },
          summary: {
            title: "Podsumowanie Importu",
            description: "Przegląd wyników importu",
          },
          newRecords: {
            label: "Nowe Rekordy",
          },
          updatedRecords: {
            label: "Zaktualizowane Rekordy",
          },
          skippedDuplicates: {
            label: "Pominięte Duplikaty",
          },
          errors: {
            title: "Szczegóły Błędów",
            row: {
              label: "Wiersz",
            },
            email: {
              label: "E-mail",
            },
            error: {
              label: "Błąd",
            },
          },
          nextSteps: {
            title: "Następne Kroki",
            item: {
              label: "Następny Krok",
            },
          },
        },
        errors: {
          validation: {
            title: "Nieprawidłowe Dane Importu",
            description: "Sprawdź plik CSV i ustawienia",
            emptyFile: "Zawartość pliku CSV jest wymagana",
            emptyFileName: "Podaj nazwę tego importu",
            invalidDomain: "Wybierz prawidłową domenę importu",
            invalidBatchSize: "Rozmiar partii musi być między 10 a 1000",
            fileTooLarge:
              "Rozmiar pliku przekracza limit 10MB. Rozważ przetwarzanie w tle.",
          },
          unauthorized: {
            title: "Dostęp Zabroniony",
            description: "Nie masz uprawnień do importowania danych",
          },
          fileTooLarge: {
            title: "Plik Za Duży",
            description:
              "Wybrany plik przekracza maksymalny limit rozmiaru 10MB",
          },
          server: {
            title: "Import Nieudany",
            description:
              "Wystąpił błąd podczas przetwarzania importu. Spróbuj ponownie.",
          },
          network: {
            title: "Błąd Sieci",
            description: "Połączenie sieciowe nie powiodło się podczas importu",
          },
          forbidden: {
            title: "Zabronione",
            description: "Nie masz uprawnień do wykonania tego importu",
          },
          notFound: {
            title: "Nie Znaleziono",
            description: "Zasób importu nie został znaleziony",
          },
          unknown: {
            title: "Nieznany Błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane Zmiany",
            description: "Masz niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt Danych",
            description: "Wystąpił konflikt z istniejącymi danymi",
          },
        },
        success: {
          title: "Import Udany",
          description: "Twoje dane CSV zostały pomyślnie zaimportowane",
        },
      },
    },
    enum: {
      status: {
        pending: {
          label: "Oczekujący",
          description: "Job czeka na przetworzenie",
        },
        processing: {
          label: "Przetwarzanie",
          description: "Job jest obecnie przetwarzany",
        },
        completed: {
          label: "Zakończony",
          description: "Job zakończony pomyślnie",
        },
        failed: {
          label: "Nieudany",
          description: "Job napotkał błąd",
        },
        cancelled: {
          label: "Anulowany",
          description: "Job został anulowany przez użytkownika",
        },
        paused: {
          label: "Wstrzymany",
          description: "Przetwarzanie joba jest tymczasowo wstrzymane",
        },
      },
      domain: {
        leads: {
          label: "Leady",
          description: "Potencjalni klienci i kontakty biznesowe",
        },
        contacts: {
          label: "Kontakty",
          description: "Ogólne informacje kontaktowe i książka adresowa",
        },
        businessData: {
          label: "Dane Biznesowe",
          description: "Informacje o firmach i profile biznesowe",
        },
        emails: {
          label: "Listy Email",
          description: "Listy marketingu emailowego i kampanie",
        },
        users: {
          label: "Użytkownicy",
          description: "Użytkownicy systemu i informacje o kontach",
        },
        templates: {
          label: "Szablony",
          description: "Szablony email i treści",
        },
      },
      format: {
        csv: {
          label: "Plik CSV",
          description: "Wartości oddzielone przecinkami (najczęstsze)",
        },
        xlsx: {
          label: "Plik Excel",
          description: "Arkusz kalkulacyjny Microsoft Excel",
        },
        json: {
          label: "Plik JSON",
          description: "Dane JavaScript Object Notation",
        },
        tsv: {
          label: "Plik TSV",
          description: "Wartości oddzielone tabulatorami",
        },
      },
      processing: {
        immediate: {
          label: "Przetwórz Teraz",
          description: "Przetwórz plik natychmiast (najszybsze)",
        },
        background: {
          label: "W Tle",
          description: "Przetwarzaj w tle (dla dużych plików)",
        },
        scheduled: {
          label: "Zaplanuj Później",
          description: "Zaplanuj przetwarzanie na określony czas",
        },
      },
      errorType: {
        validation: {
          label: "Błąd Walidacji",
          description: "Dane nie spełniają wymaganego formatu lub zasad",
        },
        duplicate: {
          label: "Duplikat Danych",
          description: "Rekord już istnieje w systemie",
        },
        format: {
          label: "Błąd Formatu",
          description: "Format pliku jest nieprawidłowy lub uszkodzony",
        },
        processing: {
          label: "Błąd Przetwarzania",
          description: "Błąd wystąpił podczas przetwarzania danych",
        },
        system: {
          label: "Błąd Systemu",
          description: "Wewnętrzny błąd systemu",
        },
      },
      batchSize: {
        small: {
          label: "Mały (50)",
          description: "Najlepszy do testów lub małych importów",
        },
        medium: {
          label: "Średni (100)",
          description: "Zalecany dla większości importów",
        },
        large: {
          label: "Duży (250)",
          description: "Dobry dla dużych plików z prostymi danymi",
        },
        xlarge: {
          label: "Bardzo Duży (500)",
          description: "Dla bardzo dużych plików (zaawansowani użytkownicy)",
        },
      },
    },
    nextSteps: {
      reviewErrors:
        "Przejrzyj szczegóły błędów, aby zrozumieć co poszło nie tak",
      checkDuplicates: "Rozważ dostosowanie ustawień obsługi duplikatów",
      reviewLeads: "Przejrzyj zaimportowane leady w sekcji zarządzania leadami",
      startCampaign: "Rozważ rozpoczęcie kampanii email z nowymi leadami",
      reviewContacts: "Przejrzyj zaimportowane kontakty w sekcji kontaktów",
      organizeContacts: "Uporządkuj kontakty w grupy lub tagi",
      reviewImported: "Przejrzyj zaimportowane dane w odpowiedniej sekcji",
      monitorProgress: "Monitoruj postęp w historii jobów",
      checkJobsList:
        "Sprawdź listę jobów dla szczegółowych aktualizacji statusu",
    },
    errors: {
      cancel: {
        server: "Nie udało się anulować joba importu",
      },
      retry: {
        server: "Nie udało się ponowić joba importu",
      },
      delete: {
        server: "Nie udało się usunąć joba importu",
      },
      status: {
        server: "Nie udało się pobrać statusu joba",
      },
    },
    error: {
      default: "Wystąpił błąd",
    },
    enums: {
      csvImportJobStatus: {
        pending: "Oczekujący",
        processing: "W trakcie",
        completed: "Zakończony",
        failed: "Nieudany",
      },
      csvImportJobAction: {
        retry: "Ponów",
        delete: "Usuń",
        stop: "Zatrzymaj",
      },
      importMode: {
        createOnly: "Tylko tworzenie",
        updateOnly: "Tylko aktualizacja",
        createOrUpdate: "Tworzenie lub aktualizacja",
        skipDuplicates: "Pomiń duplikaty",
      },
      importFormat: {
        csv: "CSV",
        tsv: "TSV",
        json: "JSON",
      },
      importProcessingType: {
        immediate: "Natychmiastowe",
        chunked: "Fragmentami",
        scheduled: "Zaplanowane",
      },
      importErrorType: {
        validationError: "Błąd walidacji",
        duplicateEmail: "Duplikat e-maila",
        invalidFormat: "Niepoprawny format",
        missingRequiredField: "Brak wymaganego pola",
        processingError: "Błąd przetwarzania",
        systemError: "Błąd systemu",
      },
      batchProcessingStatus: {
        pending: "Oczekujący",
        processing: "W trakcie",
        completed: "Zakończony",
        failed: "Nieudany",
        retrying: "Ponowienie",
      },
      importPriority: {
        low: "Niski",
        normal: "Normalny",
        high: "Wysoki",
        urgent: "Pilny",
      },
      importSource: {
        webUpload: "Upload web",
        apiUpload: "Upload API",
        scheduledImport: "Import zaplanowany",
        bulkOperation: "Operacja masowa",
      },
      csvDelimiter: {
        comma: "Przecinek",
        semicolon: "Średnik",
        tab: "Tabulator",
        pipe: "Kreska pionowa",
      },
      importValidationLevel: {
        strict: "Ścisły",
        moderate: "Umiarkowany",
        lenient: "Łagodny",
      },
      importNotificationType: {
        email: "E-mail",
        inApp: "W aplikacji",
        webhook: "Webhook",
        none: "Brak",
      },
      leadStatus: {
        new: "Nowy",
        pending: "Oczekujący",
        campaignRunning: "Kampania aktywna",
        websiteUser: "Użytkownik strony",
        newsletterSubscriber: "Subskrybent newslettera",
        inContact: "W kontakcie",
        signedUp: "Zarejestrowany",
        subscriptionConfirmed: "Subskrypcja potwierdzona",
        unsubscribed: "Wypisany",
        bounced: "Odrzucony",
        invalid: "Nieprawidłowy",
      },
      emailCampaignStage: {
        notStarted: "Nie rozpoczęto",
        initial: "Pierwszy kontakt",
        followup1: "Follow-up 1",
        followup2: "Follow-up 2",
        followup3: "Follow-up 3",
        nurture: "Pielęgnowanie",
        reactivation: "Reaktywacja",
      },
      leadSource: {
        website: "Strona WWW",
        socialMedia: "Media społecznościowe",
        emailCampaign: "Kampania e-mail",
        referral: "Polecenie",
        csvImport: "Import CSV",
      },
    },
  },
  lead: {
    id: {
      category: "Leads",
      tags: {
        leads: "Leady",
        management: "Zarządzanie",
      },

      get: {
        title: "Pobierz szczegóły leada",
        description: "Pobierz szczegółowe informacje o określonym leadzie",
        backButton: {
          label: "Powrót do leadów",
        },
        editButton: {
          label: "Edytuj leada",
        },
        deleteButton: {
          label: "Usuń leada",
        },
        id: {
          label: "ID leada",
          description: "Unikalny identyfikator leada",
        },
        form: {
          title: "Żądanie szczegółów leada",
          description: "Parametry żądania dla informacji o leadzie",
        },
        response: {
          title: "Informacje o leadzie",
          description: "Pełne szczegóły leada i historia",
          basicInfo: {
            title: "Podstawowe informacje",
            description: "Podstawowa identyfikacja i status leada",
          },
          id: {
            content: "ID leada",
          },
          email: {
            content: "Adres e-mail",
          },
          businessName: {
            content: "Nazwa firmy",
          },
          contactName: {
            content: "Imię i nazwisko kontaktu",
          },
          status: {
            content: "Status leada",
          },
          contactDetails: {
            title: "Dane kontaktowe",
            description: "Informacje kontaktowe i preferencje",
          },
          phone: {
            content: "Numer telefonu",
          },
          website: {
            content: "Adres strony",
          },
          country: {
            content: "Kraj",
          },
          language: {
            content: "Język",
          },
          campaignTracking: {
            title: "Śledzenie kampanii",
            description: "Informacje o kampanii e-mailowej i śledzeniu",
          },
          source: {
            content: "Źródło leada",
          },
          currentCampaignStage: {
            content: "Aktualna faza kampanii",
          },
          emailJourneyVariant: {
            content: "Wariant ścieżki e-mailowej",
          },
          emailsSent: {
            content: "Wysłane e-maile",
          },
          lastEmailSentAt: {
            content: "Ostatni e-mail wysłany",
          },
          engagement: {
            title: "Wskaźniki zaangażowania",
            description: "Dane zaangażowania e-mailowego i interakcji",
          },
          emailsOpened: {
            content: "Otwarte e-maile",
          },
          emailsClicked: {
            content: "Kliknięte e-maile",
          },
          lastEngagementAt: {
            content: "Ostatnie zaangażowanie",
          },
          unsubscribedAt: {
            content: "Wypisano dnia",
          },
          conversion: {
            title: "Śledzenie konwersji",
            description: "Śledzenie konwersji i kamieni milowych leada",
          },
          convertedUserId: {
            content: "ID skonwertowanego użytkownika",
          },
          convertedAt: {
            content: "Skonwertowany dnia",
          },
          signedUpAt: {
            content: "Zarejestrowany dnia",
          },
          subscriptionConfirmedAt: {
            content: "Subskrypcja potwierdzona dnia",
          },
          metadata: {
            title: "Dodatkowe informacje",
            description: "Notatki i metadane",
            content: "Metadane",
          },
          notes: {
            content: "Notatki",
          },
          createdAt: {
            content: "Utworzony dnia",
          },
          updatedAt: {
            content: "Zaktualizowany dnia",
          },
          identity: {
            title: "Urządzenie i tożsamość",
            description: "Dane identyfikacyjne i informacje o urządzeniu",
          },
          ipAddress: {
            content: "Adres IP",
          },
          userAgent: {
            content: "User Agent",
          },
          deviceType: {
            content: "Typ urządzenia",
          },
          browser: {
            content: "Przeglądarka",
          },
          os: {
            content: "System operacyjny",
          },
          referralCode: {
            content: "Kod polecenia",
          },
          lifecycle: {
            title: "Cykl życia",
            description: "Dodatkowe znaczniki czasu cyklu życia",
          },
          bouncedAt: {
            content: "Odrzucony dnia",
          },
          invalidAt: {
            content: "Nieprawidłowy od",
          },
          campaignStartedAt: {
            content: "Kampania rozpoczęta dnia",
          },
          linkedLeads: {
            title: "Powiązane leady",
            description: "Leady zidentyfikowane jako ta sama osoba",
            linkedLeadId: {
              content: "ID powiązanego leada",
            },
            linkReason: {
              content: "Powód powiązania",
            },
            linkedAt: {
              content: "Powiązany dnia",
            },
            email: {
              content: "E-mail",
            },
            businessName: {
              content: "Nazwa firmy",
            },
            status: {
              content: "Status",
            },
            ipAddress: {
              content: "Adres IP",
            },
            userAgent: {
              content: "User Agent",
            },
            createdAt: {
              content: "Utworzony dnia",
            },
          },
          linkedUsers: {
            title: "Powiązane konta użytkowników",
            description: "Konta użytkowników powiązane z tym leadem",
            userId: {
              content: "ID użytkownika",
            },
            linkReason: {
              content: "Powód powiązania",
            },
            linkedAt: {
              content: "Powiązany dnia",
            },
            email: {
              content: "E-mail",
            },
            publicName: {
              content: "Wyświetlana nazwa",
            },
          },
          referralHistory: {
            title: "Historia poleceń",
            description:
              "Kody polecające, które lead kliknął przed rejestracją",
            code: {
              content: "Kod polecający",
            },
            ownerUserId: {
              content: "Właściciel kodu",
            },
            clickedAt: {
              content: "Kliknięty dnia",
            },
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Podane ID leada jest nieprawidłowe",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description:
              "Wymagana autentykacja aby uzyskać dostęp do szczegółów leada",
          },
          forbidden: {
            title: "Dostęp zabroniony",
            description: "Nie masz uprawnień do wyświetlenia tego leada",
          },
          notFound: {
            title: "Lead nie znaleziony",
            description: "Nie znaleziono leada z podanym ID",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas pobierania szczegółów leada",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt danych",
            description: "Dane leada zostały zmodyfikowane",
          },
        },
        success: {
          title: "Sukces",
          description: "Szczegóły leada pobrane pomyślnie",
        },
      },
      patch: {
        title: "Zaktualizuj leada",
        description: "Zaktualizuj informacje i status leada",
        backButton: {
          label: "Powrót do leada",
        },
        deleteButton: {
          label: "Usuń leada",
        },
        submitButton: {
          label: "Zaktualizuj leada",
          loadingText: "Aktualizowanie leada...",
        },
        id: {
          label: "ID leada",
          description: "Unikalny identyfikator leada do aktualizacji",
        },
        form: {
          title: "Zaktualizuj leada",
          description: "Edytuj informacje o leadzie",
        },
        updates: {
          title: "Aktualizacje leada",
          description: "Pola do aktualizacji",
        },
        basicInfo: {
          title: "Podstawowe informacje",
          description: "Zaktualizuj podstawowe dane leada",
        },
        email: {
          label: "Adres e-mail",
          description: "Adres e-mail leada",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "Nazwa firmy",
          description: "Nazwa przedsiębiorstwa",
          placeholder: "Firma Sp. z o.o.",
        },
        contactName: {
          label: "Imię i nazwisko kontaktu",
          description: "Główna osoba kontaktowa",
          placeholder: "Jan Kowalski",
        },
        status: {
          label: "Status leada",
          description: "Aktualny status leada",
          placeholder: "Wybierz status",
        },
        contactDetails: {
          title: "Dane kontaktowe",
          description: "Zaktualizuj informacje kontaktowe",
        },
        phone: {
          label: "Numer telefonu",
          description: "Numer telefonu kontaktowego",
          placeholder: "+48123456789",
        },
        website: {
          label: "Strona internetowa",
          description: "Adres strony internetowej firmy",
          placeholder: "https://example.pl",
        },
        country: {
          label: "Kraj",
          description: "Kraj firmy",
          placeholder: "Wybierz kraj",
        },
        language: {
          label: "Język",
          description: "Preferowany język",
          placeholder: "Wybierz język",
        },
        campaignManagement: {
          title: "Zarządzanie kampanią",
          description: "Zarządzaj ustawieniami kampanii",
        },
        source: {
          label: "Źródło leada",
          description: "Pochodzenie leada",
          placeholder: "Wybierz źródło",
        },
        currentCampaignStage: {
          label: "Faza kampanii",
          description: "Aktualna faza kampanii e-mailowej",
          placeholder: "Wybierz fazę",
        },
        additionalDetails: {
          title: "Dodatkowe szczegóły",
          description: "Notatki i metadane",
        },
        notes: {
          label: "Notatki",
          description: "Wewnętrzne notatki o leadzie",
          placeholder: "Dodaj tutaj notatki",
        },
        metadata: {
          label: "Metadane",
          description: "Dodatkowe metadane (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "ID skonwertowanego użytkownika",
          description: "ID skonwertowanego konta użytkownika",
          placeholder: "ID użytkownika",
        },
        subscriptionConfirmedAt: {
          label: "Subskrypcja potwierdzona dnia",
          description: "Data potwierdzenia subskrypcji",
          placeholder: "Wybierz datę",
        },
        response: {
          title: "Zaktualizowany lead",
          description: "Zaktualizowane informacje o leadzie",
          basicInfo: {
            title: "Podstawowe informacje",
            description: "Zaktualizowane podstawowe dane leada",
          },
          id: {
            content: "ID leada",
          },
          email: {
            content: "Adres e-mail",
          },
          businessName: {
            content: "Nazwa firmy",
          },
          contactName: {
            content: "Imię i nazwisko kontaktu",
          },
          status: {
            content: "Status leada",
          },
          contactDetails: {
            title: "Dane kontaktowe",
            description: "Zaktualizowane informacje kontaktowe",
          },
          phone: {
            content: "Numer telefonu",
          },
          website: {
            content: "Adres strony",
          },
          country: {
            content: "Kraj",
          },
          language: {
            content: "Język",
          },
          campaignTracking: {
            title: "Śledzenie kampanii",
            description: "Zaktualizowane informacje o kampanii",
          },
          source: {
            content: "Źródło leada",
          },
          currentCampaignStage: {
            content: "Aktualna faza kampanii",
          },
          emailJourneyVariant: {
            content: "Wariant ścieżki e-mailowej",
          },
          emailsSent: {
            content: "Wysłane e-maile",
          },
          lastEmailSentAt: {
            content: "Ostatni e-mail wysłany",
          },
          engagement: {
            title: "Wskaźniki zaangażowania",
            description: "Dane zaangażowania e-mailowego",
          },
          emailsOpened: {
            content: "Otwarte e-maile",
          },
          emailsClicked: {
            content: "Kliknięte e-maile",
          },
          lastEngagementAt: {
            content: "Ostatnie zaangażowanie",
          },
          unsubscribedAt: {
            content: "Wypisano dnia",
          },
          conversion: {
            title: "Śledzenie konwersji",
            description: "Śledzenie kamieni milowych konwersji",
          },
          convertedUserId: {
            content: "ID skonwertowanego użytkownika",
          },
          convertedAt: {
            content: "Skonwertowany dnia",
          },
          signedUpAt: {
            content: "Zarejestrowany dnia",
          },
          subscriptionConfirmedAt: {
            content: "Subskrypcja potwierdzona dnia",
          },
          metadata: {
            title: "Dodatkowe informacje",
            description: "Notatki i metadane",
            content: "Metadane",
          },
          notes: {
            content: "Notatki",
          },
          createdAt: {
            content: "Utworzony dnia",
          },
          updatedAt: {
            content: "Zaktualizowany dnia",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Podane dane są nieprawidłowe",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagana autentykacja aby aktualizować leadów",
          },
          forbidden: {
            title: "Dostęp zabroniony",
            description: "Nie masz uprawnień do aktualizacji tego leada",
          },
          notFound: {
            title: "Lead nie znaleziony",
            description: "Nie znaleziono leada z podanym ID",
          },
          conflict: {
            title: "Konflikt aktualizacji",
            description: "Lead został zmodyfikowany przez innego użytkownika",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas aktualizacji leada",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
        },
        success: {
          title: "Sukces",
          description: "Lead zaktualizowany pomyślnie",
        },
      },
      post: {
        title: "[id]",
        description: "Endpoint [id]",
        form: {
          title: "Konfiguracja [id]",
          description: "Konfiguruj parametry [id]",
        },
        response: {
          title: "Odpowiedź",
          description: "Dane odpowiedzi [id]",
        },
        errors: {
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagana autentykacja",
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
            description: "Nie znaleziono zasobu",
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
      enums: {
        leadStatus: {
          new: "Nowy",
          pending: "Oczekujący",
          campaignRunning: "Kampania w toku",
          websiteUser: "Użytkownik strony",
          newsletterSubscriber: "Subskrybent newslettera",
          inContact: "W kontakcie",
          signedUp: "Zarejestrowany",
          subscriptionConfirmed: "Subskrypcja potwierdzona",
          unsubscribed: "Wypisany",
          bounced: "Niedostarczony",
          invalid: "Nieprawidłowy",
        },
        leadSource: {
          website: "Strona internetowa",
          referral: "Polecenie",
          socialMedia: "Media społecznościowe",
          emailCampaign: "Kampania e-mailowa",
          csvImport: "Import CSV",
          api: "API",
          manual: "Ręcznie",
          other: "Inne",
        },
        emailCampaignStage: {
          notStarted: "Nie rozpoczęto",
          initial: "Pierwszy kontakt",
          followup1: "Kontynuacja 1",
          followup2: "Kontynuacja 2",
          followup3: "Kontynuacja 3",
          nurture: "Pielęgnacja",
          reactivation: "Reaktywacja",
        },
        emailJourneyVariant: {
          uncensoredConvert: "Niecenzurowana konwersja",
          sideHustle: "Dodatkowy zarobek",
          quietRecommendation: "Cicha rekomendacja",
        },
      },
      widget: {
        loading: "Ładowanie leada...",
        notFound: "Lead nie znaleziony.",
        back: "Wstecz",
        leadFallbackTitle: "Lead",
        edit: "Edytuj",
        delete: "Usuń",
        converted: "Skonwertowany",
        quickActions: "Szybkie akcje",
        editLead: "Edytuj leada",
        sendTestEmail: "Wyślij testowego e-maila",
        viewInSearch: "Pokaż w wyszukiwarce",
        userProfile: "Profil użytkownika",
        userDetail: "Szczegóły użytkownika",
        creditHistory: "Historia kredytów",
        campaignFunnel: "Lejek kampanii",
        sourceLabel: "Źródło:",
        lastEmailLabel: "Ostatni e-mail:",
        campaignPerformance: "Wydajność kampanii",
        emailsSent: "Wysłane e-maile",
        opened: "Otwarte",
        clicked: "Kliknięte",
        openRate: "Wskaźnik otwarć",
        clickRate: "Wskaźnik kliknięć",
        clickToOpenRate: "Wskaźnik kliknięć do otwarć",
        contactDetails: "Dane kontaktowe",
        country: "Kraj",
        language: "Język",
        engagement: "Zaangażowanie",
        emailsOpened: "Otwarte e-maile",
        emailsClicked: "Kliknięte e-maile",
        lastEngagement: "Ostatnie zaangażowanie",
        unsubscribed: "Wypisany",
        conversion: "Konwersja",
        signedUp: "Zarejestrowany",
        convertedAt: "Skonwertowany dnia",
        subscriptionConfirmed: "Subskrypcja potwierdzona",
        convertedUserId: "ID skonwertowanego użytkownika",
        activeSubscriberSince: "Aktywny subskrybent od",
        viewUserProfile: "Pokaż profil użytkownika",
        viewUserDetail: "Pokaż szczegóły użytkownika",
        notesAndMetadata: "Notatki i metadane",
        notes: "Notatki",
        metadata: "Metadane",
        created: "Utworzony",
        lastUpdated: "Ostatnio zaktualizowany",
        daysOld: "dni temu",
        lastEngaged: "Ostatnie zaangażowanie",
        ago: "temu",
        variant: "Wariant:",
        copyEmail: "e-mail",
        copyId: "ID",
        copyPhone: "telefon",
        copyUserId: "ID użytkownika",
        stageNotStarted: "Nie rozpoczęto",
        stageInitial: "Początkowy",
        stageFollowup1: "Kontynuacja 1",
        stageFollowup2: "Kontynuacja 2",
        stageFollowup3: "Kontynuacja 3",
        stageNurture: "Pielęgnacja",
        stageReactivation: "Reaktywacja",
        tabOverview: "Przegląd",
        tabDetails: "Szczegóły",
        tabIdentity: "Tożsamość",
        tabBasic: "Podstawowe",
        tabCampaign: "Kampania",
        tabAdvanced: "Zaawansowane",
        deviceIdentity: "Urządzenie i tożsamość",
        ipAddress: "Adres IP",
        userAgent: "User Agent",
        deviceType: "Typ urządzenia",
        browser: "Przeglądarka",
        os: "System operacyjny",
        referralCode: "Kod referencyjny",
        lifecycleTimestamps: "Cykl życia",
        bouncedAt: "Odbity dnia",
        invalidAt: "Nieważny od",
        campaignStartedAt: "Kampania rozpoczęta",
        linkedLeadsSection: "Powiązane leady",
        linkedLeadsEmpty: "Brak powiązanych leadów",
        linkedUsersSection: "Powiązane konta użytkowników",
        linkedUsersEmpty: "Brak powiązanych kont użytkowników",
        linkReason: "Powód powiązania:",
        linkedAt: "Powiązano dnia:",
        copyIp: "IP",
        copyLinkedLeadId: "ID leada",
        copyUserId2: "ID użytkownika",
      },
      delete: {
        title: "Usuń leada",
        description: "Usuń leada z systemu",
        container: {
          title: "Usuń leada",
          description: "Czy na pewno chcesz trwale usunąć tego leada?",
        },
        backButton: {
          label: "Powrót do leada",
        },
        submitButton: {
          label: "Usuń leada",
          loadingText: "Usuwanie leada...",
        },
        actions: {
          delete: "Usuń leada",
          deleting: "Usuwanie leada...",
        },
        id: {
          label: "ID leada",
          description: "Unikalny identyfikator leada do usunięcia",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Podane ID leada jest nieprawidłowe",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagana autentykacja aby usuwać leadów",
          },
          forbidden: {
            title: "Dostęp zabroniony",
            description: "Nie masz uprawnień do usunięcia tego leada",
          },
          notFound: {
            title: "Lead nie znaleziony",
            description: "Nie znaleziono leada z podanym ID",
          },
          conflict: {
            title: "Konflikt usuwania",
            description:
              "Lead nie może być usunięty z powodu istniejących zależności",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas usuwania leada",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
        },
        success: {
          title: "Lead usunięty",
          description: "Lead został pomyślnie usunięty",
        },
      },
    },
  },
  list: {
    category: "Leads",
    tags: {
      leads: "Leady",
      management: "Zarządzanie",
    },

    get: {
      title: "Lista leadów",
      description: "Pobierz stronicowanychą listę leadów z filtrowaniem",
      createButton: {
        label: "Utwórz leada",
      },
      form: {
        title: "Filtry listy leadów",
        description: "Skonfiguruj filtry dla listy leadów",
      },
      actions: {
        refresh: "Odśwież",
        refreshing: "Odświeżanie...",
      },
      page: {
        label: "Numer strony",
        description: "Numer strony dla paginacji",
        placeholder: "Wprowadź numer strony",
      },
      limit: {
        label: "Wyniki na stronę",
        description: "Liczba wyników do pokazania na stronie",
        placeholder: "Wprowadź limit",
      },
      status: {
        label: "Status leada",
        description: "Filtruj według statusu leada",
        placeholder: "Wybierz status",
      },
      currentCampaignStage: {
        label: "Etap kampanii",
        description: "Filtruj według bieżącego etapu kampanii",
        placeholder: "Wybierz etap kampanii",
      },
      source: {
        label: "Źródło leada",
        description: "Filtruj według źródła leada",
        placeholder: "Wybierz źródło",
      },
      country: {
        label: "Kraj",
        description: "Filtruj według kraju",
        placeholder: "Wybierz kraje",
      },
      language: {
        label: "Język",
        description: "Filtruj według języka",
        placeholder: "Wybierz języki",
      },
      search: {
        label: "Szukaj",
        description: "Szukaj leadów według nazwy, e-maila lub firmy",
        placeholder: "Wprowadź frazę wyszukiwania",
      },
      searchPagination: {
        title: "Wyszukiwanie i paginacja",
        description: "Kontrolki wyszukiwania i paginacji",
      },
      statusFilters: {
        title: "Filtry statusu i kampanii",
        description: "Filtruj według statusu, etapu kampanii i źródła",
      },
      locationFilters: {
        title: "Filtry lokalizacji",
        description: "Filtruj według kraju i języka",
      },
      sortingOptions: {
        title: "Opcje sortowania",
        description: "Skonfiguruj sortowanie wyników",
      },
      sortBy: {
        label: "Sortuj według",
        description: "Pole do sortowania wyników",
        placeholder: "Wybierz pole sortowania",
      },
      sortOrder: {
        label: "Kolejność sortowania",
        description: "Kolejność sortowania dla wyników",
        placeholder: "Wybierz kolejność sortowania",
      },
      response: {
        title: "Odpowiedź listy leadów",
        description: "Stronicowana lista leadów z metadanymi",
        leads: {
          title: "Szczegóły leada",
          description: "Informacje o pojedynczym leadzie",
          id: "ID leada",
          email: "Adres e-mail",
          businessName: "Nazwa firmy",
          contactName: "Imię kontaktu",
          phone: "Numer telefonu",
          website: "Strona internetowa",
          country: "Kraj",
          language: "Język",
          status: "Status",
          source: "Źródło",
          notes: "Notatki",
          convertedUserId: "ID przekonwertowanego użytkownika",
          convertedAt: "Data konwersji",
          signedUpAt: "Data rejestracji",
          subscriptionConfirmedAt: "Data potwierdzenia subskrypcji",
          currentCampaignStage: "Bieżący etap kampanii",
          emailsSent: "Wysłane e-maile",
          lastEmailSentAt: "Ostatni e-mail wysłany",
          unsubscribedAt: "Data wypisania",
          emailsOpened: "Otwarte e-maile",
          emailsClicked: "Kliknięte e-maile",
          lastEngagementAt: "Ostatnie zaangażowanie",
          metadata: "Metadane",
          createdAt: "Data utworzenia",
          updatedAt: "Data aktualizacji",
        },
        total: "Łącznie leadów",
        page: "Bieżąca strona",
        limit: "Rozmiar strony",
        totalPages: "Łącznie stron",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Autoryzacja wymagana do wylistowania leadów",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry filtrów",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas pobierania leadów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas pobierania leadów",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas pobierania leadów",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla listy leadów",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Leady nie zostali znalezieni",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych podczas pobierania leadów",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany w liście leadów",
        },
      },
      success: {
        title: "Sukces",
        description: "Lista leadów pobrana pomyślnie",
      },
      emptySearch: "Żadne leady nie pasują do Twoich filtrów",
      emptyState: "Brak leadów",
    },
    widget: {
      converted: "Przekonwertowany",
      emailsSent: "{{count}} e-maili wysłanych",
      openRate: "{{percent}}% współczynnik otwarć",
      clicks: "{{count}} kliknięć",
      stats: "Statystyki",
      graphs: "Wykresy",
      search: "Szukaj",
      export: "Eksportuj",
      import: "Importuj",
      batch: "Partia",
      refresh: "Odśwież",
      view: "Zobacz",
      edit: "Edytuj",
      delete: "Usuń",
      allSources: "Wszystkie źródła",
      clearSearch: "Wyczyść wyszukiwanie",
      clearStatusFilter: "Wyczyść filtr statusu",
      clearSourceFilter: "Wyczyść filtr źródła",
      addLead: "Dodaj leada",
      importCsv: "Importuj CSV",
      pagination: "Strona {{page}} z {{totalPages}} · {{total}} leadów",
      tabAll: "Wszystkie",
      tabNew: "Nowe",
      tabCampaign: "Kampania",
      tabConfirmed: "Potwierdzone",
      tabUnsubscribed: "Wypisane",
      tabBounced: "Odrzucone",
      sortNewest: "Najnowsze najpierw",
      sortOldest: "Najstarsze najpierw",
      sortEmailsSentHigh: "E-maile wysłane (dużo)",
      sortEmailsSentLow: "E-maile wysłane (mało)",
      sortBusinessNameAZ: "Nazwa firmy (A-Z)",
      sortBusinessNameZA: "Nazwa firmy (Z-A)",
      linkedCount: "{{count}} powiązanych",
      hasLinkedUser: "Użytkownik",
      referralCode: "Kod ref.",
    },
  },
  search: {
    category: "Zarządzanie leadami",
    tags: {
      leads: "Leady",
      search: "Szukaj",
    },
    get: {
      title: "Szukaj leadów",
      description: "Przeszukaj leady z filtrowaniem i stronicowaniem",
      form: {
        title: "Formularz wyszukiwania leadów",
        description: "Wprowadź kryteria wyszukiwania aby znaleźć leady",
      },
      search: {
        label: "Zapytanie wyszukiwania",
        description:
          "Termin wyszukiwania do filtrowania leadów po e-mailu, nazwie firmy lub notatkach",
        placeholder: "Wprowadź termin wyszukiwania...",
      },
      status: {
        label: "Filtr statusu",
        description: "Filtruj leady według statusu",
      },
      limit: {
        label: "Limit wyników",
        description: "Maksymalna liczba wyników do zwrócenia (1-100)",
      },
      offset: {
        label: "Przesunięcie wyników",
        description: "Liczba wyników do pominięcia dla stronicowania",
      },
      response: {
        title: "Wyniki wyszukiwania",
        description: "Stronicowane wyniki wyszukiwania z danymi leadów",
        leads: {
          title: "Leady",
          item: "Lead",
        },
        total: "Całkowita liczba wyników",
        hasMore: "Więcej wyników dostępnych",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Autoryzacja wymagana do przeszukiwania leadów",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Podano nieprawidłowe parametry wyszukiwania",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas wyszukiwania leadów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas wyszukiwania leadów",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas wyszukiwania leadów",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony dla wyszukiwania leadów",
        },
        notFound: {
          title: "Brak wyników",
          description:
            "Nie znaleziono leadów pasujących do kryteriów wyszukiwania",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany w formularzu wyszukiwania",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych podczas wyszukiwania leadów",
        },
      },
      success: {
        title: "Wyszukiwanie zakończone",
        description: "Wyszukiwanie leadów zakończone pomyślnie",
      },
    },
    widget: {
      title: "Szukaj leadów",
      filterLabel: "Filtr:",
      clearFilter: "Wyczyść",
      noResultsTitle: "Nie znaleziono wyników",
      noResultsSubtitle: "Szukaj po e-mailu, nazwie firmy lub telefonie",
      createLead: "Utwórz lead",
      noLeadsMatchFilter: "Żadne leady nie pasują do wybranych filtrów.",
      clearFilters: "Wyczyść filtry",
      loadMore: "Załaduj więcej",
      openRateSuffix: "% otwarć",
      noEmails: "brak e-maili",
      converted: "Skonwertowany",
      emailsSentSuffix: "wysłanych",
      copyEmailTitle: "Kopiuj e-mail",
      editLeadTitle: "Edytuj lead",
      deleteLeadTitle: "Usuń lead",
      statusNew: "Nowy",
      statusPending: "Oczekujący",
      statusCampaign: "Kampania",
      statusWebUser: "Użytkownik web",
      statusNewsletter: "Newsletter",
      statusInContact: "W kontakcie",
      statusSignedUp: "Zarejestrowany",
      statusSubscribed: "Subskrybowany",
      statusUnsub: "Wypisany",
      statusBounced: "Odrzucony",
      statusInvalid: "Nieprawidłowy",
    },
  },
  stats: {
    title: "Statystyki leadów",
    description:
      "Kompleksowe statystyki i analityka leadów z danymi historycznymi",
    category: "Zarządzanie leadami",
    tags: {
      leads: "Leady",
      statistics: "Statystyki",
      analytics: "Analityka",
    },
    container: {
      title: "Filtry statystyk",
      description: "Skonfiguruj filtry statystyk leadów i opcje widoku",
    },
    refresh: "Odśwież",
    sections: {
      timeFilters: "Okres czasu i zakres dat",
      comparison: "Ustawienia porównania",
      leadFilters: "Filtry leadów",
      engagement: "Filtry zaangażowania",
      conversion: "Filtry konwersji",
      dataCompleteness: "Kompletność danych",
      additional: "Dodatkowe filtry",
      searchSort: "Wyszukiwanie i sortowanie",
    },
    timePeriod: {
      label: "Okres czasu",
      description: "Wybierz okres czasu dla agregacji statystyk",
      hour: "Godzina",
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
      quarter: "Kwartał",
      year: "Rok",
    },
    dateRangePreset: {
      label: "Preset zakresu dat",
      description: "Wybierz predefiniowany zakres dat",
    },
    dateRange: {
      today: "Dzisiaj",
      yesterday: "Wczoraj",
      last7Days: "Ostatnie 7 dni",
      last30Days: "Ostatnie 30 dni",
      last90Days: "Ostatnie 90 dni",
      thisWeek: "Ten tydzień",
      lastWeek: "Ostatni tydzień",
      thisMonth: "Ten miesiąc",
      lastMonth: "Ostatni miesiąc",
      thisQuarter: "Ten kwartał",
      lastQuarter: "Ostatni kwartał",
      thisYear: "Ten rok",
      lastYear: "Ostatni rok",
      custom: "Zakres niestandardowy",
    },
    dateFrom: {
      label: "Data rozpoczęcia",
      description: "Data początkowa dla statystyk",
    },
    dateTo: {
      label: "Data zakończenia",
      description: "Data końcowa dla statystyk",
    },
    chartType: {
      label: "Typ wykresu",
      description: "Wybierz typ wykresu do wizualizacji danych",
      line: "Wykres liniowy",
      bar: "Wykres słupkowy",
      area: "Wykres obszarowy",
      pie: "Wykres kołowy",
      donut: "Wykres pierścieniowy",
    },
    includeComparison: {
      label: "Uwzględnij porównanie",
      description: "Porównaj z poprzednim okresem",
    },
    comparisonPeriod: {
      label: "Okres porównania",
      description: "Wybierz okres do porównania",
    },
    status: {
      label: "Status leada",
      description: "Filtruj według statusu leada",
    },
    source: {
      label: "Źródło leada",
      description: "Filtruj według źródła leada",
    },
    country: {
      label: "Kraj",
      description: "Filtruj według kraju",
      all: "Wszystkie kraje",
      de: "Niemcy",
      pl: "Polska",
      global: "Globalny",
    },
    language: {
      label: "Język",
      description: "Filtruj według preferencji językowych",
      all: "Wszystkie języki",
      en: "Angielski",
      de: "Niemiecki",
      pl: "Polski",
    },
    campaignStage: {
      label: "Etap kampanii",
      description: "Filtruj według etapu kampanii e-mailowej",
    },
    hasEngagement: {
      label: "Ma zaangażowanie",
      description: "Filtruj leady z zaangażowaniem e-mailowym",
    },
    minEmailsOpened: {
      label: "Minimalna liczba otwartych e-maili",
      description: "Minimalna liczba otwartych e-maili",
    },
    minEmailsClicked: {
      label: "Minimalna liczba klikniętych e-maili",
      description: "Minimalna liczba klikniętych e-maili",
    },
    isConverted: {
      label: "Jest skonwertowany",
      description: "Filtruj skonwertowane leady",
    },
    hasSignedUp: {
      label: "Zarejestrował się",
      description: "Filtruj leady, które się zarejestrowały",
    },
    hasConfirmedSubscription: {
      label: "Potwierdził subskrypcję",
      description: "Filtruj leady z potwierdzoną subskrypcją",
    },
    hasBusinessName: {
      label: "Ma nazwę firmy",
      description: "Filtruj leady z nazwą firmy",
    },
    hasContactName: {
      label: "Ma nazwisko kontaktowe",
      description: "Filtruj leady z nazwiskiem kontaktowym",
    },
    hasPhone: {
      label: "Ma telefon",
      description: "Filtruj leady z numerem telefonu",
    },
    hasWebsite: {
      label: "Ma stronę internetową",
      description: "Filtruj leady ze stroną internetową",
    },
    hasNotes: {
      label: "Ma notatki",
      description: "Filtruj leady z notatkami",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Pole do sortowania wyników",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Rosnąco lub malejąco",
    },
    limit: {
      label: "Limit wyników",
      description: "Maksymalna liczba wyników",
    },
    hasUserId: {
      label: "Ma ID użytkownika",
      description: "Filtruj leady z przypisanym ID użytkownika",
    },
    emailVerified: {
      label: "E-mail zweryfikowany",
      description: "Filtruj według statusu weryfikacji e-maila",
    },
    journeyVariant: {
      label: "Wariant ścieżki",
      description: "Filtruj według wariantu ścieżki e-mailowej",
    },
    minEmailsSent: {
      label: "Minimalna liczba wysłanych e-maili",
      description: "Minimalna liczba e-maili wysłanych do leada",
    },
    createdAfter: {
      label: "Utworzone po",
      description: "Filtruj leady utworzone po tej dacie",
    },
    createdBefore: {
      label: "Utworzone przed",
      description: "Filtruj leady utworzone przed tą datą",
    },
    updatedAfter: {
      label: "Zaktualizowane po",
      description: "Filtruj leady zaktualizowane po tej dacie",
    },
    updatedBefore: {
      label: "Zaktualizowane przed",
      description: "Filtruj leady zaktualizowane przed tą datą",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj leadów po e-mailu, nazwisku lub nazwie firmy",
      placeholder: "Szukaj leadów...",
    },
    engagementLevel: {
      high: "Wysokie zaangażowanie",
      medium: "Średnie zaangażowanie",
      low: "Niskie zaangażowanie",
      none: "Brak zaangażowania",
    },
    response: {
      overview: "Przegląd",
      emailPerformance: "Wydajność e-mail",
      conversionRates: "Wskaźniki konwersji",
      activityTimeline: "Oś czasu aktywności",
      campaignDistribution: "Dystrybucja kampanii",
      geographicDistribution: "Dystrybucja geograficzna i źródła",
      dataQuality: "Jakość danych",
      performanceMetrics: "Metryki wydajności",
      engagementLevels: "Poziomy zaangażowania",
      conversionFunnel: "Lejek konwersji",
      totalLeads: "Wszystkie leady",
      newLeads: "Nowe leady",
      activeLeads: "Aktywne leady",
      inactiveLeads: "Nieaktywne leady",
      leadsByStatus: "Leady według statusu",
      leadsBySource: "Leady według źródła",
      leadsByCountry: "Leady według kraju",
      leadsByLanguage: "Leady według języka",
      websiteUserLeads: "Użytkownicy strony",
      newsletterSubscriberLeads: "Subskrybenci newslettera",
      convertedLeads: "Skonwertowane leady",
      consultationBookedLeads: "Konsultacja zarezerwowana",
      signedUpLeads: "Zarejestrowani leady",
      subscriptionConfirmedLeads: "Potwierdzona subskrypcja",
      unsubscribedLeads: "Wypisani leady",
      bounces: "Zwrócone",
      qualifiedLeads: "Zakwalifikowane leady",
      nonQualifiedLeads: "Niezakwalifikowane leady",
      nurturingLeads: "Leady w nurturingu",
      engagedLeads: "Zaangażowane leady",
      leadsWithEmailEngagement: "Z zaangażowaniem e-mailowym",
      leadsWithoutEmailEngagement: "Bez zaangażowania e-mailowego",
      averageEmailEngagementScore: "Średnie zaangażowanie e-mailowe",
      totalEmailEngagements: "Łączne zaangażowanie e-mailowe",
      signupRate: "Wskaźnik rejestracji",
      subscriptionConfirmationRate: "Wskaźnik potwierdzenia subskrypcji",
      dataCompletenessRate: "Kompletność danych",
      leadsWithBusinessName: "Z nazwą firmy",
      leadsWithContactName: "Z nazwiskiem kontaktowym",
      leadsWithPhone: "Z telefonem",
      leadsWithWebsite: "Ze stroną internetową",
      leadsWithNotes: "Z notatkami",
      averageBusinessDataCompleteness: "Średnia kompletność danych biznesowych",
      leadsByCampaignStage: "Leady według etapu kampanii",
      leadsInActiveCampaigns: "W aktywnych kampaniach",
      leadsNotInCampaigns: "Nie w kampaniach",
      recentLeads: "Ostatnie leady",
      topLeadsByEngagement: "Najlepsze leady wg zaangażowania",
      mostActiveLeads: "Najbardziej aktywne leady",
      recentConversions: "Ostatnie konwersje",
      recentSignups: "Ostatnie rejestracje",
      timeSeriesData: "Dane szeregów czasowych",
      comparisonData: "Dane porównawcze",
      averageTimeToConversion: "Średni czas do konwersji",
      averageTimeToConsultation: "Średni czas do konsultacji",
      averageTimeToSignup: "Średni czas do rejestracji",
      topPerformingCampaigns: "Najlepsze kampanie",
      topPerformingSources: "Najlepsze źródła",
      topPerformingCountries: "Najlepsze kraje",
      conversionRate: "Wskaźnik konwersji",
      consultationBookingRate: "Wskaźnik rezerwacji konsultacji",
      averageOpenRate: "Średni współczynnik otwarć",
      averageClickRate: "Średni współczynnik kliknięć",
      campaignRunningLeads: "W trwających kampaniach",
      bouncedLeads: "Zwrócone leady",
      invalidLeads: "Nieprawidłowe leady",
      totalEmailsSent: "Wysłanych e-maili łącznie",
      totalEmailsOpened: "Otwartych e-maili łącznie",
      totalEmailsClicked: "Klikniętych e-maili łącznie",
      averageEmailsPerLead: "Średnio e-maili na leada",
      leadVelocity: "Prędkość leadów",
      leadsCreatedToday: "Utworzonych dzisiaj leadów",
      leadsCreatedThisWeek: "Utworzonych w tym tygodniu leadów",
      leadsCreatedThisMonth: "Utworzonych w tym miesiącu leadów",
      leadsUpdatedToday: "Zaktualizowanych dzisiaj leadów",
      leadsUpdatedThisWeek: "Zaktualizowanych w tym tygodniu leadów",
      leadsUpdatedThisMonth: "Zaktualizowanych w tym miesiącu leadów",
      leadsByJourneyVariant: "Leady według wariantu ścieżki",
      historicalData: "Dane historyczne",
      groupedStats: "Statystyki zgrupowane",
      recentActivity: "Ostatnia aktywność",
      metadata: "Informacje o raporcie",
      generatedAt: "Wygenerowane o",
      dataRange: "Zakres danych",
      data: "Dane statystyk",
      campaignName: "Kampania",
      leadsGenerated: "Leady",
      openRate: "Współczynnik otwarć",
      clickRate: "Współczynnik kliknięć",
      source: "Źródło",
      qualityScore: "Wynik jakości",
      activityType: "Aktywność",
      email: "E-mail",
      businessName: "Firma",
      timestamp: "Czas",
      status: "Status",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany dostęp",
        description:
          "Wymagane uwierzytelnienie aby wyświetlić statystyki leadów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry zapytania o statystyki",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wewnętrzny błąd serwera podczas pobierania statystyk leadów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas pobierania statystyk",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas pobierania statystyk",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Dostęp do statystyk leadów zabroniony",
      },
      notFound: {
        title: "Brak danych",
        description:
          "Nie znaleziono danych statystycznych dla określonych kryteriów",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas generowania statystyk",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w filtrach statystyk",
      },
    },
    success: {
      title: "Statystyki wygenerowane",
      description: "Statystyki leadów pobrane pomyślnie",
    },
    widget: {
      title: "Statystyki leadów",
      refresh: "Odśwież",
      viewAllLeads: "Wyświetl wszystkie leady",
      searchLeads: "Szukaj leadów",
      export: "Eksportuj",
      import: "Importuj",
      batchUpdate: "Aktualizacja zbiorcza",
      totalLeads: "Wszystkie leady",
      activeLeads: "Aktywne leady",
      converted: "Skonwertowane",
      conversionRate: "Wskaźnik konwersji",
      openRate: "Współczynnik otwarć",
      clickRate: "Współczynnik kliknięć",
      unsubscribeRate: "Wskaźnik wypisów",
      newThisMonth: "Nowe (30d)",
      newLeadsTimeline: "Oś czasu nowych leadów",
      today: "Dzisiaj",
      thisWeek: "Ten tydzień",
      thisMonth: "Ten miesiąc",
      conversionFunnel: "Lejek konwersji",
      funnelTotalLeads: "Wszystkie leady",
      funnelCampaignRunning: "Kampania w toku",
      funnelSignedUp: "Zarejestrowany",
      funnelSubscriptionConfirmed: "Subskrypcja potwierdzona",
      byStatus: "Według statusu",
      clickToFilter: "(kliknij aby filtrować)",
      bySource: "Według źródła",
      byCountry: "Według kraju",
      byCampaignStage: "Według etapu kampanii",
      topPerformingCampaigns: "Najlepsze kampanie",
      topSources: "Najlepsze źródła",
      viewAll: "Wyświetl wszystkie",
      recentActivity: "Ostatnia aktywność",
      filters: "Filtry",
      applyFilters: "Zastosuj filtry",
      openRateSuffix: "% otwarć",
      conversionRateSuffix: "% konw.",
      emDash: "—",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "Rosnąco",
        desc: "Malejąco",
      },
      leadSortField: {
        email: "E-mail",
        businessName: "Nazwa firmy",
        createdAt: "Data utworzenia",
        updatedAt: "Data aktualizacji",
        lastEngagementAt: "Ostatnie zaangażowanie",
      },
      leadStatusFilter: {
        all: "Wszystkie",
        new: "Nowy",
        pending: "Oczekujący",
        campaignRunning: "Kampania w toku",
        websiteUser: "Użytkownik strony",
        newsletterSubscriber: "Subskrybent newslettera",
        inContact: "W kontakcie",
        signedUp: "Zarejestrowany",
        subscriptionConfirmed: "Subskrypcja potwierdzona",
        unsubscribed: "Wypisany",
        bounced: "Niedostarczony",
        invalid: "Nieprawidłowy",
      },
      emailCampaignStageFilter: {
        all: "Wszystkie",
        notStarted: "Nie rozpoczęto",
        initial: "Pierwszy kontakt",
        followup1: "Kontynuacja 1",
        followup2: "Kontynuacja 2",
        followup3: "Kontynuacja 3",
        nurture: "Pielęgnacja",
        reactivation: "Reaktywacja",
      },
      leadSourceFilter: {
        all: "Wszystkie",
        website: "Strona internetowa",
        socialMedia: "Media społecznościowe",
        emailCampaign: "Kampania e-mailowa",
        referral: "Polecenie",
        csvImport: "Import CSV",
      },
    },
  },
  tracking: {
    engagement: {
      category: "Śledzenie leadów",
      tags: {
        tracking: "Śledzenie",
        engagement: "Zaangażowanie",
      },
      post: {
        title: "Zarejestruj zaangażowanie leada",
        description: "Zarejestruj nowe zdarzenie zaangażowania dla leada",
        form: {
          title: "Formularz zaangażowania leada",
          description: "Zarejestruj szczegóły zaangażowania leada",
        },
        leadId: {
          label: "ID leada",
          description: "Unikalny identyfikator leada",
          placeholder: "Wprowadź ID leada",
          helpText: "UUID leada, dla którego ma być śledzone zaangażowanie",
        },
        engagementType: {
          label: "Typ zaangażowania",
          description: "Typ zdarzenia zaangażowania",
          placeholder: "Wybierz typ zaangażowania",
          helpText: "Rodzaj interakcji lub zaangażowania",
        },
        campaignId: {
          label: "ID kampanii",
          description: "Powiązany identyfikator kampanii",
          placeholder: "Wprowadź ID kampanii",
          helpText: "Opcjonalna kampania, do której należy to zaangażowanie",
        },
        metadata: {
          label: "Metadane",
          description: "Dodatkowe metadane zaangażowania",
          placeholder: "Wprowadź metadane jako JSON",
          helpText: "Niestandardowe dane dotyczące tego zaangażowania",
        },
        userId: {
          label: "ID użytkownika",
          description: "Powiązany identyfikator użytkownika",
          placeholder: "Wprowadź ID użytkownika",
          helpText:
            "Opcjonalny ID użytkownika, jeśli lead jest powiązany z użytkownikiem",
        },
        response: {
          id: "ID zaangażowania",
          leadId: "ID leada",
          engagementType: "Typ zaangażowania",
          campaignId: "ID kampanii",
          metadata: "Metadane",
          timestamp: "Znacznik czasu",
          ipAddress: "Adres IP",
          userAgent: "User Agent",
          createdAt: "Utworzono",
          leadCreated: "Lead utworzony",
          relationshipEstablished: "Relacja nawiązana",
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
          network: {
            title: "Błąd sieci",
            description: "Wystąpił błąd sieci",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
        },
        success: {
          title: "Zaangażowanie zarejestrowane",
          description: "Zaangażowanie leada zostało pomyślnie zarejestrowane",
        },
      },
      get: {
        title: "Śledź kliknięcie leada",
        description: "Śledź kliknięcie leada i przekieruj do docelowego URL",
        form: {
          title: "Parametry śledzenia kliknięć",
          description: "Parametry śledzenia kliknięć i przekierowania",
        },
        id: {
          label: "ID leada",
          description: "Unikalny identyfikator leada",
          placeholder: "Wprowadź ID leada",
          helpText: "Unikalny identyfikator leada",
        },
        stage: {
          label: "Etap kampanii",
          description: "Aktualny etap w kampanii",
          placeholder: "Wybierz etap",
          helpText: "Aktualny etap leada w kampanii",
        },
        source: {
          label: "Źródło",
          description: "Źródło kliknięcia",
          placeholder: "Wprowadź źródło",
          helpText: "Źródło, z którego pochodzi kliknięcie",
        },
        url: {
          label: "Docelowy URL",
          description: "URL do przekierowania",
          placeholder: "https://example.com",
          helpText: "URL, do którego zostanie przekierowany lead",
        },
        ref: {
          label: "ID referencyjne",
          description: "Identyfikator referencyjny śledzenia",
          placeholder: "Wprowadź ID referencyjne",
          helpText:
            "Opcjonalne ID referencyjne do dodatkowego kontekstu śledzenia",
        },
        response: {
          success: "Sukces",
          redirectUrl: "URL przekierowania",
          leadId: "ID leada",
          campaignId: "ID kampanii",
          engagementRecorded: "Zaangażowanie zarejestrowane",
          leadStatusUpdated: "Status leada zaktualizowany",
          isLoggedIn: "Jest zalogowany",
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
          network: {
            title: "Błąd sieci",
            description: "Wystąpił błąd sieci",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
        },
        success: {
          title: "Kliknięcie zarejestrowane",
          description:
            "Kliknięcie leada zostało pomyślnie zarejestrowane i przekierowane",
        },
      },
      widget: {
        post: {
          headerTitle: "Rejestruj zaanga\u017cowanie",
          viewStatsTitle: "Wy\u015bwietl statystyki lead\u00f3w",
          statsButton: "Statystyki",
          loading: "Rejestrowanie zaanga\u017cowania\u2026",
          successTitle: "Zaanga\u017cowanie zarejestrowane",
          successSubtitle: "pomy\u015blnie \u015bledzone",
          event: "Zdarzenie",
          labels: {
            engagementId: "ID zaanga\u017cowania",
            type: "Typ",
            leadId: "ID leada",
            campaignId: "ID kampanii",
            ipAddress: "Adres IP",
            recordedAt: "Zarejestrowano o",
            leadCreated: "Lead utworzony",
            leadCreatedYes: "Tak (nowy lead)",
            leadCreatedNo: "Nie (istniej\u0105cy)",
            relationshipEst: "Relacja nawiq.",
            relationshipYes: "Tak",
            relationshipNo: "Nie",
            metadata: "Metadane",
          },
          nextSteps: "Nast\u0119pne kroki:",
          viewLeadButton: "Wy\u015bwietl lead",
          leadStatsButton: "Statystyki lead\u00f3w",
          emptyTitle: "\u015aled\u017a zdarzenie zaanga\u017cowania",
          emptyDescription:
            "Wype\u0142nij poni\u017cszy formularz i wy\u015blij, aby zarejestrowa\u0107 nowe zdarzenie zaanga\u017cowania dla leada",
          viewLeadStatsButton: "Wy\u015bwietl statystyki lead\u00f3w",
        },
        get: {
          headerTitle: "\u015aledzenie klikni\u0119\u0107",
          viewStatsTitle: "Wy\u015bwietl statystyki lead\u00f3w",
          statsButton: "Statystyki",
          loading: "Przetwarzanie \u015bledzenia klikni\u0119\u0107\u2026",
          successTitle: "Klikni\u0119cie zarejestrowane",
          successSubtitle:
            "Zaanga\u017cowanie zarejestrowane i URL przekierowania gotowy",
          failTitle: "\u015aledzenie nie powiod\u0142o si\u0119",
          failSubtitle:
            "Nie mo\u017cna zarejestrowa\u0107 zdarzenia klikni\u0119cia",
          labels: {
            engagementLabel: "Zaanga\u017cowanie",
            recorded: "Zarejestrowane",
            notRecorded: "Niezarejestrowane",
            leadStatusLabel: "Status leada",
            updated: "Zaktualizowany",
            unchanged: "Niezmieniony",
            userLabel: "U\u017cytkownik",
            loggedIn: "Zalogowany",
            anonymous: "Anonimowy",
            leadId: "ID leada",
            campaignId: "ID kampanii",
            redirectUrl: "URL przekierowania",
          },
          nextSteps: "Nast\u0119pne kroki:",
          openUrlButton: "Otw\u00f3rz URL",
          viewLeadButton: "Wy\u015bwietl lead",
          leadStatsButton: "Statystyki lead\u00f3w",
          emptyTitle: "\u015aled\u017a zdarzenie klikni\u0119cia",
          emptyDescription:
            "Wprowad\u017a poni\u017cej parametry \u015bledzenia, aby zarejestrowa\u0107 klikni\u0119cie i pobra\u0107 URL przekierowania",
          viewLeadStatsButton: "Wy\u015bwietl statystyki lead\u00f3w",
        },
      },
      enums: {
        engagementLevel: {
          high: "Wysoki",
          medium: "\u015aredni",
          low: "Niski",
          none: "Brak",
        },
      },
      error: {
        default:
          "Wyst\u0105pi\u0142 b\u0142\u0105d podczas przetwarzania zaanga\u017cowania",
      },
    },
    pixel: {
      category: "Punkt końcowy API",
      tags: {
        pixel: "Pixel",
      },
      // Add endpoint-specific translations here
    },
    existing: {
      found: "Znaleziono istniejące śledzenie leadu",
    },
    component: {
      initialized: "Komponent śledzenia leadu zainicjowany",
    },
    error: "Błąd w śledzeniu leadu",
    errors: {
      default: "Wystąpił błąd",
      missingId: "Brak identyfikatora śledzenia",
      invalidUrl: "Nieprawidłowy URL",
    },
    data: {
      captured: "Dane śledzenia leadu przechwycone",
      capture: {
        error: "Błąd podczas przechwytywania danych śledzenia leadu",
      },
      retrieve: {
        error: "Błąd podczas pobierania danych śledzenia leadu",
      },
      loaded: {
        signup: "Dane śledzenia leadu załadowane do rejestracji",
      },
      load: {
        error: {
          noncritical:
            "Błąd podczas ładowania danych śledzenia leadu (niekrytyczny)",
        },
      },
      stored: "Dane śledzenia leadu zapisane",
      store: {
        error: "Błąd podczas zapisywania danych śledzenia leadu",
      },
      cleared: "Dane śledzenia leadu wyczyszczone",
      clear: {
        error: "Błąd podczas czyszczenia danych śledzenia leadu",
      },
      format: {
        error: "Błąd podczas formatowania danych śledzenia",
      },
    },
    params: {
      validate: {
        error: "Błąd podczas walidacji parametrów śledzenia",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "E-mail otwarty",
      emailClick: "E-mail kliknięty",
      websiteVisit: "Wizyta na stronie",
      formSubmit: "Wysłanie formularza",
      leadAttribution: "Atrybucja leadu",
    },
    leadStatus: {
      new: "Nowy",
      pending: "Oczekujący",
      campaignRunning: "Kampania w toku",
      websiteUser: "Użytkownik strony",
      newsletterSubscriber: "Subskrybent newslettera",
      inContact: "W kontakcie",
      signedUp: "Zarejestrowany",
      subscriptionConfirmed: "Subskrypcja potwierdzona",
      unsubscribed: "Wypisany",
      bounced: "Niedostarczony",
      invalid: "Nieprawidłowy",
    },
    emailCampaignStage: {
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Kontynuacja 1",
      followup2: "Kontynuacja 2",
      followup3: "Kontynuacja 3",
      nurture: "Pielęgnacja",
      reactivation: "Reaktywacja",
    },
    emailStatus: {
      pending: "Oczekujący",
      sent: "Wysłany",
      delivered: "Dostarczony",
      opened: "Otwarty",
      clicked: "Kliknięty",
      bounced: "Niedostarczony",
      failed: "Nieudany",
      unsubscribed: "Wypisany",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Niecenzurowana konwersja",
      sideHustle: "Dodatkowy zarobek",
      quietRecommendation: "Cicha rekomendacja",
      signupNurture: "Pielęgnacja po rejestracji",
      retention: "Utrzymanie klienta",
      winback: "Odzyskanie klienta",
      newsletterMay2026: "Newsletter maj 2026",
    },
    emailJourneyVariantFilter: {
      all: "Wszystkie",
      uncensoredConvert: "Niecenzurowana konwersja",
      sideHustle: "Dodatkowy zarobek",
      quietRecommendation: "Cicha rekomendacja",
      signupNurture: "Pielęgnacja po rejestracji",
      retention: "Utrzymanie klienta",
      winback: "Odzyskanie klienta",
      newsletterMay2026: "Newsletter maj 2026",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    leadSortField: {
      email: "E-mail",
      businessName: "Nazwa firmy",
      createdAt: "Data utworzenia",
      updatedAt: "Data aktualizacji",
      lastEngagementAt: "Ostatnie zaangażowanie",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Lead utworzony",
      leadUpdated: "Lead zaktualizowany",
      emailSent: "E-mail wysłany",
      emailOpened: "E-mail otwarty",
      emailClicked: "E-mail kliknięty",
      leadConverted: "Lead przekonwertowany",
      leadUnsubscribed: "Lead wypisany",
    },
    userAssociation: {
      withUser: "Z użytkownikiem",
      withLead: "Z leadem",
      standalone: "Samodzielny",
      withBoth: "Z oboma",
    },
    deviceType: {
      desktop: "Komputer stacjonarny",
      mobile: "Telefon komórkowy",
      tablet: "Tablet",
      bot: "Bot",
      unknown: "Nieznany",
    },
    leadSource: {
      website: "Strona internetowa",
      socialMedia: "Media społecznościowe",
      emailCampaign: "Kampania e-mailowa",
      referral: "Polecenie",
      csvImport: "Import CSV",
    },
    leadStatusFilter: {
      all: "Wszystkie",
      new: "Nowy",
      pending: "Oczekujący",
      campaignRunning: "Kampania w toku",
      websiteUser: "Użytkownik strony",
      newsletterSubscriber: "Subskrybent newslettera",
      inContact: "W kontakcie",
      signedUp: "Zarejestrowany",
      subscriptionConfirmed: "Subskrypcja potwierdzona",
      unsubscribed: "Wypisany",
      bounced: "Niedostarczony",
      invalid: "Nieprawidłowy",
    },
    emailCampaignStageFilter: {
      all: "Wszystkie",
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Kontynuacja 1",
      followup2: "Kontynuacja 2",
      followup3: "Kontynuacja 3",
      nurture: "Pielęgnacja",
      reactivation: "Reaktywacja",
    },
    leadSourceFilter: {
      all: "Wszystkie",
      website: "Strona internetowa",
      socialMedia: "Media społecznościowe",
      emailCampaign: "Kampania e-mailowa",
      referral: "Polecenie",
      csvImport: "Import CSV",
    },
    batchOperationScope: {
      currentPage: "Bieżąca strona",
      allPages: "Wszystkie strony",
    },
    country: {
      de: "Niemcy",
      pl: "Polska",
      global: "Globalnie",
    },
    language: {
      de: "Niemiecki",
      pl: "Polski",
      en: "Angielski",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Inne",
    },
  },
  error: {
    general: {
      internal_server_error: "Wewnętrzny błąd serwera",
      not_found: "Nie znaleziono",
      unauthorized: "Nieautoryzowany",
      forbidden: "Zabronione",
      bad_request: "Nieprawidłowe żądanie",
      validation_error: "Błąd walidacji",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Nieprawidłowe żądanie aktualizacji wsadowej",
          },
          server: {
            title: "Błąd serwera podczas wsadowej aktualizacji leadów",
          },
          default: "Błąd podczas wsadowej aktualizacji leadów",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Błąd serwera podczas pobierania leadów",
          },
          not_found: {
            title: "Leady nie znalezione",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Lead z tym adresem e-mail już istnieje",
          },
          server: {
            title: "Błąd serwera podczas tworzenia leada",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Lead nie znaleziony",
          },
          server: {
            title: "Błąd serwera podczas aktualizacji leada",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "Pomyślnie wypisano",
        },
        error: {
          validation: {
            title: "Nieprawidłowe żądanie rezygnacji",
          },
          server: {
            title: "Błąd serwera podczas przetwarzania rezygnacji",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Nieprawidłowe dane zaangażowania",
          },
          server: {
            title: "Błąd serwera podczas rejestrowania zaangażowania",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Błąd serwera podczas eksportowania leadów",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Błąd serwera podczas przetwarzania kampanii",
          },
        },
      },
    },
  },
};
