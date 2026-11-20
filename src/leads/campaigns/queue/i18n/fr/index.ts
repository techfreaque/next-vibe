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
