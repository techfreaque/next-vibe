import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Bandes de Bollinger",
    titleShort: "Bollinger",
    description:
      "Bandes de Bollinger : bandes supérieure, médiane (MMS) et inférieure, calculées par écart-type",
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
      period: {
        label: "Période",
        description: "Nombre de périodes (2–200)",
      },
      stdDev: {
        label: "Multiplicateur d'écart-type",
        description: "Multiplicateur d'écart-type (0,1–5)",
      },
      upper: {
        label: "Bande supérieure",
        description: "Série temporelle de la bande de Bollinger supérieure",
      },
      middle: {
        label: "Bande médiane",
        description: "Série temporelle de la bande médiane (MMS)",
      },
      lower: {
        label: "Bande inférieure",
        description: "Série temporelle de la bande de Bollinger inférieure",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "Bandes de Bollinger calculées",
      description:
        "Séries des bandes supérieure, médiane et inférieure renvoyées",
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
        description: "Échec du calcul des bandes de Bollinger",
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
