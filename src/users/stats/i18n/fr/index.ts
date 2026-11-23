import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Inscriptions",
  titleShort: "Inscriptions",
  description:
    "Qui s'est inscrit, par quel canal ou code de parrainage, combien ont vérifié leur e-mail, sont restés actifs et ont payé, et qui consomme les crédits gratuits. Chaque chiffre face à la période précédente, chaque tuile et ligne ouvre les comptes concernés.",
  category: "Utilisateurs",
  tag: "Statistiques",
  response: {
    window: "Période",
    kpis: "Indicateurs",
    totals: "Totaux",
    signupTrend: "Inscriptions dans le temps",
    activityTrend: "Activité dans le temps",
    funnel: "Entonnoir d'inscription",
    byChannel: "Par canal",
    byRefCode: "Par code de parrainage",
    byPlan: "Abonnés par formule",
    byLocale: "Par langue",
    freeBurners: "Plus gros consommateurs gratuits",
  },
  widget: {
    cohortNote:
      "Résultats à ce jour. Les comptes plus anciens ont eu plus de temps pour se confirmer, utiliser des crédits ou payer.",
    activityToggle: "Activité des comptes",
    reviewUnverified: "Vérifier les inscriptions non confirmées ({{count}})",
    planLapsed: "Abonnement expiré",
    planPacks: "Packs de crédits seuls",
    groups: {
      abuse: "Abus",
      signups: "Inscriptions de la période",
      accounts: "Tous les comptes correspondants, cette période",
    },
    cliHint:
      "Comptes derrière ces inscriptions : vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "Calcul en cours...",
    filters: "Filtres",
    openUsers: "Ouvrir les comptes",
    empty: "Aucune inscription sur cette période.",
    noJourney: "(non suivi)",
    noRefCodes: "Aucune inscription avec code de parrainage sur cette période.",
    noSubscribers: "Aucun abonné actif dans ce groupe.",
    noBurners: "Personne n'a consommé de crédits gratuits sur cette période.",
    signedUpOn: "inscrit le {{date}}",
    banned: "Banni",
    unverified: "Non vérifié",
    kpi: {
      revenuePerPayerHint: "Revenus de la période / comptes payants",
      revenuePerPayer: "Revenu par payeur",
      revenuePeriod: "Revenus de la période",
      activatedRate: "Crédits utilisés",
      signups: "Inscriptions",
      signupsHint:
        "Inscrits sur la période. {{total}} comptes correspondants au total",
      verifiedRate: "Vérifiés",
      paidConversion: "Conversion payante",
      ofSignups: "{{count}} sur {{total}} inscriptions",
      activeUsers: "Comptes actifs",
      activeHint:
        "Tous les comptes correspondants ayant utilisé des crédits sur la période",
      payingUsers: "Comptes payants",
      payingHint: "Tous les comptes correspondants ayant payé sur la période",
      revenue: "Revenus",
      revenueHint:
        "Tous les comptes correspondants, paiements réussis sur la période, USD",
      freeBurn: "Crédits gratuits consommés",
      freeBurnHint:
        "Crédits dépensés par des comptes jamais payants. Comptes : {{count}}",
      banned: "Inscriptions bannies",
      bannedHint: "Inscrits sur la période, bannis aujourd'hui",
    },
    series: {
      paid: "Payants",
      verified: "Vérifiés, non payants",
      unverified: "Non vérifiés, non payants",
      active: "Comptes actifs",
      paying: "Comptes payants",
    },
    funnel: {
      paid: "Payé",
      active: "Crédits utilisés",
      verified: "E-mail vérifié",
      signups: "Inscrits",
    },
    charts: {
      signups: "Inscriptions",
      signupsHint:
        "Nouveaux comptes par intervalle, selon ce qu'ils ont fait depuis. Cliquez une barre pour voir les comptes.",
      activity: "Activité",
      activityHint:
        "Tous les comptes correspondants par intervalle. La légende montre les comptes distincts sur la période",
      funnel: "Étapes des inscrits",
      funnelHint:
        "Inscrits de la période ayant atteint chaque étape. Les chiffres correspondent aux tuiles ci-dessus.",
      byChannel: "Inscriptions par canal du premier contact",
      byChannelHint:
        "Premier contact de ces inscrits. Revenus = leurs paiements sur la période",
      byRefCode: "Inscriptions par code de parrainage",
      byRefCodeHint:
        "Inscriptions créditées à un code, sinon code de la première visite. Peut dépasser les lignes de canal ref:",
      byPlan: "Comptes payants par formule",
      byPlanHint:
        "Comptes ayant payé sur la période et leurs revenus ; égal aux tuiles Payants et Revenus",
      byLocale: "Inscriptions par langue",
      freeBurners: "Plus gros consommateurs gratuits",
      freeBurnersHint: "Jamais payé, le plus de crédits sur la période",
    },
    columns: {
      ofSignups: "% des inscrits",
      accounts: "Comptes",
      milestone: "Étape",
      active: "Crédits utilisés",
      creditsGranted: "Accordés",
      creditsSpentTotal: "Au total",
      creditBalance: "Solde",
      signups: "Inscr.",
      verified: "Vérifiés",
      paid: "Payants",
      conversion: "Conv.",
      revenue: "Revenus de la période",
      channel: "Canal",
      refCode: "Code",
      plan: "Formule",
      subscribers: "Comptes",
      revenueWindow: "Revenus",
      locale: "Langue",
      account: "Compte",
      creditsSpent: "Sur la période",
    },
    definitions:
      "Humains seulement par défaut : admins et domaines de test exclus. Actif = crédits utilisés sur son portefeuille ou un portefeuille invité lié. Revenus en USD à taux fixes. La conversion compte les paiements à tout moment après l'inscription.",
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
