import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "Import",
    leads: "Leads",
    csv: "CSV",
  },

  category: "Import de données",
  post: {
    title: "Importer des leads",
    titleShort: "Importer des leads",
    description: "Importer des leads depuis un fichier CSV",
    form: {
      title: "Configuration de l'import",
      description: "Configurer les paramètres d'import des leads",
    },
    file: {
      label: "Fichier CSV",
      description: "Contenu du fichier CSV (encodé en base64)",
      placeholder: "Collez le contenu CSV encodé en base64",
      helpText: "Téléversez un fichier CSV contenant les données des leads",
    },
    fileName: {
      label: "Nom du fichier",
      description: "Nom du fichier CSV",
      placeholder: "leads.csv",
      helpText: "Indiquez un nom de fichier explicite",
    },
    skipDuplicates: {
      label: "Ignorer les doublons",
      description: "Ignorer les leads dont l'adresse e-mail existe déjà",
      helpText:
        "Activez pour ignorer automatiquement les adresses e-mail existantes",
    },
    updateExisting: {
      label: "Mettre à jour l'existant",
      description:
        "Mettre à jour les leads existants avec les nouvelles données",
      helpText:
        "Activez pour mettre à jour les leads existants au lieu de les ignorer",
    },
    defaultCountry: {
      label: "Pays par défaut",
      description: "Pays par défaut pour les leads sans pays renseigné",
      helpText: "Choisissez le code pays par défaut",
    },
    defaultLanguage: {
      label: "Langue par défaut",
      description: "Langue par défaut pour les leads sans langue renseignée",
      helpText: "Choisissez le code langue par défaut",
    },
    defaultStatus: {
      label: "Statut par défaut",
      description: "Statut par défaut des leads importés",
      helpText: "Choisissez le statut initial des nouveaux leads",
    },
    defaultCampaignStage: {
      label: "Étape de campagne par défaut",
      description: "Étape de campagne e-mail par défaut des leads importés",
      helpText: "Choisissez l'étape de campagne initiale",
    },
    defaultSource: {
      label: "Source par défaut",
      description: "Source attribuée par défaut aux leads importés",
      helpText: "Choisissez la source du lead pour le suivi",
    },
    useChunkedProcessing: {
      label: "Traitement par blocs",
      description: "Traiter les gros imports en arrière-plan, par blocs",
      helpText: "À activer pour les fichiers de plus de 1000 lignes",
    },
    batchSize: {
      label: "Taille de lot",
      description: "Nombre de lignes traitées par lot",
      helpText: "Recommandé : 2000 lignes par lot",
    },
    response: {
      batchId: "ID du lot",
      totalRows: "Lignes au total",
      successfulImports: "Imports réussis",
      failedImports: "Imports échoués",
      duplicateEmails: "E-mails en double",
      errors: "Erreurs d'import",
      summary: "Récapitulatif de l'import",
      isChunkedProcessing: "Traitement par blocs actif",
      jobId: "ID de la tâche en arrière-plan",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres d'import ou format CSV invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour importer des leads",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit à l'import des leads",
      },
      notFound: {
        title: "Introuvable",
        description: "Fichier CSV introuvable ou invalide",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données pendant l'import",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant l'import",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite pendant l'import",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant l'import",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Le formulaire d'import contient des modifications non enregistrées",
      },
    },
    success: {
      title: "Import lancé",
      description: "L'import des leads a démarré",
    },
    widget: {
      headerTitle: "Importer des leads depuis un CSV",
      exportTemplateButton: "Exporter le modèle",
      importGuideTitle: "Guide d'import",
      importGuideSubtitle:
        "Téléversez un fichier CSV avec les colonnes suivantes :",
      importGuideNote:
        "Seul {{email}} est obligatoire. Toutes les autres colonnes sont facultatives et reprennent les valeurs par défaut configurées ci-dessous.",
      fileRequirementsTitle: "Exigences du fichier",
      fileRequirementFormat:
        "Format : CSV (valeurs séparées par des virgules, encodage UTF-8)",
      fileRequirementHeader:
        "La première ligne doit être l'en-tête avec les noms de colonnes",
      fileRequirementSize: "Taille maximale recommandée : 50 Mo par envoi",
      fileRequirementChunked:
        "Au-delà d'environ 5 000 lignes, activez {{chunkedProcessing}} pour éviter les dépassements de délai",
      chunkedProcessingLabel: "Traitement par blocs",
      downloadTemplateLink: "Télécharger le modèle CSV",
      loadingText: "Import des leads…",
      backgroundProcessingTitle: "Traitement en arrière-plan",
      backgroundProcessingNote:
        "Gros import mis en file d'attente comme tâche : {{jobId}}. Traitement de {{totalRows}} lignes en arrière-plan.",
      checkJobStatusButton: "Voir le statut de la tâche",
      stopJobButton: "Arrêter la tâche",
      retryFailedButton: "Relancer les échecs",
      statTotalRows: "Lignes au total",
      statImported: "Importés",
      statDuplicates: "Doublons",
      statFailed: "Échecs",
      viewImportedLeadsButton: "Voir les leads importés",
      retryFailedWithCountButton: "Relancer les échecs ({{count}})",
      summaryTitle: "Récapitulatif",
      summaryNewLeads: "Nouveaux leads",
      summaryUpdated: "Mis à jour",
      summarySkipped: "Ignorés",
      successRateLabel: "Taux de réussite",
      importErrorsTitle: "Erreurs d'import : {{count}}",
      errorRowLabel: "Ligne {{row}}",
      findLeadButton: "Trouver le lead",
    },
  },
  process: {
    tag: "Traitement des imports",
    post: {
      title: "Traiter les tâches d'import",
      titleShort: "Traiter les imports",
      description: "Traiter les tâches d'import CSV en attente",
      container: {
        title: "Configuration du traitement des imports",
        description: "Configurer les paramètres du traitement des imports",
      },
      fields: {
        maxJobsPerRun: {
          label: "Tâches max. par exécution",
          description: "Nombre maximal de tâches traitées par exécution",
        },
        maxRetriesPerJob: {
          label: "Tentatives max. par tâche",
          description: "Nombre maximal de nouvelles tentatives par tâche",
        },
        dryRun: {
          label: "Simulation",
          description: "Exécuter sans rien modifier",
        },
        selfTaskId: {
          label: "ID de tâche propre",
          description:
            "ID de tâche interne pour le nettoyage automatique après traitement",
        },
      },
      response: {
        jobsProcessed: "Tâches traitées",
        totalRowsProcessed: "Lignes traitées au total",
        successfulImports: "Imports réussis",
        failedImports: "Imports échoués",
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
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur s'est produite lors du traitement des imports",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
      },
      success: {
        title: "Traitement des imports terminé",
        description: "Tâches d'import traitées",
      },
    },
  },
  widget: {
    header: {
      title: "Tâches d'import",
      newImport: "Nouvel import",
    },
    filter: {
      all: "Toutes",
      completed: "Terminées",
      failed: "Échouées",
      pending: "En attente",
      running: "En cours",
    },
    loading: "Chargement des tâches d'import…",
    empty: {
      title: "Aucune tâche d'import",
      withFilter: "Essayez un autre filtre ou lancez un nouvel import.",
      withoutFilter: "Lancez votre premier import pour le voir ici.",
      newImport: "Nouvel import",
    },
  },
  jobs: {
    jobId: {
      category: "Import de données",
      tags: {
        leads: "Leads",
        management: "Gestion",
      },

      get: {
        title: "Consulter une tâche d'import",
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
            description:
              "Vous n'avez pas l'autorisation de consulter cette tâche",
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
            description:
              "Vous n'avez pas l'autorisation de modifier cette tâche",
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
            description:
              "Vous n'avez pas l'autorisation de supprimer cette tâche",
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
            description:
              "Impossible de supprimer une tâche en cours de traitement",
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
              description:
                "Vous n'avez pas l'autorisation de relancer cette tâche",
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
              description:
                "Vous n'avez pas l'autorisation d'arrêter cette tâche",
            },
            notFound: {
              title: "Tâche introuvable",
              description: "Aucune tâche d'import trouvée avec cet ID",
            },
            server: {
              title: "Erreur serveur",
              description:
                "Une erreur s'est produite lors de l'arrêt de la tâche",
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
    },
  },
  status: {
    category: "Import de données",
    tags: {
      import: "Import",
      jobs: "Tâches",
      list: "Liste",
    },

    get: {
      title: "Statut des tâches d'import",
      titleShort: "Tâches d'import",
      description: "Lister et suivre les tâches d'import CSV",
      actions: {
        refresh: "Actualiser",
        refreshing: "Actualisation...",
      },
      form: {
        title: "Filtres des tâches",
        description: "Filtrer les tâches d'import par statut et pagination",
      },
      filters: {
        title: "Filtres",
        description: "Options de filtre des tâches d'import",
      },
      status: {
        label: "Statut de la tâche",
        description: "Filtrer par statut de tâche",
        placeholder: "Choisir un statut",
      },
      limit: {
        label: "Résultats par page",
        description: "Nombre de tâches à renvoyer",
        placeholder: "50",
      },
      offset: {
        label: "Décalage de page",
        description: "Nombre de tâches à ignorer",
        placeholder: "0",
      },
      response: {
        title: "Tâches d'import",
        description: "Liste des tâches d'import avec leur statut actuel",
        statusCounts: "Nombre par statut",
        items: {
          title: "Liste des tâches",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de filtre invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description:
            "Authentification requise pour consulter les tâches d'import",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès interdit aux tâches d'import",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucune tâche d'import trouvée",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Erreur interne du serveur lors de la récupération des tâches",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors de la récupération des tâches",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Des modifications ne sont pas enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données",
        },
      },
      success: {
        title: "Tâches récupérées",
        description: "Liste des tâches d'import récupérée",
      },
    },
    widget: {
      status: {
        pending: "En attente",
        running: "En cours",
        completed: "Terminée",
        failed: "Échouée",
        stopped: "Arrêtée",
      },
      filter: {
        all: "Toutes",
        pending: "En attente",
        running: "En cours",
        completed: "Terminées",
        failed: "Échouées",
      },
      progress: {
        rows: "lignes",
      },
      job: {
        total: "Total :",
        processed: "Traitées :",
        ok: "OK :",
        fail: "Échecs :",
        created: "Créée :",
        done: "Terminée :",
      },
      header: {
        title: "Tâches d'import",
        newImport: "Nouvel import",
      },
      loading: "Chargement des tâches d'import…",
      empty: {
        title: "Aucune tâche d'import",
        withFilter: "Essayez un autre filtre ou lancez un nouvel import.",
        withoutFilter: "Lancez votre premier import pour le voir ici.",
        newImport: "Nouvel import",
      },
    },
  },
  csv: {
    post: {
      title: "Importer des données CSV",
      description:
        "Importer des données depuis des fichiers CSV, avec traitement et validation automatiques",
      form: {
        title: "Configuration de l'import CSV",
        description: "Configurez les paramètres de votre import CSV",
      },
      fileSection: {
        title: "Envoi du fichier",
        description: "Choisissez votre fichier CSV et le domaine cible",
      },
      file: {
        label: "Fichier CSV",
        description: "Choisissez un fichier CSV à envoyer (10 Mo max.)",
        placeholder: "Choisir un fichier CSV...",
        helpText:
          "Format pris en charge : CSV avec valeurs séparées par des virgules. La première ligne doit contenir les en-têtes de colonnes.",
      },
      fileName: {
        label: "Nom du fichier",
        description: "Nom de cet import (pour vous y retrouver)",
        placeholder: "ex. Import leads janvier 2024",
      },
      domain: {
        label: "Domaine d'import",
        description: "Quel type de données importez-vous ?",
        placeholder: "Choisir un type de données...",
      },
      processingSection: {
        title: "Options de traitement",
        description: "Configurez le traitement de vos données",
      },
      skipDuplicates: {
        label: "Ignorer les doublons",
        description:
          "Ignorer les enregistrements dont l'adresse e-mail existe déjà",
        helpText: "Recommandé : évite d'importer deux fois le même contact",
      },
      updateExisting: {
        label: "Mettre à jour l'existant",
        description:
          "Mettre à jour les enregistrements existants avec les données du CSV",
        helpText: "Si décoché, les enregistrements existants restent inchangés",
      },
      useChunkedProcessing: {
        label: "Traitement en arrière-plan",
        description: "Traiter les gros fichiers en arrière-plan",
        helpText: "Recommandé au-delà de 500 enregistrements",
      },
      batchSize: {
        label: "Taille de lot",
        description: "Nombre d'enregistrements traités à la fois",
        placeholder: "100",
        helpText:
          "Les petits lots sont plus stables, les gros lots plus rapides",
      },
      defaultsSection: {
        title: "Valeurs par défaut (facultatif)",
        description:
          "Définir des valeurs par défaut pour les enregistrements incomplets",
      },
      defaultCountry: {
        label: "Pays par défaut",
        description: "Pays des enregistrements sans localisation",
        placeholder: "Choisir un pays...",
      },
      defaultLanguage: {
        label: "Langue par défaut",
        description: "Langue des enregistrements sans préférence de langue",
        placeholder: "Choisir une langue...",
      },
      response: {
        title: "Résultats de l'import",
        description: "Récapitulatif de votre import CSV",
        basicResults: {
          title: "Résultats principaux",
          description: "Statistiques principales de l'import",
        },
        batchId: {
          label: "ID du lot",
        },
        totalRows: {
          label: "Lignes au total",
        },
        isChunkedProcessing: {
          label: "Traitement en arrière-plan",
        },
        jobId: {
          label: "ID de la tâche",
        },
        statistics: {
          title: "Statistiques de l'import",
          description: "Détail de l'opération d'import",
        },
        successfulImports: {
          label: "Imports réussis",
        },
        failedImports: {
          label: "Imports échoués",
        },
        duplicateEmails: {
          label: "E-mails en double",
        },
        processingTimeMs: {
          label: "Durée de traitement (ms)",
        },
        summary: {
          title: "Récapitulatif de l'import",
          description: "Vue d'ensemble des résultats de l'import",
        },
        newRecords: {
          label: "Nouveaux enregistrements",
        },
        updatedRecords: {
          label: "Enregistrements mis à jour",
        },
        skippedDuplicates: {
          label: "Doublons ignorés",
        },
        errors: {
          title: "Détail des erreurs",
          row: {
            label: "Ligne",
          },
          email: {
            label: "E-mail",
          },
          error: {
            label: "Erreur",
          },
        },
        nextSteps: {
          title: "Étapes suivantes",
          item: {
            label: "Étape suivante",
          },
        },
      },
      errors: {
        validation: {
          title: "Données d'import invalides",
          description: "Vérifiez votre fichier CSV et vos paramètres",
          emptyFile: "Le contenu du fichier CSV est obligatoire",
          emptyFileName: "Donnez un nom à cet import",
          invalidDomain: "Choisissez un domaine d'import valide",
          invalidBatchSize:
            "La taille de lot doit être comprise entre 10 et 1000",
          fileTooLarge:
            "Le fichier dépasse la limite de 10 Mo. Utilisez plutôt le traitement en arrière-plan.",
        },
        unauthorized: {
          title: "Accès refusé",
          description: "Vous n'avez pas l'autorisation d'importer des données",
        },
        fileTooLarge: {
          title: "Fichier trop volumineux",
          description: "Le fichier choisi dépasse la taille maximale de 10 Mo",
        },
        server: {
          title: "Échec de l'import",
          description:
            "Une erreur s'est produite lors du traitement de votre import. Réessayez.",
        },
        network: {
          title: "Erreur réseau",
          description: "La connexion réseau a échoué pendant l'import",
        },
        forbidden: {
          title: "Interdit",
          description: "Vous n'avez pas l'autorisation d'effectuer cet import",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource d'import introuvable",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit de données",
          description: "Conflit avec des données existantes",
        },
      },
      success: {
        title: "Import réussi",
        description: "Vos données CSV ont été importées",
      },
    },
  },
  enum: {
    status: {
      pending: {
        label: "En attente",
        description: "La tâche attend d'être traitée",
      },
      processing: {
        label: "En cours",
        description: "La tâche est en cours de traitement",
      },
      completed: {
        label: "Terminée",
        description: "La tâche s'est terminée avec succès",
      },
      failed: {
        label: "Échouée",
        description: "La tâche a rencontré une erreur",
      },
      cancelled: {
        label: "Annulée",
        description: "La tâche a été annulée par l'utilisateur",
      },
      paused: {
        label: "En pause",
        description: "Le traitement de la tâche est temporairement suspendu",
      },
    },
    domain: {
      leads: {
        label: "Leads",
        description: "Clients potentiels et contacts professionnels",
      },
      contacts: {
        label: "Contacts",
        description: "Coordonnées générales et carnet d'adresses",
      },
      businessData: {
        label: "Données d'entreprise",
        description: "Informations et profils d'entreprises",
      },
      emails: {
        label: "Listes d'e-mails",
        description: "Listes et campagnes d'e-mail marketing",
      },
      users: {
        label: "Utilisateurs",
        description: "Utilisateurs du système et informations de compte",
      },
      templates: {
        label: "Modèles",
        description: "Modèles d'e-mail et contenus",
      },
    },
    format: {
      csv: {
        label: "Fichier CSV",
        description: "Valeurs séparées par des virgules (le plus courant)",
      },
      xlsx: {
        label: "Fichier Excel",
        description: "Classeur Microsoft Excel",
      },
      json: {
        label: "Fichier JSON",
        description: "Données JavaScript Object Notation",
      },
      tsv: {
        label: "Fichier TSV",
        description: "Valeurs séparées par des tabulations",
      },
    },
    processing: {
      immediate: {
        label: "Traiter maintenant",
        description: "Traiter le fichier immédiatement (le plus rapide)",
      },
      background: {
        label: "Arrière-plan",
        description: "Traiter en arrière-plan (pour les gros fichiers)",
      },
      scheduled: {
        label: "Planifier",
        description: "Planifier le traitement à une heure précise",
      },
    },
    errorType: {
      validation: {
        label: "Erreur de validation",
        description:
          "Les données ne respectent pas le format ou les règles requis",
      },
      duplicate: {
        label: "Doublon",
        description: "L'enregistrement existe déjà dans le système",
      },
      format: {
        label: "Erreur de format",
        description: "Format de fichier incorrect ou fichier corrompu",
      },
      processing: {
        label: "Erreur de traitement",
        description: "Erreur pendant le traitement des données",
      },
      system: {
        label: "Erreur système",
        description: "Erreur système interne",
      },
    },
    batchSize: {
      small: {
        label: "Petit (50)",
        description: "Idéal pour les tests ou les petits imports",
      },
      medium: {
        label: "Moyen (100)",
        description: "Recommandé pour la plupart des imports",
      },
      large: {
        label: "Grand (250)",
        description: "Adapté aux gros fichiers aux données simples",
      },
      xlarge: {
        label: "Très grand (500)",
        description: "Pour les très gros fichiers (utilisateurs avancés)",
      },
    },
  },
  nextSteps: {
    reviewErrors:
      "Consultez le détail des erreurs pour comprendre ce qui a échoué",
    checkDuplicates: "Ajustez éventuellement la gestion des doublons",
    reviewLeads:
      "Vérifiez vos leads importés dans la section de gestion des leads",
    startCampaign:
      "Lancez éventuellement une campagne e-mail avec vos nouveaux leads",
    reviewContacts: "Vérifiez vos contacts importés dans la section contacts",
    organizeContacts: "Organisez vos contacts en groupes ou avec des tags",
    reviewImported: "Vérifiez vos données importées dans la section concernée",
    monitorProgress: "Suivez la progression dans l'historique des tâches",
    checkJobsList: "Consultez la liste des tâches pour le détail des statuts",
  },
  errors: {
    cancel: {
      server: "Échec de l'annulation de la tâche d'import",
    },
    retry: {
      server: "Échec de la relance de la tâche d'import",
    },
    delete: {
      server: "Échec de la suppression de la tâche d'import",
    },
    status: {
      server: "Impossible de récupérer le statut de la tâche",
    },
  },
  error: {
    default: "Une erreur s'est produite",
  },
  enums: {
    csvImportJobStatus: {
      pending: "En attente",
      processing: "En cours",
      completed: "Terminée",
      failed: "Échouée",
    },
    csvImportJobAction: {
      retry: "Relancer",
      delete: "Supprimer",
      stop: "Arrêter",
    },
    importMode: {
      createOnly: "Créer uniquement",
      updateOnly: "Mettre à jour uniquement",
      createOrUpdate: "Créer ou mettre à jour",
      skipDuplicates: "Ignorer les doublons",
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV",
      json: "JSON",
    },
    importProcessingType: {
      immediate: "Immédiat",
      chunked: "Par blocs",
      scheduled: "Planifié",
    },
    importErrorType: {
      validationError: "Erreur de validation",
      duplicateEmail: "E-mail en double",
      invalidFormat: "Format invalide",
      missingRequiredField: "Champ obligatoire manquant",
      processingError: "Erreur de traitement",
      systemError: "Erreur système",
    },
    batchProcessingStatus: {
      pending: "En attente",
      processing: "En cours",
      completed: "Terminé",
      failed: "Échoué",
      retrying: "Nouvelle tentative",
    },
    importPriority: {
      low: "Basse",
      normal: "Normale",
      high: "Haute",
      urgent: "Urgente",
    },
    importSource: {
      webUpload: "Envoi web",
      apiUpload: "Envoi API",
      scheduledImport: "Import planifié",
      bulkOperation: "Opération groupée",
    },
    csvDelimiter: {
      comma: "Virgule",
      semicolon: "Point-virgule",
      tab: "Tabulation",
      pipe: "Barre verticale",
    },
    importValidationLevel: {
      strict: "Stricte",
      moderate: "Modérée",
      lenient: "Souple",
    },
    importNotificationType: {
      email: "E-mail",
      inApp: "Dans l'application",
      webhook: "Webhook",
      none: "Aucune",
    },
    leadStatus: {
      new: "Nouveau",
      pending: "En attente",
      campaignRunning: "Campagne en cours",
      websiteUser: "Utilisateur du site",
      newsletterSubscriber: "Abonné à la newsletter",
      inContact: "En contact",
      signedUp: "Inscrit",
      subscriptionConfirmed: "Abonnement confirmé",
      unsubscribed: "Désabonné",
      bounced: "Rejeté (bounce)",
      invalid: "Invalide",
    },
    emailCampaignStage: {
      notStarted: "Non démarrée",
      initial: "Premier contact",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Nurturing",
      reactivation: "Réactivation",
    },
    leadSource: {
      website: "Site web",
      socialMedia: "Réseaux sociaux",
      emailCampaign: "Campagne e-mail",
      referral: "Parrainage",
      csvImport: "Import CSV",
    },
  },
  countries: {
    ...regionalCountryNames("fr"),
    global: "International",
    de: "Allemagne",
    pl: "Pologne",
    fr: "France",
    us: "États-Unis",
  },
  languages: {
    it: "Italien",
    es: "Espagnol",
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
};
