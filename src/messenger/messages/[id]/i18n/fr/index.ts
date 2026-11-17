import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-mails",
  tags: {
    emails: "E-mails",
  },
  title: "Détail de l'e-mail",
  titleShort: "Détail de l'e-mail",
  description: "Récupère un e-mail par son identifiant unique",
  container: {
    title: "Détails de l'e-mail",
    description: "Informations détaillées sur un e-mail précis",
  },
  fields: {
    id: {
      label: "ID de l'e-mail",
      description: "Identifiant unique de l'e-mail à récupérer",
    },
  },
  response: {
    email: {
      title: "Détails de l'e-mail",
      description: "Informations complètes sur l'e-mail demandé",
      id: "ID de l'e-mail",
      subject: "Objet",
      recipientEmail: "E-mail du destinataire",
      recipientName: "Nom du destinataire",
      senderEmail: "E-mail de l'expéditeur",
      senderName: "Nom de l'expéditeur",
      type: "Type d'e-mail",
      status: "Statut",
      templateName: "Nom du modèle",
      emailProvider: "Fournisseur d'e-mail",
      externalId: "ID externe",
      sentAt: "Envoyé le",
      deliveredAt: "Livré le",
      openedAt: "Ouvert le",
      clickedAt: "Cliqué le",
      retryCount: "Nombre de tentatives",
      error: "Message d'erreur",
      userId: "ID utilisateur",
      leadId: "ID du lead",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
    },
  },
  get: {
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID d'e-mail fourni n'est pas valide",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être authentifié pour accéder aux détails de l'e-mail",
      },
      not_found: {
        title: "E-mail introuvable",
        description: "Aucun e-mail ne correspond à cet ID",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de voir cet e-mail",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur est survenue lors de la récupération de l'e-mail",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
    },
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "L'ID d'e-mail fourni n'est pas valide",
    },
    unauthorized: {
      title: "Non autorisé",
      description:
        "Vous devez être authentifié pour accéder aux détails de l'e-mail",
    },
    notFound: {
      title: "E-mail introuvable",
      description: "Aucun e-mail ne correspond à cet ID",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Vous n'avez pas l'autorisation de voir cet e-mail",
    },
    server: {
      title: "Erreur serveur",
      description:
        "Une erreur interne du serveur est survenue lors de la récupération de l'e-mail",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit est survenu lors du traitement de la requête",
    },
    network: {
      title: "Erreur réseau",
      description:
        "Une erreur réseau est survenue lors de la récupération de l'e-mail",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Des modifications n'ont pas été enregistrées",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue est survenue",
    },
  },
  success: {
    title: "E-mail récupéré",
    description: "Détails de l'e-mail récupérés",
  },
  widget: {
    parties: "Parties",
    to: "À",
    from: "De",
    timestamps: "Horodatages",
    sentAt: "Envoyé le",
    deliveredAt: "Livré le",
    openedAt: "Ouvert le",
    clickedAt: "Cliqué le",
    technical: "Détails techniques",
    template: "Modèle",
    provider: "Fournisseur",
    externalId: "ID externe",
    retryCount: "Nombre de tentatives",
    error: "Erreur",
    associations: "Associations",
    lead: "Lead",
    user: "Utilisateur",
    notFound: "E-mail introuvable",
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
    type: {
      transactional: "Transactionnel",
      marketing: "Marketing",
      notification: "Notification",
      system: "Système",
      leadCampaign: "Campagne de leads",
      userCommunication: "Communication utilisateur",
    },
    provider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Autre",
    },
  },
};
