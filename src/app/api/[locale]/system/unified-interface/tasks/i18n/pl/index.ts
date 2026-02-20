import { translations as cronTranslations } from "../../cron/i18n/pl";
import { translations as pulseTranslations } from "../../pulse/i18n/pl";
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
  enabledFilter: {
    all: "Wszystkie",
    enabled: "Włączone",
    disabled: "Wyłączone",
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
  cron: {
    frequency: {
      everyMinute: "co minutę",
      everyMinutes: "co {interval} minut",
      everyHour: "co godzinę",
      everyDays: "codziennie",
      hourly: "co godzinę",
    },
    days: {
      sunday: "niedziela",
      monday: "poniedziałek",
      tuesday: "wtorek",
      wednesday: "środa",
      thursday: "czwartek",
      friday: "piątek",
      saturday: "sobota",
    },
    common: {
      dailyAtMidnight: "codziennie o północy",
      dailyAtNoon: "codziennie w południe",
      weeklyOnSunday: "co tydzień w niedzielę",
      monthlyOnFirst: "co miesiąc 1. dnia",
      everyFiveMinutes: "co 5 minut",
      everyThreeMinutes: "co 3 minuty",
      everyOneMinutes: "co minutę",
      everyTenMinutes: "co 10 minut",
      everyFifteenMinutes: "co 15 minut",
      everyThirtyMinutes: "co 30 minut",
    },
    patterns: {
      everyIntervalMinutes: "co {interval} minut",
      everyIntervalMinutesStarting:
        "co {interval} minut począwszy od minuty {start}",
      atMinutes: "o minutach {minutes}",
      fromMinuteToMinute: "od minuty {from} do {to}",
      atMinute: "o minucie {minute}",
      everyIntervalHours: "co {interval} godzin",
      everyIntervalHoursStarting:
        "co {interval} godzin począwszy od godziny {start}",
      atHours: "o godzinach {hours}",
      fromHourToHour: "od godziny {from} do {to}",
      atHour: "o godzinie {hour}",
    },
    calendar: {
      onDays: "w dniach {days}",
      onDay: "w dniu {day}",
      inMonths: "w {months}",
      inMonth: "w {month}",
      onWeekdays: "w {weekdays}",
      fromWeekdayToWeekday: "od {from} do {to}",
      onWeekday: "w {weekday}",
    },
    timezone: "w {timezone}",
    time: {
      midnight: "północ",
      noon: "południe",
      hourAm: "{hour}",
      hourPm: "{hour}",
      hourMinuteAm: "{hour}:{minute}",
      hourMinutePm: "{hour}:{minute}",
    },
    weekdays: {
      sunday: "niedziela",
      monday: "poniedziałek",
      tuesday: "wtorek",
      wednesday: "środa",
      thursday: "czwartek",
      friday: "piątek",
      saturday: "sobota",
    },
    months: {
      january: "styczeń",
      february: "luty",
      march: "marzec",
      april: "kwiecień",
      may: "maj",
      june: "czerwiec",
      july: "lipiec",
      august: "sierpień",
      september: "wrzesień",
      october: "październik",
      november: "listopad",
      december: "grudzień",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Nie udało się pobrać zadań Cron",
    createCronTask: "Nie udało się utworzyć zadania Cron",
    updateCronTask: "Nie udało się zaktualizować zadania Cron",
    deleteCronTask: "Nie udało się usunąć zadania Cron",
    fetchCronTaskHistory: "Nie udało się pobrać historii zadań Cron",
    fetchCronTaskStats: "Nie udało się pobrać statystyk zadań Cron",
    fetchCronStatus: "Nie udało się pobrać statusu systemu Cron",
    cronTaskNotFound: "Zadanie Cron nie znalezione",

    // Unified Runner errors
    startTaskRunner: "Nie udało się uruchomić Task Runnera",
    stopTaskRunner: "Nie udało się zatrzymać Task Runnera",
    getTaskRunnerStatus: "Nie udało się pobrać statusu Task Runnera",
    executeCronTask: "Nie udało się wykonać zadania Cron",

    // Pulse errors
    executePulse: "Nie udało się wykonać Pulse",
    fetchPulseStatus: "Nie udało się pobrać statusu Pulse",
    pulseExecutionFailed: "Wykonanie Pulse nie powiodło się",
  },
  common: {
    cronRepositoryTaskUpdateFailed: "Nie udało się zaktualizować zadania cron",
    cronRepositoryTaskDeleteFailed: "Nie udało się usunąć zadania cron",
    cronRepositoryExecutionCreateFailed:
      "Nie udało się utworzyć wykonania zadania cron",
    cronRepositoryExecutionUpdateFailed:
      "Nie udało się zaktualizować wykonania zadania cron",
    cronRepositoryExecutionsFetchFailed:
      "Nie udało się pobrać wykonań zadań cron",
    cronRepositoryRecentExecutionsFetchFailed:
      "Nie udało się pobrać ostatnich wykonań zadań cron",
    cronRepositorySchedulesFetchFailed:
      "Nie udało się pobrać harmonogramów zadań cron",
    cronRepositoryScheduleUpdateFailed:
      "Nie udało się zaktualizować harmonogramu zadania cron",
    cronRepositoryStatisticsFetchFailed:
      "Nie udało się pobrać statystyk zadań cron",
  },
  csvProcessor: {
    description: "Przetwarza zadania importu CSV w partiach",
  },
  imapSync: {
    description: "Automatycznie synchronizuje konta IMAP, foldery i wiadomości",
  },
  newsletterUnsubscribeSync: {
    description: "Synchronizuje statusy leadów dla wypisań z newslettera",
  },
  cronSystem: cronTranslations,
  pulseSystem: pulseTranslations,
  unifiedRunner: unifiedRunnerTranslations,
};
