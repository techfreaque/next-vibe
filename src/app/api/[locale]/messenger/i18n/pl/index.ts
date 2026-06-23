import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-mail",
  countries: {
    global: "Globalny",
    de: "Niemcy",
    pl: "Polska",
    us: "USA",
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
  },
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "Brak",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Aktywny",
      inactive: "Nieaktywny",
      error: "Błąd",
      testing: "Test",
    },
    smtpHealthStatus: {
      healthy: "Zdrowy",
      degraded: "Obniżony",
      unhealthy: "Niezdrowy",
      unknown: "Nieznany",
    },
    smtpSortField: {
      name: "Nazwa",
      status: "Status",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      priority: "Priorytet",
      totalEmailsSent: "Wysłanych e-maili",
      lastUsedAt: "Ostatnio używany",
    },
    smtpCampaignType: {
      leadCampaign: "Kampania lead",
      newsletter: "Newsletter",
      signupNurture: "Pielęgnacja po rejestracji",
      retention: "Utrzymanie",
      winback: "Odzyskanie",
      transactional: "Transakcyjny",
      notification: "Powiadomienie",
      system: "System",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Round-Robin",
      weighted: "Ważony",
      priority: "Priorytet",
      leastUsed: "Najmniej używany",
    },
    loadBalancingStrategy: {
      roundRobin: "Round-Robin",
      weighted: "Ważony",
      priority: "Priorytet",
      leastUsed: "Najmniej używany",
    },
    smtpTestResult: {
      success: "Sukces",
      authFailed: "Uwierzytelnianie nieudane",
      connectionFailed: "Połączenie nieudane",
      timeout: "Przekroczenie czasu",
      unknownError: "Nieznany błąd",
    },
    testResult: {
      success: "Sukces",
      authFailed: "Uwierzytelnianie nieudane",
      connectionFailed: "Połączenie nieudane",
      timeout: "Przekroczenie czasu",
      unknownError: "Nieznany błąd",
    },
    smtpStatusFilter: {
      any: "Wszystkie",
    },
    smtpHealthStatusFilter: {
      any: "Wszystkie",
    },
    smtpCampaignTypeFilter: {
      any: "Wszystkie",
    },
    smtpSelectionRuleSortField: {
      name: "Nazwa",
      priority: "Priorytet",
      campaignType: "Typ kampanii",
      journeyVariant: "Wariant podróży",
      campaignStage: "Etap kampanii",
      country: "Kraj",
      language: "Język",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      emailsSent: "Wysłane e-maile",
      successRate: "Wskaźnik sukcesu",
      lastUsedAt: "Ostatnio używany",
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
      emailsSent: "Wysłane e-maile",
      successRate: "Wskaźnik sukcesu",
      lastUsedAt: "Ostatnio używany",
    },
    smtpSelectionRuleStatusFilter: {
      any: "Wszystkie",
      active: "Aktywny",
      inactive: "Nieaktywny",
      default: "Domyślny",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      any: "Wszystkie",
      active: "Aktywny",
      inactive: "Nieaktywny",
      default: "Domyślny",
      failover: "Failover",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "Oczekujący",
      sent: "Wysłany",
      delivered: "Dostarczony",
      opened: "Otwarty",
      clicked: "Kliknięty",
      bounced: "Odrzucony",
      failed: "Nieudany",
      unsubscribed: "Wypisany",
    },
    emailType: {
      transactional: "Transakcyjny",
      marketing: "Marketingowy",
      notification: "Powiadomienie",
      system: "System",
      leadCampaign: "Kampania lead",
      userCommunication: "Komunikacja użytkownika",
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
    emailSortField: {
      subject: "Temat",
      recipientEmail: "E-mail odbiorcy",
      recipientName: "Nazwa odbiorcy",
      type: "Typ",
      status: "Status",
      sentAt: "Wysłano",
      createdAt: "Utworzono",
    },
    emailStatusFilter: {
      any: "Wszystkie",
    },
    emailTypeFilter: {
      any: "Wszystkie",
    },
    emailRetryRange: {
      noRetries: "Bez powtórzeń",
      oneToTwo: "1-2 powtórzenia",
      threeToFive: "3-5 powtórzeń",
      sixPlus: "6+ powtórzeń",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "Oczekujący",
      syncing: "Synchronizowanie",
      synced: "Zsynchronizowany",
      error: "Błąd",
    },
    imapOverallSyncStatus: {
      idle: "Bezczynny",
      running: "Uruchomiony",
      completed: "Ukończony",
      failed: "Nieudany",
      cancelled: "Anulowany",
    },
    imapSortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Skrzynka odbiorcza",
      sent: "Wysłane",
      drafts: "Szkice",
      trash: "Kosz",
      junk: "Spam",
      archive: "Archiwum",
    },
    imapFolderSortField: {
      name: "Nazwa",
      displayName: "Nazwa wyświetlana",
      messageCount: "Liczba wiadomości",
      unseenCount: "Nieprzeczytane",
      createdAt: "Utworzono",
    },
    imapAccountSortField: {
      name: "Nazwa",
      email: "E-mail",
      host: "Host",
      enabled: "Włączony",
      lastSyncAt: "Ostatnia synchronizacja",
      createdAt: "Utworzono",
    },
    imapConnectionStatus: {
      disconnected: "Rozłączony",
      connecting: "Łączenie",
      connected: "Połączony",
      error: "Błąd",
      timeout: "Przekroczenie czasu",
    },
    imapSyncStatusFilter: {
      all: "Wszystkie",
    },
    imapAccountStatusFilter: {
      all: "Wszystkie",
      enabled: "Włączony",
      disabled: "Wyłączony",
    },
    imapAccountFilter: {
      all: "Wszystkie",
    },
    imapMessageSortField: {
      subject: "Temat",
      senderName: "Nazwa nadawcy",
      senderEmail: "E-mail nadawcy",
      recipientEmail: "E-mail odbiorcy",
      recipientName: "Nazwa odbiorcy",
      isRead: "Przeczytany",
      isFlagged: "Oznaczony",
      messageSize: "Rozmiar wiadomości",
      sentAt: "Wysłano",
      createdAt: "Utworzono",
    },
    imapMessageStatusFilter: {
      all: "Wszystkie",
      read: "Przeczytane",
      unread: "Nieprzeczytane",
      flagged: "Oznaczone",
      unflagged: "Nieoznaczone",
      draft: "Szkic",
      deleted: "Usunięte",
      hasAttachments: "Z załącznikami",
      noAttachments: "Bez załączników",
    },
    imapHealthStatus: {
      healthy: "Zdrowy",
      warning: "Ostrzeżenie",
      error: "Błąd",
      maintenance: "Konserwacja",
    },
    imapPerformanceStatus: {
      good: "Dobry",
      warning: "Ostrzeżenie",
      error: "Błąd",
    },
    bulkMessageAction: {
      markRead: "Oznacz jako przeczytane",
      markUnread: "Oznacz jako nieprzeczytane",
      flag: "Oflaguj",
      unflag: "Usuń flagę",
      delete: "Usuń",
    },
    imapLoggingLevel: {
      error: "Błąd",
      warn: "Ostrzeżenie",
      info: "Info",
      debug: "Debug",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
      urgent: "Pilny",
    },
    emailServiceStatus: {
      idle: "Bezczynny",
      processing: "Przetwarzanie",
      completed: "Zakończony",
      failed: "Nieudany",
      retrying: "Ponowienie",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "Oczekujący",
      sent: "Wysłany",
      delivered: "Dostarczony",
      failed: "Nieudany",
      rejected: "Odrzucony",
      undelivered: "Niedostarczony",
    },
    smsTemplateType: {
      notification: "Powiadomienie",
      verification: "Weryfikacja",
      marketing: "Marketing",
      alert: "Alert",
      reminder: "Przypomnienie",
    },
  },
  errors: {
    no_email: "Nie podano adresu e-mail",
    email_generation_failed: "Generowanie e-maila nie powiodło się",
  },
  email: {
    errors: {
      send: {
        title: "Wysyłanie e-maila nie powiodło się",
      },
    },
  },
  smsService: {
    title: "Usługa SMS",
    description: "Wysyłaj wiadomości SMS przez różnych dostawców",
    category: "Usługa SMS",
    tag: "Usługa SMS",
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wysyłania wiadomości SMS",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Dostęp do usługi SMS jest zabroniony",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe dane żądania SMS",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      conflict: {
        title: "Konflikt",
        description: "Żądanie SMS jest w konflikcie z istniejącymi danymi",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób SMS nie został znaleziony",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas wysyłania SMS",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      invalid_phone: {
        title: "Nieprawidłowy numer telefonu",
      },
      send: {
        title: "Wysyłanie SMS nie powiodło się",
      },
    },
    send: {
      title: "Wyślij SMS",
      description: "Wyślij wiadomość SMS do odbiorcy",
      container: {
        title: "Konfiguracja SMS",
        description: "Skonfiguruj parametry wysyłania SMS",
      },
      to: {
        label: "Numer telefonu",
        description: "Numer telefonu odbiorcy",
        placeholder: "+1234567890",
      },
      message: {
        label: "Wiadomość",
        description: "Treść wiadomości SMS",
        placeholder: "Wprowadź swoją wiadomość tutaj...",
      },
      campaignType: {
        label: "Typ kampanii",
        description: "Wybierz typ kampanii dla tego SMS",
        placeholder: "Wybierz typ kampanii",
      },
      leadId: {
        label: "ID leada",
        description: "Powiązany identyfikator leada",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Nazwa szablonu",
        description: "Szablon SMS do użycia",
        placeholder: "Wybierz szablon",
      },
      response: {
        result: {
          title: "Wynik SMS",
          description: "Wynik operacji wysyłania SMS",
          success: "Sukces",
          messageId: "ID wiadomości",
          sentAt: "Wysłano o",
          provider: "Dostawca",
          cost: "Koszt",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe dane żądania SMS",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Nie masz uprawnień do wysyłania wiadomości SMS",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Dostęp do usługi SMS jest zabroniony",
        },
        conflict: {
          title: "Konflikt",
          description: "Żądanie SMS jest w konflikcie z istniejącymi danymi",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób SMS nie został znaleziony",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas wysyłania SMS",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "SMS wysłany pomyślnie",
        description: "Twój SMS został wysłany pomyślnie",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Nieprawidłowy numer telefonu",
      },
      send: {
        title: "Wysyłanie SMS nie powiodło się",
      },
    },
  },
  emailService: {
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
          copyright:
            "© {{currentYear}} {{appName}}. Wszelkie prawa zastrzeżone.",
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
          sending_failed: "Nie udało się wysłać e-maila do {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Nie udało się renderować szablonu e-mail",
          send_failed: "Nie udało się wysłać e-maila",
          email_failed_subject: "E-mail nie powiódł się",
          unknown_recipient: "Nieznany odbiorca",
          unknown_sender: "System",
          email_render_exception: "Wystąpił wyjątek renderowania e-maila",
          batch_send_failed: "Nie udało się wysłać wsadowo e-maili",
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
        },
        rejected: {
          title: "Email odrzucony",
          defaultReason: "Email odrzucony przez serwer",
        },
        no_recipients: {
          title: "Brak zaakceptowanych odbiorców",
          defaultReason: "Brak zaakceptowanych odbiorców",
        },
        rate_limit: {
          title: "Przekroczono limit szybkości",
        },
        capacity: {
          title: "Błąd pojemności",
        },
        no_account: {
          title: "Brak dostępnego konta SMTP",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Błąd serwera metadanych email",
          description: "Nie udało się zapisać metadanych emaila",
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
  },
  imapClient: {
    category: "Klient IMAP",
    tag: "Klient IMAP",
    tags: {
      health: "Zdrowie",
      monitoring: "Monitorowanie",
      sync: "Synchronizacja",
      accounts: "Konta",
      folders: "Foldery",
      messages: "Wiadomości",
      config: "Konfiguracja",
    },
    messages: {
      tag: "Wiadomości",
      id: {
        widget: {
          markRead: "Oznacz jako przeczytane",
          markUnread: "Oznacz jako nieprzeczytane",
          flag: "Oznacz",
          unflag: "Usuń oznaczenie",
        },
      },
      errors: {
        server: { title: "Błąd serwera" },
        notFound: { title: "Wiadomość nie znaleziona" },
        accountNotFound: { title: "Konto nie znalezione" },
        syncFailed: { title: "Synchronizacja nie powiodła się" },
        syncSuccess: { message: "Wiadomości zsynchronizowane pomyślnie" },
        list: {
          get: {
            errors: {
              server: { title: "Błąd serwera podczas wyświetlania wiadomości" },
            },
          },
        },
      },
    },
    sync: {
      category: "Klient IMAP",

      title: "Synchronizacja IMAP",
      description: "Usługa synchronizacji IMAP",
      container: {
        title: "Konfiguracja synchronizacji IMAP",
        description: "Skonfiguruj parametry synchronizacji IMAP",
      },
      accountIds: {
        label: "ID kont",
        description: "ID kont IMAP do synchronizacji",
        placeholder: "Wprowadź ID kont oddzielone przecinkami",
      },
      force: {
        label: "Wymuś synchronizację",
        description:
          "Wymuś synchronizację nawet jeśli niedawno była przeprowadzona",
      },
      dryRun: {
        label: "Test uruchomienia",
        description: "Wykonaj test bez wprowadzania zmian",
      },
      maxMessages: {
        label: "Maks. wiadomości",
        description: "Maksymalna liczba wiadomości do synchronizacji na folder",
        placeholder: "Wprowadź maksymalną liczbę wiadomości",
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
          result: {
            title: "Wyniki synchronizacji",
            description: "Szczegółowe wyniki synchronizacji",
            accountsProcessed: "Przetworzone konta",
            foldersProcessed: "Przetworzone foldery",
            messagesProcessed: "Przetworzone wiadomości",
            messagesAdded: "Dodane wiadomości",
            messagesUpdated: "Zaktualizowane wiadomości",
            messagesDeleted: "Usunięte wiadomości",
            duration: "Czas trwania",
          },
          errors: {
            error: {
              title: "Błąd synchronizacji",
              description: "Szczegóły błędu",
              code: "Kod błędu",
              message: "Komunikat błędu",
            },
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
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
      widget: {
        title: "Pełna synchronizacja IMAP",
        options: "Opcje synchronizacji",
        noAccounts: "Brak skonfigurowanych kont IMAP",
        result: "Wynik synchronizacji",
        duration: "Czas trwania",
        errors: "Błędy",
        accountsProcessed: "Przetworzone konta",
        foldersProcessed: "Przetworzone foldery",
        messagesProcessed: "Przetworzone wiadomości",
        messagesAdded: "Dodane wiadomości",
        messagesUpdated: "Zaktualizowane wiadomości",
        messagesDeleted: "Usunięte wiadomości",
        submit: "Rozpocznij sync",
        submitting: "Synchronizowanie...",
      },
    },
    imapErrors: {
      accounts: {
        post: {
          error: {
            duplicate: {
              title: "Konto już istnieje",
            },
            server: {
              title: "Błąd serwera podczas tworzenia konta",
            },
          },
        },
        get: {
          error: {
            not_found: {
              title: "Konto nie znalezione",
            },
            server: {
              title: "Błąd serwera podczas pobierania konta",
            },
          },
        },
        put: {
          error: {
            not_found: {
              title: "Konto nie znalezione",
            },
            duplicate: {
              title: "Konto z tym adresem e-mail już istnieje",
            },
            server: {
              title: "Błąd serwera podczas aktualizacji konta",
            },
          },
        },
        delete: {
          error: {
            not_found: {
              title: "Konto nie znalezione",
            },
            server: {
              title: "Błąd serwera podczas usuwania konta",
            },
          },
          success: {
            title: "Konto zostało pomyślnie usunięte",
          },
        },
      },
      folders: {
        get: {
          error: {
            not_found: {
              title: "Folder nie znaleziony",
            },
            server: {
              title: "Błąd serwera podczas pobierania folderu",
            },
          },
        },
        sync: {
          error: {
            missing_account: {
              title: "Konto nie znalezione dla synchronizacji folderu",
            },
          },
        },
      },
      messages: {
        get: {
          error: {
            not_found: {
              title: "Wiadomość nie znaleziona",
            },
            server: {
              title: "Błąd serwera podczas pobierania wiadomości",
            },
          },
        },
      },
      connection: {
        failed: "Połączenie nie powiodło się",
        timeout: {
          title: "Przekroczono limit czasu połączenia",
        },
        test: {
          failed: "Test połączenia nie powiódł się",
        },
        close: {
          failed: "Nie udało się zamknąć połączenia",
        },
        folders: {
          list: {
            failed: "Nie udało się wyświetlić folderów",
          },
        },
        messages: {
          list: {
            failed: "Nie udało się wyświetlić wiadomości",
          },
        },
      },
      sync: {
        failed: "Synchronizacja nie powiodła się",
        account: {
          failed: "Synchronizacja konta nie powiodła się",
        },
        folder: {
          failed: "Synchronizacja folderu nie powiodła się",
        },
        message: {
          failed: "Synchronizacja wiadomości nie powiodła się",
        },
        post: {
          error: {
            server: {
              title: "Błąd serwera podczas synchronizacji",
            },
          },
        },
      },
      validation: {
        account: {
          username: {
            required: "Nazwa użytkownika jest wymagana",
          },
          port: {
            invalid: "Nieprawidłowy numer portu",
          },
          host: {
            invalid: "Nieprawidłowy host",
          },
        },
      },
    },
    imap: {
      "example.com": "imap.example.com",
      "gmail.com": "imap.gmail.com",
      connection: {
        test: {
          success: "Test połączenia zakończony sukcesem",
          failed: "Test połączenia nie powiódł się",
          timeout: "Przekroczono limit czasu testu połączenia",
        },
      },
      sync: {
        messages: {
          accounts: {
            success: "Wszystkie konta zsynchronizowane pomyślnie",
            successWithErrors: "Konta zsynchronizowane z błędami",
          },
          account: {
            success: "Konto zsynchronizowane pomyślnie",
            successWithErrors: "Konto zsynchronizowane z błędami",
          },
          folders: {
            success: "Foldery zsynchronizowane pomyślnie",
            successWithErrors: "Foldery zsynchronizowane z błędami",
          },
          messages: {
            success: "Wiadomości zsynchronizowane pomyślnie",
            successWithErrors: "Wiadomości zsynchronizowane z błędami",
          },
        },
        errors: {
          default: "Synchronizacja IMAP nie powiodła się",
          account_failed: "Synchronizacja konta nie powiodła się",
          folder_sync_failed: "Synchronizacja folderu nie powiodła się",
          message_sync_error: "Błąd synchronizacji wiadomości",
          message_sync_failed: "Synchronizacja wiadomości nie powiodła się",
        },
      },
    },
    enums: {
      loggingLevel: {
        error: "Błąd",
        warn: "Ostrzeżenie",
        info: "Info",
        debug: "Debug",
      },
      syncStatus: {
        pending: "Oczekujący",
        syncing: "Synchronizacja",
        synced: "Zsynchronizowane",
        error: "Błąd",
      },
      overallSyncStatus: {
        idle: "Bezczynny",
        running: "Uruchomiony",
        completed: "Zakończone",
        failed: "Nieudane",
        cancelled: "Anulowane",
      },
      sortOrder: {
        asc: "Rosnąco",
        desc: "Malejąco",
      },
      authMethod: {
        plain: "Zwykły",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      imapAuthMethod: {
        plain: "Zwykły",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      specialUseType: {
        inbox: "Skrzynka odbiorcza",
        sent: "Wysłane",
        drafts: "Szkice",
        trash: "Kosz",
        junk: "Spam",
        archive: "Archiwum",
      },
      folderSortField: {
        name: "Nazwa",
        displayName: "Nazwa wyświetlana",
        messageCount: "Liczba wiadomości",
        unseenCount: "Liczba nieprzeczytanych",
        createdAt: "Utworzono",
      },
      accountSortField: {
        name: "Nazwa",
        email: "Email",
        host: "Host",
        enabled: "Włączone",
        lastSyncAt: "Ostatnia synchronizacja",
        createdAt: "Utworzono",
      },
      connectionStatus: {
        disconnected: "Rozłączony",
        connecting: "Łączenie",
        connected: "Połączony",
        error: "Błąd",
        timeout: "Przekroczono limit czasu",
      },
      syncStatusFilter: {
        all: "Wszystkie statusy synchronizacji",
      },
      accountStatusFilter: {
        all: "Wszystkie statusy kont",
        enabled: "Włączone",
        disabled: "Wyłączone",
      },
      accountFilter: {
        all: "Wszystkie konta",
      },
      messageSortField: {
        subject: "Temat",
        senderName: "Nazwa nadawcy",
        senderEmail: "Email nadawcy",
        recipientEmail: "Email odbiorcy",
        recipientName: "Nazwa odbiorcy",
        isRead: "Status przeczytania",
        isFlagged: "Oznaczone",
        messageSize: "Rozmiar wiadomości",
        sentAt: "Wysłano",
        createdAt: "Utworzono",
      },
      messageStatusFilter: {
        all: "Wszystkie wiadomości",
        read: "Przeczytane",
        unread: "Nieprzeczytane",
        flagged: "Oznaczone",
        unflagged: "Nieoznaczone",
        draft: "Szkic",
        deleted: "Usunięte",
        hasAttachments: "Z załącznikami",
        noAttachments: "Bez załączników",
      },
      healthStatus: {
        healthy: "Zdrowy",
        warning: "Ostrzeżenie",
        error: "Błąd",
        maintenance: "Konserwacja",
      },
      performanceStatus: {
        good: "Dobry",
        warning: "Ostrzeżenie",
        error: "Błąd",
      },
    },
  },
  messages: {
    category: "Wiadomości Email",
    tag: "Wiadomości",
    tags: {
      stats: "Statystyki",
      analytics: "Analityka",
    },
    id: {
      category: "Emails",
      tags: {
        emails: "Emails",
      },
      title: "Szczegóły e-maila",
      description:
        "Pobierz pojedynczy email na podstawie jego unikalnego identyfikatora",
      container: {
        title: "Szczegóły emaila",
        description: "Zobacz szczegółowe informacje o konkretnym emailu",
      },
      fields: {
        id: {
          label: "ID emaila",
          description: "Unikalny identyfikator emaila do pobrania",
        },
      },
      response: {
        email: {
          title: "Szczegóły emaila",
          description: "Kompletne informacje o żądanym emailu",
          id: "ID emaila",
          subject: "Temat",
          recipientEmail: "Email odbiorcy",
          recipientName: "Nazwa odbiorcy",
          senderEmail: "Email nadawcy",
          senderName: "Nazwa nadawcy",
          type: "Typ emaila",
          status: "Status",
          templateName: "Nazwa szablonu",
          emailProvider: "Dostawca emaila",
          externalId: "Zewnętrzne ID",
          sentAt: "Wysłano o",
          deliveredAt: "Dostarczono o",
          openedAt: "Otwarto o",
          clickedAt: "Kliknięto o",
          retryCount: "Liczba ponowień",
          error: "Komunikat błędu",
          userId: "ID użytkownika",
          leadId: "ID leada",
          createdAt: "Utworzono o",
          updatedAt: "Zaktualizowano o",
        },
      },
      get: {
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Podane ID emaila jest nieprawidłowe",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description:
              "Musisz być uwierzytelniony, aby zobaczyć szczegóły emaila",
          },
          not_found: {
            title: "Email nie znaleziony",
            description: "Nie znaleziono emaila o podanym ID",
          },
          forbidden: {
            title: "Zabronione",
            description: "Nie masz uprawnień do wyświetlenia tego emaila",
          },
          server: {
            title: "Błąd serwera",
            description:
              "Wystąpił wewnętrzny błąd serwera podczas pobierania emaila",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Podane ID emaila jest nieprawidłowe",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description:
            "Musisz być uwierzytelniony, aby zobaczyć szczegóły emaila",
        },
        notFound: {
          title: "Email nie znaleziony",
          description: "Nie znaleziono emaila o podanym ID",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wyświetlenia tego emaila",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas pobierania emaila",
        },
        conflict: {
          title: "Błąd konfliktu",
          description: "Wystąpił konflikt podczas przetwarzania żądania emaila",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci podczas pobierania emaila",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
      },
      success: {
        title: "Email pobrany",
        description: "Szczegóły emaila zostały pomyślnie pobrane",
      },
      widget: {
        parties: "Strony",
        to: "Do",
        from: "Od",
        timestamps: "Znaczniki czasu",
        sentAt: "Wysłano",
        deliveredAt: "Dostarczono",
        openedAt: "Otwarto",
        clickedAt: "Kliknięto",
        technical: "Szczegóły techniczne",
        template: "Szablon",
        provider: "Dostawca",
        externalId: "Zewnętrzny ID",
        retryCount: "Liczba ponowień",
        error: "Błąd",
        associations: "Powiązania",
        lead: "Lead",
        user: "Użytkownik",
        notFound: "E-mail nie znaleziony",
      },
      enums: {
        status: {
          pending: "Oczekujące",
          sent: "Wysłane",
          delivered: "Dostarczone",
          opened: "Otwarte",
          clicked: "Kliknięte",
          bounced: "Odrzucone",
          failed: "Nieudane",
          unsubscribed: "Wypisane",
        },
        type: {
          transactional: "Transakcyjny",
          marketing: "Marketingowy",
          notification: "Powiadomienie",
          system: "Systemowy",
          leadCampaign: "Kampania leadów",
          userCommunication: "Komunikacja z użytkownikiem",
        },
        provider: {
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
    },
    list: {
      category: "Emails",
      tags: {
        emails: "Emails",
      },
      title: "Lista e-maili",
      description:
        "Pobierz paginowaną listę e-maili z filtrowaniem i paginacją",
      container: {
        title: "Lista e-maili",
        description: "Skonfiguruj parametry listy e-maili i wyświetl wyniki",
      },
      filters: {
        title: "Filtry",
        description: "Filtruj i wyszukuj e-maile",
      },
      displayOptions: {
        title: "Opcje wyświetlania",
      },
      fields: {
        dateRange: {
          title: "Zakres dat",
        },
        page: {
          label: "Strona",
          description: "Numer strony dla paginacji",
          placeholder: "Wprowadź numer strony",
        },
        limit: {
          label: "Limit",
          description: "Liczba elementów na stronę",
          placeholder: "Wprowadź limit",
        },
        search: {
          label: "Szukaj",
          description: "Szukaj e-maili po temacie, odbiorcy lub nadawcy",
          placeholder: "Szukaj e-maili...",
        },
        status: {
          label: "Status",
          description: "Filtruj po statusie e-maila",
          placeholder: "Wybierz status",
        },
        channel: {
          label: "Kanał",
          description: "Filtruj po kanale wiadomości",
        },
        type: {
          label: "Typ",
          description: "Filtruj po typie e-maila",
          placeholder: "Wybierz typ",
        },
        sortBy: {
          label: "Sortuj według",
          description: "Pole do sortowania",
          placeholder: "Wybierz pole sortowania",
        },
        sortOrder: {
          label: "Kolejność sortowania",
          description: "Kierunek sortowania",
          placeholder: "Wybierz kolejność sortowania",
        },
        dateFrom: {
          label: "Data od",
          description: "Filtruj e-maile od tej daty",
          placeholder: "Wybierz datę początkową",
        },
        dateTo: {
          label: "Data do",
          description: "Filtruj e-maile do tej daty",
          placeholder: "Wybierz datę końcową",
        },
      },
      response: {
        emails: {
          title: "E-maile",
          emptyState: {
            title: "Nie znaleziono e-maili",
            description: "Brak e-maili pasujących do bieżących filtrów",
          },
          item: {
            title: "E-mail",
            description: "Szczegóły e-maila",
            id: "ID",
            subject: "Temat",
            recipientEmail: "E-mail odbiorcy",
            recipientName: "Nazwa odbiorcy",
            senderEmail: "E-mail nadawcy",
            senderName: "Nazwa nadawcy",
            type: "Typ",
            status: "Status",
            templateName: "Nazwa szablonu",
            emailProvider: "Dostawca e-maila",
            externalId: "ID zewnętrzne",
            sentAt: "Wysłano o",
            deliveredAt: "Dostarczono o",
            openedAt: "Otwarto o",
            clickedAt: "Kliknięto o",
            retryCount: "Liczba ponownych prób",
            error: "Błąd",
            userId: "ID użytkownika",
            leadId: "ID potencjalnego klienta",
            createdAt: "Utworzono o",
            updatedAt: "Zaktualizowano o",
            emailCore: {
              title: "Podstawowe informacje",
            },
            emailParties: {
              title: "Nadawca i odbiorca",
            },
            emailMetadata: {
              title: "Metadane",
            },
            emailEngagement: {
              title: "Śledzenie zaangażowania",
            },
            technicalDetails: {
              title: "Szczegóły techniczne",
            },
            associatedIds: {
              title: "Powiązane ID",
            },
            timestamps: {
              title: "Znaczniki czasu",
            },
          },
        },
        pagination: {
          title: "Paginacja",
          description: "Informacje o paginacji",
          page: "Bieżąca strona",
          limit: "Elementów na stronę",
          total: "Całkowita liczba elementów",
          totalPages: "Całkowita liczba stron",
        },
        filters: {
          title: "Zastosowane filtry",
          description: "Aktualnie zastosowane filtry",
          status: "Filtr statusu",
          type: "Filtr typu",
          search: "Zapytanie wyszukiwania",
          dateFrom: "Data początkowa",
          dateTo: "Data końcowa",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Podane parametry są nieprawidłowe",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description:
            "Musisz być uwierzytelniony, aby uzyskać dostęp do tego zasobu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do dostępu do tego zasobu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Żądany zasób nie został znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Żądanie jest w konflikcie z bieżącym stanem",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
      },
      success: {
        title: "Sukces",
        description: "E-maile pobrane pomyślnie",
      },
      enums: {
        type: {
          transactional: "Transakcyjny",
          marketing: "Marketingowy",
          notification: "Powiadomienie",
          system: "Systemowy",
          leadCampaign: "Kampania leadów",
          userCommunication: "Komunikacja z użytkownikiem",
        },
        typeFilter: {
          any: "Wszystkie typy",
        },
        channel: {
          email: "E-mail",
          sms: "SMS",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
        },
        channelFilter: {
          any: "Wszystkie kanały",
        },
        sortField: {
          subject: "Temat",
          recipientEmail: "E-mail odbiorcy",
          recipientName: "Nazwa odbiorcy",
          type: "Typ",
          status: "Status",
          sentAt: "Wysłano o",
          createdAt: "Utworzono o",
        },
        sortOrder: {
          asc: "Rosnąco",
          desc: "Malejąco",
        },
      },
      widget: {
        to: "Do",
        retries: "Ponowienia",
        opened: "Otwarte",
        clicked: "Kliknięte",
        stats: "Statystyki",
        graphs: "Wykresy",
        refresh: "Odśwież",
        searchPlaceholder: "Szukaj e-maili...",
        clearSearch: "Wyczyść",
        emptyState: "Brak e-maili",
        emptyFiltered: "Żadne e-maile nie pasują do filtrów",
        page: "Strona",
        tabs: {
          all: "Wszystkie",
          sent: "Wysłane",
          delivered: "Dostarczone",
          opened: "Otwarte",
          failed: "Nieudane",
          bounced: "Odrzucone",
        },
      },
    },
    stats: {
      category: "Emails",
      tags: {
        stats: "Statistics",
        analytics: "Analytics",
      },
      dateRange: {
        today: "Dzisiaj",
        yesterday: "Wczoraj",
        last7Days: "Ostatnie 7 Dni",
        last30Days: "Ostatnie 30 Dni",
        last90Days: "Ostatnie 90 Dni",
        thisWeek: "Ten Tydzień",
        lastWeek: "Ostatni Tydzień",
        thisMonth: "Ten Miesiąc",
        lastMonth: "Ostatni Miesiąc",
        thisQuarter: "Ten Kwartał",
        lastQuarter: "Ostatni Kwartał",
        thisYear: "Ten Rok",
        lastYear: "Ostatni Rok",
        custom: "Niestandardowy Zakres",
      },
      get: {
        title: "Statystyki E-maili",
        description: "Pobierz kompleksowe statystyki i metryki e-maili",
        form: {
          title: "Żądanie Statystyk E-maili",
          description: "Parametry dla zapytania o statystyki e-maili",
        },
        startDate: {
          label: "Data Początkowa",
          description: "Data początkowa dla okresu statystyk",
        },
        endDate: {
          label: "Data Końcowa",
          description: "Data końcowa dla okresu statystyk",
        },
        accountId: {
          label: "ID Konta",
          description: "Filtruj statystyki według konkretnego konta",
        },
        type: {
          label: "Typ E-maila",
          description: "Filtruj według typu e-maila",
          options: {
            all: "Wszystkie",
            sent: "Wysłane",
            received: "Odebrane",
            draft: "Szkic",
            trash: "Kosz",
          },
        },
        groupBy: {
          label: "Grupuj Według",
          description: "Jak grupować statystyki",
          options: {
            day: "Według Dnia",
            week: "Według Tygodnia",
            month: "Według Miesiąca",
            account: "Według Konta",
            type: "Według Typu",
          },
        },
        includeDetails: {
          label: "Uwzględnij Szczegóły",
          description: "Uwzględnij szczegółowy podział w wynikach",
        },
        status: {
          label: "Status E-maila",
          description: "Filtruj według statusu e-maila",
        },
        search: {
          label: "Szukaj",
          description: "Szukaj e-maili według tematu lub odbiorcy",
        },
        timePeriod: {
          label: "Okres Czasu",
          description: "Granularność okresu czasu dla danych historycznych",
          hour: "Godzina",
          day: "Dzień",
          week: "Tydzień",
          month: "Miesiąc",
          quarter: "Kwartał",
          year: "Rok",
        },
        dateRangePreset: {
          label: "Ustawienie Zakresu Dat",
          description: "Predefiniowany zakres dat dla filtrowania",
        },
        dateFrom: {
          label: "Data Początkowa",
          description: "Filtruj e-maile od tej daty",
        },
        dateTo: {
          label: "Data Końcowa",
          description: "Filtruj e-maile do tej daty",
        },
        chartType: {
          label: "Typ Wykresu",
          description: "Typ wizualizacji dla wykresów",
          line: "Wykres Liniowy",
          bar: "Wykres Słupkowy",
          area: "Wykres Obszarowy",
          pie: "Wykres Kołowy",
          donut: "Wykres Pierścieniowy",
        },
        includeComparison: {
          label: "Uwzględnij Porównanie",
          description: "Uwzględnij porównanie z poprzednim okresem",
        },
        sortBy: {
          label: "Sortuj Według",
          description: "Pole do sortowania e-maili",
        },
        sortOrder: {
          label: "Kolejność Sortowania",
          description: "Kolejność sortowania (rosnąca lub malejąca)",
        },
        response: {
          title: "Odpowiedź Statystyk E-maili",
          description: "Kompleksowe dane statystyk i metryk e-maili",
          totalEmails: "Łączna Liczba E-maili",
          sentEmails: "Wysłane E-maile",
          deliveredEmails: "Dostarczone E-maile",
          openedEmails: "Otwarte E-maile",
          clickedEmails: "Kliknięte E-maile",
          bouncedEmails: "Odrzucone E-maile",
          failedEmails: "Nieudane E-maile",
          draftEmails: "Szkice E-maili",
          openRate: "Wskaźnik Otwarć",
          clickRate: "Wskaźnik Kliknięć",
          deliveryRate: "Wskaźnik Dostaw",
          bounceRate: "Wskaźnik Odrzuceń",
          failureRate: "Wskaźnik Niepowodzeń",
          emailsByProvider: "E-maile według Dostawcy",
          emailsByTemplate: "E-maile według Szablonu",
          emailsByStatus: "E-maile według Statusu",
          emailsByType: "E-maile według Typu",
          emailsWithUserId: "E-maile z ID Użytkownika",
          emailsWithoutUserId: "E-maile bez ID Użytkownika",
          emailsWithLeadId: "E-maile z ID Leada",
          emailsWithoutLeadId: "E-maile bez ID Leada",
          emailsWithErrors: "E-maile z Błędami",
          emailsWithoutErrors: "E-maile bez Błędów",
          averageRetryCount: "Średnia Liczba Prób",
          maxRetryCount: "Maksymalna Liczba Prób",
          averageProcessingTime: "Średni Czas Przetwarzania",
          averageDeliveryTime: "Średni Czas Dostawy",
          historicalData: "Dane Historyczne",
          groupedStats: "Statystyki Grupowane",
          generatedAt: "Wygenerowano O",
          dataRange: "Zakres Danych",
          recentActivity: "Ostatnia Aktywność",
          topPerformingTemplates: "Najlepsze Szablony",
          topPerformingProviders: "Najlepsi Dostawcy",
          metrics: {
            totalEmails: "Wszystkie E-maile",
            sentEmails: "Wysłane E-maile",
            deliveredEmails: "Dostarczone E-maile",
            openedEmails: "Otwarte E-maile",
            clickedEmails: "Kliknięte E-maile",
            bouncedEmails: "Odbite E-maile",
            failedEmails: "Nieudane E-maile",
            deliveryRate: "Wskaźnik Dostarczenia",
            openRate: "Wskaźnik Otwarć",
            clickRate: "Wskaźnik Kliknięć",
            bounceRate: "Wskaźnik Odbić",
            failureRate: "Wskaźnik Niepowodzeń",
            emails_with_errors: "E-maile z Błędami",
            average_retry_count: "Średnia Liczba Ponowień",
            average_processing_time: "Średni Czas Przetwarzania (ms)",
            average_delivery_time: "Średni Czas Dostarczenia (ms)",
            provider_historical: "Historia Dostawcy",
            template_historical: "Historia Szablonu",
            engagement_historical: "Historia Zaangażowania",
          },
          retry: {
            no_retries: "Bez Ponowień",
            with_retries: "Z Ponowieniami",
          },
          association: {
            with_user: "Z Użytkownikiem",
            with_lead: "Z Leadem",
            with_both: "Z Oboma",
            with_neither: "Samodzielny",
          },
        },
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagana autoryzacja do dostępu do statystyk e-maili",
          },
          validation: {
            title: "Błąd Walidacji",
            description: "Podano nieprawidłowe parametry żądania",
          },
          server: {
            title: "Błąd Serwera",
            description: "Wewnętrzny błąd serwera podczas pobierania statystyk",
          },
          unknown: {
            title: "Nieznany Błąd",
            description: "Wystąpił nieznany błąd",
          },
          network: {
            title: "Błąd Sieci",
            description: "Błąd sieci podczas pobierania statystyk",
          },
          forbidden: {
            title: "Zabronione",
            description: "Dostęp do statystyk e-maili jest zabroniony",
          },
          notFound: {
            title: "Nie Znaleziono",
            description: "Statystyki e-maili nie zostały znalezione",
          },
          unsavedChanges: {
            title: "Niezapisane Zmiany",
            description:
              "Są niezapisane zmiany, które muszą być najpierw zapisane",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Wystąpił konflikt danych podczas pobierania statystyk",
          },
        },
        success: {
          title: "Sukces",
          description: "Statystyki e-maili pobrano pomyślnie",
        },
      },
      widget: {
        title: "Statystyki e-mail",
        total: "Łącznie",
        sent: "Wysłane",
        delivered: "Dostarczone",
        opened: "Otwarte",
        clicked: "Kliknięte",
        bounced: "Odrzucone",
        failed: "Nieudane",
        errors: "Błędy",
        engagementRates: "Wskaźniki zaangażowania",
        deliveryRate: "Wskaźnik dostarczenia",
        openRate: "Wskaźnik otwarć",
        clickRate: "Wskaźnik kliknięć",
        bounceRate: "Wskaźnik odrzuceń",
        failureRate: "Wskaźnik błędów",
        byStatus: "Według statusu",
        byType: "Według typu",
        avgRetries: "Śr. ponowień",
        avgDeliveryMs: "Śr. czas dostarczenia",
        viewList: "Wyświetl listę",
        refresh: "Odśwież",
        search: "Szukaj e-maili...",
      },
      enums: {
        status: {
          pending: "Oczekujące",
          sent: "Wysłane",
          delivered: "Dostarczone",
          opened: "Otwarte",
          clicked: "Kliknięte",
          bounced: "Odrzucone",
          failed: "Nieudane",
          unsubscribed: "Wypisane",
        },
        statusFilter: {
          any: "Wszystkie statusy",
        },
        type: {
          transactional: "Transakcyjny",
          marketing: "Marketingowy",
          notification: "Powiadomienie",
          system: "Systemowy",
          leadCampaign: "Kampania leadów",
          userCommunication: "Komunikacja z użytkownikiem",
        },
        typeFilter: {
          any: "Wszystkie typy",
        },
        sortField: {
          subject: "Temat",
          recipientEmail: "E-mail odbiorcy",
          recipientName: "Nazwa odbiorcy",
          type: "Typ",
          status: "Status",
          sentAt: "Wysłano o",
          createdAt: "Utworzono o",
        },
        sortOrder: {
          asc: "Rosnąco",
          desc: "Malejąco",
        },
      },
    },
    enums: {
      status: {
        pending: "Oczekujący",
        sent: "Wysłany",
        delivered: "Dostarczony",
        opened: "Otwarty",
        clicked: "Kliknięty",
        bounced: "Odrzucony",
        failed: "Nieudany",
        unsubscribed: "Wypisany",
      },
      statusFilter: {
        any: "Wszystkie statusy",
      },
      type: {
        transactional: "Transakcyjny",
        marketing: "Marketing",
        notification: "Powiadomienie",
        system: "System",
        leadCampaign: "Kampania leadów",
        userCommunication: "Komunikacja z użytkownikiem",
      },
      typeFilter: {
        any: "Wszystkie typy",
      },
      provider: {
        resend: "Resend",
        sendgrid: "SendGrid",
        mailgun: "Mailgun",
        ses: "Amazon SES",
        smtp: "SMTP",
        mailjet: "Mailjet",
        postmark: "Postmark",
        other: "Inne",
      },
      sortField: {
        subject: "Temat",
        recipientEmail: "Email odbiorcy",
        recipientName: "Nazwa odbiorcy",
        type: "Typ",
        status: "Status",
        sentAt: "Wysłano",
        createdAt: "Utworzono",
      },
      retryRange: {
        noRetries: "Bez ponowień",
        oneToTwo: "1-2 ponowienia",
        threeToFive: "3-5 ponowień",
        sixPlus: "6+ ponowień",
      },
      syncStatus: {
        pending: "Oczekuje na synchronizację",
        syncing: "Synchronizacja w toku",
        synced: "Zsynchronizowany",
        failed: "Synchronizacja nieudana",
      },
      specialFolder: {
        inbox: "Skrzynka odbiorcza",
        sent: "Wysłane",
        drafts: "Wersje robocze",
        trash: "Kosz",
        spam: "Spam",
        archive: "Archiwum",
      },
      sortOrder: {
        asc: "Rosnąco",
        desc: "Malejąco",
      },
    },
  },
  send: {
    title: "Wyślij wiadomość",
    description:
      "Wyślij wiadomość przez dowolny kanał (E-mail, SMS, WhatsApp, Telegram)",
    category: "Komunikacja",
    tag: "Wyślij",

    container: {
      title: "Wyślij wiadomość",
      description: "Wyślij przez skonfigurowane konto messenger",
    },

    accountId: {
      label: "Konto messenger",
      description: "Konto do wysyłania",
      placeholder: "Wybierz UUID konta",
    },
    to: {
      label: "Odbiorca",
      description: "Adres e-mail, numer telefonu lub ID czatu",
      placeholder: "uzytkownik@przyklad.pl lub +48123456789",
    },
    toName: {
      label: "Nazwa odbiorcy",
      description: "Nazwa wyświetlana odbiorcy (opcjonalna)",
      placeholder: "Jan Kowalski",
    },
    subject: {
      label: "Temat",
      description: "Linia tematu (tylko e-mail, opcjonalna dla innych kanałów)",
      placeholder: "Twój temat tutaj...",
    },
    text: {
      label: "Wiadomość",
      description:
        "Treść tekstowa - dla SMS/WhatsApp/Telegram; zapasowa dla e-mail",
      placeholder: "Wprowadź wiadomość...",
    },
    html: {
      label: "Treść HTML",
      description: "Treść HTML (tylko e-mail, opcjonalna - zapasowa tekst)",
      placeholder: "<p>Wprowadź treść HTML e-maila...</p>",
    },
    senderName: {
      label: "Nazwa nadawcy",
      description: "Nazwa wyświetlana jako nadawca (tylko e-mail, opcjonalna)",
      placeholder: "Twoja firma",
    },
    replyTo: {
      label: "Odpowiedź do",
      description: "Adres odpowiedzi (tylko e-mail, opcjonalny)",
      placeholder: "support@przyklad.pl",
    },
    leadId: {
      label: "ID leada",
      description: "Powiązany lead do śledzenia (opcjonalny)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "ID kampanii",
      description: "Powiązana kampania do śledzenia (opcjonalna)",
      placeholder: "UUID",
    },

    response: {
      title: "Wynik wysyłania",
      description: "Wynik operacji wysyłania",
      messageId: { label: "ID wiadomości" },
      accountName: { label: "Konto" },
      channel: { label: "Kanał" },
      provider: { label: "Dostawca" },
      sentAt: { label: "Wysłano o" },
    },

    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź swoje dane i spróbuj ponownie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do wysyłania wiadomości",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas wysyłania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas wysyłania",
      },
      notFound: {
        title: "Konto nie znalezione",
        description: "Podane konto messenger nie zostało znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Żądanie koliduje z istniejącymi danymi",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },

    success: {
      title: "Wiadomość wysłana",
      description: "Twoja wiadomość została wysłana pomyślnie",
    },
  },
  smtpClient: {
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
          copyright:
            "© {{currentYear}} {{appName}}. Wszelkie prawa zastrzeżone.",
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
          sending_failed: "Nie udało się wysłać e-maila do {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Nie udało się renderować szablonu e-mail",
          send_failed: "Nie udało się wysłać e-maila",
          email_failed_subject: "E-mail nie powiódł się",
          unknown_recipient: "Nieznany odbiorca",
          unknown_sender: "System",
          email_render_exception: "Wystąpił wyjątek renderowania e-maila",
          batch_send_failed: "Nie udało się wysłać wsadowo e-maili",
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
        },
        rejected: {
          title: "Email odrzucony",
          defaultReason: "Email odrzucony przez serwer",
        },
        no_recipients: {
          title: "Brak zaakceptowanych odbiorców",
          defaultReason: "Brak zaakceptowanych odbiorców",
        },
        rate_limit: {
          title: "Przekroczono limit szybkości",
        },
        capacity: {
          title: "Błąd pojemności",
        },
        no_account: {
          title: "Brak dostępnego konta SMTP",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Błąd serwera metadanych email",
          description: "Nie udało się zapisać metadanych emaila",
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
  },

  // Core emails level translations
  tag: "E-maile",
  tags: {
    stats: "Statystyki",
    analytics: "Analityka",
  },
  error: {
    default: "Wystąpił błąd",
  },
  template: {
    tagline: "AI bez ograniczeń",
  },
  footer: {
    visitWebsite: "Odwiedź stronę",
    allRightsReserved: "Wszelkie prawa zastrzeżone",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "E-mail aktualizacji zbiorczej leadów",
            description: "E-mail wysyłany przy zbiorczej aktualizacji leadów",
          },
          preview: {
            totalMatched: "Całkowita liczba znalezionych",
            totalMatched_description: "Liczba znalezionych leadów",
            totalProcessed: "Całkowita liczba przetworzonych",
            totalProcessed_description: "Liczba przetworzonych leadów",
            totalUpdated: "Całkowita liczba zaktualizowanych",
            totalUpdated_description:
              "Liczba pomyślnie zaktualizowanych leadów",
            errorsCount: "Liczba błędów",
            errorsCount_description: "Liczba błędów podczas przetwarzania",
            dryRun: "Tryb testowy",
            dryRun_description: "Tylko podgląd bez rzeczywistych zmian",
            userId: "ID użytkownika",
            userId_description: "ID użytkownika wykonującego akcję",
          },
        },
      },
      welcome: {
        meta: {
          name: "E-mail powitalny dla leadów",
          description: "E-mail powitalny dla nowych leadów",
        },
        preview: {
          leadId: "ID leada",
          leadId_description: "Unikalny identyfikator leada",
          businessName: "Nazwa firmy",
          businessName_description: "Nazwa firmy (opcjonalnie)",
          email: "E-mail",
          email_description: "Adres e-mail leada",
          userId: "ID użytkownika",
          userId_description: "ID powiązanego użytkownika (opcjonalnie)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Przesłanie formularza kontaktowego",
          description:
            "E-mail wysyłany przy przesłaniu formularza kontaktowego",
        },
        preview: {
          name: "Imię i nazwisko",
          name_description: "Nazwa kontaktu",
          email: "E-mail",
          email_description: "Adres e-mail kontaktu",
          company: "Firma",
          company_description: "Nazwa firmy (opcjonalnie)",
          subject: "Temat",
          subject_description: "Temat wiadomości",
          message: "Wiadomość",
          message_description: "Treść wiadomości",
          isForCompany: "Dla konta firmowego",
          isForCompany_description:
            "Czy ta wiadomość jest wysyłana do zespołu firmowego",
          userId: "ID użytkownika",
          userId_description: "ID powiązanego użytkownika (opcjonalnie)",
          leadId: "ID leada",
          leadId_description: "ID powiązanego leada (opcjonalnie)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Potwierdzenie rezygnacji z newslettera",
          description: "E-mail potwierdzający rezygnację z newslettera",
        },
        preview: {
          email: "E-mail",
          email_description: "Adres e-mail wypisywany z subskrypcji",
        },
      },
      welcome: {
        meta: {
          name: "E-mail powitalny newslettera",
          description: "E-mail powitalny dla nowych subskrybentów newslettera",
        },
        preview: {
          email: "E-mail",
          email_description: "Adres e-mail subskrybenta",
          name: "Imię i nazwisko",
          name_description: "Nazwa subskrybenta (opcjonalnie)",
          leadId: "ID leada",
          leadId_description: "ID powiązanego leada (opcjonalnie)",
          userId: "ID użytkownika",
          userId_description: "ID powiązanego użytkownika (opcjonalnie)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Potwierdzenie resetowania hasła",
            description: "E-mail potwierdzający zresetowanie hasła",
          },
          preview: {
            publicName: "Nazwa publiczna",
            publicName_description: "Publiczna nazwa użytkownika",
            userId: "ID użytkownika",
            userId_description: "Unikalny identyfikator użytkownika",
          },
        },
        request: {
          meta: {
            name: "Prośba o reset hasła",
            description: "E-mail z linkiem do resetowania hasła",
          },
          preview: {
            publicName: "Nazwa publiczna",
            publicName_description: "Publiczna nazwa użytkownika",
            userId: "ID użytkownika",
            userId_description: "Unikalny identyfikator użytkownika",
            passwordResetUrl: "URL resetowania hasła",
            passwordResetUrl_description: "Adres URL do resetowania hasła",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "Powitanie po rejestracji użytkownika",
          description: "E-mail powitalny dla nowych rejestracji użytkowników",
        },
        preview: {
          privateName: "Imię prywatne",
          privateName_description: "Prywatne imię użytkownika",
          userId: "ID użytkownika",
          userId_description: "Unikalny identyfikator użytkownika",
          leadId: "ID leada",
          leadId_description: "ID powiązanego leada",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "E-mail powitalny użytkownika",
          description: "E-mail powitalny dla nowych użytkowników",
        },
        preview: {
          userId: "ID użytkownika",
          userId_description: "Unikalny identyfikator użytkownika",
          email: "E-mail",
          email_description: "Adres e-mail użytkownika",
          privateName: "Imię prywatne",
          privateName_description: "Prywatne imię użytkownika",
          publicName: "Nazwa publiczna",
          publicName_description: "Publiczna nazwa użytkownika",
          leadId: "ID leada",
          leadId_description: "ID powiązanego leada (opcjonalnie)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Subskrypcja udana",
          description: "E-mail potwierdzający udaną subskrypcję",
        },
        preview: {
          privateName: "Imię prywatne",
          privateName_description: "Prywatne imię użytkownika",
          userId: "ID użytkownika",
          userId_description: "Unikalny identyfikator użytkownika",
          leadId: "ID leada",
          leadId_description: "ID powiązanego leada",
          planName: "Nazwa planu",
          planName_description: "Nazwa planu subskrypcji",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: Nowa rejestracja użytkownika",
          description: "Powiadomienie admina o nowej rejestracji użytkownika",
        },
        preview: {
          privateName: "Imię prywatne",
          publicName: "Nazwa publiczna",
          email: "E-mail",
          userId: "ID użytkownika",
          subscribeToNewsletter: "Subskrypcja newslettera",
        },
      },
      subscription: {
        meta: {
          name: "Admin: Nowa subskrypcja",
          description: "Powiadomienie admina o nowej subskrypcji",
        },
        preview: {
          privateName: "Imię prywatne",
          publicName: "Nazwa publiczna",
          email: "E-mail",
          planName: "Nazwa planu",
          statusName: "Status",
        },
      },
      user_create: {
        meta: {
          name: "Admin: Nowy użytkownik utworzony",
          description: "Powiadomienie admina o utworzeniu konta użytkownika",
        },
        preview: {
          privateName: "Imię prywatne",
          publicName: "Nazwa publiczna",
          email: "E-mail",
          userId: "ID użytkownika",
          leadId: "ID leada",
        },
      },
      contact: {
        meta: {
          name: "Admin: Zgłoszenie formularza kontaktowego",
          description:
            "Powiadomienie admina o przesłaniu formularza kontaktowego",
        },
        preview: {
          name: "Nazwa nadawcy",
          email: "E-mail nadawcy",
          subject: "Temat",
          message: "Wiadomość",
          company: "Firma",
          userId: "ID użytkownika",
          leadId: "ID leada",
        },
      },
    },
  },

  // Email Preview System (EN for now, can be translated later)
  preview: {
    render: {
      post: {
        title: "Render Email Preview",
        titleShort: "Renderuj podgląd",
        description: "Server-side rendering of email templates for preview",
        container: {
          title: "Email Preview Configuration",
        },
        success: {
          title: "Preview Rendered",
          description: "Email preview rendered successfully",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID of the email template to render",
          },
          language: {
            label: "Language",
            description: "Language for email rendering",
          },
          country: {
            label: "Country",
            description: "Country for email rendering",
          },
          props: {
            label: "Template Props",
            description: "Properties to pass to the email template",
          },
          html: {
            title: "Rendered HTML",
          },
          subject: {
            title: "Email Subject",
          },
          templateVersion: {
            title: "Template Version",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe dane żądania podglądu",
          },
          network: {
            title: "Błąd sieci",
            description: "Błąd sieci podczas renderowania podglądu",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Nie masz uprawnień do renderowania podglądów",
          },
          forbidden: {
            title: "Zabronione",
            description: "Renderowanie podglądu jest zabronione",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Nie znaleziono szablonu e-mail",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się wyrenderować podglądu e-mail",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt podczas renderowania",
          },
        },
      },
      title: "Podgląd e-maila",
      preview: "Podgląd",
      version: "Wersja",
      submit: "Renderuj podgląd",
      submitting: "Renderowanie...",
    },
    sendTest: {
      post: {
        title: "Send Test Email",
        titleShort: "Testowy e-mail",
        description: "Send test email with custom template data",
        container: {
          title: "Test Email Configuration",
        },
        success: {
          title: "Test Email Sent",
          description: "Test email sent successfully",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID of the email template to send",
          },
          recipientEmail: {
            label: "Recipient Email",
            description: "Email address to send test to",
          },
          language: {
            label: "Language",
            description: "Language for email rendering",
          },
          country: {
            label: "Country",
            description: "Country for email rendering",
          },
          props: {
            label: "Template Props",
            description: "Properties to pass to the email template",
          },
          success: {
            title: "Success",
          },
          message: {
            title: "Result Message",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe dane żądania testowego e-mail",
          },
          network: {
            title: "Błąd sieci",
            description: "Błąd sieci podczas wysyłania testowego e-mail",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Nie masz uprawnień do wysyłania testowych e-maili",
          },
          forbidden: {
            title: "Zabronione",
            description: "Wysyłanie testowych e-maili jest zabronione",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Nie znaleziono szablonu e-mail",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się wysłać testowego e-mail",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt podczas wysyłania",
          },
        },
      },
      error: {
        templateNotFound: "Email template not found",
        invalidProps: "Invalid template props",
        sendFailed: "Failed to send test email",
      },
      success: "Test email sent successfully to {email}",
      title: "Wyślij testowy e-mail",
      failed: "Nie udało się wysłać testowego e-maila",
      submit: "Wyślij testowy e-mail",
      submitting: "Wysyłanie...",
    },
  },
  messaging: {
    category: "Wiadomości",
    tag: "messaging",
    enums: {
      channel: {
        email: "E-mail",
        sms: "SMS",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
      },
      channelFilter: {
        any: "Wszystkie kanały",
      },
      provider: {
        twilio: "Twilio",
        awsSns: "AWS SNS",
        messagebird: "MessageBird",
        http: "HTTP",
        whatsappBusiness: "WhatsApp Business",
        telegramBot: "Telegram Bot",
      },
      accountStatus: {
        active: "Aktywny",
        inactive: "Nieaktywny",
        error: "Błąd",
        testing: "Testowanie",
      },
    },
    send: {
      errors: {
        accountNotFound:
          "Konto komunikacyjne {{accountId}} nie zostało znalezione",
        sendFailed: "Nie udało się wysłać wiadomości",
        unexpected:
          "Nieoczekiwany błąd podczas wysyłania wiadomości: {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "Wysyłanie SMTP nie powiodło się",
      smtpAccountNotFound: "Konto IMAP nie znalezione",
      smtpListInboxFailed: "Nie udało się wylistować skrzynki odbiorczej",
      smtpListFoldersFailed: "Nie udało się wylistować folderów",
      smtpMoveMessageFailed: "Nie udało się przenieść wiadomości",
      smtpMarkReadFailed: "Nie udało się oznaczyć wiadomości",
      resendKeyNotConfigured: "Klucz API Resend nie jest skonfigurowany",
      resendSendFailed: "Wysyłanie przez Resend nie powiodło się",
      resendProviderError: "Błąd dostawcy Resend",
      resendNoInbox: "Resend nie obsługuje skrzynki odbiorczej",
      resendNoFolders: "Resend nie obsługuje folderów",
      smsSendFailed: "Wysyłanie SMS nie powiodło się",
      whatsappSendFailed: "Wysyłanie WhatsApp nie powiodło się",
      telegramSendFailed: "Wysyłanie Telegram nie powiodło się",
      accountNotFound: "Konto komunikatora nie znalezione",
      notSupported: "Ta operacja nie jest obsługiwana przez tego dostawcę",
    },
  },
};
