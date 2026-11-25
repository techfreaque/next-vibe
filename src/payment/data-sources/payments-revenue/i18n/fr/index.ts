import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    kind: {
      all: "Tout",
      pack: "Packs de crédits",
      subscription: "Abonnements (nouveaux + renouvellements)",
      newSubscription: "Nouveaux abonnements",
      renewal: "Renouvellements",
    },
    provider: {
      all: "Tous les prestataires",
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
  },
  post: {
    title: "Revenus (USD)",
    titleShort: "Revenus",
    description:
      "Argent encaissé par période, en USD approx. (EUR et PLN à taux fixes). Paiements réussis et remboursés ensuite, comptes admin exclus. Filtre par produit et par prestataire.",
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
        label: "Revenus (USD)",
        description: "Série temporelle en sortie",
      },
      meta: {
        label: "Méta",
        description: "Métadonnées d'exécution du nœud",
      },
      kind: {
        label: "Payé pour",
        description:
          "Packs de crédits, abonnements (nouveaux + renouvellements) ou l'un d'eux",
      },
      provider: {
        label: "Prestataire",
        description: "Stripe, NOWPayments ou les deux",
      },
    },
    success: {
      title: "Revenus calculés",
      description: "Série de revenus renvoyée",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès administrateur requis",
      },
      server: {
        title: "Erreur serveur",
        description: "La requête a échoué",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
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
