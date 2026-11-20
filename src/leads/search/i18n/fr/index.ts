import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des leads",
  tags: {
    leads: "Leads",
    search: "Recherche",
  },
  get: {
    title: "Rechercher des leads",
    titleShort: "Rechercher des leads",
    description: "Rechercher des leads avec filtres et pagination",
    form: {
      title: "Formulaire de recherche de leads",
      description: "Saisissez des critères pour trouver des leads",
    },
    search: {
      label: "Requête de recherche",
      description:
        "Terme pour filtrer les leads par e-mail, nom d'entreprise ou notes",
      placeholder: "Saisir un terme de recherche...",
    },
    status: {
      label: "Filtre de statut",
      description: "Filtrer les leads par statut",
    },
    limit: {
      label: "Limite de résultats",
      description: "Nombre maximum de résultats renvoyés (1-100)",
    },
    offset: {
      label: "Décalage des résultats",
      description: "Nombre de résultats à sauter pour la pagination",
    },
    response: {
      title: "Résultats de recherche",
      description: "Résultats de recherche paginés avec les données des leads",
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
        description: "Erreur interne du serveur lors de la recherche de leads",
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
        title: "Interdit",
        description: "Accès interdit à la recherche de leads",
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
    previous: "Précédente",
    next: "Suivante",
    page: "Page {{page}} sur {{pages}}",
    title: "Rechercher des leads",
    filterLabel: "Filtre :",
    clearFilter: "Effacer",
    noResultsTitle: "Aucun résultat",
    noResultsSubtitle: "Recherchez par e-mail, nom d'entreprise ou téléphone",
    createLead: "Créer un lead",
    noLeadsMatchFilter: "Aucun lead ne correspond aux filtres choisis.",
    clearFilters: "Effacer les filtres",
    loadMore: "Charger plus",
    openRateSuffix: " % ouverts",
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
    statusUnsub: "Désab.",
    statusBounced: "Rebond",
    statusInvalid: "Invalide",
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
      bounced: "Rebond",
      invalid: "Invalide",
    },
  },
};
