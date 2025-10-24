import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Status systemu Cron",
  description: "Pobierz status systemu cron i informacje o zadaniach",
  category: "Punkt końcowy API",
  tags: {
    status: "Status",
  },
  common: {
    taskName: "Nazwa zadania",
    taskNamesDescription: "Nazwy zadań do filtrowania",
    detailed: "Szczegółowe",
    detailedDescription: "Uwzględnij szczegółowe informacje",
    active: "Aktywne",
    total: "Razem",
    uptime: "Czas działania",
    id: "ID",
    status: "Status",
    lastRun: "Ostatnie uruchomienie",
    nextRun: "Następne uruchomienie",
    schedule: "Harmonogram",
  },
  success: {
    title: "Sukces",
    content: "Sukces",
  },
  errors: {
    validation: {
      title: "Walidacja Nieudana",
      description: "Nieprawidłowe parametry żądania",
    },
    network: {
      title: "Błąd Sieci",
      description: "Połączenie sieciowe nie powiodło się",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zadanie cron nie zostało znalezione",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania statusu cron",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt",
    },
  },
};
