import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lister la boîte de réception",
  titleShort: "Boîte de réception",
  description:
    "Liste les messages de la boîte de réception ou d'un dossier précis",
  tag: "Boîte de réception",

  container: {
    title: "Messages reçus",
    description: "Messages du compte et du dossier sélectionnés",
  },

  accountId: {
    label: "Compte",
    description: "Compte de messagerie dont lire la boîte de réception",
    placeholder: "UUID du compte",
  },
  folderPath: {
    label: "Dossier",
    description: "Chemin du dossier à lister (INBOX par défaut)",
    placeholder: "INBOX",
  },

  messages: {
    label: "Messages",
    uid: { label: "UID" },
    messageId: { label: "ID du message" },
    subject: { label: "Objet" },
    from: { label: "De" },
    to: { label: "À" },
    date: { label: "Date" },
    isRead: { label: "Lu" },
    isFlagged: { label: "Suivi" },
    folderPath: { label: "Dossier" },
    bodyText: { label: "Contenu" },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie",
    },
    unauthorized: { title: "Non autorisé", description: "Connexion requise" },
    server: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur",
      detail: "Impossible de charger la boîte de réception : {{error}}",
    },
    unknown: { title: "Erreur inconnue", description: "Erreur inattendue" },
    forbidden: { title: "Interdit", description: "Accès refusé" },
    network: { title: "Erreur réseau", description: "Erreur réseau" },
    notFound: {
      title: "Compte introuvable",
      description: "Compte de messagerie introuvable",
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
    title: "Boîte de réception chargée",
    description: "Messages récupérés avec succès",
  },
};
