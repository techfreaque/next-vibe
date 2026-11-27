import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-mail",
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
    hi: "Hindčina",
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
  },
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "Žiadne",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Aktívne",
      inactive: "Neaktívne",
      error: "Chyba",
      testing: "Testovanie",
    },
    smtpHealthStatus: {
      healthy: "V poriadku",
      degraded: "Obmedzená prevádzka",
      unhealthy: "Mimo prevádzky",
      unknown: "Neznáme",
    },
    smtpSortField: {
      name: "Názov",
      status: "Stav",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
      priority: "Priorita",
      totalEmailsSent: "Celkový počet odoslaných e-mailov",
      lastUsedAt: "Naposledy použité",
    },
    smtpCampaignType: {
      leadCampaign: "Kampaň pre kontakty",
      newsletter: "Newsletter",
      signupNurture: "Komunikácia po registrácii",
      retention: "Udržanie zákazníkov",
      winback: "Návrat zákazníkov",
      transactional: "Transakčné",
      notification: "Oznámenie",
      system: "Systém",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Striedanie účtov",
      weighted: "Vážený výber",
      priority: "Priorita",
      leastUsed: "Najmenej používaný účet",
    },
    loadBalancingStrategy: {
      roundRobin: "Striedanie účtov",
      weighted: "Vážený výber",
      priority: "Priorita",
      leastUsed: "Najmenej používaný účet",
    },
    smtpTestResult: {
      success: "Úspech",
      authFailed: "Overenie zlyhalo",
      connectionFailed: "Spojenie zlyhalo",
      timeout: "Časový limit",
      unknownError: "Neznáma chyba",
    },
    testResult: {
      success: "Úspech",
      authFailed: "Overenie zlyhalo",
      connectionFailed: "Spojenie zlyhalo",
      timeout: "Časový limit",
      unknownError: "Neznáma chyba",
    },
    smtpStatusFilter: {
      any: "Ľubovoľné",
    },
    smtpHealthStatusFilter: {
      any: "Ľubovoľné",
    },
    smtpCampaignTypeFilter: {
      any: "Ľubovoľné",
    },
    smtpSelectionRuleSortField: {
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
    smtpSelectionRuleStatusFilter: {
      any: "Ľubovoľné",
      active: "Aktívne",
      inactive: "Neaktívne",
      default: "Predvolené",
      failover: "Záložný účet",
    },
    selectionRuleStatusFilter: {
      any: "Ľubovoľné",
      active: "Aktívne",
      inactive: "Neaktívne",
      default: "Predvolené",
      failover: "Záložný účet",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "Čaká sa",
      sent: "Odoslané",
      delivered: "Doručené",
      opened: "Otvorené",
      clicked: "S kliknutím na odkaz",
      bounced: "Vrátené",
      failed: "Zlyhalo",
      unsubscribed: "Odber zrušený",
    },
    emailType: {
      transactional: "Transakčné",
      marketing: "Marketing",
      notification: "Oznámenie",
      system: "Systém",
      leadCampaign: "Kampaň pre kontakty",
      userCommunication: "Komunikácia s používateľmi",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Iné",
    },
    emailSortField: {
      subject: "Predmet",
      recipientEmail: "E-mail príjemcu",
      recipientName: "Meno príjemcu",
      type: "Typ",
      status: "Stav",
      sentAt: "Odoslané",
      createdAt: "Vytvorené",
    },
    emailStatusFilter: {
      any: "Ľubovoľné",
    },
    emailTypeFilter: {
      any: "Ľubovoľné",
    },
    emailRetryRange: {
      noRetries: "Bez opakovaných pokusov",
      oneToTwo: "1 až 2 opakované pokusy",
      threeToFive: "3 až 5 opakovaných pokusov",
      sixPlus: "6 a viac opakovaných pokusov",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "Čaká sa",
      syncing: "Synchronizuje sa",
      synced: "Synchronizované",
      error: "Chyba",
    },
    imapOverallSyncStatus: {
      idle: "Nečinné",
      running: "Prebieha",
      completed: "Dokončené",
      failed: "Zlyhalo",
      cancelled: "Zrušené",
    },
    imapSortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
    imapAuthMethod: {
      plain: "PLAIN",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Doručená pošta",
      sent: "Odoslané",
      drafts: "Koncepty",
      trash: "Kôš",
      junk: "Nevyžiadaná pošta",
      archive: "Archív",
    },
    imapFolderSortField: {
      name: "Názov",
      displayName: "Zobrazované meno",
      messageCount: "Počet správ",
      unseenCount: "Počet neprečítaných",
      createdAt: "Vytvorené",
    },
    imapAccountSortField: {
      name: "Názov",
      email: "E-mail",
      host: "Hostiteľ",
      enabled: "Zapnuté",
      lastSyncAt: "Posledná synchronizácia",
      createdAt: "Vytvorené",
    },
    imapConnectionStatus: {
      disconnected: "Odpojené",
      connecting: "Pripája sa",
      connected: "Pripojené",
      error: "Chyba",
      timeout: "Časový limit",
    },
    imapSyncStatusFilter: {
      all: "Všetky",
    },
    imapAccountStatusFilter: {
      all: "Všetky",
      enabled: "Zapnuté",
      disabled: "Vypnuté",
    },
    imapAccountFilter: {
      all: "Všetky",
    },
    imapMessageSortField: {
      subject: "Predmet",
      senderName: "Meno odosielateľa",
      senderEmail: "E-mail odosielateľa",
      recipientEmail: "E-mail príjemcu",
      recipientName: "Meno príjemcu",
      isRead: "Prečítané",
      isFlagged: "Označené príznakom",
      messageSize: "Veľkosť správy",
      sentAt: "Odoslané",
      createdAt: "Vytvorené",
    },
    imapMessageStatusFilter: {
      all: "Všetky",
      read: "Prečítané",
      unread: "Neprečítané",
      flagged: "Označené príznakom",
      unflagged: "Bez príznaku",
      draft: "Koncept",
      deleted: "Odstránené",
      hasAttachments: "Má prílohy",
      noAttachments: "Žiadne prílohy",
    },
    imapHealthStatus: {
      healthy: "V poriadku",
      warning: "Varovanie",
      error: "Chyba",
      maintenance: "Údržba",
    },
    imapPerformanceStatus: {
      good: "V poriadku",
      warning: "Varovanie",
      error: "Chyba",
    },
    bulkMessageAction: {
      markRead: "Označiť ako prečítané",
      markUnread: "Označiť ako neprečítané",
      flag: "Pridať príznak",
      unflag: "Odstrániť príznak",
      delete: "Odstrániť",
    },
    imapLoggingLevel: {
      error: "Chyba",
      warn: "Varovanie",
      info: "Info",
      debug: "Ladenie",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Nízka",
      normal: "Normálna",
      high: "Vysoká",
      urgent: "Naliehavé",
    },
    emailServiceStatus: {
      idle: "Nečinné",
      processing: "Spracúva sa",
      completed: "Dokončené",
      failed: "Zlyhalo",
      retrying: "Opakuje sa odosielanie",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "Čaká sa",
      sent: "Odoslané",
      delivered: "Doručené",
      failed: "Zlyhalo",
      rejected: "Zamietnuté",
      undelivered: "Nedoručené",
    },
    smsTemplateType: {
      notification: "Oznámenie",
      verification: "Overovanie",
      marketing: "Marketing",
      alert: "Upozornenie",
      reminder: "Pripomienka",
    },
  },
  errors: {
    no_email: "Chýba e-mailová adresa",
    email_generation_failed: "E-mail sa nepodarilo vygenerovať",
  },
  email: {
    errors: {
      send: {
        title: "E-mail sa nepodarilo odoslať",
      },
    },
  },
  smsService: {
    title: "Služba SMS",
    description: "Odosielanie SMS cez rôznych poskytovateľov",
    category: "Služba SMS",
    tag: "Služba SMS",
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie odosielať SMS",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup k službe SMS je zakázaný",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné údaje požiadavky na odoslanie SMS",
      },
      internal: {
        title: "Interná chyba",
        description: "Vyskytla sa interná chyba servera",
      },
      conflict: {
        title: "Konflikt údajov",
        description:
          "Požiadavka na odoslanie SMS je v rozpore s existujúcimi údajmi",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj SMS sa nenašiel",
      },
      network: {
        title: "Chyba siete",
        description: "Pri odosielaní SMS nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      invalid_phone: {
        title: "Neplatné telefónne číslo",
      },
      send: {
        title: "SMS sa nepodarilo odoslať",
      },
    },
    send: {
      title: "Odoslať SMS",
      description: "Odoslať SMS príjemcovi",
      container: {
        title: "Nastavenie SMS",
        description: "Nastaviť parametre odosielania SMS",
      },
      to: {
        label: "Telefónne číslo",
        description: "Telefónne číslo príjemcu",
        placeholder: "+1234567890",
      },
      message: {
        label: "Správa",
        description: "Text SMS",
        placeholder: "Zadajte správu…",
      },
      campaignType: {
        label: "Typ kampane",
        description: "Vyberte typ kampane pre túto SMS",
        placeholder: "Vyberte typ kampane",
      },
      leadId: {
        label: "ID kontaktu",
        description: "Identifikátor pridruženého kontaktu",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Názov šablóny",
        description: "Šablóna SMS, ktorá sa má použiť",
        placeholder: "Vybrať šablónu",
      },
      response: {
        result: {
          title: "Výsledok odoslania SMS",
          description: "Výsledok odosielania SMS",
          success: "Úspech",
          messageId: "ID správy",
          sentAt: "Odoslané",
          provider: "Poskytovateľ",
          cost: "Náklady",
        },
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné údaje požiadavky na odoslanie SMS",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Nemáte oprávnenie odosielať SMS",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup k službe SMS je zakázaný",
        },
        conflict: {
          title: "Konflikt údajov",
          description:
            "Požiadavka na odoslanie SMS je v rozpore s existujúcimi údajmi",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj SMS sa nenašiel",
        },
        network: {
          title: "Chyba siete",
          description: "Pri odosielaní SMS nastala chyba siete",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "SMS bola odoslaná",
        description: "SMS bola úspešne odoslaná",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Neplatné telefónne číslo",
      },
      send: {
        title: "SMS sa nepodarilo odoslať",
      },
    },
  },
  emailService: {
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
          sending_failed: "E-mail sa nepodarilo odoslať na {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Nepodarilo sa vygenerovať e-mail zo šablóny",
          send_failed: "Nepodarilo sa poslať e-mail",
          email_failed_subject: "E-mail sa nepodarilo odoslať",
          unknown_recipient: "Neznámy príjemca",
          unknown_sender: "Systém",
          email_render_exception: "Pri generovaní e-mailu nastala chyba",
          batch_send_failed: "Hromadné odosielanie e-mailov zlyhalo",
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
        },
        rejected: {
          title: "E-mail zamietnutý",
          defaultReason: "Server zamietol e-mail",
        },
        no_recipients: {
          title: "Server neprijal žiadnu adresu príjemcu",
          defaultReason: "Server neprijal žiadnu adresu príjemcu",
        },
        rate_limit: {
          title: "Prekročený limit frekvencie požiadaviek",
        },
        capacity: {
          title: "Nedostatočná kapacita",
        },
        no_account: {
          title: "Nie je k dispozícii žiadny účet SMTP",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Chyba servera pri ukladaní metadát e-mailu",
          description: "Metadáta e-mailu sa nepodarilo uložiť",
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
  },
  imapClient: {
    category: "Klient IMAP",
    tag: "Klient IMAP",
    tags: {
      health: "Stav prevádzky",
      monitoring: "Monitorovanie",
      sync: "Synchronizácia",
      accounts: "Účty",
      folders: "Priečinky",
      messages: "Správy",
      config: "Nastavenie",
    },
    messages: {
      tag: "Správy",
      id: {
        widget: {
          markRead: "Označiť ako prečítané",
          markUnread: "Označiť ako neprečítané",
          flag: "Pridať príznak",
          unflag: "Odstrániť príznak",
        },
      },
      errors: {
        server: { title: "Chyba servera" },
        notFound: { title: "Správa sa nenašla" },
        accountNotFound: { title: "Účet sa nenašiel" },
        syncFailed: { title: "Synchronizácia zlyhala" },
        syncSuccess: { message: "Správy boli synchronizované" },
        list: {
          get: {
            errors: {
              server: { title: "Chyba servera pri načítavaní zoznamu správ" },
            },
          },
        },
      },
    },
    sync: {
      category: "Klient IMAP",

      title: "Synchronizácia IMAP",
      description: "Služba synchronizácie IMAP",
      container: {
        title: "Nastavenie synchronizácie IMAP",
        description: "Nastaviť parametre synchronizácie IMAP",
      },
      accountIds: {
        label: "ID účtov",
        description: "ID účtov IMAP na synchronizáciu",
        placeholder: "Zadajte ID účtov oddelené čiarkami",
      },
      force: {
        label: "Vynútiť synchronizáciu",
        description: "Synchronizovať aj účty, ktoré sa nedávno synchronizovali",
      },
      dryRun: {
        label: "Skúšobné spustenie",
        description: "Spustiť skúšku bez zmeny údajov",
      },
      maxMessages: {
        label: "Maximálny počet správ",
        description:
          "Najvyšší počet správ na synchronizáciu v každom priečinku",
        placeholder: "Zadajte maximálny počet správ",
      },
      post: {
        title: "Synchronizácia",
        description: "Koncový bod synchronizácie",
        form: {
          title: "Nastavenia synchronizácie",
          description: "Nastaviť parametre synchronizácie",
        },
        response: {
          title: "Odpoveď",
          description: "Údaje v odpovedi synchronizácie",
          result: {
            title: "Výsledky synchronizácie",
            description: "Podrobné výsledky synchronizácie",
            accountsProcessed: "Spracované účty",
            foldersProcessed: "Spracované priečinky",
            messagesProcessed: "Spracované správy",
            messagesAdded: "Pridané správy",
            messagesUpdated: "Aktualizované správy",
            messagesDeleted: "Odstránené správy",
            duration: "Trvanie",
          },
          errors: {
            error: {
              title: "Chyba synchronizácie",
              description: "Podrobnosti o chybe",
              code: "Kód chyby",
              message: "Chybové hlásenie",
            },
          },
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
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
      },
      success: {
        title: "Úspech",
        description: "Operácia prebehla úspešne",
      },
      widget: {
        title: "Úplná synchronizácia IMAP",
        options: "Možnosti synchronizácie",
        noAccounts: "Žiadne nastavené účty IMAP",
        result: "Výsledok synchronizácie",
        duration: "Trvanie",
        errors: "Chyby",
        accountsProcessed: "Spracované účty",
        foldersProcessed: "Spracované priečinky",
        messagesProcessed: "Spracované správy",
        messagesAdded: "Pridané správy",
        messagesUpdated: "Aktualizované správy",
        messagesDeleted: "Odstránené správy",
        submit: "Spustiť synchronizáciu",
        submitting: "Synchronizuje sa…",
      },
    },
    imapErrors: {
      accounts: {
        post: {
          error: {
            duplicate: {
              title: "Účet už existuje",
            },
            server: {
              title: "Chyba servera pri vytváraní účtu",
            },
          },
        },
        get: {
          error: {
            not_found: {
              title: "Účet sa nenašiel",
            },
            server: {
              title: "Chyba servera pri načítavaní účtu",
            },
          },
        },
        put: {
          error: {
            not_found: {
              title: "Účet sa nenašiel",
            },
            duplicate: {
              title: "Účet s touto e-mailovou adresou už existuje",
            },
            server: {
              title: "Chyba servera pri aktualizácii účtu",
            },
          },
        },
        delete: {
          error: {
            not_found: {
              title: "Účet sa nenašiel",
            },
            server: {
              title: "Chyba servera pri odstraňovaní účtu",
            },
          },
          success: {
            title: "Účet bol odstránený",
          },
        },
      },
      folders: {
        get: {
          error: {
            not_found: {
              title: "Priečinok sa nenašiel",
            },
            server: {
              title: "Chyba servera pri načítavaní priečinka",
            },
          },
        },
        sync: {
          error: {
            missing_account: {
              title: "Účet na synchronizáciu priečinkov sa nenašiel",
            },
          },
        },
      },
      messages: {
        get: {
          error: {
            not_found: {
              title: "Správa sa nenašla",
            },
            server: {
              title: "Chyba servera pri načítavaní správy",
            },
          },
        },
      },
      connection: {
        failed: "Spojenie zlyhalo",
        timeout: {
          title: "Vypršal časový limit pripojenia",
        },
        test: {
          failed: "Test pripojenia zlyhal",
        },
        close: {
          failed: "Pripojenie sa nepodarilo zavrieť",
        },
        folders: {
          list: {
            failed: "Nepodarilo sa načítať zoznam priečinkov",
          },
        },
        messages: {
          list: {
            failed: "Nepodarilo sa načítať zoznam správ",
          },
        },
      },
      sync: {
        failed: "Synchronizácia zlyhala",
        account: {
          failed: "Synchronizácia účtu zlyhala",
        },
        folder: {
          failed: "Synchronizácia priečinka zlyhala",
        },
        message: {
          failed: "Synchronizácia správy zlyhala",
        },
        post: {
          error: {
            server: {
              title: "Chyba servera počas synchronizácie",
            },
          },
        },
      },
      validation: {
        account: {
          username: {
            required: "Používateľské meno je povinné",
          },
          port: {
            invalid: "Neplatné číslo portu",
          },
          host: {
            invalid: "Neplatný názov hostiteľa",
          },
        },
      },
    },
    imap: {
      "example.com": "imap.example.com",
      "gmail.com": "imap.gmail.com",
      connection: {
        test: {
          success: "Test pripojenia prebehol úspešne",
          failed: "Test pripojenia zlyhal",
          timeout: "Vypršal časový limit testu pripojenia",
        },
      },
      sync: {
        messages: {
          accounts: {
            success: "Všetky účty boli synchronizované",
            successWithErrors: "Účty synchronizované s chybami",
          },
          account: {
            success: "Účet bol synchronizovaný",
            successWithErrors: "Účet sa synchronizoval s chybami",
          },
          folders: {
            success: "Priečinky boli synchronizované",
            successWithErrors: "Priečinky synchronizované s chybami",
          },
          messages: {
            success: "Správy boli synchronizované",
            successWithErrors: "Správy synchronizované s chybami",
          },
        },
        errors: {
          default: "Synchronizácia IMAP zlyhala",
          account_failed: "Synchronizácia účtu zlyhala",
          folder_sync_failed: "Synchronizácia priečinka zlyhala",
          message_sync_error: "Chyba synchronizácie správ",
          message_sync_failed: "Synchronizácia správy zlyhala",
        },
      },
    },
    enums: {
      loggingLevel: {
        error: "Chyba",
        warn: "Varovanie",
        info: "Info",
        debug: "Ladenie",
      },
      syncStatus: {
        pending: "Čaká sa",
        syncing: "Synchronizuje sa",
        synced: "Synchronizované",
        error: "Chyba",
      },
      overallSyncStatus: {
        idle: "Nečinné",
        running: "Prebieha",
        completed: "Dokončené",
        failed: "Zlyhalo",
        cancelled: "Zrušené",
      },
      sortOrder: {
        asc: "Vzostupne",
        desc: "Zostupne",
      },
      authMethod: {
        plain: "PLAIN",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      imapAuthMethod: {
        plain: "PLAIN",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      specialUseType: {
        inbox: "Doručená pošta",
        sent: "Odoslané",
        drafts: "Koncepty",
        trash: "Kôš",
        junk: "Nevyžiadaná pošta",
        archive: "Archív",
      },
      folderSortField: {
        name: "Názov",
        displayName: "Zobrazované meno",
        messageCount: "Počet správ",
        unseenCount: "Počet neprečítaných",
        createdAt: "Vytvorené",
      },
      accountSortField: {
        name: "Názov",
        email: "E-mail",
        host: "Hostiteľ",
        enabled: "Zapnuté",
        lastSyncAt: "Posledná synchronizácia",
        createdAt: "Vytvorené",
      },
      connectionStatus: {
        disconnected: "Odpojené",
        connecting: "Pripája sa",
        connected: "Pripojené",
        error: "Chyba",
        timeout: "Časový limit",
      },
      syncStatusFilter: {
        all: "Všetky stavy synchronizácie",
      },
      accountStatusFilter: {
        all: "Všetky stavy účtov",
        enabled: "Zapnuté",
        disabled: "Vypnuté",
      },
      accountFilter: {
        all: "Všetky účty",
      },
      messageSortField: {
        subject: "Predmet",
        senderName: "Meno odosielateľa",
        senderEmail: "E-mail odosielateľa",
        recipientEmail: "E-mail príjemcu",
        recipientName: "Meno príjemcu",
        isRead: "Stav prečítania",
        isFlagged: "Označené príznakom",
        messageSize: "Veľkosť správy",
        sentAt: "Odoslané",
        createdAt: "Vytvorené",
      },
      messageStatusFilter: {
        all: "Všetky správy",
        read: "Prečítané",
        unread: "Neprečítané",
        flagged: "Označené príznakom",
        unflagged: "Bez príznaku",
        draft: "Koncept",
        deleted: "Odstránené",
        hasAttachments: "Má prílohy",
        noAttachments: "Žiadne prílohy",
      },
      healthStatus: {
        healthy: "V poriadku",
        warning: "Varovanie",
        error: "Chyba",
        maintenance: "Údržba",
      },
      performanceStatus: {
        good: "V poriadku",
        warning: "Varovanie",
        error: "Chyba",
      },
    },
  },
  messages: {
    category: "E-mailové správy",
    tag: "Správy",
    tags: {
      stats: "Štatistiky",
      analytics: "Analytika",
    },
    id: {
      category: "E-maily",
      tags: {
        emails: "E-maily",
      },
      title: "Podrobnosti o e-maile",
      description: "Načítať jeden e-mail podľa jeho jedinečného ID",
      container: {
        title: "Podrobnosti o e-maile",
        description: "Zobraziť podrobné informácie o konkrétnom e-maile",
      },
      fields: {
        id: {
          label: "ID e-mailu",
          description: "Jedinečné ID e-mailu, ktorý sa má načítať",
        },
      },
      response: {
        email: {
          title: "Podrobnosti o e-maile",
          description: "Úplné údaje o požadovanom e-maile",
          id: "ID e-mailu",
          subject: "Predmet",
          recipientEmail: "E-mail príjemcu",
          recipientName: "Meno príjemcu",
          senderEmail: "E-mail odosielateľa",
          senderName: "Meno odosielateľa",
          type: "Typ e-mailu",
          status: "Stav",
          templateName: "Názov šablóny",
          emailProvider: "Poskytovateľ e-mailov",
          externalId: "Externé ID",
          sentAt: "Odoslané",
          deliveredAt: "Doručené",
          openedAt: "Otvorené",
          clickedAt: "Kliknutie na odkaz",
          retryCount: "Počet opakovaných pokusov",
          error: "Chybové hlásenie",
          userId: "ID používateľa",
          leadId: "ID kontaktu",
          createdAt: "Vytvorené",
          updatedAt: "Aktualizované",
        },
      },
      get: {
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Zadané ID e-mailu je neplatné",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Ak chcete zobraziť podrobnosti e-mailu, prihláste sa",
          },
          not_found: {
            title: "E-mail sa nenašiel",
            description: "E-mail so zadaným ID sa nenašiel",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáte oprávnenie zobraziť tento e-mail",
          },
          server: {
            title: "Chyba servera",
            description: "Pri načítavaní e-mailu nastala interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
        },
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Zadané ID e-mailu je neplatné",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zobraziť podrobnosti e-mailu, prihláste sa",
        },
        notFound: {
          title: "E-mail sa nenašiel",
          description: "E-mail so zadaným ID sa nenašiel",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie zobraziť tento e-mail",
        },
        server: {
          title: "Chyba servera",
          description: "Pri načítavaní e-mailu nastala interná chyba servera",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Pri spracovaní požiadavky na e-mail nastal konflikt",
        },
        network: {
          title: "Chyba siete",
          description: "Pri načítavaní e-mailu nastala chyba siete",
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
        title: "E-mail načítaný",
        description: "Podrobnosti e-mailu boli načítané",
      },
      widget: {
        parties: "Odosielateľ a príjemca",
        to: "Komu",
        from: "Od",
        timestamps: "Dátumy a časy",
        sentAt: "Odoslané",
        deliveredAt: "Doručené",
        openedAt: "Otvorené",
        clickedAt: "Kliknutie na odkaz",
        technical: "Technické údaje",
        template: "Šablóna",
        provider: "Poskytovateľ",
        externalId: "Externé ID",
        retryCount: "Počet opakovaných pokusov",
        error: "Chyba",
        associations: "Prepojenia",
        lead: "Kontakt",
        user: "Používateľ",
        notFound: "E-mail sa nenašiel",
      },
      enums: {
        status: {
          pending: "Čaká sa",
          sent: "Odoslané",
          delivered: "Doručené",
          opened: "Otvorené",
          clicked: "S kliknutím na odkaz",
          bounced: "Vrátené",
          failed: "Zlyhalo",
          unsubscribed: "Odber zrušený",
        },
        type: {
          transactional: "Transakčné",
          marketing: "Marketing",
          notification: "Oznámenie",
          system: "Systém",
          leadCampaign: "Kampaň pre kontakty",
          userCommunication: "Komunikácia s používateľmi",
        },
        provider: {
          resend: "Resend",
          sendgrid: "SendGrid",
          mailgun: "Mailgun",
          ses: "Amazon SES",
          smtp: "SMTP",
          mailjet: "Mailjet",
          postmark: "Postmark",
          other: "Iné",
        },
      },
    },
    list: {
      category: "E-maily",
      tags: {
        emails: "E-maily",
      },
      title: "Zoznam e-mailov",
      description:
        "Načíta zoznam e-mailov s filtrami po jednotlivých stránkach",
      container: {
        title: "Zoznam e-mailov",
        description: "Nastaviť parametre zoznamu e-mailov a zobraziť výsledky",
      },
      filters: {
        title: "Filtre",
        description: "Filtrovať a vyhľadávať e-maily",
      },
      displayOptions: {
        title: "Možnosti zobrazenia",
      },
      fields: {
        dateRange: {
          title: "Rozsah dátumov",
        },
        page: {
          label: "Stránka",
          description: "Číslo stránky výsledkov",
          placeholder: "Zadajte číslo stránky",
        },
        limit: {
          label: "Limit",
          description: "Počet položiek na stránku",
          placeholder: "Zadajte limit",
        },
        search: {
          label: "Hľadať",
          description:
            "Vyhľadávanie e-mailov podľa predmetu, príjemcu alebo odosielateľa",
          placeholder: "Hľadať e-maily…",
        },
        status: {
          label: "Stav",
          description: "Filtrovať podľa stavu e-mailu",
          placeholder: "Vybrať stav",
        },
        channel: {
          label: "Kanál",
          description: "Filtrovať podľa kanála",
        },
        type: {
          label: "Typ",
          description: "Filtrovať podľa typu e-mailu",
          placeholder: "Vybrať typ",
        },
        sortBy: {
          label: "Zoradiť podľa",
          description: "Pole použité na zoradenie",
          placeholder: "Vybrať pole na zoradenie",
        },
        sortOrder: {
          label: "Poradie",
          description: "Poradie zoradenia",
          placeholder: "Vybrať poradie",
        },
        dateFrom: {
          label: "Dátum od",
          description: "Zobraziť e-maily od tohto dátumu",
          placeholder: "Vyberte dátum začiatku",
        },
        dateTo: {
          label: "Dátum do",
          description: "Zobraziť e-maily do tohto dátumu",
          placeholder: "Vybrať dátum konca",
        },
      },
      response: {
        emails: {
          title: "E-maily",
          emptyState: {
            title: "Nenašli sa žiadne e-maily",
            description: "Žiadne e-maily nezodpovedajú aktuálnym filtrom",
          },
          item: {
            title: "E-mail",
            description: "Podrobnosti o e-maile",
            id: "ID",
            subject: "Predmet",
            recipientEmail: "E-mail príjemcu",
            recipientName: "Meno príjemcu",
            senderEmail: "E-mail odosielateľa",
            senderName: "Meno odosielateľa",
            type: "Typ",
            status: "Stav",
            templateName: "Názov šablóny",
            emailProvider: "Poskytovateľ e-mailov",
            externalId: "Externé ID",
            sentAt: "Odoslané",
            deliveredAt: "Doručené",
            openedAt: "Otvorené",
            clickedAt: "Kliknutie na odkaz",
            retryCount: "Počet opakovaných pokusov",
            error: "Chyba",
            userId: "ID používateľa",
            leadId: "ID kontaktu",
            createdAt: "Vytvorené",
            updatedAt: "Aktualizované",
            emailCore: {
              title: "Základné informácie",
            },
            emailParties: {
              title: "Odosielateľ a príjemca",
            },
            emailMetadata: {
              title: "Metadáta",
            },
            emailEngagement: {
              title: "Sledovanie interakcií",
            },
            technicalDetails: {
              title: "Technické údaje",
            },
            associatedIds: {
              title: "Súvisiace ID",
            },
            timestamps: {
              title: "Dátumy a časy",
            },
          },
        },
        pagination: {
          title: "Stránkovanie",
          description: "Údaje o stránkovaní",
          page: "Aktuálna stránka",
          limit: "Položky na stránku",
          total: "Celkový počet položiek",
          totalPages: "Celkový počet stránok",
        },
        filters: {
          title: "Použité filtre",
          description: "Práve použité filtre",
          status: "Filter podľa stavu",
          type: "Filter podľa typu",
          search: "Vyhľadávací dopyt",
          dateFrom: "Dátum začiatku",
          dateTo: "Dátum ukončenia",
        },
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Zadané parametre sú neplatné",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na prístup k tomuto zdroju sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie pristupovať k tomuto zdroju",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Požadovaný zdroj sa nenašiel",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Požiadavka je v rozpore s aktuálnym stavom",
        },
        network: {
          title: "Chyba siete",
          description: "Nastala chyba siete",
        },
      },
      success: {
        title: "Úspech",
        description: "E-maily boli načítané",
      },
      widget: {
        to: "Komu",
        retries: "Opakované pokusy",
        opened: "Otvorené",
        clicked: "S kliknutím na odkaz",
        stats: "Štatistiky",
        graphs: "Grafy",
        refresh: "Obnoviť",
        searchPlaceholder: "Hľadať e-maily…",
        clearSearch: "Vymazať",
        emptyState: "Nenašli sa žiadne e-maily",
        emptyFiltered: "Žiadne e-maily nezodpovedajú filtrom",
        page: "Stránka",
        tabs: {
          all: "Všetky",
          sent: "Odoslané",
          delivered: "Doručené",
          opened: "Otvorené",
          failed: "Zlyhalo",
          bounced: "Vrátené",
        },
      },
      enums: {
        type: {
          transactional: "Transakčné",
          marketing: "Marketing",
          notification: "Oznámenie",
          system: "Systém",
          leadCampaign: "Kampaň pre kontakty",
          userCommunication: "Komunikácia s používateľmi",
        },
        typeFilter: {
          any: "Všetky typy",
        },
        channel: {
          email: "E-mail",
          sms: "SMS",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
        },
        channelFilter: {
          any: "Všetky kanály",
        },
        sortField: {
          subject: "Predmet",
          recipientEmail: "E-mail príjemcu",
          recipientName: "Meno príjemcu",
          type: "Typ",
          status: "Stav",
          sentAt: "Odoslané",
          createdAt: "Vytvorené",
        },
        sortOrder: {
          asc: "Vzostupne",
          desc: "Zostupne",
        },
      },
    },
    stats: {
      category: "E-maily",
      tags: {
        stats: "Štatistiky",
        analytics: "Analytika",
      },
      dateRange: {
        today: "Dnes",
        yesterday: "Včera",
        last7Days: "Posledných 7 dní",
        last30Days: "Posledných 30 dní",
        last90Days: "Posledných 90 dní",
        thisWeek: "Tento týždeň",
        lastWeek: "Minulý týždeň",
        thisMonth: "Tento mesiac",
        lastMonth: "Minulý mesiac",
        thisQuarter: "Tento štvrťrok",
        lastQuarter: "Minulý štvrťrok",
        thisYear: "Tento rok",
        lastYear: "Minulý rok",
        custom: "Vlastný rozsah",
      },
      get: {
        title: "Štatistiky e-mailov",
        description: "Zobraziť podrobné štatistiky a metriky e-mailov",
        form: {
          title: "Požiadavka na štatistiky e-mailov",
          description: "Parametre požiadavky na štatistiky e-mailov",
        },
        startDate: {
          label: "Dátum začiatku",
          description: "Dátum začiatku štatistického obdobia",
        },
        endDate: {
          label: "Dátum ukončenia",
          description: "Dátum konca štatistického obdobia",
        },
        accountId: {
          label: "ID účtu",
          description: "Filtrovať štatistiky podľa účtu",
        },
        type: {
          label: "Typ e-mailu",
          description: "Filtrovať podľa typu e-mailu",
          options: {
            all: "Všetky",
            sent: "Odoslané",
            received: "Prijaté",
            draft: "Koncept",
            trash: "Kôš",
          },
        },
        groupBy: {
          label: "Zoskupiť podľa",
          description: "Spôsob zoskupenia štatistík",
          options: {
            day: "Podľa dňa",
            week: "Podľa týždňa",
            month: "Podľa mesiaca",
            account: "Podľa účtu",
            type: "Podľa typu",
          },
        },
        includeDetails: {
          label: "Zahrnúť podrobnosti",
          description: "Zahrnúť podrobné členenie výsledkov",
        },
        status: {
          label: "Stav e-mailu",
          description: "Filtrovať podľa stavu e-mailu",
        },
        search: {
          label: "Hľadať",
          description: "Vyhľadávanie e-mailov podľa predmetu alebo príjemcu",
        },
        timePeriod: {
          label: "Časové obdobie",
          description: "Časový interval zoskupenia historických údajov",
          hour: "Hodina",
          day: "Deň",
          week: "Týždeň",
          month: "Mesiac",
          quarter: "Štvrťrok",
          year: "Rok",
        },
        dateRangePreset: {
          label: "Predvolený rozsah dátumov",
          description: "Predvolený rozsah dátumov na filtrovanie",
        },
        dateFrom: {
          label: "Dátum začiatku",
          description: "Zobraziť e-maily od tohto dátumu",
        },
        dateTo: {
          label: "Dátum ukončenia",
          description: "Zobraziť e-maily do tohto dátumu",
        },
        chartType: {
          label: "Typ grafu",
          description: "Spôsob zobrazenia údajov v grafoch",
          line: "Čiarový graf",
          bar: "Stĺpcový graf",
          area: "Plošný graf",
          pie: "Koláčový graf",
          donut: "Prstencový graf",
        },
        includeComparison: {
          label: "Zahrnúť porovnanie",
          description: "Zahrnúť porovnanie s predchádzajúcim obdobím",
        },
        sortBy: {
          label: "Zoradiť podľa",
          description: "Pole, podľa ktorého sa e-maily zoradia",
        },
        sortOrder: {
          label: "Poradie",
          description: "Poradie zoradenia (vzostupne alebo zostupne)",
        },
        response: {
          title: "Výsledky štatistík e-mailov",
          description: "Podrobné štatistiky a metriky e-mailov",
          totalEmails: "Celkový počet e-mailov",
          sentEmails: "Odoslané e-maily",
          deliveredEmails: "Doručené e-maily",
          openedEmails: "Otvorené e-maily",
          clickedEmails: "E-maily s kliknutím na odkaz",
          bouncedEmails: "Vrátené e-maily",
          failedEmails: "E-maily, ktoré sa nepodarilo odoslať",
          draftEmails: "Koncepty e-mailov",
          openRate: "Miera otvorenia e-mailov",
          clickRate: "Miera kliknutí na odkazy",
          deliveryRate: "Miera doručenia",
          bounceRate: "Miera vrátenia e-mailov",
          failureRate: "Miera zlyhania",
          emailsByProvider: "E-maily podľa poskytovateľa",
          emailsByTemplate: "E-maily podľa šablóny",
          emailsByStatus: "E-maily podľa stavu",
          emailsByType: "E-maily podľa typu",
          emailsWithUserId: "E-maily s ID používateľa",
          emailsWithoutUserId: "E-maily bez ID používateľa",
          emailsWithLeadId: "E-maily s ID kontaktu",
          emailsWithoutLeadId: "E-maily bez ID kontaktu",
          emailsWithErrors: "E-maily s chybami",
          emailsWithoutErrors: "E-maily bez chýb",
          averageRetryCount: "Priemerný počet opakovaných pokusov",
          maxRetryCount: "Najvyšší počet opakovaných pokusov",
          averageProcessingTime: "Priemerný čas spracovania",
          averageDeliveryTime: "Priemerný čas doručenia",
          historicalData: "Historické údaje",
          groupedStats: "Zoskupené štatistiky",
          generatedAt: "Vygenerované",
          dataRange: "Rozsah údajov",
          recentActivity: "Nedávna činnosť",
          topPerformingTemplates: "Najúčinnejšie šablóny",
          topPerformingProviders: "Poskytovatelia s najlepšími výsledkami",
          metrics: {
            totalEmails: "Celkový počet e-mailov",
            sentEmails: "Odoslané e-maily",
            deliveredEmails: "Doručené e-maily",
            openedEmails: "Otvorené e-maily",
            clickedEmails: "E-maily s kliknutím na odkaz",
            bouncedEmails: "Vrátené e-maily",
            failedEmails: "E-maily, ktoré sa nepodarilo odoslať",
            deliveryRate: "Miera doručenia",
            openRate: "Miera otvorenia e-mailov",
            clickRate: "Miera kliknutí na odkazy",
            bounceRate: "Miera vrátenia e-mailov",
            failureRate: "Miera zlyhania",
            emails_with_errors: "E-maily s chybami",
            average_retry_count: "Priemerný počet opakovaných pokusov",
            average_processing_time: "Priemerný čas spracovania (ms)",
            average_delivery_time: "Priemerný čas doručenia (ms)",
            provider_historical: "Historické údaje podľa poskytovateľa",
            template_historical: "Historické údaje podľa šablóny",
            engagement_historical: "Historické údaje o interakciách",
          },
          retry: {
            no_retries: "Bez opakovaných pokusov",
            with_retries: "S opakovanými pokusmi",
          },
          association: {
            with_user: "S priradeným používateľom",
            with_lead: "S priradeným kontaktom",
            with_both: "S kontaktom aj používateľom",
            with_neither: "Bez kontaktu a používateľa",
          },
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na zobrazenie štatistík e-mailov sa prihláste",
          },
          validation: {
            title: "Neplatné údaje",
            description: "Zadané parametre požiadavky sú neplatné",
          },
          server: {
            title: "Chyba servera",
            description:
              "Pri načítavaní štatistík nastala interná chyba servera",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Pri načítavaní štatistík nastala chyba siete",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup k štatistikám e-mailov je zakázaný",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Štatistiky e-mailov sa nenašli",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Najprv uložte rozpracované zmeny",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Pri načítavaní štatistík nastal konflikt údajov",
          },
        },
        success: {
          title: "Úspech",
          description: "Štatistiky e-mailov boli načítané",
        },
      },
      widget: {
        title: "Štatistiky e-mailov",
        total: "Spolu",
        sent: "Odoslané",
        delivered: "Doručené",
        opened: "Otvorené",
        clicked: "S kliknutím na odkaz",
        bounced: "Vrátené",
        failed: "Zlyhalo",
        errors: "Chyby",
        engagementRates: "Miery interakcií",
        deliveryRate: "Miera doručenia",
        openRate: "Miera otvorenia e-mailov",
        clickRate: "Miera kliknutí na odkazy",
        bounceRate: "Miera vrátenia e-mailov",
        failureRate: "Miera zlyhania",
        byStatus: "Podľa stavu",
        byType: "Podľa typu",
        avgRetries: "Priemerný počet opakovaných pokusov",
        avgDeliveryMs: "Priemerný čas doručenia",
        viewList: "Zobraziť zoznam",
        refresh: "Obnoviť",
        search: "Hľadať e-maily…",
      },
      enums: {
        status: {
          pending: "Čaká sa",
          sent: "Odoslané",
          delivered: "Doručené",
          opened: "Otvorené",
          clicked: "S kliknutím na odkaz",
          bounced: "Vrátené",
          failed: "Zlyhalo",
          unsubscribed: "Odber zrušený",
        },
        statusFilter: {
          any: "Všetky stavy",
        },
        type: {
          transactional: "Transakčné",
          marketing: "Marketing",
          notification: "Oznámenie",
          system: "Systém",
          leadCampaign: "Kampaň pre kontakty",
          userCommunication: "Komunikácia s používateľmi",
        },
        typeFilter: {
          any: "Všetky typy",
        },
        sortField: {
          subject: "Predmet",
          recipientEmail: "E-mail príjemcu",
          recipientName: "Meno príjemcu",
          type: "Typ",
          status: "Stav",
          sentAt: "Odoslané",
          createdAt: "Vytvorené",
        },
        sortOrder: {
          asc: "Vzostupne",
          desc: "Zostupne",
        },
      },
    },
    enums: {
      status: {
        pending: "Čaká sa",
        sent: "Odoslané",
        delivered: "Doručené",
        opened: "Otvorené",
        clicked: "S kliknutím na odkaz",
        bounced: "Vrátené",
        failed: "Zlyhalo",
        unsubscribed: "Odber zrušený",
      },
      statusFilter: {
        any: "Všetky stavy",
      },
      type: {
        transactional: "Transakčné",
        marketing: "Marketing",
        notification: "Oznámenie",
        system: "Systém",
        leadCampaign: "Kampaň pre kontakty",
        userCommunication: "Komunikácia s používateľmi",
      },
      typeFilter: {
        any: "Všetky typy",
      },
      provider: {
        resend: "Resend",
        sendgrid: "SendGrid",
        mailgun: "Mailgun",
        ses: "Amazon SES",
        smtp: "SMTP",
        mailjet: "Mailjet",
        postmark: "Postmark",
        other: "Iné",
      },
      sortField: {
        subject: "Predmet",
        recipientEmail: "E-mail príjemcu",
        recipientName: "Meno príjemcu",
        type: "Typ",
        status: "Stav",
        sentAt: "Odoslané",
        createdAt: "Vytvorené",
      },
      retryRange: {
        noRetries: "Bez opakovaných pokusov",
        oneToTwo: "1 až 2 opakované pokusy",
        threeToFive: "3 až 5 opakovaných pokusov",
        sixPlus: "6 a viac opakovaných pokusov",
      },
      syncStatus: {
        pending: "Čaká na synchronizáciu",
        syncing: "Synchronizuje sa",
        synced: "Synchronizované",
        failed: "Synchronizácia zlyhala",
      },
      specialFolder: {
        inbox: "Doručená pošta",
        sent: "Odoslané",
        drafts: "Koncepty",
        trash: "Kôš",
        spam: "Spam",
        archive: "Archív",
      },
      sortOrder: {
        asc: "Vzostupne",
        desc: "Zostupne",
      },
    },
  },
  send: {
    title: "Odoslať správu",
    description:
      "Odošle správu cez vybraný kanál (e-mail, SMS, WhatsApp alebo Telegram)",
    category: "Správy",
    tag: "Poslať",

    container: {
      title: "Odoslať správu",
      description: "Odoslať správu cez nastavený účet",
    },

    accountId: {
      label: "Účet na odosielanie správ",
      description: "Účet, z ktorého sa správa odošle",
      placeholder: "Vyberte UUID účtu",
    },
    to: {
      label: "Príjemca",
      description: "E-mailová adresa, telefónne číslo alebo ID četu",
      placeholder: "user@example.com alebo +12025551234",
    },
    toName: {
      label: "Meno príjemcu",
      description: "Zobrazované meno príjemcu (nepovinné)",
      placeholder: "John Doe",
    },
    subject: {
      label: "Predmet",
      description: "Nepovinný predmet e-mailu. Ostatné kanály ho nepoužívajú.",
      placeholder: "Zadajte predmet…",
    },
    text: {
      label: "Správa",
      description:
        "Neformátovaný text pre SMS, WhatsApp a Telegram. Pri e-maile slúži ako alternatíva k obsahu HTML.",
      placeholder: "Zadajte správu…",
    },
    html: {
      label: "Obsah HTML",
      description:
        "Obsah HTML len pre e-mail. Ak ho nevyplníte, použije sa obyčajný text.",
      placeholder: "<p>Zadajte obsah e-mailu v HTML…</p>",
    },
    senderName: {
      label: "Meno odosielateľa",
      description: "Zobrazované meno odosielateľa e-mailu (nepovinné)",
      placeholder: "Vaša spoločnosť",
    },
    replyTo: {
      label: "Adresa na odpoveď",
      description: "E-mailová adresa pre odpovede (nepovinná)",
      placeholder: "support@example.com",
    },
    leadId: {
      label: "ID kontaktu",
      description: "Pridružený kontakt na sledovanie (nepovinné)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "ID kampane",
      description: "Pridružená kampaň na sledovanie (nepovinné)",
      placeholder: "UUID",
    },

    response: {
      title: "Výsledok odoslania",
      description: "Výsledok odoslania správy",
      messageId: { label: "ID správy" },
      accountName: { label: "Účet" },
      channel: { label: "Kanál" },
      provider: { label: "Poskytovateľ" },
      sentAt: { label: "Odoslané" },
    },

    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie odosielať správy",
      },
      server: {
        title: "Chyba servera",
        description: "Pri odosielaní nastala chyba interného servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup k tomuto zdroju je zakázaný",
      },
      network: {
        title: "Chyba siete",
        description: "Pri odosielaní nastala sieťová chyba",
      },
      notFound: {
        title: "Účet sa nenašiel",
        description: "Zadaný účet na odosielanie správ sa nenašiel",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Požiadavka je v rozpore s existujúcimi údajmi",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },

    success: {
      title: "Správa odoslaná",
      description: "Správa bola odoslaná",
    },
  },
  smtpClient: {
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
          sending_failed: "E-mail sa nepodarilo odoslať na {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Nepodarilo sa vygenerovať e-mail zo šablóny",
          send_failed: "Nepodarilo sa poslať e-mail",
          email_failed_subject: "E-mail sa nepodarilo odoslať",
          unknown_recipient: "Neznámy príjemca",
          unknown_sender: "Systém",
          email_render_exception: "Pri generovaní e-mailu nastala chyba",
          batch_send_failed: "Hromadné odosielanie e-mailov zlyhalo",
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
        },
        rejected: {
          title: "E-mail zamietnutý",
          defaultReason: "Server zamietol e-mail",
        },
        no_recipients: {
          title: "Server neprijal žiadnu adresu príjemcu",
          defaultReason: "Server neprijal žiadnu adresu príjemcu",
        },
        rate_limit: {
          title: "Prekročený limit frekvencie požiadaviek",
        },
        capacity: {
          title: "Nedostatočná kapacita",
        },
        no_account: {
          title: "Nie je k dispozícii žiadny účet SMTP",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Chyba servera pri ukladaní metadát e-mailu",
          description: "Metadáta e-mailu sa nepodarilo uložiť",
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
  },

  // Core emails level translations
  tag: "E-maily",
  tags: {
    stats: "Štatistiky",
    analytics: "Analytika",
  },
  error: {
    default: "Nastala chyba",
  },
  template: {
    tagline: "AI bez obsahových obmedzení",
  },
  footer: {
    visitWebsite: "Otvoriť web",
    allRightsReserved: "Všetky práva vyhradené",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "E-mail o hromadnej aktualizácii kontaktov",
            description: "E-mail odoslaný pri hromadnej aktualizácii kontaktov",
          },
          preview: {
            totalMatched: "Počet zodpovedajúcich kontaktov",
            totalMatched_description:
              "Počet kontaktov, ktoré zodpovedajú filtru",
            totalProcessed: "Počet spracovaných kontaktov",
            totalProcessed_description: "Počet spracovaných kontaktov",
            totalUpdated: "Počet aktualizovaných kontaktov",
            totalUpdated_description: "Počet úspešne aktualizovaných kontaktov",
            errorsCount: "Počet chýb",
            errorsCount_description: "Počet chýb počas spracovania",
            dryRun: "Skúšobné spustenie",
            dryRun_description: "Zobraziť len náhľad bez zmeny údajov",
            userId: "ID používateľa",
            userId_description: "ID používateľa, ktorý operáciu spustil",
          },
        },
      },
      welcome: {
        meta: {
          name: "Uvítací e-mail pre nový kontakt",
          description: "Uvítací e-mail odoslaný novým kontaktom",
        },
        preview: {
          leadId: "ID kontaktu",
          leadId_description: "Jedinečné ID kontaktu",
          businessName: "Názov firmy",
          businessName_description: "Názov firmy (nepovinné)",
          email: "E-mail",
          email_description: "E-mailová adresa kontaktu",
          userId: "ID používateľa",
          userId_description: "ID pridruženého používateľa (nepovinné)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Správa z kontaktného formulára",
          description: "E-mail odoslaný po odoslaní kontaktného formulára",
        },
        preview: {
          name: "Názov",
          name_description: "Meno kontaktu",
          email: "E-mail",
          email_description: "E-mailová adresa kontaktu",
          company: "Firma",
          company_description: "Názov spoločnosti (nepovinné)",
          subject: "Predmet",
          subject_description: "Predmet správy",
          message: "Správa",
          message_description: "Obsah správy",
          isForCompany: "Pre firemný účet",
          isForCompany_description: "Určuje, či je e-mail určený tímu firmy",
          userId: "ID používateľa",
          userId_description: "ID pridruženého používateľa (nepovinné)",
          leadId: "ID kontaktu",
          leadId_description: "ID pridruženého kontaktu (nepovinné)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Potvrdenie zrušenia odberu newslettera",
          description: "Potvrdzovací e-mail pri zrušení odberu newslettera",
        },
        preview: {
          email: "E-mail",
          email_description: "E-mailová adresa, pre ktorú sa odber ruší",
        },
      },
      welcome: {
        meta: {
          name: "Uvítací e-mail k newsletteru",
          description: "Uvítací e-mail pre nových odberateľov newslettera",
        },
        preview: {
          email: "E-mail",
          email_description: "E-mailová adresa odberateľa",
          name: "Názov",
          name_description: "Meno odberateľa (nepovinné)",
          leadId: "ID kontaktu",
          leadId_description: "ID pridruženého kontaktu (nepovinné)",
          userId: "ID používateľa",
          userId_description: "ID pridruženého používateľa (nepovinné)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Potvrdenie obnovy hesla",
            description: "Potvrdzovací e-mail po obnovení hesla",
          },
          preview: {
            publicName: "Verejné meno",
            publicName_description: "Verejné meno používateľa",
            userId: "ID používateľa",
            userId_description: "Jedinečné ID používateľa",
          },
        },
        request: {
          meta: {
            name: "Žiadosť o obnovu hesla",
            description: "E-mail s odkazom na obnovu hesla",
          },
          preview: {
            publicName: "Verejné meno",
            publicName_description: "Verejné meno používateľa",
            userId: "ID používateľa",
            userId_description: "Jedinečné ID používateľa",
            passwordResetUrl: "URL na obnovu hesla",
            passwordResetUrl_description: "URL na obnovu hesla",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "Privítanie po registrácii",
          description: "Uvítací e-mail pre nových používateľov po registrácii",
        },
        preview: {
          privateName: "Súkromné meno",
          privateName_description: "Súkromné meno používateľa",
          userId: "ID používateľa",
          userId_description: "Jedinečné ID používateľa",
          leadId: "ID kontaktu",
          leadId_description: "ID pridruženého kontaktu",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "Uvítací e-mail pre používateľa",
          description: "Uvítací e-mail zaslaný novým používateľom",
        },
        preview: {
          userId: "ID používateľa",
          userId_description: "Jedinečné ID používateľa",
          email: "E-mail",
          email_description: "E-mailová adresa používateľa",
          privateName: "Súkromné meno",
          privateName_description: "Súkromné meno používateľa",
          publicName: "Verejné meno",
          publicName_description: "Verejné meno používateľa",
          leadId: "ID kontaktu",
          leadId_description: "ID pridruženého kontaktu (nepovinné)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Predplatné je aktívne",
          description: "Potvrdzovací e-mail po aktivácii predplatného",
        },
        preview: {
          privateName: "Súkromné meno",
          privateName_description: "Súkromné meno používateľa",
          userId: "ID používateľa",
          userId_description: "Jedinečné ID používateľa",
          leadId: "ID kontaktu",
          leadId_description: "ID pridruženého kontaktu",
          planName: "Názov plánu",
          planName_description: "Názov plánu predplatného",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Správca: nová registrácia používateľa",
          description: "Oznámenie správcovi o registrácii nového používateľa",
        },
        preview: {
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          email: "E-mail",
          userId: "ID používateľa",
          subscribeToNewsletter: "Odber newslettera",
        },
      },
      subscription: {
        meta: {
          name: "Správca: nové predplatné",
          description: "Oznámenie správcovi o aktivácii predplatného",
        },
        preview: {
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          email: "E-mail",
          planName: "Názov plánu",
          statusName: "Stav",
        },
      },
      user_create: {
        meta: {
          name: "Správca: vytvorený nový používateľ",
          description: "Oznámenie správcovi o vytvorení používateľského účtu",
        },
        preview: {
          privateName: "Súkromné meno",
          publicName: "Verejné meno",
          email: "E-mail",
          userId: "ID používateľa",
          leadId: "ID kontaktu",
        },
      },
      contact: {
        meta: {
          name: "Správca: správa z kontaktného formulára",
          description:
            "Oznámenie správcovi o prijatí správy z kontaktného formulára",
        },
        preview: {
          name: "Meno odosielateľa",
          email: "E-mail odosielateľa",
          subject: "Predmet",
          message: "Správa",
          company: "Firma",
          userId: "ID používateľa",
          leadId: "ID kontaktu",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "Náhľad e-mailu",
        titleShort: "Náhľad",
        description: "Vygenerovať náhľad zo šablóny e-mailu na serveri",
        container: {
          title: "Nastavenie náhľadu e-mailu",
        },
        success: {
          title: "Náhľad vygenerovaný",
          description: "Náhľad e-mailu bol vygenerovaný",
        },
        fields: {
          templateId: {
            label: "ID šablóny",
            description: "ID šablóny e-mailu na zobrazenie",
          },
          language: {
            label: "Jazyk",
            description: "Jazyk e-mailu",
          },
          country: {
            label: "Krajina",
            description: "Krajina použitá pri generovaní e-mailu",
          },
          props: {
            label: "Parametre šablóny",
            description: "Parametre odovzdávané šablóne e-mailu",
          },
          html: {
            title: "Vygenerované HTML",
          },
          subject: {
            title: "Predmet e-mailu",
          },
          templateVersion: {
            title: "Verzia šablóny",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné údaje požiadavky na náhľad",
          },
          network: {
            title: "Chyba siete",
            description: "Chyba siete pri generovaní náhľadu",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Nemáte oprávnenie vytvárať náhľady",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Generovanie náhľadu je zakázané",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "E-mailová šablóna sa nenašla",
          },
          server: {
            title: "Chyba servera",
            description: "Nepodarilo sa vygenerovať náhľad e-mailu",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Pri generovaní náhľadu nastal konflikt",
          },
        },
      },
      title: "Náhľad e-mailu",
      preview: "Náhľad",
      version: "Verzia",
      submit: "Náhľad",
      submitting: "Generuje sa náhľad…",
    },
    sendTest: {
      post: {
        title: "Poslať testovací e-mail",
        titleShort: "Testovací e-mail",
        description: "Odoslať testovací e-mail s vlastnými údajmi pre šablónu",
        container: {
          title: "Nastavenie testovacieho e-mailu",
        },
        success: {
          title: "Testovací e-mail odoslaný",
          description: "Testovací e-mail úspešne odoslaný",
        },
        fields: {
          templateId: {
            label: "ID šablóny",
            description: "ID šablóny e-mailu na odoslanie",
          },
          recipientEmail: {
            label: "E-mail príjemcu",
            description: "Adresa príjemcu testovacieho e-mailu",
          },
          language: {
            label: "Jazyk",
            description: "Jazyk e-mailu",
          },
          country: {
            label: "Krajina",
            description: "Krajina použitá pri generovaní e-mailu",
          },
          props: {
            label: "Parametre šablóny",
            description: "Parametre odovzdávané šablóne e-mailu",
          },
          success: {
            title: "Úspech",
          },
          message: {
            title: "Správa o výsledku",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné údaje požiadavky na testovací e-mail",
          },
          network: {
            title: "Chyba siete",
            description: "Chyba siete pri odosielaní testovacieho e-mailu",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Nemáte oprávnenie odosielať testovacie e-maily",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Odosielanie testovacích e-mailov je zakázané",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "E-mailová šablóna sa nenašla",
          },
          server: {
            title: "Chyba servera",
            description: "Testovací e-mail sa nepodarilo odoslať",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neznáma chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          conflict: {
            title: "Konflikt údajov",
            description: "Pri odosielaní nastal konflikt",
          },
        },
      },
      error: {
        templateNotFound: "E-mailová šablóna {{templateId}} sa nenašla",
        invalidProps: "Neplatné parametre šablóny: {{error}}",
        sendFailed: "Testovací e-mail sa nepodarilo odoslať: {{error}}",
      },
      success: "Testovací e-mail odoslaný",
      successDetail: "Testovací e-mail odoslaný na adresu {{email}}",
      title: "Poslať testovací e-mail",
      failed: "Testovací e-mail sa nepodarilo odoslať",
      submit: "Poslať testovací e-mail",
      submitting: "Odosiela sa…",
    },
  },
  messaging: {
    category: "Správy",
    tag: "správy",
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
        twilio: "Twilio",
        awsSns: "AWS SNS",
        messagebird: "MessageBird",
        http: "HTTP",
        whatsappBusiness: "WhatsApp Business",
        telegramBot: "Telegram Bot",
      },
      accountStatus: {
        active: "Aktívne",
        inactive: "Neaktívne",
        error: "Chyba",
        testing: "Testovanie",
      },
    },
    send: {
      errors: {
        accountNotFound: "Účet na odosielanie správ {{accountId}} sa nenašiel",
        sendFailed: "Nepodarilo sa poslať správu",
        unexpected: "Neočakávaná chyba pri odosielaní správy: {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "Odoslanie cez SMTP zlyhalo",
      smtpAccountNotFound: "Účet IMAP sa nenašiel",
      smtpListInboxFailed: "Nepodarilo sa načítať doručenú poštu",
      smtpListFoldersFailed: "Nepodarilo sa načítať zoznam priečinkov",
      smtpMoveMessageFailed: "Nepodarilo sa presunúť správu",
      smtpMarkReadFailed: "Nepodarilo sa označiť správu",
      resendKeyNotConfigured: "Chýba kľúč API pre Resend",
      resendSendFailed: "Odoslanie cez Resend zlyhalo",
      resendProviderError: "Chyba poskytovateľa Resend",
      resendNoInbox: "Resend nepodporuje doručenú poštu",
      resendNoFolders: "Resend nepodporuje priečinky",
      smsSendFailed: "Odoslanie SMS zlyhalo",
      whatsappSendFailed: "Odoslanie cez WhatsApp zlyhalo",
      telegramSendFailed: "Odoslanie cez Telegram zlyhalo",
      accountNotFound: "Účet na odosielanie správ sa nenašiel",
      notSupported: "Tento poskytovateľ operáciu nepodporuje",
    },
  },
};
