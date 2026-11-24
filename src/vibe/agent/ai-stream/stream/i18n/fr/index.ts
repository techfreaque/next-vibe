// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/fr";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "IA",
  },

  run: {
    task: {
      name: "Battement de cœur IA",
      description:
        "Agent IA en arrière-plan qui vérifie l'état du système, traite les tâches et contacte l'humain si nécessaire",
    },
    post: {
      title: "Lancer un agent IA",
      titleShort: "Lancer l'agent",
      dynamicTitle: "Exécution IA{{suffix}} : {{prompt}}",
      description:
        "Délègue une tâche à un agent IA spécialisé et renvoie sa réponse. Pour créer ou modifier des compétences/personas IA, déléguez toujours à skill='skill-creator', ne le faites jamais vous-même. Passez skill + prompt ; l'agent s'occupe du reste. Les crédits consommés dépendent du modèle.",
      container: {
        title: "Exécution d'agent IA",
        description:
          "Configurer les pré-appels et le prompt pour une exécution IA sans interface",
      },
      fields: {
        favoriteId: {
          label: "ID du favori",
          description:
            "Slug d'un favori enregistré (ex. 'thea-cheap'). Pas un slug de compétence : utilisez le champ skill pour cela. Charge la compétence, le modèle et la configuration des outils en une fois. Priorité si plusieurs sont définis : model > favoriteId > skill.",
          placeholder: "thea-cheap",
        },
        model: {
          label: "Modèle (CLI uniquement)",
          description:
            "Remplace directement le LLM. CLI uniquement : les autres plateformes utilisent favoriteId ou skill. Rapides : claude-haiku-4.5, gemini-2.5-flash. Équilibrés : claude-sonnet-4.6, gpt-5. Puissant : claude-opus-4.7. Gratuit : qwen3_235b-free.",
        },
        skill: {
          label: "Skill",
          description:
            "Slug de compétence (ex. 'thea', 'thea__cheap-smart'). Pas un slug de favori : utilisez favoriteId pour cela. Définit la persona IA et le prompt système. Utilisez 'skill-creator' pour créer ou modifier des compétences.",
          placeholder: "default",
        },
        prompt: {
          label: "Prompt",
          description:
            "L'instruction ou la question principale pour l'IA. Soyez précis : l'IA utilise les résultats des preCalls comme contexte s'ils sont fournis.",
          placeholder: "Saisissez votre prompt...",
        },
        instructions: {
          label: "Instructions système supplémentaires",
          description:
            "Instructions supplémentaires facultatives ajoutées au prompt système. Servent à imposer un format, un ton ou une longueur de sortie (ex. « Sois concis. JSON uniquement. »).",
          placeholder: "Sois concis. Un paragraphe maximum.",
        },
        preCalls: {
          label: "Pré-appels",
          description:
            "Appels d'outils à exécuter avant le prompt. Les résultats sont injectés comme contexte. Utilisez tool-help pour découvrir les outils disponibles et leurs arguments.",
          routeId: {
            label: "ID de l'outil",
            description:
              "Alias ou nom complet de l'outil à appeler (ex. 'web-search', 'agent_skills_GET'). Utilisez tool-help pour découvrir les outils.",
            placeholder: "web-search",
          },
          args: {
            label: "Arguments",
            description:
              'Arguments clé-valeur à plat pour l\'outil : fusionnez urlPathParams et les champs du body en un seul objet (ex. {"query": "latest news", "maxResults": 5}).',
          },
        },
        availableTools: {
          label: "Autorisés à l'exécution",
          description:
            "Outils pour cette exécution. [] = texte seul : aucun outil, le modèle écrit seulement (idéal pour des brouillons). Omettre = outils du skill ou du favori. Les autres listes ne sont pas encore appliquées.",
          toolId: {
            label: "ID de l'outil",
            description:
              "Alias ou nom complet de l'outil (ex. 'execute-tool', 'tool-help', 'web-search')",
          },
          requiresConfirmation: {
            label: "Confirmation requise",
            description:
              "Attendre la confirmation de l'utilisateur avant d'exécuter cet outil",
          },
        },
        pinnedTools: {
          label: "Dans le contexte (visibles par le modèle)",
          description:
            "Outils chargés dans le contexte du modèle. null = jeu par défaut de l'utilisateur. Ne change que ce que le modèle voit, pas ce qu'il peut exécuter.",
          toolId: {
            label: "ID de l'outil",
            description:
              "Alias ou nom complet de l'outil à charger dans le contexte",
          },
          requiresConfirmation: {
            label: "Confirmation requise",
            description:
              "Indique si cet outil exige une confirmation de l'utilisateur avant exécution",
          },
        },
        maxTurns: {
          label: "Tours max",
          description:
            "Nombre maximal de tours agentiques (cycles d'appels d'outils) avant l'arrêt. Par défaut : illimité. Mettez 1 pour un seul prompt + réponse sans appel d'outil.",
        },
        appendThreadId: {
          label: "ID du fil (continuer)",
          description:
            "UUID d'un fil existant à poursuivre. Le nouveau message est ajouté à cette conversation. Laissez vide pour démarrer un nouveau fil.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        rootFolderId: {
          label: "Dossier de stockage",
          description:
            "Où stocker le fil. Background = toutes les exécutions automatisées (Dreamer, Autopilot, tâches planifiées). Private = votre dossier. Shared = équipe. Incognito = aucun stockage.",
          placeholder: "background",
          options: {
            background: "Arrière-plan",
            private: "Privé",
            shared: "Partagé",
            public: "Public",
            incognito: "Incognito (aucun stockage)",
          },
        },
        subFolderId: {
          label: "ID du sous-dossier",
          description:
            "UUID facultatif d'un sous-dossier du dossier racine. Réservé au classement manuel : ne le passez PAS quand ai-run est appelé par programme ou depuis des outils IA. Laissez vide dans tous les contextes automatisés ou d'agent.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        excludeMemories: {
          label: "Exclure les mémoires",
          description:
            "Ne pas injecter les mémoires enregistrées dans le contexte. Pour les bots publics ou les tâches isolées. Par défaut : false.",
        },
      },
      response: {
        text: "Texte de la réponse de l'IA (balises think retirées). Null si le modèle n'a rien produit.",
        promptTokens: "Tokens de prompt consommés (coût en entrée)",
        completionTokens: "Tokens de complétion générés (coût en sortie)",
        creditCost:
          "Crédits facturés pour cette exécution. Null pour les exécutions incognito.",
        threadId:
          "UUID du fil où l'exécution a été stockée. Null si rootFolderId valait 'incognito'. Utilisez-le pour poursuivre la conversation via appendThreadId.",
        lastAiMessageId:
          "UUID du dernier message de l'assistant. Utile pour créer une branche ou référencer la réponse.",
        threadTitle: "Titre généré automatiquement pour ce fil",
        threadCreatedAt: "Date de création du fil (ISO 8601)",
        preCallResults: {
          title: "Résultats des pré-appels",
          routeId: "Outil appelé",
          succeeded: "Indique si l'appel a réussi",
          errorMessage: "Message d'erreur si l'appel a échoué",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres invalides",
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
          description: "Route ou ressource introuvable",
        },
        internal: {
          title: "Erreur serveur",
          description: "Erreur interne du serveur pendant l'exécution IA",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau pendant l'exécution IA",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Conflit avec des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données",
        },
      },
      requireFavOrSkill:
        "Fournissez au moins l'un des éléments suivants : favoriteId, skill ou model (CLI uniquement). Impossible de lancer sans modèle ni compétence résolvables.",
      skillNotFound:
        "Compétence '{{skill}}' introuvable. S'il s'agit d'un slug de favori (ex. 'thea-cheap'), utilisez --favoriteId au lieu de --skill.",
      success: {
        title: "Exécution IA terminée",
        description: "L'agent IA a terminé avec succès",
      },
      backButton: {
        label: "Retour",
      },
    },
  },
  route: {
    debug: {
      userObject: "Route de flux IA : objet utilisateur",
      extracted: "Route de flux IA : valeurs extraites",
    },
    errors: {
      invalidJson: "JSON invalide dans le corps de la requête",
      invalidRequestData: "Données de requête invalides ({{issue}})",
      modelAdminOnly:
        "{{model}} n'est pas disponible sur votre compte. Choisissez un autre modèle.",
      threadPostForbidden:
        "Vous ne pouvez pas écrire dans ce fil. Lancez une nouvelle discussion pour continuer.",
      fileTypeNotAllowed: "Type de fichier non autorisé : {{fileType}}",
      uncensoredApiKeyMissing: "Clé API Uncensored.ai non configurée",
      openrouterApiKeyMissing: "Clé API OpenRouter non configurée",
      streamCreationFailed:
        "Connexion au service IA impossible. Veuillez réessayer.",
      unknownError: "Une erreur s'est produite",
      creditValidationFailed: "Impossible de vérifier le solde de crédits",
      noIdentifier: "Aucun identifiant d'utilisateur ou de lead fourni",
      insufficientCredits:
        "Pas assez de crédits : cette requête coûte {{cost}}, votre solde est de {{balance}}. Rechargez ou choisissez un modèle moins cher.",
      noResponseBody: "Aucun corps de réponse reçu du flux",
      authenticationRequired:
        "Connectez-vous pour utiliser les dossiers persistants. Utilisez le mode incognito pour discuter anonymement.",
    },
  },
  post: {
    title: "Chat IA en streaming",
    titleShort: "Chat IA",
    description:
      "Diffuse en streaming des réponses de chat IA avec n'importe quel modèle (Claude, GPT, Gemini, Llama et d'autres). Prend en charge le texte, la voix, les pièces jointes et l'utilisation agentique d'outils.",
    form: {
      title: "Configuration du chat IA",
      description: "Configurer les paramètres et les messages du chat IA",
    },
    operation: {
      label: "Opération",
      description: "Type d'opération sur le message",
      options: {
        send: "Envoyer le message",
        retry: "Relancer le message",
        edit: "Modifier le message",
        answerAsAi: "Répondre en tant qu'IA",
      },
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du message",
      options: {
        private: "Privé",
        shared: "Partagé",
        public: "Public",
        incognito: "Incognito (aucun stockage)",
        background: "Arrière-plan",
      },
    },
    subFolderId: {
      label: "Sous-dossier",
      description: "Sous-dossier facultatif dans le dossier racine",
    },
    threadId: {
      label: "ID du fil",
      description:
        "UUID du fil auquel envoyer ce message. Doit être un UUID valide : créez d'abord un fil si vous n'en avez pas.",
    },
    userMessageId: {
      label: "ID du message utilisateur",
      description: "ID du message utilisateur généré côté client",
    },
    parentMessageId: {
      label: "ID du message parent",
      description: "ID du message parent pour les branches",
    },
    leafMessageId: {
      label: "ID du message feuille",
      description:
        "ID du message feuille de la branche courante : suit la branche active sans dépendre de l'URL",
    },
    incognitoThreadTitle: {
      label: "Titre du fil incognito",
      description:
        "Titre actuel du fil incognito, envoyé par le client car les fils incognito n'ont pas de ligne côté serveur",
    },
    incognitoThreadDescription: {
      label: "Description du fil incognito",
      description: "Description actuelle du fil incognito",
    },
    messageHistory: {
      label: "Historique des messages",
      description: "Historique des messages facultatif pour le mode incognito",
      item: {
        title: "Message",
        description: "Message de chat dans l'historique",
        role: {
          label: "Rôle",
        },
        content: {
          label: "Contenu",
        },
        metadata: {
          toolCall: {
            toolName: {
              label: "Nom de l'outil",
            },
            args: {
              label: "Arguments de l'outil",
            },
            result: {
              label: "Résultat de l'outil",
            },
            error: {
              label: "Erreur de l'outil",
            },
            executionTime: {
              label: "Durée d'exécution (ms)",
            },
            creditsUsed: {
              label: "Crédits utilisés",
            },
          },
        },
      },
    },
    content: {
      label: "Contenu du message",
      description: "Contenu du message à envoyer",
      placeholder: "Saisissez votre message...",
    },
    role: {
      label: "Rôle",
      description: "Rôle de l'expéditeur du message",
      options: {
        user: "Utilisateur",
        assistant: "Assistant",
        system: "Système",
        tool: "Outil",
        error: "Erreur",
      },
    },
    model: {
      label: "Modèle",
      description: "Modèle IA utilisé pour la génération",
    },
    skill: {
      label: "Skill",
      description:
        'ID ou slug d\'un skill de la liste des skills (option slug__variant). Laisser vide ou "default" pour aucun. Un ID inconnu bascule sur le skill par défaut.',
    },
    systemPrompt: {
      label: "Prompt système",
      description: "Instructions système facultatives",
      placeholder: "Saisissez le prompt système...",
      now: "à l'instant",
      minutesAgo: "il y a {{minutes}} min",
      hoursAgo: "il y a {{hours}} h",
      daysAgo: "il y a {{days}} j",
    },
    enableSearch: {
      label: "Activer la recherche web",
      description:
        "Autoriser l'IA à chercher sur le web des informations récentes",
    },
    timezone: {
      label: "Fuseau horaire",
      description:
        "Fuseau horaire de l'utilisateur pour des horodatages stables en cache",
    },
    imageSize: {
      label: "Taille de l'image",
      description: "Taille de l'image générée (ex. carré, paysage, portrait)",
    },
    imageQuality: {
      label: "Qualité de l'image",
      description: "Réglage de qualité de l'image générée (standard ou hd)",
    },
    musicDuration: {
      label: "Durée de la musique",
      description: "Durée de l'extrait audio généré",
    },
    favoriteConfig: {
      label: "Configuration du favori",
      description:
        "Configuration complète du favori actif : sélections de modèles, configuration des outils, réglages de contexte. null = aucun favori actif, utilisation des valeurs par défaut de la compétence ou du système.",
    },
    enabledToolIds: {
      label: "ID des outils activés",
      description: "Liste des ID d'outils IA à activer pour cette conversation",
    },
    toolConfirmation: {
      label: "Confirmation d'outil",
      description:
        "Réponse de l'utilisateur à une demande de confirmation d'outil",
      success: "Confirmation d'outil traitée",
      messageId: {
        label: "ID du message",
        description: "ID du message contenant l'appel d'outil",
      },
      confirmed: {
        label: "Confirmé",
        description:
          "Indique si l'utilisateur a confirmé l'exécution de l'outil",
      },
      updatedArgs: {
        label: "Arguments modifiés",
        description: "Arguments modifiés facultatifs pour l'appel d'outil",
      },
      errors: {
        messageNotFound: "Message d'outil introuvable",
        toolCallMissing: "Métadonnées ToolCall manquantes",
        toolNotFound: "Outil introuvable",
      },
    },
    resumeToken: {
      label: "Jeton de reprise",
      description: "Jeton pour reprendre un flux interrompu",
    },
    voiceMode: {
      label: "Mode vocal",
      description: "Configuration de l'interaction vocale",
      enabled: {
        label: "Activer le mode vocal",
        description: "Activer l'interaction vocale avec synthèse vocale",
      },
      voice: {
        label: "Voix",
        description:
          'Choisissez le type de voix pour la synthèse vocale. Passez "voices.MALE" pour une voix masculine ou "voices.FEMALE" (par défaut) pour une voix féminine.',
        male: "Voix masculine",
        female: "Voix féminine",
      },
    },
    audioInput: {
      title: "Entrée audio",
      description: "Envoyer un fichier audio pour le mode voix à voix",
      file: {
        label: "Fichier audio",
        description: "Fichier audio à transcrire et à traiter",
      },
    },
    attachments: {
      label: "Pièces jointes",
      description: "Fichiers joints au message (images, documents, etc.)",
    },
    executionContext: {
      label: "Contexte d'exécution",
      description:
        "Mode d'exécution de ce flux : local, relais distant ou fournisseur d'inférence. Les requêtes de chat normales utilisent local (par défaut).",
    },
    response: {
      title: "Réponse en streaming",
      description: "Réponse générée par l'IA en streaming",
      success: "Flux terminé avec succès",
      messageId: "ID du message",
      threadId: "ID du fil",
      totalTokens: "Total des tokens utilisés",
      finishReason: "Motif de fin",
      lastAiMessageContent: "Contenu du dernier message de l'IA",
      lastGeneratedMediaUrl: "URL du média généré",
      totalCreditsDeducted: "Crédits déduits",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise pour le streaming IA",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant le streaming",
      },
      serviceUnavailable: {
        title: "Instance distante indisponible",
        description: "L'instance connectée dont dépend ce fil est injoignable",
      },
      forbidden: {
        title: "Accès refusé",
        description: "L'accès au streaming IA est refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Endpoint de streaming IA introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Des modifications non enregistrées doivent d'abord être enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données pendant le streaming",
      },
    },
    success: {
      title: "Succès",
      description: "Flux IA généré avec succès",
    },
  },
  enums: {
    role: {
      user: "Utilisateur",
      assistant: "Assistant",
      system: "Système",
    },
  },
  streamingErrors: {
    aiStream: {
      error: {
        apiKey: {
          missing: "Clé API OpenAI manquante",
          invalid: "Clé API OpenAI invalide",
        },
        configuration: "Erreur de configuration du streaming IA",
        processing: "Erreur lors du traitement du flux IA",
      },
    },
  },
  debugView: {
    systemPromptTitle: "Prompt système",
    copied: "Copié !",
  },
  errorTypes: {
    streamError: "Erreur de flux",
  },
  errorThread: {
    title: "Erreur",
  },
  error: {
    title: "Erreur de flux",
  },
  info: {
    streamInterrupted:
      "Génération arrêtée. La réponse partielle a été enregistrée.",
    billingFailed:
      "Arrêté : impossible de débiter les crédits pour cette réponse. Rien n'est perdu, renvoyez votre message dans un instant.",
    budgetExceeded:
      "Arrêté : cette tâche en arrière-plan a atteint son plafond de crédits. Relevez le plafond dans Task Budget Caps pour la laisser continuer.",
    taskWatchdog:
      "Arrêté : le chien de garde des tâches a stoppé cette exécution, qui a dépassé sa limite de durée, de tours ou d'appels d'outils.",
    streamTimeLimit:
      "Arrêté : cette réponse a atteint la limite de {{minutes}} minutes. Tout ce qui a été écrit est enregistré. Cliquez sur Continuer pour reprendre là où elle s'est arrêtée.",
  },
  errors: {
    toolExecutionError:
      "Un outil ne s'est pas exécuté correctement. Veuillez réessayer.",
    toolExecutionErrorDetail: "Erreur d'outil : {{error}}",
    toolExecutionFailed: "Échec de l'exécution de l'outil. Veuillez réessayer.",
    toolDisabledByUser:
      "Cet outil a été désactivé par l'utilisateur. N'essayez plus de l'appeler.",
    userDeclinedTool: "L'exécution de l'outil a été annulée.",
    streamError: "La réponse de l'IA n'a pas pu aboutir. Veuillez réessayer.",
    pendingToolCall:
      "Un outil tourne encore en arrière-plan. Attendez qu'il se termine avant de continuer.",
    streamProcessingError:
      "Impossible de traiter la réponse de l'IA. Veuillez réessayer.",
    timeout:
      "L'IA a mis trop de temps à répondre (délai dépassé après {{maxDuration}} secondes). Réessayez avec un message plus court.",
    noResponse: "L'IA n'a généré aucune réponse. Veuillez réessayer.",
    creditBudgetReached:
      "Crédits épuisés. La réponse s'arrête là où votre solde s'est vidé. Rechargez pour continuer.",
    emptyAnswer:
      "Le modèle s'est arrêté sans écrire de réponse. Vous n'avez payé que ce que le fournisseur a facturé, sans frais de plateforme. Réessayez ou choisissez un autre modèle.",
    contentFiltered:
      "Cette réponse a été bloquée par le filtre de contenu du fournisseur. Essayez un autre modèle.",
    imageTooLarge:
      "L’image dépasse la taille acceptée par le modèle. Réduisez sa taille et renvoyez-la.",
    malformedToolCall:
      "Le modèle a envoyé un appel d'outil invalide, il n'a donc pas été exécuté. Cliquez sur Continuer et il réessaiera.",
    providerBusy:
      "Ce modèle est surchargé en ce moment. Réessayez dans quelques secondes ou choisissez un autre modèle.",
    modelUnavailable:
      "Le modèle IA choisi est actuellement indisponible. Essayez un autre modèle.",
    rateLimitExceeded: "Trop de requêtes. Patientez un instant puis réessayez.",
    insufficientCredits: "Pas assez de crédits pour cette requête.",
    connectionFailed:
      "Connexion au service IA impossible. Vérifiez votre connexion et réessayez.",
    invalidRequest: "Requête invalide. Vérifiez votre saisie et réessayez.",
    compactingStreamError:
      "Limite de contexte atteinte : votre conversation est trop longue pour la compaction automatique. Créez une branche depuis un message plus ancien, passez à un modèle avec une fenêtre de contexte plus large ou ajustez la fenêtre de contexte dans les réglages de votre favori.",
    compactingStreamErrorExpensive:
      "Limite de contexte atteinte ({{tokens}} tokens). Agrandir la fenêtre de contexte est possible mais peut coûter cher. Essayez d'abord de créer une branche depuis un message plus ancien ou de changer de modèle.",
    compactingException:
      "Impossible de compacter l'historique de la conversation. Créez une branche depuis un point antérieur de la conversation ou passez à un autre modèle.",
    compactingRebuildFailed:
      "Impossible de reconstruire la conversation après la compaction. Créez une branche depuis un message plus ancien.",
    unexpectedError:
      "Une erreur inattendue s'est produite : {{error}}. Veuillez réessayer.",
  },
  headless: {
    errors: {
      missingModelOrSkill:
        "model ou skill requis : passez-en un directement ou fournissez un favoriteId avec une sélection de modèle résolvable",
      favoriteNotFound:
        "Favori introuvable ou n'appartenant pas à cet utilisateur",
      ambiguousModel:
        "Fournissez SOIT un modèle explicite, SOIT un favori/une compétence, pas les deux",
    },
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Erreur de l'API Uncensored.ai ({{status}}) : {{errorText}}",
      },
    },
  },
  onboarding: {
    signin: {
      title: "Gardez votre configuration",
      subtitle:
        "Connectez-vous une fois. Tout ce que vous créez ici vous suit.",
      benefits: {
        sync: {
          title: "Synchronisé sur tous vos appareils",
          body: "Votre compagnon, vos spécialistes et vos discussions sur chaque appareil.",
        },
        keep: {
          title: "Ne perdez jamais votre travail",
          body: "En invité, votre configuration ne vit que dans ce navigateur. Connectez-vous et elle reste.",
        },
        private: {
          title: "Privé par défaut",
          body: "Vous contrôlez vos données et votre niveau de filtrage. Toujours.",
        },
      },
      cta: "Se connecter ou créer un compte",
      continueAsGuest: "Continuer en invité",
      note: "Vous pourrez vous connecter plus tard depuis le menu.",
    },
    setup: {
      title: "Configurez votre IA",
      subtitle:
        "Choisissez à qui vous parlez. Ajoutez des spécialistes si vous voulez. Tout se change plus tard.",
      arrivalTitle: "Commencez avec {{skill}}",
      arrivalSubtitle:
        "{{skill}} répond dans ce chat. Votre compagnon s'occupe du reste.",
      arrivalLabel: "Votre skill",
      arrivalBadge: "Inclus",
      companionLabel: "Votre compagnon",
      specialistsLabel: "Ajouter des spécialistes",
      optional: "facultatif",
      start: "Commencer à discuter",
      saving: "Configuration...",
      failed:
        "Impossible d'enregistrer votre configuration. Vérifiez votre connexion et réessayez.",
      retry: "Réessayer",
      noProviderAvailable:
        "Aucun fournisseur IA configuré. Ajoutez OPENROUTER_API_KEY ou activez Claude Code (CLAUDE_CODE_ENABLED=true) pour continuer.",
    },
    usecases: {
      coding: "Code et tech",
      research: "Recherche et analyse",
      writing: "Écriture et relecture",
      business: "Business et stratégie",
      creative: "Création et histoires",
      learning: "Apprentissage et études",
      health: "Santé et carrière",
      controversial: "Pensée libre",
      roleplay: "Jeu de rôle et personnages",
    },
  },
  input: {
    placeholder: "Envoyer un message...",
    imagePlaceholder: "Décrivez l'image à générer...",
    audioPlaceholder: "Décrivez l'audio ou la musique à générer...",
    noPermission: "Vous n'avez pas le droit de publier ici",
    signInToPost: {
      title: "Un compte gratuit pour publier",
      description:
        "Tout le monde peut lire les fils publics. Pour en lancer un ou répondre, il faut un compte gratuit, et vous revenez directement ici.",
    },
    noCredits: {
      title: "Plus de crédits",
      addCredits: "Ajouter des crédits",
      description: "Votre solde est vide. Rechargez pour continuer à discuter.",
    },
    creditsLoadFailed: {
      title: "Impossible de charger votre solde.",
      retry: "Réessayer",
    },
    insufficientCredits: {
      title:
        "Crédits insuffisants (requis : {{cost}}, disponibles : {{balance}})",
      description: "Rechargez ou choisissez un modèle moins cher.",
    },
    noModel: {
      title: "Aucun modèle sélectionné",
      description:
        "Choisissez d'abord un modèle. Aucun dans la liste ? Vérifiez les clés API de vos fournisseurs.",
    },
    keyboardShortcuts: {
      enter: "Entrée",
      toSend: "pour envoyer",
      shiftEnter: "Maj+Entrée",
      forNewLine: "pour aller à la ligne",
      ctrlV: "Ctrl+V",
      orPasteFiles: "ou coller des fichiers",
    },
    speechInput: {
      transcribing: "Transcription...",
    },
    attachments: {
      uploadFile: "Joindre des fichiers",
      attachedFiles: "Fichiers joints",
      addMore: "Ajouter",
    },
  },
  outOfCredits: {
    dismiss: "Fermer",
    guest: {
      title: "Plus de crédits gratuits",
      description:
        "Compte gratuit : {{signedIn}} crédits chaque mois, {{max}} avec la newsletter. Vous revenez directement dans cette discussion.",
      signUp: "Inscription gratuite",
      haveAccount: "Vous avez un compte ?",
      logIn: "Se connecter",
    },
    member: {
      title: "Vous n'avez plus de crédits",
      shortTitle: "Pas assez de crédits pour ce message",
      shortDescription:
        "Il vous reste {{balance}} crédits. Une longue conversation coûte plus cher par message : lancez une nouvelle conversation ou choisissez un modèle moins cher. Ou rechargez :",
      description:
        "Vos crédits gratuits se rechargent le {{date}}. Ou choisissez une formule et continuez dès maintenant :",
      subscriberDescription:
        "Les crédits de votre formule se renouvellent le {{date}}. Besoin de plus avant ? Rechargez ou passez à la formule supérieure :",
      orTopUp: "Ou sans attendre :",
      newsletter: {
        title: "+{{bonus}} crédits gratuits chaque mois",
        consent:
          "Inscrivez {{email}} à la newsletter : nouveautés produit et nouveaux modèles, désinscription à tout moment. Nous vous envoyons d'abord un lien de confirmation.",
        claim: "S'inscrire pour +{{bonus}}/mois",
        claiming: "Envoi...",
        pending:
          "Consultez {{email}} et cliquez sur le lien de confirmation pour débloquer +{{bonus}} crédits/mois.",
      },
    },
  },
  imageGen: {
    sizeSquare: "Carré (1024×1024)",
    sizeLandscape: "Paysage (1792×1024)",
    sizePortrait: "Portrait (1024×1792)",
    qualityStandard: "Standard",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "Court (~8 s)",
    durationMedium: "Moyen (~15 s)",
    durationLong: "Long (~30 s)",
  },
  voiceMode: {
    unconfiguredTitle: "Voix non configurée",
    unconfiguredDescription:
      "La synthèse vocale n'est pas disponible pour cette compétence.",
    callMode: "Mode appel",
    callModeDescription: "L'IA répondra à voix haute",
    tapToRecord: "Touchez pour enregistrer",
    recording: {
      paused: "En pause",
      resume: "Reprendre",
      pause: "Pause",
    },
    callOverlay: {
      listening: "À l'écoute...",
    },
    actions: {
      cancel: "Annuler",
      toInput: "Vers la saisie",
      sendVoice: "Envoyer la voix",
      retry: "Réessayer",
      download: "Télécharger l'audio",
      downloadHint:
        "Téléchargez le fichier et joignez-le plutôt à votre prochain message.",
    },
  },
  actions: {
    cancellingGeneration: "Annulation...",
    stopGeneration: "Arrêter",
    sendMessage: "Envoyer",
    openThread: "Ouvrir le fil",
  },
  toolsButton: {
    title: "Outils IA",
    tools: "Outils",
  },
  config: {
    folders: {
      private: "Privé",
      shared: "Partagé",
      public: "Public",
      background: "Arrière-plan",
      incognito: "Incognito",
      remote: "Distant",
    },
  },
  models: { names: modelTranslations.names },
};
