import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IA",

  tags: {
    api: "API compatible OpenAI",
  },

  openai: {
    missingKey:
      "Clé API manquante. Envoyez-la sous la forme 'Authorization: Bearer <key>' ou 'x-api-key: <key>'. Créez une clé dans Paramètres > Clés API.",
    invalidKey:
      "Clé API invalide ou révoquée. Vérifiez la clé ou créez-en une nouvelle dans Paramètres > Clés API.",
    authUnavailable:
      "Impossible de vérifier votre clé API pour le moment. Votre clé n'a pas été rejetée. Réessayez dans {{seconds}} s.",
    modelNotFound:
      "Le modèle '{{model}}' n'existe pas ou ne vous est pas accessible. Listez vos modèles avec GET /v1/models.",
    paidRequired:
      "L'API nécessite un compte payant : n'importe quelle formule ou un pack de crédits unique ({{packPrice}}). Ajoutez-en un sur {{url}}.",
    toolsUnsupportedByModel:
      "Ce modèle ne prend pas en charge les appels d'outils. Choisissez un modèle compatible ou retirez 'tools'.",
    badToolArguments:
      "Les arguments de l'appel d'outil '{{name}}' ne sont pas du JSON valide.",
    toolChoiceUnknown:
      "tool_choice désigne '{{name}}', qui ne figure pas dans 'tools'.",
    toolMessageNeedsId: "Le message tool {{param}} nécessite un tool_call_id.",
    nUnsupported: "Seul n=1 est pris en charge.",
    badImageUrl:
      "image_url doit être une URL http(s) ou une data: URL en base64.",
    insufficientCredits:
      "Crédits insuffisants. Cet appel nécessite environ {{cost}}, vous avez {{balance}}. Rechargez pour continuer.",
    rateLimited:
      "Limite de débit atteinte : {{limit}} requêtes par minute pour cette clé. Réessayez dans {{seconds}} s.",
    upstreamFailed: "Le fournisseur du modèle a échoué : {{error}}",
    balanceCheckFailed:
      "Impossible de vérifier votre solde de crédits. Rien n'a été exécuté. Réessayez.",
  },

  models: {
    get: {
      title: "Modèles compatibles OpenAI",
      titleShort: "Modèles v1",
      description:
        "Liste les modèles que votre clé API peut appeler. Format de liste OpenAI. Authentifiez-vous avec Authorization: Bearer <key>.",
      response: { object: "Type d'objet" },
      success: {
        title: "Modèles listés",
        description: "Les modèles disponibles pour cette clé API",
      },
    },
  },

  completions: {
    post: {
      title: "Chat completions compatibles OpenAI",
      titleShort: "Chat completions v1",
      description:
        "Appelez n'importe quel modèle au format chat completions d'OpenAI. Facturé sur vos crédits aux prix du chat. Prend en charge stream: true.",
      fields: {
        model: {
          label: "Modèle",
          description: "ID du modèle issu de GET /v1/models",
        },
        messages: {
          label: "Messages",
          description: "Tableau de messages OpenAI (system, user, assistant)",
        },
        stream: {
          label: "Streaming",
          description: "Envoyer la réponse en server-sent events",
        },
        streamOptions: {
          label: "Options de streaming",
          description:
            "{ include_usage: true } ajoute un dernier chunk d'usage",
        },
        maxTokens: {
          label: "Tokens max",
          description: "Plafond de tokens générés",
        },
        maxCompletionTokens: {
          label: "Tokens de complétion max",
          description: "Identique à max_tokens ; prioritaire",
        },
        temperature: {
          label: "Température",
          description: "Température d'échantillonnage, de 0 à 2",
        },
        topP: {
          label: "Top P",
          description: "Échantillonnage nucleus, de 0 à 1",
        },
        stop: {
          label: "Arrêt",
          description: "Séquence d'arrêt ou liste de séquences",
        },
        n: {
          label: "Choix",
          description: "Seul 1 est pris en charge",
        },
        tools: {
          label: "Outils",
          description:
            "Fonctions OpenAI que le modèle peut appeler : [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Choix d'outil",
          description:
            "none, auto, required, ou {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Appels d'outils parallèles",
          description: "Accepté pour compatibilité ; le modèle décide",
        },
      },
      response: { object: "Type d'objet" },
      success: {
        title: "Complétion créée",
        description: "Le modèle a répondu",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id n'est pas pris en charge : les réponses ne sont pas stockées. Envoyez la conversation complète dans 'input' avec store: false (Codex CLI le fait par défaut).",
    badInputItem:
      "{{param}} est inutilisable : les images doivent être des URL http(s) ou des data: URL en base64, et les éléments d'outil nécessitent un call_id.",
    post: {
      title: "Responses API d'OpenAI",
      titleShort: "Responses v1",
      description:
        "Appelez n'importe quel modèle au format Responses d'OpenAI, celui que parle Codex CLI. Sans état : envoyez la conversation complète dans input. Prend en charge le streaming, les outils function, custom et local_shell, ainsi que les éléments reasoning.",
      fields: {
        model: {
          label: "Modèle",
          description: "ID du modèle issu de GET /v1/models",
        },
        input: {
          label: "Entrée",
          description:
            "Une chaîne, ou la conversation sous forme d'éléments Responses (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "Instructions",
          description: "Instructions système pour le modèle",
        },
        stream: {
          label: "Streaming",
          description: "Envoyer la réponse en server-sent events Responses",
        },
        tools: {
          label: "Outils",
          description:
            "Outils function, custom et local_shell. Les outils hébergés (web_search, ...) sont ignorés.",
        },
        toolChoice: {
          label: "Choix d'outil",
          description: "none, auto, required, ou {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Appels d'outils parallèles",
          description: "Accepté pour compatibilité ; le modèle décide",
        },
        maxOutputTokens: {
          label: "Tokens de sortie max",
          description: "Plafond de tokens générés",
        },
        temperature: {
          label: "Température",
          description: "Température d'échantillonnage, de 0 à 2",
        },
        topP: {
          label: "Top P",
          description: "Échantillonnage nucleus, de 0 à 1",
        },
        reasoning: {
          label: "Raisonnement",
          description:
            "Accepté pour compatibilité. Les modèles de raisonnement renvoient des éléments reasoning dans tous les cas.",
        },
        text: {
          label: "Format du texte",
          description:
            "{format:{type:'json_schema', schema}} demande une sortie JSON",
        },
        store: {
          label: "Stockage",
          description: "Les réponses ne sont jamais stockées ; envoyez false",
        },
        previousResponseId: {
          label: "ID de la réponse précédente",
          description:
            "Non pris en charge : envoyez plutôt la conversation complète",
        },
        include: {
          label: "Inclure",
          description:
            "Accepté pour compatibilité. Les éléments reasoning portent toujours encrypted_content pour la relecture.",
        },
      },
      response: { object: "Type d'objet" },
      success: {
        title: "Réponse créée",
        description: "Le modèle a répondu",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} contient un bloc de contenu inutilisable : les images doivent être en base64 ou des URL http(s).",
    post: {
      title: "Messages API d'Anthropic",
      titleShort: "Messages v1",
      description:
        "Appelez n'importe quel modèle au format Messages d'Anthropic, celui que parle Claude Code. Clé dans x-api-key ou Authorization: Bearer. Prend en charge le streaming, les outils et les blocs thinking.",
      fields: {
        model: {
          label: "Modèle",
          description:
            "ID du modèle issu de GET /v1/models. Les ids Claude comme claude-sonnet-4-5-20250929 pointent vers notre modèle Claude correspondant.",
        },
        messages: {
          label: "Messages",
          description:
            "Messages Anthropic : tours user et assistant avec des blocs text, image, tool_use, tool_result et thinking",
        },
        system: {
          label: "Système",
          description: "Prompt système : une chaîne ou des blocs de texte",
        },
        maxTokens: {
          label: "Tokens max",
          description: "Plafond de tokens générés",
        },
        stream: {
          label: "Streaming",
          description: "Envoyer la réponse en server-sent events Anthropic",
        },
        tools: {
          label: "Outils",
          description:
            "Outils client : [{name, description, input_schema}]. Les outils serveur (web_search, ...) sont ignorés.",
        },
        toolChoice: {
          label: "Choix d'outil",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Séquences d'arrêt",
          description: "Chaînes qui terminent la réponse",
        },
        temperature: {
          label: "Température",
          description: "Température d'échantillonnage",
        },
        topP: {
          label: "Top P",
          description: "Échantillonnage nucleus, de 0 à 1",
        },
        thinking: {
          label: "Réflexion",
          description:
            "Accepté pour compatibilité. Les modèles de raisonnement renvoient des blocs thinking dans tous les cas.",
        },
      },
      response: { type: "Type d'objet" },
      success: { title: "Message créé", description: "Le modèle a répondu" },
    },
  },

  countTokens: {
    post: {
      title: "Comptage de tokens Anthropic",
      titleShort: "Comptage de tokens v1",
      description:
        "Estime les tokens d'entrée d'une requête Messages d'Anthropic. Aucun appel au modèle, aucun crédit consommé.",
      fields: {
        action: { label: "Action", description: "Toujours count_tokens" },
        model: { label: "Modèle", description: "ID du modèle" },
        messages: { label: "Messages", description: "Messages Anthropic" },
        system: { label: "Système", description: "Prompt système" },
        tools: { label: "Outils", description: "Définitions d'outils" },
      },
      response: { inputTokens: "Tokens d'entrée" },
      success: {
        title: "Tokens comptés",
        description: "Tokens d'entrée estimés",
      },
    },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Requête invalide",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Une clé API valide est requise",
    },
    server: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau s'est produite",
    },
    forbidden: { title: "Accès interdit", description: "Accès refusé" },
    notFound: { title: "Introuvable", description: "Modèle introuvable" },
    conflict: {
      title: "Conflit",
      description: "La requête entre en conflit avec l'état actuel",
    },
  },
};
