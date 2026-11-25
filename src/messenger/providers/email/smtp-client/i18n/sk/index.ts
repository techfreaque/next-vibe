import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Klient SMTP",
  category: "E-mailové služby",
  components: {
    email: {
      tagline: "Platforma AI pre slobodu prejavu",
      footer: {
        needHelp: "Potrebuješ pomoc?",
        helpText: "Potrebuješ pomoc? Napíš nám na",
        unsubscribeText: "Nechceš dostávať tieto e-maily?",
        unsubscribeLink: "Zrušiť odber",
        copyright: "© {{currentYear}} {{appName}}. Všetky práva vyhradené.",
        visitWebsite: "Otvoriť web",
        allRightsReserved:
          "© {{currentYear}} {{appName}}. Všetky práva vyhradené.",
        feedbackHook:
          "Chceš nám niečo povedať? Odpíš na tento e-mail. Čítame každú odpoveď.",
        feedbackBody:
          "Nahlás chybu, navrhni funkciu alebo nám povedz, čo chýba. Za užitočnú spätnú väzbu získaš kredity na celý mesiac predplatného. Počet kreditov: {{credits}}.",
        feedbackLink: "Poslať spätnú väzbu →",
        footerSeparator: " · ",
        legalOperator:
          "Prevádzkovateľ {{companyName}}: {{owner}}, {{address}}.",
        legalContact: "Kontakt",
        legalNotice: "Právne informácie",
      },
    },
    post: {
      title: "Komponenty",
      description: "Koncový bod komponentov",
      form: {
        title: "Nastavenie komponentov",
        description: "Nastaviť parametre komponentov",
      },
      response: {
        title: "Odpoveď",
        description: "Údaje v odpovedi komponentov",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
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
      },
      success: {
        title: "Úspech",
        description: "Operácia prebehla úspešne",
      },
    },
  },
  emailSending: {
    email: {
      defaultSenderName: "Systém",
      errors: {
        sending_failed:
          "E-mail sa nepodarilo odoslať na {{recipient}}: {{error}}",
        invalid_locale:
          "E-mail pre {{recipient}} sa nedá odoslať. Jazykové nastavenie „{{locale}}“ je neplatné.",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed:
          "Nepodarilo sa vygenerovať e-mail zo šablóny: {{error}}",
        send_failed: "Nepodarilo sa poslať e-mail: {{error}}",
        email_failed_subject: "E-mail sa nepodarilo odoslať",
        unknown_recipient: "Neznámy príjemca",
        unknown_sender: "Systém",
        email_render_exception: "Pri generovaní e-mailu nastala chyba",
        batch_send_failed: "Hromadné odosielanie e-mailov zlyhalo",
        batch_send_failed_item: "Hromadné odoslanie zlyhalo: {{error}}",
        batch_send_failed_all:
          "Hromadné odoslanie e-mailov zlyhalo: {{errors}}",
      },
    },
  },
  sending: {
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na odosielanie cez SMTP sa musíte prihlásiť",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba na serveri SMTP",
        detail: "Odoslanie cez SMTP zlyhalo: {{error}}",
        detail_account:
          "Odoslanie cez účet SMTP {{accountName}} ({{accountId}}) zlyhalo: {{error}}",
        detail_attempt:
          "Účet SMTP {{accountId}}, neúspešný pokus {{attempt}}: {{error}}",
        detail_exhausted:
          "Účet SMTP {{accountId}} využil všetky povolené opakované pokusy",
      },
      rejected: {
        title: "Server zamietol e-mail pre adresu {{recipient}}: {{reason}}",
        defaultReason: "Server zamietol e-mail",
      },
      no_recipients: {
        title: "Server neprijal žiadnu z adries príjemcov pre {{recipient}}",
        defaultReason: "Server neprijal žiadnu adresu príjemcu",
      },
      rate_limit: {
        title:
          "Účet {{accountName}} dosiahol hodinový limit. Odoslané: {{current}} z {{limit}}. Zostáva: {{remainingCapacity}}.",
      },
      capacity: {
        title: "Kontrola kapacity zlyhala: {{error}}",
      },
      no_account: {
        title: "Nie je k dispozícii žiadny účet SMTP",
        detail_criteria:
          "Chýba účet SMTP pre {{campaignType}} / {{journeyVariant}} / {{campaignStage}} / {{country}} / {{language}}",
        detail_campaign: "Chýba účet SMTP pre typ kampane {{campaignType}}",
        detail_account: "Účet SMTP {{accountId}} sa nenašiel",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "Chyba servera pri ukladaní metadát e-mailu",
        description: "Metadáta e-mailu sa nepodarilo uložiť",
        detail_store:
          "Metadáta pre {{recipient}} sa nepodarilo uložiť: {{error}}",
        detail_engagement:
          "Nepodarilo sa aktualizovať údaje o interakciách so správou {{emailId}}: {{error}}",
      },
    },
  },
  enums: {
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
    statusFilter: {
      all: "Všetky stavy",
    },
    healthStatus: {
      healthy: "V poriadku",
      degraded: "Obmedzená prevádzka",
      unhealthy: "Mimo prevádzky",
      unknown: "Neznáme",
    },
    healthStatusFilter: {
      all: "Všetky stavy prevádzky",
    },
    sortField: {
      name: "Názov",
      status: "Stav",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
      priority: "Priorita",
      totalEmailsSent: "Celkový počet odoslaných e-mailov",
      lastUsedAt: "Naposledy použité",
    },
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
    campaignTypeFilter: {
      all: "Všetky typy kampaní",
    },
    selectionRuleSortField: {
      name: "Názov",
      priority: "Priorita",
      campaignType: "Typ kampane",
      journeyVariant: "Variant komunikačnej série",
      campaignStage: "Fáza kampane",
      country: "Krajina",
      language: "Jazyk",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
      emailsSent: "Odoslané e-maily",
      successRate: "Miera úspešnosti",
      lastUsedAt: "Naposledy použité",
    },
    selectionRuleStatusFilter: {
      all: "Všetky",
      active: "Aktívne",
      inactive: "Neaktívne",
      default: "Predvolené",
      failover: "Záložný účet",
    },
    loadBalancingStrategy: {
      roundRobin: "Striedanie účtov",
      weighted: "Vážený výber",
      priority: "Priorita",
      leastUsed: "Najmenej používaný účet",
    },
    testResult: {
      success: "Úspech",
      authFailed: "Overenie zlyhalo",
      connectionFailed: "Spojenie zlyhalo",
      timeout: "Časový limit",
      unknownError: "Neznáma chyba",
    },
  },
};
