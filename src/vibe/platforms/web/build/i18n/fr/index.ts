import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion du serveur",
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
    title: "Compiler l'application",
    titleShort: "Build de l'app",
    description: "Compiler l'application pour le déploiement en production",
    form: {
      title: "Configuration du build",
      description: "Configurer les options et paramètres du build",
    },
    fields: {
      package: {
        title: "Compiler le paquet",
        description: "Compiler le paquet avant l'application",
      },
      skipNextCommand: {
        title: "Ignorer la commande Next.js",
        description: "Ne pas lancer la commande de build Next.js",
      },
      target: {
        title: "Cible du build",
        description: "Cible du build (ex. 'production', 'staging')",
      },
      skipGeneration: {
        title: "Ignorer la génération de code",
        description: "Ne pas générer les endpoints d'API pendant le build",
      },
      generate: {
        title: "Générer le code",
        description: "Lancer la génération de code pendant le build",
      },
      generateEndpoints: {
        title: "Générer les endpoints",
        description: "Générer les fichiers d'endpoints d'API pendant le build",
      },
      generateSeeds: {
        title: "Générer les seeds",
        description: "Générer les fichiers de seed pendant le build",
      },
      nextBuild: {
        title: "Build Next.js",
        description: "Lancer le processus de build Next.js",
      },
      migrate: {
        title: "Lancer les migrations",
        description:
          "Lancer les migrations de base de données pendant le build",
      },
      seed: {
        title: "Lancer le seeding",
        description: "Lancer le seeding de la base de données pendant le build",
      },
      force: {
        title: "Forcer le build",
        description: "Poursuivre le build même en cas d'erreur",
      },
      framework: {
        title: "Framework",
        description: "Framework/bundler frontend à compiler",
      },
      webpack: {
        title: "Utiliser Webpack",
        description:
          "Utiliser webpack au lieu de Turbopack. Consomme moins de mémoire (~7,5 Go contre ~12 Go). Activé par défaut dans les builds Docker de production.",
      },
      vibeMode: {
        title: "Mode d'instance",
        description:
          "Intègre le mode d'instance dans le bundle Next.js. 'agent' = instance locale personnelle. 'cloud' = déploiement SaaS. 'dev' = instance de développement (par défaut). Remplace NEXT_PUBLIC_VIBE_MODE dans .env.",
        options: {
          agent: "Agent (instance locale personnelle)",
          cloud: "Cloud (déploiement SaaS)",
          dev: "Dev (instance de développement, par défaut)",
        },
      },
      skipEndpoints: {
        title: "Ignorer la génération des endpoints",
        description: "Ne pas générer les fichiers d'endpoints",
      },
      skipSeeds: {
        title: "Ignorer la génération des seeds",
        description: "Ne pas générer les fichiers de seed",
      },
      skipProdMigrations: {
        title: "Ignorer les migrations de production",
        description:
          "Ne pas lancer les migrations de base de données pour la production",
      },
      skipProdSeeding: {
        title: "Ignorer le seeding de production",
        description: "Ne pas lancer le seeding de la base pour la production",
      },
      runProdDatabase: {
        title: "Opérations de base de production",
        description:
          "Lancer les opérations de base de données de production après le build",
      },
      success: {
        title: "Build réussi",
      },
      output: {
        title: "Sortie du build",
      },
      duration: {
        title: "Durée du build (ms)",
      },
      errors: {
        title: "Erreurs du build",
      },
      steps: {
        title: "Étapes du build",
      },
      label: {
        title: "Étape",
      },
      ok: {
        title: "Succès",
      },
      skipped: {
        title: "Ignorée",
      },
    },
    errors: {
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de build invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion réseau a échoué pendant le build",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour compiler l'application",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de compiler l'application",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources du build introuvables",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant le build",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite pendant le build",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de build détecté",
      },
      nextjs_build_failed: {
        title: "Échec du build Next.js",
        description: "Le processus de build Next.js a échoué : {{error}}",
      },
    },
    success: {
      title: "Build terminé",
      description: "Le build de l'application est terminé",
    },
    repository: {
      messages: {
        buildStart: "🚀 Démarrage du build de l'application...",
        packageBuildStart: "Compilation du paquet...",
        packageBuildSuccess: "✅ Build du paquet terminé",
        packageBuildFailed: "Échec du build du paquet : {{error}}",
        buildPrerequisites: "Exécution des prérequis du build...",
        skipGeneration:
          "Génération des endpoints d'API ignorée (--skip-generation)",
        generatingEndpoints: "Génération des endpoints d'API...",
        generationSuccess: "✅ Génération de code terminée",
        generationFailed: "Échec de la génération de code",
        generationFailedDetail: "Échec de la génération de code : {{error}}",
        tanstackBuildStart: "Build de TanStack Start (SSR)...",
        tanstackBuildSuccess: "✅ Build de TanStack Start (SSR) terminé",
        tanstackBuildFailed: "Échec du build TanStack Start",
        tanstackBuildFailedDetail: "Échec du build TanStack Start : {{error}}",
        skipNextBuild: "Build Next.js ignoré (pris en charge par package.json)",
        buildingNextjs: "Build de l'application Next.js...",
        nextjsBuildSuccess: "✅ Build Next.js terminé",
        nextjsBuildFailed: "Échec du build Next.js : {{error}}",
        nextjsBuildOom:
          "Build Next.js tué par l'OS (probablement à court de mémoire), signal : {{signal}}",
        nextjsBuildExitCode:
          "Le build Next.js s'est terminé avec le code {{code}}",
        skipProdDb:
          "Opérations de base de production ignorées (--run-prod-database=false)",
        buildFailed: "❌ Échec du build : {{error}}",
        unknownError: "erreur inconnue",
        schemaGenerationStart: "Génération du schéma de base de données...",
        schemaGenerationSuccess: "✅ Génération du schéma de base terminée",
        schemaGenerationFailed: "Échec de la génération du schéma de base",
        skipSchemaGeneration:
          "Génération du schéma de base ignorée (--run-prod-database=false)",
        reportsGenerationStart: "Génération de tous les rapports...",
        reportsGenerationSuccess: "✅ Tous les rapports ont été générés",
        reportsGenerationFailed: "Échec de la génération des rapports",
        prodDbStart:
          "🚀 Opérations de base de données de production en cours...",
        prodDbSuccess:
          "🎉 Opérations de base de données de production terminées",
        prodDbFailed:
          "❌ Le build de production a échoué pendant les opérations de base de données : {{error}}. Essayez 'docker compose -f docker-compose-dev.yml up -d' pour démarrer la base.",
        prodDbConnectionFailed:
          "❌ Le build de production a échoué pendant les opérations de base de données : la base est injoignable ({{error}}). Vérifiez qu'elle tourne, puis essayez 'docker compose -f docker-compose-dev.yml up -d' pour la démarrer.",
        prodDbNotReady: "💡 Ce build n'est PAS prêt pour la production",
        deploymentReady:
          "🚀 Votre application est prête pour le déploiement en production !",
        nextBuildHandled:
          "✅ Le build Next.js sera géré par la commande yarn build",
        failedProdMigrations:
          "Impossible de lancer les migrations de production",
      },
    },
  },
};
