import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "File des campagnes",
  description: "Leads actuellement actifs dans des campagnes e-mail",
  enums: {
    delivery: {
      stuck: "Envois bloqués",
      dueNow: "Dus maintenant",
      overdue: "En retard 24 h+",
      scheduled: "Planifiés",
      failed: "Échoués",
      sent: "Envoyés",
      opened: "Envoyés et ouverts",
      clicked: "Envoyés et cliqués",
      unsubscribed: "Désinscrits",
      bounced: "Rejetés",
    },
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
    campaignType: {
      leadCampaign: "Campagne leads",
      newsletter: "Newsletter",
      signupNurture: "Accompagnement inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      transactional: "Transactionnel",
      notification: "Notification",
      system: "Système",
    },
    campaignTypeFilter: {
      all: "Tous",
    },
  },
  get: {
    title: "File des campagnes",
    titleShort: "File des campagnes",
    description:
      "Liste paginée des leads actuellement dans des campagnes e-mail",
    fields: {
      delivery: {
        label: "État de l'e-mail",
        description:
          "Leads avec un e-mail dans cet état. Envoyé, ouvert, cliqué, désinscrit, rejeté et échoué utilisent la fenêtre de dates",
        placeholder: "Tout état",
      },
      journeyVariant: {
        label: "Variante de parcours",
        description: "Seulement les e-mails de ce parcours",
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
      eventFrom: {
        label: "Du",
        description: "Premier jour de la fenêtre d'événements",
      },
      eventTo: {
        label: "Au",
        description: "Dernier jour de la fenêtre d'événements",
      },
      page: {
        label: "Page",
        description: "Numéro de page",
      },
      pageSize: {
        label: "Taille de page",
        description: "Nombre d'enregistrements par page",
      },
      campaignType: {
        label: "Type de campagne",
        description: "Filtrer par type de campagne",
      },
    },
    response: {
      matchedAt: "Dernier événement correspondant",
      matchedSubject: "Objet de l’e-mail correspondant",
      daysOverdue: "Jours de retard",
      nextSubject: "Objet planifié",
      leadId: "ID du lead",
      leadEmail: "E-mail",
      businessName: "Entreprise",
      campaignType: "Type de campagne",
      journeyVariant: "Variante de parcours",
      currentStage: "Étape actuelle",
      nextScheduledAt: "Prochain e-mail",
      emailsSent: "Envoyés",
      emailsOpened: "Ouverts",
      emailsClicked: "Cliqués",
      startedAt: "Démarré le",
      total: "Total",
      page: "Page",
      pageSize: "Taille de page",
      items: "Éléments de la file",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir la file des campagnes",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Vous n'avez pas l'autorisation de voir la file des campagnes",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors du chargement de la file des campagnes",
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
      title: "File récupérée",
      description: "File des campagnes récupérée",
    },
  },
  widget: {
    matchedEvents:
      "Une ligne par contact. Elle affiche le dernier événement correspondant.",
    overdueDays: "En retard de {{days}} jours, jamais envoyé",
    titleWithCount: "File des campagnes ({{count}})",
    eventWindow: "Événements e-mail du {{from}} au {{to}}",
    title: "File des campagnes",
    refresh: "Actualiser",
    noData: "Aucune entrée dans la file des campagnes",
    emptyDescription:
      "Les e-mails en attente et les leads en campagne active s’affichent ici.",
    back: "Retour",
    loading: "Chargement de la file des campagnes",
    selectedLead: "Lead sélectionné",
    clearFilters: "Effacer les filtres",
    leadEmpty: "Aucune entrée dans la file pour ce lead",
    firstPage: "Aller à la première page",
    scheduledFor: "Planifié le {{date}}",
    noScheduledEmail: "Aucun e-mail planifié",
    deliveryStats:
      "{{sent}} envoyés · {{opened}} ouverts · {{clicked}} cliqués",
    startedOn: "Lancée le {{date}}",
    openLead: "Ouvrir le lead",
    openLeadNamed: "Ouvrir le lead {{recipient}}",
    previous: "Précédente",
    next: "Suivante",
    pagination: "Page {{page}} sur {{totalPages}} · {{total}} leads",
  },
};
