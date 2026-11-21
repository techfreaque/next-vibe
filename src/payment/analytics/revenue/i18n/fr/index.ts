import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Revenus",
    titleShort: "Revenus",
    description:
      "Revenus des packs de crédits, nouveaux abonnements et renouvellements par prestataire, offre et devise, avec remboursements, litiges, MRR, abonnements actifs et résiliations.",
    tags: {
      revenue: "revenus",
      mrr: "MRR",
    },
    fields: {
      kind: {
        label: "Type",
        description:
          "Packs de crédits, nouveaux abonnements, renouvellements ou tout",
      },
      provider: {
        label: "Prestataire",
        description: "Uniquement les paiements via ce prestataire",
      },
      currency: {
        label: "Devise",
        description:
          "Uniquement les paiements dans cette devise (USD, EUR, PLN)",
      },
      plan: {
        label: "Offre",
        description: "Uniquement les paiements et abonnements de cette offre",
      },
      includeInternal: {
        label: "Inclure les comptes admin",
        description: "Compter aussi les paiements des comptes admin",
      },
    },
    response: {
      window: "Période",
      appliedFilters: "Filtres appliqués",
      kpis: "Chiffres clés",
      revenueByKind: "Revenus par type",
      revenueByProcessor: "Revenus par prestataire",
      subscriptionFlow: "Abonnements nouveaux vs résiliés",
      byPlan: "Par offre ou produit",
      byCurrency: "Par devise",
      byProcessor: "Par prestataire",
      recentPayments: "Paiements récents",
      fxRates: "Taux de change vers USD",
    },
    errors: {
      validation: {
        title: "Filtres invalides",
        description: "Vérifiez la période et les filtres, puis réessayez.",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous en admin pour voir les revenus.",
      },
      forbidden: {
        title: "Réservé aux admins",
        description: "Seuls les admins voient les revenus.",
      },
      notFound: {
        title: "Aucun résultat",
        description: "Aucun paiement pour cette requête.",
      },
      server: {
        title: "Échec du rapport",
        description: "Impossible de générer le rapport de revenus. Réessayez.",
      },
      unknown: {
        title: "Erreur inattendue",
        description:
          "Un problème est survenu pendant le chargement du rapport.",
      },
      network: {
        title: "Erreur de connexion",
        description: "Le serveur est injoignable.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Appliquez ou annulez d'abord vos changements de filtres.",
      },
      conflict: {
        title: "Conflit de données",
        description:
          "Les données ont changé pendant le chargement. Actualisez le rapport.",
      },
    },
    success: {
      title: "Rapport prêt",
      description: "Revenus chargés",
    },
  },
  widget: {
    extra: {
      grossHint: "Abonnements {{subs}} · packs {{packs}} · env. USD",
      newSubsHint:
        "Abonnements démarrés sur la période · {{count}} premiers paiements",
      churn30Hint: "Terminés sur la période · attrition 30 jours {{rate}}",
      notLoaded: "Rapport non chargé. Actualisez pour réessayer.",
      firstPayments: "Premiers paiements d’abonnement",
      openAll: "Ouvrir tous les paiements",
      churnChart: "Attrition sur 30 jours",
      churnNote:
        "Abonnements terminés dans les 30 jours avant chaque point ÷ actifs au début de ces 30 jours",
      kindPack: "Pack de crédits",
      kindNew: "Premier paiement d’abonnement",
      kindRenewal: "Renouvellement",
      paid: "Payés",
      subscriptionNote:
        "Les chiffres d’abonnement ignorent les filtres type et devise.",
      netHint:
        "Brut moins remboursements de la période ; litiges et frais de paiement non déduits",
      mrrHint: "Abonnements actifs en fin de période, offres annuelles ÷ 12",
      mrrChart: "MRR dans le temps",
      mrrNote: "Revenu récurrent des abonnements actifs à chaque instant.",
      churnRate: "{{rate}} des abonnements actifs en début de période",
      seriesMrr: "MRR",
      seriesActive: "Abonnements actifs",
      packUnknown: "Pack de crédits, taille non enregistrée",
      filterIgnored: "Non concerné par les filtres type et devise",
      processorAll: "Tous les prestataires",
      currencyAll: "Toutes les devises",
    },
    group: {
      money: "Argent",
      customers: "Clients et abonnements",
      volume: "Volume de paiements",
    },
    kpi: {
      grossRevenueUsd: "Revenu brut",
      netRevenueUsd: "Revenu net",
      refundsUsd: "Remboursements",
      mrrUsd: "MRR",
      payingCustomers: "Clients payants",
      activeSubscriptions: "Abonnements actifs",
      newSubscriptions: "Nouveaux abonnements",
      churnedSubscriptions: "Résiliés",
      renewals: "Renouvellements",
      packPurchases: "Achats de packs",
      disputes: "Litiges",
      failedPayments: "Paiements échoués",
    },
    hint: {
      grossRevenueUsd: "Paiements encaissés, env. USD",
      netRevenueUsd: "Brut moins remboursements de la période",
      refundsUsd: "Remboursements émis sur la période",
      mrrUsd: "Abonnements actifs en fin de période, annuel / 12",
      payingCustomers: "Comptes avec au moins un paiement encaissé",
      activeSubscriptions: "En cours en fin de période",
      newSubscriptions: "Abonnements démarrés sur la période",
      churnedSubscriptions: "Abonnements terminés sur la période",
      renewals: "Paiements de renouvellement encaissés",
      packPurchases: "Paiements de packs de crédits encaissés",
      disputes: "Rétrofacturations ouvertes sur la période",
      failedPayments: "Paiements échoués sur la période",
    },
    chart: {
      kind: "Revenus par type",
      processor: "Revenus par prestataire",
      flow: "Abonnements : nouveaux vs résiliés",
    },
    series: {
      pack: "Packs de crédits",
      newSubscription: "Nouveaux abonnements",
      renewal: "Renouvellements",
      new: "Nouveaux",
      churned: "Résiliés",
    },
    breakdown: {
      byPlan: "Par offre ou produit",
      byCurrency: "Par devise",
      byProcessor: "Par prestataire",
      recent: "Paiements récents",
      recentHint:
        "Cliquez sur un paiement pour l’ouvrir dans les transactions du prestataire.",
      drillHint: "Cliquez sur une ligne pour filtrer le rapport.",
      plan: "Offre ou produit",
      currency: "Devise",
      processor: "Prestataire",
      payment: "Paiement",
    },
    column: {
      revenueUsd: "Revenu",
      amount: "Montant d'origine",
      payments: "Paiements",
      customers: "Clients",
      failed: "Échoués",
      refundsUsd: "Remboursé",
      usd: "USD",
    },
    label: {
      creditPack: "Pack de crédits (500)",
      creditPackLarge: "Pack de crédits (2 500)",
      pack: "Pack de crédits",
      newSubscription: "Nouvel abonnement, offre non enregistrée",
      renewal: "Renouvellement, offre non enregistrée",
      rate: "1 {{currency}} = {{rate}} USD",
    },
    fxNote: "Totaux en USD approx. à taux fixes : {{rates}}.",
    subscriptionNote:
      "Les chiffres d'abonnement suivent uniquement les filtres prestataire et offre.",
    filter: {
      kind: "Type",
      provider: "Prestataire",
      currency: "Devise",
      plan: "Offre",
      internal: "Admins inclus",
    },
    empty: "Aucun paiement sur cette période.",
    includeInternal: "Inclure les admins",
  },
  enums: {
    kind: {
      all: "Tout",
      pack: "Packs",
      newSubscription: "Premiers paiements",
      renewal: "Renouvellements",
    },
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "En attente",
      processing: "En cours",
      succeeded: "Réussi",
      failed: "Échoué",
      canceled: "Annulé",
      refunded: "Remboursé",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
  },
};
