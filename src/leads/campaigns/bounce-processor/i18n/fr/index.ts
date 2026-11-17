import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des campagnes",
  tag: "Traitement des rejets",
  task: {
    description:
      "Analyse la boîte IMAP à la recherche de notifications de rejet et passe le statut des leads à BOUNCED",
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
    title: "Traitement des rejets",
    titleShort: "Traiter les rejets",
    description: "Traiter les notifications de rejet d'e-mails depuis IMAP",
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
        description: "Une erreur s'est produite lors du traitement des rejets",
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
      dryRun: {
        label: "Simulation",
        description: "Exécuter sans rien modifier",
      },
      batchSize: {
        label: "Taille de lot",
        description:
          "Nombre maximal d'e-mails de rejet à traiter par exécution",
      },
    },
    response: {
      bouncesFound: "Rejets trouvés",
      leadsUpdated: "Leads mis à jour",
      campaignsCancelled: "Campagnes annulées",
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Enregistrer les paramètres",
      loadingText: "Enregistrement...",
    },
    success: {
      title: "Traitement des rejets terminé",
      description: "Notifications de rejet traitées",
    },
  },
  get: {
    title: "Configuration du traitement des rejets",
    titleShort: "Config. rejets",
    description:
      "Récupérer la configuration de la tâche de fond de traitement des rejets",
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
      schedule: "Planification",
      priority: "Priorité",
      timeout: "Délai d'expiration",
      retries: "Nouvelles tentatives",
      retryDelay: "Délai entre tentatives",
    },
    backButton: {
      label: "Retour",
    },
    success: {
      title: "Configuration récupérée",
      description: "Configuration du traitement des rejets récupérée",
    },
  },
  put: {
    title: "Configuration du traitement des rejets",
    description:
      "Modifier la configuration de la tâche de fond de traitement des rejets",
    enabled: {
      label: "Activé",
      description:
        "Activer ou désactiver la tâche de fond de traitement des rejets",
    },
    dryRun: {
      label: "Mode simulation",
      description: "Rechercher les rejets sans modifier le statut des leads",
    },
    batchSize: {
      label: "Taille de lot",
      description:
        "Nombre maximal d'e-mails de rejet à traiter par exécution (1 à 500)",
    },
    schedule: {
      label: "Planification",
      description:
        "Expression cron qui définit quand lancer le traitement des rejets",
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
      description: "Configuration du traitement des rejets enregistrée",
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
    title: "Configuration du traitement des rejets",
    titleSaved: "Configuration enregistrée",
    saving: "Enregistrement...",
    save: "Enregistrer les paramètres",
    guidanceTitle: "Configurer la tâche de fond de traitement des rejets",
    guidanceDescription:
      "Activez ou désactivez la tâche cron de traitement des rejets et configurez sa planification et ses paramètres de lot.",
    runButton: "Exécuter maintenant",
    running: "Exécution...",
    done: "Terminé",
    sections: {
      general: "Général",
      generalDescription:
        "Commandes principales pour activer la tâche de traitement des rejets et le mode simulation.",
      schedule: "Planification",
      scheduleDescription:
        "Définissez la planification cron du traitement des rejets.",
      processing: "Traitement",
      processingDescription:
        "Configurez le nombre d'e-mails de rejet à traiter par exécution.",
      advanced: "Avancé",
      advancedDescription:
        "Paramètres d'exécution de la tâche : priorité, délais d'expiration et nouvelles tentatives.",
    },
  },
};
