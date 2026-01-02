import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Narzędzie do wydań",
  description: "Zarządzaj wydaniami pakietów z wersjonowaniem, tagowaniem Git i integracją CI/CD",
  category: "Narzędzie do wydań",
  tags: {
    release: "Wydanie",
  },
  enums: {
    versionIncrement: {
      patch: "Patch",
      minor: "Minor",
      major: "Major",
      prepatch: "Pre-patch",
      preminor: "Pre-minor",
      premajor: "Pre-major",
      prerelease: "Prerelease",
    },
    packageManager: {
      bun: "Bun",
      npm: "NPM",
      yarn: "Yarn",
      pnpm: "PNPM",
      deno: "Deno",
    },
    webhookType: {
      slack: "Slack",
      discord: "Discord",
      teams: "Microsoft Teams",
      custom: "Własny",
    },
    npmAccess: {
      public: "Publiczny",
      restricted: "Ograniczony",
    },
    changelogPreset: {
      "conventional-commits": "Conventional Commits",
      angular: "Angular",
      atom: "Atom",
      eslint: "ESLint",
      ember: "Ember",
    },
  },
  form: {
    title: "Konfiguracja wydania",
    description: "Skonfiguruj opcje wydań dla swoich pakietów",
  },
  fields: {
    configPath: {
      title: "Ścieżka konfiguracji",
      description: "Ścieżka do pliku release.config.ts (domyślnie: release.config.ts)",
    },
    ci: {
      title: "Tryb CI",
      description: "Uruchom w trybie CI (bez interaktywnych promptów, używa ciReleaseCommand)",
    },
    forceUpdate: {
      title: "Wymuś aktualizację zależności",
      description: "Wymuś aktualizację wszystkich zależności bez pytania (pomija pozostałe kroki)",
    },
    dryRun: {
      title: "Testowe uruchomienie",
      description: "Symuluj wydanie bez wprowadzania zmian",
    },
    skipLint: {
      title: "Pomiń linting",
      description: "Pomiń krok lintingu",
    },
    skipTypecheck: {
      title: "Pomiń sprawdzanie typów",
      description: "Pomiń sprawdzanie typów TypeScript",
    },
    skipBuild: {
      title: "Pomiń budowanie",
      description: "Pomiń krok budowania",
    },
    skipTests: {
      title: "Pomiń testy",
      description: "Pomiń wykonanie testów",
    },
    skipSnyk: {
      title: "Pomiń Snyk",
      description: "Pomiń skanowanie podatności Snyk",
    },
    skipPublish: {
      title: "Pomiń publikację",
      description: "Pomiń publikację do npm/rejestru",
    },
    skipChangelog: {
      title: "Pomiń changelog",
      description: "Pomiń generowanie changelogu",
    },
    prereleaseId: {
      title: "ID Prerelease",
      description: "Identyfikator prerelease (alpha, beta, rc) dla wersjonowania",
    },
    versionIncrement: {
      title: "Inkrementacja wersji",
      description: "Typ inkrementacji wersji (patch, minor, major) - tylko w trybie lokalnym",
    },
    targetPackage: {
      title: "Pakiet docelowy",
      description: "Określ katalog pakietu docelowego (opcjonalnie, domyślnie wszystkie pakiety)",
    },
    inlineConfig: {
      title: "Konfiguracja inline",
      description: "Podaj konfigurację wydania inline zamiast używać pliku konfiguracyjnego",
    },
    skipGitTag: {
      title: "Pomiń tag Git",
      description: "Pomiń tworzenie tagu Git podczas wydania",
    },
    skipGitPush: {
      title: "Pomiń push Git",
      description: "Pomiń push do zdalnego repozytorium",
    },
    verbose: {
      title: "Verbose",
      description: "Włącz szczegółowe logowanie",
    },
    skipInstall: {
      title: "Pomiń instalację",
      description: "Pomiń krok instalacji zależności",
    },
    skipClean: {
      title: "Pomiń clean",
      description: "Pomiń krok czyszczenia przed budowaniem",
    },
    commitMessage: {
      title: "Wiadomość commita",
      description:
        // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
        "Własna wiadomość commita dla zmiany wersji (obsługuje placeholder ${version})",
    },
    notifyWebhook: {
      title: "Webhook powiadomień",
      description:
        "URL webhooka do wysyłania powiadomień o wydaniu (Slack, Discord, Teams lub własny)",
    },
    configObject: {
      title: "Obiekt konfiguracji",
      description: "Ustawienia konfiguracji wydania",
    },
    packageManager: {
      title: "Menedżer pakietów",
      description: "Menedżer pakietów do użycia (bun, npm, yarn, pnpm, deno)",
    },
    globalVersion: {
      title: "Wersja globalna",
      description: "Ustaw globalną wersję dla wszystkich pakietów w monorepo",
    },
    parallel: {
      title: "Wykonywanie równoległe",
      description: "Włącz równoległe przetwarzanie pakietów",
    },
    maxParallelJobs: {
      title: "Maks. równoległych zadań",
      description: "Maksymalna liczba równoległych zadań",
    },
    continueOnError: {
      title: "Kontynuuj przy błędzie",
      description: "Kontynuuj przetwarzanie pozostałych pakietów, jeśli jeden się nie powiedzie",
    },
    verifyGitStatus: {
      title: "Weryfikuj status Git",
      description: "Weryfikuj status Git przed wydaniem",
    },
    requireCleanWorkingDir: {
      title: "Wymagaj czystego katalogu roboczego",
      description: "Wymagaj czystego katalogu roboczego przed wydaniem",
    },
    verifyLockfile: {
      title: "Weryfikuj plik blokady",
      description: "Weryfikuj integralność pliku blokady przed wydaniem",
    },
    branch: {
      title: "Konfiguracja gałęzi",
      description: "Ustawienia konfiguracji gałęzi Git",
    },
    branchMain: {
      title: "Gałąź główna",
      description: "Nazwa gałęzi głównej/produkcyjnej",
    },
    branchDevelop: {
      title: "Gałąź deweloperska",
      description: "Nazwa gałęzi deweloperskiej",
    },
    allowNonMain: {
      title: "Zezwalaj na wydania spoza main",
      description: "Zezwalaj na wydania z gałęzi innych niż main",
    },
    protectedBranches: {
      title: "Chronione gałęzie",
      description: "Lista chronionych nazw gałęzi",
    },
    notifications: {
      title: "Powiadomienia",
      description: "Konfiguracja powiadomień dla zdarzeń wydania",
    },
    notificationsEnabled: {
      title: "Włącz powiadomienia",
      description: "Włącz powiadomienia o wydaniach",
    },
    webhookUrl: {
      title: "URL webhooka",
      description: "URL dla powiadomień webhook",
    },
    webhookType: {
      title: "Typ webhooka",
      description: "Typ webhooka (Slack, Discord, Teams, Własny)",
    },
    onSuccess: {
      title: "Powiadom przy sukcesie",
      description: "Wyślij powiadomienie przy udanym wydaniu",
    },
    onFailure: {
      title: "Powiadom przy błędzie",
      description: "Wyślij powiadomienie przy nieudanym wydaniu",
    },
    messageTemplate: {
      title: "Szablon wiadomości",
      description: "Własny szablon wiadomości dla powiadomień",
    },
    includeTimings: {
      title: "Uwzględnij czasy",
      description: "Uwzględnij informacje o czasach w powiadomieniach",
    },
    retry: {
      title: "Konfiguracja ponowień",
      description: "Ustawienia ponowień dla nieudanych operacji",
    },
    maxAttempts: {
      title: "Maks. prób",
      description: "Maksymalna liczba prób ponowienia",
    },
    delayMs: {
      title: "Opóźnienie ponowienia",
      description: "Początkowe opóźnienie między ponowieniami w milisekundach",
    },
    backoffMultiplier: {
      title: "Mnożnik cofania",
      description: "Mnożnik dla wykładniczego cofania",
    },
    maxDelayMs: {
      title: "Maks. opóźnienie",
      description: "Maksymalne opóźnienie między ponowieniami w milisekundach",
    },
    rollback: {
      title: "Konfiguracja rollbacku",
      description: "Automatyczne ustawienia rollbacku przy błędzie",
    },
    rollbackEnabled: {
      title: "Włącz rollback",
      description: "Włącz automatyczny rollback przy błędzie",
    },
    rollbackGit: {
      title: "Rollback zmian Git",
      description: "Cofnij commity i tagi Git przy błędzie",
    },
    rollbackVersion: {
      title: "Rollback zmian wersji",
      description: "Cofnij zmiany wersji przy błędzie",
    },
    packages: {
      title: "Pakiety",
      description: "Lista pakietów do wydania",
    },
    package: {
      title: "Konfiguracja pakietu",
    },
    directory: {
      title: "Katalog",
    },
    name: {
      title: "Nazwa",
    },
    updateDeps: {
      title: "Aktualizuj zależności",
      description: "Aktualizuj zależności w zależnych pakietach",
    },
    clean: {
      title: "Polecenie clean",
      description: "Polecenie lub skrypt do czyszczenia pakietu",
    },
    lint: {
      title: "Polecenie lint",
      description: "Polecenie lub skrypt do lintingu pakietu",
    },
    typecheck: {
      title: "Polecenie typecheck",
      description: "Polecenie lub skrypt do sprawdzania typów pakietu",
    },
    build: {
      title: "Polecenie build",
      description: "Polecenie lub skrypt do budowania pakietu",
    },
    test: {
      title: "Polecenie test",
      description: "Polecenie lub skrypt do testowania pakietu",
    },
    snyk: {
      title: "Skanowanie Snyk",
      description: "Włącz skanowanie bezpieczeństwa Snyk",
    },
    install: {
      title: "Polecenie install",
      description: "Polecenie lub skrypt do instalacji zależności",
    },
    release: {
      title: "Konfiguracja wydania",
    },
    releaseVersion: {
      title: "Wersja wydania",
    },
    tagPrefix: {
      title: "Prefiks tagu",
    },
    tagSuffix: {
      title: "Sufiks tagu",
    },
    ciReleaseCommand: {
      title: "Polecenie wydania CI",
      description: "Polecenie do uruchomienia w trybie CI",
    },
    ciCommand: {
      title: "Polecenie",
      description: "Tablica poleceń do wykonania",
    },
    ciEnvMapping: {
      title: "Mapowanie środowiska",
      description: "Mapowania zmiennych środowiskowych dla CI",
    },
    gitOps: {
      title: "Operacje Git",
    },
    skipTag: {
      title: "Pomiń tag",
    },
    skipPush: {
      title: "Pomiń push",
    },
    skipCommit: {
      title: "Pomiń commit",
    },
    signCommit: {
      title: "Podpisz commit",
    },
    signTag: {
      title: "Podpisz tag",
    },
    remote: {
      title: "Zdalne repozytorium",
    },
    npm: {
      title: "Konfiguracja NPM",
    },
    npmEnabled: {
      title: "Włącz publikację NPM",
    },
    npmRegistry: {
      title: "Rejestr NPM",
    },
    npmTag: {
      title: "Tag NPM",
    },
    npmAccess: {
      title: "Dostęp NPM",
    },
    otpEnvVar: {
      title: "Zmienna środowiskowa OTP",
    },
    provenance: {
      title: "Pochodzenie",
    },
    ignoreScripts: {
      title: "Ignoruj skrypty",
    },
    npmDryRun: {
      title: "Testowe uruchomienie NPM",
    },
    jsr: {
      title: "Konfiguracja JSR",
    },
    jsrEnabled: {
      title: "Włącz publikację JSR",
    },
    allowSlowTypes: {
      title: "Zezwalaj na wolne typy",
    },
    allowDirty: {
      title: "Zezwalaj na dirty",
    },
    jsrDryRun: {
      title: "Testowe uruchomienie JSR",
    },
    changelog: {
      title: "Konfiguracja changelogu",
    },
    changelogEnabled: {
      title: "Włącz changelog",
    },
    changelogFile: {
      title: "Plik changelogu",
    },
    changelogHeader: {
      title: "Nagłówek changelogu",
    },
    compareUrlFormat: {
      title: "Format URL porównania",
    },
    commitUrlFormat: {
      title: "Format URL commita",
    },
    includeBody: {
      title: "Uwzględnij treść",
    },
    changelogPreset: {
      title: "Preset changelogu",
    },
    gitRelease: {
      title: "Konfiguracja wydania Git",
    },
    gitReleaseEnabled: {
      title: "Włącz wydanie Git",
    },
    releaseTitle: {
      title: "Tytuł wydania",
    },
    generateNotes: {
      title: "Generuj notatki",
    },
    releaseBody: {
      title: "Treść wydania",
    },
    draft: {
      title: "Szkic",
    },
    prerelease: {
      title: "Prerelease",
    },
    discussionCategory: {
      title: "Kategoria dyskusji",
    },
    target: {
      title: "Cel",
    },
    assets: {
      title: "Zasoby",
      description: "Zasoby wydania do przesłania",
    },
    foldersToZip: {
      title: "Foldery do spakowania",
      description: "Foldery do spakowania dla wydania",
    },
    versionBumper: {
      title: "Zwiększacz wersji",
      description: "Konfiguracja zwiększania wersji dla plików innych niż package.json",
    },
    hooks: {
      title: "Hooki cyklu życia",
      description: "Polecenia do uruchomienia na różnych etapach",
    },
    preInstall: {
      title: "Hook pre-install",
    },
    postInstall: {
      title: "Hook post-install",
    },
    preClean: {
      title: "Hook pre-clean",
    },
    postClean: {
      title: "Hook post-clean",
    },
    preLint: {
      title: "Hook pre-lint",
    },
    postLint: {
      title: "Hook post-lint",
    },
    preBuild: {
      title: "Hook pre-build",
    },
    postBuild: {
      title: "Hook post-build",
    },
    preTest: {
      title: "Hook pre-test",
    },
    postTest: {
      title: "Hook post-test",
    },
    prePublish: {
      title: "Hook pre-publish",
    },
    postPublish: {
      title: "Hook post-publish",
    },
    preRelease: {
      title: "Hook pre-release",
    },
    postRelease: {
      title: "Hook post-release",
    },
    globalHooks: {
      title: "Globalne hooki",
      description: "Globalne hooki cyklu życia dla całego procesu wydania",
    },
  },
  response: {
    status: "Status",
    success: "Status wydania",
    output: "Log wydania",
    duration: "Czas trwania",
    packages: "Pakiety",
    packagesProcessed: "Przetworzone pakiety",
    ciEnvironment: "Środowisko CI",
    errors: "Błędy",
    warnings: "Ostrzeżenia",
    gitInfo: "Informacje Git",
    published: "Opublikowane pakiety",
    publishedPackages: "Opublikowane pakiety",
    timings: "Wydajność",
    rollbackPerformed: "Wykonano rollback",
    notificationsSent: "Powiadomienia",
  },
  table: {
    name: "Pakiet",
    directory: "Katalog",
    version: "Wersja",
    tag: "Tag",
    status: "Status",
    message: "Komunikat",
    registry: "Rejestr",
    url: "URL",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowa konfiguracja wydania",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono pliku konfiguracyjnego lub pakietu",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas procesu wydania",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd sieci podczas procesu wydania",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Brak uprawnień do wykonania wydania",
    },
    forbidden: {
      title: "Zabronione",
      description: "Odmowa dostępu do operacji wydania",
    },
    conflict: {
      title: "Konflikt",
      description: "Wykryto konflikt wydania (tag może już istnieć)",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany, które muszą zostać najpierw zatwierdzone",
    },
    packageNotFound: "Pakiet '{{targetPackage}}' nie znaleziony w konfiguracji",
    gitOperationFailed: "Operacja git nie powiodła się: {{error}}",
    gitAddFailed: "Git add nie powiodło się: {{error}}",
    gitTagFailed: "Git tag '{{tag}}' nie powiódł się: {{error}}",
    gitPushFailed: "Git push do '{{remote}}' nie powiódł się: {{error}}",
    gitPushTagFailed: "Git push tag '{{tag}}' do '{{remote}}' nie powiódł się: {{error}}",
  },
  success: {
    title: "Wydanie zakończone",
    description: "Proces wydania zakończony pomyślnie",
  },
  config: {
    fileNotFound: "Nie znaleziono pliku konfiguracyjnego: {{path}}",
    invalidFormat:
      "Nieprawidłowy format konfiguracji. Upewnij się, że konfiguracja eksportuje domyślny obiekt z tablicą 'packages'.",
    errorLoading: "Błąd ładowania konfiguracji: {{error}}",
  },
  packageJson: {
    notFound: "Nie znaleziono package.json: {{path}}",
    invalidFormat: "Nieprawidłowy format package.json: {{path}}",
    errorReading: "Błąd odczytu package.json: {{error}}",
    errorUpdatingDeps: "Błąd aktualizacji zależności dla {{directory}}: {{error}}",
    errorUpdatingVersion: "Błąd aktualizacji wersji pakietu dla {{directory}}: {{error}}",
  },
  scripts: {
    invalidPackageJson: "Nieprawidłowy format package.json w {{path}}",
    testsFailed: "Testy nie powiodły się w {{path}}: {{error}}",
    lintFailed: "Linting nie powiódł się w {{path}}",
    typecheckFailed: "Sprawdzanie typów nie powiodło się w {{path}}: {{error}}",
    buildFailed: "Budowanie nie powiodło się w {{path}}: {{error}}",
    packageJsonNotFound: "Nie znaleziono package.json w {{path}}",
  },
  snyk: {
    cliNotFound: "Nie znaleziono Snyk CLI. Zainstaluj za pomocą: npm install -g snyk",
    testFailed: "Test podatności Snyk nie powiódł się dla {{packageName}}: {{error}}",
    tokenRequired: "Zmienna środowiskowa SNYK_TOKEN wymagana dla {{packageName}}",
    orgKeyRequired: "Zmienna środowiskowa SNYK_ORG_KEY wymagana dla {{packageName}}",
    monitorFailed: "Monitor Snyk nie powiódł się dla {{packageName}}: {{error}}",
  },
  git: {
    tagCreated: "Tag Git '{{tag}}' utworzony pomyślnie",
    tagExists: "Tag Git '{{tag}}' już istnieje",
    pushSuccess: "Zmiany wypchnięte do zdalnego repozytorium",
    noCommits: "Brak nowych commitów od tagu '{{lastTag}}'",
    uncommittedChanges: "Wykryto niezatwierdzone zmiany",
    notOnMain: "Nie na gałęzi main (bieżąca: {{currentBranch}})",
    commitFailed: "Commit nie powiódł się",
    tagFailed: "Tworzenie tagu nie powiodło się",
    pushFailed: "Push do zdalnego repozytorium nie powiódł się",
  },
  version: {
    bumped: "Wersja zwiększona z {{from}} do {{to}} ({{increment}})",
    fileUpdated: "Wersja zaktualizowana w {{file}} na {{newVersion}}",
    invalidFormat: "Nieprawidłowy format wersji: {{version}}",
  },
  ci: {
    commandRunning: "Uruchamianie polecenia wydania CI dla {{package}}: {{command}}",
    commandSuccess: "Polecenie wydania CI zakończone dla {{package}}",
    commandFailed: "Polecenie wydania CI nie powiodło się dla {{package}}: {{error}}",
    commandRequired: "Tryb CI wymaga konfiguracji ciReleaseCommand dla {{package}}",
    envVarMissing: "Wymagana zmienna środowiskowa '{{variable}}' nie ustawiona dla {{package}}",
  },
  zip: {
    starting: "Pakowanie folderów...",
    complete: "Pomyślnie spakowano {{input}} do {{output}} ({{bytes}} bajtów)",
    failed: "Pakowanie {{input}} nie powiodło się: {{error}}",
    noFolders: "Brak folderów do spakowania w konfiguracji",
    inputNotFound: "Folder wejściowy {{input}} nie istnieje",
  },
  dryRun: {
    prefix: "[TEST]",
    wouldExecute: "Wykonałoby: {{action}}",
  },
  release: {
    starting: "Rozpoczynanie procesu wydania...",
    ciMode: "Uruchamianie wydania w trybie CI...",
    localMode: "Uruchamianie wydania w trybie lokalnym...",
    forceUpdate: "Wymuszanie aktualizacji zależności...",
    complete: "Proces wydania zakończony",
    failed: "Proces wydania nie powiódł się",
    processingPackage: "Przetwarzanie pakietu: {{name}}",
    packageSkipped: "Pakiet '{{name}}' pominięty: {{reason}}",
    packageComplete: "Pakiet '{{name}}' zakończony",
    packageFailed: "Pakiet '{{name}}' nie powiódł się: {{error}}",
    firstRelease: "Nie znaleziono poprzednich tagów. To będzie pierwsze wydanie.",
  },
  qualityChecks: {
    linting: "Uruchamianie lintingu dla {{package}}...",
    lintPassed: "Linting zakończony sukcesem dla {{package}}",
    lintFailed: "Linting nie powiódł się dla {{package}}",
    typeChecking: "Uruchamianie sprawdzania typów dla {{package}}...",
    typeCheckPassed: "Sprawdzanie typów zakończone sukcesem dla {{package}}",
    typeCheckFailed: "Sprawdzanie typów nie powiodło się dla {{package}}",
    building: "Budowanie {{package}}...",
    buildPassed: "Budowanie zakończone sukcesem dla {{package}}",
    buildFailed: "Budowanie nie powiodło się dla {{package}}",
    testing: "Uruchamianie testów dla {{package}}...",
    testsPassed: "Testy zakończone sukcesem dla {{package}}",
    testsFailed: "Testy nie powiodły się dla {{package}}",
    snykTesting: "Uruchamianie testu Snyk dla {{package}}...",
    snykTestPassed: "Test Snyk zakończony sukcesem dla {{package}}",
    snykTestFailed: "Test Snyk nie powiódł się dla {{package}}",
    snykMonitoring: "Uruchamianie monitora Snyk dla {{package}}...",
    snykMonitorPassed: "Monitor Snyk zakończony dla {{package}}",
    snykMonitorFailed: "Monitor Snyk nie powiódł się dla {{package}}",
  },
  dependencies: {
    updating: "Aktualizowanie zależności dla {{directory}}...",
    updated: "Zależności zaktualizowane dla {{directory}}",
    failed: "Aktualizacja zależności nie powiodła się dla {{directory}}: {{error}}",
    skipped: "Pomijanie aktualizacji zależności dla {{directory}}",
    dedupeFailed: "Deduplikacja zależności nie powiodła się dla {{directory}}: {{error}}",
  },
  security: {
    auditFailed: "Audyt bezpieczeństwa nie powiódł się dla {{directory}}: {{error}}",
  },
  hooks: {
    running: "Uruchamianie hooka {{hook}} dla {{package}}...",
    completed: "Hook {{hook}} zakończony dla {{package}}",
    failed: "Hook {{hook}} nie powiódł się dla {{package}}: {{error}}",
    skipped: "Pomijanie hooka {{hook}} (continueOnError)",
  },
  npm: {
    publishing: "Publikowanie {{package}} do npm...",
    published: "Pomyślnie opublikowano {{package}}@{{version}} do npm",
    publishFailed: "Publikacja {{package}} do npm nie powiodła się: {{error}}",
    registry: "Używanie rejestru npm: {{registry}}",
    dryRun: "[TEST] Opublikowałoby {{package}}@{{version}} do npm",
  },
  changelog: {
    generating: "Generowanie changelogu dla {{package}}...",
    generated: "Changelog wygenerowany dla {{package}}",
    failed: "Generowanie changelogu nie powiodło się dla {{package}}: {{error}}",
    noChanges: "Brak zmian do dodania do changelogu dla {{package}}",
  },
  branch: {
    checking: "Sprawdzanie statusu gałęzi...",
    notAllowed: "Wydania z gałęzi '{{branch}}' niedozwolone (main: {{main}})",
    isProtected: "Gałąź '{{branch}}' jest chroniona",
  },
  gitRelease: {
    creating: "Tworzenie wydania GitHub dla {{tag}}...",
    created: "Wydanie GitHub utworzone pomyślnie: {{url}}",
    failed: "Tworzenie wydania GitHub nie powiodło się: {{error}}",
    ghNotFound: "Nie znaleziono GitHub CLI (gh) - pomijanie wydania GitHub",
    notGitHub: "Wydania GitHub obsługiwane tylko dla repozytoriów GitHub",
  },
  validation: {
    branchNotAllowed: "Wydanie z gałęzi '{{branch}}' jest niedozwolone",
    dirtyWorkingDir: "Katalog roboczy ma niezatwierdzone zmiany",
    passed: "Wszystkie walidacje przeszły pomyślnie",
  },
  summary: {
    header: "Podsumowanie wydania",
    successCount: "{{count}} pakietów wydanych pomyślnie",
    skipCount: "{{count}} pakietów pominiętych",
    failCount: "{{count}} pakietów nieudanych",
  },
  jsr: {
    publishing: "Publikowanie {{package}} do JSR...",
    published: "Pomyślnie opublikowano {{package}} do JSR",
    failed: "Publikacja {{package}} do JSR nie powiodła się: {{error}}",
  },
  gitlab: {
    creating: "Tworzenie wydania GitLab dla {{tag}}...",
    created: "Wydanie GitLab utworzone pomyślnie: {{url}}",
    failed: "Tworzenie wydania GitLab nie powiodło się: {{error}}",
    glabNotFound: "Nie znaleziono GitLab CLI (glab) - pomijanie wydania GitLab",
  },
  lockfile: {
    checking: "Sprawdzanie integralności pliku blokady...",
    valid: "Plik blokady jest prawidłowy",
    invalid: "Sprawdzanie integralności pliku blokady nie powiodło się: {{error}}",
    missing: "Nie znaleziono pliku blokady (oczekiwano: {{expected}})",
  },
  notifications: {
    sending: "Wysyłanie powiadomienia...",
    sent: "Powiadomienie wysłane pomyślnie",
    failed: "Wysłanie powiadomienia nie powiodło się: {{error}}",
    disabled: "Powiadomienia wyłączone",
  },
  retry: {
    attempt: "Próba ponowienia {{attempt}} z {{maxAttempts}} dla {{operation}}",
    failed: "Wszystkie próby ponowienia nie powiodły się dla {{operation}}",
    success: "Operacja {{operation}} powiodła się po ponowieniu",
  },
  rollback: {
    starting: "Rozpoczynanie rollbacku...",
    complete: "Rollback zakończony pomyślnie",
    failed: "Rollback nie powiódł się: {{error}}",
    git: "Cofanie zmian Git...",
    version: "Cofanie zmian wersji...",
  },
  timings: {
    report: "Rozkład czasowy",
    validation: "Walidacja",
    install: "Instalacja",
    clean: "Czyszczenie",
    lint: "Linting",
    typecheck: "Sprawdzanie typów",
    build: "Budowanie",
    test: "Testy",
    publish: "Publikacja",
    changelog: "Changelog",
    gitOperations: "Operacje Git",
  },
};
