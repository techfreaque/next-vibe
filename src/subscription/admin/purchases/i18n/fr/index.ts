import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Achats de crédits",
    titleShort: "Achats (admin)",
    description: "Historique des achats de packs de crédits",
    form: {
      title: "Historique des achats",
      description: "Parcourir les achats de packs de crédits",
    },
    searchFilters: {
      title: "Recherche et filtres",
      description: "Filtrer les achats",
    },
    search: {
      label: "Recherche",
      description: "Rechercher par e-mail d'utilisateur",
      placeholder: "Rechercher des achats...",
    },
    packType: {
      label: "Type de pack",
      description: "Filtrer par type de pack de crédits",
      placeholder: "Tous les types",
    },
    source: {
      label: "Origine",
      description: "Filtrer par origine de l'achat",
      placeholder: "Toutes les origines",
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
      title: "Achats",
      description: "Historique des achats de packs de crédits",
      purchases: {
        id: "ID",
        userEmail: "E-mail",
        userName: "Nom",
        packType: "Type",
        source: "Origine",
        originalAmount: "Montant",
        remaining: "Restant",
        expiresAt: "Expire le",
        createdAt: "Acheté le",
      },
      totalCount: "Total des achats",
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
        description: "Impossible de récupérer les achats",
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
        description: "Aucun achat trouvé",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Achats récupérés",
    },
  },
  widget: {
    noPurchases: "Aucun achat de pack de crédits trouvé.",
    noMatchingPurchases: "Aucun achat ne correspond à vos filtres.",
    searchPlaceholder: "Rechercher par e-mail...",
    refresh: "Actualiser",
    expired: "Expiré",
    neverExpires: "Jamais",
  },
  enums: {
    creditPackTypeFilter: {
      any: "Tous",
      subscription: "Abonnement",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Gagné",
    },
    creditPackSourceFilter: {
      any: "Toutes",
      stripePurchase: "Achat Stripe",
      stripeSubscription: "Crédits d'abonnement",
      adminGrant: "Attribution admin",
      referralEarning: "Gain de parrainage",
    },
    purchaseSortField: {
      createdAt: "Date de création",
      amount: "Montant",
      type: "Type",
      userEmail: "E-mail de l'utilisateur",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
  },
};
