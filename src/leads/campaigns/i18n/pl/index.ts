import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      invalidTransition: "Nieprawidłowe przejście statusu dla startu kampanii",
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
};
