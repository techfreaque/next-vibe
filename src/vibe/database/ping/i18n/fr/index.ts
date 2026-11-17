import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Opérations de base de données",
  tag: "base de données",
  post: {
    title: "Ping de la base de données",
    titleShort: "Ping BDD",
    description: "Vérifier la connectivité et l'état de la base de données",
    form: {
      title: "Configuration du ping",
      description: "Configurer les paramètres du ping de la base de données",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse du ping",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Authentification requise pour accéder aux opérations de base de données",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de la requête de ping invalides",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur lors du ping de la base de données",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue est survenue lors du ping de la base de données",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau lors de la connexion à la base de données",
        detail: "Échec du ping de la base de données : {{error}}",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé : permissions insuffisantes",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource de base de données introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données pendant l'opération",
      },
    },
    success: {
      title: "Ping de la base de données réussi",
      description: "Connexion à la base de données établie",
    },
  },
  fields: {
    silent: {
      title: "Mode silencieux",
      description: "Exécuter le ping sans messages de sortie",
    },
    keepConnectionOpen: {
      title: "Garder la connexion ouverte",
      description:
        "Garder la connexion à la base de données ouverte après le ping",
    },
    success: {
      title: "Statut de réussite",
      content: "Réussi",
    },
    isAccessible: {
      title: "Base de données accessible",
      content: "Accessible",
    },
    output: {
      title: "Message de sortie",
      content: "Sortie",
    },
    connectionInfo: {
      title: "Informations de connexion",
      totalConnections: {
        content: "Connexions totales",
      },
      idleConnections: {
        content: "Connexions inactives",
      },
      waitingClients: {
        content: "Clients en attente",
      },
    },
  },
  status: {
    success: "Réussi",
    failed: "Échoué",
    timeout: "Délai dépassé",
    error: "Erreur",
  },
  connectionType: {
    primary: "Principale",
    replica: "Réplique",
    cache: "Cache",
  },
};
