import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Builder",
  description: "Build- und Bundle-Tool für das Projekt",
  cli: {
    build: {
      description: "Build-Typ: build",
      configOption: "Konfigurationsdateipfad angeben",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "Entwicklung",
      production: "Produktion",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "Vanilla JS",
      executable: "Ausführbar (Bun)",
    },
    bunTarget: {
      bun: "Bun-Runtime",
      node: "Node.js",
      browser: "Browser",
    },
    sourcemap: {
      external: "Extern (.map-Datei)",
      inline: "Inline (eingebettet)",
      none: "Keine (deaktiviert)",
    },
    format: {
      esm: "ES-Modul",
      cjs: "CommonJS",
      iife: "IIFE (Browser)",
    },
    viteMinify: {
      esbuild: "esbuild (schnell)",
      terser: "Terser (klein)",
      false: "Deaktiviert",
    },
    viteLibFormat: {
      es: "ES-Modul",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "Aktiviert",
      false: "Deaktiviert",
      inline: "Inline",
      hidden: "Versteckt",
    },
  },
  errors: {
    inputFileNotFound: "Eingabedatei {{filePath}} existiert nicht",
    invalidOutputFileName: "Ausgabedateiname ist ungültig",
    invalidBuildConfig:
      "Ungültiges Build-Config-Format. Stellen Sie sicher, dass die Konfiguration ein Standard-BuildConfig-Objekt exportiert.",
    configNotFound: "Konfigurationsdatei nicht gefunden: {{path}}",
    inputRequired: "Eingabedatei ist für dieses Build-Ziel erforderlich",
    emptyConfig: "Leere Konfiguration - keine Build-Schritte definiert",
  },
  warnings: {
    outputIsDirectory:
      "Ausgabepfad sollte eine Datei sein, kein Verzeichnis: {{path}}",
    sourceNotFound: "Quelldatei nicht gefunden: {{path}}",
  },
  suggestions: {
    checkFilePaths:
      "Überprüfen Sie, ob alle Dateipfade korrekt sind und die Dateien existieren",
    runFromProjectRoot:
      "Stellen Sie sicher, dass Sie vom Projektstammverzeichnis aus ausführen",
    checkPermissions:
      "Überprüfen Sie die Dateiberechtigungen für Ein- und Ausgabeverzeichnisse",
    checkDependencies:
      "Einige Abhängigkeiten könnten fehlen - überprüfen Sie die Imports",
    runInstall:
      "Versuchen Sie 'bun install' auszuführen, um sicherzustellen, dass alle Abhängigkeiten verfügbar sind",
    increaseMemory:
      "Für große Builds versuchen Sie, den Speicher zu erhöhen: NODE_OPTIONS=--max-old-space-size=4096",
    useExternals:
      "Erwägen Sie, große Abhängigkeiten als extern zu markieren",
    checkSyntax: "Überprüfen Sie Ihre Quelldateien auf Syntaxfehler",
    runTypecheck:
      "Führen Sie 'bun typecheck' aus, um Typfehler zu überprüfen",
    increaseTimeout: "Erhöhen Sie den Timeout-Wert für die Build-Operation",
    checkNetworkConnection: "Überprüfen Sie Ihre Netzwerkverbindung",
    checkDiskSpace: "Überprüfen Sie den verfügbaren Speicherplatz",
    cleanBuildCache: "Versuchen Sie, den Build-Cache und temporäre Dateien zu löschen",
  },
  messages: {
    buildStart: "Build wird gestartet...",
    cleaningDist: "Ausgabeverzeichnis wird bereinigt...",
    cleaningFolders: "Ordner werden bereinigt...",
    buildingVersion: "Version {{version}} wird gebaut...",
    bundlingCli: "CLI wird mit Bun gebündelt...",
    bundleFailed: "Bundle fehlgeschlagen",
    bundleSuccess: "CLI erfolgreich gebündelt",
    creatingPackageJson: "package.json wird erstellt...",
    copyingFiles: "README und LICENSE werden kopiert...",
    copyingAdditionalFiles: "Zusätzliche Dateien werden kopiert...",
    publishInstructions: "Zum Veröffentlichen:",
    buildComplete: "Build abgeschlossen!",
    buildFailed: "Build fehlgeschlagen",
    loadingConfig: "Konfiguration wird geladen von {{path}}...",
    cleaningFolder: "Ordner wird bereinigt: {{folder}}",
    compilingFiles: "Dateien werden mit Vite kompiliert...",
    compilingFile: "Kompiliere: {{file}}",
    fileCompiled: "Kompiliert: {{file}}",
    buildingWithVite: "Build mit Vite ({{type}})...",
    usingInlineConfig: "Verwende Inline-Konfiguration...",
    filesCopied: "Dateien erfolgreich kopiert",
    dryRunMode: "[TESTLAUF] Keine Änderungen werden vorgenommen",
    buildSummary: "Build-Zusammenfassung:",
    totalDuration: "Gesamtdauer",
    filesBuilt: "Erstellte Dateien",
    filesCopiedCount: "Kopierte Dateien",
    stepsCompleted: "Abgeschlossene Schritte",
    usingProfile: "Verwende Profil: {{profile}}",
    runningPreBuild: "Pre-Build-Hook wird ausgeführt...",
    runningPostBuild: "Post-Build-Hook wird ausgeführt...",
    preBuildComplete: "Pre-Build-Hook abgeschlossen",
    postBuildComplete: "Post-Build-Hook abgeschlossen",
    analyzingBundles: "Bundle-Größen werden analysiert...",
    bundleAnalysis: "Bundle-Analyse",
    optimizationTips: "Optimierungstipps",
    suggestions: "Vorschläge",
    validatingConfig: "Build-Konfiguration wird validiert...",
    configValid: "Konfiguration ist gültig",
    configWarnings: "Konfigurationswarnungen",
    tsEntrypointWithNode:
      "TypeScript-Einstiegspunkt mit Node-Ziel - erwägen Sie Bun-Ziel für bessere Kompatibilität",
    watchModeStarted: "Watch-Modus gestartet - warte auf Dateiänderungen...",
    watchModeRebuild: "Datei geändert: {{file}} - baue neu...",
    watchModeReady: "Build abgeschlossen - überwache Änderungen...",
    watchModeError: "Watch-Modus-Fehler: {{error}}",
    watchModeStopped: "Watch-Modus gestoppt",
    parallelCompiling: "Kompiliere {{count}} Dateien parallel...",
    parallelComplete:
      "Parallele Kompilierung abgeschlossen: {{count}} Dateien in {{duration}}ms",
    cacheHit: "Cache-Treffer: {{file}} (übersprungen)",
    cacheMiss: "Cache-Fehler: {{file}} (baue neu)",
    cacheCleared: "Build-Cache geleert",
    cacheStats:
      "Cache: {{hits}} Treffer, {{misses}} Fehlschläge ({{hitRate}}% Trefferrate)",
    generatingReport: "Generiere Build-Bericht...",
    reportGenerated: "Build-Bericht generiert: {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "Baue...",
    spinnerCompiling: "Kompiliere...",
    spinnerBundling: "Bündle...",
  },
  post: {
    title: "Paket erstellen",
    description:
      "Umfassendes Build-Tool für CLI-Bundling, Vite-Builds, React/Tailwind und npm-Distribution",
    form: {
      title: "Build-Konfiguration",
      description:
        "Build-Einstellungen konfigurieren oder build.config.ts Datei verwenden",
    },
    fields: {
      configPath: {
        title: "Konfigurationsdateipfad",
        description: "Pfad zur Build-Konfigurationsdatei (build.config.ts)",
        placeholder: "build.config.ts",
      },
      configObject: {
        title: "Build-Optionen",
        description: "Inline-Build-Konfiguration (überschreibt Konfigurationsdatei)",
      },
      profile: {
        title: "Build-Profil",
        description: "Entwicklung (schnell, Debug) oder Produktion (optimiert, minifiziert)",
      },
      dryRun: {
        title: "Testlauf",
        description: "Vorschau ohne tatsächliche Ausführung",
      },
      verbose: {
        title: "Ausführliche Ausgabe",
        description: "Detaillierte Build-Informationen und Fortschritt anzeigen",
      },
      analyze: {
        title: "Bundle-Analyse",
        description: "Bundle-Größen analysieren und Optimierungsmöglichkeiten identifizieren",
      },
      watch: {
        title: "Watch-Modus",
        description: "Dateiänderungen überwachen und automatisch neu bauen",
      },
      parallel: {
        title: "Paralleler Build",
        description: "Mehrere Dateien parallel kompilieren für schnellere Builds",
      },
      cache: {
        title: "Build-Cache",
        description: "Build-Artefakte cachen, um unveränderte Dateien zu überspringen",
      },
      report: {
        title: "Bericht generieren",
        description: "JSON-Build-Bericht mit detaillierten Metriken generieren",
      },
      minify: {
        title: "Minifizieren",
        description: "Ausgabe-Bundle minifizieren (überschreibt Profileinstellung)",
      },
      foldersToClean: {
        title: "Zu bereinigende Ordner",
        description: "Ordner, die vor dem Build gelöscht werden (z.B. dist, build)",
        placeholder: "dist, build, .cache",
      },
      filesToCompile: {
        title: "Zu kompilierende Dateien",
        description: "Liste der Dateien, die mit Vite oder Bun kompiliert werden",
      },
      fileToCompile: {
        title: "Dateikonfiguration",
      },
      input: {
        title: "Eingabedatei",
        description: "Einstiegspunkt-Dateipfad (z.B. src/index.ts)",
        placeholder: "src/index.ts",
      },
      output: {
        title: "Ausgabedatei",
        description: "Ausgabe-Dateipfad (z.B. dist/index.js)",
        placeholder: "dist/index.js",
      },
      type: {
        title: "Build-Typ",
        description: "Art des Builds: React, Vanilla JS oder Ausführbar",
      },
      modulesToExternalize: {
        title: "Externe Module",
        description: "Module, die vom Bundle ausgeschlossen werden (z.B. react, lodash)",
        placeholder: "react, react-dom, lodash",
      },
      inlineCss: {
        title: "CSS einbetten",
        description: "CSS direkt in JavaScript-Bundle einbetten",
      },
      bundleReact: {
        title: "React bündeln",
        description: "React ins Bundle einschließen statt als extern",
      },
      packageConfig: {
        title: "Paket-Konfiguration",
        description: "Einstellungen für Library-Builds mit TypeScript-Deklarationen",
      },
      isPackage: {
        title: "Ist Paket",
        description: "Library-Modus mit Paket-Exports aktivieren",
      },
      dtsInclude: {
        title: "DTS-Include",
        description: "Glob-Muster für TypeScript-Dateien in Deklarationen",
        placeholder: "src/**/*.ts",
      },
      dtsEntryRoot: {
        title: "DTS-Entry-Root",
        description: "Wurzelverzeichnis für Deklarationsdateigenerierung",
        placeholder: "src",
      },
      bunOptions: {
        title: "Bun-Optionen",
        description: "Bun-spezifische Build-Optionen für ausführbare Builds",
      },
      bunTarget: {
        title: "Ziel-Runtime",
        description: "Ziel-Runtime: Bun, Node.js oder Browser",
      },
      bunMinify: {
        title: "Minifizieren",
        description: "Minifizierung für kleinere Ausgabe aktivieren",
      },
      sourcemap: {
        title: "Source Maps",
        description: "Source Maps für Debugging generieren",
      },
      external: {
        title: "Externe Module",
        description: "Module, die vom Bundle ausgeschlossen werden",
        placeholder: "react, react-dom",
      },
      define: {
        title: "Konstanten definieren",
        description: "Compile-Zeit-Konstanten als JSON (z.B. process.env.NODE_ENV)",
        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
      },
      splitting: {
        title: "Code-Splitting",
        description: "Code-Splitting für gemeinsame Chunks aktivieren",
      },
      format: {
        title: "Ausgabeformat",
        description: "Modulformat: ESM, CommonJS oder IIFE",
      },
      bytecode: {
        title: "Bytecode",
        description: "Zu Bun-Bytecode kompilieren für schnelleren Start",
      },
      banner: {
        title: "Banner",
        description: "Text, der der Ausgabe vorangestellt wird (z.B. Shebang-Zeile)",
        placeholder: "#!/usr/bin/env node",
      },
      footer: {
        title: "Footer",
        description: "Text, der an die Ausgabe angehängt wird",
        placeholder: "// End of file",
      },
      publicPath: {
        title: "Öffentlicher Pfad",
        label: "Öffentlicher Pfad",
        description: "Öffentliches Pfadpräfix für Assets",
      },
      naming: {
        title: "Benennung",
        label: "Benennung",
        description: "Ausgabe-Benennungsmuster",
      },
      root: {
        title: "Wurzel",
        label: "Wurzel",
        description: "Wurzelverzeichnis",
      },
      conditions: {
        title: "Bedingungen",
        label: "Bedingungen",
        description: "Export-Bedingungen",
      },
      loader: {
        title: "Loader",
        label: "Loader",
        description: "Datei-Loader-Zuordnung",
      },
      drop: {
        title: "Drop",
        label: "Drop",
        description: "Zu entfernende Bezeichner",
      },
      viteOptions: {
        title: "Vite-Optionen",
        description: "Erweiterte Vite-Build-Konfiguration",
      },
      viteTarget: {
        title: "Build-Ziel",
        description: "Browser/Umgebungs-Ziele (z.B. es2020, chrome80)",
        placeholder: "es2020, chrome80, node18",
      },
      viteOutDir: {
        title: "Ausgabeverzeichnis",
        description: "Verzeichnis für Build-Ausgabe",
        placeholder: "dist",
      },
      viteAssetsDir: {
        title: "Assets-Verzeichnis",
        description: "Unterverzeichnis für statische Assets",
        placeholder: "assets",
      },
      viteAssetsInlineLimit: {
        title: "Inline-Limit",
        description: "Maximale Größe (Bytes) zum Inline-Einbetten von Assets als Base64",
        placeholder: "4096",
      },
      viteChunkSizeWarningLimit: {
        title: "Chunk-Größen-Warnung",
        description: "Chunk-Größe (KB), die eine Warnung auslöst",
        placeholder: "500",
      },
      viteCssCodeSplit: {
        title: "CSS-Code-Splitting",
        description: "CSS in separate Dateien pro Chunk aufteilen",
      },
      viteSourcemap: {
        title: "Source Maps",
        description: "Source-Map-Generierungsmodus",
      },
      viteMinify: {
        title: "Minifizierer",
        description: "Minifizierungstool: esbuild oder terser",
      },
      viteEmptyOutDir: {
        title: "Ausgabeverzeichnis leeren",
        description: "Ausgabeverzeichnis vor dem Build bereinigen",
      },
      viteReportCompressedSize: {
        title: "Komprimiert berichten",
        description: "Gzipped Bundle-Größen berichten",
      },
      viteManifest: {
        title: "Build-Manifest",
        description: "manifest.json für Asset-Fingerprinting generieren",
      },
      viteLib: {
        title: "Library-Modus",
        description: "Vite-Library-Build-Modus konfigurieren",
      },
      viteLibEntry: {
        title: "Einstiegspunkt",
        description: "Library-Einstiegspunkt-Datei(en)",
        placeholder: "src/index.ts",
      },
      viteLibName: {
        title: "Library-Name",
        description: "Globaler Variablenname für UMD/IIFE-Builds",
        placeholder: "MyLibrary",
      },
      viteLibFormats: {
        title: "Ausgabeformate",
        description: "Library-Ausgabeformate (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "Dateiname",
        description: "Ausgabedateiname (ohne Erweiterung)",
        placeholder: "my-library",
      },
      viteRollupOptions: {
        title: "Rollup-Optionen",
        description: "Erweiterte Rollup-Bundler-Konfiguration",
      },
      rollupExternal: {
        title: "Externe Module",
        description: "Module, die vom Bundle ausgeschlossen werden",
        placeholder: "react, react-dom",
      },
      rollupTreeshake: {
        title: "Tree Shaking",
        description: "Unbenutzten Code aus Bundle entfernen",
      },
      rollupOutput: {
        title: "Rollup-Ausgabe-Optionen",
        label: "Rollup-Ausgabe-Optionen",
        description: "Passthrough Rollup-Ausgabe-Optionen",
      },
      vitePlugins: {
        title: "Vite-Plugins",
        label: "Vite-Plugins",
        description: "Raw Vite-Plugins-Array (für programmatische Nutzung)",
      },
      viteBuild: {
        title: "Raw Build-Optionen",
        label: "Raw Build-Optionen",
        description: "Passthrough Vite-Build-Optionen",
      },
      filesOrFoldersToCopy: {
        title: "Zu kopierende Dateien",
        description: "Dateien oder Ordner, die nach der Kompilierung kopiert werden",
      },
      copyConfig: {
        title: "Kopier-Konfiguration",
      },
      copyInput: {
        title: "Quelle",
        description: "Quell-Datei- oder Ordnerpfad",
        placeholder: "README.md",
      },
      copyOutput: {
        title: "Ziel",
        description: "Ziel-Datei- oder Ordnerpfad",
        placeholder: "dist/README.md",
      },
      copyPattern: {
        title: "Muster",
        description: "Glob-Muster zum Filtern von Dateien",
        placeholder: "**/*.json",
      },
      npmPackage: {
        title: "NPM-Paket",
        description: "package.json für npm-Distribution generieren",
      },
      packageName: {
        title: "Paketname",
        description: "npm-Paketname (z.B. @scope/package)",
        placeholder: "@myorg/package-name",
      },
      packageVersion: {
        title: "Version",
        description: "Paketversion (Standard: Root-package.json)",
        placeholder: "1.0.0",
      },
      packageDescription: {
        title: "Beschreibung",
        description: "Kurze Paketbeschreibung für npm",
        placeholder: "Eine kurze Beschreibung Ihres Pakets",
      },
      packageMain: {
        title: "Main-Einstiegspunkt",
        description: "CommonJS-Einstiegspunkt (main-Feld)",
        placeholder: "./dist/index.cjs",
      },
      packageModule: {
        title: "Module-Einstiegspunkt",
        description: "ES-Module-Einstiegspunkt (module-Feld)",
        placeholder: "./dist/index.mjs",
      },
      packageTypes: {
        title: "Types-Einstiegspunkt",
        description: "TypeScript-Deklarations-Einstiegspunkt (types-Feld)",
        placeholder: "./dist/index.d.ts",
      },
      packageBin: {
        title: "Binärdateien",
        description: "CLI-Ausführbare-Zuordnungen als JSON",
        placeholder: '{"my-cli": "./dist/bin/cli.js"}',
      },
      packageExports: {
        title: "Exports-Map",
        description: "Paket-Exports-Feld als JSON",
        placeholder: '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
      },
      packageDependencies: {
        title: "Abhängigkeiten",
        description: "Runtime-Abhängigkeiten als JSON",
        placeholder: '{"lodash": "^4.17.21"}',
      },
      packagePeerDependencies: {
        title: "Peer-Abhängigkeiten",
        description: "Peer-Abhängigkeiten als JSON",
        placeholder: '{"react": ">=18.0.0"}',
      },
      packageFiles: {
        title: "Enthaltene Dateien",
        description: "Dateien, die im veröffentlichten Paket enthalten sein sollen",
        placeholder: "dist, README.md, LICENSE",
      },
      packageKeywords: {
        title: "Schlüsselwörter",
        description: "npm-Such-Schlüsselwörter",
        placeholder: "typescript, build, vite",
      },
      packageLicense: {
        title: "Lizenz",
        description: "Paketlizenz (z.B. MIT, Apache-2.0)",
        placeholder: "MIT",
      },
      packageRepository: {
        title: "Repository",
        description: "Git-Repository-URL",
        placeholder: "https://github.com/user/repo",
      },
      success: {
        title: "Erfolg",
      },
      buildOutput: {
        title: "Build-Ausgabe",
      },
      duration: {
        title: "Dauer (ms)",
      },
      outputPath: {
        title: "Ausgabepfad",
      },
      filesBuilt: {
        title: "Erstellte Dateien",
      },
      filesCopied: {
        title: "Kopierte Dateien",
      },
      packageJson: {
        title: "Generierte package.json",
      },
      profileUsed: {
        title: "Verwendetes Profil",
      },
      cacheStats: {
        title: "Cache-Statistiken",
        description: "Build-Cache-Leistungsmetriken",
      },
      reportPath: {
        title: "Berichtspfad",
        description: "Pfad zum generierten Build-Bericht",
      },
      stepTimings: {
        title: "Schritt-Zeiten",
        description: "Detaillierte Zeitaufschlüsselung für jeden Build-Schritt",
        step: "Schritt",
        duration: "Dauer (ms)",
        status: "Status",
        filesAffected: "Dateien",
      },
    },
    errors: {
      buildFailed: {
        title: "Build fehlgeschlagen",
        description: "Der Build-Prozess ist mit einem Fehler fehlgeschlagen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Build-Konfiguration ist ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist während des Build-Prozesses aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Builds auszuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Der Zugriff auf das Build-System ist verboten",
      },
      server: {
        title: "Serverfehler",
        description: "Ein Fehler ist während des Build-Prozesses aufgetreten",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Die angegebene Datei oder Konfiguration wurde nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die den Build beeinflussen könnten",
      },
      conflict: {
        title: "Build-Konflikt",
        description: "Eine konfliktbehaftete Build-Operation läuft bereits",
      },
    },
    success: {
      title: "Build erfolgreich",
      description: "Paket erfolgreich erstellt",
    },
  },
  tags: {
    build: "build",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "Entwicklung",
    production: "Produktion",
  },
  analysis: {
    criticalSize: "KRITISCH: Bundle-Größe ({{size}}) überschreitet Schwellenwert",
    largeBundle: "WARNUNG: Großes Bundle erkannt ({{size}})",
    considerTreeShaking:
      "Erwägen Sie Tree-Shaking zu aktivieren, um die Bundle-Größe zu reduzieren",
    checkLargeDeps:
      "Prüfen Sie große Abhängigkeiten, die ersetzt werden könnten",
    largeSourcemaps:
      "Große Sourcemaps erkannt - erwägen Sie, diese in der Produktion zu deaktivieren",
    possibleDuplicates:
      "Mögliche doppelte Abhängigkeiten erkannt - erwägen Sie Deduplizierung",
    totalSize: "Gesamtgröße",
    largestFiles: "Größte Dateien",
  },
};
