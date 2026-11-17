import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Outil de release",
  titleShort: "Outil de release",
  description:
    "Gérer les releases de packages : bump de version, tags git et intégration CI/CD",
  category: "Outil de release",
  tags: {
    release: "Release",
  },
  enums: {
    versionIncrement: {
      patch: "Patch",
      minor: "Mineure",
      major: "Majeure",
      prepatch: "Pré-patch",
      preminor: "Pré-mineure",
      premajor: "Pré-majeure",
      prerelease: "Pré-release",
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
      custom: "Personnalisé",
    },
    npmAccess: {
      public: "Public",
      restricted: "Restreint",
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
    title: "Configuration de la release",
    description: "Définir les options de release de vos packages",
  },
  fields: {
    configPath: {
      title: "Chemin de la configuration",
      description:
        "Chemin du fichier release.config.ts (par défaut : release.config.ts)",
    },
    ci: {
      title: "Mode CI",
      description:
        "Lancer en mode CI (aucune question interactive, utilise ciReleaseCommand)",
    },
    forceUpdate: {
      title: "Forcer la mise à jour des dépendances",
      description:
        "Mettre à jour toutes les dépendances sans confirmation (ignore toutes les autres étapes)",
    },
    dryRun: {
      title: "Simulation",
      description: "Simuler la release sans rien modifier",
    },
    skipLint: {
      title: "Sans lint",
      description: "Ignorer l'étape de lint",
    },
    skipTypecheck: {
      title: "Sans vérification des types",
      description: "Ignorer l'étape de vérification des types TypeScript",
    },
    skipBuild: {
      title: "Sans build",
      description: "Ignorer l'étape de build",
    },
    skipTests: {
      title: "Sans tests",
      description: "Ignorer l'exécution des tests",
    },
    skipSnyk: {
      title: "Sans Snyk",
      description: "Ignorer l'analyse de vulnérabilités Snyk",
    },
    skipPublish: {
      title: "Sans publication",
      description: "Ignorer la publication sur npm/le registre",
    },
    skipChangelog: {
      title: "Sans changelog",
      description: "Ignorer la génération du changelog",
    },
    prereleaseId: {
      title: "ID de pré-release",
      description:
        "Identifiant de pré-release (alpha, beta, rc) pour le bump de version",
    },
    versionIncrement: {
      title: "Incrément de version",
      description:
        "Type d'incrément de version (patch, minor, major), uniquement en mode local",
    },
    targetPackage: {
      title: "Package cible",
      description:
        "Répertoire d'un package précis (facultatif, par défaut tous les packages)",
    },
    inlineConfig: {
      title: "Configuration inline",
      description:
        "Fournir la configuration de release inline au lieu d'un fichier de configuration",
    },
    skipGitTag: {
      title: "Sans tag git",
      description: "Ne pas créer de tag git pendant la release",
    },
    skipGitPush: {
      title: "Sans push git",
      description: "Ne pas pousser vers le dépôt distant",
    },
    verbose: {
      title: "Verbeux",
      description: "Activer les logs détaillés",
    },
    skipInstall: {
      title: "Sans installation",
      description: "Ignorer l'installation des dépendances",
    },
    skipClean: {
      title: "Sans nettoyage",
      description: "Ignorer le nettoyage avant le build",
    },
    commitMessage: {
      title: "Message de commit",
      description:
        // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
        "Message de commit personnalisé pour le bump de version (accepte le placeholder ${version})",
    },
    notifyWebhook: {
      title: "Webhook de notification",
      description:
        "URL du webhook qui reçoit les notifications de release (Slack, Discord, Teams ou personnalisé)",
    },
    configObject: {
      title: "Objet de configuration",
      description: "Réglages de la configuration de release",
    },
    packageManager: {
      title: "Gestionnaire de paquets",
      description:
        "Gestionnaire de paquets utilisé pour les releases (bun, npm, yarn, pnpm, deno)",
    },
    globalVersion: {
      title: "Version globale",
      description:
        "Définir une version commune à tous les packages du monorepo",
    },
    parallel: {
      title: "Exécution parallèle",
      description: "Traiter les packages en parallèle",
    },
    maxParallelJobs: {
      title: "Jobs parallèles max",
      description: "Nombre maximal de jobs parallèles",
    },
    continueOnError: {
      title: "Continuer en cas d'erreur",
      description: "Poursuivre avec les autres packages si l'un échoue",
    },
    verifyGitStatus: {
      title: "Vérifier le statut git",
      description: "Vérifier le statut git avant la release",
    },
    requireCleanWorkingDir: {
      title: "Exiger un répertoire de travail propre",
      description: "Exiger un répertoire de travail propre avant la release",
    },
    verifyLockfile: {
      title: "Vérifier le lockfile",
      description: "Vérifier l'intégrité du lockfile avant la release",
    },
    branch: {
      title: "Configuration des branches",
      description: "Réglages des branches git",
    },
    branchMain: {
      title: "Branche principale",
      description: "Nom de la branche principale/de production",
    },
    branchDevelop: {
      title: "Branche de développement",
      description: "Nom de la branche de développement",
    },
    allowNonMain: {
      title: "Autoriser les releases hors main",
      description: "Autoriser les releases depuis d'autres branches que main",
    },
    protectedBranches: {
      title: "Branches protégées",
      description: "Liste des branches protégées",
    },
    notifications: {
      title: "Notifications",
      description: "Configuration des notifications des événements de release",
    },
    notificationsEnabled: {
      title: "Activer les notifications",
      description: "Activer les notifications de release",
    },
    webhookUrl: {
      title: "URL du webhook",
      description: "URL des notifications webhook",
    },
    webhookType: {
      title: "Type de webhook",
      description: "Type de webhook (Slack, Discord, Teams, personnalisé)",
    },
    onSuccess: {
      title: "Notifier en cas de succès",
      description: "Envoyer une notification quand la release réussit",
    },
    onFailure: {
      title: "Notifier en cas d'échec",
      description: "Envoyer une notification quand la release échoue",
    },
    messageTemplate: {
      title: "Modèle de message",
      description: "Modèle de message personnalisé pour les notifications",
    },
    includeTimings: {
      title: "Inclure les durées",
      description: "Inclure les durées dans les notifications",
    },
    retry: {
      title: "Configuration des nouvelles tentatives",
      description: "Réglages des nouvelles tentatives après échec",
    },
    maxAttempts: {
      title: "Tentatives max",
      description: "Nombre maximal de tentatives",
    },
    delayMs: {
      title: "Délai entre tentatives",
      description: "Délai initial entre deux tentatives, en millisecondes",
    },
    backoffMultiplier: {
      title: "Multiplicateur de backoff",
      description: "Multiplicateur du backoff exponentiel",
    },
    maxDelayMs: {
      title: "Délai max",
      description: "Délai maximal entre deux tentatives, en millisecondes",
    },
    rollback: {
      title: "Configuration du rollback",
      description: "Réglages du rollback automatique en cas d'échec",
    },
    rollbackEnabled: {
      title: "Activer le rollback",
      description: "Activer le rollback automatique en cas d'échec",
    },
    rollbackGit: {
      title: "Annuler les changements git",
      description: "Annuler les commits et tags git en cas d'échec",
    },
    rollbackVersion: {
      title: "Annuler les changements de version",
      description: "Annuler les changements de version en cas d'échec",
    },
    packages: {
      title: "Packages",
      description: "Liste des packages à publier",
    },
    package: {
      title: "Configuration du package",
    },
    directory: {
      title: "Répertoire",
    },
    name: {
      title: "Nom",
    },
    updateDeps: {
      title: "Mettre à jour les dépendances",
      description: "Mettre à jour les dépendances des packages dépendants",
    },
    clean: {
      title: "Commande de nettoyage",
      description: "Commande ou script de nettoyage du package",
    },
    lint: {
      title: "Commande de lint",
      description: "Commande ou script de lint du package",
    },
    typecheck: {
      title: "Commande de typecheck",
      description: "Commande ou script de vérification des types du package",
    },
    build: {
      title: "Commande de build",
      description: "Commande ou script de build du package",
    },
    test: {
      title: "Commande de test",
      description: "Commande ou script de test du package",
    },
    snyk: {
      title: "Analyse Snyk",
      description: "Activer l'analyse de sécurité Snyk",
    },
    install: {
      title: "Commande d'installation",
      description: "Commande ou script d'installation des dépendances",
    },
    release: {
      title: "Configuration de la release",
    },
    releaseVersion: {
      title: "Version de la release",
    },
    tagPrefix: {
      title: "Préfixe du tag",
    },
    tagSuffix: {
      title: "Suffixe du tag",
    },
    ciReleaseCommand: {
      title: "Commande de release CI",
      description: "Commande lancée en mode CI pour publier",
    },
    ciCommand: {
      title: "Commande",
      description: "Tableau de commande à exécuter",
    },
    ciEnvMapping: {
      title: "Mapping de l'environnement",
      description: "Mapping des variables d'environnement pour la CI",
    },
    gitOps: {
      title: "Opérations git",
    },
    skipTag: {
      title: "Sans tag",
    },
    skipPush: {
      title: "Sans push",
    },
    skipCommit: {
      title: "Sans commit",
    },
    signCommit: {
      title: "Signer le commit",
    },
    signTag: {
      title: "Signer le tag",
    },
    remote: {
      title: "Remote",
    },
    npm: {
      title: "Configuration npm",
    },
    npmEnabled: {
      title: "Activer la publication npm",
    },
    npmRegistry: {
      title: "Registre npm",
    },
    npmTag: {
      title: "Tag npm",
    },
    npmAccess: {
      title: "Accès npm",
    },
    otpEnvVar: {
      title: "Variable d'environnement OTP",
    },
    provenance: {
      title: "Provenance",
    },
    ignoreScripts: {
      title: "Ignorer les scripts",
    },
    npmDryRun: {
      title: "Simulation npm",
    },
    jsr: {
      title: "Configuration JSR",
    },
    jsrEnabled: {
      title: "Activer la publication JSR",
    },
    allowSlowTypes: {
      title: "Autoriser les slow types",
    },
    allowDirty: {
      title: "Autoriser un arbre modifié",
    },
    jsrDryRun: {
      title: "Simulation JSR",
    },
    changelog: {
      title: "Configuration du changelog",
    },
    changelogEnabled: {
      title: "Activer le changelog",
    },
    changelogFile: {
      title: "Fichier du changelog",
    },
    changelogHeader: {
      title: "En-tête du changelog",
    },
    compareUrlFormat: {
      title: "Format de l'URL de comparaison",
    },
    commitUrlFormat: {
      title: "Format de l'URL de commit",
    },
    includeBody: {
      title: "Inclure le corps",
    },
    changelogPreset: {
      title: "Preset du changelog",
    },
    gitRelease: {
      title: "Configuration de la release git",
    },
    gitReleaseEnabled: {
      title: "Activer la release git",
    },
    releaseTitle: {
      title: "Titre de la release",
    },
    generateNotes: {
      title: "Générer les notes",
    },
    releaseBody: {
      title: "Corps de la release",
    },
    draft: {
      title: "Brouillon",
    },
    prerelease: {
      title: "Pré-release",
    },
    discussionCategory: {
      title: "Catégorie de discussion",
    },
    target: {
      title: "Cible",
    },
    assets: {
      title: "Assets",
      description: "Assets de release à téléverser",
    },
    foldersToZip: {
      title: "Dossiers à zipper",
      description: "Dossiers à zipper pour la release",
    },
    versionBumper: {
      title: "Bump de version",
      description:
        "Configuration du bump de version pour les fichiers autres que package.json",
    },
    hooks: {
      title: "Hooks de cycle de vie",
      description: "Commandes à lancer aux différentes étapes",
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
    preTypecheck: {
      title: "Hook pre-typecheck",
    },
    postTypecheck: {
      title: "Hook post-typecheck",
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
      title: "Hooks globaux",
      description: "Hooks de cycle de vie globaux pour toute la release",
    },
  },
  response: {
    status: "Statut",
    success: "Statut de la release",
    output: "Journal de la release",
    duration: "Durée",
    packages: "Packages",
    packagesProcessed: "Packages traités",
    ciEnvironment: "Environnement CI",
    errors: "Erreurs",
    warnings: "Avertissements",
    gitInfo: "Informations git",
    published: "Packages publiés",
    publishedPackages: "Packages publiés",
    timings: "Performances",
    rollbackPerformed: "Rollback effectué",
    notificationsSent: "Notifications",
  },
  table: {
    name: "Package",
    directory: "Répertoire",
    version: "Version",
    tag: "Tag",
    status: "Statut",
    message: "Message",
    registry: "Registre",
    url: "URL",
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Configuration de release invalide",
    },
    notFound: {
      title: "Introuvable",
      description: "Fichier de configuration ou package introuvable",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur s'est produite pendant la release",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    network: {
      title: "Erreur réseau",
      description: "Erreur réseau pendant la release",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous n'êtes pas autorisé à lancer une release",
    },
    forbidden: {
      title: "Interdit",
      description: "Accès refusé pour l'opération de release",
    },
    conflict: {
      title: "Conflit",
      description: "Conflit de release détecté (le tag existe peut-être déjà)",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description:
        "Des modifications non enregistrées doivent d'abord être commitées",
    },
    packageNotFound:
      "Package '{{targetPackage}}' introuvable dans la configuration",
    gitOperationFailed: "Échec de l'opération git : {{error}}",
    gitAddFailed: "Échec de git add : {{error}}",
    gitTagFailed: "Échec du tag git '{{tag}}' : {{error}}",
    gitPushFailed: "Échec du push git vers '{{remote}}' : {{error}}",
    gitPushTagFailed:
      "Échec du push du tag git '{{tag}}' vers '{{remote}}' : {{error}}",
  },
  success: {
    title: "Release terminée",
    description: "Processus de release terminé",
  },
  config: {
    fileNotFound: "Fichier de configuration introuvable : {{path}}",
    invalidFormat:
      "Format de configuration invalide. La configuration doit exporter par défaut un objet avec un tableau 'packages'. Consultez la documentation pour plus d'infos.",
    errorLoading: "Erreur de chargement de la configuration : {{error}}",
  },
  packageJson: {
    notFound: "package.json introuvable : {{path}}",
    invalidFormat: "Format de package.json invalide : {{path}}",
    errorReading: "Erreur de lecture du package.json : {{error}}",
    errorUpdatingDeps:
      "Erreur de mise à jour des dépendances de {{directory}} : {{error}}",
    errorUpdatingVersion:
      "Erreur de mise à jour de la version du package {{directory}} : {{error}}",
  },
  scripts: {
    invalidPackageJson: "Format de package.json invalide dans {{path}}",
    testsFailed: "Échec des tests dans {{path}} : {{error}}",
    lintFailed: "Échec du lint dans {{path}} : {{output}}",
    typecheckFailed:
      "Échec de la vérification des types dans {{path}} : {{error}}",
    buildFailed: "Échec du build dans {{path}} : {{error}}",
    packageJsonNotFound: "package.json introuvable dans {{path}}",
  },
  snyk: {
    cliNotFound:
      "CLI Snyk introuvable. Installez-la avec : npm install -g snyk",
    testFailed:
      "Échec du test de vulnérabilités Snyk pour {{packageName}} : {{error}}",
    tokenRequired:
      "La variable d'environnement SNYK_TOKEN est requise pour {{packageName}}",
    orgKeyRequired:
      "La variable d'environnement SNYK_ORG_KEY est requise pour {{packageName}}",
    monitorFailed: "Échec de snyk monitor pour {{packageName}} : {{error}}",
  },
  git: {
    tagCreated: "Tag git '{{tag}}' créé",
    tagExists: "Le tag git '{{tag}}' existe déjà",
    pushSuccess: "Changements poussés vers le remote",
    noCommits: "Aucun nouveau commit depuis le tag '{{lastTag}}'",
    uncommittedChanges: "Changements non commités détectés",
    notOnMain:
      "Pas sur la branche '{{main}}' (branche courante : {{currentBranch}})",
    commitFailed: "Échec du commit des changements",
    tagFailed: "Échec de la création du tag",
    pushFailed: "Échec du push vers le remote",
  },
  version: {
    bumped: "Version passée de {{from}} à {{to}} ({{increment}})",
    fileUpdated: "Version mise à jour dans {{file}} : {{newVersion}}",
    invalidFormat: "Format de version invalide : {{version}}",
  },
  ci: {
    commandRunning:
      "Exécution de la commande de release CI pour {{package}} : {{command}}",
    commandSuccess: "Commande de release CI terminée pour {{package}}",
    commandFailed:
      "Échec de la commande de release CI pour {{package}} : {{error}}",
    commandRequired:
      "Le mode CI exige une configuration ciReleaseCommand pour {{package}}",
    envVarMissing:
      "La variable d'environnement requise '{{variable}}' n'est pas définie pour {{package}}",
  },
  zip: {
    starting: "Compression des dossiers...",
    complete: "{{input}} zippé vers {{output}} ({{bytes}} octets)",
    failed: "Échec de la compression de {{input}} : {{error}}",
    noFolders: "Aucun dossier à zipper dans la configuration",
    inputNotFound: "Le dossier d'entrée {{input}} n'existe pas",
  },
  dryRun: {
    prefix: "[SIMULATION]",
    wouldExecute: "Exécuterait : {{action}}",
  },
  release: {
    starting: "Démarrage de la release...",
    ciMode: "Release en mode CI...",
    localMode: "Release en mode local...",
    forceUpdate: "Mise à jour forcée des dépendances...",
    complete: "Processus de release terminé",
    failed: "Échec du processus de release",
    processingPackage: "Traitement du package : {{name}}",
    packageSkipped: "Package '{{name}}' ignoré : {{reason}}",
    packageComplete: "Package '{{name}}' terminé",
    packageFailed: "Échec du package '{{name}}' : {{error}}",
    firstRelease: "Aucun tag précédent trouvé. Ce sera la première release.",
  },
  qualityChecks: {
    linting: "Lint de {{package}}...",
    lintPassed: "Lint réussi pour {{package}}",
    lintFailed: "Échec du lint pour {{package}}",
    typeChecking: "Vérification des types de {{package}}...",
    typeCheckPassed: "Vérification des types réussie pour {{package}}",
    typeCheckFailed: "Échec de la vérification des types pour {{package}}",
    building: "Build de {{package}}...",
    buildPassed: "Build réussi pour {{package}}",
    buildFailed: "Échec du build pour {{package}}",
    testing: "Tests de {{package}}...",
    testsPassed: "Tests réussis pour {{package}}",
    testsFailed: "Échec des tests pour {{package}}",
    snykTesting: "Test Snyk de {{package}}...",
    snykTestPassed: "Test Snyk réussi pour {{package}}",
    snykTestFailed: "Échec du test Snyk pour {{package}}",
    snykMonitoring: "Snyk monitor pour {{package}}...",
    snykMonitorPassed: "Snyk monitor terminé pour {{package}}",
    snykMonitorFailed: "Échec de snyk monitor pour {{package}}",
  },
  dependencies: {
    updating: "Mise à jour des dépendances de {{directory}}...",
    updated: "Dépendances de {{directory}} mises à jour",
    failed:
      "Échec de la mise à jour des dépendances de {{directory}} : {{error}}",
    skipped: "Mise à jour des dépendances ignorée pour {{directory}}",
    dedupeFailed:
      "Échec de la déduplication des dépendances de {{directory}} : {{error}}",
  },
  security: {
    auditFailed: "Échec de l'audit de sécurité de {{directory}} : {{error}}",
  },
  hooks: {
    running: "Exécution du hook {{hook}} pour {{package}}...",
    completed: "Hook {{hook}} terminé pour {{package}}",
    failed: "Échec de la commande du hook '{{command}}' : {{error}}",
    skipped: "Hook {{hook}} ignoré (continueOnError)",
  },
  npm: {
    publishing: "Publication de {{package}} sur npm...",
    published: "{{package}}@{{version}} publié sur npm",
    publishFailed: "Échec de la publication de {{package}} sur npm : {{error}}",
    registry: "Registre npm utilisé : {{registry}}",
    dryRun: "[SIMULATION] Publierait {{package}}@{{version}} sur npm",
  },
  changelog: {
    generating: "Génération du changelog de {{package}}...",
    generated: "Changelog généré pour {{package}}",
    failed:
      "Échec de la génération du changelog pour {{directory}} : {{error}}",
    noChanges: "Rien à ajouter au changelog de {{package}}",
  },
  branch: {
    checking: "Vérification du statut de la branche...",
    notAllowed:
      "Les releases depuis la branche '{{branch}}' ne sont pas autorisées (main : {{main}})",
    isProtected: "La branche '{{branch}}' est protégée",
  },
  gitRelease: {
    creating: "Création de la release GitHub pour {{tag}}...",
    created: "Release GitHub créée : {{url}}",
    failed: "Échec de la création de la release GitHub : {{error}}",
    ghNotFound: "CLI GitHub (gh) introuvable : release GitHub ignorée",
    notGitHub:
      "La release GitHub n'est prise en charge que pour les dépôts GitHub",
  },
  validation: {
    branchNotAllowed:
      "La release depuis la branche '{{branch}}' n'est pas autorisée",
    dirtyWorkingDir:
      "Le répertoire de travail contient des changements non commités",
    passed: "Toutes les validations sont passées",
  },
  summary: {
    header: "Résumé de la release",
    successCount: "{{count}} packages publiés",
    skipCount: "{{count}} packages ignorés",
    failCount: "{{count}} packages en échec",
  },
  jsr: {
    publishing: "Publication de {{package}} sur JSR...",
    published: "{{package}} publié sur JSR",
    failed: "Échec de la publication de {{package}} sur JSR : {{error}}",
  },
  gitlab: {
    creating: "Création de la release GitLab pour {{tag}}...",
    created: "Release GitLab créée : {{url}}",
    failed: "Échec de la création de la release GitLab : {{error}}",
    glabNotFound: "CLI GitLab (glab) introuvable : release GitLab ignorée",
  },
  lockfile: {
    checking: "Vérification de l'intégrité du lockfile...",
    valid: "Lockfile valide",
    invalid: "Échec de la vérification d'intégrité du lockfile : {{error}}",
    missing: "Aucun lockfile trouvé (attendu : {{expected}})",
  },
  notifications: {
    sending: "Envoi de la notification...",
    sent: "Notification envoyée",
    failed: "Échec de l'envoi de la notification : {{error}}",
    disabled: "Notifications désactivées",
  },
  retry: {
    attempt: "Tentative {{attempt}} sur {{maxAttempts}} pour {{operation}}",
    failed: "Toutes les tentatives ont échoué pour {{operation}}",
    success: "Opération {{operation}} réussie après une nouvelle tentative",
  },
  rollback: {
    starting: "Démarrage du rollback...",
    complete: "Rollback terminé",
    failed: "Échec du rollback : {{error}}",
    git: "Annulation des changements git...",
    version: "Annulation des changements de version...",
  },
  timings: {
    report: "Détail des durées",
    validation: "Validation",
    install: "Installation",
    clean: "Nettoyage",
    lint: "Lint",
    typecheck: "Typecheck",
    build: "Build",
    test: "Test",
    publish: "Publication",
    changelog: "Changelog",
    gitOperations: "Opérations git",
  },
  widget: {
    runRelease: "Lancer la release",
    runAgain: "Relancer",
    complete: "Release terminée",
    failed: "Échec de la release",
    published: "Publiés",
    errors: "Erreurs",
    bullet: "•",
    warning: "⚠",
  },
};
