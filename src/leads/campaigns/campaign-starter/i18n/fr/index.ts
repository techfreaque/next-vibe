import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des campagnes",
  tag: "Lanceur de campagnes",
  task: {
    description:
      "Démarre les campagnes des nouveaux leads en les passant au statut PENDING",
  },
  errors: {
    server: {
      title: "Erreur serveur",
      description:
        "Une erreur s'est produite lors du traitement de la requête du lanceur de campagnes",
    },
    invalidTransition:
      "Changement de statut invalide pour le démarrage de la campagne",
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    forbidden: {
      title: "Interdit",
      description: "Accès interdit",
    },
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de requête invalides",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau s'est produite",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit de données s'est produit",
    },
  },
  post: {
    title: "Lanceur de campagnes",
    titleShort: "Lancer la campagne",
    description: "Démarrer les campagnes des nouveaux leads",
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: { title: "Interdit", description: "Accès interdit" },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors du démarrage des campagnes",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      notFound: { title: "Introuvable", description: "Ressource introuvable" },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    fields: {
      timezone: {
        label: "Fuseau horaire",
        description:
          "Fuseau horaire du navigateur pour la conversion des heures",
      },
      dryRun: {
        label: "Simulation",
        description: "Exécuter sans rien modifier",
      },
      force: {
        label: "Forcer",
        description: "Ignorer les restrictions de jours et d'heures",
      },
    },
    response: {
      leadsProcessed: "Leads traités",
      leadsStarted: "Leads démarrés",
      leadsSkipped: "Leads ignorés",
      executionTimeMs: "Durée d'exécution (ms)",
      errors: "Erreurs",
      quotaDetails: "Détails des quotas",
    },
    success: {
      title: "Lanceur de campagnes terminé",
      description: "Le lanceur de campagnes s'est exécuté",
    },
  },
  get: {
    title: "Configuration du lanceur de campagnes",
    titleShort: "Config. campagnes",
    description: "Récupérer la configuration du lanceur de campagnes",
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: { title: "Interdit", description: "Accès interdit" },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
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
      notFound: { title: "Introuvable", description: "Ressource introuvable" },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    fields: {
      timezone: {
        label: "Fuseau horaire",
        description:
          "Fuseau horaire du navigateur pour la conversion des heures",
      },
    },
    response: {
      dryRun: "Mode simulation",
      minAgeHours: "Ancienneté minimale (heures)",
      enabledDays: "Jours actifs",
      enabledHours: "Heures actives",
      localeConfig: "Configuration par langue",
      leadsPerWeek: "Leads par semaine",
      schedule: "Planification",
      enabled: "Activé",
      priority: "Priorité",
      timeout: "Délai d'expiration",
      retries: "Nouvelles tentatives",
      retryDelay: "Délai entre tentatives",
    },
    success: {
      title: "Configuration récupérée",
      description: "Configuration du lanceur de campagnes récupérée",
    },
  },
  put: {
    title: "Configuration du lanceur de campagnes",
    description: "Modifier la configuration du lanceur de campagnes",
    dryRun: {
      label: "Mode simulation",
      description: "Activer le mode simulation pour les tests",
    },
    minAgeHours: {
      label: "Ancienneté minimale (heures)",
      description: "Ancienneté minimale en heures avant de traiter les leads",
    },
    enabledDays: {
      label: "Jours actifs",
      description: "Jours de la semaine où les campagnes sont actives",
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
    },
    enabledHours: {
      label: "Heures actives",
      description: "Heures de la journée où les campagnes sont actives",
      start: {
        label: "Heure de début",
        description: "Heure de début des campagnes (0-23)",
      },
      end: {
        label: "Heure de fin",
        description: "Heure de fin des campagnes (0-23)",
      },
    },
    localeConfig: {
      label: "Configuration par langue",
      description:
        "Réglages par langue : leads par semaine, jours actifs et heures actives",
    },
    leadsPerWeek: {
      label: "Leads par semaine",
      description: "Nombre maximal de leads à traiter par semaine",
    },
    schedule: {
      label: "Planification",
      description: "Planification d'exécution des campagnes",
    },
    enabled: {
      label: "Activé",
      description: "Activer ou désactiver le lanceur de campagnes",
    },
    priority: {
      label: "Priorité",
      description: "Niveau de priorité d'exécution des campagnes",
    },
    timeout: {
      label: "Délai d'expiration",
      description: "Délai d'expiration en millisecondes",
    },
    retries: {
      label: "Nouvelles tentatives",
      description: "Nombre de nouvelles tentatives",
    },
    retryDelay: {
      label: "Délai entre tentatives",
      description: "Délai entre deux tentatives en millisecondes",
    },
    success: {
      title: "Configuration enregistrée",
      description: "Configuration du lanceur de campagnes enregistrée",
    },
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
  widget: {
    title: "Lanceur de campagnes",
    titleSaved: "Configuration enregistrée",
    description:
      "Démarrer les campagnes des nouveaux leads prêts à être contactés.",
    saving: "Enregistrement...",
    save: "Enregistrer les paramètres",
    addLocale: "+ Ajouter une langue",
    guidanceTitle: "Configurer le lanceur de campagnes",
    guidanceDescription:
      "Définissez la planification, les jours et heures actifs, les objectifs de leads par semaine et les paramètres de la tâche cron.",
    runButton: "Lancer les campagnes",
    running: "Exécution...",
    done: "Terminé",
    perRunBudget:
      "~{{perRunBudget}} leads/exécution · {{totalRunsPerWeek}} exécutions/semaine",
    perRunBudgetFractional:
      "{{exactBudget}}/exécution · {{totalRunsPerWeek}} exécutions/semaine (fractionnaire, cumulé d'une exécution à l'autre)",
    perRunBudgetZeroHint:
      "(augmentez les leads/semaine ou réduisez la fréquence de planification)",
    sections: {
      general: "Général",
      generalDescription:
        "Commandes principales pour activer le lanceur de campagnes et le mode simulation.",
      schedule: "Planification",
      scheduleDescription:
        "Quand les campagnes doivent-elles tourner ? Définissez la planification cron, les jours et les heures actifs.",
      hoursTimezoneNote:
        "Heures dans le fuseau horaire de votre navigateur ({{offset}}). Stockées en UTC sur le serveur.",
      quotas: "Quotas",
      quotasDescription:
        "Nombre de leads à traiter par semaine, réparti par langue.",
      advanced: "Avancé",
      advancedDescription:
        "Paramètres d'exécution de la tâche : priorité, délais d'expiration et nouvelles tentatives.",
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
  },
};
