import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Historique des versions du graphe",
    titleShort: "Versions du graphe",
    description:
      "Récupérer la chaîne de versions d'un graphe (parcours des ancêtres via parentVersionId)",
    fields: {
      id: { label: "ID du graphe", description: "UUID du graphe" },
      versions: {
        label: "Versions",
        description:
          "Liste ordonnée des versions ancêtres (de la plus ancienne à la plus récente)",
        id: { label: "ID de version", description: "UUID de la version" },
        name: { label: "Nom", description: "Nom du graphe dans cette version" },
        createdAt: {
          label: "Créée le",
          description: "Date de création de cette version",
        },
        isActive: {
          label: "Active",
          description: "Indique s'il s'agit de la version actuellement active",
        },
      },
    },
    success: {
      title: "Historique des versions chargé",
      description: "Chaîne de versions récupérée avec succès",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Impossible d'accéder à ce graphe",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger l'historique des versions",
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
