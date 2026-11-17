import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Statistiques des campagnes",
  description: "Statistiques de performance des campagnes e-mail",
  enums: {
    emailJourneyVariantFilter: {
      all: "Toutes",
      uncensoredConvert: "Conversion non censurée",
      sideHustle: "Revenu complémentaire",
      quietRecommendation: "Recommandation discrète",
      signupNurture: "Accompagnement inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      newsletterMay2026: "Newsletter mai 2026",
      newsletterNov2026: "Newsletter novembre 2026",
    },
  },
  get: {
    title: "Statistiques des campagnes",
    titleShort: "Stats campagnes",
    description:
      "Récupérer les statistiques de performance des campagnes e-mail",
    container: {
      title: "Filtres",
      description: "Filtrer les statistiques des campagnes",
    },
    fields: {
      journeyVariant: {
        label: "Variante de parcours",
        description: "Filtrer par variante de parcours e-mail",
      },
    },
    response: {
      total: "Total des campagnes",
      pending: "En attente",
      sent: "Envoyés",
      delivered: "Délivrés",
      opened: "Ouverts",
      clicked: "Cliqués",
      failed: "Échoués",
      openRate: "Taux d'ouverture",
      clickRate: "Taux de clic",
      deliveryRate: "Taux de délivrabilité",
      failureRate: "Taux d'échec",
      byStage: "Par étape",
      byJourneyVariant: "Par variante de parcours",
      byStatus: "Par statut",
      totalLeads: "Total des leads",
      linkedLeadsCount: "Leads reliés",
      uniquePersonsEstimate: "Personnes uniques (est.)",
      pendingLeadsCount: "Leads actifs en campagne",
      emailsScheduledToday: "E-mails planifiés aujourd'hui",
      quotaProgress: "Avancement du quota hebdomadaire",
      campaignTasks: "Tâches de campagne",
      alerts: "Alertes",
      taskStats: "Statistiques des tâches",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour voir les statistiques des campagnes",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Vous n'avez pas l'autorisation de voir les statistiques des campagnes",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors du chargement des statistiques des campagnes",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
    },
    success: {
      title: "Statistiques récupérées",
      description: "Statistiques des campagnes récupérées",
    },
  },
  widget: {
    title: "Performance des campagnes",
    refresh: "Actualiser",
    noData: "Pas encore de données de campagne",
    openRateSuffix: " % ouverture",
    clickRateSuffix: " % CTR",
    stageLabel: "Entonnoir par étape",
    statusLabel: "Statut d'envoi",
    variantLabel: "Par parcours",
    emDash: "-",
    leadOverview: "Vue d'ensemble des leads",
    totalLeads: "Total des leads",
    linkedLeadsCount: "Leads reliés",
    uniquePersonsEstimate: "Personnes uniques (est.)",
    uniquePersonsTooltip:
      "Leads moins les leads secondaires reliés (doublons d'une même personne)",
    activeCampaigns: "Campagnes actives",
    sendPerformance: "Performance d'envoi",
    perRunBudget:
      "~{{perRunBudget}}/exécution · {{totalRunsPerWeek}} exécutions/semaine",
    perRunBudgetZero:
      "0/exécution : augmentez le quota ou réduisez la fréquence",
    accumulator: "prochain lead : {{pct}} %",
    cronHealth: {
      title: "État des crons",
      healthy: "Sain",
      warning: "Avertissement",
      critical: "Critique",
      enabled: "activé",
      failed24h: "échecs (24 h)",
      lastRun: "Dernière exécution",
      nextRun: "Prochaine exécution",
      never: "Jamais",
      runNow: "Exécuter maintenant",
      alerts: "Alertes",
      alertFailures: "échecs consécutifs",
      empty: "Aucune tâche de campagne configurée",
      status: {
        running: "En cours",
        completed: "Terminée",
        failed: "Échouée",
        error: "Erreur",
        timeout: "Délai dépassé",
        pending: "En attente",
        scheduled: "Planifiée",
        cancelled: "Annulée",
        unknown: "Inconnu",
      },
    },
  },
};
