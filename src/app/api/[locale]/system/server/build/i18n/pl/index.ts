import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie serwerem",
  tags: {
    build: "Build",
  },
  post: {
    title: "Zbuduj aplikację",
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
        packageBuildFailed: "Budowanie pakietu nie powiodło się",
        buildPrerequisites: "Uruchamianie wymagań budowania...",
        skipGeneration:
          "Pomijanie generowania punktów końcowych API (--skip-generation)",
        generatingEndpoints: "Generowanie punktów końcowych API...",
        generationSuccess: "✅ Generowanie kodu zakończone pomyślnie",
        generationFailed: "Generowanie kodu nie powiodło się",
        skipNextBuild:
          "Pomijanie budowania Next.js (będzie obsługiwane przez package.json)",
        buildingNextjs: "Budowanie aplikacji Next.js...",
        nextjsBuildSuccess: "✅ Budowanie Next.js zakończone pomyślnie",
        nextjsBuildFailed: "Budowanie Next.js nie powiodło się",
        skipProdDb:
          "Pomijanie operacji produkcyjnej bazy danych (--run-prod-database=false)",
        buildFailed: "❌ Budowanie nie powiodło się",
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
          "❌ Budowanie produkcyjne nie powiodło się podczas operacji bazy danych",
        prodDbNotReady:
          "💡 To budowanie NIE jest gotowe do wdrożenia produkcyjnego",
        deploymentReady:
          "🚀 Twoja aplikacja jest gotowa do wdrożenia produkcyjnego!",
        dbConnectionError:
          "Połączenie z bazą danych nie powiodło się. Upewnij się, że baza danych działa i jest dostępna.",
        dbStartSuggestion:
          "Spróbuj uruchomić 'docker compose -f docker-compose-dev.yml up -d', aby uruchomić bazę danych",
        nextBuildHandled:
          "✅ Budowanie Next.js będzie obsługiwane przez polecenie yarn build",
        failedProdMigrations: "Nie udało się uruchomić migracji produkcyjnych",
      },
    },
  },
};
