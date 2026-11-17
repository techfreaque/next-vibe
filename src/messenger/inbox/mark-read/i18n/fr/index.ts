import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Marquer comme lu",
  titleShort: "Marquer lu",
  description: "Marque un message comme lu ou non lu",
  tag: "Boîte de réception",

  container: {
    title: "Marquer le message",
    description: "Modifier le statut de lecture d'un message",
  },

  accountId: {
    label: "Compte",
    description: "Compte de messagerie",
    placeholder: "UUID du compte",
  },
  uid: {
    label: "UID du message",
    description: "L'UID du message",
    placeholder: "12345",
  },
  folderPath: {
    label: "Dossier",
    description: "Chemin du dossier contenant le message",
    placeholder: "INBOX",
  },
  isRead: {
    label: "Marquer comme lu",
    description: "true pour marquer comme lu, false pour marquer comme non lu",
  },

  updated: { label: "Mis à jour" },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie",
    },
    unauthorized: { title: "Non autorisé", description: "Connexion requise" },
    server: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur",
      detail: "Impossible de modifier le statut de lecture : {{error}}",
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
    title: "Message mis à jour",
    description: "Statut de lecture mis à jour",
  },
};
