import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Chute brutale",
    titleShort: "Chute",
    description:
      "Se déclenche quand une valeur chute nettement sous sa propre moyenne glissante",
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
      window: {
        label: "Barres précédentes",
        description:
          "Nombre de barres précédentes qui forment la moyenne de référence",
      },
      dropPct: {
        label: "Chute",
        description:
          "Déclenchement sous référence × (1 − chute). 0,5 = une chute de 50 %",
      },
      minBaseline: {
        label: "Référence minimale",
        description:
          "Ignorer les barres dont la référence est inférieure à cette valeur (trop peu de données)",
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
      title: "Chute évaluée",
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
        description: "Échec de l'évaluation de la chute",
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
