import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  platformSummary: {
    grossReceipts: "Encaissements bruts",
    refunds: "Remboursements",
    netReceipts: "Encaissements après remboursements",

    valuationBasis:
      "La marge correspond à la valeur des crédits au tarif catalogue, moins le coût du fournisseur. Seuls les usages dont le coût est connu sont inclus.",
    valuationCost: "Coût estimé de l’IA",
    valuationMargin: "Marge estimée sur l’utilisation de l’IA",
    newAccount: "Compte créé",
    receivedPayment: "Paiement reçu",
    completedTask: "Tâche planifiée terminée",
    operations: "Exploitation",
    emptyActivity: "Aucune activité sur cette période.",
    period: "30 derniers jours comparés aux 30 jours précédents",
    retry: "Réessayer",
    title: "Vue d’ensemble de la plateforme",
    description:
      "Consultez l’acquisition, les revenus et l’état des services sur les 30 derniers jours.",
    unavailable: "Indisponible",
    recent: "Activité récente",
  },
  category: "Analytique",
  tags: {
    analytics: "Analytique",
    overview: "Vue d'ensemble",
  },
  get: {
    title: "Vue d'ensemble",
    titleShort: "Vue d'ensemble",
    description:
      "Trafic, leads, inscriptions, clients payants, revenus, coût IA et alertes sur une période, comparés à la période précédente. Chaque chiffre ouvre le rapport correspondant.",
    response: {
      window: "Période",
      generatedAt: "Données de",
      acquisition: "Acquisition",
      referral: "Parrainage",
      money: "Finances",
      ops: "Exploitation",
    },
    widget: {
      kpi: {
        visits: "Visites humaines",
        humanLeads: "Nouveaux leads",
        botLeadsHint: "{{count}} leads de bots exclus",
        botVisitsHint: "{{count}} visites de bots exclues",
        excludedLeadsHint: "{{bots}} leads bots et {{unknown}} inconnus exclus",
        excludedVisitsHint:
          "{{bots}} visites bots et {{unknown}} inconnues exclues",
        creditSpendHintNoPrevCost:
          "Coût fournisseur {{cost}} (non enregistré sur la période précédente). {{guests}} par des invités.",
        creditSpendHintNoCompare:
          "Coût fournisseur {{cost}}. {{guests}} par des invités.",
        payersHint: "Payeurs distincts sur la période",
        signups: "Inscriptions",
        signupRateHint: "{{rate}} des nouveaux leads",
        payers: "Clients ayant payé",
        revenue: "Revenus",
        revenueHint: "Argent encaissé, env. USD",
        revenueNetHint:
          "Argent encaissé, env. USD. {{net}} après coût fournisseurs IA.",
        creditSpend: "Usage IA (crédits consommés)",
        guestSpendHint: "{{amount}} par des invités",
        creditSpendHint:
          "Coût fournisseurs {{cost}} (vs {{previous}}). {{guests}} par des invités.",
        margin: "Marge sur l'usage IA",
        marginPartial: "Marge IA (partielle)",
        marginHint:
          "Coût fournisseurs {{cost}}. Facturé moins coût, quand le coût est connu.",
        marginBaseHint:
          "{{rate}} de {{base}} d'usage facturé avec données de coût. Coût fournisseurs {{cost}}.",
        marginRateHint:
          "{{margin}} sur {{base}} avec données de coût ({{coverage}} de l'usage).",
        errors: "Erreurs non résolues",
        errorsHint: "{{count}} occurrences sur la période",
        botShare: "Part de bots dans les leads",
        botShareHint:
          "{{count}} leads de bots, source principale dans À surveiller",
        botShareTopHint: "{{count}} leads de bots. Plus gros pic {{prefix}}.",
      },
      trafficChart: "Leads humains et inscriptions",
      trafficChartHint: "Bots exclus",
      moneyChart: "Revenus",
      moneyChartHint: "Encaissements par intervalle",
      series: {
        visits: "Visites",
        leads: "Nouveaux leads",
        signups: "Inscriptions",
        revenueUsd: "Revenus",
        spendUsd: "Usage IA facturé",
        upstreamCostUsd: "Coût fournisseurs",
      },
      sources: "D'où viennent les leads (premier contact)",
      sourcesDimension: "Canal",
      sourcesHint:
        "Activité de la période selon le canal de premier contact de chaque personne",
      referralsHint:
        "Clics, inscriptions et paiements attribués au code sur cette période",
      leadShare: "Part des leads",
      revenueShare: "Part des revenus",
      footerSources:
        "Revenus de ces lignes : {{rows}} sur {{total}} encaissés sur la période",
      footerReferrals:
        "Attribué aux codes (base de commission) : {{rows}} sur {{total}} encaissés sur la période",
      referrals: "Meilleurs codes de parrainage",
      referralsDimension: "Code",
      columns: {
        leads: "Leads",
        signups: "Inscriptions",
        payers: "Payants",
        clicks: "Clics",
        revenueUsd: "Revenus",
        conversion: "Lead vers inscription",
        clickToSignup: "Clic vers inscription",
      },
      alerts: {
        severity: { high: "Élevé", medium: "Moyen", low: "Faible" },
        title: "À surveiller",
        none: "Rien à signaler sur cette période.",
        abuse:
          "{{count}} plages IP avec pics de leads, en tête {{prefix}} ({{leads}} leads)",
        payouts: "{{count}} demandes de paiement en attente ({{amount}})",
        tasks: "{{count}} tâches planifiées en échec",
        connections: "{{count}} connexions distantes en défaut",
        costCoverage:
          "Coût fournisseurs connu pour seulement {{coverage}} de l'usage IA, marge partielle",
        unattributed: "{{share}} des revenus sans source connue ({{amount}})",
        errors:
          "{{count}} erreurs non résolues, {{occurrences}} occurrences sur la période",
        errorsSince:
          "{{count}} erreurs non résolues, {{occurrences}} occurrences depuis le {{date}} (comptage quotidien depuis)",
      },
      open: {
        acquisition: "Rapport d'acquisition",
        funnel: "Entonnoir",
        referrals: "Vue parrainage",
        revenue: "Rapport de revenus",
        usage: "Rapport d'usage IA",
        errors: "Journal des erreurs",
      },
      unavailable: "Cette section n'a pas pu être chargée.",
      asOf: "Données de {{time}}. Mises en cache une minute.",
      loading: "Chargement de la vue d'ensemble",
    },
    errors: {
      unauthorized: {
        title: "Non connecté",
        description:
          "Connectez-vous en tant qu'admin pour voir la vue d'ensemble.",
      },
      validation: {
        title: "Période invalide",
        description: "Vérifiez la période et les dates.",
      },
      server: {
        title: "Échec de la vue d'ensemble",
        description: "La vue d'ensemble n'a pas pu être calculée. Réessayez.",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème est survenu pendant le chargement.",
      },
      network: {
        title: "Erreur réseau",
        description: "Le serveur est injoignable.",
      },
      forbidden: {
        title: "Réservé aux admins",
        description: "Seuls les admins voient la vue d'ensemble.",
      },
      notFound: {
        title: "Introuvable",
        description: "La vue d'ensemble n'est pas disponible.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord vos modifications.",
      },
      conflict: {
        title: "Conflit",
        description: "Les données ont changé pendant le chargement. Réessayez.",
      },
    },
    success: {
      title: "Vue d'ensemble chargée",
      description: "Vue d'ensemble pour la période choisie.",
    },
  },
};
