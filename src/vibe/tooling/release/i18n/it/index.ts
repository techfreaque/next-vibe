import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Strumento di rilascio",
  titleShort: "Strumento di rilascio",
  description:
    "Gestisci le release dei pacchetti con la versione urto, git tagging e l'integrazione CI / CD",
  category: "Strumento di rilascio",
  tags: {
    release: "Release",
  },
  enums: {
    versionIncrement: {
      patch: "Patch",
      minor: "Minore",
      major: "Maggiore",
      prepatch: "Pre-patch",
      preminor: "Pre-minore",
      premajor: "Premajor",
      prerelease: "Preregolazione",
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
      custom: "Personalizzato",
    },
    npmAccess: {
      public: "Pubblico",
      restricted: "Restrizioni",
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
    title: "Configurazione di rilascio",
    description: "Configura le opzioni di rilascio per i tuoi pacchetti",
  },
  fields: {
    configPath: {
      title: "Sentiero di conflitto",
      description:
        "Percorso per rilasciare.config.ts file (default: release.config.ts)",
    },
    ci: {
      title: "Modalità CI",
      description:
        "Esegui in modalità CI (senza prompt interattivi, utilizza ciReleaseCommand)",
    },
    forceUpdate: {
      title: "Dipendenze di aggiornamento della forza",
      description:
        "Aggiornare la forza tutte le dipendenze senza richiedere (sfrutta tutti gli altri passaggi)",
    },
    dryRun: {
      title: "Correre a secco",
      description: "Simulare il rilascio senza apportare modifiche",
    },
    skipLint: {
      title: "Skip Lint",
      description: "Salta il passo dell'intonazione",
    },
    skipTypecheck: {
      title: "Salta il tipo di controllo",
      description: "Salta TypeScript gradino di controllo tipo",
    },
    skipBuild: {
      title: "Salta su",
      description: "Salta la fase di costruzione",
    },
    skipTests: {
      title: "Salta i test",
      description: "Salta la fase di esecuzione del test",
    },
    skipSnyk: {
      title: "Salta su!",
      description: "Salta Snyk scansione vulnerabilità",
    },
    skipPublish: {
      title: "Skip Publish",
      description: "Salta la pubblicazione a npm/registry",
    },
    skipChangelog: {
      title: "Salta il tuo nome",
      description: "Skip changelog generazione",
    },
    prereleaseId: {
      title: "Prerelease ID",
      description:
        "Identificatore di prerelease (alfa, beta, rc) per urto di versione",
    },
    versionIncrement: {
      title: "Incentivo di versione",
      description:
        "Tipo di incremento versione (patch, minore, maggiore) - usato solo in modalità locale",
    },
    targetPackage: {
      title: "Pacchetto di destinazione",
      description:
        "Directory specifica del pacchetto target (opzionale, default a tutti i pacchetti)",
    },
    inlineConfig: {
      title: "Configurazione in linea",
      description:
        "Fornire la configurazione di rilascio in linea invece di utilizzare il file config",
    },
    skipGitTag: {
      title: "Skip Git Tag",
      description: "Salta la creazione di git tag durante il rilascio",
    },
    skipGitPush: {
      title: "Saltare Git Push",
      description: "Salta a spingere verso il repository remoto",
    },
    verbose: {
      title: "Verbose",
      description: "Abilita logging verbose per output dettagliato",
    },
    skipInstall: {
      title: "Salta Installazione",
      description: "Salta la fase di installazione della dipendenza",
    },
    skipClean: {
      title: "Skip to Clean",
      description: "Salta passo pulito prima di costruire",
    },
    commitMessage: {
      title: "Invia messaggio",
      description:
        // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
        "Messaggio di commit personalizzato per la versione urto (supporti ${version} segnaposto)",
    },
    notifyWebhook: {
      title: "Notifica Webhook",
      description:
        "Webhook URL per inviare notifiche di rilascio a (Slack, Discord, Teams, o personalizzati)",
    },
    configObject: {
      title: "Oggetto di configurazione",
      description: "Impostazioni di configurazione del rilascio",
    },
    packageManager: {
      title: "Responsabile del pacchetto",
      description:
        "Responsabile del pacchetto da utilizzare per le versioni (bun, npm, filato, pnpm, deno)",
    },
    globalVersion: {
      title: "Versione globale",
      description:
        "Impostare una versione globale per tutti i pacchetti in monorepo",
    },
    parallel: {
      title: "Esecuzione parallela",
      description: "Abilitare l'elaborazione di pacchetti paralleli",
    },
    maxParallelJobs: {
      title: "Max Parallel Jobs",
      description: "Numero massimo di posti di lavoro paralleli da eseguire",
    },
    continueOnError: {
      title: "Continuare su Errore",
      description:
        "Continuare a trattare i pacchetti rimanenti se uno non riesce",
    },
    verifyGitStatus: {
      title: "Verifica lo stato Git",
      description: "Verificare lo stato git prima del rilascio",
    },
    requireCleanWorkingDir: {
      title: "Requisisci la cartella di lavoro pulita",
      description: "Richiedere directory di lavoro pulita prima del rilascio",
    },
    verifyLockfile: {
      title: "Verificare Lockfile",
      description:
        "Verificare l'integrità del file di blocco prima del rilascio",
    },
    branch: {
      title: "Configurazione del ramo",
      description: "Impostazioni di configurazione del ramo Git",
    },
    branchMain: {
      title: "Branch principale",
      description: "Nome del ramo principale/produzione",
    },
    branchDevelop: {
      title: "Sviluppare Branch",
      description: "Nome del ramo di sviluppo",
    },
    allowNonMain: {
      title: "Consentire i comunicati non registrati",
      description: "Consentire i rilasci da rami diversi dal principale",
    },
    protectedBranches: {
      title: "Rami protetti",
      description: "Elenco dei nomi delle branche protette",
    },
    notifications: {
      title: "Notifiche",
      description: "Configurazione di notifica per eventi di rilascio",
    },
    notificationsEnabled: {
      title: "Abilitare le notifiche",
      description: "Abilitare le notifiche di rilascio",
    },
    webhookUrl: {
      title: "Webhook URL",
      description: "URL per le notifiche webhook",
    },
    webhookType: {
      title: "Tipo di Webhook",
      description: "Tipo di webhook (Slack, Discord, Teams, Custom)",
    },
    onSuccess: {
      title: "Informare sul successo",
      description: "Invia la notifica al rilascio di successo",
    },
    onFailure: {
      title: "Informare sul fallimento",
      description: "Invia la notifica al rilascio fallito",
    },
    messageTemplate: {
      title: "Template Messaggio",
      description: "Modello di messaggio personalizzato per le notifiche",
    },
    includeTimings: {
      title: "Includere i tempi",
      description: "Includi le informazioni sui tempi nelle notifiche",
    },
    retry: {
      title: "Configurazione di processo",
      description: "Ripristinare le impostazioni per operazioni fallite",
    },
    maxAttempts: {
      title: "Max Attempts",
      description: "Numero massimo di tentativi di riprova",
    },
    delayMs: {
      title: "Ritardo del reattore",
      description: "Ritardo iniziale tra i retries in millisecondi",
    },
    backoffMultiplier: {
      title: "Multiplo di retromarcia",
      description: "Multiplier per backoff esponenziale",
    },
    maxDelayMs: {
      title: "Max Delay",
      description: "Ritardo massimo tra i retries in millisecondi",
    },
    rollback: {
      title: "Configurazione del rollback",
      description: "Impostazioni automatiche di rollback sul guasto",
    },
    rollbackEnabled: {
      title: "Attiva Rollback",
      description: "Abilitare il rollback automatico sul guasto",
    },
    rollbackGit: {
      title: "Cambiamenti di Git Rollback",
      description: "Rollback git commette e tag sul fallimento",
    },
    rollbackVersion: {
      title: "Cambiamenti di versione Rollback",
      description: "Modifiche della versione Rollback sul fallimento",
    },
    packages: {
      title: "Pacchetti",
      description: "Elenco dei pacchetti da rilasciare",
    },
    package: {
      title: "Configurazione del pacchetto",
    },
    directory: {
      title: "Elenco",
    },
    name: {
      title: "Nome",
    },
    updateDeps: {
      title: "Dipendenze di aggiornamento",
      description: "Adeguamento delle dipendenze nei pacchetti dipendenti",
    },
    clean: {
      title: "Comando pulito",
      description: "Comando o script per pulire il pacchetto",
    },
    lint: {
      title: "Comando Lint",
      description: "Comando o script per lint package",
    },
    typecheck: {
      title: "Tipologia comando",
      description: "Comando o script per digitarecheck package",
    },
    build: {
      title: "Costruire il comando",
      description: "Comando o script per costruire il pacchetto",
    },
    test: {
      title: "Comando di prova",
      description: "Comando o script per testare il pacchetto",
    },
    snyk: {
      title: "Scansione di Snyk",
      description: "Abilita la scansione della sicurezza Snyk",
    },
    install: {
      title: "Installa il comando",
      description: "Comando o script per installare dipendenze",
    },
    release: {
      title: "Configurazione di rilascio",
    },
    releaseVersion: {
      title: "Versione di rilascio",
    },
    tagPrefix: {
      title: "Tag Prefisso",
    },
    tagSuffix: {
      title: "Tag Suffisso",
    },
    ciReleaseCommand: {
      title: "Comando di rilascio CI",
      description: "Comando per eseguire in modalità CI per il rilascio",
    },
    ciCommand: {
      title: "Comando",
      description: "array di comando da eseguire",
    },
    ciEnvMapping: {
      title: "Mappatura dell'ambiente",
      description: "Mappature variabili ambientali per CI",
    },
    gitOps: {
      title: "Operazioni Git",
    },
    skipTag: {
      title: "Skip Tag:",
    },
    skipPush: {
      title: "Saltare",
    },
    skipCommit: {
      title: "Skip Commit",
    },
    signCommit: {
      title: "Commitaggio dei segni",
    },
    signTag: {
      title: "Segnala Tag",
    },
    remote: {
      title: "Remote",
    },
    npm: {
      title: "Configurazione NPM",
    },
    npmEnabled: {
      title: "Abilitare l'editoria NPM",
    },
    npmRegistry: {
      title: "Registro di NPM",
    },
    npmTag: {
      title: "NPM Tag:",
    },
    npmAccess: {
      title: "Accesso NPM",
    },
    otpEnvVar: {
      title: "OTP Ambiente Variabile",
    },
    provenance: {
      title: "Provenance",
    },
    ignoreScripts: {
      title: "Ignora gli script",
    },
    npmDryRun: {
      title: "NPM Dry Run",
    },
    jsr: {
      title: "Configurazione JSR",
    },
    jsrEnabled: {
      title: "Abilitare l'editoria JSR",
    },
    allowSlowTypes: {
      title: "Consentire i tipi lenti",
    },
    allowDirty: {
      title: "Consentire Dirty",
    },
    jsrDryRun: {
      title: "JSR Dry Run",
    },
    changelog: {
      title: "Configurazione di Changelog",
    },
    changelogEnabled: {
      title: "Abilitare Changelog",
    },
    changelogFile: {
      title: "File di Changelog",
    },
    changelogHeader: {
      title: "Intestazione del registro",
    },
    compareUrlFormat: {
      title: "Confronta il formato URL",
    },
    commitUrlFormat: {
      title: "Commit URL Formato",
    },
    includeBody: {
      title: "Includere il corpo",
    },
    changelogPreset: {
      title: "Preset di Changelog",
    },
    gitRelease: {
      title: "Configurazione di rilascio Git",
    },
    gitReleaseEnabled: {
      title: "Abilitare il rilascio Git",
    },
    releaseTitle: {
      title: "Titolo della pubblicazione",
    },
    generateNotes: {
      title: "Genera note",
    },
    releaseBody: {
      title: "Corpo di rilascio",
    },
    draft: {
      title: "Progetto",
    },
    prerelease: {
      title: "Preregolazione",
    },
    discussionCategory: {
      title: "Discussione Categoria",
    },
    target: {
      title: "Obiettivo",
    },
    assets: {
      title: "Assets",
      description: "Rilasciare le attività da caricare",
    },
    foldersToZip: {
      title: "Cartelle a Zip",
      description: "Cartelle per zip per il rilascio",
    },
    versionBumper: {
      title: "Paraurti di versione",
      description: "Configurazione di urto versione per file non-package.json",
    },
    hooks: {
      title: "Ganci per il ciclo di vita",
      description: "Comandi da eseguire in diverse fasi",
    },
    preInstall: {
      title: "Gancio pre-install",
    },
    postInstall: {
      title: "Post-Install gancio",
    },
    preClean: {
      title: "Gancio pre-legato",
    },
    postClean: {
      title: "Post-Clean gancio",
    },
    preLint: {
      title: "Gancio pre-luce",
    },
    postLint: {
      title: "Post-Lint gancio",
    },
    preTypecheck: {
      title: "Pre-Typecheck gancio",
    },
    postTypecheck: {
      title: "Post-Typecheck gancio",
    },
    preBuild: {
      title: "Gancio prefabbricato",
    },
    postBuild: {
      title: "Post-Build gancio",
    },
    preTest: {
      title: "Gancio pre-tasto",
    },
    postTest: {
      title: "Post-Test gancio",
    },
    prePublish: {
      title: "Pre-pubblico gancio",
    },
    postPublish: {
      title: "Post-editoria gancio",
    },
    preRelease: {
      title: "Gancio pre-rilascio",
    },
    postRelease: {
      title: "Post-Release gancio",
    },
    globalHooks: {
      title: "Ganci globali",
      description:
        "Ganci per ciclo di vita globali per l'intero processo di rilascio",
    },
  },
  response: {
    status: "Stato",
    success: "Stato di rilascio",
    output: "Log di rilascio",
    duration: "Durata",
    packages: "Pacchetti",
    packagesProcessed: "Pacchetti elaborati",
    ciEnvironment: "CI Ambiente",
    errors: "Errori",
    warnings: "Avvertenze",
    gitInfo: "Informazioni sul Git",
    published: "Pacchetti Pubblicato",
    publishedPackages: "Pacchetti Pubblicato",
    timings: "Prestazioni",
    rollbackPerformed: "Rollback Eseguita",
    notificationsSent: "Notifiche",
  },
  table: {
    name: "Pacchetto",
    directory: "Elenco",
    version: "Version",
    tag: "Tag",
    status: "Stato",
    message: "Messaggio",
    registry: "Registro",
    url: "URL",
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Configurazione di rilascio non valido",
    },
    notFound: {
      title: "Non trovato",
      description: "File di configurazione o pacchetto non trovato",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore durante il processo di rilascio",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    network: {
      title: "Errore di rete",
      description: "Errore di rete durante il processo di rilascio",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Non autorizzato a eseguire il rilascio",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso negato per l'operazione di rilascio",
    },
    conflict: {
      title: "Conflitto",
      description:
        "Rilevato conflitto di rilascio (il ritardo può già esistere)",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description:
        "Ci sono cambiamenti non salvati che devono essere commessi prima",
    },
    packageNotFound:
      "Pacchetto ' {{targetPackage}}' non trovato in configurazione",
    gitOperationFailed: "Funzionamento Git fallito: {{error}}",
    gitAddFailed: "Git add fail: {{error}}",
    gitTagFailed: "Git tag ' {{tag}} ' fallito: {{error}}",
    gitPushFailed: "Git push to ' {{remote}}' fail: {{error}}",
    gitPushTagFailed:
      "Git push tag ' {{tag}}' a ' {{remote}} ' fallito: {{error}}",
  },
  success: {
    title: "Rilasciare Completa",
    description: "Processo di rilascio completato con successo",
  },
  config: {
    fileNotFound: "File di configurazione non trovato: {{path}}",
    invalidFormat:
      "Formato di configurazione non valido. Assicurarsi che la configurazione esporta un oggetto predefinito con un array 'packages'. Controlla i documenti per maggiori informazioni.",
    errorLoading: "Configurazione di caricamento degli errori: {{error}}",
  },
  packageJson: {
    notFound: "Package.json non trovato: {{path}}",
    invalidFormat: "Invalid package.json formato: {{path}}",
    errorReading: "Pacchetto di lettura errore.json: {{error}}",
    errorUpdatingDeps:
      "Aggiornamento degli errori dipendenze per {{directory}}: {{error}}",
    errorUpdatingVersion:
      "Versione del pacchetto di aggiornamento degli errori per {{directory}}: {{error}}",
  },
  scripts: {
    invalidPackageJson: "Formato Invalid package.json in {{path}}",
    testsFailed: "I test sono falliti in {{path}}: {{error}}",
    lintFailed: "L'uso del rivestimento è fallito in {{path}}: {{output}}",
    typecheckFailed: "Controllo del tipo fallito in {{path}}: {{error}}",
    buildFailed: "Costruire fallito in {{path}}: {{error}}",
    packageJsonNotFound: "Package.json non trovato in {{path}}",
  },
  snyk: {
    cliNotFound: "Snyk CLI non trovato. Installare con: npm install -g snyk",
    testFailed:
      "Il test di vulnerabilità di Snyk è fallito per {{packageName}}: {{error}}",
    tokenRequired:
      "Variabile ambiente SNYK_TOKEN richiesta per {{packageName}}",
    orgKeyRequired:
      "Variabile ambiente SNYK_ORG_KEY richiesta per {{packageName}}",
    monitorFailed:
      "Il monitor Snyk non è riuscito per {{packageName}}: {{error}}",
  },
  git: {
    tagCreated: "Git tag ' {{tag}}' creato con successo",
    tagExists: "Git tag ' {{tag}}' esiste già",
    pushSuccess: "Cambiamenti spinti a distanza",
    noCommits: "Nessun nuovo commit dal tag ' {{lastTag}}'",
    uncommittedChanges: "Cambiamenti non rilevati",
    notOnMain: "Non su ramo ' {{main}}' (corrente: {{currentBranch}})",
    commitFailed: "Non è riuscito a commettere modifiche",
    tagFailed: "Non è riuscito a creare tag",
    pushFailed: "Non spingere a distanza",
  },
  version: {
    bumped: "Versione urtata da {{from}} a {{to}} ({{increment}})",
    fileUpdated: "Versione aggiornata in {{file}} a {{newVersion}}",
    invalidFormat: "Formato della versione non valida: {{version}}",
  },
  ci: {
    commandRunning:
      "Eseguire il comando di rilascio CI per {{package}}: {{command}}",
    commandSuccess: "Comando di rilascio CI completato per {{package}}",
    commandFailed:
      "Il comando di rilascio CI non è riuscito per {{package}}: {{error}}",
    commandRequired:
      "La modalità CI richiede la configurazione ciReleaseCommand per {{package}}",
    envVarMissing:
      "Variabile di ambiente richiesta ' {{variable}} ' non impostata per {{package}}",
  },
  zip: {
    starting: "Cartelle di bloccaggio...",
    complete: "Con successo zip {{input}} a {{output}} (byte {{bytes}})",
    failed: "Non zip {{input}}: {{error}}",
    noFolders: "Nessuna cartella per zip in configurazione",
    inputNotFound: "La cartella di input {{input}} non esiste",
  },
  dryRun: {
    prefix: "[DRY RUN]",
    wouldExecute: "Eserciterà: {{action}}",
  },
  release: {
    starting: "Avvio del processo di rilascio...",
    ciMode: "Esecuzione in modalità CI...",
    localMode: "Uscita in modalità locale...",
    forceUpdate: "Rinnovare le dipendenze...",
    complete: "Processo di rilascio completato",
    failed: "Processo di rilascio fallito",
    processingPackage: "Pacchetto di elaborazione: {{name}}",
    packageSkipped: "Pacchetto ' {{name}}' saltato: {{reason}}",
    packageComplete: "Pacchetto ' {{name}}' completato",
    packageFailed: "Pacchetto ' {{name}} ' fallito: {{error}}",
    firstRelease:
      "Nessun tag precedente trovato. Questa sarà la prima release.",
  },
  qualityChecks: {
    linting: "Correre linting per {{package}}...",
    lintPassed: "Linting passato per {{package}}",
    lintFailed: "Linting non riuscito per {{package}}",
    typeChecking: "Controllo del tipo in esecuzione per {{package}}...",
    typeCheckPassed: "Tipo di controllo passato per {{package}}",
    typeCheckFailed: "Controllo di tipo fallito per {{package}}",
    building: "Edificio {{package}}...",
    buildPassed: "Costruisci passato per {{package}}",
    buildFailed: "Costruzioni fallite per {{package}}",
    testing: "Test di esecuzione per {{package}}...",
    testsPassed: "Test passati per {{package}}",
    testsFailed: "I test sono falliti per {{package}}",
    snykTesting: "Esecuzione del test Snyk per {{package}}...",
    snykTestPassed: "Snyk test superato per {{package}}",
    snykTestFailed: "Il test di Snyk non è riuscito per {{package}}",
    snykMonitoring: "Monitor Snyk in esecuzione per {{package}}...",
    snykMonitorPassed: "Monitor Snyk completato per {{package}}",
    snykMonitorFailed: "Monitor Snyk non riuscito per {{package}}",
  },
  dependencies: {
    updating: "Aggiornare le dipendenze per {{directory}}...",
    updated: "Dipendenze aggiornate per {{directory}}",
    failed:
      "L'aggiornamento della dipendenza non è riuscito per {{directory}}: {{error}}",
    skipped: "Aggiornamenti di dipendenza per {{directory}}",
    dedupeFailed:
      "Non è riuscito a deduplicare le dipendenze per {{directory}}: {{error}}",
  },
  security: {
    auditFailed: "L'audit di sicurezza è fallito per {{directory}}: {{error}}",
  },
  hooks: {
    running: "Attacco {{hook}} per {{package}}...",
    completed: "Gancio {{hook}} completato per {{package}}",
    failed: "Comando gancio ' {{command}}' fallito: {{error}}",
    skipped: "Gomito {{hook}} (continueOnError)",
  },
  npm: {
    publishing: "Pubblicazione {{package}} a npm...",
    published: "Con successo ha pubblicato {{package}} @ {{version}} a npm",
    publishFailed: "Non ha pubblicato {{package}} a npm: {{error}}",
    registry: "Utilizzo del registro npm: {{registry}}",
    dryRun: "[ DRY RUN] Pubblicherebbe {{package}} @ {{version}} a npm",
  },
  changelog: {
    generating: "Generando il changelog per {{package}}...",
    generated: "Changelog generato per {{package}}",
    failed: "Non generare changelog per {{directory}}: {{error}}",
    noChanges: "Nessuna modifica da aggiungere a changelog per {{package}}",
  },
  branch: {
    checking: "Controllare lo stato del ramo...",
    notAllowed:
      "Le uscite dalla filiale ' {{branch}}' non sono consentite (principio: {{main}})",
    isProtected: "Branch ' {{branch}} ' è protetto",
  },
  gitRelease: {
    creating: "Creazione del rilascio GitHub per {{tag}}...",
    created: "Il rilascio GitHub è stato creato con successo: {{url}}",
    failed: "Non è riuscito a creare il rilascio GitHub: {{error}}",
    ghNotFound: "GitHub CLI (gh) non trovato - saltando il rilascio GitHub",
    notGitHub: "Il rilascio GitHub supporta solo i repository GitHub",
  },
  validation: {
    branchNotAllowed:
      "Il rilascio dalla filiale ' {{branch}} ' non è consentito",
    dirtyWorkingDir: "La directory di lavoro ha modifiche non commesse",
    passed: "Tutte le validazioni sono passate",
  },
  summary: {
    header: "Sintesi della pubblicazione",
    successCount: "Pacchetti {{count}} rilasciati con successo",
    skipCount: "Pacchetti {{count}} saltati",
    failCount: "Pacchetti {{count}} falliti",
  },
  jsr: {
    publishing: "Pubblicare {{package}} a JSR...",
    published: "Con successo ha pubblicato {{package}} a JSR",
    failed: "Non pubblicare {{package}} a JSR: {{error}}",
  },
  gitlab: {
    creating: "Creazione di GitLab release per {{tag}}...",
    created: "GitLab rilascio creato con successo: {{url}}",
    failed: "Non è riuscito a creare GitLab release: {{error}}",
    glabNotFound: "GitLab CLI (glab) non trovato - saltare GitLab release",
  },
  lockfile: {
    checking: "Controllare l'integrità del file di blocco...",
    valid: "Lockfile è valido",
    invalid: "Controllo dell'integrità del file di blocco fallito: {{error}}",
    missing: "Nessun file di blocco trovato (aspettato: {{expected}})",
  },
  notifications: {
    sending: "Inviare la notifica...",
    sent: "Notifica inviata con successo",
    failed: "Non inviare la notifica: {{error}}",
    disabled: "Notifiche disabilitate",
  },
  retry: {
    attempt:
      "Prova di riprovazione {{attempt}} di {{maxAttempts}} per {{operation}}",
    failed: "Tutti i tentativi di retry falliti per {{operation}}",
    success: "L'operazione {{operation}} è riuscita dopo la riprova",
  },
  rollback: {
    starting: "Cominciare a tornare indietro...",
    complete: "Rollback completato con successo",
    failed: "Rollback fallito: {{error}}",
    git: "Rotolare indietro git cambiamenti...",
    version: "Modifica della versione posteriore...",
  },
  timings: {
    report: "Ripartizione dei tempi",
    validation: "Validazione",
    install: "Installazione",
    clean: "Pulire",
    lint: "Lint",
    typecheck: "Tipologia",
    build: "Compilazione",
    test: "Test di prova",
    publish: "Pubblicazione",
    changelog: "Changelog",
    gitOperations: "Operazioni Git",
  },
  widget: {
    runRelease: "Esegui il rilascio",
    runAgain: "Correre di nuovo",
    complete: "Rilasciare completo",
    failed: "Rilasciare il fallimento",
    published: "Pubblicato",
    errors: "Errori",
    bullet: "•",
    warning: "⚠",
  },
};
