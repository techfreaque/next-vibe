import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Génération IA",
    imageAlt: "{{appName}} {{title}}",
  },
  eyebrow: "Créer",
  back: "Tous les modèles",
  chat: {
    title: "Plutôt demander ?",
    body: "N'importe quel modèle de chat le fait pour vous. Décrivez ce que vous voulez, il choisit les réglages.",
    cta: "Ouvrir le chat",
  },
  kinds: {
    image: {
      label: "Image",
      title: "Générateur d'images IA",
      metaTitle: "Générateur d'images IA sans censure - {{appName}}",
      description:
        "Choisissez le modèle, la taille et le format. Tapez le prompt. Payé à l'image avec vos crédits.",
      keywords: "générateur d'images IA sans censure, art IA, texte vers image",
    },
    video: {
      label: "Vidéo",
      title: "Générateur de vidéos IA",
      metaTitle: "Générateur de vidéos IA - {{appName}}",
      description:
        "Contrôle total : modèle, durée, format, résolution, première et dernière image. Payé au clip avec vos crédits.",
      keywords: "générateur de vidéos IA, texte vers vidéo, image vers vidéo",
    },
    music: {
      label: "Musique",
      title: "Générateur de musique IA",
      metaTitle: "Générateur de musique IA - {{appName}}",
      description:
        "Décrivez le morceau, choisissez le modèle et la durée. Payé au morceau avec vos crédits.",
      keywords: "générateur de musique IA, texte vers musique, chanson IA",
    },
    speech: {
      label: "Voix",
      title: "Synthèse vocale",
      metaTitle: "Synthèse vocale IA - {{appName}}",
      description:
        "Collez un texte, choisissez une voix, récupérez l'audio. Les longs textes passent. Payé au caractère avec vos crédits.",
      keywords: "synthèse vocale, voix IA, TTS",
    },
    transcribe: {
      label: "Transcrire",
      title: "Transcription audio",
      metaTitle: "Transcription IA - {{appName}}",
      description:
        "Déposez réunions, interviews ou mémos vocaux. Choisissez le modèle, récupérez le texte. Payé à la seconde d'audio avec vos crédits.",
      keywords: "transcription audio, transcription IA, audio vers texte",
    },
  },
};
