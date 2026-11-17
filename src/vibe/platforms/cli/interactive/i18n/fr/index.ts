import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  capture: {
    title: "Capturer l'écran interactif",
    titleShort: "Capturer l'écran",
    description:
      "Lire l'écran actuellement rendu d'une session vibe interactive en cours",
    form: {
      fields: {
        pid: {
          label: "PID de la session",
          description:
            "PID de la session interactive. Détecté automatiquement s'il est omis.",
        },
      },
    },
    response: {
      fields: {
        content: "Contenu de l'écran",
        logs: "Journaux d'erreurs",
        pid: "PID de la session",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès interdit",
      },
      notFound: {
        title: "Aucune session",
        description: "Aucune session interactive active trouvée",
        noSession:
          "Aucune session interactive en cours. Lancez-en une avec : vibe <alias> -i --agent-control",
        deadSession: "La session PID {{pid}} ne tourne plus.",
        frameNotFound:
          "Pas encore d'écran rendu pour la session {{pid}}. Patientez un instant et réessayez.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de session",
      },
    },
    success: {
      title: "Écran capturé",
      description: "L'écran actuel a été récupéré",
    },
  },
  sendKeys: {
    title: "Envoyer des touches à la session interactive",
    titleShort: "Envoyer des touches",
    description:
      "Injecter des frappes clavier dans une session vibe interactive en cours et renvoyer l'écran mis à jour",
    form: {
      fields: {
        keys: {
          label: "Touches",
          description:
            "Touche à envoyer : Enter, Tab, Escape, Up, Down, Left, Right, Backspace, Space, ou du texte littéral",
        },
        pid: {
          label: "PID de la session",
          description:
            "PID de la session interactive. Détecté automatiquement s'il est omis.",
        },
        waitMs: {
          label: "Attente (ms)",
          description:
            "Millisecondes d'attente après l'injection des touches avant de lire l'écran. Par défaut : 500.",
        },
      },
    },
    response: {
      fields: {
        content: "Contenu de l'écran",
        logs: "Journaux d'erreurs",
        pid: "PID de la session",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès interdit",
      },
      notFound: {
        title: "Aucune session",
        description: "Aucune session interactive active trouvée",
        noSession:
          "Aucune session interactive en cours. Lancez-en une avec : vibe <alias> -i --agent-control",
        deadSession: "La session PID {{pid}} ne tourne plus.",
        keysNotFound:
          "La session {{pid}} n'accepte pas encore de touches. Patientez un instant et réessayez.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de session",
      },
    },
    success: {
      title: "Touches envoyées",
      description: "Frappes envoyées et écran mis à jour",
    },
  },
};
