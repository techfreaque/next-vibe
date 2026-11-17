import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-mails",
  tags: {
    emails: "E-mails",
  },
  title: "Liste des e-mails",
  titleShort: "Liste des e-mails",
  description: "Récupère une liste paginée d'e-mails, avec filtres",
  container: {
    title: "Liste des e-mails",
    description: "Paramétrez la liste des e-mails et consultez les résultats",
  },
  filters: {
    title: "Filtres",
    description: "Filtrer et rechercher des e-mails",
  },
  displayOptions: {
    title: "Options d'affichage",
  },
  fields: {
    dateRange: {
      title: "Période",
    },
    page: {
      label: "Page",
      description: "Numéro de page pour la pagination",
      placeholder: "Saisir le numéro de page",
    },
    limit: {
      label: "Limite",
      description: "Nombre d'éléments par page",
      placeholder: "Saisir la limite",
    },
    search: {
      label: "Recherche",
      description: "Rechercher par objet, destinataire ou expéditeur",
      placeholder: "Rechercher des e-mails...",
    },
    status: {
      label: "Statut",
      description: "Filtrer par statut d'e-mail",
      placeholder: "Choisir un statut",
    },
    channel: {
      label: "Canal",
      description: "Filtrer par canal de message",
    },
    type: {
      label: "Type",
      description: "Filtrer par type d'e-mail",
      placeholder: "Choisir un type",
    },
    sortBy: {
      label: "Trier par",
      description: "Champ de tri",
      placeholder: "Choisir le champ de tri",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Sens du tri",
      placeholder: "Choisir l'ordre de tri",
    },
    dateFrom: {
      label: "Du",
      description: "E-mails à partir de cette date",
      placeholder: "Choisir la date de début",
    },
    dateTo: {
      label: "Au",
      description: "E-mails jusqu'à cette date",
      placeholder: "Choisir la date de fin",
    },
  },
  response: {
    emails: {
      title: "E-mails",
      emptyState: {
        title: "Aucun e-mail trouvé",
        description: "Aucun e-mail ne correspond à vos filtres",
      },
      item: {
        title: "E-mail",
        description: "Détails de l'e-mail",
        id: "ID",
        subject: "Objet",
        recipientEmail: "E-mail du destinataire",
        recipientName: "Nom du destinataire",
        senderEmail: "E-mail de l'expéditeur",
        senderName: "Nom de l'expéditeur",
        type: "Type",
        status: "Statut",
        channel: "Canal",
        templateName: "Nom du modèle",
        emailProvider: "Fournisseur d'e-mail",
        externalId: "ID externe",
        sentAt: "Envoyé le",
        deliveredAt: "Livré le",
        openedAt: "Ouvert le",
        clickedAt: "Cliqué le",
        retryCount: "Nombre de tentatives",
        error: "Erreur",
        userId: "ID utilisateur",
        leadId: "ID du lead",
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
        emailCore: {
          title: "Informations principales",
        },
        emailParties: {
          title: "Expéditeur et destinataire",
        },
        emailMetadata: {
          title: "Métadonnées",
        },
        emailEngagement: {
          title: "Suivi de l'engagement",
        },
        technicalDetails: {
          title: "Détails techniques",
        },
        associatedIds: {
          title: "ID associés",
        },
        timestamps: {
          title: "Horodatages",
        },
      },
    },
    pagination: {
      title: "Pagination",
      description: "Informations de pagination",
      page: "Page actuelle",
      limit: "Éléments par page",
      total: "Total des éléments",
      totalPages: "Nombre de pages",
    },
    filters: {
      title: "Filtres appliqués",
      description: "Filtres actuellement appliqués",
      status: "Filtre de statut",
      type: "Filtre de type",
      search: "Recherche",
      dateFrom: "Date de début",
      dateTo: "Date de fin",
    },
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Les paramètres fournis ne sont pas valides",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous devez être authentifié pour accéder à cette ressource",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Vous n'avez pas l'autorisation d'accéder à cette ressource",
    },
    notFound: {
      title: "Introuvable",
      description: "La ressource demandée est introuvable",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
      detail_list: "Impossible de charger les messages : {{error}}",
      detail_get: "Impossible de charger le message : {{error}}",
      detail_create: "Impossible d'enregistrer le message : {{error}}",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue est survenue",
    },
    unsaved: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "La requête est en conflit avec l'état actuel",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau est survenue",
    },
  },
  success: {
    title: "Succès",
    description: "E-mails récupérés",
  },
  widget: {
    to: "À",
    retries: "Tentatives",
    opened: "Ouvert",
    clicked: "Cliqué",
    stats: "Stats",
    graphs: "Graphiques",
    refresh: "Actualiser",
    searchPlaceholder: "Rechercher des e-mails...",
    clearSearch: "Effacer",
    emptyState: "Aucun e-mail trouvé",
    emptyFiltered: "Aucun e-mail ne correspond à vos filtres",
    page: "Page",
    tabs: {
      all: "Tous",
      sent: "Envoyés",
      delivered: "Livrés",
      opened: "Ouverts",
      failed: "Échecs",
      bounced: "Rejetés",
    },
  },
  enums: {
    status: {
      pending: "En attente",
      sent: "Envoyé",
      delivered: "Livré",
      opened: "Ouvert",
      clicked: "Cliqué",
      bounced: "Rejeté",
      failed: "Échec",
      unsubscribed: "Désabonné",
    },
    statusFilter: {
      any: "Tous les statuts",
    },
    type: {
      transactional: "Transactionnel",
      marketing: "Marketing",
      notification: "Notification",
      system: "Système",
      leadCampaign: "Campagne de leads",
      userCommunication: "Communication utilisateur",
    },
    typeFilter: {
      any: "Tous les types",
    },
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Tous les canaux",
    },
    sortField: {
      subject: "Objet",
      recipientEmail: "E-mail du destinataire",
      recipientName: "Nom du destinataire",
      type: "Type",
      status: "Statut",
      sentAt: "Envoyé le",
      createdAt: "Créé le",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
  },
};
