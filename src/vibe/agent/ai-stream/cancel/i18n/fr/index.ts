import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IA",
  tags: {
    streaming: "Streaming",
  },
  post: {
    title: "Annuler le flux IA",
    titleShort: "Annuler le flux",
    description: "Annule une réponse IA en cours de streaming",
    container: {
      title: "Annuler le flux",
      description: "Arrêter le flux IA actif d'un fil",
    },
    form: {
      title: "Annuler le flux",
      description: "Indiquez l'ID du fil dont le flux actif doit être annulé",
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil dont le flux doit être annulé",
    },
    response: {
      title: "Résultat de l'annulation",
      description: "Résultat de l'opération d'annulation",
      cancelled: "Indique si un flux actif a été trouvé et annulé",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Données d'annulation invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise pour annuler un flux",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez annuler que vos propres flux",
      },
      notFound: {
        title: "Introuvable",
        description: "Fil introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Échec de l'annulation du flux",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit lors de l'annulation",
      },
    },
    success: {
      title: "Flux annulé",
      description: "Le flux IA a bien été annulé",
    },
    streamInterrupted:
      "Génération arrêtée. La réponse partielle a été enregistrée.",
  },
};
