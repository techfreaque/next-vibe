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

  post: {
    title: "Créer un favori",
    titleShort: "Ajouter un favori",
    description: "Créer une nouvelle configuration de compétence favorite",
    container: {
      title: "Nouveau favori",
      description: "Enregistrer une configuration de compétence comme favori",
    },
    backButton: {
      label: "Retour aux favoris",
    },
    submitButton: {
      label: "Créer le favori",
      loadingText: "Création...",
    },
    useWithoutSavingButton: {
      label: "Utiliser sans enregistrer",
      loadingText: "Application...",
    },
    skillId: {
      label: "Compétence",
      description:
        'ID de la compétence au format fusionné : "skillSlug" pour la variante par défaut, "skillSlug__variantId" pour une variante précise (ex. "thea__brilliant"). Lancez skills pour voir les ID disponibles.',
    },
    customVariantName: {
      label: "Libellé",
      description:
        "Nom personnalisé pour cette variante (laisser vide pour utiliser celui de la compétence)",
    },
    customIcon: {
      label: "Icône personnalisée",
      description: "Icône personnalisée facultative pour ce favori",
    },
    chatModel: {
      label: "Modèle de chat",
      placeholder: "Comme la compétence",
    },
    voice: {
      label: "Voix",
      description:
        "Voix TTS spécifique à ce favori. null = votre réglage de voix global l'emporte (modèle passerelle : le réglage utilisateur est prioritaire). Renseignez-la pour donner une voix différente à ce favori.",
      placeholder: "Comme la compétence",
    },
    sttModel: {
      label: "Modèle de transcription vocale",
      description:
        "Modèle STT spécifique. null = votre préférence STT globale l'emporte (modèle passerelle). À renseigner uniquement pour des besoins de transcription particuliers.",
      placeholder: "Comme la compétence",
    },
    imageVisionModel: {
      label: "Modèle de vision d'image",
      description:
        "LLM de vision d'image spécifique. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle).",
      placeholder: "Comme la compétence",
    },
    videoVisionModel: {
      label: "Modèle de vision vidéo",
      description:
        "LLM de vision vidéo spécifique. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle).",
      placeholder: "Comme la compétence",
    },
    audioVisionModel: {
      label: "Modèle de vision audio",
      description:
        "LLM de vision audio spécifique. null = la préférence globale de l'utilisateur l'emporte (modèle passerelle).",
      placeholder: "Comme la compétence",
    },
    imageGenModel: {
      label: "Modèle de génération d'images",
      description:
        "Générateur d'images spécifique. null = imageGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire). Renseignez-le pour utiliser un autre générateur que celui de la compétence.",
      placeholder: "Comme la compétence",
    },
    musicGenModel: {
      label: "Modèle de génération musicale",
      description:
        "Générateur de musique spécifique. null = musicGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire).",
      placeholder: "Comme la compétence",
    },
    videoGenModel: {
      label: "Modèle de génération vidéo",
      description:
        "Générateur de vidéos spécifique. null = videoGenModelSelection de la compétence l'emporte (génération de médias : la compétence est prioritaire).",
      placeholder: "Comme la compétence",
    },
    mode: {
      label: "Mode de sélection",
      description: "Comment le modèle doit être choisi",
    },
    modelSelection: {
      title: "Sélection du modèle",
      label: "Sélection du modèle",
      description:
        "Remplace le modèle pour cet emplacement. Utilisez des filtres ou choisissez un modèle précis. Passez null pour utiliser le modèle par défaut de la compétence.",
    },
    selectionType: {
      label: "Type de sélection",
      characterBased: "Selon la compétence",
      manual: "Modèle précis",
      filters: "Critères de filtrage",
    },
    intelligence: {
      label: "Niveau d'intelligence",
      description: "Niveau d'intelligence minimum requis",
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
      description: "Coût minimum en crédits par message",
    },
    maxPrice: {
      label: "Prix max.",
      description: "Palier de prix maximum à utiliser",
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
    content: {
      label: "Niveau de contenu",
      description: "Niveau de modération du contenu",
    },
    preferredStrengths: {
      label: "Points forts recherchés",
      description: "Capacités et points forts du modèle à privilégier",
    },
    ignoredWeaknesses: {
      label: "Points faibles ignorés",
      description: "Points faibles du modèle à ignorer ou à tolérer",
    },
    manualModelId: {
      label: "Modèle manuel",
      description: "Modèle précis à utiliser (mode manuel)",
    },
    icon: {
      label: "Icône personnalisée",
      description:
        "Remplace l'icône par défaut de la compétence pour cet emplacement favori",
    },
    compactTrigger: {
      label: "Seuil de compactage (tokens)",
      description:
        "Remplace le nombre de tokens qui déclenche le compactage de la conversation. Passez null pour reprendre la valeur de la compétence ou la valeur globale.",
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
    changeSkill: {
      label: "Changer de compétence",
    },
    modifySkill: {
      label: "Modifier la compétence",
    },
    character: {
      name: "Nom",
      tagline: "Accroche",
      description: "Description",
    },
  },
};
