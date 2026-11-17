import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion du serveur",
  enum: {
    processStatus: {
      running: "En cours",
      stopped: "Arrêté",
      error: "Erreur",
    },
    environment: {
      development: "Développement",
      production: "Production",
      testing: "Test",
      staging: "Préproduction",
    },
    mode: {
      development: "Développement",
      production: "Production",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
    category: "Gestion du serveur",
    tags: {
      build: "Build",
    },
    post: {
      title: "Compiler l'application",
      description: "Compiler l'application pour le déploiement en production",
      form: {
        title: "Configuration du build",
        description: "Configurer les options et paramètres du build",
      },
      fields: {
        package: {
          title: "Compiler le package",
          description: "Compiler le package avant l'application",
        },
        skipNextCommand: {
          title: "Ignorer la commande Next.js",
          description: "Ne pas lancer la commande de build Next.js",
        },
        target: {
          title: "Cible du build",
          description:
            "Indiquer la cible du build (par ex. 'production', 'staging')",
        },
        skipGeneration: {
          title: "Ignorer la génération de code",
          description: "Ne pas générer les endpoints API pendant le build",
        },
        generate: {
          title: "Générer le code",
          description: "Lancer la génération de code pendant le build",
        },
        generateEndpoints: {
          title: "Générer les endpoints",
          description: "Générer les fichiers d'endpoints API pendant le build",
        },
        generateSeeds: {
          title: "Générer les seeds",
          description: "Générer les fichiers de seed pendant le build",
        },
        nextBuild: {
          title: "Build Next.js",
          description: "Lancer le build Next.js",
        },
        migrate: {
          title: "Exécuter les migrations",
          description:
            "Exécuter les migrations de base de données pendant le build",
        },
        seed: {
          title: "Exécuter le seeding",
          description: "Peupler la base de données pendant le build",
        },
        force: {
          title: "Forcer le build",
          description: "Poursuivre le build même en cas d'erreurs",
        },
        framework: {
          title: "Framework",
          description: "Framework/bundler frontend à compiler",
        },
        webpack: {
          title: "Utiliser Webpack",
          description:
            "Utiliser webpack au lieu de Turbopack. Moins de mémoire (~7,5 Go contre ~12 Go). Activé par défaut dans les builds Docker de production.",
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
            "Ne pas exécuter les migrations de base de données de production",
        },
        skipProdSeeding: {
          title: "Ignorer le seeding de production",
          description: "Ne pas peupler la base de données de production",
        },
        runProdDatabase: {
          title: "Opérations sur la base de production",
          description:
            "Exécuter les opérations sur la base de production après le build",
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
          title: "Réussi",
        },
        skipped: {
          title: "Ignoré",
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
          title: "Interdit",
          description:
            "Vous n'avez pas l'autorisation de compiler l'application",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressources de build introuvables",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur interne du serveur est survenue pendant le build",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue pendant le build",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de build détecté",
        },
        nextjs_build_failed: {
          title: "Échec du build Next.js",
          description: "Le build Next.js a échoué : {{error}}",
        },
      },
      success: {
        title: "Build terminé",
        description: "Le build de l'application a réussi",
      },
      repository: {
        messages: {
          buildStart: "🚀 Démarrage du build de l'application...",
          packageBuildStart: "Compilation du package...",
          packageBuildSuccess: "✅ Build du package réussi",
          packageBuildFailed: "Échec du build du package",
          buildPrerequisites: "Exécution des prérequis du build...",
          skipGeneration:
            "Génération des endpoints API ignorée (--skip-generation)",
          generatingEndpoints: "Génération des endpoints API...",
          generationSuccess: "✅ Génération de code réussie",
          generationFailed: "Échec de la génération de code",
          skipNextBuild:
            "Build Next.js ignoré (pris en charge par package.json)",
          buildingNextjs: "Compilation de l'application Next.js...",
          nextjsBuildSuccess: "✅ Build Next.js réussi",
          nextjsBuildFailed: "Échec du build Next.js",
          skipProdDb:
            "Opérations sur la base de production ignorées (--run-prod-database=false)",
          buildFailed: "❌ Échec du build",
          schemaGenerationStart: "Génération du schéma de base de données...",
          schemaGenerationSuccess:
            "✅ Génération du schéma de base de données terminée",
          schemaGenerationFailed:
            "Échec de la génération du schéma de base de données",
          skipSchemaGeneration:
            "Génération du schéma de base de données ignorée (--run-prod-database=false)",
          reportsGenerationStart: "Génération de tous les rapports...",
          reportsGenerationSuccess: "✅ Tous les rapports ont été générés",
          reportsGenerationFailed: "Échec de la génération des rapports",
          prodDbStart:
            "🚀 Exécution des opérations sur la base de production...",
          prodDbSuccess:
            "🎉 Opérations sur la base de production terminées avec succès",
          prodDbFailed:
            "❌ Le build de production a échoué pendant les opérations sur la base",
          prodDbNotReady:
            "💡 Ce build n'est PAS prêt pour un déploiement en production",
          deploymentReady:
            "🚀 Votre application est prête pour le déploiement en production !",
          dbConnectionError:
            "Échec de la connexion à la base de données. Vérifiez qu'elle tourne et qu'elle est accessible.",
          dbStartSuggestion:
            "Lancez 'docker compose -f docker-compose-dev.yml up -d' pour démarrer la base de données",
          nextBuildHandled:
            "✅ Le build Next.js sera pris en charge par la commande yarn build",
          failedProdMigrations: "Échec des migrations de production",
        },
      },
    },
  },
  dev: {
    category: "Gestion du serveur",

    post: {
      title: "Dev",
      description: "Endpoint de développement",
      form: {
        title: "Configuration dev",
        description: "Configurer les paramètres de développement",
      },
      response: {
        title: "Réponse",
        description: "Données de réponse dev",
      },
      fields: {
        debug: {
          title: "Mode debug",
          description: "Activer le mode debug pour une sortie détaillée",
        },
        skipDbSetup: {
          title: "Ignorer la config de la base",
          description:
            "Ignorer les étapes de configuration de la base de données",
        },
        skipNextCommand: {
          title: "Ignorer la commande Next",
          description: "Ne pas lancer le serveur de développement Next.js",
        },
        skipDbReset: {
          title: "Ignorer la réinitialisation de la base",
          description: "Ne pas réinitialiser la base de données",
        },

        port: {
          title: "Port",
          description: "Numéro de port du serveur de développement",
        },
        skipGeneratorWatcher: {
          title: "Ignorer le watcher de génération",
          description:
            "Désactiver le watcher de génération de code automatique",
        },
        generatorWatcherInterval: {
          title: "Intervalle du générateur",
          description: "Intervalle du watcher de génération en millisecondes",
        },
        skipTaskRunner: {
          title: "Ignorer le task runner",
          description: "Ne pas démarrer le système de task runner",
        },
        skipMigrations: {
          title: "Ignorer les migrations",
          description: "Ne pas exécuter les migrations de base de données",
        },
        skipMigrationGeneration: {
          title: "Ignorer la génération des migrations",
          description: "Ne pas générer automatiquement les migrations",
        },
        skipSeeding: {
          title: "Ignorer le seeding",
          description:
            "Ne pas peupler la base de données avec les données initiales",
        },
        framework: {
          title: "Framework",
          description: "Framework/bundler frontend à utiliser",
        },
        profile: {
          title: "Profilage",
          description:
            "Activer le profilage : définit NEXT_TURBOPACK_TRACING=1 (fichier de trace dans .next/dev/trace-turbopack) et NEXT_CPU_PROF=1 (écrit un .cpuprofile à la sortie)",
        },
        success: {
          title: "Succès",
        },
        output: {
          title: "Sortie",
        },
        duration: {
          title: "Durée",
        },
        serverUrl: {
          title: "URL du serveur",
        },
        databaseStatus: {
          title: "État de la base de données",
        },
        processes: {
          title: "Processus",
        },
        errors: {
          title: "Erreurs",
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
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
    },
  },
  health: {
    category: "Gestion du serveur",

    tag: "Santé",
    get: {
      title: "Bilan de santé",
      description: "Obtenir l'état de santé et les diagnostics du serveur",
      form: {
        title: "Options du bilan de santé",
        description: "Configurer les paramètres du bilan de santé",
      },
      fields: {
        detailed: {
          title: "Rapport détaillé",
          description: "Inclure des informations système détaillées",
        },
        includeDatabase: {
          title: "Inclure la base de données",
          description: "Inclure les vérifications de la base de données",
        },
        includeTasks: {
          title: "Inclure les tâches",
          description: "Inclure les vérifications du task runner",
        },
        includeSystem: {
          title: "Inclure le système",
          description: "Inclure les informations sur les ressources système",
        },
      },
      response: {
        status: {
          title: "État",
          description: "État de santé global",
        },
        timestamp: {
          title: "Horodatage",
          description: "Heure du bilan de santé",
        },
        uptime: {
          title: "Disponibilité",
          description: "Temps de fonctionnement du serveur en secondes",
        },
        environment: {
          title: "Environnement",
          description: "Informations sur l'environnement du serveur",
          name: {
            title: "Nom de l'environnement",
          },
          nodeEnv: {
            title: "Environnement Node",
          },
          platform: {
            title: "Plateforme",
          },
          supportsTaskRunners: {
            title: "Prend en charge les task runners",
          },
        },
        database: {
          title: "État de la base de données",
          description: "État de la connexion à la base de données",
          status: {
            title: "État de la connexion",
          },
          responseTime: {
            title: "Temps de réponse (ms)",
          },
          error: {
            title: "Message d'erreur",
          },
        },
        tasks: {
          title: "État des tâches",
          description: "État du task runner",
          runnerStatus: {
            title: "État du runner",
          },
          activeTasks: {
            title: "Tâches actives",
          },
          totalTasks: {
            title: "Total des tâches",
          },
          errors: {
            title: "Nombre d'erreurs",
          },
          lastError: {
            title: "Dernière erreur",
          },
        },
        system: {
          title: "Infos système",
          description: "Informations sur les ressources système",
          memory: {
            title: "Utilisation mémoire",
            description: "Informations sur la mémoire système",
            used: {
              title: "Mémoire utilisée",
            },
            total: {
              title: "Mémoire totale",
            },
            percentage: {
              title: "Utilisation mémoire %",
            },
          },
          cpu: {
            title: "Utilisation CPU",
            description: "Informations sur le CPU",
            usage: {
              title: "Utilisation CPU %",
            },
            loadAverage: {
              title: "Charge moyenne",
            },
          },
          disk: {
            title: "Utilisation disque",
            description: "Informations sur le disque",
            available: {
              title: "Espace disponible",
            },
            total: {
              title: "Espace total",
            },
            percentage: {
              title: "Utilisation disque %",
            },
          },
        },
        checks: {
          title: "Vérifications de santé",
          description: "Vérifications de santé par composant",
          item: {
            title: "Vérification de santé",
            description: "Résultat d'une vérification de santé",
            name: {
              title: "Nom de la vérification",
            },
            status: {
              title: "État de la vérification",
            },
            message: {
              title: "Message de la vérification",
            },
            duration: {
              title: "Durée (ms)",
            },
          },
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
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Certaines modifications ne sont pas enregistrées",
        },
      },
      success: {
        title: "Succès",
        description: "Bilan de santé terminé",
      },
    },
  },
  start: {
    category: "Gestion du serveur",
    tags: {
      start: "Démarrer",
    },
    post: {
      title: "Démarrer le serveur de production",
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
  },
};
