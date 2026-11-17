import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Lire un fichier",
    titleShort: "Lire le fichier",
    description:
      "Ouvre n'importe quel fichier : vos notes, fils, mémoires, compétences ou tâches.",
    dynamicTitle: "Lecture de {{path}}",
    status: {
      loading: "Lecture...",
      done: "Chargé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Chemin",
        description:
          "Quel fichier. Racines françaises : /memoires/, /documents/. Exemple : /documents/notes/idees.md",
      },
      maxLines: {
        label: "Lignes max",
        description: "N'afficher que ce nombre de lignes",
      },
    },
    submitButton: {
      label: "Lire",
      loadingText: "Lecture...",
    },
    emptyFile: "Ce fichier est vide.",
    response: {
      path: { content: "Chemin" },
      content: { content: "Contenu" },
      size: { text: "Taille" },
      truncated: { text: "Tronqué" },
      readonly: { text: "Lecture seule" },
      nodeType: { text: "Type" },
      updatedAt: { content: "Mis à jour" },
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
        description: "Vous ne pouvez pas lire ceci",
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
      conflict: { title: "Conflit", description: "Versions différentes" },
    },
    success: {
      title: "C'est bon",
      description: "Fichier chargé",
    },
  },
};
