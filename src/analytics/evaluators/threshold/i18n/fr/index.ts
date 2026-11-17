import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    op: {
      gt: ">",
      lt: "<",
      gte: ">=",
      lte: "<=",
      eq: "==",
    },
  },
  post: {
    title: "Seuil",
    titleShort: "Seuil",
    description:
      "Se déclenche quand une valeur de la série satisfait une comparaison avec une constante",
    fields: {
      source: { label: "Source", description: "Série temporelle d'entrée" },
      resolution: {
        label: "Résolution",
        description: "Unité de temps du calcul",
      },
      range: { label: "Plage", description: "Plage temporelle à évaluer" },
      lookback: {
        label: "Historique préalable",
        description:
          "Barres supplémentaires avant le début de la plage, pour l'initialisation",
      },
      op: {
        label: "Opérateur",
        description: "Opérateur de comparaison (>, <, >=, <=, ==)",
      },
      value: {
        label: "Seuil",
        description: "Valeur constante de comparaison",
      },
      signals: {
        label: "Signaux",
        description: "Événements de signal en sortie",
      },
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Évaluer",
      loadingText: "Évaluation…",
    },
    success: {
      title: "Seuil évalué",
      description: "Événements de signal renvoyés",
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
        description: "Échec de l'évaluation du seuil",
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
