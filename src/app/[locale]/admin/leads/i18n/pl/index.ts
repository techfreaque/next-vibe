import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  leads: {
    admin: {
      title: "Zarządzanie Leadami",
      abTesting: {
        title: "Konfiguracja Testów A/B",
        subtitle:
          "Monitoruj i konfiguruj testy A/B dla wariantów podróży e-mailowych",
        status: {
          active: "Aktywny",
          inactive: "Nieaktywny",
          valid: "Ważny",
          invalid: "Nieważny",
        },
        metrics: {
          testStatus: "Status Testu",
          totalVariants: "Łączne Warianty",
          configuration: "Konfiguracja",
          trafficSplit: "Podział Ruchu",
          trafficAllocation: "Alokacja Ruchu",
        },
        variants: {
          title: "Warianty Podróży E-mailowej",
          keyCharacteristics: "Kluczowe Cechy:",
        },
        config: {
          title: "Szczegóły Konfiguracji",
          testConfiguration: "Konfiguracja Testu",
          trafficDistribution: "Dystrybucja Ruchu",
          status: "Status",
          enabled: "Włączony",
          disabled: "Wyłączony",
          configurationValid: "Konfiguracja Ważna",
          yes: "Tak",
          no: "Nie",
          total: "Łącznie",
        },
        descriptions: {
          enabled: "Testy A/B są uruchomione",
          disabled: "Testy A/B są wyłączone",
          emailJourneyVariants: "Warianty podróży e-mailowej",
          configurationStatus: "Status konfiguracji",
        },
      },
      actions: {
        refresh: "Odśwież",
        reset: "Resetuj",
        retry: "Ponów",
        export: "Eksportuj",
        exportCsv: "Eksportuj jako CSV",
        exportExcel: "Eksportuj jako Excel",
        import: "Importuj",
        addLead: "Dodaj Lead",
      },
      adminErrors: {
        metrics: {
          calculation: "Nie udało się obliczyć metryk zaangażowania",
        },
        processing: {
          listData: "Nie udało się przetworzyć danych listy leadów",
        },
      },
      batch: {
        filter_count: "{{total}} leadów pasuje do aktualnych filtrów",
        current_page_count: "{{count}} leadów na stronie {{page}}",
        scope_current_page: "Bieżąca strona",
        scope_all_pages: "Wszystkie strony",
        preview: "Podgląd zmian",
        apply: "Zastosuj zmiany",
        delete: "Usuń",
        select_action: "Wybierz akcję",
        select_value: "Wybierz wartość",
        actions: {
          update_status: "Aktualizuj status",
          update_stage: "Aktualizuj etap kampanii",
          update_source: "Aktualizuj źródło",
          delete: "Usuń leady",
        },
        preview_title: "Podgląd aktualizacji wsadowej",
        delete_preview_title: "Podgląd usuwania wsadowego",
        confirm_title: "Potwierdź aktualizację wsadową",
        delete_confirm: {
          title: "Potwierdź usuwanie wsadowe",
        },
        result_title: "Wyniki operacji wsadowej",
        preview_description:
          "Przejrzyj {{count}} leadów, które zostaną zaktualizowane",
        delete_preview_description:
          "Przejrzyj {{count}} leadów, które zostaną usunięte. Ta akcja nie może być cofnięta.",
        planned_changes: "Planowane zmiany",
        change_status: "Status → {{status}}",
        change_stage: "Etap kampanii → {{stage}}",
        change_source: "Źródło → {{source}}",
        confirm_update: "Potwierdź aktualizację",
        confirm_delete: "Potwierdź usunięcie",
        success_message:
          "Pomyślnie zaktualizowano {{updated}} z {{total}} leadów",
        delete_success_message:
          "Pomyślnie usunięto {{deleted}} z {{total}} leadów",
        error_message: "Nie udało się zaktualizować leadów. Spróbuj ponownie.",
        errors_title: "Błędy ({{count}})",
        processing: "Przetwarzanie...",
        close: "Zamknij",
        results: {
          title: "Wyniki operacji wsadowej",
        },
        confirm: {
          title: "Potwierdź aktualizację wsadową",
        },
      },
      campaigns: {
        title: "Kampanie E-mailowe",
        subtitle:
          "Monitoruj i zarządzaj swoimi automatycznymi kampaniami e-mailowymi",
        description:
          "Zarządzaj automatycznymi kampaniami e-mailowymi i sekwencjami",
        error: "Nie udało się załadować statystyk kampanii",
        comingSoon: "Interfejs zarządzania kampaniami już wkrótce...",
        coming_soon: "Interfejs zarządzania kampaniami wkrótce...",
        active_campaigns: "Aktywne Kampanie",
        currently_running: "Obecnie działające",
        total_leads: "Łączne Leady",
        in_campaigns: "W kampaniach",
        conversion_rate: "Współczynnik Konwersji",
        overall_performance: "Ogólna wydajność",
        emails_sent: "E-maile Wysłane",
        total_sent: "Łącznie wysłane",
        email_performance: "Wydajność E-maili",
        open_rate: "Współczynnik Otwarć",
        click_rate: "Współczynnik Kliknięć",
        bounce_rate: "Współczynnik Odbić",
        engagement_breakdown: "Podział Zaangażowania",
        emails_opened: "E-maile Otwarte",
        emails_clicked: "E-maile Kliknięte",
        unsubscribe_rate: "Współczynnik Wypisań",
        lead_status_breakdown: "Podział Statusu Leadów",
        recent_activity: "Ostatnia Aktywność",
        leads_this_week: "Leady w tym tygodniu",
        leads_this_month: "Leady w tym miesiącu",
        emails_this_week: "E-maile w tym tygodniu",
        emails_this_month: "E-maile w tym miesiącu",
      },
      campaignStarter: {
        description:
          "Konfiguruj automatyczne ustawienia startera kampanii i harmonogram",
        form: {
          cronSettings: {
            label: "Ustawienia zadania w tle",
            description: "Konfiguruj ustawienia wykonywania zadania w tle",
            schedule: {
              label: "Harmonogram",
              placeholder: "Wprowadź wyrażenie cron (np. */3 * * * *)",
            },
            timezone: {
              label: "Strefa Czasowa",
              placeholder: "Wprowadź strefę czasową (np. UTC)",
            },
            enabled: {
              label: "Włączone",
            },
            priority: {
              label: "Priorytet",
              options: {
                low: "Niski",
                normal: "Normalny",
                high: "Wysoki",
                critical: "Krytyczny",
              },
            },
            timeout: {
              label: "Limit Czasu (ms)",
              placeholder: "Wprowadź limit czasu w milisekundach",
            },
            retries: {
              label: "Ponowne Próby",
              placeholder: "Liczba prób ponowienia",
            },
            retryDelay: {
              label: "Opóźnienie Ponowienia (ms)",
              placeholder: "Opóźnienie między próbami w milisekundach",
            },
          },
          dryRun: {
            label: "Tryb Testowy",
          },
          enabledDays: {
            label: "Włączone Dni",
            description:
              "Wybierz dni tygodnia, w które starter kampanii ma działać",
            options: {
              monday: "Poniedziałek",
              tuesday: "Wtorek",
              wednesday: "Środa",
              thursday: "Czwartek",
              friday: "Piątek",
              saturday: "Sobota",
              sunday: "Niedziela",
            },
          },
          enabledHours: {
            label: "Włączone Godziny",
            description:
              "Ustaw zakres czasowy, w którym starter kampanii ma działać",
            startHour: {
              label: "Godzina Rozpoczęcia",
              placeholder: "Godzina rozpoczęcia (0-23)",
            },
            endHour: {
              label: "Godzina Zakończenia",
              placeholder: "Godzina zakończenia (0-23)",
            },
          },
          leadsPerWeek: {
            label: "Leady na Tydzień",
            description:
              "Ustaw tygodniowy limit leadów do przetworzenia dla każdej lokalizacji",
          },
          minAgeHours: {
            label: "Minimalny Wiek (Godziny)",
            placeholder: "Wprowadź minimalny wiek w godzinach",
          },
          sections: {
            basic: {
              title: "Podstawowa Konfiguracja",
              description: "Konfiguruj podstawowe ustawienia startera kampanii",
            },
          },
          save: "Zapisz Konfigurację",
          success: "Konfiguracja została pomyślnie zapisana",
        },
        settings: {
          title: "Ustawienia Startera Kampanii",
          description: "Konfiguruj ustawienia zadania w tle startera kampanii",
        },
      },
      emails: {
        title: "Szablony E-mail",
        description:
          "Podgląd i zarządzanie szablonami e-maili dla kampanii leadowych",
        subtitle: "Zorganizowane według podróży klienta i etapu kampanii",
        journey: "Podróż",
        stage: "Etap",
        view_preview: "Zobacz Podgląd",
        total_templates: "Łącznie Szablonów",
        templates: "szablonów",
        variantRegistrations: "Rejestracje wariantów journey",
        variantRegistrationsDescription:
          "Rejestruj i kontroluj, które warianty journey są aktywne. Warianty zarejestrowane tutaj można aktywować lub dezaktywować bez ponownego wdrożenia.",
        from: "Od",
        recipient: "Do",
        subject: "Temat",
        email_preview: "Podgląd E-maila",
        preview_title: "Podgląd E-maila",
        stage_of: "z",
        stages: "etapów",
        preview: {
          actions: {
            title: "Akcje E-mailowe",
            description: "Testuj i zarządzaj szablonami e-maili",
          },
          live: "Podgląd Na Żywo",
          error: "Nie udało się wyrenderować podglądu e-maila",
        },
        testEmail: {
          button: "Wyślij E-mail Testowy",
          title: "Wyślij E-mail Testowy",
          send: "Wyślij E-mail Testowy",
          sending: "Wysyłanie...",
          success: "E-mail testowy wysłany pomyślnie na {{email}}",
          prefix: "[TEST]",
          recipient: {
            title: "Odbiorca Testowy",
            name: "Odbiorca Testowy",
            email: {
              label: "Adres E-mail Testowy",
              placeholder: "Wprowadź adres e-mail do otrzymania testu",
              description:
                "Adres e-mail, na który zostanie wysłany e-mail testowy",
            },
          },
          leadData: {
            title: "Dane Leada dla Szablonu",
            businessName: {
              label: "Nazwa Firmy",
              placeholder: "Przykładowa Firma Sp. z o.o.",
            },
            contactName: {
              label: "Imię i Nazwisko Kontaktu",
              placeholder: "Jan Kowalski",
            },
            phone: {
              label: "Numer Telefonu",
              placeholder: "+48123456789",
            },
            website: {
              label: "Strona Internetowa",
              placeholder: "https://example.com",
            },
            country: {
              label: "Kraj",
            },
            language: {
              label: "Język",
            },
            status: {
              label: "Status Leada",
            },
            source: {
              label: "Źródło Leada",
            },
            notes: {
              label: "Notatki",
              placeholder: "Testowy lead do podglądu e-maila",
            },
          },
          mockData: {
            businessName: "Acme Digital Solutions Sp. z o.o.",
            contactName: "Anna Nowak",
            phone: "+48-22-123-4567",
            website: "https://acme-digital.pl",
            notes:
              "Zainteresowana premium usługami zarządzania mediami społecznościowymi. Klient o wysokim potencjale z ugruntowanym biznesem.",
          },
        },
      },
      filters: {
        title: "Filtry",
        clear: "Wyczyść Filtry",
        search: {
          placeholder: "Szukaj po e-mailu, nazwie firmy lub kontakcie...",
        },
        status: {
          placeholder: "Filtruj po statusie",
          all: "Wszystkie Statusy",
        },
        campaign_stage: {
          all: "Wszystkie Etapy Kampanii",
        },
        country: "Kraj",
        countries: {
          title: "Kraj",
          all: "Wszystkie Kraje",
          global: "Globalny",
          us: "Stany Zjednoczone",
          ca: "Kanada",
          gb: "Wielka Brytania",
          de: "Niemcy",
          fr: "Francja",
          au: "Australia",
          pl: "Polska",
        },
        languages: {
          en: "Angielski",
          de: "Niemiecki",
          fr: "Francuski",
          es: "Hiszpański",
          pl: "Polski",
        },
        sources: {
          title: "Źródło",
          website: "Strona internetowa",
          socialMedia: "Media społecznościowe",
          emailCampaign: "Kampania e-mailowa",
          referral: "Polecenie",
          csvImport: "Import CSV",
          all: "Wszystkie Źródła",
          organic: "Organiczne",
          paid: "Płatne Reklamy",
          social: "Media Społecznościowe",
          email: "E-mail",
          direct: "Bezpośrednie",
        },
        timePeriod: "Okres Czasu",
        timePeriods: {
          hour: "Godzinowo",
          day: "Dziennie",
          week: "Tygodniowo",
          month: "Miesięcznie",
          quarter: "Kwartalnie",
          year: "Rocznie",
        },
        dateRange: "Zakres Dat",
        dateRanges: {
          today: "Dzisiaj",
          yesterday: "Wczoraj",
          last7Days: "Ostatnie 7 Dni",
          last30Days: "Ostatnie 30 Dni",
          last90Days: "Ostatnie 90 Dni",
          thisMonth: "Ten Miesiąc",
          lastMonth: "Ostatni Miesiąc",
          thisQuarter: "Ten Kwartał",
          lastQuarter: "Ostatni Kwartał",
          thisYear: "Ten Rok",
          lastYear: "Ostatni Rok",
        },
        chartType: "Typ Wykresu",
        chartTypes: {
          line: "Wykres Liniowy",
          bar: "Wykres Słupkowy",
          area: "Wykres Obszarowy",
        },
        statuses: {
          title: "Status",
          all: "Wszystkie Statusy",
          new: "Nowy",
          pending: "Oczekujący",
          campaign_running: "Kampania w toku",
          website_user: "Użytkownik strony",
          newsletter_subscriber: "Subskrybent newslettera",
          nurturing: "Pielęgnowany",
          converted: "Skonwertowany",
          signed_up: "Zarejestrowany",
          subscription_confirmed: "Subskrypcja Potwierdzona",
          unsubscribed: "Wypisany",
          bounced: "Odrzucony",
          invalid: "Nieprawidłowy",
        },
      },
      formatting: {
        percentage: {
          zero: "0%",
          format: "{{value}}%",
        },
        fallbacks: {
          dash: "—",
          never: "Nigdy",
          direct: "Bezpośrednio",
          unknown: "Nieznany",
          noSource: "Brak źródła",
          notAvailable: "N/D",
        },
      },
      import: {
        label: "Importuj",
        description: "Importuj leady z plików CSV",
        button: "Importuj Leady",
        title: "Importuj Leady z CSV",
        actions: {
          import: "Importuj",
        },
        template: {
          title: "Pobierz Szablon",
          description: "Pobierz szablon CSV z wymaganymi kolumnami",
          download: "Pobierz Szablon",
          examples: {
            example1:
              "jan@przyklad.com,Przykład Sp. z o.o.,Jan Kowalski,+48-123-456789,https://przyklad.com,PL,pl,website,Zainteresowany funkcjami premium",
            example2:
              "anna@firma.com,Firma SA,Anna Nowak,+48-987-654321,https://firma.com,PL,pl,referral,Szuka automatyzacji social media",
          },
        },
        file: {
          label: "Plik CSV",
          dropzone: {
            title: "Upuść swój plik CSV tutaj",
            description: "lub kliknij, aby przeglądać pliki",
          },
          validation: {
            required: "Proszę wybrać plik CSV do przesłania",
          },
        },
        options: {
          title: "Opcje Importu",
          description:
            "Skonfiguruj sposób obsługi istniejących danych podczas importu",
          skipDuplicates: "Pomiń leady z duplikowanymi adresami e-mail",
          updateExisting: "Aktualizuj istniejące leady nowymi danymi",
        },
        batch: {
          title: "Przetwarzanie Wsadowe",
          description: "Skonfiguruj sposób przetwarzania dużych importów",
          useChunkedProcessing: "Użyj przetwarzania wsadowego",
          useChunkedProcessingDescription:
            "Przetwarzaj duże pliki CSV w mniejszych partiach za pomocą zadań w tle. Zalecane dla plików z więcej niż 1000 wierszami.",
          batchSize: "Rozmiar partii",
          batchSizeDescription:
            "Liczba wierszy do przetworzenia na partię (10-1000)",
          batchSizePlaceholder: "100",
        },
        defaults: {
          title: "Wartości Domyślne",
          description:
            "Ustaw domyślne wartości dla leadów, które nie określają tych pól",
          country: "Domyślny Kraj",
          countryDescription: "Kraj używany gdy nie jest określony w CSV",
          countryPlaceholder: "Wybierz domyślny kraj",
          language: "Domyślny Język",
          languageDescription: "Język używany gdy nie jest określony w CSV",
          languagePlaceholder: "Wybierz domyślny język",
          status: "Domyślny Status",
          statusDescription: "Status używany gdy nie jest określony w CSV",
          statusPlaceholder: "Wybierz domyślny status",
          campaignStage: "Domyślny Etap Kampanii",
          campaignStageDescription:
            "Etap kampanii używany gdy nie jest określony w CSV",
          campaignStagePlaceholder: "Wybierz domyślny etap kampanii",
          source: "Domyślne Źródło",
          sourceDescription: "Źródło używane gdy nie jest określone w CSV",
          sourcePlaceholder: "Wybierz domyślne źródło",
        },
        progress: {
          title: "Postęp Importu",
          processing: "Przetwarzanie...",
        },
        status: {
          title: "Status Importu",
          pending: "Oczekujący",
          processing: "Przetwarzanie",
          completed: "Zakończony",
          failed: "Nieudany",
          unknown: "Nieznany",
          rows: "wierszy",
          summary:
            "{{successful}} udanych, {{failed}} nieudanych, {{duplicates}} duplikatów",
          andMore: "i {{count}} więcej",
          importing: "Importowanie",
          loading: "Ładowanie statusu importu...",
          activeJobs: "Aktywne zadania importu",
          preparing: "Przygotowywanie importu...",
        },
        settings: {
          title: "Ustawienia zadania importu",
          description: "Dostosuj ustawienia dla tego zadania importu",
          batchSize: "Rozmiar partii",
          maxRetries: "Maksymalna liczba ponownych prób",
        },
        success:
          "Pomyślnie zaimportowano {{successful}} z {{total}} leadów. {{failed}} nieudanych, {{duplicates}} duplikatów.",
        importing: "Importowanie...",
        start: "Rozpocznij Import",
        error: {
          generic: "Import nieudany. Sprawdź format pliku i spróbuj ponownie.",
          invalid_email_format: "Nieprawidłowy format e-mail",
          email_required: "E-mail jest wymagany",
        },
        errors: {
          noData: "Nie znaleziono danych w przesłanym pliku",
          missingHeaders: "Brakuje wymaganych nagłówków w pliku CSV",
        },
      },
      results: {
        showing: "Pokazuje {{start}}-{{end}} z {{total}} leadów",
      },
      sort: {
        newest: "Najnowsze pierwsze",
        oldest: "Najstarsze pierwsze",
        business_asc: "Firma A-Z",
        business_desc: "Firma Z-A",
      },
      source: {
        website: "Strona internetowa",
        social_media: "Media społecznościowe",
        email_campaign: "Kampania e-mailowa",
        referral: "Polecenie",
        csv_import: "Import CSV",
        api: "API",
      },
      stage: {
        not_started: "Nie rozpoczęto",
        initial: "Kontakt Początkowy",
        followup_1: "Kontynuacja 1",
        followup_2: "Kontynuacja 2",
        followup_3: "Kontynuacja 3",
        nurture: "Pielęgnacja",
        reactivation: "Reaktywacja",
      },
      stats: {
        // Page metadata
        title: "Statystyki Leadów",
        description:
          "Przeglądaj i analizuj statystyki leadów oraz metryki wydajności",
        filter: "Filtruj",
        refresh: "Odśwież",

        // UI Component translations
        totalLeads: "Łączne Leady",
        newThisMonth: "Nowe W Tym Miesiącu",
        activeLeads: "Aktywne Leady",
        ofTotal: "z ogólnej liczby",
        conversionRate: "Współczynnik Konwersji",
        convertedLeads: "Skonwertowane Leady",
        emailEngagement: "Zaangażowanie E-mail",
        emailsSent: "Wysłane E-maile",
        bookingRate: "Wskaźnik Rezerwacji",
        dataCompleteness: "Kompletność Danych",
        profileCompleteness: "Kompletność Profilu",
        leadVelocity: "Prędkość Leadów",
        leadsPerDay: "Leady Na Dzień",
        signedUpLeads: "Zarejestrowane Leady",
        signupRate: "Wskaźnik Rejestracji",
        subscriptionConfirmedLeads: "Leady z Potwierdzoną Subskrypcją",
        confirmationRate: "Wskaźnik Potwierdzenia",
        unsubscribedLeads: "Wypisane Leady",
        bouncedLeads: "Odrzucone Leady",
        invalidLeads: "Nieprawidłowe Leady",
        leadsWithEmailEngagement: "Leady z Zaangażowaniem E-mail",
        leadsWithoutEmailEngagement: "Leady Bez Zaangażowania E-mail",
        averageEmailEngagementScore: "Średni Wynik Zaangażowania E-mail",
        engagementScore: "Wynik Zaangażowania",
        totalEmailEngagements: "Całkowite Zaangażowania E-mail",
        totalEngagements: "Całkowite Zaangażowania",
        todayActivity: "Dzisiejsza Aktywność",
        leadsCreatedToday: "Leady Utworzone Dzisiaj",
        leadsUpdatedToday: "Leady Zaktualizowane Dzisiaj",
        weekActivity: "Aktywność W Tym Tygodniu",
        leadsCreatedThisWeek: "Leady Utworzone W Tym Tygodniu",
        leadsUpdatedThisWeek: "Leady Zaktualizowane W Tym Tygodniu",
        monthActivity: "Aktywność W Tym Miesiącu",
        leadsCreatedThisMonth: "Leady Utworzone W Tym Miesiącu",
        leadsUpdatedThisMonth: "Leady Zaktualizowane W Tym Miesiącu",
        campaignStageDistribution: "Dystrybucja Etapów Kampanii",
        leadsInActiveCampaigns: "Leady w Aktywnych Kampaniach",
        leadsNotInCampaigns: "Leady Nie w Kampaniach",
        journeyVariantDistribution: "Dystrybucja Wariantów Podróży",
        countWithPercentage: "{{count}} ({{percentage}}%)",
        overview: "Przegląd",
        campaigns: "Kampanie",
        performance: "Wydajność",
        distribution: "Dystrybucja",
        activity: "Aktywność",
        topPerformers: "Najlepsi Wykonawcy",
        historicalSubtitle: "Dane Historyczne",
        campaignPerformance: "Wydajność Kampanii",
        emailsOpened: "Otwarte E-maile",
        open_rate: "Wskaźnik Otwarć",
        click_rate: "Wskaźnik Kliknięć",
        topCampaigns: "Najlepsze Kampanie",
        leadsGenerated: "Wygenerowane Leady",
        performanceMetrics: "Metryki Wydajności",
        avgTimeToConversion: "Średni Czas Do Konwersji",
        avgTimeToSignup: "Średni Czas Do Rejestracji",
        topSources: "Najlepsze Źródła",
        qualityScore: "Wynik Jakości",
        statusDistribution: "Dystrybucja Statusu",
        sourceDistribution: "Dystrybucja Źródeł",
        geographicDistribution: "Dystrybucja Geograficzna",
        dataCompletenessBreakdown: "Podział Kompletności Danych",
        withBusinessName: "Z Nazwą Firmy",
        withContactName: "Z Imieniem Kontaktu",
        withPhone: "Z Telefonem",
        withWebsite: "Ze Stroną Internetową",
        recentActivity: "Ostatnia Aktywność",
        engagementLevelDistribution: "Dystrybucja Poziomów Zaangażowania",
        topPerformingCampaigns: "Najlepiej Działające Kampanie",
        openRate: "Wskaźnik Otwarć",
        clickRate: "Wskaźnik Kliknięć",
        topPerformingSources: "Najlepiej Działające Źródła",

        chart: {
          series: {
            totalLeads: "Łączne Leady",
            newLeads: "Nowe Leady",
            qualifiedLeads: "Wykwalifikowane Leady",
            convertedLeads: "Skonwertowane Leady",
          },
          title: "Statystyki Leadów w Czasie",
          noData: "Brak danych dla wybranego okresu",
          yAxisLabel: "Liczba Leadów",
          xAxisLabel: "Data",
        },
        grouped: {
          by_status: "Według Statusu: {{status}}",
          by_source: "Według Źródła: {{source}}",
          by_country: "Według Kraju: {{country}}",
          by_language: "Według Języka: {{language}}",
          by_campaign_stage: "Według Etapu Kampanii: {{stage}}",
          by_journey_variant: "Według Wariantu Podróży: {{variant}}",
          by_engagement_level: "Według Poziomu Zaangażowania: {{level}}",
          by_conversion_funnel: "Według Lejka Konwersji: {{stage}}",
        },
        legend: {
          title: "Legenda wykresu",
          showAll: "Pokaż wszystko",
          hideAll: "Ukryj wszystko",
          clickToToggle: "Kliknij, aby przełączyć widoczność serii",
        },
        metrics: {
          total_leads: "Łączne Leady",
          new_leads: "Nowe Leady",
          active_leads: "Aktywne Leady",
          campaign_running_leads: "Kampania w toku Leady",
          website_user_leads: "Użytkownik strony Leady",
          newsletter_subscriber_leads: "Subskrybent newslettera Leady",
          qualified_leads: "Wykwalifikowane Leady",
          converted_leads: "Skonwertowane Leady",
          signed_up_leads: "Zarejestrowane Leady",
          subscription_confirmed_leads: "Leady z Potwierdzoną Subskrypcją",
          unsubscribed_leads: "Wypisane Leady",
          bounced_leads: "Odrzucone Leady",
          invalid_leads: "Nieprawidłowe Leady",
          emails_sent: "Wysłane E-maile",
          emails_opened: "Otwarte E-maile",
          emails_clicked: "Kliknięte E-maile",
          open_rate: "Wskaźnik Otwarć",
          click_rate: "Wskaźnik Kliknięć",
          conversion_rate: "Wskaźnik Konwersji",
          signup_rate: "Wskaźnik Rejestracji",
          subscription_confirmation_rate: "Wskaźnik Potwierdzenia Subskrypcji",
          average_email_engagement_score: "Średni Wynik Zaangażowania E-mail",
          lead_velocity: "Prędkość Leadów",
          data_completeness_rate: "Wskaźnik Kompletności Danych",
          status_historical: "Dane Historyczne Statusu",
          source_historical: "Dane Historyczne Źródła",
          country_historical: "Dane Historyczne Kraju",
          language_historical: "Dane Historyczne Języka",
          campaign_stage_historical: "Dane Historyczne Etapu Kampanii",
          journey_variant_historical: "Dane Historyczne Wariantów Podróży",
          engagement_level_historical:
            "Dane Historyczne Poziomów Zaangażowania",
          conversion_funnel_historical: "Dane Historyczne Lejka Konwersji",
          campaign_performance: "Wydajność Kampanii",
          source_performance: "Wydajność Źródła",
          website_leads: "Leady ze Strony",
          social_media_leads: "Leady z Mediów Społecznościowych",
          email_campaign_leads: "Leady z Kampanii E-mail",
          referral_leads: "Leady z Polecenia",
          csv_import_leads: "Leady z Importu CSV",
          api_leads: "Leady z API",
          new_status_leads: "Leady ze Statusem Nowe",
          pending_leads: "Leady Oczekujące",
          contacted_leads: "Leady Skontaktowane",
          engaged_leads: "Leady Zaangażowane",
          german_leads: "Leady z Niemiec",
          polish_leads: "Leady z Polski",
          global_leads: "Leady Globalne",
          german_language_leads: "Leady Niemieckojęzyczne",
          english_language_leads: "Leady Anglojęzyczne",
          polish_language_leads: "Leady Polskojęzyczne",
          not_started_leads: "Leady Nie Rozpoczęte",
          initial_stage_leads: "Leady Etap Początkowy",
          followup_1_leads: "Leady Kontynuacja 1",
          followup_2_leads: "Leady Kontynuacja 2",
          followup_3_leads: "Leady Kontynuacja 3",
          nurture_leads: "Leady Pielęgnacja",
          reactivation_leads: "Leady Reaktywacja",
          personal_approach_leads: "Leady Podejście Osobiste",
          results_focused_leads: "Leady Skoncentrowane na Wynikach",
          personal_results_leads: "Leady Osobiste Wyniki",
          high_engagement_leads: "Leady Wysokie Zaangażowanie",
          medium_engagement_leads: "Leady Średnie Zaangażowanie",
          low_engagement_leads: "Leady Niskie Zaangażowanie",
          no_engagement_leads: "Leady Brak Zaangażowania",
        },
        sources: {
          website: "Strona internetowa",
          social_media: "Media społecznościowe",
          email_campaign: "Kampania e-mailowa",
          referral: "Polecenie",
          csv_import: "Import CSV",
          api: "API",
          unknown: "Nieznane",
          legend: {
            title: "Legenda źródeł",
            visible: "widoczne",
            leads: "{{count}} lead_one ({{percentage}}%)",
            leads_one: "{{count}} lead ({{percentage}}%)",
            leads_other: "{{count}} leadów ({{percentage}}%)",
            summary:
              "{{visible}} z {{total}} źródeł widocznych ({{percentage}}%)",
          },
        },
      },
      status: {
        new: "Nowy",
        pending: "Oczekujący",
        campaign_running: "Kampania w toku",
        website_user: "Użytkownik strony",
        in_contact: "W kontakcie",
        newsletter_subscriber: "Subskrybent newslettera",
        signed_up: "Zarejestrowany",
        subscription_confirmed: "Subskrypcja potwierdzona",
        unsubscribed: "Wypisany",
        bounced: "Odrzucony",
        invalid: "Nieprawidłowy",
        unknown: "Nieznany",
      },
      table: {
        title: "Leady",
        total: "łączne leady",
        email: "E-mail",
        business: "Firma",
        status: "Status",
        stage: "Etap Kampanii",
        campaign_stage: "Etap Kampanii",
        country: "Kraj",
        language: "Język",
        phone: "Telefon",
        website: "Strona",
        emails: "E-maile",
        emails_sent: "E-maile Wysłane",
        emails_opened: "E-maile Otwarte",
        emails_clicked: "E-maile Kliknięte",
        last_engagement: "Ostatnie Zaangażowanie",
        last_email_sent: "Ostatni E-mail Wysłany",
        created: "Utworzone",
        updated: "Zaktualizowane",
        source: "Źródło",
        notes: "Notatki",
        actions: "Akcje",
        scroll_hint:
          "💡 Przewiń w poziomie, aby zobaczyć wszystkie szczegóły i kolumny leadów",
        select_all: "Wybierz wszystkie leady",
        select_lead: "Wybierz {{business}}",
        description: {
          recent: "Ostatnio dodane leady do Twojej bazy danych",
          complete: "Pełna lista leadów z akcjami zarządzania",
          overview: "Ostatnio dodane leady do Twojej bazy danych",
        },
      },
      tabs: {
        overview: "Przegląd",
        leads: "Leady",
        leads_description: "Zarządzaj i przeglądaj wszystkie leady",
        campaigns: "Kampanie",
        campaigns_description: "Zarządzaj kampaniami e-mail i automatyzacją",
        stats: "Statystyki",
        stats_description: "Wyświetl statystyki i analizy leadów",
        emails: "Podglądy e-maili",
        emails_description: "Podgląd i zarządzanie szablonami e-maili",
        abTesting: "Testy A/B",
        abTesting_description:
          "Konfiguruj i monitoruj testy A/B dla kampanii e-mailowych",
        campaignStarter: "Starter Kampanii",
        campaignStarter_description: "Konfiguruj ustawienia startera kampanii",
        import: "Importuj",
        import_description: "Importuj leady z plików CSV",
      },
    },
    campaign: {
      title: "System kampanii e-mailowych",
      description: "Zarządzaj swoimi kampaniami e-mailowymi",
      starter: {
        title: "Kampania startowa",
        description: "Rozpocznij od prostej kampanii",
        schedule: "Codziennie o 9:00",
      },
      emails: {
        title: "Kampania e-mailowa",
        description: "Wysyłaj spersonalizowane e-maile",
        schedule: "Codziennie o 10:00",
      },
      cleanup: {
        title: "Czyszczenie",
        description: "Wyczyść stare kampanie",
        schedule: "Co tydzień w niedzielę",
      },
      info: "Zarządzanie kampaniami jest obsługiwane automatycznie przez zadania w tle. Odwiedź stronę administracyjną zadań w tle, aby uzyskać szczegółowe monitorowanie.",
    },
    constants: {
      unknown: "nieznany",
      defaultLanguage: "pl",
      validationError: "Błąd walidacji",
    },
    csvImport: {
      exampleData: {
        row1: "john@example.com,Example Corp,John Doe,+1234567890,https://example.com,DE,en,website,Zainteresowany funkcjami premium",
        row2: "jane@company.com,Company Inc,Jane Smith,+0987654321,https://company.com,PL,en,referral,Szuka automatyzacji social media",
      },
    },
    edit: {
      form: {
        actions: {
          back: "Wstecz",
          save: "Zapisz",
          saving: "Zapisywanie...",
          cancel: "Anuluj",
        },
        additionalInfo: {
          title: "Dodatkowe informacje",
          description: "Źródło i notatki",
        },
        businessInfo: {
          title: "Informacje biznesowe",
          description: "Podstawowe szczegóły biznesowe",
        },
        contactInfo: {
          title: "Informacje kontaktowe",
          description: "Dane kontaktowe i preferencje komunikacyjne",
        },
        fields: {
          id: {
            label: "ID",
            description: "Unikalny identyfikator dla leada",
          },
          businessName: {
            label: "Nazwa firmy",
            placeholder: "Wprowadź nazwę firmy",
          },
          contactName: {
            label: "Imię kontaktu",
            placeholder: "Wprowadź imię osoby kontaktowej",
          },
          email: {
            label: "Adres email",
            placeholder: "Wprowadź adres email",
          },
          phone: {
            label: "Numer telefonu",
            placeholder: "Wprowadź numer telefonu",
          },
          website: {
            label: "Strona internetowa",
            placeholder: "Wprowadź URL strony internetowej",
          },
          country: {
            label: "Kraj",
            placeholder: "Wybierz kraj",
          },
          language: {
            label: "Język",
            placeholder: "Wybierz język",
          },
          status: {
            label: "Status",
            description: "Aktualny status leada",
            placeholder: "Wybierz status",
            options: {
              new: "Nowy",
              pending: "Oczekujący",
              campaign_running: "Kampania w toku",
              website_user: "Użytkownik strony",
              newsletter_subscriber: "Subskrybent newslettera",
              in_contact: "W kontakcie",
              signed_up: "Zarejestrowany",
              subscription_confirmed: "Subskrypcja potwierdzona",
              unsubscribed: "Wypisany",
              bounced: "Odrzucony",
              invalid: "Nieprawidłowy",
            },
          },
          currentCampaignStage: {
            label: "Etap kampanii",
            description: "Aktualny etap w kampanii e-mailowej",
            placeholder: "Wybierz etap kampanii",
            options: {
              not_started: "Nie rozpoczęto",
              initial: "Początkowy",
              followup_1: "Follow-up 1",
              followup_2: "Follow-up 2",
              followup_3: "Follow-up 3",
              nurture: "Pielęgnowanie",
              reactivation: "Reaktywacja",
            },
          },
          source: {
            label: "Źródło",
            placeholder: "Wprowadź źródło lead",
          },
          notes: {
            label: "Notatki",
            description: "Dodatkowe uwagi o leadzie",
            placeholder: "Wprowadź notatki",
          },
          metadata: {
            label: "Metadane",
            description: "Dodatkowe metadane jako JSON",
            placeholder: "Wprowadź metadane jako JSON",
          },
          convertedUserId: {
            label: "Konwertowany Użytkownik",
            placeholder:
              "Wybierz użytkownika, na którego ten lead został konwertowany...",
            searchPlaceholder: "Szukaj użytkowników...",
            searchHint: "Wpisz co najmniej 2 znaki, aby wyszukać",
            noResults: "Nie znaleziono użytkowników",
            selectedUser: "{{firstName}} {{lastName}} ({{email}})",
          },
        },
        locationStatus: {
          title: "Lokalizacja i Status",
          description: "Lokalizacja geograficzna i status lead",
        },
      },
      success: {
        title: "Lead zaktualizowany pomyślnie",
        description: "Lead został pomyślnie zaktualizowany.",
      },
    },
    emails: {
      tagline: "Twoja Platforma Zarządzania Social Media",
      initial: {
        subject: "Przekształć obecność {{businessName}} w social media",
        greeting: "Cześć,",
        intro:
          "Zauważyłem {{businessName}} i pomyślałem, że możesz być zainteresowany tym, jak pomagamy firmom takim jak Twoja zwiększyć obecność w social media o 300% lub więcej.",
        value_proposition:
          "Nasza platforma automatyzuje zarządzanie social media, zachowując autentyczne zaangażowanie z Twoją publicznością.",
        benefit_1: "Automatyczne planowanie treści na wszystkich platformach",
        benefit_2:
          "Zarządzanie zaangażowaniem i odpowiedziami wspierane przez AI",
        benefit_3: "Szczegółowe analizy i wgląd w rozwój",
        cta: "Zobacz jak to działa",
        closing:
          "Chciałbym pokazać Ci, jak to mogłoby działać dla Twojej firmy. Bez zobowiązań.",
      },
      followup1: {
        subject:
          "{{businessName}}: Zobacz jak inni wzrosli o 300% z naszą platformą",
        greeting: "Cześć,",
        intro:
          "Chciałem nawiązać do mojego poprzedniego e-maila o pomocy {{businessName}} w rozwoju obecności w social media.",
        case_study_title: "Prawdziwe wyniki od podobnych firm",
        case_study_content:
          "Właśnie w zeszłym miesiącu firma podobna do Twojej zwiększyła zaangażowanie w social media o 340% i wygenerowała 50+ nowych leadów bezpośrednio z social media używając naszej platformy.",
        social_proof:
          "Ponad 1000+ firm ufa nam w zarządzaniu rozwojem ich social media.",
        cta: "Zobacz studia przypadków",
        closing:
          "Chętnie pokażę Ci dokładnie, jak osiągnęliśmy te wyniki i jak mogłoby to działać dla Twojej firmy.",
      },
      signature: {
        best_regards: "Z poważaniem,",
        team: "Zespół {{companyName}}",
      },
      footer: {
        unsubscribe_text: "Nie chcesz otrzymywać tych e-maili?",
        unsubscribe_link: "Wypisz się tutaj",
      },
    },
    engagement: {
      types: {
        email_open: "Otwarcie e-maila",
        email_click: "Kliknięcie e-maila",
        website_visit: "Wizyta na stronie",
        form_submit: "Wysłanie formularza",
      },
    },
    errors: {
      create: {
        conflict: {
          title: "Lead już istnieje",
          description: "Lead z tym adresem e-mail już istnieje w systemie.",
        },
        validation: {
          title: "Nieprawidłowe dane leada",
          description: "Sprawdź informacje o leadzie i spróbuj ponownie.",
        },
      },
      get: {
        notFound: {
          title: "Lead nie znaleziony",
          description: "Żądany lead nie mógł zostać znaleziony.",
        },
      },
      update: {
        notFound: {
          title: "Lead nie znaleziony",
          description:
            "Lead, który próbujesz zaktualizować, nie mógł zostać znaleziony.",
        },
        validation: {
          title: "Nieprawidłowe dane aktualizacji",
          description: "Sprawdź informacje aktualizacji i spróbuj ponownie.",
        },
      },
      import: {
        badRequest: {
          title: "Nieprawidłowy plik CSV",
          description: "Format pliku CSV jest nieprawidłowy lub pusty.",
        },
        validation: {
          title: "Błąd walidacji CSV",
          description:
            "Niektóre wiersze w pliku CSV zawierają nieprawidłowe dane.",
        },
      },
    },
    export: {
      headers: {
        email: "E-mail",
        businessName: "Nazwa firmy",
        contactName: "Imię i nazwisko kontaktu",
        phone: "Telefon",
        website: "Strona internetowa",
        country: "Kraj",
        language: "Język",
        status: "Status",
        source: "Źródło",
        notes: "Notatki",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
        emailsSent: "Wysłane e-maile",
        emailsOpened: "Otwarte e-maile",
        emailsClicked: "Kliknięte e-maile",
        lastEmailSent: "Ostatni wysłany e-mail",
        lastEngagement: "Ostatnie zaangażowanie",
        unsubscribedAt: "Wypisano",
        metadata: "Metadane",
      },
      fileName: {
        prefix: "leads_export_",
        suffix: {
          csv: ".csv",
          excel: ".xlsx",
        },
      },
    },
    filter: {
      status: "Filtruj według statusu",
      campaign_stage: "Filtruj według etapu kampanii",
      country: "Filtruj według kraju",
      language: "Filtruj według języka",
      source: "Filtruj według źródła",
      all_statuses: "Wszystkie statusy",
      all_countries: "Wszystkie kraje",
      all_languages: "Wszystkie języki",
      all_sources: "Wszystkie źródła",
      sort: "Sortuj według",
      page_size: "Rozmiar strony",
      countries: {
        global: "Globalny",
        de: "Niemcy",
        pl: "Polska",
      },
      languages: {
        en: "Angielski",
        de: "Niemiecki",
        pl: "Polski",
      },
      sources: {
        website: "Strona internetowa",
        social_media: "Media społecznościowe",
        email_campaign: "Kampania e-mailowa",
        referral: "Polecenie",
        csv_import: "Import CSV",
        api: "API",
      },
      quick_filters: "Szybkie Filtry",
      quick: {
        new_leads: "Nowe Leady",
        campaign_running: "Kampania w toku",
        not_started: "Nie Rozpoczęte",
        imported: "Importowane",
      },
    },
    import: {
      validation: {
        missingFields: "Brakuje wymaganych pól",
        invalidEmail: "Nieprawidłowy adres e-mail",
        invalidData: "Nieprawidłowy format danych",
        failed: "Walidacja nie powiodła się",
      },
      defaults: {
        language: "pl",
        source: "csv_import",
      },
    },
    list: {
      title: "Lista Leadów",
      titleWithCount: "Lista Leadów ({{count}})",
      description:
        "Przeglądaj i zarządzaj wszystkimi leadami z zaawansowanymi opcjami filtrowania i sortowania",
      loading: "Ładowanie...",
      no_results: "Nie znaleziono leadów spełniających Twoje kryteria",
      noResults: "Nie znaleziono leadów spełniających Twoje kryteria",
      results: {
        showing: "Pokazuje {{start}}-{{end}} z {{total}} leadów",
      },
      table: {
        title: "Wszystkie Leady",
        campaign_stage: "Etap Kampanii",
        contact: "Kontakt",
      },
      filters: {
        title: "Filtry",
      },
    },
    pagination: {
      page_size: "Rozmiar Strony",
      page_info: "Strona {{current}} z {{total}}",
      page_info_with_count:
        "Strona {{current}} z {{total}} ({{count}} łącznie)",
      first: "Pierwsza",
      previous: "Poprzednia",
      next: "Następna",
      last: "Ostatnia",
    },
    search: {
      placeholder: "Szukaj leadów...",
      error: {
        validation: {
          title: "Błąd walidacji",
          description:
            "Proszę sprawdzić wprowadzone dane i spróbować ponownie.",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do wykonania tej akcji.",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił błąd serwera. Proszę spróbować ponownie później.",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd.",
        },
      },
      success: {
        title: "Wyszukiwanie zakończone sukcesem",
        description: "Leady zostały pomyślnie znalezione.",
      },
    },
    sort: {
      placeholder: "Sortuj według",
      field: "Pole Sortowania",
      order: "Kolejność Sortowania",
      created: "Data utworzenia",
      updated: "Data aktualizacji",
      email: "E-mail",
      business: "Firma",
      last_engagement: "Ostatnie Zaangażowanie",
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    sorting: {
      fields: {
        email: "E-mail",
        businessName: "Nazwa firmy",
        updatedAt: "Zaktualizowano",
        lastEngagementAt: "Ostatnie zaangażowanie",
        createdAt: "Utworzono",
      },
    },
    success: {
      create: {
        title: "Lead utworzony",
        description: "Lead został pomyślnie dodany do systemu.",
      },
      update: {
        title: "Lead zaktualizowany",
        description: "Informacje o leadzie zostały pomyślnie zaktualizowane.",
      },
      import: {
        title: "Import zakończony",
        description: "Import CSV został pomyślnie zakończony.",
      },
      unsubscribe: {
        title: "Wypisany",
        description: "Zostałeś pomyślnie wypisany z naszych e-maili.",
      },
    },
    tracking: {
      errors: {
        missingId: "ID leada jest wymagane do śledzenia",
        invalidIdFormat: "ID leada musi być w prawidłowym formacie UUID",
        invalidCampaignIdFormat:
          "ID kampanii musi być w prawidłowym formacie UUID",
        invalidUrl: "Nieprawidłowy format URL",
      },
    },
    unsubscribe: {
      title: "Wypisz się z e-maili",
      description:
        "Przykro nam, że odchodzisz. Możesz wypisać się z naszych e-maili poniżej. To usunie Cię ze wszystkich komunikatów leadowych i e-maili marketingowych.",
      success: "Zostałeś pomyślnie wypisany.",
      error: "Wystąpił błąd podczas przetwarzania Twojego żądania wypisania.",
      button: "Wypisz się",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        success: {
          title: "Aktualizacja wsadowa pomyślna",
          description: "Leady zostały pomyślnie zaktualizowane",
        },
        error: {
          server: {
            title: "Aktualizacja wsadowa nie powiodła się",
            description:
              "Nie można zaktualizować leadów z powodu błędu serwera",
          },
          validation: {
            title: "Walidacja nie powiodła się",
            description: "Sprawdź dane wejściowe i spróbuj ponownie",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description:
              "Nie masz uprawnień do wykonywania aktualizacji wsadowych",
          },
          forbidden: {
            title: "Zabronione",
            description: "Dostęp do aktualizacji wsadowych jest zabroniony",
          },
          not_found: {
            title: "Nie znaleziono",
            description: "Żądany zasób nie został znaleziony",
          },
          unknown: {
            title: "Nieznany błąd",
            description:
              "Wystąpił nieoczekiwany błąd podczas aktualizacji wsadowej",
          },
        },
        validation: {
          no_fields: "Należy podać co najmniej jedno pole do aktualizacji",
        },
      },
    },
    campaigns: {
      common: {
        error: {
          validation: {
            title: "Walidacja kampanii nie powiodła się",
            description: "Sprawdź dane kampanii i spróbuj ponownie",
          },
          unauthorized: {
            title: "Dostęp do kampanii odmówiony",
            description: "Nie masz uprawnień do dostępu do kampanii",
          },
          server: {
            title: "Błąd serwera kampanii",
            description:
              "Nie można przetworzyć kampanii z powodu błędu serwera",
          },
          unknown: {
            title: "Operacja kampanii nie powiodła się",
            description:
              "Wystąpił nieoczekiwany błąd podczas operacji kampanii",
          },
          forbidden: {
            title: "Dostęp do kampanii zabroniony",
            description:
              "Nie masz uprawnień do wykonania tej operacji kampanii",
          },
          notFound: {
            title: "Kampania nie znaleziona",
            description: "Żądana kampania nie została znaleziona",
          },
        },
      },
      delete: {
        success: {
          title: "Kampania usunięta",
          description: "Kampania została pomyślnie usunięta",
        },
      },
      get: {
        success: {
          title: "Statystyki kampanii załadowane",
          description: "Statystyki kampanii zostały pomyślnie pobrane",
        },
      },
      manage: {
        error: {
          validation: {
            title: "Walidacja zarządzania kampanią nie powiodła się",
            description: "Sprawdź dane kampanii i spróbuj ponownie",
          },
          unauthorized: {
            title: "Dostęp do zarządzania kampanią odmówiony",
            description: "Nie masz uprawnień do zarządzania kampaniami",
          },
          server: {
            title: "Błąd serwera zarządzania kampanią",
            description: "Nie można zarządzać kampanią z powodu błędu serwera",
          },
          unknown: {
            title: "Operacja zarządzania kampanią nie powiodła się",
            description:
              "Wystąpił nieoczekiwany błąd podczas zarządzania kampanią",
          },
          forbidden: {
            title: "Dostęp do zarządzania kampanią zabroniony",
            description: "Nie masz uprawnień do zarządzania kampaniami",
          },
          notFound: {
            title: "Kampania nie znaleziona",
            description: "Żądana kampania nie została znaleziona",
          },
          campaignActive:
            "Nie można usunąć aktywnej kampanii. Najpierw ją wyłącz.",
        },
        post: {
          success: {
            title: "Kampania utworzona",
            description: "Kampania została pomyślnie utworzona",
          },
        },
        put: {
          success: {
            title: "Kampania zaktualizowana",
            description: "Status kampanii został pomyślnie zaktualizowany",
          },
        },
        delete: {
          success: {
            title: "Kampania usunięta",
            description: "Kampania została pomyślnie usunięta",
          },
        },
      },
      post: {
        success: {
          title: "Kampania utworzona",
          description: "Kampania została pomyślnie utworzona",
        },
      },
      put: {
        success: {
          title: "Kampania zaktualizowana",
          description: "Status kampanii został pomyślnie zaktualizowany",
        },
      },
      stats: {
        error: {
          validation: {
            title: "Walidacja statystyk kampanii nie powiodła się",
            description: "Sprawdź parametry statystyk i spróbuj ponownie",
          },
          unauthorized: {
            title: "Dostęp do statystyk kampanii odmówiony",
            description:
              "Nie masz uprawnień do przeglądania statystyk kampanii",
          },
          server: {
            title: "Błąd serwera statystyk kampanii",
            description: "Nie można pobrać statystyk z powodu błędu serwera",
          },
          unknown: {
            title: "Operacja statystyk kampanii nie powiodła się",
            description:
              "Wystąpił nieoczekiwany błąd podczas pobierania statystyk",
          },
          forbidden: {
            title: "Dostęp do statystyk kampanii zabroniony",
            description:
              "Nie masz uprawnień do przeglądania statystyk kampanii",
          },
          notFound: {
            title: "Statystyki kampanii nie znalezione",
            description: "Żądane statystyki kampanii nie zostały znalezione",
          },
        },
        success: {
          title: "Statystyki kampanii załadowane",
          description: "Statystyki kampanii zostały pomyślnie pobrane",
        },
      },
    },
    constants: {
      defaultSource: "csv_import",
      validationError: "Błąd walidacji",
      trackingMethod: "click_implied",
    },
    leads: {
      get: {
        error: {
          validation: {
            title: "Walidacja danych potencjalnych klientów nie powiodła się",
            description:
              "Nie można zwalidować żądania danych potencjalnych klientów",
          },
          unauthorized: {
            title: "Dostęp do danych potencjalnych klientów odmówiony",
            description:
              "Nie masz uprawnień do dostępu do danych potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera danych potencjalnych klientów",
            description:
              "Nie można załadować danych potencjalnych klientów z powodu błędu serwera",
          },
          unknown: {
            title: "Dostęp do danych potencjalnych klientów nie powiódł się",
            description:
              "Wystąpił nieoczekiwany błąd podczas ładowania danych potencjalnych klientów",
          },
          not_found: {
            title: "Potencjalny klient nie znaleziony",
            description: "Żądany potencjalny klient nie mógł zostać znaleziony",
          },
          forbidden: {
            title: "Dostęp do potencjalnego klienta zabroniony",
            description:
              "Nie masz uprawnień do przeglądania tego potencjalnego klienta",
          },
          network: {
            title: "Błąd sieci",
            description:
              "Nie można załadować danych potencjalnych klientów z powodu błędu sieci",
          },
          unsaved_changes: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany, które zostaną utracone",
          },
          conflict: {
            title: "Konflikt danych",
            description:
              "Dane potencjalnego klienta zostały zmodyfikowane przez innego użytkownika",
          },
        },
        success: {
          title: "Dane potencjalnych klientów załadowane",
          description: "Informacje o potencjalnych klientach pobrane pomyślnie",
        },
      },
      patch: {
        error: {
          validation: {
            title:
              "Walidacja aktualizacji potencjalnego klienta nie powiodła się",
            description:
              "Sprawdź swoje aktualizacje potencjalnych klientów i spróbuj ponownie",
          },
          unauthorized: {
            title: "Aktualizacja potencjalnego klienta nieautoryzowana",
            description:
              "Nie masz uprawnień do aktualizacji potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera aktualizacji potencjalnego klienta",
            description:
              "Nie można zaktualizować potencjalnego klienta z powodu błędu serwera",
          },
          unknown: {
            title: "Aktualizacja potencjalnego klienta nie powiodła się",
            description:
              "Wystąpił nieoczekiwany błąd podczas aktualizacji potencjalnego klienta",
          },
          not_found: {
            title: "Potencjalny klient nie znaleziony",
            description:
              "Nie można znaleźć potencjalnego klienta do aktualizacji",
          },
          forbidden: {
            title: "Aktualizacja potencjalnego klienta zabroniona",
            description:
              "Nie masz uprawnień do aktualizacji tego potencjalnego klienta",
          },
          network: {
            title: "Błąd sieci",
            description:
              "Nie można zaktualizować potencjalnego klienta z powodu błędu sieci",
          },
          unsaved_changes: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany, które zostaną utracone",
          },
          conflict: {
            title: "Konflikt danych",
            description:
              "Dane potencjalnego klienta zostały zmodyfikowane przez innego użytkownika",
          },
        },
        success: {
          title: "Potencjalny klient zaktualizowany",
          description:
            "Informacje o potencjalnym kliencie zaktualizowane pomyślnie",
        },
      },
      post: {
        error: {
          validation: {
            title: "Walidacja tworzenia potencjalnego klienta nie powiodła się",
            description:
              "Sprawdź informacje o potencjalnym kliencie i spróbuj ponownie",
          },
          unauthorized: {
            title: "Tworzenie potencjalnego klienta nieautoryzowane",
            description:
              "Nie masz uprawnień do tworzenia potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera tworzenia potencjalnego klienta",
            description:
              "Nie można utworzyć potencjalnego klienta z powodu błędu serwera",
          },
          unknown: {
            title: "Tworzenie potencjalnego klienta nie powiodło się",
            description:
              "Wystąpił nieoczekiwany błąd podczas tworzenia potencjalnego klienta",
          },
          forbidden: {
            title: "Tworzenie potencjalnego klienta zabronione",
            description:
              "Nie masz uprawnień do tworzenia potencjalnych klientów",
          },
          duplicate: {
            title: "Potencjalny klient już istnieje",
            description:
              "Potencjalny klient z tym adresem e-mail już istnieje w systemie",
          },
          conflict: {
            title: "Potencjalny klient już istnieje",
            description:
              "Potencjalny klient z tym adresem e-mail już istnieje w systemie",
          },
        },
        success: {
          title: "Potencjalny klient utworzony",
          description: "Potencjalny klient utworzony pomyślnie",
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title:
              "Walidacja zaangażowania potencjalnych klientów nie powiodła się",
            description: "Sprawdź swoje dane zaangażowania i spróbuj ponownie",
          },
          unauthorized: {
            title: "Zaangażowanie potencjalnych klientów nieautoryzowane",
            description:
              "Nie masz uprawnień do rejestrowania zaangażowania potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera zaangażowania potencjalnych klientów",
            description:
              "Nie można zarejestrować zaangażowania potencjalnych klientów z powodu błędu serwera",
          },
          unknown: {
            title: "Zaangażowanie potencjalnych klientów nie powiodło się",
            description:
              "Wystąpił nieoczekiwany błąd podczas rejestrowania zaangażowania potencjalnych klientów",
          },
          forbidden: {
            title: "Zaangażowanie potencjalnego klienta zabronione",
            description:
              "Nie masz uprawnień do śledzenia zaangażowania potencjalnych klientów",
          },
        },
        success: {
          title: "Zaangażowanie potencjalnych klientów zarejestrowane",
          description:
            "Zaangażowanie potencjalnych klientów pomyślnie zarejestrowane",
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          validation: {
            title: "Walidacja eksportu potencjalnych klientów nie powiodła się",
            description: "Sprawdź parametry eksportu i spróbuj ponownie",
          },
          unauthorized: {
            title: "Eksport potencjalnych klientów nieautoryzowany",
            description:
              "Nie masz uprawnień do eksportowania potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera eksportu potencjalnych klientów",
            description:
              "Nie można wyeksportować potencjalnych klientów z powodu błędu serwera",
          },
          unknown: {
            title: "Eksport potencjalnych klientów nie powiódł się",
            description:
              "Wystąpił nieoczekiwany błąd podczas eksportowania potencjalnych klientów",
          },
        },
        success: {
          title: "Potencjalni klienci wyeksportowani",
          description: "Potencjalni klienci zostali pomyślnie wyeksportowani",
        },
      },
    },
    leadsImport: {
      delete: {
        success: {
          title: "Zadanie importu usunięte",
          description: "Zadanie importu zostało pomyślnie usunięte",
        },
        error: {
          unauthorized: {
            title: "Usuwanie zadania importu nieautoryzowane",
            description: "Nie masz uprawnień do usuwania zadań importu",
          },
          forbidden: {
            title: "Usuwanie zadania importu zabronione",
            description: "Nie masz uprawnień do usunięcia tego zadania importu",
          },
          not_found: {
            title: "Zadanie importu nie znalezione",
            description: "Nie można znaleźć zadania importu",
          },
          server: {
            title: "Błąd serwera usuwania zadania importu",
            description:
              "Zadanie importu nie mogło zostać usunięte z powodu błędu serwera",
          },
        },
      },
      get: {
        success: {
          title: "Zadania importu pobrane pomyślnie",
          description: "Lista zadań importu została załadowana",
        },
        error: {
          validation: {
            title: "Nieprawidłowe żądanie zadania importu",
            description: "Sprawdź parametry żądania",
          },
          unauthorized: {
            title: "Dostęp do zadań importu nieautoryzowany",
            description: "Nie masz uprawnień do przeglądania zadań importu",
          },
          server: {
            title: "Błąd serwera zadań importu",
            description:
              "Nie można pobrać zadań importu z powodu błędu serwera",
          },
          unknown: {
            title: "Pobieranie zadań importu nie powiodło się",
            description:
              "Wystąpił nieoczekiwany błąd podczas pobierania zadań importu",
          },
        },
      },
      patch: {
        success: {
          title: "Zadanie importu zaktualizowane pomyślnie",
          description: "Ustawienia zadania zostały zaktualizowane",
        },
        error: {
          validation: {
            title: "Nieprawidłowe żądanie aktualizacji zadania",
            description: "Sprawdź parametry aktualizacji",
          },
          unauthorized: {
            title: "Aktualizacja zadania nieautoryzowana",
            description: "Nie masz uprawnień do aktualizacji tego zadania",
          },
          forbidden: {
            title: "Aktualizacja zadania zabroniona",
            description:
              "Nie masz uprawnień do aktualizacji tego zadania importu",
          },
          not_found: {
            title: "Zadanie importu nie znalezione",
            description: "Nie można znaleźć zadania importu",
          },
          server: {
            title: "Błąd serwera aktualizacji zadania",
            description:
              "Nie można zaktualizować zadania z powodu błędu serwera",
          },
          unknown: {
            title: "Aktualizacja zadania nie powiodła się",
            description:
              "Wystąpił nieoczekiwany błąd podczas aktualizacji zadania",
          },
        },
      },
      post: {
        success: {
          title: "Akcja zadania importu zakończona",
          description: "Żądana akcja została wykonana",
          job_stopped: "Zadanie zatrzymane pomyślnie",
          job_queued_retry: "Zadanie dodane do kolejki ponownych prób",
          job_deleted: "Zadanie usunięte pomyślnie",
        },
        error: {
          validation: {
            title: "Walidacja importu potencjalnych klientów nie powiodła się",
            description: "Sprawdź swój plik CSV i spróbuj ponownie",
            failed: "Walidacja wiersza CSV nie powiodła się",
            invalidData: "Nieprawidłowe dane w wierszu CSV",
            missingFields: "Brakuje wymaganych pól",
            invalidEmail: "Nieprawidłowy adres e-mail w wierszu CSV",
            email_required: "E-mail jest wymagany",
            invalid_email_format: "Nieprawidłowy format e-maila",
          },
          unauthorized: {
            title: "Import potencjalnych klientów nieautoryzowany",
            description:
              "Nie masz uprawnień do importowania potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera importu potencjalnych klientów",
            description:
              "Nie można zaimportować potencjalnych klientów z powodu błędu serwera",
          },
          unknown: {
            title: "Import potencjalnych klientów nie powiódł się",
            description:
              "Wystąpił nieoczekiwany błąd podczas importowania potencjalnych klientów",
          },
          forbidden: {
            title: "Import potencjalnych klientów zabroniony",
            description:
              "Nie masz uprawnień do importowania potencjalnych klientów",
          },
          not_found: {
            title: "Zadanie importu nie znalezione",
            description: "Żądane zadanie importu nie mogło zostać znalezione",
          },
          stopped_by_user: "Zatrzymane przez użytkownika",
        },
      },
      retry: {
        success: {
          title: "Zadanie importu ponowione",
          description:
            "Zadanie importu zostało dodane do kolejki ponownych prób",
        },
        error: {
          unauthorized: {
            title: "Ponawianie zadania importu nieautoryzowane",
            description: "Nie masz uprawnień do ponawiania zadań importu",
          },
          forbidden: {
            title: "Ponawianie zadania importu zabronione",
            description:
              "Nie masz uprawnień do ponowienia tego zadania importu",
          },
          not_found: {
            title: "Zadanie importu nie znalezione",
            description: "Nie można znaleźć zadania importu",
          },
          validation: {
            title: "Nie można ponowić zadania importu",
            description:
              "To zadanie importu nie może zostać ponowione w obecnym stanie",
          },
          server: {
            title: "Błąd serwera ponawiania zadania importu",
            description:
              "Zadanie importu nie mogło zostać ponowione z powodu błędu serwera",
          },
        },
      },
      stop: {
        success: {
          title: "Zadanie importu zatrzymane",
          description: "Zadanie importu zostało pomyślnie zatrzymane",
        },
        error: {
          unauthorized: {
            title: "Zatrzymywanie zadania importu nieautoryzowane",
            description: "Nie masz uprawnień do zatrzymywania zadań importu",
          },
          forbidden: {
            title: "Zatrzymywanie zadania importu zabronione",
            description:
              "Nie masz uprawnień do zatrzymania tego zadania importu",
          },
          not_found: {
            title: "Zadanie importu nie znalezione",
            description: "Nie można znaleźć zadania importu",
          },
          validation: {
            title: "Nie można zatrzymać zadania importu",
            description:
              "To zadanie importu nie może zostać zatrzymane w obecnym stanie",
          },
          server: {
            title: "Błąd serwera zatrzymywania zadania importu",
            description:
              "Zadanie importu nie mogło zostać zatrzymane z powodu błędu serwera",
          },
        },
      },
    },
    leadsStats: {
      get: {
        error: {
          validation: {
            title:
              "Walidacja statystyk potencjalnych klientów nie powiodła się",
            description:
              "Nie można zwalidować żądania statystyk potencjalnych klientów",
          },
          unauthorized: {
            title: "Dostęp do statystyk potencjalnych klientów odmówiony",
            description:
              "Nie masz uprawnień do dostępu do statystyk potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera statystyk potencjalnych klientów",
            description:
              "Nie można załadować statystyk potencjalnych klientów z powodu błędu serwera",
          },
          unknown: {
            title: "Dostęp do statystyk potencjalnych klientów nie powiódł się",
            description:
              "Wystąpił nieoczekiwany błąd podczas ładowania statystyk potencjalnych klientów",
          },
          forbidden: {
            title: "Dostęp do statystyk potencjalnych klientów zabroniony",
            description:
              "Nie masz uprawnień do dostępu do statystyk potencjalnych klientów",
          },
        },
        success: {
          title: "Statystyki potencjalnych klientów załadowane",
          description: "Statystyki potencjalnych klientów pobrane pomyślnie",
        },
      },
    },
    leadsTracking: {
      get: {
        error: {
          validation: {
            title: "Walidacja śledzenia leadów nie powiodła się",
            description: "Sprawdź parametry śledzenia i spróbuj ponownie",
          },
          unauthorized: {
            title: "Śledzenie leadów nieautoryzowane",
            description: "Nie masz uprawnień do dostępu do śledzenia leadów",
          },
          server: {
            title: "Błąd serwera śledzenia leadów",
            description:
              "Nie można przetworzyć śledzenia z powodu błędu serwera",
          },
          unknown: {
            title: "Śledzenie leadów nie powiodło się",
            description: "Wystąpił nieoczekiwany błąd podczas śledzenia leadów",
          },
          forbidden: {
            title: "Dostęp do śledzenia leadów zabroniony",
            description: "Nie masz uprawnień do dostępu do śledzenia leadów",
          },
          not_found: {
            title: "Lead nie znaleziony",
            description: "Żądany lead nie mógł zostać znaleziony do śledzenia",
          },
        },
        success: {
          title: "Śledzenie leadów pomyślne",
          description: "Śledzenie leadów zostało pomyślnie zarejestrowane",
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        error: {
          validation: {
            title: "Walidacja wypisania potencjalnego klienta nie powiodła się",
            description: "Sprawdź swoje żądanie wypisania i spróbuj ponownie",
          },
          unauthorized: {
            title: "Wypisanie potencjalnego klienta nieautoryzowane",
            description:
              "Nie masz uprawnień do wypisywania potencjalnych klientów",
          },
          server: {
            title: "Błąd serwera wypisania potencjalnego klienta",
            description:
              "Nie można wypisać potencjalnego klienta z powodu błędu serwera",
          },
          unknown: {
            title: "Wypisanie potencjalnego klienta nie powiodło się",
            description:
              "Wystąpił nieoczekiwany błąd podczas wypisywania potencjalnego klienta",
          },
          forbidden: {
            title: "Wypisanie potencjalnego klienta zabronione",
            description:
              "Nie masz uprawnień do wypisywania potencjalnych klientów",
          },
        },
        success: {
          title: "Potencjalny klient wypisany",
          description: "Potencjalny klient pomyślnie wypisany",
        },
      },
    },
    testEmail: {
      error: {
        validation: {
          title: "Walidacja e-maila testowego nie powiodła się",
          description: "Sprawdź dane e-maila testowego i spróbuj ponownie",
        },
        unauthorized: {
          title: "E-mail testowy nieautoryzowany",
          description: "Nie masz uprawnień do wysyłania e-maili testowych",
        },
        server: {
          title: "Błąd serwera e-maila testowego",
          description:
            "Nie można wysłać e-maila testowego z powodu błędu serwera",
        },
        unknown: {
          title: "E-mail testowy nie powiódł się",
          description:
            "Wystąpił nieoczekiwany błąd podczas wysyłania e-maila testowego",
        },
        templateNotFound: {
          title: "Szablon e-maila nie został znaleziony",
          description: "Żądany szablon e-maila nie mógł zostać znaleziony",
        },
        sendingFailed: {
          title: "Wysyłanie e-maila nie powiodło się",
          description: "Nie udało się wysłać e-maila testowego",
        },
        invalidConfiguration: {
          title: "Nieprawidłowa konfiguracja e-maila",
          description:
            "Konfiguracja e-maila jest nieprawidłowa lub niekompletna",
        },
      },
      fields: {
        journeyVariant: {
          description: "Wybierz wariant podróży e-mailowej do testowania",
        },
        stage: {
          description: "Wybierz etap kampanii e-mailowej do testowania",
        },
        testEmail: {
          description:
            "Wprowadź adres e-mail, na który zostanie wysłany e-mail testowy",
        },
        leadData: {
          email: {
            description: "Adres e-mail, który pojawi się w szablonie e-maila",
          },
          businessName: {
            description: "Nazwa firmy, która pojawi się w szablonie e-maila",
          },
          contactName: {
            description:
              "Imię i nazwisko kontaktu, które pojawi się w szablonie e-maila",
          },
          phone: {
            description: "Numer telefonu, który pojawi się w szablonie e-maila",
          },
          website: {
            description:
              "Adres URL strony, który pojawi się w szablonie e-maila",
          },
          country: {
            description:
              "Kraj, który zostanie użyty do lokalizacji w szablonie e-maila",
          },
          language: {
            description:
              "Język, który zostanie użyty do lokalizacji w szablonie e-maila",
          },
          status: {
            description:
              "Status leada, który zostanie użyty w szablonie e-maila",
          },
          source: {
            description:
              "Źródło leada, które zostanie użyte w szablonie e-maila",
          },
          notes: {
            description: "Notatki, które zostaną użyte w szablonie e-maila",
          },
        },
      },
      success: {
        title: "E-mail testowy wysłany pomyślnie",
        description: "E-mail testowy został wysłany na podany adres",
      },
      validation: {
        journeyVariant: {
          invalid: "Nieprawidłowy wariant podróży e-mailowej",
        },
        stage: {
          invalid: "Nieprawidłowy etap kampanii e-mailowej",
        },
        testEmail: {
          invalid: "Nieprawidłowy adres e-mail testowego",
        },
        leadData: {
          email: {
            invalid: "Nieprawidłowy adres e-mail leada",
          },
          businessName: {
            required: "Nazwa firmy leada jest wymagana",
            tooLong: "Nazwa firmy leada jest za długa",
          },
          contactName: {
            tooLong: "Imię i nazwisko kontaktu leada jest za długie",
          },
          phone: {
            invalid: "Nieprawidłowy numer telefonu leada",
          },
          website: {
            invalid: "Nieprawidłowy adres URL strony leada",
          },
          country: {
            invalid: "Nieprawidłowy kraj leada",
          },
          language: {
            invalid: "Nieprawidłowy język leada",
          },
          status: {
            invalid: "Nieprawidłowy status leada",
          },
          source: {
            invalid: "Nieprawidłowe źródło leada",
          },
          notes: {
            tooLong: "Notatki leada są za długie",
          },
        },
      },
    },
    validation: {
      email: {
        invalid: "Nieprawidłowy adres e-mail",
      },
      businessName: {
        required: "Nazwa firmy jest wymagana",
      },
      website: {
        invalid: "Nieprawidłowy adres URL strony internetowej",
      },
      language: {
        tooShort: "Kod języka musi mieć co najmniej 2 znaki",
        tooLong: "Kod języka może mieć maksymalnie 5 znaków",
      },
      country: {
        invalid: "Nieprawidłowy kod kraju",
      },
    },
  },
};
