import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    titleShort: "Favori",
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
    titleShort: "Mettre à jour le favori",
    description: "Mettre à jour une configuration favorite existante",
    container: {
      title: "Modifier la configuration",
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
    reportButton: {
      label: "Signaler",
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
      label: "Libellé",
      description:
        "Nom personnalisé pour cette variante (laissez vide pour garder celui de la compétence)",
    },
    chatModel: {
      label: "Modèle de chat",
      placeholder: "Comme la compétence",
    },
    voice: {
      label: "Voix de l'IA",
      description:
        "Remplace la voix TTS pour ce favori. null = votre réglage de voix global l'emporte (modèle passerelle : le réglage utilisateur est prioritaire). Renseignez-la ici pour donner une autre voix à ce favori précis.",
      placeholder: "Comme la compétence",
    },
    sttModel: {
      label: "Modèle de reconnaissance vocale",
      description:
        "Remplace le modèle STT pour ce favori. null = votre préférence STT globale l'emporte (modèle passerelle). À renseigner uniquement pour des besoins de transcription spécialisés.",
      placeholder: "Comme la compétence",
    },
    imageVisionModel: {
      label: "Modèle de vision d'images",
      description:
        "Remplace le LLM de vision d'images pour ce favori. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle). Renseignez-le pour imposer un modèle de vision précis.",
      placeholder: "Comme la compétence",
    },
    videoVisionModel: {
      label: "Modèle de vision vidéo",
      description:
        "Remplace le LLM de vision vidéo pour ce favori. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle).",
      placeholder: "Comme la compétence",
    },
    audioVisionModel: {
      label: "Modèle de vision audio",
      description:
        "Remplace le LLM de vision audio pour ce favori. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle).",
      placeholder: "Comme la compétence",
    },
    imageGenModel: {
      label: "Modèle de génération d'images",
      description:
        "Remplace le générateur d'images pour ce favori. null = imageGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire). Renseignez-le ici pour utiliser un autre générateur que celui de la compétence.",
      placeholder: "Comme la compétence",
    },
    musicGenModel: {
      label: "Modèle de génération musicale",
      description:
        "Remplace le générateur de musique pour ce favori. null = musicGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire).",
      placeholder: "Comme la compétence",
    },
    videoGenModel: {
      label: "Modèle de génération vidéo",
      description:
        "Remplace le générateur vidéo pour ce favori. null = videoGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire).",
      placeholder: "Comme la compétence",
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
        description: "Un conflit est survenu lors de la mise à jour du favori",
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
    titleShort: "Supprimer le favori",
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
};
