import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    music: "Musique",
    generation: "Génération",
    ai: "IA",
  },
  post: {
    title: "Générer de la musique",
    titleShort: "Générer de la musique",
    dynamicTitle: "Musique : {{prompt}}",
    description:
      "Génère de la musique à partir d'un prompt texte. Utilisez l'outil models avec modelType=audio pour voir les modèles musicaux disponibles. Passez l'id d'un modèle pour en choisir un précis, ou laissez vide pour le modèle par défaut de l'utilisateur. Vous pouvez aussi passer inputMediaUrl pour un transfert de style audio vers audio. Renvoie audioUrl et durationSeconds.",
    form: {
      title: "Génération musicale",
      description: "Saisissez un prompt pour générer de la musique",
    },
    prompt: {
      label: "Prompt",
      description: "Décrivez la musique que vous voulez générer",
      placeholder:
        "Musique électronique entraînante avec une mélodie accrocheuse...",
    },
    model: {
      label: "Modèle",
      description:
        "Id du modèle de génération musicale. Laissez vide pour le défaut de l'utilisateur. Utilisez l'outil models (modelType=audio) pour parcourir les modèles disponibles.",
    },
    duration: {
      label: "Durée",
      description: "Durée de l'extrait audio généré",
      short: "Court (~8 s)",
      medium: "Moyen (~20 s)",
      long: "Long (~30 s)",
    },
    inputMediaUrl: {
      label: "URL de l'audio de référence",
      description:
        "URL audio pour un transfert de style ou un remix. Le modèle s'en sert comme point de départ. Fonctionne uniquement avec les modèles qui acceptent un audio en entrée.",
      placeholder: "https://example.com/audio.mp3",
    },
    download: "Télécharger",
    separator: "·",
    backButton: {
      label: "Retour",
    },
    submitButton: {
      text: "Générer la musique",
      label: "Générer la musique",
      loadingText: "Génération...",
    },
    response: {
      audioUrl: "URL de l'audio généré",
      creditCost: "Crédits utilisés",
      durationSeconds: "Durée en secondes",
      jobId: "ID de la tâche asynchrone",
    },
    errors: {
      referenceUnavailable:
        "L'audio de référence n'est pas disponible. Il a été supprimé, ou il appartient à une discussion que vous ne pouvez pas ouvrir. Utilisez un audio de cette discussion ou renvoyez-le.",
      validation_failed: {
        title: "Erreur de validation",
        description: "Vérifiez votre prompt et vos réglages",
      },
      network_error: {
        title: "Erreur réseau",
        description: "Impossible de joindre le service de génération musicale",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour générer de la musique",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas la permission d'utiliser cette fonctionnalité",
      },
      not_found: {
        title: "Introuvable",
        description: "Le modèle demandé est introuvable",
      },
      server_error: {
        title: "Erreur serveur",
        description:
          "Une erreur inattendue s'est produite pendant la génération musicale",
      },
      unknown_error: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsaved_changes: {
        title: "Modifications non enregistrées",
        description: "Enregistrez vos modifications avant de générer",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant la génération musicale",
      },
      noModelConfigured:
        "Aucun modèle musical configuré. Définissez-en un dans les réglages de votre favori.",
      notAnAudioModel:
        "Le modèle choisi ne génère pas de musique. Choisissez un modèle musical.",
      notConfigured:
        "{{label}} n'est pas configuré. Ajoutez {{envKey}} à votre fichier .env. Obtenez votre clé sur {{url}}",
      providerUnsupported: "{{label}} n'est pas encore pris en charge",
      insufficientCredits:
        "Crédits insuffisants. Solde : {{balance}}, requis : {{minimum}}",
      balanceCheckFailed: "Impossible de vérifier votre solde de crédits",
      unsupportedDuration:
        "Le modèle {{model}} ne prend pas en charge la durée {{duration}}. Durées prises en charge : {{supported}}",
      generationFailed: "Échec de la génération musicale",
      providerError: "Erreur du fournisseur de musique : {{error}}",
      noAudioUrl: "Le fournisseur n'a renvoyé aucune URL audio",
      creditsFailed:
        "Impossible de déduire les crédits de la génération musicale",
      apiKeyNotConfigured: "Clé API non configurée",
      externalServiceError: "Erreur du service externe : {{message}}",
      requestAborted: "La requête a été interrompue",
      requestTimedOut: "Délai dépassé en attendant la génération musicale",
      requestFailed: "Échec de la requête : {{message}}",
      pollFailed: "La requête de suivi a échoué avec le statut {{status}}",
    },
    success: {
      title: "Musique générée",
      description: "Votre musique a bien été générée",
    },
  },
  models: {
    names: {
      MUSICGEN_STEREO: "MusicGen Stereo",
      MUSIC_GEN: "ModelsLab Music Gen",
      ELEVENLABS_MUSIC: "ElevenLabs Music",
      CASSETTE_MUSIC: "CassetteAI Music",
      SONAUTO_SONG: "Sonauto Song",
      LYRIA_3: "Lyria 3",
      LYRIA_3_PRO_PREVIEW: "Lyria 3 Pro Preview",
      LYRIA_3_CLIP_PREVIEW: "Lyria 3 Clip Preview",
    },
  },
};
