import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des tâches",
  tags: {
    tasks: "Tâches",
  },
  type: {
    cron: "Tâche cron",
    side: "Tâche annexe",
    task_runner: "Exécuteur de tâches",
  },
  priority: {
    critical: "Critique",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    background: "Arrière-plan",
    filter: {
      all: "Toutes les priorités",
      highAndAbove: "Haute et plus",
      mediumAndAbove: "Moyenne et plus",
    },
  },
  status: {
    pending: "En attente",
    running: "En cours",
    completed: "Terminée",
    failed: "En échec",
    timeout: "Délai dépassé",
    cancelled: "Annulée",
    skipped: "Ignorée",
    blocked: "Bloquée",
    scheduled: "Planifiée",
    stopped: "Arrêtée",
    error: "Erreur",
    filter: {
      all: "Tous les statuts",
      active: "Actives",
      error: "États d'erreur",
    },
  },
  taskCategory: {
    development: "Développement",
    build: "Build",
    watch: "Surveillance de fichiers",
    generator: "Générateur",
    test: "Test",
    maintenance: "Maintenance",
    database: "Base de données",
    system: "Système",
    monitoring: "Surveillance",
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
  sort: {
    asc: "Croissant",
    desc: "Décroissant",
  },
  pulse: {
    health: {
      healthy: "Sain",
      warning: "Avertissement",
      critical: "Critique",
      unknown: "Inconnu",
    },
    execution: {
      success: "Succès",
      failure: "Échec",
      timeout: "Délai dépassé",
      cancelled: "Annulé",
      pending: "En attente",
    },
  },
  cron: {
    frequency: {
      everyMinute: "chaque minute",
      everyHour: "chaque heure",
      everyDays: "chaque jour",
      hourly: "toutes les heures",
    },
    days: {
      sunday: "Dimanche",
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
    },
    common: {
      dailyAtMidnight: "tous les jours à minuit",
      dailyAtNoon: "tous les jours à midi",
      weeklyOnSunday: "chaque dimanche",
      monthlyOnFirst: "le 1er de chaque mois",
      everyFiveMinutes: "toutes les 5 minutes",
      everyThreeMinutes: "toutes les 3 minutes",
      everyOneMinutes: "chaque minute",
      everyTenMinutes: "toutes les 10 minutes",
      everyFifteenMinutes: "toutes les 15 minutes",
      everyThirtyMinutes: "toutes les 30 minutes",
    },
    patterns: {
      everyIntervalMinutes: "toutes les {{interval}} minutes",
      everyIntervalMinutesStarting:
        "toutes les {{interval}} minutes à partir de la minute {{start}}",
      atMinutes: "aux minutes {{minutes}}",
      fromMinuteToMinute: "de la minute {{from}} à {{to}}",
      atMinute: "à la minute {{minute}}",
      everyIntervalHours: "toutes les {{interval}} heures",
      everyIntervalHoursStarting:
        "toutes les {{interval}} heures à partir de {{start}} h",
      atHours: "à {{hours}} h",
      fromHourToHour: "de {{from}} h à {{to}} h",
      atHour: "à {{hour}} h",
    },
    calendar: {
      onDays: "les jours {{days}}",
      onDay: "le jour {{day}}",
      inMonths: "en {{months}}",
      inMonth: "en {{month}}",
      onWeekdays: "le {{days}}",
      fromWeekdayToWeekday: "du {{start}} au {{end}}",
      onWeekday: "le {{day}}",
    },
    timezone: "fuseau {{timezone}}",
    time: {
      midnight: "minuit",
      noon: "midi",
      hourAm: "{{hour}} h du matin",
      hourPm: "{{hour}} h de l'après-midi",
      hourMinuteAm: "{{hour}} h {{minute}} du matin",
      hourMinutePm: "{{hour}} h {{minute}} de l'après-midi",
    },
    weekdays: {
      sunday: "dimanche",
      monday: "lundi",
      tuesday: "mardi",
      wednesday: "mercredi",
      thursday: "jeudi",
      friday: "vendredi",
      saturday: "samedi",
    },
    months: {
      january: "janvier",
      february: "février",
      march: "mars",
      april: "avril",
      may: "mai",
      june: "juin",
      july: "juillet",
      august: "août",
      september: "septembre",
      october: "octobre",
      november: "novembre",
      december: "décembre",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Impossible de récupérer les tâches cron : {{error}}",
    createCronTask: "Impossible de créer la tâche cron",
    updateCronTask: "Impossible de mettre à jour la tâche cron",
    deleteCronTask: "Impossible de supprimer la tâche cron",
    fetchCronTaskHistory:
      "Impossible de récupérer l'historique des tâches cron",
    fetchCronTaskStats:
      "Impossible de récupérer les statistiques des tâches cron",
    fetchCronStatus: "Impossible de récupérer le statut du système cron",
    cronTaskNotFound: "Tâche cron introuvable",

    // Unified Runner errors
    startTaskRunner: "Impossible de démarrer l'exécuteur de tâches : {{error}}",
    stopTaskRunner: "Impossible d'arrêter l'exécuteur de tâches",
    getTaskRunnerStatus:
      "Impossible d'obtenir le statut de l'exécuteur de tâches : action inconnue \"{{action}}\"",
    executeCronTask: "Impossible d'exécuter la tâche cron",

    // Pulse errors
    executePulse: "Échec de l'exécution du pulse",
    fetchPulseStatus: "Impossible de récupérer le statut du pulse",
    pulseExecutionFailed: "Échec de l'exécution du pulse",
    pulseInternalError: "Erreur interne du système pulse",

    // Validation errors
    invalidTaskInput:
      "L'entrée de la tâche ne correspond pas au schéma de requête de l'endpoint",
    endpointNotFound: "Aucun endpoint trouvé pour cet ID de route",

    // Repository errors
    repositoryNotFound: "Ressource introuvable",
    repositoryNotFoundDetail: "Aucune tâche trouvée pour l'ID {{taskId}}",
    repositoryInternalError: "Une erreur interne s'est produite",
    repositoryInternalErrorDetail:
      "Une erreur interne s'est produite : {{error}}",
    repositoryGetTaskForbidden:
      "Vous n'avez pas l'autorisation de consulter la tâche {{taskId}}",
    repositoryUpdateTaskForbidden:
      "Vous n'avez pas l'autorisation de modifier cette tâche",
    repositoryUpdateTaskForbiddenDetail:
      "Vous n'avez pas l'autorisation de modifier la tâche {{taskId}}",
    repositoryDeleteTaskForbidden:
      "Vous n'avez pas l'autorisation de supprimer la tâche {{taskId}}",
  },
  common: {
    cronRepositoryTaskUpdateFailed:
      "Impossible de mettre à jour la tâche cron {{taskId}} : {{error}}",
    cronRepositoryTaskDeleteFailed:
      "Impossible de supprimer la tâche cron {{taskId}} : {{error}}",
    cronRepositoryExecutionCreateFailed:
      "Impossible de créer l'exécution de la tâche cron {{taskId}} : {{error}}",
    cronRepositoryExecutionUpdateFailed:
      "Impossible de mettre à jour l'exécution de la tâche cron",
    cronRepositoryExecutionsFetchFailed:
      "Impossible de récupérer les exécutions de la tâche cron",
    cronRepositoryRecentExecutionsFetchFailed:
      "Impossible de récupérer les exécutions récentes des tâches cron",
    cronRepositorySchedulesFetchFailed:
      "Impossible de récupérer les planifications des tâches cron",
    cronRepositoryScheduleUpdateFailed:
      "Impossible de mettre à jour la planification de la tâche cron",
    cronRepositoryStatisticsFetchFailed:
      "Impossible de récupérer les statistiques des tâches cron",
  },
  outputMode: {
    storeOnly: "Stocker uniquement",
    notifyOnFailure: "Notifier en cas d'échec",
    notifyAlways: "Toujours notifier",
  },
  dbHealthCheck: {
    name: "Vérification de l’état de la base de données",
    description:
      "Vérifie l'état de la connexion à la base de données chaque minute",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "Appelle le dépôt pulse une fois par minute pour déclencher les tâches planifiées",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description:
      "Surveille les modifications de fichiers et déclenche les générateurs en mode développement",
  },
  dbHealth: {
    tag: "Base de données",
    post: {
      title: "Contrôle de santé du système",
      titleShort: "Santé BDD",
      description:
        "Vérifier la santé de la base de données, de la mémoire et du disque",
      container: {
        title: "Santé du système",
        description:
          "Connectivité de la base, utilisation de la mémoire et du disque",
      },
      response: {
        healthy: "Sain",
        status: "Statut",
        dbResponseMs: "Réponse BDD (ms)",
        memoryUsedPct: "Mémoire utilisée (%)",
        heapUsedMb: "Heap utilisé (Mo)",
        rssMb: "RSS (Mo)",
        diskUsedPct: "Disque utilisé (%)",
        uptimeHours: "Disponibilité (heures)",
        warnings: "Avertissements",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès interdit",
          description: "Accès refusé",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec du contrôle de santé de la base de données",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        systemAlert: "Système {{status}} : {{warnings}}",
      },
      success: {
        title: "BDD saine",
        description: "La connexion à la base de données est saine",
      },
    },
  },
  completeTask: {
    post: {
      title: "Terminer une tâche",
      titleShort: "Terminer la tâche",
      description:
        "Marquer une tâche d'arrière-plan comme terminée. Appelé par l'agent de code quand le travail asynchrone est fini. Le framework relance le flux IA en attente avec le résultat.",
      fields: {
        taskId: {
          title: "ID de la tâche",
          description:
            "L'ID en base de la tâche cron à marquer comme terminée.",
        },
        status: {
          title: "Statut",
          description:
            "Statut final : 'completed' en cas de succès, 'failed' en cas d'échec, 'cancelled' pour annuler.",
        },
        summary: {
          title: "Résumé",
          description:
            "Brève description de ce qui a été accompli ou de la cause de l'échec.",
        },
        output: {
          title: "Données de sortie",
          description:
            "Données structurées facultatives (paires clé-valeur) à joindre au résultat de l'exécution.",
        },
        completed: {
          title: "Terminée",
          description: "Indique si la tâche a bien été marquée comme terminée.",
        },
        updatedAt: {
          title: "Mis à jour le",
          description: "Horodatage de la mise à jour du statut de la tâche.",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de tâche ou valeur de statut invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        internal: {
          title: "Échec de la clôture",
          description: "Impossible de marquer la tâche comme terminée",
        },
        forbidden: {
          title: "Accès interdit",
          description: "Accès refusé",
        },
        notFound: {
          title: "Tâche introuvable",
          description: "Aucune tâche trouvée avec cet ID",
        },
        network: {
          title: "Erreur réseau",
          description:
            "Impossible de transmettre la clôture à l'instance distante",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Modifications non enregistrées détectées",
        },
        conflict: {
          title: "Conflit",
          description:
            "La tâche n'est pas dans un état permettant de la terminer",
        },
      },
      success: {
        title: "Tâche terminée",
        description:
          "Tâche marquée comme terminée et flux IA relancé avec le résultat",
      },
    },
  },
  waitForTask: {
    post: {
      title: "Attendre une tâche",
      titleShort: "Attendre la tâche",
      description:
        "Attendre une tâche d'arrière-plan en cours. Renvoie immédiatement le résultat si elle est déjà terminée, sinon met le flux IA en pause jusqu'à la fin de la tâche (mécanisme wakeUp).",
      fields: {
        taskId: {
          title: "ID de la tâche",
          description: "L'ID de la tâche à attendre.",
        },
        status: {
          title: "Statut",
          description: "Statut actuel de la tâche.",
        },
        result: {
          title: "Résultat",
          description:
            "Données de résultat de la tâche (présentes une fois terminée).",
        },
        waiting: {
          title: "En attente",
          description:
            "Vrai quand le flux est en pause en attendant la fin de la tâche.",
        },
        originalToolName: {
          title: "Outil",
          description: "L'outil d'origine qui a été exécuté.",
        },
        originalArgs: {
          title: "Arguments",
          description: "Les arguments d'entrée de l'outil d'origine.",
        },
      },
      widget: {
        noToolName: "Aucun nom d'outil disponible.",
        resolving: "Résolution de l'outil...",
        unknownTool: "Outil inconnu : {{toolName}}",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "taskId invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        internal: {
          title: "Erreur interne",
          description: "Impossible d'enregistrer l'attente sur la tâche",
        },
        forbidden: {
          title: "Accès interdit",
          description: "Accès refusé",
        },
        notFound: {
          title: "Tâche introuvable",
          description: "Aucune tâche trouvée avec cet ID",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Modifications non enregistrées détectées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit s'est produit",
        },
      },
      success: {
        title: "Résultat de la tâche prêt",
        description: "Tâche terminée ou attente enregistrée",
      },
      status: {
        waiting: "En attente de la tâche...",
        complete: "Tâche terminée",
      },
    },
  },
  errorMonitor: {
    name: "error-monitor",
    description:
      "Analyse les fils de discussion à la recherche de motifs d'erreur toutes les 3 heures",
    tag: "Surveillance",
    post: {
      title: "Moniteur d'erreurs",
      description:
        "Surveillance des erreurs respectueuse de la vie privée : repère les motifs d'erreur dans les messages sans en lire le contenu",
      container: {
        title: "Résultats de l'analyse des erreurs",
        description: "Motifs d'erreur agrégés issus des messages de chat",
      },
      response: {
        errorsFound: "Erreurs trouvées",
        threadsScanned: "Fils analysés",
        scanWindowFrom: "Début de la fenêtre d'analyse",
        scanWindowTo: "Fin de la fenêtre d'analyse",
        patternType: "Type d'erreur",
        patternCount: "Nombre",
        patternThreadIds: "IDs des fils",
        patternModel: "Modèle",
        patternTool: "Outil",
        patternFirstSeen: "Première occurrence",
        patternLastSeen: "Dernière occurrence",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès interdit",
          description: "Accès refusé",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de l'analyse des erreurs",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
      },
      success: {
        title: "Analyse terminée",
        description: "Analyse des erreurs terminée avec succès",
      },
    },
    cleanup: {
      name: "Nettoyage du journal d’erreurs",
      description:
        "Supprime les journaux d'erreurs de plus de 6 mois et plafonne le total à 100 000 lignes",
      post: {
        title: "Nettoyage des journaux d'erreurs",
        titleShort: "Nettoyage des journaux",
        description:
          "Supprimer les anciennes entrées du journal d'erreurs (selon l'âge et le nombre) pour garder la base légère",
        container: {
          title: "Résultats du nettoyage",
          description: "Nombre de journaux d'erreurs supprimés",
        },
        response: {
          deletedCount: "Nombre supprimé",
          deletedByTime: "Supprimés par ancienneté",
          deletedByCount: "Supprimés par plafond de lignes",
          retentionDays: "Jours de rétention",
          maxRows: "Lignes max",
        },
        success: {
          title: "Nettoyage terminé",
          description: "Anciens journaux d'erreurs supprimés avec succès",
        },
      },
    },
  },
  csvProcessor: {
    description: "Traite les imports CSV par lots",
  },
  imapSync: {
    description:
      "Synchronise automatiquement les comptes, dossiers et messages IMAP",
  },
  newsletterUnsubscribeSync: {
    description:
      "Synchronise les statuts des leads après les désinscriptions de la newsletter",
  },
  cronSystem: {
    history: {
      category: "Gestion des tâches",

      errors: {
        cronTaskNotFound: "Tâche cron introuvable",
        repositoryInternalError: "Une erreur interne s'est produite",
        fetchCronTaskHistory:
          "Impossible de récupérer l'historique des tâches cron",
      },

      get: {
        tags: {
          tasks: "Tâches",
          monitoring: "Surveillance",
        },
        title: "Historique d'exécution des tâches",
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
            placeholder: "Choisir des statuts",
            options: {
              PENDING: "En attente",
              SCHEDULED: "Planifiée",
              RUNNING: "En cours",
              COMPLETED: "Terminée",
              FAILED: "En échec",
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
            placeholder: "Choisir des priorités",
            options: {
              LOW: "Basse",
              MEDIUM: "Moyenne",
              HIGH: "Haute",
              CRITICAL: "Critique",
            },
          },
          startDate: {
            label: "Date de début",
            description: "Afficher les exécutions après cette date",
          },
          endDate: {
            label: "Date de fin",
            description: "Afficher les exécutions avant cette date",
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
          title: "Réponse de l'historique des tâches",
          description: "Données d'exécution passées des tâches cron",
          executions: {
            title: "Enregistrements d'exécution",
          },
          totalCount: {
            title: "Nombre total",
          },
          hasMore: {
            title: "Autres résultats disponibles",
          },
          statusCounts: {
            title: "Répartition par statut",
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
            description: "Tâche ou enregistrement d'exécution introuvable",
          },
          network: {
            title: "Erreur réseau",
            description:
              "Une erreur réseau s'est produite lors de la récupération de l'historique des tâches",
          },
          forbidden: {
            title: "Accès interdit",
            description: "L'accès à l'historique des tâches est interdit",
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
            titleChanges: "Modifications non enregistrées",
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données s'est produit",
          },
        },
        success: {
          title: "Historique récupéré",
          description: "Historique d'exécution des tâches récupéré avec succès",
        },
        log: {
          fetchSuccess: "{{count}} enregistrements d'exécution récupérés",
          fetchError:
            "Impossible de récupérer l'historique d'exécution des tâches",
        },
        request: {
          title: "Paramètres de requête",
          description: "Filtrer l'historique d'exécution des tâches",
        },
        unknownTask: "Tâche inconnue",
      },
      widget: {
        title: "Historique d'exécution des tâches",
        loading: "Chargement de l'historique...",
        header: {
          tasks: "Tâches",
          stats: "Statistiques",
          pulse: "Pulse",
          refresh: "Actualiser",
        },
        summary: {
          total: "Total",
          successful: "Réussies",
          failed: "En échec",
          successRate: "Taux de réussite",
          avgDuration: "Durée moyenne",
        },
        search: {
          placeholder: "Rechercher des tâches...",
        },
        filter: {
          all: "Toutes",
          running: "En cours",
          completed: "Terminées",
          failed: "En échec",
          timeout: "Délai dépassé",
          cancelled: "Annulées",
        },
        col: {
          taskName: "Nom de la tâche",
          status: "Statut",
          duration: "Durée",
          started: "Démarrée",
          completed: "Terminée",
          environment: "Environnement",
          error: "Erreur",
        },
        empty: "Aucun historique d'exécution",
        result: "Résultat",
        error: {
          collapse: "Replier l'erreur",
          label: "Erreur",
        },
        pagination: {
          info: "Page {{page}} sur {{totalPages}} ({{total}} au total)",
          prev: "Précédent",
          next: "Suivant",
        },
      },
    },
    stats: {
      category: "Gestion des tâches",

      errors: {
        fetchCronTaskStats:
          "Impossible de récupérer les statistiques des tâches cron",
      },

      get: {
        title: "Statistiques des tâches cron",
        description:
          "Obtenir des statistiques et métriques complètes sur les tâches cron",
        tag: "Statistiques cron",
        form: {
          title: "Requête de statistiques cron",
          description:
            "Configurer les paramètres de récupération des statistiques des tâches cron",
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
          totalTasks: { title: "Tâches au total" },
          executedTasks: { title: "Tâches exécutées" },
          successfulTasks: { title: "Tâches réussies" },
          failedTasks: { title: "Tâches en échec" },
          averageExecutionTime: { title: "Durée d'exécution moyenne (ms)" },
          totalExecutions: { title: "Exécutions totales" },
          executionsLast24h: { title: "Exécutions sur 24 h" },
          successRate: { title: "Taux de réussite (%)" },
          successfulExecutions: { title: "Exécutions réussies" },
          failedExecutions: { title: "Exécutions en échec" },
          failureRate: { title: "Taux d'échec (%)" },
          avgExecutionTime: { title: "Durée d'exécution moyenne (ms)" },
          minExecutionTime: { title: "Durée d'exécution min (ms)" },
          maxExecutionTime: { title: "Durée d'exécution max (ms)" },
          medianExecutionTime: { title: "Durée d'exécution médiane (ms)" },
          pendingExecutions: { title: "Exécutions en attente" },
          runningExecutions: { title: "Exécutions en cours" },
          activeTasks: { title: "Tâches actives" },
          systemStatus: { title: "Statut du système" },
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
              "Une erreur interne du serveur s'est produite lors de la récupération des statistiques",
          },
          validation: {
            title: "Erreur de validation",
            description: "Les paramètres fournis sont invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description:
              "Authentification requise pour accéder aux statistiques",
          },
          forbidden: {
            title: "Accès interdit",
            description:
              "Autorisations insuffisantes pour accéder aux statistiques",
          },
          notFound: {
            title: "Introuvable",
            description: "Les statistiques demandées sont introuvables",
          },
          conflict: {
            title: "Conflit",
            description:
              "Un conflit s'est produit lors du traitement de la requête",
          },
          network: {
            title: "Erreur réseau",
            description:
              "Une erreur réseau s'est produite lors de la récupération des statistiques",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description:
              "Des modifications non enregistrées doivent être traitées",
          },
        },
        success: {
          title: "Statistiques récupérées",
          description: "Statistiques des tâches cron récupérées avec succès",
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
        totalTasks: "Tâches au total",
        executedTasks: "Tâches exécutées",
        successfulTasks: "Réussies",
        failedTasks: "En échec",
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
    },
    task: {
      category: "Système",
      tags: {
        cron: "Cron",
        scheduling: "Planification",
      },
      get: {
        title: "Obtenir une tâche cron",
        description: "Récupérer une tâche cron par son ID",
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
              "Une erreur s'est produite lors de la récupération de la tâche",
          },
          forbidden: {
            title: "Accès interdit",
            description:
              "Vous n'avez pas l'autorisation d'accéder à cette tâche",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit s'est produit",
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
        description: "Modifier une tâche cron existante",
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
            label: "Délai max (ms)",
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
            label: "Tentatives",
            description: "Nombre de nouvelles tentatives en cas d'échec",
          },
          retryDelay: {
            label: "Délai entre tentatives (ms)",
            description:
              "Délai entre les tentatives en millisecondes (ex. 5000 = 5 secondes)",
            placeholder: "5000",
          },
          taskInput: {
            label: "Entrée de la tâche",
            description: "Données d'entrée JSON de la tâche",
          },
          hidden: {
            label: "Masquée",
            description:
              "Masquer cette tâche des prompts système de l'IA et des listes de tâches par défaut",
          },
          runOnce: {
            label: "Exécuter une fois",
            description:
              "Exécuter cette tâche une seule fois puis la désactiver",
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
              "Remplacer le dernier statut d'exécution. Sert à débloquer une tâche coincée en 'running'.",
            placeholder: "Choisir le statut",
          },
        },
        response: {
          task: {
            title: "Tâche mise à jour",
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
              "Une erreur s'est produite lors de la mise à jour de la tâche",
          },
          forbidden: {
            title: "Accès interdit",
            description:
              "Vous n'avez pas l'autorisation de modifier cette tâche",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description:
              "Un conflit s'est produit lors de la mise à jour de la tâche",
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
        description: "Supprimer une tâche cron",
        container: {
          title: "Supprimer la tâche cron",
          description: "Retirer une tâche du système",
        },
        fields: {
          id: {
            label: "ID de la tâche",
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
              "Une erreur s'est produite lors de la suppression de la tâche",
          },
          forbidden: {
            title: "Accès interdit",
            description:
              "Vous n'avez pas l'autorisation de supprimer cette tâche",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description:
              "Impossible de supprimer la tâche à cause d'un conflit",
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
        failed: "En échec",
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
        watch: "Surveillance de fichiers",
        generator: "Générateur",
        test: "Test",
        maintenance: "Maintenance",
        database: "Base de données",
        system: "Système",
        monitoring: "Surveillance",
      },
      outputMode: {
        storeOnly: "Stocker uniquement",
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
        schedule: "Planification",
        timezone: "Fuseau horaire",
        createdAt: "Créée le",
        updatedAt: "Modifiée le",
        owner: "Propriétaire",
        ownerSystem: "Système",
        ownerUser: "Utilisateur",
        outputMode: "Mode de sortie",
        outputModes: {
          storeOnly: "Stocker uniquement",
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
          timeout: "Délai max",
          retries: "Nouvelles tentatives",
          retryDelay: "Délai entre tentatives",
        },
        lastExecutionError: "Dernière erreur",
        run: "Exécuter maintenant",
        runSuccess: "Tâche exécutée avec succès",
        running: "Exécution...",
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
            everyHour: "Chaque heure",
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
            onDays: "Le",
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
    },
    tasks: {
      category: "Endpoint d'API",
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
          updatedAt: "Modifiée le",
        },
      },
      get: {
        title: "Lister les tâches cron",
        description:
          "Récupérer la liste des tâches cron, avec filtres facultatifs",
        container: {
          title: "Liste des tâches cron",
          description: "Filtrer et consulter les tâches cron",
        },
        fields: {
          status: {
            label: "Statut",
            description: "Filtrer par statut de tâche",
            placeholder: "Choisir le statut...",
          },
          priority: {
            label: "Priorité",
            description: "Filtrer par priorité de tâche",
            placeholder: "Choisir la priorité...",
          },
          category: {
            label: "Catégorie",
            description: "Filtrer par catégorie de tâche",
            placeholder: "Choisir la catégorie...",
          },
          enabled: {
            label: "Statut",
            description: "Filtrer selon l'activation",
            placeholder: "Toutes les tâches",
          },
          hidden: {
            label: "Visibilité",
            description:
              "Filtrer selon la visibilité (par défaut : visibles uniquement)",
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
            name: "Nom de la tâche",
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
            timeout: "Délai max (ms)",
            retries: "Nouvelles tentatives",
            retryDelay: "Délai entre tentatives (ms)",
            lastExecutedAt: "Dernière exécution le",
            lastExecutionStatus: "Statut de la dernière exécution",
            lastExecutionError: "Erreur de la dernière exécution",
            lastExecutionDuration: "Durée de la dernière exécution (ms)",
            nextExecutionAt: "Prochaine exécution le",
            executionCount: "Nombre d'exécutions",
            successCount: "Nombre de réussites",
            errorCount: "Nombre d'erreurs",
            averageExecutionTime: "Durée d'exécution moyenne (ms)",
            createdAt: "Créée le",
            updatedAt: "Modifiée le",
          },
          totalTasks: "Tâches au total",
        },
        errors: {
          internal: {
            title:
              "Erreur interne du serveur lors de la récupération des tâches",
            description:
              "Une erreur inattendue s'est produite lors de la récupération de la liste des tâches",
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
              "Une erreur réseau s'est produite lors de la récupération des tâches",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description:
              "Des modifications non enregistrées doivent être traitées",
          },
          conflict: {
            title: "Erreur de conflit",
            description:
              "Un conflit s'est produit lors du traitement de la requête",
          },
        },
        success: {
          retrieved: {
            title: "Tâches récupérées avec succès",
            description: "La liste des tâches a été récupérée avec succès",
          },
        },
      },
      post: {
        title: "Créer une tâche cron",
        description: "Créer une nouvelle tâche cron",
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
            label: "Délai max (ms)",
            description: "Durée d'exécution maximale en millisecondes",
          },
          retries: {
            label: "Nouvelles tentatives",
            description: "Nombre de nouvelles tentatives",
          },
          retryDelay: {
            label: "Délai entre tentatives (ms)",
            description: "Délai entre les tentatives en millisecondes",
          },
          taskInput: {
            label: "Entrée de la tâche",
            description: "Données d'entrée JSON de la tâche",
          },
          runOnce: {
            label: "Exécuter une fois",
            description:
              "Exécuter cette tâche une seule fois puis la désactiver",
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
          },
        },
        errors: {
          validation: {
            title: "Échec de la validation",
            description: "Les données de tâche fournies sont invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Vous n'avez pas l'autorisation de créer des tâches",
          },
          internal: {
            title: "Erreur interne",
            description:
              "Une erreur s'est produite lors de la création de la tâche",
          },
          forbidden: {
            title: "Accès interdit",
            description: "L'accès à cette ressource est interdit",
          },
          conflict: {
            title: "Conflit",
            description: "Une tâche portant ce nom existe déjà",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
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
            description: "La tâche a été créée avec succès",
          },
        },
      },
      widget: {
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
          failed: "En échec",
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
            storeOnly: "Stocker uniquement",
            notifyOnFailure: "Notifier en cas d'échec",
            notifyAlways: "Toujours notifier",
          },
        },
        action: {
          view: "Voir les détails",
          history: "Voir l'historique",
          edit: "Modifier la tâche",
          delete: "Supprimer la tâche",
          runNow: "Exécuter maintenant",
        },
        bulk: {
          selected: "{count} sélectionnée(s)",
          selectAll: "Tout sélectionner",
          clearSelection: "Effacer la sélection",
          enable: "Activer",
          disable: "Désactiver",
          runNow: "Exécuter maintenant",
          delete: "Supprimer",
          confirmDeleteTitle: "Supprimer les tâches ?",
          confirmDelete:
            "Supprimer {count} tâche(s) ? Cette action est irréversible.",
          cancel: "Annuler",
          success: "{succeeded} réussie(s), {failed} en échec",
        },
        empty: {
          noTasks: "Aucune tâche cron",
          noTasksDesc: "Créez votre première tâche cron pour commencer",
          noMatches: "Aucune tâche ne correspond à vos filtres",
          noMatchesDesc: "Modifiez votre recherche ou vos filtres",
          clearFilters: "Effacer les filtres",
        },
      },
    },
    errors: {
      fetch_all_failed: "Impossible de récupérer les tâches cron",
      fetch_by_id_failed: "Impossible de récupérer la tâche cron par ID",
      fetch_by_name_failed: "Impossible de récupérer la tâche cron par nom",
      create_failed: "Impossible de créer la tâche cron",
      update_failed: "Impossible de mettre à jour la tâche cron",
      delete_failed: "Impossible de supprimer la tâche cron",
      not_found: "Tâche cron introuvable",
      execution_create_failed:
        "Impossible de créer l'exécution de la tâche cron",
      execution_update_failed:
        "Impossible de mettre à jour l'exécution de la tâche cron",
      execution_not_found: "Exécution de la tâche cron introuvable",
      executions_fetch_failed:
        "Impossible de récupérer les exécutions de la tâche cron",
      recent_executions_fetch_failed:
        "Impossible de récupérer les exécutions cron récentes",
      schedules_fetch_failed:
        "Impossible de récupérer les planifications des tâches cron",
      schedule_update_failed:
        "Impossible de mettre à jour la planification de la tâche cron",
      schedule_not_found: "Planification de la tâche cron introuvable",
      statistics_fetch_failed:
        "Impossible de récupérer les statistiques des tâches cron",
    },
  },
  pulseSystem: {
    execute: {
      category: "Exécution du pulse",
      tags: {
        execute: "Exécuter",
      },
      post: {
        title: "Exécuter le pulse",
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
            label: "Noms des tâches",
            description: "Noms des tâches précises à exécuter (facultatif)",
          },
          force: {
            label: "Forcer l'exécution",
            description:
              "Forcer l'exécution même si les tâches ne sont pas dues",
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
    },
    status: {
      category: "Statut du pulse",
      tags: {
        status: "Statut",
      },
      get: {
        title: "Statut du pulse",
        description: "Obtenir l'état de santé du pulse",
        container: {
          title: "Santé du pulse",
          description:
            "Surveiller la santé et les statistiques d'exécution du pulse",
        },
        fields: {
          status: {
            title: "Statut",
            label: "Statut du pulse",
            description: "État de santé actuel du pulse",
          },
          lastPulseAt: {
            title: "Dernier pulse le",
            label: "Dernier pulse",
            description: "Horodatage de la dernière exécution du pulse",
          },
          successRate: {
            title: "Taux de réussite",
            label: "Taux de réussite",
            description: "Pourcentage d'exécutions du pulse réussies",
          },
          totalExecutions: {
            title: "Exécutions totales",
            label: "Exécutions totales",
            description: "Nombre total d'exécutions du pulse",
          },
        },
        examples: {
          basic: {
            title: "Requête de statut simple",
          },
          success: {
            title: "Réponse de statut réussie",
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
    },
    history: {
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
    },
    success: {
      title: "Succès",
      description: "Pulse exécuté avec succès",
      content: "Succès",
    },
    container: {
      title: "Conteneur du pulse",
      description: "Description du conteneur du pulse",
    },
  },
  unifiedRunner: {
    category: "Gestion des tâches",

    description: "Exécute les tâches d'arrière-plan et gère les tâches annexes",
    common: {
      taskName: "Nom de la tâche",
      taskNamesDescription: "Noms des tâches à filtrer",
      detailed: "Détaillé",
      detailedDescription: "Inclure les informations détaillées",
      active: "Actif",
      total: "Total",
      uptime: "Disponibilité",
      id: "ID",
      status: "Statut",
      lastRun: "Dernière exécution",
      nextRun: "Prochaine exécution",
      schedule: "Planification",
    },
    post: {
      title: "Exécuteur de tâches unifié",
      description:
        "Gérer l'exécuteur de tâches unifié pour les tâches d'arrière-plan et les tâches annexes",
      container: {
        title: "Gestion de l'exécuteur de tâches unifié",
        description:
          "Piloter l'exécuteur de tâches unifié qui gère les tâches d'arrière-plan et les tâches annexes",
      },
      fields: {
        action: {
          label: "Action",
          description: "Action à effectuer sur l'exécuteur de tâches",
          options: {
            start: "Démarrer l'exécuteur",
            stop: "Arrêter l'exécuteur",
            status: "Obtenir le statut",
            restart: "Redémarrer l'exécuteur",
          },
        },
        taskFilter: {
          label: "Filtre de tâches",
          description: "Filtrer les tâches par type",
          options: {
            all: "Toutes les tâches",
            cron: "Tâches cron uniquement",
            side: "Tâches annexes uniquement",
          },
        },
        dryRun: {
          label: "Simulation",
          description: "Simuler l'exécution sans appliquer de modifications",
        },
      },
      response: {
        success: "Opération réussie",
        actionResult: "Résultat de l'action",
        message: "Message de réponse",
        timestamp: "Horodatage",
      },
      reasons: {
        previousInstanceRunning: "L'instance précédente est toujours en cours",
      },
      messages: {
        taskSkipped: "La tâche a été ignorée",
        taskCompleted: "Tâche terminée avec succès",
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
        execution: {
          title: "Erreur d'exécution de la tâche",
          description: "Impossible d'exécuter la tâche",
        },
        taskAlreadyRunning: {
          title: "Tâche déjà en cours",
          description: "La tâche indiquée est déjà en cours d'exécution",
        },
        sideTaskExecution: {
          title: "Erreur d'exécution de la tâche annexe",
          description: "Impossible d'exécuter la tâche annexe",
        },
      },
      success: {
        title: "Succès",
        description: "Opération terminée avec succès",
      },
    },
  },
};
