import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Klient IMAP",
  tags: {
    health: "Kondycja",
    monitoring: "Monitorowanie",
  },
  get: {
    title: "Pobierz Status Kondycji IMAP",
    description: "Pobierz aktualny status kondycji serwera IMAP i metryki",
    form: {
      title: "Żądanie Statusu Kondycji IMAP",
      description: "Formularz żądania monitorowania kondycji serwera IMAP",
    },
    response: {
      title: "Odpowiedź Statusu Kondycji IMAP",
      description: "Aktualny status kondycji serwera IMAP i metryki wydajności",
      data: {
        title: "Dane kondycji",
        description: "Dane statusu kondycji i metryki",
        accountsHealthy: "Zdrowe konta",
        accountsTotal: "Całkowite konta",
        connectionsActive: "Aktywne połączenia",
        connectionErrors: "Błędy połączenia",
        lastSyncAt: "Ostatnia synchronizacja",
      },
      message: "Status kondycji pobrany pomyślnie",
    },
  },
  health: {
    get: {
      title: "Pobierz Status Kondycji IMAP",
      description: "Pobierz aktualny status kondycji serwera IMAP i metryki",
      form: {
        title: "Żądanie Statusu Kondycji IMAP",
        description: "Formularz żądania monitorowania kondycji serwera IMAP",
      },
      response: {
        title: "Odpowiedź Statusu Kondycji IMAP",
        description:
          "Aktualny status kondycji serwera IMAP i metryki wydajności",
        success: "Sukces",
        message: "Status kondycji pobrany pomyślnie",
        data: {
          title: "Dane kondycji",
          description: "Dane statusu kondycji i metryki",
          status: "Status kondycji",
          accountsHealthy: "Zdrowe konta",
          accountsTotal: "Całkowite konta",
          connectionsActive: "Aktywne połączenia",
          connectionErrors: "Błędy połączenia",
          lastSyncAt: "Ostatnia synchronizacja",
          syncStats: {
            title: "Statystyki synchronizacji",
            description: "Statystyki i metryki synchronizacji",
            totalSyncs: "Wszystkie synchronizacje",
            lastSyncTime: "Czas ostatniej synchronizacji",
          },
          serverStatus: "Status serwera",
          uptime: "Czas pracy",
          syncedAccounts: "Zsynchronizowane konta",
          totalAccounts: "Wszystkie konta",
          activeConnections: "Aktywne połączenia",
          performanceMetrics: {
            title: "Metryki wydajności",
            description: "Metryki i statystyki wydajności",
            avgResponseTime: "Średni czas odpowiedzi",
          },
        },
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description:
            "Wymagane uwierzytelnienie aby uzyskać dostęp do statusu kondycji IMAP",
        },
        validation: {
          title: "Błąd Walidacji",
          description: "Podano nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd Serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas pobierania statusu kondycji",
        },
        unknown: {
          title: "Nieznany Błąd",
          description: "Wystąpił nieznany błąd",
        },
        network: {
          title: "Błąd Sieci",
          description:
            "Wystąpił błąd sieci podczas pobierania statusu kondycji",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Dostęp do statusu kondycji IMAP jest zabroniony",
        },
        notFound: {
          title: "Nie Znaleziono",
          description: "Nie znaleziono statusu kondycji IMAP",
        },
        unsavedChanges: {
          title: "Niezapisane Zmiany",
          description:
            "Istnieją niezapisane zmiany, które należy najpierw zapisać",
        },
        conflict: {
          title: "Konflikt",
          description:
            "Wystąpił konflikt danych podczas pobierania statusu kondycji",
        },
      },
      success: {
        title: "Sukces",
        description: "Status kondycji IMAP pobrany pomyślnie",
      },
    },
  },
  widget: {
    title: "Stan IMAP",
    accountsHealthy: "Zdrowe konta",
    accountsTotal: "Konta łącznie",
    connectionsActive: "Aktywne połączenia",
    connectionErrors: "Błędy połączeń",
    performance: "Wydajność",
    avgResponseTime: "Śr. czas odpowiedzi",
    uptime: "Czas działania",
    serverStatus: "Status serwera",
    syncStats: "Statystyki synchronizacji",
    totalSyncs: "Synchronizacje łącznie",
    lastSyncTime: "Ostatnia synchronizacja",
  },
};
