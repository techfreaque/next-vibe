import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Builder",
  description: "Narzędzie do budowania i pakowania projektu",
  cli: {
    build: {
      description: "Typ kompilacji: build",
      configOption: "określ ścieżkę do pliku konfiguracyjnego",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "Rozwój",
      production: "Produkcja",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "Vanilla JS",
      executable: "Wykonywalny (Bun)",
    },
    bunTarget: {
      bun: "Środowisko Bun",
      node: "Node.js",
      browser: "Przeglądarka",
    },
    sourcemap: {
      external: "Zewnętrzne (plik .map)",
      inline: "Wbudowane",
      none: "Brak (wyłączone)",
    },
    format: {
      esm: "ES Module",
      cjs: "CommonJS",
      iife: "IIFE (przeglądarka)",
    },
    viteMinify: {
      esbuild: "esbuild (szybki)",
      terser: "Terser (mały)",
      false: "Wyłączone",
    },
    viteLibFormat: {
      es: "ES Module",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "Włączone",
      false: "Wyłączone",
      inline: "Wbudowane",
      hidden: "Ukryte",
    },
  },
  errors: {
    inputFileNotFound: "Plik wejściowy {{filePath}} nie istnieje",
    invalidOutputFileName: "Nazwa pliku wyjściowego jest nieprawidłowa",
    invalidBuildConfig:
      "Nieprawidłowy format konfiguracji build. Upewnij się, że konfiguracja eksportuje domyślny obiekt BuildConfig.",
    configNotFound: "Nie znaleziono pliku konfiguracyjnego: {{path}}",
    inputRequired: "Plik wejściowy jest wymagany dla tego celu kompilacji",
  },
  messages: {
    buildStart: "Rozpoczynanie kompilacji...",
    cleaningDist: "Czyszczenie katalogu wyjściowego...",
    cleaningFolders: "Czyszczenie folderów...",
    buildingVersion: "Budowanie wersji {{version}}...",
    bundlingCli: "Pakowanie CLI z Bun...",
    bundleFailed: "Pakowanie nie powiodło się",
    bundleSuccess: "CLI spakowane pomyślnie",
    creatingPackageJson: "Tworzenie package.json...",
    copyingFiles: "Kopiowanie README i LICENSE...",
    copyingAdditionalFiles: "Kopiowanie dodatkowych plików...",
    publishInstructions: "Aby opublikować:",
    buildComplete: "Kompilacja zakończona!",
    buildFailed: "Kompilacja nie powiodła się",
    loadingConfig: "Ładowanie konfiguracji z {{path}}...",
    cleaningFolder: "Czyszczenie folderu: {{folder}}",
    compilingFiles: "Kompilowanie plików za pomocą Vite...",
    compilingFile: "Kompilowanie: {{file}}",
    fileCompiled: "Skompilowano: {{file}}",
    buildingWithVite: "Budowanie z Vite ({{type}})...",
    usingInlineConfig: "Używanie konfiguracji wbudowanej...",
    filesCopied: "Pliki skopiowane pomyślnie",
    dryRunMode: "[PRÓBA] Żadne zmiany nie zostaną wprowadzone",
    buildSummary: "Podsumowanie kompilacji:",
    totalDuration: "Całkowity czas",
    filesBuilt: "Zbudowane pliki",
    filesCopiedCount: "Skopiowane pliki",
    stepsCompleted: "Ukończone kroki",
    usingProfile: "Używanie profilu: {{profile}}",
    runningPreBuild: "Uruchamianie hook pre-build...",
    runningPostBuild: "Uruchamianie hook post-build...",
    preBuildComplete: "Hook pre-build zakończony",
    postBuildComplete: "Hook post-build zakończony",
    analyzingBundles: "Analizowanie rozmiarów paczek...",
    bundleAnalysis: "Analiza paczki",
    totalSize: "Całkowity rozmiar",
    largestFiles: "Największe pliki",
    criticalSize: "KRYTYCZNE: Paczka przekracza próg {{size}}",
    largeBundle: "OSTRZEŻENIE: Paczka jest duża ({{size}})",
    considerTreeShaking:
      "Rozważ włączenie tree-shaking, aby zmniejszyć rozmiar paczki",
    checkLargeDeps:
      "Sprawdź duże zależności, które można zastąpić",
    largeSourcemaps:
      "Wykryto duże sourcemapy - rozważ wyłączenie ich w produkcji",
    possibleDuplicates:
      "Wykryto możliwe zduplikowane zależności - rozważ deduplikację",
    optimizationTips: "Wskazówki optymalizacyjne",
    suggestions: "Sugestie",
    validatingConfig: "Walidacja konfiguracji kompilacji...",
    configValid: "Konfiguracja jest prawidłowa",
    configWarnings: "Ostrzeżenia konfiguracji",
    emptyConfig: "Pusta konfiguracja - brak zdefiniowanych kroków kompilacji",
    outputIsDirectory:
      "Ścieżka wyjściowa powinna być plikiem, nie katalogiem: {{path}}",
    tsEntrypointWithNode:
      "Punkt wejścia TypeScript z celem Node - rozważ użycie celu Bun dla lepszej kompatybilności",
    sourceNotFound: "Nie znaleziono pliku źródłowego: {{path}}",
    checkFilePaths:
      "Sprawdź, czy wszystkie ścieżki plików są poprawne i pliki istnieją",
    runFromProjectRoot:
      "Upewnij się, że uruchamiasz z głównego katalogu projektu",
    checkPermissions:
      "Sprawdź uprawnienia do plików dla katalogów wejściowych i wyjściowych",
    checkDependencies:
      "Niektóre zależności mogą brakować - sprawdź importy",
    runInstall:
      "Spróbuj uruchomić 'bun install', aby upewnić się, że wszystkie zależności są dostępne",
    increaseMemory:
      "Dla dużych kompilacji spróbuj zwiększyć pamięć: NODE_OPTIONS=--max-old-space-size=4096",
    useExternals:
      "Rozważ oznaczenie dużych zależności jako zewnętrzne",
    checkSyntax: "Sprawdź pliki źródłowe pod kątem błędów składni",
    runTypecheck:
      "Uruchom 'bun typecheck', aby sprawdzić błędy typów",
    watchModeStarted: "Tryb obserwacji uruchomiony - oczekiwanie na zmiany plików...",
    watchModeRebuild: "Plik zmieniony: {{file}} - przebudowywanie...",
    watchModeReady: "Kompilacja zakończona - obserwowanie zmian...",
    watchModeError: "Błąd trybu obserwacji: {{error}}",
    watchModeStopped: "Tryb obserwacji zatrzymany",
    parallelCompiling: "Kompilowanie {{count}} plików równolegle...",
    parallelComplete:
      "Kompilacja równoległa zakończona: {{count}} plików w {{duration}}ms",
    cacheHit: "Trafienie cache: {{file}} (pominięto)",
    cacheMiss: "Pudło cache: {{file}} (przebudowywanie)",
    cacheCleared: "Cache kompilacji wyczyszczony",
    cacheStats:
      "Cache: {{hits}} trafień, {{misses}} pudel ({{hitRate}}% trafień)",
    generatingReport: "Generowanie raportu kompilacji...",
    reportGenerated: "Raport kompilacji wygenerowany: {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "Budowanie...",
    spinnerCompiling: "Kompilowanie...",
    spinnerBundling: "Pakowanie...",
  },
  post: {
    title: "Zbuduj pakiet",
    description:
      "Kompleksowe narzędzie do kompilacji obsługujące pakowanie CLI, kompilacje Vite, React/Tailwind i dystrybucję npm",
    form: {
      title: "Konfiguracja kompilacji",
      description:
        "Skonfiguruj ustawienia kompilacji lub użyj pliku build.config.ts",
    },
    fields: {
      configPath: {
        title: "Ścieżka pliku konfiguracyjnego",
        description: "Ścieżka do pliku konfiguracyjnego kompilacji (build.config.ts)",
      },
      configObject: {
        title: "Opcje kompilacji",
        description: "Wbudowana konfiguracja kompilacji (nadpisuje plik konfiguracyjny)",
      },
      profile: {
        title: "Profil kompilacji",
        description: "Rozwój (szybki, debug) lub Produkcja (zoptymalizowany, zminifikowany)",
      },
      dryRun: {
        title: "Próba",
        description: "Podgląd bez faktycznego wykonania",
      },
      verbose: {
        title: "Szczegółowe wyjście",
        description: "Pokaż szczegółowe informacje o kompilacji i postępie",
      },
      analyze: {
        title: "Analiza paczki",
        description: "Analizuj rozmiary paczek i identyfikuj możliwości optymalizacji",
      },
      watch: {
        title: "Tryb obserwacji",
        description: "Obserwuj zmiany plików i przebudowuj automatycznie",
      },
      parallel: {
        title: "Kompilacja równoległa",
        description: "Kompiluj wiele plików równolegle dla szybszych kompilacji",
      },
      cache: {
        title: "Cache kompilacji",
        description: "Cachuj artefakty kompilacji, aby pomijać niezmienione pliki",
      },
      report: {
        title: "Generuj raport",
        description: "Generuj raport kompilacji JSON ze szczegółowymi metrykami",
      },
      minify: {
        title: "Minifikuj",
        description: "Minifikuj wyjściową paczkę (nadpisuje ustawienie profilu)",
      },
      foldersToClean: {
        title: "Foldery do wyczyszczenia",
        description: "Foldery do usunięcia przed kompilacją (np. dist, build)",
      },
      filesToCompile: {
        title: "Pliki do skompilowania",
        description: "Lista plików do skompilowania za pomocą Vite lub Bun",
      },
      fileToCompile: {
        title: "Konfiguracja pliku",
      },
      input: {
        title: "Plik wejściowy",
        description: "Ścieżka pliku punktu wejścia (np. src/index.ts)",
      },
      output: {
        title: "Plik wyjściowy",
        description: "Ścieżka pliku wyjściowego (np. dist/index.js)",
      },
      type: {
        title: "Typ kompilacji",
        description: "Typ kompilacji: React, Vanilla JS lub Wykonywalny",
      },
      modulesToExternalize: {
        title: "Zewnętrzne moduły",
        description: "Moduły do wykluczenia z paczki (np. react, lodash)",
      },
      inlineCss: {
        title: "Wbudowany CSS",
        description: "Wstrzyknij CSS bezpośrednio do paczki JavaScript",
      },
      bundleReact: {
        title: "Dołącz React",
        description: "Dołącz React do paczki zamiast jako zewnętrzny",
      },
      packageConfig: {
        title: "Konfiguracja pakietu",
        description: "Ustawienia dla kompilacji bibliotek z deklaracjami TypeScript",
      },
      isPackage: {
        title: "Jest pakietem",
        description: "Włącz tryb biblioteki z eksportami pakietu",
      },
      dtsInclude: {
        title: "DTS Include",
        description: "Wzorce glob dla plików TypeScript do uwzględnienia w deklaracjach",
      },
      dtsEntryRoot: {
        title: "DTS Entry Root",
        description: "Katalog główny dla generowania plików deklaracji",
      },
      bunOptions: {
        title: "Opcje Bun",
        description: "Opcje kompilacji specyficzne dla Bun dla kompilacji wykonywalnych",
      },
      bunTarget: {
        title: "Docelowe środowisko",
        description: "Docelowe środowisko: Bun, Node.js lub Przeglądarka",
      },
      bunMinify: {
        title: "Minifikuj",
        description: "Włącz minifikację dla mniejszego wyjścia",
      },
      sourcemap: {
        title: "Source Maps",
        description: "Generuj source maps do debugowania",
      },
      external: {
        title: "Zewnętrzne moduły",
        description: "Moduły do wykluczenia z paczki",
      },
      define: {
        title: "Zdefiniuj stałe",
        description: "Stałe czasu kompilacji jako JSON (np. process.env.NODE_ENV)",
      },
      splitting: {
        title: "Podział kodu",
        description: "Włącz podział kodu dla wspólnych chunków",
      },
      format: {
        title: "Format wyjściowy",
        description: "Format modułu: ESM, CommonJS lub IIFE",
      },
      bytecode: {
        title: "Bytecode",
        description: "Kompiluj do bytecode Bun dla szybszego uruchamiania",
      },
      banner: {
        title: "Banner",
        description: "Tekst do dodania na początku wyjścia (np. linia shebang)",
      },
      footer: {
        title: "Stopka",
        description: "Tekst do dodania na końcu wyjścia",
      },
      viteOptions: {
        title: "Opcje Vite",
        description: "Zaawansowana konfiguracja kompilacji Vite",
      },
      viteTarget: {
        title: "Cel kompilacji",
        description: "Cele przeglądarki/środowiska (np. es2020, chrome80)",
      },
      viteOutDir: {
        title: "Katalog wyjściowy",
        description: "Katalog dla wyjścia kompilacji",
      },
      viteAssetsDir: {
        title: "Katalog zasobów",
        description: "Podkatalog dla statycznych zasobów",
      },
      viteAssetsInlineLimit: {
        title: "Limit wbudowania",
        description: "Maksymalny rozmiar (bajty) do wbudowania zasobów jako base64",
      },
      viteChunkSizeWarningLimit: {
        title: "Ostrzeżenie o rozmiarze chunka",
        description: "Rozmiar chunka (KB), który wyzwala ostrzeżenie",
      },
      viteCssCodeSplit: {
        title: "Podział kodu CSS",
        description: "Podziel CSS na osobne pliki na chunk",
      },
      viteSourcemap: {
        title: "Source Maps",
        description: "Tryb generowania source map",
      },
      viteMinify: {
        title: "Minifikator",
        description: "Narzędzie do minifikacji: esbuild lub terser",
      },
      viteEmptyOutDir: {
        title: "Wyczyść katalog wyjściowy",
        description: "Wyczyść katalog wyjściowy przed kompilacją",
      },
      viteReportCompressedSize: {
        title: "Raportuj skompresowany",
        description: "Raportuj rozmiary paczek gzipped",
      },
      viteManifest: {
        title: "Manifest kompilacji",
        description: "Generuj manifest.json do fingerprintingu zasobów",
      },
      viteLib: {
        title: "Tryb biblioteki",
        description: "Skonfiguruj tryb kompilacji biblioteki Vite",
      },
      viteLibEntry: {
        title: "Punkt wejścia",
        description: "Plik(i) punktu wejścia biblioteki",
      },
      viteLibName: {
        title: "Nazwa biblioteki",
        description: "Globalna nazwa zmiennej dla kompilacji UMD/IIFE",
      },
      viteLibFormats: {
        title: "Formaty wyjściowe",
        description: "Formaty wyjściowe biblioteki (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "Nazwa pliku",
        description: "Nazwa pliku wyjściowego (bez rozszerzenia)",
      },
      viteRollupOptions: {
        title: "Opcje Rollup",
        description: "Zaawansowana konfiguracja bundlera Rollup",
      },
      rollupExternal: {
        title: "Zewnętrzne moduły",
        description: "Moduły do wykluczenia z paczki",
      },
      rollupTreeshake: {
        title: "Tree Shaking",
        description: "Usuń nieużywany kod z paczki",
      },
      filesOrFoldersToCopy: {
        title: "Pliki do skopiowania",
        description: "Pliki lub foldery do skopiowania po kompilacji",
      },
      copyConfig: {
        title: "Konfiguracja kopiowania",
      },
      copyInput: {
        title: "Źródło",
        description: "Ścieżka pliku lub folderu źródłowego",
      },
      copyOutput: {
        title: "Cel",
        description: "Ścieżka pliku lub folderu docelowego",
      },
      copyPattern: {
        title: "Wzorzec",
        description: "Wzorzec glob do filtrowania plików",
      },
      npmPackage: {
        title: "Pakiet NPM",
        description: "Generuj package.json do dystrybucji npm",
      },
      packageName: {
        title: "Nazwa pakietu",
        description: "Nazwa pakietu npm (np. @scope/package)",
      },
      packageVersion: {
        title: "Wersja",
        description: "Wersja pakietu (domyślnie: root package.json)",
      },
      packageDescription: {
        title: "Opis",
        description: "Krótki opis pakietu dla npm",
      },
      packageMain: {
        title: "Główny punkt wejścia",
        description: "Punkt wejścia CommonJS (pole main)",
      },
      packageModule: {
        title: "Punkt wejścia modułu",
        description: "Punkt wejścia ES module (pole module)",
      },
      packageTypes: {
        title: "Punkt wejścia typów",
        description: "Punkt wejścia deklaracji TypeScript (pole types)",
      },
      packageBin: {
        title: "Pliki binarne",
        description: "Mapowania wykonywalnych CLI jako JSON",
      },
      packageExports: {
        title: "Mapa eksportów",
        description: "Pole exports pakietu jako JSON",
      },
      packageDependencies: {
        title: "Zależności",
        description: "Zależności runtime jako JSON",
      },
      packagePeerDependencies: {
        title: "Zależności peer",
        description: "Zależności peer jako JSON",
      },
      packageFiles: {
        title: "Dołączone pliki",
        description: "Pliki do dołączenia do opublikowanego pakietu",
      },
      packageKeywords: {
        title: "Słowa kluczowe",
        description: "Słowa kluczowe wyszukiwania npm",
      },
      packageLicense: {
        title: "Licencja",
        description: "Licencja pakietu (np. MIT, Apache-2.0)",
      },
      packageRepository: {
        title: "Repozytorium",
        description: "URL repozytorium Git",
      },
      success: {
        title: "Sukces",
      },
      buildOutput: {
        title: "Wyjście kompilacji",
      },
      duration: {
        title: "Czas (ms)",
      },
      outputPath: {
        title: "Ścieżka wyjściowa",
      },
      filesBuilt: {
        title: "Zbudowane pliki",
      },
      filesCopied: {
        title: "Skopiowane pliki",
      },
      packageJson: {
        title: "Wygenerowany package.json",
      },
      profileUsed: {
        title: "Użyty profil",
      },
      cacheStats: {
        title: "Statystyki cache",
        description: "Metryki wydajności cache kompilacji",
      },
      reportPath: {
        title: "Ścieżka raportu",
        description: "Ścieżka do wygenerowanego raportu kompilacji",
      },
      stepTimings: {
        title: "Czasy kroków",
        description: "Szczegółowy podział czasu dla każdego kroku kompilacji",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podana konfiguracja kompilacji jest nieprawidłowa",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas procesu kompilacji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do uruchamiania kompilacji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do systemu kompilacji jest zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas procesu kompilacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Określony plik lub konfiguracja nie zostały znalezione",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany, które mogą wpłynąć na kompilację",
      },
      conflict: {
        title: "Konflikt kompilacji",
        description: "Konfliktująca operacja kompilacji jest już w toku",
      },
    },
    success: {
      title: "Kompilacja zakończona pomyślnie",
      description: "Pakiet zbudowany pomyślnie",
    },
  },
  tags: {
    build: "build",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "Rozwój",
    production: "Produkcja",
  },
  analysis: {
    criticalSize: "KRYTYCZNE: Rozmiar paczki ({{size}}) przekracza próg",
    largeBundle: "OSTRZEŻENIE: Wykryto dużą paczkę ({{size}})",
  },
};
