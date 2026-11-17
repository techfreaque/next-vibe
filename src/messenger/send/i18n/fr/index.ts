import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Envoyer un message",
  titleShort: "Envoyer un message",
  description:
    "Envoie un message sur n'importe quel canal (e-mail, SMS, WhatsApp, Telegram)",
  category: "Messagerie",
  tag: "Envoi",

  container: {
    title: "Envoyer un message",
    description: "Envoi via un compte de messagerie configuré",
  },

  accountId: {
    label: "Compte de messagerie",
    description: "Compte utilisé pour l'envoi",
    placeholder: "Choisir l'UUID du compte",
  },
  to: {
    label: "Destinataire",
    description: "Adresse e-mail, numéro de téléphone ou ID de chat",
    placeholder: "user@example.com ou +12025551234",
  },
  toName: {
    label: "Nom du destinataire",
    description: "Nom affiché du destinataire (facultatif)",
    placeholder: "Jean Dupont",
  },
  subject: {
    label: "Objet",
    description:
      "Ligne d'objet (e-mail uniquement, facultatif pour les autres canaux)",
    placeholder: "Votre objet...",
  },
  text: {
    label: "Message",
    description:
      "Corps en texte brut : utilisé pour SMS/WhatsApp/Telegram, et en secours pour l'e-mail",
    placeholder: "Saisissez votre message...",
  },
  html: {
    label: "Contenu HTML",
    description:
      "Corps HTML (e-mail uniquement, facultatif : le texte brut est utilisé s'il est absent)",
    placeholder: "<p>Saisissez le contenu HTML de l'e-mail...</p>",
  },
  senderName: {
    label: "Nom de l'expéditeur",
    description: "Nom affiché de l'expéditeur (e-mail uniquement, facultatif)",
    placeholder: "Votre entreprise",
  },
  replyTo: {
    label: "Adresse de réponse",
    description: "Adresse Reply-To (e-mail uniquement, facultatif)",
    placeholder: "support@example.com",
  },
  leadId: {
    label: "ID du lead",
    description: "Lead associé pour le suivi (facultatif)",
    placeholder: "UUID",
  },
  campaignId: {
    label: "ID de campagne",
    description: "Campagne associée pour le suivi (facultatif)",
    placeholder: "UUID",
  },

  response: {
    title: "Résultat de l'envoi",
    description: "Résultat de l'opération d'envoi",
    messageId: { label: "ID du message" },
    accountName: { label: "Compte" },
    channel: { label: "Canal" },
    provider: { label: "Fournisseur" },
    sentAt: { label: "Envoyé le" },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie et réessayez",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous n'avez pas l'autorisation d'envoyer des messages",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue pendant l'envoi",
      detail: "Échec de l'envoi : {{error}}",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue est survenue",
    },
    forbidden: {
      title: "Accès refusé",
      description: "L'accès à cette ressource est interdit",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau est survenue pendant l'envoi",
    },
    notFound: {
      title: "Compte introuvable",
      description: "Le compte de messagerie indiqué est introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "La requête entre en conflit avec des données existantes",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
  },

  success: {
    title: "Message envoyé",
    description: "Votre message a bien été envoyé",
  },
};
