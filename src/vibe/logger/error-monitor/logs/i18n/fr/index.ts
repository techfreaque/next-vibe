import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",

  errors: {
    repositoryInternalError: "Une erreur interne s'est produite",
    fetchErrorLogs:
      "Impossible de récupérer les journaux d'erreurs : {{error}}",
    updateErrorLog:
      "Impossible de mettre à jour le statut du journal d'erreurs : {{error}}",
    missingTarget: "Passez fingerprint ou id.",
    idNotUnique:
      "Le préfixe d'id {{id}} correspond à {{count}} lignes. Utilisez l'empreinte ou l'id complet.",
  },

  statusFilter: {
    all: "Tous",
    active: "Actifs",
    resolved: "Résolus",
  },

  get: {
    title: "Journaux d'erreurs",
    titleShort: "Journaux d'erreurs",
    description:
      "Parcourir les journaux d'erreurs du backend avec filtres et pagination",
    tags: {
      monitoring: "Surveillance",
    },
    fields: {
      status: {
        label: "Statut",
        description: "Filtrer par statut de résolution",
      },
      search: {
        label: "Rechercher une erreur",
        description:
          "Rechercher par message, empreinte ou identifiant du journal",
        placeholder:
          "Rechercher par message, empreinte ou identifiant du journal",
      },
      errorType: {
        label: "Type d'erreur",
        description: "Filtrer par type d'erreur",
        placeholder: "ex. INTERNAL_ERROR",
      },
      startDate: {
        label: "Du",
        description: "Afficher les erreurs après cette date",
      },
      endDate: {
        label: "Au",
        description: "Afficher les erreurs avant cette date",
      },
      limit: {
        label: "Limite",
        description: "Nombre de résultats à renvoyer",
        placeholder: "50",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de résultats à ignorer",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Entrées du journal d'erreurs",
      },
      totalCount: {
        title: "Nombre total",
      },
      hasMore: {
        title: "Suite disponible",
      },
      unresolvedCount: {
        title: "Non résolues",
      },
    },
    success: {
      title: "Journaux récupérés",
      description: "Les journaux d'erreurs ont été récupérés",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun journal trouvé",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer les journaux d'erreurs",
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
  },

  patch: {
    title: "Mettre à jour un journal d'erreurs",
    titleShort: "Mettre à jour le journal",
    description: "Résoudre ou rouvrir un journal d'erreurs par empreinte",
    tags: {
      monitoring: "Surveillance",
    },
    fields: {
      fingerprint: {
        label: "Empreinte",
        description:
          "L'empreinte du journal d'erreurs (colonne `fingerprint` de la liste). Passez-la, ou l'id.",
        placeholder: "Saisissez l'empreinte",
      },
      id: {
        label: "ID du journal",
        description:
          "L'id de la ligne dans la liste (uuid complet ou ses 8+ premiers caractères). À la place de l'empreinte.",
        placeholder: "ex. c21bd4c7",
      },
      resolved: {
        label: "Résolu",
        description: "true pour résoudre, false pour rouvrir",
      },
    },
    response: {
      fingerprint: {
        title: "Empreinte",
      },
      resolved: {
        title: "Résolu",
      },
      affectedRows: {
        title: "Lignes modifiées",
      },
    },
    success: {
      title: "Journal mis à jour",
      description: "Le statut du journal d'erreurs a été mis à jour",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Journal d'erreurs introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de mettre à jour le journal d'erreurs",
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
  },

  post: {
    title: "Lancer une analyse du moniteur d'erreurs",
    description:
      "Analyser les messages de chat et les logs du backend à la recherche de motifs d'erreur",
    tags: {
      monitoring: "Surveillance",
    },
    response: {
      errorsFound: "Erreurs trouvées",
      threadsScanned: "Fils analysés",
      scanWindowFrom: "Début de la fenêtre d'analyse",
      scanWindowTo: "Fin de la fenêtre d'analyse",
      patterns: "Motifs d'erreur",
    },
    success: {
      title: "Analyse terminée",
      description: "L'analyse du moniteur d'erreurs est terminée",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de lancer l'analyse du moniteur d'erreurs",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
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
  },

  errorMonitor: {
    name: "Moniteur d'erreurs",
    description: "Recherche des motifs d'erreur toutes les 3 heures",
  },

  widget: {
    emptyFiltered:
      "Aucun groupe ne correspond. Retirez un filtre et relancez la recherche.",
    emptyActive:
      "Aucun groupe actif. Choisissez « Tous » pour revoir les erreurs résolues.",
    severity: {
      error: "Erreur",
      warning: "Avertissement",
    },
    title: "Journaux d'erreurs",
    loading: "Chargement des journaux...",
    empty: "Aucun journal d'erreurs trouvé",
    header: {
      refresh: "Actualiser",
      runScan: "Lancer l'analyse",
      back: "Retour",
      activeCount: "{{count}} groupes ouverts au total",
    },
    col: {
      message: "Message",
      errorType: "Type d'erreur",
      occurrences: "Occurrences",
      firstSeen: "Première apparition",
      createdAt: "Dernière apparition",
    },
    status: {
      active: "Active",
      resolved: "Résolue",
    },
    action: {
      confirm: "Enregistrer le statut",
      clear: "Effacer les filtres",
      resolve: "Résoudre",
      reopen: "Rouvrir",
    },
    detail: {
      context: "Contexte de l’erreur",
      stackTrace: "Pile d'appels",
      metadata: "Métadonnées",
      collapse: "Replier",
      resolved: "Résolue",
    },
    pagination: {
      matches: "Groupes trouvés : {{count}}",
      info: "Page {{page}} sur {{totalPages}} ({{total}} au total)",
      prev: "Précédent",
      next: "Suivant",
    },
  },
};
