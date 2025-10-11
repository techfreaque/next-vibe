import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/cronErrors/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  transform_failed: "Nie udało się przekształcić danych",
  stats_transform_failed: "Nie udało się przekształcić danych statystycznych",
  status_transform_failed: "Nie udało się przekształcić danych statusu",
  execution: {
    invalid_module_structure: "Nieprawidłowa struktura modułu",
    validation_failed: "Walidacja nie powiodła się",
    execution_failed: "Wykonanie nie powiodło się",
    threw_error: "Zadanie zgłosiło błąd",
    processing_error: "Błąd przetwarzania",
    unknown_error: "Nieznany błąd",
  },
  email_campaigns: {
    failed_to_render_email: "Nie udało się wyrenderować szablonu e-mail",
    failed_to_initialize_campaign: "Nie udało się zainicjować kampanii e-mail",
    unknown_error_fallback: "Nieznany błąd",
  },
  system: {
    task_validation_failed: "Walidacja zadania nie powiodła się",
    database_connection_failed: "Połączenie z bazą danych nie powiodło się",
    required_tables_not_found: "Nie znaleziono wymaganych tabel bazy danych",
    invalid_task_configuration: "Nieprawidłowa konfiguracja zadania",
  },
  tasks: {
    list: {
      database_error: "Nie udało się pobrać zadań z bazy danych",
      fetch_failed: "Nie udało się pobrać listy zadań",
    },
  },
  task_create: {
    database_error: "Nie udało się utworzyć zadania w bazie danych",
    invalid_schedule: "Nieprawidłowy format harmonogramu cron",
    creation_failed: "Tworzenie zadania nie powiodło się",
  },
  history: {
    fetch_failed: "Nie udało się pobrać historii wykonania",
  },
  status: {
    health_fetch_failed: "Nie udało się pobrać statusu zdrowia",
    stats_fetch_failed: "Nie udało się pobrać statystyk zadań",
    system_status_failed: "Nie udało się pobrać statusu systemu",
  },
  stats: {
    detailed_stats_failed: "Nie udało się pobrać szczegółowych statystyk",
  },
  task: {
    find_by_id_failed: "Nie udało się znaleźć zadania po ID",
    find_by_name_failed: "Nie udało się znaleźć zadania po nazwie",
    not_found: "Zadanie nie zostało znalezione",
    update_failed: "Nie udało się zaktualizować zadania",
    delete_failed: "Nie udało się usunąć zadania",
    toggle_failed: "Nie udało się przełączyć statusu zadania",
    executions_fetch_failed: "Nie udało się pobrać wykonań zadania",
    execution_create_failed: "Nie udało się utworzyć wykonania zadania",
    execution_update_failed: "Nie udało się zaktualizować wykonania zadania",
  },
};
