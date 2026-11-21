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
    title: "Entonnoir",
    titleShort: "Entonnoir",
    description:
      "Leads créés sur la période et jusqu'où ils sont allés : humain, premier chat, inscription, e-mail confirmé, paiement. Par canal, source ou code parrain. Chaque étape ouvre ses leads.",
    response: {
      window: "Période",
      dimensionUsed: "Dimension du segment",
      steps: "Étapes de l'entonnoir",
      previousSteps: "Étapes de la période précédente",
      rates: "Taux de conversion",
      segments: "Entonnoir par segment",
      trend: "Tendance de la cohorte",
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
        description: "Impossible de calculer le rapport d'entonnoir.",
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
      description: "Rapport d'entonnoir chargé.",
    },
  },
  widget: {
    loading: "Chargement de l'entonnoir...",
    cohortHint: "sur {{count}} leads créés",
    signupRate: "Taux d'inscription",
    payRate: "Taux de paiement",
    overallRate: "D'humain à payeur",
    overallShort: "Vers payeur",
    ofHumans: "{{count}} sur {{total}} leads humains",
    ofSignups: "{{count}} sur {{total}} inscriptions",
    funnelTitle: "Entonnoir de cohorte",
    funnelSubtitle:
      "Entonnoir à partir des leads humains. Bots et leads bruts : première carte.",
    trendTitle: "Cohorte par jour de création",
    trendSubtitle: "Leads humains et combien d'entre eux ont converti.",
    segmentsTitle: "Entonnoir par segment",
    segmentsSubtitle:
      "Taux par lead humain. Cliquez sur une ligne pour ses leads.",
    filtersTitle: "Segment",
    filtersSubtitle: "Affine chaque chiffre de cette page.",
    apply: "Appliquer",
    empty: "Aucun lead sur cette période.",
  },
};
