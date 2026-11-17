import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    skill: "Skill",
  },

  patch: {
    title: "Définir la skill du lead",
    titleShort: "Skill du lead",
    description:
      "Enregistre la compétence qui a amené ce lead (attribution au premier contact)",
    skillId: {
      label: "ID de la skill",
      description: "UUID de la skill personnalisée à attribuer à ce lead",
    },
    errors: {
      validation: {
        title: "ID de skill invalide",
        description: "Doit être un UUID valide de skill personnalisée",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur. Réessayez.",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour effectuer cette mise à jour.",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'êtes pas autorisé à modifier ce lead.",
      },
      notFound: {
        title: "Introuvable",
        description: "Le lead est introuvable.",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne s'est produite. Réessayez.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées.",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit.",
      },
    },
    success: {
      title: "Skill attribuée",
      description: "La skill a été enregistrée pour ce lead.",
    },
    skipped: {
      title: "Non enregistré",
      description:
        "Aucune session visiteur à attribuer. Ouvrez d'abord une page, puis réessayez.",
    },
    submit: "Attribuer la skill",
  },
};
