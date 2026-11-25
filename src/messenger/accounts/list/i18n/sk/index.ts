import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Správy",
  },
  title: "Účty na odosielanie správ",
  titleShort: "Účty",
  description: "Zobraziť všetky účty na odosielanie správ vo všetkých kanáloch",

  fields: {
    channel: {
      label: "Kanál",
      description: "Filtrovať podľa kanála",
    },
    provider: {
      label: "Poskytovateľ",
      description: "Filtrovať podľa poskytovateľa",
    },
    status: {
      label: "Stav",
      description: "Filtrovať podľa stavu účtu",
    },
    search: {
      label: "Hľadať",
      description: "Hľadať podľa názvu alebo opisu",
      placeholder: "Hľadať účty…",
    },
    page: {
      label: "Stránka",
      description: "Číslo stránky výsledkov",
    },
    limit: {
      label: "Limit",
      description: "Počet účtov na stránku",
    },
    sortBy: {
      label: "Zoradiť podľa",
      description: "Zoradiť účty podľa vybraného poľa",
    },
    sortOrder: {
      label: "Poradie",
      description: "Poradie zoradenia (vzostupne alebo zostupne)",
    },
  },

  response: {
    account: {
      title: "Účet",
      description: "Podrobnosti účtu na odosielanie správ",
      id: "ID",
      name: "Názov",
      channel: "Kanál",
      provider: "Poskytovateľ",
      status: "Stav",
      healthStatus: "Stav prevádzky",
      priority: "Priorita",
      messagesSentTotal: "Odoslané správy",
      lastUsedAt: "Naposledy použité",
      createdAt: "Vytvorené",
      isDefault: "Predvolené",
      smtpFromEmail: "E-mail odosielateľa",
      fromId: "ID odosielateľa",
    },
    pagination: {
      title: "Stránkovanie",
      description: "Údaje o stránkovaní",
      page: "Stránka",
      limit: "Na stránku",
      total: "Spolu",
      totalPages: "Celkový počet stránok",
    },
  },

  widget: {
    create: "Pridať účet",
    graphs: "Grafy",
    refresh: "Obnoviť",
    emptyState: "Žiadne účty na odosielanie správ",
    searchPlaceholder: "Hľadať účty…",
    deleteConfirm: "Odstrániť tento účet?",
    deleteConfirmYes: "Odstrániť",
    deleteConfirmNo: "Zrušiť",
  },

  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Neplatné parametre filtra",
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
      title: "Konflikt údajov",
      description: "Vyskytol sa konflikt údajov",
    },
    server: {
      title: "Chyba servera",
      description: "Účty sa nepodarilo načítať",
      detail: "Nepodarilo sa načítať účty: {{error}}",
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
    title: "Účty načítané",
    description: "Účty na odosielanie správ boli načítané",
  },

  enums: {
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Všetky kanály",
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
    providerFilter: {
      any: "Všetci poskytovatelia",
    },
    status: {
      active: "Aktívne",
      inactive: "Neaktívne",
      error: "Chyba",
      testing: "Testovanie",
    },
    statusFilter: {
      any: "Všetky stavy",
    },
    healthStatus: {
      healthy: "V poriadku",
      degraded: "Obmedzená prevádzka",
      unhealthy: "Mimo prevádzky",
      unknown: "Neznáme",
    },
    healthStatusFilter: {
      any: "Všetky",
    },
    sortField: {
      name: "Názov",
      channel: "Kanál",
      provider: "Poskytovateľ",
      status: "Stav",
      priority: "Priorita",
      messagesSentTotal: "Odoslané správy",
      lastUsedAt: "Naposledy použité",
      createdAt: "Vytvorené",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
  },
};
