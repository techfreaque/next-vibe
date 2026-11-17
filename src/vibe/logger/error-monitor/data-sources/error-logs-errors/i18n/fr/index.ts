import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Journaux d'erreurs : erreurs",
    titleShort: "Journaux d'erreurs",
    description: "Entrées de niveau erreur par intervalle de résolution",
    fields: {
      resolution: { label: "Résolution", description: "Période de calcul" },
      range: { label: "Plage", description: "Plage de temps à interroger" },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la plage",
      },
      result: {
        label: "Entrées d'erreur",
        description: "Série temporelle en sortie",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "Journaux d'erreurs : erreurs calculés",
      description: "Série des erreurs renvoyée",
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
