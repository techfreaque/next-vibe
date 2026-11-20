import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Builder",
  description: "Strumento di costruzione e fascio per il progetto",
  cli: {
    build: {
      description: "Tipo di costruzione: costruire",
      configOption: "specificare il percorso del file di configurazione",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "Sviluppo",
      production: "Produzione",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "Vaniglia JS",
      executable: "Eseguibile (Bun)",
      spa: "SPA (Vite app building)",
    },
    bunTarget: {
      bun: "Bun Runtime",
      node: "Node.js",
      browser: "Browser",
    },
    sourcemap: {
      external: "Esterno (.map file)",
      inline: "Inline (escluso)",
      none: "Nessuno (disabilitato)",
    },
    format: {
      esm: "Modulo ES",
      cjs: "CommonJS",
      iife: "IIFE (Browser)",
    },
    viteMinify: {
      esbuild: "esbuild (veloce)",
      terser: "Terser (piccolo)",
      false: "Disabili",
    },
    viteLibFormat: {
      es: "Modulo ES",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "Abilitato",
      false: "Disabili",
      inline: "Inline",
      hidden: "Nascosto",
    },
  },
  errors: {
    inputFileNotFound: "Il file di input {{filePath}} non esiste",
    invalidOutputFileName: "Il nome del file di output è invalido",
    invalidBuildConfig:
      "Invalid build config format. Assicurarsi che la configurazione esporta un oggetto predefinito BuildConfig.",
    configNotFound: "File di configurazione non trovato: {{path}}",
    inputRequired:
      "Il file di input è richiesto per questo obiettivo di costruzione",
    emptyConfig: "Configurazione vuota - nessun passo di costruzione definito",
  },
  warnings: {
    outputIsDirectory:
      "Il percorso di uscita dovrebbe essere un file, non una directory: {{path}}",
    sourceNotFound: "Il file sorgente non trovato: {{path}}",
  },
  suggestions: {
    checkFilePaths:
      "Controllare che tutti i percorsi di file siano corretti e i file esistono",
    runFromProjectRoot:
      "Assicurarsi di essere in esecuzione dalla directory radice del progetto",
    checkPermissions:
      "Controllare i permessi dei file per le directory di input e output",
    checkDependencies:
      "Alcune dipendenze potrebbero mancare - controllare le importazioni",
    runInstall:
      "Prova a eseguire 'bun install' per garantire che tutte le dipendenze siano disponibili",
    increaseMemory:
      "Per le grandi costruzioni, prova ad aumentare la memoria: NODE_OPTIONS =--max-old-space-size=4096",
    useExternals: "Considerare la marcatura di grandi dipendenze come esterno",
    checkSyntax: "Controllare gli errori di sintassi nei file sorgente",
    runTypecheck: "Eseguire 'bun typecheck' per controllare gli errori di tipo",
    increaseTimeout:
      "Aumentare il valore di timeout per l'operazione di costruzione",
    checkNetworkConnection: "Controlla la connessione di rete",
    checkDiskSpace: "Controllare lo spazio su disco disponibile",
    cleanBuildCache:
      "Prova a pulire la cache di compilazione e i file temporanei",
  },
  messages: {
    buildStart: "Cominciare a costruire...",
    cleaningDist: "Pulire l'output directory...",
    cleaningFolders: "Pulire le cartelle...",
    buildingVersion: "Versione costruzione {{version}}...",
    bundlingCli: "Bundling CLI con Bun...",
    bundleFailed: "Bundle fallito: {{error}}",
    bundleFailedUnknown: "Bundle non è riuscito senza un messaggio di errore",
    outputMissing:
      "Bundle non ha prodotto alcun output: {{output}} manca o vuoto",
    bundleSuccess: "CLI in bundle con successo",
    creatingPackageJson: "Creazione di package.json...",
    copyingFiles: "Copia README e LICENSE...",
    copyingAdditionalFiles: "Copiare i file aggiuntivi...",
    publishInstructions: "Pubblicare:",
    buildComplete: "Costruisci completo!",
    buildFailed: "Costruisci fallimenti",
    loadingConfig: "Caricamento configurazione da {{path}}...",
    cleaningFolder: "Cartella di pulizia: {{folder}}",
    compilingFiles: "Compilare i file con Vite...",
    compilingFile: "Compilazione: {{file}}",
    fileCompiled: "Compiled: {{file}}",
    buildingWithVite: "Edificio con Vite ({{type}})...",
    usingInlineConfig: "Usando la configurazione inline...",
    filesCopied: "I file copiati con successo",
    dryRunMode: "[ DRY RUN] Non verranno apportate modifiche",
    buildSummary: "Riepilogo di costruzione:",
    totalDuration: "Durata totale",
    filesBuilt: "File costruiti",
    filesCopiedCount: "File Copied",
    stepsCompleted: "Passi completati",
    usingProfile: "Utilizzo del profilo: {{profile}}",
    runningPreBuild: "Aggancio pre-costruito...",
    runningPostBuild: "Attacco post-costruito...",
    preBuildComplete: "gancio pre-costruito completato",
    postBuildComplete: "gancio post-costruito completato",
    analyzingBundles: "Analizzando le dimensioni del fascio...",
    bundleAnalysis: "Analisi del Bundle",
    optimizationTips: "Punte di ottimizzazione",
    suggestions: "Consigli",
    validatingConfig: "Convalida configurazione di costruzione...",
    configValid: "La configurazione è valida",
    configWarnings: "Avvertenze di configurazione",
    tsEntrypointWithNode:
      "TypeScript entrypoint con Node target - considerare l'utilizzo di Bun target per una migliore compatibilità",
    watchModeStarted:
      "Comincia la modalità di orologio - in attesa dei cambiamenti di file...",
    watchModeRebuild: "File modificato: {{file}} - ricostruzione...",
    watchModeReady: "Costruisci completo - guardando per i cambiamenti...",
    watchModeError: "Errore della modalità di orologio: {{error}}",
    watchModeStopped: "Modalità di orologio interrotto",
    parallelCompiling: "Compilare i file {{count}} in parallelo...",
    parallelComplete:
      "Compilazione parallela completa: file {{count}} in ms {{duration}}",
    cacheHit: "Colpo di cache: {{file}} (skipped)",
    cacheMiss: "Cache miss: {{file}} (ricostruzione)",
    cacheCleared: "Costruire la cache cancellata",
    cacheStats:
      "Cache: hit {{hits}}, manca {{misses}} (tasso di successo {{hitRate}}%)",
    generatingReport: "Generando il rapporto di costruzione...",
    reportGenerated: "Costruisci il rapporto generato: {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "Edificio...",
    spinnerCompiling: "Compiling...",
    spinnerBundling: "Bundling...",
  },
  post: {
    title: "Pacchetto di costruzione",
    titleShort: "Pacchetto di costruzione",
    description:
      "Strumento di costruzione completo che supporta il bundling CLI, Vite costruisce, React/Tailwind e la distribuzione npm",
    form: {
      title: "Costruire la configurazione",
      description:
        "Configurare le impostazioni di configurazione o utilizzare un file build.config.ts",
    },
    fields: {
      // Config file path
      configPath: {
        title: "Percorso di file di conflitto",
        description:
          "Percorso per costruire file di configurazione (build.config.ts)",
        placeholder: "build.config.ts",
      },
      // Config object
      configObject: {
        title: "Opzioni di costruzione",
        description:
          "Configurazione di configurazione in linea (overrides config file)",
      },
      // Runtime options
      profile: {
        title: "Crea il profilo",
        description:
          "Sviluppo (veloce, debug) o Produzione (ottimizzata, minificata)",
      },
      dryRun: {
        title: "Correre a secco",
        description:
          "Anteprima cosa sarebbe costruito senza effettivamente eseguire",
      },
      verbose: {
        title: "Uscita Verbose",
        description:
          "Mostra informazioni dettagliate sulla costruzione e il progresso",
      },
      analyze: {
        title: "Analisi del Bundle",
        description:
          "Analizzare le dimensioni dei pacchetti e identificare le opportunità di ottimizzazione",
      },
      watch: {
        title: "Modalità di orologio",
        description:
          "Guardare le modifiche dei file e ricostruire automaticamente",
      },
      parallel: {
        title: "Costruzioni parallele",
        description:
          "Compili più file in parallelo per le costruzioni più veloci",
      },
      cache: {
        title: "Costruire Cache",
        description: "Cache costruire artefatti per saltare i file invariati",
      },
      report: {
        title: "Rapporto generazionale",
        description:
          "Generare un rapporto di compilazione JSON con metriche dettagliate",
      },
      minify: {
        title: "Minify",
        description:
          "Minificare il pacchetto di output (impostazione profilo overrides)",
      },
      // Folders to clean
      foldersToClean: {
        title: "Cartelle per pulire",
        description:
          "Cartelle da eliminare prima della costruzione (ad esempio, dist, build)",
        placeholder: "dist, build,.cache",
      },
      // Files to compile
      filesToCompile: {
        title: "I file per il Compile",
        description: "Elenco dei file da compilare con Vite o Bun",
      },
      fileToCompile: {
        title: "Configurazione file",
      },
      disabled: {
        title: "Disabili",
        description: "Salta questa voce durante la costruzione",
      },
      input: {
        title: "File di input",
        description:
          "Percorso file punto di entrata (ad esempio, src/index.ts)",
        placeholder: "src/index.ts",
      },
      output: {
        title: "File di output",
        description: "Percorso file di uscita (ad esempio, dist/index.js)",
        placeholder: "dist/index.js",
      },
      type: {
        title: "Tipo di costruzione",
        description: "Tipo di costruzione: Reagire, Vanilla JS o eseguibile",
      },
      modulesToExternalize: {
        title: "Moduli esterni",
        description:
          "Moduli da escludere dal fascio (ad esempio, reagire, lodash)",
        placeholder: "react, react-dom, lodash",
      },
      inlineCss: {
        title: "In linea CSS",
        description: "Iniettare CSS direttamente nel pacchetto JavaScript",
      },
      bundleReact: {
        title: "Reazione di Bundle",
        description: "Includere React nel bundle invece di come esterno",
      },
      // Package config
      packageConfig: {
        title: "Confezionamento del pacchetto",
        description:
          "Impostazioni per la creazione di librerie con le dichiarazioni TypeScript",
      },
      isPackage: {
        title: "Il pacchetto è",
        description:
          "Attivare la modalità libreria con le esportazioni di pacchetti",
      },
      dtsInclude: {
        title: "DTS Includere",
        description:
          "Modelli globo per i file TypeScript da includere nelle dichiarazioni",
        placeholder: "src/**/*.ts",
      },
      dtsEntryRoot: {
        title: "DTS Radice di ingresso",
        description:
          "directory radice per la generazione di file di dichiarazione",
        placeholder: "src",
      },
      // Bun options
      bunOptions: {
        title: "Opzioni Bun",
        description:
          "Opzioni di costruzione specifiche Bun per le costruzioni eseguibili",
      },
      bunTarget: {
        title: "Target Runtime",
        description: "Target runtime: Bun, Node.js o Browser",
      },
      bunMinify: {
        title: "Minify",
        description: "Abilitare la minificazione per un output più piccolo",
      },
      sourcemap: {
        title: "Mappe di origine",
        description: "Generare mappe di origine per il debugging",
      },
      external: {
        title: "Moduli esterni",
        description: "Moduli da escludere dal fascio",
        placeholder: "react, react-dom",
      },
      define: {
        title: "Definire le costanti",
        description:
          "Correnti a tempo pieno come JSON (ad esempio, process.env. NODE_ENV)",
        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
      },
      splitting: {
        title: "Codice Spalato",
        description: "Abilitare la divisione del codice per i pezzi condivisi",
      },
      format: {
        title: "Formato di uscita",
        description: "Formato del modulo: ESM, CommonJS o IIFE",
      },
      bytecode: {
        title: "Bytecode",
        description: "Compile a Bun bytecode per l'avvio più veloce",
      },
      banner: {
        title: "Banner",
        description:
          "Testo da prependere all'output (ad esempio, linea di shebang)",
        placeholder: "#!/usr/bin/env node",
      },
      footer: {
        title: "Piede",
        description: "Testo da aggiungere all'uscita",
        placeholder: "// End of file",
      },
      publicPath: {
        title: "Sentiero pubblico",
        label: "Sentiero pubblico",
        description: "Prefisso del percorso pubblico per i beni",
      },
      naming: {
        title: "Denominazione",
        label: "Denominazione",
        description: "Modello di denominazione d'uscita",
      },
      root: {
        title: "Radice",
        label: "Radice",
        description: "directory radice",
      },
      conditions: {
        title: "Condizioni",
        label: "Condizioni",
        description: "Condizioni di esportazione",
      },
      loader: {
        title: "Loader",
        label: "Loader",
        description: "Mappatura dei caricatori di file",
      },
      drop: {
        title: "Drop",
        label: "Drop",
        description: "Identificazione a goccia",
      },
      // Vite options
      viteOptions: {
        title: "Opzioni di Vite",
        description: "Configurazione avanzata di costruzione Vite",
      },
      viteTarget: {
        title: "Costruire l'obiettivo",
        description:
          "Obiettivi del browser/ambiente (ad esempio, es2020, cromo80)",
        placeholder: "es2020, chrome80, node18",
      },
      viteOutDir: {
        title: "Elenco di destinazione",
        description: "Directory per l'output di costruzione",
        placeholder: "dist",
      },
      viteAssetsDir: {
        title: "Elenco delle attività",
        description: "Sottodirectory per le attività statiche",
        placeholder: "assets",
      },
      viteAssetsInlineLimit: {
        title: "Limite in linea",
        description:
          "Dimensione massima (byte) per inlineare le attività come base64",
        placeholder: "4096",
      },
      viteChunkSizeWarningLimit: {
        title: "Avviso di dimensione del gambo",
        description: "Dimensione del gambo (KB) che innesca un avviso",
        placeholder: "500",
      },
      viteCssCodeSplit: {
        title: "Codice CSS Split",
        description: "Split CSS in file separati per chunk",
      },
      viteSourcemap: {
        title: "Mappe di origine",
        description: "Modalità di generazione della mappa di origine",
      },
      viteMinify: {
        title: "Minacciante",
        description: "Strumento di minificazione: esbuild o terser",
      },
      viteEmptyOutDir: {
        title: "Dir di uscita vuota",
        description: "Pulire la directory di output prima di costruire",
      },
      viteReportCompressedSize: {
        title: "Rapporto compresso",
        description: "Rapporto dimensioni del fascio gzipped",
      },
      viteManifest: {
        title: "Creare il Manifesto",
        description: "Generare un manifest.json per l'imprecisione degli asset",
      },
      // Vite lib options
      viteLib: {
        title: "Modalità biblioteca",
        description: "Configurare la modalità di creazione della libreria Vite",
      },
      viteLibEntry: {
        title: "Punto d'ingresso",
        description: "Libreria file punto d'ingresso(i)",
        placeholder: "src/index.ts",
      },
      viteLibName: {
        title: "Nome della biblioteca",
        description: "Nome variabile globale per UMD / IIFE costruisce",
        placeholder: "MyLibrary",
      },
      viteLibFormats: {
        title: "Formati di uscita",
        description: "Formati di uscita della libreria (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "Nome del file",
        description: "Nome file di uscita (senza estensione)",
        placeholder: "my-library",
      },
      // Rollup options
      viteRollupOptions: {
        title: "Opzioni di rollup",
        description: "Configurazione avanzata del bundle Rollup",
      },
      rollupExternal: {
        title: "Moduli esterni",
        description: "Moduli da escludere dal fascio",
        placeholder: "react, react-dom",
      },
      rollupTreeshake: {
        title: "Agitazione dell'albero",
        description: "Rimuovere il codice inutilizzato dal bundle",
      },
      rollupOutput: {
        title: "Opzioni di uscita Rollup",
        label: "Opzioni di uscita Rollup",
        description: "Opzioni di uscita del rollup",
      },
      viteTsconfigPath: {
        title: "tsconfig Path",
        description:
          "Percorso a tsconfig per vite-tsconfig-paths (modalità SPA)",
        placeholder: "tsconfig.tanstack.json",
      },
      viteModuleAliases: {
        label: "Aliasi del modulo",
        description:
          "Spettri di importazione della mappa per i percorsi dei file risolti (applicabili sia al client che a SSR)",
      },
      vitePlugins: {
        title: "Vite Plugin",
        label: "Vite Plugin",
        description: "Raw Vite plugins array (per uso programmatico)",
      },
      viteBuild: {
        title: "Opzioni di costruzione raw",
        label: "Opzioni di costruzione raw",
        description: "Passthrough Vite opzioni di costruzione",
      },
      // Files to copy
      filesOrFoldersToCopy: {
        title: "File da copiare",
        description: "File o cartelle da copiare dopo la compilazione",
      },
      copyConfig: {
        title: "Configurazione copia",
      },
      copyInput: {
        title: "Fonte",
        description: "File di origine o percorso della cartella",
        placeholder: "README.md",
      },
      copyOutput: {
        title: "Destinazione",
        description: "File di destinazione o percorso di cartella",
        placeholder: "dist/README.md",
      },
      copyPattern: {
        title: "Modello",
        description: "Modello Glob per il filtraggio dei file",
        placeholder: "**/*.json",
      },
      // NPM package
      npmPackage: {
        title: "Pacchetto NPM",
        description: "Generare pacchetto.json per la distribuzione npm",
      },
      packageName: {
        title: "Nome del pacchetto",
        description: "npm nome del pacchetto (ad esempio, @scope/package)",
        placeholder: "@myorg/package-name",
      },
      packageVersion: {
        title: "Version",
        description: "Versione del pacchetto (defaults to root package.json)",
        placeholder: "1.0.0",
      },
      packageDescription: {
        title: "Designazione",
        description: "Breve descrizione del pacchetto per npm",
        placeholder: "Una breve descrizione del tuo pacchetto",
      },
      packageMain: {
        title: "Entrata principale",
        description: "Punto di ingresso CommonJS (campo principale)",
        placeholder: "./dist/index.cjs",
      },
      packageModule: {
        title: "Ingresso del modulo",
        description: "Punto di ingresso del modulo ES (campo modulo)",
        placeholder: "./dist/index.mjs",
      },
      packageTypes: {
        title: "Tipi di ingresso",
        description: "Ingresso di dichiarazione TypeScript (campo di tipi)",
        placeholder: "./dist/index.d.ts",
      },
      packageBin: {
        title: "Binari",
        description: "CLI mappature eseguibili come JSON",
        placeholder: '{"my-cli": "./dist/bin/cli.js"}',
      },
      packageExports: {
        title: "Mappa delle esportazioni",
        description: "Pacchetto esportazione campo come JSON",
        placeholder:
          '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
      },
      packageDependencies: {
        title: "Dipendenze",
        description: "Dipendenze runtime come JSON",
        placeholder: '{"lodash": "^4.17.21"}',
      },
      packagePeerDependencies: {
        title: "Dipendenze dei pari",
        description: "Dipendenze dei pari come JSON",
        placeholder: '{"react": ">=18.0.0"}',
      },
      packagePeerDependenciesMeta: {
        title: "Dipendenze dei pari Meta",
        description: "Segnare le dipendenze paritetiche come facoltativo",
        placeholder: '{"react": {"optional": true}}',
      },
      packageFiles: {
        title: "File inclusi",
        description: "I file da includere nel pacchetto pubblicato",
        placeholder: "dist, README.md, LICENSE",
      },
      packageKeywords: {
        title: "Parole chiave",
        description: "npm parole chiave di ricerca",
        placeholder: "typescript, build, vite",
      },
      packageLicense: {
        title: "Licenza",
        description: "Patente di pacchetto (ad esempio, MIT, Apache-2.0)",
        placeholder: "MIT",
      },
      packageRepository: {
        title: "Repository",
        description: "Repositore Git URL",
        placeholder: "https://github.com/user/repo",
      },
      packageOutputDir: {
        title: "Elenco di destinazione",
        description: "Elenco dove package.json è scritto (default to dist/)",
        placeholder: ".dist/checker",
      },
      // Response fields
      success: {
        title: "Operazione riuscita",
      },
      buildOutput: {
        title: "Costruisci l'uscita",
      },
      duration: {
        title: "Durata (m)",
      },
      outputPath: {
        title: "Percorso di uscita",
      },
      filesBuilt: {
        title: "File costruiti",
        item: "File costruito",
      },
      filesCopied: {
        title: "File Copied",
        item: "File Copied",
      },
      packageJson: {
        title: "Pacchetto generato.json",
      },
      profileUsed: {
        title: "Profilo Usato",
      },
      cacheStats: {
        title: "Statistiche di Cache",
        description: "Costruire le metriche delle prestazioni della cache",
      },
      reportPath: {
        title: "Percorso di relazione",
        description: "Percorso al report di compilazione generato",
      },
      stepTimings: {
        title: "Passaggio dei tempi",
        description:
          "Ripartizione dettagliata dei tempi per ogni fase di costruzione",
        step: "Passo",
        duration: "Durata (m)",
        status: "Stato",
        filesAffected: "File",
      },
    },
    errors: {
      buildFailed: {
        title: "Costruisci fallito: {{error}}",
        description: "Il processo di costruzione non è riuscito con un errore",
      },
      validation: {
        title: "Errore di convalida",
        description: "La configurazione di compilazione fornita non è valida",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante il processo di costruzione",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire le costruzioni",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso al sistema di costruzione è vietato",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il processo di costruzione",
      },
      notFound: {
        title: "Non trovato",
        description: "Il file specificato o config non è stato trovato",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description:
          "Ci sono cambiamenti non salvati che possono influenzare la costruzione",
      },
      conflict: {
        title: "Costruisci i conflitti",
        description: "Un'operazione di costruzione in conflitto è già in corso",
      },
    },
    success: {
      title: "Costruisci successo",
      description: "Pacchetto costruito con successo",
    },
  },
  tags: {
    build: "build",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "Sviluppo",
    production: "Produzione",
  },
  analysis: {
    criticalSize:
      "CRITICAL : La dimensione del Bundle ({{size}}) supera la soglia",
    largeBundle: "WARNING: Rilevato grande fascio ({{size}})",
    considerTreeShaking:
      "Considerare l'abilitazione albero-shaking per ridurre la dimensione del fascio",
    checkLargeDeps:
      "Controllare le grandi dipendenze che potrebbero essere sostituite",
    largeSourcemaps:
      "Grandi mappe di sorgente rilevate - considerare la disabilitazione nella produzione",
    possibleDuplicates:
      "Possibili dipendenze duplicate rilevate - considerare la deduplica",
    totalSize: "Dimensione totale",
    largestFiles: "File più grandi",
  },
};
