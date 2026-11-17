import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },
  delete: {
    title: "Retirer un fichier de connaissances",
    titleShort: "Retirer le fichier",
    description: "Retire un fichier de connaissances de ce projet de dossier",
    container: {
      title: "Retirer un fichier de connaissances",
      description: "L'IA ne verra plus ce fichier dans ce dossier.",
    },
    id: {
      label: "ID du dossier",
      description: "Le dossier auquel appartient le fichier",
    },
    fileId: { label: "ID du fichier", description: "Le fichier à retirer" },
    response: { removedPath: "Retiré" },
    backButton: { label: "Retour" },
    submitButton: { label: "Retirer le fichier", loadingText: "Retrait..." },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de modifier ce projet",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier ou le fichier est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Un problème est survenu. Réessayez.",
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
        description: "Le projet a été modifié ailleurs",
      },
      notSupported: {
        title: "Non pris en charge",
        description:
          "Les projets fonctionnent uniquement dans les dossiers privés et partagés",
      },
    },
    success: {
      title: "Enregistré",
      description: "Terminé",
    },
  },
};
