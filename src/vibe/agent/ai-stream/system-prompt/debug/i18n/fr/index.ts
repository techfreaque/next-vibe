import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Débogage du prompt système",
    titleShort: "Déboguer le prompt",
    description:
      "Affiche le prompt système exact que reçoit l'IA dans un contexte donné : dossier, compétence, fil, message.",
    status: {
      loading: "Construction...",
      done: "Terminé",
    },
    tags: {
      debug: "Débogage",
    },
    fields: {
      rootFolderId: {
        label: "Dossier racine",
        description:
          "Contexte de dossier à simuler (private, public, incognito, cron, shared, remote)",
        placeholder: "private",
        options: {
          private: "Privé",
          shared: "Partagé",
          public: "Public",
          incognito: "Incognito",
          background: "Arrière-plan",
          remote: "Distant",
        },
      },
      userRole: {
        label: "Rôle utilisateur",
        description: "Rôle utilisateur simulé : public | customer | admin",
        placeholder: "admin",
      },
      userMessage: {
        label: "Message utilisateur",
        description:
          "Message utilisateur simulé pour la recherche par embeddings dans le cortex",
        placeholder: "De quoi avons-nous parlé la dernière fois ?",
      },
      threadId: {
        label: "ID du fil",
        description: "ID de fil facultatif pour le contexte",
        placeholder: "uuid ou laisser vide",
      },
      userId: {
        label: "ID utilisateur",
        description:
          "ID utilisateur facultatif dont charger les données du cortex (vous-même par défaut)",
        placeholder: "uuid ou laisser vide",
      },
      skillId: {
        label: "ID de compétence",
        description:
          "ID de compétence facultatif à injecter dans le prompt système",
        placeholder: "uuid de compétence ou laisser vide",
      },
      subFolderId: {
        label: "ID du sous-dossier",
        description: "UUID de sous-dossier facultatif",
        placeholder: "uuid ou laisser vide",
      },
      imageGenModelSelection: {
        label: "Sélection génération d'images",
        description:
          "Sélection du modèle de génération d'images issue du favori ou du chat actif (laisser vide pour le choix par défaut de l'utilisateur)",
        placeholder: "laisser vide pour le défaut utilisateur",
      },
      musicGenModelSelection: {
        label: "Sélection génération de musique",
        description:
          "Sélection du modèle de génération de musique issue du favori ou du chat actif (laisser vide pour le choix par défaut de l'utilisateur)",
        placeholder: "laisser vide pour le défaut utilisateur",
      },
      videoGenModelSelection: {
        label: "Sélection génération de vidéo",
        description:
          "Sélection du modèle de génération de vidéo issue du favori ou du chat actif (laisser vide pour le choix par défaut de l'utilisateur)",
        placeholder: "laisser vide pour le défaut utilisateur",
      },
    },
    response: {
      systemPrompt: { text: "Prompt système" },
      trailingSystemMessage: { text: "Contexte final" },
      charCount: { text: "Compétences" },
      tokenEstimate: { text: "~Tokens" },
      cortexDiagnostics: { text: "Diagnostic des embeddings du cortex" },
      messageContextLines: { text: "Lignes de contexte du message" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez vos paramètres",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Réservé aux admins",
        description: "Accès administrateur requis",
      },
      notFound: {
        title: "Introuvable",
        description: "Utilisateur ou ressource introuvable",
      },
      threadNotFound: {
        title: "Fil introuvable ou non visible pour vous",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de construire le prompt",
      },
      unknown: { title: "Erreur", description: "Une erreur s'est produite" },
      unsavedChanges: {
        title: "Non enregistré",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: { title: "Conflit", description: "État en conflit" },
    },
    widget: {
      emptyTitle: "Choisissez un contexte",
      emptyMessage:
        "Choisissez un dossier, éventuellement un message, puis construisez le prompt.",
      chars: "Caractères",
      tokens: "~Tokens",
      cortexFailed:
        "Échec de l'embedding du cortex : clé API absente ou erreur du fournisseur.",
      cortexNoNodes:
        "Embedding généré, mais aucun nœud du cortex n'a encore d'embedding.",
      cortexPassing:
        "{{passing}} correspondances sur {{total}} dépassent le seuil",
      noTrailing: "Aucun contexte final pour cette requête.",
    },
    success: {
      title: "Prompt construit",
      description: "Prompt système généré avec succès",
    },
  },
};
