import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outils IA",
  tags: {
    skills: "skills",
  },
  enums: {
    skillStatus: {
      draft: "Brouillon",
      published: "Publié",
      unlisted: "Non répertorié",
    },
  },
  patch: {
    title: "Publier la compétence",
    titleShort: "Publier la compétence",
    description:
      "Publier ou dépublier une compétence personnalisée. PUBLISHED la rend visible dans la boutique communautaire.",
    dynamicTitle: "Publier : {{name}}",
    status: {
      label: "Statut",
      description:
        "PUBLISHED pour l'afficher dans la boutique, DRAFT pour la masquer, UNLISTED pour un accès par lien uniquement.",
    },
    changeNote: {
      label: "Note de version",
      description:
        "Note facultative décrivant ce qui change dans cette version.",
      placeholder: "ex. Prompt système plus clair",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour publier",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez publier que vos propres compétences",
      },
      notFound: { title: "Introuvable", description: "Compétence introuvable" },
      server: {
        title: "Erreur serveur",
        description: "Une erreur est survenue lors de la publication",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
    },
    success: {
      title: "Compétence publiée",
      description:
        "Votre compétence est maintenant visible dans la boutique communautaire",
    },
    response: {
      status: { content: "Statut" },
      publishedAt: { content: "Publié le" },
    },
    backButton: {
      label: "Retour",
    },
    button: {
      submit: "Enregistrer le statut",
      loading: "Enregistrement...",
    },
  },
};
