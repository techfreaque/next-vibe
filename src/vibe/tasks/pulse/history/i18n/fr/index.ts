import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des tâches",

  tags: {
    pulse: "Pulse",
    monitoring: "Surveillance",
  },

  errors: {
    fetchCronTaskHistory:
      "Impossible de récupérer l'historique d'exécution du pulse",
  },

  get: {
    title: "Historique d'exécution du pulse",
    titleShort: "Historique du pulse",
    description: "Consulter les cycles d'exécution passés du pulse",
    fields: {
      startDate: {
        label: "Date de début",
        description: "Afficher les cycles du pulse après cette date",
      },
      endDate: {
        label: "Date de fin",
        description: "Afficher les cycles du pulse avant cette date",
      },
      status: {
        label: "Statut",
        description: "Filtrer par statut d'exécution",
        placeholder: "Tous les statuts",
      },
      limit: {
        label: "Nombre de résultats",
        description: "Nombre maximal de résultats à renvoyer",
        placeholder: "50",
      },
      offset: {
        label: "Décalage des résultats",
        description: "Nombre de résultats à ignorer pour la pagination",
        placeholder: "0",
      },
    },
    response: {
      executions: { title: "Exécutions du pulse" },
      totalCount: { title: "Nombre total" },
      hasMore: { title: "Autres résultats disponibles" },
      summary: { title: "Résumé des exécutions" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la récupération de l'historique du pulse",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'avez pas l'autorisation de consulter l'historique du pulse",
      },
      forbidden: {
        title: "Accès interdit",
        description: "L'accès à l'historique du pulse est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Enregistrement d'exécution du pulse introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
    success: {
      title: "Historique récupéré",
      description: "Historique d'exécution du pulse récupéré avec succès",
    },
  },
  pulse: {
    execution: {
      success: "Succès",
      failure: "Échec",
      timeout: "Délai dépassé",
      cancelled: "Annulé",
      pending: "En attente",
    },
  },
  widget: {
    taskNameUnavailable: "Nom de la tâche indisponible",
    title: "Historique du pulse",
    empty: "Aucune exécution du pulse trouvée",
    details: "Détails",
    discovered: "{{count}} découvertes",
    due: "{{count}} dues",
    succeeded: "{{count}} ok",
    failed: "{{count}} en échec",
    tasksExecuted: "Exécutées",
    tasksSucceeded: "Réussies",
    tasksFailed: "En échec",
    tasksSkipped: "Ignorées",
    header: {
      cronHistory: "Historique cron",
      stats: "Statistiques",
      refresh: "Actualiser",
    },
    summary: {
      total: "Total",
      successful: "Réussies",
      failed: "En échec",
      successRate: "Taux de réussite",
      avgDuration: "Durée moyenne",
    },
    filter: {
      all: "Toutes",
      success: "Succès",
      failure: "En échec",
      timeout: "Délai dépassé",
    },
    pagination: {
      info: "Page {{page}} sur {{totalPages}} ({{total}} au total)",
      prev: "Précédent",
      next: "Suivant",
    },
  },
};
