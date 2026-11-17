import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
    category: "Chat",
    tags: {
      favorites: "Favoris",
    },
    voices: {
      MALE: "Voix masculine",
      FEMALE: "Voix féminine",
    },

    get: {
      title: "Afficher un favori",
      description: "Récupérer une configuration favorite précise",
      container: {
        title: "Détails du favori",
      },
      editButton: {
        label: "Modifier le favori",
      },
      deleteButton: {
        label: "Supprimer le favori",
      },
      viewSkillButton: {
        label: "Voir la compétence",
      },
      signupPrompt: {
        title: "Personnalisez la personnalité de la compétence",
        description:
          "Modifiez le prompt système et le comportement de la compétence. Inscrivez-vous pour commencer.",
        backButton: "Retour",
        signupButton: "Créer un compte",
        loginButton: "Se connecter",
      },
      id: {
        label: "ID du favori",
      },
      response: {
        skillId: {
          content: "Compétence : {{value}}",
        },
        customVariantName: {
          content: "Nom de la variante : {{value}}",
        },
        customIcon: {
          content: "Icône personnalisée : {{value}}",
        },
        voice: {
          content: "Voix : {{value}}",
        },
        mode: {
          content: "Mode : {{value}}",
        },
        intelligence: {
          content: "Intelligence : {{value}}",
        },
        modelSelection: {
          title: "Choix du modèle",
        },
        selectionType: {
          content: "Type de sélection : {{value}}",
        },
        minIntelligence: {
          content: "Intelligence min. : {{value}}",
        },
        maxIntelligence: {
          content: "Intelligence max. : {{value}}",
        },
        minPrice: {
          content: "Prix min. : {{value}}",
        },
        maxPrice: {
          content: "Prix max. : {{value}}",
        },
        minContent: {
          content: "Niveau de contenu min. : {{value}}",
        },
        maxContent: {
          content: "Niveau de contenu max. : {{value}}",
        },
        content: {
          content: "Niveau de contenu : {{value}}",
        },
        preferredStrengths: {
          content: "Points forts privilégiés : {{value}}",
        },
        ignoredWeaknesses: {
          content: "Points faibles ignorés : {{value}}",
        },
        manualModelId: {
          content: "Modèle manuel : {{value}}",
        },
        position: {
          content: "Position : {{value}}",
        },
        color: {
          content: "Couleur : {{value}}",
        },
        isActive: {
          content: "Actif : {{value}}",
        },
        useCount: {
          content: "Utilisations : {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de favori invalide",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour voir ce favori",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas l'autorisation de voir ce favori",
        },
        notFound: {
          title: "Introuvable",
          description: "Favori introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger le favori",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
        conflict: {
          title: "Conflit",
          description:
            "Un conflit est survenu lors du traitement de votre demande",
        },
      },
      success: {
        title: "Succès",
        description: "Favori chargé",
      },
    },
    patch: {
      title: "Mettre à jour le favori",
      description: "Mettre à jour une configuration favorite existante",
      container: {
        title: "Modifier le favori",
      },
      backButton: {
        label: "Retour au favori",
      },
      deleteButton: {
        label: "Supprimer le favori",
      },
      viewSkillButton: {
        label: "Voir la compétence",
      },
      useThisSkillButton: {
        label: "Utiliser cette compétence",
      },
      useThisModelButton: {
        label: "Utiliser ce modèle",
      },
      currentlyActiveButton: {
        label: "Actif en ce moment",
      },
      signupPrompt: {
        title: "Personnalisez la personnalité de la compétence",
        description:
          "Modifiez le prompt système et le comportement de la compétence. Inscrivez-vous pour commencer.",
        backButton: "Retour",
        signupButton: "Créer un compte",
        loginButton: "Se connecter",
      },
      saveButton: {
        label: "Enregistrer",
        loadingText: "Enregistrement...",
      },
      saveAndUseButton: {
        label: "Enregistrer et utiliser",
        loadingText: "Enregistrement et activation...",
      },
      id: {
        label: "ID du favori",
      },
      skillId: {
        label: "Compétence",
        description:
          'ID de la compétence. Utilisez "skillSlug" pour la variante par défaut, "skillSlug__variantId" pour une variante précise.',
      },
      customVariantName: {
        label: "Nom de la variante",
        description:
          "Nom personnalisé pour cette variante (laissez vide pour garder celui de la compétence)",
      },
      chatModel: {
        label: "Modèle de chat",
        placeholder: "Hérité de la compétence",
      },
      voice: {
        label: "Voix de l'IA",
        description:
          "Remplace la voix TTS pour ce favori. null = votre réglage de voix global l'emporte (modèle passerelle : le réglage utilisateur est prioritaire). Renseignez-la ici pour donner une autre voix à ce favori précis.",
        placeholder: "Hérité de la compétence",
      },
      sttModel: {
        label: "Modèle de reconnaissance vocale",
        description:
          "Remplace le modèle STT pour ce favori. null = votre préférence STT globale l'emporte (modèle passerelle). À renseigner uniquement pour des besoins de transcription spécialisés.",
        placeholder: "Hérité de la compétence",
      },
      imageVisionModel: {
        label: "Modèle de vision d'images",
        description:
          "Remplace le LLM de vision d'images pour ce favori. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle). Renseignez-le pour imposer un modèle de vision précis.",
        placeholder: "Hérité de la compétence",
      },
      videoVisionModel: {
        label: "Modèle de vision vidéo",
        description:
          "Remplace le LLM de vision vidéo pour ce favori. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle).",
        placeholder: "Hérité de la compétence",
      },
      audioVisionModel: {
        label: "Modèle de vision audio",
        description:
          "Remplace le LLM de vision audio pour ce favori. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle).",
        placeholder: "Hérité de la compétence",
      },
      imageGenModel: {
        label: "Modèle de génération d'images",
        description:
          "Remplace le générateur d'images pour ce favori. null = imageGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire). Renseignez-le ici pour utiliser un autre générateur que celui de la compétence.",
        placeholder: "Hérité de la compétence",
      },
      musicGenModel: {
        label: "Modèle de génération musicale",
        description:
          "Remplace le générateur de musique pour ce favori. null = musicGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire).",
        placeholder: "Hérité de la compétence",
      },
      videoGenModel: {
        label: "Modèle de génération vidéo",
        description:
          "Remplace le générateur vidéo pour ce favori. null = videoGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire).",
        placeholder: "Hérité de la compétence",
      },
      mode: {
        label: "Mode de sélection",
      },
      modelSelection: {
        title: "Choix du modèle",
        label: "Choix du modèle",
        description:
          "Remplace le modèle pour cet emplacement. Utilisez des filtres ou choisissez un modèle précis. Passez null pour utiliser le modèle par défaut de la compétence.",
      },
      selectionType: {
        label: "Type de sélection",
        characterBased: "Selon la compétence",

        manual: "Modèle précis",
        filters: "Critères de filtre",
      },
      intelligence: {
        label: "Niveau d'intelligence",
      },
      minIntelligence: {
        label: "Intelligence minimale",
        description:
          "Niveau d'intelligence ou de capacité minimal exigé pour le modèle",
      },
      maxIntelligence: {
        label: "Intelligence maximale",
        description:
          "Niveau d'intelligence ou de capacité maximal autorisé pour le modèle",
      },
      minPrice: {
        label: "Prix minimal",
        description: "Coût minimal en crédits par message",
      },
      maxPrice: {
        label: "Prix max.",
      },
      minContent: {
        label: "Niveau de contenu minimal",
        description: "Niveau minimal de modération du contenu pour le modèle",
      },
      maxContent: {
        label: "Niveau de contenu maximal",
        description: "Niveau maximal de modération du contenu pour le modèle",
      },
      content: {
        label: "Niveau de contenu",
      },
      preferredStrengths: {
        label: "Points forts privilégiés",
        description: "Capacités et points forts du modèle à privilégier",
      },
      ignoredWeaknesses: {
        label: "Points faibles ignorés",
        description: "Points faibles du modèle à ignorer ou à tolérer",
      },
      manualModelId: {
        label: "Modèle manuel",
      },
      isActive: {
        label: "Actif",
      },
      position: {
        label: "Position",
      },
      color: {
        label: "Couleur",
        description: "Couleur personnalisée pour ce favori",
      },
      customIcon: {
        label: "Icône personnalisée",
        description: "Icône personnalisée pour ce favori",
      },
      icon: {
        label: "Icône personnalisée",
        description:
          "Remplace l'icône par défaut de la compétence pour cet emplacement favori",
      },
      availableTools: {
        label: "Outils autorisés",
        description:
          "Remplace les outils autorisés pour cet emplacement. Chaque entrée a besoin d'un toolId (utilisez system_help_GET pour découvrir les ID d'outils disponibles). Mettez requiresConfirmation: true pour demander confirmation avant l'exécution. Passez null pour reprendre les réglages de la compétence ou les réglages globaux.",
      },
      pinnedTools: {
        label: "Outils épinglés",
        description:
          "Remplace les outils épinglés dans la barre d'outils pour cet emplacement. Passez null pour reprendre les réglages de la compétence ou les réglages globaux.",
      },
      deniedTools: {
        label: "Outils bloqués",
        description:
          "Bloque des outils précis pour cet emplacement, en plus de la liste de blocage de la compétence. Ces outils ne peuvent pas être appelés, quels que soient les autres réglages.",
        clearAll: "Tout effacer",
        noToolsFound: "Aucun outil trouvé",
        blockedNote:
          "Les outils bloqués ne peuvent pas être appelés, quels que soient les autres réglages.",
        searchPlaceholder: "Rechercher des outils...",
        blocked: "bloqué",
      },
      promptAppend: {
        label: "Ajout au prompt",
        description:
          "Instructions supplémentaires ajoutées au prompt système de la compétence, pour cet emplacement uniquement. Idéal pour personnaliser sans modifier la compétence partagée. Agents IA : renseignez le nom de l'utilisateur, sa langue préférée, son niveau technique, son domaine (ex. « Je m'appelle Max. Je préfère TypeScript et bun. Réponds en français. »).",
        placeholder:
          "ex. Je m'appelle Alex. Je préfère des réponses concises en français.",
      },
      compactTrigger: {
        label: "Seuil de compaction (tokens)",
        description:
          "Remplace le nombre de tokens qui déclenche la compaction de la conversation pour cet emplacement. Passez null pour reprendre la valeur de la compétence ou la valeur globale.",
      },
      memoryLimit: {
        label: "Limite de mémoire (tokens)",
        description:
          "Remplace le nombre total maximal de tokens de mémoire injectés à chaque tour pour cet emplacement. Passez null pour reprendre la valeur de la compétence ou la valeur globale.",
      },
      changeSkill: {
        label: "Changer de compétence",
      },
      modifySkill: {
        label: "Modifier la compétence",
      },
      response: {
        success: {
          content: "Mis à jour : {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez votre saisie et réessayez",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour modifier ce favori",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas l'autorisation de modifier ce favori",
        },
        notFound: {
          title: "Introuvable",
          description: "Favori introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de mettre à jour le favori",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
        conflict: {
          title: "Conflit",
          description:
            "Un conflit est survenu lors de la mise à jour du favori",
        },
      },
      slotOverride: {
        label: "Remplacer pour cet emplacement",
      },
      globalDefault: {
        label: "Mon réglage par défaut (repli)",
      },
      success: {
        title: "Succès",
        description: "Favori mis à jour",
      },
    },
    delete: {
      title: "Supprimer le favori",
      description: "Retirer une configuration favorite",
      container: {
        title: "Supprimer le favori",
        description: "Supprimer définitivement cette configuration favorite",
      },
      backButton: {
        label: "Annuler",
      },
      actions: {
        delete: "Supprimer le favori",
        deleting: "Suppression du favori",
      },
      id: {
        label: "ID du favori",
        description: "Le slug ou l'ID lisible du favori à supprimer",
      },
      response: {
        success: {
          content: "Supprimé : {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de favori invalide",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour supprimer ce favori",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas l'autorisation de supprimer ce favori",
        },
        notFound: {
          title: "Introuvable",
          description: "Favori introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de supprimer le favori",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
        conflict: {
          title: "Conflit",
          description: "Impossible de supprimer le favori à cause d'un conflit",
        },
      },
      success: {
        title: "Succès",
        description: "Favori supprimé",
      },
    },
  },
  category: "Chat",
  tags: {
    favorites: "Favoris",
  },
  active: "Actif",
  fallbacks: {
    unknownSkill: "Compétence inconnue",
    unknownModel: "Modèle inconnu",
    unknown: "Inconnu",
    unknownProvider: "inconnu",
    noTagline: "",
    noDescription: "",
    zeroCredits: "0 crédit",
    noModelConfiguration: "Erreur : aucune configuration de modèle",
    configurationMissing: "Configuration manquante",
    noModel: "Aucun modèle",
    dash: "-",
  },
  enums: {
    selectionType: {
      characterBased: "Selon la compétence",
      manual: "Modèle précis",
      filters: "Critères de filtre",
    },
    mode: {
      auto: "Auto",
      manual: "Manuel",
    },
    intelligence: {
      any: "Tous",
      quick: "Rapide",
      smart: "Malin",
      brilliant: "Brillant",
    },
    price: {
      any: "Tous",
      cheap: "Économique",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      any: "Tous",
      mainstream: "Grand public",
      open: "Ouvert",
      uncensored: "Non censuré",
    },
    variantsMode: {
      all: "Toutes les variantes",
      some: "Certaines variantes",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Trier par niveau d'intelligence",
      price: "Trier par prix",
      content: "Trier par politique de contenu",
    },
    sortDirection: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    sortField: {
      intelligence: "Intelligence",
      price: "Prix",
      content: "Contenu",
    },
  },
  get: {
    title: "Afficher les favoris",
    titleShort: "Favoris",
    description:
      "Récupérer toutes vos configurations de compétences enregistrées en favori",
    userId: {
      label: "ID utilisateur",
      description:
        "Admin uniquement : récupérer les favoris d'un utilisateur précis. Laissez vide pour récupérer les vôtres.",
    },
    fields: {
      query: {
        label: "Rechercher",
        description:
          "Rechercher des favoris par nom, accroche ou ID de compétence.",
      },
      page: {
        label: "Page",
        description:
          "Numéro de page des résultats paginés (IA/MCP : 25 par page par défaut).",
      },
      pageSize: {
        label: "Taille de page",
        description:
          "Nombre de favoris par page (de 1 à 500). Par défaut 25 pour les appels IA/MCP ; les appels humains renvoient tout.",
      },
    },
    actions: {
      menu: "Options",
      share: "Partager et gagner",
      addAi: "Ajouter une IA",
      edit: "Modifier",
      active: "Actif",
      reorder: "Glisser pour réordonner",
      moveUp: "Monter",
      moveDown: "Descendre",
      showMore: "{{count}} modèles de plus",
      showLess: "Afficher moins",
      settings: "Paramètres du chat",
    },
    addVariant: "Ajouter un autre modèle",
    viewSkill: "Détails",
    deleteVariant: "Retirer ce modèle ?",
    deleteVariantAction: "Retirer",
    deleteGroup: {
      trigger: "Retirer la compétence",
      confirm: "Retirer cette compétence et ses {{count}} modèles ?",
      cancel: "Annuler",
      action: "Retirer",
    },
    emptyState:
      "Aucune compétence pour l'instant. Choisissez-en une pour commencer à discuter.",
    tabs: {
      myFavorites: "Mes Skills",
      browseSkills: "Parcourir les Skills",
    },
    sections: {
      companion: "Compagnons",
      skills: "Skills",
      model: "Modèles bruts",
      background: "Agents en arrière-plan",
    },
    container: {
      title: "Vos Skills",
      description:
        "Gérez vos configurations favorites de compétences et de modèles",
    },
    createButton: {
      label: "Explorer les Skills",
    },
    response: {
      favorite: {
        title: "Configuration favorite",
        id: {
          content: "ID : {{value}}",
        },
        skillId: {
          content: "Compétence : {{value}}",
        },
        customVariantName: {
          content: "Nom de la variante : {{value}}",
        },
        customIcon: {
          content: "Icône personnalisée : {{value}}",
        },
        voice: {
          content: "Voix : {{value}}",
        },
        mode: {
          content: "Mode : {{value}}",
        },
        intelligence: {
          content: "Intelligence : {{value}}",
        },
        modelSelection: {
          title: "Choix du modèle",
        },
        selectionType: {
          content: "Type de sélection : {{value}}",
        },
        minIntelligence: {
          content: "Intelligence min. : {{value}}",
        },
        maxIntelligence: {
          content: "Intelligence max. : {{value}}",
        },
        minPrice: {
          content: "Prix min. : {{value}}",
        },
        maxPrice: {
          content: "Prix max. : {{value}}",
        },
        minContent: {
          content: "Niveau de contenu min. : {{value}}",
        },
        maxContent: {
          content: "Niveau de contenu max. : {{value}}",
        },
        content: {
          content: "Niveau de contenu : {{value}}",
        },
        preferredStrengths: {
          content: "Points forts privilégiés : {{value}}",
        },
        ignoredWeaknesses: {
          content: "Points faibles ignorés : {{value}}",
        },
        manualModelId: {
          content: "Modèle manuel : {{value}}",
        },
        position: {
          content: "Position : {{value}}",
        },
        color: {
          content: "Couleur : {{value}}",
        },
        isActive: {
          content: "Actif : {{value}}",
        },
        useCount: {
          content: "Utilisations : {{value}}",
        },
        separator: {
          content: "•",
        },
      },
      hasCompanion: {
        content: "Avec compagnon : {{value}}",
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
        description: "Vous devez être connecté pour voir vos favoris",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation d'accéder à cette ressource",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun favori trouvé",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les favoris",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vos modifications non enregistrées seront perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit est survenu lors du traitement de votre demande",
      },
    },
    success: {
      title: "Succès",
      description: "Favoris chargés",
    },
  },
  post: {
    title: "Créer un favori",
    description: "Créer une nouvelle configuration de compétence favorite",
    container: {
      title: "Nouveau favori",
      description: "Enregistrer une configuration de compétence en favori",
    },
    backButton: {
      label: "Annuler",
    },
    useWithoutSavingButton: {
      label: "Utiliser sans ajouter aux favoris",
      loadingText: "Application...",
    },
    submitButton: {
      label: "Ajouter aux favoris",
      loadingText: "Ajout...",
    },
    skillId: {
      label: "Compétence",
      description: "Choisissez la compétence de ce favori",
    },
    customVariantName: {
      label: "Nom de la variante",
      description:
        "Nom personnalisé pour cette variante (laissez vide pour garder celui de la compétence)",
    },
    customIcon: {
      label: "Icône personnalisée",
      description: "Icône personnalisée facultative pour ce favori",
    },
    voice: {
      label: "Voix",
      description: "Voix préférée pour la synthèse vocale",
    },
    mode: {
      label: "Mode de sélection",
      description: "Comment choisir le modèle",
    },
    modelSelection: {
      title: "Choix du modèle",
      description:
        "Choisissez comment sélectionner le modèle d'IA : un modèle précis, ou un choix automatique selon des filtres",
    },
    selectionType: {
      label: "Type de sélection",
      manual: "Modèle précis",
      filters: "Critères de filtre",
    },
    intelligence: {
      label: "Niveau d'intelligence",
      description: "Niveau d'intelligence minimal requis",
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
        "Niveau d'intelligence ou de capacité minimal exigé pour le modèle",
    },
    maxIntelligence: {
      label: "Intelligence maximale",
      description:
        "Niveau d'intelligence ou de capacité maximal autorisé pour le modèle",
    },
    priceRange: {
      label: "Fourchette de prix",
      description: "Fourchette de coût en crédits par message",
      minLabel: "Prix min.",
      maxLabel: "Prix max.",
    },
    minPrice: {
      label: "Prix minimal",
      description: "Coût minimal en crédits par message",
    },
    maxPrice: {
      label: "Prix max.",
      description: "Gamme de prix maximale à utiliser",
    },
    contentRange: {
      label: "Plage de contenu",
      description: "Plage de niveaux de modération du contenu",
      minLabel: "Contenu min.",
      maxLabel: "Contenu max.",
    },
    minContent: {
      label: "Niveau de contenu minimal",
      description: "Niveau minimal de modération du contenu pour le modèle",
    },
    maxContent: {
      label: "Niveau de contenu maximal",
      description: "Niveau maximal de modération du contenu pour le modèle",
    },
    content: {
      label: "Niveau de contenu",
      description: "Niveau de modération du contenu",
    },
    preferredStrengths: {
      label: "Points forts privilégiés",
      description: "Capacités et points forts du modèle à privilégier",
    },
    ignoredWeaknesses: {
      label: "Points faibles ignorés",
      description: "Points faibles du modèle à ignorer ou à tolérer",
    },
    manualModelId: {
      label: "Modèle manuel",
      description: "Modèle précis à utiliser (en mode manuel)",
    },
    response: {
      id: {
        content: "Favori créé avec l'ID : {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour ajouter des favoris",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de créer des favoris",
      },
      notFound: {
        title: "Introuvable",
        description:
          "L'élément que vous voulez ajouter aux favoris n'existe pas",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'ajouter aux favoris",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vos modifications non enregistrées seront perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Ce favori existe déjà",
      },
    },
    success: {
      title: "Succès",
      description: "Favori créé",
    },
  },
  reorder: {
    post: {
      title: "Réordonner les favoris",
      description: "Modifier l'ordre de vos configurations favorites",
      errors: {
        validation: {
          title: "Ordre invalide",
          description: "Vérifiez l'ordre choisi et réessayez",
        },
        network: {
          title: "Erreur de connexion",
          description: "Impossible d'enregistrer le nouvel ordre. Réessayez.",
        },
        unauthorized: {
          title: "Connexion requise",
          description: "Connectez-vous pour réordonner vos favoris",
        },
        forbidden: {
          title: "Autorisation refusée",
          description:
            "Vous n'avez pas l'autorisation de réordonner les favoris",
        },
        notFound: {
          title: "Favoris introuvables",
          description: "Impossible de trouver les favoris à réordonner",
        },
        server: {
          title: "Un problème est survenu",
          description: "Impossible d'enregistrer le nouvel ordre. Réessayez.",
        },
        unknown: {
          title: "Erreur inattendue",
          description: "Un imprévu s'est produit. Réessayez.",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications ne sont pas encore enregistrées",
        },
        conflict: {
          title: "Conflit d'ordre",
          description: "L'ordre a changé. Actualisez la page et réessayez.",
        },
      },
      success: {
        title: "Ordre enregistré",
        description: "Vos favoris ont été réordonnés",
      },
    },
  },
};
