import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Opérations de base de données",

  tag: "migration",
  post: {
    title: "Migration de la base de données",
    titleShort: "Migrer la BDD",
    description: "Exécuter les migrations de la base de données",
    form: {
      title: "Configuration de la migration",
      description: "Configurer les options de migration de la base de données",
    },
    response: {
      title: "Réponse de la migration",
      description: "Résultats de l'opération de migration",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de migration invalides",
      },
      internal: {
        title: "Erreur interne",
        description: "L'opération de migration a échoué",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Authentification requise pour les opérations de migration",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Permissions insuffisantes pour les opérations de migration",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources de migration introuvables",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant la migration",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue pendant la migration",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de migration détecté",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant l'opération de migration",
        detail: "Échec de la migration : {{error}}",
        exitCode: "drizzle-kit migrate s'est terminé avec le code {{code}}",
      },
    },
    success: {
      title: "Migration réussie",
      description: "Migration de la base de données terminée avec succès",
    },
  },
  fields: {
    generate: {
      title: "Générer les migrations",
      description:
        "Générer de nouveaux fichiers de migration à partir des modifications du schéma",
    },
    redo: {
      title: "Rejouer la dernière migration",
      description: "Annuler puis réappliquer la dernière migration",
    },
    schema: {
      title: "Schéma de la base de données",
      description: "Schéma cible de la base de données (par défaut : public)",
    },
    success: {
      title: "Statut de réussite",
    },
    migrationsRun: {
      title: "Migrations exécutées",
    },
    migrationsGenerated: {
      title: "Migrations générées",
    },
    output: {
      title: "Sortie",
    },
    duration: {
      title: "Durée (ms)",
    },
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de migration invalides",
    },
    internal: {
      title: "Erreur interne",
      description: "L'opération de migration a échoué",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise pour les opérations de migration",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Permissions insuffisantes pour les opérations de migration",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressources de migration introuvables",
    },
    server: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur pendant la migration",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue pendant la migration",
    },
    conflict: {
      title: "Conflit",
      description: "Conflit de migration détecté",
    },
    generationFailed: "Échec de la génération des migrations : {{message}}",
    generationFailedWithCode:
      "La génération des migrations a échoué avec le code {{code}} : {{output}}",
    migrationFailed: "Échec de l'exécution des migrations : {{message}}",
  },
  success: {
    title: "Migration réussie",
    description: "Migration de la base de données terminée avec succès",
  },
  status: {
    pending: "En attente",
    running: "En cours",
    success: "Réussie",
    failed: "Échouée",
    rolledBack: "Annulée",
  },
  direction: {
    up: "Montante",
    down: "Descendante",
  },
  environment: {
    development: "Développement",
    staging: "Préproduction",
    production: "Production",
  },
  messages: {
    dryRun: "SIMULATION : les migrations seraient exécutées",
    generatingMigrations: "Génération des migrations :\n{{output}}\n",
    noMigrationsFolder: "Aucun dossier de migrations trouvé",
    noMigrationFiles: "Aucun fichier de migration trouvé",
    executedMigrations: "{{count}} migrations exécutées avec succès",
    redoNotImplemented: "La fonction de rejeu serait implémentée ici",
    repairCompleted: "Réparation des migrations terminée avec succès",
    repairDryRun: "Simulation : la réparation des migrations serait effectuée",
    trackingReset: "Suivi des migrations réinitialisé avec succès",
    productionCompleted: "Migrations de production terminées avec succès",
    productionWithBackup: " (avec sauvegarde)",
    syncCompleted:
      "Synchronisation des migrations terminée avec succès ({{direction}})",
    failedToGenerate: "Échec de la génération des migrations : {{error}}",
    failedToExecute: "Échec de l'exécution des migrations : {{error}}",
    failedToRedo: "Échec du rejeu de la migration : {{error}}",
  },
};
