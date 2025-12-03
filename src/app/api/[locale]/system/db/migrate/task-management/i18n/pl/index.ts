import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zarządzanie Zadaniami Migracji",
  description: "Zarządzanie i monitorowanie zadań migracji bazy danych",
  category: "Zadania Migracji",
  tags: {
    migration: "Migracja",
    tasks: "Zadania",
    taskmanagement: "Zarządzanie Zadaniami",
  },
  container: {
    title: "Zarządzanie Zadaniami Migracji",
    description: "Kontrola i monitorowanie zadań migracji bazy danych",
  },
  fields: {
    operation: {
      label: "Operacja Zadania",
      description: "Wybierz operację zadania migracji do wykonania",
      placeholder: "Wybierz operację zadania migracji",
    },
    taskName: {
      label: "Nazwa Zadania",
      description: "Nazwa konkretnego zadania migracji",
      placeholder: "Wprowadź nazwę zadania (opcjonalne)",
    },
    options: {
      label: "Opcje Zadania",
      description: "Opcje konfiguracji dla zadania migracji",
      placeholder: "Skonfiguruj opcje wykonania zadania",
    },
  },
  operations: {
    getMigrationStatus: "Pobierz Status Migracji",
    listMigrationTasks: "Lista Zadań Migracji",
    runHealthCheck: "Uruchom Sprawdzenie Zdrowia",
    startAutoMigration: "Uruchom Automatyczną Migrację",
    startBackupMonitor: "Uruchom Monitor Kopii Zapasowej",
    stopAutoMigration: "Zatrzymaj Automatyczną Migrację",
    stopBackupMonitor: "Zatrzymaj Monitor Kopii Zapasowej",
  },
  response: {
    success: {
      label: "Operacja Pomyślna",
    },
    taskExecuted: {
      label: "Zadanie Wykonane",
    },
    status: {
      label: "Status Zadania",
    },
    output: {
      label: "Wyjście Zadania",
    },
    error: {
      label: "Szczegóły Błędu",
    },
    result: {
      label: "Wynik Zadania",
    },
  },
  errors: {
    validation: {
      title: "Błąd Walidacji",
      description: "Nieprawidłowe parametry zadania migracji",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Wymagane uwierzytelnienie dla operacji zadań migracji",
    },
    forbidden: {
      title: "Zabronione",
      description: "Niewystarczające uprawnienia dla operacji zadań migracji",
    },
    internal: {
      title: "Błąd Zadania",
      description: "Wykonanie zadania migracji nie powiodło się",
    },
    conflict: {
      title: "Błąd Konfliktu",
      description: "Wystąpił konflikt zadania migracji",
    },
    networkError: {
      title: "Błąd Sieci",
      description: "Błąd sieci podczas operacji zadania migracji",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zadanie migracji nie zostalo znalezione",
    },
    unknownError: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieznany błąd podczas operacji zadania migracji",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Są niezapisane zmiany w zadaniu migracji",
    },
  },
  priority: {
    low: "Niski Priorytet",
    medium: "Średni Priorytet",
    high: "Wysoki Priorytet",
  },
  success: {
    title: "Zadanie Migracji Pomyślne",
    description: "Operacja zadania migracji zakończona pomyślnie",
  },
  messages: {
    healthCheckCompleted:
      "Kontrola zdrowia zakończona: {migrationsChecked} migracji sprawdzonych, {pendingMigrations} oczekujących",
    healthCheckFailed: "Kontrola zdrowia migracji bazy danych nie powiodła się",
    autoMigrationSkippedNotDevelopment:
      "Automatyczna migracja pominięta - nie w środowisku deweloperskim",
    operationOnlyAllowedInDevelopment:
      "Ta operacja jest dozwolona tylko w środowisku deweloperskim",
    autoMigrationTaskNotFound: "Zadanie automatycznej migracji nie znalezione",
    taskConfigurationMissing: "Brak konfiguracji zadania",
    autoMigrationStartedSuccessfully:
      "Automatyczna migracja rozpoczęta pomyślnie",
    failedToStartAutoMigration:
      "Nie udało się rozpocząć automatycznej migracji",
    backupMonitorTaskNotFound:
      "Zadanie monitora kopii zapasowych nie znalezione",
    backupMonitorStartedSuccessfully:
      "Monitor kopii zapasowych rozpoczęty pomyślnie",
    failedToStartBackupMonitor:
      "Nie udało się uruchomić monitora kopii zapasowych",
    autoMigrationStoppedSuccessfully:
      "Automatyczna migracja zatrzymana pomyślnie",
    failedToStopAutoMigrationTask:
      "Nie udało się zatrzymać zadania automatycznej migracji",
    backupMonitorStoppedSuccessfully:
      "Monitor kopii zapasowych zatrzymany pomyślnie",
    failedToStopBackupMonitorTask:
      "Nie udało się zatrzymać zadania monitora kopii zapasowych",
    migrationTaskNotFound: "Zadanie migracji nie znalezione",
    migrationTaskDoesNotExist: "Zadanie migracji '{taskName}' nie istnieje",
    migrationTaskStatusRetrieved:
      "Status zadania migracji '{taskName}' pobrany pomyślnie",
    failedToGetMigrationTaskStatus:
      "Nie udało się pobrać statusu zadania migracji",
    foundMigrationTasks: "Znaleziono {count} zadań migracji",
    failedToListMigrationTasks: "Nie udało się wylistować zadań migracji",
  },
  tasks: {
    healthCheck: {
      description:
        "Wykonuje kontrole zdrowia migracji bazy danych w celu zapewnienia integralności systemu",
      schedule: "0 */6 * * *",
    },
    autoMigration: {
      description:
        "Automatycznie uruchamia oczekujące migracje bazy danych w środowisku deweloperskim",
      schedule: "*/30 * * * *",
    },
    backupMonitor: {
      description:
        "Monitoruje i zarządza plikami kopii zapasowych migracji bazy danych oraz ich czyszczeniem",
    },
  },
};
