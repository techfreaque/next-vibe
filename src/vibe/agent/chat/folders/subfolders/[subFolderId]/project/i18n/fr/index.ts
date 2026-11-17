import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },
  get: {
    title: "Paramètres du projet",
    titleShort: "Projet",
    description:
      "Instructions et fichiers de connaissances d'un projet de dossier",
    id: { label: "ID du dossier", description: "Le dossier à lire" },
    response: {
      folderName: "Dossier",
      instructions: "Instructions",
      canManage: "Peut gérer",
      knowledgePath: "Chemin des connaissances",
      files: {
        id: "ID",
        name: "Nom",
        path: "Chemin",
        size: "Taille",
        updatedAt: "Mis à jour",
      },
    },
    heading: "Projet",
    subheading:
      "Les instructions s'appliquent à chaque discussion de ce dossier et de ses sous-dossiers. L'IA a accès aux fichiers de connaissances.",
    instructionsTitle: "Instructions",
    noInstructions:
      "Aucune instruction pour l'instant. Dites à l'IA comment se comporter dans ce dossier.",
    editInstructions: "Modifier les instructions",
    addInstructions: "Ajouter des instructions",
    knowledgeTitle: "Fichiers de connaissances",
    noFiles:
      "Aucun fichier de connaissances pour l'instant. Ajoutez les notes, briefs ou documents que l'IA doit connaître.",
    addFile: "Ajouter un fichier",
    removeFile: "Retirer",
    bytes: "caractères",
    noData: "Chargement du projet...",
    noAccess:
      "Seuls les éditeurs du dossier peuvent modifier les paramètres du projet.",
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
  patch: {
    title: "Modifier les instructions du projet",
    titleShort: "Instructions",
    description:
      "Définit les instructions que l'IA suit dans chaque discussion de ce dossier",
    container: {
      title: "Instructions du projet",
      description:
        "Appliquées à chaque discussion de ce dossier et de ses sous-dossiers",
    },
    id: { label: "ID du dossier", description: "Le dossier à mettre à jour" },
    instructions: {
      label: "Instructions",
      description:
        "Comment l'IA doit se comporter, ce qu'elle doit savoir, le ton, le format. Laisser vide pour les effacer.",
      placeholder:
        "ex. : Tu es mon rédacteur pour le lancement. Sois percutant. Réponds toujours sous forme de puces.",
    },
    response: { folderId: "Dossier", hasInstructions: "Instructions actives" },
    backButton: { label: "Retour" },
    submitButton: {
      label: "Enregistrer les instructions",
      loadingText: "Enregistrement...",
    },
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
