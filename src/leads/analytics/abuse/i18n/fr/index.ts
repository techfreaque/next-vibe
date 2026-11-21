import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "leads",
    analytics: "analytique",
  },
  get: {
    title: "Signaux d'abus",
    titleShort: "Abus",
    description:
      "Rafales de leads et d'inscriptions depuis un même réseau ou un même user agent, et crédits gratuits brûlés par des visiteurs jamais inscrits. Chaque ligne ouvre les leads correspondants.",
    fields: {
      minLeads: {
        label: "Seuil de rafale",
        description:
          "Leads d'un même cluster sur la période à partir desquels il compte comme rafale",
      },
    },
    response: {
      window: "Période",
      groupByUsed: "Regroupé par",
      minLeadsUsed: "Seuil de rafale",
      kpis: "Chiffres clés",
      trend: "Leads des clusters signalés",
      clusters: "Clusters",
      burners: "Plus gros consommateurs de crédits gratuits",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous en tant qu'admin.",
      },
      validation: {
        title: "Filtres invalides",
        description: "Vérifiez la période et les valeurs des filtres.",
      },
      server: {
        title: "Échec du rapport",
        description: "Impossible de calculer le rapport d'abus.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Un problème est survenu.",
      },
      network: {
        title: "Erreur réseau",
        description: "Serveur injoignable.",
      },
      forbidden: { title: "Accès refusé", description: "Réservé aux admins." },
      notFound: {
        title: "Introuvable",
        description: "Aucune donnée de rapport.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Appliquez ou annulez vos modifications de filtres.",
      },
      conflict: {
        title: "Conflit",
        description: "Les données ont changé. Rechargez.",
      },
    },
    success: {
      title: "Rapport prêt",
      description: "Rapport d'abus chargé.",
    },
  },
  widget: {
    fast: "Rapide",
    noIp: "Sans IP",
    perHour: "Leads/heure",
    thresholdOption: "{{count}}+ leads",
    loading: "Chargement des signaux d'abus...",
    flaggedPrefixes: "Réseaux signalés",
    flaggedAgents: "Agents signalés",
    thresholdHint: "{{count}}+ leads sur la période",
    flaggedLeads: "Leads en rafale",
    flaggedShare: "{{percent}} % des nouveaux leads",
    freeCredits: "Crédits gratuits brûlés",
    freeCreditsHint: "Par des visiteurs sans compte",
    burners: "Visiteurs consommateurs",
    burnersHint: "Non-inscrits qui dépensent des crédits gratuits",
    trendTitle: "Leads issus des pics",
    trendSubtitle: "Rafale = cluster avec {{count}}+ leads sur la période.",
    seriesFlagged: "En rafale",
    seriesOther: "Autres leads",
    clustersIpTitle: "Rafales par réseau",
    clustersUaTitle: "Rafales par user agent",
    clustersSubtitle:
      "Trié par leads par heure. Rapide = {{rate}}+ leads/heure. Cliquez sur une ligne pour ses leads.",
    prefix: "Réseau",
    userAgent: "User agent",
    prefixes: "Réseaux distincts",
    agents: "Agents distincts",
    noClusters: "Aucun cluster n'a atteint {{count}} leads sur cette période.",
    burnersTitle: "Plus gros consommateurs de crédits gratuits",
    burnersSubtitle: "Visiteurs sans compte. Cliquez pour ouvrir le lead.",
    lead: "Lead",
    requests: "Requêtes",
    noBurners:
      "Aucun crédit gratuit brûlé par des non-inscrits sur cette période.",
    filtersTitle: "Segment",
    filtersSubtitle: "Affine chaque chiffre de cette page.",
    apply: "Appliquer",
  },
};
