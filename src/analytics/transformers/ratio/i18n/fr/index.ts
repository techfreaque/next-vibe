import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Ratio",
    titleShort: "Ratio",
    description:
      "Ratio : divise la série A par la série B, alignées par horodatage",
    fields: {
      a: {
        label: "Numérateur (A)",
        description: "Série temporelle du dividende",
      },
      b: {
        label: "Dénominateur (B)",
        description: "Série temporelle du diviseur",
      },
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
      result: {
        label: "Ratio",
        description: "Série temporelle de sortie (A / B)",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "Ratio calculé",
      description: "Série de ratio renvoyée",
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
        description: "Échec du calcul du ratio",
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
