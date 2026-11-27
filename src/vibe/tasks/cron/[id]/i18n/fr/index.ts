import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",
  tags: {
    cron: "Cron",
    scheduling: "Planification",
  },
  get: {
    title: "Obtenir une tâche cron",
    titleShort: "Tâche cron",
    description: "Récupère une tâche cron par son ID",
    container: {
      title: "Détails de la tâche cron",
      description: "Consulter les détails d'une tâche cron",
    },
    fields: {
      id: {
        label: "ID de la tâche",
        description: "Identifiant unique de la tâche",
      },
    },
    response: {
      task: {
        title: "Tâche",
        id: "ID de la tâche",
        shortId: "ID court",
        routeId: "ID de route",
        displayName: "Nom affiché",
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
        title: "Erreur de validation",
        description: "L'ID de tâche fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à consulter cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "La tâche demandée est introuvable",
      },
      internal: {
        title: "Erreur interne du serveur",
        description:
          "Une erreur est survenue lors de la récupération de la tâche",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation d'accéder à cette tâche",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu",
      },
    },
    success: {
      retrieved: {
        title: "Tâche récupérée",
        description: "Tâche récupérée avec succès",
      },
    },
  },
  put: {
    title: "Modifier une tâche cron",
    titleShort: "Modifier la tâche",
    description: "Modifie une tâche cron existante",
    container: {
      title: "Modifier la tâche cron",
      description: "Modifier les paramètres de la tâche",
    },
    fields: {
      id: {
        label: "ID de la tâche",
        description: "Identifiant unique de la tâche",
      },
      displayName: {
        label: "Nom affiché",
        description: "Libellé lisible de cette tâche",
        placeholder: "Saisir le nom affiché",
      },
      outputMode: {
        label: "Mode de sortie",
        description: "Quand envoyer des notifications après l'exécution",
        placeholder: "Choisir le mode de sortie",
      },
      description: {
        label: "Description",
        description: "Description de la tâche",
        placeholder: "Saisir la description de la tâche",
      },
      schedule: {
        label: "Planification",
        description: "Expression de planification cron",
        placeholder: "*/5 * * * *",
      },
      enabled: {
        label: "Activée",
        description: "Indique si la tâche est activée",
      },
      priority: {
        label: "Priorité",
        description: "Niveau de priorité de la tâche",
        placeholder: "Choisir la priorité",
      },
      category: {
        label: "Catégorie",
        description: "Catégorie de la tâche",
        placeholder: "Choisir la catégorie",
      },
      timeout: {
        label: "Délai max. (ms)",
        description:
          "Durée d'exécution maximale en millisecondes (ex. 300000 = 5 minutes)",
        placeholder: "300000",
      },
      retries: {
        label: "Nouvelles tentatives",
        description: "Nombre de nouvelles tentatives en cas d'échec",
        placeholder: "3",
      },
      retryAttempts: {
        label: "Nouvelles tentatives",
        description: "Nombre de nouvelles tentatives en cas d'échec",
      },
      retryDelay: {
        label: "Délai entre tentatives (ms)",
        description:
          "Délai entre deux tentatives en millisecondes (ex. 5000 = 5 secondes)",
        placeholder: "5000",
      },
      taskInput: {
        label: "Entrée de la tâche",
        description: "Données d'entrée JSON de la tâche",
        invalidJson:
          "JSON invalide. Vérifiez les guillemets, virgules et crochets.",
        notObject:
          'L\'entrée de la tâche doit être un objet JSON, par exemple { "key": "value" }.',
      },
      hidden: {
        label: "Masquée",
        description:
          "Masquer cette tâche des prompts système de l'IA et des listes de tâches par défaut",
      },
      runOnce: {
        label: "Exécution unique",
        description: "Exécuter cette tâche une seule fois, puis la désactiver",
      },
      targetInstance: {
        label: "Instance cible",
        description:
          "ID de l'instance sur laquelle cette tâche doit s'exécuter. Laissez vide pour l'exécuter uniquement sur l'instance hôte.",
        placeholder: "ex. hermes, thea-prod",
      },
      lastExecutionStatus: {
        label: "Statut d'exécution",
        description:
          "Remplace le statut de la dernière exécution. Sert à débloquer une tâche restée en « running ».",
        placeholder: "Choisir le statut",
      },
    },
    response: {
      task: {
        title: "Tâche mise à jour",
        id: "ID de la tâche",
        shortId: "ID court",
        routeId: "ID de route",
        displayName: "Nom affiché",
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
      success: {
        title: "Succès",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à modifier cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "La tâche à modifier est introuvable",
      },
      internal: {
        title: "Erreur interne du serveur",
        description:
          "Une erreur est survenue lors de la mise à jour de la tâche",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de modifier cette tâche",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit est survenu lors de la mise à jour de la tâche",
      },
    },
    submitButton: {
      label: "Enregistrer la tâche",
      loadingText: "Enregistrement...",
    },
    success: {
      updated: {
        title: "Tâche mise à jour",
        description: "Tâche mise à jour avec succès",
      },
    },
  },
  delete: {
    title: "Supprimer une tâche cron",
    titleShort: "Supprimer la tâche",
    description: "Supprime une tâche cron",
    container: {
      title: "Supprimer la tâche cron",
      description: "Retirer une tâche du système",
    },
    fields: {
      id: {
        label: "Clé de la tâche",
        description: "Identifiant unique de la tâche à supprimer",
      },
    },
    response: {
      success: {
        title: "Succès",
      },
      message: {
        title: "Message",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de tâche fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à supprimer cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "La tâche à supprimer est introuvable",
      },
      internal: {
        title: "Erreur interne du serveur",
        description:
          "Une erreur est survenue lors de la suppression de la tâche",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de supprimer cette tâche",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Impossible de supprimer la tâche à cause d'un conflit",
      },
    },
    success: {
      deleted: {
        title: "Tâche supprimée",
        description: "Tâche supprimée avec succès",
      },
    },
  },
  priority: {
    critical: "Critique",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    background: "Cron",
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
  enabledFilter: {
    all: "Toutes",
    enabled: "Activées",
    disabled: "Désactivées",
  },
  hiddenFilter: {
    visible: "Visibles",
    hidden: "Masquées",
    all: "Toutes",
  },
  outputMode: {
    storeOnly: "Enregistrer uniquement",
    notifyOnFailure: "Notifier en cas d'échec",
    notifyAlways: "Toujours notifier",
  },
  widget: {
    notFound: "Tâche introuvable",
    never: "Jamais",
    history: "Historique",
    edit: "Modifier",
    delete: "Supprimer",
    enabled: "Activée",
    disabled: "Désactivée",
    identity: "Identité",
    id: "ID de la tâche",
    routeId: "ID de route",
    displayName: "Nom affiché",
    version: "Version",
    category: "Catégorie",
    priority: "Priorité",
    annualSchedule: "Chaque année le {{date}} à {{time}}",
    schedule: "Planification",
    timezone: "Fuseau horaire",
    createdAt: "Créée",
    updatedAt: "Mise à jour",
    owner: "Propriétaire",
    ownerSystem: "Système",
    ownerUser: "Utilisateur",
    outputMode: "Mode de sortie",
    outputModes: {
      storeOnly: "Enregistrer uniquement",
      notifyOnFailure: "Notifier en cas d'échec",
      notifyAlways: "Toujours notifier",
    },
    stats: {
      totalExecutions: "Exécutions totales",
      successful: "Réussies",
      errors: "Erreurs",
      successRate: "Taux de réussite",
    },
    timingSection: "Durées",
    timing: {
      avgDuration: "Durée moyenne",
      lastDuration: "Dernière durée",
      lastRun: "Dernière exécution",
      nextRun: "Prochaine exécution",
      timeout: "Délai max.",
      retries: "Nouvelles tentatives",
      retryDelay: "Délai entre tentatives",
    },
    lastExecutionError: "Dernière erreur",
    schedulePaused: "Planification en pause",
    runManually: "Exécuter manuellement",
    run: "Exécuter maintenant",
    runSuccess: "Tâche exécutée avec succès",
    running: "Exécution...",
    refreshing: "Actualisation de la tâche…",
    refreshSucceeded: "Tâche actualisée.",
    refreshFailed: "Impossible d’actualiser la tâche. Réessayez.",
    refresh: "Actualiser",
    taskInput: {
      title: "Entrée de la tâche",
      loading: "Chargement de la définition de l'endpoint...",
      notFound: "Définition de l'endpoint introuvable pour cette tâche",
      empty: "Aucun paramètre d'entrée configuré",
      editTitle: "Paramètres d'entrée de la tâche",
      editDescription:
        "Configurer les paramètres d'entrée de l'endpoint de cette tâche",
    },
    scheduleAutocomplete: {
      customBadge: "Personnalisée",
      noSchedulesFound: "Aucune planification trouvée",
      useCustomSchedule: "Utiliser une planification personnalisée",
      commonSchedules: "Planifications courantes",
    },
    schedulePicker: {
      selectPlaceholder: "Choisir une planification...",
      customOption: "Personnalisée...",
      presets: {
        title: "Préréglages rapides",
        everyMinute: "Chaque minute",
        every5m: "Toutes les 5 minutes",
        every15m: "Toutes les 15 minutes",
        every30m: "Toutes les 30 minutes",
        everyHour: "Toutes les heures",
        every2h: "Toutes les 2 heures",
        every4h: "Toutes les 4 heures",
        every6h: "Toutes les 6 heures",
        every12h: "Toutes les 12 heures",
        dailyMidnight: "Tous les jours à minuit",
        daily6am: "Tous les jours à 6 h",
        dailyNoon: "Tous les jours à midi",
        daily6pm: "Tous les jours à 18 h",
        weeklyMon: "Chaque lundi",
        weeklySun: "Chaque dimanche",
        monthlyFirst: "Le 1er de chaque mois",
      },
      custom: {
        title: "Planification personnalisée",
        repeatEvery: "Exécuter toutes les",
        at: "À",
        onDays: "Les",
        preview: "→ {{description}}",
        nextRun: "Prochaine : {{time}}",
        nextRunMultiple: "Prochaine : {{first}}, puis {{second}}",
        unit: {
          minutes: "minutes",
          hours: "heures",
          days: "jours",
          weeks: "semaines",
          months: "mois",
        },
        days: {
          mon: "Lun",
          tue: "Mar",
          wed: "Mer",
          thu: "Jeu",
          fri: "Ven",
          sat: "Sam",
          sun: "Dim",
        },
        advanced: "Expression avancée",
        advancedPlaceholder: "ex. 0 9 * * 1-5",
        advancedInvalid: "Expression cron invalide",
      },
    },
  },
};
