import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Déplacer le message",
  titleShort: "Déplacer",
  description: "Déplace un message vers un autre dossier",
  tag: "Boîte de réception",

  container: {
    title: "Déplacer le message",
    description: "Déplacer un message d'un dossier à un autre",
  },

  accountId: {
    label: "Compte",
    description: "Compte de messagerie",
    placeholder: "UUID du compte",
  },
  uid: {
    label: "UID du message",
    description: "L'UID du message à déplacer",
    placeholder: "12345",
  },
  fromFolder: {
    label: "Dossier source",
    description: "Chemin du dossier actuel",
    placeholder: "INBOX",
  },
  toFolder: {
    label: "Dossier cible",
    description: "Chemin du dossier de destination",
    placeholder: "Archive",
  },

  moved: { label: "Déplacé" },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie",
    },
    unauthorized: { title: "Non autorisé", description: "Connexion requise" },
    server: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur",
      detail: "Échec du déplacement : {{error}}",
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
    title: "Message déplacé",
    description: "Le message a été déplacé",
  },
};
