import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Abonnements en échec de paiement",
    titleShort: "Paiement échoué",
    description:
      "Abonnements avec paiement échoué par intervalle de résolution",
    fields: {
      resolution: {
        label: "Résolution",
        description: "Intervalle de calcul",
      },
      range: {
        label: "Période",
        description: "Période à interroger",
      },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la période",
      },
      result: {
        label: "Abonnements en échec de paiement",
        description: "Série temporelle en sortie",
      },
      meta: {
        label: "Méta",
        description: "Métadonnées d'exécution du nœud",
      },
    },
    success: {
      title: "Abonnements en échec de paiement : calcul terminé",
      description: "Série « Abonnements en échec de paiement » renvoyée",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès admin requis",
      },
      server: {
        title: "Erreur serveur",
        description: "La requête a échoué",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de requête invalides",
      },
      notFound: {
        title: "Introuvable",
        description: "Introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit",
      },
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
