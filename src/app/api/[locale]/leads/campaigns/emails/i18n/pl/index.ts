import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
            description: "Entuzjasta dzielący się swoim odkryciem unbottled.ai",
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
            description: "Odzyskaj nieaktywnych lub odchodzących użytkowników",
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
          description: "Nie znaleziono szablonu e-mail dla podanych parametrów",
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
};
