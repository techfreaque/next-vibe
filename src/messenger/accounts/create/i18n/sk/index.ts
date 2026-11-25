import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Správy",
  },
  countries: {
    ...regionalCountryNames("sk"),
    global: "Globálne",
    de: "Nemecko",
    pl: "Poľsko",
    fr: "Francúzsko",
    us: "Spojené štáty",
  },
  languages: {
    it: "Taliančina",
    es: "Španielčina",
    sk: "Slovenčina",
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
  },
  title: "Vytvoriť účet na odosielanie správ",
  titleShort: "Nový účet",
  description: "Vytvoriť nový účet na odosielanie správ",

  enums: {
    campaignType: {
      leadCampaign: "Kampaň pre kontakty",
      newsletter: "Newsletter",
      signupNurture: "Komunikácia po registrácii",
      retention: "Udržanie zákazníkov",
      winback: "Návrat zákazníkov",
      transactional: "Transakčné",
      notification: "Oznámenie",
      system: "Systém",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
      signupNurture: "Komunikácia po registrácii",
      retention: "Udržanie zákazníkov",
      winback: "Návrat zákazníkov",
      newsletterMay2026: "Newsletter máj 2026",
      newsletterNov2026: "Newsletter november 2026",
    },
    emailCampaignStage: {
      notStarted: "Nespustené",
      initial: "Úvodná správa",
      followup1: "Pripomienka 1",
      followup2: "Pripomienka 2",
      followup3: "Pripomienka 3",
      nurture: "Budovanie vzťahu",
      reactivation: "Opätovná aktivácia",
    },
    channel: {
      email: "E-mail",
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
      active: "Aktívne",
      inactive: "Neaktívne",
      error: "Chyba",
      testing: "Testovanie",
    },
    securityType: {
      none: "Žiadne",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "PLAIN",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
  },

  sections: {
    identity: "Identifikácia účtu",
    identitySubtitle: "Názov a základné nastavenia tohto účtu",
    smtp: "Odosielanie cez SMTP",
    smtpSubtitle: "Nastavenia servera na odosielanie e-mailov",
    api: "Prihlasovacie údaje API",
    apiSubtitle: "Kľúč API a prístupový token poskytovateľa",
    apiSubtitleSms: "Kľúč API poskytovateľa a ID odosielateľa",
    apiSubtitleWhatsapp: "Token API WhatsApp Business a ID telefónneho čísla",
    apiSubtitleTelegram: "Zadajte token bota, ktorý ste dostali od @BotFather.",
    apiTitleSms: "Prihlasovacie údaje poskytovateľa SMS",
    apiTitleWhatsapp: "Prihlasovacie údaje WhatsApp Business",
    apiTitleTelegram: "Token bota",
    imap: "Príjem cez IMAP",
    imapSubtitle:
      "Nastavte príjem a synchronizáciu prichádzajúcich e-mailov (nepovinné).",
    routing: "Smerovanie e-mailov",
    routingSubtitle:
      "Vyberte kampane a komunikačné série, ktoré používajú tento účet",
    toggleHide: "Skryť",
    toggleShow: "Zobraziť",
  },

  fields: {
    name: {
      label: "Názov účtu",
      description: "Jedinečný názov tohto účtu",
      placeholder: "napr. Primárne SMTP, Twilio SMS",
    },
    description: {
      label: "Opis",
      description: "Nepovinný opis",
      placeholder: "Opíšte účel tohto účtu",
    },
    channel: {
      label: "Kanál",
      description: "Komunikačný kanál",
    },
    provider: {
      label: "Poskytovateľ",
      description: "Poskytovateľ služieb pre tento kanál",
    },
    status: {
      label: "Stav",
      description: "Stav účtu",
    },
    priority: {
      label: "Priorita",
      description: "Vyššie číslo = vyššia priorita",
    },
    isDefault: {
      label: "Predvolený účet",
      description: "Použiť ako predvolený účet pre tento kanál",
    },
    // SMTP outbound
    smtpHost: {
      label: "Hostiteľ SMTP",
      description: "Názov hostiteľa servera SMTP",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "Port SMTP",
      description: "Port servera SMTP",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Bezpečnosť",
      description: "Typ zabezpečenia pripojenia",
    },
    smtpUsername: {
      label: "Používateľské meno SMTP",
      description: "Používateľské meno na prihlásenie k serveru SMTP",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "Heslo SMTP",
      description: "Heslo na prihlásenie k serveru SMTP",
      placeholder: "••••••••",
    },
    smtpFromEmail: {
      label: "E-mail odosielateľa",
      description: "E-mailová adresa odosielateľa",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "Meno odosielateľa",
      description:
        "Meno odosielateľa, ktoré uvidia príjemcovia v e-mailovej aplikácii",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "Časový limit pripojenia",
      description: "Časový limit pripojenia v milisekundách",
    },
    smtpMaxConnections: {
      label: "Maximálny počet pripojení",
      description: "Maximálny počet súbežných pripojení",
    },
    smtpRateLimitPerHour: {
      label: "Limit frekvencie",
      description: "Maximálny počet e-mailov za hodinu",
    },
    // API credentials
    apiKey: {
      label: "Kľúč API",
      description: "Kľúč API pre tohto poskytovateľa",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "Token API",
      description: "Primárny token API alebo SID účtu",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "Tajný kľúč API",
      description: "Doplnkový prihlasovací údaj alebo autentifikačný token",
      placeholder: "••••••••",
    },
    fromId: {
      label: "ID odosielateľa",
      description: "Telefónne číslo, ID odosielateľa alebo token bota",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "URL webhooku",
      description: "URL webhooku pre prichádzajúce správy",
      placeholder: "https://example.com/webhook",
    },
    // IMAP inbound
    imapHost: {
      label: "Hostiteľ IMAP",
      description: "Názov hostiteľa servera IMAP",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "Port IMAP",
      description: "Port servera IMAP",
      placeholder: "993",
    },
    imapSecure: {
      label: "TLS pre IMAP",
      description: "Použiť TLS/SSL pre IMAP",
    },
    imapUsername: {
      label: "Používateľské meno IMAP",
      description: "Používateľské meno na prihlásenie k serveru IMAP",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "Heslo IMAP",
      description: "Heslo na prihlásenie k serveru IMAP",
      placeholder: "••••••••",
    },
    imapAuthMethod: {
      label: "Spôsob overenia v IMAP",
      description: "Spôsob autentifikácie na serveri IMAP",
    },
    imapSyncEnabled: {
      label: "Povoliť synchronizáciu",
      description: "Povoliť automatickú synchronizáciu IMAP",
    },
    imapSyncInterval: {
      label: "Interval synchronizácie",
      description: "Interval synchronizácie v sekundách",
    },
    imapMaxMessages: {
      label: "Maximálny počet správ",
      description: "Najvyšší počet správ na synchronizáciu v každom priečinku",
    },
    // Email routing
    campaignTypes: {
      label: "Typy kampaní",
      description: "Typy kampaní, ktoré môžu používať tento účet",
      placeholder: "Vybrať typy kampaní",
    },
    emailJourneyVariants: {
      label: "Varianty komunikačných sérií",
      description: "Varianty e-mailových sérií",
      placeholder: "Vybrať varianty komunikačných sérií",
    },
    emailCampaignStages: {
      label: "Fázy kampane",
      description: "Fázy kampane",
      placeholder: "Vybrať fázy",
    },
    countries: {
      label: "Krajiny",
      description: "Cieľové krajiny",
      placeholder: "Vybrať krajiny",
    },
    languages: {
      label: "Jazyky",
      description: "Cieľové jazyky",
      placeholder: "Vyberte jazyky",
    },
    isExactMatch: {
      label: "Presná zhoda",
      description: "Vyžadovať presnú zhodu krajiny a jazyka",
    },
    weight: {
      label: "Váha",
      description: "Váha účtu pri rozdeľovaní záťaže",
    },
    isFailover: {
      label: "Záložný účet",
      description: "Použiť ako záložný účet",
    },
    isSystem: {
      label: "Poštová schránka platformy",
      description:
        "Prevádzková schránka platformy. Prihlasovacie údaje sa načítajú z premenných prostredia. Schránka sa nepoužíva v kampaniach.",
    },
    failoverPriority: {
      label: "Priorita záložného účtu",
      description: "Poradie záložných účtov podľa priority",
    },
  },

  response: {
    account: {
      title: "Účet vytvorený",
      description: "Podrobnosti o novom účte na odosielanie správ",
      id: "ID",
      name: "Názov",
      channel: "Kanál",
      provider: "Poskytovateľ",
      status: "Stav",
      smtpFromEmail: "E-mail odosielateľa",
      fromId: "ID odosielateľa",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
    },
  },

  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Neplatné údaje účtu",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžadujú sa oprávnenia správcu",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Zdroj sa nenašiel",
    },
    conflict: {
      title: "Názov už existuje",
      description: "Účet s týmto názvom už existuje",
    },
    server: {
      title: "Chyba servera",
      description: "Nepodarilo sa vytvoriť účet",
      detail: "Vytvorenie účtu zlyhalo: {{error}}",
    },
    networkError: {
      title: "Chyba siete",
      description: "Sieťová komunikácia zlyhala",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
  },

  success: {
    title: "Účet vytvorený",
    description: "Účet na odosielanie správ bol vytvorený",
  },
};
