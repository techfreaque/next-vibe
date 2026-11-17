import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Messagerie",
  },
  title: "Comptes de messagerie",
  titleShort: "Comptes",
  description: "Lister tous les comptes de messagerie, tous canaux confondus",

  fields: {
    channel: {
      label: "Canal",
      description: "Filtrer par canal",
    },
    provider: {
      label: "Fournisseur",
      description: "Filtrer par fournisseur",
    },
    status: {
      label: "Statut",
      description: "Filtrer par statut du compte",
    },
    search: {
      label: "Recherche",
      description: "Rechercher par nom ou description",
      placeholder: "Rechercher des comptes...",
    },
    page: {
      label: "Page",
      description: "Numéro de page pour la pagination",
    },
    limit: {
      label: "Limite",
      description: "Nombre de comptes par page",
    },
    sortBy: {
      label: "Trier par",
      description: "Champ de tri des comptes",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Ordre de tri (croissant ou décroissant)",
    },
  },

  response: {
    account: {
      title: "Compte",
      description: "Détails du compte de messagerie",
      id: "ID",
      name: "Nom",
      channel: "Canal",
      provider: "Fournisseur",
      status: "Statut",
      healthStatus: "Santé",
      priority: "Priorité",
      messagesSentTotal: "Messages envoyés",
      lastUsedAt: "Dernière utilisation",
      createdAt: "Créé le",
      isDefault: "Par défaut",
      smtpFromEmail: "E-mail d'expédition",
      fromId: "ID d'expéditeur",
    },
    pagination: {
      title: "Pagination",
      description: "Informations de pagination",
      page: "Page",
      limit: "Par page",
      total: "Total",
      totalPages: "Nombre de pages",
    },
  },

  widget: {
    create: "Ajouter un compte",
    graphs: "Graphiques",
    refresh: "Actualiser",
    emptyState: "Aucun compte de messagerie configuré",
    searchPlaceholder: "Rechercher des comptes...",
    deleteConfirm: "Supprimer ce compte ?",
    deleteConfirmYes: "Supprimer",
    deleteConfirmNo: "Annuler",
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de filtre invalides",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Accès administrateur requis",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Vous n'avez pas accès à cette ressource",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit de données s'est produit",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de récupérer les comptes",
      detail: "Impossible de charger les comptes : {{error}}",
    },
    networkError: {
      title: "Erreur réseau",
      description: "La communication réseau a échoué",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
  },

  success: {
    title: "Comptes récupérés",
    description: "Comptes de messagerie récupérés",
  },

  enums: {
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Tous les canaux",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Bot Telegram",
    },
    providerFilter: {
      any: "Tous les fournisseurs",
    },
    status: {
      active: "Actif",
      inactive: "Inactif",
      error: "Erreur",
      testing: "En test",
    },
    statusFilter: {
      any: "Tous les statuts",
    },
    healthStatus: {
      healthy: "Opérationnel",
      degraded: "Dégradé",
      unhealthy: "Défaillant",
      unknown: "Inconnu",
    },
    healthStatusFilter: {
      any: "Tous",
    },
    sortField: {
      name: "Nom",
      channel: "Canal",
      provider: "Fournisseur",
      status: "Statut",
      priority: "Priorité",
      messagesSentTotal: "Messages envoyés",
      lastUsedAt: "Dernière utilisation",
      createdAt: "Date de création",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
  },
};
