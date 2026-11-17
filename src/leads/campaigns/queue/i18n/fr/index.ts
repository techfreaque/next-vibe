import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "File des campagnes",
  description: "Leads actuellement actifs dans des campagnes e-mail",
  enums: {
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
    title: "File des campagnes",
    refresh: "Actualiser",
    noData: "Aucun lead en campagne actuellement",
    emptyDescription:
      "Les leads inscrits dans des campagnes e-mail apparaîtront ici. Utilisez le lanceur de campagnes du tableau de bord ou configurez le planificateur dans les paramètres pour commencer à inscrire des leads.",
    empty: "Aucun lead trouvé",
    columnEmail: "E-mail",
    columnBusiness: "Entreprise",
    columnType: "Type",
    columnStage: "Étape",
    columnVariant: "Variante",
    columnNext: "Prochain e-mail",
    columnSent: "Envoyés",
    columnOpen: "Ouverts",
    columnClick: "Cliqués",
    columnStarted: "Démarré",
    never: "-",
    pagination: "Page {{page}} sur {{totalPages}} · {{total}} leads",
  },
};
