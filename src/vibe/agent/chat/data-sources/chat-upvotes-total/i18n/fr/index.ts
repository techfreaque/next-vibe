import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Total des votes positifs du chat",
    titleShort: "Votes positifs",
    description:
      "Somme des votes positifs sur les messages par intervalle de résolution",
    fields: {
      resolution: { label: "Résolution", description: "Intervalle de calcul" },
      range: { label: "Période", description: "Période à interroger" },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la période",
      },
      result: {
        label: "Votes positifs",
        description: "Série temporelle en sortie",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "Total des votes positifs calculé",
      description: "Série du total des votes positifs renvoyée",
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
        description: "Enregistrez d'abord vos modifications",
      },
    },
  },
};
