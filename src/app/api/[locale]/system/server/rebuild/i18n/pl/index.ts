import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie serwerem",
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Przebuduj i uruchom ponownie",
    description:
      "Przebuduj aplikację i uruchom ponownie serwer Next.js. Wykonuje 6 kroków sekwencyjnie: 1) generowanie kodu, 2) vibe check (bramka jakości kodu), 3) produkcyjny build Next.js, 4) migracje bazy danych, 5) seeding bazy danych, 6) hot-restart przez SIGUSR1. Vibe check blokuje build przy błędach - użyj 'vibe check' lub MCP check tool po szczegóły. UWAGA: Odpowiedź HTTP może zostać ucięta, ponieważ serwer restartuje się przed ukończeniem odpowiedzi.",
    form: {
      title: "Przebuduj i uruchom ponownie",
      description: "Przebuduj aplikację i uruchom ponownie serwer",
    },
    fields: {
      framework: {
        title: "Framework",
        description: "Docelowy framework do zbudowania i restartu",
      },
      success: { title: "Wynik" },
      errors: { title: "Błędy" },
      duration: { title: "Czas" },
      steps: { title: "Kroki" },
    },
    steps: {
      codegen: "Generowanie kodu",
      vibeCheck: "Vibe check",
      nextBuild: "Build Next.js",
      migrate: "Migracje",
      seed: "Seeding",
      restart: "Restart",
      codegenFailed: "Generowanie kodu nie powiodło się: {{error}}",
      vibeCheckFailed:
        "Vibe check: {{errors}} błędów, {{warnings}} ostrzeżeń. Użyj 'vibe check' lub MCP check tool po szczegóły.",
      vibeCheckError: "Vibe check nie powiódł się: {{error}}",
      buildFailed: "Build Next.js nie powiódł się: {{error}}",
      migrationFailed: "Migracja nie powiodła się: {{error}}",
      seedingFailed: "Seeding nie powiódł się: {{error}}",
      restartFailed: "Restart serwera nie powiódł się: {{error}}",
      noPidFile: "Nie znaleziono pliku .vibe-pid - czy vibe start działa?",
      invalidPid: "Nieprawidłowy PID w .vibe-pid: {{pid}}",
      processNotRunning: "Proces {{pid}} nie działa",
      signalFailed: "Nie udało się wysłać SIGUSR1: {{error}}",
    },
    errors: {
      validation: {
        title: "Walidacja nieudana",
        description: "Podano nieprawidłowe parametry przebudowy",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się podczas przebudowy",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby przebudować aplikację",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do przebudowy aplikacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby przebudowy nie znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas przebudowy",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas przebudowy",
      },
      conflict: {
        title: "Konflikt",
        description: "Przebudowa jest już w toku",
      },
    },
    success: {
      title: "Przebudowa zakończona",
      description:
        "Aplikacja przebudowana i serwer uruchomiony ponownie pomyślnie",
    },
    widget: {
      rebuildComplete: "Przebudowa zakończona",
      rebuildFailed: "Przebudowa nie powiodła się",
      errors: "Błędy:",
      runRebuild: "Uruchom przebudowę",
      runAgain: "Uruchom ponownie",
      skipped: "pominięto",
    },
  },
};
