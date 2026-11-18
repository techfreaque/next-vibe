import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      user: "Créé par vous",
      public: "De la communauté",
    },
  },

  get: {
    title: "Obtenir une compétence",
    titleShort: "Détails de la compétence",
    dynamicTitle: "Compétence : {{name}}",
    description: "Récupérer une compétence précise par son ID",
    container: {
      title: "Détails de la compétence",
      description: "Détails de la compétence demandé",
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
      title: "Choisir un modèle",
      strength: "Point fort",
      weakness: "Point faible",
    },
    addToCollection: "Ajouter à votre collection :",
    addAllToFavorites: "Ajouter tous les modèles",
    quickAdd: "Ajouter",
    tweakAndAdd: "Ajuster et ajouter",
    edit: "Modifier",
    copyAndCustomize: "Créer ma propre version",
    delete: "Supprimer",
    vote: "Voter",
    report: "Signaler",
    actions: "Actions",
    designSelector: {
      label: "Design :",
      current: "Actuel",
      a: "A : App Store",
      b: "B : En-tête scindé",
      c: "C : Carte en vedette",
      d: "D : Deux rangées",
    },
    addVariant: "Ajouter une autre modèle",
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
        description: "Vous devez être connecté pour accéder à cette ressource",
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
      titleNamed: "Partagez {{name}} et gagnez",
      title: "Partagez cette compétence et gagnez",
      description:
        "Partagez cette compétence avec votre lien de parrainage. Touchez 10 % de commission récurrente sur chaque utilisateur qui s'inscrit.",
      selectCode: "Choisir un code de parrainage :",
      noCodesYet: "Aucun code de parrainage pour l'instant",
      createCode: "Créer un code",
      codePlaceholder: "ex. MONCODE",
      creating: "Création...",
      createFailed: "Impossible de créer ce code. Essayez-en un autre.",
      linkReady: "Votre lien de partage :",
      copied: "Copié !",
      copyLink: "Copier le lien",
      close: "Fermer",
      authRequired:
        "Créez un compte gratuit pour obtenir votre lien de parrainage et commencer à gagner.",
      signup: "S'inscrire gratuitement",
      login: "Déjà un compte ? Se connecter",
    },
  },
  patch: {
    title: "Mettre à jour la compétence",
    titleShort: "Mettre à jour",
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
        "L'origine de cette compétence (intégré, personnalisé ou communautaire)",
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
    titleShort: "Supprimer",
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
};
