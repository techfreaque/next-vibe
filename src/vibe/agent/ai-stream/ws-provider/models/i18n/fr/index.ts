import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Modèles IA",
  tags: {
    models: "modèles",
    aiModels: "modèles-ia",
  },
  get: {
    title: "Lister les modèles IA",
    titleShort: "Modèles IA",
    description:
      "Renvoie tous les modèles IA disponibles avec leurs tarifs et leurs capacités",
    response: {
      models: {
        title: "Modèles",
      },
      id: {
        content: "ID du modèle",
      },
      name: {
        content: "Nom",
      },
      provider: {
        content: "Fournisseur",
      },
      category: {
        content: "Catégorie",
      },
      description: {
        content: "Description",
      },
      contextWindow: {
        content: "Fenêtre de contexte",
      },
      supportsTools: {
        content: "Prend en charge les outils",
      },
      creditCost: {
        content: "Coût en crédits",
      },
    },
    success: {
      title: "Modèles récupérés",
      description: "Liste des modèles IA récupérée",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun modèle trouvé",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer les modèles",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
    },
  },
};
