import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abonnements",
  tags: {
    admin: "Admin",
    stats: "Statistiques",
    list: "Liste",
    purchases: "Achats",
    referrals: "Parrainages",
  },
  // Stats endpoint translations
  stats: {
    get: {
      title: "Statistiques des abonnements",
      description:
        "Indicateurs de chiffre d'affaires, d'abonnements, de crédits et de parrainage",
      form: {
        title: "Tableau de bord des statistiques",
        description: "Indicateurs business agrégés",
      },
      timePeriodOptions: {
        title: "Période",
        description: "Configurer la plage de temps",
      },
      timePeriod: {
        label: "Période",
        description: "Intervalle de regroupement",
      },
      dateRangePreset: {
        label: "Plage de dates",
        description: "Plage de dates prédéfinie",
      },
      response: {
        revenueStats: {
          title: "Chiffre d'affaires",
          description: "Indicateurs de chiffre d'affaires",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "CA total" },
          avgOrderValue: { label: "Panier moyen" },
        },
        subscriptionStats: {
          title: "Abonnements",
          description: "Nombre d'abonnements",
          activeCount: { label: "Actifs" },
          trialingCount: { label: "En essai" },
          canceledCount: { label: "Annulés" },
          churnRate: { label: "Taux de churn" },
        },
        intervalStats: {
          title: "Périodicités de facturation",
          description: "Répartition mensuel / annuel",
          monthlyCount: { label: "Mensuels" },
          yearlyCount: { label: "Annuels" },
          yearlyRevenuePct: { label: "% du CA en annuel" },
        },
        creditStats: {
          title: "Crédits",
          description: "Indicateurs des packs de crédits",
          totalPurchased: { label: "Achetés" },
          totalSpent: { label: "Dépensés" },
          packsSold: { label: "Packs vendus" },
          avgPackSize: { label: "Taille moyenne des packs" },
        },
        referralStats: {
          title: "Parrainages",
          description: "Indicateurs du programme de parrainage",
          totalReferrals: { label: "Total des parrainages" },
          conversionRate: { label: "Conversion" },
          totalEarned: { label: "Total gagné" },
          pendingPayouts: { label: "Versements en attente" },
        },
        growthMetrics: {
          title: "Croissance",
          description: "Tendances du chiffre d'affaires et des abonnements",
          revenueChart: {
            label: "Chiffre d'affaires dans le temps",
            description: "Tendance du chiffre d'affaires",
          },
          subscriptionChart: {
            label: "Croissance des abonnements",
            description: "Tendance des abonnements actifs",
          },
        },
        businessInsights: {
          title: "Analyses",
          description: "Indicateurs générés",
          generatedAt: { label: "Généré le" },
        },
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Connexion requise pour voir les statistiques",
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
          description: "Impossible de générer les statistiques",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        network: {
          title: "Erreur réseau",
          description: "Connexion impossible",
        },
        notFound: {
          title: "Introuvable",
          description: "Statistiques indisponibles",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: { title: "Succès", description: "Statistiques générées" },
    },
    widget: {
      refresh: "Actualiser",
      filters: "Filtres",
    },
  },
  // List endpoint translations
  list: {
    get: {
      title: "Liste des abonnements",
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
      page: { label: "Page" },
      limit: { label: "Par page" },
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
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Erreur inattendue",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
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
      success: { title: "Succès", description: "Abonnements récupérés" },
    },
    widget: {
      noSubscriptions: "Aucun abonnement trouvé.",
      noMatchingSubscriptions: "Aucun abonnement ne correspond à vos filtres.",
      searchPlaceholder: "Rechercher par e-mail ou nom...",
      refresh: "Actualiser",
      viewStats: "Statistiques",
    },
  },
  // Purchases endpoint translations
  purchases: {
    get: {
      title: "Achats de crédits",
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
      page: { label: "Page" },
      limit: { label: "Par page" },
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
        conflict: { title: "Conflit", description: "Conflit de données" },
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
      success: { title: "Succès", description: "Achats récupérés" },
    },
    widget: {
      noPurchases: "Aucun achat de pack de crédits trouvé.",
      noMatchingPurchases: "Aucun achat ne correspond à vos filtres.",
      searchPlaceholder: "Rechercher par e-mail...",
      refresh: "Actualiser",
      expired: "Expiré",
      neverExpires: "Jamais",
    },
  },
  // Referrals endpoint translations
  referrals: {
    get: {
      title: "Tableau de bord des parrainages",
      description: "Codes de parrainage, gains et versements",
      form: {
        title: "Gestion des parrainages",
        description: "Gérer le programme de parrainage",
      },
      searchFilters: {
        title: "Recherche et filtres",
        description: "Filtrer les données de parrainage",
      },
      search: {
        label: "Recherche",
        description: "Rechercher par e-mail d'utilisateur",
        placeholder: "Rechercher des parrainages...",
      },
      payoutStatus: {
        label: "Statut du versement",
        description: "Filtrer par statut de demande de versement",
        placeholder: "Tous les statuts",
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
        title: "Parrainages",
        description: "Données du programme de parrainage",
        summary: {
          title: "Synthèse",
          description: "Statistiques de parrainage agrégées",
          totalCodes: { label: "Total des codes" },
          totalSignups: { label: "Inscriptions totales" },
          totalEarned: { label: "Total gagné" },
          totalPaidOut: { label: "Total versé" },
          pendingPayouts: { label: "Versements en attente" },
        },
        codes: {
          code: "Code",
          ownerEmail: "Propriétaire",
          ownerName: "Nom",
          currentUses: "Clics",
          totalSignups: "Inscriptions",
          totalEarned: "Gagné",
          isActive: "Actif",
          createdAt: "Créé le",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "Utilisateur",
          amountCents: "Montant",
          currency: "Devise",
          status: "Statut",
          walletAddress: "Portefeuille",
          adminNotes: "Notes",
          rejectionReason: "Motif du refus",
          createdAt: "Demandé le",
          processedAt: "Traité le",
        },
        totalCount: "Total",
        pageCount: "Nombre de pages",
      },
      page: { label: "Page" },
      limit: { label: "Par page" },
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
          description: "Impossible de récupérer les parrainages",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Erreur inattendue",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        network: {
          title: "Erreur réseau",
          description: "Connexion impossible",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucune donnée de parrainage trouvée",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Modifications non enregistrées",
        },
      },
      success: { title: "Succès", description: "Parrainages récupérés" },
    },
    post: {
      title: "Action sur un versement",
      description: "Approuver, refuser ou finaliser une demande de versement",
      form: {
        title: "Action sur un versement",
        description: "Traiter une demande de versement",
      },
      requestId: {
        label: "ID de la demande",
        description: "Demande de versement à traiter",
        placeholder: "Saisir l'ID de la demande...",
      },
      action: {
        label: "Action",
        description: "Action à effectuer",
        placeholder: "Sélectionner une action...",
      },
      adminNotes: {
        label: "Notes admin",
        description: "Notes facultatives",
        placeholder: "Ajouter des notes...",
      },
      rejectionReason: {
        label: "Motif du refus",
        description: "Obligatoire en cas de refus",
        placeholder: "Saisir le motif...",
      },
      response: {
        title: "Résultat",
        description: "Résultat de l'action",
        success: "Succès",
        message: "Message",
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
          description: "Impossible de traiter le versement",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Erreur inattendue",
        },
        conflict: {
          title: "Conflit",
          description: "Versement déjà traité",
        },
        network: {
          title: "Erreur réseau",
          description: "Connexion impossible",
        },
        notFound: {
          title: "Introuvable",
          description: "Demande de versement introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Modifications non enregistrées",
        },
      },
      success: { title: "Succès", description: "Versement traité" },
    },
    widget: {
      noReferrals: "Aucun code de parrainage trouvé.",
      noPayouts: "Aucune demande de versement.",
      approve: "Approuver",
      reject: "Refuser",
      complete: "Finaliser",
      sectionCodes: "Codes de parrainage",
      sectionPayouts: "Demandes de versement",
      refresh: "Actualiser",
      codeActive: "Actif",
      codeInactive: "Inactif",
      clicks: "clics",
      signups: "inscriptions",
      earned: "gagnés",
      confirm: {
        title: "Confirmer l'action sur le versement",
        description:
          "Voulez-vous vraiment effectuer cette action sur le versement ? Elle est irréversible.",
        cancel: "Annuler",
        proceed: "Continuer",
      },
    },
  },
  // Enum translations
  enums: {
    subscriptionStatusFilter: {
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
      createdAt: "Date de création",
      status: "Statut",
      interval: "Périodicité",
      userEmail: "E-mail de l'utilisateur",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
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
    payoutStatusFilter: {
      all: "Tous",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Refusé",
      processing: "En cours",
      completed: "Terminé",
      failed: "Échoué",
    },
    referralSortField: {
      createdAt: "Date de création",
      earnings: "Gains totaux",
      signups: "Inscriptions",
    },
    payoutAction: {
      approve: "Approuver",
      reject: "Refuser",
      complete: "Finaliser",
    },
  },
};
