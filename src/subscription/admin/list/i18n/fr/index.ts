import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Abonnements",
    titleShort: "Liste abos",
    description: "Parcourir tous les abonnements",
    form: {
      title: "Gestion des abonnements",
      description: "Filtrer et parcourir les abonnements",
    },
    searchFilters: {
      title: "Recherche et filtres",
      description: "Filtrer les abonnements",
    },
    search: {
      label: "Recherche",
      description: "Rechercher par e-mail ou nom d'utilisateur",
      placeholder: "Rechercher des abonnements...",
    },
    status: {
      label: "Statut",
      description: "Filtrer par statut d'abonnement",
      placeholder: "Sélectionner un statut...",
    },
    interval: {
      label: "Périodicité de facturation",
      description: "Filtrer par périodicité de facturation",
      placeholder: "Toutes les périodicités",
    },
    provider: {
      label: "Prestataire",
      description: "Filtrer par prestataire de paiement",
      placeholder: "Tous les prestataires",
    },
    dateFrom: {
      label: "Du",
      description: "Filtre de date de début",
    },
    dateTo: {
      label: "Au",
      description: "Filtre de date de fin",
    },
    sortingOptions: {
      title: "Tri",
      description: "Configurer le tri des résultats",
    },
    sortBy: {
      label: "Trier par",
      description: "Champ de tri",
      placeholder: "Sélectionner un champ de tri...",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Sens du tri",
      placeholder: "Sélectionner l'ordre...",
    },
    response: {
      title: "Abonnements",
      description: "Abonnements correspondants",
      subscriptions: {
        userId: "Identifiant client",
        paymentFailedAt: "Premier échec de paiement",
        gracePeriodEndsAt: "Fin du délai de grâce",
        id: "ID",
        userEmail: "E-mail",
        userName: "Nom",
        planId: "Formule",
        billingInterval: "Périodicité",
        status: "Statut",
        createdAt: "Début",
        currentPeriodEnd: "Fin de période",
        cancelAtPeriodEnd: "Annulation en fin de période",
        canceledAt: "Annulé le",
        cancellationReason: "Motif d'annulation",
        provider: "Prestataire",
        providerSubscriptionId: "ID chez le prestataire",
      },
      totalCount: "Total des abonnements",
      pageCount: "Nombre de pages",
    },
    page: {
      label: "Page",
    },
    limit: {
      label: "Par page",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès admin requis",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer les abonnements",
        detail: "Impossible de charger la liste des abonnements : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inattendue",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données",
      },
      network: {
        title: "Erreur réseau",
        description: "Connexion impossible",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun abonnement trouvé",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Abonnements récupérés",
    },
  },
  widget: {
    pick: "Sélectionner l’abonnement",
    failedPayments: "Transactions échouées",
    renewal: "Renouvellement prévu",
    scheduledEnd: "Prend fin sans renouvellement",
    notRecorded: "Non renseigné",
    customer: "Ouvrir le compte client",
    paymentAttempts: "Voir les tentatives de paiement",
    apply: "Appliquer les filtres",
    previous: "Précédente",
    next: "Suivante",
    pagination: "Page {{page}} sur {{pages}} · {{total}} abonnements",
    loading: "Chargement des abonnements",
    customerScope: "Client {{id}}",
    clearScope: "Effacer la restriction",
    noSubscriptions: "Aucun abonnement trouvé.",
    noMatchingSubscriptions: "Aucun abonnement ne correspond à vos filtres.",
    searchPlaceholder: "Rechercher par e-mail ou nom...",
    refresh: "Actualiser",
    viewStats: "Statistiques",
  },
  enums: {
    subscriptionStatusFilter: {
      incomplete: "Incomplet",
      incompleteExpired: "Expiré avant activation",
      all: "Tous",
      active: "Actif",
      trialing: "En essai",
      pastDue: "En retard de paiement",
      canceled: "Annulé",
      unpaid: "Impayé",
      paused: "En pause",
    },
    billingIntervalFilter: {
      any: "Toutes",
      monthly: "Mensuel",
      yearly: "Annuel",
    },
    providerFilter: {
      any: "Tous",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      periodEnd: "Fin de période",
      createdAt: "Date de création",
      status: "Statut",
      interval: "Périodicité",
      userEmail: "E-mail de l'utilisateur",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
  },
};
