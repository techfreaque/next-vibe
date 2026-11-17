import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    titleShort: "Dépenses gratuites",
    title: "Dépenses gratuites (reflet du plafond public)",
    description:
      "Crédits gratuits consommés par les invités et les utilisateurs gratuits connectés. Même axe que « Dépensé aujourd'hui » du plafond quotidien public, découpé selon le minuit local du serveur utilisé par le plafond.",
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
        label: "Dépenses gratuites",
        description: "Série temporelle en sortie",
      },
      meta: {
        label: "Méta",
        description: "Métadonnées d'exécution du nœud",
      },
    },
    success: {
      title: "Dépenses gratuites : calcul terminé",
      description: "Série « Dépenses gratuites » renvoyée",
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
