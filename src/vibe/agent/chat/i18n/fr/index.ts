import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    permissions: "Permissions",
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
    threadModerationStatus: {
      visible: "Visible",
      underReview: "En cours d'examen",
      removed: "Supprimé",
    },
    threadReportReason: {
      spam: "Spam",
      illegal: "Contenu illégal",
      abuse: "Abus ou harcèlement",
      csamFlag: "Risque pour la protection des mineurs",
      other: "Autre",
    },
    threadModerationAction: {
      dismiss: "Rejeter les signalements (rétablir)",
      remove: "Supprimer le contenu",
      banAuthor: "Supprimer et bannir l'auteur",
    },
    threadStatus: {
      active: "Actif",
      archived: "Archivé",
      deleted: "Supprimé",
    },
    viewMode: {
      linear: "Linéaire",
      threaded: "Arborescente",
      flat: "À plat",
      debug: "Débogage",
    },
  },
  components: {
    sidebar: {
      login: "Se connecter",
      logout: "Se déconnecter",
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
          "Inscrivez-vous ou connectez-vous pour accéder aux dossiers privés et partagés. Vos discussions seront synchronisées sur tous vos appareils.",
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
          "Votre plateforme d'IA respectueuse de la vie privée : {{modelCount}} modèles, un filtrage du contenu que vous contrôlez et la liberté d'expression comme principe.",
        subtitle: "Une visite rapide pour bien démarrer.",
      },
      aiCompanion: {
        title: "Choisissez votre compagnon IA",
        description:
          "Choisissez parmi {{modelCount}} modèles d'IA : grand public, open source et non censurés.",
        tip: "Cliquez pour ouvrir le sélecteur de modèle et choisir votre compagnon.",
      },
      rootFolders: {
        title: "Vos dossiers de discussion",
        description:
          "Organisez vos discussions dans différents dossiers, chacun avec ses propres règles de confidentialité :",
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
        name: "Dossier privé",
        suffix: "",
        description:
          "Vos discussions privées ne sont visibles que par vous. Idéal pour les sujets sensibles.",
      },
      incognitoFolder: {
        name: "Dossier incognito",
        suffix: "",
        description:
          "Discutez sans enregistrer l'historique sur le serveur. Les messages sont stockés localement dans votre navigateur et y restent jusqu'à ce que vous les effaciez.",
        note: "Aucune donnée n'est stockée sur nos serveurs pendant les sessions incognito (les médias générés sont stockés temporairement pour des raisons techniques).",
      },
      sharedFolder: {
        name: "Dossier partagé",
        suffix: "",
        description:
          "Collaborez avec des personnes précises en leur donnant accès à ce dossier.",
      },
      publicFolder: {
        name: "Dossier public",
        suffix: "",
        description:
          "Partagez vos conversations avec l'IA avec le monde entier. Les autres peuvent consulter et dupliquer vos fils.",
        note: "Tout ce qui se trouve dans Public est visible par tous les utilisateurs et les moteurs de recherche.",
      },
      newChatButton: {
        title: "Lancer une nouvelle discussion",
        description:
          "Cliquez ici pour démarrer une nouvelle conversation dans n'importe quel dossier.",
      },
      sidebarLogin: {
        title: "Connectez-vous pour aller plus loin",
        description:
          "Créez un compte gratuit pour accéder aux dossiers privés et partagés, synchroniser votre historique sur tous vos appareils et laisser l'IA se souvenir de vous.",
        tip: "L'inscription est gratuite !",
      },
      subscriptionButton: {
        title: "Crédits et abonnement",
        description:
          "Obtenez {{credits}} crédits par mois avec un abonnement à seulement {{price}} par mois. Les comptes gratuits reçoivent {{freeCredits}} crédits par mois, {{freeCreditsMax}} avec la newsletter.",
      },
      chatInput: {
        title: "Écrivez votre message",
        description:
          "Écrivez votre message ici et appuyez sur Entrée ou cliquez sur Envoyer pour discuter avec votre compagnon IA.",
        tip: "Maj+Entrée pour aller à la ligne. Vous pouvez aussi joindre des fichiers et des images.",
      },
      voiceInput: {
        title: "Saisie vocale",
        description: "Parlez à votre compagnon IA avec votre micro :",
        options: {
          transcribe: "Transcrire la parole en texte",
          sendAudio: "Envoyer l'audio directement à l'IA",
          pauseResume: "Mettre en pause et reprendre l'enregistrement",
        },
      },
      callMode: {
        title: "Mode appel",
        description:
          "Activez le mode appel pour une conversation vocale mains libres, avec des réponses de l'IA en temps réel.",
        tip: "Idéal en déplacement ou si vous préférez parler plutôt qu'écrire.",
      },
      complete: {
        title: "Tout est prêt !",
        description:
          "Visite terminée ! Commencez dès maintenant à discuter avec votre compagnon IA.",
        help: "Besoin d'aide ? Cliquez à tout moment sur l'icône point d'interrogation dans la barre latérale.",
      },
      authUnlocked: {
        unlocked: "Débloqué !",
        privateDescription:
          "Votre dossier privé est maintenant disponible. Toutes les discussions qu'il contient ne sont visibles que par vous.",
        privateNote:
          "Les discussions privées se synchronisent automatiquement sur tous vos appareils.",
        sharedDescription:
          "Votre dossier partagé est maintenant disponible. Invitez d'autres personnes à collaborer sur vos conversations avec l'IA.",
        sharedNote: "Vous décidez qui a accès à vos dossiers et fils partagés.",
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
    manualModeDescription: "Choisissez vous-même un modèle précis",
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
    createCustom: "Créer le vôtre",
    customizeSettings: "Personnaliser les paramètres",
    requirements: {
      characterConflict: "Exigences du skill en conflit",
      tooLow: "trop bas",
      tooHigh: "trop élevé",
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
      answerAsAI: "Répondre avec un modèle d'IA",
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
            placeholder: "Nom du skill",
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
            placeholder: "Nom de la catégorie",
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
    answerAsAI: "Répondre avec un modèle d'IA",
    retry: "Réessayer avec un autre modèle ou skill",
    branch: "Créer une branche de la conversation à partir d'ici",
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
    capture: "Prendre une capture d'écran",
    failed: "Échec de la capture d'écran",
    failedWithMessage: "Échec de la capture d'écran : {{message}}",
    tryAgain: "Échec de la capture d'écran. Réessayez.",
    noMessages:
      "Zone des messages introuvable. Vérifiez que la discussion contient des messages.",
    quotaExceeded:
      "Quota de stockage dépassé. La capture d'écran est trop volumineuse.",
    canvasError: "Impossible de convertir la capture d'écran en image.",
  },
  errors: {
    noResponse:
      "Aucune réponse reçue de l'IA. La requête a abouti mais le contenu est vide. Réessayez.",
    noStream: "Échec du streaming de la réponse : aucun lecteur disponible",
    saveFailed: "Impossible d'enregistrer la modification",
    branchFailed: "Impossible de créer la branche",
    retryFailed: "Impossible de réessayer",
    answerFailed: "Impossible de répondre",
    deleteFailed: "Impossible de supprimer",
  },
  errorTypes: {
    streamError: "Erreur de streaming",
  },
  hooks: {
    stt: {
      "endpoint-not-available":
        "Endpoint de reconnaissance vocale indisponible",
      "failed-to-start": "Impossible de démarrer l'enregistrement",
      "permission-denied":
        "Accès au micro bloqué. Autorisez le micro dans les paramètres de votre navigateur et rechargez la page.",
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
        "Modèle d'IA non censuré pour des conversations créatives et sans restrictions",
      freedomgptLiberty:
        "FreedomGPT Liberty - Modèle d'IA non censuré axé sur la liberté d'expression et le contenu créatif",
      gabAiArya:
        "Gab AI Arya - Modèle conversationnel non censuré, libre dans l'expression et doué pour la création",
      gemini31ProPreviewCustomTools:
        "Gemini 3.1 Pro Preview (Custom Tools) - Variante de Gemini 3.1 Pro avec une meilleure sélection d'outils, qui évite d'abuser des outils bash au profit de fonctions tierces plus efficaces. Idéale pour les agents de code et les workflows multi-outils",
      gemini31FlashImagePreview:
        "Gemini 3.1 Flash Image Preview - Modèle multimodal de Google qui génère des images directement depuis des prompts texte dans le chat, avec sortie texte et image dans la même conversation",
      gemini31FlashLitePreview:
        "Gemini 3.1 Flash Lite Preview - Modèle très efficace de Google optimisé pour les gros volumes. Surpasse Gemini 2.5 Flash Lite en audio, classement RAG, traduction et complétion de code",
      gemini3Pro:
        "Google Gemini 3 Pro - Modèle multimodal avancé avec une grande fenêtre de contexte et un raisonnement puissant",
      gemini35Flash:
        "Gemini 3.5 Flash - Code et raisonnement proches de Pro au prix de Flash. Gère texte, images, vidéo, audio et PDF. Boucles agentiques parallèles intégrées. Niveaux de réflexion de minimal à élevé pour doser précisément coût et performance.",
      gemini3Flash:
        "Google Gemini 3 Flash - Modèle multimodal rapide et efficace, optimisé pour des réponses rapides",
      deepseekV32:
        "DeepSeek V3.2 - Modèle de raisonnement performant aux capacités de code avancées",
      deepseekV4Pro:
        "DeepSeek V4 Pro - Mastodonte MoE de 1,6T paramètres avec 1M de contexte. Conçu pour analyser des bases de code entières, le raisonnement complexe et les workflows d'agents en plusieurs étapes.",
      deepseekV4Flash:
        "DeepSeek V4 Flash - MoE de 284B pour un coût quasi nul. 1M de contexte, inférence rapide, bon en code. Le choix efficace pour les charges à haut débit.",
      gpt55:
        "GPT-5.5 - Modèle de pointe d'OpenAI pour les charges professionnelles complexes. Raisonnement plus solide, fiabilité accrue, meilleure efficacité en tokens. Plus de 1M de contexte, entrées texte et image.",
      gpt55Pro:
        "GPT-5.5 Pro - Le modèle le plus capable d'OpenAI pour le raisonnement approfondi sur des tâches complexes à fort enjeu. Plus de 1M de contexte, résolution de problèmes sur le long terme, code agentique, exécution précise en plusieurs étapes.",
      gpt54Pro:
        "GPT-5.4 Pro - Le modèle le plus avancé d'OpenAI : raisonnement renforcé, plus de 1M de contexte et performances supérieures pour les tâches complexes à fort enjeu",
      gpt54:
        "GPT-5.4 - Dernier modèle de pointe d'OpenAI, qui réunit Codex et GPT, avec plus de 1M de contexte pour le raisonnement sur de gros contextes, le code et l'analyse multimodale",
      gpt53Codex:
        "GPT-5.3-Codex - Le modèle de code agentique le plus avancé d'OpenAI. Allie ingénierie logicielle de pointe et raisonnement large, optimisé pour les longs workflows avec outils et les tâches de développement complexes",
      gpt53Chat:
        "GPT-5.3 Chat - Modèle conversationnel ChatGPT mis à jour : réponses plus précises et contextuelles, avec nettement moins de refus et de mises en garde inutiles",
      gpt52Pro:
        "GPT-5.2 Pro - Modèle OpenAI avancé au raisonnement et au code renforcés",
      gpt52:
        "GPT-5.2 - Modèle OpenAI performant pour les tâches complexes et l'analyse",
      gpt52_chat: "GPT-5.2 Chat - Modèle OpenAI optimisé pour la conversation",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Grand modèle de langage non censuré basé sur Mistral",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Grand modèle de langage non censuré basé sur Llama 3",
      veniceUncensored:
        "Venice Uncensored 1.1 - Le modèle le plus non censuré, avec appel d'outils. Conçu pour une liberté créative maximale et des échanges authentiques. Idéal pour l'exploration libre, le jeu de rôle et le dialogue sans filtre, avec un minimum de restrictions.",
      claudeOpus45:
        "Claude Opus 4.5 - Le Claude le plus puissant, au raisonnement et à la créativité exceptionnels",
      claudeOpus46:
        "Claude Opus 4.6 - Claude puissant, au raisonnement et à la créativité exceptionnels",
      claudeOpus47:
        "Claude Opus 4.7 - Opus de génération précédente. Remplacé par la 4.8.",
      claudeOpus48:
        "Claude Opus 4.8 - L'Opus le plus capable d'Anthropic en disponibilité générale. Conçu pour le travail agentique de longue haleine, le code complexe et le raisonnement en plusieurs étapes sur de très longues sorties. Contexte de 1M tokens. Entrées texte, image et fichier.",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Le Sonnet le plus capable d'Anthropic, avec des performances de pointe en code, agents et travail professionnel",
      claudeHaiku45:
        "Claude Haiku 4.5 - Claude rapide et efficace, optimisé pour la vitesse et le coût",
      glm5_1:
        "GLM-5.1 - Modèle de code nouvelle génération de Z.AI, conçu pour les tâches de longue haleine. Travaille en autonomie plus de 8 heures sur une même tâche : il planifie, exécute et s'améliore jusqu'à livrer un résultat de niveau ingénierie.",
      glm5: "GLM-5 - Modèle de fondation open source phare de Z.AI, conçu pour la conception de systèmes complexes et les workflows d'agents de longue haleine. Rivalise avec les meilleurs modèles fermés",
      glm5Turbo:
        "GLM-5 Turbo - Modèle nouvelle génération de Z.AI, profondément optimisé pour les environnements pilotés par des agents : inférence rapide, meilleure décomposition des instructions complexes et stabilité accrue sur les longues tâches",
      glm46:
        "GLM-4 6B - Modèle bilingue chinois-anglais efficace, aux bonnes capacités générales",
      glm47:
        "GLM-4 7B - Modèle bilingue chinois-anglais avancé, au raisonnement et au code améliorés",
      glm47Flash:
        "GLM-4 7B Flash - Modèle chinois-anglais ultra-rapide, optimisé pour des réponses rapides",
      kimiK2:
        "Kimi K2 - Puissant modèle d'IA chinois, excellent dans la compréhension du contexte",
      kimiK2_5:
        "Kimi K2.5 - Modèle de génération précédente de Moonshot AI, solide en raisonnement sur long contexte et en code",
      kimiK2_6:
        "Kimi K2.6 - Modèle multimodal nouvelle génération de Moonshot AI pour le code de longue haleine, la génération d'UI/UX à partir de prompts et d'images, et l'orchestration multi-agents, avec une architecture en essaim capable de gérer des centaines de sous-agents en parallèle",
      claudeSonnet45:
        "Claude Sonnet 4.5 - Sonnet de génération précédente d'Anthropic, solide en code et en analyse",
      claudeAgentSonnet:
        "Claude Agent Sonnet - Agent IA autonome propulsé par Claude Sonnet via l'Agent SDK d'Anthropic. Exécute les outils de façon autonome, avec raisonnement intégré.",
      claudeAgentHaiku:
        "Claude Agent Haiku - Agent IA autonome rapide propulsé par Claude Haiku via l'Agent SDK d'Anthropic. Optimisé pour la vitesse, avec exécution d'outils.",
      claudeAgentOpus:
        "Claude Agent Opus - L'agent IA autonome le plus puissant, propulsé par Claude Opus via l'Agent SDK d'Anthropic. Intelligence maximale, avec exécution d'outils.",
      grok4:
        "Grok 4 - Modèle de raisonnement phare de xAI, avec vision et recherche web",
      grok4Fast:
        "Grok 4 Fast - Modèle ultra-rapide de xAI avec 2M tokens de contexte, optimisé pour des réponses rapides",
      grok43:
        "Grok 4.3 - Modèle de raisonnement de xAI avec 1M tokens de contexte, grande exactitude factuelle et raisonnement permanent pour les workflows agentiques et la recherche approfondie",
      grok420Beta:
        "Grok 4.20 (ancien) - Ancien modèle phare de xAI, avec appel d'outils agentique, faible taux d'hallucination et 2M tokens de contexte",
      gpt5Pro:
        "GPT-5 Pro - Modèle premium d'OpenAI, raisonnement haut de gamme et code avancé",
      gpt5Codex:
        "GPT-5 Codex - Modèle de code spécialisé d'OpenAI, exceptionnel en programmation et en technique",
      gpt51Codex:
        "GPT 5.1 Codex - Modèle de code OpenAI mis à jour, plus créatif et meilleur en programmation",
      gpt51:
        "GPT 5.1 - Modèle généraliste efficace d'OpenAI, solide en raisonnement et en analyse",
      gpt5: "GPT-5 - Modèle phare d'OpenAI, à l'intelligence large et polyvalente",
      gpt54Mini:
        "GPT-5.4 Mini - Variante efficace de GPT-5.4, optimisée pour les gros volumes : raisonnement, code et outils solides à moindre coût",
      gpt54Nano:
        "GPT-5.4 Nano - Le modèle le plus léger et le plus économique d'OpenAI, optimisé pour les tâches où la vitesse compte : classification, extraction de données, exécution de sous-agents",
      gpt5Mini:
        "GPT-5 Mini - Modèle léger et rapide d'OpenAI pour les tâches du quotidien",
      gpt5Nano:
        "GPT-5 Nano - Le plus petit et le plus abordable des modèles OpenAI, pour les conversations simples",
      gptOss120b:
        "GPT-OSS 120B - Modèle open source de 120B paramètres d'OpenAI, solide en code",
      kimiK2Thinking:
        "Kimi K2 Thinking - Modèle de Kimi axé sur le raisonnement, avec une analyse renforcée étape par étape",
      minimaxM27:
        "MiniMax M2.7 - Modèle agentique nouvelle génération de MiniMax, conçu pour la productivité autonome en conditions réelles, la collaboration multi-agents et les workflows de production : débogage de code, modélisation financière, génération de documents",
      mimoV2Pro:
        "MiMo V2 Pro - Modèle de fondation phare de Xiaomi, plus de 1T paramètres et 1M de contexte, profondément optimisé pour l'orchestration d'agents, l'automatisation de workflows complexes et les tâches d'ingénierie en production",
      glm45Air:
        "GLM 4.5 AIR - Modèle léger ultra-rapide de Z.AI pour des conversations rapides",
      glm45v:
        "GLM 4.5v - Modèle de Z.AI doté de la vision, qui comprend les images et sait discuter",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite - Gemini d'entrée de gamme de Google, grand contexte et réponses rapides",
      geminiFlash25Flash:
        "Gemini 2.5 Flash - Modèle multimodal efficace de Google avec 1M tokens de contexte pour les tâches rapides",
      geminiFlash25Pro:
        "Gemini 2.5 Pro - Modèle Pro de génération précédente de Google, grand contexte et raisonnement solide",
      deepseekV31:
        "DeepSeek V3.1 - Modèle de génération précédente de DeepSeek, solide en code et en analyse",
      deepseekR1:
        "DeepSeek R1 - Modèle de DeepSeek axé sur le raisonnement, avec une résolution de problèmes avancée étape par étape",
      qwen3235bFree:
        "Qwen3 235B - Grand modèle ouvert d'Alibaba, 235B paramètres, pour le code complexe et le raisonnement",
      deepseekR1Distill:
        "DeepSeek R1 Distill - Version distillée et compacte de DeepSeek R1, au raisonnement efficace",
      qwen257b:
        "Qwen 2.5 7B - Modèle compact de 7B d'Alibaba, pour des conversations rapides et abordables",
      dallE3:
        "DALL-E 3 - Modèle de génération d'images d'OpenAI : images détaillées et de haute qualité à partir de prompts texte",
      gptImage1:
        "GPT-Image-1 - Modèle de génération d'images rapide et abordable d'OpenAI",
      fluxSchnell:
        "Flux Schnell - Modèle de génération d'images de Black Forest Labs, optimisé pour la vitesse",
      fluxPro:
        "Flux Pro 1.1 - Modèle de génération d'images professionnel de Black Forest Labs, qualité supérieure et grande fidélité au prompt",
      flux2Max:
        "FLUX.2 Max - Le modèle d'image haut de gamme de Black Forest Labs : la meilleure qualité d'image, compréhension du prompt et cohérence en édition",
      flux2Klein4b:
        "FLUX.2 Klein 4B - Le modèle d'image le plus rapide et le plus économique de Black Forest Labs, optimisé pour les gros volumes",
      riverflowV2Pro:
        "Riverflow V2 Pro - Le modèle de génération d'images le plus puissant de Sourceful, contrôle haut de gamme et rendu du texte parfait",
      riverflowV2Fast:
        "Riverflow V2 Fast - Le modèle de génération d'images le plus rapide de Sourceful, optimisé pour la production et les workflows sensibles à la latence",
      riverflowV2MaxPreview:
        "Riverflow V2 Max Preview - La variante preview la plus puissante de Sourceful, modèle unifié texte-vers-image et image-vers-image",
      riverflowV2StandardPreview:
        "Riverflow V2 Standard Preview - Variante preview standard de Sourceful, modèle unifié texte-vers-image et image-vers-image qui dépasse la famille Riverflow 1",
      riverflowV2FastPreview:
        "Riverflow V2 Fast Preview - La variante preview la plus rapide de Sourceful, modèle unifié texte-vers-image et image-vers-image au prix le plus bas",
      flux2Flex:
        "FLUX.2 Flex - Modèle d'image de Black Forest Labs excellent pour le rendu de texte complexe, la typographie et l'édition multi-références dans une architecture unifiée",
      flux2Pro:
        "FLUX.2 Pro - Modèle haut de gamme de génération et d'édition d'images de Black Forest Labs : qualité visuelle de pointe, grande fidélité au prompt et personnages reproduits de façon cohérente",
      gemini3ProImagePreview:
        "Nano Banana Pro (Gemini 3 Pro Image Preview) - Le modèle de génération d'images le plus avancé de Google : raisonnement multimodal amélioré, ancrage dans le réel, synthèse visuelle haute fidélité et rendu du texte de référence",
      gpt5ImageMini:
        "GPT-5 Image Mini - Modèle multimodal efficace d'OpenAI qui combine le langage de GPT-5 Mini et une génération d'images rapide et abordable",
      gpt5Image:
        "GPT-5 Image - Modèle multimodal phare d'OpenAI qui combine le langage de GPT-5 et une génération et édition d'images de pointe",
      gpt54Image2:
        "GPT-5.4 Image 2 - Modèle multimodal nouvelle génération d'OpenAI qui combine le raisonnement de GPT-5.4 et la génération de GPT Image 2. Passe sans accroc du code à l'analyse puis à la création visuelle dans une même conversation.",
      seedream45:
        "Seedream 4.5 - Dernier modèle de génération d'images de ByteDance, nettement amélioré en cohérence d'édition, retouche de portraits et composition multi-images",
      sdxl: "Stable Diffusion XL - Modèle ouvert de génération d'images de haute qualité de Stability AI",
      cassetteMusic:
        "CassetteAI Music - Génération rapide de musique à partir de texte sur Fal.ai, morceaux jusqu'à trois minutes",
      musicgenStereo:
        "MusicGen Stereo - Modèle open source de génération de musique stéréo de Meta, via Replicate",
      stableAudio:
        "Stable Audio - Modèle de génération de musique et d'audio de Stability AI pour des extraits de haute qualité",
      udioV2:
        "Udio v2 - Génération de musique par IA de haute qualité, avec voix et production complète",
      modelsLabMusicGen:
        "ModelsLab Music Gen - Génération de musique par IA à partir de prompts texte, sortie MP3/WAV/FLAC",
      modelsLabElevenlabsMusic:
        "ElevenLabs Music - Génération de musique de haute qualité propulsée par ElevenLabs via ModelsLab",
      modelsLabSonautoSong:
        "Sonauto Song - Génération de chansons complètes avec voix, de nombreux genres, morceaux jusqu'à 4:45 min",
      modelsLabLyria3:
        "Lyria 3 - Modèle avancé de génération de musique de Google, crée des morceaux originaux de 30 secondes à partir de texte",
      modelsLabCogVideoX:
        "CogVideoX - Modèle texte-vers-vidéo de ModelsLab pour générer de courts clips",
      modelsLabWanx:
        "Wanx - Modèle de génération texte-vers-vidéo de ModelsLab",
      modelsLabWan22:
        "Wan 2.2 Ultra - Modèle texte-vers-vidéo de haute qualité de ModelsLab",
      modelsLabWan21:
        "Wan 2.1 Ultra - Modèle texte-vers-vidéo de ModelsLab, qualité améliorée",
      modelsLabWan25T2V:
        "Wan 2.5 T2V - Modèle texte-vers-vidéo Wan 2.5 de ModelsLab",
      modelsLabWan25I2V:
        "Wan 2.5 I2V - Modèle image-vers-vidéo Wan 2.5 de ModelsLab",
      modelsLabWan27T2V:
        "Wan 2.7 T2V - Dernier modèle texte-vers-vidéo Wan 2.7 d'Alibaba, formats d'image flexibles et sortie 1080p",
      modelsLabWan26T2V:
        "Wan 2.6 T2V - Modèle texte-vers-vidéo Wan 2.6 de ModelsLab",
      modelsLabWan26I2V:
        "Wan 2.6 I2V - Modèle image-vers-vidéo Wan 2.6 de ModelsLab",
      modelsLabWan26I2VFlash:
        "Wan 2.6 I2V Flash - Modèle image-vers-vidéo Wan 2.6 rapide de ModelsLab",
      modelsLabSeedanceT2V:
        "Seedance T2V - Modèle texte-vers-vidéo de BytePlus",
      modelsLabSeedanceI2V:
        "Seedance I2V - Modèle image-vers-vidéo de BytePlus",
      modelsLabOmnihuman:
        "Omnihuman - Modèle de génération de vidéos de personnes de BytePlus",
      modelsLabSeedance1ProI2V:
        "Seedance 1.0 Pro I2V - Modèle image-vers-vidéo professionnel de BytePlus",
      modelsLabSeedance1ProFastI2V:
        "Seedance 1.0 Pro Fast I2V - Modèle image-vers-vidéo professionnel rapide de BytePlus",
      modelsLabSeedance1ProFastT2V:
        "Seedance 1.0 Pro Fast T2V - Modèle texte-vers-vidéo professionnel rapide de BytePlus",
      modelsLabOmnihuman15:
        "Omnihuman 1.5 - Modèle amélioré de génération de vidéos de personnes de BytePlus",
      modelsLabSeedance15Pro:
        "Seedance 1.5 Pro - Modèle avancé de génération vidéo de BytePlus",
      modelsLabVeo2:
        "Veo 2 - Modèle de génération vidéo de haute qualité de Google, via ModelsLab",
      modelsLabVeo3:
        "Veo 3 - Dernier modèle de génération vidéo de Google, via ModelsLab",
      modelsLabVeo3Fast:
        "Veo 3 Fast - Modèle de génération vidéo rapide de Google, via ModelsLab",
      modelsLabVeo3FastPreview:
        "Veo 3 Fast Preview - Modèle preview de génération vidéo rapide de Google, via ModelsLab",
      modelsLabVeo31:
        "Veo 3.1 - Version améliorée de Veo 3 de Google, via ModelsLab",
      modelsLabVeo31Fast:
        "Veo 3.1 Fast - Modèle de génération vidéo Veo 3.1 rapide de Google, via ModelsLab",
      modelsLabKlingV21I2V:
        "Kling V2.1 I2V - Modèle image-vers-vidéo de Kling AI, version 2.1",
      modelsLabKlingV25TurboI2V:
        "Kling V2.5 Turbo I2V - Modèle image-vers-vidéo turbo de Kling AI, version 2.5",
      modelsLabKlingV25TurboT2V:
        "Kling V2.5 Turbo T2V - Modèle texte-vers-vidéo turbo de Kling AI, version 2.5",
      modelsLabKlingV2MasterT2V:
        "Kling V2 Master T2V - Modèle texte-vers-vidéo de qualité master de Kling AI",
      modelsLabKlingV2MasterI2V:
        "Kling V2 Master I2V - Modèle image-vers-vidéo de qualité master de Kling AI",
      modelsLabKlingV21MasterT2V:
        "Kling V2.1 Master T2V - Modèle texte-vers-vidéo de qualité master de Kling AI, v2.1",
      modelsLabKlingV21MasterI2V:
        "Kling V2.1 Master I2V - Modèle image-vers-vidéo de qualité master de Kling AI, v2.1",
      modelsLabKlingV16MultiI2V:
        "Kling V1.6 Multi I2V - Modèle multi-images-vers-vidéo de Kling AI, version 1.6",
      modelsLabKling30T2V:
        "Kling 3.0 T2V - Modèle texte-vers-vidéo de Kling AI, version 3.0",
      modelsLabLtx2ProT2V:
        "LTX 2 PRO T2V - Modèle texte-vers-vidéo professionnel de LTX",
      modelsLabLtx2ProI2V:
        "LTX 2 PRO I2V - Modèle image-vers-vidéo professionnel de LTX",
      modelsLabLtx23ProI2V:
        "LTX 2.3 Pro I2V - Modèle image-vers-vidéo professionnel amélioré de LTX",
      modelsLabHailuo23T2V:
        "Hailuo 2.3 T2V - Modèle texte-vers-vidéo de MiniMax, version 2.3",
      modelsLabHailuo02T2V:
        "Hailuo 02 T2V - Modèle texte-vers-vidéo 02 de MiniMax",
      modelsLabHailuo23I2V:
        "Hailuo 2.3 I2V - Modèle image-vers-vidéo de MiniMax, version 2.3",
      modelsLabHailuo23FastI2V:
        "Hailuo 2.3 Fast I2V - Modèle image-vers-vidéo rapide de MiniMax, version 2.3",
      modelsLabHailuo02I2V:
        "Hailuo 02 I2V - Modèle image-vers-vidéo 02 de MiniMax",
      modelsLabHailuo02StartEnd:
        "Hailuo 02 Start/End - Modèle de MiniMax qui génère une vidéo à partir d'une image de début et de fin",
      modelsLabSora2:
        "Sora 2 - Modèle de génération vidéo Sora 2 d'OpenAI, via ModelsLab",
      modelsLabSora2Pro:
        "Sora 2 Pro - Modèle de génération vidéo Sora 2 Pro d'OpenAI, via ModelsLab",
      modelsLabGen4Aleph:
        "Gen4 Aleph - Modèle de génération vidéo Gen4 Aleph de Runway, via ModelsLab",
      modelsLabLipsync2:
        "Lipsync 2 - Modèle de synchronisation labiale vidéo de Sync",
      modelsLabGrokT2V:
        "Grok T2V - Modèle texte-vers-vidéo Grok de xAI, via ModelsLab",
      modelsLabGrokI2V:
        "Grok I2V - Modèle image-vers-vidéo Grok de xAI, via ModelsLab",
      klingV30Std:
        "Kling 3.0 Standard - Modèle vidéo standard de Kuaishou, T2V et I2V, via OpenRouter",
      klingVideoO1:
        "Kling Video O1 - Modèle de génération vidéo de Kuaishou renforcé par le raisonnement, via OpenRouter",
      veo31Lite:
        "Veo 3.1 Lite - Modèle vidéo économique de Google pour les gros volumes, via OpenRouter",
      seedance2:
        "Seedance 2.0 - Modèle vidéo nouvelle génération de ByteDance, cohérence des personnages et vidéo à partir de références, via OpenRouter",
      seedance2Fast:
        "Seedance 2.0 Fast - Modèle de génération vidéo rapide de ByteDance, via OpenRouter",
      happyhorse11:
        "HappyHorse 1.1 - Modèle de génération vidéo d'Alibaba, T2V, I2V et images de référence, via OpenRouter",
      happyhorse10:
        "HappyHorse 1.0 - Modèle de génération vidéo d'Alibaba, T2V, I2V et images de référence, via OpenRouter",
      modelsLabGen4T2ITurbo:
        "Gen4 T2I Turbo - Modèle texte-vers-image rapide de Runway, via ModelsLab",
      modelsLabGen4Image:
        "Gen4 Image - Modèle texte-vers-image Gen4 de Runway, via ModelsLab",
      modelsLabWan27T2I:
        "Wan 2.7 T2I - Modèle texte-vers-image Wan 2.7 d'Alibaba, via ModelsLab",
      modelsLabGrokT2I:
        "Grok Imagine T2I - Modèle texte-vers-image Grok de xAI, via ModelsLab",
      modelsLabZImageBase:
        "Z Image Base - Modèle texte-vers-image rapide et abordable de ModelsLab",
      modelsLabZImageTurbo:
        "Z Image Turbo - Modèle texte-vers-image ultra-rapide de ModelsLab",
      modelsLabFlux2MaxT2I:
        "Flux 2 Max T2I - Flux 2 Max texte-vers-image de Black Forest Labs, via ModelsLab",
      modelsLabFluxPro11Ultra:
        "Flux Pro 1.1 Ultra - Flux Pro Ultra haute qualité de Black Forest Labs, via ModelsLab",
      modelsLabFluxPro11:
        "Flux Pro 1.1 - Flux Pro 1.1 texte-vers-image de Black Forest Labs, via ModelsLab",
      modelsLabFlux2ProT2I:
        "Flux 2 Pro T2I - Flux 2 Pro texte-vers-image de Black Forest Labs, via ModelsLab",
      modelsLabFlux2DevT2I:
        "Flux 2 Dev T2I - Flux 2 Dev texte-vers-image de Black Forest Labs, via ModelsLab",
      modelsLabFluxT2I:
        "Flux T2I - Flux texte-vers-image de Black Forest Labs, via ModelsLab",
      modelsLabSeedream45T2I:
        "Seedream 4.5 T2I - Seedream 4.5 texte-vers-image de ByteDance, via ModelsLab",
      modelsLabSeedream40T2I:
        "Seedream 4.0 T2I - Seedream 4.0 texte-vers-image de ByteDance, via ModelsLab",
      modelsLabSeedreamT2I:
        "Seedream T2I - Seedream texte-vers-image de ByteDance, via ModelsLab",
      modelsLabImagen4Ultra:
        "Imagen 4 Ultra - La génération d'images de la plus haute qualité de Google, via ModelsLab",
      modelsLabImagen4:
        "Imagen 4 - Imagen 4 texte-vers-image de Google, via ModelsLab",
      modelsLabImagen4Fast:
        "Imagen 4 Fast - Imagen 4 texte-vers-image rapide de Google, via ModelsLab",
      modelsLabImagen3:
        "Imagen 3 - Imagen 3 texte-vers-image de Google, via ModelsLab",
      modelsLabNanoBananaPro:
        "Nano Banana Pro - Génération d'images de haute qualité, via ModelsLab",
      modelsLabNanoBanana: "Nano Banana - Génération d'images, via ModelsLab",
      modelsLabQwenT2I:
        "Qwen T2I - Qwen texte-vers-image d'Alibaba, via ModelsLab",
      modelsLabRealtimeT2I:
        "Realtime T2I - Modèle texte-vers-image en temps réel ultra-rapide de ModelsLab",
      claudeSonnet5:
        "Claude Sonnet 5 - Sonnet équilibré d'Anthropic, performant en code, agents et analyse. Contexte de 1M tokens.",
      claudeOpus5:
        "Claude Opus 5 - Modèle phare d'Anthropic pour les tâches agentiques et analytiques les plus exigeantes. Contexte de 1M tokens.",
      claudeOpus5Fast:
        "Claude Opus 5 Fast - Variante à haut débit de Claude Opus 5, optimisée pour les applications sensibles à la latence. Contexte de 1M tokens.",
      claudeFable5:
        "Claude Fable 5 - Dernier modèle de pointe d'Anthropic : raisonnement profond, synthèse créative et planification de longue haleine. Contexte de 1M tokens.",
      grok45:
        "Grok 4.5 - Modèle de raisonnement capable de xAI, avec vision et politique de contenu ouverte. Contexte de 500K tokens.",
      grok46:
        "Grok 4.6 - Dernier Grok de xAI, meilleur en raisonnement et en code. Contexte de 500K tokens.",
      gpt56Luna:
        "GPT-5.6 Luna - Modèle léger et rapide d'OpenAI pour les tâches du quotidien. Extrêmement économique. Contexte de 1,05M tokens.",
      gpt56LunaPro:
        "GPT-5.6 Luna Pro - Variante améliorée de Luna, meilleure en code et dans le suivi des instructions. Contexte de 1,05M tokens.",
      gpt56Terra:
        "GPT-5.6 Terra - Modèle milieu de gamme d'OpenAI, équilibre entre capacités et coût. Solide en code et en raisonnement. Contexte de 1,05M tokens.",
      gpt56TerraPro:
        "GPT-5.6 Terra Pro - Variante avancée de Terra, raisonnement et analyse plus poussés. Contexte de 1,05M tokens.",
      gpt56Sol:
        "GPT-5.6 Sol - Modèle de raisonnement premium d'OpenAI pour les tâches complexes. Performances de pointe. Contexte de 1,05M tokens.",
      gpt56SolPro:
        "GPT-5.6 Sol Pro - GPT haut de gamme qui allie raisonnement avancé et profondeur créative et analytique. Contexte de 1,05M tokens.",
      gemini36Flash:
        "Gemini 3.6 Flash - Flash capable de Google, entrées multimodales et bon en code. Contexte de 1M tokens.",
      gemini35FlashLite:
        "Gemini 3.5 Flash Lite - Modèle rapide et ultra-abordable de Google pour les tâches simples. Contexte de 1M tokens.",
      gemini37Flash:
        "Gemini 3.7 Flash - Dernier modèle de la série Flash de Google, raisonnement et capacités multimodales améliorés. Contexte de 1,05M tokens.",
      kimiK3:
        "Kimi K3 - Dernier modèle de pointe de Moonshot AI, raisonnement multimodal sur long contexte et capacités d'agent avancées. Contexte de 1,05M tokens.",
      glm52:
        "GLM-5.2 - Modèle de fondation nouvelle génération de Z.AI, raisonnement solide et inférence rapide. Contexte de 1,05M tokens.",
      minimaxM3:
        "MiniMax M3 - Modèle phare de MiniMax, solide en code et en raisonnement à prix compétitif. Contexte de 1,05M tokens.",
      qwen37Flash:
        "Qwen 3.7 Flash - Modèle économique ultra-rapide d'Alibaba pour les gros volumes. Contexte de 1M tokens.",
      qwen38Max:
        "Qwen 3.8 Max - Meilleur modèle de raisonnement d'Alibaba, performances de pointe. Contexte de 1M tokens.",
      mimoV25:
        "MiMo V2.5 - Modèle de raisonnement efficace de Xiaomi, solide en code. Contexte de 1,05M tokens.",
      mimoV25Pro:
        "MiMo V2.5 Pro - Modèle de raisonnement premium de Xiaomi, analyse et code plus poussés. Contexte de 1,05M tokens.",
      metaMuseSpark12:
        "Meta Muse Spark 1.2 - Modèle de raisonnement multimodal de Meta, entrées image, audio et vidéo. Fort en analyse croisée entre modalités. Contexte de 1,05M tokens.",
      mistralMedium35:
        "Mistral Medium 3.5 - Modèle milieu de gamme capable de Mistral AI, avec vision et bon en code. Contexte de 262K tokens.",
      claudeOpus55:
        "Claude Opus 5.5 - Le meilleur modèle d'Anthropic. Pour le travail agentique, le code et l'analyse les plus difficiles, désormais 20 % moins cher qu'Opus 5. Contexte de 1M tokens.",
      claudeSonnet55:
        "Claude Sonnet 5.5 - Le cheval de trait d'Anthropic. Code et compétences d'agent proches d'Opus, au prix de Sonnet. Contexte de 1M tokens.",
      claudeHaiku55:
        "Claude Haiku 5.5 - Le modèle le plus rapide d'Anthropic. Vision, outils et 1M de contexte pour un dixième du prix de Haiku 4.5.",
      claudeFable51:
        "Claude Fable 5.1 - Le raisonneur de pointe d'Anthropic. Synthèse profonde, planification de longue haleine, plus affûté que Fable 5. Contexte de 1M tokens.",
      claudeFable52:
        "Claude Fable 5.2 - Le raisonneur de pointe d'Anthropic. Synthèse plus profonde et planification de longue haleine plus stable que Fable 5.1, pour moins cher. Contexte de 1M tokens.",
      gpt6Astra:
        "GPT-6 Astra - Le modèle le plus capable d'OpenAI. Raisonnement maximal pour les problèmes les plus difficiles. Contexte de 1,05M tokens.",
      gpt6AstraPro:
        "GPT-6 Astra Pro - GPT-6 Astra avec un effort de raisonnement étendu. Plus lent, plus minutieux. Contexte de 1,05M tokens.",
      gpt61Sol:
        "GPT-6.1 Sol - Le raisonneur premium d'OpenAI. Performances de pointe pour une fraction du prix de GPT-5.6 Sol. Contexte de 1,05M tokens.",
      gpt61SolPro:
        "GPT-6.1 Sol Pro - GPT-6.1 Sol avec un effort de raisonnement étendu pour l'analyse et le code complexes. Contexte de 1,05M tokens.",
      gpt61Terra:
        "GPT-6.1 Terra - Le milieu de gamme équilibré d'OpenAI. Code et raisonnement solides, prix du quotidien. Contexte de 1,05M tokens.",
      gpt61TerraPro:
        "GPT-6.1 Terra Pro - GPT-6.1 Terra avec un raisonnement plus poussé pour le travail d'analyse. Contexte de 1,05M tokens.",
      gpt6Luna:
        "GPT-6 Luna - Le modèle léger d'OpenAI. Des réponses rapides pour trois fois rien. Contexte de 1,05M tokens.",
      gpt6LunaPro:
        "GPT-6 Luna Pro - GPT-6 Luna avec plus de raisonnement. Meilleur code et meilleur suivi des instructions, même prix bas. Contexte de 1,05M tokens.",
      gemini4Argon:
        "Gemini 4 Argon - Le nouveau modèle phare de Google. Texte, image, vidéo et audio en entrée, raisonnement de pointe en sortie. Contexte de 1M tokens.",
      gemini38Flash:
        "Gemini 3.8 Flash - Le dernier Flash de Google. Modèle multimodal rapide, bon en code. Contexte de 1M tokens.",
      grok47:
        "Grok 4.7 - Le dernier Grok de xAI. Raisonnement et code plus affûtés, politique de contenu ouverte, vision. Contexte de 500K tokens.",
      kimiK31Pro:
        "Kimi K3.1 Pro - Le modèle le plus puissant de Moonshot AI. Raisonnement multimodal et longues exécutions d'agent. Contexte de 1M tokens.",
      qwen4Max:
        "Qwen 4 Max - Le nouveau modèle phare d'Alibaba. Raisonnement, code et analyse de pointe, lit les images et la vidéo. Contexte de 1M tokens.",
      kimiK31ProUncensored:
        "Kimi K3.1 Pro Uncensored - Le Kimi le plus puissant de Moonshot AI, refus retirés (abliteré). Raisonnement haut de gamme, aucune leçon de morale, outils inclus. Contexte de 1M tokens.",
      deepseekV41Flash:
        "DeepSeek V4.1 Flash - Le modèle ouvert rapide de DeepSeek, désormais avec la vision. Du code sérieux pour presque rien. Contexte de 1M tokens.",
      qwen38Flash:
        "Qwen 3.8 Flash - Modèle multimodal rapide d'Alibaba. Texte, image et vidéo à petit prix. Contexte de 1M tokens.",
      glm53:
        "GLM-5.3 - Le dernier modèle de fondation de Z.AI. Raisonnement et code solides à prix agressif. Contexte de 1M tokens.",
      glm53Flash:
        "GLM-5.3 Flash - Modèle multimodal rapide de Z.AI. Texte, image et vidéo pour les gros volumes. Contexte de 1M tokens.",
      mimoV26Pro:
        "MiMo V2.6 Pro - Le raisonneur premium de Xiaomi. Texte, image, vidéo et audio en entrée, analyse approfondie en sortie. Contexte de 1,05M tokens.",
      mimoV26Flash:
        "MiMo V2.6 Flash - Modèle multimodal rapide de Xiaomi. Ultra-économique, bon codeur. Contexte de 1,05M tokens.",
      metaMuseSpark13:
        "Meta Muse Spark 1.3 - Le raisonneur multimodal de Meta. Analyse croisée entre texte, image et vidéo. Contexte de 1M tokens.",
      metaMuseWonder:
        "Meta Muse Wonder - Le modèle phare de Meta. Raisonnement, code et création de pointe sur toutes les modalités. Contexte de 1M tokens.",
      mistralLarge4:
        "Mistral Large 4 - Le nouveau modèle phare de Mistral AI. Européen, avec vision, fort en code, moins cher que Medium 3.5. Contexte de 1M tokens.",
      gemini4Hydrogen:
        "Gemini 4 Hydrogen - Le cheval de trait de Gemini 4. Code agentique et analyse rapides, texte, image, vidéo et audio en entrée. Contexte de 1M tokens.",
      gemini4Carbon:
        "Gemini 4 Carbon - Le Gemini le plus puissant de Google. Conçu pour le code, le travail d'agent et le raisonnement les plus difficiles, lit tous les types de médias. Contexte de 1M tokens.",
      minimaxM31Flash:
        "MiniMax M3.1 Flash - Modèle multimodal rapide de MiniMax. Bat M3 en agents et en code pour moitié prix, voire moins. Contexte de 1M tokens.",
      metaMuseEmber:
        "Meta Muse Ember - Le plus petit Muse de Meta. Appels d'outils rapides, routage et code léger pour trois fois rien, lit tous les types de médias. Contexte de 1M tokens.",
      veniceDeepseekV41FlashUncensored:
        "DeepSeek V4.1 Flash Uncensored - DeepSeek V4.1 Flash sans les refus, servi par Venice.ai. De vraies capacités, aucune leçon de morale, outils inclus. Contexte de 1M tokens.",
      drummerArtemis31b:
        "Artemis 31B - Fine-tune de jeu de rôle de TheDrummer basé sur Gemma 4. Scènes sombres, fiction explicite, personnages qui ne sortent jamais de leur rôle. Bon marché, 262K de contexte, lit les images, appelle des outils.",
      grokImagineImage2:
        "Grok Imagine Image 2.0 - Dernier modèle de génération d'images de xAI, fidélité au prompt et qualité visuelle améliorées.",
      recraftV41:
        "Recraft V4.1 - Modèle d'image de Recraft pensé pour le design, texte précis dans les images, conçu pour les logos, affiches et visuels de marque.",
      recraftV41Pro:
        "Recraft V4.1 Pro - Offre premium 2K de Recraft pour des visuels de marque et de produit prêts à imprimer, riches en détails.",
      recraftV41Flash:
        "Recraft V4.1 Flash - Offre rapide et économique de Recraft pour les brouillons et les gros lots, moins d'1 crédit par image.",
      qwenImage3:
        "Qwen Image 3 - Modèle de génération d'images rapide d'Alibaba, à coût ultra-bas.",
      qwenImage3Pro:
        "Qwen Image 3 Pro - Modèle de génération d'images premium d'Alibaba, qualité et détails améliorés.",
      hailuo3:
        "Hailuo 3 - Dernier modèle de génération vidéo de MiniMax, qualité cinématographique et mouvements cohérents.",
      seedance25:
        "Seedance 2.5 - Modèle de génération vidéo amélioré de ByteDance, meilleurs mouvements et fidélité visuelle.",
      flux3Video:
        "Flux 3 Video - Modèle de génération vidéo phare de Black Forest Labs, qualité exceptionnelle et grande fidélité au prompt.",
      grokImagineVideo15:
        "Grok Imagine Video 1.5 - Modèle de génération vidéo mis à jour de xAI, cohérence temporelle améliorée.",
      lyria3ProPreview:
        "Lyria 3 Pro Preview - Modèle premium de génération de musique de Google, chansons complètes avec une production de haute qualité.",
      lyria3ClipPreview:
        "Lyria 3 Clip Preview - Générateur rapide d'extraits musicaux de Google pour les contenus audio courts.",
      geminiNanoBanana21:
        "Nano Banana 2.1 - Génération et édition d'images dans le chat par Google, pour moitié du prix par image du Nano Banana d'origine.",
      seedream55:
        "Seedream 5.5 - Modèle de génération d'images et d'édition multi-références de ByteDance, à 2 crédits par image.",
      flux3Image:
        "FLUX.3 - Modèle d'image phare de Black Forest Labs, détails plus nets et texte plus propre que FLUX.2.",
      flux3Klein:
        "FLUX.3 Klein - Petit modèle d'image rapide de Black Forest Labs pour les brouillons et les gros lots, moins d'1 crédit par image.",
      gptImage26Flare:
        "GPT Image 2.6 Flare - Modèle rapide de génération et d'édition d'images d'OpenAI.",
      gptImage26Sunburst:
        "GPT Image 2.6 Sunburst - Modèle d'image d'OpenAI axé sur le détail, pour les compositions denses et les mises en page chargées en texte.",
      geminiOmni12Flash:
        "Gemini Omni 1.2 Flash - Modèle vidéo de Google avec audio natif, clips de 3 à 15 secondes, jusqu'en 4K.",
      grokImagineVideo15Lite:
        "Grok Imagine Video 1.5 Lite - Modèle vidéo rapide et économique de xAI, jusqu'en 1080p.",
      wan30:
        "Wan 3.0 - Modèle vidéo d'Alibaba avec audio natif et clips jusqu'à 30 secondes.",
      seedance2Mini:
        "Seedance 2.0 Mini - Modèle vidéo économique de ByteDance avec audio natif, en 480p et 720p.",
      seedance25Flash:
        "Seedance 2.5 Flash - Le Seedance 2.5 rapide de ByteDance avec audio natif, clips jusqu'à 30 secondes en 480p et 720p.",
      hailuo3Max:
        "Hailuo 3 Max - Variante de Hailuo 3 plus rapide et moins chère de MiniMax, en 768p, sans audio.",
      runwayGen45:
        "Runway Gen-4.5 - Modèle vidéo cinématographique de Runway, du texte ou de l'image vers la vidéo en 720p.",
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
};
