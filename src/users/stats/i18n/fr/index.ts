import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stats business",
  titleShort: "Stats utilisateurs",
  description:
    "Inscriptions, utilisateurs actifs et payants, MRR, revenu, dépense de crédits, conversion inscription vers paiement et rétention J7. Chaque chiffre comparé à la période précédente, avec courbe de tendance, canaux et plus gros dépensiers.",
  category: "Utilisateurs",
  tag: "Statistiques",
  fields: {
    range: {
      label: "Période",
      description:
        "Période de reporting, comparée à la période de même durée qui la précède",
    },
    from: {
      label: "Du",
      description: "Premier jour (UTC). Remplace le début de la période",
    },
    to: {
      label: "Au",
      description: "Dernier jour (UTC). Remplace la fin de la période",
    },
    granularity: {
      label: "Intervalles du graphique",
      description: "Jour, semaine ou mois. Auto choisit selon la durée",
    },
    includeInternal: {
      label: "Inclure les admins",
      description: "Compter les comptes admin internes et leurs paiements",
    },
  },
  response: {
    period: "Période",
    kpis: "KPI",
    series: "Séries temporelles",
    channels: "Canaux d'inscription",
    revenueByCurrency: "Revenu par devise",
    subscriptionsByStatus: "Abonnements par statut",
    topSpenders: "Plus gros dépensiers",
    generatedAt: "Généré le",
  },
  enums: {
    range: {
      last7Days: "7 derniers jours",
      last30Days: "30 derniers jours",
      last90Days: "90 derniers jours",
      last12Months: "12 derniers mois",
      thisMonth: "Ce mois-ci",
      lastMonth: "Le mois dernier",
      allTime: "Depuis le début",
      custom: "Dates personnalisées",
    },
    granularity: {
      auto: "Auto",
      day: "Jour",
      week: "Semaine",
      month: "Mois",
    },
  },
  kpi: {
    revenue: "Revenu",
    revenueHint: "Paiements réussis, USD",
    refundsHint: "{{amount}} remboursés",
    mrr: "MRR",
    mrrHint: "{{active}} abonnements actifs, {{pastDue}} en retard",
    payingUsers: "Utilisateurs payants",
    payingAllTimeHint: "{{count}} ont déjà payé",
    creditsSpent: "Crédits dépensés",
    creditsHint: "environ {{usd}} d'usage",
    newUsers: "Inscriptions",
    totalUsersHint: "{{count}} utilisateurs au total",
    activeUsers: "Utilisateurs actifs",
    anonymousHint: "+{{count}} visiteurs anonymes qui dépensent",
    signupToPaid: "Inscription vers paiement",
    ratioHint: "{{converted}} sur {{cohort}} nouveaux inscrits ont payé",
    retentionD7: "Rétention J7",
    retentionHint: "{{converted}} sur {{cohort}} sont revenus après J7",
    activeSubscribers: "Abonnés actifs",
    pastDue: "En retard de paiement",
    totalUsers: "Total utilisateurs",
    payingAllTime: "Ont déjà payé",
    revenueAllTime: "Revenu total",
    refunds: "Remboursements",
    anonymousActive: "Dépensiers anonymes",
  },
  series: {
    signups: "Inscriptions",
    activeUsers: "Actifs",
    payingUsers: "Payants",
    revenueUsd: "Revenu",
    creditsSpent: "Crédits",
  },
  sections: {
    trend: "Tendance",
    channels: "Canaux d'inscription",
    subscriptions: "Abonnements actuels",
    currencies: "Revenu par devise",
    topSpenders: "Plus gros dépensiers de la période",
  },
  table: {
    channel: "Canal",
    signups: "Inscriptions",
    paying: "Payants",
    conversion: "Conv.",
    user: "Utilisateur",
    creditsSpent: "Crédits dépensés",
    lifetimePaid: "Total payé",
  },
  widget: {
    times: "{{count}}x",
    loading: "Calcul en cours...",
    users: "Utilisateurs",
    refresh: "Actualiser",
    new: "nouveaux",
    noData: "Aucune donnée sur cette période.",
    chartTotal: "Total {{total}}",
    period:
      "Du {{from}} au {{to}} ({{days}} jours, UTC). Variations par rapport aux {{days}} jours précédents.",
    definitions:
      "Actif = a dépensé des crédits (portefeuille propre ou de lead lié). Payant = paiement réussi sur la période. Revenu en USD à taux de change fixe. MRR = abonnements en cours valorisés à leur dernier paiement. Comptes admin exclus, sauf s'ils sont inclus ci-dessus.",
    text: {
      header: "Du {{from}} au {{to}} ({{days}} jours, UTC)",
      metric: "Indicateur",
      current: "Actuel",
      previous: "Avant",
      change: "Variation",
      bucket: "Intervalle",
      paying: "{{count}} payants",
      footer:
        "Périodes : --range=enums.range.last7Days|last90Days|last12Months|allTime. Utilisateurs : vibe users-list",
    },
  },
  errors: {
    validation: {
      title: "Requête de stats invalide",
      description: "Vérifiez la période et les dates",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour voir les stats",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Le rôle admin est requis pour voir les stats",
    },
    notFound: {
      title: "Aucune donnée",
      description: "Rien à afficher pour cette période",
    },
    server: {
      title: "Impossible de calculer les stats",
      description:
        "Le serveur n'a pas pu calculer les statistiques utilisateurs",
    },
    network: {
      title: "Erreur réseau",
      description: "Impossible de joindre le serveur",
    },
    unknown: {
      title: "Erreur inattendue",
      description: "Un problème est survenu lors du calcul des stats",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "La requête est en conflit avec les données actuelles",
    },
  },
  success: {
    title: "Stats prêtes",
    description: "Statistiques utilisateurs calculées",
  },
};
