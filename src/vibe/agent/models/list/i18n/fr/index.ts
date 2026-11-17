import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    models: "Modèles",
  },
  endpointCategories: {
    ai: "IA",
  },
  enums: {
    modelType: {
      text: "Texte",
      image: "Image",
      video: "Vidéo",
      audio: "Audio",
    },
    content: {
      mainstream: "Grand public",
      open: "Ouvert",
      uncensored: "Non censuré",
    },
    intelligence: {
      quick: "Rapide",
      smart: "Intelligent",
      brilliant: "Brillant",
    },
  },
  get: {
    title: "Modèles",
    titleShort: "Modèles d'IA",
    description:
      "Parcourir tous les modèles d'IA. Filtrer par type (text/image/video/audio), niveau de contenu, intelligence. Pour les modèles vidéo : supportedDurations liste les durées de clip valides en secondes, supportedAspectRatios liste les formats valides, supportedFrameImages indique les images d'entrée acceptées (first_frame = image vers vidéo, last_frame = animer vers une image finale), allowedPassthroughParameters liste les options supplémentaires acceptées par le modèle (ex. negative_prompt, cfg_scale), generateAudio indique que le modèle produit l'audio dans la vidéo. Passez l'id du modèle comme paramètre model lors de l'appel à generate_video.",
    dynamicTitle: "{{count}} modèles",

    fields: {
      query: {
        label: "Recherche",
        description:
          "Filtrer les modèles par nom, fournisseur ou capacité (ex. 'coding', 'uncensored', 'image', 'fast').",
        placeholder: "ex. GPT, Gemini, code, non censuré…",
      },
      modelType: {
        label: "Type",
        description:
          "Filtrer par type de modèle : text (chat/LLM), image (génération d'images), video, ou audio (TTS/STT/musique). Laisser vide pour tous les types.",
        placeholder: "Tous les types",
      },
      contentLevel: {
        label: "Niveau de contenu",
        description:
          "Filtrer par politique de contenu. Mainstream = filtres de sécurité standard. Open = moins de restrictions. Uncensored = aucun filtre.",
        placeholder: "Tous les niveaux de contenu",
      },
      intelligence: {
        label: "Intelligence",
        description:
          "Niveau d'intelligence minimum. Quick = rapide et efficace. Smart = qualité équilibrée. Brilliant = raisonnement profond.",
        placeholder: "Toute intelligence",
      },
      page: {
        label: "Page",
        description: "Numéro de page pour la pagination (commence à 1).",
      },
      pageSize: {
        label: "Taille de page",
        description: "Nombre de modèles par page (50 par défaut, 200 max).",
      },
    },

    response: {
      models: "Modèles",
      totalCount: "Total",
      matchedCount: "Correspondants",
      currentPage: "Page",
      totalPages: "Pages",
      hint: "Astuce",
      model: {
        id: "ID du modèle",
        name: "Nom",
        provider: "Fournisseur",
        type: "Type",
        description: "Description",
        contextWindow: "Contexte",
        parameterCount: "Paramètres",
        intelligence: "Intelligence",
        content: "Contenu",
        price: "Prix (crédits)",
        supportsTools: "Outils",
        utilities: "Capacités",
        inputs: "Entrées",
        outputs: "Sorties",
        supportedDurations: "Durées (s)",
        supportedAspectRatios: "Formats d'image",
        supportedResolutions: "Résolutions",
        supportedFrameImages: "Types d'images d'entrée",
        generateAudio: "Génère l'audio",
        supportedSizes: "Tailles exactes",
        allowedPassthroughParameters: "Paramètres supplémentaires",
      },
    },

    errors: {
      server: {
        title: "Erreur serveur",
        description:
          "Impossible de récupérer la liste des modèles. Veuillez réessayer.",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion a échoué. Vérifiez votre connexion.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite.",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de filtre invalides.",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir les modèles.",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas la permission d'accéder à cette ressource.",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun modèle trouvé.",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de requête.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées.",
      },
    },

    success: {
      title: "Modèles chargés",
      description: "Liste des modèles d'IA récupérée.",
    },

    browser: {
      supportsTools: "✓ outils",
      noModels: "Aucun modèle ne correspond à vos filtres.",
      allLabel: "Tous",
      statsLabel: "{{matched}} modèles sur {{total}}",
      free: "Gratuit",
      credits: "~{{cost}} cr",
      ctx: "ctx",
    },
  },
};
