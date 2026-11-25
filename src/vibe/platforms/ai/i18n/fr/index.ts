import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Exécuter un outil",
      titleShort: "Exécuter un outil",
      dynamicTitle: "Exécuter : {{toolName}}",
      description:
        "Exécute n'importe quel endpoint enregistré par son nom. Passez le nom de l'outil et ses paramètres d'entrée. La route cible applique sa propre authentification : cet endpoint est un répartiteur universel pour MCP, les agents IA et l'automatisation.",
      container: {
        title: "Exécution de l'outil",
        description: "Nom de la route et paramètres d'entrée",
      },
      fields: {
        toolName: {
          label: "Nom de l'outil",
          description:
            "Nom ou alias de l'outil enregistré à exécuter (ex. 'vibe_agent_skills_GET'). Utilisez tool-help pour découvrir les outils disponibles.",
          placeholder: "vibe_agent_skills_GET",
        },
        input: {
          label: "Entrée",
          description:
            "Paramètres d'entrée de l'outil sous forme d'objet JSON. Les paramètres de chemin d'URL (ex. id) sont extraits automatiquement de cet objet.",
        },
        instanceId: {
          label: "ID d'instance",
          description:
            "ID facultatif d'une instance distante. S'il est défini, une tâche asynchrone est créée sur l'instance distante au lieu d'une exécution locale. Le résultat sera {taskId, status:\"pending\"}.",
        },
        callbackMode: {
          label: "Mode de rappel",
          description:
            '"wait" : exécution synchrone, résultat renvoyé directement (par défaut). "detach" : lancer et oublier, renvoie {taskId} immédiatement ; utilisez await-task plus tard si besoin. "wakeUp" : lancer et oublier, le résultat est injecté automatiquement dans le fil quand il est prêt ; n\'appelez PAS await-task. "endLoop" : exécution normale avec renvoi du résultat, mais la boucle d\'outils s\'arrête après ce lot ; plus aucun appel d\'outil pendant ce tour (les appels parallèles du même lot s\'exécutent quand même). "approve" : exige la confirmation de l\'utilisateur avant l\'exécution.',
        },
      },
      response: {
        result:
          "Les données renvoyées par la route cible. En cas d'échec, ce champ est absent : la réponse elle-même est une erreur.",
        resultLabel: "Résultat",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "toolName ou les paramètres d'entrée sont invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour appeler cet endpoint",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé",
        },
        toolDeniedHere: {
          title:
            "{{toolName}} n'est pas disponible dans ce fil. Appelez directement les outils de votre liste d'outils.",
        },
        notFound: {
          title: "Outil introuvable",
          description:
            "Aucun outil enregistré ne correspond au toolName indiqué",
          detail:
            'Outil "{{toolName}}" introuvable. Ne relancez pas cet appel : vérifiez les outils disponibles avec tool-help.',
        },
        remoteFailed: {
          title: "Échec de l'outil distant : {{message}}",
          description: "L'instance distante a rejeté l'appel ou a échoué",
          detail: 'Échec de l\'outil distant "{{toolName}}" : {{message}}',
        },
        resultChannelLost: {
          detail:
            'Aucun serveur local sur {{hubUrl}} pour recevoir le résultat de "{{toolName}}" depuis {{instanceId}} ({{detail}}). Démarre-le d\'abord (`vibe dev`, ou `vibe --hermes dev` pour Hermes), puis réessaie.',
        },
        server: {
          title: "Erreur d'exécution",
          description: "La route cible a rencontré une erreur serveur",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau pendant l'exécution de l'outil",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite pendant l'exécution",
          detail: "Erreur inconnue pendant l'exécution : {{error}}",
        },
      },
      success: {
        title: "Outil exécuté",
        description: "L'outil a été exécuté",
      },
      widget: {
        enterToolName: "Saisissez un nom d'outil pour charger son formulaire.",
        resolving: "Résolution de l'endpoint…",
        unknownTool: "Outil inconnu : {{toolName}}",
      },
      actions: {
        confirm: "Confirmer",
        cancel: "Annuler",
      },
    },
  },
  dismissTask: {
    post: {
      title: "Abandonner la tâche",
      titleShort: "Abandonner",
      description:
        "Annule une reprise wakeUp en attente. L'outil continue de tourner en arrière-plan, mais le fil est débloqué immédiatement. Le résultat est ignoré sans bruit quand l'outil se termine.",
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "callId est requis",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès refusé",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucun appel en attente pour ce callId",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'abandonner l'appel en attente",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors de l'abandon de la tâche",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
      },
      success: {
        title: "Tâche abandonnée",
        description: "Fil débloqué. L'outil continue en arrière-plan.",
      },
    },
  },
  cancelTool: {
    post: {
      title: "Annuler l'appel d'outil",
      titleShort: "Annuler l'outil",
      description:
        "Interrompt un appel d'outil en cours via son callId. L'appel s'arrête et renvoie une erreur comme résultat ; le tour et les autres appels d'outils parallèles continuent.",
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "callId est requis",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès refusé", description: "Accès refusé" },
        notFound: {
          title: "Introuvable",
          description: "Aucun appel en cours pour ce callId",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'annuler l'appel d'outil",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors de l'annulation",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
      },
      success: {
        title: "Appel d'outil annulé",
        description: "L'appel d'outil en cours a été interrompu.",
      },
    },
  },
  detachCall: {
    post: {
      title: "Détacher l'appel d'outil",
      titleShort: "Détacher l'appel",
      description:
        "Passe un appel d'outil encore en cours en mode détaché via son callId : il continue en arrière-plan, son résultat est ignoré et le tour est débloqué tout de suite. Utilisez plutôt resume-when-done si vous avez besoin du résultat.",
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "callId est requis",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès refusé", description: "Accès refusé" },
        notFound: {
          title: "Introuvable",
          description: "Aucun appel en cours pour ce callId",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de détacher l'appel d'outil",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors du détachement",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
      },
      success: {
        title: "Appel d'outil détaché",
        description:
          "L'appel continue en arrière-plan ; son résultat est ignoré.",
      },
    },
  },
  resumeWhenDone: {
    post: {
      title: "Passer l'appel d'outil en arrière-plan",
      titleShort: "Outil en arrière-plan",
      description:
        "Laisse un appel d'outil encore en cours se terminer en arrière-plan via son callId. Le tour se termine et le fil reprend avec le résultat une fois le travail fini.",
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "callId est requis",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès refusé", description: "Accès refusé" },
        notFound: {
          title: "Introuvable",
          description: "Aucun appel en cours pour ce callId",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de passer l'appel d'outil en arrière-plan",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors du passage en arrière-plan",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
      },
      success: {
        title: "Appel d'outil passé en arrière-plan",
        description: "L'appel d'outil continue en arrière-plan.",
      },
    },
  },
  tools: {
    get: {
      title: "Aide des outils : découvrez les outils disponibles",
      description:
        "Recherchez et découvrez tous les outils IA à votre disposition. query : recherche par nom, description ou alias. category : filtre par catégorie d'outil. Renvoie les noms, descriptions, alias et métadonnées des outils.",
      category: "Outils IA",
      tags: {
        tools: "outils",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Outil introuvable : {{toolName}}",
      parameterValidationFailed:
        "Échec de la validation des paramètres : {{errors}}",
      executionFailed: "Échec de l'exécution de l'outil",
    },
  },
  factory: {
    errors: {
      executionFailed: "Échec de l'exécution de l'outil",
    },
    descriptions: {
      noParametersRequired: "Aucun paramètre requis pour cet endpoint",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nExemple : ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Endpoint pour ",
      hiddenPlaceholder: "[masqué]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Échec de l'initialisation du registre d'outils",
    },
  },
};
