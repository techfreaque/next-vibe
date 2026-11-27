import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Exécution du pulse",
  tags: {
    execute: "Exécuter",
  },
  errors: {
    executePulse: "Échec de l'exécution du pulse",
  },
  post: {
    title: "Exécuter le pulse",
    titleShort: "Exécuter le pulse",
    description: "Exécuter la surveillance de santé du pulse et les tâches",
    container: {
      title: "Exécution du pulse",
      description:
        "Exécuter la surveillance du pulse et lancer les tâches planifiées",
    },
    fields: {
      dryRun: {
        label: "Simulation",
        description: "Simuler l'exécution sans appliquer de modifications",
      },
      taskNames: {
        label: "Alias de tâches",
        description:
          "Saisissez l’alias d’un point d’accès et appuyez sur Entrée. Laissez le champ vide pour inclure toutes les tâches concernées.",
      },
      force: {
        label: "Forcer l'exécution",
        description: "Forcer l'exécution même si les tâches ne sont pas dues",
      },
      success: {
        title: "Succès",
      },
      message: {
        title: "Message",
      },
    },
    response: {
      pulseId: "ID du pulse",
      executedAt: "Exécuté le",
      totalTasksDiscovered: "Tâches découvertes",
      tasksDue: "Tâches dues",
      tasksExecuted: "Tâches exécutées",
      tasksSucceeded: "Tâches réussies",
      tasksFailed: "Tâches en échec",
      tasksSkipped: "Tâches ignorées",
      totalExecutionTimeMs: "Durée totale d'exécution (ms)",
      errors: "Erreurs",
      summary: "Résumé de l'exécution",
      results: "Résultats",
      resultsDescription: "Résultats d'exécution des tâches",
      taskName: "Nom de la tâche",
      success: "Succès",
      duration: "Durée",
      message: "Message",
      executionFailed: "Échec de l'exécution",
      dryRunSuccess: "Simulation terminée avec succès",
      executionSuccess: "Exécution terminée avec succès",
    },
    examples: {
      basic: {
        title: "Exécution simple du pulse",
      },
      dryRun: {
        title: "Exécution en simulation",
      },
      success: {
        title: "Exécution réussie",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      internal: {
        title: "Erreur interne",
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
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications ne sont pas enregistrées",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
    },
    success: {
      title: "Succès",
      description: "Opération terminée avec succès",
    },
  },
};
