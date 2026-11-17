import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minute",
      "3m": "3 minutes",
      "5m": "5 minutes",
      "15m": "15 minutes",
      "30m": "30 minutes",
      "1h": "1 heure",
      "4h": "4 heures",
      "1d": "1 jour",
      "1w": "1 semaine",
      "1M": "1 mois",
    },
  },
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Lancer un backtest",
    titleShort: "Backtest",
    description:
      "Lancer un backtest sur une période historique (actions simulées)",
    fields: {
      id: { label: "ID du graphe", description: "UUID du graphe" },
      rangeFrom: {
        label: "Du",
        description: "Début de la période du backtest",
      },
      rangeTo: { label: "Au", description: "Fin de la période du backtest" },
      resolution: {
        label: "Résolution",
        description: "Intervalle de temps pour l'évaluation",
      },
    },
    response: {
      runId: "ID de l'exécution",
      eligible: "Éligible",
      ineligibleNodes: "Nœuds non éligibles",
    },
    widget: {
      eligible: "Éligible",
      notEligible: "Non éligible",
      runLabel: "Exécution :",
      ineligibleNodesLabel: "Nœuds non éligibles :",
      ineligibleNodesHint:
        "Ces nœuds ne peuvent pas être backtestés (données persistées manquantes, résolution incompatible ou logique uniquement scriptée).",
    },
    success: {
      title: "Backtest terminé",
      description: "Le backtest s'est exécuté avec succès",
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
        description: "Le backtest a échoué",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      validation: {
        title: "Échec de la validation",
        description: "Paramètres invalides",
      },
      notFound: { title: "Introuvable", description: "Graphe introuvable" },
      conflict: { title: "Conflit", description: "Conflit de ressources" },
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
