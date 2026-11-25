import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    batch: "Lot",
    campaigns: "Campagnes",
    management: "Gestion",
    create: "Créer",
    search: "Recherche",
    export: "Export",
    import: "Import",
    csv: "CSV",
    jobs: "Tâches",
    list: "Liste",
  },
  admin: {
    title: "Gestion des leads",
    tabs: {
      overview: "Navigation des leads",
      stats: "Vue d'ensemble",
      stats_description: "Statistiques et analyses des leads",
      leads: "Leads",
      leads_description: "Parcourir et gérer tous les leads",
      emails: "Campagnes e-mail",
      emails_description: "Gérer les campagnes et modèles d'e-mail",
      abTesting: "Tests A/B",
      abTesting_description: "Configurer les variantes de test A/B",
      campaignStarter: "Lancement de campagne",
      campaignStarter_description:
        "Configurer et lancer les campagnes de leads",
    },
    import: {
      label: "Import",
      description: "Importer des leads depuis des fichiers CSV",
    },
    emails: {
      preview: {
        error: "Impossible d'afficher l'aperçu de l'e-mail",
        live: "Aperçu en direct",
        actions: {
          title: "Aperçu de l'e-mail",
          description: "Voir l'e-mail tel que les destinataires le recevront",
        },
      },
      preview_title: "Aperçu de l'e-mail",
      testEmail: {
        button: "Envoyer un e-mail de test",
      },
      from: "De",
      recipient: "Destinataire",
      subject: "Objet",
      email_preview: "Aperçu de l'e-mail",
      stage_of: "sur",
      stages: "étapes",
      journey: "Parcours",
      back: "Retour",
      previous: "Précédent",
      next: "Suivant",
    },
  },
  auth: {
    public: {
      validCookie: "Lead valide trouvé via le cookie",
      invalidCookie: "Lead du cookie invalide",
      created: "Lead anonyme créé",
      error: "Erreur d'authentification du lead public",
    },
    authenticated: {
      primaryFound: "Lead principal trouvé pour l'utilisateur",
      noPrimary: "Aucun lead principal trouvé pour l'utilisateur",
      error: "Erreur d'authentification du lead connecté",
    },
    link: {
      alreadyExists: "Le lien entre leads existe déjà",
      created: "Lien entre leads créé",
      error: "Erreur lors de la liaison des leads",
    },
    validate: {
      error: "Erreur lors de la validation du lead",
    },
    getOrCreate: {
      invalid: "ID de lead invalide",
      error: "Erreur lors de la récupération ou de la création du lead",
    },
    create: {
      existingFound: "Lead anonyme existant trouvé",
      success: "Lead créé",
      error: "Erreur lors de la création du lead",
    },
    createForUser: {
      success: "Lead créé pour l'utilisateur",
      error: "Erreur lors de la création du lead pour l'utilisateur",
    },
    cookie: {
      set: "Cookie du lead défini",
      error: "Erreur lors de la définition du cookie du lead",
    },
    getUserLeads: {
      error: "Erreur lors de la récupération des leads de l'utilisateur",
    },
    linkLeads: {
      sameId: "Impossible de lier un lead à lui-même",
      alreadyExists: "Le lien entre leads existe déjà",
      created: "Leads liés",
      error: "Erreur lors de la liaison des leads",
    },
    getLinkedLeads: {
      error: "Erreur lors de la récupération des leads liés",
    },
    getAllLinkedLeads: {
      error: "Erreur lors de la récupération de tous les leads liés",
    },
  },
  errors: {
    cannotLinkLeadToItself: "Impossible de lier un lead à lui-même",
    linkFailed: "Échec de la liaison des leads",
  },
  filters: {
    search: {
      label: "Recherche",
      description: "Rechercher des leads par e-mail ou nom d'entreprise",
      placeholder: "Saisissez un e-mail ou un nom d'entreprise...",
    },
    status: {
      label: "Statut",
      description: "Filtrer par statut du lead",
      placeholder: "Tous les statuts",
    },
    currentCampaignStage: {
      label: "Étape de campagne",
      description: "Filtrer par étape de la campagne e-mail",
      placeholder: "Toutes les étapes",
    },
    source: {
      label: "Source",
      description: "Filtrer par source du lead",
      placeholder: "Toutes les sources",
    },
    country: {
      label: "Région de langue",
      description: "Filtrer par la région de la langue choisie sur le site",
      placeholder: "Toutes les régions",
    },
    language: {
      label: "Langue",
      description: "Filtrer par langue",
      placeholder: "Toutes les langues",
    },
    sortBy: {
      label: "Trier par",
      description: "Choisissez le champ de tri",
      placeholder: "Champ de tri",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Tri croissant ou décroissant",
      placeholder: "Ordre de tri",
    },
    statusFilters: {
      title: "Filtres de statut et de campagne",
      description: "Filtrer par statut, étape de campagne et source",
    },
    locationFilters: {
      title: "Filtres de localisation",
      description: "Filtrer par pays et langue",
    },
    sortingOptions: {
      title: "Options de tri",
      description: "Configurer l'ordre de tri",
    },
  },
  batch: {
    category: "Leads",
    tags: {
      leads: "Leads",
      batch: "Lot",
    },

    patch: {
      title: "Mise à jour groupée",
      description:
        "Mettre à jour des leads en lot selon des critères de filtre",
      form: {
        title: "Configuration de la mise à jour groupée",
        description: "Configurer les paramètres de la mise à jour groupée",
      },
      search: {
        label: "Recherche",
        description: "Rechercher des leads par e-mail ou nom d'entreprise",
        placeholder: "Saisissez un e-mail ou un nom d'entreprise",
      },
      status: {
        label: "Filtre de statut",
        description: "Filtrer les leads par statut actuel",
      },
      currentCampaignStage: {
        label: "Filtre d'étape de campagne",
        description: "Filtrer les leads par étape de campagne actuelle",
      },
      source: {
        label: "Filtre de source",
        description: "Filtrer les leads par source",
      },
      scope: {
        label: "Portée de l'opération",
        description: "Définir la portée de l'opération groupée",
      },
      dryRun: {
        label: "Simulation",
        description: "Prévisualiser les changements sans les appliquer",
      },
      maxRecords: {
        label: "Enregistrements max.",
        description: "Nombre maximal d'enregistrements à traiter",
      },
      updates: {
        title: "Champs à mettre à jour",
        description: "Indiquez les champs à mettre à jour",
        status: {
          label: "Nouveau statut",
          description: "Passer le statut du lead à cette valeur",
        },
        currentCampaignStage: {
          label: "Nouvelle étape de campagne",
          description: "Passer l'étape de campagne à cette valeur",
        },
        source: {
          label: "Nouvelle source",
          description: "Passer la source du lead à cette valeur",
        },
        notes: {
          label: "Notes",
          description: "Ajouter ou modifier les notes du lead",
        },
      },
      response: {
        title: "Réponse de la mise à jour",
        description: "Données de réponse de la mise à jour groupée",
        success: "Succès",
        totalMatched: "Total correspondant",
        totalProcessed: "Total traité",
        totalUpdated: "Total mis à jour",
        preview: "Aperçu",
        errors: "Erreurs",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour les opérations groupées",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres invalides pour la mise à jour groupée",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Erreur interne du serveur pendant la mise à jour groupée",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inconnue s'est produite pendant la mise à jour groupée",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau pendant la mise à jour groupée",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé aux opérations groupées",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable pour la mise à jour groupée",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données pendant la mise à jour groupée",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description:
            "La mise à jour groupée contient des modifications non enregistrées",
        },
      },
      success: {
        title: "Mise à jour réussie",
        description: "La mise à jour groupée s'est terminée avec succès",
      },
    },
    delete: {
      title: "Suppression groupée",
      description: "Supprimer des leads en lot selon des critères de filtre",
      form: {
        title: "Configuration de la suppression groupée",
        description: "Configurer les paramètres de la suppression groupée",
      },
      search: {
        label: "Recherche",
        description: "Rechercher des leads par e-mail ou nom d'entreprise",
      },
      status: {
        label: "Filtre de statut",
        description: "Filtrer les leads par statut actuel",
      },
      confirmDelete: {
        label: "Confirmer la suppression",
        description: "Confirmez la suppression des leads sélectionnés",
      },
      dryRun: {
        label: "Simulation",
        description:
          "Prévisualiser les suppressions sans retirer réellement les enregistrements",
      },
      maxRecords: {
        label: "Enregistrements max.",
        description: "Nombre maximal d'enregistrements à supprimer",
      },
      response: {
        title: "Réponse de la suppression",
        description: "Données de réponse de la suppression groupée",
        success: "Succès",
        totalMatched: "Total correspondant",
        totalProcessed: "Total traité",
        totalDeleted: "Total supprimé",
        preview: "Aperçu",
        errors: "Erreurs",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description:
            "Authentification requise pour les suppressions groupées",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres invalides pour la suppression groupée",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Erreur interne du serveur pendant la suppression groupée",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inconnue s'est produite pendant la suppression groupée",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau pendant la suppression groupée",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé aux suppressions groupées",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable pour la suppression groupée",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données pendant la suppression groupée",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description:
            "La suppression groupée contient des modifications non enregistrées",
        },
      },
      success: {
        title: "Suppression réussie",
        description: "La suppression groupée s'est terminée avec succès",
      },
    },
    widget: {
      update: {
        headerTitle: "Mise à jour groupée des leads",
        emptyStateTitle: "Mise à jour groupée des leads",
        emptyStateDescription:
          "Appliquez une mise à jour de champ à de nombreux leads d'un coup, selon des critères de filtre. Utilisez",
        emptyStateDescriptionStrong: "Simulation",
        emptyStateDescriptionSuffix:
          "pour voir quels leads seront touchés avant de valider les changements.",
        emptyStateTip1:
          "Définissez les filtres et cliquez sur Envoyer pour lancer d'abord une simulation",
        emptyStateTip2:
          "Décochez Simulation pour appliquer les changements pour de vrai",
        highVolumeTitle: "Gros lot : {{count}} leads correspondent",
        highVolumeDescription:
          "Cette opération touche un grand nombre d'enregistrements. Vérifiez l'aperçu attentivement avant de désactiver la simulation et d'envoyer pour de vrai.",
        partialBatchTitle: "Lot traité partiellement",
        partialBatchDescription:
          "{{processed}} leads traités sur {{matched}} correspondants. Augmentez Enregistrements max. ou relancez pour en traiter davantage.",
        successTitle: "Opération groupée terminée",
        failureTitle: "Échec de l'opération groupée",
        statMatched: "Correspondants",
        statProcessed: "Traités",
        statUpdated: "Mis à jour",
        btnRunAgain: "Relancer",
        btnViewAllAffected: "Voir tous les leads concernés",
        btnViewInList: "Voir dans la liste",
        dryRunPreviewTitle:
          "Aperçu de la simulation ({{count}} leads seraient concernés)",
        leadFallback: "Lead {{number}}",
        errorsTitle: "{{count}} erreur(s)",
        errorRow: "Lead {{leadId}} : {{error}}",
        sectionFilter: "Critères de filtre",
        sectionUpdates: "Champs à mettre à jour",
        sectionSettings: "Paramètres de l'opération",
        activeFiltersLabel: "Filtres actifs de la liste (préremplis)",
        filterSearch: "Recherche",
        submitButton: "Appliquer les mises à jour",
        submitButtonLoading: "Application...",
      },
      delete: {
        headerTitle: "Suppression groupée des leads",
        warningTitle: "Attention : {{count}} lead sera supprimé définitivement",
        warningTitlePlural:
          "Attention : {{count}} leads seront supprimés définitivement",
        warningDescription:
          "Cette action est irréversible. Toutes les données des leads correspondants seront supprimées définitivement. Désactivez la simulation et confirmez pour continuer.",
        successTitle: "Suppression terminée",
        failureTitle: "Échec de la suppression",
        statMatched: "Correspondants",
        statDeleted: "Supprimés",
        btnRunAgain: "Relancer",
        btnViewRemainingLeads: "Voir les leads restants",
        previewTitle: "{{count}} leads seront supprimés définitivement",
        leadFallback: "Lead {{number}}",
        errorRow: "Lead {{leadId}} : {{error}}",
        sectionFilter: "Critères de filtre",
        sectionSettings: "Paramètres de suppression",
        activeFiltersLabel: "Filtres actifs de la liste (préremplis)",
        filterSearch: "Recherche",
        submitButton: "Supprimer les leads",
        submitButtonLoading: "Suppression...",
      },
    },
    enums: {
      batchOperationScope: {
        currentPage: "Page actuelle",
        allPages: "Toutes les pages",
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
        notStarted: "Pas commencé",
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
    email: {
      admin: {
        batchUpdate: {
          title: "Mise à jour groupée terminée",
          subject: "Résultats de la mise à jour groupée",
          preview: "{{totalProcessed}} leads traités",
          message:
            "La mise à jour groupée est terminée : {{totalProcessed}} leads traités.",
          operationSummary: "Récapitulatif de l'opération",
          totalMatched: "Total correspondant",
          totalProcessed: "Total traité",
          totalUpdated: "Total mis à jour",
          errors: "Erreurs",
          dryRunNote:
            "Ceci était une simulation : aucun changement n'a été appliqué.",
          viewLeads: "Voir les leads mis à jour",
          error: {
            noData: "Aucune donnée de mise à jour groupée disponible",
          },
        },
        batchDelete: {
          title: "Suppression groupée terminée",
          subject: "Résultats de la suppression groupée",
          preview: "{{totalProcessed}} leads traités pour suppression",
          message:
            "La suppression groupée est terminée : {{totalProcessed}} leads traités.",
          operationSummary: "Récapitulatif de l'opération",
          totalMatched: "Total correspondant",
          totalProcessed: "Total traité",
          totalDeleted: "Total supprimé",
          errors: "Erreurs",
          dryRunNote:
            "Ceci était une simulation : aucune suppression n'a été effectuée.",
          viewLeads: "Voir les leads",
          error: {
            noData: "Aucune donnée de suppression groupée disponible",
          },
        },
      },
      error: {
        general: {
          internal_server_error: "Une erreur interne du serveur s'est produite",
        },
      },
    },
  },
  campaigns: {
    category: "Gestion des campagnes",
    tags: {
      campaigns: "Campagnes",
      management: "Gestion",
    },
    campaignStarter: {
      category: "Gestion des campagnes",
      tag: "Lancement de campagne",
      task: {
        description:
          "Lance les campagnes des nouveaux leads en les passant au statut PENDING",
      },
      errors: {
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur s'est produite lors du traitement de la demande de lancement de campagne",
        },
        invalidTransition:
          "Transition de statut invalide pour le lancement de campagne",
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé",
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
        title: "Lancement de campagne",
        description: "Lancer les campagnes des nouveaux leads",
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Accès refusé", description: "Accès refusé" },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Une erreur s'est produite lors du lancement des campagnes",
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
        fields: {
          timezone: {
            label: "Fuseau horaire",
            description:
              "Fuseau horaire du navigateur pour convertir les heures",
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
          leadsStarted: "Leads lancés",
          leadsSkipped: "Leads ignorés",
          executionTimeMs: "Durée d'exécution (ms)",
          errors: "Erreurs",
          quotaDetails: "Détails du quota",
        },
        success: {
          title: "Lancement de campagne terminé",
          description: "Le lancement de campagne s'est bien exécuté",
        },
      },
      get: {
        title: "Lire la config du lancement de campagne",
        description: "Récupérer la configuration du lancement de campagne",
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Accès refusé", description: "Accès refusé" },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
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
        fields: {
          timezone: {
            label: "Fuseau horaire",
            description:
              "Fuseau horaire du navigateur pour convertir les heures",
          },
        },
        response: {
          dryRun: "Mode simulation",
          minAgeHours: "Âge minimal (heures)",
          enabledDays: "Jours actifs",
          enabledHours: "Heures actives",
          localeConfig: "Configuration des locales",
          leadsPerWeek: "Leads par semaine",
          schedule: "Planification",
          enabled: "Activé",
          priority: "Priorité",
          timeout: "Délai d'expiration",
          retries: "Tentatives",
          retryDelay: "Délai entre tentatives",
        },
        success: {
          title: "Configuration récupérée",
          description: "Configuration du lancement de campagne récupérée",
        },
      },
      put: {
        title: "Config du lancement de campagne",
        description: "Mettre à jour la configuration du lancement de campagne",
        dryRun: {
          label: "Mode simulation",
          description: "Activer le mode simulation pour les tests",
        },
        minAgeHours: {
          label: "Âge minimal (heures)",
          description: "Âge minimal en heures avant de traiter les leads",
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
          label: "Configuration des locales",
          description:
            "Réglages par locale : leads par semaine, jours actifs et heures actives",
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
          description: "Activer ou désactiver le lancement de campagne",
        },
        priority: {
          label: "Priorité",
          description: "Niveau de priorité de l'exécution des campagnes",
        },
        timeout: {
          label: "Délai d'expiration",
          description: "Délai d'expiration en millisecondes",
        },
        retries: {
          label: "Tentatives",
          description: "Nombre de nouvelles tentatives",
        },
        retryDelay: {
          label: "Délai entre tentatives",
          description: "Délai entre deux tentatives, en millisecondes",
        },
        success: {
          title: "Configuration enregistrée",
          description: "Configuration du lancement de campagne enregistrée",
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
        title: "Lancement de campagne",
        titleSaved: "Configuration enregistrée",
        description:
          "Lancez les campagnes des nouveaux leads prêts à être contactés.",
        saving: "Enregistrement...",
        save: "Enregistrer les réglages",
        addLocale: "+ Ajouter une locale",
        guidanceTitle: "Configurer le lancement de campagne",
        guidanceDescription:
          "Définissez la planification, les jours et heures actifs, les objectifs de leads par semaine et les réglages de la tâche cron.",
        runButton: "Lancer les campagnes",
        running: "En cours...",
        done: "Terminé",
        perRunBudget:
          "~{{perRunBudget}} leads/exécution · {{totalRunsPerWeek}} exécutions/semaine",
        perRunBudgetFractional:
          "{{exactBudget}}/exécution · {{totalRunsPerWeek}} exécutions/semaine (fractionnaire, cumulé d'une exécution à l'autre)",
        perRunBudgetZeroHint:
          "(augmentez les leads/semaine ou réduisez la fréquence)",
        sections: {
          general: "Général",
          generalDescription:
            "Commandes principales : activation du lancement de campagne et mode simulation.",
          schedule: "Planification",
          scheduleDescription:
            "Quand les campagnes doivent-elles tourner ? Définissez la planification cron, les jours et les heures actifs.",
          hoursTimezoneNote:
            "Heures dans le fuseau de votre navigateur ({{offset}}). Stockées en UTC sur le serveur.",
          quotas: "Quotas",
          quotasDescription:
            "Nombre de leads à traiter par semaine, réparti par locale.",
          advanced: "Avancé",
          advancedDescription:
            "Réglages d'exécution de la tâche : priorité, délais d'expiration et nouvelles tentatives.",
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
    },
    emailCampaigns: {
      category: "Gestion des campagnes",
      tag: "Campagnes e-mail",
      task: {
        description:
          "Envoie des campagnes e-mail automatiques aux leads selon leur étape et le bon moment",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        server: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur",
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
        description: "Traiter les campagnes e-mail des leads",
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Accès refusé", description: "Accès refusé" },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
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
          description: "Opération terminée avec succès",
        },
      },
      get: {
        title: "Lire la config des campagnes e-mail",
        description:
          "Récupérer la configuration de la tâche de fond des campagnes e-mail",
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Accès refusé", description: "Accès refusé" },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
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
        response: {
          enabled: "Activé",
          dryRun: "Mode simulation",
          batchSize: "Taille de lot",
          maxEmailsPerRun: "E-mails max. par exécution",
          schedule: "Planification",
          priority: "Priorité",
          timeout: "Délai d'expiration",
          retries: "Tentatives",
          retryDelay: "Délai entre tentatives",
        },
        success: {
          title: "Configuration récupérée",
          description: "Configuration des campagnes e-mail récupérée",
        },
      },
      put: {
        title: "Config des campagnes e-mail",
        description:
          "Mettre à jour la configuration de la tâche de fond des campagnes e-mail",
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
          description: "Nombre de leads à traiter par lot (1–100)",
        },
        maxEmailsPerRun: {
          label: "E-mails max. par exécution",
          description:
            "Nombre maximal d'e-mails à envoyer par exécution en arrière-plan (1–1000)",
        },
        schedule: {
          label: "Planification",
          description: "Expression cron qui définit quand lancer les campagnes",
        },
        priority: {
          label: "Priorité",
          description: "Niveau de priorité de l'exécution de la tâche",
        },
        timeout: {
          label: "Délai d'expiration (ms)",
          description: "Durée d'exécution maximale en millisecondes",
        },
        retries: {
          label: "Tentatives",
          description: "Nombre de nouvelles tentatives en cas d'échec",
        },
        retryDelay: {
          label: "Délai entre tentatives (ms)",
          description: "Délai entre deux tentatives, en millisecondes",
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
        save: "Enregistrer les réglages",
        guidanceTitle: "Configurer la tâche de fond des campagnes e-mail",
        guidanceDescription:
          "Activez ou désactivez la tâche cron des campagnes e-mail et réglez sa planification, sa taille de lot et ses paramètres d'exécution.",
        runButton: "Lancer maintenant",
        running: "En cours...",
        done: "Terminé",
        sections: {
          general: "Général",
          generalDescription:
            "Commandes principales : activation de la tâche des campagnes e-mail et mode simulation.",
          schedule: "Planification",
          scheduleDescription:
            "Définissez la planification cron de l'envoi des e-mails.",
          processing: "Traitement",
          processingDescription:
            "Réglez le nombre de leads et d'e-mails à traiter par exécution.",
          advanced: "Avancé",
          advancedDescription:
            "Réglages d'exécution de la tâche : priorité, délais d'expiration et nouvelles tentatives.",
        },
      },
    },
    emails: {
      common: {
        logoPart1: "Next",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "Créez de meilleurs produits, plus vite",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}. Tous droits réservés.",
            helpText: "Une question ? Écrivez-nous à {{config.emails.support}}",
            unsubscribeText: "Vous ne souhaitez plus recevoir ces e-mails ?",
            unsubscribeLink: "Se désabonner",
          },
          socialProof: {
            quotePrefix: "201C",
            quoteSuffix: "201D",
            attribution: "Nom du client, Entreprise",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "Un autre utilisateur d'unbottled.ai",
              previewLeadId: "preview-lead-id",
              previewEmail: "preview@example.com",
              previewBusinessName: "Acme Corp",
              previewContactName: "Utilisateur test",
              previewPhone: "+1234567890",
              previewCampaignId: "preview-campaign-id",
            },
            footer: {
              unsubscribeText:
                "Vous recevez cet e-mail parce que vous l'avez accepté.",
              unsubscribeLink: "Se désabonner",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "Converti au non censuré",
                description:
                  "Un passionné qui partage sa découverte d'unbottled.ai",
                longDescription:
                  "Persona de passionné qui partage une vraie découverte, en toute transparence sur l'affiliation",
                characteristics: {
                  tone: "Ton décontracté, complice",
                  story: "Histoire personnelle sincère",
                  transparency: "Transparence sur l'affiliation",
                  angle: "Angle anti-censure",
                  energy: "Énergie de passionné",
                },
              },
              sideHustle: {
                name: "Revenu d'appoint",
                description:
                  "Un affilié transparent qui partage de vrais cas d'usage",
                longDescription:
                  "Marketeur affilié transparent qui partage chaque semaine de vrais cas d'usage",
                characteristics: {
                  disclosure: "Affiliation annoncée dès le départ",
                  updates: "Cas d'usage chaque semaine",
                  income: "Histoire de revenu passif",
                  proof: "Des preuves concrètes, pas du battage",
                  energy: "Énergie de débrouillard honnête",
                },
              },
              quietRecommendation: {
                name: "Recommandation discrète",
                description:
                  "Un professionnel sobre qui transmet un outil testé",
                longDescription:
                  "Professionnel sobre qui transmet un outil testé pendant des semaines",
                characteristics: {
                  signal: "Court, beaucoup de signal, peu de bruit",
                  specifics: "Pas de battage, que du concret",
                  testing: "Trois semaines de test en toile de fond",
                  comparison: "Comparaison honnête avec ChatGPT",
                  affiliate: "Mention d'affiliation minimale",
                },
              },
              signupNurture: {
                name: "Accompagnement après inscription",
                description: "Séquence d'onboarding pour les nouveaux inscrits",
                longDescription:
                  "E-mails de bienvenue et d'onboarding pour aider les nouveaux utilisateurs à démarrer sur la plateforme",
              },
              retention: {
                name: "Fidélisation",
                description: "Réengagement des abonnés existants",
                longDescription:
                  "E-mails à forte valeur pour garder les abonnés actifs impliqués et leur faire découvrir les fonctionnalités",
              },
              winback: {
                name: "Reconquête",
                description: "Reconquérir les utilisateurs inactifs ou partis",
                longDescription:
                  "Campagne de réactivation ciblant les utilisateurs devenus silencieux ou qui ont résilié",
              },
              newsletterMay2026: {
                name: "Newsletter mai 2026",
                description:
                  "Newsletter ponctuelle sur Cortex, Dreamer, Autopilot et la génération de médias",
                longDescription:
                  "Newsletter de mai 2026 sur les nouveautés produit, envoyée à tous les inscrits, avec un aveu honnête sur les bugs et les fonctionnalités phares",
              },
              newsletterNov2026: {
                name: "Newsletter novembre 2026",
                description:
                  "Newsletter ponctuelle de réactivation : un compagnon de votre côté, votre filtre et un modèle par défaut moins cher",
                longDescription:
                  "Newsletter de conversion de novembre 2026 envoyée aux inscrits consentants, axée sur l'esprit compagnon et le modèle par défaut moins cher",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "Annulé par le système",
        },
        abTesting: {
          invalidWeights: "La somme des poids des variantes doit faire 100 %",
          negativeWeight: "Le poids d'une variante doit être positif",
        },
        post: {
          title: "Services",
          description: "Endpoint des services",
          form: {
            title: "Configuration des services",
            description: "Configurer les paramètres des services",
          },
          response: {
            title: "Réponse",
            description: "Données de réponse des services",
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
            server: {
              title: "Erreur serveur",
              description: "Erreur interne du serveur",
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
              title: "Accès refusé",
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
          },
          success: {
            title: "Succès",
            description: "Opération terminée avec succès",
          },
        },
      },
      testMail: {
        category: "Leads",
        tags: {
          campaigns: "Campagnes",
          leads: "Leads",
        },
        post: {
          title: "E-mail de test",
          description:
            "Envoyer un e-mail de test avec des données de lead personnalisées",
          form: {
            title: "Configuration de l'e-mail de test",
            description:
              "Configurer les paramètres de l'e-mail de test et les données du lead",
          },
          campaignType: {
            label: "Type de campagne",
            description: "Type de campagne e-mail",
            placeholder: "Saisissez le type de campagne",
          },
          emailJourneyVariant: {
            label: "Variante du parcours e-mail",
            description: "Variante de test A/B du parcours e-mail",
            placeholder: "Choisissez une variante de parcours",
          },
          emailCampaignStage: {
            label: "Étape de la campagne e-mail",
            description: "Étape actuelle de la campagne e-mail",
            placeholder: "Choisissez une étape de campagne",
          },
          testEmail: {
            label: "Adresse e-mail de test",
            description: "Adresse e-mail qui recevra l'e-mail de test",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "Données du lead",
            description: "Informations du lead pour le rendu du modèle",
            businessName: {
              label: "Nom de l'entreprise",
              description: "Nom de l'entreprise",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "Nom du contact",
              description: "Nom de la personne à contacter",
              placeholder: "Jean Dupont",
            },
            website: {
              label: "Site web",
              description: "URL du site de l'entreprise",
              placeholder: "https://example.com",
            },
            country: {
              label: "Pays",
              description: "Code pays",
              placeholder: "GLOBAL",
            },
            language: {
              label: "Langue",
              description: "Code de la langue préférée",
              placeholder: "en",
            },
            status: {
              label: "Statut",
              description: "Statut du lead",
              placeholder: "NEW",
            },
            source: {
              label: "Source",
              description: "Source du lead",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "Notes",
              description: "Notes complémentaires sur le lead",
              placeholder: "Saisissez des notes complémentaires",
            },
          },
          response: {
            title: "Résultat de l'e-mail de test",
            description: "Résultat de l'envoi de l'e-mail de test",
            success: {
              content: "Succès",
            },
            messageId: {
              content: "ID du message",
            },
            testEmail: {
              content: "E-mail de test",
            },
            subject: {
              content: "Objet de l'e-mail",
            },
            sentAt: {
              content: "Envoyé le",
            },
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
            server: {
              title: "Erreur serveur",
              description: "Erreur interne du serveur",
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
              title: "Accès refusé",
              description: "Accès refusé",
            },
            notFound: {
              title: "Introuvable",
              description: "Ressource introuvable",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Il y a des modifications non enregistrées",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit de données s'est produit",
            },
            templateNotFound: {
              title: "Modèle introuvable",
              description: "Aucun modèle d'e-mail trouvé pour ces paramètres",
            },
            sendingFailed: {
              title: "Échec de l'envoi",
              description: "Impossible d'envoyer l'e-mail de test",
            },
          },
          success: {
            title: "Succès",
            description: "E-mail de test envoyé",
          },
          selectionCriteria: "Critères de sélection SMTP",
          widget: {
            title: "Envoyer un e-mail de test",
            send: "Envoyer l'e-mail de test",
            sending: "Envoi...",
            successMessage: "E-mail de test envoyé",
            sentTo: "Envoyé à : ",
            subject: "Objet : ",
            sentAt: "Envoyé le : ",
            campaignConfig: "Config de campagne",
            sendAnother: "En envoyer un autre",
          },
        },
      },
    },
  },
  create: {
    category: "Leads",
    tags: {
      leads: "Leads",
      create: "Créer",
    },

    enums: {
      leadSource: {
        website: "Site web",
        socialMedia: "Réseaux sociaux",
        emailCampaign: "Campagne e-mail",
        referral: "Parrainage",
        csvImport: "Import CSV",
      },
    },
    widget: {
      headerLeadCreated: "Lead créé",
      headerCreateLead: "Créer un lead",
      subheaderFillDetails: "Remplissez les informations ci-dessous",
      fallbackLeadName: "Lead",
      buttonCopyId: "Copier l'ID",
      buttonViewLead: "Voir le lead",
      buttonEditLead: "Modifier le lead",
      buttonBackToList: "Retour à la liste",
    },
    post: {
      title: "Créer un lead",
      description: "Créer un nouveau lead dans le système",
      backButton: {
        label: "Retour aux leads",
      },
      submitButton: {
        label: "Créer le lead",
        loadingText: "Création du lead...",
      },
      form: {
        title: "Formulaire de nouveau lead",
        description: "Saisissez les informations pour créer un nouveau lead",
      },
      contactInfo: {
        title: "Coordonnées",
        description: "Coordonnées principales du lead",
      },
      email: {
        label: "Adresse e-mail",
        description: "Adresse e-mail principale pour les échanges",
        placeholder: "jean@example.com",
      },
      businessName: {
        label: "Nom de l'entreprise",
        description: "Nom de la société ou de l'entreprise",
        placeholder: "Exemple SARL",
      },
      phone: {
        label: "Numéro de téléphone",
        description: "Numéro de téléphone avec l'indicatif pays",
        placeholder: "+1234567890",
      },
      website: {
        label: "Site web",
        description: "URL du site de l'entreprise",
        placeholder: "https://example.com",
      },
      locationPreferences: {
        title: "Localisation et préférences",
        description: "Préférences géographiques et linguistiques",
      },
      country: {
        label: "Pays",
        description: "Implantation de l'entreprise ou marché cible",
        placeholder: "Choisissez un pays",
      },
      language: {
        label: "Langue",
        description: "Langue de communication préférée",
        placeholder: "Choisissez une langue",
      },
      leadDetails: {
        title: "Détails du lead",
        description: "Informations complémentaires sur le lead",
      },
      source: {
        label: "Source du lead",
        description: "Comment le lead a été acquis",
        placeholder: "Choisissez une source",
      },
      notes: {
        label: "Notes",
        description: "Notes ou commentaires complémentaires",
        placeholder: "Saisissez des informations complémentaires...",
      },
      response: {
        title: "Lead créé",
        description: "Détails du lead nouvellement créé",
        summary: {
          title: "Récapitulatif du lead",
          id: "ID du lead",
          businessName: "Nom de l'entreprise",
          email: "Adresse e-mail",
          status: "Statut du lead",
        },
        contactDetails: {
          title: "Coordonnées",
          phone: "Numéro de téléphone",
          website: "URL du site web",
          country: "Pays",
          language: "Langue",
        },
        trackingInfo: {
          title: "Informations de suivi",
          source: "Source du lead",
          emailsSent: "Nombre d'e-mails",
          currentCampaignStage: "Étape de campagne",
        },
        metadata: {
          title: "Métadonnées",
          notes: "Notes",
          createdAt: "Date de création",
          updatedAt: "Dernière mise à jour",
        },
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour créer des leads",
        },
        validation: {
          title: "Erreur de validation",
          description: "Informations du lead invalides",
        },
        server: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur pendant la création du lead",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inconnue s'est produite pendant la création du lead",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau pendant la création du lead",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé à la création de leads",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource nécessaire à la création du lead introuvable",
        },
        conflict: {
          title: "Conflit",
          description:
            "Le lead existe déjà ou un conflit de données s'est produit",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description:
            "Le formulaire du lead contient des modifications non enregistrées",
        },
      },
      success: {
        title: "Lead créé",
        description: "Lead créé",
      },
    },
    email: {
      welcome: {
        subject: "Bienvenue chez {{companyName}}",
        title: "Bienvenue chez {{companyName}}, {{businessName}} !",
        preview: "Bienvenue : voici comment démarrer",
        greeting:
          "Bienvenue chez {{companyName}}, {{businessName}} ! Ravis de vous compter parmi nous.",
        defaultName: "vous",
        introduction:
          "Merci de votre intérêt. Vos informations nous sont bien parvenues, et c'est un humain qui les lit.",
        nextSteps: {
          title: "Et maintenant ?",
          step1Number: "1.",
          step1:
            "Lancez une discussion tout de suite. Sans configuration, sans carte bancaire.",
          step2Number: "2.",
          step2: "Une question ? Répondez à cet e-mail. Un humain le lit.",
          step3Number: "3.",
          step3: "Nous répondons dès que possible.",
        },
        cta: {
          getStarted: "Commencer à discuter",
        },
        support:
          "Une question ? Répondez à cet e-mail ou écrivez-nous à {{supportEmail}}",
        error: {
          noEmail:
            "Impossible d'envoyer l'e-mail de bienvenue : aucune adresse e-mail fournie",
        },
      },
      admin: {
        newLead: {
          subject: "Nouveau lead : {{businessName}}",
          title: "Nouveau lead créé",
          preview: "Nouveau lead de {{businessName}} à relancer",
          message:
            "Un nouveau lead de {{businessName}} a été créé dans le système et demande votre attention.",
          leadDetails: "Détails du lead",
          businessName: "Nom de l'entreprise",
          email: "E-mail",
          phone: "Téléphone",
          website: "Site web",
          source: "Source",
          status: "Statut",
          notes: "Notes",
          notProvided: "Non renseigné",
          viewLead: "Voir les détails du lead",
          viewAllLeads: "Voir tous les leads",
          error: {
            noData:
              "Impossible d'envoyer la notification admin : aucune donnée de lead fournie",
          },
          defaultName: "Nouveau lead",
        },
      },
      error: {
        general: {
          internal_server_error: "Une erreur interne du serveur s'est produite",
        },
      },
    },
  },
  export: {
    category: "Leads",
    tags: {
      leads: "Leads",
      export: "Export",
    },

    get: {
      title: "Exporter les leads",
      description: "Exporter les données des leads dans un fichier",
      form: {
        title: "Configuration de l'export",
        description: "Configurer les paramètres et filtres de l'export",
      },
      format: {
        label: "Format d'export",
        description: "Format du fichier exporté",
      },
      status: {
        label: "Statut du lead",
        description: "Filtrer par statut du lead",
      },
      country: {
        label: "Pays",
        description: "Filtrer par pays",
        placeholder: "Choisissez un pays",
      },
      language: {
        label: "Langue",
        description: "Filtrer par langue",
        placeholder: "Choisissez une langue",
      },
      source: {
        label: "Source du lead",
        description: "Filtrer par source du lead",
        placeholder: "Choisissez une source",
      },
      search: {
        label: "Recherche",
        description: "Rechercher des leads par texte",
        placeholder: "Rechercher des leads...",
      },
      dateFrom: {
        label: "Date de début",
        description: "Exporter les leads créés à partir de cette date",
      },
      dateTo: {
        label: "Date de fin",
        description: "Exporter les leads créés jusqu'à cette date",
      },
      includeMetadata: {
        label: "Inclure les métadonnées",
        description: "Inclure les dates de création et de mise à jour",
      },
      includeEngagementData: {
        label: "Inclure les données d'engagement",
        description: "Inclure le suivi des e-mails et les données de campagne",
      },
      response: {
        title: "Fichier d'export",
        description: "Fichier d'export généré avec les données des leads",
        fileName: "Nom du fichier",
        fileContent: "Contenu du fichier (Base64)",
        mimeType: "Type MIME",
        totalRecords: "Total des enregistrements",
        exportedAt: "Exporté le",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour exporter des leads",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres ou filtres d'export invalides",
        },
        server: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur pendant l'export",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite pendant l'export",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau pendant l'export",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé à l'export des leads",
        },
        notFound: {
          title: "Aucune donnée",
          description: "Aucun lead ne correspond aux critères d'export",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données pendant l'export",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description:
            "Le formulaire d'export contient des modifications non enregistrées",
        },
      },
      success: {
        title: "Export terminé",
        description: "Export des leads terminé",
      },
    },
    widget: {
      exportLeads: "Exporter les leads",
      import: "Importer",
      viewList: "Voir la liste",
      importLeadsTitle: "Importer des leads",
      viewLeadsListTitle: "Voir la liste des leads",
      copyCsvTitle: "Copier le contenu CSV dans le presse-papiers",
      generatingExport: "Génération de l'export…",
      generatingExportHint:
        "Cela peut prendre un moment pour les gros volumes de données",
      exportReady: "Export prêt",
      fileReadyToDownload: "Votre fichier est prêt à être téléchargé",
      records: "Enregistrements",
      format: "Format",
      fileSize: "Taille du fichier",
      copied: "Copié !",
      copy: "Copier",
      download: "Télécharger",
      exportedAt: "Exporté le :",
      nextSteps: "Étapes suivantes :",
      viewLeads: "Voir les leads",
      importLeads: "Importer des leads",
      configureExport: "Configurer l'export",
      configureExportHint:
        "Choisissez le format et les filtres ci-dessous, puis cliquez sur Exporter pour générer votre fichier",
      formatLabel: "Format",
      formatHint: "Choisissez CSV ou Excel (XLSX)",
      statusFilter: "Filtre de statut",
      statusFilterHint: "N'exporter que les leads ayant un statut précis",
      dateRange: "Période",
      dateRangeHint: "Limiter l'export à une période précise",
      metadataEngagement: "Métadonnées et engagement",
      metadataEngagementHint:
        "Ajoutez si besoin des colonnes supplémentaires pour une analyse avancée",
      viewLeadsList: "Voir la liste des leads",
      excelSpreadsheet: "Tableur Excel",
      csvFile: "Fichier CSV",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
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
      leadSource: {
        website: "Site web",
        socialMedia: "Réseaux sociaux",
        emailCampaign: "Campagne e-mail",
        referral: "Parrainage",
        csvImport: "Import CSV",
      },
    },
    headers: {
      email: "E-mail",
      businessName: "Nom de l'entreprise",
      contactName: "Nom du contact",
      phone: "Téléphone",
      country: "Pays",
      language: "Langue",
      status: "Statut",
      source: "Source",
      website: "Site web",
      notes: "Notes",
      campaignStage: "Étape de campagne",
      emailsSent: "E-mails envoyés",
      emailsOpened: "E-mails ouverts",
      emailsClicked: "E-mails cliqués",
      lastEmailSent: "Dernier e-mail envoyé",
      lastEngagement: "Dernier engagement",
      unsubscribedAt: "Désabonné le",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
      lastEngagementAt: "Dernier engagement",
      metadata: "Métadonnées",
      ipAddress: "Adresse IP",
      userAgent: "User agent",
      deviceType: "Type d'appareil",
      browser: "Navigateur",
      os: "Système",
      referralCode: "Code de parrainage",
    },
  },
  import: {
    tags: {
      import: "Import",
      leads: "Leads",
      csv: "CSV",
    },

    category: "Import de données",
    post: {
      title: "Importer des leads",
      description: "Importer des leads depuis un fichier CSV",
      form: {
        title: "Configuration de l'import",
        description: "Configurer les paramètres de l'import des leads",
      },
      file: {
        label: "Fichier CSV",
        description: "Contenu du fichier CSV (encodé en base64)",
        placeholder: "Collez le contenu CSV encodé en base64",
        helpText: "Importez un fichier CSV contenant les données des leads",
      },
      fileName: {
        label: "Nom du fichier",
        description: "Nom du fichier CSV",
        placeholder: "leads.csv",
        helpText: "Donnez un nom de fichier parlant",
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
        description: "Pays par défaut pour les leads sans pays",
        helpText: "Choisissez le code pays par défaut",
      },
      defaultLanguage: {
        label: "Langue par défaut",
        description: "Langue par défaut pour les leads sans langue",
        helpText: "Choisissez le code de langue par défaut",
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
        description: "Traiter les gros imports par blocs en arrière-plan",
        helpText: "À activer pour les fichiers de plus de 1000 lignes",
      },
      batchSize: {
        label: "Taille de lot",
        description: "Nombre de lignes à traiter par lot",
        helpText: "Recommandé : 2000 lignes par lot",
      },
      response: {
        batchId: "ID du lot",
        totalRows: "Total des lignes",
        successfulImports: "Imports réussis",
        failedImports: "Imports échoués",
        duplicateEmails: "E-mails en double",
        errors: "Erreurs d'import",
        summary: "Récapitulatif de l'import",
        isChunkedProcessing: "Traitement par blocs utilisé",
        jobId: "ID de la tâche de fond",
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
          title: "Accès refusé",
          description: "Accès refusé à l'import des leads",
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
        description: "L'import des leads a bien démarré",
      },
      widget: {
        headerTitle: "Importer des leads depuis un CSV",
        exportTemplateButton: "Exporter le modèle",
        importGuideTitle: "Guide d'import",
        importGuideSubtitle:
          "Importez un fichier CSV avec les colonnes suivantes :",
        importGuideNote:
          "Seul {{email}} est obligatoire. Toutes les autres colonnes sont facultatives et reprennent les valeurs par défaut configurées ci-dessous.",
        fileRequirementsTitle: "Exigences du fichier",
        fileRequirementFormat:
          "Format : CSV (valeurs séparées par des virgules, encodage UTF-8)",
        fileRequirementHeader:
          "La première ligne doit être l'en-tête avec les noms de colonnes",
        fileRequirementSize: "Taille maximale recommandée : 50 Mo par import",
        fileRequirementChunked:
          "Pour les fichiers de plus de ~5 000 lignes, activez {{chunkedProcessing}} pour éviter les délais d'expiration",
        chunkedProcessingLabel: "Traitement par blocs",
        downloadTemplateLink: "Télécharger le modèle CSV",
        loadingText: "Import des leads…",
        backgroundProcessingTitle: "Traitement en arrière-plan",
        backgroundProcessingNote:
          "Gros import mis en file sous la tâche {{jobId}}. Traitement de {{totalRows}} lignes en arrière-plan.",
        checkJobStatusButton: "Voir l'état de la tâche",
        stopJobButton: "Arrêter la tâche",
        retryFailedButton: "Relancer les échecs",
        statTotalRows: "Total des lignes",
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
        importErrorsTitle: "{{count}} erreurs d'import",
        errorRowLabel: "Ligne {{row}}",
        findLeadButton: "Trouver le lead",
      },
    },
    process: {
      tag: "Traitement des imports",
      post: {
        title: "Traiter les tâches d'import",
        titleShort: "Traiter l'import",
        description: "Traiter les tâches d'import CSV en attente",
        container: {
          title: "Configuration du traitement des imports",
          description: "Configurer les paramètres du traitement des imports",
        },
        fields: {
          maxJobsPerRun: {
            label: "Tâches max. par exécution",
            description: "Nombre maximal de tâches à traiter par exécution",
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
            label: "ID de la tâche elle-même",
            description:
              "ID interne de la tâche, pour son nettoyage après traitement",
          },
        },
        response: {
          jobsProcessed: "Tâches traitées",
          totalRowsProcessed: "Total des lignes traitées",
          successfulImports: "Imports réussis",
          failedImports: "Imports échoués",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès refusé",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Une erreur s'est produite pendant le traitement des imports",
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
          title: "Lire une tâche d'import",
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
            title: "État de la tâche d'import",
            description: "État et avancement actuels de la tâche d'import",
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
              content: "État de la tâche",
            },
            progress: {
              title: "Avancement de l'import",
              description: "Avancement et statistiques actuels de l'import",
            },
            totalRows: {
              content: "Total des lignes",
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
              description: "Réglages actuels de la tâche",
            },
            currentBatchStart: {
              content: "Début du lot actuel",
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
              description: "Authentification requise pour voir les tâches",
            },
            forbidden: {
              title: "Accès refusé",
              description: "Vous n'avez pas le droit de voir cette tâche",
            },
            notFound: {
              title: "Tâche introuvable",
              description: "Aucune tâche d'import avec cet ID",
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
          title: "Modifier une tâche d'import",
          description: "Modifier les réglages d'une tâche d'import",
          jobId: {
            label: "ID de la tâche",
            description: "Identifiant unique de la tâche d'import",
          },
          form: {
            title: "Modifier les réglages de la tâche",
            description: "Modifier la configuration de la tâche d'import",
          },
          settings: {
            title: "Réglages de la tâche",
            description: "Réglages de configuration de la tâche d'import",
          },
          batchSize: {
            label: "Taille de lot",
            description: "Nombre de lignes à traiter par lot",
            placeholder: "100",
          },
          maxRetries: {
            label: "Tentatives max.",
            description:
              "Nombre maximal de nouvelles tentatives pour les lignes en échec",
            placeholder: "3",
          },
          response: {
            title: "Informations de la tâche mise à jour",
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
              content: "État de la tâche",
            },
            progress: {
              title: "Avancement de l'import",
              description: "Avancement et statistiques actuels de l'import",
            },
            totalRows: {
              content: "Total des lignes",
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
              description: "Réglages actuels de la tâche",
            },
            currentBatchStart: {
              content: "Début du lot actuel",
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
              description: "Authentification requise pour modifier les tâches",
            },
            forbidden: {
              title: "Accès refusé",
              description: "Vous n'avez pas le droit de modifier cette tâche",
            },
            notFound: {
              title: "Tâche introuvable",
              description: "Aucune tâche d'import avec cet ID",
            },
            server: {
              title: "Erreur serveur",
              description:
                "Une erreur s'est produite lors de la modification de la tâche",
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
              title: "Conflit de modification",
              description: "La tâche a été modifiée par un autre utilisateur",
            },
          },
          success: {
            title: "Succès",
            description: "Tâche d'import mise à jour",
          },
        },
        delete: {
          title: "Supprimer une tâche d'import",
          description: "Supprimer une tâche d'import précise",
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
              content: "État de réussite",
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
              description: "Vous n'avez pas le droit de supprimer cette tâche",
            },
            notFound: {
              title: "Tâche introuvable",
              description: "Aucune tâche d'import avec cet ID",
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
            title: "Relancer une tâche d'import",
            description: "Relancer une tâche d'import en échec",
            jobId: {
              label: "ID de la tâche",
              description: "Identifiant unique de la tâche d'import à relancer",
            },
            form: {
              title: "Relancer la tâche d'import",
              description: "Relancer la tâche d'import en échec",
            },
            response: {
              title: "Résultat de la relance",
              description: "Résultat de l'opération de relance",
              success: {
                content: "État de réussite",
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
                description:
                  "Authentification requise pour relancer des tâches",
              },
              forbidden: {
                title: "Accès refusé",
                description: "Vous n'avez pas le droit de relancer cette tâche",
              },
              notFound: {
                title: "Tâche introuvable",
                description: "Aucune tâche d'import avec cet ID",
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
            title: "Arrêter une tâche d'import",
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
                content: "État de réussite",
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
                description: "Vous n'avez pas le droit d'arrêter cette tâche",
              },
              notFound: {
                title: "Tâche introuvable",
                description: "Aucune tâche d'import avec cet ID",
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
            title: "État de la tâche d'import",
            loadingJobStatus: "Chargement de l'état de la tâche…",
            totalRows: "Total des lignes",
            processed: "Traitées",
            imported: "Importées",
            failed: "Échecs",
            duplicates: "Doublons",
            progress: "Avancement",
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
                  processing: "En traitement",
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
            viewJobStatus: "Voir l'état de la tâche",
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
        title: "État des tâches d'import",
        description: "Lister et suivre les tâches d'import CSV",
        form: {
          title: "Filtres des tâches",
          description: "Filtrer les tâches d'import par état et pagination",
        },
        filters: {
          title: "Filtres",
          description: "Options de filtre des tâches d'import",
        },
        status: {
          label: "État de la tâche",
          description: "Filtrer par état de la tâche",
          placeholder: "Choisissez un état",
        },
        limit: {
          label: "Résultats par page",
          description: "Nombre de tâches à renvoyer",
          placeholder: "50",
        },
        offset: {
          label: "Décalage de page",
          description: "Nombre de tâches à sauter",
          placeholder: "0",
        },
        response: {
          title: "Tâches d'import",
          description: "Liste des tâches d'import avec leur état actuel",
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
              "Authentification requise pour voir les tâches d'import",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Accès refusé aux tâches d'import",
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
            description: "Il y a des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données s'est produit",
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
          description: "Réglez votre import CSV pour un résultat optimal",
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
            "Format accepté : CSV avec valeurs séparées par des virgules. La première ligne doit contenir les en-têtes de colonnes.",
        },
        fileName: {
          label: "Nom du fichier",
          description: "Nom de cet import (pour vous y retrouver)",
          placeholder: "ex. : Import leads janvier 2024",
        },
        domain: {
          label: "Domaine d'import",
          description: "Quel type de données importez-vous ?",
          placeholder: "Choisissez un type de données...",
        },
        processingSection: {
          title: "Options de traitement",
          description: "Réglez la façon dont vos données sont traitées",
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
          helpText:
            "Si décoché, les enregistrements existants restent inchangés",
        },
        useChunkedProcessing: {
          label: "Traitement en arrière-plan",
          description: "Traiter les gros fichiers en arrière-plan",
          helpText: "Recommandé au-delà de 500 enregistrements",
        },
        batchSize: {
          label: "Taille de lot",
          description: "Nombre d'enregistrements à traiter à la fois",
          placeholder: "100",
          helpText:
            "Les petits lots sont plus stables, les gros lots plus rapides",
        },
        defaultsSection: {
          title: "Valeurs par défaut (facultatif)",
          description:
            "Définissez des valeurs par défaut pour les enregistrements incomplets",
        },
        defaultCountry: {
          label: "Pays par défaut",
          description: "Pays des enregistrements sans localisation",
          placeholder: "Choisissez un pays...",
        },
        defaultLanguage: {
          label: "Langue par défaut",
          description: "Langue des enregistrements sans préférence de langue",
          placeholder: "Choisissez une langue...",
        },
        response: {
          title: "Résultats de l'import",
          description: "Récapitulatif de votre import CSV",
          basicResults: {
            title: "Résultats de base",
            description: "Statistiques principales de l'import",
          },
          batchId: {
            label: "ID du lot",
          },
          totalRows: {
            label: "Total des lignes",
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
            title: "Détails des erreurs",
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
            description: "Vérifiez votre fichier CSV et vos réglages",
            emptyFile: "Le contenu du fichier CSV est obligatoire",
            emptyFileName: "Donnez un nom à cet import",
            invalidDomain: "Choisissez un domaine d'import valide",
            invalidBatchSize:
              "La taille de lot doit être comprise entre 10 et 1000",
            fileTooLarge:
              "Le fichier dépasse la limite de 10 Mo. Pensez au traitement en arrière-plan.",
          },
          unauthorized: {
            title: "Accès refusé",
            description: "Vous n'avez pas le droit d'importer des données",
          },
          fileTooLarge: {
            title: "Fichier trop volumineux",
            description:
              "Le fichier sélectionné dépasse la taille maximale de 10 Mo",
          },
          server: {
            title: "Échec de l'import",
            description:
              "Une erreur s'est produite pendant le traitement de votre import. Veuillez réessayer.",
          },
          network: {
            title: "Erreur réseau",
            description: "La connexion réseau a échoué pendant l'import",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Vous n'avez pas le droit d'effectuer cet import",
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
            description: "Un conflit s'est produit avec des données existantes",
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
          label: "En traitement",
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
          description: "Le traitement de la tâche est momentanément suspendu",
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
          description: "Listes et campagnes d'e-mailing",
        },
        users: {
          label: "Utilisateurs",
          description: "Utilisateurs du système et informations de compte",
        },
        templates: {
          label: "Modèles",
          description: "Modèles et contenus d'e-mail",
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
          description: "Données au format JavaScript Object Notation",
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
          label: "Données en double",
          description: "L'enregistrement existe déjà dans le système",
        },
        format: {
          label: "Erreur de format",
          description: "Le format du fichier est incorrect ou corrompu",
        },
        processing: {
          label: "Erreur de traitement",
          description:
            "Une erreur s'est produite pendant le traitement des données",
        },
        system: {
          label: "Erreur système",
          description: "Erreur interne du système",
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
      reviewLeads: "Vérifiez vos leads importés dans la gestion des leads",
      startCampaign:
        "Lancez éventuellement une campagne e-mail avec vos nouveaux leads",
      reviewContacts: "Vérifiez vos contacts importés dans la section contacts",
      organizeContacts: "Organisez vos contacts en groupes ou en tags",
      reviewImported:
        "Vérifiez vos données importées dans la section concernée",
      monitorProgress: "Suivez l'avancement dans l'historique des tâches",
      checkJobsList: "Consultez la liste des tâches pour un état détaillé",
    },
    errors: {
      cancel: {
        server: "Impossible d'annuler la tâche d'import",
      },
      retry: {
        server: "Impossible de relancer la tâche d'import",
      },
      delete: {
        server: "Impossible de supprimer la tâche d'import",
      },
      status: {
        server: "Impossible de récupérer l'état de la tâche",
      },
    },
    error: {
      default: "Une erreur s'est produite",
    },
    enums: {
      csvImportJobStatus: {
        pending: "En attente",
        processing: "En traitement",
        completed: "Terminée",
        failed: "Échouée",
      },
      csvImportJobAction: {
        retry: "Relancer",
        delete: "Supprimer",
        stop: "Arrêter",
      },
      importMode: {
        createOnly: "Création seule",
        updateOnly: "Mise à jour seule",
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
        processing: "En traitement",
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
        apiUpload: "Envoi par API",
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
        inApp: "Dans l'app",
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
        notStarted: "Pas commencé",
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
  },
  lead: {
    id: {
      category: "Leads",
      tags: {
        leads: "Leads",
        management: "Gestion",
      },

      get: {
        title: "Détails du lead",
        description: "Récupérer les informations détaillées d'un lead",
        backButton: {
          label: "Retour aux leads",
        },
        editButton: {
          label: "Modifier le lead",
        },
        deleteButton: {
          label: "Supprimer le lead",
        },
        id: {
          label: "ID du lead",
          description: "Identifiant unique du lead",
        },
        form: {
          title: "Demande de détails du lead",
          description: "Paramètres de la demande d'informations sur le lead",
        },
        response: {
          title: "Informations sur le lead",
          description: "Détails complets et historique du lead",
          basicInfo: {
            title: "Informations de base",
            description: "Identification et statut du lead",
          },
          id: {
            content: "ID du lead",
          },
          email: {
            content: "Adresse e-mail",
          },
          businessName: {
            content: "Nom de l'entreprise",
          },
          contactName: {
            content: "Nom du contact",
          },
          status: {
            content: "Statut du lead",
          },
          contactDetails: {
            title: "Coordonnées",
            description: "Coordonnées et préférences",
          },
          phone: {
            content: "Numéro de téléphone",
          },
          website: {
            content: "URL du site web",
          },
          country: {
            content: "Pays",
          },
          language: {
            content: "Langue",
          },
          campaignTracking: {
            title: "Suivi des campagnes",
            description: "Informations de campagne e-mail et de suivi",
          },
          source: {
            content: "Source du lead",
          },
          currentCampaignStage: {
            content: "Étape de campagne actuelle",
          },
          emailJourneyVariant: {
            content: "Variante du parcours e-mail",
          },
          emailsSent: {
            content: "E-mails envoyés",
          },
          lastEmailSentAt: {
            content: "Dernier e-mail envoyé",
          },
          engagement: {
            title: "Indicateurs d'engagement",
            description:
              "Données d'engagement et d'interaction avec les e-mails",
          },
          emailsOpened: {
            content: "E-mails ouverts",
          },
          emailsClicked: {
            content: "E-mails cliqués",
          },
          lastEngagementAt: {
            content: "Dernier engagement",
          },
          unsubscribedAt: {
            content: "Désabonné le",
          },
          conversion: {
            title: "Suivi des conversions",
            description: "Suivi de la conversion et des étapes clés du lead",
          },
          convertedUserId: {
            content: "ID de l'utilisateur converti",
          },
          convertedAt: {
            content: "Converti le",
          },
          signedUpAt: {
            content: "Inscrit le",
          },
          subscriptionConfirmedAt: {
            content: "Abonnement confirmé le",
          },
          metadata: {
            title: "Informations complémentaires",
            description: "Notes et métadonnées",
            content: "Métadonnées",
          },
          notes: {
            content: "Notes",
          },
          createdAt: {
            content: "Créé le",
          },
          updatedAt: {
            content: "Mis à jour le",
          },
          identity: {
            title: "Appareil et identité",
            description: "Identité de suivi et informations sur l'appareil",
          },
          ipAddress: {
            content: "Adresse IP",
          },
          userAgent: {
            content: "User agent",
          },
          deviceType: {
            content: "Type d'appareil",
          },
          browser: {
            content: "Navigateur",
          },
          os: {
            content: "Système d'exploitation",
          },
          referralCode: {
            content: "Code de parrainage",
          },
          lifecycle: {
            title: "Cycle de vie",
            description: "Autres horodatages du cycle de vie",
          },
          bouncedAt: {
            content: "Rejeté le",
          },
          invalidAt: {
            content: "Invalidé le",
          },
          campaignStartedAt: {
            content: "Campagne lancée le",
          },
          linkedLeads: {
            title: "Leads liés",
            description: "Leads identifiés comme la même personne",
            linkedLeadId: {
              content: "ID du lead lié",
            },
            linkReason: {
              content: "Motif du lien",
            },
            linkedAt: {
              content: "Lié le",
            },
            email: {
              content: "E-mail",
            },
            businessName: {
              content: "Nom de l'entreprise",
            },
            status: {
              content: "Statut",
            },
            ipAddress: {
              content: "Adresse IP",
            },
            userAgent: {
              content: "User agent",
            },
            createdAt: {
              content: "Créé le",
            },
          },
          linkedUsers: {
            title: "Comptes utilisateur liés",
            description: "Comptes utilisateur associés à ce lead",
            userId: {
              content: "ID utilisateur",
            },
            linkReason: {
              content: "Motif du lien",
            },
            linkedAt: {
              content: "Lié le",
            },
            email: {
              content: "E-mail",
            },
            publicName: {
              content: "Nom affiché",
            },
          },
          referralHistory: {
            title: "Historique de parrainage",
            description:
              "Codes de parrainage sur lesquels ce lead a cliqué avant de s'inscrire",
            code: {
              content: "Code de parrainage",
            },
            ownerUserId: {
              content: "Propriétaire du code",
            },
            clickedAt: {
              content: "Cliqué le",
            },
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "L'ID de lead fourni est invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description:
              "Authentification requise pour voir les détails du lead",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Vous n'avez pas le droit de voir ce lead",
          },
          notFound: {
            title: "Lead introuvable",
            description: "Aucun lead avec cet ID",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Une erreur s'est produite lors de la récupération des détails du lead",
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
            title: "Conflit de données",
            description: "Les données du lead ont été modifiées",
          },
        },
        success: {
          title: "Succès",
          description: "Détails du lead récupérés",
        },
      },
      patch: {
        title: "Modifier le lead",
        description: "Modifier les informations et le statut du lead",
        backButton: {
          label: "Retour au lead",
        },
        deleteButton: {
          label: "Supprimer le lead",
        },
        submitButton: {
          label: "Mettre à jour le lead",
          loadingText: "Mise à jour du lead...",
        },
        id: {
          label: "ID du lead",
          description: "Identifiant unique du lead à modifier",
        },
        form: {
          title: "Modifier le lead",
          description: "Modifier les informations du lead",
        },
        updates: {
          title: "Modifications du lead",
          description: "Champs à mettre à jour",
        },
        basicInfo: {
          title: "Informations de base",
          description: "Modifier les informations principales du lead",
        },
        email: {
          label: "Adresse e-mail",
          description: "Adresse e-mail du lead",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "Nom de l'entreprise",
          description: "Nom de l'entreprise",
          placeholder: "Acme Corporation",
        },
        contactName: {
          label: "Nom du contact",
          description: "Personne à contacter en priorité",
          placeholder: "Jean Dupont",
        },
        status: {
          label: "Statut du lead",
          description: "Statut actuel du lead",
          placeholder: "Choisissez un statut",
        },
        contactDetails: {
          title: "Coordonnées",
          description: "Modifier les coordonnées",
        },
        phone: {
          label: "Numéro de téléphone",
          description: "Numéro de téléphone du contact",
          placeholder: "+1234567890",
        },
        website: {
          label: "Site web",
          description: "URL du site de l'entreprise",
          placeholder: "https://example.com",
        },
        country: {
          label: "Pays",
          description: "Pays de l'entreprise",
          placeholder: "Choisissez un pays",
        },
        language: {
          label: "Langue",
          description: "Langue préférée",
          placeholder: "Choisissez une langue",
        },
        campaignManagement: {
          title: "Gestion des campagnes",
          description: "Gérer les réglages de campagne",
        },
        source: {
          label: "Source du lead",
          description: "Origine du lead",
          placeholder: "Choisissez une source",
        },
        currentCampaignStage: {
          label: "Étape de campagne",
          description: "Étape actuelle de la campagne e-mail",
          placeholder: "Choisissez une étape",
        },
        additionalDetails: {
          title: "Détails complémentaires",
          description: "Notes et métadonnées",
        },
        notes: {
          label: "Notes",
          description: "Notes internes sur le lead",
          placeholder: "Ajoutez des notes ici",
        },
        metadata: {
          label: "Métadonnées",
          description: "Métadonnées complémentaires (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "ID de l'utilisateur converti",
          description: "ID du compte utilisateur converti",
          placeholder: "ID utilisateur",
        },
        subscriptionConfirmedAt: {
          label: "Abonnement confirmé le",
          description: "Date de confirmation de l'abonnement",
          placeholder: "Choisissez une date",
        },
        response: {
          title: "Lead mis à jour",
          description: "Informations du lead mises à jour",
          basicInfo: {
            title: "Informations de base",
            description: "Informations principales du lead mises à jour",
          },
          id: {
            content: "ID du lead",
          },
          email: {
            content: "Adresse e-mail",
          },
          businessName: {
            content: "Nom de l'entreprise",
          },
          contactName: {
            content: "Nom du contact",
          },
          status: {
            content: "Statut du lead",
          },
          contactDetails: {
            title: "Coordonnées",
            description: "Coordonnées mises à jour",
          },
          phone: {
            content: "Numéro de téléphone",
          },
          website: {
            content: "URL du site web",
          },
          country: {
            content: "Pays",
          },
          language: {
            content: "Langue",
          },
          campaignTracking: {
            title: "Suivi des campagnes",
            description: "Informations de campagne mises à jour",
          },
          source: {
            content: "Source du lead",
          },
          currentCampaignStage: {
            content: "Étape de campagne actuelle",
          },
          emailJourneyVariant: {
            content: "Variante du parcours e-mail",
          },
          emailsSent: {
            content: "E-mails envoyés",
          },
          lastEmailSentAt: {
            content: "Dernier e-mail envoyé",
          },
          engagement: {
            title: "Indicateurs d'engagement",
            description: "Données d'engagement avec les e-mails",
          },
          emailsOpened: {
            content: "E-mails ouverts",
          },
          emailsClicked: {
            content: "E-mails cliqués",
          },
          lastEngagementAt: {
            content: "Dernier engagement",
          },
          unsubscribedAt: {
            content: "Désabonné le",
          },
          conversion: {
            title: "Suivi des conversions",
            description: "Suivi des étapes de conversion",
          },
          convertedUserId: {
            content: "ID de l'utilisateur converti",
          },
          convertedAt: {
            content: "Converti le",
          },
          signedUpAt: {
            content: "Inscrit le",
          },
          subscriptionConfirmedAt: {
            content: "Abonnement confirmé le",
          },
          metadata: {
            title: "Informations complémentaires",
            description: "Notes et métadonnées",
            content: "Métadonnées",
          },
          notes: {
            content: "Notes",
          },
          createdAt: {
            content: "Créé le",
          },
          updatedAt: {
            content: "Mis à jour le",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Les données fournies sont invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise pour modifier des leads",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Vous n'avez pas le droit de modifier ce lead",
          },
          notFound: {
            title: "Lead introuvable",
            description: "Aucun lead avec cet ID",
          },
          conflict: {
            title: "Conflit de modification",
            description: "Le lead a été modifié par un autre utilisateur",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Une erreur s'est produite lors de la mise à jour du lead",
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
        },
        success: {
          title: "Succès",
          description: "Lead mis à jour",
        },
      },
      post: {
        title: "[id]",
        description: "Endpoint [id]",
        form: {
          title: "Configuration [id]",
          description: "Configurer les paramètres [id]",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse [id]",
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
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
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
            title: "Accès refusé",
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
        },
        success: {
          title: "Succès",
          description: "Opération terminée avec succès",
        },
      },
      enums: {
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
        leadSource: {
          website: "Site web",
          referral: "Parrainage",
          socialMedia: "Réseaux sociaux",
          emailCampaign: "Campagne e-mail",
          csvImport: "Import CSV",
          api: "API",
          manual: "Manuel",
          other: "Autre",
        },
        emailCampaignStage: {
          notStarted: "Pas commencé",
          initial: "Premier contact",
          followup1: "Relance 1",
          followup2: "Relance 2",
          followup3: "Relance 3",
          nurture: "Nurturing",
          reactivation: "Réactivation",
        },
        emailJourneyVariant: {
          uncensoredConvert: "Converti au non censuré",
          sideHustle: "Revenu d'appoint",
          quietRecommendation: "Recommandation discrète",
        },
      },
      widget: {
        loading: "Chargement du lead...",
        notFound: "Lead introuvable.",
        back: "Retour",
        leadFallbackTitle: "Lead",
        edit: "Modifier",
        delete: "Supprimer",
        converted: "Converti",
        quickActions: "Actions rapides",
        editLead: "Modifier le lead",
        sendTestEmail: "Envoyer un e-mail de test",
        viewInSearch: "Voir dans la recherche",
        userProfile: "Profil utilisateur",
        userDetail: "Fiche utilisateur",
        creditHistory: "Historique des crédits",
        campaignFunnel: "Entonnoir de campagne",
        sourceLabel: "Source :",
        lastEmailLabel: "Dernier e-mail :",
        campaignPerformance: "Performance de la campagne",
        emailsSent: "E-mails envoyés",
        opened: "Ouverts",
        clicked: "Cliqués",
        openRate: "Taux d'ouverture",
        clickRate: "Taux de clic",
        clickToOpenRate: "Taux de clic par ouverture",
        contactDetails: "Coordonnées",
        country: "Pays",
        language: "Langue",
        engagement: "Engagement",
        emailsOpened: "E-mails ouverts",
        emailsClicked: "E-mails cliqués",
        lastEngagement: "Dernier engagement",
        unsubscribed: "Désabonné",
        conversion: "Conversion",
        signedUp: "Inscrit",
        convertedAt: "Converti le",
        subscriptionConfirmed: "Abonnement confirmé",
        convertedUserId: "ID de l'utilisateur converti",
        activeSubscriberSince: "Abonné actif depuis",
        viewUserProfile: "Voir le profil utilisateur",
        viewUserDetail: "Voir la fiche utilisateur",
        notesAndMetadata: "Notes et métadonnées",
        notes: "Notes",
        metadata: "Métadonnées",
        created: "Créé",
        lastUpdated: "Dernière mise à jour",
        daysOld: "jours d'ancienneté",
        lastEngaged: "Dernier engagement :",
        ago: "auparavant",
        variant: "Variante :",
        copyEmail: "e-mail",
        copyId: "ID",
        copyPhone: "téléphone",
        copyUserId: "ID utilisateur",
        stageNotStarted: "Pas commencé",
        stageInitial: "Premier contact",
        stageFollowup1: "Relance 1",
        stageFollowup2: "Relance 2",
        stageFollowup3: "Relance 3",
        stageNurture: "Nurturing",
        stageReactivation: "Réactivation",
        tabOverview: "Vue d'ensemble",
        tabDetails: "Détails",
        tabIdentity: "Identité",
        tabBasic: "Base",
        tabCampaign: "Campagne",
        tabAdvanced: "Avancé",
        deviceIdentity: "Appareil et identité",
        ipAddress: "Adresse IP",
        userAgent: "User agent",
        deviceType: "Type d'appareil",
        browser: "Navigateur",
        os: "Système d'exploitation",
        referralCode: "Code de parrainage",
        lifecycleTimestamps: "Cycle de vie",
        bouncedAt: "Rejeté le",
        invalidAt: "Invalidé le",
        campaignStartedAt: "Campagne lancée le",
        linkedLeadsSection: "Leads liés",
        linkedLeadsEmpty: "Aucun lead lié",
        linkedUsersSection: "Comptes utilisateur liés",
        linkedUsersEmpty: "Aucun compte utilisateur lié",
        linkReason: "Motif du lien :",
        linkedAt: "Lié le :",
        copyIp: "IP",
        copyLinkedLeadId: "ID du lead",
        copyUserId2: "ID utilisateur",
      },
      delete: {
        title: "Supprimer le lead",
        description: "Supprimer un lead du système",
        container: {
          title: "Supprimer le lead",
          description:
            "Voulez-vous vraiment supprimer ce lead définitivement ?",
        },
        backButton: {
          label: "Retour au lead",
        },
        submitButton: {
          label: "Supprimer le lead",
          loadingText: "Suppression du lead...",
        },
        actions: {
          delete: "Supprimer le lead",
          deleting: "Suppression du lead...",
        },
        id: {
          label: "ID du lead",
          description: "Identifiant unique du lead à supprimer",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "L'ID de lead fourni est invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise pour supprimer des leads",
          },
          forbidden: {
            title: "Accès refusé",
            description: "Vous n'avez pas le droit de supprimer ce lead",
          },
          notFound: {
            title: "Lead introuvable",
            description: "Aucun lead avec cet ID",
          },
          conflict: {
            title: "Conflit de suppression",
            description:
              "Impossible de supprimer ce lead : des données en dépendent",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Une erreur s'est produite lors de la suppression du lead",
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
        },
        success: {
          title: "Lead supprimé",
          description: "Le lead a été supprimé",
        },
      },
    },
  },
  list: {
    category: "Leads",
    tags: {
      leads: "Leads",
      management: "Gestion",
    },

    get: {
      title: "Lister les leads",
      description: "Récupérer une liste paginée et filtrable de leads",
      createButton: {
        label: "Créer un lead",
      },
      form: {
        title: "Filtres de la liste des leads",
        description: "Configurer les filtres de la liste des leads",
      },
      actions: {
        refresh: "Actualiser",
        refreshing: "Actualisation...",
      },
      page: {
        label: "Numéro de page",
        description: "Numéro de page pour la pagination",
        placeholder: "Saisissez un numéro de page",
      },
      limit: {
        label: "Résultats par page",
        description: "Nombre de résultats affichés par page",
        placeholder: "Saisissez une limite",
      },
      status: {
        label: "Statut du lead",
        description: "Filtrer par statut du lead",
        placeholder: "Choisissez un statut",
      },
      currentCampaignStage: {
        label: "Étape de campagne",
        description: "Filtrer par étape de campagne actuelle",
        placeholder: "Choisissez une étape de campagne",
      },
      source: {
        label: "Source du lead",
        description: "Filtrer par source du lead",
        placeholder: "Choisissez une source",
      },
      country: {
        label: "Pays",
        description: "Filtrer par pays",
        placeholder: "Choisissez des pays",
      },
      language: {
        label: "Langue",
        description: "Filtrer par langue",
        placeholder: "Choisissez des langues",
      },
      search: {
        label: "Recherche",
        description: "Rechercher des leads par nom, e-mail ou entreprise",
        placeholder: "Saisissez un terme de recherche",
      },
      searchPagination: {
        title: "Recherche et pagination",
        description: "Commandes de recherche et de pagination",
      },
      statusFilters: {
        title: "Filtres de statut et de campagne",
        description: "Filtrer par statut, étape de campagne et source",
      },
      locationFilters: {
        title: "Filtres de localisation",
        description: "Filtrer par pays et langue",
      },
      sortingOptions: {
        title: "Options de tri",
        description: "Configurer le tri des résultats",
      },
      sortBy: {
        label: "Trier par",
        description: "Champ de tri des résultats",
        placeholder: "Choisissez un champ de tri",
      },
      sortOrder: {
        label: "Ordre de tri",
        description: "Ordre de tri des résultats",
        placeholder: "Choisissez un ordre de tri",
      },
      response: {
        title: "Réponse de la liste des leads",
        description: "Liste paginée des leads avec métadonnées",
        leads: {
          title: "Détails du lead",
          description: "Informations d'un lead",
          id: "ID du lead",
          email: "Adresse e-mail",
          businessName: "Nom de l'entreprise",
          contactName: "Nom du contact",
          phone: "Numéro de téléphone",
          website: "Site web",
          country: "Pays",
          language: "Langue",
          status: "Statut",
          source: "Source",
          notes: "Notes",
          convertedUserId: "ID de l'utilisateur converti",
          convertedAt: "Converti le",
          signedUpAt: "Inscrit le",
          subscriptionConfirmedAt: "Abonnement confirmé le",
          currentCampaignStage: "Étape de campagne actuelle",
          emailsSent: "E-mails envoyés",
          lastEmailSentAt: "Dernier e-mail envoyé le",
          unsubscribedAt: "Désabonné le",
          emailsOpened: "E-mails ouverts",
          emailsClicked: "E-mails cliqués",
          lastEngagementAt: "Dernier engagement le",
          metadata: "Métadonnées",
          createdAt: "Créé le",
          updatedAt: "Mis à jour le",
        },
        total: "Total des leads",
        page: "Page actuelle",
        limit: "Taille de page",
        totalPages: "Nombre de pages",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour lister les leads",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de filtre invalides",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Erreur interne du serveur lors de la récupération des leads",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inconnue s'est produite lors de la récupération des leads",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors de la récupération des leads",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé à la liste des leads",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucun lead trouvé",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données lors de la récupération des leads",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description:
            "La liste des leads contient des modifications non enregistrées",
        },
      },
      success: {
        title: "Succès",
        description: "Liste des leads récupérée",
      },
      emptySearch: "Aucun lead ne correspond à vos filtres",
      emptyState: "Pas encore de leads",
    },
    widget: {
      converted: "Converti",
      emailsSent: "{{count}} e-mails envoyés",
      openRate: "{{percent}} % d'ouverture",
      clicks: "{{count}} clics",
      stats: "Stats",
      graphs: "Graphiques",
      search: "Recherche",
      export: "Exporter",
      import: "Importer",
      batch: "Lot",
      refresh: "Actualiser",
      view: "Voir",
      edit: "Modifier",
      delete: "Supprimer",
      allSources: "Toutes les sources",
      clearSearch: "Effacer la recherche",
      clearStatusFilter: "Effacer le filtre de statut",
      clearSourceFilter: "Effacer le filtre de source",
      addLead: "Ajouter un lead",
      importCsv: "Importer un CSV",
      pagination: "Page {{page}} sur {{totalPages}} · {{total}} leads",
      tabAll: "Tous",
      tabNew: "Nouveaux",
      tabCampaign: "Campagne",
      tabConfirmed: "Confirmés",
      tabUnsubscribed: "Désabonnés",
      tabBounced: "Rejetés",
      sortNewest: "Plus récents d'abord",
      sortOldest: "Plus anciens d'abord",
      sortEmailsSentHigh: "E-mails envoyés (décroissant)",
      sortEmailsSentLow: "E-mails envoyés (croissant)",
      sortBusinessNameAZ: "Nom d'entreprise (A-Z)",
      sortBusinessNameZA: "Nom d'entreprise (Z-A)",
      linkedCount: "{{count}} liés",
      hasLinkedUser: "Utilisateur",
      referralCode: "Code parr.",
    },
  },
  search: {
    category: "Gestion des leads",
    tags: {
      leads: "Leads",
      search: "Recherche",
    },
    get: {
      title: "Rechercher des leads",
      description: "Rechercher des leads avec filtres et pagination",
      form: {
        title: "Formulaire de recherche de leads",
        description: "Saisissez des critères pour trouver des leads",
      },
      search: {
        label: "Requête",
        description:
          "Terme de recherche pour filtrer les leads par e-mail, nom d'entreprise ou notes",
        placeholder: "Saisissez un terme de recherche...",
      },
      status: {
        label: "Filtre de statut",
        description: "Filtrer les leads par statut",
      },
      limit: {
        label: "Limite de résultats",
        description: "Nombre maximal de résultats à renvoyer (1-100)",
      },
      offset: {
        label: "Décalage des résultats",
        description: "Nombre de résultats à sauter pour la pagination",
      },
      response: {
        title: "Résultats de recherche",
        description:
          "Résultats de recherche paginés avec les données des leads",
        leads: {
          title: "Leads",
          item: "Lead",
        },
        total: "Total des résultats",
        hasMore: "Autres résultats disponibles",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour rechercher des leads",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de recherche invalides",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Erreur interne du serveur lors de la recherche de leads",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inconnue s'est produite lors de la recherche de leads",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors de la recherche de leads",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé à la recherche de leads",
        },
        notFound: {
          title: "Aucun résultat",
          description: "Aucun lead ne correspond aux critères de recherche",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description:
            "Le formulaire de recherche contient des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données lors de la recherche de leads",
        },
      },
      success: {
        title: "Recherche terminée",
        description: "Recherche de leads terminée",
      },
    },
    widget: {
      title: "Rechercher des leads",
      filterLabel: "Filtre :",
      clearFilter: "Effacer",
      noResultsTitle: "Aucun résultat",
      noResultsSubtitle: "Recherchez par e-mail, nom d'entreprise ou téléphone",
      createLead: "Créer un lead",
      noLeadsMatchFilter: "Aucun lead ne correspond aux filtres choisis.",
      clearFilters: "Effacer les filtres",
      loadMore: "Charger plus",
      openRateSuffix: " % ouv.",
      noEmails: "aucun e-mail",
      converted: "Converti",
      emailsSentSuffix: "envoyés",
      copyEmailTitle: "Copier l'e-mail",
      editLeadTitle: "Modifier le lead",
      deleteLeadTitle: "Supprimer le lead",
      statusNew: "Nouveau",
      statusPending: "En attente",
      statusCampaign: "Campagne",
      statusWebUser: "Utilisateur web",
      statusNewsletter: "Newsletter",
      statusInContact: "En contact",
      statusSignedUp: "Inscrit",
      statusSubscribed: "Abonné",
      statusUnsub: "Désabonné",
      statusBounced: "Rejeté",
      statusInvalid: "Invalide",
    },
  },
  stats: {
    title: "Statistiques des leads",
    description:
      "Statistiques et analyses complètes des leads, avec historique",
    category: "Gestion des leads",
    tags: {
      leads: "Leads",
      statistics: "Statistiques",
      analytics: "Analyses",
    },
    container: {
      title: "Filtres des statistiques",
      description:
        "Configurez les filtres et l'affichage des statistiques des leads",
    },
    refresh: "Actualiser",
    sections: {
      timeFilters: "Période et plage de dates",
      comparison: "Réglages de comparaison",
      leadFilters: "Filtres des leads",
      engagement: "Filtres d'engagement",
      conversion: "Filtres de conversion",
      dataCompleteness: "Complétude des données",
      additional: "Filtres supplémentaires",
      searchSort: "Recherche et tri",
    },
    timePeriod: {
      label: "Période",
      description: "Choisissez la période d'agrégation des statistiques",
      hour: "Heure",
      day: "Jour",
      week: "Semaine",
      month: "Mois",
      quarter: "Trimestre",
      year: "Année",
    },
    dateRangePreset: {
      label: "Plage de dates prédéfinie",
      description: "Choisissez une plage de dates prédéfinie",
    },
    dateRange: {
      today: "Aujourd'hui",
      yesterday: "Hier",
      last7Days: "7 derniers jours",
      last30Days: "30 derniers jours",
      last90Days: "90 derniers jours",
      thisWeek: "Cette semaine",
      lastWeek: "Semaine dernière",
      thisMonth: "Ce mois-ci",
      lastMonth: "Mois dernier",
      thisQuarter: "Ce trimestre",
      lastQuarter: "Trimestre dernier",
      thisYear: "Cette année",
      lastYear: "Année dernière",
      custom: "Plage personnalisée",
    },
    dateFrom: {
      label: "Date de début",
      description: "Date de début des statistiques",
    },
    dateTo: {
      label: "Date de fin",
      description: "Date de fin des statistiques",
    },
    chartType: {
      label: "Type de graphique",
      description:
        "Choisissez le type de graphique pour visualiser les données",
      line: "Courbe",
      bar: "Barres",
      area: "Aires",
      pie: "Camembert",
      donut: "Anneau",
    },
    includeComparison: {
      label: "Inclure une comparaison",
      description: "Comparer avec une période précédente",
    },
    comparisonPeriod: {
      label: "Période de comparaison",
      description: "Choisissez la période de référence",
    },
    status: {
      label: "Statut du lead",
      description: "Filtrer par statut du lead",
    },
    source: {
      label: "Source du lead",
      description: "Filtrer par source du lead",
    },
    country: {
      ...regionalCountryNames("fr"),
      label: "Pays",
      description: "Filtrer par pays",
      all: "Tous les pays",
      de: "Allemagne",
      pl: "Pologne",
      fr: "France",
      global: "Monde",
    },
    language: {
      it: "Italien",
      es: "Espagnol",
      sk: "Slovaque",
      label: "Langue",
      description: "Filtrer par langue préférée",
      all: "Toutes les langues",
      en: "Anglais",
      de: "Allemand",
      pl: "Polonais",
      fr: "Français",
    },
    campaignStage: {
      label: "Étape de campagne",
      description: "Filtrer par étape de la campagne e-mail",
    },
    hasEngagement: {
      label: "Avec engagement",
      description: "Filtrer les leads ayant interagi avec un e-mail",
    },
    minEmailsOpened: {
      label: "E-mails ouverts (minimum)",
      description: "Nombre minimal d'e-mails ouverts",
    },
    minEmailsClicked: {
      label: "E-mails cliqués (minimum)",
      description: "Nombre minimal d'e-mails cliqués",
    },
    isConverted: {
      label: "Converti",
      description: "Filtrer les leads convertis",
    },
    hasSignedUp: {
      label: "Inscrit",
      description: "Filtrer les leads inscrits",
    },
    hasConfirmedSubscription: {
      label: "Abonnement confirmé",
      description: "Filtrer les leads dont l'abonnement est confirmé",
    },
    hasBusinessName: {
      label: "Avec nom d'entreprise",
      description: "Filtrer les leads avec un nom d'entreprise",
    },
    hasContactName: {
      label: "Avec nom de contact",
      description: "Filtrer les leads avec un nom de contact",
    },
    hasPhone: {
      label: "Avec téléphone",
      description: "Filtrer les leads avec un numéro de téléphone",
    },
    hasWebsite: {
      label: "Avec site web",
      description: "Filtrer les leads avec un site web",
    },
    hasNotes: {
      label: "Avec notes",
      description: "Filtrer les leads avec des notes",
    },
    sortBy: {
      label: "Trier par",
      description: "Champ de tri des résultats",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Ordre croissant ou décroissant",
    },
    limit: {
      label: "Limite de résultats",
      description: "Nombre maximal de résultats",
    },
    hasUserId: {
      label: "Avec ID utilisateur",
      description: "Filtrer les leads associés à un ID utilisateur",
    },
    emailVerified: {
      label: "E-mail vérifié",
      description: "Filtrer par état de vérification de l'e-mail",
    },
    journeyVariant: {
      label: "Variante de parcours",
      description: "Filtrer par variante du parcours e-mail",
    },
    minEmailsSent: {
      label: "E-mails envoyés (minimum)",
      description: "Nombre minimal d'e-mails envoyés au lead",
    },
    createdAfter: {
      label: "Créé après",
      description: "Filtrer les leads créés après cette date",
    },
    createdBefore: {
      label: "Créé avant",
      description: "Filtrer les leads créés avant cette date",
    },
    updatedAfter: {
      label: "Mis à jour après",
      description: "Filtrer les leads mis à jour après cette date",
    },
    updatedBefore: {
      label: "Mis à jour avant",
      description: "Filtrer les leads mis à jour avant cette date",
    },
    search: {
      label: "Recherche",
      description: "Rechercher des leads par e-mail, nom ou nom d'entreprise",
      placeholder: "Rechercher des leads...",
    },
    engagementLevel: {
      high: "Engagement élevé",
      medium: "Engagement moyen",
      low: "Engagement faible",
      none: "Aucun engagement",
    },
    response: {
      overview: "Vue d'ensemble",
      emailPerformance: "Performance des e-mails",
      conversionRates: "Taux de conversion",
      activityTimeline: "Chronologie de l'activité",
      campaignDistribution: "Répartition par campagne",
      geographicDistribution: "Répartition géographique et par source",
      dataQuality: "Qualité des données",
      performanceMetrics: "Indicateurs de performance",
      engagementLevels: "Niveaux d'engagement",
      conversionFunnel: "Entonnoir de conversion",
      totalLeads: "Total des leads",
      newLeads: "Nouveaux leads",
      activeLeads: "Leads actifs",
      inactiveLeads: "Leads inactifs",
      leadsByStatus: "Leads par statut",
      leadsBySource: "Leads par source",
      leadsByCountry: "Leads par pays",
      leadsByLanguage: "Leads par langue",
      websiteUserLeads: "Utilisateurs du site",
      newsletterSubscriberLeads: "Abonnés à la newsletter",
      convertedLeads: "Leads convertis",
      consultationBookedLeads: "Consultation réservée",
      signedUpLeads: "Leads inscrits",
      subscriptionConfirmedLeads: "Abonnement confirmé",
      unsubscribedLeads: "Leads désabonnés",
      bounces: "Rejetés",
      qualifiedLeads: "Leads qualifiés",
      nonQualifiedLeads: "Leads non qualifiés",
      nurturingLeads: "Leads en nurturing",
      engagedLeads: "Leads engagés",
      leadsWithEmailEngagement: "Avec engagement e-mail",
      leadsWithoutEmailEngagement: "Sans engagement e-mail",
      averageEmailEngagementScore: "Engagement e-mail moyen",
      totalEmailEngagements: "Total des interactions e-mail",
      signupRate: "Taux d'inscription",
      subscriptionConfirmationRate: "Taux de confirmation d'abonnement",
      dataCompletenessRate: "Complétude des données",
      leadsWithBusinessName: "Avec nom d'entreprise",
      leadsWithContactName: "Avec nom de contact",
      leadsWithPhone: "Avec téléphone",
      leadsWithWebsite: "Avec site web",
      leadsWithNotes: "Avec notes",
      averageBusinessDataCompleteness:
        "Complétude moyenne des données d'entreprise",
      leadsByCampaignStage: "Leads par étape de campagne",
      leadsInActiveCampaigns: "Dans des campagnes actives",
      leadsNotInCampaigns: "Hors campagne",
      recentLeads: "Leads récents",
      topLeadsByEngagement: "Meilleurs leads par engagement",
      mostActiveLeads: "Leads les plus actifs",
      recentConversions: "Conversions récentes",
      recentSignups: "Inscriptions récentes",
      timeSeriesData: "Séries temporelles",
      comparisonData: "Données de comparaison",
      averageTimeToConversion: "Délai moyen avant conversion",
      averageTimeToConsultation: "Délai moyen avant consultation",
      averageTimeToSignup: "Délai moyen avant inscription",
      topPerformingCampaigns: "Campagnes les plus performantes",
      topPerformingSources: "Sources les plus performantes",
      topPerformingCountries: "Pays les plus performants",
      conversionRate: "Taux de conversion",
      consultationBookingRate: "Taux de réservation de consultation",
      averageOpenRate: "Taux d'ouverture moyen",
      averageClickRate: "Taux de clic moyen",
      campaignRunningLeads: "Dans des campagnes en cours",
      bouncedLeads: "Leads rejetés",
      invalidLeads: "Leads invalides",
      totalEmailsSent: "Total des e-mails envoyés",
      totalEmailsOpened: "Total des e-mails ouverts",
      totalEmailsClicked: "Total des e-mails cliqués",
      averageEmailsPerLead: "Moyenne d'e-mails par lead",
      leadVelocity: "Vélocité des leads",
      leadsCreatedToday: "Leads créés aujourd'hui",
      leadsCreatedThisWeek: "Leads créés cette semaine",
      leadsCreatedThisMonth: "Leads créés ce mois-ci",
      leadsUpdatedToday: "Leads mis à jour aujourd'hui",
      leadsUpdatedThisWeek: "Leads mis à jour cette semaine",
      leadsUpdatedThisMonth: "Leads mis à jour ce mois-ci",
      leadsByJourneyVariant: "Leads par variante de parcours",
      historicalData: "Données historiques",
      groupedStats: "Statistiques groupées",
      recentActivity: "Activité récente",
      metadata: "Informations du rapport",
      generatedAt: "Généré le",
      dataRange: "Plage de données",
      data: "Données statistiques",
      campaignName: "Campagne",
      leadsGenerated: "Leads",
      openRate: "Taux d'ouverture",
      clickRate: "Taux de clic",
      source: "Source",
      qualityScore: "Score de qualité",
      activityType: "Activité",
      email: "E-mail",
      businessName: "Entreprise",
      timestamp: "Heure",
      status: "Statut",
    },
    errors: {
      unauthorized: {
        title: "Accès non autorisé",
        description:
          "Authentification requise pour voir les statistiques des leads",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de la demande de statistiques invalides",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur lors de la récupération des statistiques des leads",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite lors de la récupération des statistiques",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau lors de la récupération des statistiques",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé aux statistiques des leads",
      },
      notFound: {
        title: "Aucune donnée",
        description: "Aucune donnée statistique pour ces critères",
      },
      conflict: {
        title: "Conflit",
        description:
          "Conflit de données lors de la génération des statistiques",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Les filtres des statistiques contiennent des modifications non enregistrées",
      },
    },
    success: {
      title: "Statistiques générées",
      description: "Statistiques des leads récupérées",
    },
    widget: {
      title: "Statistiques des leads",
      refresh: "Actualiser",
      viewAllLeads: "Voir tous les leads",
      searchLeads: "Rechercher des leads",
      export: "Exporter",
      import: "Importer",
      batchUpdate: "Mise à jour groupée",
      totalLeads: "Total des leads",
      activeLeads: "Leads actifs",
      converted: "Convertis",
      conversionRate: "Taux de conversion",
      openRate: "Taux d'ouverture",
      clickRate: "Taux de clic",
      unsubscribeRate: "Taux de désabonnement",
      newThisMonth: "Nouveaux (30 j)",
      newLeadsTimeline: "Chronologie des nouveaux leads",
      today: "Aujourd'hui",
      thisWeek: "Cette semaine",
      thisMonth: "Ce mois-ci",
      conversionFunnel: "Entonnoir de conversion",
      funnelTotalLeads: "Total des leads",
      funnelCampaignRunning: "Campagne en cours",
      funnelSignedUp: "Inscrits",
      funnelSubscriptionConfirmed: "Abonnement confirmé",
      byStatus: "Par statut",
      clickToFilter: "(cliquez pour filtrer)",
      bySource: "Par source",
      byCountry: "Par pays",
      byCampaignStage: "Par étape de campagne",
      topPerformingCampaigns: "Campagnes les plus performantes",
      topSources: "Meilleures sources",
      viewAll: "Tout voir",
      recentActivity: "Activité récente",
      filters: "Filtres",
      applyFilters: "Appliquer les filtres",
      openRateSuffix: " % ouv.",
      conversionRateSuffix: " % conv.",
      emDash: "n/d",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "Croissant",
        desc: "Décroissant",
      },
      leadSortField: {
        email: "E-mail",
        businessName: "Nom de l'entreprise",
        createdAt: "Date de création",
        updatedAt: "Date de mise à jour",
        lastEngagementAt: "Dernier engagement",
      },
      leadStatusFilter: {
        all: "Tous",
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
      emailCampaignStageFilter: {
        all: "Toutes",
        notStarted: "Pas commencé",
        initial: "Premier contact",
        followup1: "Relance 1",
        followup2: "Relance 2",
        followup3: "Relance 3",
        nurture: "Nurturing",
        reactivation: "Réactivation",
      },
      leadSourceFilter: {
        all: "Toutes",
        website: "Site web",
        socialMedia: "Réseaux sociaux",
        emailCampaign: "Campagne e-mail",
        referral: "Parrainage",
        csvImport: "Import CSV",
      },
    },
  },
  tracking: {
    engagement: {
      category: "Suivi des leads",
      tags: {
        tracking: "Suivi",
        engagement: "Engagement",
      },
      post: {
        title: "Enregistrer un engagement de lead",
        description:
          "Enregistrer un nouvel événement d'engagement pour un lead",
        form: {
          title: "Formulaire d'engagement du lead",
          description: "Saisir les détails de l'engagement du lead",
        },
        leadId: {
          label: "ID du lead",
          description: "Identifiant unique du lead",
          placeholder: "Saisissez l'ID du lead",
          helpText: "UUID du lead dont l'engagement est suivi",
        },
        engagementType: {
          label: "Type d'engagement",
          description: "Type d'événement d'engagement",
          placeholder: "Choisissez un type d'engagement",
          helpText: "Le type d'interaction ou d'engagement",
        },
        campaignId: {
          label: "ID de campagne",
          description: "Identifiant de la campagne associée",
          placeholder: "Saisissez l'ID de campagne",
          helpText: "Campagne facultative à laquelle cet engagement appartient",
        },
        metadata: {
          label: "Métadonnées",
          description: "Métadonnées complémentaires de l'engagement",
          placeholder: "Saisissez les métadonnées en JSON",
          helpText: "Données personnalisées sur cet engagement",
        },
        userId: {
          label: "ID utilisateur",
          description: "Identifiant de l'utilisateur associé",
          placeholder: "Saisissez l'ID utilisateur",
          helpText:
            "ID utilisateur facultatif si le lead est associé à un utilisateur",
        },
        response: {
          id: "ID de l'engagement",
          leadId: "ID du lead",
          engagementType: "Type d'engagement",
          campaignId: "ID de campagne",
          metadata: "Métadonnées",
          timestamp: "Horodatage",
          ipAddress: "Adresse IP",
          userAgent: "User agent",
          createdAt: "Créé le",
          leadCreated: "Lead créé",
          relationshipEstablished: "Relation établie",
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
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          forbidden: {
            title: "Accès refusé",
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
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
        },
        success: {
          title: "Engagement enregistré",
          description: "Engagement du lead enregistré",
        },
      },
      get: {
        title: "Suivre le clic d'un lead",
        description: "Suivre le clic d'un lead et rediriger vers l'URL cible",
        form: {
          title: "Paramètres du suivi de clic",
          description: "Paramètres du suivi de clic et de la redirection",
        },
        id: {
          label: "ID du lead",
          description: "Identifiant unique du lead",
          placeholder: "Saisissez l'ID du lead",
          helpText: "UUID du lead dont le clic est suivi",
        },
        stage: {
          label: "Étape de campagne",
          description: "Étape de la campagne e-mail",
          placeholder: "Choisissez une étape de campagne",
          helpText:
            "Étape de campagne facultative à laquelle ce clic appartient",
        },
        source: {
          label: "Source du lead",
          description: "Source du lead",
          placeholder: "Choisissez une source",
          helpText: "Source d'où provient le lead",
        },
        url: {
          label: "URL cible",
          description: "URL vers laquelle rediriger après le suivi",
          placeholder: "Saisissez l'URL cible",
          helpText: "L'URL de destination de la redirection",
        },
        ref: {
          label: "ID de référence",
          description: "Identifiant de référence pour le suivi",
          placeholder: "Saisissez l'ID de référence",
          helpText:
            "ID de référence facultatif pour enrichir le contexte du suivi",
        },
        response: {
          success: "Succès",
          redirectUrl: "URL de redirection",
          leadId: "ID du lead",
          campaignId: "ID de campagne",
          engagementRecorded: "Engagement enregistré",
          leadStatusUpdated: "Statut du lead mis à jour",
          isLoggedIn: "Connecté",
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
          server: {
            title: "Erreur serveur",
            description: "Erreur interne du serveur",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          forbidden: {
            title: "Accès refusé",
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
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Vous avez des modifications non enregistrées",
          },
        },
        success: {
          title: "Clic suivi",
          description: "Clic du lead enregistré",
        },
      },
      widget: {
        post: {
          headerTitle: "Enregistrer un engagement",
          viewStatsTitle: "Voir les statistiques des leads",
          statsButton: "Stats",
          loading: "Enregistrement de l'engagement…",
          successTitle: "Engagement enregistré",
          successSubtitle: "suivi avec succès",
          event: "Événement",
          labels: {
            engagementId: "ID de l'engagement",
            type: "Type",
            leadId: "ID du lead",
            campaignId: "ID de campagne",
            ipAddress: "Adresse IP",
            recordedAt: "Enregistré le",
            leadCreated: "Lead créé",
            leadCreatedYes: "Oui (nouveau lead)",
            leadCreatedNo: "Non (existant)",
            relationshipEst: "Relation établie",
            relationshipYes: "Oui",
            relationshipNo: "Non",
            metadata: "Métadonnées",
          },
          nextSteps: "Étapes suivantes :",
          viewLeadButton: "Voir le lead",
          leadStatsButton: "Stats des leads",
          emptyTitle: "Suivre un événement d'engagement",
          emptyDescription:
            "Remplissez le formulaire ci-dessous et envoyez-le pour enregistrer un nouvel événement d'engagement pour un lead",
          viewLeadStatsButton: "Voir les stats des leads",
        },
        get: {
          headerTitle: "Suivi des clics",
          viewStatsTitle: "Voir les statistiques des leads",
          statsButton: "Stats",
          loading: "Traitement du suivi de clic…",
          successTitle: "Clic suivi",
          successSubtitle: "Engagement enregistré, URL de redirection prête",
          failTitle: "Échec du suivi",
          failSubtitle: "Impossible d'enregistrer le clic",
          labels: {
            engagementLabel: "Engagement",
            recorded: "Enregistré",
            notRecorded: "Non enregistré",
            leadStatusLabel: "Statut du lead",
            updated: "Mis à jour",
            unchanged: "Inchangé",
            userLabel: "Utilisateur",
            loggedIn: "Connecté",
            anonymous: "Anonyme",
            leadId: "ID du lead",
            campaignId: "ID de campagne",
            redirectUrl: "URL de redirection",
          },
          nextSteps: "Étapes suivantes :",
          openUrlButton: "Ouvrir l'URL",
          viewLeadButton: "Voir le lead",
          leadStatsButton: "Stats des leads",
          emptyTitle: "Suivre un clic",
          emptyDescription:
            "Saisissez les paramètres de suivi ci-dessous pour enregistrer un clic et obtenir l'URL de redirection",
          viewLeadStatsButton: "Voir les stats des leads",
        },
      },
      enums: {
        engagementLevel: {
          high: "Élevé",
          medium: "Moyen",
          low: "Faible",
          none: "Aucun",
        },
      },
      error: {
        default:
          "Une erreur s'est produite pendant le traitement de l'engagement",
      },
    },
    pixel: {
      category: "Endpoint API",
      tags: {
        pixel: "Pixel",
      },
    },
    existing: {
      found: "Suivi de lead existant trouvé",
    },
    component: {
      initialized: "Composant de suivi des leads initialisé",
    },
    error: "Erreur dans le suivi des leads",
    errors: {
      default: "Une erreur s'est produite",
      missingId: "ID de suivi manquant",
      invalidUrl: "URL invalide",
    },
    data: {
      captured: "Données de suivi du lead capturées",
      capture: {
        error: "Erreur lors de la capture des données de suivi du lead",
      },
      retrieve: {
        error: "Erreur lors de la récupération des données de suivi du lead",
      },
      loaded: {
        signup: "Données de suivi du lead chargées pour l'inscription",
      },
      load: {
        error: {
          noncritical:
            "Erreur lors du chargement des données de suivi du lead (non critique)",
        },
      },
      stored: "Données de suivi du lead enregistrées",
      store: {
        error: "Erreur lors de l'enregistrement des données de suivi du lead",
      },
      cleared: "Données de suivi du lead effacées",
      clear: {
        error: "Erreur lors de l'effacement des données de suivi du lead",
      },
      format: {
        error: "Erreur lors du formatage des données de suivi",
      },
    },
    params: {
      validate: {
        error: "Erreur lors de la validation des paramètres de suivi",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "E-mail ouvert",
      emailClick: "E-mail cliqué",
      websiteVisit: "Visite du site",
      formSubmit: "Envoi de formulaire",
      leadAttribution: "Attribution du lead",
      creditWall: "Crédits épuisés",
      consentDeclined: "Consentement 18+ refusé",
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
      notStarted: "Pas commencé",
      initial: "Premier contact",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Nurturing",
      reactivation: "Réactivation",
    },
    emailStatus: {
      pending: "En attente",
      sent: "Envoyé",
      delivered: "Distribué",
      opened: "Ouvert",
      clicked: "Cliqué",
      bounced: "Rejeté",
      failed: "Échoué",
      unsubscribed: "Désabonné",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Converti au non censuré",
      sideHustle: "Revenu d'appoint",
      quietRecommendation: "Recommandation discrète",
      signupNurture: "Accompagnement après inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      newsletterMay2026: "Newsletter mai 2026",
      newsletterNov2026: "Newsletter novembre 2026",
    },
    emailJourneyVariantFilter: {
      all: "Toutes",
      uncensoredConvert: "Converti au non censuré",
      sideHustle: "Revenu d'appoint",
      quietRecommendation: "Recommandation discrète",
      signupNurture: "Accompagnement après inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      newsletterMay2026: "Newsletter mai 2026",
      newsletterNov2026: "Newsletter novembre 2026",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    leadSortField: {
      email: "E-mail",
      businessName: "Nom de l'entreprise",
      createdAt: "Date de création",
      updatedAt: "Date de mise à jour",
      lastEngagementAt: "Dernier engagement",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Lead créé",
      leadUpdated: "Lead mis à jour",
      emailSent: "E-mail envoyé",
      emailOpened: "E-mail ouvert",
      emailClicked: "E-mail cliqué",
      leadConverted: "Lead converti",
      leadUnsubscribed: "Lead désabonné",
    },
    userAssociation: {
      withUser: "Avec utilisateur",
      withLead: "Avec lead",
      standalone: "Indépendant",
      withBoth: "Avec les deux",
    },
    deviceType: {
      desktop: "Ordinateur",
      mobile: "Mobile",
      tablet: "Tablette",
      bot: "Bot",
      unknown: "Inconnu",
    },
    leadSource: {
      website: "Site web",
      socialMedia: "Réseaux sociaux",
      emailCampaign: "Campagne e-mail",
      referral: "Parrainage",
      csvImport: "Import CSV",
    },
    leadStatusFilter: {
      all: "Tous",
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
    emailCampaignStageFilter: {
      all: "Toutes",
      notStarted: "Pas commencé",
      initial: "Premier contact",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Nurturing",
      reactivation: "Réactivation",
    },
    leadSourceFilter: {
      all: "Toutes",
      website: "Site web",
      socialMedia: "Réseaux sociaux",
      emailCampaign: "Campagne e-mail",
      referral: "Parrainage",
      csvImport: "Import CSV",
    },
    batchOperationScope: {
      currentPage: "Page actuelle",
      allPages: "Toutes les pages",
    },
    country: {
      ...regionalCountryNames("fr"),
      de: "Allemagne",
      pl: "Pologne",
      fr: "France",
      global: "Monde",
    },
    language: {
      it: "Italien",
      es: "Espagnol",
      sk: "Slovaque",
      de: "Allemand",
      pl: "Polonais",
      fr: "Français",
      en: "Anglais",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Autre",
    },
  },
  error: {
    general: {
      internal_server_error: "Erreur interne du serveur",
      not_found: "Introuvable",
      unauthorized: "Non autorisé",
      forbidden: "Accès refusé",
      bad_request: "Requête invalide",
      validation_error: "Erreur de validation",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Demande de mise à jour groupée invalide",
          },
          server: {
            title: "Erreur serveur lors de la mise à jour groupée des leads",
          },
          default: "Erreur lors de la mise à jour groupée des leads",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Erreur serveur lors de la récupération des leads",
            detail:
              "Erreur serveur lors de la récupération des leads : {{error}}",
          },
          not_found: {
            title: "Leads introuvables",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Un lead avec cet e-mail existe déjà",
          },
          server: {
            title: "Erreur serveur lors de la création du lead",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Lead introuvable",
          },
          server: {
            title: "Erreur serveur lors de la mise à jour du lead",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "Désabonnement effectué",
        },
        error: {
          validation: {
            title: "Demande de désabonnement invalide",
          },
          server: {
            title: "Erreur serveur lors du désabonnement",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Données d'engagement invalides",
          },
          server: {
            title: "Erreur serveur lors de l'enregistrement de l'engagement",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Erreur serveur lors de l'export des leads",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Erreur serveur lors du traitement de la campagne",
          },
        },
      },
    },
  },
  countries: {
    ...regionalCountryNames("fr"),
    global: "Monde",
    de: "Allemagne",
    pl: "Pologne",
    fr: "France",
    us: "États-Unis",
  },
  languages: {
    it: "Italien",
    es: "Espagnol",
    sk: "Slovaque",
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
};
