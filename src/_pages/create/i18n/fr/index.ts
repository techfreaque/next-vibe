import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Génération IA",
    imageAlt: "{{appName}} {{title}}",
  },
  studio: "Studio de création",
  navName: "Studio",
  hub: {
    metaTitle: "Studio média IA : images, vidéo, musique et voix",
    metaDescription:
      "Générez des images, des clips vidéo, de la musique et des voix, ou transcrivez de l'audio. Modèles grand public et non censurés côte à côte. Vous payez au résultat.",
    keywords:
      "studio média IA, générateur d'images IA non censuré, générateur vidéo IA, générateur de musique IA, synthèse vocale, transcription audio",
    title: "Studio média",
    subtitle:
      "Cinq outils. Tous les grands modèles, non censurés compris. Vous payez au résultat et gardez tout ce que vous créez.",
    from: "Dès {{price}}",
    free: "Gratuit",
    models: "{{count}} modèles",
    voices: "{{count}} voix",
    open: "Ouvrir",
  },
  asyncProgress:
    "En cours. La vidéo et la musique prennent souvent une à trois minutes. La progression s'affiche aussi dans votre historique.",
  ooc: {
    title: "Pas assez de crédits gratuits",
    need: "Cette génération coûte {{amount}} crédits.",
    description:
      "Un compte gratuit reçoit {{signedIn}} crédits par mois, {{max}} avec la newsletter. Après l'inscription, vous revenez ici avec vos réglages intacts.",
    signUp: "Créer un compte gratuit",
    defaults: "Réglages moins chers",
    haveAccount: "Déjà un compte ?",
    logIn: "Se connecter",
  },
  moreOptions: "Plus d’options",
  modelDefault: "Auto",
  model: "Modèle",
  voice: "Voix",
  estimate: "Coût estimé",
  credits: "{{amount}} crédits",
  failed: "La création a échoué",
  historyError: "Impossible d’ouvrir l’historique du studio. Réessayez.",
  unavailable: "Aucun modèle n’est disponible pour ce format pour le moment.",
  file: "Fichier audio",
  language: "Langue de l’enregistrement",
  referenceAudio: "URL de l’extrait de référence",
  durationSeconds: "Durée de l’enregistrement en secondes",
  duration: "Durée",
  ratio: "Format",
  size: "Taille",
  quality: "Qualité",
  reference: "URL de l’image de référence",
  lastFrame: "URL de la dernière image",
  creating: "Création en cours · {{seconds}} s",
  submitImage: "Créer une image",
  submitVideo: "Créer une vidéo",
  submitMusic: "Créer un morceau",
  submitSpeech: "Générer la voix",
  submitTranscribe: "Transcrire l’audio",
  meteredCost:
    "Le coût final dépend de la consommation mesurée par le fournisseur.",
  estimatePending: "Ajoutez un enregistrement pour estimer son coût.",
  needsCredits: "Requiert {{amount}} crédits",
  units: {
    image: "{{amount}} crédits / image",
    video: "{{amount}} crédits / s",
    music: "{{amount}} crédits / morceau",
    speech: "{{amount}} crédits / 1 000 caractères",
    transcribe: "{{amount}} crédits / min",
    tokenImage: "≈ {{amount}} crédits / image",
  },
  kinds: {
    image: {
      label: "Image",
      tab: "Image",
      pitch:
        "Du texte à l'image, ou la retouche d'une référence. Photoréaliste, anime, art : tout ce que vous décrivez.",
      title: "Créer une image",
      metaTitle: "Générateur d'images IA sans censure : {{appName}}",
      metaDescription:
        "Créez des images à partir d'un texte ou retouchez une photo. Modèles grand public et sans censure côte à côte, du photoréaliste à l'anime. Paiement au résultat.",
      description: "Décrivez une scène et choisissez votre cadrage.",
      keywords: "générateur d'images IA sans censure, art IA, texte vers image",
    },
    video: {
      label: "Vidéo",
      tab: "Vidéo",
      pitch:
        "Un texte ou une première image devient un clip. Vous choisissez durée, format et résolution.",
      title: "Créer une vidéo",
      metaTitle: "Générateur de vidéos IA : {{appName}}",
      metaDescription:
        "Transformez un prompt ou une première image en clip vidéo. Durée, format et résolution au choix, avec les meilleurs modèles vidéo. Paiement au résultat.",
      description: "Animez votre scène, de la première à la dernière image.",
      keywords: "générateur de vidéos IA, texte vers vidéo, image vers vidéo",
    },
    music: {
      label: "Musique",
      tab: "Musique",
      pitch:
        "Un morceau complet à partir d'un prompt : ambiance, genre, instruments, durée.",
      title: "Composer un morceau",
      metaTitle: "Générateur de musique IA : {{appName}}",
      metaDescription:
        "Un morceau complet à partir d'un prompt : ambiance, genre, instruments et durée. Plusieurs modèles musicaux dans un seul studio. Paiement au résultat.",
      description:
        "Choisissez l’ambiance, les instruments et la durée de votre morceau.",
      keywords: "générateur de musique IA, texte vers musique, chanson IA",
    },
    speech: {
      label: "Voix",
      tab: "Voix",
      pitch:
        "Votre texte lu par des voix naturelles, dans de nombreuses langues.",
      title: "Donner voix à un texte",
      metaTitle: "Synthèse vocale IA : {{appName}}",
      metaDescription:
        "Collez un texte, choisissez une voix, téléchargez l'audio. Des voix IA naturelles dans de nombreuses langues. Paiement au résultat.",
      description: "Choisissez la voix qui lira votre texte à haute voix.",
      keywords: "synthèse vocale, voix IA, TTS",
    },
    transcribe: {
      label: "Transcription",
      tab: "Texte",
      pitch:
        "Envoyez un enregistrement, récupérez un texte propre. Téléchargez-le en fichier.",
      title: "Transcrire un enregistrement",
      metaTitle: "Transcription IA : {{appName}}",
      metaDescription:
        "Importez un enregistrement et récupérez un texte propre à télécharger. Des modèles de transcription précis dans de nombreuses langues. Paiement au résultat.",
      description: "Transformez un enregistrement en texte à télécharger.",
      keywords: "transcription audio, transcription IA, audio vers texte",
    },
  },
};
