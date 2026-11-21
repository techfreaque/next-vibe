import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    studio: "Media Studio",
    history: "Historique",
  },
  get: {
    title: "Vos créations",
    titleShort: "Créations",
    description:
      "Images, vidéos, musique, voix et transcriptions créées dans le Studio, en chat ou via l'API. Les plus récentes d'abord.",
    fields: {
      kind: {
        label: "Type",
        description:
          "image, video, music, speech ou transcribe. Laissez vide pour tout voir.",
      },
    },
    response: {
      items: "Créations",
      id: "ID",
      kind: "Type",
      title: "Prompt",
      createdAt: "Créé le",
      status: "Statut",
      url: "Fichier",
      transcript: "Transcription",
      credits: "Crédits",
      model: "Modèle",
      settings: "Réglages",
      source: "Créé dans",
      threadId: "Conversation",
      rootFolderId: "Dossier",
    },
    success: {
      title: "Historique chargé",
      description: "Vos créations sont listées.",
    },
    errors: {
      validation: {
        title: "Filtre invalide",
        description: "Vérifiez le type et la page, puis réessayez.",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir vos créations.",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne voyez que vos propres créations.",
      },
      notFound: {
        title: "Rien ici",
        description: "Aucune création ne correspond à ce filtre.",
      },
      server: {
        title: "Historique indisponible",
        description:
          "Impossible de charger votre historique. Réessayez dans un instant.",
      },
      network: {
        title: "Connexion perdue",
        description: "Vérifiez votre connexion et réessayez.",
      },
      unknown: {
        title: "Un problème est survenu",
        description: "Impossible de charger votre historique. Réessayez.",
      },
      conflict: {
        title: "Historique modifié",
        description: "Rechargez pour voir les derniers résultats.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord vos modifications.",
      },
    },
  },
  widget: {
    title: "Vos créations",
    titles: {
      image: "Vos images",
      video: "Vos vidéos",
      music: "Vos morceaux",
      speech: "Vos voix off",
      transcribe: "Vos transcriptions",
    },
    count: "{{count}} au total",
    error: "Votre historique n'a pas pu être chargé.",
    retry: "Actualiser",
    emptyTitle: "Rien de créé pour l'instant",
    emptyHint: "Chaque résultat arrive ici, prêt à télécharger.",
    emptyKindHint: "Votre premier résultat apparaît ici dès qu'il est prêt.",
    runAgain: "Relancer",
    download: "Télécharger",
    copyPrompt: "Copier le prompt",
    copied: "Copié",
    copyFailed: "Copie bloquée",
    openInChat: "Ouvrir dans le chat",
    continueInChat: "Continuer dans le chat",
    chatPrompt: "Voici ce que j'ai créé : {{url}}\n\nPrompt : {{prompt}}",
    open: "Ouvrir en taille réelle",
    credits: "{{amount}} crédits",
    source: {
      studio: "via le Studio",
      chat: "via le chat",
      api: "via l'API",
    },
    status: {
      queued: "En file d'attente",
      running: "Génération en cours",
      saving: "Enregistrement",
      completed: "Terminé",
      failed: "Échec",
    },
    pendingHint: "La vidéo et la musique prennent souvent quelques minutes.",
    kinds: {
      image: "Image",
      video: "Vidéo",
      music: "Musique",
      speech: "Voix",
      transcribe: "Transcription",
    },
  },
};
