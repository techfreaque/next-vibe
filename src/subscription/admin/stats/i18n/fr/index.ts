import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Statistiques des abonnements",
    titleShort: "Indicateurs d’abonnement",
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
        mrr: {
          label: "MRR",
        },
        arr: {
          label: "ARR",
        },
        totalRevenue: {
          label: "CA total",
        },
        avgOrderValue: {
          label: "Panier moyen",
        },
      },
      subscriptionStats: {
        title: "Abonnements",
        description: "Nombre d'abonnements",
        activeCount: {
          label: "Actifs",
        },
        trialingCount: {
          label: "En essai",
        },
        pastDueCount: { label: "En retard" },
        canceledCount: {
          label: "Annulés",
        },
        churnRate: {
          label: "Taux de churn",
        },
      },
      intervalStats: {
        title: "Périodicités de facturation",
        description: "Répartition mensuel / annuel",
        monthlyCount: {
          label: "Mensuels",
        },
        yearlyCount: {
          label: "Annuels",
        },
        yearlyRevenuePct: {
          label: "% du CA en annuel",
        },
      },
      creditStats: {
        title: "Crédits",
        description: "Indicateurs des packs de crédits",
        totalPurchased: {
          label: "Achetés",
        },
        spentFromFree: { label: "Depuis l'allocation gratuite" },
        totalSpent: {
          label: "Dépensés",
        },
        packsSold: {
          label: "Packs vendus",
        },
        avgPackSize: {
          label: "Taille moyenne des packs",
        },
      },
      referralStats: {
        title: "Parrainages",
        description: "Indicateurs du programme de parrainage",
        totalReferrals: {
          label: "Total des parrainages",
        },
        conversionRate: {
          label: "Conversion",
        },
        totalEarned: {
          label: "Total gagné",
        },
        pendingPayouts: {
          label: "Versements en attente",
        },
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
        generatedAt: {
          label: "Généré le",
        },
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
        detail: "Impossible de calculer les statistiques : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
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
        description: "Statistiques indisponibles",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Statistiques générées",
    },
  },
  widget: {
    paidPacks: "Packs payés : abonnement + achetés",
    canceledShare: "Part résiliée, depuis le début",
    spentSplit:
      "{{packs}} prélevés sur les packs (comme dans Packs de crédits) · {{free}} sur les allocations gratuites",
    creditsSold: "Crédits vendus",
    creditsSoldHint:
      "Packs d'abonnement et achetés. Hors crédits offerts et gains de parrainage.",
    pastDueHint: "Paiement échoué, toujours compté comme abonné",
    yearlyShare: "Formules annuelles",
    yearlyShareHint:
      "Part des abonnements actifs, en essai et en retard facturés à l'année",
    showLegacy: "Afficher l'ancien aperçu des revenus",
    hideLegacy: "Masquer l'ancien aperçu des revenus",
    approxUsd: "env. USD",
    openLabel: "Ouvrir :",
    linkSubscriptions: "Liste des abonnements",
    linkPurchases: "Packs de crédits",
    linkReferrals: "Parrainages",
    apply: "Appliquer",
    sectionSubscriptions: "Abonnements",
    sectionSubscriptionsHint: "État actuel, toute la période",
    activePaid: "Actifs",
    activePaidHint: "Statut actif. Même nombre que la liste des abonnements.",
    churnHint:
      "Résiliés parmi actifs, en essai, en retard et résiliés. Pas un churn mensuel.",
    sectionCredits: "Crédits",
    purchasedHint: "Crédits dans les packs des comptes",
    spentHint: "Crédits consommés",
    sectionReferrals: "Parrainages",
    sectionLegacy: "Ancien aperçu des revenus",
    sectionLegacyHint:
      "Remplacé par le rapport de revenus. Converti en env. USD.",
    revenueReportTitle:
      "Revenus, MRR et churn sont désormais dans le rapport de revenus",
    revenueReportHint:
      "L'argent réellement encaissé par jour, par devise et par type, jusqu'au détail de chaque paiement.",
    openRevenueReport: "Ouvrir le rapport de revenus",
    refresh: "Actualiser",
    filters: "Filtres",
  },
  stats: {
    timePeriod: {
      day: "Jour",
      week: "Semaine",
      month: "Mois",
      quarter: "Trimestre",
      year: "Année",
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
      custom: "Personnalisée",
    },
  },
};
