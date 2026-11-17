import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },

  patch: {
    title: "Renommer le dossier",
    titleShort: "Renommer le dossier",
    description: "Renomme un dossier existant",
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier à renommer",
    },
    name: {
      label: "Nom",
      description: "Le nouveau nom du dossier",
    },
    icon: {
      label: "Icône",
      description: "Nom d'icône Lucide ou Simple Icons",
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
        description: "Vous devez être connecté pour renommer des dossiers",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de renommer ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite lors du renommage du dossier",
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
        description: "Un dossier portant ce nom existe déjà",
      },
    },
    success: {
      title: "Succès",
      description: "Dossier renommé",
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Renommer",
      loadingText: "Renommage...",
    },
  },
};
