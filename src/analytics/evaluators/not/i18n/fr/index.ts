import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "NON",
    titleShort: "NON",
    description:
      "Inverse un flux de signaux : déclenché devient non déclenché, et inversement",
    fields: {
      signal: {
        label: "Signal",
        description: "Flux de signaux d'entrée à inverser",
      },
      result: {
        label: "Résultat",
        description: "Événements de signal inversés en sortie",
      },
    },
    success: {
      title: "NON évalué",
      description: "Événements de signal inversés renvoyés",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      server: {
        title: "Erreur serveur",
        description: "Échec de l'évaluation NON",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de requête invalides",
      },
      notFound: { title: "Introuvable", description: "Introuvable" },
      conflict: { title: "Conflit", description: "Conflit" },
      network: {
        title: "Erreur réseau",
        description: "La requête réseau a échoué",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez d'abord vos modifications",
      },
    },
  },
};
