import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Opérations de base de données",

  dockerOperations: {
    title: "Opérations Docker",
    description: "Exécuter des commandes Docker et gérer les conteneurs",
    category: "Docker",
    tags: {
      docker: "Docker",
      utils: "Utilitaires",
      dockeroperations: "Opérations Docker",
    },
    container: {
      title: "Opérations Docker",
      description:
        "Exécuter des commandes Docker avec une gestion d'erreurs propre",
    },
    fields: {
      command: {
        label: "Commande Docker",
        description: "La commande Docker à exécuter",
        placeholder: "docker ps",
      },
      options: {
        label: "Options d'exécution",
        description: "Options de configuration de l'exécution de la commande",
        placeholder: "Configurer le délai et la journalisation",
      },
    },
    response: {
      success: {
        label: "Commande réussie",
      },
      output: {
        label: "Sortie de la commande",
      },
      error: {
        label: "Détails de l'erreur",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de commande Docker invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour les opérations Docker",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Permissions insuffisantes pour les opérations Docker",
      },
      internal: {
        title: "Erreur Docker",
        description: "L'exécution de la commande Docker a échoué",
      },
      timeout: {
        title: "Délai de commande dépassé",
        description: "La commande Docker a dépassé le délai maximal",
      },
      executionFailed: {
        title: "Échec de l'exécution",
        description: "L'exécution de la commande Docker a échoué",
      },
      composeDownFailed: {
        title: "Échec de compose down",
        description: "L'opération Docker Compose down a échoué",
      },
      composeUpFailed: {
        title: "Échec de compose up",
        description: "L'opération Docker Compose up a échoué",
      },
    },
    success: {
      title: "Commande Docker réussie",
      description: "Commande Docker exécutée avec succès",
    },
    messages: {
      executingCommand: "Exécution de la commande Docker : {command}",
      timeoutError:
        "La commande Docker a expiré après {timeout} ms : {command}",
      commandFailed:
        "La commande Docker a échoué avec le code {code} : {command}",
      executionFailed: "Impossible d'exécuter la commande Docker : {command}",
      commandError: "Erreur de commande Docker : {error}",
    },
  },
  title: "Utilitaires de base de données",
  titleShort: "Utilitaires BDD",
  description: "Fonctions utilitaires pour les opérations de base de données",
  tag: "utilitaires",
  includeDetails: {
    title: "Inclure les détails",
    description: "Inclure des informations détaillées dans la réponse",
  },
  checkConnections: {
    title: "Vérifier les connexions",
    description: "Vérifier l'état des connexions à la base de données",
  },
  status: {
    title: "État de santé",
  },
  timestamp: {
    title: "Horodatage",
  },
  connections: {
    title: "État des connexions",
    primary: "Connexion principale",
    replica: "Connexion réplique",
  },
  details: {
    title: "Détails de la base de données",
    version: "Version",
    uptime: "Disponibilité (secondes)",
    activeConnections: "Connexions actives",
    maxConnections: "Connexions max.",
  },
  errors: {
    health_check_failed:
      "Échec du contrôle de santé de la base de données : {{error}}",
    connection_failed: "Échec de la connexion à la base de données : {{error}}",
    stats_failed:
      "Impossible de récupérer les statistiques de la base de données : {{error}}",
    docker_check_failed:
      "Échec de la vérification de disponibilité de Docker : {{error}}",
    reset_failed: "La réinitialisation de la base de données a échoué",
    manage_failed: "L'opération de gestion de la base de données a échoué",
    reset_operation_failed: "La réinitialisation a échoué",
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de l'utilitaire de base de données invalides",
    },
    unauthorized: {
      title: "Non autorisé",
      description:
        "Authentification requise pour les utilitaires de base de données",
    },
    internal: {
      title: "Erreur interne",
      description: "L'opération de l'utilitaire de base de données a échoué",
    },
  },
  success: {
    title: "Utilitaires de base de données réussis",
    description:
      "Opérations des utilitaires de base de données terminées avec succès",
  },
  docker: {
    executing_command: "Exécution de la commande Docker : {{command}}",
    command_timeout:
      "La commande Docker a expiré après {{timeout}} ms : {{command}}",
    command_failed:
      "La commande Docker a échoué avec le code {{code}} : {{command}}",
    execution_failed: "Impossible d'exécuter la commande Docker : {{command}}",
    command_error: "Erreur de commande Docker : {{error}}",
    stopping_containers: "Arrêt des conteneurs Docker...",
    starting_containers: "Démarrage des conteneurs Docker...",
  },
};
