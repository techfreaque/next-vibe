import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lister les dossiers",
  titleShort: "Dossiers",
  description: "Liste les dossiers disponibles d'un compte de messagerie",
  tag: "Boîte de réception",

  container: {
    title: "Dossiers",
    description: "Dossiers disponibles pour le compte sélectionné",
  },

  accountId: {
    label: "Compte",
    description: "Compte de messagerie dont lister les dossiers",
    placeholder: "UUID du compte",
  },

  folders: {
    label: "Dossiers",
    path: { label: "Chemin" },
    name: { label: "Nom" },
    displayName: { label: "Nom affiché" },
    specialUseType: { label: "Type" },
    messageCount: { label: "Messages" },
    unseenCount: { label: "Non lus" },
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
      detail: "Impossible de charger les dossiers : {{error}}",
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
    title: "Dossiers chargés",
    description: "Dossiers récupérés avec succès",
  },
};
