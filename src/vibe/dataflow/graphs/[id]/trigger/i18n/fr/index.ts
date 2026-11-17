import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Déclencher le graphe",
    titleShort: "Déclencher le graphe",
    description: "Déclencher manuellement l'exécution du graphe à la demande",
    fields: {
      id: { label: "ID du graphe", description: "UUID du graphe" },
      rangeFrom: { label: "Du", description: "Début de la période (date ISO)" },
      rangeTo: { label: "Au", description: "Fin de la période (date ISO)" },
    },
    response: {
      nodeCount: "Nœuds exécutés",
      errorCount: "Erreurs",
    },
    widget: {
      nodesExecuted: "Nœuds exécutés",
      errors: "Erreurs",
      errorDetails: "Détails des erreurs",
      nodeLabel: "Nœud",
    },
    success: {
      title: "Graphe exécuté",
      description: "Le graphe s'est exécuté avec succès",
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
