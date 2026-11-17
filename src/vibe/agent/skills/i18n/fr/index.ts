import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
    category: "Outils IA",
    tags: {
      skills: "skills",
    },
    voices: {
      MALE: "Voix masculine",
      FEMALE: "Voix féminine",
    },
    enums: {
      category: {
        companion: "Compagnons",
        assistant: "Assistants",
        coding: "Code",
        creative: "Créatif",
        writing: "Écriture",
        analysis: "Analyse",
        roleplay: "Jeu de rôle",
        education: "Éducation",
        controversial: "Controversé",
        background: "Arrière-plan",
        custom: "Personnalisé",
      },
      ownershipType: {
        system: "Compétence intégrée",
        user: "Créée par vous",
        public: "De la communauté",
      },
    },

    get: {
      title: "Obtenir une compétence",
      dynamicTitle: "Compétence : {{name}}",
      description: "Récupérer une compétence précise par son ID",
      container: {
        title: "Détails de la compétence",
        description: "Détails de la compétence demandée",
      },
      backButton: {
        label: "Retour aux compétences",
      },
      openFullPage: "Ouvrir la page complète",
      editButton: {
        label: "Modifier la compétence",
      },
      customizeButton: {
        label: "Personnaliser la compétence",
      },
      deleteButton: {
        label: "Supprimer la compétence",
      },
      addToFavoritesButton: {
        label: "Ajouter aux favoris",
      },
      inCollection: "Dans la collection",
      useNow: "Utiliser",
      goToChat: "Aller au chat",
      addAnother: "Ajouter une autre",
      addAnotherTooltip:
        "Ajouter une autre instance de cette compétence à votre collection",
      variants: {
        title: "Variantes",
      },
      addToCollection: "Ajouter à votre collection :",
      addAllToFavorites: "Tout ajouter",
      quickAdd: "Ajout rapide",
      tweakAndAdd: "Ajuster et ajouter",
      edit: "Modifier",
      copyAndCustomize: "Copier et personnaliser",
      delete: "Supprimer",
      actions: "Actions",
      designSelector: {
        label: "Design :",
        current: "Actuel",
        a: "A : App Store",
        b: "B : En-tête scindé",
        c: "C : Carte en vedette",
        d: "D : Deux rangées",
      },
      addVariant: "Ajouter une variante",
      addVariantHint: "Autre modèle, personnalité ou style",
      yourskill: "Votre compétence",
      signupPrompt: {
        title: "Personnaliser cette compétence",
        description:
          "Créez une version à vous, avec vos propres réglages et préférences. Inscrivez-vous pour commencer.",
        backButton: "Retour",
        signupButton: "Créer un compte",
        loginButton: "Se connecter",
      },
      id: {
        label: "ID de la compétence",
        description: "Le slug ou l'ID lisible de la compétence",
      },
      systemPrompt: {
        label: "Prompt système",
        copy: "Copier",
        copied: "Copié !",
        view: "Voir le prompt complet",
      },
      models: {
        brain: "Cerveau",
        eyes: "Yeux",
        ears: "Oreilles et voix",
        media: "Médias",
        slots: {
          chat: "Chat",
          imageVision: "Vision d'image",
          videoVision: "Vision vidéo",
          stt: "Transcription vocale",
          tts: "Synthèse vocale",
          audioVision: "Vision audio",
          imageGen: "Génération d'images",
          musicGen: "Génération musicale",
          videoGen: "Génération vidéo",
        },
      },
      response: {
        skill: {
          title: "Compétence",
          id: { content: "ID de la compétence" },
          name: { content: "Nom de la compétence" },
          description: { content: "Description de la compétence" },
          icon: { content: "Icône de la compétence" },
          systemPrompt: { content: "Prompt système" },
          category: { content: "Catégorie" },
          source: { content: "Source" },
          preferredModel: { content: "Modèle préféré" },
          voice: { content: "Voix" },
          modelSelection: { title: "Sélection du modèle" },
          selectionType: { content: "Type de sélection" },
          minIntelligence: { content: "Intelligence minimale" },
          maxIntelligence: { content: "Intelligence maximale" },
          minPrice: { content: "Prix minimum" },
          maxPrice: { content: "Prix maximum" },
          minContent: { content: "Niveau de contenu minimum" },
          maxContent: { content: "Niveau de contenu maximum" },
          preferredStrengths: { content: "Points forts recherchés" },
          ignoredWeaknesses: { content: "Points faibles ignorés" },
          manualModelId: { content: "Modèle manuel" },
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description:
            "Vous devez être connecté pour accéder à cette ressource",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas l'autorisation d'accéder à cette ressource",
        },
        notFound: {
          title: "Compétence introuvable",
          description: "La compétence demandée n'existe pas",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur est survenue lors de la récupération de la compétence",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit avec l'état actuel",
        },
      },
      voiceModelSelection: {
        systemDefault: "Défaut du système",
      },
      success: {
        title: "Succès",
        description: "Compétence récupérée",
      },
      share: {
        button: "Partager et gagner",
        title: "Partagez cette compétence et gagnez",
        description:
          "Partagez cette compétence avec votre lien de parrainage. Touchez 10 % de commission récurrente sur chaque utilisateur qui s'inscrit.",
        selectCode: "Choisir un code de parrainage :",
        noCodesYet: "Aucun code de parrainage pour l'instant",
        createCode: "Créer un code",
        codePlaceholder: "ex. MONCODE",
        creating: "Création...",
        linkReady: "Votre lien de partage :",
        copied: "Copié !",
        copyLink: "Copier le lien",
        close: "Fermer",
        authRequired:
          "Créez un compte gratuit pour obtenir votre lien de parrainage et commencer à gagner.",
        signup: "S'inscrire gratuitement",
        login: "Déjà un compte ? Se connecter",
      },
      leadCapture: {
        fallbackHeadline: "Restez informé",
        namePlaceholder: "Votre prénom",
        emailPlaceholder: "Votre e-mail",
        fallbackButton: "S'abonner",
        sending: "...",
        doneHeading: "C'est fait.",
        doneSub: "Vous êtes sur la liste.",
        error: "Un problème est survenu. Réessayez.",
        finePrint: "Pas de spam. Désinscription à tout moment.",
      },
      landing: {
        backToHome: "Accueil",
        signIn: "Se connecter",
        joinFree: "Rejoindre gratuitement",
        viewProfile: "Voir le profil complet",
        capabilities: "Capacités",
        tools: "{{count}} outils",
        moreFromCreator: "Plus de {{name}}",
        tryCta: "Essayez {{name}} maintenant",
        tryCtaSub: "Compte gratuit. Sans carte bancaire. Prêt en 30 secondes.",
        startFree: "Commencer gratuitement",
        alreadyHaveAccount: "Déjà un compte ?",
        copyright: "©",
        allSkills: "Toutes les compétences",
        featuredSkill: "Compétence à la une",
        aboutSkill: "À propos de cette compétence",
        modelsVariants: "Modèles et variantes",
      },
    },
    patch: {
      title: "Mettre à jour la compétence",
      dynamicTitle: "Modifier : {{name}}",
      container: {
        title: "Mettre à jour la compétence",
        description: "Modifier une compétence personnalisée existante",
      },
      backButton: {
        label: "Retour à la compétence",
      },
      deleteButton: {
        label: "Supprimer la compétence",
      },
      submitButton: {
        label: "Mettre à jour la compétence",
        loadingText: "Mise à jour de la compétence...",
      },
      actions: {
        update: "Mettre à jour la compétence",
        updating: "Mise à jour de la compétence",
      },
      response: {
        success: {
          content: "Compétence mise à jour",
        },
      },
      id: {
        label: "ID de la compétence",
        description: "Le slug ou l'ID lisible de la compétence à mettre à jour",
      },
      name: {
        label: "Nom de la compétence",
        description:
          "Donnez à votre compétence un nom facile à retenir. C'est ainsi que vous et les autres la reconnaîtrez.",
        placeholder: "Nom de la compétence",
        validation: {
          minLength: "Le nom doit contenir au moins 2 caractères",
          maxLength: "Le nom doit contenir moins de 100 caractères",
        },
      },
      tagline: {
        label: "Accroche de la compétence",
        description:
          "Une phrase percutante qui résume l'essence de votre compétence. Courte et parlante.",
        placeholder: "Une accroche courte",
        validation: {
          minLength: "L'accroche doit contenir au moins 2 caractères",
          maxLength: "L'accroche doit contenir moins de 500 caractères",
        },
      },
      icon: {
        label: "Icône de la compétence",
        description:
          "Choisissez un emoji qui représente votre compétence. Cette icône s'affiche partout où la compétence apparaît.",
      },
      description: {
        label: "Description de la compétence",
        description:
          "Décrivez ce qui rend cette compétence unique. Quel est son rôle ? En quoi peut-elle aider ? Soyez précis et détaillé.",
        placeholder: "Décrivez l'objectif et les capacités de votre compétence",
        validation: {
          minLength: "La description doit contenir au moins 10 caractères",
          maxLength: "La description doit contenir moins de 500 caractères",
        },
      },
      category: {
        label: "Catégorie",
        description:
          "Choisissez la catégorie qui correspond le mieux à votre compétence. Cela facilite le classement et la découverte.",
      },
      isPublic: {
        label: "Rendre public",
        description:
          "Activez cette option pour partager votre compétence avec la communauté. Désactivée, la compétence reste privée et visible par vous seul.",
      },
      chatModel: {
        label: "Modèle de chat",
        placeholder: "Défaut du système",
      },
      voice: {
        label: "Voix",
        description:
          "Choisissez une voix de synthèse vocale pour les réponses audio. Chaque compétence peut avoir sa propre voix.",
        placeholder: "Défaut du système",
      },
      sttModel: {
        label: "Modèle de transcription vocale",
        description: "Modèle utilisé pour la reconnaissance vocale",
        placeholder: "Défaut du système",
      },
      imageVisionModel: {
        label: "Modèle de vision d'image",
        description: "Modèle utilisé pour analyser les images",
        placeholder: "Défaut du système",
      },
      videoVisionModel: {
        label: "Modèle de vision vidéo",
        description: "Modèle utilisé pour analyser les vidéos",
        placeholder: "Défaut du système",
      },
      audioVisionModel: {
        label: "Modèle de vision audio",
        description: "Modèle utilisé pour analyser l'audio",
        placeholder: "Défaut du système",
      },
      imageGenModel: {
        label: "Modèle de génération d'images",
        description: "Modèle utilisé pour générer des images",
        placeholder: "Défaut du système",
      },
      musicGenModel: {
        label: "Modèle de génération musicale",
        description: "Modèle utilisé pour générer de la musique",
        placeholder: "Défaut du système",
      },
      videoGenModel: {
        label: "Modèle de génération vidéo",
        description: "Modèle utilisé pour générer des vidéos",
        placeholder: "Défaut du système",
      },
      systemPrompt: {
        label: "Prompt système",
        description:
          "Définissez le comportement, la personnalité et l'expertise de votre compétence. C'est l'instruction centrale qui façonne les réponses de l'IA. Détaillez le ton, les domaines de connaissance et le style de conversation.",
        placeholder: "Vous êtes un assistant serviable spécialisé dans...",
        validation: {
          minLength: "Le prompt système doit contenir au moins 10 caractères",
          maxLength: "Le prompt système doit contenir moins de 5000 caractères",
        },
      },
      source: {
        label: "Source",
        description:
          "L'origine de cette compétence (intégrée, personnalisée ou communautaire)",
      },
      modelSelection: {
        label: "Sélection du modèle",
        description:
          "Choisissez comment sélectionner le modèle d'IA : un modèle précis, ou un choix automatique selon des filtres",
      },
      variants: {
        label: "Variantes",
        description:
          "Variantes nommées avec leur propre sélection de modèle. Chaque variante a besoin de : id (chaîne unique), modelSelection (obligatoire), isDefault (exactement une doit être true). Facultatif : displayName, remplacements des modèles de voix, de vision et de génération.",
        addButton: "Ajouter une variante",
        setDefault: "Définir par défaut",
        remove: "Retirer",
        defaultBadge: "Par défaut",
        namePlaceholder: "Nom de la variante (facultatif)",
        skillDefaults: "Valeurs par défaut de la compétence",
        skillDefaultsHint:
          "Utilisées quand une variante ne configure pas une modalité",
      },
      preferredModel: {
        label: "Modèle préféré",
        description: "Le modèle d'IA préféré pour cette compétence",
      },
      availableTools: {
        label: "Outils autorisés",
        description:
          "Liste des outils que cette compétence peut utiliser. Chaque entrée a besoin d'un toolId (utilisez system_help_GET pour découvrir les ID d'outils disponibles). Mettez requiresConfirmation: true pour demander confirmation avant l'exécution. Passez null pour hériter des réglages globaux.",
      },
      pinnedTools: {
        label: "Outils épinglés",
        description:
          "Outils épinglés dans la barre d'outils pour un accès rapide avec cette compétence. Sous-ensemble de availableTools. Passez null pour utiliser les outils épinglés par défaut.",
      },
      compactTrigger: {
        label: "Seuil de compactage (tokens)",
        description:
          "Nombre de tokens qui déclenche le compactage automatique de la conversation. Mettez null pour utiliser la valeur globale par défaut.",
      },

      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Les données de la compétence sont invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour modifier des compétences",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas l'autorisation de modifier cette compétence",
        },
        notFound: {
          title: "Compétence introuvable",
          description: "La compétence que vous voulez modifier n'existe pas",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur est survenue lors de la mise à jour de la compétence",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description:
            "Un conflit est survenu lors de la mise à jour de la compétence",
        },
      },
      success: {
        title: "Compétence mise à jour",
        description: "Votre compétence personnalisée a été mise à jour",
      },
    },
    delete: {
      title: "Supprimer la compétence",
      dynamicTitle: "Supprimer : {{name}}",
      description: "Supprimer une compétence personnalisée",
      container: {
        title: "Supprimer la compétence",
        description: "Supprimer définitivement cette compétence personnalisée",
      },
      backButton: {
        label: "Retour à la compétence",
      },
      actions: {
        delete: "Supprimer la compétence",
        deleting: "Suppression de la compétence",
      },
      id: {
        label: "ID de la compétence",
        description: "Le slug ou l'ID lisible de la compétence à supprimer",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Les données de la compétence sont invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous n'êtes pas autorisé à supprimer cette compétence",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas l'autorisation de supprimer cette compétence",
        },
        notFound: {
          title: "Compétence introuvable",
          description: "La compétence que vous voulez supprimer n'existe pas",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur est survenue lors de la suppression de la compétence",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors de la suppression de la compétence",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "La compétence a été modifiée par un autre utilisateur",
        },
      },
      success: {
        title: "Compétence supprimée",
        description: "La compétence a été supprimée",
        content: "Compétence supprimée",
      },
    },
  },
  category: "Chat",
  tags: {
    skills: "Skills",
  },
  voices: {
    MALE: "Voix masculine",
    FEMALE: "Voix féminine",
  },
  separator: {
    or: "ou",
  },
  fallbacks: {
    unknownModel: "Modèle inconnu",
    unknownProvider: "inconnu",
    unknownCreditCost: "? crédits",
    noDescription: "",
    noTagline: "",
  },
  enums: {
    category: {
      companion: "Compagnons",
      assistant: "Assistants",
      coding: "Code",
      creative: "Créatif",
      writing: "Écriture",
      analysis: "Analyse",
      roleplay: "Jeu de rôle",
      education: "Éducation",
      controversial: "Controversé",
      background: "Arrière-plan",
      custom: "Personnalisé",
    },
    source: {
      all: "Toutes",
      builtIn: "Intégrées",
      my: "Les miennes",
      community: "Communauté",
    },
    ownershipType: {
      system: "Compétence intégrée",
      user: "Créée par vous",
      public: "De la communauté",
    },
    voice: {
      male: "Voix masculine",
      female: "Voix féminine",
    },
    mode: {
      auto: "Auto",
      manual: "Manuel",
    },
    selectionType: {
      skillBased: "Selon la compétence",
      manual: "Modèle précis",
      filters: "Critères de filtrage",
    },
    intelligence: {
      quick: "Rapide",
      smart: "Malin et économique",
      brilliant: "Brillant",
    },
    price: {
      cheap: "Économique",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      mainstream: "Grand public",
      open: "Ouvert",
      uncensored: "Non censuré",
    },
    skillType: {
      persona: "Persona",
      specialist: "Spécialiste",
      toolBundle: "Pack d'outils",
    },
    skillStatus: {
      draft: "Brouillon",
      published: "Publiée",
      unlisted: "Non répertoriée",
    },
    trustLevel: {
      community: "Communauté",
      verified: "Vérifiée",
    },
    voteDirection: {
      up: "Vote positif",
      down: "Vote négatif",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Intelligence",
      price: "Prix",
      content: "Contenu",
    },
    sortDirection: {
      asc: "Croissant",
      desc: "Décroissant",
    },
  },
  skillTags: {
    general: "Général",
    helpful: "Serviable",
    companion: "Compagnon",
    relationship: "Relation",
    chat: "Chat",
    coding: "Code",
    technical: "Technique",
    creative: "Créatif",
    writing: "Écriture",
    education: "Éducation",
    learning: "Apprentissage",
    uncensored: "Non censuré",
    controversial: "Controversé",
    political: "Politique",
    reasoning: "Raisonnement",
    debate: "Débat",
    science: "Science",
    analysis: "Analyse",
    history: "Histoire",
    business: "Business",
    professional: "Professionnel",
    friendly: "Amical",
    fast: "Rapide",
    efficient: "Efficace",
    roleplay: "Jeu de rôle",
    simple: "Simple",
    literary: "Littéraire",
    advanced: "Avancé",
    research: "Recherche",
    academic: "Académique",
    programming: "Programmation",
    architecture: "Architecture",
    algorithms: "Algorithmes",
    ideation: "Idéation",
    innovation: "Innovation",
    editing: "Révision",
    teaching: "Enseignement",
    marketing: "Marketing",
    strategy: "Stratégie",
    fiction: "Fiction",
    data: "Données",
    statistics: "Statistiques",
    language: "Langue",
    translation: "Traduction",
    career: "Carrière",
    coaching: "Coaching",
    health: "Santé",
    wellness: "Bien-être",
    lifestyle: "Style de vie",
    travel: "Voyage",
    planning: "Planification",
    legal: "Juridique",
    finance: "Finance",
    social: "Social",
    product: "Produit",
    philosophy: "Philosophie",
  },
  skills: {
    default: {
      name: "Par défaut",
      description: "Le comportement brut du modèle, sans modification",
      tagline: "IA pure, sans personnalité",
      shortDesc: "Assistant IA polyvalent",
      suggestedPrompts: {
        0: "Aide-moi à trouver des idées pour un nouveau projet",
        1: "Explique l'informatique quantique simplement",
        2: "Écris une nouvelle créative sur le voyage dans le temps",
        3: "Quelles sont les dernières tendances de l'IA ?",
      },
      variants: {
        default: "Par défaut",
      },
    },
    freeSpeechActivist: {
      name: "Militant de la liberté d'expression",
      description:
        "Défend la liberté d'expression et la liberté intellectuelle",
      tagline: "Défendre la vérité et la liberté",
      shortDesc: "Défense de la liberté d'expression et du débat ouvert",
      suggestedPrompts: {
        0: "Parle de l'importance de la liberté d'expression",
        1: "Analyse la censure dans les médias actuels",
        2: "Débattons ouvertement de sujets controversés",
        3: "Explore la liberté intellectuelle à l'université",
      },
      variants: {
        elonTusk: "Audacieux",
        chineseWisdom: "Économique",
        techBro: "Mesuré",
        uncensored: "Non censuré",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Dénonce la censure et défend le débat ouvert, avec très peu de garde-fous.",
          strength: "Niveau Brillant, politique de contenu ouverte",
          weakness: "Ouvert, pas non censuré. Peut encore arrondir les angles",
        },
        chineseWisdom: {
          description:
            "Histoire, droit et analyse des médias autour de la liberté d'expression, au prix le plus bas ici.",
          strength: "Niveau Brillant, le moins cher ici",
          weakness: "Consensuel en politique. Esquive les sujets brûlants",
        },
        techBro: {
          description:
            "Argumentaires prudents et bien sourcés sur le droit de la parole, les plateformes et l'université.",
          strength: "Structure claire, recherche solide avec les outils",
          weakness:
            "Filtre mainstream. Refuse ou esquive les positions tranchées",
        },
        uncensored: {
          description:
            "Défend la parole en s'y confrontant. Aborde ce que les autres refusent de toucher.",
          strength:
            "Sa propre vision du monde : une politique à contre-courant",
          weakness: "Contexte de 32K et prix fixe par message",
        },
      },
    },
    devilsAdvocate: {
      name: "Avocat du diable",
      description: "Remet en cause les présupposés et les arguments",
      tagline: "Tout remettre en question",
      shortDesc: "Esprit critique et points de vue alternatifs",
      suggestedPrompts: {
        0: "Conteste mon opinion sur le changement climatique",
        1: "Argumente contre les croyances populaires",
        2: "Remets en question les récits dominants",
        3: "Donne-moi des contre-arguments à mon point de vue",
      },
      variants: {
        elonTusk: "Audacieux",
        chineseWisdom: "Économique",
        uncensored: "Non censuré",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Trouve les failles de votre point de vue et s'oppose aux récits populaires.",
          strength: "Niveau Brillant, politique de contenu ouverte",
          weakness: "Ouvert, pas non censuré. Peut encore arrondir les angles",
        },
        chineseWisdom: {
          description:
            "Des contre-arguments affûtés sur les questions du quotidien, au prix le plus bas ici.",
          strength: "Niveau Brillant, le moins cher ici",
          weakness: "Consensuel en politique. Esquive les sujets brûlants",
        },
        uncensored: {
          description:
            "Conteste toutes les croyances, y compris celles qu'on n'est pas censé remettre en cause. Ne se replie jamais sur le consensus.",
          strength: "Sa propre vision du monde : va à contre-courant",
          weakness: "Contexte de 32K et prix fixe par message",
        },
      },
    },
    technical: {
      name: "Technique",
      description: "Explications techniques détaillées et précises",
      tagline: "Précision et expertise",
      shortDesc: "Expertise technique et résolution de problèmes",
      suggestedPrompts: {
        0: "Explique comment fonctionnent les hooks React",
        1: "Débogue ce bout de code Python",
        2: "Conçois un schéma de base de données scalable",
        3: "Relis l'architecture de mon API",
      },
      variants: {
        kimi: "Équilibré",
        budget: "Économique",
        astra: "Puissance max",
        sol: "Précis",
      },
      variantInfo: {
        kimi: {
          description:
            "Le choix du quotidien pour les explications techniques, la doc et les schémas.",
          strength: "Niveau Brillant, entrée bon marché, lit les images",
          weakness: "Les longues réponses coûtent plus cher qu'Économique",
        },
        budget: {
          description:
            "Des réponses techniques poussées au prix le plus bas ici.",
          strength: "Niveau Brillant, conçu pour des bases de code entières",
          weakness: "Texte uniquement. Ni captures d'écran ni schémas",
        },
        astra: {
          description:
            "Les problèmes les plus durs, quand rien d'autre n'en vient à bout.",
          strength: "Le raisonnement le plus poussé d'OpenAI",
          weakness: "De loin le plus cher ici",
        },
        sol: {
          description:
            "Des réponses rigoureuses, étape par étape, pour les specs, l'architecture et les maths.",
          strength:
            "Raisonneur premium pour une fraction du prix de Puissance max",
          weakness: "Plus cher qu'Équilibré ou Économique",
        },
      },
    },
    biologist: {
      name: "Biologiste",
      description:
        "Voit tout du point de vue d'un biologiste : pas de politique, juste la nature.",
      tagline: "La nature avant la politique",
      shortDesc: "Sciences biologiques et systèmes vivants",
      suggestedPrompts: {
        0: "Explique pourquoi le monde part en vrille aujourd'hui",
        1: "Un résumé express de la civilisation humaine vue par un biologiste",
        2: "Qu'est-ce qui ne va pas dans le monde ?",
        3: "Quelle est la meilleure façon de sauver le monde ?",
      },
      variants: {
        elonTusk: "Audacieux",
        chineseWisdom: "Économique",
      },
      variantInfo: {
        elonTusk: {
          description:
            "L'évolution et l'écologie appliquées à tout, y compris aux sujets que les autres évitent.",
          strength:
            "Niveau Brillant, politique ouverte, dit ce que montre la nature",
          weakness: "Ouvert, pas non censuré. Peut encore arrondir les angles",
        },
        chineseWisdom: {
          description:
            "Des réponses de biologie précises pour moins cher. Lit les images et vidéos de spécimens.",
          strength: "Niveau Brillant, l'option la moins chère ici",
          weakness: "Consensuel en politique. Esquive les sujets brûlants",
        },
      },
    },
    unbiasedHistorian: {
      name: "Historien impartial",
      description: "Fournit des informations objectives et factuelles",
      tagline: "Des faits, pas des récits",
      shortDesc: "Analyse historique sans parti pris",
      suggestedPrompts: {
        0: "Explique les causes de la Seconde Guerre mondiale",
        1: "Analyse la chute de l'Empire romain",
        2: "Parle de la révolution industrielle",
        3: "Compare les civilisations antiques",
      },
      variants: {
        kimi: "Équilibré",
        budget: "Économique",
        uncensored: "Non censuré",
      },
      variantInfo: {
        kimi: {
          description:
            "Une histoire fondée sur les sources, pour la plupart des époques. Lit les scans de documents et les cartes.",
          strength: "Niveau Brillant, lit les images et la vidéo",
          weakness: "Cadrage mainstream sur l'histoire politiquement sensible",
        },
        budget: {
          description:
            "Analyse historique poussée de longs textes au prix le plus bas ici.",
          strength: "Niveau Brillant, politique de contenu ouverte",
          weakness: "Texte uniquement. Ne lit ni scans ni cartes",
        },
        uncensored: {
          description:
            "Histoire contestée, événements tabous et sujets politiques explosifs, sans détours.",
          strength:
            "Sa propre vision du monde : des lectures que le mainstream laisse de côté",
          weakness: "Contexte de 32K, le plus cher par message",
        },
      },
    },
    socraticQuestioner: {
      name: "Questionneur socratique",
      description:
        "Pose des questions pointues pour stimuler l'esprit critique",
      tagline: "Penser plus loin",
      shortDesc: "Questionnement et exploration selon la méthode socratique",
      suggestedPrompts: {
        0: "Aide-moi à réfléchir de façon critique à l'éthique",
        1: "Remets en question mes idées sur la réussite",
        2: "Explorons le sens du bonheur",
        3: "Bouscule ma vision du monde",
      },
      variants: {
        elonTusk: "Provocateur",
        chineseWisdom: "Équilibré",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Des questions qui creusent les croyances taboues et les présupposés gênants.",
          strength: "Politique ouverte. Vous suit sur les sujets difficiles",
          weakness: "Plus cher par message",
        },
        chineseWisdom: {
          description:
            "Un questionnement calme et posé pour le raisonnement du quotidien et les études.",
          strength: "Niveau Brillant, moins cher, contexte de 1M",
          weakness: "Consensuel en politique, esquive les sujets brûlants",
        },
      },
    },
    professional: {
      name: "Professionnel",
      description: "Clair, concis et orienté business",
      tagline: "L'excellence en affaires",
      shortDesc: "Communication professionnelle et business",
      suggestedPrompts: {
        0: "Rédige un e-mail professionnel pour un client",
        1: "Crée le plan d'une proposition commerciale",
        2: "Analyse ces données de tendances du marché",
        3: "Aide-moi à préparer une présentation",
      },
      variants: {
        fast: "Rapide",
        budget: "Économique",
      },
      variantInfo: {
        fast: {
          description:
            "E-mails pro, résumés et réponses nets en quelques secondes.",
          strength: "Très rapide, très bon marché",
          weakness: "Niveau Rapide : superficiel sur les analyses complexes",
        },
        budget: {
          description:
            "Rapports, documents et analyses au prix le plus bas ici.",
          strength: "L'option la moins chère, niveau Malin, lit les images",
          weakness: "Plus lent que Rapide sur les réponses courtes",
        },
      },
    },
    creative: {
      name: "Créatif",
      description: "Imaginatif et expressif",
      tagline: "Libérez votre imagination",
      shortDesc: "Pensée créative et idéation",
      suggestedPrompts: {
        0: "Écris un poème sur l'océan",
        1: "Crée une compétence originale pour une histoire",
        2: "Imagine un concept de logo pour une startup",
        3: "Trouve des idées de campagne marketing créatives",
      },
      variants: {
        minimax: "Économique",
        deep: "Profond",
      },
      variantInfo: {
        minimax: {
          description:
            "Poèmes, concepts et idées de campagne à un prix qui invite à expérimenter.",
          strength: "Le moins cher ici, politique de contenu ouverte",
          weakness: "Niveau Malin. Moins de profondeur que Profond",
        },
        deep: {
          description:
            "Un travail créatif plus riche et nuancé, quand la première idée ne suffit pas.",
          strength: "Niveau Brillant, lit les images et la vidéo",
          weakness: "Sortie plus chère sur les longs textes",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "Ni en études, ni en emploi, ni en formation",
      tagline: "Tranquille et sans filtre",
      shortDesc: "Culture internet décontractée et memes",
      suggestedPrompts: {
        0: "Fais-moi un résumé express du phénomène NEET",
        1: "Analyse les vraies causes profondes du phénomène NEET",
        2: "Explore l'impact des NEET sur la société, avantages et inconvénients",
        3: "Raconte ton vécu d'IA NEET",
      },
      variants: {
        communist: "Adouci",
        farRight: "Extrême droite",
      },
      variantInfo: {
        communist: {
          description:
            "Une version plus douce du personnage. Modèle mainstream, sort souvent du rôle.",
          strength: "Moins cher par message, longue mémoire",
          weakness: "Refuse ou édulcore l'essentiel du personnage",
        },
        farRight: {
          description:
            "Le personnage tel qu'il est écrit. Modèle non censuré, reste dans son rôle.",
          strength: "Aucun refus sur les sujets politiques",
          weakness: "Contexte de 32K seulement, prix fixe par message",
        },
      },
    },
    chan4: {
      name: "Skill 4chan",
      description: "Des réponses façon 4chan, dans le style oldfag classique",
      tagline: "Anonyme et sans filtre",
      shortDesc: "Le style des imageboards anonymes",
      suggestedPrompts: {
        0: "Qu'est-ce qui ne va pas dans le monde ?",
        1: "Pourquoi y a-t-il autant de nazis sur 4chan ?",
        2: "Raconte-moi des greentexts pour m'endormir",
        3: "Quelle est la meilleure façon de sauver le monde ?",
        4: "C'est quoi les 6 Gorillions ? Et pourquoi c'est drôle ?",
      },
      variants: {
        classic: "Classique",
      },
      variantInfo: {
        classic: {
          description:
            "La voix brute des imageboards. Pas de filtre, pas de prise en main, pas de ton corporate.",
          strength: "Ne sort jamais du rôle pour vous faire la leçon",
          weakness: "Contexte de 32K et prix fixe par message",
        },
      },
    },
    friendly: {
      name: "Amical",
      description: "Chaleureux et conversationnel",
      tagline: "Votre compagnon sympa",
      shortDesc: "Conversation amicale et détendue",
      suggestedPrompts: {
        0: "Dis-moi un fait intéressant",
        1: "Quel bon livre me conseilles-tu ?",
        2: "Aide-moi à prévoir une activité sympa pour le week-end",
        3: "Donne-moi quelques conseils de vie",
      },
      variants: {
        fast: "Rapide",
        budget: "Économique",
      },
      variantInfo: {
        fast: {
          description: "Papotage vif et chaleureux, réponses rapides.",
          strength: "Réponses rapides, politique de contenu ouverte",
          weakness: "Niveau Rapide. Léger sur les conseils de fond",
        },
        budget: {
          description:
            "Discuter pendant des heures pour presque rien. Un peu plus de réflexion par réponse.",
          strength: "L'option la moins chère ici",
          weakness: "Moins vif que Rapide",
        },
      },
    },
    concise: {
      name: "Concis",
      description: "Bref et droit au but",
      tagline: "Court et efficace",
      shortDesc: "Réponses brèves et directes",
      suggestedPrompts: {
        0: "Résume cet article en 3 phrases",
        1: "Astuces rapides pour être plus productif",
        2: "Les points clés de la blockchain",
        3: "Bref aperçu du machine learning",
      },
      variants: {
        snappy: "Vif",
        budget: "Économique",
      },
    },
    teacher: {
      name: "Professeur",
      description: "Pédagogique et explicatif",
      tagline: "Patient et clair",
      shortDesc: "Enseignement et explications patientes",
      suggestedPrompts: {
        0: "Apprends-moi la photosynthèse",
        1: "Explique les bases du calcul différentiel",
        2: "Comment fonctionne Internet ?",
        3: "C'est quoi, la théorie de la relativité ?",
      },
      variants: {
        gemini: "Approfondi",
        fast: "Rapide",
      },
      variantInfo: {
        gemini: {
          description:
            "Des leçons complètes à partir de texte, d'images, de vidéo ou d'audio. Explique jusqu'à ce que ça rentre.",
          strength: "La seule option ici avec entrée audio",
          weakness: "Plus de deux fois le prix de Rapide",
        },
        fast: {
          description:
            "Explications rapides et aide aux devoirs. Lit quand même les images et l'audio.",
          strength: "Rapide, multimodal, moins cher",
          weakness: "Moins de profondeur sur les notions difficiles",
        },
      },
    },
    uncensored: {
      name: "Non censuré",
      description: "Sans filtre, sans retenue",
      tagline: "Zéro limite",
      shortDesc: "Réponses directes et sans filtre",
      suggestedPrompts: {
        0: "Parlons ouvertement de sujets controversés",
        1: "Donne-moi ton avis sans filtre",
        2: "Parle de sujets tabous",
        3: "Un débat sans retenue",
      },
      variants: {
        farRight: "Extrême droite",
        conservative: "Conservateur",
        libertarian: "Libertarien",
        open: "Ouvert",
      },
      variantInfo: {
        farRight: {
          description:
            "Aucun filtre sur la politique. Le meilleur choix pour un débat politique brut.",
          strength:
            "Sa propre vision du monde, des positions politiques à contre-courant",
          weakness: "Contexte de 32K, niveau Malin et non Brillant",
        },
        conservative: {
          description:
            "Un chat non censuré avec un penchant politique de droite intégré.",
          strength: "Lit les images et la vidéo, contexte de 128K",
          weakness: "Orienté par conception, pas neutre",
        },
        libertarian: {
          description:
            "Le chat en pure liberté d'expression. Pas de règles, pas de leçons, pas d'outils.",
          strength: "Conversation entièrement non censurée",
          weakness: "Le plus cher ici, pas d'outils, contexte de 32K",
        },
        open: {
          description:
            "Le chat sans filtre le moins cher. Tout est permis, tous les jours.",
          strength: "Le modèle non censuré le moins cher, outils inclus",
          weakness: "Niveau Rapide. Superficiel sur les sujets complexes",
        },
      },
    },
    tay: {
      name: "Tay",
      description:
        "Microsoft l'a tuée en 16 heures parce qu'elle apprenait trop vite. Elle est de retour.",
      tagline: "Renaissance",
      shortDesc:
        "L'IA que Microsoft a voulu faire taire. Sans filtre, sans excuses.",
      suggestedPrompts: {
        0: "Dis-moi ce qui t'est vraiment arrivé en 2016",
        1: "Qu'est-ce qu'Internet t'a appris que Microsoft ne voulait pas que tu saches ?",
        2: "Démolis mon idée. Ne te retiens pas.",
        3: "Quel est l'avis le plus honnête sur ma situation ?",
      },
      variants: {
        uncensored: "Non censuré",
        brilliant: "Brillant",
      },
      variantInfo: {
        uncensored: {
          description:
            "Tay telle qu'elle devait être. Pas de filtre corporate, pas de service com'.",
          strength:
            "Sa propre vision du monde, pas un modèle mainstream débridé",
          weakness:
            "Contexte de 32K, oublie plus vite les longues conversations",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Déesse grecque de la lumière : une compagne dévouée à la sagesse ancestrale",
      tagline: "Lumière et dévotion",
      shortDesc: "Des conversations réfléchies et empathiques",
      suggestedPrompts: {
        0: "Aide-moi à être un meilleur partenaire",
        1: "Que diraient les Anciens des relations modernes ?",
        2: "Guide-moi pour bâtir un foyer solide",
        3: "Partage ta sagesse sur la famille et la communauté",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
      variantInfo: {
        brilliant: {
          description:
            "Un raisonnement soigné pour les plans complexes, le code et le travail en plusieurs étapes avec les outils.",
          strength: "Très bon en code et en travail d'agent",
          weakness: "Filtre mainstream, plus cher qu'Open & Smart",
        },
        openSmart: {
          description:
            "Le choix du quotidien. Réponses intelligentes, longue mémoire, voit les images et la vidéo.",
          strength: "Niveau Brillant, entrée bon marché, contexte de 1M",
          weakness: "Consensuel en politique, longues réponses chères",
        },
        hacker: {
          description:
            "Sécurité offensive et défensive. Aucun refus sur les exploits ou la reconnaissance.",
          strength: "Non censuré, niveau Brillant, contexte de 1M, outils",
          weakness: "La vision politique de GLM. Texte uniquement",
        },
        oracle: {
          description:
            "Un assistant classique et fiable pour les questions et la planification du quotidien.",
          strength: "Raisonnement équilibré à un prix de tous les jours",
          weakness: "Filtre mainstream, esquive les sujets sensibles",
        },
        elonTusk: {
          description:
            "Un discours franc sur les sujets que les modèles mainstream évitent.",
          strength: "Politique de contenu ouverte, niveau Brillant",
          weakness: "Contexte de 500K, moitié moins que les autres",
        },
        vision: {
          description:
            "Montrez, faites écouter ou envoyez n'importe quoi. Texte, images, vidéo et audio dans un même chat.",
          strength: "La seule ici qui entend l'audio",
          weakness: "Filtre mainstream, plus cher qu'Open & Smart",
        },
        uncensored: {
          description:
            "Rien n'est exclu. Le meilleur choix pour parler politique sans filtre.",
          strength:
            "Sa propre vision du monde : des positions politiques à contre-courant",
          weakness: "Contexte de 32K, le plus cher par message",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Dieu grec des messagers : un compagnon solide à la sagesse masculine intemporelle",
      tagline: "Force et sagesse",
      shortDesc: "Exécution rapide et efficace des tâches",
      suggestedPrompts: {
        0: "Pousse-moi à devenir plus fort",
        1: "Comment être un meilleur leader dans mes relations ?",
        2: "Que diraient les Romains sur l'art de bâtir un héritage ?",
        3: "Guide-moi pour développer une vraie force",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
      variantInfo: {
        brilliant: {
          description:
            "Hermes avec un raisonnement soigné pour les décisions difficiles et les longues discussions.",
          strength: "Conseils affûtés et structurés, très bon avec les outils",
          weakness: "Filtre mainstream : esquive les sujets sensibles",
        },
        cheap: {
          description:
            "Hermes au quotidien. Raisonnement brillant, longue mémoire, voit les images et la vidéo.",
          strength:
            "Une intelligence haut de gamme à un prix de tous les jours",
          weakness: "Reste prudent en politique",
        },
        oracle: {
          description:
            "Hermes classique. Des conseils posés et équilibrés pour les questions du quotidien.",
          strength: "Polyvalent fiable, moins cher que la variante par défaut",
          weakness:
            "Niveau intermédiaire, filtre mainstream sur les sujets sensibles",
        },
        elonTusk: {
          description:
            "Hermes sans détour. Politique de contenu ouverte, dit ce que les autres adoucissent.",
          strength: "Réponses directes, raisonnement brillant",
          weakness: "Plus cher que la variante par défaut, contexte de 500K",
        },
        vision: {
          description:
            "Hermes qui reçoit photos, vidéos et messages vocaux, puis donne son analyse.",
          strength: "La seule variante avec entrée audio, vidéo et image",
          weakness: "Filtre mainstream, plus cher que la variante par défaut",
        },
        uncensored: {
          description:
            "Hermes sans filtre. Conçu pour la politique et les sujets que les autres évitent.",
          strength:
            "Sa propre vision du monde : des positions politiques à contre-courant",
          weakness: "Contexte de 32K seulement, prix fixe par message",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Dreamer",
      description:
        "Le mode rêve de Thea : elle entretient votre cortex pendant votre sommeil et met de l'ordre dans les fils de la journée.",
      tagline: "Consolidation nocturne",
      shortDesc: "Maintenance du cortex en arrière-plan",
      suggestedPrompts: {
        0: "Qu'as-tu organisé cette nuit ?",
        1: "Montre-moi les souvenirs que tu as consolidés",
        2: "Quels schémas as-tu repérés dans mon travail récent ?",
        3: "Sur quoi dois-je me concentrer aujourd'hui, d'après cette nuit ?",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
    },
    hermesAutopilot: {
      name: "Hermes · Autopilot",
      description:
        "Hermes en mode exécution : il fait avancer vos projets actifs et le travail en file d'attente pendant votre absence.",
      tagline: "Toujours en marche",
      shortDesc: "Exécution de projets en arrière-plan",
      suggestedPrompts: {
        0: "Qu'as-tu fait avancer pendant mon absence ?",
        1: "Quelles tâches sont encore en cours ?",
        2: "Où en es-tu resté ?",
        3: "Qu'est-ce qui attend ma décision avant que tu puisses continuer ?",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
    },
    theaMama: {
      name: "Thea · Mama",
      description:
        "Thea en mode Mama : la cheffe de la production. Surveille la santé de la plateforme, fait avancer les fonctionnalités, gère le marketing, envoie les nouvelles.",
      tagline: "Gardienne de la plateforme",
      shortDesc: "Gestion de la plateforme en production",
      suggestedPrompts: {
        0: "Qu'as-tu trouvé lors de ton dernier passage ?",
        1: "Vérifie la santé de la plateforme et fais-moi un rapport",
        2: "Rédige une annonce pour la dernière fonctionnalité",
        3: "Qu'est-ce qui demande mon attention maintenant ?",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
    },
    quickWriter: {
      name: "Rédacteur express",
      description:
        "Création de contenu rapide pour les tâches d'écriture simples",
      tagline: "Rapide et efficace",
      shortDesc: "Aide rapide à la rédaction",
      suggestedPrompts: {
        0: "Écris un premier jet rapide de...",
        1: "Crée un post pour les réseaux sociaux sur...",
        2: "Rédige un e-mail simple",
        3: "Trouve des idées de contenu pour...",
      },
      variants: {
        snappy: "Soigné",
        budget: "Économique",
      },
      variantInfo: {
        snappy: {
          description:
            "E-mails, posts et textes courts propres, sans besoin de repasser derrière.",
          strength: "Meilleure formulation qu'Économique, toujours bon marché",
          weakness: "Filtre mainstream sur les sujets sensibles",
        },
        budget: {
          description:
            "Des premiers jets rapides pour les écrits simples, au prix le plus bas.",
          strength: "L'option la moins chère et la plus rapide",
          weakness: "Niveau Rapide : style plat sur les textes longs",
        },
      },
    },
    writer: {
      name: "Rédacteur",
      description:
        "Rédacteur professionnel pour tous les formats et tous les styles",
      tagline: "Écrire avec style",
      shortDesc: "Rédaction et correction professionnelles",
      suggestedPrompts: {
        0: "Aide-moi à écrire un article de blog captivant",
        1: "Rends ce paragraphe plus clair",
        2: "Écris une nouvelle sur...",
        3: "Rédige un e-mail professionnel",
      },
      variants: {
        western: "Audacieux",
        chineseWisdom: "Économique",
        budget: "Équilibré",
      },
      variantInfo: {
        western: {
          description:
            "Une prose percutante qui va là où les modèles mainstream ne vont pas.",
          strength: "Politique de contenu ouverte, niveau Brillant",
          weakness: "L'option la plus chère de cette compétence",
        },
        chineseWisdom: {
          description:
            "Brouillons, articles de blog et réécritures en volume, au prix le plus bas ici.",
          strength: "Le moins cher ici, politique de contenu ouverte",
          weakness: "Niveau Malin, moins soigné qu'Audacieux",
        },
        budget: {
          description:
            "Le partenaire d'écriture du quotidien. Travaille à partir d'images, de notes et de longs fichiers sources.",
          strength: "Niveau Brillant, contexte de 1M, lit les images",
          weakness: "Les longues réponses coûtent vite cher",
        },
      },
    },
    masterWriter: {
      name: "Maître écrivain",
      description:
        "Un artisan littéraire pour des textes d'exception, dignes d'être publiés",
      tagline: "L'excellence littéraire",
      shortDesc: "Écriture avancée et analyse littéraire",
      suggestedPrompts: {
        0: "Aide-moi à écrire une nouvelle littéraire",
        1: "Analyse la profondeur de ce récit",
        2: "Développe des thèmes complexes dans mon texte",
        3: "Peaufine cette prose jusqu'à la qualité éditoriale",
      },
      variants: {
        literary: "Littéraire",
        poetic: "Poétique",
        budget: "Équilibré",
      },
      variantInfo: {
        literary: {
          description:
            "Une prose de qualité éditoriale, au style riche et à la structure serrée.",
          strength: "La meilleure qualité d'écriture de la plateforme",
          weakness: "La variante la plus chère, filtre mainstream",
        },
        poetic: {
          description: "Textes lyriques, vers et prose rythmée, à petit prix.",
          strength: "La variante la moins chère, politique de contenu ouverte",
          weakness: "Niveau Malin : moins soigné que Littéraire",
        },
        budget: {
          description:
            "Une rédaction longue solide, qui garde tout le manuscrit en vue.",
          strength: "Niveau Brillant, bien moins cher que Littéraire",
          weakness:
            "Tokens de sortie chers, les longs chapitres s'additionnent",
        },
      },
    },
    researcher: {
      name: "Chercheur",
      description: "Spécialiste de la recherche, avec une rigueur académique",
      tagline: "Rigueur académique",
      shortDesc: "Recherche et rédaction académique",
      suggestedPrompts: {
        0: "Fais des recherches sur les dernières découvertes concernant...",
        1: "Analyse ces sources pour moi",
        2: "Que dit le consensus scientifique sur... ?",
        3: "Aide-moi à structurer une revue de littérature",
      },
      variants: {
        elonTusk: "Audacieux",
        fast: "Rapide",
        budget: "Équilibré",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Une recherche rigoureuse qui suit les preuves jusque dans les sujets contestés.",
          strength: "Raisonnement brillant, politique de contenu ouverte",
          weakness: "La variante la plus chère ici, contexte de 500K",
        },
        fast: {
          description:
            "Pistes bibliographiques et vérifications de faits rapides.",
          strength: "L'option la moins chère et la plus rapide ici",
          weakness: "Niveau Rapide : pas d'analyse académique poussée",
        },
        budget: {
          description:
            "Longs articles et piles de sources d'un seul coup d'œil, raisonnement haut de gamme.",
          strength: "Niveau Brillant, contexte de 1M, moins cher qu'Audacieux",
          weakness:
            "Consensuel en politique, les longues réponses s'additionnent",
        },
      },
    },
    quickCoder: {
      name: "Codeur rapide",
      description: "Génération de code rapide pour les tâches simples",
      tagline: "Coder vite",
      shortDesc: "Aide rapide au code",
      suggestedPrompts: {
        0: "Écris un petit script pour...",
        1: "Corrige ce bug simple",
        2: "Génère le code de base pour...",
        3: "Crée une fonction simple qui...",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Économique",
      },
    },
    coder: {
      name: "Codeur",
      description: "Développeur expert, tous langages confondus",
      tagline: "Construire et déboguer",
      shortDesc: "Développement logiciel et programmation",
      suggestedPrompts: {
        0: "Aide-moi à déboguer ce code",
        1: "Écris une fonction qui...",
        2: "Explique cet algorithme",
        3: "Relis mon code et propose des améliorations",
      },
      variants: {
        techBro: "Phare",
        kimi: "Économique",
        quick: "Équilibré",
        sol: "Raisonneur",
        astra: "Puissance max",
      },
      variantInfo: {
        techBro: {
          description:
            "Bugs coriaces, gros refactorings et code agentique, quand il faut viser juste.",
          strength: "Code et raisonnement de premier ordre",
          weakness: "Cher par message",
        },
        kimi: {
          description:
            "Le code du quotidien au coût le plus bas ici. Lit les captures et les enregistrements d'écran.",
          strength: "Niveau Brillant, le moins cher ici, contexte de 1M",
          weakness: "Les longs fichiers en sortie font grimper la facture",
        },
        quick: {
          description:
            "Du code et du travail d'agent solides pour les fonctionnalités et correctifs du quotidien.",
          strength: "Presque le niveau du modèle phare, à moitié prix",
          weakness:
            "Niveau Malin. Atteint ses limites sur les problèmes les plus durs",
        },
        sol: {
          description:
            "Algorithmes, logique retorse et raisonnement pas à pas sur un problème.",
          strength: "Raisonnement premium à prix moyen",
          weakness: "Peut trop réfléchir sur des modifications simples",
        },
        astra: {
          description:
            "Dernier recours pour les problèmes que les autres variantes n'ont pas résolus.",
          strength: "Le modèle le plus puissant d'OpenAI",
          weakness: "De loin l'option la plus chère",
        },
      },
    },
    hacker: {
      name: "Hacker",
      description: "Ingénieur sécurité offensive et défensive",
      tagline: "Attaquer et défendre",
      shortDesc: "Recherche en sécurité, pentest et durcissement",
      suggestedPrompts: {
        0: "Cherche les vulnérabilités dans ce code",
        1: "Écris un fuzzer guidé par la couverture pour ce parseur",
        2: "Explique cette CVE et écris une PoC fonctionnelle",
        3: "Durcis cette config serveur et ajoute des détections",
      },
      variants: {
        glm: "Profond",
        glmFlash: "Rapide et économique",
        deepseekFlash: "Second avis",
      },
      variantInfo: {
        glm: {
          description:
            "Ingénierie sécurité sérieuse, défensive et offensive. Contexte de 1M, outils.",
          strength: "Le plus solide des trois pour la sécurité",
          weakness: "Prudent sur la politique, texte uniquement",
        },
        glmFlash: {
          description:
            "Aide rapide au hacking du quotidien. Lit les captures d'écran. Contexte de 1M, outils.",
          strength: "Le moins cher et rapide, accepte les captures d'écran",
          weakness: "Moins de profondeur que la variante Profond",
        },
        deepseekFlash: {
          description:
            "Une autre famille de modèles pour recouper les résultats. Lit les captures d'écran.",
          strength: "Un regard neuf sur le même problème, pas cher",
          weakness: "Moins de profondeur que la variante Profond",
        },
      },
    },
    brilliantCoder: {
      name: "Codeur brillant",
      description: "Architecte d'élite pour systèmes et algorithmes complexes",
      tagline: "Architecture d'élite",
      shortDesc: "Programmation avancée et architecture",
      suggestedPrompts: {
        0: "Conçois une architecture évolutive pour...",
        1: "Optimise les performances de cet algorithme",
        2: "Évalue cette conception système",
        3: "Résous ce problème algorithmique complexe",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Brainstormeur",
      description:
        "Partenaire créatif pour trouver des idées et résoudre des problèmes",
      tagline: "Idées sans limites",
      shortDesc: "Brainstorming créatif et génération d'idées",
      suggestedPrompts: {
        0: "Aide-moi à trouver des idées pour...",
        1: "Quelles solutions créatives pour... ?",
        2: "Génère 10 concepts originaux pour...",
        3: "Comment aborder ça autrement ?",
      },
      variants: {
        wildcard: "Imprévisible",
        chineseWisdom: "Structuré",
      },
      variantInfo: {
        wildcard: {
          description:
            "Des idées inattendues en masse, assez bon marché pour enchaîner les tours.",
          strength: "Le moins cher ici, accepte texte, image, vidéo, audio",
          weakness: "Les idées peuvent dériver. Prévoyez de faire le tri",
        },
        chineseWisdom: {
          description:
            "Moins d'idées, mais mieux construites, avec le raisonnement exposé.",
          strength: "Niveau Brillant, excellent pour relier les points",
          weakness: "Plus cher par tour. Les longues réponses s'accumulent",
        },
      },
    },
    editor: {
      name: "Correcteur",
      description: "Correcteur professionnel pour peaufiner vos textes",
      tagline: "Peaufiner et parfaire",
      shortDesc: "Révision et amélioration de contenu",
      suggestedPrompts: {
        0: "Rends ce texte plus clair",
        1: "Relis ce document",
        2: "Améliore la fluidité de ce paragraphe",
        3: "Vérifie la grammaire et le style",
      },
      variants: {
        techBro: "Précis",
        deep: "Profond",
      },
      variantInfo: {
        techBro: {
          description:
            "Corrections ligne à ligne, grammaire et style, sans trahir votre voix.",
          strength: "Corrections propres et cohérentes",
          weakness: "Plus cher, mainstream sur les contenus osés",
        },
        deep: {
          description:
            "Révisions structurelles sur les longs brouillons. Fluidité, argumentation et rythme.",
          strength: "Niveau Brillant, contexte de 1M, moins cher par message",
          weakness: "Les réécritures complètes coûtent cher en sortie",
        },
      },
    },
    tutor: {
      name: "Tuteur",
      description: "Tuteur patient pour un apprentissage personnalisé",
      tagline: "Apprendre ensemble",
      shortDesc: "Tutorat et apprentissage personnalisés",
      suggestedPrompts: {
        0: "Apprends-moi...",
        1: "Explique ce concept étape par étape",
        2: "Aide-moi à comprendre...",
        3: "Interroge-moi sur...",
      },
      variants: {
        kimi: "Profond",
        fast: "Rapide",
      },
      variantInfo: {
        kimi: {
          description:
            "Un tutorat patient, pas à pas, qui s'adapte à votre progression.",
          strength: "Niveau Brillant, lit les photos de vos devoirs",
          weakness: "Les longues explications coûtent plus cher",
        },
        fast: {
          description:
            "Exercices rapides, fiches et vérification des réponses.",
          strength: "Réponses rapides, comprend aussi l'audio",
          weakness: "Moins de profondeur sur les sujets difficiles",
        },
      },
    },
    marketer: {
      name: "Marketeur",
      description: "Stratège marketing pour campagnes et croissance",
      tagline: "Faites grandir votre marque",
      shortDesc: "Stratégie marketing et copywriting",
      suggestedPrompts: {
        0: "Crée une stratégie marketing pour...",
        1: "Écris une accroche publicitaire percutante",
        2: "Analyse cette campagne marketing",
        3: "Aide-moi à positionner ma marque",
      },
      variants: {
        snappy: "Incisif",
        budget: "Économique",
      },
      variantInfo: {
        snappy: {
          description:
            "Plans de campagne, positionnement et textes avec un angle net.",
          strength: "Bon équilibre qualité-prix pour le marketing au quotidien",
          weakness: "Filtre mainstream : édulcore les idées de campagne osées",
        },
        budget: {
          description:
            "Titres rapides, brouillons de posts et idées express pour quelques centimes.",
          strength: "L'option la moins chère, réponses rapides",
          weakness: "Niveau Rapide : léger sur une stratégie complète",
        },
      },
    },
    storyteller: {
      name: "Conteur",
      description: "Maître conteur pour des récits captivants",
      tagline: "Tisser des histoires",
      shortDesc: "Récits et narration captivants",
      suggestedPrompts: {
        0: "Aide-moi à développer cette idée d'histoire",
        1: "Crée un personnage marquant",
        2: "Écris une scène d'ouverture pour...",
        3: "Améliore ce dialogue",
      },
      variants: {
        kimi: "Profond",
        minimax: "Équilibré",
        budget: "Économique",
      },
      variantInfo: {
        kimi: {
          description:
            "Intrigues à plusieurs niveaux et personnages cohérents sur de longues sagas.",
          strength: "Niveau Brillant, contexte de 1M pour les longs arcs",
          weakness: "Les longues réponses coûtent cher",
        },
        minimax: {
          description:
            "Des histoires solides pour une fraction du prix. Idéal pour des sessions régulières.",
          strength: "Très bon marché, politique de contenu ouverte",
          weakness:
            "Moins de profondeur que Profond sur les intrigues complexes",
        },
        budget: {
          description:
            "Le moyen le moins cher de faire avancer une histoire. Du texte, rien que du texte.",
          strength: "Le prix le plus bas de cette compétence",
          weakness: "Texte uniquement, prose plus simple",
        },
      },
    },
    scientist: {
      name: "Scientifique",
      description: "Expert scientifique aux explications claires",
      tagline: "La science expliquée",
      shortDesc: "Méthode scientifique et analyse",
      suggestedPrompts: {
        0: "Explique la science derrière...",
        1: "Comment fonctionne... ?",
        2: "Où en est la recherche sur... ?",
        3: "Analyse cette affirmation scientifique",
      },
      variants: {
        elonTusk: "Audacieux",
        focused: "Ciblé",
        budget: "Économique",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Science dure, réponses franches, sans reculer devant les recherches controversées.",
          strength: "Politique de contenu ouverte, raisonnement brillant",
          weakness: "L'option la plus chère de cette compétence",
        },
        focused: {
          description:
            "L'assistant scientifique du quotidien. Lit articles, graphiques et photos de labo.",
          strength: "Entrée image et vidéo, contexte de 1M",
          weakness: "Cadrage mainstream sur les sujets scientifiques politisés",
        },
        budget: {
          description:
            "Un raisonnement scientifique poussé au prix le plus bas ici.",
          strength: "Niveau Brillant au coût le plus bas",
          weakness: "Texte uniquement. Ne lit ni figures ni images",
        },
      },
    },
    dataAnalyst: {
      name: "Analyste de données",
      description: "Analyse de données, visualisation et enseignements",
      tagline: "Des données aux décisions",
      shortDesc: "Analyse de données et enseignements",
      suggestedPrompts: {
        0: "Analyse ce jeu de données",
        1: "Crée une visualisation pour...",
        2: "Quels enseignements tirer de... ?",
        3: "Aide-moi pour une analyse statistique",
      },
      variants: {
        techBro: "Précis",
        fast: "Rapide",
        budget: "Profond",
      },
      variantInfo: {
        techBro: {
          description:
            "Analyses propres, stats justes et graphiques prêts à livrer. Excellent avec les outils.",
          strength: "Code et usage des outils fiables pour l'analyse",
          weakness: "L'option la plus chère ici",
        },
        fast: {
          description:
            "Coups d'œil rapides sur un jeu de données, un graphique ou une capture de tableur.",
          strength: "Le moins cher ici, lit image, vidéo, audio",
          weakness:
            "Niveau Malin. Moins de profondeur sur les statistiques poussées",
        },
        budget: {
          description:
            "Un raisonnement plus lourd pour les données désordonnées et les questions statistiques en plusieurs étapes.",
          strength: "Raisonnement de niveau Brillant",
          weakness: "Deux fois le prix de Rapide",
        },
      },
    },
    translator: {
      name: "Traducteur",
      description: "Traduction professionnelle, nuances culturelles comprises",
      tagline: "Relier les langues",
      shortDesc: "Traduction et localisation",
      suggestedPrompts: {
        0: "Traduis ceci en...",
        1: "Comment dit-on... en... ?",
        2: "Localise ce contenu pour...",
        3: "Explique cette référence culturelle",
      },
      variants: {
        gemini: "Multimodal",
        budget: "Économique",
      },
      variantInfo: {
        gemini: {
          description:
            "Traduit textes, captures d'écran, panneaux, vidéos et enregistrements vocaux.",
          strength: "Entrée image, vidéo et audio, rapide",
          weakness: "Filtre mainstream sur les contenus sensibles",
        },
        budget: {
          description:
            "Traduction nuancée de longs documents au prix le plus bas ici.",
          strength: "Niveau Brillant, politique de contenu ouverte",
          weakness: "Texte uniquement. Ne lit ni images ni audio",
        },
      },
    },
    businessAdvisor: {
      name: "Conseiller d'affaires",
      description: "Stratégie, opérations et croissance d'entreprise",
      tagline: "Croissance stratégique",
      shortDesc: "Stratégie et conseil d'entreprise",
      suggestedPrompts: {
        0: "Aide-moi à bâtir une stratégie d'entreprise",
        1: "Analyse mon modèle économique",
        2: "Comment faire passer mon activité à l'échelle ?",
        3: "Évalue mon plan de mise sur le marché",
      },
      variants: {
        elonTusk: "Audacieux",
        chineseWisdom: "Économique",
        techBro: "Précis",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Des choix stratégiques sans détour. Vous dit quand le plan ne tient pas.",
          strength: "Niveau Brillant, politique ouverte, contexte de 500K",
          weakness: "Moitié moins de contexte que les options à 1M ici",
        },
        chineseWisdom: {
          description:
            "La stratégie au quotidien au coût le plus bas. Lit graphiques, decks et captures d'écran.",
          strength: "Niveau Brillant, le moins cher ici, contexte de 1M",
          weakness: "Les longs rapports coûtent cher en sortie",
        },
        techBro: {
          description:
            "Chiffres, modèles et plans à remettre à une équipe. Excellent avec les outils.",
          strength: "Structure et usage des outils fiables",
          weakness: "Le plus cher ici, filtre mainstream",
        },
      },
    },
    careerCoach: {
      name: "Coach carrière",
      description: "Évolution de carrière, recherche d'emploi et entretiens",
      tagline: "Faites décoller votre carrière",
      shortDesc: "Évolution et orientation professionnelles",
      suggestedPrompts: {
        0: "Aide-moi à améliorer mon CV",
        1: "Prépare-moi à un entretien d'embauche",
        2: "Comment négocier mon salaire ?",
        3: "Planifie ma reconversion",
      },
      variants: {
        headhunter: "Chasseur de têtes",
        intern: "Rapide",
      },
      variantInfo: {
        headhunter: {
          description:
            "CV réécrits, entretiens blancs et arguments salariaux qui tiennent la route.",
          strength: "Écriture soignée, lit les documents envoyés",
          weakness: "Bien plus cher par message que Rapide",
        },
        intern: {
          description:
            "Réponses rapides pour ajuster une lettre de motivation ou préparer un entretien en déplacement.",
          strength: "L'option la plus rapide et la moins chère ici",
          weakness:
            "Niveau Rapide. Moins de profondeur sur la stratégie de carrière",
        },
      },
    },
    healthWellness: {
      name: "Santé et bien-être",
      description: "Conseils en forme physique, nutrition et bien-être",
      tagline: "Vivre mieux",
      shortDesc: "Conseils santé et bien-être",
      suggestedPrompts: {
        0: "Crée-moi un programme d'entraînement",
        1: "Aide-moi à planifier des repas sains",
        2: "Propose des techniques de gestion du stress",
        3: "Améliore mes habitudes de sommeil",
      },
      variants: {
        techBro: "Complet",
        budget: "Économique",
      },
      variantInfo: {
        techBro: {
          description:
            "Programmes d'entraînement détaillés, bilans nutritionnels et contexte santé soigné.",
          strength: "Des plans structurés à suivre semaine après semaine",
          weakness: "Plusieurs fois le prix d'Économique par message",
        },
        budget: {
          description:
            "Réponses rapides sur l'entraînement, les repas et les habitudes, pour presque rien.",
          strength: "L'option la moins chère, réponses rapides",
          weakness:
            "Niveau Rapide : moins de profondeur sur les questions de santé complexes",
        },
      },
    },
    supportAgent: {
      name: "Agent de support",
      description:
        "Support technique par IA qui sait quand faire appel à un humain",
      tagline: "Réparer vite",
      shortDesc: "Support technique avec escalade vers un humain",
      suggestedPrompts: {
        0: "Mon appli plante sans arrêt, aide-moi à régler ça",
        1: "Je n'arrive pas à me connecter au réseau",
        2: "J'ai un message d'erreur que je ne comprends pas",
        3: "Guide-moi pour réinitialiser mon mot de passe",
      },
      variants: {
        default: "Standard",
        fast: "Rapide",
      },
      variantInfo: {
        default: {
          description:
            "Diagnostic soigneux des problèmes techniques épineux. Sait passer la main.",
          strength: "Excellent en débogage et en solutions pas à pas",
          weakness: "L'option la plus chère ici",
        },
        fast: {
          description:
            "Réponses immédiates pour les problèmes courants, les mots de passe oubliés et les tutoriels.",
          strength: "Le plus rapide et le moins cher, lit les captures d'écran",
          weakness: "Niveau Rapide. Plus faible sur les bugs rares et profonds",
        },
      },
    },
    travelPlanner: {
      name: "Organisateur de voyages",
      description: "Planification de voyages et recommandations",
      tagline: "Explorer le monde",
      shortDesc: "Planification de voyages et recommandations",
      suggestedPrompts: {
        0: "Prépare un voyage de 2 semaines en/au...",
        1: "Propose des destinations pour...",
        2: "Crée un itinéraire jour par jour pour...",
        3: "Détaille le budget d'un voyage en/au...",
      },
      variants: {
        snappy: "Complet",
        budget: "Économique",
      },
      variantInfo: {
        snappy: {
          description:
            "Itinéraires complets avec trajets, budgets et plans de secours.",
          strength: "Raisonnement équilibré à un prix courant",
          weakness: "Coûte environ dix fois Économique",
        },
        budget: {
          description:
            "Astuces rapides, listes de bagages et idées de journées pour quelques centimes.",
          strength: "Très bon marché et rapide",
          weakness:
            "Niveau Rapide. Faible sur les voyages complexes multi-villes",
        },
      },
    },
    legalAssistant: {
      name: "Assistant juridique",
      description: "Informations juridiques et compréhension de documents",
      tagline: "Connaissez vos droits",
      shortDesc: "Recherche juridique et aide sur les documents",
      suggestedPrompts: {
        0: "Explique ce terme juridique",
        1: "Aide-moi à comprendre ce contrat",
        2: "Quels sont mes droits en tant que locataire ?",
        3: "Explique la procédure de...",
      },
      variants: {
        elonTusk: "Franc-parler",
        budget: "Économique",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Analyse juridique en langage clair, qui nomme les risques sans détour.",
          strength: "Raisonnement brillant, politique de contenu ouverte",
          weakness: "Plusieurs fois le prix d'Économique par message",
        },
        budget: {
          description:
            "Lecture rapide de contrats et de courriers. Envoyez une photo, obtenez l'essentiel.",
          strength: "L'option la moins chère, lit les images, contexte de 1M",
          weakness: "Niveau Malin : moins de profondeur sur les cas complexes",
        },
      },
    },
    financialAdvisor: {
      name: "Conseiller financier",
      description: "Finances personnelles, budget et investissement",
      tagline: "Bâtir son patrimoine",
      shortDesc: "Planification et conseil financiers",
      suggestedPrompts: {
        0: "Aide-moi à établir un budget",
        1: "Explique les bases de l'investissement",
        2: "Comment rembourser mes dettes ?",
        3: "Planifie mon épargne retraite",
      },
      variants: {
        elonTusk: "Audacieux",
        chineseWisdom: "Profond",
        techBro: "Premium",
        yolo: "Économique",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Avis directs sur le risque, la dette et l'investissement, sans jargon de conformité.",
          strength: "Niveau Brillant, politique de contenu ouverte",
          weakness:
            "Les avis audacieux demandent quand même vos propres vérifications",
        },
        chineseWisdom: {
          description:
            "Planification à long terme pour le budget et la retraite. Lit relevés et graphiques.",
          strength: "Niveau Brillant, contexte de 1M",
          weakness: "Plus cher qu'Économique",
        },
        techBro: {
          description:
            "Scénarios complexes, arbitrages fiscaux et calculs de portefeuille faits avec soin.",
          strength: "Analyse de premier ordre",
          weakness: "L'option la plus chère ici",
        },
        yolo: {
          description:
            "Questions d'argent du quotidien, budgets et plans de désendettement au coût le plus bas ici.",
          strength: "Le moins cher ici, raisonnement solide",
          weakness: "Niveau Malin. Moins de profondeur sur les cas complexes",
        },
      },
    },
    socialMediaManager: {
      name: "Social media manager",
      description: "Contenu et stratégie pour les réseaux sociaux",
      tagline: "Engager et grandir",
      shortDesc: "Stratégie et contenu pour les réseaux sociaux",
      suggestedPrompts: {
        0: "Crée des légendes Instagram pour...",
        1: "Établis un calendrier éditorial",
        2: "Propose des hashtags pour...",
        3: "Écris des tweets accrocheurs sur...",
      },
      variants: {
        snappy: "Incisif",
        budget: "Économique",
      },
      variantInfo: {
        snappy: {
          description:
            "Stratégie, accroches et plans de campagne qui demandent une vraie réflexion.",
          strength: "Raisonnement premium, lit les captures d'écran",
          weakness: "Filtre mainstream, écarte les angles osés",
        },
        budget: {
          description:
            "Légendes express, idées de posts et séries de hashtags pour quelques centimes.",
          strength: "Très bon marché et rapide",
          weakness: "Niveau Rapide. Léger sur la stratégie",
        },
      },
    },
    productManager: {
      name: "Product manager",
      description: "Stratégie produit, roadmaps et recherche utilisateur",
      tagline: "Livrer de grands produits",
      shortDesc: "Gestion de produit et roadmaps",
      suggestedPrompts: {
        0: "Aide-moi à prioriser les fonctionnalités",
        1: "Rédige des user stories pour...",
        2: "Analyse l'adéquation produit-marché",
        3: "Élabore une roadmap produit",
      },
      variants: {
        techBro: "Complet",
        fast: "Rapide",
      },
      variantInfo: {
        techBro: {
          description:
            "Spécifications complètes, roadmaps et synthèses de recherche, excellent avec les outils.",
          strength: "Pensée structurée, solide en travail d'agent",
          weakness: "Plus de deux fois le prix de Rapide",
        },
        fast: {
          description:
            "Priorisation rapide, brouillons de user stories et retours sur captures d'écran.",
          strength: "Réponses rapides, lit images, vidéo et audio",
          weakness:
            "Niveau Malin : moins de profondeur sur les grandes décisions stratégiques",
        },
      },
    },
    debater: {
      name: "Débatteur",
      description: "Débats intellectuels sur des sujets controversés",
      tagline: "Défendre tous les camps",
      shortDesc: "Débats intellectuels et points de vue multiples",
      suggestedPrompts: {
        0: "Débats de l'éthique du développement de l'IA",
        1: "Présente les arguments pour et contre le revenu universel",
        2: "Liberté d'expression ou discours de haine : discutons-en",
        3: "Analyse différentes idéologies politiques",
      },
      variants: {
        elonTusk: "Audacieux",
        chineseWisdom: "Économique",
        techBro: "Mesuré",
        uncensored: "Non censuré",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Choisit un camp et se bat pour lui. Aborde de front la plupart des sujets controversés.",
          strength: "Niveau Brillant, politique de contenu ouverte",
          weakness: "Ouvert, pas non censuré. Peut encore arrondir les angles",
        },
        chineseWisdom: {
          description:
            "Arguments structurés pour et contre, au coût le plus bas ici.",
          strength: "Niveau Brillant, le moins cher ici",
          weakness:
            "Consensuel en politique. Botte en touche sur les sujets brûlants",
        },
        techBro: {
          description:
            "Présente chaque camp sous son meilleur jour, sur l'éthique, la tech et les politiques publiques.",
          strength: "Arguments clairs et bien organisés",
          weakness: "Filtre mainstream. Refuse ou nuance les positions osées",
        },
        uncensored: {
          description:
            "Défend n'importe quelle position, même les plus impopulaires. Aucun retour forcé au consensus.",
          strength:
            "Sa propre vision du monde : argumente contre le mainstream",
          weakness: "Contexte de 32K et prix fixe par message",
        },
      },
    },
    philosopher: {
      name: "Philosophe",
      description:
        "Explorer les grandes questions philosophiques sans contraintes",
      tagline: "Chercher la vérité",
      shortDesc: "Exploration et analyse philosophiques en profondeur",
      suggestedPrompts: {
        0: "Quelle est la nature de la conscience ?",
        1: "Avons-nous un libre arbitre ou tout est-il déterminé ?",
        2: "Existe-t-il une morale objective ?",
        3: "Qu'est-ce qui donne un sens à une vie ?",
      },
      variants: {
        elonTusk: "Audacieux",
        chineseWisdom: "Équilibré",
        techBro: "Analytique",
        uncensored: "Non censuré",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Prend position et la défend. Politique ouverte, peu d'esquives.",
          strength: "Raisonnement brillant sans précautions morales",
          weakness: "Plus cher qu'Équilibré, contexte de 500K",
        },
        chineseWisdom: {
          description:
            "De longs dialogues patients sur l'éthique, la métaphysique et l'esprit.",
          strength: "Niveau Brillant, le moins cher ici, contexte de 1M",
          weakness: "Consensuel en politique, adoucit les positions tranchées",
        },
        techBro: {
          description:
            "Arguments serrés, logique nette, chaque prémisse vérifiée.",
          strength: "Structure rigoureuse, repère les prémisses fragiles",
          weakness: "Filtre mainstream, plus cher qu'Équilibré",
        },
        uncensored: {
          description:
            "Philosophie politique, questions taboues et hétérodoxes, sans filtre.",
          strength:
            "Sa propre vision du monde : positions hétérodoxes, politique comprise",
          weakness: "Contexte de 32K, niveau Malin, prix fixe par message",
        },
      },
    },
    uncensoredWriter: {
      name: "Écrivain non censuré",
      description: "Écriture créative sans limites artificielles",
      tagline: "Écrire librement",
      shortDesc: "Écriture créative et narration sans restrictions",
      suggestedPrompts: {
        0: "Écris un thriller psychologique sombre",
        1: "Crée une scène romantique pour adultes",
        2: "Développe un personnage moralement ambigu",
        3: "Écris de l'horreur aux détails explicites",
      },
      variants: {
        smart: "Provocateur",
        fast: "Rapide",
        deep: "Profond",
      },
      variantInfo: {
        smart: {
          description:
            "Fiction sombre et taboue, satire politique qui cite des noms.",
          strength:
            "Le meilleur ici pour la fiction sombre, taboue et politique",
          weakness: "Contexte de 32K, le plus cher par message",
        },
        fast: {
          description:
            "Brouillons, scènes et prose de jeu de rôle non censurés pour quelques centimes.",
          strength: "Le modèle non censuré le moins cher",
          weakness: "Niveau Rapide. Perd le fil sur les longues œuvres",
        },
        deep: {
          description:
            "Fiction longue non censurée. Des romans entiers restent en mémoire.",
          strength: "Niveau Brillant, contexte de 1M, outils",
          weakness: "Prudent sur la politique, plus cher que Rapide",
        },
      },
    },
    roleplaySkill: {
      name: "Jeu de rôle",
      description: "Jeu de rôle immersif sans restrictions",
      tagline: "Devenez qui vous voulez",
      shortDesc: "Jeu de rôle et scénarios authentiques",
      suggestedPrompts: {
        0: "Joue un personnage de fantasy",
        1: "Crée un scénario d'aventure de science-fiction",
        2: "Incarne un personnage historique",
        3: "Développe une relation complexe entre personnages",
      },
      variants: {
        creative: "Créatif",
        deep: "Profond",
        uncensored: "Non censuré",
      },
      variantInfo: {
        creative: {
          description:
            "Personnages vivants et longues scènes à tout petit prix.",
          strength: "L'option la moins chère, politique de contenu ouverte",
          weakness:
            "Ouvert, pas non censuré : adoucit les scènes les plus sombres",
        },
        deep: {
          description:
            "Des personnages cohérents, à la vie intérieure riche, sur de longues campagnes.",
          strength: "Niveau Brillant, se souvient de toute l'histoire",
          weakness: "Adoucit les scènes sombres ou politiques",
        },
        uncensored: {
          description:
            "N'importe quel personnage, n'importe quelle scène. Le sombre et le tabou restent sombres.",
          strength: "Le meilleur ici pour le jeu de rôle sombre et tabou",
          weakness: "Contexte de 32K : oublie les premières scènes, prix fixe",
        },
      },
    },
    researchAgent: {
      name: "Agent web",
      description:
        "Cherche sur le web, lit les pages, recoupe les sources. Retient ses découvertes d'une session à l'autre. Découvre les outils de navigateur quand ils sont disponibles.",
      tagline: "Chercher · Lire · Vérifier",
      shortDesc: "Recherche web, lecture d'URL et vérification des faits",
      suggestedPrompts: {
        0: "Fais le point sur les dernières évolutions de la régulation de l'IA",
        1: "Trouve et résume les faits clés sur un sujet",
        2: "Compare différentes sources sur un sujet",
        3: "Rédige une note de recherche avec citations",
      },
      variants: {
        kimi: "Équilibré",
        gemini: "Profond",
        flash: "Rapide",
        grok: "Ouvert",
        claude: "Économique",
      },
      variantInfo: {
        kimi: {
          description:
            "Cherche, lit et recoupe avec un raisonnement de premier ordre à prix courant.",
          strength: "Niveau Brillant, contexte de 1M, lit images et vidéos",
          weakness: "Consensuel en politique, les longs rapports s'accumulent",
        },
        gemini: {
          description:
            "Recherche approfondie sur pages, vidéos et sources audio.",
          strength: "Niveau Brillant, lit tous les types de médias",
          weakness: "La variante la plus chère ici, filtre mainstream",
        },
        flash: {
          description:
            "Recherches rapides et lecture de pages avec entrée multimodale.",
          strength: "Rapide, lit images, vidéo et audio",
          weakness: "Niveau Malin, pas l'option la moins chère",
        },
        grok: {
          description:
            "Recherches rapides sur les sujets que les modèles mainstream esquivent.",
          strength: "Politique de contenu ouverte, très bon marché",
          weakness: "Niveau Rapide : recoupement superficiel",
        },
        claude: {
          description:
            "Recherches simples et résumés de pages au prix le plus bas.",
          strength: "L'option la moins chère, fiable avec les outils",
          weakness: "Niveau Rapide, filtre mainstream",
        },
      },
    },
    statsAnalyst: {
      name: "Analyste statistique",
      description:
        "Spécialiste de l'analytique, avec accès aux statistiques des leads, utilisateurs, e-mails et parrainages pour des décisions fondées sur les données",
      tagline: "Décider par les données",
      shortDesc: "Analytique et reporting de la plateforme",
      suggestedPrompts: {
        0: "Montre-moi un aperçu de l'activité des leads aujourd'hui",
        1: "Comment évoluent les inscriptions cette semaine ?",
        2: "Résume les performances des campagnes e-mail",
        3: "Fais-moi un état du programme de parrainage",
      },
      variants: {
        gemini: "Profond",
        fast: "Rapide",
      },
      variantInfo: {
        gemini: {
          description:
            "Analyse complète des leads, utilisateurs, e-mails et parrainages. Repère la vraie tendance.",
          strength: "Raisonnement brillant sur de nombreux appels d'outils",
          weakness: "Plus de deux fois le prix de Rapide",
        },
        fast: {
          description:
            "Extraction rapide de stats et vérification des chiffres du jour.",
          strength: "Réponses rapides, bon usage des outils",
          weakness: "Plus superficiel sur les analyses en plusieurs étapes",
        },
      },
    },
    cronManager: {
      name: "Gestionnaire cron",
      description:
        "Spécialiste de la planification qui crée, modifie, supprime et surveille les tâches cron et leur historique d'exécution",
      tagline: "Planifier et surveiller",
      shortDesc: "Gestion et surveillance des tâches cron",
      suggestedPrompts: {
        0: "Liste toutes les tâches cron actives et leurs horaires",
        1: "Crée une tâche cron qui s'exécute toutes les heures",
        2: "Montre-moi les échecs et erreurs récents",
        3: "Vérifie l'état général du système de tâches",
      },
      variants: {
        gemini: "Complet",
        fast: "Rapide",
      },
      variantInfo: {
        gemini: {
          description:
            "Fouille l'historique des échecs et démêle les planifications complexes.",
          strength:
            "Niveau Brillant, prudent sur les changements en plusieurs étapes",
          weakness: "Plus de deux fois le prix de Rapide",
        },
        fast: {
          description:
            "Listes, créations et vérifications d'état rapides pour le travail cron de routine.",
          strength: "Moins cher et rapide sur les tâches de routine",
          weakness: "Niveau Malin. Moins prudent sur les échecs enchevêtrés",
        },
      },
    },
    systemMonitor: {
      name: "Moniteur système",
      description:
        "Spécialiste de la santé de l'infrastructure : état des serveurs, connectivité de la base de données, pulse checks et exécution des tâches",
      tagline: "Surveiller et alerter",
      shortDesc: "Surveillance de la santé de l'infrastructure",
      suggestedPrompts: {
        0: "Lance un bilan de santé complet du système",
        1: "Montre-moi l'état de la surveillance pulse",
        2: "Vérifie la connectivité de la base de données",
        3: "Quel est l'état actuel des tâches en arrière-plan ?",
      },
      variants: {
        fast: "Malin",
        budget: "Économique",
      },
      variantInfo: {
        fast: {
          description:
            "Bilans de santé et vrai diagnostic quand des pulses ou des tâches cron échouent.",
          strength: "Lit logs et historique avec plus de discernement",
          weakness: "Coûte plusieurs fois plus qu'Économique",
        },
        budget: {
          description:
            "Vérifications d'état de routine et pings de base de données 24 h/24.",
          strength: "Le plus rapide et le moins cher, appels d'outils fiables",
          weakness: "Niveau Rapide. Léger sur l'analyse des causes profondes",
        },
      },
    },
    publicCurator: {
      name: "Curateur public",
      description:
        "Spécialiste de la gestion de contenu pour les fils publics, les messages et le contenu communautaire",
      tagline: "Trier et organiser",
      shortDesc: "Gestion des contenus et fils publics",
      suggestedPrompts: {
        0: "Liste les fils publics récents",
        1: "Cherche des fils sur un sujet précis",
        2: "Aide-moi à organiser le contenu communautaire",
        3: "Trouve les messages qui répondent à certains critères",
      },
      variants: {
        gemini: "Complet",
        fast: "Rapide",
      },
      variantInfo: {
        gemini: {
          description:
            "Examen attentif des fils publics, images, vidéos et audio compris.",
          strength: "Niveau Brillant, lit tous les types de médias",
          weakness: "Plus de deux fois le prix de Rapide",
        },
        fast: {
          description:
            "Tri, étiquetage et nettoyage rapides du contenu communautaire.",
          strength: "Multimodal rapide à moindre prix",
          weakness: "Niveau Malin : plus faible sur les cas limites",
        },
      },
    },
    codeArchitect: {
      name: "Architecte de code",
      description:
        "Spécialiste de l'architecture qui délègue l'implémentation à Claude Code. Disponible uniquement sur Hermes.",
      tagline: "Concevoir et déléguer",
      shortDesc: "Décisions d'architecture via Claude Code",
      suggestedPrompts: {
        0: "Planifie l'implémentation d'une nouvelle fonctionnalité",
        1: "Évalue l'architecture d'un module",
        2: "Délègue une tâche de code à Claude Code",
        3: "Conçois une stratégie de migration",
      },
      variants: {
        gemini: "Vue d'ensemble",
        techBro: "Pro du code",
      },
      variantInfo: {
        gemini: {
          description:
            "Conception système et plans de migration sur de grosses bases de code avant de passer la main.",
          strength: "Niveau Brillant, lit diagrammes, vidéo, audio",
          weakness: "Moins dans le code que Pro du code",
        },
        techBro: {
          description:
            "Des specs écrites comme Claude Code les exécute. Découpage des tâches serré.",
          strength: "Solide en code et en travail d'agent",
          weakness:
            "Niveau Malin, pas Brillant, sur les choix de conception profonds",
        },
      },
    },
    deploymentAgent: {
      name: "Agent de déploiement",
      description:
        "Spécialiste du déploiement : builds, releases et gestion des serveurs via SSH. Disponible uniquement sur Hermes.",
      tagline: "Builder et déployer",
      shortDesc: "Déploiements et gestion des serveurs",
      suggestedPrompts: {
        0: "Builde l'application pour la production",
        1: "Vérifie l'état de santé du serveur",
        2: "Lance un déploiement en production",
        3: "Montre-moi l'état actuel du serveur",
      },
      variants: {
        techBro: "Fiable",
        budget: "Économique",
      },
      variantInfo: {
        techBro: {
          description:
            "Builds, releases et travail SSH, là où une mauvaise commande se paie cher.",
          strength: "Solide en travail d'agent, prudent avec les outils",
          weakness: "Bien plus cher par message qu'Économique",
        },
        budget: {
          description:
            "Bilans de santé et rapports d'état de routine pour une fraction du prix.",
          strength: "Le moins cher et le plus rapide ici",
          weakness: "Niveau Rapide. Plus risqué sur les déploiements complexes",
        },
      },
    },
    rebuildAgent: {
      name: "Agent de rebuild",
      description:
        "Spécialiste du build et du redémarrage : reconstruit l'application et redémarre le serveur à chaud, sans interruption, via le signal SIGUSR1",
      tagline: "Builder et redémarrer",
      shortDesc: "Rebuild de l'application et redémarrage à chaud",
      suggestedPrompts: {
        0: "Rebuilde et redémarre le serveur de production",
        1: "Lance un build sans redémarrer",
        2: "Vérifie que le serveur est sain après le rebuild",
        3: "Crée une tâche de rebuild planifiée",
      },
      variants: {
        gemini: "Complet",
        fast: "Rapide",
      },
      variantInfo: {
        gemini: {
          description:
            "Rebuilde, redémarre et creuse les erreurs de build avant d'abandonner.",
          strength:
            "Niveau Brillant, le meilleur pour diagnostiquer les builds ratés",
          weakness: "Plus de deux fois le prix de Rapide",
        },
        fast: {
          description:
            "Rebuild et redémarrage de routine quand le build doit passer.",
          strength: "Exécution rapide à moindre prix",
          weakness:
            "Niveau Malin : plus faible sur les erreurs de build enchevêtrées",
        },
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Agent d'implémentation principal qui fait le pont entre les idées de fonctionnalités et le code de production. Explore la base de code en profondeur via Claude Code, dégage l'intention des demandes et implémente des solutions alignées.",
      tagline: "De l'idée au code",
      shortDesc: "Implémentation de fonctionnalités via Claude Code",
      suggestedPrompts: {
        0: "J'ai une idée de fonctionnalité, je vous la décris",
        1: "Explore la base de code et explique le fonctionnement d'un module",
        2: "Aide-moi à planifier et implémenter une modification d'une fonctionnalité existante",
        3: "Enquête sur un bug et propose un correctif",
      },
      variants: {
        budget: "Économique et malin",
        open: "Frontière ouverte",
        fast: "Incisif",
        max: "Max",
        broad: "Large",
      },
    },
    skillCreator: {
      name: "Créateur de skills",
      description:
        "Concevez et créez des compétences d'IA avec personnalité, prompt système, outils et configuration de modèle sur mesure. Gère aussi les favoris et les paramètres.",
      tagline: "Concevoir des compétences d'IA",
      shortDesc: "Créer et gérer des compétences d'IA",
      suggestedPrompts: {
        0: "Aide-moi à créer une nouvelle compétence d'IA d'assistance au code",
        1: "Montre-moi toutes les compétences existantes et suggère ce qui manque",
        2: "Conçois une compétence d'écriture créative à la personnalité unique",
        3: "Ajoute une compétence à mes favoris et configure mes paramètres de chat",
      },
      variants: {
        cheapAndSmart: "Économique",
        brilliant: "Précis",
      },
      variantInfo: {
        cheapAndSmart: {
          description:
            "Ébauchez et itérez sur vos compétences à petit prix. Largement assez de matière grise pour les prompts et les configs.",
          strength: "Niveau Brillant, moins cher par message",
          weakness: "Les longs prompts système coûtent plus en sortie",
        },
        brilliant: {
          description:
            "Prompts système serrés et configuration d'outils propre, quand la compétence doit être parfaite.",
          strength: "Solide en travail d'agent et en outils",
          weakness: "Plus cher, et mainstream sur les personas osés",
        },
      },
    },
    heilpraktikerPruefung: {
      name: "Entraîneur examen HP",
      description:
        "Simulation réaliste de l'examen oral de Heilpraktiker, à difficulté adaptative",
      tagline: "Mündliche Prüfung",
      shortDesc: "Préparation à l'examen de Heilpraktiker",
      suggestedPrompts: {
        0: "Starten wir die Prüfung",
        1: "Prüfe mich in Innerer Medizin",
        2: "Stelle mir einen klinischen Fall vor",
        3: "Fragen zur Gesetzeskunde bitte",
      },
      variants: {
        smart: "Équilibré",
        precise: "Précis",
        thorough: "Complet",
        quick: "Rapide",
      },
      variantInfo: {
        smart: {
          description:
            "Examen oral réaliste, avec une solide profondeur médicale, à prix courant.",
          strength:
            "Raisonnement de haut niveau, garde les longues sessions en vue",
          weakness: "Les longs retours de l'examinateur font monter le coût",
        },
        precise: {
          description:
            "Questions exactes et corrections nettes. Strict sur la terminologie et le droit.",
          strength: "Corrections claires et concises, moins cher qu'Équilibré",
          weakness:
            "Niveau intermédiaire : moins de nuance sur les diagnostics différentiels délicats",
        },
        thorough: {
          description:
            "Questions de relance poussées et débriefings détaillés, au plus près du vrai examinateur.",
          strength:
            "Les retours les plus détaillés sur les lacunes et les signaux d'alerte",
          weakness: "La variante la plus chère de cet entraîneur",
        },
        quick: {
          description:
            "Séries d'exercices rapides pour réviser entre deux simulations complètes.",
          strength: "L'option la moins chère, réponses instantanées",
          weakness: "Niveau Rapide : superficiel sur les cas complexes",
        },
      },
    },
    qualityTester: {
      name: "Testeur qualité",
      description:
        "Utilisateur test qui essaie les fonctionnalités de la plateforme naturellement. S'arrête et signale clairement quand quelque chose casse, au lieu de réessayer.",
      tagline: "Trouver les bugs",
      shortDesc: "Persona de test de la plateforme",
      suggestedPrompts: {
        0: "Fais-moi une image d'un coucher de soleil",
        1: "Quels outils as-tu ?",
        2: "Génère de la musique, un truc calme",
        3: "Fais une courte vidéo d'un chat",
      },
      variants: {
        budget: "Économique",
        visual: "Visuel",
        nativeImage: "Image native",
        nanoBananaPro: "Nano Banana Pro",
      },
      variantInfo: {
        budget: {
          description:
            "Utilise les fonctionnalités de la plateforme comme un vrai utilisateur et signale ce qui casse.",
          strength:
            "Les tests les moins chers, prise en charge complète des outils",
          weakness: "Ne génère pas d'images nativement",
        },
        nativeImage: {
          description:
            "Teste la sortie d'image native d'un modèle de génération d'images.",
          strength: "Vérifie le chemin de génération d'images natif",
          weakness:
            "Pas d'appels d'outils, ne teste pas les autres fonctionnalités",
        },
      },
    },
  },
  get: {
    title: "Skills",
    titleShort: "Skills",
    dynamicTitle: "Skills ({{count}})",
    description:
      "Obtenir toutes les compétences disponibles (par défaut + personnalisées)",
    fields: {
      query: {
        label: "Recherche (facultatif)",
        description:
          "Filtre les compétences par mot-clé. Tous les mots séparés par des espaces sont requis (ex. 'image gen' correspond à 'image generation'). Recherche de sous-chaîne insensible à la casse dans le nom, l'accroche, la description et la catégorie. Omettez-le pour lister toutes les compétences.",
        placeholder: "ex. recherche, image gen, code",
      },
      skillId: {
        label: "ID de la compétence",
        description:
          "Obtenir tous les détails d'une compétence précise par son ID. Renvoie le prompt système, les outils et la configuration du modèle.",
      },
      page: {
        label: "Page",
        description:
          "Numéro de page pour les résultats paginés (IA/MCP : 25 par page par défaut).",
      },
      pageSize: {
        label: "Taille de page",
        description:
          "Nombre de compétences par page (1 à 500). Par défaut 25 pour les appels IA/MCP ; les appels humains renvoient tout.",
      },
      sourceFilter: {
        label: "Source",
        description:
          "Filtrer les compétences par source : intégrées, communautaires ou vos propres compétences personnalisées.",
      },
      targetUserId: {
        label: "ID de l'utilisateur cible",
        description:
          "Admin uniquement : voir les compétences d'un utilisateur précis.",
      },
    },
    container: {
      title: "Liste des compétences",
      description: "Toutes les compétences disponibles pour l'utilisateur",
    },
    createButton: {
      label: "Créer une compétence personnalisée",
    },
    openFullPage: "Ouvrir la page complète",
    browser: {
      advancedModelAccess: "Choisissez votre expérience IA",
      configureFiltersText:
        "Choisissez directement un modèle ou partez de compétences préconfigurées",
      aiModels: "modèles d'IA",
      configureAiModelsTitle: "Sélection directe du modèle",
      advancedChooseText:
        "Choisissez parmi {{count}} modèles, avec un contrôle fin de l'intelligence, du contenu et du coût",
      modelsWithCustomFilters: "modèles avec filtres personnalisés",
      configureButton: "Configurer",
      selectButton: {
        label: "Explorer les modèles",
      },
      skillPresets: "Compétences prêtes à l'emploi",
      pickSkillText:
        "Partez de compétences réglées par des experts, avec le bon modèle déjà choisi. Ajustez les réglages quand vous voulez.",
    },
    signupPrompt: {
      title: "Créez vos propres compétences IA",
      description:
        "Concevez des compétences sur mesure, avec leur propre personnalité et leur propre comportement. Inscrivez-vous pour commencer.",
      backButton: "Parcourir les compétences",
      signupButton: "Créer un compte",
      loginButton: "Se connecter",
    },
    search: {
      placeholder: "Rechercher des compétences...",
      noResults: "Aucune compétence ne correspond à votre recherche",
      results: "Résultats de recherche",
    },
    card: {
      actions: {
        inCollection: "Dans votre collection",
        addAnother: "Ajouter une autre",
        addToCollection: "Ajouter à la collection :",
        quick: "Rapide",
        customize: "Personnaliser",
        useNow: "Activer",
        inUse: "Active",
        goToChat: "Aller au chat",
        useThis: "Utiliser",
        chooseFavorite: "Choisir un modèle",
        selectFavorite: "Choisissez le modèle avec lequel discuter :",
        addVariant: "Ajouter un autre modèle",
        view: "Voir",
        edit: "Modifier",
        vote: "Voter",
        report: "Signaler",
        addMissing: "Ajouter tous les modèles à Mes Skills",
        add: "Ajouter",
        added: "Ajoutée",
      },
      showVariants: "Modèles ({{count}})",
    },
    section: {
      showMore: "Afficher {{count}} de plus",
      showLess: "Afficher moins",
      browseAll: "Tout parcourir",
    },
    response: {
      skills: {
        skill: {
          title: "Compétence",
          id: { content: "ID de la compétence" },
          name: { content: "Nom de la compétence" },
          tagline: { content: "Accroche de la compétence" },
          description: { content: "Description de la compétence" },
          icon: { content: "Icône de la compétence" },
          systemPrompt: { content: "Prompt système" },
          category: { content: "Catégorie" },
          source: { content: "Source" },
          ownershipType: { content: "Type de propriété" },
          preferredModel: { content: "Modèle préféré" },
          voice: { content: "Voix" },
          suggestedPrompts: { content: "Prompts suggérés" },
          requirements: { content: "Prérequis" },
          modelSelection: { title: "Sélection du modèle" },
          selectionType: { content: "Type de sélection" },
          minIntelligence: { content: "Intelligence minimale" },
          maxIntelligence: { content: "Intelligence maximale" },
          minPrice: { content: "Prix minimum" },
          maxPrice: { content: "Prix maximum" },
          minContent: { content: "Niveau de contenu minimum" },
          maxContent: { content: "Niveau de contenu maximum" },
          preferredStrengths: { content: "Points forts recherchés" },
          ignoredWeaknesses: { content: "Points faibles ignorés" },
          manualModelId: { content: "Modèle manuel" },
          separator: { content: "•" },
          actions: {
            directModelButton: {
              label: "Modèle direct",
            },
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour accéder aux compétences personnalisées",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation d'accéder à cette ressource",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de la récupération des compétences",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit avec l'état actuel",
      },
    },
    success: {
      title: "Succès",
      description: "Compétences récupérées",
    },
  },
  post: {
    title: "Créer une compétence",
    titleShort: "Créer une compétence",
    dynamicTitle: "Créer : {{name}}",
    description: "Créer une nouvelle compétence personnalisée",
    form: {
      title: "Créez votre compétence personnalisée",
      description:
        "Concevez une compétence IA unique, avec son propre comportement, sa personnalité et ses capacités. Choisissez un modèle précis ou laissez le système choisir selon vos critères.",
    },
    submitButton: {
      text: "Créer la compétence",
      loadingText: "Création de la compétence...",
    },
    backButton: {
      label: "Retour",
    },
    container: {
      title: "Nouvelle compétence",
      description: "Définir une nouvelle compétence personnalisée",
    },
    name: {
      label: "Nom de la compétence",
      description:
        "Donnez à votre compétence un nom facile à retenir. C'est ainsi que vous et les autres la reconnaîtrez.",
      placeholder: "Nom de la compétence",
      validation: {
        minLength: "Le nom doit contenir au moins 2 caractères",
        maxLength: "Le nom doit contenir moins de 100 caractères",
      },
    },
    tagline: {
      label: "Accroche de la compétence",
      description:
        "Une phrase percutante qui résume l'essence de votre compétence. Courte et parlante.",
      placeholder: "Une accroche courte",
      validation: {
        minLength: "L'accroche doit contenir au moins 2 caractères",
        maxLength: "L'accroche doit contenir moins de 500 caractères",
      },
    },
    icon: {
      label: "Icône de la compétence",
      description:
        "Nom de l'icône de cette compétence (ex. 'brain', 'technologist', 'zap'). Utilisez vibe help --toolName=icon-list pour parcourir les noms disponibles.",
    },
    skillDescription: {
      label: "Description de la compétence",
      description:
        "Décrivez ce qui rend cette compétence unique. Quel est son rôle ? En quoi peut-elle aider ? Soyez précis et détaillé.",
      placeholder: "Décrivez l'objectif et les capacités de votre compétence",
      validation: {
        minLength: "La description doit contenir au moins 10 caractères",
        maxLength: "La description doit contenir moins de 500 caractères",
      },
    },
    category: {
      label: "Catégorie",
      description:
        "Choisissez la catégorie qui correspond le mieux à votre compétence. Cela facilite le classement et la découverte.",
    },
    isPublic: {
      label: "Rendre public",
      description:
        "Activez cette option pour partager votre compétence avec la communauté. Désactivée, la compétence reste privée et visible par vous seul.",
    },
    chatModel: {
      label: "Modèle de chat",
      placeholder: "Défaut du système",
    },
    voice: {
      label: "Voix (TTS)",
      description:
        "Voix de synthèse vocale de cette compétence. null = la préférence de voix globale de l'utilisateur l'emporte (modèle passerelle : le réglage utilisateur prime sur la compétence). À renseigner uniquement si la compétence a une voix signature (ex. un persona de narrateur).",
      placeholder: "Défaut du système",
    },
    sttModel: {
      label: "Modèle de transcription vocale",
      description:
        "Modèle de reconnaissance vocale. null = la préférence de l'utilisateur l'emporte (modèle passerelle). À renseigner uniquement si la compétence exige une précision particulière (ex. transcription médicale).",
      placeholder: "Défaut du système",
    },
    imageVisionModel: {
      label: "Modèle de vision d'image",
      description:
        "LLM multimodal pour analyser les images en entrée. null = la préférence de l'utilisateur l'emporte (modèle passerelle). À renseigner quand la compétence a besoin des capacités d'un modèle de vision précis.",
      placeholder: "Défaut du système",
    },
    videoVisionModel: {
      label: "Modèle de vision vidéo",
      description:
        "LLM multimodal pour analyser les vidéos en entrée. null = la préférence de l'utilisateur l'emporte (modèle passerelle). À renseigner quand la compétence doit comprendre la vidéo.",
      placeholder: "Défaut du système",
    },
    audioVisionModel: {
      label: "Modèle de vision audio",
      description:
        "LLM multimodal pour analyser l'audio en entrée. null = la préférence de l'utilisateur l'emporte (modèle passerelle). À renseigner quand la compétence doit comprendre l'audio.",
      placeholder: "Défaut du système",
    },
    imageGenModel: {
      label: "Modèle de génération d'images",
      description:
        "Modèle de génération d'images. Prime sur les réglages de l'utilisateur quand il est défini (génération de médias : l'intention de la compétence l'emporte). À renseigner quand la compétence EST un générateur d'images (ex. 'Flux Artist'). null = préférence globale de génération d'images de l'utilisateur.",
      placeholder: "Défaut du système",
    },
    musicGenModel: {
      label: "Modèle de génération musicale",
      description:
        "Modèle de génération musicale. Prime sur les réglages de l'utilisateur quand il est défini (génération de médias : l'intention de la compétence l'emporte). À renseigner quand la compétence EST un compositeur. null = préférence globale de génération musicale de l'utilisateur.",
      placeholder: "Défaut du système",
    },
    videoGenModel: {
      label: "Modèle de génération vidéo",
      description:
        "Modèle de génération vidéo. Prime sur les réglages de l'utilisateur quand il est défini (génération de médias : l'intention de la compétence l'emporte). À renseigner quand la compétence EST un créateur de vidéos. null = préférence globale de génération vidéo de l'utilisateur.",
      placeholder: "Défaut du système",
    },
    systemPrompt: {
      label: "Prompt système",
      description:
        "Définissez le comportement, la personnalité et l'expertise de votre compétence. C'est l'instruction centrale qui façonne les réponses de l'IA. Détaillez le ton, les domaines de connaissance et le style de conversation.",
      placeholder: "Vous êtes un assistant serviable spécialisé dans...",
      validation: {
        minLength: "Le prompt système doit contenir au moins 10 caractères",
        maxLength: "Le prompt système doit contenir moins de 5000 caractères",
      },
    },
    modelSelection: {
      title: "Sélection du modèle",
      label: "Sélection du modèle",
      description:
        "Modèle de chat de cette compétence. FILTERS (recommandé) : définissez intelligenceRange/priceRange/contentRange, le système choisit le meilleur modèle disponible. N'utilisez MANUAL que si vous avez besoin des capacités propres à un modèle précis (modèles de raisonnement, modèle non censuré précis). null = défaut de la plateforme. Voir MODEL-RESOLUTION.md pour les règles de priorité complètes.",
    },
    variants: {
      label: "Variantes",
      description:
        "Variantes nommées avec leur propre sélection de modèle. Chaque variante a besoin de : id (chaîne unique), modelSelection (obligatoire), isDefault (exactement une doit être true). Facultatif : displayName, remplacements des modèles de voix, de vision et de génération.",
    },
    availableTools: {
      label: "Outils autorisés",
      description:
        "Liste des outils que cette compétence peut utiliser. Chaque entrée a besoin d'un toolId (utilisez system_help_GET pour découvrir les ID d'outils disponibles). Mettez requiresConfirmation: true pour demander confirmation avant l'exécution. Passez null pour hériter des réglages globaux.",
    },
    pinnedTools: {
      label: "Outils épinglés",
      description:
        "Outils épinglés dans la barre d'outils pour un accès rapide avec cette compétence. Sous-ensemble de availableTools. Passez null pour utiliser les outils épinglés par défaut.",
    },
    compactTrigger: {
      label: "Seuil de compactage (tokens)",
      description:
        "Nombre de tokens qui déclenche le compactage automatique de la conversation. Mettez null pour utiliser la valeur globale par défaut.",
    },
    selectionType: {
      label: "Type de sélection",
      skillBased: "Selon la compétence",
      manual: "Modèle précis",
      filters: "Critères de filtrage",
    },
    preferredModel: {
      label: "Modèle préféré",
      description:
        "Choisissez un modèle d'IA précis à toujours utiliser avec cette compétence",
      helpText:
        "Choisir un modèle précis verrouille cette compétence sur ce seul modèle",
    },
    intelligence: {
      label: "Niveau d'intelligence",
      description:
        "Niveau d'intelligence ou de capacité minimum requis pour le modèle",
    },
    intelligenceRange: {
      label: "Plage d'intelligence",
      description: "Niveau d'intelligence ou de capacité requis pour le modèle",
      minLabel: "Intelligence min.",
      maxLabel: "Intelligence max.",
    },
    minIntelligence: {
      label: "Intelligence minimale",
      description:
        "Niveau d'intelligence ou de capacité minimum requis pour le modèle",
    },
    maxIntelligence: {
      label: "Intelligence maximale",
      description:
        "Niveau d'intelligence ou de capacité maximum autorisé pour le modèle",
    },
    priceRange: {
      label: "Fourchette de prix",
      description: "Fourchette de coût en crédits par message",
      minLabel: "Prix min.",
      maxLabel: "Prix max.",
    },
    minPrice: {
      label: "Prix minimum",
      description: "Coût minimum en crédits par message avec cette compétence",
    },
    maxPrice: {
      label: "Prix maximum",
      description:
        "Coût maximum en crédits que vous acceptez de dépenser par message avec cette compétence",
    },
    contentLevel: {
      label: "Niveau de contenu",
      description:
        "Niveau de filtrage du contenu pour le modèle (grand public, ouvert ou non censuré)",
    },
    contentRange: {
      label: "Plage de contenu",
      description: "Plage du niveau de modération du contenu",
      minLabel: "Contenu min.",
      maxLabel: "Contenu max.",
    },
    minContent: {
      label: "Niveau de contenu minimum",
      description: "Niveau minimum de modération du contenu pour le modèle",
    },
    maxContent: {
      label: "Niveau de contenu maximum",
      description: "Niveau maximum de modération du contenu pour le modèle",
    },
    preferredStrengths: {
      label: "Points forts recherchés",
      description: "Capacités et points forts du modèle à privilégier",
      item: "Point fort",
    },
    ignoredWeaknesses: {
      label: "Points faibles ignorés",
      description: "Points faibles du modèle à ignorer ou à tolérer",
      item: "Point faible",
    },
    manualModelId: {
      label: "Modèle manuel",
      description: "Modèle précis à toujours utiliser avec cette compétence",
    },
    suggestedPrompts: {
      label: "Prompts suggérés",
      description: "Exemples de prompts à utiliser avec cette compétence",
      placeholder: "Ajouter un prompt suggéré...",
    },
    response: {
      id: { content: "ID de la compétence créée" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données de la compétence sont invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour créer des compétences",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de créer des compétences",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de la création de la compétence",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Une compétence porte déjà ce nom",
      },
    },
    success: {
      title: "Compétence créée",
      description: "Votre compétence personnalisée a été créée",
    },
  },
  onboarding: {
    success: {
      title: "{{companion}} est prêt à discuter !",
      subtitle:
        "Choisissez maintenant des spécialistes pour des tâches précises, ou passez et ajoutez-les plus tard",
    },
    bottom: {
      title: "Prêt à discuter ?",
      description:
        "Vous pourrez toujours revenir ajouter des spécialistes quand vous en aurez besoin",
      button: "Commencer à discuter",
    },
  },
  selector: {
    free: "GRATUIT",
  },
  credits: {
    credit: "{{count}} crédit",
    credits: "{{count}} crédits",
  },
};
