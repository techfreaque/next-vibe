import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    viewType: {
      calendar: "Calendrier",
      grid: "Grille",
      kanban: "Kanban",
      list: "Liste",
      wiki: "Wiki",
    },
  },
  post: {
    title: "Nouveau dossier",
    titleShort: "Nouveau dossier",
    description: "Crée un dossier.",
    dynamicTitle: "{{path}} créé",
    status: {
      loading: "Création...",
      done: "Créé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Chemin",
        description:
          "Chemin du dossier. Racine française : /documents/. Exemple : /documents/projets/mon-app",
      },
      viewType: {
        label: "Affichage",
        description: "Mode d'affichage (list, kanban, calendar, grid)",
      },
      createParents: {
        label: "Créer les dossiers",
        description: "Créer aussi les dossiers parents manquants",
      },
    },
    submitButton: {
      label: "Créer",
      loadingText: "Création...",
    },
    response: {
      path: { content: "Chemin" },
      created: { text: "Créé" },
      alreadyExists: { text: "Existe déjà" },
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
        description: "Impossible de créer des dossiers ici",
      },
      notFound: {
        title: "Parent manquant",
        description: "Le dossier parent n'existe pas",
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
      conflict: {
        title: "Existe déjà",
        description: "Le dossier existe déjà",
      },
    },
    success: {
      title: "Créé",
      description: "Dossier prêt",
    },
  },
};
