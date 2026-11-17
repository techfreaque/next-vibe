import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Afficher une image",
    titleShort: "Afficher l'image",
    description:
      "Récupère et affiche une image déjà capturée à partir de son URL de stockage. À utiliser pour réexaminer une capture d'écran ou une image d'un tour précédent.",
    dynamicTitle: "Affichage : {{url}}",
    url: {
      label: "URL de l'image",
      description: "URL de stockage de l'image à afficher",
      placeholder: "https://...",
    },
    response: {
      url: "URL de l'image",
    },
    errors: {
      validation_failed: {
        title: "Erreur de validation",
        description: "L'URL fournie est invalide",
      },
      network_error: {
        title: "Erreur réseau",
        description: "Impossible de récupérer l'image",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à voir cette image",
      },
      forbidden: {
        title: "Accès refusé",
        description: "L'accès à cette image est refusé",
      },
      not_found: {
        title: "Image introuvable",
        description: "Aucune image trouvée à l'URL fournie",
      },
      server_error: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown_error: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsaved_changes: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
    },
    success: {
      title: "Image chargée",
      description: "L'image a bien été récupérée",
    },
  },
  tags: {
    vision: "Vision",
    ai: "IA",
  },
};
