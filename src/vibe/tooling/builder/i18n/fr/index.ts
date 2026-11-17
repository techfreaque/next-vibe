import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Builder",
  description: "Outil de build et de bundling du projet",
  cli: {
    build: {
      description: "Type de build : build",
      configOption: "chemin du fichier de configuration",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "Développement",
      production: "Production",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "JS vanilla",
      executable: "Exécutable (Bun)",
      spa: "SPA (build d'app Vite)",
    },
    bunTarget: {
      bun: "Runtime Bun",
      node: "Node.js",
      browser: "Navigateur",
    },
    sourcemap: {
      external: "Externe (fichier .map)",
      inline: "Inline (intégrée)",
      none: "Aucune (désactivée)",
    },
    format: {
      esm: "Module ES",
      cjs: "CommonJS",
      iife: "IIFE (navigateur)",
    },
    viteMinify: {
      esbuild: "esbuild (rapide)",
      terser: "Terser (compact)",
      false: "Désactivé",
    },
    viteLibFormat: {
      es: "Module ES",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "Activées",
      false: "Désactivées",
      inline: "Inline",
      hidden: "Masquées",
    },
  },
  errors: {
    inputFileNotFound: "Le fichier d'entrée {{filePath}} n'existe pas",
    invalidOutputFileName: "Nom du fichier de sortie invalide",
    invalidBuildConfig:
      "Format de configuration de build invalide. La configuration doit exporter par défaut un objet BuildConfig.",
    configNotFound: "Fichier de configuration introuvable : {{path}}",
    inputRequired: "Un fichier d'entrée est requis pour cette cible de build",
    emptyConfig: "Configuration vide : aucune étape de build définie",
  },
  warnings: {
    outputIsDirectory:
      "Le chemin de sortie doit être un fichier, pas un répertoire : {{path}}",
    sourceNotFound: "Fichier source introuvable : {{path}}",
  },
  suggestions: {
    checkFilePaths:
      "Vérifiez que tous les chemins sont corrects et que les fichiers existent",
    runFromProjectRoot:
      "Assurez-vous de lancer la commande depuis la racine du projet",
    checkPermissions:
      "Vérifiez les permissions des répertoires d'entrée et de sortie",
    checkDependencies:
      "Des dépendances manquent peut-être : vérifiez les imports",
    runInstall:
      "Lancez 'bun install' pour vous assurer que toutes les dépendances sont disponibles",
    increaseMemory:
      "Pour les gros builds, augmentez la mémoire : NODE_OPTIONS=--max-old-space-size=4096",
    useExternals: "Envisagez de marquer les grosses dépendances comme externes",
    checkSyntax: "Vérifiez les erreurs de syntaxe dans vos fichiers source",
    runTypecheck: "Lancez 'bun typecheck' pour détecter les erreurs de type",
    increaseTimeout: "Augmentez le délai d'expiration de l'opération de build",
    checkNetworkConnection: "Vérifiez votre connexion réseau",
    checkDiskSpace: "Vérifiez l'espace disque disponible",
    cleanBuildCache: "Videz le cache de build et les fichiers temporaires",
  },
  messages: {
    buildStart: "Démarrage du build...",
    cleaningDist: "Nettoyage du répertoire de sortie...",
    cleaningFolders: "Nettoyage des dossiers...",
    buildingVersion: "Build de la version {{version}}...",
    bundlingCli: "Bundling de la CLI avec Bun...",
    bundleFailed: "Échec du bundle : {{error}}",
    bundleFailedUnknown: "Échec du bundle sans message d'erreur",
    outputMissing: "Le bundle n'a rien produit : {{output}} est absent ou vide",
    bundleSuccess: "CLI bundlée",
    creatingPackageJson: "Création du package.json...",
    copyingFiles: "Copie du README et de la LICENSE...",
    copyingAdditionalFiles: "Copie des fichiers supplémentaires...",
    publishInstructions: "Pour publier :",
    buildComplete: "Build terminé !",
    buildFailed: "Échec du build",
    loadingConfig: "Chargement de la configuration depuis {{path}}...",
    cleaningFolder: "Nettoyage du dossier : {{folder}}",
    compilingFiles: "Compilation des fichiers avec Vite...",
    compilingFile: "Compilation : {{file}}",
    fileCompiled: "Compilé : {{file}}",
    buildingWithVite: "Build avec Vite ({{type}})...",
    usingInlineConfig: "Utilisation de la configuration inline...",
    filesCopied: "Fichiers copiés",
    dryRunMode: "[SIMULATION] Aucune modification ne sera faite",
    buildSummary: "Résumé du build :",
    totalDuration: "Durée totale",
    filesBuilt: "Fichiers construits",
    filesCopiedCount: "Fichiers copiés",
    stepsCompleted: "Étapes terminées",
    usingProfile: "Profil utilisé : {{profile}}",
    runningPreBuild: "Exécution du hook pre-build...",
    runningPostBuild: "Exécution du hook post-build...",
    preBuildComplete: "Hook pre-build terminé",
    postBuildComplete: "Hook post-build terminé",
    analyzingBundles: "Analyse de la taille des bundles...",
    bundleAnalysis: "Analyse des bundles",
    optimizationTips: "Pistes d'optimisation",
    suggestions: "Suggestions",
    validatingConfig: "Validation de la configuration de build...",
    configValid: "Configuration valide",
    configWarnings: "Avertissements de configuration",
    tsEntrypointWithNode:
      "Point d'entrée TypeScript avec une cible Node : envisagez la cible Bun pour une meilleure compatibilité",
    watchModeStarted:
      "Mode watch démarré : en attente de modifications de fichiers...",
    watchModeRebuild: "Fichier modifié : {{file}}, rebuild en cours...",
    watchModeReady: "Build terminé, surveillance des modifications...",
    watchModeError: "Erreur du mode watch : {{error}}",
    watchModeStopped: "Mode watch arrêté",
    parallelCompiling: "Compilation de {{count}} fichiers en parallèle...",
    parallelComplete:
      "Compilation parallèle terminée : {{count}} fichiers en {{duration}} ms",
    cacheHit: "Cache hit : {{file}} (ignoré)",
    cacheMiss: "Cache miss : {{file}} (reconstruction)",
    cacheCleared: "Cache de build vidé",
    cacheStats:
      "Cache : {{hits}} hits, {{misses}} misses ({{hitRate}} % de hits)",
    generatingReport: "Génération du rapport de build...",
    reportGenerated: "Rapport de build généré : {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "Build en cours...",
    spinnerCompiling: "Compilation...",
    spinnerBundling: "Bundling...",
  },
  post: {
    title: "Construire le package",
    titleShort: "Construire le package",
    description:
      "Outil de build complet : bundling de CLI, builds Vite, React/Tailwind et distribution npm",
    form: {
      title: "Configuration du build",
      description:
        "Définir les réglages du build ou utiliser un fichier build.config.ts",
    },
    fields: {
      configPath: {
        title: "Chemin du fichier de configuration",
        description:
          "Chemin du fichier de configuration du build (build.config.ts)",
        placeholder: "build.config.ts",
      },
      configObject: {
        title: "Options de build",
        description:
          "Configuration de build inline (prioritaire sur le fichier de configuration)",
      },
      profile: {
        title: "Profil de build",
        description:
          "Développement (rapide, debug) ou Production (optimisé, minifié)",
      },
      dryRun: {
        title: "Simulation",
        description: "Afficher ce qui serait construit sans rien exécuter",
      },
      verbose: {
        title: "Sortie détaillée",
        description:
          "Afficher les informations détaillées et la progression du build",
      },
      analyze: {
        title: "Analyse des bundles",
        description:
          "Analyser la taille des bundles et repérer les optimisations possibles",
      },
      watch: {
        title: "Mode watch",
        description:
          "Surveiller les modifications de fichiers et reconstruire automatiquement",
      },
      parallel: {
        title: "Build parallèle",
        description:
          "Compiler plusieurs fichiers en parallèle pour accélérer le build",
      },
      cache: {
        title: "Cache de build",
        description:
          "Mettre en cache les artefacts de build pour ignorer les fichiers inchangés",
      },
      report: {
        title: "Générer un rapport",
        description:
          "Générer un rapport de build JSON avec des métriques détaillées",
      },
      minify: {
        title: "Minifier",
        description: "Minifier le bundle de sortie (prioritaire sur le profil)",
      },
      foldersToClean: {
        title: "Dossiers à nettoyer",
        description: "Dossiers à supprimer avant le build (ex. dist, build)",
        placeholder: "dist, build, .cache",
      },
      filesToCompile: {
        title: "Fichiers à compiler",
        description: "Liste des fichiers à compiler avec Vite ou Bun",
      },
      fileToCompile: {
        title: "Configuration du fichier",
      },
      disabled: {
        title: "Désactivé",
        description: "Ignorer cette entrée pendant le build",
      },
      input: {
        title: "Fichier d'entrée",
        description: "Chemin du point d'entrée (ex. src/index.ts)",
        placeholder: "src/index.ts",
      },
      output: {
        title: "Fichier de sortie",
        description: "Chemin du fichier de sortie (ex. dist/index.js)",
        placeholder: "dist/index.js",
      },
      type: {
        title: "Type de build",
        description: "Type de build : React, JS vanilla ou exécutable",
      },
      modulesToExternalize: {
        title: "Modules externes",
        description: "Modules à exclure du bundle (ex. react, lodash)",
        placeholder: "react, react-dom, lodash",
      },
      inlineCss: {
        title: "CSS inline",
        description: "Injecter le CSS directement dans le bundle JavaScript",
      },
      bundleReact: {
        title: "Inclure React",
        description:
          "Inclure React dans le bundle au lieu de le laisser externe",
      },
      packageConfig: {
        title: "Configuration du package",
        description:
          "Réglages des builds de bibliothèque avec déclarations TypeScript",
      },
      isPackage: {
        title: "Est un package",
        description: "Activer le mode bibliothèque avec les exports du package",
      },
      dtsInclude: {
        title: "Inclusion DTS",
        description:
          "Patterns glob des fichiers TypeScript à inclure dans les déclarations",
        placeholder: "src/**/*.ts",
      },
      dtsEntryRoot: {
        title: "Racine d'entrée DTS",
        description:
          "Répertoire racine pour la génération des fichiers de déclaration",
        placeholder: "src",
      },
      bunOptions: {
        title: "Options Bun",
        description: "Options de build propres à Bun pour les exécutables",
      },
      bunTarget: {
        title: "Runtime cible",
        description: "Runtime cible : Bun, Node.js ou navigateur",
      },
      bunMinify: {
        title: "Minifier",
        description: "Activer la minification pour une sortie plus légère",
      },
      sourcemap: {
        title: "Source maps",
        description: "Générer des source maps pour le débogage",
      },
      external: {
        title: "Modules externes",
        description: "Modules à exclure du bundle",
        placeholder: "react, react-dom",
      },
      define: {
        title: "Constantes définies",
        description:
          "Constantes de compilation en JSON (ex. process.env.NODE_ENV)",
        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
      },
      splitting: {
        title: "Code splitting",
        description: "Activer le code splitting pour les chunks partagés",
      },
      format: {
        title: "Format de sortie",
        description: "Format de module : ESM, CommonJS ou IIFE",
      },
      bytecode: {
        title: "Bytecode",
        description: "Compiler en bytecode Bun pour un démarrage plus rapide",
      },
      banner: {
        title: "Bannière",
        description: "Texte ajouté en tête de la sortie (ex. ligne shebang)",
        placeholder: "#!/usr/bin/env node",
      },
      footer: {
        title: "Pied de fichier",
        description: "Texte ajouté à la fin de la sortie",
        placeholder: "// End of file",
      },
      publicPath: {
        title: "Chemin public",
        label: "Chemin public",
        description: "Préfixe du chemin public des assets",
      },
      naming: {
        title: "Nommage",
        label: "Nommage",
        description: "Pattern de nommage de la sortie",
      },
      root: {
        title: "Racine",
        label: "Racine",
        description: "Répertoire racine",
      },
      conditions: {
        title: "Conditions",
        label: "Conditions",
        description: "Conditions d'export",
      },
      loader: {
        title: "Loader",
        label: "Loader",
        description: "Association des loaders de fichiers",
      },
      drop: {
        title: "Drop",
        label: "Drop",
        description: "Identifiants à supprimer",
      },
      viteOptions: {
        title: "Options Vite",
        description: "Configuration avancée du build Vite",
      },
      viteTarget: {
        title: "Cible de build",
        description: "Cibles navigateur/environnement (ex. es2020, chrome80)",
        placeholder: "es2020, chrome80, node18",
      },
      viteOutDir: {
        title: "Répertoire de sortie",
        description: "Répertoire de sortie du build",
        placeholder: "dist",
      },
      viteAssetsDir: {
        title: "Répertoire des assets",
        description: "Sous-répertoire des assets statiques",
        placeholder: "assets",
      },
      viteAssetsInlineLimit: {
        title: "Limite d'inlining",
        description: "Taille max (octets) pour inliner les assets en base64",
        placeholder: "4096",
      },
      viteChunkSizeWarningLimit: {
        title: "Alerte taille de chunk",
        description: "Taille de chunk (Ko) qui déclenche un avertissement",
        placeholder: "500",
      },
      viteCssCodeSplit: {
        title: "Découpage du CSS",
        description: "Séparer le CSS en fichiers distincts par chunk",
      },
      viteSourcemap: {
        title: "Source maps",
        description: "Mode de génération des source maps",
      },
      viteMinify: {
        title: "Minifieur",
        description: "Outil de minification : esbuild ou terser",
      },
      viteEmptyOutDir: {
        title: "Vider le répertoire de sortie",
        description: "Nettoyer le répertoire de sortie avant le build",
      },
      viteReportCompressedSize: {
        title: "Taille compressée",
        description: "Afficher la taille gzippée des bundles",
      },
      viteManifest: {
        title: "Manifeste de build",
        description: "Générer un manifest.json pour l'empreinte des assets",
      },
      viteLib: {
        title: "Mode bibliothèque",
        description: "Configurer le mode de build bibliothèque de Vite",
      },
      viteLibEntry: {
        title: "Point d'entrée",
        description: "Fichier(s) d'entrée de la bibliothèque",
        placeholder: "src/index.ts",
      },
      viteLibName: {
        title: "Nom de la bibliothèque",
        description: "Nom de la variable globale pour les builds UMD/IIFE",
        placeholder: "MyLibrary",
      },
      viteLibFormats: {
        title: "Formats de sortie",
        description:
          "Formats de sortie de la bibliothèque (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "Nom de fichier",
        description: "Nom du fichier de sortie (sans extension)",
        placeholder: "my-library",
      },
      viteRollupOptions: {
        title: "Options Rollup",
        description: "Configuration avancée du bundler Rollup",
      },
      rollupExternal: {
        title: "Modules externes",
        description: "Modules à exclure du bundle",
        placeholder: "react, react-dom",
      },
      rollupTreeshake: {
        title: "Tree shaking",
        description: "Retirer le code inutilisé du bundle",
      },
      rollupOutput: {
        title: "Options de sortie Rollup",
        label: "Options de sortie Rollup",
        description: "Options de sortie Rollup transmises telles quelles",
      },
      viteTsconfigPath: {
        title: "Chemin du tsconfig",
        description: "Chemin du tsconfig pour vite-tsconfig-paths (mode SPA)",
        placeholder: "tsconfig.tanstack.json",
      },
      viteModuleAliases: {
        label: "Alias de modules",
        description:
          "Associer des spécificateurs d'import à des chemins de fichiers résolus (client et SSR)",
      },
      vitePlugins: {
        title: "Plugins Vite",
        label: "Plugins Vite",
        description: "Tableau brut de plugins Vite (usage programmatique)",
      },
      viteBuild: {
        title: "Options de build brutes",
        label: "Options de build brutes",
        description: "Options de build Vite transmises telles quelles",
      },
      filesOrFoldersToCopy: {
        title: "Fichiers à copier",
        description: "Fichiers ou dossiers à copier après la compilation",
      },
      copyConfig: {
        title: "Configuration de copie",
      },
      copyInput: {
        title: "Source",
        description: "Chemin du fichier ou dossier source",
        placeholder: "README.md",
      },
      copyOutput: {
        title: "Destination",
        description: "Chemin du fichier ou dossier de destination",
        placeholder: "dist/README.md",
      },
      copyPattern: {
        title: "Pattern",
        description: "Pattern glob pour filtrer les fichiers",
        placeholder: "**/*.json",
      },
      npmPackage: {
        title: "Package npm",
        description: "Générer le package.json pour la distribution npm",
      },
      packageName: {
        title: "Nom du package",
        description: "Nom du package npm (ex. @scope/package)",
        placeholder: "@myorg/package-name",
      },
      packageVersion: {
        title: "Version",
        description: "Version du package (par défaut : package.json racine)",
        placeholder: "1.0.0",
      },
      packageDescription: {
        title: "Description",
        description: "Courte description du package pour npm",
        placeholder: "Une courte description de votre package",
      },
      packageMain: {
        title: "Entrée main",
        description: "Point d'entrée CommonJS (champ main)",
        placeholder: "./dist/index.cjs",
      },
      packageModule: {
        title: "Entrée module",
        description: "Point d'entrée module ES (champ module)",
        placeholder: "./dist/index.mjs",
      },
      packageTypes: {
        title: "Entrée types",
        description: "Entrée des déclarations TypeScript (champ types)",
        placeholder: "./dist/index.d.ts",
      },
      packageBin: {
        title: "Binaires",
        description: "Associations des exécutables CLI en JSON",
        placeholder: '{"my-cli": "./dist/bin/cli.js"}',
      },
      packageExports: {
        title: "Map des exports",
        description: "Champ exports du package en JSON",
        placeholder:
          '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
      },
      packageDependencies: {
        title: "Dépendances",
        description: "Dépendances d'exécution en JSON",
        placeholder: '{"lodash": "^4.17.21"}',
      },
      packagePeerDependencies: {
        title: "Peer dependencies",
        description: "Peer dependencies en JSON",
        placeholder: '{"react": ">=18.0.0"}',
      },
      packagePeerDependenciesMeta: {
        title: "Méta des peer dependencies",
        description: "Marquer des peer dependencies comme optionnelles",
        placeholder: '{"react": {"optional": true}}',
      },
      packageFiles: {
        title: "Fichiers inclus",
        description: "Fichiers à inclure dans le package publié",
        placeholder: "dist, README.md, LICENSE",
      },
      packageKeywords: {
        title: "Mots-clés",
        description: "Mots-clés de recherche npm",
        placeholder: "typescript, build, vite",
      },
      packageLicense: {
        title: "Licence",
        description: "Licence du package (ex. MIT, Apache-2.0)",
        placeholder: "MIT",
      },
      packageRepository: {
        title: "Dépôt",
        description: "URL du dépôt Git",
        placeholder: "https://github.com/user/repo",
      },
      packageOutputDir: {
        title: "Répertoire de sortie",
        description:
          "Répertoire où le package.json est écrit (par défaut : dist/)",
        placeholder: ".dist/checker",
      },
      success: {
        title: "Succès",
      },
      buildOutput: {
        title: "Sortie du build",
      },
      duration: {
        title: "Durée (ms)",
      },
      outputPath: {
        title: "Chemin de sortie",
      },
      filesBuilt: {
        title: "Fichiers construits",
        item: "Fichier construit",
      },
      filesCopied: {
        title: "Fichiers copiés",
        item: "Fichier copié",
      },
      packageJson: {
        title: "package.json généré",
      },
      profileUsed: {
        title: "Profil utilisé",
      },
      cacheStats: {
        title: "Statistiques du cache",
        description: "Métriques de performance du cache de build",
      },
      reportPath: {
        title: "Chemin du rapport",
        description: "Chemin du rapport de build généré",
      },
      stepTimings: {
        title: "Durées des étapes",
        description: "Détail des durées de chaque étape du build",
        step: "Étape",
        duration: "Durée (ms)",
        status: "Statut",
        filesAffected: "Fichiers",
      },
    },
    errors: {
      buildFailed: {
        title: "Échec du build : {{error}}",
        description: "Le processus de build a échoué avec une erreur",
      },
      validation: {
        title: "Erreur de validation",
        description: "La configuration de build fournie est invalide",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant le build",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à lancer des builds",
      },
      forbidden: {
        title: "Interdit",
        description: "L'accès au système de build est interdit",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite pendant le build",
      },
      notFound: {
        title: "Introuvable",
        description: "Le fichier ou la configuration indiqué est introuvable",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Des modifications non enregistrées peuvent influencer le build",
      },
      conflict: {
        title: "Conflit de build",
        description: "Une opération de build concurrente est déjà en cours",
      },
    },
    success: {
      title: "Build réussi",
      description: "Package construit",
    },
  },
  tags: {
    build: "build",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "Développement",
    production: "Production",
  },
  analysis: {
    criticalSize: "CRITIQUE : la taille du bundle ({{size}}) dépasse le seuil",
    largeBundle: "ATTENTION : bundle volumineux détecté ({{size}})",
    considerTreeShaking:
      "Envisagez d'activer le tree shaking pour réduire la taille du bundle",
    checkLargeDeps:
      "Repérez les grosses dépendances qui pourraient être remplacées",
    largeSourcemaps:
      "Source maps volumineuses détectées : envisagez de les désactiver en production",
    possibleDuplicates:
      "Dépendances potentiellement dupliquées détectées : envisagez une déduplication",
    totalSize: "Taille totale",
    largestFiles: "Plus gros fichiers",
  },
};
