import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Import de données",
  tags: {
    leads: "Leads",
    management: "Gestion",
  },

  get: {
    title: "Consulter une tâche d'import",
    titleShort: "Tâche d'import",
    description: "Afficher les détails d'une tâche d'import",
    actions: {
      retry: "Relancer",
      stop: "Arrêter",
      viewLeads: "Voir les leads",
    },
    jobId: {
      label: "ID de la tâche",
      description: "Identifiant unique de la tâche d'import",
    },
    form: {
      title: "Statut de la tâche d'import",
      description: "Statut et progression actuels de la tâche d'import",
    },
    response: {
      title: "Informations sur la tâche",
      description: "Détails actuels de la tâche d'import",
      info: {
        title: "Informations sur la tâche",
        description: "Détails de base de la tâche",
      },
      id: {
        content: "ID de la tâche",
      },
      fileName: {
        content: "Nom du fichier",
      },
      status: {
        content: "Statut de la tâche",
      },
      progress: {
        title: "Progression de l'import",
        description: "Progression et statistiques actuelles de l'import",
      },
      totalRows: {
        content: "Lignes au total",
      },
      processedRows: {
        content: "Lignes traitées",
      },
      successfulImports: {
        content: "Imports réussis",
      },
      failedImports: {
        content: "Imports échoués",
      },
      duplicateEmails: {
        content: "E-mails en double",
      },
      configuration: {
        title: "Configuration de la tâche",
        description: "Paramètres de configuration actuels de la tâche",
      },
      currentBatchStart: {
        content: "Début du lot en cours",
      },
      batchSize: {
        content: "Taille de lot",
      },
      retryCount: {
        content: "Nombre de tentatives",
      },
      maxRetries: {
        content: "Tentatives max.",
      },
      error: {
        content: "Message d'erreur",
      },
      timestamps: {
        title: "Horodatages de la tâche",
        description: "Horodatages du cycle de vie de la tâche",
      },
      createdAt: {
        content: "Créée le",
      },
      updatedAt: {
        content: "Mise à jour le",
      },
      startedAt: {
        content: "Démarrée le",
      },
      completedAt: {
        content: "Terminée le",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de tâche fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour consulter des tâches",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de consulter cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "Aucune tâche d'import trouvée avec cet ID",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la récupération de la tâche",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de la récupération de la tâche",
      },
    },
    success: {
      title: "Succès",
      description: "Tâche d'import récupérée",
    },
  },
  patch: {
    title: "Mettre à jour la tâche d'import",
    titleShort: "Modifier la tâche d'import",
    description: "Mettre à jour la configuration de la tâche d'import",
    jobId: {
      label: "ID de la tâche",
      description: "Identifiant unique de la tâche d'import",
    },
    form: {
      title: "Modifier les paramètres de la tâche",
      description: "Modifier la configuration de la tâche d'import",
    },
    settings: {
      title: "Paramètres de la tâche",
      description: "Paramètres de configuration de la tâche d'import",
    },
    batchSize: {
      label: "Taille de lot",
      description: "Nombre de lignes traitées par lot",
      placeholder: "100",
    },
    maxRetries: {
      label: "Tentatives max.",
      description:
        "Nombre maximal de nouvelles tentatives pour les lignes en échec",
      placeholder: "3",
    },
    response: {
      title: "Informations mises à jour",
      description: "Détails mis à jour de la tâche d'import",
      info: {
        title: "Informations sur la tâche",
        description: "Détails de base de la tâche",
      },
      id: {
        content: "ID de la tâche",
      },
      fileName: {
        content: "Nom du fichier",
      },
      status: {
        content: "Statut de la tâche",
      },
      progress: {
        title: "Progression de l'import",
        description: "Progression et statistiques actuelles de l'import",
      },
      totalRows: {
        content: "Lignes au total",
      },
      processedRows: {
        content: "Lignes traitées",
      },
      successfulImports: {
        content: "Imports réussis",
      },
      failedImports: {
        content: "Imports échoués",
      },
      duplicateEmails: {
        content: "E-mails en double",
      },
      configuration: {
        title: "Configuration de la tâche",
        description: "Paramètres de configuration actuels de la tâche",
      },
      currentBatchStart: {
        content: "Début du lot en cours",
      },
      batchSize: {
        content: "Taille de lot",
      },
      retryCount: {
        content: "Nombre de tentatives",
      },
      maxRetries: {
        content: "Tentatives max.",
      },
      error: {
        content: "Message d'erreur",
      },
      timestamps: {
        title: "Horodatages de la tâche",
        description: "Horodatages du cycle de vie de la tâche",
      },
      createdAt: {
        content: "Créée le",
      },
      updatedAt: {
        content: "Mise à jour le",
      },
      startedAt: {
        content: "Démarrée le",
      },
      completedAt: {
        content: "Terminée le",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour modifier des tâches",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de modifier cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "Aucune tâche d'import trouvée avec cet ID",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la mise à jour de la tâche",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit de mise à jour",
        description: "La tâche a été modifiée par un autre utilisateur",
      },
    },
    success: {
      title: "Succès",
      description: "Tâche d'import mise à jour",
    },
  },
  delete: {
    title: "Supprimer la tâche d'import",
    titleShort: "Supprimer la tâche d'import",
    description: "Supprimer une tâche d'import",
    jobId: {
      label: "ID de la tâche",
      description: "Identifiant unique de la tâche d'import à supprimer",
    },
    form: {
      title: "Supprimer la tâche d'import",
      description: "Confirmer la suppression de la tâche d'import",
    },
    response: {
      title: "Résultat de la suppression",
      description: "Résultat de l'opération de suppression",
      success: {
        content: "Statut de réussite",
      },
      message: {
        content: "Message de suppression",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de tâche fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour supprimer des tâches",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de supprimer cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "Aucune tâche d'import trouvée avec cet ID",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la suppression de la tâche",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit de suppression",
        description: "Impossible de supprimer une tâche en cours de traitement",
      },
    },
    success: {
      title: "Succès",
      description: "Tâche d'import supprimée",
    },
  },
  retry: {
    category: "Import de données",
    tags: {
      leads: "Leads",
      management: "Gestion",
    },

    post: {
      title: "Relancer la tâche d'import",
      description: "Relancer une tâche d'import échouée",
      jobId: {
        label: "ID de la tâche",
        description: "Identifiant unique de la tâche d'import à relancer",
      },
      form: {
        title: "Relancer la tâche d'import",
        description: "Relancer la tâche d'import échouée",
      },
      response: {
        title: "Résultat de la relance",
        description: "Résultat de l'opération de relance",
        success: {
          content: "Statut de réussite",
        },
        message: {
          content: "Message de relance",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "L'ID de tâche fourni est invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour relancer des tâches",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas l'autorisation de relancer cette tâche",
        },
        notFound: {
          title: "Tâche introuvable",
          description: "Aucune tâche d'import trouvée avec cet ID",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur s'est produite lors de la relance de la tâche",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit de relance",
          description:
            "Impossible de relancer une tâche en cours de traitement",
        },
      },
      success: {
        title: "Succès",
        description: "Tâche d'import relancée",
      },
    },
    widget: {
      title: "Relancer la tâche d'import",
      successMessage: "Relance de la tâche lancée",
    },
  },
  stop: {
    category: "Import de données",
    tags: {
      leads: "Leads",
      management: "Gestion",
    },

    post: {
      title: "Arrêter la tâche d'import",
      description: "Arrêter une tâche d'import en cours",
      jobId: {
        label: "ID de la tâche",
        description: "Identifiant unique de la tâche d'import à arrêter",
      },
      form: {
        title: "Arrêter la tâche d'import",
        description: "Arrêter la tâche d'import en cours",
      },
      response: {
        title: "Résultat de l'arrêt",
        description: "Résultat de l'opération d'arrêt",
        success: {
          content: "Statut de réussite",
        },
        message: {
          content: "Message d'arrêt",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "L'ID de tâche fourni est invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour arrêter des tâches",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas l'autorisation d'arrêter cette tâche",
        },
        notFound: {
          title: "Tâche introuvable",
          description: "Aucune tâche d'import trouvée avec cet ID",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur s'est produite lors de l'arrêt de la tâche",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit d'arrêt",
          description:
            "Impossible d'arrêter une tâche qui n'est pas en cours de traitement",
        },
      },
      success: {
        title: "Succès",
        description: "Tâche d'import arrêtée",
      },
    },
    widget: {
      title: "Arrêter la tâche d'import",
      successMessage: "Tâche arrêtée",
    },
  },
  widget: {
    status: {
      title: "Statut de la tâche d'import",
      jobId: "ID de la tâche",
      loadingJobStatus: "Chargement du statut…",
      totalRows: "Lignes au total",
      processed: "Traitées",
      imported: "Importées",
      failed: "Échouées",
      duplicates: "Doublons",
      progress: "Progression",
      configurationTitle: "Configuration",
      batchSize: "Taille de lot",
      batchStart: "Début du lot",
      retries: "Tentatives",
      timestampsTitle: "Horodatages",
      created: "Créée",
      started: "Démarrée",
      completed: "Terminée",
      jobStatus: {
        enums: {
          csvImportJobStatus: {
            pending: "En attente",
            processing: "En cours",
            completed: "Terminée",
            failed: "Échouée",
          },
        },
      },
    },
    retry: {
      title: "Relancer la tâche d'import",
      loadingRetrying: "Relance de la tâche…",
      successMessage: "Tâche relancée",
      failureMessage: "Échec de la relance",
      viewJobStatus: "Voir le statut de la tâche",
      viewLeads: "Voir les leads",
    },
    stop: {
      title: "Arrêter la tâche d'import",
      loadingStopping: "Arrêt de la tâche…",
      successMessage: "Tâche arrêtée",
      failureMessage: "Échec de l'arrêt",
      viewLeads: "Voir les leads",
      startNewImport: "Lancer un nouvel import",
    },
  },
};
