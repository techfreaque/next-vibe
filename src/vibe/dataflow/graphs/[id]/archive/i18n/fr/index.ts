import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Archiver le graphe",
    titleShort: "Archiver le graphe",
    description:
      "Supprimer un graphe de façon réversible (le désactiver et le marquer comme archivé)",
    fields: {
      id: { label: "ID du graphe", description: "UUID du graphe à archiver" },
    },
    response: {
      archivedId: "ID du graphe archivé",
    },
    widget: {
      confirmDescription:
        "Le graphe sera désactivé et marqué comme archivé. Il ne s'exécutera plus selon sa planification. Cette action est réversible.",
      archivedIdLabel: "ID archivé :",
      backToList: "Retour aux graphes",
    },
    success: {
      title: "Graphe archivé",
      description: "Le graphe a été archivé avec succès",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Impossible d'archiver les graphes système",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'archiver le graphe",
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
