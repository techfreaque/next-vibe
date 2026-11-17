import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Exécuter une configuration de graphe",
    titleShort: "Exécuter la config",
    description:
      "Exécuter un graphe à partir d'une configuration inline, sans graphe enregistré",
    fields: {
      config: {
        label: "Configuration du graphe",
        description:
          "Configuration inline du graphe (nœuds, liens, déclencheur)",
      },
      rangeFrom: {
        label: "Du",
        description: "Début de la période (date-heure ISO)",
      },
      rangeTo: {
        label: "Au",
        description: "Fin de la période (date-heure ISO)",
      },
    },
    response: {
      nodeCount: "Nœuds exécutés",
      errorCount: "Erreurs",
      errors: "Détails des erreurs",
    },
    success: {
      title: "Configuration exécutée",
      description: "La configuration du graphe s'est exécutée avec succès",
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
        description: "L'exécution du graphe a échoué",
        detail: "L'exécution du graphe a échoué : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      validation: {
        title: "Échec de la validation",
        description: "Configuration de graphe ou paramètres invalides",
        detail: "Configuration de graphe invalide : {{error}}",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de ressources",
      },
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
