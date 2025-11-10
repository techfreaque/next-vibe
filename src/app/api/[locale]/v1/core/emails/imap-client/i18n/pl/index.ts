import { translations as accountsTranslations } from "../../accounts/i18n/pl";
import { translations as configTranslations } from "../../config/i18n/pl";
import { translations as foldersTranslations } from "../../folders/i18n/pl";
import { translations as healthTranslations } from "../../health/i18n/pl";
import { translations as messagesTranslations } from "../../messages/i18n/pl";
import { translations as syncTranslations } from "../../sync/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
  accounts: accountsTranslations,
  config: configTranslations,
  folders: foldersTranslations,
  health: healthTranslations,
  messages: messagesTranslations,
  sync: syncTranslations,
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
        account_failed: "Synchronizacja konta nie powiodła się",
        folder_sync_failed: "Synchronizacja folderu nie powiodła się",
        message_sync_error: "Błąd synchronizacji wiadomości",
        message_sync_failed: "Synchronizacja wiadomości nie powiodła się",
      },
    },
  },
  enums: {
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
};
