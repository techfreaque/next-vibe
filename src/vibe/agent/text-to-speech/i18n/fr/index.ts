// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/fr";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    speech: "Voix",
    tts: "Synthèse vocale",
    ai: "IA",
  },

  post: {
    title: "Synthèse vocale",
    titleShort: "Synthèse vocale",
    dynamicTitle: "Voix : {{text}}",
    description:
      "Convertit du texte en voix. Passez le texte et un identifiant de voix. Utilisez l'outil models (modelType=audio) pour voir les modèles de voix disponibles. Chacun a un identifiant unique à passer dans le paramètre voice. Coût : par caractère, au tarif propre à la voix choisie (voir l'outil models). Renvoie audioUrl.",
    form: {
      title: "Conversion texte vers voix",
      description: "Saisissez le texte à convertir en voix",
    },
    text: {
      label: "Texte",
      description: "Texte à convertir en voix (5000 caractères max.)",
      placeholder: "Saisissez le texte à faire lire...",
    },
    voice: {
      label: "Voix",
      description:
        "Identifiant du modèle de voix. Utilisez l'outil models (modelType=audio) pour parcourir les voix disponibles et leurs identifiants.",
    },
    download: "Télécharger",
    response: {
      title: "Résultat audio",
      description: "L'audio généré",
      success: "Succès",
      audioUrl: "URL de l'audio",
      creditCost: "Crédits utilisés",
    },
    submitButton: {
      label: "Faire lire",
      loadingText: "Synthèse en cours...",
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
      noTtsProviderConfigured:
        "Aucun fournisseur de synthèse vocale configuré. Ajoutez OPENAI_API_KEY, EDEN_AI_API_KEY ou ELEVENLABS_API_KEY, ou connectez un fournisseur d'inférence système.",
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
        "Crédits insuffisants pour cette conversion. Solde : {{balance}}, minimum requis : {{minimum}}. Rechargez pour continuer",
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
        "OpenAI Alloy : voix équilibrée et neutre pour les contenus professionnels",
      openaiNova:
        "OpenAI Nova : voix chaleureuse et amicale, idéale pour la conversation",
      openaiOnyx: "OpenAI Onyx : voix grave et posée pour les contenus formels",
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
    names: modelTranslations.names,
  },
};

export default translations;
