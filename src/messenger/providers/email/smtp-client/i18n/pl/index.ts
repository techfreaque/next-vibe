import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Klient SMTP",
  category: "Usługi Email",
  components: {
    email: {
      tagline: "Platforma AI wolnego słowa",
      footer: {
        needHelp: "Potrzebujesz pomocy?",
        helpText: "Potrzebujesz pomocy? Skontaktuj się z nami pod adresem",
        unsubscribeText: "Nie chcesz otrzymywać tych wiadomości?",
        unsubscribeLink: "Wypisz się",
        copyright: "© {{currentYear}} {{appName}}. Wszelkie prawa zastrzeżone.",
        visitWebsite: "Odwiedź stronę",
        allRightsReserved:
          "© {{currentYear}} {{appName}}. Wszelkie prawa zastrzeżone.",
        feedbackHook:
          "Masz coś do powiedzenia? Odpowiedz - naprawdę to czytamy.",
        feedbackBody:
          "Zglos blad, popros o funkcje albo napisz, czego brakuje. Za przydatna opinie dostajesz {{credits}} kredytow — pelny miesiac za darmo.",
        feedbackLink: "Wyślij opinię →",
        footerSeparator: " · ",
      },
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
  emailSending: {
    email: {
      defaultSenderName: "System",
      errors: {
        sending_failed:
          "Nie udało się wysłać e-maila do {{recipient}}: {{error}}",
        invalid_locale:
          "Nie można wysłać do {{recipient}}: '{{locale}}' to nieprawidłowa lokalizacja",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed: "Nie udało się renderować szablonu e-mail: {{error}}",
        send_failed: "Nie udało się wysłać e-maila: {{error}}",
        email_failed_subject: "E-mail nie powiódł się",
        unknown_recipient: "Nieznany odbiorca",
        unknown_sender: "System",
        email_render_exception: "Wystąpił wyjątek renderowania e-maila",
        batch_send_failed: "Nie udało się wysłać wsadowo e-maili",
        batch_send_failed_item: "Wysyłka wsadowa nie powiodła się: {{error}}",
        batch_send_failed_all:
          "Nie udało się wysłać wsadowo e-maili: {{errors}}",
      },
    },
  },
  sending: {
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie dla operacji wysyłania SMTP",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd na serwerze SMTP",
        detail: "Wysyłka SMTP nie powiodła się: {{error}}",
        detail_account:
          "Błąd SMTP na koncie {{accountName}} ({{accountId}}): {{error}}",
        detail_attempt:
          "Konto SMTP {{accountId}} zawiodło przy próbie {{attempt}}: {{error}}",
        detail_exhausted: "Konto SMTP {{accountId}} wyczerpało wszystkie próby",
      },
      rejected: {
        title: "E-mail do {{recipient}} odrzucony: {{reason}}",
        defaultReason: "Email odrzucony przez serwer",
      },
      no_recipients: {
        title: "Nie zaakceptowano odbiorcy {{recipient}}",
        defaultReason: "Brak zaakceptowanych odbiorców",
      },
      rate_limit: {
        title:
          "Limit godzinowy konta {{accountName}} wyczerpany: wysłano {{current}}/{{limit}}, pozostało {{remainingCapacity}}",
      },
      capacity: {
        title: "Sprawdzenie pojemności nie powiodło się: {{error}}",
      },
      no_account: {
        title: "Brak dostępnego konta SMTP",
        detail_criteria:
          "Brak konta SMTP dla {{campaignType}} / {{journeyVariant}} / {{campaignStage}} / {{country}} / {{language}}",
        detail_campaign: "Brak konta SMTP dla typu kampanii {{campaignType}}",
        detail_account: "Nie znaleziono konta SMTP {{accountId}}",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "Błąd serwera metadanych email",
        description: "Nie udało się zapisać metadanych emaila",
        detail_store:
          "Nie udało się zapisać metadanych dla {{recipient}}: {{error}}",
        detail_engagement:
          "Nie udało się zaktualizować interakcji dla wiadomości {{emailId}}: {{error}}",
      },
    },
  },
  enums: {
    status: {
      active: "Aktywny",
      inactive: "Nieaktywny",
      error: "Błąd",
      testing: "Testowanie",
    },
    securityType: {
      none: "Brak",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    statusFilter: {
      all: "Wszystkie statusy",
    },
    healthStatus: {
      healthy: "Zdrowy",
      degraded: "Ograniczony",
      unhealthy: "Niezdrowy",
      unknown: "Nieznany",
    },
    healthStatusFilter: {
      all: "Wszystkie statusy zdrowia",
    },
    sortField: {
      name: "Nazwa",
      status: "Status",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      priority: "Priorytet",
      totalEmailsSent: "Łącznie wysłanych emaili",
      lastUsedAt: "Ostatnio używane",
    },
    campaignType: {
      leadCampaign: "Kampania leadów",
      newsletter: "Newsletter",
      signupNurture: "Pielęgnacja rejestracji",
      retention: "Retencja",
      winback: "Odzyskiwanie",
      transactional: "Transakcyjny",
      notification: "Powiadomienie",
      system: "System",
    },
    campaignTypeFilter: {
      all: "Wszystkie typy kampanii",
    },
    selectionRuleSortField: {
      name: "Nazwa",
      priority: "Priorytet",
      campaignType: "Typ kampanii",
      journeyVariant: "Wariant podróży",
      campaignStage: "Etap kampanii",
      country: "Kraj",
      language: "Język",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      emailsSent: "Wysłane emaile",
      successRate: "Wskaźnik sukcesu",
      lastUsedAt: "Ostatnio używane",
    },
    selectionRuleStatusFilter: {
      all: "Wszystkie",
      active: "Aktywny",
      inactive: "Nieaktywny",
      default: "Domyślny",
      failover: "Awaryjny",
    },
    loadBalancingStrategy: {
      roundRobin: "Round-Robin",
      weighted: "Ważony",
      priority: "Priorytet",
      leastUsed: "Najmniej używany",
    },
    testResult: {
      success: "Sukces",
      authFailed: "Uwierzytelnienie nie powiodło się",
      connectionFailed: "Połączenie nie powiodło się",
      timeout: "Przekroczono limit czasu",
      unknownError: "Nieznany błąd",
    },
  },
};
