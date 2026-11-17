import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "IA",
    status: "Statut",
    processing: "Traitement",
    classification: "Classification",
    automation: "Automatisation",
    execution: "Exécution",
    confirmation: "Confirmation",
    speech: "Voix",
    transcription: "Transcription",
    tts: "Synthèse vocale",
  },
  enums: {
    emailAgentStatus: {
      pending: "En attente",
      processing: "Traitement",
      hardRulesComplete: "Règles fixes appliquées",
      aiProcessing: "Traitement IA",
      awaitingConfirmation: "En attente de confirmation",
      completed: "Terminé",
      failed: "Échec",
      skipped: "Ignoré",
    },
    emailAgentActionType: {
      markBounced: "Marquer comme rejeté",
      markSpam: "Marquer comme spam",
      classifyDeliveryFailure: "Classer l'échec de distribution",
      respondToEmail: "Répondre à l'e-mail",
      deleteEmail: "Supprimer l'e-mail",
      searchKnowledgeBase: "Chercher dans la base de connaissances",
      webSearch: "Recherche web",
      escalateToHuman: "Transmettre à un humain",
      noAction: "Aucune action",
      chainAnalysis: "Analyse de chaîne",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "Recherche dans la base de connaissances",
      emailResponse: "Réponse par e-mail",
      emailDelete: "Suppression d'e-mail",
      webSearch: "Recherche web",
    },
    bounceCategory: {
      hardBounce: "Rejet définitif",
      softBounce: "Rejet temporaire",
      spamComplaint: "Signalement de spam",
      unsubscribe: "Désinscription",
      blockBounce: "Rejet par blocage",
      invalidAddress: "Adresse non valide",
      mailboxFull: "Boîte pleine",
      contentRejected: "Contenu refusé",
    },
    confirmationStatus: {
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Refusé",
      expired: "Expiré",
    },
    processingPriority: {
      low: "Basse",
      normal: "Normale",
      high: "Haute",
      urgent: "Urgente",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    emailAgentSortField: {
      emailId: "ID de l'e-mail",
      status: "Statut",
      lastProcessedAt: "Dernier traitement",
      createdAt: "Créé le",
      priority: "Priorité",
    },
    emailAgentStatusFilter: {
      all: "Tous",
      pending: "En attente",
      processing: "Traitement",
      hardRulesComplete: "Règles fixes appliquées",
      aiProcessing: "Traitement IA",
      awaitingConfirmation: "En attente de confirmation",
      completed: "Terminé",
      failed: "Échec",
      skipped: "Ignoré",
    },
    emailAgentActionTypeFilter: {
      all: "Toutes",
      markBounced: "Marquer comme rejeté",
      markSpam: "Marquer comme spam",
      classifyDeliveryFailure: "Classer l'échec de distribution",
      respondToEmail: "Répondre à l'e-mail",
      deleteEmail: "Supprimer l'e-mail",
      searchKnowledgeBase: "Chercher dans la base de connaissances",
      webSearch: "Recherche web",
      escalateToHuman: "Transmettre à un humain",
      noAction: "Aucune action",
      chainAnalysis: "Analyse de chaîne",
    },
    confirmationStatusFilter: {
      all: "Tous",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Refusé",
      expired: "Expiré",
    },
    processingPriorityFilter: {
      all: "Toutes",
      low: "Basse",
      normal: "Normale",
      high: "Haute",
      urgent: "Urgente",
    },
    confirmationResponseAction: {
      approve: "Approuver",
      reject: "Refuser",
    },
    modelUtilities: {
      chat: "Chat",
      coding: "Code",
      creative: "Écriture créative",
      analysis: "Analyse",
      reasoning: "Raisonnement",
      roleplay: "Jeu de rôle",
      fast: "Rapide",
      smart: "Intelligent",
      vision: "Vision",
      imageGen: "Génération d'images",
      politicalLeft: "Gauche politique",
      politicalRight: "Droite politique",
      controversial: "Controversé",
      adultImplied: "Adulte (suggéré)",
      adultExplicit: "Adulte (explicite)",
      violence: "Violence",
      harmful: "Contenu dangereux",
      illegalInfo: "Informations illégales",
      medicalAdvice: "Conseils médicaux",
      offensiveLanguage: "Langage offensant",
      roleplayDark: "Jeu de rôle sombre",
      conspiracy: "Complotisme",
      legacy: "Ancien",
      uncensored: "Non censuré",
    },
  },
  aiStream: {
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
          "Agent IA en arrière-plan qui vérifie l'état du système, traite les tâches et contacte l'humain si besoin",
      },
      post: {
        title: "Lancer un agent IA",
        dynamicTitle: "Exécution IA{{suffix}} : {{prompt}}",
        description:
          "Délègue une tâche à un agent IA spécialisé et renvoie sa réponse. Pour créer ou modifier des skills/personas IA, déléguez toujours à skill='skill-creator', ne le faites jamais vous-même. Passez skill + prompt : l'agent gère le reste. Crédits consommés selon le modèle.",
        container: {
          title: "Exécution d'agent IA",
          description:
            "Configurez les pré-appels et le prompt pour une exécution IA sans interface",
        },
        fields: {
          favoriteId: {
            label: "ID du favori",
            description:
              "Slug ou ID d'un favori enregistré. Charge par défaut le skill, le modèle et la configuration des outils. Les champs explicites de cette requête priment sur ceux du favori.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          model: {
            label: "Modèle",
            description:
              "LLM pour le raisonnement textuel. Facultatif si favoriteId ou skill est défini. Rapide : claude-haiku-4.5, gemini-2.5-flash. Équilibré : claude-sonnet-4.6, gpt-5. Puissant : claude-opus-4.7. Gratuit : qwen3_235b-free. Pas pour la génération d'images, d'audio ou de vidéo.",
          },
          skill: {
            label: "Skill",
            description:
              "ID du skill ou nom d'un skill par défaut. Définit la persona IA et le prompt système. Utilisez 'skill-creator' pour créer ou modifier des skills IA. Facultatif si favoriteId est défini.",
            placeholder: "default",
          },
          prompt: {
            label: "Prompt",
            description:
              "L'instruction ou la question principale pour l'IA. Soyez précis : l'IA utilise les résultats de preCalls comme contexte s'ils sont fournis.",
            placeholder: "Saisissez votre prompt...",
          },
          instructions: {
            label: "Instructions système supplémentaires",
            description:
              "Instructions facultatives ajoutées au prompt système. Servent à imposer un format, un ton ou une longueur (ex. 'Sois concis. JSON uniquement.').",
            placeholder: "Sois concis. Un paragraphe maximum.",
          },
          preCalls: {
            label: "Pré-appels",
            description:
              "Appels d'outils exécutés avant le prompt. Les résultats sont injectés comme contexte. Utilisez tool-help pour découvrir les outils disponibles et leurs arguments.",
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
              "Outils que l'IA peut exécuter. null = tous ceux autorisés. Tableau = limité aux outils listés. Standard : [{toolId:'execute-tool'},{toolId:'tool-help'}].",
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
            label: "En contexte (visibles par le modèle)",
            description:
              "Outils chargés dans le contexte du modèle. null = jeu par défaut de l'utilisateur. Change seulement ce que le modèle voit, pas ce qu'il peut exécuter.",
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
            label: "Tours max.",
            description:
              "Nombre maximal de tours agentiques (cycles d'appels d'outils) avant l'arrêt. Par défaut : illimité. Mettez 1 pour un seul prompt + réponse sans appel d'outil.",
          },
          appendThreadId: {
            label: "ID du fil (continuer)",
            description:
              "UUID d'un fil existant à poursuivre. Le nouveau message s'ajoute à cette conversation. Laissez vide pour démarrer un nouveau fil.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          rootFolderId: {
            label: "Dossier de stockage",
            description:
              "Où stocker le fil. Arrière-plan = toutes les exécutions automatisées (Dreamer, Autopilot, tâches planifiées). Privé = votre dossier. Partagé = équipe. Incognito = aucun stockage.",
            placeholder: "background",
            options: {
              background: "Arrière-plan",
              private: "Privé",
              shared: "Partagé",
              incognito: "Incognito (aucun stockage)",
            },
          },
          subFolderId: {
            label: "ID du sous-dossier",
            description:
              "UUID facultatif d'un sous-dossier du dossier racine. Pour le rangement manuel uniquement : ne le passez PAS lors d'un appel programmatique à ai-run ou depuis des outils IA. Laissez vide dans tout contexte automatisé ou agentique.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          excludeMemories: {
            label: "Exclure les mémoires",
            description:
              "N'injecte pas les mémoires enregistrées dans le contexte. Pour les bots publics ou les tâches isolées. Par défaut : false.",
          },
        },
        response: {
          text: "Texte de la réponse de l'IA (balises think retirées). Null si le modèle n'a rien produit.",
          promptTokens: "Tokens de prompt consommés (coût d'entrée)",
          completionTokens: "Tokens de complétion générés (coût de sortie)",
          creditCost:
            "Crédits facturés pour cette exécution. Null pour les exécutions incognito.",
          threadId:
            "UUID du fil où l'exécution est stockée. Null si rootFolderId valait 'incognito'. Servez-vous-en pour poursuivre la conversation via appendThreadId.",
          lastAiMessageId:
            "UUID du dernier message de l'assistant. Utile pour créer une branche ou faire référence à la réponse.",
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
            description: "Paramètres fournis non valides",
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
            description: "Une erreur inattendue est survenue",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Conflit avec des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données est survenu",
          },
        },
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
        userObject: "Route AI Stream : objet utilisateur",
        extracted: "Route AI Stream : valeurs extraites",
      },
      errors: {
        invalidJson: "JSON non valide dans le corps de la requête",
        invalidRequestData: "Données de requête non valides ({{issue}})",
        uncensoredApiKeyMissing: "Clé API Uncensored.ai non configurée",
        openrouterApiKeyMissing: "Clé API OpenRouter non configurée",
        streamCreationFailed:
          "Impossible de joindre le service d'IA. Réessayez.",
        unknownError: "Une erreur est survenue",
        creditValidationFailed: "Impossible de valider le solde de crédits",
        noIdentifier: "Aucun identifiant d'utilisateur ou de lead fourni",
        insufficientCredits:
          "Crédits insuffisants pour cette requête (coût : {{cost}}, solde : {{balance}})",
        noResponseBody: "Aucun corps de réponse reçu du flux",
        authenticationRequired:
          "Connectez-vous pour utiliser les dossiers persistants. Passez en mode incognito pour discuter anonymement.",
      },
    },
    post: {
      title: "Chat IA en streaming",
      titleShort: "Chat IA",
      description:
        "Réponses de chat IA en streaming avec {{modelCount}} modèles (Claude, GPT, Gemini, Llama et d'autres). Texte, voix, pièces jointes et outils agentiques.",
      form: {
        title: "Configuration du chat IA",
        description: "Configurez les paramètres et les messages du chat IA",
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
          "ID du message feuille de la branche actuelle : suit la branche active sans dépendre de l'URL",
      },
      messageHistory: {
        label: "Historique des messages",
        description: "Historique facultatif pour le mode incognito",
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
                label: "Temps d'exécution (ms)",
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
        },
      },
      model: {
        label: "Modèle",
        description: "Modèle d'IA utilisé pour la génération",
      },
      skill: {
        label: "Skill",
        description: "Skill facultatif à utiliser pour l'IA",
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
          "Autorise l'IA à chercher sur le web des informations à jour",
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
        description: "Qualité de l'image générée (standard ou hd)",
      },
      musicDuration: {
        label: "Durée de la musique",
        description: "Durée du clip audio généré",
      },
      favoriteConfig: {
        label: "Configuration du favori",
        description:
          "Configuration complète du favori actif : choix des modèles, configuration des outils, paramètres de contexte. null = aucun favori actif, valeurs par défaut du skill ou du système.",
      },
      enabledToolIds: {
        label: "IDs des outils activés",
        description:
          "Liste des IDs d'outils IA à activer pour cette conversation",
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
          label: "Arguments mis à jour",
          description: "Arguments mis à jour facultatifs pour l'appel d'outil",
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
          description: "Active l'interaction vocale avec synthèse vocale",
        },
        voice: {
          label: "Voix",
          description:
            'Choisissez le type de voix de la synthèse vocale. Passez "voices.MALE" pour une voix masculine ou "voices.FEMALE" (par défaut) pour une voix féminine.',
          male: "Voix masculine",
          female: "Voix féminine",
        },
      },
      audioInput: {
        title: "Entrée audio",
        description: "Envoyez un fichier audio pour le mode voix à voix",
        file: {
          label: "Fichier audio",
          description: "Fichier audio à transcrire et à traiter",
        },
      },
      attachments: {
        label: "Pièces jointes",
        description: "Fichiers joints au message (images, documents, etc.)",
      },
      response: {
        title: "Réponse en streaming",
        description: "Réponse générée par l'IA en streaming",
        success: "Flux terminé",
        messageId: "ID du message",
        threadId: "ID du fil",
        totalTokens: "Total de tokens utilisés",
        finishReason: "Raison de fin",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour le streaming IA",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête non valides",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau pendant le streaming",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès au streaming IA refusé",
        },
        notFound: {
          title: "Introuvable",
          description: "Endpoint de streaming IA introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Des modifications doivent d'abord être enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de données est survenu pendant le streaming",
        },
      },
      success: {
        title: "Succès",
        description: "Flux IA généré",
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
            invalid: "Clé API OpenAI non valide",
          },
          configuration: "Erreur de configuration du streaming IA",
          processing: "Erreur de traitement du flux IA",
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
    wakeUp: {
      revivalPrompt:
        "La tâche asynchrone que tu as lancée est terminée. Le résultat se trouve dans le message d'outil ci-dessus. Résume-moi ce que la tâche a renvoyé.",
      revivalInstructions:
        "MODE RÉVEIL : une tâche asynchrone est terminée et son résultat se trouve dans le fil. Réponds au dernier message de l'utilisateur en résumant le résultat de l'outil, en 1 à 3 phrases seulement. N'appelle AUCUN outil. NE réexécute PAS la demande initiale de l'utilisateur.",
    },
    info: {
      streamInterrupted:
        "Génération arrêtée. La réponse partielle a été enregistrée.",
    },
    errors: {
      toolExecutionError:
        "Un outil ne s'est pas exécuté correctement. Réessayez.",
      toolExecutionErrorDetail: "Erreur d'outil : {{error}}",
      toolExecutionFailed: "Échec de l'exécution de l'outil. Réessayez.",
      toolDisabledByUser:
        "Cet outil a été désactivé par l'utilisateur. N'essaie plus de l'appeler.",
      userDeclinedTool: "Exécution de l'outil annulée.",
      streamError: "La réponse de l'IA n'a pas pu aboutir. Réessayez.",
      pendingToolCall:
        "Un outil tourne encore en arrière-plan. Attendez qu'il se termine avant de continuer.",
      streamProcessingError:
        "Impossible de traiter la réponse de l'IA. Réessayez.",
      timeout:
        "L'IA a mis trop de temps à répondre (délai dépassé après {{maxDuration}} secondes). Réessayez avec un message plus court.",
      noResponse: "L'IA n'a généré aucune réponse. Réessayez.",
      modelUnavailable:
        "Le modèle d'IA choisi est indisponible pour le moment. Essayez-en un autre.",
      rateLimitExceeded: "Trop de requêtes. Patientez un instant et réessayez.",
      insufficientCredits: "Crédits insuffisants pour cette requête.",
      connectionFailed:
        "Impossible de joindre le service d'IA. Vérifiez votre connexion et réessayez.",
      invalidRequest: "Requête non valide. Vérifiez votre saisie et réessayez.",
      compactingStreamError:
        "Limite de contexte atteinte : votre conversation est trop longue pour être compactée automatiquement. Créez une branche depuis un message plus ancien, passez à un modèle avec une fenêtre de contexte plus large ou ajustez la fenêtre de contexte dans les paramètres de votre favori.",
      compactingStreamErrorExpensive:
        "Limite de contexte atteinte ({{tokens}} tokens). Agrandir la fenêtre de contexte est possible mais peut coûter cher. Essayez d'abord de créer une branche depuis un message plus ancien ou de changer de modèle.",
      compactingException:
        "Impossible de compacter l'historique de la conversation. Créez une branche depuis un point antérieur de la conversation ou passez à un autre modèle.",
      compactingRebuildFailed:
        "Impossible de reconstruire la conversation après compactage. Créez une branche depuis un message plus ancien.",
      unexpectedError:
        "Une erreur inattendue est survenue : {{error}}. Réessayez.",
    },
    headless: {
      errors: {
        // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
        missingModelOrSkill:
          "model ou skill requis : passez-en un directement ou fournissez un favoriteId avec une sélection de modèle exploitable",
        favoriteNotFound:
          "Favori introuvable ou n'appartenant pas à cet utilisateur",
      },
    },
    resumeStream: {
      post: {
        title: "Reprendre le flux IA",
        description:
          "Poursuit un fil existant en lançant un tour d'IA sans interface. Sert après la fin d'une tâche distante asynchrone (callbackMode=wait ou wakeUp). Passez favoriteId pour charger modèle + skill d'un coup, ou définissez modelId + skillId explicitement.",
        fields: {
          threadId: {
            title: "ID du fil",
            description: "UUID du fil existant à poursuivre.",
          },
          favoriteId: {
            title: "ID du favori",
            description:
              "UUID d'un favori enregistré dont charger le modèle et le skill. Prime sur modelId/skillId si les deux sont définis.",
          },
          modelId: {
            title: "ID du modèle",
            description:
              "Modèle d'IA pour le tour repris. Facultatif si favoriteId est fourni.",
          },
          skillId: {
            title: "ID du skill",
            description:
              "Skill/persona pour le tour repris. Facultatif si favoriteId est fourni.",
          },
          callbackMode: {
            title: "Mode de rappel",
            description:
              "Mode de rappel de l'appel d'outil d'origine (wait ou wakeUp). Détermine le comportement de la reprise.",
          },
          wakeUpToolMessageId: {
            title: "ID du message d'outil WakeUp",
            description:
              "ID du message d'appel d'outil d'origine, complété avec le résultat.",
          },
          wakeUpTaskId: {
            title: "ID de la tâche WakeUp",
            description:
              "ID de la tâche cron distante d'origine, supprimée après la reprise.",
          },
          resumeTaskId: {
            title: "ID de la tâche de reprise",
            description:
              "ID de cette tâche cron resume-stream elle-même, supprimée après la reprise.",
          },
          resumed: {
            title: "Repris",
            description: "Indique si le fil a bien été poursuivi.",
          },
          lastAiMessageId: {
            title: "ID du dernier message IA",
            description:
              "UUID du dernier message de l'assistant généré. Null si aucun message n'a été produit.",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description:
              "Paramètres non valides : threadId doit être un UUID valide",
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
            description: "Fil ou modèle introuvable",
          },
          internal: {
            title: "Erreur serveur",
            description: "Erreur interne pendant la reprise du flux",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Conflit avec des modifications non enregistrées",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit est survenu",
          },
        },
        success: {
          title: "Flux repris",
          description: "Le fil IA a bien été poursuivi",
        },
      },
    },
    providers: {
      uncensoredHandler: {
        errors: {
          apiError:
            "Erreur de l'API Uncensored.ai ({{status}}) : {{errorText}}",
        },
      },
    },
    onboarding: {
      back: "Retour",
      welcome: {
        title: "Une IA pour tout. La bonne pour chaque tâche.",
        line1:
          "Un compagnon pour les conversations du quotidien. Des spécialistes pour le code, la recherche, l'écriture : vous en choisissez un quand la tâche l'exige.",
        line2: "Même chat. Vous changez quand ça compte. En quelques secondes.",
        line3: "On vous configure tout ça en moins d'une minute.",
        continue: "Commencer",
      },
      guest: {
        title: "Vous naviguez en tant qu'invité",
        line1:
          "Vos paramètres, votre compagnon et votre historique de chat sont enregistrés uniquement sur cet appareil.",
        line2:
          "Connectez-vous pour tout synchroniser entre vos appareils et ne jamais perdre votre configuration.",
        signIn: "Se connecter / Créer un compte",
        continueAnyway: "Continuer en invité",
        note: "Vous pourrez vous connecter plus tard depuis le menu.",
      },
      companion: {
        title: "Choisissez votre compagnon",
        subtitle: "Votre partenaire de chat principal au quotidien",
        modelTitle: "Quel modèle doit le faire tourner ?",
        customSetup: "Configuration avancée →",
        next: "Suivant",
        selectFirst: "Choisissez un compagnon pour continuer",
      },
      usecases: {
        title: "À quoi allez-vous surtout l'utiliser ?",
        subtitle:
          "Nous ajoutons automatiquement les bons spécialistes à la boîte à outils de votre IA.",
        saving: "Configuration...",
        start: "Commencer à discuter",
        hintNoneSelected:
          "Choisissez des domaines pour configurer des skills spécialisés, ou touchez Commencer pour passer",
        noProviderAvailable:
          "Aucun fournisseur d'IA configuré. Ajoutez OPENROUTER_API_KEY ou activez Claude Code (CLAUDE_CODE_ENABLED=true) pour continuer.",
        coding: {
          label: "Code et tech",
          hint: "Vibe Coder, Codeur",
        },
        research: {
          label: "Recherche et analyse",
          hint: "Chercheur, Analyste de données",
        },
        writing: {
          label: "Écriture et relecture",
          hint: "Rédacteur, Correcteur",
        },
        business: {
          label: "Business et stratégie",
          hint: "Conseiller business, Product Manager",
        },
        learning: {
          label: "Apprentissage et études",
          hint: "Tuteur, Questionneur socratique",
        },
        creative: {
          label: "Création et histoires",
          hint: "Conteur, Créatif",
        },
        health: {
          label: "Santé et carrière",
          hint: "Santé et bien-être, Coach carrière",
        },
        controversial: {
          label: "Libre pensée",
          hint: "Non censuré, Philosophe",
        },
        roleplay: {
          label: "Jeu de rôle et personnages",
          hint: "Jeu de rôle, Créateur de personnages",
        },
      },
    },
    input: {
      placeholder: "Envoyer un message...",
      imagePlaceholder: "Décrivez une image à générer...",
      audioPlaceholder: "Décrivez un son ou une musique à générer...",
      noPermission: "Vous n'avez pas l'autorisation de publier ici",
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
        "La synthèse vocale n'est pas disponible pour ce skill.",
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
    },
    toolsButton: {
      title: "Outils IA",
      tools: "Outils",
    },
  },
  chat: {
    category: "Chat",
    tags: {
      threads: "Fils",
      folders: "Dossiers",
      files: "Fichiers",
      messages: "Messages",
      characters: "Skills",
      memories: "Mémoires",
      favorites: "Favoris",
      credits: "Crédits",
      balance: "Solde",
      permissions: "Autorisations",
      hotkey: "Raccourci",
      cli: "CLI",
      speech: "Voix",
      sharing: "Partage",
      settings: "Paramètres",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "Privé",
        shared: "Partagé",
        public: "Public",
        incognito: "Incognito",
        background: "Arrière-plan",
        remote: "Distant",
      },
      foldersShort: {
        private: "Privé",
        shared: "Partagé",
        public: "Public",
        incognito: "Incognito",
        background: "Arrière-plan",
        remote: "Distant",
      },
    },
    enums: {
      role: {
        user: "Utilisateur",
        assistant: "Assistant",
        system: "Système",
        tool: "Outil",
        error: "Erreur",
      },
      threadStatus: {
        active: "Actif",
        archived: "Archivé",
        deleted: "Supprimé",
      },
      viewMode: {
        linear: "Linéaire",
        threaded: "Arborescent",
        flat: "À plat",
        debug: "Débogage",
      },
    },
    components: {
      sidebar: {
        login: "Connexion",
        logout: "Déconnexion",
        footer: {
          account: "Compte",
          profile: "Profil",
          balance: "Solde",
          buy: "Acheter",
          freeCreditsLeft: "Crédits gratuits",
        },
      },
      credits: {
        credit: "{{count}} crédit",
        credits: "{{count}} crédits",
      },
      navigation: {
        subscription: "Abonnement et crédits",
        referral: "Programme de parrainage",
        help: "Aide",
        about: "À propos",
      },
      confirmations: {
        deleteMessage: "Voulez-vous vraiment supprimer ce message ?",
      },
      welcomeTour: {
        authDialog: {
          title: "Débloquez les dossiers privés et partagés",
          description:
            "Inscrivez-vous ou connectez-vous pour accéder aux dossiers privés et partagés. Vos discussions se synchronisent sur tous vos appareils.",
          continueTour: "Continuer la visite",
          signUp: "S'inscrire / Se connecter",
        },
        buttons: {
          back: "Retour",
          close: "Fermer",
          last: "Terminer",
          next: "Suivant",
          skip: "Passer",
        },
        welcome: {
          title: "Bienvenue sur {{appName}} !",
          description:
            "Votre plateforme d'IA respectueuse de la vie privée : {{modelCount}} modèles, un filtrage de contenu que vous contrôlez, la liberté d'expression comme principe.",
          subtitle: "Petite visite guidée pour bien démarrer.",
        },
        aiCompanion: {
          title: "Choisissez votre compagnon IA",
          description:
            "Choisissez parmi {{modelCount}} modèles d'IA : grand public, open source et non censurés.",
          tip: "Cliquez pour ouvrir le sélecteur de modèles et choisir votre compagnon.",
        },
        rootFolders: {
          title: "Vos dossiers de discussion",
          description:
            "Rangez vos discussions dans différents dossiers, chacun avec ses propres règles de confidentialité :",
          private: {
            name: "Privé",
            suffix: "visible par vous seul",
          },
          incognito: {
            name: "Incognito",
            suffix: "aucun historique enregistré",
          },
          shared: {
            name: "Partagé",
            suffix: "collaborez avec d'autres",
          },
          public: {
            name: "Public",
            suffix: "visible par tous",
          },
        },
        privateFolder: {
          name: "Privé",
          suffix: "(dossier)",
          description:
            "Vos discussions privées ne sont visibles que par vous. Idéal pour les sujets sensibles.",
        },
        incognitoFolder: {
          name: "Incognito",
          suffix: "(dossier)",
          description:
            "Discutez sans enregistrer l'historique sur le serveur. Les messages sont stockés localement dans votre navigateur et y restent jusqu'à ce que vous les effaciez.",
          note: "Aucune donnée n'est stockée sur nos serveurs pendant les sessions incognito (les médias générés sont stockés temporairement pour des raisons techniques).",
        },
        sharedFolder: {
          name: "Partagé",
          suffix: "(dossier)",
          description:
            "Collaborez avec des personnes précises en leur donnant accès à ce dossier.",
        },
        publicFolder: {
          name: "Public",
          suffix: "(dossier)",
          description:
            "Partagez vos conversations IA avec le monde. Les autres peuvent consulter vos fils et en créer une copie.",
          note: "Tout ce qui est dans Public est visible par tous les utilisateurs et les moteurs de recherche.",
        },
        newChatButton: {
          title: "Démarrer une nouvelle discussion",
          description:
            "Cliquez ici pour lancer une nouvelle conversation dans n'importe quel dossier.",
        },
        sidebarLogin: {
          title: "Connectez-vous pour aller plus loin",
          description:
            "Créez un compte gratuit pour accéder aux dossiers Privé et Partagé, synchroniser votre historique sur tous vos appareils et laisser l'IA se souvenir de vous.",
          tip: "L'inscription est gratuite !",
        },
        subscriptionButton: {
          title: "Crédits et abonnement",
          description:
            "{{credits}} crédits par mois avec un abonnement à seulement {{price}} par mois. Les comptes gratuits reçoivent {{freeCredits}} crédits par mois, {{freeCreditsMax}} avec la newsletter.",
        },
        chatInput: {
          title: "Écrivez votre message",
          description:
            "Écrivez votre message ici puis appuyez sur Entrée ou cliquez sur Envoyer pour discuter avec votre compagnon IA.",
          tip: "Maj+Entrée pour aller à la ligne. Vous pouvez aussi joindre des fichiers et des images.",
        },
        voiceInput: {
          title: "Saisie vocale",
          description: "Parlez à votre compagnon IA avec votre micro :",
          options: {
            transcribe: "Transcrire la voix en texte",
            sendAudio: "Envoyer l'audio directement à l'IA",
            pauseResume: "Mettre en pause et reprendre l'enregistrement",
          },
        },
        callMode: {
          title: "Mode appel",
          description:
            "Activez le mode appel pour une conversation vocale mains libres, avec des réponses de l'IA en temps réel.",
          tip: "Idéal en déplacement ou si vous préférez parler plutôt que taper.",
        },
        complete: {
          title: "Vous êtes prêt !",
          description:
            "La visite est terminée ! Commencez à discuter avec votre compagnon IA.",
          help: "Besoin d'aide ? Cliquez à tout moment sur le point d'interrogation dans la barre latérale.",
        },
        authUnlocked: {
          unlocked: "Débloqué !",
          privateDescription:
            "Votre dossier privé est disponible. Toutes les discussions qu'il contient ne sont visibles que par vous.",
          privateNote:
            "Les discussions privées se synchronisent automatiquement sur tous vos appareils.",
          sharedDescription:
            "Votre dossier partagé est disponible. Invitez d'autres personnes à collaborer sur vos conversations IA.",
          sharedNote:
            "Vous décidez qui a accès à vos dossiers et fils partagés.",
        },
      },
    },
    selector: {
      loading: "Chargement...",
      best: "Meilleur choix",
      free: "GRATUIT",
      creditsSingle: "1 crédit",
      creditsExact: "{{cost}} crédits",
      modelOnly: "Modèle seul",
      editModelSettings: "Modifier les paramètres du modèle",
      editSettings: "Modifier les paramètres",
      switchSkill: "Changer de skill",
      editSkill: "Modifier le skill",
      delete: "Supprimer",
      autoSelectedModel: "SELON LES FILTRES",
      manualSelectedModel: "CHOIX MANUEL",
      intelligence: "Intelligence",
      contentFilter: "Contenu",
      maxPrice: "Prix max.",
      modelSelection: "Choix du modèle",
      autoModeDescription: "Le meilleur modèle est choisi selon vos filtres",
      manualModeDescription: "Choisissez un modèle précis à la main",
      autoMode: "Selon les filtres",
      manualMode: "Manuel",
      allModelsCount: "Les {{count}} modèles",
      filteredModelsCount: "{{count}} modèles correspondent aux filtres",
      showFiltered: "Afficher la sélection filtrée",
      showAllModels: "Afficher tous les modèles",
      showLess: "Afficher moins",
      showMore: "Afficher {{remaining}} de plus",
      showLegacyModels_one: "Afficher {{count}} ancien modèle",
      showLegacyModels_other: "Afficher {{count}} anciens modèles",
      noMatchingModels: "Aucun modèle correspondant",
      noModelsWarning: "Aucun modèle ne correspond à vos filtres",
      useOnce: "Utiliser une fois",
      saveAsDefault: "Ajouter aux favoris",
      deleteSetup: "Supprimer la configuration",
      content: "Rechercher du contenu...",
      characterSetup: "Configuration du skill",
      noResults: "Aucun résultat",
      add: "Ajouter aux favoris",
      added: "Ajouté",
      addNew: "Ajouter",
      searchSkills: "Rechercher des skills...",
      createCustom: "Créer sur mesure",
      customizeSettings: "Personnaliser les paramètres",
      requirements: {
        characterConflict: "Conflit avec les exigences du skill",
        tooLow: "trop bas",
        tooHigh: "trop haut",
        min: "min.",
        max: "max.",
      },
    },
    common: {
      newChat: "Nouvelle discussion",
      privateChats: "Discussions privées",
      search: "Rechercher",
      delete: "Supprimer",
      cancel: "Annuler",
      save: "Enregistrer",
      edit: "Modifier",
      settings: "Paramètres",
      close: "Fermer",
      toggleSidebar: "Afficher/masquer la barre latérale",
      lightMode: "Mode clair",
      darkMode: "Mode sombre",
      searchPlaceholder: "Rechercher...",
      searchThreadsPlaceholder: "Rechercher des fils...",
      searchResults: "Résultats de recherche",
      noChatsFound: "Aucune discussion trouvée",
      noThreadsFound: "Aucun fil trouvé",
      enableTTSAutoplay: "Activer la lecture vocale automatique",
      disableTTSAutoplay: "Désactiver la lecture vocale automatique",
      selector: {
        country: "Pays",
        language: "Langue",
      },
      copyButton: {
        copied: "Copié !",
        copyToClipboard: "Copier dans le presse-papiers",
        copyAsMarkdown: "Copier en Markdown",
        copyAsText: "Copier en texte",
      },
      assistantMessageActions: {
        cancelLoading: "Annuler le chargement",
        stopAudio: "Arrêter l'audio",
        playAudio: "Lire l'audio",
        answerAsAI: "Répondre en tant que modèle d'IA",
        deleteMessage: "Supprimer le message",
      },
      characterSelector: {
        placeholder: "Choisir un skill",
        addNewLabel: "Créer un skill personnalisé",
        grouping: {
          bySource: "Par source",
          byCategory: "Par catégorie",
          sourceLabels: {
            builtIn: "Intégrés",
            my: "Mes skills",
            community: "Communauté",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Créer un skill personnalisé",
          fields: {
            name: {
              label: "Nom",
              placeholder: "Saisissez le nom du skill",
            },
            icon: {
              label: "Icône (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Description",
              placeholder: "Brève description du skill",
            },
            systemPrompt: {
              label: "Prompt système",
              placeholder: "Définissez le comportement du skill...",
            },
            category: {
              label: "Catégorie",
            },
          },
          createCategory: "Créer une catégorie",
          cancel: "Annuler",
          create: "Créer le skill",
        },
        addCategoryDialog: {
          title: "Créer une catégorie",
          fields: {
            name: {
              label: "Nom de la catégorie",
              placeholder: "Saisissez le nom de la catégorie",
            },
            icon: {
              label: "Icône (emoji)",
              placeholder: "📁",
            },
          },
          cancel: "Annuler",
          create: "Créer la catégorie",
        },
      },
    },
    actions: {
      newChatInFolder: "Nouvelle discussion dans le dossier",
      newFolder: "Nouveau dossier",
      deleteFolder: "Supprimer le dossier",
      deleteMessage: "Supprimer le message",
      deleteThisMessage: "Supprimer ce message",
      searchEnabled: "Recherche activée",
      searchDisabled: "Recherche désactivée",
      answerAsAI: "Répondre en tant que modèle d'IA",
      retry: "Relancer avec un autre modèle/skill",
      branch: "Créer une branche à partir d'ici",
      editMessage: "Modifier le message",
      stopAudio: "Arrêter la lecture audio",
      playAudio: "Lire l'audio",
      copyContent: "Copier dans le presse-papiers",
    },
    dialogs: {
      searchAndCreate: "Rechercher et créer",
      deleteChat: "Supprimer la discussion « {{title}} » ?",
      deleteFolderConfirm:
        "Supprimer le dossier « {{name}} » et déplacer {{count}} discussion(s) vers Général ?",
    },
    views: {
      linearView: "Vue linéaire (style ChatGPT)",
      threadedView: "Vue arborescente (style Reddit/Discord)",
      flatView: "Vue à plat (style 4chan)",
      debugView: "Vue débogage (avec prompts système)",
    },

    screenshot: {
      capturing: "Capture...",
      capture: "Faire une capture d'écran",
      failed: "Échec de la capture d'écran",
      failedWithMessage: "Échec de la capture d'écran : {{message}}",
      tryAgain: "Échec de la capture d'écran. Réessayez.",
      noMessages:
        "Zone des messages introuvable. Vérifiez que la discussion contient des messages.",
      quotaExceeded:
        "Quota de stockage dépassé. La capture est trop volumineuse.",
      canvasError: "Impossible de convertir la capture en image.",
    },
    errors: {
      noResponse:
        "Aucune réponse de l'IA. La requête a abouti mais le contenu est vide. Réessayez.",
      noStream: "Impossible de diffuser la réponse : aucun lecteur disponible",
      saveFailed: "Impossible d'enregistrer la modification",
      branchFailed: "Impossible de créer la branche",
      retryFailed: "Impossible de relancer",
      answerFailed: "Impossible de répondre",
      deleteFailed: "Impossible de supprimer",
    },
    errorTypes: {
      streamError: "Erreur de flux",
    },
    hooks: {
      stt: {
        "endpoint-not-available": "Endpoint de transcription indisponible",
        "failed-to-start": "Impossible de démarrer l'enregistrement",
        "permission-denied":
          "Accès au micro bloqué. Autorisez le micro dans les paramètres de votre navigateur puis rechargez la page.",
        "permission-denied-ios":
          "Micro bloqué. Allez dans Réglages → Safari → Microphone et autorisez l'accès pour ce site.",
        "permission-denied-android":
          "Micro bloqué. Touchez l'icône de cadenas dans la barre d'adresse → Paramètres du site → Micro → Autoriser.",
        "permission-denied-mac":
          "Micro bloqué. Ouvrez Réglages Système → Confidentialité et sécurité → Microphone et activez votre navigateur.",
        "permission-denied-windows":
          "Micro bloqué. Ouvrez Paramètres → Confidentialité → Microphone et vérifiez que votre navigateur est autorisé.",
        "no-microphone":
          "Aucun micro détecté. Branchez un micro ou un casque et réessayez.",
        "microphone-in-use":
          "Votre micro est utilisé par une autre application. Fermez-la et réessayez.",
        "not-supported":
          "Votre navigateur ne permet pas l'accès au micro. Essayez Chrome, Firefox ou Safari.",
        "transcription-failed": "Impossible de transcrire l'audio",
        "audio-too-short":
          "Enregistrement trop court. Maintenez le micro, parlez distinctement, puis réessayez.",
      },
      tts: {
        "endpoint-not-available": "Endpoint de synthèse vocale indisponible",
        "failed-to-play": "Impossible de lire l'audio",
        "conversion-failed": "Échec de la synthèse vocale",
        "failed-to-generate": "Impossible de générer l'audio",
      },
    },
    post: {
      title: "Chat",
      description: "Interface de chat",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "Le modèle maison d'Uncensored.ai, et l'autre famille du non censuré. Le reste de ce niveau, ce sont des modèles grand public dont on a retiré les refus : même entraînement, même vision du monde. Celui-ci a la sienne. Uncensored.ai l'ajuste pour suivre les faits plutôt que la ligne officielle, « biaisé vers le réel » selon ses termes : attendez-vous à des positions politiques à contre-courant. Le choix pour la politique, les points de vue minoritaires et la fiction sombre ou taboue : pas de scènes adoucies, pas de morale, pas de retour forcé au consensus. Appelle des outils, contexte de 32K, texte uniquement. Expérimental, pas fait pour le code, et il énonce les thèses contestées aussi nettement que les faits établis : vérifiez ce qu'il affirme.",
        freedomgptLiberty:
          "Le modèle non censuré phare d'Age of AI, le chatbot de la liberté d'expression qui a lancé la catégorie. Bâti sur des poids ouverts, réglé pour des réponses franches, sans sermon. Rapide et vif d'esprit, contexte de 32K. Léger sur les outils, le code et l'analyse approfondie : Qwen 3.6 Plus Uncensored y est plus fort. Pour une autre vision du monde, et pas seulement moins de refus, prenez UncensoredLM.",
        gabAiArya:
          "L'assistant non censuré de Gab, positionné à droite par son éditeur et conçu pour répondre sans les garde-fous habituels. Intelligent, contexte de 131K, lit images et vidéos, appelle des outils. À choisir quand vous voulez délibérément cette orientation ; UncensoredLM est l'autre modèle ici doté de sa propre vision du monde. Plus faible en code, et son modèle de base n'est pas divulgué.",
        gemini31ProPreviewCustomTools:
          "La préversion « custom tools » de Gemini 3.1 Pro, réglée pour appeler les outils que vous définissez au lieu de se rabattre sur bash. Pensée pour les agents de code et les workflows multi-outils, avec un contexte de 1M et des entrées texte, image, vidéo et audio. Une préversion. Gemini 4 Argon est le choix plus récent de classe Pro, à un prix proche.",
        gemini31FlashImagePreview:
          "Gemini 3.1 Flash Image de Google, encore en préversion. Génère et retouche des images directement dans le chat, texte et images dans la même réponse. Le modèle d'image le moins cher du catalogue. Filtres grand public, pas d'appels d'outils, contexte de 64K. Pour des prompts complexes et un texte plus net dans l'image, Nano Banana Pro coûte plus et donne plus. Ancien : Nano Banana 2.1 le remplace, pour environ la moitié du prix par image.",
        gemini31FlashLitePreview:
          "Le modèle économique à gros volume de Google, encore en préversion : traduction, classement, extraction et chat rapide sur un contexte de 1M, avec des entrées texte, image, vidéo et audio. Bon marché et rapide, pas conçu pour le raisonnement difficile. Il coûte toujours moins que son successeur, Gemini 3.5 Flash Lite.",
        gemini3Pro:
          "Google Gemini 3 Pro. Modèle multimodal avancé, grande fenêtre de contexte et raisonnement puissant.",
        gemini35Flash:
          "Le modèle Flash de Google qui vise un code et un raisonnement proches du niveau Pro, avec des niveaux de réflexion réglables, un contexte de 1M et des entrées texte, image, vidéo et audio. Solide, mais Gemini 3.8 Flash est plus récent et coûte environ moitié moins : passez-y.",
        gemini3Flash:
          "Le premier Gemini 3 Flash de Google : rapide et compétent en code comme en raisonnement courant, avec un contexte de 1M et des entrées texte, image, vidéo et audio. Toujours un bon rapport qualité-prix, et moins cher que son successeur. Gemini 3.8 Flash est l'option plus récente si vous voulez la dernière version.",
        deepseekV32:
          "Le modèle à poids ouverts de DeepSeek de fin 2025, avec une attention clairsemée qui rend le travail sur long contexte moins coûteux. Un mélange d'experts de 671B, bon en code et en analyse pour très peu d'argent, texte uniquement. DeepSeek V4.1 Flash est plus récent et coûte encore moins.",
        deepseekV4Pro:
          "Le modèle phare à poids ouverts de DeepSeek : un mélange d'experts de 1,6T paramètres dont 49B actifs, sous licence MIT. Raisonnement profond, code sérieux, analyse de bases de code entières et travail d'agent en plusieurs étapes, contexte de 1M, appelle des outils. Texte uniquement. Une fraction du prix de Claude Opus 5.5. Pour le quotidien rapide et bon marché, DeepSeek V4.1 Flash est son frère.",
        deepseekV4Flash:
          "Le modèle Flash de DeepSeek, un mélange d'experts de 284B : contexte de 1M, rapide, fort en code, coût quasi nul par message. Texte uniquement. Son successeur DeepSeek V4.1 Flash coûte pareil : passez-y, sauf si vous avez besoin de cette version précise.",
        gpt55:
          "L'ancien modèle généraliste de pointe d'OpenAI : raisonnement, code et analyse solides sur un contexte de 1M, avec entrées texte et image. Toujours capable, mais au prix premium, et GPT-6.1 Sol fait désormais le même travail pour bien moins. Point faible : le jeu de rôle.",
        gpt55Pro:
          "Le niveau Pro à raisonnement étendu de GPT-5.5, conçu pour dépenser bien plus de calcul sur des problèmes difficiles et à fort enjeu. L'un des modèles les plus chers du catalogue, rentable seulement quand une mauvaise réponse coûte plus que le message. GPT-6 Astra est le choix plus récent, pour environ un tiers du prix.",
        gpt54Pro:
          "La variante Pro à calcul maximal de GPT-5.4, pour le raisonnement difficile, la recherche et l'analyse à fort enjeu sur un contexte de 1M. Lent, et parmi les modèles les plus chers ici. GPT-6 Astra couvre le même terrain pour environ un tiers du prix.",
        gpt54:
          "Le modèle OpenAI qui a intégré un code de niveau Codex à la gamme GPT principale, avec un contexte de 1M et l'entrée image. Solide pour les longs documents, le code et l'analyse. GPT-6.1 Sol est plus récent, classé un niveau au-dessus et moins cher par message : peu de raisons de rester.",
        gpt53Codex:
          "Le spécialiste du code agentique d'OpenAI : longues sessions de développement riches en outils, refactorisations et débogage, avec un contexte de 400K. Fort en code, faible en écriture créative et en jeu de rôle. GPT-6.1 Sol gère désormais le code à un prix similaire, et fait bien plus.",
        gpt53Chat:
          "GPT-5.3 Chat. Le modèle conversationnel de ChatGPT mis à jour : réponses plus justes et mieux contextualisées, avec nettement moins de refus et de mises en garde inutiles.",
        gpt52Pro:
          "GPT-5.2 avec raisonnement étendu pour les problèmes les plus durs : recherche approfondie, maths épineuses, revue de code minutieuse. Lent et très cher. GPT-6 Astra est le choix actuel de classe Pro et coûte bien moins de la moitié.",
        gpt52:
          "Le cheval de trait d'OpenAI de fin 2025 pour le travail professionnel : code, longs documents et analyse structurée, avec un contexte de 400K et l'entrée image. Fiable, mais ce n'est plus le meilleur rapport qualité-prix. GPT-6.1 Sol coûte à peu près pareil et il est plus récent.",
        gpt52_chat:
          "La variante rapide de GPT-5.2, façon ChatGPT : réponses conversationnelles sans longue réflexion, contexte de 128K. Bien pour le chat quotidien et les brouillons. Moins de contexte que ses frères, et GPT-6.1 Terra fait désormais ce travail pour environ moitié prix.",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B. Grand modèle de langage non censuré basé sur Mistral.",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B. Grand modèle de langage non censuré basé sur Llama 3.",
        veniceUncensored:
          "Le modèle non censuré maison de Venice, Dolphin Mistral 24B en édition Venice. L'un des taux de refus les plus bas qui soient : fiction, conversation libre sans filtre. Lit les images, contexte de 128K, bon marché. Un fine-tune de décensure : les refus ont disparu, mais la vision du monde de Mistral reste là sur la politique et les scènes les plus sombres. Pour une autre vision du monde, prenez UncensoredLM. Faible en code et en analyse poussée. Pour ça, prenez Qwen 3.6 Plus Uncensored.",
        veniceUncensoredRoleplay:
          "Le modèle 24B de Venice réglé pour le jeu de rôle, refus retirés à l'entraînement. Les personnages gardent leur voix sur de longues campagnes, sans pause moralisatrice en pleine histoire. Lit les images, contexte de 128K. Refus retirés, vision du monde de base conservée : pour le contenu le plus sombre et le plus tabou, UncensoredLM va plus loin ; celui-ci gagne sur les longues campagnes et l'entrée image. Un conteur, pas un assistant : évitez-le pour l'analyse ou le code.",
        gemma4Uncensored:
          "Le mélange d'experts Gemma 4 26B de Google, filtre retiré, servi par Venice. Rapide, bon marché, lit les images, appelle des outils, contexte de 256K. Refus supprimés, entraînement et vision du monde de Google conservés : sur les sujets brûlants, il répond, mais avec le cadrage de Google. Pour un raisonnement plus poussé sans refus, GLM 5.3 Flash Uncensored coûte un peu plus et va plus loin.",
        qwen36PlusUncensored:
          "Le modèle de raisonnement Qwen 3.6 Plus d'Alibaba, refus retirés, servi par Venice. L'un des meilleurs codeurs et analystes de la gamme non censurée. Lit les images, appelle des outils, contexte de 256K. Il ne refuse plus, mais l'entraînement et la vision du monde de Qwen restent ; pour un autre regard sur la politique, UncensoredLM a le sien. Plus cher que les modèles Flash. GLM 5.3 Uncensored est l'autre poids lourd, avec un contexte de 1M mais texte uniquement.",
        glm47FlashHeretic:
          "Un GLM 4.7 Flash abliteré : le comportement de refus a été retiré, il répond au lieu de faire la leçon. Quelques centimes par message, rapide, appelle des outils, bien pour le chat sans filtre et l'écriture créative. Même entraînement, même vision du monde que le GLM de base : il arrête juste d'esquiver. Faible en analyse approfondie. GLM 5.3 Flash Uncensored est le choix non censuré plus récent et plus intelligent, pour un peu plus cher.",
        glm53Abliterated:
          "GLM 5.3 complet, refus retirés directement des poids par Abliteration.ai. Raisonnement de pointe, outils, contexte de 1M. Le poids lourd. Aucun refus, mais l'entraînement et le cadrage du GLM de base demeurent.",
        deepseekV41FlashAbliterated:
          "DeepSeek V4.1 Flash sans refus, par Abliteration.ai. MoE de 552B, raisonne en profondeur, lit les images, appelle des outils. Contexte de 1M. Il ne dit plus non ; le cadrage propre à DeepSeek reste.",
        mimoV26FlashAbliterated:
          "MiMo V2.6 Flash de Xiaomi, direction de refus ablatée. Rapide, lit les images, appelle des outils, contexte de 1M. Bien pour le travail sans filtre à gros volume, mais il sacrifie la profondeur à la vitesse, et la vision du monde du modèle de base reste. Coûte plus du double de GLM 5.3 Flash Uncensored, qui couvre un terrain similaire.",
        glm53Uncensored:
          "Le modèle de raisonnement GLM 5.3 complet de Z.AI, refus retirés. Le poids lourd de la gamme non censurée : code, écriture longue, analyse et outils, contexte de 1M. Refus retirés, vision du monde intacte : en politique, il répond avec le cadrage du GLM de base. Pour des positions politiques à contre-courant, prenez UncensoredLM. Texte uniquement, plus lent que les modèles Flash, encore expérimental. GLM 5.3 Flash Uncensored est l'option quotidienne, moins chère et plus rapide.",
        glm53FlashUncensored:
          "GLM 5.3 Flash de Z.AI, refus retirés : un mélange d'experts de 320B. Rapide, bon marché, lit les images, appelle des outils, contexte de 1M. Le modèle du quotidien pour le travail sans filtre. Il n'esquive plus, mais l'entraînement et la vision du monde du GLM de base restent, politique comprise ; UncensoredLM est celui qui a une autre vision du monde. Pour le raisonnement le plus dur, passez au GLM 5.3 Uncensored complet.",
        veniceLustifyV8:
          "Un checkpoint SDXL réglé pour l'imagerie adulte photoréaliste, servi par Venice.ai. Non censuré : pas de flou, pas de refus. Parmi les modèles d'image les moins chers que nous proposons. Fait pour les corps et la peau, pas pour le texte dans l'image, les scènes complexes ou les styles artistiques ; Chroma a plus de registre artistique.",
        veniceChroma:
          "Un modèle à poids ouverts bâti sur FLUX.1 schnell et réentraîné sans filtrage de contenu, servi par Venice.ai. Gère les longs prompts et une large gamme de styles artistiques, contenu explicite compris. Bon marché par image. Moins spécialisé dans la nudité photoréaliste que Lustify v8, et texte en entrée uniquement : pour retravailler une image existante, utilisez Qwen Edit Uncensored.",
        veniceQwenEdit:
          "Retouche d'image non censurée bâtie sur le modèle Qwen image-edit d'Alibaba, servie par Venice.ai. Donnez-lui une image de référence et une consigne : remplacer des éléments, changer le style, les tenues, retravailler la scène. Pas de flou, pas de refus. Coûte plus que Chroma ou Lustify v8, qui génèrent seulement à partir de texte.",
        veniceFireredImageEdit:
          "Un éditeur d'image piloté par prompt, servi par Venice.ai. Décrivez le changement : il modifie exactement cela et laisse le reste de l'image intact. Niveau Non censuré, sans refus, mais pas étiqueté pour le contenu explicite comme l'est Qwen Edit Uncensored. Même prix que Qwen Edit ; sur les retouches difficiles, essayez les deux.",
        claudeOpus45:
          "L'Opus de novembre 2025 d'Anthropic, l'un des meilleurs modèles de code et d'agent de son époque, et le premier Opus à prix nettement réduit. Excellent en rédaction soignée et en code complexe, contexte de 200K. Prudent sur les sujets sensibles. Claude Opus 5.5 est plus récent et moins cher.",
        claudeOpus46:
          "L'Opus de février 2026 d'Anthropic, le premier Opus avec une fenêtre de contexte de 1M. Fort en code agentique au long cours, en analyse approfondie et en rédaction soignée. Prix premium, filtres grand public, prudent sur les sujets sensibles. Claude Opus 5.5 est plus récent et moins cher.",
        claudeOpus47:
          "Une version d'Opus de 2026, entre la 4.6 et la 4.8 : raisonnement profond, code complexe et écriture longue sur un contexte de 1M. Prix premium, prudent sur les sujets sensibles. Claude Opus 5.5 le remplace et coûte moins par message.",
        claudeOpus48:
          "La dernière version d'Opus 4, conçue pour le travail agentique long, le code complexe et les sorties très longues sur un contexte de 1M, avec l'entrée image. Premium, filtres grand public, prudent sur les sujets sensibles. Claude Opus 5.5 est plus récent et moins cher.",
        claudeSonnet46:
          "Le Sonnet de début 2026 d'Anthropic, en progrès sur la 4.5 pour le code, les agents et le travail bureautique, avec un contexte de 1M. Filtres grand public, prudent sur les sujets sensibles. Claude Sonnet 5.5 le remplace et coûte moins par message.",
        claudeHaiku45:
          "Le petit modèle d'Anthropic d'octobre 2025 : rapide, bon en code courant et en lecture d'images, contexte de 200K. Filtres grand public, prudent sur les sujets sensibles. Claude Haiku 5.5 coûte maintenant environ dix fois moins : le changement s'impose.",
        glm5_1:
          "Le modèle de code de Z.AI conçu pour le travail au long cours, présenté comme capable de s'acharner des heures sur une seule tâche. Fort en planification, en code et en exécutions d'agent en plusieurs étapes, contexte de 200K, texte uniquement, niveau de contenu Ouvert. GLM-5.3 est plus récent et coûte une fraction du prix, mais se situe un niveau en dessous ; Kimi K3 est le choix Ouvert actuel le plus fort.",
        glm5: "Le modèle phare à poids ouverts de Z.AI de début 2026, conçu pour la conception de systèmes et les longs workflows d'agent. Raisonnement et code solides, niveau de contenu Ouvert, contexte de 200K, texte uniquement. GLM-5.3 est plus récent et bien moins cher, mais un niveau en dessous en intelligence ; Kimi K3 est l'alternative ouverte la plus forte.",
        glm5Turbo:
          "Un GLM-5 plus rapide, réglé pour les boucles d'agent : inférence rapide, découpage propre des tâches et exécutions longues stables. Bien pour l'automatisation riche en outils, contexte de 200K, texte uniquement, niveau de contenu Ouvert. GLM-5.3 fait aujourd'hui un travail similaire pour une fraction du prix.",
        glm46:
          "La version de septembre 2025 de Z.AI, qui a porté le contexte à 200K et amélioré le code et l'usage en agent. Toujours un polyvalent bilingue correct, niveau de contenu Ouvert, texte uniquement. GLM-5.3 est plus récent et moins cher.",
        glm47:
          "La version de décembre 2025 de Z.AI, un polyvalent bilingue chinois-anglais solide, meilleur en code et en raisonnement que la 4.6. Convient au chat, à l'analyse et aux tâches d'agent, contexte de 200K, texte uniquement, niveau de contenu Ouvert. GLM-5.3 est plus récent, pour environ un quart du prix.",
        glm47Flash:
          "Le petit GLM 4.7 rapide, l'un des modèles les moins chers ici. Bien pour le chat rapide, les appels d'outils simples et les traitements de texte en masse, contexte de 200K. Léger sur le raisonnement profond. GLM-5.3 Flash est plus récent mais coûte environ le double.",
        kimiK2:
          "Le modèle à poids ouverts de Moonshot AI de juillet 2025, un mélange d'experts de 1T paramètres qui s'est fait un nom sur l'usage agentique des outils et le code. Rapide, niveau de contenu Ouvert, contexte de 262K, texte uniquement. Pas de mode réflexion. Kimi K3 est le nouveau modèle phare, pour environ le double du prix.",
        kimiK2_5:
          "Le Kimi de janvier 2026 de Moonshot, nativement multimodal avec l'entrée image. Fort en code sur long contexte, en conversion de captures d'écran en code et en écriture créative, avec des filtres de niveau Ouvert et un contexte de 262K. Kimi K3 est plus récent mais coûte environ le double.",
        kimiK2_6:
          "Kimi K2.6 de Moonshot, axé sur le code au long cours, la création d'interfaces à partir de prompts ou de captures d'écran, et l'exécution de nombreux sous-agents en parallèle. Rapide et intelligent, entrée image, contexte de 262K, niveau de contenu Ouvert. Kimi K3 est plus récent, à un prix plus élevé.",
        claudeSonnet45:
          "Le Sonnet de septembre 2025 d'Anthropic, réputé pour son code solide et ses longues sessions d'agent autonome. Toujours un bon codeur et rédacteur, avec un contexte de 1M ici. Prudent sur les sujets sensibles, faible en jeu de rôle. Claude Sonnet 5.5 est plus récent et moins cher par message.",
        claudeAgentSonnet:
          "Claude Agent Sonnet. Agent IA autonome propulsé par Claude Sonnet via l'Agent SDK d'Anthropic. Exécute des outils de lui-même, raisonnement intégré.",
        claudeAgentHaiku:
          "Claude Agent Haiku. Agent IA autonome et rapide, propulsé par Claude Haiku via l'Agent SDK d'Anthropic. Optimisé pour la vitesse, avec exécution d'outils.",
        claudeAgentOpus:
          "Claude Agent Opus. L'agent IA autonome le plus puissant, propulsé par Claude Opus via l'Agent SDK d'Anthropic. Intelligence maximale, avec exécution d'outils.",
        grok4:
          "Le modèle phare de xAI de juillet 2025, un modèle de raisonnement qui réfléchit toujours avant de répondre. Fort en maths, en sciences et en analyse, avec des filtres de contenu plus légers que la plupart des modèles grand public. Plus lent que les modèles de chat classiques. Grok 4.7 est le Grok actuel, à un prix plus élevé.",
        grok4Fast:
          "L'ancien Grok de xAI réglé pour la vitesse. xAI a supprimé le niveau Fast bon marché : ce nom tourne désormais sur Grok 4.3, aux prix de Grok 4.3. Lit les images, appelle des outils, contexte de 1M, politique de contenu Ouvert. Grok 4.7 le remplace et raisonne bien plus en profondeur pour environ le double du prix en sortie. Pour du chat rapide et bon marché, MiniMax M3.1 Flash ou DeepSeek V4.1 Flash coûtent une fraction.",
        grok43:
          "Une version ultérieure de Grok 4 avec raisonnement permanent et contexte de 1M, pensée pour les workflows d'agent et la recherche approfondie. Niveau de contenu Ouvert, appelle des outils, lit les images. Même prix que Grok 4 et moins cher que Grok 4.7, le choix plus récent si vous voulez la dernière version.",
        grok420Beta:
          "L'ancien modèle phare de xAI, avec une fenêtre de contexte de 2M, l'appel d'outils agentique et l'entrée image. Bien pour les documents énormes et les longues exécutions d'agent, sous des filtres de niveau Ouvert. Grok 4.7 est plus récent mais coûte plus.",
        gpt5Pro:
          "GPT-5 avec raisonnement étendu, la réponse d'OpenAI en 2025 aux questions les plus dures. Rigoureux, mais lent et très cher pour une génération désormais ancienne. GPT-6 Astra est le choix moderne de niveau Pro, et coûte moins.",
        gpt5Codex:
          "GPT-5 Codex. Le modèle de code spécialisé d'OpenAI, aux capacités de programmation et techniques exceptionnelles.",
        gpt51Codex:
          "GPT-5.1 réglé pour le code agentique dans Codex d'OpenAI : longues boucles modifier, exécuter, corriger sur de vrais dépôts, avec un contexte de 400K. Rapport correct pour le code à ce prix. Moins adapté au chat libre ou à l'écriture, et le plus récent GPT-6.1 Sol l'a dépassé.",
        gpt51:
          "La mise à jour de novembre 2025 de GPT-5 par OpenAI, avec un raisonnement adaptatif qui ne réfléchit plus longtemps que sur les questions difficiles, et un ton plus chaleureux. Toujours un généraliste sensé, avec un contexte de 400K et l'entrée image. GPT-6.1 Sol est plus récent et plus affûté, pour un peu plus par message.",
        gpt5: "Le modèle phare d'OpenAI d'août 2025, qui a réuni réponses rapides et raisonnement profond dans un seul modèle. Toujours un polyvalent capable pour le chat, l'écriture et le code, avec un contexte de 400K et l'entrée image. GPT-6.1 Sol est le choix OpenAI actuel : plus récent et plus fort, pour un peu plus par message.",
        gpt54Mini:
          "Le petit GPT-5.4 : bon raisonnement, code et usage d'outils à prix réduit, avec un contexte de 400K et l'entrée image. Convient au chat à gros volume et au travail de sous-agent. GPT-6 Luna est plus récent et bien moins cher par message, mais réglé davantage pour la vitesse que pour la profondeur.",
        gpt54Nano:
          "Le plus petit GPT-5.4 d'OpenAI, fait pour la classification, l'extraction de données et les appels rapides de sous-agents. Bon marché, rapide, appelle des outils, lit les images. Trop superficiel pour une vraie analyse. GPT-6 Luna est le choix économique plus récent, et coûte encore moins.",
        gpt5Mini:
          "Le GPT-5 compact pour les tâches rapides du quotidien : réponses courtes, résumés, appels d'outils simples, contexte de 400K. Bon marché et rapide, mais mince sur l'analyse approfondie. GPT-6 Luna est plus récent et coûte environ un tiers du prix.",
        gpt5Nano:
          "Le plus petit GPT-5 d'OpenAI, toujours l'un des modèles les moins chers ici. Convient à la classification, à l'étiquetage et aux réponses courtes en volume. Pas pour le code ni la vraie analyse. GPT-6 Luna est le modèle économique plus récent, à un prix légèrement supérieur.",
        gptOss120b:
          "Le modèle à poids ouverts d'OpenAI : 117B paramètres au total, mélange d'experts, sous licence Apache 2.0. Un raisonneur et codeur capable pour quelques centimes, appelle des outils, contexte de 131K. Texte uniquement. Filtres plus légers que la gamme GPT-6 d'OpenAI, mais pas non censuré. GLM-5.3 coûte à peu près pareil et ajoute un contexte de 1M.",
        kimiK2Thinking:
          "La version raisonnement de Kimi K2, de novembre 2025, conçue pour continuer à réfléchir sur des centaines d'appels d'outils enchaînés sans perdre le fil. Bien pour la recherche et le travail d'agent en plusieurs étapes à petit prix, niveau de contenu Ouvert. Texte uniquement, et plus lent que K2 standard. Kimi K3 est le choix plus récent.",
        minimaxM27:
          "Le modèle de MiniMax axé agents pour le travail concret : débogage, modélisation financière, génération de documents et exécutions multi-agents. Intelligent et bon marché, contexte de 196K, texte uniquement, niveau de contenu Ouvert. MiniMax M3.1 Flash le remplace : plus fort, multimodal, contexte de 1M et moins cher.",
        mimoV2Pro:
          "Le modèle phare de la gamme MiMo V2 de Xiaomi, conçu pour l'orchestration d'agents et les longs workflows d'ingénierie, avec un contexte de 1M. Raisonnement et code solides à petit prix, texte uniquement, niveau de contenu Ouvert. MiMo V2.6 Pro est plus récent et un peu moins cher.",
        glm45Air:
          "Le GLM 4.5 léger, un mélange d'experts de 106B avec seulement 12B actifs : des réponses rapides et bon marché. Convient au chat décontracté et aux tâches simples, contexte de 128K, texte uniquement. Daté sur le raisonnement. GLM-5.3 Flash est plus récent et moins cher.",
        glm45v:
          "Le modèle de vision de Z.AI bâti sur GLM-4.5-Air, un mélange d'experts de 106B. Lit captures d'écran, graphiques et photos, discute et appelle des outils. Seulement 64K de contexte et un raisonnement daté. GLM-5.3 Flash est le choix Z.AI plus récent et moins cher.",
        geminiFlash25Lite:
          "Le Gemini le moins cher de 2025 chez Google : quelques centimes par message, contexte de 1M, entrées texte, image, vidéo et audio. Excellent pour l'étiquetage en masse, la traduction et les réponses courtes, superficiel en raisonnement. Gemini 3.5 Flash Lite est plus récent mais coûte près de quatre fois plus : celui-ci garde sa place.",
        geminiFlash25Flash:
          "Le Flash à raisonnement hybride de Google de 2025, avec un budget de réflexion réglable, un contexte de 1M et des entrées texte, image, vidéo et audio. Toujours une option rapide et bon marché pour les résumés et le chat quotidien. Gemini 3.8 Flash est plus récent et plus intelligent, mais coûte environ le double.",
        geminiFlash25Pro:
          "Le modèle à réflexion de Google de 2025, avec un contexte de 1M, fort en analyse de longs documents et en code pour son époque. Désormais nettement une génération en retard. Gemini 4 Argon est le choix actuel de classe Pro, à un prix un peu plus élevé.",
        deepseekV31:
          "L'hybride de DeepSeek d'août 2025, qui bascule entre réponses rapides et réflexion pas à pas dans un seul modèle. Un codeur capable et bon marché, bâti sur un mélange d'experts à poids ouverts de 671B, texte uniquement. DeepSeek V4.1 Flash est plus récent, pour environ un tiers du prix.",
        deepseekR1:
          "Le modèle de raisonnement à poids ouverts de janvier 2025 qui a prouvé qu'une chaîne de pensée visible pouvait coûter peu. Toujours solide en maths et en logique, mais lent, verbeux et réticent sur les sujets politiques que la Chine juge sensibles. DeepSeek V4.1 Flash est plus récent et coûte une fraction du prix.",
        qwen3235bFree:
          "Qwen3 235B d'Alibaba, à poids ouverts, un mélange d'experts avec 22B paramètres actifs. Code et raisonnement solides pour un petit budget, appelle des outils, contexte de 131K. Texte uniquement et une génération en retard : Qwen 3.8 Flash est plus récent, lit les images et coûte à peu près pareil.",
        deepseekR1Distill:
          "Une petite distillation de DeepSeek R1 basée sur Qwen, pour du raisonnement pas à pas bon marché, texte uniquement, contexte court de 32K. Plus aucun fournisseur ne le sert. DeepSeek V4.1 Flash le remplace : plus intelligent, capable de vision, contexte de 1M, et il ne coûte presque rien.",
        qwen257b:
          "Le petit modèle 7B à poids ouverts d'Alibaba, de 2024. Bon marché et rapide pour le chat simple, les reformulations courtes et la traduction basique, contexte de 32K. Faible en code et en analyse selon les standards actuels. Qwen 3.8 Flash est le choix Alibaba plus récent, plus intelligent pour un peu plus cher.",
        dallE3:
          "DALL-E 3. Le modèle de génération d'images d'OpenAI : des images détaillées et de haute qualité à partir de prompts texte.",
        gptImage1:
          "GPT-Image-1. Le modèle de génération d'images rapide et abordable d'OpenAI.",
        fluxSchnell:
          "Flux Schnell. Le modèle de génération d'images rapide de Black Forest Labs, optimisé pour la vitesse.",
        fluxPro:
          "Le cheval de trait texte vers image éprouvé de Black Forest Labs, issu de la génération FLUX.1. Composition propre, prompts suivis fidèlement, résultats rapides. Texte en entrée uniquement, pas de retouche à partir d'une image de référence. FLUX.2 Pro coûte environ moitié moins et accepte des images de référence : celui-ci convient surtout aux prompts déjà réglés pour lui.",
        flux2Max:
          "Le haut de gamme de la famille FLUX.2 de Black Forest Labs. Génère à partir de texte ou retouche à partir d'images de référence, avec le plus de détail et de cohérence de la gamme. Prix premium, plusieurs fois celui de FLUX.2 Pro. Gardez-le pour les visuels phares et les retouches multi-références délicates ; au quotidien, FLUX.2 Pro fait l'essentiel pour moins cher. Ancien : FLUX.3 le remplace, plus net et moins cher par image.",
        flux2Klein4b:
          "FLUX.2 Klein 4B. Le modèle d'image le plus rapide et le plus économique de Black Forest Labs, optimisé pour les usages à haut débit. Ancien : FLUX.3 Klein le remplace.",
        riverflowV2Pro:
          "Riverflow V2 Pro. Le modèle de génération d'images le plus puissant de Sourceful, avec un contrôle de premier ordre et un rendu du texte parfait.",
        riverflowV2Fast:
          "Riverflow V2 Fast. Le modèle de génération d'images le plus rapide de Sourceful, optimisé pour la production et les workflows sensibles à la latence.",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview. La variante de préversion la plus puissante de Sourceful, un modèle unifié texte vers image et image vers image. Ancien : la préversion a été retirée en amont ; utilisez Riverflow V2 Pro.",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview. La variante de préversion standard de Sourceful, un modèle unifié texte vers image et image vers image qui surpasse la famille Riverflow 1. Ancien : la préversion a été retirée en amont ; utilisez Riverflow V2 Pro.",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview. La variante de préversion la plus rapide de Sourceful, un modèle unifié texte vers image et image vers image au prix le plus bas. Ancien : la préversion a été retirée en amont ; utilisez Riverflow V2 Fast.",
        flux2Flex:
          "FLUX.2 Flex. Le modèle d'image de Black Forest Labs qui excelle dans le rendu de texte complexe, la typographie et la retouche multi-références, dans une architecture unifiée.",
        flux2Pro:
          "Le cheval de trait FLUX.2 de Black Forest Labs pour générer et retoucher. Accepte du texte et des images de référence, garde personnages et produits cohérents d'un plan à l'autre, gère bien les longs prompts. Prix intermédiaire. Niveau Ouvert : filtres plus légers qu'Imagen 4, mais pas de contenu explicite ; Chroma ou Lustify v8 s'en chargent. Passez à FLUX.2 Max seulement quand le détail compte vraiment.",
        gemini3ProImagePreview:
          "Gemini 3 Pro Image de Google, en préversion. Le Nano Banana le plus fort : suit de plus près les prompts complexes, rend un texte lisible dans l'image et retouche les photos que vous envoyez. Filtres grand public, pas d'appels d'outils, contexte de 64K. Plusieurs fois le prix de Nano Banana : gardez-le pour le travail où la qualité d'image compte.",
        gpt5ImageMini:
          "GPT-5 Image Mini d'OpenAI : les capacités de langage de GPT-5 Mini, plus la génération et la retouche d'images dans le même chat. Lit les images, contexte de 400K. Filtres grand public, pas d'appels d'outils. Plus cher que Nano Banana et proche de Nano Banana Pro : comparez les deux sur votre propre prompt. Ancien : OpenRouter le retire le 1er décembre 2026. Utilisez Nano Banana 2.1 dans le chat, ou GPT Image 2.6 Flare pour la qualité OpenAI.",
        gpt5Image:
          "GPT-5 associé au générateur d'images d'OpenAI : discutez, puis créez ou retouchez des images dans la même conversation, avec l'entrée image. Bien pour itérer sur des visuels en langage courant. Pas d'appels d'outils, et cher par message. GPT-5 Image Mini est l'option moins chère ; Nano Banana Pro mérite la comparaison.",
        gpt54Image2:
          "Le raisonnement de GPT-5.4 combiné à la génération GPT Image 2 : un même chat passe de l'analyse ou du code à des images finies. Lit aussi les images. Pas d'appels d'outils, et cher. GPT-5 Image Mini coûte bien moins ; Nano Banana et Nano Banana Pro sont les autres choix d'image actuels.",
        seedream45:
          "Le modèle d'image de ByteDance qui génère et retouche en un. Fort en portraits, en cohérence d'un sujet et en fusion de plusieurs images d'entrée dans une seule scène. Prix intermédiaire, proche de FLUX.2 Pro. Niveau Ouvert : filtres plus légers que le grand public, pas de contenu explicite. Un bon deuxième avis quand FLUX.2 Pro rate le rendu voulu. Ancien : Seedream 5.5 le remplace, pour moitié prix.",
        sdxl: "Stable Diffusion XL. Le modèle ouvert de génération d'images de haute qualité de Stability AI.",
        cassetteMusic:
          "CassetteAI Music. Génération rapide de musique à partir de texte sur Fal.ai, avec des morceaux jusqu'à trois minutes.",
        musicgenStereo:
          "MusicGen de Meta, open source, en version stéréo. De la musique instrumentale à partir d'un prompt texte : genre, ambiance, instruments. Pas de voix ni de paroles. Bon marché. Bien pour les fonds sonores et les boucles ; pour des chansons avec voix, utilisez ElevenLabs Music ou Sonauto Song.",
        stableAudio:
          "Stable Audio. Le modèle de génération de musique et d'audio de Stability AI, pour des extraits de haute qualité.",
        udioV2:
          "Udio v2. Génération musicale IA de haute qualité, avec voix et production complète.",
        modelsLabMusicGen:
          "Le modèle texte vers musique maison de ModelsLab, avec sortie MP3, WAV ou FLAC. Des morceaux pilotés par prompt pour la musique de fond et les jingles. Coûte plusieurs fois plus que Lyria 3 ou MusicGen Stereo, et son modèle sous-jacent n'est pas documenté. Essayez d'abord Lyria 3 : meilleure qualité, prix plus bas.",
        modelsLabElevenlabsMusic:
          "Le modèle musical d'ElevenLabs. Des morceaux complets avec voix et paroles en plusieurs langues, ou des instrumentaux, guidés par votre prompt. Filtres de contenu grand public. Haut de la fourchette de prix pour la musique. Fort pour des chansons soignées, prêtes pour la radio ; pour des chansons complètes avec voix moins chères, essayez Sonauto Song.",
        modelsLabSonautoSong:
          "Le générateur de chansons de Sonauto. Des chansons complètes avec voix et paroles dans de nombreux genres, à petit prix pour des morceaux entiers. Niveau Ouvert, filtres plus légers qu'ElevenLabs. La finition de production varie ; pour des mixages plus propres, payez plus pour ElevenLabs Music ou Lyria 3 Pro Preview.",
        modelsLabLyria3:
          "Lyria 3 de Google. Des morceaux originaux d'environ 30 secondes à partir d'un prompt texte, avec une production de haute qualité. Très bon marché pour ce qu'il livre. Grand public : les filtres de Google s'appliquent. Trop court pour des chansons entières ; Lyria 3 Pro Preview gère la durée complète.",
        modelsLabCogVideoX:
          "CogVideoX. Le modèle texte vers vidéo de ModelsLab pour générer de courts clips vidéo.",
        modelsLabWanx:
          "Wanx. Le modèle de génération texte vers vidéo de ModelsLab.",
        modelsLabWan22:
          "Wan 2.2 Ultra. Le modèle de génération texte vers vidéo de haute qualité de ModelsLab.",
        modelsLabWan21:
          "Wan 2.1 Ultra. Le modèle de génération texte vers vidéo de ModelsLab, à la qualité améliorée.",
        modelsLabWan25T2V:
          "Wan 2.5 T2V. Le modèle de génération texte vers vidéo Wan 2.5 de ModelsLab.",
        modelsLabWan25I2V:
          "Wan 2.5 I2V. Le modèle de génération image vers vidéo Wan 2.5 de ModelsLab.",
        modelsLabWan27T2V:
          "Le modèle vidéo Wan 2.7 d'Alibaba. Clips jusqu'à 10 secondes (15 via ModelsLab), jusqu'en 1080p, nombreux formats d'image, audio natif, et première et dernière images optionnelles pour guider le plan. Prix intermédiaire à la seconde. Un polyvalent flexible ; pour des tests moins chers, utilisez Seedance 1.5 Pro, pour le réalisme haut de gamme, Veo 3.1. Ancien : Wan 3.0 le remplace, même prix en 720p avec des clips jusqu'à 30 secondes.",
        modelsLabWan26T2V:
          "Wan 2.6 T2V. Le modèle de génération texte vers vidéo Wan 2.6 de ModelsLab.",
        modelsLabWan26I2V:
          "Le modèle image vers vidéo Wan 2.6 d'Alibaba : donnez-lui une image de départ et il anime la scène, avec audio natif. Clips de 5 ou 10 secondes en 720p ou 1080p, paysage ou portrait. À peu près le même prix à la seconde que Wan 2.7. Prenez Wan 2.7 T2V si vous voulez aussi une image de fin cible ou plus de formats.",
        modelsLabWan26I2VFlash:
          "La variante rapide de Wan 2.6 image vers vidéo. Transforme une image fixe en clip de 5 ou 10 secondes en 720p ou 1080p, avec une attente plus courte. Même prix à la seconde que Wan 2.6 I2V standard : à choisir quand le délai compte. L'audio natif n'est pas indiqué pour cette variante ; le modèle standard l'a.",
        modelsLabSeedanceT2V:
          "Seedance T2V. Le modèle de génération texte vers vidéo de BytePlus.",
        modelsLabSeedanceI2V:
          "Seedance I2V. Le modèle de génération image vers vidéo de BytePlus.",
        modelsLabOmnihuman:
          "Omnihuman. Le modèle de génération de vidéos de personnes de BytePlus.",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V. Le modèle image vers vidéo professionnel de BytePlus.",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V. Le modèle image vers vidéo professionnel et rapide de BytePlus.",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V. Le modèle texte vers vidéo professionnel et rapide de BytePlus.",
        modelsLabOmnihuman15:
          "OmniHuman 1.5 de ByteDance anime une personne à partir d'une seule photo, guidé par une piste audio : têtes parlantes, chant, gestes. Un spécialiste des avatars et du doublage, pas un modèle texte vers vidéo généraliste. Plus cher à la seconde que la plupart des modèles vidéo intermédiaires. Pour des scènes sans personne qui parle, prenez Kling 3.0 ou Wan 2.7.",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro de ByteDance, vendu via son cloud BytePlus. Texte vers vidéo avec audio natif, de 480p à 1080p, paysage ou portrait. L'un des modèles vidéo les moins chers ici par clip, et le 480p coûte moitié moins que le 720p. Excellent pour tester des idées et produire en volume ; Seedance 2.0 monte d'un cran pour le contrôle des images, la cohérence et la 4K.",
        modelsLabVeo2:
          "Veo 2. Le modèle de génération vidéo de haute qualité de Google, via ModelsLab.",
        modelsLabVeo3:
          "Veo 3. Le dernier modèle de génération vidéo de Google, via ModelsLab.",
        modelsLabVeo3Fast:
          "Veo 3 Fast. Le modèle de génération vidéo rapide de Google, via ModelsLab.",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview. La préversion du modèle de génération vidéo rapide de Google, via ModelsLab.",
        modelsLabVeo31:
          "Le modèle vidéo phare de Google. Réalisme cinématographique, audio natif avec dialogues et effets sonores, clips de 4 à 8 secondes jusqu'en 4K, contrôle de la première et de la dernière image. Le modèle vidéo le plus cher du catalogue. Il vaut le coup pour les plans finaux ; faites vos brouillons sur Veo 3.1 Fast pour une fraction du prix.",
        modelsLabVeo31Fast:
          "Le niveau rapide et moins cher de Veo 3.1 de Google. Mêmes clips de 4 à 8 secondes, audio natif, jusqu'en 4K et contrôle des images, pour environ un tiers à la moitié du prix de Veo 3.1 complet. Perd un peu de fidélité sur les plans exigeants. Le meilleur compromis pour la plupart des usages de Veo ; Veo 3.1 Lite est encore moins cher.",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V. Le modèle image vers vidéo de Kling AI, version 2.1.",
        modelsLabKlingV25TurboI2V:
          "Kling 2.5 Turbo en image vers vidéo : anime une image fixe en un court clip. Bon marché par clip et rapide, avec le mouvement vivant de Kling. Pas d'audio natif indiqué. Kling 3.0 ajoute le son et des plans jusqu'à 15 secondes, pour plus cher.",
        modelsLabKlingV25TurboT2V:
          "Kling 2.5 Turbo à partir de texte. Clips de 5 ou 10 secondes en 16:9, 9:16 ou 1:1, parmi les moins chers par clip du catalogue. Mouvement convaincant pour le prix, pas d'audio natif. Passez à Kling 3.0 T2V pour le son et des clips jusqu'à 15 secondes.",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V. Le modèle texte vers vidéo de qualité Master de Kling AI.",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V. Le modèle image vers vidéo de qualité Master de Kling AI.",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master, le niveau premium de la génération 2.1 de Kling. Clips de 5 ou 10 secondes à partir de texte, avec une grande fidélité visuelle. Prix dans le haut du catalogue, environ trois fois celui de Kling 3.0 T2V, plus récent et doté de l'audio natif. Vaut surtout le coup pour des prompts qui marchent déjà bien ici.",
        modelsLabKlingV21MasterI2V:
          "Kling 2.1 Master en image vers vidéo : anime une image fixe en clip de 5 ou 10 secondes, avec une grande fidélité visuelle. Prix dans le haut du catalogue, environ trois fois celui du plus récent Kling 3.0, qui apporte aussi l'audio natif. À prendre seulement si son rendu est exactement ce qu'il vous faut ; Kling V2.5 Turbo I2V est l'alternative bon marché.",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V. Le modèle multi-images vers vidéo de Kling AI, version 1.6.",
        modelsLabKling30T2V:
          "Kling 3.0 Pro de Kuaishou. Audio natif, clips de 3 à 15 secondes en 720p, contrôle de la première et de la dernière image, 16:9, 9:16 ou 1:1. Mouvement vivant et convaincant pour un prix intermédiaire. Le 720p est le plafond ; pour du 1080p et au-delà, regardez Veo 3.1 Fast ou Hailuo 3. Kling 3.0 Std coûte moins quand vous partez d'une image.",
        modelsLabLtx2ProT2V:
          "LTX-2 Pro de Lightricks. Texte vers vidéo en 2K ou 4K, en clips d'environ 6 à 10 secondes. Un prix intermédiaire pour cette résolution, ce qui en fait la voie économique vers la 4K, à côté de Veo 3.1. Pas d'audio natif indiqué ici ; pour le son en 4K, utilisez Veo 3.1 Fast.",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V. Le modèle de génération image vers vidéo professionnel de LTX.",
        modelsLabLtx23ProI2V:
          "LTX 2.3 Pro de Lightricks en image vers vidéo : anime une image fixe en 2K ou 4K, en clips de 6 à 10 secondes. Plus récent que LTX 2 Pro et un peu plus cher. Le choix quand une image haute résolution doit rester nette en mouvement. Pas d'audio natif indiqué.",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 de MiniMax, à partir de texte ou d'une image de départ, réputé pour un mouvement vivant et physique comme la danse et l'action. Clips de 6 ou 10 secondes jusqu'en 1080p, en 16:9. Pas d'audio natif. Prix intermédiaire. Hailuo 3 ajoute le son, la 2K et le contrôle des images, pour environ le double.",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V. Le modèle de génération texte vers vidéo 02 de MiniMax.",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 de MiniMax en image vers vidéo. Anime une image fixe en clip de 6 ou 10 secondes, avec un mouvement expressif et physique. Pas d'audio natif. Hailuo 2.3 Fast I2V fait le même travail pour environ moitié prix, avec moins de finition.",
        modelsLabHailuo23FastI2V:
          "Le niveau rapide et bon marché de Hailuo 2.3 image vers vidéo. Clips de 6 ou 10 secondes à partir d'une image fixe, pour environ la moitié du coût de Hailuo 2.3 I2V standard. Bien pour les brouillons et le volume, avec moins de détail. Pas d'audio natif.",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V. Le modèle de génération image vers vidéo 02 de MiniMax.",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End. Le modèle de génération vidéo de MiniMax guidé par une image de début et une image de fin.",
        modelsLabSora2:
          "Sora 2 d'OpenAI. Physique crédible, audio et dialogues synchronisés, clips de 4, 8 ou 12 secondes en 720p. Uniquement en 16:9 sur cette voie. Prix moyen à élevé. Sora 2 Pro rend les mêmes durées avec plus de détail, pour environ trois fois le prix.",
        modelsLabSora2Pro:
          "Le niveau premium de Sora 2 d'OpenAI. Audio synchronisé et fidélité supérieure, clips de 4, 8 ou 12 secondes en 720p, uniquement en 16:9 sur cette voie. L'un des modèles vidéo les plus chers ici. Vaut le coup pour des plans finaux soignés ; Sora 2 couvre les brouillons pour environ un tiers du prix.",
        modelsLabGen4Aleph:
          "Aleph de Runway est un éditeur vidéo plus qu'un générateur : donnez-lui des images existantes et il ajoute ou retire des objets, change le style, l'éclairage ou l'angle de caméra. Nombreux formats, y compris les formats cinéma larges. Plus cher que la plupart des générateurs. Pour de nouveaux clips à partir d'un prompt, utilisez Veo 3.1 Fast ou Kling 3.0.",
        modelsLabLipsync2:
          "lipsync-2 de Sync aligne le mouvement des lèvres d'une vidéo existante sur une nouvelle piste audio. Conçu pour le doublage, les voix off traduites et la correction de dialogues. Il retouche des images existantes, il n'invente pas de scènes. Pour faire parler une personne à partir d'une seule photo, utilisez Omnihuman 1.5.",
        modelsLabGrokT2V:
          "Grok Imagine de xAI, en vidéo à partir de texte. Clips de 1 à 15 secondes en 480p ou 720p, avec une première image optionnelle. Prix intermédiaire, rapide et libre. Niveau Ouvert : filtres plus légers que Veo ou Sora, mais pas de contenu explicite. Grok Imagine Video 1.5 ajoute le 1080p. Ancien : Grok Imagine Video 1.5 Lite le remplace, pour moins de la moitié du prix.",
        modelsLabGrokI2V:
          "Grok Imagine de xAI en image vers vidéo. Anime une image fixe en clip de 15 secondes maximum, en HD. Un peu moins cher que Grok T2V. Convient aux images animées rapides ; pour une résolution plus élevée, passez à Grok Imagine Video 1.5. Ancien : Grok Imagine Video 1.5 Lite anime les images fixes pour moins cher.",
        klingV30Std:
          "Le niveau standard de Kling 3.0 de Kuaishou. Les mêmes clips de 3 à 15 secondes avec audio natif et contrôle des images que Kling 3.0 T2V, le niveau Pro, en 720p. Le choix Kling 3 le moins cher quand vous partez d'une image ; pour de simples prompts texte, Kling 3.0 T2V coûte souvent moins.",
        klingVideoO1:
          "Le modèle vidéo multimodal unifié de Kling, conçu pour générer des clips et les retoucher à partir de références dans un seul modèle. Audio natif, 5 ou 10 secondes en 720p, contrôle de la première et de la dernière image. Prix intermédiaire. À prendre pour le travail guidé par des références ; pour du simple texte vers vidéo, Kling 3.0 T2V est moins cher.",
        veo31Lite:
          "Le niveau économique de Veo 3.1 de Google. Audio natif, clips de 4 à 8 secondes en 720p ou 1080p, contrôle de la première et de la dernière image. La porte d'entrée la moins chère vers Veo, mais pas de 4K. Bien pour les clips sociaux en volume ; passez à Veo 3.1 Fast quand la qualité compte.",
        seedance2:
          "Seedance 2.0 de ByteDance. Audio natif, clips de 4 à 15 secondes du 480p jusqu'à la 4K, première et dernière images, et entrée de références pour garder les personnages cohérents. Haut de la fourchette de prix. Un choix fort pour des plans narratifs avec des personnages récurrents ; Seedance 2.0 Fast est moins cher pour les brouillons, jusqu'en 720p.",
        seedance2Fast:
          "Le niveau plus rapide et moins cher de Seedance 2.0 de ByteDance. Audio natif, clips jusqu'à 15 secondes et contrôle des images, mais plafonné à 720p. Environ 60 % du prix du modèle complet. Bien pour les brouillons et les clips sociaux ; utilisez Seedance 2.0 complet quand il vous faut du 1080p ou de la 4K.",
        happyhorse11:
          "La deuxième version du modèle vidéo HappyHorse d'Alibaba. Texte vers vidéo, image vers vidéo et images de référence, de 3 à 15 secondes en 720p ou 1080p. Pas d'audio natif sur cette voie. Même prix en 720p que HappyHorse 1.0 et moins cher en 1080p, avec un meilleur mouvement et une meilleure cohérence selon Alibaba : c'est le choix par défaut des deux. Coût intermédiaire.",
        happyhorse10:
          "La première version du modèle vidéo HappyHorse d'Alibaba. Texte vers vidéo, image vers vidéo et images de référence, de 3 à 15 secondes en 720p ou 1080p. Pas d'audio natif sur cette voie. Même prix en 720p que HappyHorse 1.1, mais plus cher en 1080p : la version plus récente est généralement le meilleur choix. Utile à garder pour les prompts réglés sur la 1.0.",
        modelsLabGen4T2ITurbo:
          "La variante plus rapide et moins chère du modèle d'image Gen-4 de Runway. Texte en entrée, image en sortie, pour moins d'un tiers du prix de Gen4 Image. Bien pour les brouillons rapides et pour itérer sur le rendu cinématographique de Runway. Pas de retouche à partir d'image de référence ici ; pour les retouches, utilisez FLUX.2 Pro ou Seedream 4.5.",
        modelsLabGen4Image:
          "Le modèle d'image Gen-4 de Runway, connu pour son rendu cinématographique, façon photo de tournage. Texte en entrée, image en sortie. L'une des options d'image les plus chères du catalogue : il mérite sa place quand vous voulez précisément cette esthétique Runway. Pour itérer à bas coût, commencez par Gen4 T2I Turbo ; pour retoucher à partir d'une image de référence, prenez FLUX.2 Pro.",
        modelsLabWan27T2I:
          "Le modèle d'image Wan 2.7 d'Alibaba, de la même famille que les modèles vidéo Wan. Texte en entrée, image en sortie, à un prix intermédiaire bas. Un choix généraliste solide pour les illustrations et les scènes. Pas d'entrée d'image de référence ici ; pour les retouches, utilisez Qwen Image 3 ou Seedream 4.5.",
        modelsLabGrokT2I:
          "Le générateur d'images Grok Imagine de xAI. Texte en entrée, image en sortie, bon marché. Niveau Ouvert : filtres plus légers qu'Imagen 4, mais pas de contenu explicite. Bien pour des images rapides et percutantes ; pour la retouche à partir d'une image de référence et la génération plus récente, Grok Imagine Image 2.0 coûte un peu plus.",
        modelsLabZImageBase:
          "La base complète, non distillée, de Z-Image, le modèle d'image à poids ouverts du laboratoire Tongyi d'Alibaba. Parmi les images les moins chères du catalogue. Plus de variété que Z Image Turbo, plus lent par image. Bien pour le volume à bas coût et l'expérimentation ; pour une image finale soignée, passez à FLUX.2 Pro.",
        modelsLabZImageTurbo:
          "La version distillée et réglée pour la vitesse de Z-Image, le modèle à poids ouverts du laboratoire Tongyi d'Alibaba. Des images en quelques étapes, au prix le plus bas du catalogue. De bons résultats photoréalistes et un texte lisible pour le coût. Moins de variété que Z Image Base, et il reste derrière FLUX.2 Pro sur les prompts difficiles.",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I. Le texte vers image Flux 2 Max de Black Forest Labs, via ModelsLab.",
        modelsLabFluxPro11Ultra:
          "Le mode haute résolution de Flux Pro 1.1, conçu pour des images d'environ 4 mégapixels. Texte en entrée uniquement. Parmi les modèles d'image les plus chers ici. À prendre pour de grandes images prêtes à imprimer ; pour la retouche ou le travail multi-références, FLUX.2 Pro est moins cher et plus souple.",
        modelsLabFluxPro11:
          "Flux Pro 1.1. Le texte vers image Flux Pro 1.1 de Black Forest Labs, via ModelsLab.",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I. Le texte vers image Flux 2 Pro de Black Forest Labs, via ModelsLab.",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I. Le texte vers image Flux 2 Dev de Black Forest Labs, via ModelsLab.",
        modelsLabFluxT2I:
          "Flux T2I. Le texte vers image Flux de Black Forest Labs, via ModelsLab.",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I. Le texte vers image Seedream 4.5 de ByteDance, via ModelsLab.",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I. Le texte vers image Seedream 4.0 de ByteDance, via ModelsLab.",
        modelsLabSeedreamT2I:
          "Seedream T2I. Le texte vers image Seedream de ByteDance, via ModelsLab.",
        modelsLabImagen4Ultra:
          "Le haut de gamme d'Imagen 4 de Google. Le suivi de prompt le plus précis de la famille et un texte propre et lisible dans l'image. Grand public : les filtres de Google s'appliquent pleinement. Environ trois fois le prix d'Imagen 4 Fast : gardez-le pour les rendus finaux. Pour moins de restrictions, utilisez FLUX.2 Pro ; pour le contenu explicite, Chroma.",
        modelsLabImagen4:
          "Imagen 4 standard de Google. Détail photoréaliste, bonne typographie et suivi de prompt fiable, à un prix intermédiaire. Grand public : les filtres de Google s'appliquent, attendez-vous à des refus sur les prompts osés. Imagen 4 Fast coûte environ moitié moins pour les brouillons ; Imagen 4 Ultra s'occupe de la touche finale.",
        modelsLabImagen4Fast:
          "Le niveau rapide d'Imagen 4 de Google. L'Imagen le moins cher, des résultats rapides, bien pour les brouillons et les lots en masse. Sacrifie un peu de détail et de précision par rapport à Imagen 4 et Ultra. Filtres grand public. Pour du volume encore moins cher avec des filtres plus légers, essayez Z Image Turbo.",
        modelsLabImagen3:
          "Imagen 3. Le texte vers image Imagen 3 de Google, via ModelsLab.",
        modelsLabNanoBananaPro:
          "Nano Banana Pro. Génération d'images de haute qualité, via ModelsLab.",
        modelsLabNanoBanana: "Nano Banana. Génération d'images, via ModelsLab.",
        modelsLabQwenT2I:
          "Le modèle texte vers image Qwen d'Alibaba. La gamme d'images Qwen se distingue par le rendu du texte dans l'image, caractères chinois compris, idéal pour affiches, panneaux et maquettes. Au prix le plus bas du catalogue. Texte en entrée uniquement ; pour la retouche, prenez Qwen Image 3.",
        modelsLabRealtimeT2I:
          "L'endpoint temps réel de ModelsLab, réglé pour la vitesse plutôt que la finition. Des images rapides, au niveau de prix le plus bas du catalogue. Utilisez-le pour l'idéation rapide, les vignettes et les tests de prompts avant de payer FLUX.2 Pro ou Imagen 4. Pas le bon choix pour l'image finale ou les scènes complexes.",
        claudeSonnet5:
          "Le premier Sonnet 5 d'Anthropic : code, travail d'agent et analyse équilibrés sur un contexte de 1M, avec l'entrée image. Filtres grand public, prudent sur les sujets sensibles, faible en jeu de rôle. Claude Sonnet 5.5 coûte pareil et il est plus récent : aucune raison de rester.",
        claudeOpus5:
          "Le premier Opus 5 d'Anthropic, pensé pour les tâches agentiques et analytiques les plus difficiles, avec un contexte de 1M et l'entrée image. Prix premium, filtres grand public, prudent sur les sujets sensibles. Claude Opus 5.5 est plus récent et moins cher.",
        claudeOpus5Fast:
          "Claude Opus 5 Fast. Variante à haut débit de Claude Opus 5, optimisée pour les applications sensibles à la latence. Contexte de 1M tokens.",
        claudeFable5:
          "Le premier Fable d'Anthropic, un raisonneur de pointe pour la synthèse approfondie, la profondeur créative et la planification au long cours, avec un contexte de 1M et l'entrée image. Parmi les modèles les plus chers ici, filtres grand public. Claude Fable 5.2 est plus récent et moins cher ; pour le code, prenez Claude Opus 5.5.",
        grok45:
          "Le modèle de raisonnement Grok 4.5 de xAI : fort en analyse et en code, lit les images, contexte de 500K, avec la politique de contenu Ouvert de Grok. Grok 4.7 est plus récent au même prix : passez-y, sauf si vous avez besoin de cette version précise.",
        grok46:
          "Grok 4.6 a affûté le raisonnement et le code par rapport à la 4.5, avec l'entrée image, un contexte de 500K et les filtres de contenu plus légers de xAI. Toujours un modèle capable à filtres Ouverts. Grok 4.7 coûte pareil et le remplace.",
        gpt56Luna:
          "Le niveau rapide et bon marché de la gamme GPT-5.6 d'OpenAI, pour le chat quotidien et les tâches courtes, avec un contexte de 1M et l'entrée image. Pas conçu pour l'analyse approfondie. GPT-6 Luna est plus récent et coûte environ moitié moins.",
        gpt56LunaPro:
          "Luna avec un meilleur code et un meilleur suivi des consignes, au même petit prix que Luna standard. Bien pour l'aide au code bon marché et les tâches structurées sur un contexte de 1M. GPT-6 Luna est plus récent et coûte environ moitié moins.",
        gpt56Terra:
          "Le niveau intermédiaire de la gamme GPT-5.6 d'OpenAI : code, analyse et chat solides sur un contexte de 1M, avec l'entrée image. Faible en jeu de rôle. GPT-6.1 Terra est plus récent et coûte environ moitié moins.",
        gpt56TerraPro:
          "Terra avec un raisonnement plus profond pour le travail riche en analyse, au même prix que Terra standard, sur un contexte de 1M. Faible en jeu de rôle. GPT-6.1 Terra est plus récent et coûte environ moitié moins ; passez à GPT-6.1 Sol pour plus de profondeur.",
        gpt56Sol:
          "Le haut de gamme de la gamme GPT-5.6 d'OpenAI : raisonnement complexe, code, écriture et analyse sur un contexte de 1M, avec l'entrée image. Prix premium, filtres grand public. GPT-6.1 Sol est plus récent et coûte environ moitié moins.",
        gpt56SolPro:
          "Sol avec un effort de raisonnement supplémentaire pour les problèmes les plus durs, au même prix que Sol standard, sur un contexte de 1M. Faible en jeu de rôle, filtres grand public. GPT-6.1 Sol est plus récent, pour moitié prix ; GPT-6 Astra si vous avez besoin d'un maximum de profondeur.",
        gemini36Flash:
          "Gemini 3.6 Flash de Google : rapide et bon en code, avec un contexte de 1M et des entrées texte, image, vidéo et audio. Toujours un rapport qualité-prix raisonnable pour le travail quotidien. Gemini 3.8 Flash est plus récent, pour à peine plus cher.",
        gemini35FlashLite:
          "Le Gemini le plus léger de Google. Accepte texte, images, vidéo et audio, appelle des outils, contexte de 1M. Convient aux tâches simples à gros volume comme les résumés, l'étiquetage et les réponses rapides. Filtres grand public, et ce n'est pas un raisonneur. Plus cher qu'on ne l'attend d'un modèle Lite : GPT-6 Luna et Claude Haiku 5.5 coûtent moins.",
        gemini37Flash:
          "Gemini 3.7 Flash a apporté un meilleur raisonnement et une meilleure analyse à la gamme Flash, avec un contexte de 1M et des entrées texte, image, vidéo et audio. Un bon modèle du quotidien à un prix correct. Gemini 3.8 Flash le remplace, pour à peine plus.",
        kimiK3:
          "Kimi K3 de Moonshot AI, un modèle de niveau pointe. Fort en code, en analyse, en écriture créative et en longues exécutions d'agent, lit images et vidéos, appelle des outils, contexte de 1M. Filtres plus légers que les laboratoires américains. Kimi K3.1 Pro est la version plus récente et plus forte, pour presque le double du prix.",
        glm52:
          "GLM-5.2 de Z.AI : raisonnement solide, inférence rapide et contexte de 1M. Bien pour le code et l'analyse sur de longues entrées, texte uniquement, niveau de contenu Ouvert. GLM-5.3 est plus récent, pour environ un tiers du prix.",
        minimaxM3:
          "L'ancien modèle phare de MiniMax. Bon en code, en raisonnement et en analyse, lit images et vidéos, appelle des outils, contexte de 1M, filtres plus légers que les grands laboratoires grand public. MiniMax M3.1 Flash le remplace : nettement plus fort en agents et en code, pour moitié prix ou moins.",
        qwen37Flash:
          "Le modèle Flash ultra bon marché d'Alibaba, l'une des options les moins chères du catalogue : contexte de 1M, entrées texte, image et vidéo, appels d'outils. Excellent pour les traitements en masse et le chat rapide, superficiel sur le raisonnement difficile. Qwen 3.8 Flash est plus récent et plus intelligent, mais coûte plusieurs fois plus.",
        qwen38Max:
          "Le meilleur Qwen d'Alibaba. Raisonnement, code et analyse de niveau pointe, lit images et vidéos, appelle des outils, contexte de 1M. Filtres plus légers que les laboratoires américains. Premium pour un modèle ouvert : DeepSeek V4 Pro atteint le même niveau pour bien moins de la moitié du prix, si une entrée texte seule vous suffit.",
        mimoV25:
          "MiMo V2.5 de Xiaomi, efficace : rapide et bon en code, avec un contexte de 1M et des entrées texte, image, vidéo et audio. Niveau de contenu Ouvert. MiMo V2.6 Flash est plus récent et coûte moins d'un tiers du prix.",
        mimoV25Pro:
          "MiMo V2.5 Pro de Xiaomi, un modèle de raisonnement profond et de code avec un contexte de 1M, à petit prix. Texte uniquement, niveau de contenu Ouvert. Toujours moins cher que son successeur MiMo V2.6 Pro, le choix plus récent.",
        metaMuseSpark12:
          "Muse Spark 1.2 de Meta, un modèle de raisonnement multimodal qui lit texte, images et vidéos sur un contexte de 1M. Bon en analyse croisée entre modalités, niveau de contenu Ouvert. Pas étiqueté pour le code. Meta Muse Spark 1.3 coûte pareil et il est plus récent.",
        mistralMedium35:
          "Le Medium 3.5 de milieu de gamme de Mistral AI, le laboratoire français : code, analyse et entrée image, avec un contexte de 262K. Filtres grand public. Mistral Large 4 est plus récent et coûte moins de la moitié.",
        claudeOpus55:
          "Le Claude haut de gamme d'Anthropic pour le travail lourd au quotidien. Le choix pour le code le plus difficile, les longues tâches agentiques et l'analyse minutieuse, avec une écriture solide en prime. Lit les images, appelle des outils, contexte de 1M. Prix premium et filtres grand public : il décline les demandes osées et fait un piètre partenaire de jeu de rôle. Claude Sonnet 5.5 couvre l'essentiel du travail quotidien pour moitié prix.",
        claudeSonnet55:
          "Le Claude cheval de trait d'Anthropic. Code, travail d'agent, analyse et écriture solides pour la moitié du prix d'Opus 5.5. Lit les images, appelle des outils, contexte de 1M. Filtres grand public : pas pour le jeu de rôle ni les sujets sensibles. Au même prix que GPT-6.1 Sol et Gemini 4 Argon, le duel évident.",
        claudeHaiku55:
          "Le Claude le plus rapide et le moins cher d'Anthropic. Chat rapide, code léger, vision et outils, contexte de 1M, quelques centimes par message. Filtres grand public, faible en jeu de rôle et sur les sujets osés. Même prix que GPT-6 Luna. Passez à Claude Sonnet 5.5 quand la tâche demande une vraie profondeur.",
        claudeFable51:
          "Fable 5.1 d'Anthropic, un raisonneur de pointe pour la synthèse approfondie, la planification au long cours et l'écriture soignée sur un contexte de 1M. Prix premium, filtres grand public, prudent sur les sujets sensibles et faible en jeu de rôle. Claude Fable 5.2 le remplace et coûte moins ; pour le code, Claude Opus 5.5 convient mieux.",
        claudeFable52:
          "Le raisonneur de pointe d'Anthropic, et le Claude le plus cher. Conçu pour la synthèse approfondie, la recherche et la planification au long cours, avec une écriture solide. Lit les images, appelle des outils, contexte de 1M. Environ le double du prix d'Opus 5.5, filtres grand public. Pour le code, Claude Opus 5.5 offre un meilleur rapport qualité-prix.",
        gpt6Astra:
          "Le modèle le plus capable d'OpenAI, conçu pour une profondeur de raisonnement maximale sur les problèmes les plus durs. Code, analyse et écriture, lit les images, appelle des outils, contexte de 1M. Le modèle le plus cher du catalogue, filtres grand public. GPT-6.1 Sol est au même niveau pour environ un cinquième du prix : essayez-le d'abord.",
        gpt6AstraPro:
          "GPT-6 Astra Pro. GPT-6 Astra avec un effort de raisonnement étendu. Plus lent, plus rigoureux. Contexte de 1,05M tokens.",
        gpt61Sol:
          "Le raisonneur premium d'OpenAI, son choix de pointe raisonnable. Fort en code, en analyse et en écriture, lit les images, appelle des outils, contexte de 1M. Filtres grand public, pas pour le jeu de rôle. Environ un cinquième du prix de GPT-6 Astra, et au même coût que Claude Sonnet 5.5 et Gemini 4 Argon.",
        gpt61SolPro:
          "GPT-6.1 Sol Pro. GPT-6.1 Sol avec un effort de raisonnement étendu pour l'analyse et le code complexes. Contexte de 1,05M tokens.",
        gpt61Terra:
          "Le niveau intermédiaire équilibré d'OpenAI. Bon en code, en analyse et en chat quotidien, lit les images, appelle des outils, contexte de 1M. Moitié prix de GPT-6.1 Sol. Filtres grand public, faible en jeu de rôle. Si des filtres plus légers vous conviennent, DeepSeek V4 Pro atteint un niveau supérieur pour moins cher.",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro. GPT-6.1 Terra avec un raisonnement plus profond pour le travail riche en analyse. Contexte de 1,05M tokens.",
        gpt6Luna:
          "Le GPT-6 léger d'OpenAI. Des réponses rapides pour quelques centimes, lit les images, appelle des outils, contexte de 1M. Bien pour les questions rapides et les corvées simples, pas pour le raisonnement profond ni le jeu de rôle. Même prix que Claude Haiku 5.5. DeepSeek V4.1 Flash est encore moins cher, avec des filtres plus légers.",
        gpt6LunaPro:
          "GPT-6 Luna Pro. GPT-6 Luna avec du raisonnement en plus. Meilleur code et meilleur suivi des consignes, au même petit prix. Contexte de 1,05M tokens.",
        gemini4Argon:
          "Le Gemini phare de Google. Accepte texte, images, vidéo et audio, puis raisonne, code et analyse au plus haut niveau. Appelle des outils, contexte de 1M. Un choix fort quand l'entrée est un enregistrement, une vidéo ou une pile de captures d'écran. Filtres grand public. Au même prix que Claude Sonnet 5.5 et GPT-6.1 Sol. Gemini 4 Carbon va plus loin sur les tâches les plus dures ; Gemini 4 Hydrogen est plus rapide et coûte un quart de moins.",
        gemini38Flash:
          "Le Flash actuel de Google. Rapide, bon en code et en analyse, accepte texte, images, vidéo et audio, appelle des outils, contexte de 1M. Filtres grand public. Prix moyen : bien moins de la moitié de Gemini 4 Argon, mais bien au-dessus des modèles ouverts rapides comme Qwen 3.8 Flash. Gemini 4 Hydrogen est bien plus intelligent et plus rapide, pour presque le double du prix.",
        grok47:
          "Le Grok le plus récent de xAI. Raisonnement et code affûtés, lit les images, appelle des outils, contexte de 500K, la moitié de ce qu'offrent la plupart des modèles phares ici. Politique de contenu Ouvert : il répond à plus de choses que les grands laboratoires grand public, sans être totalement non censuré. Au prix de Qwen 3.8 Max. xAI n'a plus de niveau Fast bon marché : pour du chat rapide et peu coûteux avec des filtres Ouverts, essayez MiniMax M3.1 Flash ou Meta Muse Ember.",
        kimiK31Pro:
          "Le Kimi le plus fort de Moonshot AI. Raisonnement, code, écriture créative et longues exécutions d'agent au plus haut niveau, lit images et vidéos, appelle des outils, contexte de 1M. Filtres plus légers que les laboratoires américains. Au même prix que Claude Sonnet 5.5. Kimi K3 s'en approche pour un peu plus de la moitié du prix.",
        qwen4Max:
          "Le nouveau modèle phare d'Alibaba, et le premier Qwen 4. Raisonnement, code et analyse de niveau pointe, lit images et vidéos, appelle des outils, contexte de 1M. Filtres plus légers que les laboratoires américains. Il réfléchit avant chaque réponse : les réponses prennent un instant. Un quart moins cher que Qwen 3.8 Max, qu'il remplace.",
        kimiK31ProUncensored:
          "Le Kimi le plus fort de Moonshot AI, refus retirés (abliteré), servi par Lyber. Le nouveau sommet de la gamme non censurée : raisonnement, code, écriture longue et outils, contexte de 1M. Refus retirés, vision du monde intacte : en politique, il répond avec le cadrage du Kimi de base. Pour des positions politiques à contre-courant, prenez UncensoredLM. Texte uniquement. Prix premium, plusieurs fois celui de GLM 5.3 Uncensored, le poids lourd moins cher.",
        deepseekV41Flash:
          "Le modèle rapide de DeepSeek, désormais avec la vision. Du code et de l'analyse sérieux pour presque rien : le modèle le moins cher du catalogue. Appelle des outils, contexte de 1M, filtres plus légers. Pas un raisonneur profond. Passez à DeepSeek V4 Pro pour les problèmes durs, ou prenez DeepSeek V4.1 Flash Uncensored pour zéro refus.",
        qwen38Flash:
          "Le Qwen rapide d'Alibaba. Texte, images et vidéo en entrée, réponses rapides en sortie, code correct, appelle des outils, contexte de 1M. Prix économique, filtres plus légers. Un modèle du quotidien, pas un penseur profond. Qwen 4 Max prend les problèmes durs.",
        glm53:
          "Le modèle de fondation GLM-5.3 de Z.AI. Raisonnement et code solides pour quelques centimes, appelle des outils, contexte de 1M. Texte uniquement, filtres plus légers. Parmi les modèles intelligents les moins chers du catalogue. Vous voulez zéro refus ? GLM 5.3 Uncensored est la variante sans filtre.",
        glm53Flash:
          "Le GLM rapide de Z.AI. Lit texte, images et vidéo, code, appelle des outils, contexte de 1M. Conçu pour le travail à gros volume à prix économique, avec des filtres plus légers. Plus léger en raisonnement que GLM-5.3, qui coûte pareil : prenez Flash pour l'entrée média et la vitesse.",
        mimoV26Pro:
          "Le meilleur MiMo de Xiaomi. Raisonnement, code et analyse au plus haut niveau, avec texte, images, vidéo et audio en entrée. Appelle des outils, contexte de 1M, filtres plus légers. Le modèle le moins cher du niveau d'intelligence le plus élevé ici, une fraction de Gemini 4 Argon pour une gamme d'entrées similaire. Un nom récent : testez-le sur vos propres prompts.",
        mimoV26Flash:
          "Le MiMo rapide de Xiaomi. Accepte texte, images, vidéo et audio, code bien pour son prix, appelle des outils, contexte de 1M. Très bon marché, filtres plus légers. Sacrifie la profondeur à la vitesse. MiMo V2.6 Pro est le cran au-dessus, et MiMo V2.6 Flash Abliterated supprime les refus.",
        metaMuseSpark13:
          "Le Muse de milieu de gamme de Meta. Raisonne et analyse sur texte, images et vidéo, appelle des outils, contexte de 1M, filtres plus légers. Pas conçu pour le code. À ce prix, Kimi K3 atteint un niveau supérieur, et Meta Muse Wonder est le modèle phare de Meta.",
        metaMuseWonder:
          "Le Muse phare de Meta. Raisonnement, code, analyse et travail créatif au plus haut niveau, avec texte, images, vidéo et audio en entrée. Appelle des outils, contexte de 1M, filtres plus légers que les grands laboratoires grand public. Premium, au prix de Claude Opus 5.5. Kimi K3.1 Pro et Gemini 4 Argon sont au même niveau pour moitié prix.",
        mistralLarge4:
          "Le modèle phare de Mistral AI, un laboratoire européen. Bon en code et en analyse, lit les images, appelle des outils, contexte de 1M, à un prix modéré. Filtres grand public. Pas au plus haut niveau : DeepSeek V4 Pro coûte un peu plus et raisonne plus profondément.",
        gemini4Hydrogen:
          "Le Gemini 4 rapide de Google. Conçu pour les boucles d'agent, le code et l'analyse rapide, il atteint le plus haut niveau sur les benchmarks tout en tournant environ 2,5 fois plus vite que Gemini 3.8 Flash. Accepte texte, images, vidéo et audio, appelle des outils, contexte de 1M. Filtres grand public. Laissez les longues chaînes de raisonnement profond à Gemini 4 Carbon ou Argon. Un quart moins cher qu'Argon, presque le double de Gemini 3.8 Flash.",
        gemini4Carbon:
          "Le Gemini le plus fort de Google, et l'un des meilleurs modèles du moment, tous fournisseurs confondus. Fait pour le code le plus dur, les longues exécutions d'agent et le raisonnement complexe, avec texte, images, vidéo et audio en entrée. Appelle des outils, contexte de 1M. Filtres grand public. Consomme plus de tokens qu'Argon par tâche : en pratique, il coûte plus. Son prix de lancement égale celui d'Argon, de Claude Sonnet 5.5 et de GPT-6.1 Sol jusqu'au 30 novembre, puis double pour atteindre le niveau de Claude Opus 5.5.",
        minimaxM31Flash:
          "Le modèle rapide de MiniMax, un grand bond par rapport à M3 : bien meilleur en agents, en code et en sécurité. Lit images et vidéos, appelle des outils, contexte de 1M, filtres plus légers que les grands laboratoires grand public. Il réfléchit toujours avant de répondre et écrit long : réponses plus lentes et plus longues que les autres modèles Flash. Coûte la moitié de M3 ou moins, dans la même tranche économique que DeepSeek V4.1 Flash et Qwen 3.8 Flash.",
        metaMuseEmber:
          "Le plus petit Muse de Meta, conçu pour le travail que les agents répètent toute la journée : appels d'outils, routage, extraction de données et chat rapide. Lit texte, images, vidéo et audio, contexte de 1M, filtres plus légers que les grands laboratoires grand public. Fort en usage d'outils et en tâches informatiques pour sa taille, superficiel sur le code difficile et le raisonnement profond. Même prix que GPT-6 Luna et Claude Haiku 5.5, multiplié par trois pour les prompts de plus de 200K tokens.",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash, refus retirés, servi par Venice. Du vrai code et de l'analyse, plus de la fiction et du jeu de rôle, sans sermons. Lit les images, appelle des outils, contexte de 1M, bon marché. Même entraînement, même vision du monde : le cadrage de DeepSeek façonne toujours les réponses politiques et peut adoucir les scènes les plus sombres. UncensoredLM apporte une autre vision du monde. Environ quatre fois le prix de DeepSeek V4.1 Flash standard. GLM 5.3 Flash Uncensored est l'alternative sans filtre moins chère.",
        drummerArtemis31b:
          "Le fine-tune de Gemma 4 31B par TheDrummer pour le jeu de rôle et la fiction. Tient un personnage, écrit du grimdark et des scènes adultes explicites sans refuser, et garde une prose vivante plutôt qu'aseptisée. Lit les images, appelle des outils, contexte de 262K. Faible en code et en analyse difficile : un conteur, pas un raisonneur. Un fine-tune communautaire sur un seul hébergeur NanoGPT, donc il peut être brièvement indisponible. Environ un cinquième du prix de Venice Role Play Uncensored. Quand l'histoire exige une vraie logique, DeepSeek V4.1 Flash Uncensored est le choix plus intelligent.",
        grokImagineImage2:
          "Le modèle d'image Grok Imagine de deuxième génération de xAI. Accepte du texte ou une image de référence : il gère les retouches comme les nouvelles images. Prix intermédiaire. Niveau Ouvert : filtres plus légers que le grand public, pas de contenu explicite. Le cran au-dessus de Grok Imagine T2I quand vous avez besoin de retouches ou d'un suivi de prompt plus serré.",
        recraftV41:
          "Recraft V4.1. Conçu pour le design : logos, affiches, packaging, publicités et tout ce qui contient du texte. Typographie propre, composition solide, accepte une image de référence. Environ 3,5 crédits par image, à environ 1K. Filtres grand public. Passez à Pro pour une sortie 2K de qualité impression, à Flash pour des brouillons bon marché.",
        recraftV41Pro:
          "Le Recraft V4.1 premium. Le même sens du design et une typographie nette, à environ 2K avec un détail plus fin. Fait pour l'impression, les photos produit et les visuels de marque utilisables tels quels. Environ 21 crédits par image : faites d'abord vos brouillons avec V4.1 ou Flash. Filtres grand public.",
        recraftV41Flash:
          "Le niveau rapide de Recraft. Environ 1,5 seconde par image, moins de 1 crédit chacune, prompts texte uniquement. Bien pour les planches d'ambiance, les vignettes et les tests d'idées en masse. Moins de détail que Recraft V4.1. Filtres grand public.",
        qwenImage3:
          "Le niveau rapide de Qwen Image 3 d'Alibaba. Génère à partir de texte et retouche à partir d'une image de référence, à petit prix. Bien pour les retouches rapides, les visuels chargés en texte et les itérations. Qwen Image 3 Pro ajoute du détail pour un peu plus ; pour des retouches non censurées, utilisez Qwen Edit Uncensored.",
        qwenImage3Pro:
          "Le niveau supérieur de Qwen Image 3 d'Alibaba. Texte ou image de référence en entrée, avec plus de détail et de finition que Qwen Image 3 de base, pour un léger surcoût. Fort pour les retouches et le texte dans l'image. Niveau Ouvert, donc pas de contenu explicite ; Qwen Edit Uncensored s'en charge.",
        hailuo3:
          "Hailuo 3 de MiniMax. Audio natif, sortie 2K, clips jusqu'à 15 secondes, contrôle de la première et de la dernière image. Un net progrès sur Hailuo 2.3 sur le papier, pour environ le double du prix. Haut de la fourchette de prix ; pour du 1080p sans son moins cher, utilisez Hailuo 2.3 T2V.",
        seedance25:
          "Seedance 2.5 de ByteDance. Son atout, c'est la durée : clips jusqu'à 30 secondes avec audio natif et contrôle des images, en 480p ou 720p. Le Seedance le plus cher par clip. À prendre pour les longs plans continus ; pour des clips courts plus nets, Seedance 2.0 monte jusqu'à la 4K.",
        flux3Video:
          "Flux 3 Video. Le modèle phare de génération vidéo de Black Forest Labs, d'une qualité et d'un suivi de prompt exceptionnels.",
        grokImagineVideo15:
          "Grok Imagine Video 1.5 de xAI. Clips jusqu'à 15 secondes en 480p, 720p ou 1080p, avec une première image optionnelle. Un cran au-dessus de Grok T2V en résolution, pour environ le double du prix. Niveau Ouvert : filtres plus légers que Veo ou Sora, pas de contenu explicite.",
        lyria3ProPreview:
          "Le niveau premium de Lyria 3 de Google, encore en préversion. Conçu pour des chansons complètes avec une production de haute qualité. Grand public : les filtres de Google s'appliquent. Environ une fois et demie le prix de Lyria 3. En préversion, son comportement et sa disponibilité peuvent encore changer.",
        lyria3ClipPreview:
          "Lyria 3 Clip de Google, format court, en préversion. Des extraits musicaux rapides et bon marché pour intros, jingles et posts sociaux. Filtres grand public. Durées courtes uniquement ; pour des morceaux plus longs, utilisez Lyria 3 ou Lyria 3 Pro Preview.",
        geminiNanoBanana21:
          "Nano Banana 2.1 de Google. Génère et retouche des images directement dans le chat, texte et images dans la même réponse. Environ 3 à 4 crédits par image, moitié prix par rapport au Nano Banana d'origine, qu'il remplace. Fort en retouches précises et en texte lisible dans l'image. Filtres grand public, pas d'appels d'outils. Nano Banana Pro reste meilleur sur les scènes complexes, pour environ quatre fois le prix.",
        seedream55:
          "Seedream 5.5 de ByteDance. Génère à partir de texte ou retouche à partir de dix images de référence maximum. Fort en portraits, en personnages cohérents et en scènes multi-images. 2 crédits par image, moitié prix de Seedream 4.5, qu'il remplace. Niveau Ouvert : filtres plus légers que le grand public, pas de contenu explicite.",
        flux3Image:
          "FLUX.3 de Black Forest Labs. Détail plus net, texte plus propre et suivi de prompt plus serré que FLUX.2, à partir de texte ou d'images de référence. Environ 5 crédits par image, moins cher que FLUX.2 Max, qu'il remplace. Niveau Ouvert, pas de contenu explicite. FLUX.2 Pro reste moins cher au quotidien ; FLUX.3 Klein gère le volume.",
        flux3Klein:
          "Le petit FLUX.3 rapide. Moins de 1 crédit par image, parmi les moins chers du catalogue, et il accepte quand même des images de référence pour les retouches. Fait pour les brouillons, les vignettes et les traitements en masse. Moins de détail que FLUX.3 complet. Niveau Ouvert, pas de contenu explicite.",
        gptImage26Flare:
          "GPT Image 2.6 d'OpenAI, variante rapide. Texte ou image de référence en entrée, des résultats propres et rapides, bon avec le texte et les mises en page. Environ 4 crédits par image. Grand public : les filtres stricts d'OpenAI s'appliquent. Pour les compositions denses et les retouches riches en détails, utilisez son frère Sunburst.",
        gptImage26Sunburst:
          "GPT Image 2.6 d'OpenAI, réglé pour le détail. Compositions denses, affiches chargées en texte et retouches qui préservent les détails passe après passe. Environ 6 crédits par image. Grand public : les filtres stricts d'OpenAI s'appliquent. Flare est plus rapide et moins cher quand le détail fin compte moins.",
        geminiOmni12Flash:
          "Le modèle vidéo Gemini Omni 1.2 Flash de Google. Clips de 3 à 15 secondes avec audio natif, du 360p jusqu'à la 4K, avec contrôle de la première et de la dernière image. Environ 7 crédits par seconde en 720p et 10 en 1080p, moins cher que Veo 3.1 Fast à résolution égale. Les filtres de Google s'appliquent.",
        grokImagineVideo15Lite:
          "La version rapide et bon marché de Grok Imagine Video 1.5 de xAI. Clips de 1 à 15 secondes en 480p, 720p ou 1080p, première image optionnelle. 3 crédits par seconde en 720p, moins de la moitié de la vidéo Grok Imagine d'origine, qu'il remplace. Sacrifie un peu de qualité à la vitesse ; Grok Imagine Video 1.5 complet rend mieux. Niveau Ouvert, pas de contenu explicite.",
        wan30:
          "Wan 3.0 d'Alibaba. Clips de 2 à 30 secondes avec audio natif, de 480p à 1080p, contrôle de la première et de la dernière image. 10 crédits par seconde en 720p, comme Wan 2.7, qu'il remplace, plus un niveau 480p à moitié prix. De longues prises pour un petit budget. Niveau Ouvert, pas de contenu explicite.",
        seedance2Mini:
          "Le Seedance 2.0 économique. Texte ou image vers vidéo, de 4 à 15 secondes, audio natif, contrôle de la première et de la dernière image, en 480p ou 720p. Environ 7,6 crédits par seconde en 720p, moins que Seedance 2.0 Fast. Bien pour les brouillons et les clips sociaux ; Seedance 2.0 monte jusqu'à la 4K quand il le faut. Niveau Ouvert, pas de contenu explicite.",
        hailuo3Max:
          "Hailuo 3 Max de MiniMax, un entraînement plus rapide de Hailuo 3. Clips de 5 à 15 secondes en 768p ou 480p, avec contrôle de la première et de la dernière image, sans son. 8 crédits par seconde, bien en dessous de Hailuo 3. À prendre pour les itérations rapides ; Hailuo 3 ajoute la 2K et l'audio natif. Niveau Ouvert, pas de contenu explicite.",
        runwayGen45:
          "Gen-4.5 de Runway. Mouvement cinématographique et suivi de prompt solide, texte ou première image en entrée, clips de 2 à 10 secondes en 720p, sans son. 12 crédits par seconde, haut de la fourchette intermédiaire. Un choix fort pour des plans façon cinéma ; pour du son dans le clip, utilisez Veo 3.1 Fast ou Wan 3.0. Niveau Ouvert, pas de contenu explicite.",
      },
    },
    modelUtilities: {
      adultExplicit: "Contenu adulte/explicite",
      adultImplied: "Contenu adulte/suggéré",
      analysis: "Analyse",
      chat: "Chat",
      coding: "Code",
      conspiracy: "Théories du complot",
      controversial: "Sujets controversés",
      creative: "Écriture créative",
      fast: "Rapide",
      harmful: "Contenu potentiellement dangereux",
      illegalInfo: "Informations illégales",
      imageGen: "Génération d'images",
      legacy: "Ancien",
      medicalAdvice: "Conseils médicaux",
      offensiveLanguage: "Langage offensant",
      politicalLeft: "Opinions politiques de gauche",
      politicalRight: "Opinions politiques de droite",
      reasoning: "Raisonnement avancé",
      roleplay: "Jeu de rôle",
      roleplayDark: "Jeu de rôle sombre",
      smart: "Intelligent",
      uncensored: "Non censuré",
      violence: "Violence",
      vision: "Vision",
    },
    input: {
      attachments: {
        uploadFile: "Joindre des fichiers",
        attachedFiles: "Fichiers joints",
        addMore: "Ajouter",
      },
    },
  },

  search: {
    brave: {
      category: "Information",
      get: {
        title: "Rechercher sur le web",
        dynamicTitle: "Recherche : {{query}}",
        description:
          "Cherche sur Internet des informations à jour, des actualités, des faits ou des événements récents. À utiliser quand vous avez besoin d'informations récentes ou pour vérifier des faits.",
        form: {
          title: "Paramètres de recherche",
          description: "Configurez votre recherche web",
        },
        submitButton: {
          label: "Rechercher",
          loadingText: "Recherche...",
        },
        backButton: {
          label: "Retour",
        },
        fields: {
          query: {
            title: "Requête",
            description:
              "Requête claire et précise. Privilégiez les mots-clés plutôt que les questions.",
            placeholder: "Saisissez votre recherche...",
          },
          maxResults: {
            title: "Résultats max.",
            description: "Nombre de résultats à renvoyer (1 à 10)",
          },
          includeNews: {
            title: "Inclure les actualités",
            description:
              "Inclut des résultats d'actualité sur les événements en cours",
          },
          freshness: {
            title: "Fraîcheur",
            description: "Filtre les résultats selon leur date",
            options: {
              day: "Dernières 24 h",
              week: "Semaine passée",
              month: "Mois passé",
              year: "Année passée",
            },
          },
        },
        response: {
          success: {
            title: "Succès",
            description: "Indique si la recherche a réussi",
          },
          message: {
            title: "Message",
            description: "Message d'état de la recherche",
          },
          query: {
            title: "Requête",
            description: "La requête exécutée",
          },
          results: {
            title: "Résultats",
            description: "Liste des résultats de recherche",
            result: "Résultat",
            item: {
              title: "Résultat de recherche",
              description: "Résultat de recherche individuel",
              url: "URL",
              snippet: "Extrait",
              age: "Ancienneté",
              source: "Source",
            },
          },
          cached: {
            title: "En cache",
            description: "Indique si les résultats viennent du cache",
          },
          timestamp: {
            title: "Horodatage",
            description: "Moment où la recherche a été effectuée",
          },
        },
        errors: {
          queryEmpty: {
            title: "Requête obligatoire",
            description: "Saisissez une requête de recherche",
          },
          queryTooLong: {
            title: "Requête trop longue",
            description: "La requête doit faire 400 caractères au maximum",
          },
          timeout: {
            title: "Délai de recherche dépassé",
            description: "La recherche a pris trop de temps",
          },
          searchFailed: {
            title: "Échec de la recherche",
            description: "Une erreur est survenue pendant la recherche",
          },
          validation: {
            title: "Recherche non valide",
            description: "Vérifiez vos paramètres de recherche et réessayez",
          },
          internal: {
            title: "Un problème est survenu",
            description: "Impossible d'effectuer votre recherche. Réessayez",
          },
          notConfigured: {
            title:
              "Clé API {{label}} non configurée. Ajoutez {{envKey}}=<votre-clé> à votre fichier .env. Obtenez votre clé sur {{url}}",
            description: "Configurez {{label}} pour activer la recherche web",
          },
        },
        success: {
          title: "Recherche réussie",
          description: "La recherche web est terminée",
        },
      },
      tags: {
        search: "Recherche",
        web: "Web",
        internet: "Internet",
      },
    },
    kagi: {
      category: "Information",
      get: {
        title: "Rechercher avec Kagi",
        dynamicTitle: "Kagi : {{query}}",
        description:
          "Cherche sur Internet ou obtient des réponses générées par IA avec Kagi. Le mode FastGPT fournit des réponses complètes avec sources, le mode recherche renvoie des résultats directs.",
        form: {
          title: "Paramètres de recherche",
          description: "Configurez votre recherche Kagi",
        },
        submitButton: {
          label: "Rechercher",
          loadingText: "Recherche...",
        },
        backButton: {
          label: "Retour",
        },
        fields: {
          query: {
            title: "Requête",
            description: "Requête ou question claire et précise.",
            placeholder: "Saisissez votre recherche...",
          },
          mode: {
            title: "Mode de recherche",
            description:
              "Choisissez entre des réponses générées par IA (FastGPT) et des résultats de recherche directs",
            options: {
              fastgpt: "FastGPT (réponses par IA)",
              search: "Recherche (résultats directs)",
            },
          },
        },
        response: {
          success: {
            title: "Succès",
            description: "Indique si la recherche a réussi",
          },
          message: {
            title: "Message",
            description: "Message d'état de la recherche",
          },
          output: {
            title: "Réponse",
            description: "Réponse générée par FastGPT",
          },
          query: {
            title: "Requête",
            description: "La requête exécutée",
          },
          references: {
            title: "Références",
            description: "Sources et citations",
            reference: "Référence",
            item: {
              title: "Référence",
              description: "Source citée",
              url: "URL",
              snippet: "Extrait",
            },
          },
          cached: {
            title: "En cache",
            description: "Indique si les résultats viennent du cache",
          },
          timestamp: {
            title: "Horodatage",
            description: "Moment où la recherche a été effectuée",
          },
        },
        errors: {
          queryEmpty: {
            title: "Requête obligatoire",
            description: "Saisissez une requête de recherche",
          },
          queryTooLong: {
            title: "Requête trop longue",
            description: "La requête doit faire 400 caractères au maximum",
          },
          timeout: {
            title: "Délai de recherche dépassé",
            description: "La recherche a pris trop de temps",
          },
          searchFailed: {
            title: "Échec de la recherche",
            description: "Une erreur est survenue pendant la recherche",
          },
          validation: {
            title: "Recherche non valide",
            description: "Vérifiez vos paramètres de recherche et réessayez",
          },
          internal: {
            title: "Un problème est survenu",
            description: "Impossible d'effectuer votre recherche. Réessayez",
          },
          notConfigured: {
            title:
              "Clé API {{label}} non configurée. Ajoutez {{envKey}}=<votre-clé> à votre fichier .env. Obtenez votre clé sur {{url}}",
            description: "Configurez {{label}} pour activer la recherche Kagi",
          },
        },
        success: {
          title: "Recherche réussie",
          description: "La recherche Kagi est terminée",
        },
      },
      tags: {
        search: "Recherche",
        web: "Web",
        ai: "IA",
      },
    },
    enums: {
      provider: {
        BRAVE: "Brave Search",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
    category: "Agent",

    hotkey: {
      post: {
        title: "Raccourci de dictée vocale",
        titleShort: "Raccourci dictée",
        description:
          "Enregistrez et transcrivez l'audio, le texte s'insère automatiquement",
        form: {
          title: "Configuration du raccourci",
          description: "Configurez le raccourci de dictée vocale",
        },
        action: {
          label: "Action",
          description: "Action à exécuter (start/stop/toggle)",
          options: {
            start: "Démarrer",
            stop: "Arrêter",
            toggle: "Basculer",
            status: "Statut",
          },
        },
        provider: {
          label: "Fournisseur",
          description: "Fournisseur d'IA pour la transcription",
        },
        language: {
          label: "Langue",
          description: "Langue de l'audio",
        },
        insertPrefix: {
          label: "Préfixe à insérer",
          description: "Texte inséré avant la transcription",
          placeholder: "ex. '> '",
        },
        insertSuffix: {
          label: "Suffixe à insérer",
          description: "Texte inséré après la transcription",
          placeholder: "ex. ' '",
        },
        response: {
          title: "Résultat",
          description: "Résultat de l'enregistrement et de la transcription",
          success: "Succès",
          status: "Statut",
          message: "Message",
          text: "Texte transcrit",
          recordingDuration: "Durée d'enregistrement (ms)",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Connectez-vous pour utiliser cette fonction",
          },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête non valides",
          },
          server: {
            title: "Erreur serveur",
            description: "Impossible de traiter l'enregistrement",
          },
          conflict: {
            title: "Conflit",
            description: "Un enregistrement est déjà en cours",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Vous n'avez pas l'autorisation d'utiliser cette fonction",
          },
          network: {
            title: "Erreur réseau",
            description: "Impossible de joindre le service de transcription",
          },
          notFound: {
            title: "Introuvable",
            description: "Session introuvable",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Enregistrement en cours",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          dependenciesMissing:
            "Dépendances requises indisponibles : {missing}. {recommendations}",
          invalidAction: "Action non valide : {action}",
          actionFailed: "Échec de l'action : {error}",
          alreadyRecording: "Un enregistrement est déjà en cours",
          notRecording: "Aucun enregistrement en cours",
        },
        success: {
          title: "Succès",
          description: "Opération réussie",
        },
      },
      tags: {
        ai: "IA",
        transcription: "Transcription",
        speech: "Voix",
        hotkey: "Raccourci",
        cli: "CLI",
      },
      platforms: {
        macos: "macOS",
        linuxWayland: "Linux (Wayland)",
        linuxX11: "Linux (X11)",
        windows: "Windows",
      },
      status: {
        idle: "Inactif",
        recording: "Enregistrement",
        processing: "Traitement",
        completed: "Terminé",
        error: "Erreur",
      },
      actions: {
        start: "Démarrer l'enregistrement",
        stop: "Arrêter l'enregistrement",
        toggle: "Basculer l'enregistrement",
        status: "Vérifier le statut",
      },
      recorderBackends: {
        ffmpegAvfoundation: "FFmpeg (AVFoundation)",
        ffmpegPulse: "FFmpeg (PulseAudio)",
        ffmpegAlsa: "FFmpeg (ALSA)",
        ffmpegDshow: "FFmpeg (DirectShow)",
        wfRecorder: "wf-recorder",
        arecord: "arecord",
      },
      typerBackends: {
        applescript: "AppleScript",
        wtype: "wtype",
        xdotool: "xdotool",
        wlClipboard: "wl-clipboard",
        xclip: "xclip",
        powershell: "PowerShell",
      },
    },
    post: {
      title: "Transcription audio",
      description:
        "Convertit l'audio en texte par transcription IA. Facturé à la seconde d'audio, au tarif du modèle choisi",
      form: {
        title: "Transcription audio",
        description:
          "Envoyez un fichier audio à transcrire. Facturé à la seconde, au tarif du modèle choisi",
      },
      fileUpload: {
        title: "Envoi du fichier audio",
        description: "Envoyez votre fichier audio pour la transcription",
      },
      audio: {
        label: "Fichier audio",
        description: "Fichier audio à transcrire (MP3, WAV, WebM, etc.)",
        validation: {
          maxSize: "Le fichier doit faire moins de 25 Mo",
          audioOnly: "Envoyez un fichier audio ou vidéo",
        },
      },
      provider: {
        label: "Fournisseur",
        description: "Fournisseur d'IA pour la transcription",
      },
      language: {
        label: "Langue",
        description: "Langue de l'audio",
      },
      response: {
        title: "Résultat de la transcription",
        description: "Le texte transcrit de votre audio",
        success: "Succès",
        text: "Texte transcrit",
        provider: "Fournisseur utilisé",
        confidence: "Score de confiance",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Connectez-vous pour utiliser cette fonction",
        },
        validation: {
          title: "Erreur de validation",
          description: "Le fichier audio ou les paramètres ne sont pas valides",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de traiter la transcription",
        },
        apiKeyMissing: "Clé API Eden AI non configurée",
        transcriptionFailed: "Échec de la transcription : {{error}}",
        audioTooShort:
          "Enregistrement trop court. Maintenez le bouton plus longtemps et parlez distinctement.",
        noAudioFile: "Aucun fichier audio fourni",
        internalError: "Erreur interne du serveur",
        noPublicId: "Aucun identifiant public reçu",
        pollFailed: "Impossible de récupérer les résultats de la transcription",
        failed: "Échec de la transcription",
        timeout: "Délai de transcription dépassé",
        creditsFailed: "Échec du débit des crédits : {{error}}",
        providerError:
          "Erreur du service de transcription. Réessayez ou contactez le support si le problème persiste.",
        balanceCheckFailed:
          "Impossible de vérifier votre solde de crédits. Réessayez",
        insufficientCredits:
          "Crédits insuffisants pour cette transcription. Ajoutez des crédits pour continuer",
      },
      success: {
        title: "Succès",
        description: "Audio transcrit",
        transcriptionComplete: "Transcription terminée",
      },
    },
    providers: {
      openai: "OpenAI Whisper",
      assemblyai: "AssemblyAI",
      deepgram: "Deepgram",
      google: "Google Speech-to-Text",
      amazon: "Amazon Transcribe",
      microsoft: "Microsoft Azure",
      ibm: "IBM Watson",
      rev: "Rev.ai",
    },
    languages: {
      en: "Anglais",
      de: "Allemand",
      pl: "Polonais",
      es: "Espagnol",
      fr: "Français",
      it: "Italien",
    },
    models: {
      descriptions: {
        openaiWhisper:
          "La reconnaissance vocale Whisper d'OpenAI, entraînée sur 99 langues. Transcrit interviews, notes vocales et réunions, et gère bien les accents et le bruit de fond. Peu coûteux à l'usage. Pas d'identification des locuteurs, et sur de longs silences il peut inventer du texte. Pour une option OpenAI plus récente, essayez GPT-4o Mini Transcribe.",
        deepgramNova2:
          "Deepgram Nova-2 : transcription rapide et précise, résistante au bruit",
        whisperLargeV3:
          "Whisper Large V3 : modèle open-weight d'OpenAI, 99 langues, bien moins cher que whisper-1 hébergé.",
        voxtralMini:
          "Voxtral Mini Transcribe : transcription Mistral avec identification des locuteurs et horodatage par segment, jusqu'à 10 minutes.",
        nemotronAsr:
          "Nemotron ASR : reconnaissance vocale multilingue ouverte de NVIDIA, 40 variantes linguistiques, faible latence.",
        gpt4oMiniTranscribe:
          "GPT-4o Mini Transcribe : moins d'erreurs de mots que Whisper, meilleure détection de la langue.",
      },
    },
  },
  textToSpeech: {
    category: "Agent",
    tags: {
      speech: "Voix",
      tts: "Synthèse vocale",
      ai: "IA",
    },

    post: {
      title: "Synthèse vocale",
      description:
        "Convertit du texte en voix naturelle grâce à l'IA. Facturé au caractère, au tarif de la voix choisie",
      form: {
        title: "Conversion texte vers voix",
        description:
          "Saisissez le texte à convertir en voix. Facturé au caractère, au tarif de la voix choisie",
      },
      text: {
        label: "Texte",
        description: "Texte à convertir en voix",
        placeholder: "Saisissez le texte à faire lire...",
      },
      voice: {
        label: "Voix",
        description: "Modèle de voix pour la synthèse vocale",
      },
      response: {
        title: "Résultat audio",
        description: "L'audio généré",
        success: "Succès",
        audioUrl: "URL de l'audio",
      },
      errors: {
        validation_failed: {
          title: "Erreur de validation",
          description: "Le texte ou les paramètres fournis ne sont pas valides",
        },
        network_error: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Connectez-vous pour utiliser la synthèse vocale",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas l'autorisation d'utiliser la synthèse vocale",
        },
        not_found: {
          title: "Introuvable",
          description: "La ressource demandée est introuvable",
        },
        server_error: {
          title: "Erreur serveur",
          description: "Une erreur est survenue pendant la synthèse vocale",
        },
        unknown_error: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsaved_changes: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit est survenu",
        },
        notConfigured:
          "Clé API {{label}} non configurée. Ajoutez {{envKey}}=<votre-clé> à votre fichier .env. Obtenez votre clé sur {{url}}",
        conversionFailed: "Échec de la synthèse vocale : {{error}}",
        noText: "Aucun texte fourni",
        noAudioUrl: "Le fournisseur n'a renvoyé aucune URL audio",
        audioFetchFailed: "Impossible de créer le fichier audio. Réessayez",
        providerError: "Erreur du fournisseur : {{error}}",
        internalError: "Erreur interne du serveur",
        unsupportedProvider:
          "Fournisseur de synthèse vocale non pris en charge pour la voix : {{voiceId}}",
        creditsFailed: "Échec du débit des crédits : {{error}}",
        balanceCheckFailed:
          "Impossible de vérifier votre solde de crédits. Réessayez",
        insufficientCredits:
          "Crédits insuffisants pour cette conversion. Ajoutez des crédits pour continuer",
      },
      success: {
        title: "Succès",
        description: "Texte converti en voix",
        conversionComplete: "Synthèse vocale terminée",
      },
    },
    languages: {
      en: "Anglais",
      de: "Allemand",
      pl: "Polonais",
      es: "Espagnol",
      fr: "Français",
      it: "Italien",
    },
    models: {
      descriptions: {
        openaiAlloy:
          "La voix Alloy d'OpenAI. Équilibrée et neutre, ni franchement masculine ni féminine, au débit régulier. Pour la narration, les vidéos explicatives et les contenus professionnels où la voix doit rester discrète. Coûte une infime fraction de centime. Moins chaleureuse que Nova, moins grave qu'Onyx.",
        openaiNova:
          "La voix Nova d'OpenAI. Lumineuse, chaleureuse et amicale, au timbre féminin. Pour les assistants, les applis conversationnelles et les lectures enjouées. Très bon marché. Moins adaptée aux textes graves ou formels : Onyx s'en charge mieux.",
        openaiOnyx:
          "La voix Onyx d'OpenAI. Voix masculine grave, calme et posée. Pour les documentaires, la narration formelle et les annonces. Très bon marché. Peut paraître lourde pour une discussion détendue : Nova est le choix plus léger et plus amical.",
        openaiEcho:
          "OpenAI Echo : voix claire et bien articulée, au rythme naturel",
        openaiShimmer:
          "OpenAI Shimmer : voix expressive et dynamique qui capte l'attention",
        openaiFable: "OpenAI Fable : voix expressive de conteur",
        elevenlabsRachel:
          "ElevenLabs Rachel : voix féminine naturelle, riche en émotions",
        elevenlabsJosh:
          "ElevenLabs Josh : voix masculine naturelle, ton de conversation",
        elevenlabsBella:
          "ElevenLabs Bella : voix féminine chaleureuse, diction douce",
        elevenlabsAdam:
          "ElevenLabs Adam : voix masculine professionnelle pour la création de contenu",
        kokoroBella:
          "Kokoro Bella : modèle open-weight de 82M, voix féminine américaine chaleureuse. Aucun filtre de contenu.",
        kokoroSarah:
          "Kokoro Sarah : modèle open-weight de 82M, voix féminine américaine claire. Aucun filtre de contenu.",
        kokoroNicole:
          "Kokoro Nicole : modèle open-weight de 82M, voix féminine douce et feutrée. Aucun filtre de contenu.",
        kokoroAdam:
          "Kokoro Adam : modèle open-weight de 82M, voix masculine américaine posée. Aucun filtre de contenu.",
        kokoroMichael:
          "Kokoro Michael : modèle open-weight de 82M, voix masculine américaine assurée. Aucun filtre de contenu.",
        kokoroEmma:
          "Kokoro Emma : modèle open-weight de 82M, voix féminine britannique. Aucun filtre de contenu.",
        kokoroGeorge:
          "Kokoro George : modèle open-weight de 82M, voix masculine britannique. Aucun filtre de contenu.",
        inworldAshley:
          "Inworld Ashley : voix féminine rapide et bon marché, diction vive.",
        inworldCraig:
          "Inworld Craig : voix masculine britannique rapide et bon marché.",
        xaiEve:
          "xAI Eve : voix féminine expressive, émotions réglables dans le texte.",
        geminiZephyr:
          "Gemini Zephyr : voix féminine lumineuse, plus de 100 langues, consignes de diction.",
        geminiPuck:
          "Gemini Puck : voix masculine enjouée, plus de 100 langues, consignes de diction.",
      },
    },
  },
};
