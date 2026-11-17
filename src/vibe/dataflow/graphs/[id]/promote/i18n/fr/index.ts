import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Promouvoir en système",
    titleShort: "Promouvoir le graphe",
    description:
      "Promouvoir un graphe admin en graphe système (lecture seule, partagé)",
    fields: {
      id: { label: "ID du graphe", description: "UUID du graphe" },
    },
    response: {
      promotedId: "ID du graphe",
    },
    widget: {
      confirmDescription:
        "Une fois promu, ce graphe appartiendra au système et sera partagé avec tous les utilisateurs. La version système actuelle de ce slug sera désactivée. Pour revenir en arrière, promouvez une autre version.",
      promotedIdLabel: "ID promu :",
      viewButton: "Voir",
    },
    success: {
      title: "Graphe promu",
      description: "Graphe promu en système avec succès",
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
        description: "Impossible de promouvoir le graphe",
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
