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
    start: "Démarrer",
  },
  post: {
    title: "Démarrer le serveur de production",
    titleShort: "Démarrer le serveur",
    description:
      "Démarrer le serveur de production avec les pré-tâches et Next.js",
    form: {
      title: "Configuration du démarrage",
      description: "Configurer les paramètres de démarrage du serveur",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse du démarrage",
    },
    fields: {
      skipPre: {
        title: "Ignorer les pré-tâches",
        description:
          "Ne pas exécuter les pré-tâches avant le démarrage du serveur",
      },
      skipNextCommand: {
        title: "Ignorer la commande Next.js",
        description: "Ne pas lancer la commande de démarrage Next.js",
      },
      mode: {
        title: "Mode du serveur",
        description:
          "Sous-systèmes à lancer : all (par défaut), web (Next.js + WS uniquement), tasks (task runner uniquement)",
        options: {
          all: "Tout (par défaut)",
          web: "Web uniquement (Next.js + WebSocket)",
          tasks: "Tâches uniquement (runner cron)",
        },
      },
      seed: {
        title: "Exécuter le seeding",
        description: "Peupler la base de données au démarrage",
      },
      dbSetup: {
        title: "Configuration de la base",
        description:
          "Configurer la base de données et exécuter les migrations au démarrage",
      },
      taskRunner: {
        title: "Task runner",
        description: "Démarrer le système de task runner",
      },
      nextServer: {
        title: "Serveur Next.js",
        description: "Démarrer le serveur Next.js",
      },
      port: {
        title: "Port",
        description: "Numéro de port du serveur",
      },
      profile: {
        title: "Profilage",
        description:
          "Activer le profilage : définit NEXT_CPU_PROF=1 (écrit un .cpuprofile à la sortie) pour le serveur Next.js de production",
      },
      framework: {
        title: "Framework",
        description: "Framework/bundler frontend à démarrer",
      },
      vibeMode: {
        title: "Mode de l'instance",
        description:
          "Remplace le mode de l'instance à l'exécution en patchant le bundle compilé. 'agent' = instance locale personnelle. 'cloud' = SaaS. 'dev' = instance de développement.",
        options: {
          agent: "Agent (instance locale personnelle)",
          cloud: "Cloud (déploiement SaaS)",
          dev: "Dev (instance de développement)",
        },
      },
      skipTaskRunner: {
        title: "Ignorer le task runner",
        description: "Ne pas démarrer le task runner",
      },
      success: {
        title: "Succès",
      },
      serverStarted: {
        title: "Serveur démarré",
      },
      output: {
        title: "Sortie",
      },
      serverInfo: {
        title: "Informations du serveur",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données est survenu",
      },
      tanstackBuildNotFound:
        "Aucun build TanStack Start trouvé. Avez-vous lancé 'vibe build --tanstack' ?",
      tanstackServerExited:
        "Le serveur TanStack Start s'est arrêté immédiatement",
      nextBuildNotFound:
        "Aucun build .next-prod trouvé. Avez-vous lancé 'vibe build' ?",
      startFailed: "Échec du démarrage du serveur",
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
    repository: {
      messages: {
        startingServer: "🚀 Démarrage du serveur de production...",
        environment: "✅ Environnement : ",
        runningPreTasks: "Exécution des tâches de pré-démarrage...",
        runningMigrations: "Exécution des migrations de base de données...",
        migrationsCompleted: "✅ Migrations de base de données terminées",
        failedMigrations: "Échec des migrations",
        seedingDatabase: "Peuplement de la base de données...",
        seedingCompleted: "✅ Peuplement de la base de données terminé",
        failedSeeding: "Échec du peuplement de la base de données",
        startingTaskRunner: "Démarrage du task runner de production...",
        failedTaskRunner: "Échec du démarrage du task runner de production",
        taskRunnerStarted: "✅ Task runner de production démarré avec ",
        taskRunnerStartedSuffix: " tâches",
        taskRunnerSkipped:
          "Task runner de production ignoré (option --skip-task-runner)",
        skipNextStart:
          "Démarrage Next.js ignoré (pris en charge par package.json)",
        serverWillStart:
          "Le serveur de production sera démarré par package.json",
        serverAvailable: "Le serveur sera disponible sur http://localhost:",
        startupPrepared: "✅ Démarrage du serveur de production préparé",
        failedStart: "❌ Échec du démarrage du serveur de production : ",
        gracefulShutdown:
          "Arrêt propre demandé pour le task runner de production",
      },
    },
  },
};
