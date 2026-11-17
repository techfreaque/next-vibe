import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des campagnes",
  tag: "Campagnes e-mail",
  task: {
    description:
      "Envoie des campagnes e-mail automatisées aux leads selon leur étape et le calendrier",
  },
  errors: {
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
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit de données s'est produit",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
  },
  post: {
    title: "Campagnes e-mail",
    titleShort: "Envoyer les campagnes",
    description: "Traiter les campagnes e-mail des leads",
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
      batchSize: {
        label: "Taille de lot",
        description: "Nombre de leads à traiter par lot",
      },
      maxEmailsPerRun: {
        label: "E-mails max. par exécution",
        description: "Nombre maximal d'e-mails à envoyer par exécution",
      },
      dryRun: {
        label: "Simulation",
        description: "Exécuter sans envoyer d'e-mails",
      },
    },
    response: {
      emailsScheduled: "E-mails planifiés",
      emailsSent: "E-mails envoyés",
      emailsFailed: "E-mails en échec",
      leadsProcessed: "Leads traités",
    },
    success: {
      title: "Succès",
      description: "Opération terminée",
    },
  },
  get: {
    title: "Configuration des campagnes e-mail",
    titleShort: "Config. campagnes e-mail",
    description:
      "Récupérer la configuration de la tâche de fond des campagnes e-mail",
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
    response: {
      enabled: "Activé",
      dryRun: "Mode simulation",
      batchSize: "Taille de lot",
      maxEmailsPerRun: "E-mails max. par exécution",
      schedule: "Planification",
      priority: "Priorité",
      timeout: "Délai d'expiration",
      retries: "Nouvelles tentatives",
      retryDelay: "Délai entre tentatives",
    },
    success: {
      title: "Configuration récupérée",
      description: "Configuration des campagnes e-mail récupérée",
    },
  },
  put: {
    title: "Configuration des campagnes e-mail",
    description:
      "Modifier la configuration de la tâche de fond des campagnes e-mail",
    enabled: {
      label: "Activé",
      description:
        "Activer ou désactiver la tâche de fond des campagnes e-mail",
    },
    dryRun: {
      label: "Mode simulation",
      description: "Traiter les e-mails sans les envoyer réellement",
    },
    batchSize: {
      label: "Taille de lot",
      description: "Nombre de leads à traiter par lot (1 à 100)",
    },
    maxEmailsPerRun: {
      label: "E-mails max. par exécution",
      description:
        "Nombre maximal d'e-mails à envoyer par exécution en arrière-plan (1 à 1000)",
    },
    schedule: {
      label: "Planification",
      description:
        "Expression cron qui définit quand lancer les campagnes e-mail",
    },
    priority: {
      label: "Priorité",
      description: "Niveau de priorité d'exécution de la tâche",
    },
    timeout: {
      label: "Délai d'expiration (ms)",
      description: "Durée d'exécution maximale en millisecondes",
    },
    retries: {
      label: "Nouvelles tentatives",
      description: "Nombre de nouvelles tentatives en cas d'échec",
    },
    retryDelay: {
      label: "Délai entre tentatives (ms)",
      description: "Délai entre deux tentatives en millisecondes",
    },
    success: {
      title: "Configuration enregistrée",
      description: "Configuration des campagnes e-mail enregistrée",
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
    title: "Configuration des campagnes e-mail",
    titleSaved: "Configuration enregistrée",
    saving: "Enregistrement...",
    save: "Enregistrer les paramètres",
    guidanceTitle: "Configurer la tâche de fond des campagnes e-mail",
    guidanceDescription:
      "Activez ou désactivez la tâche cron des campagnes e-mail et configurez sa planification, la taille de lot et les paramètres d'exécution.",
    runButton: "Exécuter maintenant",
    running: "Exécution...",
    done: "Terminé",
    sections: {
      general: "Général",
      generalDescription:
        "Commandes principales pour activer la tâche des campagnes e-mail et le mode simulation.",
      schedule: "Planification",
      scheduleDescription:
        "Définissez la planification cron de l'envoi des e-mails.",
      processing: "Traitement",
      processingDescription:
        "Configurez le nombre de leads et d'e-mails à traiter par exécution.",
      advanced: "Avancé",
      advancedDescription:
        "Paramètres d'exécution de la tâche : priorité, délais d'expiration et nouvelles tentatives.",
    },
  },
};
