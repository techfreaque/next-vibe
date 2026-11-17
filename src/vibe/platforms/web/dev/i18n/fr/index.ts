import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion du serveur",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  post: {
    title: "Dev",
    titleShort: "Serveur de dev",
    description: "Endpoint de dev",
    form: {
      title: "Configuration du dev",
      description: "Configurer les paramètres du dev",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse du dev",
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
        title: "Ignorer le watcher des générateurs",
        description:
          "Ne pas lancer le watcher de génération de code automatique",
      },
      generatorWatcherInterval: {
        title: "Intervalle des générateurs",
        description: "Intervalle du watcher des générateurs en millisecondes",
      },
      skipTaskRunner: {
        title: "Ignorer le task runner",
        description: "Ne pas démarrer le système de task runner",
      },
      skipMigrations: {
        title: "Ignorer les migrations",
        description: "Ne pas lancer les migrations de base de données",
      },
      skipMigrationGeneration: {
        title: "Ignorer la génération des migrations",
        description: "Ne pas générer automatiquement les migrations",
      },
      skipSeeding: {
        title: "Ignorer le seeding",
        description: "Ne pas remplir la base avec les données initiales",
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
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
    success: {
      title: "Succès",
      description: "Opération terminée",
    },
  },
};
