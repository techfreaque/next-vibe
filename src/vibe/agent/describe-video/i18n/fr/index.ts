import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "Vidéo",
    vision: "Vision",
    ai: "IA",
  },
  post: {
    title: "Décrire une vidéo",
    titleShort: "Décrire la vidéo",
    dynamicTitle: "Description : {{filename}}",
    description: "Décrit le contenu d'une vidéo avec un modèle IA de vision",
    fileUrl: {
      label: "URL de la vidéo",
      description: "URL de la vidéo à décrire",
    },
    context: {
      label: "Contexte",
      description: "Contexte facultatif pour orienter la description",
      placeholder: "Décrivez cette vidéo en vous concentrant sur...",
    },
    submitButton: {
      label: "Décrire la vidéo",
      loadingText: "Description...",
    },
    response: {
      text: "Description",
      model: "Modèle utilisé",
      creditCost: "Crédits utilisés",
    },
    errors: {
      validation_failed: {
        title: "Erreur de validation",
        description: "Indiquez une URL de la vidéo valide",
      },
      network_error: {
        title: "Erreur réseau",
        description: "Impossible de joindre le service de vision",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour utiliser cette fonctionnalité",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas la permission d'utiliser cette fonctionnalité",
      },
      not_found: {
        title: "Introuvable",
        description: "La vidéo est introuvable",
      },
      server_error: {
        title: "Erreur serveur",
        description:
          "Une erreur inattendue s'est produite pendant la description de la vidéo",
      },
      unknown_error: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsaved_changes: {
        title: "Modifications non enregistrées",
        description:
          "Enregistrez vos modifications avant de lancer la description",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
      noVisionModel: "Aucun modèle de vision vidéo n'est configuré",
      descriptionFailed: "Impossible de décrire la vidéo : {{error}}",
      insufficientCredits:
        "Crédits insuffisants. Solde : {{balance}}, requis : {{minimum}}",
      balanceCheckFailed: "Impossible de vérifier votre solde de crédits",
      creditsFailed: "Impossible de déduire les crédits",
    },
    success: {
      title: "Vidéo décrite",
      description: "La vidéo a bien été décrite",
    },
  },
};
