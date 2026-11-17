import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",

  enums: {
    level: {
      error: "Erreur",
      warn: "Avertissement",
    },
  },

  post: {
    title: "Signaler une erreur client",
    titleShort: "Journaliser l'erreur",
    description:
      "Enregistrer une erreur ou un avertissement côté client dans le journal d'erreurs",
    tags: {
      monitoring: "Surveillance",
    },
    fields: {
      level: {
        label: "Niveau",
        description: "Niveau de log : error ou warn",
      },
      message: {
        label: "Message",
        description: "Message d'erreur",
        placeholder: "Une erreur s'est produite",
      },
      metadata: {
        label: "Métadonnées",
        description: "Contexte structuré supplémentaire",
      },
    },
    response: {
      ok: {
        title: "Accepté",
      },
    },
    success: {
      title: "Enregistré",
      description: "Erreur client enregistrée",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'enregistrer le journal d'erreurs",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        titleChanges: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
  },
};
