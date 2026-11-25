import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    kind: {
      paid: "Payés (packs + abonnements)",
      packs: "Packs payés",
      subscriptions: "Crédits d'abonnement",
      gifted: "Offerts (admin)",
    },
  },
  post: {
    titleShort: "Crédits émis",
    title: "Crédits émis (payés, offerts)",
    description:
      "Crédits ajoutés aux portefeuilles par période, en crédits (pas en argent) : packs payés et crédits d'abonnement issus de vrais paiements, ou crédits offerts par un admin (testeurs, créateurs, gestes commerciaux).",
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
      kind: {
        label: "Type",
        description:
          "Crédits à compter : packs payés + abonnements, packs seuls, abonnements seuls, ou crédits offerts par un admin",
      },
      result: {
        label: "Crédits émis",
        description: "Série temporelle en sortie",
      },
      meta: {
        label: "Méta",
        description: "Métadonnées d'exécution du nœud",
      },
    },
    success: {
      title: "Crédits achetés : calcul terminé",
      description: "Série « Crédits achetés » renvoyée",
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
