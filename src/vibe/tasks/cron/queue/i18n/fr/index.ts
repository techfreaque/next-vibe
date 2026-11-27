import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  priority: {
    critical: "Critique",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    background: "Arrière-plan",
  },
  taskCategory: {
    development: "Développement",
    build: "Build",
    watch: "Surveillance",
    generator: "Générateur",
    test: "Test",
    maintenance: "Maintenance",
    database: "Base de données",
    system: "Système",
    monitoring: "Supervision",
    leadManagement: "Gestion des leads",
  },
  hiddenFilter: {
    visible: "Visibles",
    hidden: "Masquées",
    all: "Toutes",
  },
  category: "Endpoint API",
  tags: {
    tasks: "Tâches",
    cron: "Cron",
    scheduling: "Planification",
    queue: "File d'attente",
  },
  errors: {
    fetchQueue: "Impossible de récupérer la file d'attente des tâches",
  },
  get: {
    title: "File d'attente des tâches",
    titleShort: "File d'attente",
    description:
      "Affiche les prochaines exécutions de tâches, triées par date de prochaine exécution",
    fields: {
      priority: {
        label: "Priorité",
        description: "Filtrer par priorité de tâche",
        placeholder: "Choisir une priorité...",
      },
      category: {
        label: "Catégorie",
        description: "Filtrer par catégorie de tâche",
        placeholder: "Choisir une catégorie...",
      },
      hidden: {
        label: "Visibilité",
        description:
          "Inclure les tâches masquées (par défaut : toutes les tâches, masquées comprises)",
        placeholder: "Toutes les tâches",
      },
      search: {
        label: "Recherche",
        description: "Filtrer les tâches par nom, route ou catégorie",
        placeholder: "Rechercher dans la file...",
      },
      limit: {
        label: "Limite",
        description: "Nombre maximal de tâches à renvoyer",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de tâches à ignorer",
      },
    },
    response: {
      tasks: {
        title: "Tâches en file",
      },
      task: {
        title: "Tâche",
        description: "Informations sur la tâche",
        id: "ID de la tâche",
        routeId: "ID de route",
        displayName: "Nom",
        taskDescription: "Description",
        schedule: "Planification",
        enabled: "Activée",
        hidden: "Masquée",
        priority: "Priorité",
        status: "Statut",
        category: "Catégorie",
        version: "Version",
        timezone: "Fuseau horaire",
        timeout: "Délai max. (ms)",
        retries: "Nouvelles tentatives",
        retryDelay: "Délai entre tentatives (ms)",
        lastExecutedAt: "Dernière exécution le",
        lastExecutionStatus: "Statut de la dernière exécution",
        lastExecutionError: "Erreur de la dernière exécution",
        lastExecutionDuration: "Durée de la dernière exécution (ms)",
        nextExecutionAt: "Prochaine exécution le",
        executionCount: "Nombre d'exécutions",
        consecutiveFailures: "Échecs consécutifs",
        successCount: "Nombre de réussites",
        errorCount: "Nombre d'erreurs",
        averageExecutionTime: "Durée moyenne d'exécution (ms)",
        createdAt: "Créée le",
        updatedAt: "Mise à jour le",
        userId: "ID utilisateur",
        outputMode: "Mode de sortie",
        owner: "Propriétaire",
        shortId: "ID court",
        taskInput: "Entrée de la tâche",
        runOnce: "Exécution unique",
        notificationTargets: "Destinataires des notifications",
        targetInstance: "Instance cible",
        tags: "Tags",
      },
      totalTasks: "Total des tâches",
    },
    errors: {
      internal: {
        title: "Erreur interne du serveur lors de la récupération de la file",
        description:
          "Une erreur inattendue est survenue lors du chargement de la file d'attente",
      },
      unauthorized: {
        title: "Accès non autorisé à la file d'attente",
        description:
          "Vous n'avez pas l'autorisation de consulter la file d'attente des tâches",
      },
      validation: {
        title: "Paramètres de requête invalides",
        description: "Les paramètres de requête fournis sont invalides",
      },
      forbidden: {
        title: "Accès interdit",
        description: "L'accès à cette ressource est interdit",
      },
      notFound: {
        title: "File introuvable",
        description: "Aucune tâche dans la file d'attente",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau est survenue lors de la récupération de la file",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Des modifications non enregistrées doivent être traitées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu lors du traitement de la requête",
      },
    },
    success: {
      retrieved: {
        title: "File récupérée",
        description: "La file d'attente des tâches a été récupérée",
      },
    },
  },
  widget: {
    title: "File d'attente des tâches",
    loading: "Chargement de la file...",
    header: {
      tasks: "Toutes les tâches",
      history: "Historique",
      stats: "Statistiques",
      create: "Nouvelle tâche",
      refresh: "Actualiser",
    },
    filter: {
      visible: "Visibles",
      hiddenOnly: "Masquées",
      allTasks: "Toutes les tâches",
      allPriorities: "Toutes les priorités",
      allCategories: "Toutes les catégories",
    },
    search: {
      placeholder: "Rechercher dans la file...",
    },
    queue: {
      position: "#",
      nextRun: "Prochaine exécution",
      lastRun: "Dernière exécution",
      never: "Jamais",
      notScheduled: "Non planifiée",
      in: "dans",
      ago: "il y a",
      justNow: "à l'instant",
      overdue: "en retard",
      hiddenBadge: "Masquée",
      owner: {
        system: "Système",
        user: "Utilisateur",
      },
    },
    action: {
      view: "Voir les détails",
      history: "Voir l'historique",
      edit: "Modifier la tâche",
      run: "Exécuter maintenant",
    },
    bulk: {
      selected: "{count} sélectionnée(s)",
      selectAll: "Tout sélectionner",
      selectTask: "Sélectionner {{name}}",
      clearSelection: "Effacer la sélection",
      enable: "Activer",
      disable: "Désactiver",
      runNow: "Exécuter maintenant",
      delete: "Supprimer",
      confirmDeleteTitle: "Supprimer les tâches ?",
      confirmDelete:
        "Supprimer {count} tâche(s) ? Cette action est irréversible.",
      cancel: "Annuler",
      success: "{{succeeded}} réussie(s), {{failed}} échouée(s)",
    },
    empty: {
      noTasks: "La file est vide",
      noTasksDesc: "Aucune tâche activée avec une exécution planifiée",
      noMatches: "Aucune tâche ne correspond à vos filtres",
      noMatchesDesc: "Modifiez votre recherche ou vos critères de filtre",
      clearFilters: "Effacer les filtres",
    },
  },
};
