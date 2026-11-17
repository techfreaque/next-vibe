import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },
  post: {
    title: "Ajouter un fichier de connaissances",
    titleShort: "Ajouter un fichier",
    description:
      "Ajoute un document que l'IA peut consulter dans chaque discussion de ce dossier",
    container: {
      title: "Ajouter un fichier de connaissances",
      description:
        "Enregistré comme document Cortex. L'IA le lit avec cortex-read et cortex-search.",
    },
    id: {
      label: "ID du dossier",
      description: "Le dossier auquel ajouter le fichier",
    },
    name: {
      label: "Nom du fichier",
      description: "Un nom court. .md est ajouté s'il manque.",
      placeholder: "brief-lancement",
    },
    content: {
      label: "Contenu",
      description:
        "Collez le texte du document (le markdown fonctionne le mieux)",
    },
    response: { fileId: "ID du fichier", path: "Chemin Cortex" },
    backButton: { label: "Retour" },
    submitButton: { label: "Ajouter le fichier", loadingText: "Ajout..." },
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
