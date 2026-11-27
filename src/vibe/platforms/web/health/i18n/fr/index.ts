import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion du serveur",

  tag: "Santé",
  get: {
    title: "Contrôle de santé",
    titleShort: "Contrôle de santé",
    description: "Obtenir l'état de santé et les diagnostics du serveur",
    form: {
      title: "Options du contrôle de santé",
      description: "Configurer les paramètres du contrôle de santé",
    },
    fields: {
      detailed: {
        title: "Rapport détaillé",
        description: "Inclure des informations système détaillées",
      },
      includeDatabase: {
        title: "Inclure la base de données",
        description: "Inclure les contrôles de santé de la base de données",
      },
      includeTasks: {
        title: "Inclure les tâches",
        description: "Inclure les contrôles de santé du task runner",
      },
      includeSystem: {
        title: "Inclure le système",
        description: "Inclure les informations sur les ressources système",
      },
    },
    widget: {
      refresh: "Vérifier l’état",
      health: {
        healthy: "Normal",
        warning: "Avertissement",
        critical: "Critique",
        unknown: "Inconnu",
      },
      results: {
        pass: "Réussi",
        warn: "Avertissement",
        fail: "Échec",
      },
      checks: {
        traffic: "Réception du trafic",
        process: "Processus serveur",
      },
      messages: {
        draining: "Arrêt en cours. {{count}} flux restent actifs.",
        accepting: "Le serveur accepte le trafic. {{count}} flux actifs.",
        memory: "Utilisation élevée de la mémoire ({{usage}}).",
        processOk: "Le serveur fonctionne normalement.",
        databaseOk: "La base de données est connectée.",
        databaseFailed: "Échec de la connexion à la base de données.",
        tasksDisabled:
          "L’exécuteur de tâches est désactivé dans cet environnement.",
        tasksOk: "L’exécuteur de tâches est disponible.",
        systemOk: "Les ressources système sont en bon état.",
      },
    },
    response: {
      status: {
        title: "Statut",
        description: "État de santé global",
      },
      timestamp: {
        title: "Horodatage",
        description: "Heure du contrôle de santé",
      },
      uptime: {
        title: "Uptime",
        description: "Temps de fonctionnement du serveur en secondes",
      },
      revision: {
        title: "Commit de compilation",
      },
      environment: {
        title: "Environnement",
        description: "Informations sur l'environnement du serveur",
        name: {
          title: "Nom de l'environnement",
        },
        nodeEnv: {
          title: "Environnement Node",
        },
        platform: {
          title: "Plateforme",
        },
        supportsTaskRunners: {
          title: "Prend en charge les task runners",
        },
      },
      database: {
        title: "État de la base de données",
        description: "État de la connexion à la base de données",
        status: {
          title: "État de la connexion",
        },
        responseTime: {
          title: "Temps de réponse (ms)",
        },
        error: {
          title: "Message d'erreur",
        },
      },
      tasks: {
        title: "État des tâches",
        description: "État du task runner",
        runnerStatus: {
          title: "État du runner",
        },
        activeTasks: {
          title: "Tâches actives",
        },
        totalTasks: {
          title: "Nombre total de tâches",
        },
        errors: {
          title: "Nombre d'erreurs",
        },
        lastError: {
          title: "Dernière erreur",
        },
      },
      system: {
        title: "Infos système",
        description: "Informations sur les ressources système",
        memory: {
          title: "Utilisation de la mémoire",
          description: "Informations sur la mémoire système",
          used: {
            title: "Mémoire utilisée",
          },
          total: {
            title: "Mémoire totale",
          },
          percentage: {
            title: "Utilisation de la mémoire (%)",
          },
        },
        cpu: {
          title: "Utilisation du CPU",
          description: "Informations sur le CPU",
          usage: {
            title: "Utilisation du CPU (%)",
          },
          loadAverage: {
            title: "Charge moyenne",
          },
        },
        disk: {
          title: "Utilisation du disque",
          description: "Informations sur le disque",
          available: {
            title: "Espace disponible",
          },
          total: {
            title: "Espace total",
          },
          percentage: {
            title: "Utilisation du disque (%)",
          },
        },
      },
      checks: {
        title: "Contrôles de santé",
        description: "Contrôles de santé par composant",
        item: {
          title: "Contrôle de santé",
          description: "Résultat d'un contrôle de santé",
          name: {
            title: "Nom du contrôle",
          },
          status: {
            title: "Statut du contrôle",
          },
          message: {
            title: "Message du contrôle",
          },
          duration: {
            title: "Durée (ms)",
          },
        },
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        checkFailed: "Échec du contrôle de santé : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Contrôle de santé terminé",
    },
  },
};
