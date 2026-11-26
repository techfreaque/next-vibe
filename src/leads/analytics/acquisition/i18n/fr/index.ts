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
    title: "Acquisition",
    titleShort: "Acquisition",
    description:
      "D'où viennent les visiteurs et les leads : canal, source, référent, campagne, page d'arrivée, pays, appareil, humains ou bots. Chaque chiffre ouvre les leads correspondants.",
    response: {
      window: "Période",
      kpis: "Chiffres clés",
      trend: "Tendance",
      breakdown: "Ventilation",
      agents: "Agents",
      coverage: "Couverture du suivi",
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
        description: "Impossible de calculer le rapport d'acquisition.",
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
      description: "Rapport d'acquisition chargé.",
    },
  },
  widget: {
    revenue: "Revenus",
    humanVisits: "Visites humaines",
    botVisits: "Visites de bots",
    botVisitsHint: "{{count}} visites de bots",
    unknownLeadsHint: "{{count}} de plus sans user agent (inconnu)",
    botsTitle: "Leads bots",
    botsSubtitle:
      "Robots, aperçus de liens et scripts. Cliquez sur une barre pour voir ses leads.",
    loading: "Chargement du rapport d'acquisition...",
    pageSubtitle:
      "D'où viennent les leads et comment ils convertissent. Cliquez sur un chiffre pour voir ses leads.",
    coverage:
      "Les visites sont suivies depuis le {{date}}. Les leads plus anciens comptent, mais sans visites.",
    botShareHint: "{{percent}} des nouveaux leads",
    leadsTitle: "Leads humains",
    leadsSubtitle:
      "Nouveaux leads humains. Cliquez sur une barre pour voir ses leads.",
    visitsTitle: "Visites suivies",
    visitsSubtitle: "Arrivées suivies. Humains vs leads classés comme bots.",
    conversionsTitle: "Inscriptions et payants",
    conversionsSubtitle: "Selon le jour où chaque étape a eu lieu.",
    breakdownTitle: "D'où viennent les leads",
    breakdownSubtitle: "Premier contact. Cliquez sur une ligne pour ses leads.",
    agentsTitle: "Qui se présente",
    agentsSubtitle: "Famille d'agent déduite du user agent.",
    filtersTitle: "Segment",
    filtersSubtitle: "Affine chaque chiffre de cette page.",
    apply: "Appliquer",
    empty: "Aucun lead sur cette période.",
    emptyHint: "Choisissez une période plus longue ou effacez les filtres.",
  },
};
