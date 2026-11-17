import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Détail du graphe",
    titleShort: "Données du graphe",
    description: "Afficher le graphique avec ses indicateurs et signaux",
    fields: {
      id: { label: "ID du graphe", description: "UUID du graphe" },
      resolution: {
        label: "Résolution",
        description: "Taille des intervalles de la série temporelle",
      },
      cursor: {
        label: "Curseur",
        description: "Horodatage le plus ancien chargé, pour la pagination",
      },
    },
    response: {
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nom",
        description: "Description",
        ownerType: "Type de propriétaire",
        isActive: "Actif",
        createdAt: "Créé le",
        config: "Configuration",
      },
      series: {
        nodeId: "ID du nœud",
        timestamp: "Horodatage",
        value: "Valeur",
      },
      signals: {
        nodeId: "ID du nœud",
        timestamp: "Horodatage",
        fired: "Déclenché",
      },
    },
    widget: {
      loading: "Chargement du graphe...",
      back: "Retour",
      active: "Actif",
      inactive: "Inactif",
      nodes: "nœuds",
      trigger: "Déclencher",
      backtest: "Backtest",
      edit: "Modifier",
      archive: "Archiver",
      promote: "Promouvoir",
      signal: "Signal",
      noData: "Aucune donnée sur cette période",
      loadingEarlierData: "Chargement des données antérieures…",
    },
    success: {
      title: "Graphe chargé",
      description: "Graphe récupéré avec succès",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: { title: "Accès refusé", description: "Accès refusé" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger le graphe",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      validation: {
        title: "Échec de la validation",
        description: "ID invalide",
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
