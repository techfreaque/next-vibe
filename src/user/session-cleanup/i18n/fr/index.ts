import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",

  post: {
    title: "Nettoyage des sessions",
    titleShort: "Nettoyer les sessions",
    description: "Supprime les sessions et jetons utilisateur expirés",
    tag: "Nettoyage des sessions",
    container: {
      title: "Nettoyage des sessions",
      description: "Configurer et lancer le nettoyage des sessions",
    },
    fields: {
      sessionRetentionDays: {
        label: "Conservation des sessions (jours)",
        description: "Nombre de jours de conservation des sessions",
      },
      tokenRetentionDays: {
        label: "Conservation des jetons (jours)",
        description: "Nombre de jours de conservation des jetons",
      },
      batchSize: {
        label: "Taille du lot",
        description: "Nombre d'enregistrements traités par lot",
      },
      dryRun: {
        label: "Simulation",
        description: "Exécuter sans supprimer réellement les enregistrements",
      },
    },
    response: {
      sessionsDeleted: "Sessions supprimées",
      tokensDeleted: "Jetons supprimés",
      totalProcessed: "Total traité",
      executionTimeMs: "Durée d'exécution (ms)",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être administrateur pour lancer le nettoyage des sessions",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant le nettoyage",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "Configuration de nettoyage invalide",
      },
    },
    success: {
      title: "Nettoyage des sessions terminé",
      description: "Sessions et jetons supprimés",
    },
  },
  task: {
    name: "user-session-cleanup",
    description:
      "Supprime les sessions utilisateur expirées pour préserver la sécurité du système",
    purpose:
      "Supprime les sessions expirées pour préserver la sécurité et les performances",
    impact:
      "Améliore les performances et la sécurité en supprimant les données de session obsolètes",
    rollback: "Aucun retour arrière possible pour les opérations de nettoyage",
  },
  errors: {
    default: "Une erreur s'est produite lors du nettoyage des sessions",
    execution_failed: {
      title: "Échec du nettoyage des sessions : {{error}}",
      description: "Impossible de supprimer les sessions expirées",
    },
    partial_failure: {
      title: "Nettoyage des sessions partiellement échoué : {{errors}}",
      description: "Certaines sessions n'ont pas pu être supprimées",
    },
    unknown_error: {
      title: "Erreur inconnue lors du nettoyage des sessions",
      description:
        "Une erreur inconnue s'est produite lors du nettoyage des sessions",
    },
    invalid_session_retention: {
      title: "Conservation des sessions invalide",
      description:
        "La durée de conservation des sessions indiquée est invalide",
    },
    invalid_token_retention: {
      title: "Conservation des jetons invalide",
      description: "La durée de conservation des jetons indiquée est invalide",
    },
    invalid_batch_size: {
      title: "Taille de lot invalide",
      description: "La taille de lot indiquée pour le nettoyage est invalide",
    },
    validation_failed: {
      title: "Échec de la validation",
      description:
        "La validation de la configuration du nettoyage des sessions a échoué",
    },
  },
  success: {
    title: "Nettoyage des sessions terminé",
    description: "Les sessions expirées ont été supprimées",
  },
  monitoring: {
    alertTrigger: "La tâche de nettoyage des sessions a échoué",
  },
  documentation: {
    overview:
      "Cette tâche supprime les sessions utilisateur expirées du système pour préserver la sécurité et les performances",
  },
};
