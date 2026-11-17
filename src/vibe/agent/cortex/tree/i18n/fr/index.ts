import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Afficher l'arborescence",
    titleShort: "Arborescence",
    description:
      "Toute la structure des dossiers d'un coup d'œil. Pour les chemins /ssh/, affiche les machines et un résumé des montages : utilisez cortex-list ou cortex-exec pour aller plus loin.",
    dynamicTitle: "Arborescence {{path}}",
    status: {
      loading: "Analyse...",
      done: "Analysé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Chemin",
        description: "Point de départ (par défaut : racine)",
      },
      depth: {
        label: "Profondeur",
        description: "Nombre de niveaux",
      },
    },
    submitButton: {
      label: "Afficher l'arborescence",
      loadingText: "Chargement...",
    },
    response: {
      tree: { content: "Arborescence" },
      totalFiles: { text: "Fichiers" },
      totalDirs: { text: "Dossiers" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le chemin et la profondeur",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez pas voir ceci",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier n'existe pas",
      },
      server: {
        title: "Erreur serveur",
        description: "Quelque chose a planté",
      },
      unknown: { title: "Erreur", description: "Une erreur s'est produite" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: { title: "Conflit", description: "Réessayez" },
    },
    success: {
      title: "Arborescence",
      description: "Voici la structure",
    },
  },
};
