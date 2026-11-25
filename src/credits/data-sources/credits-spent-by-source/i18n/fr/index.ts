import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    source: {
      public: "Public (invités)",
      usersFree: "Utilisateurs gratuits",
      paid: "Payant",
      gifted: "Offert",
      internal: "Interne (admins)",
      unattributed: "Non attribué (historique)",
    },
  },
  post: {
    titleShort: "Usage par source",
    title: "Crédits dépensés par source",
    description:
      "Crédits dépensés, répartis selon qui les a dépensés et quels crédits ont payé : public (invités), utilisateurs gratuits, payant, offert, interne, non attribué. La somme des sources donne la dépense totale.",
    fields: {
      resolution: { label: "Résolution", description: "Intervalle de calcul" },
      range: { label: "Plage", description: "Période à interroger" },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la plage",
      },
      source: {
        label: "Source",
        description:
          "Crédits à compter : invités publics, crédits gratuits des comptes connectés, payant (abonnement + packs), offert (attributions admin), interne (comptes admin) ou historique non attribué",
      },
      result: {
        label: "Crédits dépensés",
        description: "Série temporelle de sortie",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
    },
    success: {
      title: "Crédits par source calculés",
      description: "Série des crédits par source renvoyée",
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
      server: { title: "Erreur serveur", description: "La requête a échoué" },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      validation: {
        title: "Validation échouée",
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
