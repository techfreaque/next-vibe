import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "plafond-public",
    admin: "admin",
  },
  get: {
    perDayUnit: "crédits/jour",
    title: "Voir le plafond public gratuit",
    titleShort: "Plafond gratuit",
    description:
      "Voir la dépense globale de crédits gratuits du jour et son plafond",
    container: {
      title: "Plafond quotidien public gratuit",
      description: "Limite de dépense quotidienne globale pour les non-payants",
    },
    spendToday: {
      content: "Dépensé aujourd'hui",
    },
    capAmount: {
      content: "Plafond quotidien",
    },
    remainingToday: {
      content: "Restant aujourd'hui",
    },
    percentUsed: {
      content: "Utilisé",
    },
    lastResetAt: {
      content: "Dernière réinitialisation",
    },
    capExceeded: {
      content: "Plafond dépassé",
    },
    perLeadCap: { content: "Plafond par lead" },
    perIpCap: { content: "Plafond par IP" },
    topSpenders: { content: "Plus gros consommateurs gratuits du jour" },
    recentEvents: { content: "Événements récents du plafond" },
    noData: "Rien pour l'instant aujourd'hui.",
    success: {
      title: "Statut du plafond récupéré",
      description: "Statut du plafond public gratuit récupéré",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion réseau a échoué",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès administrateur requis",
      },
      notFound: {
        title: "Introuvable",
        description: "Configuration du plafond introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer le statut du plafond",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de ressources est survenu",
      },
    },
  },
  post: {
    title: "Modifier le plafond public gratuit",
    titleShort: "Modifier le plafond",
    description:
      "Modifier le plafond quotidien global de dépense de crédits pour les non-payants",
    capAmount: {
      label: "Plafond quotidien (crédits)",
      description:
        "Crédits maximum que l'ensemble des non-payants peut dépenser par jour",
      placeholder: "ex. 500",
    },
    perLeadCap: {
      label: "Plafond quotidien par lead (crédits)",
      description:
        "Crédits gratuits maximum qu'un invité/lead peut consommer par jour",
      placeholder: "ex. 20",
    },
    perIpCap: {
      label: "Plafond quotidien par IP (crédits)",
      description: "Crédits gratuits maximum qu'une IP peut consommer par jour",
      placeholder: "ex. 40",
    },
    message: {
      content: "Résultat",
    },
    success: {
      title: "Plafond mis à jour",
      description: "Plafond quotidien mis à jour",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Le plafond doit être un nombre positif",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion réseau a échoué",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès administrateur requis",
      },
      notFound: {
        title: "Introuvable",
        description: "Configuration du plafond introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de mettre à jour le plafond",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de ressources est survenu",
      },
    },
  },
  repository: {
    capUpdated: "Plafond quotidien fixé à {{capAmount}} crédits",
    capExceeded:
      "Le quota gratuit restant aujourd’hui ne suffit pas pour cette demande. Réessayez demain ou utilisez des crédits payants.",
    leadCapExceeded:
      "Cette demande dépasse votre quota gratuit du jour. Réessayez demain ou utilisez des crédits payants.",
    reservedByRunningReply:
      "Vos crédits gratuits couvrent encore une réponse en cours. Attendez qu'elle se termine, puis renvoyez.",
    capUnavailable:
      "Les crédits gratuits sont temporairement indisponibles. Réessayez plus tard.",
    getCapFailed: "Impossible de récupérer la configuration du plafond gratuit",
    updateCapFailed: "Impossible de mettre à jour le plafond gratuit",
    incrementFailed: "Impossible d'enregistrer la dépense gratuite",
  },
};
