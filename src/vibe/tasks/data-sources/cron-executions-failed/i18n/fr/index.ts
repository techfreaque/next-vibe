import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Exécutions cron échouées",
    titleShort: "Cron échouées",
    description:
      "Exécutions cron échouées, en erreur ou expirées par intervalle de résolution",
    fields: {
      resolution: { label: "Résolution", description: "Intervalle de calcul" },
      range: { label: "Plage", description: "Plage temporelle à interroger" },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la plage",
      },
      result: {
        label: "Exécutions échouées",
        description: "Série temporelle en sortie",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "Exécutions cron échouées calculées",
      description: "Série des exécutions cron échouées renvoyée",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès administrateur requis",
      },
      server: { title: "Erreur serveur", description: "Échec de la requête" },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de requête invalides",
      },
      notFound: { title: "Introuvable", description: "Introuvable" },
      conflict: { title: "Conflit", description: "Conflit" },
      network: {
        title: "Erreur réseau",
        description: "Échec de la requête réseau",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez d'abord les modifications",
      },
    },
  },
};
