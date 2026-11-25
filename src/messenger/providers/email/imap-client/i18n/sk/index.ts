import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      description: "Najvyšší počet správ na synchronizáciu v každom priečinku",
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
        failed: "Synchronizácia účtu zlyhala: {{error}}",
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
        account_failed: "Synchronizácia účtu zlyhala: {{error}}",
        folder_sync_failed: "Synchronizácia priečinka zlyhala: {{error}}",
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
};
