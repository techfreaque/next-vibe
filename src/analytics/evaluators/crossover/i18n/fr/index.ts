import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Croisement",
    titleShort: "Croisement",
    description: "Se déclenche quand la série A croise la série B à la hausse",
    fields: {
      seriesA: {
        label: "Série A",
        description: "Première série temporelle d'entrée",
      },
      seriesB: {
        label: "Série B",
        description: "Seconde série temporelle d'entrée",
      },
      resolution: {
        label: "Résolution",
        description: "Unité de temps du calcul",
      },
      range: { label: "Plage", description: "Plage temporelle à évaluer" },
      lookback: {
        label: "Historique préalable",
        description:
          "Barres supplémentaires avant le début de la plage, pour l'initialisation",
      },
      signals: {
        label: "Signaux",
        description: "Événements de signal en sortie",
      },
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Évaluer",
      loadingText: "Évaluation…",
    },
    success: {
      title: "Croisement évalué",
      description: "Événements de signal renvoyés",
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
        description: "Échec de l'évaluation du croisement",
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
