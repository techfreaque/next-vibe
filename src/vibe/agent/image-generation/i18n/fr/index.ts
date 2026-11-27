// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/fr";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "Image",
    generation: "Génération",
    ai: "IA",
  },
  post: {
    title: "Générer une image",
    titleShort: "Générer une image",
    dynamicTitle: "Image : {{prompt}}",
    description:
      "Génère une image à partir d'un prompt texte. Utilisez l'outil models avec modelType=image pour voir les modèles disponibles et leurs capacités. Passez l'id d'un modèle pour en choisir un précis, ou laissez vide pour le modèle par défaut de l'utilisateur. Passez aspectRatio (ex. 16:9) pour une sortie paysage ou portrait. Vous pouvez aussi passer inputMediaUrl pour une génération image vers image (l'URL sert de référence ou de point de départ). Renvoie imageUrl ainsi que la largeur, la hauteur et le outputAspectRatio réels du fichier.",
    form: {
      title: "Génération d'image",
      description: "Saisissez un prompt pour générer une image",
    },
    prompt: {
      label: "Prompt",
      description: "Décrivez l'image que vous voulez générer",
      placeholder:
        "Un coucher de soleil sur un lac de montagne, photoréaliste...",
    },
    model: {
      label: "Modèle",
      description:
        "Id du modèle de génération d'images. Laissez vide pour le défaut de l'utilisateur. Utilisez l'outil models (modelType=image) pour parcourir les modèles disponibles.",
    },
    approxCost: "~crédits",
    size: {
      label: "Taille",
      description: "Choisissez les dimensions de l'image",
      square1024: "Carré (1024×1024)",
      landscape1792: "Paysage (1792×1024)",
      portrait1792: "Portrait (1024×1792)",
    },
    quality: {
      label: "Qualité",
      description: "Choisissez la qualité de l'image",
      standard: "Standard",
      hd: "HD",
    },
    aspectRatio: {
      label: "Format",
      description:
        "Format de sortie : 16:9 ou 21:9 paysage, 9:16 portrait, 4:3, 3:4, 3:2, 2:3, 1:1. Laissez vide pour un carré. Chaque modèle reçoit le format le plus proche qu'il prend en charge ; le résultat indique la largeur, la hauteur et le format réels, décrivez donc l'image d'après ces valeurs, jamais d'après ce que vous avez demandé.",
    },
    inputMediaUrl: {
      label: "URL de l'image de référence",
      description:
        "URL d'image pour la génération image vers image. Le modèle modifie ou restyle cette image. Fonctionne uniquement avec les modèles qui acceptent une image en entrée.",
      placeholder: "https://example.com/image.jpg",
    },
    download: "Télécharger",
    dimensionSeparator: "×",
    backButton: {
      label: "Retour",
    },
    submitButton: {
      text: "Générer l'image",
      label: "Générer l'image",
      loadingText: "Génération...",
    },
    response: {
      imageUrl: "URL de l'image générée",
      creditCost: "Crédits utilisés",
      jobId: "ID de la tâche asynchrone",
      width: "Largeur (px)",
      height: "Hauteur (px)",
      outputAspectRatio: "Format",
    },
    errors: {
      referenceNotImage:
        "Le lien vers {{host}} ouvre une page web, pas un fichier image. Utilise un lien direct vers l'image (clic droit, copier l'adresse de l'image) ou importe l'image.",
      referenceUnreachable:
        "Le lien d'image vers {{host}} ne se charge pas (HTTP {{status}}). Vérifie le lien ou importe l'image. Rien ne t'a été facturé.",
      referenceUnavailable:
        "L'image de référence n'est pas disponible. Elle a été supprimée, ou elle appartient à une discussion que vous ne pouvez pas ouvrir. Utilisez une image de cette discussion ou renvoyez-la.",
      validation_failed: {
        title: "Erreur de validation",
        description: "Vérifiez votre prompt et vos réglages",
      },
      network_error: {
        title: "Erreur réseau",
        description: "Impossible de joindre le service de génération d'images",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour générer des images",
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
          "Une erreur inattendue s'est produite pendant la génération d'image",
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
        description: "Un conflit s'est produit pendant la génération d'image",
      },
      notAnImageModel:
        "Le modèle choisi ne génère pas d'images. Choisissez un modèle d'image.",
      notConfigured:
        "{{label}} n'est pas configuré. Ajoutez {{envKey}} à votre fichier .env. Obtenez votre clé sur {{url}}",
      providerUnavailable:
        "{{label}} est indisponible pour le moment. Choisissez un autre modèle sur {{url}}",
      insufficientCredits:
        "Crédits insuffisants. Solde : {{balance}}, requis : {{minimum}}",
      balanceCheckFailed: "Impossible de vérifier votre solde de crédits",
      unsupportedSize:
        "Le modèle {{model}} ne prend pas en charge la taille {{size}}. Tailles prises en charge : {{supported}}",
      unsupportedQuality:
        "Le modèle {{model}} ne prend pas en charge la qualité {{quality}}. Qualités prises en charge : {{supported}}",
      unsupportedAspectRatio:
        "Le modèle {{model}} ne prend pas en charge le format {{aspectRatio}}. Formats pris en charge : {{supported}}",
      modelNoReferenceImage:
        "Le modèle {{model}} n'accepte pas d'image de référence. Choisissez un modèle image vers image (dont les entrées incluent une image) pour utiliser une référence.",
      generationFailed: "Échec de la génération d'image",
      generationFailedWithReason: "Échec de la génération d'image : {{error}}",
      contentRejected:
        "Refusé par le filtre de contenu du fournisseur d'images : {{error}}. C'est un refus, pas une panne. Reformulez le prompt ou choisissez un modèle non censuré. Rien ne vous a été facturé.",
      providerOutage:
        "Le fournisseur d'images est en panne ou surchargé en ce moment : {{error}}. C'est une panne, pas un refus. Réessayez dans une minute ou choisissez un autre modèle. Rien ne vous a été facturé.",
      providerError: "Erreur du fournisseur d'images : {{error}}",
      noImageUrl: "Le fournisseur n'a renvoyé aucune URL d'image",
      noImageGenerated:
        "Le modèle n'a renvoyé aucune image. En général, le prompt a été refusé (par exemple armes, personnes réelles ou personnages protégés par le droit d'auteur) ou la requête n'est pas prise en charge par ce modèle. Reformulez le prompt ou choisissez un autre modèle d'image. Remarque : les modèles texte vers image comme celui-ci n'utilisent pas les images de référence. Cette tentative ne vous a pas été facturée.",
      creditsFailed:
        "Impossible de déduire les crédits de la génération d'image",
      apiKeyNotConfigured: "Clé API non configurée",
      externalServiceError: "Erreur du service externe : {{message}}",
      requestAborted: "La requête a été interrompue",
      requestTimedOut: "Délai dépassé en attendant la génération d'image",
      requestFailed: "Échec de la requête : {{message}}",
      pollFailed: "La requête de suivi a échoué avec le statut {{status}}",
      nonJsonResponse:
        "Le fournisseur a renvoyé une réponse non JSON (HTTP {{status}}) : {{body}}",
    },
    success: {
      title: "Image générée",
      description: "Votre image a bien été générée",
    },
  },
  models: {
    selector: {
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
      creditsExact: "{{cost}} crédits",
      creditsSingle: "1 crédit",
      free: "Gratuit",
      autoSelectedModel: "Selon les filtres :",
      manualSelectedModel: "Sélectionné :",
      skillSelectedModel: "Modèle du skill :",
      selectModelBelow: "Choisissez un modèle ci-dessous",
      sortBy: "Trier par",
      sortThen: "Puis :",
      showLess: "Afficher moins",
      showMore: "Afficher {{count}} de plus",
      showLegacyModels: "Afficher {{count}} anciens modèles",
      autoMode: "Selon les filtres",
      manualMode: "Choix manuel",
      skillMode: "Défaut du skill",
      autoModeDescription:
        "Choisit automatiquement le meilleur modèle selon vos filtres",
      manualModeDescription: "Choisissez le modèle que vous voulez",
      characterBasedModeDescription:
        "Utilise le modèle pour lequel ce skill a été conçu",
      typeChat: "Chat",
      typeImage: "Image",
      typeVideo: "Vidéo",
      typeAudio: "Audio",
      filters: "Filtres",
      filtersActive: "Filtres ({{count}})",
      clearFilter: "Effacer",
      inherited: "Hérité",
      platformDefault: "Par défaut",
      searchPlaceholder: "Rechercher des modèles…",
      noSearchResults: "Aucun modèle trouvé pour « {{query}} »",
      searchExtrasGroup: "Hors des filtres actuels",
    },
    tiers: {
      intelligence: {
        quick: "Rapide",
        smart: "Intelligent",
        brilliant: "Brillant",
        quickDesc: "Rapide et efficace",
        smartDesc: "Qualité équilibrée",
        brilliantDesc: "Raisonnement profond",
      },
      price: {
        cheap: "Économique",
        standard: "Standard",
        premium: "Premium",
        cheapDesc: "0 à 3 crédits par message",
        standardDesc: "3 à 9 crédits par message",
        premiumDesc: "9+ crédits par message",
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
    sort: {
      intelligence: "Intelligence",
      price: "Prix",
      content: "Contenu",
    },
    ranges: {
      intelligenceRange: {
        minLabel: "Intelligence min.",
        maxLabel: "Intelligence max.",
      },
      priceRange: {
        minLabel: "Prix min.",
        maxLabel: "Prix max.",
      },
      contentRange: {
        minLabel: "Contenu min.",
        maxLabel: "Contenu max.",
      },
    },
    credits: {
      credit: "{{count}} crédit",
      credits: "{{count}} crédits",
    },
    creditDisplay: {
      badge: {
        approxPerMsg: "~{{cost}} crédits/msg",
        exactPerMsg: "{{cost}} crédits/msg",
        perImg: "{{cost}} crédits/img",
        perClip: "{{cost}} crédits/clip",
        ratePerChar: "{{rate}} crédits/car.",
        ratePerSec: "{{rate}} crédits/s",
        approxChars: "~{{count}} car.",
        seconds: "{{count}} s",
        lessThanMin: "<0,1",
      },
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
          "L'IA relit tout l'historique de la conversation à chaque message.",
        compactingLabel: "✨ Compactage automatique :",
        compactingExplanation:
          " À {{threshold}} tokens, les anciens messages sont résumés automatiquement.",
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
        simpleExplanation: " Chaque message coûte pareil, court ou long.",
      },
      media: {
        perImage: "par image",
        perClip: "par clip",
        perSecond: "par seconde",
        perClipDuration: "par clip ({{duration}} s)",
        costPerImage: "Coût par image :",
        costPerClip: "Coût par clip :",
        costPerSecond: "Coût par seconde :",
        imageDescription:
          "Coût fixe par image générée, quelle que soit la résolution.",
        clipDescription: "Coût fixe par clip audio généré.",
        videoDescription:
          "Facturé à la seconde de vidéo générée ({{duration}} s par défaut).",
        ttsDescription: "Facturé au caractère converti en voix.",
        ttsPricing: "Tarif :",
        ttsScenarios: {
          short: "Phrase courte",
          medium: "Message type",
          long: "Article long",
        },
        ttsExample:
          "Un message de 100 mots (~600 caractères) coûte ~{{count}} crédits",
        sttDescription: "Facturé à la seconde d'audio transcrit.",
        sttPricing: "Tarif :",
        sttScenarios: {
          short: "Note vocale rapide",
          medium: "Message vocal",
          long: "Une minute entière",
        },
        sttExample: "Un enregistrement d'une minute coûte ~{{count}} crédits",
        costPerChar: "Coût par caractère :",
        costPerClipMusic: "Coût par clip :",
        videoBreakdown:
          "{{costPerSecond}} crédits/s × {{duration}} s = {{total}} crédits",
        imageHeader: "Coût de génération d'image",
        videoHeader: "Coût de génération vidéo",
        musicHeader: "Coût de génération musicale",
        ttsHeader: "Coût de la synthèse vocale",
        sttHeader: "Coût de la transcription",
      },
      creditValue: "1 crédit = {{value}}",
    },
    modelUtilities: {
      adultExplicit: "Contenu adulte explicite",
      adultImplied: "Contenu adulte suggéré",
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
      musicGen: "Génération musicale",
      tts: "Synthèse vocale",
      stt: "Transcription vocale",
      videoGen: "Génération vidéo",
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
    names: modelTranslations.names,
  },
};
