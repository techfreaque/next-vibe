import { translations as cronTranslations } from "../../cron/i18n/pl";
import { translations as pulseTranslations } from "../../pulse/i18n/pl";
import { translations as sideTasksTranslations } from "../../side-tasks/i18n/pl";
import { translations as typesTranslations } from "../../types/i18n/pl";
import { translations as unifiedRunnerTranslations } from "../../unified-runner/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie zadaniami",
  type: {
    cron: "Zadanie Cron",
    side: "Zadanie w tle",
    task_runner: "Task Runner",
  },
  priority: {
    critical: "Krytyczny",
    high: "Wysoki",
    medium: "Średni",
    low: "Niski",
    background: "Tło",
    filter: {
      all: "Wszystkie priorytety",
      highAndAbove: "Wysoki i wyżej",
      mediumAndAbove: "Średni i wyżej",
    },
  },
  status: {
    pending: "Oczekujący",
    running: "Uruchomiony",
    completed: "Ukończony",
    failed: "Nieudany",
    timeout: "Przekroczenie czasu",
    cancelled: "Anulowany",
    skipped: "Pominięty",
    blocked: "Zablokowany",
    scheduled: "Zaplanowany",
    stopped: "Zatrzymany",
    error: "Błąd",
    filter: {
      all: "Wszystkie statusy",
      active: "Aktywny",
      error: "Stany błędów",
    },
  },
  taskCategory: {
    development: "Rozwój",
    build: "Budowanie",
    watch: "Obserwowanie",
    generator: "Generator",
    test: "Test",
    maintenance: "Konserwacja",
    database: "Baza danych",
    system: "System",
    monitoring: "Monitorowanie",
  },
  sort: {
    asc: "Rosnąco",
    desc: "Malejąco",
  },
  pulse: {
    health: {
      healthy: "Zdrowy",
      warning: "Ostrzeżenie",
      critical: "Krytyczny",
      unknown: "Nieznany",
    },
    execution: {
      success: "Sukces",
      failure: "Niepowodzenie",
      timeout: "Przekroczenie czasu",
      cancelled: "Anulowany",
      pending: "Oczekujący",
    },
  },
  cron: cronTranslations,
  pulseSystem: pulseTranslations,
  sideTasks: sideTasksTranslations,
  types: typesTranslations,
  unifiedRunner: unifiedRunnerTranslations,
};
