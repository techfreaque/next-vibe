import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "Occurrences",
      distinct: "Classes d'erreurs vues",
      new: "Nouvelles classes d'erreurs",
      openBacklog: "Backlog ouvert (non résolu maintenant)",
    },
    level: {
      all: "Erreurs et avertissements",
      error: "Erreurs seulement",
      warn: "Avertissements seulement",
    },
  },
  post: {
    title: "Série des journaux d'erreurs",
    titleShort: "Journaux d'erreurs",
    description:
      "Volume d'erreurs dans le temps. Les occurrences et classes vues viennent du compteur journalier (par jour, historique depuis le 22/11/2026). Les nouvelles classes comptent les premières apparitions. Le backlog ouvert est le nombre actuel de classes non résolues, enregistré à chaque exécution du graphe.",
    fields: {
      resolution: {
        label: "Résolution",
        description:
          "Période de calcul (occurrences et classes au plus par jour)",
      },
      range: {
        label: "Plage",
        description: "Plage de temps à interroger",
      },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la plage",
      },
      metric: {
        label: "Métrique",
        description:
          "Ce qui est compté : occurrences, classes vues, nouvelles classes ou backlog ouvert",
      },
      level: {
        label: "Niveau",
        description: "Erreurs, avertissements ou les deux",
      },
      result: {
        label: "Nombre de journaux d'erreurs",
        description: "Série temporelle de sortie",
      },
      meta: {
        label: "Méta",
        description: "Métadonnées d'exécution du nœud",
      },
    },
    success: {
      title: "Série des journaux d'erreurs calculée",
      description: "Série des journaux d'erreurs renvoyée",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: { title: "Accès refusé", description: "Accès admin requis" },
      server: { title: "Erreur serveur", description: "La requête a échoué" },
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
        description: "Enregistrez d'abord les modifications",
      },
    },
  },
};
