import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Rechercher",
    titleShort: "Rechercher des fichiers",
    description: "Trouve des fichiers par nom ou par contenu. Cherche partout.",
    dynamicTitle: "Recherche : {{query}}",
    status: {
      loading: "Recherche...",
      done: "Trouvé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "Recherche",
        description: "Ce que vous cherchez",
      },
      path: {
        label: "Dans le dossier",
        description: "Ne chercher qu'ici (par défaut : partout)",
      },
      maxResults: {
        label: "Limite",
        description: "Nombre de résultats (par défaut : 20)",
      },
    },
    submitButton: {
      label: "Rechercher",
      loadingText: "Recherche...",
    },
    noResults: "Aucun résultat",
    response: {
      query: { content: "Recherché" },
      results: {
        path: { content: "Chemin" },
        name: { content: "Nom" },
        nodeType: { text: "Type" },
        excerpt: { content: "Extrait" },
        score: { text: "Score" },
        updatedAt: { content: "Mis à jour" },
      },
      total: { text: "Trouvés" },
      searchMode: { text: "Mode" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le texte recherché",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Impossible de chercher ici",
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
      title: "Terminé",
      description: "Recherche terminée",
    },
  },
};
