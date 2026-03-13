export const translations = {
  tags: {
    messaging: "Messaging",
  },
  get: {
    title: "Wyświetl konto Messenger",
    description: "Pobierz szczegóły konta messenger",
  },
  enums: {
    channel: {
      email: "Email",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Telegram Bot",
    },
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
    imapAuthMethod: { plain: "Plain", oauth2: "OAuth2", xoauth2: "XOAUTH2" },
  },

  sections: {
    identity: "Ustawienia konta",
    smtp: "Dane SMTP",
    api: "Dane API",
    imap: "IMAP przychodzący",
    routing: "Routing e-mail",
  },

  put: {
    title: "Edytuj konto Messenger",
    description: "Zaktualizuj ustawienia konta messenger",
    success: {
      title: "Konto zaktualizowane",
      description: "Konto messenger zostało pomyślnie zaktualizowane",
    },
  },
  fields: {
    id: { label: "ID", description: "ID konta" },
    name: {
      label: "Nazwa konta",
      description: "Unikalna nazwa",
      placeholder: "np. Główny SMTP",
    },
    description: {
      label: "Opis",
      description: "Opcjonalny opis",
      placeholder: "Opisz cel tego konta",
    },
    channel: { label: "Kanał", description: "Kanał komunikacji" },
    provider: { label: "Dostawca", description: "Dostawca usług" },
    status: { label: "Status", description: "Status konta" },
    priority: {
      label: "Priorytet",
      description: "Wyższa liczba = wyższy priorytet",
    },
    isDefault: {
      label: "Konto domyślne",
      description: "Użyj jako domyślne dla tego kanału",
    },
    smtpHost: {
      label: "Host SMTP",
      description: "Hostname serwera SMTP",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "Port SMTP",
      description: "Port serwera SMTP",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Bezpieczeństwo",
      description: "Typ zabezpieczenia połączenia",
    },
    smtpUsername: {
      label: "Użytkownik SMTP",
      description: "Nazwa użytkownika SMTP",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "Hasło SMTP",
      description: "Pozostaw puste, aby zachować",
      placeholder: "Nowe hasło lub zostaw puste",
    },
    smtpFromEmail: {
      label: "Od e-mail",
      description: "Adres e-mail nadawcy",
      placeholder: "noreply@example.com",
    },
    smtpConnectionTimeout: {
      label: "Timeout połączenia",
      description: "Timeout w ms",
    },
    smtpMaxConnections: {
      label: "Maks. połączeń",
      description: "Maks. jednoczesnych połączeń",
    },
    smtpRateLimitPerHour: {
      label: "Limit szybkości",
      description: "Maks. e-maili na godzinę",
    },
    apiKey: {
      label: "Klucz API",
      description: "Pozostaw puste, aby zachować",
      placeholder: "Pozostaw puste, aby zachować",
    },
    apiToken: {
      label: "Token API",
      description: "Pozostaw puste, aby zachować",
      placeholder: "Pozostaw puste, aby zachować",
    },
    apiSecret: {
      label: "Sekret API",
      description: "Pozostaw puste, aby zachować",
      placeholder: "Pozostaw puste, aby zachować",
    },
    fromId: {
      label: "Od ID",
      description: "Numer telefonu lub ID nadawcy",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "URL Webhook",
      description: "Webhook dla przychodzących wiadomości",
      placeholder: "https://example.com/webhook",
    },
    imapHost: {
      label: "Host IMAP",
      description: "Hostname serwera IMAP",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "Port IMAP",
      description: "Port serwera IMAP",
      placeholder: "993",
    },
    imapSecure: { label: "IMAP TLS", description: "Użyj TLS/SSL dla IMAP" },
    imapUsername: {
      label: "Użytkownik IMAP",
      description: "Nazwa użytkownika IMAP",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "Hasło IMAP",
      description: "Pozostaw puste, aby zachować",
      placeholder: "Pozostaw puste, aby zachować",
    },
    imapAuthMethod: {
      label: "Metoda uwierzytelniania IMAP",
      description: "Metoda uwierzytelniania IMAP",
    },
    imapSyncEnabled: {
      label: "Włącz synchronizację",
      description: "Włącz automatyczną synchronizację IMAP",
    },
    imapSyncInterval: {
      label: "Interwał synchronizacji",
      description: "Interwał w sekundach",
    },
    imapMaxMessages: {
      label: "Maks. wiadomości",
      description: "Maks. wiadomości na folder",
    },
    campaignTypes: {
      label: "Typy kampanii",
      description: "Typy kampanii",
      placeholder: "Wybierz typy kampanii",
    },
    emailJourneyVariants: {
      label: "Warianty Journey",
      description: "Warianty Journey",
      placeholder: "Wybierz warianty",
    },
    emailCampaignStages: {
      label: "Etapy kampanii",
      description: "Etapy kampanii",
      placeholder: "Wybierz etapy",
    },
    countries: {
      label: "Kraje",
      description: "Kraje docelowe",
      placeholder: "Wybierz kraje",
    },
    languages: {
      label: "Języki",
      description: "Języki docelowe",
      placeholder: "Wybierz języki",
    },
    isExactMatch: {
      label: "Dokładne dopasowanie",
      description: "Wymagaj dokładnego dopasowania",
    },
    weight: { label: "Waga", description: "Waga do równoważenia obciążenia" },
    isFailover: { label: "Failover", description: "Użyj jako konto failover" },
    failoverPriority: {
      label: "Priorytet failover",
      description: "Kolejność priorytetu failover",
    },
  },
  response: {
    account: {
      id: "ID",
      name: "Nazwa",
      channel: "Kanał",
      provider: "Dostawca",
      status: "Status",
      healthStatus: "Zdrowie",
      isDefault: "Domyślny",
      priority: "Priorytet",
      smtpFromEmail: "Od e-mail",
      fromId: "Od ID",
      smtpHost: "Host SMTP",
      smtpPort: "Port SMTP",
      smtpSecurityType: "Bezpieczeństwo",
      smtpUsername: "Użytkownik SMTP",
      imapHost: "Host IMAP",
      imapPort: "Port IMAP",
      imapSyncEnabled: "Sync IMAP",
      imapLastSyncAt: "Ostatni sync IMAP",
      messagesSentTotal: "Wysłanych wiadomości",
      lastUsedAt: "Ostatnio używany",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe dane konta",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagany dostęp administratora",
    },
    forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
    notFound: { title: "Nie znaleziono", description: "Konto nie znalezione" },
    conflict: {
      title: "Konflikt nazwy",
      description: "Konto o tej nazwie już istnieje",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się przetworzyć żądania",
    },
    networkError: {
      title: "Błąd sieci",
      description: "Komunikacja sieciowa nie powiodła się",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
  },
  success: { title: "Sukces", description: "Konto załadowane pomyślnie" },
};
