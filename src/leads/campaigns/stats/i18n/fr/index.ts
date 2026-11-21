import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Performance des campagnes",
  description:
    "Les e-mails de campagne partent-ils, qu'est-ce qui bloque dans la file et que donne chaque parcours",
  enums: {
    emailJourneyVariantFilter: {
      all: "Toutes",
      uncensoredConvert: "Converti au non censuré",
      sideHustle: "Revenu d'appoint",
      quietRecommendation: "Recommandation discrète",
      signupNurture: "Accompagnement après inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      newsletterMay2026: "Newsletter mai 2026",
      newsletterNov2026: "Newsletter novembre 2026",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Converti au non censuré",
      sideHustle: "Revenu d'appoint",
      quietRecommendation: "Recommandation discrète",
      signupNurture: "Accompagnement après inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      newsletterMay2026: "Newsletter mai 2026",
      newsletterNov2026: "Newsletter novembre 2026",
    },
    emailCampaignStageFilter: {
      all: "Toutes",
    },
    emailCampaignStage: {
      notStarted: "Pas commencé",
      initial: "Premier contact",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Nurturing",
      reactivation: "Réactivation",
    },
  },
  get: {
    title: "Performance des campagnes",
    titleShort: "Campagnes",
    description:
      "État du moteur, santé de la file et performance des e-mails dans le temps : envoyés, ouverts, cliqués, désinscrits, rejetés et échoués par variante de parcours, étape et langue. Chaque chiffre ouvre les leads concernés.",
    fields: {
      journeyVariant: {
        label: "Variante de parcours",
        description: "Seulement ce parcours e-mail",
        placeholder: "Tout parcours",
      },
      stage: {
        label: "Étape",
        description: "Seulement les e-mails de cette étape",
        placeholder: "Toute étape",
      },
      locale: {
        label: "Langue",
        description: "Locale rendue (de-DE) ou langue (de)",
        placeholder: "Toute langue",
      },
    },
    response: {
      variantTrend: "Envoyés par parcours",
      window: "Période",
      engine: "État du moteur",
      queue: "Santé de la file",
      kpis: "Indicateurs",
      totals: "Totaux",
      trend: "Envoyés, ouverts, cliqués",
      problems: "Échecs, rejets, désinscriptions",
      funnel: "Entonnoir e-mail",
      byVariant: "Par variante de parcours",
      byStage: "Par étape",
      byLocale: "Par langue",
      topErrors: "Principales erreurs d'envoi",
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
    groups: {
      now: "En ce moment",
      period: "Sur la période choisie",
    },
    stuck: "Jamais envoyé",
    title: "Performance des campagnes",
    loading: "Chargement des chiffres...",
    filters: "Filtres",
    openQueue: "Ouvrir la file",
    empty: "Aucun envoi sur cette période.",
    emptySendingOff:
      "Aucun envoi sur cette période. L'envoi est coupé, voir plus haut.",
    noProblems: "Aucun échec, rejet ou désinscription sur cette période.",
    noErrors: "Aucune erreur d'envoi sur cette période.",
    sentNoteOff:
      "Zéro envoi signifie ici moteur coupé, pas absence d'engagement.",
    errors: {
      duplicate: "Ignoré : destinataire en double",
      statusChange: "Ignoré : le lead est passé à {{status}}",
    },
    engine: {
      starterOff:
        "campaign-starter est aussi coupé : aucun nouveau lead n'entre dans un parcours.",
      otherPath:
        "Ceux-ci viennent d'un autre chemin (envoi groupé ou lancement manuel), pas du dispatcher.",
      openDispatcher: "Ouvrir les réglages du dispatcher",
      neverSent: "Aucun e-mail de campagne n'a jamais été envoyé.",
      lastSend: "Dernier envoi {{when}}. Envoyés en 24 h : {{count}}.",
      offTitle: "L'envoi est coupé",
      failingTitle: "Le dispatcher échoue ({{count}} exécutions de suite)",
      onTitle: "L'envoi tourne",
      missing:
        "Le dispatcher email-campaigns n'a pas de planification cron. {{count}} e-mails dus attendent dans la file et ne partiront jamais tant qu'il n'est pas planifié.",
      disabled:
        "Le dispatcher email-campaigns est désactivé. {{count}} e-mails dus attendent dans la file.",
      on: "Dernière exécution {{last}}, prochaine {{next}}.",
      noError: "Aucun message d'erreur enregistré.",
      openDue: "Voir {{count}} leads",
      state: {
        missing: "non planifié",
        disabled: "désactivé",
        failing: "en échec",
        running: "actif",
      },
    },
    queue: {
      oldestBiggest:
        "{{emails}} leads. Plus gros retard : {{journey}} ({{count}} e-mails)",
      stuckClaims: "Réservations d'envoi bloquées",
      stuckClaimsHint: "Réservées il y a plus d'1 h, jamais confirmées",
      stuckDaysHint: "Dû depuis {{when}}",
      stuckDays: "Plus ancien dû, jours",
      nothingScheduled: "Rien de planifié",
      dueNow: "E-mails dus",
      oldest: "{{emails}} leads en attente",
      nothingDue: "Rien en attente",
      scheduled: "Planifiés pour plus tard",
      scheduledHint: "{{count}} dans les 24 h, prochain {{when}}",
    },
    kpi: {
      bouncedOff:
        "bounce-processor est coupé : rejets peut-être sous-comptés. {{rate}} des envoyés",
      ofSentRate: "{{rate}} des envoyés",
      skippedHint: "Doublons et changements de statut non comptés : {{count}}",
      sent: "Envoyés",
      openRate: "Taux d'ouverture",
      clickRate: "Taux de clic",
      ofSent: "{{count}} des e-mails envoyés",
      unsubscribed: "Désinscrits",
      bounced: "Rejetés",
      failed: "Erreurs d'envoi sur la période",
    },
    series: {
      sent: "Envoyés",
      opened: "Ouverts",
      clicked: "Cliqués",
      failed: "Erreurs d'envoi",
      bounced: "Rejetés",
      unsubscribed: "Désinscrits",
    },
    charts: {
      errorsHint:
        "Vraies erreurs seulement. Doublons et changements de statut masqués : {{count}}",
      variantTrendHint:
        "E-mails envoyés par intervalle, par variante de parcours",
      variantTrend: "Envoyés par parcours",
      trend: "Envoyés, ouverts, cliqués",
      trendHint:
        "Par jour d'envoi : e-mails envoyés et combien ont ensuite été ouverts ou cliqués. Cliquez un jour pour ces leads.",
      problems: "Problèmes",
      problemsHint: "Envois échoués, rejets et désinscriptions par intervalle",
      funnel: "Entonnoir e-mail",
      funnelHint:
        "E-mails envoyés sur la période et ce qu'en ont fait les destinataires",
      byVariant: "Par variante de parcours",
      byVariantHint:
        "Envoyés sur la période. Dus = en attente dans la file maintenant.",
      byStage: "Par étape",
      byLocale: "Par langue",
      errors: "Erreurs d'envoi",
    },
    columns: {
      failed: "Erreurs d'envoi",
      sent: "Envoyés",
      openRate: "Ouv.",
      clickRate: "Clic",
      unsubscribed: "Désins.",
      bounced: "Rejets",
      due: "E-mails dus",
      variant: "Parcours",
      stage: "Étape",
      locale: "Langue",
      error: "Erreur",
      count: "Nombre",
    },
    definitions:
      "Les taux d'ouverture et de clic comptent les e-mails envoyés sur la période, ouverts ou cliqués à n'importe quel moment. Dus = en attente et planifiés dans le passé : seul le dispatcher email-campaigns les envoie. Langue = locale rendue, sinon langue et pays du lead.",
  },
};
