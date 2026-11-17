import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Opérations de base de données",

  tag: "seed",
  post: {
    title: "Seed de la base de données",
    titleShort: "Seed BDD",
    description: "Alimenter la base de données avec des données initiales",
    form: {
      title: "Configuration du seed",
      description: "Configurer les paramètres du seed",
    },
    response: {
      title: "Réponse du seed",
      description: "Résultats de l'opération de seed de la base de données",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Authentification requise pour le seed de la base de données",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de seed invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant le seed",
        detail: "Échec du seed de la base de données : {{error}}",
      },
      internal: {
        title: "Erreur interne",
        description: "L'opération de seed de la base de données a échoué",
      },
      database: {
        title: "Erreur de base de données",
        description: "Erreur de base de données pendant le seed",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue pendant le seed",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant le seed",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Permissions insuffisantes pour le seed de la base de données",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources de seed introuvables",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données détecté pendant le seed",
      },
    },
    success: {
      title: "Base de données alimentée",
      description: "Seed de la base de données terminé avec succès",
    },
  },
  fields: {
    environment: {
      title: "Environnement",
      description: "Environnement cible du seed (dev, test, prod)",
    },
    success: {
      title: "Statut de réussite",
    },
    seedsExecuted: {
      title: "Seeds exécutés",
    },
    collections: {
      title: "Collections de seed",
      item: {
        title: "Collection",
      },
      name: {
        title: "Nom de la collection",
      },
      status: {
        title: "Statut",
      },
      recordsCreated: {
        title: "Enregistrements créés",
      },
    },
    totalRecords: {
      title: "Total des enregistrements",
    },
    duration: {
      title: "Durée (ms)",
    },
  },
};
