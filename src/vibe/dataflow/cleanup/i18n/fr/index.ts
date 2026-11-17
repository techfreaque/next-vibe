import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Nettoyage Vibe Sense",
    description:
      "Supprime les anciens points de données et fait expirer le cache des instantanés",
  },
  graphRunner: {
    name: "Exécuteur de graphes Vibe Sense",
    description:
      "Exécute tous les graphes de pipeline déclenchés par cron arrivés à échéance",
  },
  post: {
    title: "Nettoyage Vibe Sense",
    titleShort: "Nettoyage Sense",
    description:
      "Lancer le nettoyage de rétention des points de données et faire expirer les instantanés",
    response: {
      nodesProcessed: "Nœuds traités",
      totalDeleted: "Lignes supprimées",
      snapshotsDeleted: "Instantanés supprimés",
      graphsChecked: "Graphes vérifiés",
      graphsExecuted: "Graphes exécutés",
    },
    success: {
      title: "Nettoyage terminé",
      description: "Nettoyage de rétention terminé",
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
        description: "Le nettoyage a échoué",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      validation: {
        title: "Échec de la validation",
        description: "Requête invalide",
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
