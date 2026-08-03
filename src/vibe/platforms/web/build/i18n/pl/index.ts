import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie serwerem",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    build: "Build",
  },
  post: {
    title: "Zbuduj aplikację",
    titleShort: "Zbuduj aplikację",
    description: "Zbuduj aplikację do wdrożenia produkcyjnego",
    form: {
      title: "Konfiguracja budowania",
      description: "Skonfiguruj opcje i ustawienia budowania",
    },
    fields: {
      package: {
        title: "Zbuduj pakiet",
        description: "Zbuduj pakiet przed aplikacją",
      },
      skipNextCommand: {
        title: "Pomiń polecenie Next.js",
        description: "Pomiń uruchamianie polecenia budowania Next.js",
      },
      target: {
        title: "Cel budowania",
        description: "Określ cel budowania (np. 'production', 'staging')",
      },
      skipGeneration: {
        title: "Pomiń generowanie kodu",
        description:
          "Pomiń generowanie punktów końcowych API podczas budowania",
      },
      generate: {
        title: "Generuj kod",
        description: "Uruchom generowanie kodu podczas budowania",
      },
      generateEndpoints: {
        title: "Generuj endpointy",
        description: "Generuj pliki endpointów API podczas budowania",
      },
      generateSeeds: {
        title: "Generuj seedy",
        description: "Generuj pliki seedów podczas budowania",
      },
      nextBuild: {
        title: "Build Next.js",
        description: "Uruchom proces budowania Next.js",
      },
      migrate: {
        title: "Uruchom migracje",
        description: "Uruchom migracje bazy danych podczas budowania",
      },
      seed: {
        title: "Uruchom seeding",
        description: "Uruchom seeding bazy danych podczas budowania",
      },
      force: {
        title: "Wymuś budowanie",
        description: "Kontynuuj budowanie nawet przy błędach",
      },
      framework: {
        title: "Framework",
        description: "Frontend framework/bundler",
      },
      webpack: {
        title: "Użyj Webpack",
        description:
          "Użyj webpack zamiast Turbopack. Mniejsze użycie pamięci (~7,5 GB vs ~12 GB). Domyślnie włączone w produkcyjnych buildach Docker.",
      },
      vibeMode: {
        title: "Tryb instancji",
        description:
          "Wbudowuje tryb instancji w bundle Next.js. 'agent' = osobista lokalna instancja. 'cloud' = wdrożenie SaaS. 'dev' = instancja deweloperska (domyślnie).",
        options: {
          agent: "Agent (osobista lokalna instancja)",
          cloud: "Cloud (wdrożenie SaaS)",
          dev: "Dev (instancja deweloperska, domyślnie)",
        },
      },
      skipEndpoints: {
        title: "Pomiń generowanie punktów końcowych",
        description: "Pomiń generowanie plików punktów końcowych",
      },
      skipSeeds: {
        title: "Pomiń generowanie seedów",
        description: "Pomiń generowanie plików seedów",
      },
      skipProdMigrations: {
        title: "Pomiń migracje produkcyjne",
        description: "Pomiń uruchamianie migracji bazy danych dla produkcji",
      },
      skipProdSeeding: {
        title: "Pomiń seeding produkcyjny",
        description: "Pomiń seeding bazy danych dla produkcji",
      },
      runProdDatabase: {
        title: "Uruchom operacje produkcyjnej bazy danych",
        description: "Uruchom operacje produkcyjnej bazy danych po budowaniu",
      },
      success: {
        title: "Sukces budowania",
      },
      output: {
        title: "Wynik budowania",
      },
      duration: {
        title: "Czas budowania (ms)",
      },
      errors: {
        title: "Błędy budowania",
      },
      steps: {
        title: "Kroki budowania",
      },
      label: {
        title: "Krok",
      },
      ok: {
        title: "Sukces",
      },
      skipped: {
        title: "Pominięto",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podano nieprawidłowe parametry budowania",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się podczas budowania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby zbudować aplikację",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do budowania aplikacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby budowania nie zostały znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas budowania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas budowania",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt budowania",
      },
      nextjs_build_failed: {
        title: "Budowanie Next.js nie powiodło się",
        description: "Proces budowania Next.js nie powiódł się: {{error}}",
      },
    },
    success: {
      title: "Budowanie zakończone",
      description: "Budowanie aplikacji zakończone pomyślnie",
    },
    repository: {
      messages: {
        buildStart: "🚀 Rozpoczynanie budowania aplikacji...",
        packageBuildStart: "Budowanie pakietu...",
        packageBuildSuccess: "✅ Budowanie pakietu zakończone pomyślnie",
        packageBuildFailed: "Budowanie pakietu nie powiodło się: {{error}}",
        buildPrerequisites: "Uruchamianie wymagań budowania...",
        skipGeneration:
          "Pomijanie generowania punktów końcowych API (--skip-generation)",
        generatingEndpoints: "Generowanie punktów końcowych API...",
        generationSuccess: "✅ Generowanie kodu zakończone pomyślnie",
        generationFailed: "Generowanie kodu nie powiodło się",
        generationFailedDetail: "Generowanie kodu nie powiodło się: {{error}}",
        tanstackBuildStart: "Budowanie TanStack Start (SSR)...",
        tanstackBuildSuccess:
          "✅ Budowanie TanStack Start (SSR) zakończone pomyślnie",
        tanstackBuildFailed: "Budowanie TanStack Start nie powiodło się",
        tanstackBuildFailedDetail:
          "Budowanie TanStack Start nie powiodło się: {{error}}",
        skipNextBuild:
          "Pomijanie budowania Next.js (będzie obsługiwane przez package.json)",
        buildingNextjs: "Budowanie aplikacji Next.js...",
        nextjsBuildSuccess: "✅ Budowanie Next.js zakończone pomyślnie",
        nextjsBuildFailed: "Budowanie Next.js nie powiodło się: {{error}}",
        nextjsBuildOom:
          "Budowanie Next.js przerwane przez system (prawdopodobnie brak pamięci) - sygnał: {{signal}}",
        nextjsBuildExitCode: "Budowanie Next.js zakończyło się kodem {{code}}",
        skipProdDb:
          "Pomijanie operacji produkcyjnej bazy danych (--run-prod-database=false)",
        buildFailed: "❌ Budowanie nie powiodło się: {{error}}",
        unknownError: "nieznany błąd",
        schemaGenerationStart: "Generowanie schematu bazy danych...",
        schemaGenerationSuccess:
          "✅ Generowanie schematu bazy danych zakończone",
        schemaGenerationFailed:
          "Generowanie schematu bazy danych nie powiodło się",
        skipSchemaGeneration:
          "Pomijanie generowania schematu bazy danych (--run-prod-database=false)",
        reportsGenerationStart: "Generowanie wszystkich raportów...",
        reportsGenerationSuccess: "✅ Wszystkie raporty wygenerowane pomyślnie",
        reportsGenerationFailed: "Generowanie raportów nie powiodło się",
        prodDbStart: "🚀 Uruchamianie operacji produkcyjnej bazy danych...",
        prodDbSuccess:
          "🎉 Operacje produkcyjnej bazy danych zakończone pomyślnie",
        prodDbFailed:
          "❌ Budowanie produkcyjne nie powiodło się podczas operacji bazy danych: {{error}}. Uruchom bazę poleceniem 'docker compose -f docker-compose-dev.yml up -d'.",
        prodDbConnectionFailed:
          "❌ Budowanie produkcyjne nie powiodło się podczas operacji bazy danych: baza jest niedostępna ({{error}}). Sprawdź, czy działa, a jeśli nie - uruchom ją poleceniem 'docker compose -f docker-compose-dev.yml up -d'.",
        prodDbNotReady:
          "💡 To budowanie NIE jest gotowe do wdrożenia produkcyjnego",
        deploymentReady:
          "🚀 Twoja aplikacja jest gotowa do wdrożenia produkcyjnego!",
        nextBuildHandled:
          "✅ Budowanie Next.js będzie obsługiwane przez polecenie yarn build",
        failedProdMigrations: "Nie udało się uruchomić migracji produkcyjnych",
      },
    },
  },
};
