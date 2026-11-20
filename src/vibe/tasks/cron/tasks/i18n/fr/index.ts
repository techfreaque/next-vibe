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
  status: {
    pending: "En attente",
    running: "En cours",
    completed: "Terminée",
    failed: "Échouée",
    timeout: "Délai dépassé",
    cancelled: "Annulée",
    skipped: "Ignorée",
    blocked: "Bloquée",
    scheduled: "Planifiée",
    stopped: "Arrêtée",
    error: "Erreur",
  },
  hiddenFilter: {
    visible: "Visibles",
    hidden: "Masquées",
    all: "Toutes",
  },
  enabledFilter: {
    all: "Toutes",
    enabled: "Activées",
    disabled: "Désactivées",
  },
  outputMode: {
    storeOnly: "Enregistrer uniquement",
    notifyOnFailure: "Notifier en cas d'échec",
    notifyAlways: "Toujours notifier",
  },
  category: "Endpoint API",
  tags: {
    tasks: "Tâches",
    cron: "Cron",
    scheduling: "Planification",
  },
  errors: {
    fetchCronTasks: "Impossible de récupérer les tâches cron",
    createCronTask: "Impossible de créer la tâche cron",
    invalidTaskInput:
      "L'entrée de la tâche ne correspond pas au schéma de requête de l'endpoint",
    endpointNotFound: "Aucun endpoint trouvé pour cet ID de route",
    targetInstanceForbidden:
      "Seuls les administrateurs peuvent définir l'instance cible des tâches",
  },
  list: {
    columns: {
      createdAt: "Créée le",
      updatedAt: "Mise à jour le",
    },
  },
  get: {
    title: "Lister les tâches cron",
    titleShort: "Tâches cron",
    description: "Récupère la liste des tâches cron, avec filtres facultatifs",
    container: {
      title: "Liste des tâches cron",
      description: "Filtrer et consulter les tâches cron",
    },
    fields: {
      status: {
        label: "Statut",
        description: "Filtrer par statut de tâche",
        placeholder: "Choisir un statut...",
      },
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
      enabled: {
        label: "Statut",
        description: "Filtrer par état d'activation",
        placeholder: "Toutes les tâches",
      },
      hidden: {
        label: "Visibilité",
        description:
          "Filtrer par visibilité (par défaut : visibles uniquement)",
        placeholder: "Tâches visibles",
      },
      search: {
        label: "Recherche",
        description:
          "Filtrer les tâches par nom, route, description ou catégorie",
        placeholder: "Rechercher des tâches...",
      },
      sort: {
        label: "Tri",
        description: "Ordre de tri de la liste des tâches",
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
        title: "Tâches",
      },
      task: {
        title: "Tâche",
        description: "Informations sur la tâche",
        id: "ID de la tâche",
        shortId: "ID court",
        routeId: "ID de route",
        name: "Nom de la tâche",
        displayName: "Nom",
        taskDescription: "Description",
        schedule: "Planification",
        enabled: "Activée",
        hidden: "Masquée",
        priority: "Priorité",
        status: "Statut",
        category: "Catégorie",
        lastRun: "Dernière exécution",
        nextRun: "Prochaine exécution",
        version: "Version",
        timezone: "Fuseau horaire",
        timeout: "Délai max. (ms)",
        retries: "Nouvelles tentatives",
        retryDelay: "Délai entre tentatives (ms)",
        taskInput: "Entrée de la tâche",
        runOnce: "Exécution unique",
        outputMode: "Mode de sortie",
        owner: "Propriétaire",
        notificationTargets: "Destinataires des notifications",
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
        targetInstance: "Instance cible",
        tags: "Tags",
        createdAt: "Créée le",
        updatedAt: "Mise à jour le",
      },
      totalTasks: "Total des tâches",
    },
    errors: {
      internal: {
        title: "Erreur interne du serveur lors de la récupération des tâches",
        description:
          "Une erreur inattendue est survenue lors du chargement de la liste des tâches",
      },
      unauthorized: {
        title: "Accès non autorisé à la liste des tâches",
        description:
          "Vous n'avez pas l'autorisation de consulter la liste des tâches",
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
        title: "Aucune tâche trouvée",
        description: "Aucune tâche ne correspond aux critères",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau est survenue lors de la récupération des tâches",
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
        title: "Tâches récupérées",
        description: "La liste des tâches a été récupérée",
      },
    },
  },
  post: {
    title: "Créer une tâche cron",
    titleShort: "Créer une tâche",
    description: "Crée une nouvelle tâche cron",
    container: {
      title: "Créer une tâche",
      description: "Configurer une nouvelle tâche cron",
    },
    fields: {
      id: {
        label: "ID de la tâche",
        description:
          "Identifiant unique et stable de cette tâche (ex. 'db-health')",
        placeholder: "Saisir l'ID de la tâche...",
      },
      routeId: {
        label: "ID de route",
        description:
          "Identifiant du gestionnaire : nom de tâche, alias d'endpoint ou 'cron-steps'",
        placeholder: "Saisir l'ID de route...",
      },
      displayName: {
        label: "Nom affiché",
        description: "Libellé lisible de cette tâche",
        placeholder: "Saisir le nom affiché...",
      },
      outputMode: {
        label: "Mode de sortie",
        description: "Quand envoyer des notifications après l'exécution",
        placeholder: "Choisir le mode de sortie...",
      },
      description: {
        label: "Description",
        description: "Description de la tâche",
        placeholder: "Saisir la description...",
      },
      schedule: {
        label: "Planification",
        description: "Expression de planification cron",
        placeholder: "*/5 * * * *",
      },
      priority: {
        label: "Priorité",
        description: "Niveau de priorité de la tâche",
      },
      category: {
        label: "Catégorie",
        description: "Catégorie de la tâche",
      },
      enabled: {
        label: "Activée",
        description: "Activer ou désactiver la tâche",
      },
      hidden: {
        label: "Masquée",
        description:
          "Masquer cette tâche des prompts système de l'IA et des listes de tâches par défaut",
      },
      timeout: {
        label: "Délai max. (ms)",
        description: "Durée d'exécution maximale en millisecondes",
      },
      retries: {
        label: "Nouvelles tentatives",
        description: "Nombre de nouvelles tentatives",
      },
      retryDelay: {
        label: "Délai entre tentatives (ms)",
        description: "Délai entre deux tentatives en millisecondes",
      },
      taskInput: {
        label: "Entrée de la tâche",
        description: "Données d'entrée JSON de la tâche",
        placeholder: '{ "dryRun": false }',
        invalidJson:
          "JSON invalide. Vérifiez les guillemets, virgules et crochets.",
        notObject:
          'L\'entrée de la tâche doit être un objet JSON, par exemple { "key": "value" }.',
      },
      runOnce: {
        label: "Exécution unique",
        description: "Exécuter cette tâche une seule fois, puis la désactiver",
      },
      targetInstance: {
        label: "Instance cible",
        description:
          "ID de l'instance sur laquelle cette tâche doit s'exécuter (ex. 'hermes', 'thea-prod'). Laissez vide pour l'exécuter uniquement sur l'instance hôte.",
        placeholder: "Laisser vide pour l'hôte uniquement",
      },
    },
    response: {
      task: {
        title: "Tâche créée",
        id: "ID de la tâche",
        shortId: "ID court",
        routeId: "ID de route",
        displayName: "Nom",
        taskDescription: "Description",
        version: "Version",
        category: "Catégorie",
        schedule: "Planification",
        timezone: "Fuseau horaire",
        enabled: "Activée",
        hidden: "Masquée",
        priority: "Priorité",
        timeout: "Délai max. (ms)",
        retries: "Nouvelles tentatives",
        retryDelay: "Délai entre tentatives (ms)",
        taskInput: "Entrée de la tâche",
        runOnce: "Exécution unique",
        outputMode: "Mode de sortie",
        notificationTargets: "Destinataires des notifications",
        lastExecutedAt: "Dernière exécution le",
        lastExecutionStatus: "Statut de la dernière exécution",
        lastExecutionError: "Erreur de la dernière exécution",
        lastExecutionDuration: "Durée de la dernière exécution (ms)",
        nextExecutionAt: "Prochaine exécution le",
        executionCount: "Nombre d'exécutions",
        successCount: "Nombre de réussites",
        errorCount: "Nombre d'erreurs",
        averageExecutionTime: "Durée moyenne d'exécution (ms)",
        consecutiveFailures: "Échecs consécutifs",
        targetInstance: "Instance cible",
        tags: "Tags",
        owner: "Propriétaire",
        createdAt: "Créée le",
        updatedAt: "Mise à jour le",
      },
    },
    errors: {
      validation: {
        title: "Échec de la validation",
        description: "Les données de la tâche sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'avez pas l'autorisation de créer des tâches",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur est survenue lors de la création de la tâche",
      },
      forbidden: {
        title: "Interdit",
        description: "L'accès à cette ressource est interdit",
      },
      conflict: {
        title: "Conflit",
        description: "Une tâche portant ce nom existe déjà",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications ne sont pas enregistrées",
      },
    },
    success: {
      created: {
        title: "Tâche créée",
        description: "La tâche a été créée",
      },
    },
  },
  widget: {
    pagination: {
      info: "Page {{page}} sur {{totalPages}}",
      prev: "Précédente",
      next: "Suivante",
    },
    title: "Tâches cron",
    loading: "Chargement des tâches...",
    header: {
      stats: "Statistiques",
      graphs: "Graphiques",
      history: "Historique",
      queue: "File d'attente",
      refresh: "Actualiser",
      create: "Nouvelle tâche",
    },
    filter: {
      all: "Toutes",
      running: "En cours",
      completed: "Terminées",
      failed: "Échouées",
      pending: "En attente",
      disabled: "Désactivées",
      allPriorities: "Toutes les priorités",
      allCategories: "Toutes les catégories",
      visible: "Visibles",
      hiddenOnly: "Masquées",
      allTasks: "Toutes les tâches",
    },
    search: {
      placeholder: "Rechercher des tâches...",
    },
    sort: {
      nameAsc: "Nom A-Z",
      nameDesc: "Nom Z-A",
      schedule: "Planification",
      lastRunNewest: "Dernière exécution (récente)",
      executionsMost: "Plus d'exécutions",
    },
    task: {
      runCount: "Exécutions : {{count}}",
      successCount: "Réussies : {{count}}",
      failureCount: "En échec : {{count}}",
      executions: "Exécutions :",
      lastRun: "Dernière exécution :",
      never: "Jamais",
      nextRun: "Prochaine exécution :",
      notScheduled: "Non planifiée",
      routeId: "ID de route",
      hiddenBadge: "Masquée",
      owner: {
        system: "Système",
        user: "Utilisateur",
      },
      outputMode: {
        storeOnly: "Enregistrer uniquement",
        notifyOnFailure: "Notifier en cas d'échec",
        notifyAlways: "Toujours notifier",
      },
    },
    action: {
      select: "Sélectionner {{task}}",
      view: "Voir les détails",
      history: "Voir l'historique",
      edit: "Modifier la tâche",
      delete: "Supprimer la tâche",
      runNow: "Exécuter maintenant",
    },
    bulk: {
      selected: "{count} sélectionnée(s)",
      selectAll: "Sélectionner cette page",
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
      noTasks: "Aucune tâche cron",
      noTasksDesc: "Créez votre première tâche cron pour commencer",
      noMatches: "Aucune tâche ne correspond à vos filtres",
      noMatchesDesc: "Modifiez votre recherche ou vos critères de filtre",
      clearFilters: "Effacer les filtres",
    },
    create: {
      created: "Tâche créée",
      route: "Route",
      schedule: "Planification",
      nextRun: "Prochaine exécution",
      notScheduled: "Non planifiée",
      owner: "Propriétaire",
      ownerSystem: "Système",
      ownerYou: "Vous",
      ownerUser: "Utilisateur {{id}}",
      enabled: "Activée",
      disabled: "Désactivée",
      taskInput: "Entrée de la tâche",
      noInput:
        "Aucune entrée : la route s'exécute avec ses valeurs par défaut.",
      openTask: "Ouvrir la tâche",
    },
  },
};
