import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },

  patch: {
    title: "Déplacer le dossier",
    titleShort: "Déplacer le dossier",
    description: "Déplace un dossier sous un autre parent",
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier à déplacer",
    },
    parentId: {
      label: "Dossier parent",
      description:
        "Déplacer le dossier sous un autre parent (null pour la racine)",
    },
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
        circularReference:
          "Un dossier ne peut pas être son propre dossier parent",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour déplacer des dossiers",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de déplacer ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite lors du déplacement du dossier",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
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
        description: "Impossible de déplacer le dossier à cet emplacement",
      },
    },
    success: {
      title: "Succès",
      description: "Dossier déplacé",
    },
    backButton: { label: "Retour" },
    submitButton: {
      label: "Déplacer le dossier",
      loadingText: "Déplacement...",
    },
  },
  widget: {
    moveFolder: {
      description: "Choisissez le dossier de destination",
      rootLevel: "(niveau racine)",
    },
  },
};
