import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des tâches",

  errors: {
    cronTaskNotFound: "Tâche cron introuvable",
    repositoryInternalError: "Une erreur interne est survenue",
    fetchCronTaskHistoryDetail:
      "Impossible de charger l'historique de la tâche {{taskId}} (limite {{limit}}) : {{error}}",
    fetchCronTaskHistoryAllDetail:
      "Impossible de charger l'historique des tâches (limite {{limit}}) : {{error}}",
  },

  get: {
    tags: {
      tasks: "Tâches",
      monitoring: "Supervision",
    },
    title: "Historique d'exécution des tâches",
    titleShort: "Historique des tâches",
    description: "Consulter l'historique des exécutions des tâches cron",
    fields: {
      taskId: {
        label: "ID de la tâche",
        description: "Filtrer par ID de tâche",
        placeholder: "Saisir l'ID de la tâche",
      },
      taskName: {
        label: "Nom de la tâche",
        description: "Filtrer par nom de tâche (correspondance partielle)",
        placeholder: "Saisir le nom de la tâche",
      },
      status: {
        label: "Statut d'exécution",
        description: "Filtrer par statut d'exécution",
        placeholder: "Choisir les statuts",
        options: {
          PENDING: "En attente",
          SCHEDULED: "Planifiée",
          RUNNING: "En cours",
          COMPLETED: "Terminée",
          FAILED: "Échouée",
          ERROR: "Erreur",
          TIMEOUT: "Délai dépassé",
          SKIPPED: "Ignorée",
          CANCELLED: "Annulée",
          STOPPED: "Arrêtée",
          BLOCKED: "Bloquée",
        },
      },
      priority: {
        label: "Priorité de la tâche",
        description: "Filtrer par niveau de priorité",
        placeholder: "Choisir les priorités",
        options: {
          LOW: "Basse",
          MEDIUM: "Moyenne",
          HIGH: "Haute",
          CRITICAL: "Critique",
        },
      },
      startDate: {
        label: "Date de début",
        description: "Filtrer les exécutions après cette date",
      },
      endDate: {
        label: "Date de fin",
        description: "Filtrer les exécutions avant cette date",
      },
      limit: {
        label: "Nombre de résultats",
        description: "Nombre maximal de résultats à renvoyer",
        placeholder: "50",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de résultats à ignorer pour la pagination",
        placeholder: "0",
      },
    },
    response: {
      title: "Réponse de l'historique des tâches",
      description: "Données historiques d'exécution des tâches cron",
      executions: {
        title: "Exécutions",
      },
      totalCount: {
        title: "Nombre total",
      },
      hasMore: {
        title: "Autres résultats disponibles",
      },
      statusCounts: {
        title: "Nombre par statut",
      },
      summary: {
        title: "Résumé des exécutions",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      internal: {
        title: "Erreur interne du serveur",
        description: "Impossible de récupérer l'historique des tâches",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'avez pas l'autorisation de consulter l'historique des tâches",
      },
      notFound: {
        title: "Introuvable",
        description: "Tâche ou exécution introuvable",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Erreur réseau lors du chargement de l'historique des tâches",
      },
      forbidden: {
        title: "Interdit",
        description: "L'accès à l'historique des tâches est interdit",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsavedChanges: {
        titleChanges: "Modifications non enregistrées",
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données est survenu",
      },
    },
    success: {
      title: "Historique récupéré",
      description: "Historique d'exécution des tâches récupéré",
    },
    log: {
      fetchSuccess: "{{count}} exécutions récupérées",
      fetchError: "Impossible de récupérer l'historique d'exécution des tâches",
    },
    request: {
      title: "Paramètres de la requête",
      description: "Filtrer l'historique d'exécution des tâches",
    },
    unknownTask: "Tâche inconnue",
  },
  widget: {
    runDetails: "Détail de l’exécution",
    runId: "Identifiant de l’exécution",
    emptyFiltered:
      "Aucune exécution ne correspond. Ajustez la tâche, le statut, la priorité ou les dates.",
    emptyUnfiltered: "Les exécutions apparaissent ici dès leur lancement.",
    title: "Historique d'exécution des tâches",
    loading: "Chargement de l'historique...",
    header: {
      tasks: "Tâches",
      stats: "Statistiques",
      pulse: "Pulse",
      refresh: "Actualiser",
    },
    summary: {
      total: "Exécutions trouvées",
      successful: "Réussies",
      failed: "Échouées",
      successRate: "Taux de réussite",
      avgDuration: "Durée moyenne",
    },
    search: {
      placeholder: "Rechercher des tâches...",
    },
    filter: {
      clear: "Effacer les filtres",
      allTasks: "Toutes les tâches",
      allPriorities: "Toutes les priorités",
      taskHistory: "Historique de cette tâche",
      all: "Toutes",
      running: "En cours",
      completed: "Terminées",
      failed: "Échouées",
      timeout: "Délai dépassé",
      cancelled: "Annulées",
    },
    col: {
      taskName: "Nom de la tâche",
      status: "Statut",
      duration: "Durée",
      started: "Début",
      completed: "Fin",
      environment: "Environnement",
      error: "Erreur",
    },
    empty: "Aucun historique d'exécution",
    result: "Résultat",
    error: {
      collapse: "Réduire l'erreur",
      label: "Erreur",
    },
    pagination: {
      info: "Page {{page}} sur {{totalPages}} ({{total}} au total)",
      prev: "Précédent",
      next: "Suivant",
    },
  },
};
