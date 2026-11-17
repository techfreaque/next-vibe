import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des tâches",

  errors: {
    fetchCronTaskStats:
      "Impossible de récupérer les statistiques des tâches cron ({{type}}, {{period}}, tâche {{taskId}}) : {{error}}",
  },

  get: {
    title: "Statistiques des tâches cron",
    titleShort: "Stats cron",
    description:
      "Récupère les statistiques et métriques complètes des tâches cron",
    tag: "Statistiques cron",
    form: {
      title: "Requête de statistiques cron",
      description:
        "Paramètres de récupération des statistiques des tâches cron",
    },
    fields: {
      period: {
        title: "Période",
        description: "Période d'agrégation des statistiques",
      },
      type: {
        title: "Type de statistiques",
        description: "Type de statistiques à récupérer",
      },
      taskId: {
        title: "ID de la tâche",
        description: "ID de tâche facultatif pour filtrer les statistiques",
      },
      limit: {
        title: "Nombre de résultats",
        description: "Nombre maximal de résultats à renvoyer",
      },
      timePeriod: {
        title: "Période",
      },
      dateRangePreset: {
        title: "Plage de dates prédéfinie",
      },
      taskName: {
        title: "Nom de la tâche",
      },
      taskStatus: {
        title: "Statut de la tâche",
      },
      taskPriority: {
        title: "Priorité de la tâche",
      },
      healthStatus: {
        title: "État de santé",
      },
      minDuration: {
        title: "Durée minimale",
      },
      maxDuration: {
        title: "Durée maximale",
      },
      includeDisabled: {
        title: "Inclure les tâches désactivées",
      },
      includeSystemTasks: {
        title: "Inclure les tâches système",
      },
      hasRecentFailures: {
        title: "Échecs récents",
      },
      hasTimeout: {
        title: "Délai dépassé",
      },
      search: {
        title: "Recherche",
      },
    },
    period: {
      hour: "Par heure",
      day: "Par jour",
      week: "Par semaine",
      month: "Par mois",
    },
    type: {
      overview: "Vue d'ensemble",
      performance: "Performances",
      errors: "Analyse des erreurs",
      trends: "Analyse des tendances",
    },
    response: {
      totalTasks: { title: "Total des tâches" },
      executedTasks: { title: "Tâches exécutées" },
      successfulTasks: { title: "Tâches réussies" },
      failedTasks: { title: "Tâches échouées" },
      averageExecutionTime: { title: "Durée moy. d'exécution (ms)" },
      totalExecutions: { title: "Exécutions totales" },
      executionsLast24h: { title: "Exécutions sur 24 h" },
      successRate: { title: "Taux de réussite (%)" },
      successfulExecutions: { title: "Exécutions réussies" },
      failedExecutions: { title: "Exécutions échouées" },
      failureRate: { title: "Taux d'échec (%)" },
      avgExecutionTime: { title: "Durée moy. d'exécution (ms)" },
      minExecutionTime: { title: "Durée min. d'exécution (ms)" },
      maxExecutionTime: { title: "Durée max. d'exécution (ms)" },
      medianExecutionTime: { title: "Durée médiane d'exécution (ms)" },
      pendingExecutions: { title: "Exécutions en attente" },
      runningExecutions: { title: "Exécutions en cours" },
      activeTasks: { title: "Tâches actives" },
      systemStatus: { title: "État du système" },
      uptime: { title: "Disponibilité" },
      healthyTasks: { title: "Tâches saines" },
      degradedTasks: { title: "Tâches dégradées" },
      systemLoad: { title: "Charge système (%)" },
      queueSize: { title: "Taille de la file" },
    },
    errors: {
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur est survenue lors de la récupération des statistiques",
      },
      validation: {
        title: "Erreur de validation",
        description: "Les paramètres fournis sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour accéder aux statistiques",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Autorisations insuffisantes pour accéder aux statistiques",
      },
      notFound: {
        title: "Introuvable",
        description: "Les statistiques demandées sont introuvables",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu lors du traitement de la requête",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau est survenue lors de la récupération des statistiques",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications non enregistrées doivent être traitées",
      },
    },
    success: {
      title: "Statistiques récupérées",
      description: "Statistiques des tâches cron récupérées",
    },
  },
  priority: {
    critical: "Critique",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    background: "Arrière-plan",
  },
  widget: {
    title: "Statistiques cron",
    loading: "Chargement des statistiques...",
    viewTasks: "Tâches",
    viewHistory: "Historique",
    viewPulse: "Pulse",
    refresh: "Actualiser",
    totalTasks: "Total des tâches",
    executedTasks: "Tâches exécutées",
    successfulTasks: "Réussies",
    failedTasks: "Échouées",
    successRate: "Taux de réussite",
    avgDuration: "Durée moyenne",
    overallSuccessRate: "Taux de réussite global",
    activeTasks: "Tâches actives",
    runningExecutions: "En cours",
    pendingExecutions: "En attente",
    healthyTasks: "Tâches saines",
    degradedTasks: "Tâches dégradées",
    systemLoad: "Charge système",
    queueSize: "Taille de la file",
    executionsLast24h: "Dernières 24 h",
    tasksByStatus: "Tâches par statut",
    tasksByPriority: "Tâches par priorité",
    topPerforming: "Tâches les plus performantes",
    problemTasks: "Tâches problématiques",
    recentActivity: "Activité récente",
    dailyStats: "Statistiques quotidiennes",
    systemStatus: {
      healthy: "Sain",
      warning: "Avertissement",
      critical: "Critique",
      unknown: "Inconnu",
    },
    uptime: "Disponibilité",
    col: {
      rank: "#",
      taskName: "Nom de la tâche",
      executions: "Exécutions",
      avgDuration: "Durée moyenne",
      failures: "Échecs",
      failureRate: "Taux d'échec",
      date: "Date",
      successes: "Réussites",
      uniqueTasks: "Tâches distinctes",
    },
  },
};
