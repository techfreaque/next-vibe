import type { syncTranslations as EnglishSyncTranslations } from "../../../en/sections/imap/sync";

export const syncTranslations: typeof EnglishSyncTranslations = {
  title: "Synchronizacja e-mail",
  start: "Rozpocznij synchronizację",
  stop: "Zatrzymaj synchronizację",
  pause: "Wstrzymaj synchronizację",
  resume: "Wznów synchronizację",
  manual: "Synchronizacja ręczna",
  controlPanel: "Panel kontroli synchronizacji",
  currentStatus: "Aktualny status",
  lastSync: "Ostatnia synchronizacja",
  nextSync: "Następna synchronizacja",
  currentOperation: "Bieżąca operacja",
  progress: "Postęp synchronizacji",
  idle: "Bezczynny",
  timeAgo: "{{time}} temu",
  timeIn: "za {{time}}",
  status: {
    synced: "Zsynchronizowane",
    syncing: "Synchronizowanie",
    pending: "Oczekujące",
    error: "Błąd",
    unknown: "Nieznane",
  },
  statistics: {
    totalSyncsToday: "Synchronizacje dzisiaj",
    successfulSyncs: "Udane synchronizacje",
    failedSyncs: "Nieudane synchronizacje",
    avgDuration: "Średni czas trwania",
  },
  history: {
    title: "Historia ostatnich synchronizacji",
    startTime: "Czas rozpoczęcia",
    status: "Status",
    duration: "Czas trwania",
    accounts: "Konta",
    folders: "Foldery",
    messages: "Wiadomości",
    errors: "Błędy",
  },
  performance: {
    responseTime: "Czas odpowiedzi",
    throughput: "Przepustowość",
    errorRate: "Wskaźnik błędów",
    queueSize: "Rozmiar kolejki",
  },
  folders: {
    success: "Foldery pomyślnie zsynchronizowane",
  },
  messages: {
    accounts: {
      success: "Konta pomyślnie zsynchronizowane",
      successWithErrors: "Konta zsynchronizowane z błędami",
    },
    account: {
      success: "Konto pomyślnie zsynchronizowane",
      successWithErrors: "Konto zsynchronizowane z błędami",
    },
    folders: {
      success: "Foldery pomyślnie zsynchronizowane",
      successWithErrors: "Foldery zsynchronizowane z błędami",
    },
    messages: {
      success: "Wiadomości pomyślnie zsynchronizowane",
      successWithErrors: "Wiadomości zsynchronizowane z błędami",
    },
    cancel: {
      success: "Operacje synchronizacji zostały pomyślnie anulowane",
    },
  },
  errors: {
    account_failed: "Synchronizacja konta nie powiodła się",
    folder_sync_failed: "Synchronizacja folderów nie powiodła się",
    message_sync_failed: "Synchronizacja wiadomości nie powiodła się",
    message_sync_error: "Błąd podczas synchronizacji wiadomości",
    folder_error: "Błąd przetwarzania folderu",
    unknown_error: "Nieznany błąd synchronizacji",
    sync_cancelled: "Synchronizacja została anulowana",
  },
};
