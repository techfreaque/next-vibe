import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    titleShort: "MACD",
    description:
      "Convergence-divergence des moyennes mobiles : indicateur de momentum qui suit la tendance",
    fields: {
      source: { label: "Source", description: "Série temporelle d'entrée" },
      resolution: {
        label: "Résolution",
        description: "Unité de temps du calcul",
      },
      range: { label: "Plage", description: "Plage temporelle à calculer" },
      lookback: {
        label: "Historique préalable",
        description:
          "Barres supplémentaires avant le début de la plage, pour l'initialisation",
      },
      fastPeriod: {
        label: "Période rapide",
        description: "Période de l'EMA rapide (1–100)",
      },
      slowPeriod: {
        label: "Période lente",
        description: "Période de l'EMA lente (1–200)",
      },
      signalPeriod: {
        label: "Période du signal",
        description: "Période de l'EMA de la ligne de signal (1–50)",
      },
      macd: {
        label: "MACD",
        description: "Ligne MACD (EMA rapide − EMA lente)",
      },
      signal: {
        label: "Signal",
        description: "Ligne de signal (EMA de la ligne MACD)",
      },
      histogram: {
        label: "Histogramme",
        description: "Histogramme (MACD − signal)",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "MACD calculé",
      description: "Séries MACD, signal et histogramme renvoyées",
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
        description: "Échec du calcul du MACD",
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
