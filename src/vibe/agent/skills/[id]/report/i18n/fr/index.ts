import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outils IA",
  tags: {
    skills: "skills",
  },
  post: {
    title: "Signaler la compétence",
    titleShort: "Signaler la compétence",
    description:
      "Signaler une compétence communautaire à la modération. Idempotent : un signalement par utilisateur et par compétence.",
    dynamicTitle: "Signaler : {{name}}",
    reason: {
      label: "Motif",
      description: "Pourquoi signalez-vous cette compétence ?",
      placeholder: "Décrivez le problème...",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Indiquez un motif",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour signaler",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez pas signaler cette compétence",
      },
      notFound: { title: "Introuvable", description: "Compétence introuvable" },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de l'envoi de votre signalement",
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
        title: "Déjà signalé",
        description: "Vous avez déjà signalé cette compétence",
      },
    },
    success: {
      title: "Signalement envoyé",
      description: "Merci d'aider à garder la communauté saine",
    },
    response: {
      reported: { content: "Signalé" },
      reportCount: { content: "Nombre de signalements" },
    },
    backButton: {
      label: "Retour",
    },
    button: {
      submit: "Envoyer le signalement",
      loading: "Envoi...",
    },
  },
};
