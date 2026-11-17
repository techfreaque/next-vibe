import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    batch: "Lot",
  },

  patch: {
    title: "Mise à jour groupée",
    titleShort: "Mise à jour groupée",
    description:
      "Mettre à jour des leads en masse selon des critères de filtre",
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
      label: "Nombre max. d'enregistrements",
      description: "Nombre maximal d'enregistrements à traiter",
    },
    updates: {
      title: "Champs à mettre à jour",
      description: "Indiquer les champs à mettre à jour",
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
      title: "Résultat de la mise à jour",
      description: "Données de résultat de la mise à jour groupée",
      success: "Succès",
      totalMatched: "Total correspondants",
      totalProcessed: "Total traités",
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
          "Une erreur interne du serveur s'est produite pendant la mise à jour groupée",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant la mise à jour groupée",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite pendant la mise à jour groupée",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit aux opérations groupées",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable pour la mise à jour groupée",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit de données s'est produit pendant la mise à jour groupée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "La mise à jour groupée contient des modifications non enregistrées",
      },
    },
    success: {
      title: "Mise à jour réussie",
      description: "Mise à jour groupée terminée",
    },
  },
  delete: {
    title: "Suppression groupée",
    titleShort: "Suppression groupée",
    description: "Supprimer des leads en masse selon des critères de filtre",
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
      description: "Confirmer la suppression des leads sélectionnés",
    },
    dryRun: {
      label: "Simulation",
      description:
        "Prévisualiser les suppressions sans retirer réellement d'enregistrements",
    },
    maxRecords: {
      label: "Nombre max. d'enregistrements",
      description: "Nombre maximal d'enregistrements à supprimer",
    },
    response: {
      title: "Résultat de la suppression",
      description: "Données de résultat de la suppression groupée",
      success: "Succès",
      totalMatched: "Total correspondants",
      totalProcessed: "Total traités",
      totalDeleted: "Total supprimés",
      preview: "Aperçu",
      errors: "Erreurs",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour les suppressions groupées",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides pour la suppression groupée",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant la suppression groupée",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant la suppression groupée",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite pendant la suppression groupée",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit aux suppressions groupées",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable pour la suppression groupée",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit de données s'est produit pendant la suppression groupée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "La suppression groupée contient des modifications non enregistrées",
      },
    },
    success: {
      title: "Suppression réussie",
      description: "Suppression groupée terminée",
    },
  },
  widget: {
    update: {
      headerTitle: "Mise à jour groupée des leads",
      emptyStateTitle: "Mise à jour groupée des leads",
      emptyStateDescription:
        "Appliquez une modification de champ à de nombreux leads à la fois selon des critères de filtre. Utilisez",
      emptyStateDescriptionStrong: "Simulation",
      emptyStateDescriptionSuffix:
        "pour voir quels leads seront concernés avant de valider les changements.",
      emptyStateTip1:
        "Définissez les filtres et cliquez sur Envoyer pour lancer d'abord une simulation",
      emptyStateTip2:
        "Décochez Simulation pour appliquer réellement les changements",
      highVolumeTitle: "Lot important : {{count}} leads correspondants",
      highVolumeDescription:
        "Cette opération touche un grand nombre d'enregistrements. Vérifiez soigneusement l'aperçu avant de désactiver la simulation et de lancer l'opération réelle.",
      partialBatchTitle: "Lot traité partiellement",
      partialBatchDescription:
        "{{processed}} leads traités sur {{matched}} correspondants. Augmentez le nombre max. d'enregistrements ou relancez pour en traiter davantage.",
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
      submitButton: "Appliquer les modifications",
      submitButtonLoading: "Application...",
    },
    delete: {
      headerTitle: "Suppression groupée des leads",
      warningTitle: "Attention : {{count}} lead sera supprimé définitivement",
      warningTitlePlural:
        "Attention : {{count}} leads seront supprimés définitivement",
      warningDescription:
        "Cette action est irréversible. Toutes les données des leads correspondants seront définitivement effacées. Désactivez la simulation et confirmez pour continuer.",
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
      newsletterSubscriber: "Abonné newsletter",
      inContact: "En contact",
      signedUp: "Inscrit",
      subscriptionConfirmed: "Abonnement confirmé",
      unsubscribed: "Désinscrit",
      bounced: "Rejeté",
      invalid: "Invalide",
    },
    emailCampaignStage: {
      notStarted: "Non démarrée",
      initial: "Premier contact",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Accompagnement",
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
        preview: "{{totalProcessed}} leads ont été traités",
        message:
          "La mise à jour groupée est terminée : {{totalProcessed}} leads traités.",
        operationSummary: "Récapitulatif de l'opération",
        totalMatched: "Total correspondants",
        totalProcessed: "Total traités",
        totalUpdated: "Total mis à jour",
        errors: "Erreurs",
        dryRunNote:
          "Il s'agissait d'une simulation : aucune modification n'a été effectuée.",
        viewLeads: "Voir les leads mis à jour",
        error: {
          noData: "Aucune donnée de mise à jour groupée disponible",
        },
      },
      batchDelete: {
        title: "Suppression groupée terminée",
        subject: "Résultats de la suppression groupée",
        preview: "{{totalProcessed}} leads ont été traités pour suppression",
        message:
          "La suppression groupée est terminée : {{totalProcessed}} leads traités.",
        operationSummary: "Récapitulatif de l'opération",
        totalMatched: "Total correspondants",
        totalProcessed: "Total traités",
        totalDeleted: "Total supprimés",
        errors: "Erreurs",
        dryRunNote:
          "Il s'agissait d'une simulation : aucune suppression n'a été effectuée.",
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
};
