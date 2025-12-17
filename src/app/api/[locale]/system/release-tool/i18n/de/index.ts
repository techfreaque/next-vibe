import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Release-Tool",
  description: "Verwalte Paket-Releases mit Versionierung, Git-Tagging und CI/CD-Integration",
  category: "Release Tool",
  tags: {
    release: "Release",
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
      custom: "Benutzerdefiniert",
    },
    npmAccess: {
      public: "Öffentlich",
      restricted: "Eingeschränkt",
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
    title: "Release-Konfiguration",
    description: "Konfiguriere Release-Optionen für deine Pakete",
  },
  fields: {
    configPath: {
      title: "Konfigurationspfad",
      description: "Pfad zur release.config.ts Datei (Standard: release.config.ts)",
    },
    ci: {
      title: "CI-Modus",
      description: "Im CI-Modus ausführen (keine interaktiven Prompts, verwendet ciReleaseCommand)",
    },
    forceUpdate: {
      title: "Abhängigkeiten erzwingen",
      description: "Alle Abhängigkeiten ohne Nachfrage aktualisieren (überspringt alle anderen Schritte)",
    },
    dryRun: {
      title: "Testlauf",
      description: "Release simulieren ohne Änderungen vorzunehmen",
    },
    skipLint: {
      title: "Linting überspringen",
      description: "Linting-Schritt überspringen",
    },
    skipTypecheck: {
      title: "Typprüfung überspringen",
      description: "TypeScript-Typprüfung überspringen",
    },
    skipBuild: {
      title: "Build überspringen",
      description: "Build-Schritt überspringen",
    },
    skipTests: {
      title: "Tests überspringen",
      description: "Testausführung überspringen",
    },
    skipSnyk: {
      title: "Snyk überspringen",
      description: "Snyk-Schwachstellenscan überspringen",
    },
    skipPublish: {
      title: "Publish überspringen",
      description: "Veröffentlichung zu npm/Registry überspringen",
    },
    skipChangelog: {
      title: "Changelog überspringen",
      description: "Changelog-Generierung überspringen",
    },
    prereleaseId: {
      title: "Prerelease-ID",
      description: "Prerelease-Kennung (alpha, beta, rc) für Versionierung",
    },
    versionIncrement: {
      title: "Versionsinkrement",
      description: "Versionsinkrement-Typ (patch, minor, major) - nur im lokalen Modus verwendet",
    },
    targetPackage: {
      title: "Zielpaket",
      description: "Bestimmtes Paketverzeichnis anvisieren (optional, Standard ist alle Pakete)",
    },
    inlineConfig: {
      title: "Inline-Konfiguration",
      description: "Release-Konfiguration inline angeben anstatt Konfigurationsdatei zu verwenden",
    },
    skipGitTag: {
      title: "Git-Tag überspringen",
      description: "Erstellung des Git-Tags beim Release überspringen",
    },
    skipGitPush: {
      title: "Git-Push überspringen",
      description: "Push zu Remote-Repository überspringen",
    },
    verbose: {
      title: "Verbose",
      description: "Detaillierte Protokollierung aktivieren",
    },
    skipInstall: {
      title: "Installation überspringen",
      description: "Abhängigkeitsinstallation überspringen",
    },
    skipClean: {
      title: "Clean überspringen",
      description: "Clean-Schritt vor Build überspringen",
    },
    commitMessage: {
      title: "Commit-Nachricht",
      // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
      description: "Benutzerdefinierte Commit-Nachricht für Versionserhöhung (unterstützt ${version} Platzhalter)",
    },
    notifyWebhook: {
      title: "Benachrichtigungs-Webhook",
      description: "Webhook-URL für Release-Benachrichtigungen (Slack, Discord, Teams oder benutzerdefiniert)",
    },
    configObject: {
      title: "Konfigurationsobjekt",
      description: "Release-Konfigurationseinstellungen",
    },
    packageManager: {
      title: "Paketmanager",
      description: "Zu verwendender Paketmanager (bun, npm, yarn, pnpm, deno)",
    },
    globalVersion: {
      title: "Globale Version",
      description: "Globale Version für alle Pakete im Monorepo festlegen",
    },
    parallel: {
      title: "Parallele Ausführung",
      description: "Parallele Paketverarbeitung aktivieren",
    },
    maxParallelJobs: {
      title: "Max. parallele Jobs",
      description: "Maximale Anzahl paralleler Jobs",
    },
    continueOnError: {
      title: "Bei Fehler fortfahren",
      description: "Verarbeitung verbleibender Pakete fortsetzen, wenn eines fehlschlägt",
    },
    verifyGitStatus: {
      title: "Git-Status prüfen",
      description: "Git-Status vor Release prüfen",
    },
    requireCleanWorkingDir: {
      title: "Sauberes Arbeitsverzeichnis erforderlich",
      description: "Sauberes Arbeitsverzeichnis vor Release erforderlich",
    },
    verifyLockfile: {
      title: "Lockfile prüfen",
      description: "Lockfile-Integrität vor Release prüfen",
    },
    branch: {
      title: "Branch-Konfiguration",
      description: "Git-Branch-Konfigurationseinstellungen",
    },
    branchMain: {
      title: "Main-Branch",
      description: "Name des Main-/Produktions-Branches",
    },
    branchDevelop: {
      title: "Develop-Branch",
      description: "Name des Entwicklungs-Branches",
    },
    allowNonMain: {
      title: "Nicht-Main-Releases erlauben",
      description: "Releases von anderen Branches als Main erlauben",
    },
    protectedBranches: {
      title: "Geschützte Branches",
      description: "Liste geschützter Branch-Namen",
    },
    notifications: {
      title: "Benachrichtigungen",
      description: "Benachrichtigungskonfiguration für Release-Ereignisse",
    },
    notificationsEnabled: {
      title: "Benachrichtigungen aktivieren",
      description: "Release-Benachrichtigungen aktivieren",
    },
    webhookUrl: {
      title: "Webhook-URL",
      description: "URL für Webhook-Benachrichtigungen",
    },
    webhookType: {
      title: "Webhook-Typ",
      description: "Webhook-Typ (Slack, Discord, Teams, Benutzerdefiniert)",
    },
    onSuccess: {
      title: "Bei Erfolg benachrichtigen",
      description: "Benachrichtigung bei erfolgreichem Release senden",
    },
    onFailure: {
      title: "Bei Fehler benachrichtigen",
      description: "Benachrichtigung bei fehlgeschlagenem Release senden",
    },
    messageTemplate: {
      title: "Nachrichtenvorlage",
      description: "Benutzerdefinierte Nachrichtenvorlage für Benachrichtigungen",
    },
    includeTimings: {
      title: "Zeitinformationen einschließen",
      description: "Zeitinformationen in Benachrichtigungen einschließen",
    },
    retry: {
      title: "Wiederholungskonfiguration",
      description: "Wiederholungseinstellungen für fehlgeschlagene Operationen",
    },
    maxAttempts: {
      title: "Max. Versuche",
      description: "Maximale Anzahl von Wiederholungsversuchen",
    },
    delayMs: {
      title: "Wiederholungsverzögerung",
      description: "Anfängliche Verzögerung zwischen Wiederholungen in Millisekunden",
    },
    backoffMultiplier: {
      title: "Backoff-Multiplikator",
      description: "Multiplikator für exponentiellen Backoff",
    },
    maxDelayMs: {
      title: "Max. Verzögerung",
      description: "Maximale Verzögerung zwischen Wiederholungen in Millisekunden",
    },
    rollback: {
      title: "Rollback-Konfiguration",
      description: "Automatische Rollback-Einstellungen bei Fehler",
    },
    rollbackEnabled: {
      title: "Rollback aktivieren",
      description: "Automatischen Rollback bei Fehler aktivieren",
    },
    rollbackGit: {
      title: "Git-Änderungen rückgängig machen",
      description: "Git-Commits und -Tags bei Fehler rückgängig machen",
    },
    rollbackVersion: {
      title: "Versionsänderungen rückgängig machen",
      description: "Versionsänderungen bei Fehler rückgängig machen",
    },
    packages: {
      title: "Pakete",
      description: "Liste der zu veröffentlichenden Pakete",
    },
    package: {
      title: "Paketkonfiguration",
    },
    directory: {
      title: "Verzeichnis",
    },
    name: {
      title: "Name",
    },
    updateDeps: {
      title: "Abhängigkeiten aktualisieren",
      description: "Abhängigkeiten in abhängigen Paketen aktualisieren",
    },
    clean: {
      title: "Clean-Befehl",
      description: "Befehl oder Skript zum Bereinigen des Pakets",
    },
    lint: {
      title: "Lint-Befehl",
      description: "Befehl oder Skript zum Linten des Pakets",
    },
    typecheck: {
      title: "Typecheck-Befehl",
      description: "Befehl oder Skript zur Typprüfung des Pakets",
    },
    build: {
      title: "Build-Befehl",
      description: "Befehl oder Skript zum Bauen des Pakets",
    },
    test: {
      title: "Test-Befehl",
      description: "Befehl oder Skript zum Testen des Pakets",
    },
    snyk: {
      title: "Snyk-Scan",
      description: "Snyk-Sicherheitsscan aktivieren",
    },
    install: {
      title: "Install-Befehl",
      description: "Befehl oder Skript zur Installation von Abhängigkeiten",
    },
    release: {
      title: "Release-Konfiguration",
    },
    releaseVersion: {
      title: "Release-Version",
    },
    tagPrefix: {
      title: "Tag-Präfix",
    },
    tagSuffix: {
      title: "Tag-Suffix",
    },
    ciReleaseCommand: {
      title: "CI-Release-Befehl",
      description: "Befehl zur Ausführung im CI-Modus",
    },
    ciCommand: {
      title: "Befehl",
      description: "Auszuführendes Befehlsarray",
    },
    ciEnvMapping: {
      title: "Umgebungs-Mapping",
      description: "Umgebungsvariablen-Mappings für CI",
    },
    gitOps: {
      title: "Git-Operationen",
    },
    skipTag: {
      title: "Tag überspringen",
    },
    skipPush: {
      title: "Push überspringen",
    },
    skipCommit: {
      title: "Commit überspringen",
    },
    signCommit: {
      title: "Commit signieren",
    },
    signTag: {
      title: "Tag signieren",
    },
    remote: {
      title: "Remote",
    },
    npm: {
      title: "NPM-Konfiguration",
    },
    npmEnabled: {
      title: "NPM-Veröffentlichung aktivieren",
    },
    npmRegistry: {
      title: "NPM-Registry",
    },
    npmTag: {
      title: "NPM-Tag",
    },
    npmAccess: {
      title: "NPM-Zugriff",
    },
    otpEnvVar: {
      title: "OTP-Umgebungsvariable",
    },
    provenance: {
      title: "Provenance",
    },
    ignoreScripts: {
      title: "Skripte ignorieren",
    },
    npmDryRun: {
      title: "NPM-Testlauf",
    },
    jsr: {
      title: "JSR-Konfiguration",
    },
    jsrEnabled: {
      title: "JSR-Veröffentlichung aktivieren",
    },
    allowSlowTypes: {
      title: "Langsame Typen erlauben",
    },
    allowDirty: {
      title: "Dirty erlauben",
    },
    jsrDryRun: {
      title: "JSR-Testlauf",
    },
    changelog: {
      title: "Changelog-Konfiguration",
    },
    changelogEnabled: {
      title: "Changelog aktivieren",
    },
    changelogFile: {
      title: "Changelog-Datei",
    },
    changelogHeader: {
      title: "Changelog-Header",
    },
    compareUrlFormat: {
      title: "Vergleichs-URL-Format",
    },
    commitUrlFormat: {
      title: "Commit-URL-Format",
    },
    includeBody: {
      title: "Body einschließen",
    },
    changelogPreset: {
      title: "Changelog-Preset",
    },
    gitRelease: {
      title: "Git-Release-Konfiguration",
    },
    gitReleaseEnabled: {
      title: "Git-Release aktivieren",
    },
    releaseTitle: {
      title: "Release-Titel",
    },
    generateNotes: {
      title: "Notizen generieren",
    },
    releaseBody: {
      title: "Release-Body",
    },
    draft: {
      title: "Entwurf",
    },
    prerelease: {
      title: "Prerelease",
    },
    discussionCategory: {
      title: "Diskussionskategorie",
    },
    target: {
      title: "Ziel",
    },
    assets: {
      title: "Assets",
      description: "Hochzuladende Release-Assets",
    },
    foldersToZip: {
      title: "Zu zippende Ordner",
      description: "Für Release zu zippende Ordner",
    },
    versionBumper: {
      title: "Versions-Bumper",
      description: "Versionierungskonfiguration für Nicht-package.json-Dateien",
    },
    hooks: {
      title: "Lifecycle-Hooks",
      description: "Befehle, die in verschiedenen Phasen ausgeführt werden",
    },
    preInstall: {
      title: "Pre-Install-Hook",
    },
    postInstall: {
      title: "Post-Install-Hook",
    },
    preClean: {
      title: "Pre-Clean-Hook",
    },
    postClean: {
      title: "Post-Clean-Hook",
    },
    preLint: {
      title: "Pre-Lint-Hook",
    },
    postLint: {
      title: "Post-Lint-Hook",
    },
    preBuild: {
      title: "Pre-Build-Hook",
    },
    postBuild: {
      title: "Post-Build-Hook",
    },
    preTest: {
      title: "Pre-Test-Hook",
    },
    postTest: {
      title: "Post-Test-Hook",
    },
    prePublish: {
      title: "Pre-Publish-Hook",
    },
    postPublish: {
      title: "Post-Publish-Hook",
    },
    preRelease: {
      title: "Pre-Release-Hook",
    },
    postRelease: {
      title: "Post-Release-Hook",
    },
    globalHooks: {
      title: "Globale Hooks",
      description: "Globale Lifecycle-Hooks für gesamten Release-Prozess",
    },
  },
  response: {
    status: "Status",
    success: "Release-Status",
    output: "Release-Log",
    duration: "Dauer",
    packages: "Pakete",
    packagesProcessed: "Verarbeitete Pakete",
    ciEnvironment: "CI-Umgebung",
    errors: "Fehler",
    warnings: "Warnungen",
    gitInfo: "Git-Informationen",
    published: "Veröffentlichte Pakete",
    publishedPackages: "Veröffentlichte Pakete",
    timings: "Performance",
    rollbackPerformed: "Rollback durchgeführt",
    notificationsSent: "Benachrichtigungen",
  },
  table: {
    name: "Paket",
    directory: "Verzeichnis",
    version: "Version",
    tag: "Tag",
    status: "Status",
    message: "Nachricht",
    registry: "Registry",
    url: "URL",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Release-Konfiguration",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Konfigurationsdatei oder Paket nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Fehler während des Release-Prozesses aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler während des Release-Prozesses",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Nicht berechtigt, Release durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf Release-Operation verweigert",
    },
    conflict: {
      title: "Konflikt",
      description: "Release-Konflikt erkannt (Tag existiert möglicherweise bereits)",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Es gibt nicht gespeicherte Änderungen, die zuerst committet werden müssen",
    },
    packageNotFound: "Paket '{{targetPackage}}' nicht in Konfiguration gefunden",
    gitOperationFailed: "Git-Operation fehlgeschlagen: {{error}}",
  },
  success: {
    title: "Release abgeschlossen",
    description: "Release-Prozess erfolgreich abgeschlossen",
  },
  config: {
    fileNotFound: "Konfigurationsdatei nicht gefunden: {{path}}",
    invalidFormat:
      "Ungültiges Konfigurationsformat. Stelle sicher, dass die Konfiguration ein Standardobjekt mit einem 'packages'-Array exportiert.",
    errorLoading: "Fehler beim Laden der Konfiguration: {{error}}",
  },
  packageJson: {
    notFound: "Package.json nicht gefunden: {{path}}",
    invalidFormat: "Ungültiges package.json-Format: {{path}}",
    errorReading: "Fehler beim Lesen der package.json: {{error}}",
    errorUpdatingDeps: "Fehler beim Aktualisieren der Abhängigkeiten für {{directory}}: {{error}}",
    errorUpdatingVersion: "Fehler beim Aktualisieren der Paketversion für {{directory}}: {{error}}",
  },
  scripts: {
    invalidPackageJson: "Ungültiges package.json-Format in {{path}}",
    testsFailed: "Tests fehlgeschlagen in {{path}}: {{error}}",
    lintFailed: "Linting fehlgeschlagen in {{path}}",
    typecheckFailed: "Typprüfung fehlgeschlagen in {{path}}: {{error}}",
    buildFailed: "Build fehlgeschlagen in {{path}}: {{error}}",
    packageJsonNotFound: "Package.json nicht gefunden in {{path}}",
  },
  snyk: {
    cliNotFound: "Snyk CLI nicht gefunden. Installiere mit: npm install -g snyk",
    testFailed: "Snyk-Schwachstellentest fehlgeschlagen für {{packageName}}: {{error}}",
    tokenRequired:
      "SNYK_TOKEN Umgebungsvariable erforderlich für {{packageName}}",
    orgKeyRequired:
      "SNYK_ORG_KEY Umgebungsvariable erforderlich für {{packageName}}",
    monitorFailed: "Snyk-Monitor fehlgeschlagen für {{packageName}}: {{error}}",
  },
  git: {
    tagCreated: "Git-Tag '{{tag}}' erfolgreich erstellt",
    tagExists: "Git-Tag '{{tag}}' existiert bereits",
    pushSuccess: "Änderungen zu Remote gepusht",
    noCommits: "Keine neuen Commits seit Tag '{{lastTag}}'",
    uncommittedChanges: "Nicht commitete Änderungen erkannt",
    notOnMain: "Nicht auf main-Branch (aktuell: {{currentBranch}})",
    commitFailed: "Commit fehlgeschlagen",
    tagFailed: "Tag-Erstellung fehlgeschlagen",
    pushFailed: "Push zu Remote fehlgeschlagen",
  },
  version: {
    bumped: "Version erhöht von {{from}} auf {{to}} ({{increment}})",
    fileUpdated: "Version in {{file}} auf {{newVersion}} aktualisiert",
    invalidFormat: "Ungültiges Versionsformat: {{version}}",
  },
  ci: {
    commandRunning: "Führe CI-Release-Befehl für {{package}} aus: {{command}}",
    commandSuccess: "CI-Release-Befehl abgeschlossen für {{package}}",
    commandFailed: "CI-Release-Befehl fehlgeschlagen für {{package}}: {{error}}",
    commandRequired: "CI-Modus erfordert ciReleaseCommand-Konfiguration für {{package}}",
    envVarMissing: "Erforderliche Umgebungsvariable '{{variable}}' nicht gesetzt für {{package}}",
  },
  zip: {
    starting: "Zippe Ordner...",
    complete: "Erfolgreich gezippt {{input}} nach {{output}} ({{bytes}} Bytes)",
    failed: "Zippen von {{input}} fehlgeschlagen: {{error}}",
    noFolders: "Keine Ordner zum Zippen in Konfiguration",
    inputNotFound: "Eingabeordner {{input}} existiert nicht",
  },
  dryRun: {
    prefix: "[TESTLAUF]",
    wouldExecute: "Würde ausführen: {{action}}",
  },
  release: {
    starting: "Starte Release-Prozess...",
    ciMode: "Führe Release im CI-Modus aus...",
    localMode: "Führe Release im lokalen Modus aus...",
    forceUpdate: "Erzwinge Abhängigkeitsaktualisierung...",
    complete: "Release-Prozess abgeschlossen",
    failed: "Release-Prozess fehlgeschlagen",
    processingPackage: "Verarbeite Paket: {{name}}",
    packageSkipped: "Paket '{{name}}' übersprungen: {{reason}}",
    packageComplete: "Paket '{{name}}' abgeschlossen",
    packageFailed: "Paket '{{name}}' fehlgeschlagen: {{error}}",
    firstRelease: "Keine vorherigen Tags gefunden. Dies wird das erste Release.",
  },
  qualityChecks: {
    linting: "Führe Linting für {{package}} aus...",
    lintPassed: "Linting erfolgreich für {{package}}",
    lintFailed: "Linting fehlgeschlagen für {{package}}",
    typeChecking: "Führe Typprüfung für {{package}} aus...",
    typeCheckPassed: "Typprüfung erfolgreich für {{package}}",
    typeCheckFailed: "Typprüfung fehlgeschlagen für {{package}}",
    building: "Baue {{package}}...",
    buildPassed: "Build erfolgreich für {{package}}",
    buildFailed: "Build fehlgeschlagen für {{package}}",
    testing: "Führe Tests für {{package}} aus...",
    testsPassed: "Tests erfolgreich für {{package}}",
    testsFailed: "Tests fehlgeschlagen für {{package}}",
    snykTesting: "Führe Snyk-Test für {{package}} aus...",
    snykTestPassed: "Snyk-Test erfolgreich für {{package}}",
    snykTestFailed: "Snyk-Test fehlgeschlagen für {{package}}",
    snykMonitoring: "Führe Snyk-Monitor für {{package}} aus...",
    snykMonitorPassed: "Snyk-Monitor abgeschlossen für {{package}}",
    snykMonitorFailed: "Snyk-Monitor fehlgeschlagen für {{package}}",
  },
  dependencies: {
    updating: "Aktualisiere Abhängigkeiten für {{directory}}...",
    updated: "Abhängigkeiten aktualisiert für {{directory}}",
    failed: "Abhängigkeitsaktualisierung fehlgeschlagen für {{directory}}: {{error}}",
    skipped: "Überspringe Abhängigkeitsaktualisierung für {{directory}}",
    dedupeFailed: "Deduplizierung der Abhängigkeiten fehlgeschlagen für {{directory}}: {{error}}",
  },
  security: {
    auditFailed: "Sicherheitsüberprüfung fehlgeschlagen für {{directory}}: {{error}}",
  },
  hooks: {
    running: "Führe {{hook}}-Hook für {{package}} aus...",
    completed: "Hook {{hook}} abgeschlossen für {{package}}",
    failed: "Hook {{hook}} fehlgeschlagen für {{package}}: {{error}}",
    skipped: "Überspringe {{hook}}-Hook (continueOnError)",
  },
  npm: {
    publishing: "Veröffentliche {{package}} zu npm...",
    published: "{{package}}@{{version}} erfolgreich zu npm veröffentlicht",
    publishFailed: "Veröffentlichung von {{package}} zu npm fehlgeschlagen: {{error}}",
    registry: "Verwende npm-Registry: {{registry}}",
    dryRun: "[TESTLAUF] Würde {{package}}@{{version}} zu npm veröffentlichen",
  },
  changelog: {
    generating: "Generiere Changelog für {{package}}...",
    generated: "Changelog generiert für {{package}}",
    failed: "Changelog-Generierung fehlgeschlagen für {{package}}: {{error}}",
    noChanges: "Keine Änderungen für Changelog von {{package}}",
  },
  branch: {
    checking: "Prüfe Branch-Status...",
    notAllowed: "Releases von Branch '{{branch}}' nicht erlaubt (main: {{main}})",
    isProtected: "Branch '{{branch}}' ist geschützt",
  },
  gitRelease: {
    creating: "Erstelle GitHub-Release für {{tag}}...",
    created: "GitHub-Release erfolgreich erstellt: {{url}}",
    failed: "GitHub-Release-Erstellung fehlgeschlagen: {{error}}",
    ghNotFound: "GitHub CLI (gh) nicht gefunden - überspringe GitHub-Release",
    notGitHub: "GitHub-Release nur für GitHub-Repositories unterstützt",
  },
  validation: {
    branchNotAllowed: "Release von Branch '{{branch}}' ist nicht erlaubt",
    dirtyWorkingDir: "Arbeitsverzeichnis hat nicht commitete Änderungen",
    passed: "Alle Validierungen bestanden",
  },
  summary: {
    header: "Release-Zusammenfassung",
    successCount: "{{count}} Pakete erfolgreich veröffentlicht",
    skipCount: "{{count}} Pakete übersprungen",
    failCount: "{{count}} Pakete fehlgeschlagen",
  },
  jsr: {
    publishing: "Veröffentliche {{package}} zu JSR...",
    published: "{{package}} erfolgreich zu JSR veröffentlicht",
    failed: "Veröffentlichung von {{package}} zu JSR fehlgeschlagen: {{error}}",
  },
  gitlab: {
    creating: "Erstelle GitLab-Release für {{tag}}...",
    created: "GitLab-Release erfolgreich erstellt: {{url}}",
    failed: "GitLab-Release-Erstellung fehlgeschlagen: {{error}}",
    glabNotFound: "GitLab CLI (glab) nicht gefunden - überspringe GitLab-Release",
  },
  lockfile: {
    checking: "Prüfe Lockfile-Integrität...",
    valid: "Lockfile ist gültig",
    invalid: "Lockfile-Integritätsprüfung fehlgeschlagen: {{error}}",
    missing: "Kein Lockfile gefunden (erwartet: {{expected}})",
  },
  notifications: {
    sending: "Sende Benachrichtigung...",
    sent: "Benachrichtigung erfolgreich gesendet",
    failed: "Senden der Benachrichtigung fehlgeschlagen: {{error}}",
    disabled: "Benachrichtigungen deaktiviert",
  },
  retry: {
    attempt: "Wiederholungsversuch {{attempt}} von {{maxAttempts}} für {{operation}}",
    failed: "Alle Wiederholungsversuche fehlgeschlagen für {{operation}}",
    success: "Operation {{operation}} erfolgreich nach Wiederholung",
  },
  rollback: {
    starting: "Starte Rollback...",
    complete: "Rollback erfolgreich abgeschlossen",
    failed: "Rollback fehlgeschlagen: {{error}}",
    git: "Mache Git-Änderungen rückgängig...",
    version: "Mache Versionsänderungen rückgängig...",
  },
  timings: {
    report: "Zeitaufschlüsselung",
    validation: "Validierung",
    install: "Installation",
    clean: "Clean",
    lint: "Linting",
    typecheck: "Typprüfung",
    build: "Build",
    test: "Tests",
    publish: "Veröffentlichung",
    changelog: "Changelog",
    gitOperations: "Git-Operationen",
  },
};
