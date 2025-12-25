import { translations as emailServiceTranslations } from "../../email-service/i18n/pl";
import { translations as imapClientTranslations } from "../../imap-client/i18n/pl";
import { translations as messagesTranslations } from "../../messages/i18n/pl";
import { translations as sendTranslations } from "../../send/i18n/pl";
import { translations as smtpClientTranslations } from "../../smtp-client/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie E-mailami",
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
  emailService: emailServiceTranslations,
  imapClient: imapClientTranslations,
  messages: messagesTranslations,
  send: sendTranslations,
  smtpClient: smtpClientTranslations,

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
    tagline: "Twoja platforma czatu zasilana AI",
  },
  footer: {
    visitWebsite: "Odwiedź stronę",
    allRightsReserved: "Wszelkie prawa zastrzeżone",
  },
};
