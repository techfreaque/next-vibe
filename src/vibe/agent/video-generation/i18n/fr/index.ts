import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "Vidéo",
    generation: "Génération",
    ai: "IA",
  },
  post: {
    title: "Générer une vidéo",
    titleShort: "Générer une vidéo",
    dynamicTitle: "Vidéo : {{prompt}}",
    description:
      "Génère une vidéo à partir d'un prompt texte. Utilisez l'outil models (modelType=video) pour voir tous les modèles vidéo et leurs capacités : supportedDurations (durées de clip valides en secondes), supportedAspectRatios, supportedFrameImages (first_frame/last_frame = prise en charge de l'image vers vidéo). Passez frameReferences pour orienter la vidéo : le rôle 'first' fixe l'image d'ouverture et le rôle 'last' l'image de fin ; les deux DOIVENT être des URL d'images (uniquement sur les modèles qui prennent en charge last_frame). Le rôle 'reference' (ou aucun rôle) fournit une image, un audio ou une vidéo de guidage. Passez negativePrompt sur les modèles qui le prennent en charge. Renvoie videoUrl.",
    form: {
      title: "Génération vidéo",
      description: "Saisissez un prompt pour générer une vidéo",
    },
    prompt: {
      label: "Prompt",
      description: "Décrivez la vidéo que vous voulez générer",
      placeholder:
        "Un plan cinématographique d'un lac de montagne au coucher du soleil...",
    },
    model: {
      label: "Modèle",
      description:
        "Id du modèle vidéo. Laissez vide pour le défaut de l'utilisateur. Utilisez l'outil models (modelType=video) pour parcourir les modèles et leurs capacités.",
    },
    duration: {
      label: "Durée",
      description: "Durée du clip vidéo généré",
      short: "Court (~5 s)",
      medium: "Moyen (~10 s)",
      long: "Long (~15 s)",
    },
    aspectRatio: {
      label: "Format",
      description: "Format de la vidéo",
    },
    resolution: {
      label: "Résolution",
      description: "Résolution de la vidéo",
    },
    frameReferences: {
      label: "Images de référence",
      description:
        "Ressources de référence qui orientent la vidéo. Chaque entrée est { url, role }. Le rôle 'first' fixe exactement l'image d'ouverture et le rôle 'last' exactement l'image de fin (nécessite la prise en charge de last_frame) : ces images de début et de fin sont UNIQUEMENT des IMAGES, les deux DOIVENT donc être des URL d'images. Le rôle 'reference' (ou aucun rôle) désigne une ressource de guidage qui peut être une URL d'image, d'audio ou de vidéo ; son type est détecté d'après l'URL (.mp4/.webm/.mov en vidéo, fichiers audio en audio, tout le reste en image). Une image 'first' ou 'reference' fait basculer le serveur, si nécessaire, sur le modèle le moins cher qui accepte les images.",
      placeholder: "https://example.com/first-frame.jpg",
    },
    negativePrompt: {
      label: "Prompt négatif",
      description:
        "Ce qu'il faut exclure de la vidéo. Envoyé uniquement aux modèles qui acceptent negative_prompt ou negativePrompt, ignoré sinon.",
      placeholder: "flou, basse qualité, déformé...",
    },

    download: "Télécharger",
    generatingNote: "La génération d'une vidéo peut prendre 1 à 3 minutes",
    backButton: {
      label: "Retour",
    },
    submitButton: {
      text: "Générer la vidéo",
      label: "Générer la vidéo",
      loadingText: "Génération...",
    },
    response: {
      videoUrl: "URL de la vidéo générée",
      creditCost: "Crédits utilisés",
      durationSeconds: "Durée en secondes",
      jobId: "ID de la tâche asynchrone",
    },
    errors: {
      referenceUnavailable:
        "L'image d'entrée n'est pas disponible. Elle a été supprimée, ou elle appartient à une discussion que vous ne pouvez pas ouvrir. Utilisez une image de cette discussion ou renvoyez-la.",
      validation_failed: {
        title: "Erreur de validation",
        description: "Vérifiez votre prompt et vos réglages",
      },
      network_error: {
        title: "Erreur réseau",
        description: "Impossible de joindre le service de génération vidéo",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour générer des vidéos",
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
          "Une erreur inattendue s'est produite pendant la génération vidéo",
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
        description: "Un conflit s'est produit pendant la génération vidéo",
      },
      notAVideoModel:
        "Le modèle choisi ne génère pas de vidéos. Choisissez un modèle vidéo.",
      notConfigured:
        "{{label}} n'est pas configuré. Ajoutez {{envKey}} à votre fichier .env. Obtenez votre clé sur {{url}}",
      providerUnsupported: "{{label}} n'est pas encore pris en charge",
      modelUnavailable:
        "Ce modèle est temporairement indisponible. Choisissez-en un autre.",
      insufficientCredits:
        "Crédits insuffisants. Solde : {{balance}}, requis : {{minimum}}",
      balanceCheckFailed: "Impossible de vérifier votre solde de crédits",
      unsupportedDuration:
        "Le modèle {{model}} ne prend pas en charge la durée {{duration}}. Durées prises en charge : {{supported}}",
      unsupportedAspectRatio:
        "Le modèle {{model}} ne prend pas en charge le format {{aspectRatio}}. Formats pris en charge : {{supported}}",
      unsupportedResolution:
        "Le modèle {{model}} ne prend pas en charge la résolution {{resolution}}. Résolutions prises en charge : {{supported}}",
      generationFailed: "Échec de la génération vidéo : {{error}}",
      providerError: "Erreur du fournisseur vidéo : {{error}}",
      noVideoUrl: "Le fournisseur n'a renvoyé aucune URL de vidéo",
      generationFailedUnknown:
        "La génération vidéo a échoué et le fournisseur n'a donné aucune raison",
      providerErrorUnknown:
        "Le fournisseur vidéo a échoué sans message d'erreur",
      nonJsonResponse:
        "Le fournisseur vidéo a renvoyé une réponse non JSON (HTTP {{status}}) : {{body}}",
      providerHttpError:
        "Le fournisseur vidéo a renvoyé HTTP {{status}} : {{body}}",
      jobFailedStatus:
        "La tâche vidéo s'est terminée avec le statut : {{status}}",
      requestAborted: "La génération vidéo a été interrompue",
      requestTimedOut: "Délai dépassé en attendant la génération vidéo",
      contentRejected:
        "Refusé par le filtre de contenu du fournisseur vidéo : {{error}}. C'est un refus, pas une panne. Reformulez le prompt ou choisissez un modèle moins filtré. Rien ne vous a été facturé.",
      providerOutage:
        "Le fournisseur vidéo est en panne ou surchargé en ce moment : {{error}}. C'est une panne, pas un refus. Réessayez dans une minute ou choisissez un autre modèle. Rien ne vous a été facturé.",
      consentRequired:
        "Le fournisseur vidéo exige un consentement pour les visages réels de l'image : {{error}}. Utilisez une image sans visage réel ou choisissez un autre modèle vidéo. Rien ne vous a été facturé.",
      storageFailed:
        "La vidéo a été générée mais n'a pas pu être enregistrée. Rien ne vous a été facturé. Réessayez.",
      creditsFailed: "Impossible de déduire les crédits de la génération vidéo",
      imageRequiredForModel:
        "{{model}} anime une image. Ajoutez une image de départ, puis relancez la génération.",
      inputMediaRequired:
        "Ce modèle exige une URL d'image en entrée. Collez le lien d'une image pour l'animer.",
      imageInputUnsupported:
        "Le modèle vidéo {{model}} a refusé l'image d'entrée : il ne prend probablement pas en charge l'image vers vidéo. Relancez generate_video SANS le paramètre model (le modèle par défaut anime les images), ou retirez l'image.",
      noImageCapableModel:
        "Aucun modèle vidéo disponible ici n'accepte d'image de référence. Retirez l'image pour générer à partir du prompt seul.",
    },
    success: {
      title: "Vidéo générée",
      description: "Votre vidéo a bien été générée",
    },
  },
};
