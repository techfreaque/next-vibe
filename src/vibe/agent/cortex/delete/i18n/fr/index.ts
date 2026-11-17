import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  delete: {
    title: "Supprimer",
    titleShort: "Supprimer le fichier",
    description: "Supprime un fichier ou un dossier. Définitivement.",
    dynamicTitle: "{{path}} supprimé",
    status: {
      loading: "Suppression...",
      done: "Supprimé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Chemin",
        description: "Ce qu'il faut supprimer",
      },
      recursive: {
        label: "Inclure le contenu",
        description: "Supprimer aussi tout ce qu'il contient",
      },
    },
    submitButton: {
      label: "Supprimer",
      loadingText: "Suppression...",
    },
    response: {
      path: { content: "Chemin" },
      nodesDeleted: { text: "Supprimés" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le chemin",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Impossible de supprimer ceci",
      },
      notFound: { title: "Introuvable", description: "Rien à ce chemin" },
      server: {
        title: "Erreur serveur",
        description: "Quelque chose a planté",
      },
      unknown: { title: "Erreur", description: "Une erreur s'est produite" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: {
        title: "Dossier non vide",
        description:
          "Le dossier contient des éléments : utilisez Inclure le contenu",
      },
    },
    success: {
      title: "Supprimé",
      description: "C'est parti",
    },
  },
};
