import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "Supprimer le graphe",
    titleShort: "Supprimer le graphe",
    description: "Supprimer définitivement un graphe. Sans retour possible.",
    fields: {
      id: { label: "ID du graphe", description: "UUID du graphe à supprimer" },
    },
    response: {
      deletedId: "ID du graphe supprimé",
    },
    widget: {
      confirmDescription:
        "Définitif. Le graphe et sa configuration sont effacés, sans annulation possible. Fonctionne uniquement si le graphe ne contient aucune donnée ; sinon, archivez-le.",
      deletedIdLabel: "ID supprimé :",
      backToList: "Retour aux graphes",
    },
    success: {
      title: "Graphe supprimé",
      description: "Le graphe a été supprimé définitivement",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez pas supprimer ce graphe",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de supprimer le graphe",
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
      conflict: {
        title: "Contient des données",
        description:
          "Le graphe contient des points de données : archivez-le au lieu de le supprimer",
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
