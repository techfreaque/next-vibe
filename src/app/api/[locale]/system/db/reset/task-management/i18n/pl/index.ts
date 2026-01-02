import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zarządzanie Zadaniami Reset",
  description: "Zarządzanie i monitorowanie zadań resetowania bazy danych",
  category: "Zadania Reset",
  tags: {
    tasks: "Zadania",
    management: "Zarządzanie",
    reset: "Reset",
    taskmanagement: "Zarządzanie Zadaniami",
  },
  container: {
    title: "Zarządzanie Zadaniami Reset",
    description: "Kontrola i monitorowanie zadań resetowania bazy danych",
  },
  fields: {
    operation: {
      label: "Operacja Zadania",
      description: "Wybierz operację zadania resetowania do wykonania",
      placeholder: "Wybierz operację zadania resetowania",
    },
    taskName: {
      label: "Nazwa Zadania",
      description: "Nazwa konkretnego zadania resetowania",
      placeholder: "Wprowadź nazwę zadania (opcjonalne)",
    },
    options: {
      label: "Opcje Zadania",
      description: "Opcje konfiguracji dla zadania resetowania",
      placeholder: "Skonfiguruj opcje wykonania zadania",
    },
  },
  operations: {
    runSafetyCheck: "Uruchom Sprawdzenie Bezpieczeństwa",
    startAutoReset: "Uruchom Automatyczny Reset",
    startBackupVerification: "Uruchom Weryfikację Kopii Zapasowej",
    stopAutoReset: "Zatrzymaj Automatyczny Reset",
    stopBackupVerification: "Zatrzymaj Weryfikację Kopii Zapasowej",
    getStatus: "Pobierz Status",
    listTasks: "Lista Zadań",
  },
  response: {
    success: {
      label: "Operacja Pomyślna",
    },
    taskName: {
      label: "Nazwa Zadania",
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
      description: "Nieprawidłowe parametry zadania resetowania",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Wymagane uwierzytelnienie dla operacji zadań resetowania",
    },
    forbidden: {
      title: "Zabronione",
      description: "Niewystarczające uprawnienia dla operacji zadań resetowania",
    },
    internal: {
      title: "Błąd Zadania",
      description: "Wykonanie zadania resetowania nie powiodło się",
    },
    conflict: {
      title: "Błąd Konfliktu",
      description: "Wystąpił konflikt zadania resetowania",
    },
    networkError: {
      title: "Błąd Sieci",
      description: "Błąd sieci podczas operacji zadania resetowania",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zadanie resetowania nie zostalo znalezione",
    },
    unknownError: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieznany błąd podczas operacji zadania resetowania",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Są niezapisane zmiany w zadaniu resetowania",
    },
    timeout: {
      title: "Błąd Timeout",
      description: "Operacja zadania resetowania przekroczyła limit czasu",
    },
  },
  priority: {
    low: "Niski Priorytet",
    medium: "Średni Priorytet",
    high: "Wysoki Priorytet",
  },
  success: {
    title: "Zadanie Reset Pomyślne",
    description: "Operacja zadania resetowania zakończona pomyślnie",
  },
  messages: {
    noUnauthorizedResetOperations: "Nie wykryto nieautoryzowanych operacji resetowania",
    safetyCheckSkippedNotProduction: "Sprawdzenie bezpieczeństwa pominięte (nie w produkcji)",
    safetyCheckFailed: "Sprawdzenie bezpieczeństwa resetowania bazy danych nie powiodło się",
    autoResetSkippedNotDevelopment: "Automatyczny reset pominięty (nie w środowisku rozwojowym)",
    operationOnlyAllowedInDevelopment: "Operacja dozwolona tylko w środowisku rozwojowym",
    autoResetTaskNotFound: "Zadanie automatycznego resetowania nie znalezione",
    taskConfigurationMissing: "Brak konfiguracji zadania",
    autoResetStartedSuccessfully:
      "Zadanie automatycznego resetowania bazy danych rozpoczęte pomyślnie",
    failedToStartAutoReset: "Nie udało się uruchomić automatycznego resetowania",
    backupVerificationTaskNotFound: "Zadanie weryfikacji kopii zapasowej nie znalezione",
    backupVerificationStartedSuccessfully:
      "Weryfikacja kopii zapasowej bazy danych rozpoczęta pomyślnie",
    failedToStartBackupVerification: "Nie udało się uruchomić weryfikacji kopii zapasowej",
    autoResetStoppedSuccessfully: "Zadanie automatycznego resetowania zatrzymane pomyślnie",
    failedToStopAutoReset: "Nie udało się zatrzymać automatycznego resetowania",
    backupVerificationStoppedSuccessfully:
      "Zadanie weryfikacji kopii zapasowej zatrzymane pomyślnie",
    failedToStopBackupVerification: "Nie udało się zatrzymać weryfikacji kopii zapasowej",
    taskNotFound: "Zadanie nie znalezione",
    taskDoesNotExist: "Zadanie '{taskName}' nie istnieje",
    taskStatusRetrieved: "Status zadania '{taskName}' pobrany",
    failedToGetTaskStatus: "Nie udało się pobrać statusu zadania",
    foundTasks: "Znaleziono {count} zadań",
    failedToListTasks: "Nie udało się wyświetlić listy zadań",
  },
  tasks: {
    resetSafetyCheck: {
      description: "Monitorowanie przypadkowych resetów bazy danych w produkcji",
      schedule: "0 */12 * * *",
    },
    devAutoReset: {
      description: "Automatyczne resetowanie bazy danych rozwojowej zgodnie z harmonogramem",
      schedule: "0 6 * * 1",
    },
    backupVerification: {
      description: "Weryfikacja kopii zapasowych bazy danych przed pozwoleniem na resety",
    },
  },
};
