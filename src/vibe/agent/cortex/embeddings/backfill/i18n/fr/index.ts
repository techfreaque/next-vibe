import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Compléter les embeddings",
    titleShort: "Compléter",
    description:
      "Génère les embeddings de tous les nœuds du cortex qui n'en ont pas.",
    status: {
      loading: "Embedding en cours...",
      done: "Terminé",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "Génère les embeddings de tous les nœuds du cortex qui n'en ont pas. Cela peut prendre un moment.",
    },
    fields: {
      force: {
        label: "Forcer le recalcul",
        description:
          "Effacer d'abord tous les embeddings existants et tout régénérer (format contenu seul). À utiliser quand le format d'embedding a changé.",
      },
    },
    submitButton: {
      label: "Lancer",
      loadingText: "Traitement...",
    },
    response: {
      materialized: { text: "Matérialisés" },
      processed: { text: "Indexés" },
      failed: { text: "Échecs" },
      skipped: { text: "Ignorés" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Requête invalide",
      },
      network: {
        title: "Hors ligne",
        description: "Serveur injoignable",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Réservé aux admins",
        description: "Accès administrateur requis",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Le service d'embedding a échoué",
      },
      unknown: {
        title: "Erreur",
        description: "Une erreur s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: {
        title: "Déjà en cours",
        description: "Un remplissage est déjà en cours",
      },
    },
    success: {
      title: "Remplissage terminé",
      description: "Tous les embeddings ont été traités",
    },
  },
};
