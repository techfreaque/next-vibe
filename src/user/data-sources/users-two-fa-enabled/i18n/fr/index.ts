import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Utilisateurs avec 2FA activée",
    titleShort: "2FA activée",
    description:
      "Nombre d'utilisateurs ayant activé la 2FA par intervalle de résolution",
    fields: {
      resolution: { label: "Résolution", description: "Intervalle de calcul" },
      range: { label: "Période", description: "Période à interroger" },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la période",
      },
      result: {
        label: "Utilisateurs avec 2FA activée",
        description: "Série temporelle en sortie",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "Données des utilisateurs avec 2FA activée",
      description: "Série des utilisateurs avec 2FA activée renvoyée",
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
