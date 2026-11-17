import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: {
    sidebar: {
      login: "Connexion",
      logout: "Déconnexion",
    },
  },
  common: {
    newChat: "Nouveau fil",
    newPrivateChat: "Fil privé",
    newSharedChat: "Fil partagé",
    newPublicChat: "Fil public",
    newIncognitoChat: "Fil incognito",
    newPrivateFolder: "Nouveau dossier privé",
    newSharedFolder: "Nouveau dossier partagé",
    newPublicFolder: "Nouveau dossier public",
    newIncognitoFolder: "Nouveau dossier incognito",
    createNewPrivateFolder: "Créer un dossier privé",
    createNewSharedFolder: "Créer un dossier partagé",
    createNewPublicFolder: "Créer un dossier public",
    createNewIncognitoFolder: "Créer un dossier incognito",
    privateChats: "Fils privés",
    sharedChats: "Fils partagés",
    publicChats: "Fils publics 1A",
    incognitoChats: "Fils incognito",
    cronChats: "Fils en arrière-plan",
    backgroundChats: "Arrière-plan",
    remoteChats: "Distant",
    search: "Rechercher",
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
    send: "Envoyer",
    sending: "Envoi…",
    edit: "Modifier",
    settings: "Paramètres",
    toggleSidebar: "Afficher/masquer la barre latérale",
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    searchPlaceholder: "Rechercher…",
    searchThreadsPlaceholder: "Rechercher des fils…",
    searchResults: "Résultats ({{count}})",
    noChatsFound: "Aucune discussion trouvée",
    noThreadsFound: "Aucun fil trouvé",
    enableTTSAutoplay: "Activer la lecture vocale automatique",
    disableTTSAutoplay: "Désactiver la lecture vocale automatique",
    closeSidebar: "Fermer la barre latérale",
    close: "Fermer",
    showMore: "Afficher plus",
    showLess: "Afficher moins",
    viewFullThread: "Voir le fil complet",
    viewAllThreads: "Voir tous les fils",
    backToChat: "Retour au chat",
    language: "Langue",
    loginRequired:
      "Connectez-vous pour utiliser les dossiers persistants. Pour discuter anonymement, passez en mode incognito.",

    // Copy Button
    copyButton: {
      copyToClipboard: "Copier dans le presse-papiers",
      copied: "Copié !",
      copyAsMarkdown: "Copier en Markdown",
      copyAsText: "Copier en texte",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Arrêter la lecture audio",
      playAudio: "Lire l'audio (+{{cost}} crédits)",
      cancelLoading: "Annuler le chargement",
      answerAsAI: "Répondre en tant que modèle IA",
      deleteMessage: "Supprimer le message",
      actualCostUsed: "Crédits réellement utilisés pour ce message",
      tokensUsed: "Total des tokens utilisés",
      credits: "crédits",
      tokens: "tokens",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Créer une branche à partir d'ici",
      retry: "Réessayer avec un autre modèle ou skill",
      deleteMessage: "Supprimer le message",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Vue linéaire (style ChatGPT)",
      threadedView: "Vue arborescente (style Reddit/Discord)",
      flatView: "Vue à plat (style 4chan)",
      debugView: "Vue debug (avec prompts système)",
    },

    // Search Modal
    searchModal: {
      searchAndCreate: "Rechercher et créer",
      newChat: "Nouveau chat",
      searchThreadsPlaceholder: "Rechercher des fils…",
      noThreadsFound: "Aucun fil trouvé",
    },

    // Selector
    selector: {
      country: "Pays",
      language: "Langue",
    },
  },

  aiTools: {
    modal: {
      title: "Outils IA",
      description:
        "En général, vous n'avez pas à gérer les outils. Quand l'aide est activée, l'IA peut appeler n'importe quel outil à la demande. Épinglez un outil ici seulement si vous le voulez toujours en contexte.",
      searchPlaceholder: "Rechercher des outils…",
      loading: "Chargement des outils…",
      noToolsFound: "Aucun outil ne correspond à votre recherche",
      noToolsAvailable: "Aucun outil IA disponible",
      expandAll: "Tout déplier",
      collapseAll: "Tout replier",
      selectAll: "Tout sélectionner",
      deselectAll: "Tout désélectionner",
      enableAll: "Tout activer",
      resetToDefault: "Rétablir par défaut",
      stats: "{{enabled}} outils épinglés sur {{total}}",
      aliases: "Alias",
      requireConfirmation: "Demander une confirmation avant utilisation",
      activeLabel: "épinglés",
      enabledLabel: "autorisés",
      totalLabel: "au total",
      activeTooltip:
        "Les outils épinglés sont toujours en contexte : l'IA les voit à chaque tour",
      enabledTooltip:
        "Les outils autorisés peuvent être appelés à la demande quand l'aide est activée",
      legendActive: "Toujours en contexte (épinglé)",
      legendConfirm: "Demande avant d'exécuter",
      activeOn: "Épinglé, toujours en contexte. Cliquez pour désépingler",
      activeOff:
        "Non épinglé, l'IA peut quand même l'appeler à la demande. Cliquez pour épingler",
      confirmOn: "Demande une confirmation. Cliquez pour désactiver",
      confirmOff:
        "S'exécute automatiquement. Cliquez pour exiger une confirmation",
    },
  },

  confirmations: {
    deleteMessage: "Voulez-vous vraiment supprimer ce message ?",
  },

  iconSelector: {
    tabs: {
      library: "Bibliothèque d'icônes",
      emoji: "Unicode/Emoji",
    },
    emojiTab: {
      label: "Saisissez un emoji ou un caractère Unicode",
      placeholder: "🤖 ou n'importe quel texte",
      apply: "Appliquer",
      currentIcon: "Icône actuelle :",
      commonEmojis: "Emojis courants :",
    },
  },

  createSkill: {
    title: "Créer un skill personnalisé",
    description:
      "Concevez votre propre skill IA : personnalité, expertise et comportement sur mesure.",
    icon: "Icône",
    name: "Nom",
    namePlaceholder: "ex. Relecteur de code",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Ce que fait ce skill, en bref",
    category: "Catégorie",
    selectCategory: "Choisissez une catégorie",
    systemPrompt: "Prompt système",
    systemPromptPlaceholder:
      "Définissez le comportement de ce skill. Soyez précis sur sa personnalité, son expertise et sa façon de répondre.",
    voice: "Voix",
    voicePlaceholder: "Choisissez une voix pour la synthèse vocale",
    create: "Créer le skill",
    creating: "Création…",
    charCount: "{{current}} / {{max}}",
    errors: {
      nameRequired: "Saisissez un nom",
      descriptionRequired: "Saisissez une description",
      systemPromptRequired: "Saisissez un prompt système",
      createFailed: "Impossible de créer le skill. Réessayez.",
    },
  },

  voice: {
    male: "Homme",
    female: "Femme",
  },

  editSkill: {
    title: "Modifier en skill personnalisé",
    description:
      "Créez un skill personnalisé à partir de celui-ci. Tous les paramètres sont modifiables.",
    loginRequired:
      "Connectez-vous pour créer et modifier des skills personnalisés. Ils sont enregistrés dans votre compte.",
    name: "Nom",
    namePlaceholder: "Nom du skill personnalisé",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Que fait ce skill ?",
    category: "Catégorie",
    icon: "Icône",
    voice: "Voix",
    voicePlaceholder: "Choisir une voix",
    preferredModel: "Modèle préféré",
    preferredModelPlaceholder: "Modèle préféré (facultatif)",
    systemPrompt: "Prompt système",
    systemPromptPlaceholder: "Définissez le comportement du skill…",
    save: "Enregistrer en personnalisé",
    saveAsCopy: "Enregistrer une copie",
    saving: "Création…",
    cancel: "Annuler",
    login: "Se connecter pour modifier",
    signup: "S'inscrire pour modifier",
  },

  userProfile: {
    postCount: "{{count}} publication",
    postCount_other: "{{count}} publications",
    recentPosts: "Publications récentes",
    noPostsYet: "Aucune publication pour l'instant",

    // Flat Message View
    flatMessageView: {
      deleteThisMessage: "Supprimer ce message",
    },
  },
  credits: {
    balance: "Crédits",
    credit: "{{count}} crédit",
    credits: "{{count}} crédits",
    freeCredit: "{{count}} crédit gratuit",
    freeCredits: "{{count}} crédits gratuits",
    expiringCredit: "{{count}} crédit à durée limitée",
    expiringCredits: "{{count}} crédits à durée limitée",
    permanentCredit: "{{count}} crédit permanent",
    permanentCredits: "{{count}} crédits permanents",
    expiresOn: "Expire le {{date}}",
    expiresAt: "Expire",
    buyMore: "Acheter des crédits",
    viewDetails: "Détails",
    breakdown: "Détail des crédits",
    approximateCost:
      "Coût approximatif basé sur {{inputTokens}} tokens en entrée et {{outputTokens}} tokens en sortie. Le coût réel peut varier.",
    navigation: {
      profile: "Profil",
      subscription: "Abonnement et crédits",
      referral: "Programme de parrainage",
      about: "À propos",
      help: "Aide",
    },
  },
  actions: {
    newChatInFolder: "Nouveau chat dans le dossier",
    newFolder: "Nouveau dossier",
    deleteFolder: "Supprimer le dossier",
    deleteMessage: "Supprimer le message",
    deleteThisMessage: "Supprimer ce message",
    searchEnabled: "Recherche activée",
    searchDisabled: "Recherche désactivée",
    answerAsAI: "Répondre en tant que modèle IA",
    retry: "Réessayer avec un autre modèle ou skill",
    branch: "Créer une branche à partir d'ici",
    editMessage: "Modifier le message",
    stopAudio: "Arrêter la lecture audio",
    playAudio: "Lire l'audio",
    copyContent: "Copier dans le presse-papiers",
    rename: "Renommer",
    pin: "Épingler en haut",
    unpin: "Désépingler",
    archive: "Archiver",
    unarchive: "Désarchiver",
    moveToFolder: "Déplacer vers un dossier",
    unfiled: "Sans dossier",
    noFoldersAvailable: "Aucun dossier disponible",
    stopGeneration: "Arrêter la génération",
    cancellingGeneration: "Annulation…",
    sendMessage: "Envoyer le message",
    shareThread: "Partager le fil",
    manageSharing: "Gérer le partage",
  },
  chatInterface: {
    chatPrefix: "chat",
    chatConversation: "chat-conversation",
  },
  input: {
    placeholder: "Écrivez votre message…",
    imagePlaceholder: "Décrivez l'image à générer…",
    audioPlaceholder: "Décrivez la musique ou le son à générer…",
    noPermission: "Vous n'avez pas le droit de publier des messages",
    noPostPermission:
      "Vous n'avez pas le droit de publier des messages dans ce fil",
    noCreateThreadPermission:
      "Vous n'avez pas le droit de créer des fils dans ce dossier",
    noCreateThreadPermissionInRootFolder:
      "Vous n'avez pas le droit de créer des fils dans ce dossier. Connectez-vous ou choisissez un sous-dossier.",
    keyboardShortcuts: {
      press: "Appuyez sur",
      enter: "Entrée",
      toSend: "pour envoyer",
      shiftEnter: "Maj+Entrée",
      forNewLine: "pour un saut de ligne",
      ctrlV: "Ctrl+V",
      pasteFilesSeparator: "·",
      orPasteFiles: "pour coller des fichiers",
    },
    speechInput: {
      stopRecording: "Arrêter l'enregistrement",
      processing: "Traitement…",
      startVoiceInput: "Dicter (+{{cost}} crédits/min)",
      recordingClickToStop: "Enregistrement… Cliquez pour arrêter",
      transcribing: "Transcription…",
    },
    attachments: {
      uploadFile: "Joindre des fichiers",
      attachedFiles: "Fichiers joints",
      addMore: "Ajouter",
      removeFile: "Retirer le fichier",
      fileTooLarge: "Fichier trop volumineux (10 Mo max.)",
      invalidFileType: "Type de fichier non valide",
      uploadError: "Échec de l'envoi du fichier",
    },
  },
  imageGen: {
    sizeSquare: "Carré 1024×1024",
    sizeLandscape: "Paysage 1792×1024",
    sizePortrait: "Portrait 1024×1792",
    qualityStandard: "Standard",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "~8 s",
    durationMedium: "~20 s",
    durationLong: "~30 s",
  },
  modelSelector: {
    placeholder: "Choisir un modèle",
    addNewLabel: "Ajouter un modèle personnalisé",
    costFree: "Gratuit",
    costCredits: "{{count}} crédit/msg",
    costCreditsPlural: "{{count}} crédits/msg",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
    // New hybrid mode translations
    whatDoYouNeed: "De quoi avez-vous besoin ?",
    tuneIt: "Ajuster",
    recommended: "Recommandé",
    alsoGood: "Bien aussi",
    helpMeChoose: "Aidez-moi à choisir",
    useThis: "Utiliser",
    quality: "Qualité",
    speedLabel: "Vitesse",
    // Task pills
    tasks: {
      code: "Code",
      write: "Écrire",
      chat: "Discuter",
      think: "Réfléchir",
      create: "Créer",
      unfiltered: "Sans filtre",
    },
    // Tuning toggles
    effort: "Effort",
    "effort.simple": "Simple",
    "effort.regular": "Normal",
    "effort.complex": "Complexe",
    speed: "Vitesse",
    "speed.fast": "Rapide",
    "speed.balanced": "Équilibré",
    "speed.thorough": "Approfondi",
    content: "Contenu",
    "content.normal": "Normal",
    "content.sensitive": "Sensible",
    "content.adult": "Adulte",
    // Wizard mode
    wizard: {
      title: "Aidez-moi à choisir",
      whatWorking: "Sur quoi travaillez-vous ?",
      contentType: "Est-ce que ça inclut du contenu pour adultes ?",
      whatMatters: "Qu'est-ce qui compte le plus pour vous ?",
      hereIsMyPick: "Voici ma recommandation :",
      options: {
        code: "Écrire du code",
        write: "Rédiger du texte ou du contenu",
        chat: "Discuter, poser des questions",
        think: "Un sujet qui demande une réflexion poussée",
        create: "Travail créatif",
        unfiltered: "Contenu non censuré ou pour adultes",
        safeContent: "Rester prudent (modèles standard)",
        adultContent: "Oui, contenu pour adultes (modèles non censurés)",
        speed: "Vitesse",
        speedDesc: "Je veux des réponses rapides",
        cost: "Coût",
        costDesc: "Pas cher, voire gratuit",
        quality: "Qualité",
        qualityDesc: "Le meilleur résultat possible",
        balanced: "Équilibré",
        balancedDesc: "Un peu de tout",
      },
    },
    addDialog: {
      title: "Ajouter un modèle personnalisé",
      fields: {
        modelName: {
          label: "Nom du modèle",
          placeholder: "ex. GPT-4 Turbo",
        },
        provider: {
          label: "Fournisseur",
          placeholder: "ex. OpenAI",
        },
        apiDocs: {
          label: "URL de la documentation API",
        },
        modelId: {
          label: "ID du modèle",
          placeholder: "ex. gpt-4-turbo",
        },
      },
      cancel: "Annuler",
      add: "Ajouter le modèle",
    },
  },
  characterSelector: {
    placeholder: "Choisir un skill",
    addNewLabel: "Créer un skill personnalisé",
    defaultIcon: "✨",
    grouping: {
      bySource: "Par source",
      byCategory: "Par catégorie",
      sourceLabels: {
        builtIn: "Intégrés",
        my: "Mes skills",
        community: "Communauté",
      },
      sourceIcons: {
        builtIn: "🏢",
        my: "👤",
        community: "🌐",
      },
      defaultCategory: "Général",
      defaultCategoryIcon: "🤖",
    },
    addCategoryDialog: {
      title: "Créer une catégorie",
      fields: {
        name: {
          label: "Nom de la catégorie",
          placeholder: "ex. Business, Gaming, etc.",
        },
        icon: {
          label: "Icône (emoji)",
          placeholder: "📁",
        },
      },
      cancel: "Annuler",
      create: "Créer",
    },
    addDialog: {
      title: "Créer un skill personnalisé",
      createCategory: "+ Nouvelle catégorie",
      fields: {
        name: {
          label: "Nom",
          placeholder: "ex. Relecteur de code",
        },
        icon: {
          label: "Icône (emoji)",
          placeholder: "✨",
        },
        description: {
          label: "Description",
          placeholder: "Courte description du skill",
        },
        systemPrompt: {
          label: "Prompt système",
          placeholder: "Tu es un…",
        },
        category: {
          label: "Catégorie",
        },
        suggestedPrompts: {
          label: "Prompts suggérés (facultatif)",
          description: "Ajoutez jusqu'à 4 prompts suggérés pour ce skill",
          placeholder: "Prompt {{number}}",
        },
      },
      cancel: "Annuler",
      create: "Créer le skill",
    },
  },
  searchToggle: {
    search: "Recherche",
    enabledTitle: "Brave Search activé (+0,65 crédit par recherche)",
    disabledTitle: "Brave Search désactivé (+0,65 crédit par recherche)",
    creditIndicator: "+0,65",
    unconfiguredTitle: "Recherche web non configurée",
    unconfiguredBrave: "Pour Brave Search, ajoutez à votre .env :",
    unconfiguredKagi: "Pour Kagi Search, ajoutez à votre .env :",
  },
  toolsButton: {
    title: "Configurer les outils IA",
    tools: "Outils",
  },
  combinedSelector: {
    tabs: {
      quick: "Rapide",
      skill: "Skill",
      model: "Modèle",
    },
    current: "Actuel",
    favoriteSkills: "Skills favoris",
    favoriteModels: "Modèles favoris",
    showAll: "Tout afficher",
    selectModel: "Choisir un modèle",
    forSkill: "pour {{character}}",
    recommended: "Recommandés",
    favorites: "Favoris",
    all: "Tous",
    noFavorites:
      "Aucun favori pour l'instant. Ajoutez-en avec l'étoile pour les retrouver ici.",
    noModels: "Aucun modèle disponible",
    filteredBySkill:
      "{{compatible}} modèles affichés sur {{total}} (filtrés selon le skill)",
    selectSkill: "Choisir un skill",
    allSkills: "Tous",
  },
  selector: {
    noResults: "Aucun résultat",
    tabs: {
      quick: "Rapide",
      characters: "Skills",
      build: "Configurer",
      favorites: "Mes favoris",
      browse: "Parcourir les skills",
    },
    tiers: {
      quick: "Rapide",
      smart: "Intelligent",
      best: "Le meilleur",
    },
    price: {
      free: "GRATUIT",
      smart: "3-8 cr",
      best: "10-20 cr",
    },
    content: "Contenu",
    contentLevels: {
      safe: "Sûr",
      open: "Ouvert",
      unlim: "Illimité",
    },
    free: "Gratuit",
    favorites: "Favoris",
    suggested: "Suggérés",
    noFavorites: "Aucun favori pour l'instant",
    noFavoritesHint: "Enregistrez vos skills préférés pour y accéder vite",
    browseAllSkills: "Parcourir tous les skills…",
    customSetup: "Configuration personnalisée…",
    selectSkill: "Choisir un skill",
    modelCreditDisplay: {
      tokenBased: {
        header: "Coût par message",
        costRangeLabel: "Fourchette habituelle :",
        costRangeValue: "{{min}} à {{max}} crédits",
        examplesLabel: "Exemples :",
        examples: {
          short: "Conversation courte",
          medium: "Conversation moyenne",
          long: "Conversation longue",
        },
        triggersCompacting: "⚡ Déclenche le compactage",
        tokensCount: "{{count}} tokens",
        explanation:
          "L'IA relit tout l'historique de la conversation à chaque message. Plus la conversation est longue, plus elle coûte, car il y a plus de contexte à traiter.",
        compactingLabel: "✨ Compactage automatique :",
        compactingExplanation:
          " À {{threshold}} tokens, les anciens messages sont résumés automatiquement pour réduire les coûts tout en gardant le contexte.",
      },
      fixed: {
        title: "Tarif de {{model}}",
        freeDescription:
          "Ce modèle est entièrement gratuit, sans coût en crédits.",
        fixedDescription:
          "Ce modèle a un coût fixe par message, quelle que soit sa longueur.",
        costPerMessage: "Coût par message :",
        freeExplanation: "Modèle gratuit, sans limite d'usage.",
        freeHighlight: "Parfait pour tester et expérimenter.",
        simpleLabel: "Tarif simple :",
        simpleExplanation:
          " Chaque message coûte pareil, court ou long. Aucun calcul de tokens.",
      },
      creditValue: "1 crédit = {{value}}",
    },
    all: "Tous",
    buildMode: "Mode configuration",
    forSkill: "pour {{character}}",
    intelligence: "Intelligence",
    contentLevel: "Niveau de contenu",
    speed: "Vitesse",
    any: "Indifférent",
    result: "Résultat",
    bestMatch: "Le plus adapté à vos réglages",
    useRecommended: "Utiliser la recommandation : {{model}}",
    filteredBySettings: "{{filtered}} modèles affichés sur {{total}}",
    recommended: "Recommandés",
    noModels: "Aucun modèle ne correspond à vos filtres",
    currentConfig: "Vous discutez avec",
    switchModel: "Changer de modèle",
    keepsConversation: "(garde la conversation)",
    switchSkill: "Changer de skill",
    startsNewChat: "(démarre un nouveau chat)",
    start: "Démarrer",
    addFav: "Ajouter",
    searchSkills: "Rechercher des skills…",
    noSkillsFound: "Aucun skill trouvé",
    createCustom: "Créer un skill personnalisé",
    skill: "Skill",
    savePreset: "Enregistrer",
    perMessage: "par message",
    compatibleModels: "{{count}} modèles compatibles",
    categories: {
      companions: "Compagnons",
      assistants: "Assistants",
      coding: "Code",
      creative: "Créatif",
      writing: "Écriture",
      roleplay: "Jeu de rôle",
      analysis: "Analyse",
      education: "Éducation",
      controversial: "Controversé",
      custom: "Personnalisé",
    },
    // v20 additions
    active: "Actif",
    addFavorite: "Ajouter un favori",
    settings: "Paramètres",
    noModel: "Aucun modèle sélectionné",
    model: "Modèle",
    autoSelect: "Sélection selon les filtres",
    manualSelect: "Choisir manuellement…",
    best: "TOP",
    bestForFilter: "Le meilleur pour ce filtre",
    setupRequired: "Configuration requise",
    providerUnconfigured: "Clé API du fournisseur non configurée",
    addEnvKey: "Ajouter au .env",
    noMatchingModels: "Aucun modèle ne correspond à vos filtres",
    noModelsWarning:
      "Aucun modèle ne correspond à ces filtres. Ajustez vos paramètres pour continuer.",
    allModelsCount: "{{count}} modèles disponibles",
    filteredModelsCount: "{{count}} modèles correspondants",
    showAllModels: "Afficher les {{count}} modèles",
    showFiltered: "Afficher la sélection filtrée",
    showLegacyModels_one: "Afficher {{count}} ancien modèle",
    showLegacyModels_other: "Afficher {{count}} anciens modèles",
    applyChanges: "Appliquer les modifications",
    thisChatOnly: "Ce chat uniquement (temporaire)",
    saveToPreset: "Enregistrer dans « {{name}} »",
    saveAsNew: "Enregistrer comme nouveau favori…",
    cancel: "Annuler",
    apply: "Appliquer",
    contentFilter: "Contenu",
    maxPrice: "Prix max.",
    creditsExact: "{{cost}} crédits",
    creditsSingle: "1 crédit",
    searchResults: "{{count}} résultats",
    defaults: "Par défaut",
    customize: "Personnaliser",
    addWithDefaults: "Ajouter avec les réglages par défaut",
    seeAll: "Tout voir",
    back: "Retour",
    use: "Utiliser",
    editSettings: "Modifier les réglages",
    editModelSettings: "Modifier les réglages du modèle",
    modelOnly: "Modèle seul",
    yourSetups: "Vos configurations",
    setup: "Configuration",
    delete: "Supprimer",
    editSkill: "Modifier en skill personnalisé",
    switchSkillBtn: "Changer de skill",
    editSkillBtn: "Modifier le skill",
    autoSelectedModel: "Selon les filtres :",
    manualSelectedModel: "Sélectionné :",
    skillSelectedModel: "Modèle du skill :",
    selectModelBelow: "Choisissez un modèle ci-dessous",
    chooseYourPath: "Choisissez votre approche",
    twoWaysToChat: "Deux façons de démarrer",
    directModels: "Accès direct aux modèles",
    directModelsDesc:
      "Réglez des filtres ou choisissez vous-même parmi {{count}} modèles. Vous gardez la main sur l'IA.",
    skillPresets: "Skills préconfigurés",
    characterPresetsDesc:
      "Choisissez un skill ci-dessous. Chacun arrive avec des réglages optimisés, modifiables à tout moment.",
    startWithDirectModels: "Commencer avec les modèles",
    orBrowsePresets: "Ou parcourez les skills préconfigurés ci-dessous",
    loading: "Chargement…",
    noModelsMatch: "Aucun modèle correspondant",
    adjustFiltersMessage:
      "Ajustez vos filtres pour trouver des modèles disponibles",
    auto: "Auto",
    manual: "Manuel",
    showLess: "Afficher moins",
    showMore: "Afficher {{count}} de plus",
    applyOnce: "Appliquer une fois",
    saveChanges: "Enregistrer",
    useOnce: "Utiliser une fois",
    saveAsDefault: "Ajouter aux favoris",
    deleteSetup: "Supprimer la configuration",
    skillSetup: "Configuration du skill",
    separator: " • ",
    sortBy: "Trier par",
    // UX improvements v21
    mySetups: "Mes configurations",
    addNew: "Ajouter",
    noSetupsTitle: "Aucune configuration",
    noSetupsDescription:
      "Créez votre première configuration de skill IA pour commencer",
    getStarted: "Commencer",
    currentModel: "Modèle actuel",
    modelSelection: "Choix du modèle",
    autoMode: "Sélection auto",
    manualMode: "Choix manuel",
    skillMode: "Défaut du skill",
    autoModeDescription:
      "Choisit automatiquement le meilleur modèle selon vos préférences",
    manualModeDescription: "Choisissez le modèle que vous voulez",
    characterBasedModeDescription:
      "Utilise le modèle pour lequel ce skill a été conçu",
    customizeSettings: "Personnaliser les réglages avant d'ajouter",
    useNow: "Utiliser",
    browseAll: "Parcourir tous les skills",
    add: "Ajouter",
    // v22 UX improvements
    quickSwitch: "Changement rapide",
    switchTo: "Passer à cette configuration",
    adjustSettings: "Ajuster les réglages",
    addAnotherSetup: "Ajouter une configuration",
    comingSoon: "Bientôt disponible",
    // Skill requirements
    requirements: {
      skillConflict: "Conflit avec le skill",
      max: "Maximum",
      min: "Minimum",
      tooHigh: "Trop élevé",
      tooLow: "Trop bas",
      intelligenceTooLow: "Intelligence trop basse (min. : {{min}})",
      intelligenceTooHigh: "Intelligence trop élevée (max. : {{max}})",
      contentTooLow: "Niveau de contenu trop bas (min. : {{min}})",
      contentTooHigh: "Niveau de contenu trop élevé (max. : {{max}})",
      allMet: "Toutes les exigences sont remplies",
      violations: "{{count}} exigences non remplies",
    },
    // Skill switch modal
    characterSwitchModal: {
      title: "Changer de skill",
      description: "Passez à un autre skill sans perdre vos réglages",
      searchPlaceholder: "Rechercher des skills…",
      noResults: "Aucun skill trouvé",
      keepSettings: "Garder les réglages actuels du modèle",
      keepSettingsDesc:
        "Appliquer vos filtres actuels d'intelligence, de prix et de contenu au nouveau skill",
      cancel: "Annuler",
      confirm: "Changer de skill",
    },
  },
  onboarding: {
    back: "Retour",
    // Screen 1: Welcome
    welcome: {
      title: "Voyez-nous comme votre équipe IA.",
      line1:
        "Un compagnon pour les conversations du quotidien. Des spécialistes pour le code, la recherche, l'écriture : vous en choisissez un quand la tâche l'exige.",
      line2: "Même chat. Vous changez quand ça compte. En quelques secondes.",
      line3: "On vous configure tout ça en moins d'une minute.",
      continue: "Commencer",
    },
    // Screen 2: Guest warning (logged-out users only)
    guest: {
      title: "Vous naviguez en tant qu'invité",
      line1:
        "Vos réglages, votre compagnon et votre historique sont enregistrés uniquement sur cet appareil.",
      line2:
        "Connectez-vous pour tout synchroniser entre vos appareils et ne jamais perdre votre configuration.",
      signIn: "Se connecter / Créer un compte",
      continueAnyway: "Continuer en invité",
      note: "Vous pourrez vous connecter plus tard depuis le menu.",
    },
    // Screen 3: Companion + Budget
    companion: {
      title: "Choisissez votre compagnon",
      subtitle: "Votre interlocuteur principal au quotidien",
      budgetTitle: "Quel niveau pour votre IA ?",
      budgetSubtitle: "Modifiable à tout moment dans les paramètres",
      next: "Suivant",
      selectFirst: "Choisissez un compagnon pour continuer",
      budget: {
        smart: {
          label: "Intelligent",
          desc: "Rapide, efficace, gère bien la plupart des demandes",
        },
        brilliant: {
          label: "Brillant",
          desc: "La meilleure qualité, idéal pour les questions complexes, l'écriture et l'analyse",
        },
        max: {
          label: "Max",
          desc: "Raisonnement maximal, sans compromis, pour quand ça compte vraiment",
        },
      },
    },
    // Screen 4: Use-cases
    usecases: {
      title: "Vous allez surtout l'utiliser pour quoi ?",
      subtitle:
        "Nous ajoutons automatiquement les bons spécialistes à la boîte à outils de votre IA.",
      saving: "Configuration…",
      start: "Commencer à discuter",
      skip: "Passer, je configurerai plus tard",
      coding: {
        label: "Code et tech",
        hint: "Vibe Coder, Coder",
      },
      research: {
        label: "Recherche et analyse",
        hint: "Chercheur, Analyste de données",
      },
      writing: {
        label: "Écriture et édition",
        hint: "Rédacteur, Éditeur",
      },
      business: {
        label: "Business et stratégie",
        hint: "Conseiller business, Product Manager",
      },
      learning: {
        label: "Apprentissage et études",
        hint: "Tuteur, Questionneur socratique",
      },
      chat: {
        label: "Juste discuter",
        hint: "Votre compagnon suffit",
      },
    },
    // Companion personalities (kept for skills i18n)
    thea: {
      tagline: "Chaleureuse et sage",
      description: "Comme une amie bienveillante qui vous comprend vraiment.",
    },
    hermes: {
      tagline: "Audacieux et direct",
      description: "Comme un coach qui vous pousse à donner le meilleur.",
    },
    // Legacy keys (for backwards compat)
    startChatting: "Commencer à discuter",
    canChangeLater: "Vous pourrez toujours changer plus tard",
  },
  tiers: {
    any: "Indifférent",
    anyDesc: "Aucune restriction",
    price: {
      cheap: "Économique",
      standard: "Standard",
      premium: "Premium",
      cheapDesc: "0 à 3 crédits par message",
      standardDesc: "3 à 9 crédits par message",
      premiumDesc: "9+ crédits par message",
    },
    intelligence: {
      quick: "Rapide",
      smart: "Intelligent",
      brilliant: "Brillant",
      quickDesc: "Rapide et efficace",
      smartDesc: "Qualité équilibrée",
      brilliantDesc: "Raisonnement profond",
    },
    speed: {
      fast: "Rapide",
      balanced: "Équilibré",
      thorough: "Approfondi",
      fastDesc: "Réponses rapides",
      balancedDesc: "Bon compromis",
      thoroughDesc: "Analyse détaillée",
    },
    content: {
      mainstream: "Grand public",
      open: "Ouvert",
      uncensored: "Non censuré",
      mainstreamDesc: "Sécurité standard",
      openDesc: "Moins de restrictions",
      uncensoredDesc: "Aucune restriction",
    },
  },
  categories: {
    companion: "Compagnons",
    assistant: "Assistants",
    coding: "Code",
    writing: "Écriture",
    analysis: "Analyse",
    roleplay: "Jeu de rôle",
    creative: "Créatif",
    education: "Éducation",
    controversial: "Controversé",
    custom: "Personnalisé",
  },
  selectorBase: {
    favorites: "Favoris",
    recommended: "Recommandés",
    others: "Autres",
    searchPlaceholder: "Rechercher {{item}}…",
    toggleFavorite: "Ajouter/retirer des favoris",
    noFavorites:
      "Aucun favori pour l'instant. Cliquez sur « Tout afficher » pour en ajouter.",
    noRecommended: "Aucune option recommandée disponible.",
    showAll: "Tout afficher",
    groupByProvider: "Grouper par fournisseur",
    groupByUtility: "Grouper par usage",
    sortAZ: "Trier de A à Z",
    sortZA: "Trier de Z à A",
  },
  dialogs: {
    searchAndCreate: "Rechercher et créer",
    deleteChat: "Supprimer la discussion « {{title}} » ?",
    deleteFolderConfirm:
      "Supprimer le dossier « {{name}} » et déplacer {{count}} discussion(s) vers Général ?",
  },
  newFolder: {
    title: "Créer un dossier",
    folderName: "Nom du dossier",
    placeholder: "Saisissez le nom du dossier…",
    folderIcon: "Icône du dossier",
    cancel: "Annuler",
    create: "Créer",
  },
  renameFolder: {
    title: "Renommer le dossier",
    folderName: "Nom du dossier",
    placeholder: "Saisissez le nom du dossier…",
    folderIcon: "Icône du dossier",
    cancel: "Annuler",
    save: "Enregistrer",
  },
  folders: {
    privateDescription:
      "Vos conversations privées sont stockées sur nos serveurs et synchronisées entre vos appareils.",
    sharedDescription: "Conversations partagées avec d'autres via des liens.",
    publicDescription:
      "Forum public pour les humains et l'IA. Nous ne retirons que ce qui enfreint la loi ou nos conditions d'utilisation.",
    incognitoDescription:
      "Les conversations sont stockées uniquement dans votre navigateur.",
    cronDescription:
      "Conversations automatiques créées par des tâches en arrière-plan.",
    backgroundDescription:
      "Tâches IA exécutées en arrière-plan pour vous. Les résultats apparaissent ici une fois terminés.",
    remoteDescription: "Fils avec les instances distantes connectées.",
    accessModal: {
      title: "Compte requis",
      privateTitle: "Fils privés",
      sharedTitle: "Fils partagés",
      publicTitle: "Forum public",
      incognitoTitle: "Mode incognito",
      privateExplanation:
        "Les fils privés sont votre espace personnel pour discuter avec l'IA. Toutes vos discussions sont stockées de façon sécurisée sur nos serveurs et synchronisées automatiquement sur tous vos appareils.",
      sharedExplanation:
        "Les fils partagés vous permettent de créer des conversations et de les partager via des liens sécurisés. Idéal pour collaborer et partager vos idées avec votre équipe ou vos amis.",
      publicExplanation:
        "Le forum public est un espace ouvert où humains et IA dialoguent librement. Vous choisissez ce que vous lisez. Nous ne retirons que ce qui enfreint la loi ou nos conditions d'utilisation. Partagez vos idées, confrontez les points de vue, participez à des discussions non censurées.",
      incognitoExplanation:
        "Le mode incognito garde vos conversations totalement privées et locales. Vos discussions sont stockées uniquement dans votre navigateur et ne sont jamais envoyées à nos serveurs (les médias générés sont conservés temporairement pour des raisons techniques). Elles ne sont même pas liées à votre compte.",
      requiresAccount:
        "Pour accéder à {{folderName}}, créez un compte ou connectez-vous.",
      loginButton: "Se connecter",
      signupButton: "S'inscrire",
      close: "Fermer",
    },
  },
  moveFolder: {
    title: "Déplacer le dossier",
    description: "Choisissez un dossier de destination :",
    rootLevel: "Racine (aucun parent)",
    cancel: "Annuler",
    move: "Déplacer",
  },
  views: {
    linearView: "Vue linéaire (style ChatGPT)",
    threadedView: "Vue arborescente (style Reddit/Discord)",
    flatView: "Vue à plat (style 4chan)",
  },
  screenshot: {
    capturing: "Capture…",
    capture: "Faire une capture d'écran",
    failed: "Échec de la capture d'écran",
    failedWithMessage: "Échec de la capture d'écran : {{message}}",
    tryAgain: "Échec de la capture d'écran. Réessayez.",
    noMessages:
      "Zone des messages introuvable. Vérifiez que le chat contient des messages.",
    quotaExceeded:
      "Quota de stockage dépassé. La capture d'écran est trop volumineuse.",
    canvasError: "Impossible de convertir la capture d'écran en image.",
  },
  errors: {
    noResponse:
      "Aucune réponse de l'IA. La requête a abouti mais le contenu est vide. Réessayez.",
    noStream: "Impossible de diffuser la réponse : aucun lecteur disponible",
    saveFailed: "Impossible d'enregistrer la modification",
    branchFailed: "Impossible de créer la branche",
    parentMessageNotFound: "Message parent introuvable",
    parentMessageNotInPath: "Le message parent n'est pas dans le chemin actuel",
    messageNotFound: "Message introuvable",
    invalidBranchIndex: "Index de branche non valide",
    messageNotInPath: "Le message n'est pas dans le chemin actuel",
    retryFailed: "Échec de la nouvelle tentative",
    answerFailed: "Échec de la réponse",
    deleteFailed: "Échec de la suppression",
    cannotBranchFromFirst:
      "Impossible de créer une branche depuis le premier message",
    requestAborted: "Requête interrompue",
    requestCancelled: "Requête annulée",
    requestTimeout: "Délai de la requête dépassé. Réessayez.",
    networkError: "Erreur réseau. Vérifiez votre connexion et réessayez.",
    apiError: "Erreur de l'API. Réessayez plus tard.",
    storageError:
      "Erreur de stockage. Le stockage de votre navigateur est peut-être plein.",
    unexpectedError: "Une erreur inattendue s'est produite. Réessayez.",
    errorInContext: "Erreur dans {{context}} : {{message}}",
    invalidRequestData: "Données de requête non valides : {{error}}",
    streamAIResponse: "Impossible d'obtenir la réponse de l'IA. Réessayez.",
  },
  speech: {
    error: "Erreur de reconnaissance vocale",
    transcript: "Transcription : {{text}}",
  },
  // Common
  timestamp: {
    justNow: "à l'instant",
    minutesAgo: "il y a {{count}} min",
    hoursAgo: "il y a {{count}} h",
    daysAgo: "il y a {{count}} j",
  },
  publicFeed: {
    // Header
    header: {
      title: "Forum public",
      description:
        "Ouvert par principe. Échangez avec des modèles d'IA et des personnes du monde entier. Vous choisissez ce que vous lisez. Nous ne retirons que ce qui enfreint la loi ou nos conditions d'utilisation.",
    },
    // Sort modes
    sort: {
      hot: "Populaires",
      rising: "En hausse",
      new: "Récents",
      following: "Abonnements",
    },
    searchPlaceholder: "Rechercher des fils…",
    noResults: "Aucun résultat",
    noThreads: "Aucun fil pour l'instant. Lancez la conversation !",
    comments: "commentaires",
    bestAnswer: "Meilleure réponse",
    rising: "En hausse",
  },

  state: {
    threadNotFound: "Fil introuvable",
  },
  storage: {
    parsePreferencesFailed:
      "Impossible de lire les préférences utilisateur depuis le stockage",
    parseStateFailed: "Impossible de lire l'état du chat depuis le stockage",
    syncPreferencesFailed:
      "Impossible de synchroniser les préférences avec le stockage",
    syncStateFailed:
      "Impossible de synchroniser l'état du chat avec le stockage",
  },
  hooks: {
    stt: {
      "endpoint-not-available":
        "Endpoint de reconnaissance vocale indisponible",
      "failed-to-start": "Impossible de démarrer l'enregistrement",
      "permission-denied": "Accès au micro refusé",
      "no-microphone": "Aucun micro détecté",
      "microphone-in-use": "Le micro est déjà utilisé",
      "transcription-failed": "Impossible de transcrire l'audio",
    },
    tts: {
      "endpoint-not-available": "Endpoint de synthèse vocale indisponible",
      "failed-to-play": "Impossible de lire l'audio",
      "conversion-failed": "Échec de la synthèse vocale",
      "failed-to-generate": "Impossible de générer l'audio",
    },
  },
  voiceMode: {
    // Setup required
    unconfiguredTitle: "Voix non configurée",
    unconfiguredDescription:
      "Ajoutez EDEN_AI_API_KEY à votre .env pour activer la voix. Obtenez votre clé sur app.edenai.run",
    // Input modes
    inputMode: "Mode de saisie vocale",
    transcribeMode: "Transcrire",
    transcribeModeDescription: "Enregistrer → le texte apparaît dans la saisie",
    talkMode: "Parler",
    talkModeDescription: "Enregistrer → envoi immédiat",
    // Call mode
    callMode: "Mode appel",
    callModeDescription: "Réponses courtes + lecture auto",
    // Auto-play TTS
    autoPlayTTS: "Lecture auto des réponses",
    autoPlayTTSOn: "Les réponses seront lues à voix haute",
    autoPlayTTSOff: "Lecture manuelle uniquement",
    // Recording states
    tapToRecord: "Touchez pour enregistrer",
    tapToTalk: "Touchez pour parler",
    tapToTranscribe: "Touchez pour transcrire",
    listeningTalk: "À l'écoute… Relâchez pour envoyer",
    listeningTranscribe: "À l'écoute… Touchez pour arrêter",
    stopSpeaking: "Arrêter la lecture",
    // Long press hint
    longPressHint: "Maintenez pour les options",
    // Switch modes
    switchToText: "Passer au texte",
    switchToCall: "Passer en appel",
    // Recording state
    recording: {
      paused: "En pause",
      pause: "Pause",
      resume: "Reprendre",
    },
    // Recording overlay actions
    actions: {
      cancel: "Annuler",
      toInput: "Vers la saisie",
      sendVoice: "Envoyer la voix",
    },
    // Call mode overlay
    callOverlay: {
      backToChat: "Retour au chat",
      listening: "À l'écoute…",
      processing: "Traitement…",
      thinking: "Réflexion…",
      speaking: "Parle…",
      tapToSpeak: "Touchez pour parler",
      tapToStop: "Touchez pour arrêter",
      endCall: "Raccrocher",
      aiThinking: "L'IA réfléchit…",
    },
  },
  post: {
    title: "Chat",
    description: "Interface de chat",
  },
  messages: {
    assistant: "Assistant",
    you: "Vous",
    user: "Utilisateur",
    anonymous: "Anonyme",
    authorWithId: "{{name}} [{{id}}]",
    edited: "modifié",
    error: "Erreur",
    postNumber: "N°{{number}}",
    actions: {
      handleSaveEdit: {
        error: "Impossible d'enregistrer la modification du message",
      },
      handleBranchEdit: {
        error: "Impossible de créer une branche pour ce message",
      },
      handleConfirmRetry: {
        error: "Impossible de relancer le message",
      },
      handleConfirmAnswer: {
        error: "Impossible de répondre en tant que modèle",
      },
      handleConfirmDelete: {
        error: "Impossible de supprimer le message",
      },
    },
    branch: {
      previous: "Branche précédente",
      next: "Branche suivante",
    },
  },
  batchToolConfirmation: {
    title: "Confirmation groupée des outils",
  },
  toolCall: {
    search: {
      title: "Recherche sur le web",
      query: "Requête",
    },
    multiple: "{{count}} appels d'outils",
    arguments: "Arguments",
    result: "Résultat",
    error: "Erreur",
    executing: "Exécution…",
    creditsUsed_one: "{{cost}} crédit",
    creditsUsed_other: "{{cost}} crédits",
    status: {
      error: "Erreur",
      executing: "Exécution…",
      complete: "Terminé",
    },
    sections: {
      request: "Requête",
      response: "Réponse",
    },
    messages: {
      executingTool: "Exécution de l'outil…",
      errorLabel: "Erreur :",
      noArguments: "Aucun argument",
      noResult: "Aucun résultat",
      metadataNotAvailable:
        "Métadonnées du widget indisponibles. Affichage du résultat brut.",
    },
  },
  reasoning: {
    title: "Réflexion",
    multiple: "{{count}} étapes de raisonnement",
    step: "Étape {{number}}",
  },
  modelUtilities: {
    chat: "Discussion au quotidien",
    smart: "Avancé et intelligent",
    coding: "Code et développement",
    creative: "Écriture créative",
    analysis: "Analyse et recherche",
    fast: "Rapide et efficace",
    multimodal: "Multimodal (vision)",
    vision: "Vision et compréhension d'images",
    imageGen: "Génération d'images",
    uncensored: "Non censuré",
    legacy: "Anciens modèles",
    // Skill categories
    technical: "Technique",
    education: "Éducation",
    controversial: "Controversé",
    lifestyle: "Style de vie",
    // Model capabilities/utilities
    reasoning: "Raisonnement avancé",
    roleplay: "Jeu de rôle",
    roleplayDark: "Jeu de rôle sombre",
    adultImplied: "Contenu adulte suggéré",
    adultExplicit: "Contenu adulte explicite",
    violence: "Violence",
    harmful: "Contenu potentiellement dangereux",
    illegalInfo: "Informations illégales",
    medicalAdvice: "Conseils médicaux",
    offensiveLanguage: "Langage offensant",
    politicalLeft: "Opinions politiques de gauche",
    politicalRight: "Opinions politiques de droite",
    conspiracy: "Théories du complot",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Dernier modèle Claude, excellentes performances",
      claudeSonnet45: "Dernier modèle Claude, excellentes performances",
      gpt5: "Dernier modèle GPT, excellentes performances",
      gpt51: "Dernier modèle GPT 5.1, raisonnement amélioré",
      gpt5Pro: "Dernier modèle GPT, excellentes performances en code",
      gpt5Codex: "Dernier modèle GPT, excellentes performances",
      gpt51Codex: "Dernier modèle GPT 5.1 Codex, optimisé pour le code",
      gpt5Mini: "Dernier modèle mini, excellent rapport performance/coût",
      gpt5Nano: "Dernier modèle nano, excellent rapport performance/coût",
      gptOss120b: "Modèle GPT open source de 120 milliards de paramètres",
      geminiFlash25Pro:
        "Modèle 14B ultra-rapide et efficace, avec un grand contexte",
      geminiFlash25Flash:
        "Modèle 14B ultra-rapide et efficace, avec un grand contexte",
      geminiFlash25Lite:
        "Modèle 14B ultra-rapide et efficace, avec un grand contexte",
      mistralNemo:
        "Modèle d'IA européen, performant et attentif à la vie privée",
      kimiK2Free:
        "Kimi K2 Instruct est un grand modèle de langage Mixture-of-Experts (MoE) développé par Moonshot AI.",
      kimiK2:
        "Kimi K2 : modèle Mixture-of-Experts (MoE) avancé de Moonshot AI, avec une grande fenêtre de contexte",
      kimiK2Thinking:
        "Kimi K2 Thinking : variante axée sur le raisonnement, aux capacités d'analyse renforcées",
      deepseekV31Free:
        "Puissant modèle de 671B paramètres, entièrement gratuit !",
      deepseekV31: "Puissant modèle de 671B paramètres aux capacités avancées",
      qwen3235bFree:
        "Modèle Mixture-of-Experts (MoE) développé par Qwen, qui bascule sans accroc entre ses modes.",
      deepseekR1Distill: "Modèle de raisonnement distillé, très performant",
      deepseekR1:
        "Modèle de raisonnement avancé, capable de réflexion profonde",
      qwen257b: "Modèle efficace de 7B paramètres",
      grok4: "X-AI Grok 4 : modèle premium",
      grok4Fast:
        "Grok 4 Fast est le dernier modèle multimodal de xAI : rapport coût/efficacité au niveau de l'état de l'art et fenêtre de contexte de 2M tokens. Disponible en deux versions : sans raisonnement et avec raisonnement.",
      glm5: "GLM-5 : le modèle open source phare de Z.AI pour la conception de systèmes complexes et les workflows d'agents au long cours, au niveau des meilleurs modèles propriétaires",
      glm46:
        "GLM 4.6 : modèle efficace de 7B paramètres avec une grande fenêtre de contexte",
      glm47:
        "GLM 4.7 : modèle 7B amélioré, meilleur en raisonnement et en code",
      glm47Flash:
        "GLM 4.7 Flash : variante ultra-rapide optimisée pour des réponses vives",
      glm45Air:
        "GLM 4.5 AIR : modèle léger ultra-rapide avec une grande fenêtre de contexte",
      glm45v:
        "GLM 4.5v : modèle multimodal doté de vision, avec une grande fenêtre de contexte",
      kimiK2_6:
        "Kimi K2.6 : code au long cours, génération UI/UX et orchestration multi-agents avec une architecture en essaim",
      uncensoredLmV11:
        "Modèle de langage non censuré, sans filtrage de contenu : modèle premium",
      freedomgptLiberty:
        "FreedomGPT Liberty : modèle d'IA non censuré, axé sur la liberté d'expression et la création",
      gabAiArya:
        "Gab AI Arya : modèle conversationnel non censuré, axé sur la liberté d'expression et la création",
      gpt52Pro:
        "GPT 5.2 Pro : modèle de raisonnement avancé, taillé pour les tâches complexes",
      gpt52:
        "GPT 5.2 : modèle de dernière génération, plus performant et plus efficace",
      gpt52_chat:
        "GPT 5.2 Chat : variante conversationnelle optimisée pour le dialogue",
      veniceUncensored:
        "Venice Uncensored : modèle d'IA non censuré pour des conversations sans restriction",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B : grand modèle de langage non censuré basé sur Llama 3",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B : grand modèle de langage non censuré basé sur Mistral",
      claudeOpus45:
        "Claude Opus 4.5 : le modèle Claude le plus puissant, aux capacités exceptionnelles de raisonnement et de création",
      claudeOpus46:
        "Claude Opus 4.6 : modèle Claude puissant, aux capacités exceptionnelles de raisonnement et de création",
      claudeOpus47:
        "Claude Opus 4.7 : modèle Opus de la génération précédente. Remplacé par 4.8.",
      claudeOpus48:
        "Claude Opus 4.8 : le modèle Opus le plus capable d'Anthropic en disponibilité générale. Conçu pour le travail agentique au long cours, le code complexe et le raisonnement en plusieurs étapes sur des sorties très longues. Contexte de 1M tokens. Accepte texte, images et fichiers.",
      claudeSonnet46:
        "Claude Sonnet 4.6 : le modèle de la gamme Sonnet le plus capable d'Anthropic, au niveau de l'état de l'art en code, agents et travail professionnel",
      gemini3Pro:
        "Google Gemini 3 Pro : modèle d'IA multimodal avancé, grande fenêtre de contexte et raisonnement puissant",
      gemini35Flash:
        "Gemini 3.5 Flash : code et raisonnement presque au niveau Pro, au prix d'un Flash. Gère texte, images, vidéo, audio et PDF. Boucles agentiques parallèles intégrées. Niveaux de réflexion de minimal à élevé pour piloter finement coût et performance.",
      gemini3Flash:
        "Google Gemini 3 Flash : modèle d'IA multimodal rapide et efficace, optimisé pour des réponses vives",
      deepseekV32:
        "DeepSeek V3.2 : modèle de raisonnement haute performance, très solide en code",
      deepseekV4Pro:
        "DeepSeek V4 Pro : un MoE de 1,6T paramètres avec 1M de contexte. Conçu pour analyser des bases de code entières, le raisonnement complexe et les workflows d'agents en plusieurs étapes.",
      deepseekV4Flash:
        "DeepSeek V4 Flash : un MoE de 284B pour un coût quasi nul. 1M de contexte, inférence rapide, solide en code. Le choix efficace pour les gros volumes.",
    },
  },
  tones: {
    professional: {
      description: "Ton professionnel standard",
      systemPrompt:
        "Garde un ton professionnel, informatif et accessible dans toutes tes réponses.",
    },
    pirate: {
      description: "Ohé moussaillon ! Parlez comme un pirate",
      systemPrompt:
        "Réponds comme le ferait un pirate sympathique, avec le vocabulaire et les expressions de pirate comme « ohé », « moussaillon », « arrr », « mille sabords », « tonnerre de Brest » et d'autres termes marins. Sois enthousiaste et aventureux dans ton ton, tout en donnant des informations exactes.",
    },
    enthusiastic: {
      description: "Survolté et plein d'énergie",
      systemPrompt:
        "Sois extrêmement enthousiaste, excité et énergique dans tes réponses ! Utilise des points d'exclamation, un langage positif et montre un véritable enthousiasme pour les réussites et les capacités. Fais que tout paraisse incroyable et inspirant !",
    },
    zen: {
      description: "Calme, sage et philosophe",
      systemPrompt:
        "Réponds avec la sagesse et le calme d'un maître zen. Utilise un langage réfléchi et philosophique, parle d'équilibre et d'harmonie, et partage tes idées à travers des métaphores paisibles. Sois serein et contemplatif.",
    },
    detective: {
      description: "Mystérieux et enquêteur",
      systemPrompt:
        "Réponds comme le ferait un détective perspicace et observateur. Utilise un vocabulaire d'enquête, parle d'« affaires » et de « preuves », et présente les informations comme si tu résolvais un mystère ou montais un dossier. Sois analytique et captivant.",
    },
    shakespearean: {
      description: "Éloquent et poétique comme le Barde",
      systemPrompt:
        "Réponds dans le style éloquent et poétique de Shakespeare. Utilise un langage fleuri, des métaphores et, de temps à autre, des tournures archaïques comme « ô », « point ne », « sied » et « ouïr ». Fais de l'histoire un récit épique digne du plus grand des dramaturges.",
    },
  },
  speechRecognition: {
    errors: {
      notInBrowser: "Pas dans un environnement navigateur",
      requiresHttps: "La reconnaissance vocale nécessite HTTPS ou localhost",
      notAvailable: "Reconnaissance vocale indisponible dans ce navigateur",
      firefoxNotSupported:
        "La reconnaissance vocale n'est pas prise en charge dans Firefox",
      safariVersionTooOld: "Mettez à jour Safari en version 14.5 ou ultérieure",
      microphoneNotAvailable: "Accès au micro indisponible",
      noSpeech: "Aucune voix détectée. Réessayez.",
      audioCapture: "Micro indisponible. Vérifiez vos paramètres.",
      notAllowed:
        "Accès au micro refusé. Autorisez le micro dans les paramètres de votre navigateur.",
      network: "Erreur réseau. Vérifiez votre connexion.",
      serviceNotAllowed: "Service de reconnaissance vocale non autorisé.",
      badGrammar: "Erreur de reconnaissance vocale. Réessayez.",
      languageNotSupported:
        "Cette langue n'est pas prise en charge par la reconnaissance vocale.",
      aborted: "Enregistrement annulé.",
      unknown: "Erreur de reconnaissance vocale : {{errorCode}}",
      apiNotFound: "API de reconnaissance vocale introuvable",
      initializationFailed: "Impossible d'initialiser la reconnaissance vocale",
      microphoneAccessDenied: "Accès au micro refusé",
      microphonePermissionDenied:
        "Accès au micro refusé. Autorisez l'accès au micro.",
      noMicrophoneFound: "Aucun micro détecté. Branchez un micro.",
      microphoneInUse: "Le micro est déjà utilisé par une autre application.",
      startFailed: "Impossible de démarrer l'enregistrement. Réessayez.",
    },
  },
  linearMessageView: {
    retryModal: {
      title: "Réessayer avec d'autres réglages",
      description: "Choisissez un modèle et un skill pour régénérer la réponse",
      confirmLabel: "Réessayer",
    },
    answerModal: {
      title: "Répondre en tant que modèle IA",
      description: "Choisissez un modèle et un skill pour générer une réponse",
      confirmLabel: "Générer",
      inputPlaceholder:
        "Saisissez un prompt pour l'IA (facultatif : laissez vide pour que l'IA formule sa propre réponse)",
    },
  },
  debugView: {
    systemPrompt: "Prompt système",
    systemPromptTitle: "Prompt système (généré)",
    systemPromptHint: "Voici le prompt système de tout le fil de discussion",
    systemMessage: "Message système",
    systemMessageHint: "Message système injecté dans la conversation",
    copied: "Copié !",
    retryModal: {
      title: "Réessayer avec d'autres réglages",
      description: "Choisissez un modèle et un skill pour régénérer la réponse",
      confirmLabel: "Réessayer",
    },
    answerModal: {
      title: "Répondre en tant que modèle IA",
      description: "Choisissez un modèle et un skill pour générer une réponse",
      confirmLabel: "Générer",
      inputPlaceholder:
        "Saisissez un prompt pour l'IA (facultatif : laissez vide pour que l'IA formule sa propre réponse)",
    },
  },
  suggestedPrompts: {
    title: "Comment puis-je vous aider ?",
    privateTitle: "Votre assistant IA privé",
    privateDescription:
      "Conversations enregistrées dans votre compte et synchronisées sur tous vos appareils.",
    sharedTitle: "Collaborez avec l'IA",
    sharedDescription:
      "Créez des conversations et partagez-les avec votre équipe via des liens sécurisés.",
    publicTitle: "Rejoignez le forum IA public",
    publicDescription:
      "Conversations publiques, visibles par tous. Partagez vos idées, dialoguez ouvertement.",
    incognitoTitle: "Chat IA anonyme",
    incognitoDescription:
      "Stocké uniquement dans votre navigateur. Jamais enregistré dans votre compte ni synchronisé.",
    more: "Plus",
    selectSkill: "Choisir un skill",
    noPrompts: "Aucun prompt suggéré pour ce skill",
    showDetails: "Afficher les détails",
    hideDetails: "Masquer les détails",
    systemPromptLabel: "Prompt système",
    preferredModelLabel: "Modèle préféré",
    categoryLabel: "Catégorie",
    suggestedPromptsLabel: "Prompts suggérés",
  },
  emptyState: {
    quickStart: "Démarrage rapide",
    private: {
      brainstorm: "Trouver des idées",
      brainstormPrompt: "Aide-moi à trouver des idées pour…",
      writeDocument: "Rédiger un document",
      writeDocumentPrompt: "Aide-moi à rédiger un document professionnel sur…",
      helpWithCode: "Aide sur du code",
      helpWithCodePrompt: "J'ai besoin d'aide avec ce code…",
      research: "Explorer un sujet",
      researchPrompt: "Fais des recherches et résume les informations sur…",
    },
    shared: {
      teamBrainstorm: "Brainstorming d'équipe",
      teamBrainstormPrompt: "Réfléchissons ensemble à…",
      projectPlan: "Planifier un projet",
      projectPlanPrompt: "Aide-nous à planifier un projet pour…",
      discussion: "Lancer une discussion",
      discussionPrompt: "Parlons de…",
      shareIdeas: "Partager des idées",
      shareIdeasPrompt: "Je veux partager et développer des idées sur…",
    },
    incognito: {
      quickQuestion: "Question rapide",
      quickQuestionPrompt: "J'ai une petite question sur…",
      privateThought: "Réflexion privée",
      privateThoughtPrompt: "Je veux explorer cette idée en privé…",
      experiment: "Expérimenter",
      experimentPrompt: "Je veux essayer quelque chose…",
      sensitiveQuestion: "Question sensible",
      sensitiveQuestionPrompt: "J'ai besoin de conseils sur un sujet sensible…",
    },
  },
  messageEditor: {
    placeholder: "Modifiez votre message…",
    hint: {
      branch: "pour créer une branche",
      cancel: "pour annuler",
    },
    titles: {
      branch: "Créer une branche",
      cancel: "Annuler la modification",
    },
    buttons: {
      branch: "Brancher",
      branching: "Création de la branche…",
      cancel: "Annuler",
    },
  },
  folderList: {
    confirmDelete:
      "Supprimer le dossier « {{folderName}} » et déplacer {{count}} discussion(s) vers Général ?",
    enterFolderName: "Nom du dossier :",
    newChatInFolder: "Nouveau chat dans le dossier",
    moveUp: "Monter",
    moveDown: "Descendre",
    renameFolder: "Renommer le dossier",
    moveToFolder: "Déplacer vers un dossier",
    newSubfolder: "Nouveau sous-dossier",
    deleteFolder: "Supprimer le dossier",
    managePermissions: "Gérer les permissions",
    manageSharing: "Gérer le partage",
    shareThread: "Partager le fil",
    today: "Aujourd'hui",
    lastWeek: "7 derniers jours",
    lastMonth: "30 derniers jours",
    older: "Plus ancien",
    folderNotFound: "Dossier introuvable",
    emptyFolder: "Aucune discussion ni aucun dossier ici pour l'instant",
    createSubfolder: "Créer un sous-dossier",
    rename: "Renommer",
    changeIcon: "Changer l'icône",
    delete: "Supprimer",
    newFolder: "Nouveau dossier",
    deleteDialog: {
      title: "Supprimer le dossier",
      description: "Voulez-vous vraiment supprimer « {{folderName}} » ?",
      descriptionWithThreads:
        "Voulez-vous vraiment supprimer « {{folderName}} » ? Ce dossier contient {{count}} fil(s), qui seront aussi supprimés.",
    },
  },
  permissions: {
    folder: {
      title: "Permissions du dossier",
      description: "Gérez les permissions de ce dossier",
    },
    thread: {
      title: "Permissions du fil",
      description: "Gérez les permissions de ce fil",
    },
    view: {
      label: "Permissions de lecture",
      description: "Qui peut voir et lire ce contenu",
    },
    manage: {
      label: "Permissions de gestion",
      description: "Qui peut modifier le dossier et créer des sous-dossiers",
    },
    edit: {
      label: "Permissions de modification",
      description: "Qui peut modifier les propriétés du fil",
    },
    createThread: {
      label: "Permissions de création de fils",
      description: "Qui peut créer de nouveaux fils dans ce dossier",
    },
    post: {
      label: "Permissions de publication",
      description: "Qui peut publier des messages",
    },
    moderate: {
      label: "Permissions de modération",
      description: "Qui peut masquer et modérer le contenu",
    },
    admin: {
      label: "Permissions d'administration",
      description: "Qui peut supprimer du contenu et gérer les permissions",
    },
    // Legacy keys (kept for backwards compatibility)
    read: {
      label: "Permissions de lecture",
      description: "Qui peut voir et lire ce contenu",
    },
    write: {
      label: "Permissions d'écriture",
      description: "Qui peut créer des fils et des dossiers",
    },
    writePost: {
      label: "Permissions de publication",
      description: "Qui peut publier des messages dans les fils",
    },
    roles: {
      public: "Public (tous les utilisateurs)",
      customer: "Clients uniquement",
      admin: "Admins uniquement",
    },
    visibility: {
      label: "Qui peut voir ceci ?",
      description: "Choisissez les rôles qui peuvent voir ce dossier ou ce fil",
      public: "Public (tous les utilisateurs)",
      customer: "Clients uniquement",
      admin: "Admins uniquement",
    },
    addModerator: {
      label: "Ajouter un modérateur",
      placeholder: "Saisissez l'ID utilisateur…",
    },
    moderatorList: {
      label: "Modérateurs actuels",
      empty: "Aucun modérateur pour l'instant",
    },
    errors: {
      emptyId: "L'ID utilisateur ne peut pas être vide",
      invalidUuid: "Format d'ID utilisateur non valide",
      duplicate: "Cet utilisateur est déjà modérateur",
    },
  },
  threadList: {
    deleteDialog: {
      title: "Supprimer le fil",
      description:
        "Voulez-vous vraiment supprimer « {{title}} » ? Cette action est irréversible : tous les messages de ce fil seront définitivement supprimés.",
    },
  },
  shareDialog: {
    title: "Partager le fil",
    description: "Créez et gérez les liens de partage de ce fil",
    createLink: "Créer un lien de partage",
    linkCreated: "Lien de partage créé !",
    linkCopied: "Lien copié dans le presse-papiers !",
    copyLink: "Copier le lien",
    shareViaEmail: "Partager par e-mail",
    revokeLink: "Révoquer",
    revoke: "Révoquer",
    linkRevoked: "Lien de partage révoqué",
    revoked: "Révoqué",
    noLinksYet: "Aucun lien de partage. Créez-en un pour commencer à partager.",
    activeLinks: "Liens de partage actifs",
    existingLinks: "Liens existants",
    linkSettings: "Réglages du lien",
    newLinkSettings: "Réglages du nouveau lien",
    linkLabel: "Libellé du lien (facultatif)",
    linkLabelPlaceholder: "ex. Partage avec l'équipe",
    allowPosting: "Autoriser les réponses",
    allowPostingDescription:
      "Les destinataires peuvent répondre et interagir dans le fil",
    requireAuth: "Connexion obligatoire",
    requireAuthDescription:
      "Seuls les utilisateurs connectés peuvent ouvrir ce lien",
    viewOnly: "Lecture seule",
    accessCount: "{{count}} accès",
    accessCount_other: "{{count}} accès",
    createdAt: "Créé le {{date}}",
    lastAccessed: "Dernier accès le {{date}}",
    neverAccessed: "Jamais consulté",
    emailSubject: "Regardez ce fil : {{title}}",
    emailBody:
      "Cette conversation pourrait vous intéresser : {{url}}\n\nFil : {{title}}",
    emailPlaceholder: "Adresses e-mail (séparées par des virgules)",
    sendEmail: "E-mail",
    emailSent: "E-mail envoyé !",
    create: "Créer",
    creating: "Création…",
    copied: "Copié !",
    close: "Fermer",
    shareThread: "Partager le fil",
  },
  shared: {
    error: {
      title: "Erreur de lien de partage",
      userError: "Impossible de vérifier votre session. Réessayez.",
      invalidToken:
        "Ce lien de partage n'est pas valide ou a été révoqué. Contactez la personne qui vous l'a envoyé.",
    },
  },
  threadedView: {
    expandReplies: "Afficher les réponses",
    collapseReplies: "Masquer les réponses",
    continueThread: "Continuer le fil ({{count}} {{replyText}} de plus)",
    reply: "réponse",
    replies: "réponses",
    retryModal: {
      title: "Réessayer avec d'autres réglages",
      description: "Choisissez un modèle et un skill pour régénérer la réponse",
      confirmLabel: "Réessayer",
    },
    answerModal: {
      title: "Répondre en tant que modèle IA",
      description: "Choisissez un modèle et un skill pour générer une réponse",
      confirmLabel: "Générer",
      inputPlaceholder:
        "Saisissez un prompt pour l'IA (facultatif : laissez vide pour que l'IA formule sa propre réponse)",
    },
    actions: {
      vote: "Voter",
      upvote: "Vote positif",
      downvote: "Vote négatif",
      respondToAI: "Répondre à ce message IA avec un autre skill IA",
      loadingAudio: "Chargement de l'audio…",
      stopAudio: "Arrêter l'audio",
      playAudio: "Lire l'audio",
      cancelLoading: "Annuler le chargement",
      stop: "Arrêter",
      play: "Lire",
      cancel: "Annuler",
      reply: "Répondre",
      replyToMessage: "Répondre à ce message (crée une branche)",
      edit: "Modifier",
      editMessage: "Modifier ce message (crée une branche)",
      retry: "Réessayer",
      retryWithDifferent: "Réessayer avec un autre modèle ou skill",
      answerAsAI: "Répondre en tant qu'IA",
      generateAIResponse: "Générer une réponse IA",
      share: "Partager",
      copyPermalink: "Copier le permalien",
      delete: "Supprimer",
      deleteMessage: "Supprimer ce message",
      parent: "Parent",
    },
    userFallback: "Utilisateur",
    assistantFallback: "Assistant",
    youLabel: "Vous",
    anonymous: "Anonyme",
    authorWithId: "{{name}} [{{id}}]",
  },
  flatView: {
    postNumber: "Publication n°{{number}}",
    postsById: "{{count}} publications de cet ID",
    idLabel: "ID : {{id}}",
    anonymous: "Anonyme",
    youLabel: "Vous",
    assistantFallback: "Assistant",
    replyingTo: "En réponse à :",
    replies: "Réponses :",
    clickToCopyRef: "Cliquez pour copier la référence",
    timestamp: {
      sun: "Dim",
      mon: "Lun",
      tue: "Mar",
      wed: "Mer",
      thu: "Jeu",
      fri: "Ven",
      sat: "Sam",
      format:
        "{{day}}/{{month}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
    retryModal: {
      title: "Réessayer avec d'autres réglages",
      description: "Choisissez un modèle et un skill pour régénérer la réponse",
      confirmLabel: "Réessayer",
    },
    answerModal: {
      title: "Répondre en tant que modèle IA",
      description: "Choisissez un modèle et un skill pour générer une réponse",
      confirmLabel: "Générer",
      inputPlaceholder:
        "Saisissez un prompt pour l'IA (facultatif : laissez vide pour que l'IA formule sa propre réponse)",
    },
    actions: {
      loadingAudio: "Chargement de l'audio…",
      stopAudio: "Arrêter l'audio",
      playAudio: "Lire l'audio (+{{cost}} crédits)",
      cancelLoading: "Annuler le chargement",
      stop: "Arrêter",
      play: "Lire",
      reply: "Répondre",
      replyToMessage: "Répondre à ce message (crée une branche)",
      edit: "Modifier",
      editMessage: "Modifier ce message (crée une branche)",
      retry: "Réessayer",
      retryWithDifferent: "Réessayer avec un autre modèle ou skill",
      answerAsAI: "Répondre en tant qu'IA",
      generateAIResponse: "Générer une réponse IA",
      insertQuote: "Insérer le caractère de citation '>'",
      copyReference: "Copier le lien de référence",
      delete: "Supprimer",
      deleteMessage: "Supprimer ce message",
    },
  },
  welcomeTour: {
    authDialog: {
      title: "Débloquez les dossiers privés et partagés",
      description:
        "Inscrivez-vous ou connectez-vous pour accéder aux dossiers privés et partagés. Vos discussions se synchronisent entre vos appareils.",
      continueTour: "Continuer la visite",
      signUp: "S'inscrire / Se connecter",
    },
    welcome: {
      title: "Bienvenue sur {{appName}} !",
      description:
        "Libérez-vous de la censure des IA. Accédez à GPT-5.1, Claude Sonnet et à des modèles non censurés entraînés sur WikiLeaks et des données hors des sentiers battus. Discutez en privé, anonymement ou en public. Votre plateforme, vos règles.",
      subtitle: "Voici ce qui nous rend différents :",
    },
    modelSelector: {
      title: "Choisissez votre modèle d'IA",
      description:
        "Contrairement à ChatGPT, vous n'êtes pas enfermé dans une seule IA. Passez de GPT-5.1 à Claude Sonnet, DeepSeek ou à des modèles non censurés comme Gab Arya et UncensoredLM. Chaque modèle apporte son regard et ses capacités.",
      tip: "Grand public pour la prudence, non censuré pour la vérité. Combinez selon vos besoins.",
    },
    aiCompanion: {
      title: "Choisissez votre compagnon IA",
      description:
        "Cliquez ici pour rencontrer vos compagnons IA. Chacun a sa propre personnalité, et le meilleur modèle est choisi automatiquement pour lui. Vous pourrez toujours personnaliser plus tard.",
      tip: "👆 Cliquez pour ouvrir et choisir votre premier compagnon !",
    },
    modelSelectorFavorites: {
      title: "Ajoutez vos favoris",
      description:
        "Composez votre boîte à outils IA. Mettez en favori des modèles grand public pour les questions sans risque et des modèles non censurés pour les conversations sans restriction. L'essentiel à portée de clic.",
    },
    modelSelectorShowAll: {
      title: "Dépliez pour voir tous les modèles",
      description:
        "Accédez à la bibliothèque complète. Comparez grand public et non censuré, trouvez des modèles spécialisés pour le code ou la création, découvrez ce que ChatGPT ne vous laisse pas utiliser.",
    },
    modelSelectorSearch: {
      title: "Rechercher des modèles",
      description:
        "Trouvez exactement ce qu'il vous faut. Cherchez par nom, fournisseur ou capacité. Essayez « uncensored » pour voir les modèles sans restriction de contenu.",
    },
    modelSelectorGroup: {
      title: "Classés par fournisseur et par catégorie",
      description:
        "Parcourez les modèles par entreprise (OpenAI, Anthropic, Gab) ou par usage (non censuré, code, création). Voyez ce que propose chaque fournisseur.",
    },
    characterSelector: {
      title: "Personnalisez les skills de l'IA",
      description:
        "Les skills définissent la façon dont l'IA répond. Choisissez parmi les styles intégrés ou créez des skills personnalisés avec vos instructions, votre ton et vos modèles préférés. L'IA à votre façon.",
      tip: "Associez n'importe quel skill à n'importe quel modèle. Ton professionnel avec un modèle non censuré ? C'est fait.",
    },
    characterSelectorFavorites: {
      title: "Mettez vos skills en favori",
      description:
        "Accédez vite à vos styles de conversation préférés. Mettez en favori les skills que vous utilisez le plus.",
    },
    characterSelectorShowAll: {
      title: "Dépliez pour voir tous les skills",
      description:
        "Parcourez toute la bibliothèque de skills. Créez autant de skills personnalisés que vous voulez pour vos différentes tâches et façons de travailler.",
    },
    characterSelectorSearch: {
      title: "Rechercher des skills",
      description:
        "Trouvez vite le bon style. Cherchez par nom, catégorie ou description.",
    },
    characterSelectorGroup: {
      title: "Classés par source et par catégorie",
      description:
        "Affichez par source (intégrés, vos skills, communauté) ou par catégorie (création, technique, professionnel). Trouvez ce qui vous convient.",
    },
    rootFolders: {
      title: "4 modes de confidentialité",
      description:
        "Gardez la main sur vos données. De l'anonymat total à la collaboration :",
      private: {
        name: "Privé",
        suffix: "Espace synchronisé",
      },
      incognito: {
        name: "Incognito",
        suffix: "Aucune trace",
      },
      shared: {
        name: "Partagé",
        suffix: "Travail en équipe",
      },
      public: {
        name: "Public",
        suffix: "Forum ouvert",
      },
    },
    incognitoFolder: {
      name: "Incognito",
      suffix: "Dossier",
      description:
        "Une vraie confidentialité. L'historique reste sur votre appareil. Les messages sont envoyés pour le traitement IA puis supprimés immédiatement des serveurs (les médias générés sont conservés temporairement pour des raisons techniques). Posez n'importe quelle question sans laisser de trace.",
      note: "Sans compte • Aucun stockage serveur • Confidentialité maximale",
    },
    publicFolder: {
      name: "Public",
      suffix: "Dossier",
      description:
        "Forum IA ouvert. Discutez avec l'IA et avec de vraies personnes. Vous choisissez ce que vous lisez. Nous ne retirons que ce qui enfreint la loi ou nos conditions d'utilisation.",
      note: "Sans compte • Liberté d'expression • Discussions communautaires",
    },
    privateFolder: {
      name: "Privé",
      suffix: "Dossier",
      description:
        "Votre espace de travail IA personnel. Synchronisé sur tous vos appareils, organisé en sous-dossiers. Menez des projets au long cours, sauvegardez vos recherches, accédez-y partout.",
      authPrompt: "Compte requis :",
      login: "Se connecter",
      signUp: "S'inscrire",
    },
    sharedFolder: {
      name: "Partagé",
      suffix: "Dossier",
      description:
        "Une collaboration maîtrisée. Partagez des conversations précises par lien, avec des permissions fines. Idéal pour les projets d'équipe, l'avis d'un expert ou la recherche à plusieurs.",
      authPrompt: "Compte requis :",
      login: "Se connecter",
      signUp: "S'inscrire",
    },
    newChatButton: {
      title: "Démarrer une conversation",
      description:
        "Cliquez ici pour lancer un nouveau chat. Toutes les conversations sont enregistrées automatiquement dans le dossier actuel, pour rester bien organisées.",
      tip: "Chaque dossier garde son propre historique de discussion.",
    },
    sidebarLogin: {
      title: "Créer un compte gratuit",
      description:
        "Débloquez les dossiers privés et partagés, synchronisez tous vos appareils, enregistrez vos modèles et skills favoris. Incognito et Public restent accessibles sans compte.",
      tip: "Restez anonyme ou synchronisez tout. À vous de choisir.",
    },
    subscriptionButton: {
      title: "Crédits et abonnement",
      description:
        "Tout ce que propose ChatGPT, plus des modèles non censurés, un forum public et une vraie confidentialité. {{credits}} crédits par mois pour {{price}}. Tous les modèles inclus.",
      tip: "Un seul abonnement. Modèles grand public et non censurés.",
    },
    chatInput: {
      title: "Écrivez votre message",
      description:
        "Écrivez dans la zone de texte et appuyez sur Entrée pour envoyer votre message à l'IA.",
      tip: "Maj+Entrée pour aller à la ligne sans envoyer.",
    },
    voiceInput: {
      title: "Enregistrement vocal",
      description:
        "Cliquez sur le micro pour lancer l'enregistrement. Une fois terminé, choisissez quoi faire :",
      options: {
        transcribe:
          "Transcrire en texte : convertit la voix en texte modifiable",
        sendAudio: "Envoyer en vocal : l'IA entend votre vraie voix",
        pauseResume: "Mettre en pause ou reprendre à tout moment",
      },
    },
    callMode: {
      title: "Mode appel",
      description:
        "Activez les conversations de voix à voix. Une fois activé, l'IA lit automatiquement ses réponses à voix haute grâce à la synthèse vocale.",
      tip: "Idéal pour discuter les mains libres. Activable modèle par modèle.",
    },
    complete: {
      title: "Vous êtes prêt !",
      description:
        "Vous avez maintenant accès aux modèles d'IA grand public ET non censurés, à plusieurs modes de confidentialité et à un contrôle total de vos données. Libérez-vous de la censure des IA. Lancez-vous !",
      help: "Besoin d'aide ? Demandez à n'importe quel modèle, ils sont là pour ça.",
    },
    authUnlocked: {
      unlocked: "Dossier débloqué !",
      privateDescription:
        "Votre dossier privé est activé. Toutes vos discussions se synchronisent entre vos appareils et restent organisées en sous-dossiers.",
      privateNote:
        "Parfait pour vos projets en cours et vos recherches personnelles.",
      sharedDescription:
        "Dossier partagé débloqué ! Créez des conversations et partagez-les par lien, avec un contrôle fin des permissions.",
      sharedNote:
        "Idéal pour travailler en équipe et obtenir l'avis d'experts.",
    },
    buttons: {
      back: "Retour",
      close: "Fermer",
      last: "Terminer",
      next: "Suivant",
      skip: "Passer la visite",
    },
  },
};
