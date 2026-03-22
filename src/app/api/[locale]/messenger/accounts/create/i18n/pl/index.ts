export const translations = {
  tags: {
    messaging: "Messaging",
  },
  title: "Utwórz konto Messenger",
  description: "Utwórz nowe konto messenger",
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
    identity: "Tożsamość konta",
    identitySubtitle: "Nazwa i podstawowe ustawienia konta",
    smtp: "Wychodzące SMTP",
    smtpSubtitle: "Ustawienia serwera do wysyłania e-maili",
    api: "Dane API",
    apiSubtitle: "Klucz API i token dostępu",
    apiSubtitleSms: "Klucz API i identyfikator nadawcy",
    apiSubtitleWhatsapp: "Token API WhatsApp Business i identyfikator numeru",
    apiSubtitleTelegram: "Wpisz token bota z @BotFather",
    apiTitleSms: "Dane dostawcy SMS",
    apiTitleWhatsapp: "Dane WhatsApp Business",
    apiTitleTelegram: "Token bota",
    imap: "Przychodzące IMAP",
    imapSubtitle:
      "Konfiguracja odbierania i synchronizacji przychodzących e-maili (opcjonalne)",
    routing: "Routing e-mail",
    routingSubtitle: "Kontrola kampanii i podróży dla tego konta",
    toggleHide: "Ukryj",
    toggleShow: "Pokaż",
  },

  fields: {
    name: {
      label: "Nazwa konta",
      description: "Unikalna nazwa",
      placeholder: "np. Główny SMTP, Twilio SMS",
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
      description: "Nazwa hosta serwera SMTP",
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
      label: "Nazwa użytkownika SMTP",
      description: "Nazwa użytkownika SMTP",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "Hasło SMTP",
      description: "Hasło SMTP",
      placeholder: "••••••••",
    },
    smtpFromEmail: {
      label: "Od e-mail",
      description: "Adres e-mail nadawcy",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "Nazwa nadawcy",
      description: "Wyświetlana nazwa nadawcy w klientach poczty",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "Timeout połączenia",
      description: "Timeout w milisekundach",
    },
    smtpMaxConnections: {
      label: "Maks. połączeń",
      description: "Maksymalna liczba jednoczesnych połączeń",
    },
    smtpRateLimitPerHour: {
      label: "Limit szybkości",
      description: "Maksymalna liczba e-maili na godzinę",
    },
    apiKey: {
      label: "Klucz API",
      description: "Klucz API dla tego dostawcy",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "Token API",
      description: "Główny token API",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "Sekret API",
      description: "Dodatkowe dane uwierzytelniające",
      placeholder: "••••••••",
    },
    fromId: {
      label: "Od ID",
      description: "Numer telefonu lub ID nadawcy",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "URL Webhook",
      description: "URL webhook dla przychodzących wiadomości",
      placeholder: "https://example.com/webhook",
    },
    imapHost: {
      label: "Host IMAP",
      description: "Nazwa hosta serwera IMAP",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "Port IMAP",
      description: "Port serwera IMAP",
      placeholder: "993",
    },
    imapSecure: { label: "IMAP TLS", description: "Użyj TLS/SSL dla IMAP" },
    imapUsername: {
      label: "Nazwa użytkownika IMAP",
      description: "Nazwa użytkownika IMAP",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "Hasło IMAP",
      description: "Hasło IMAP",
      placeholder: "••••••••",
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
      description: "Interwał synchronizacji w sekundach",
    },
    imapMaxMessages: {
      label: "Maks. wiadomości",
      description: "Maks. wiadomości do synchronizacji na folder",
    },
    campaignTypes: {
      label: "Typy kampanii",
      description: "Typy kampanii obsługiwane przez to konto",
      placeholder: "Wybierz typy kampanii",
    },
    emailJourneyVariants: {
      label: "Warianty Journey",
      description: "Warianty ścieżki e-mail",
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
      description: "Wymagaj dokładnego dopasowania kraju/języka",
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
      title: "Konto utworzone",
      description: "Nowe konto messenger",
      id: "ID",
      name: "Nazwa",
      channel: "Kanał",
      provider: "Dostawca",
      status: "Status",
      smtpFromEmail: "Od e-mail",
      fromId: "Od ID",
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
    notFound: { title: "Nie znaleziono", description: "Zasób nie znaleziony" },
    conflict: {
      title: "Konflikt nazwy",
      description: "Konto o tej nazwie już istnieje",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się utworzyć konta",
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
  success: {
    title: "Konto utworzone",
    description: "Konto messenger zostało pomyślnie utworzone",
  },
};
