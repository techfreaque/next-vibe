import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    models: "Modèles",
  },

  get: {
    title: "Scan du catalogue de modèles",
    titleShort: "Scan du catalogue",
    description:
      "Dernier scan de la liste de modèles de chaque fournisseur : nouveaux modèles en amont que nous ne servons pas encore, dérives de prix, ids supprimés et arrêts annoncés. Lecture seule.",
    success: {
      title: "Scan chargé",
      description: "Dernier scan du catalogue de modèles chargé.",
    },
  },

  post: {
    title: "Lancer le scan du catalogue de modèles",
    titleShort: "Lancer le scan",
    description:
      "Récupère maintenant la liste des modèles et les prix en direct de chaque fournisseur, les compare à nos définitions, enregistre le rapport et l'envoie aux boîtes ops. Ne modifie jamais le code.",
    fields: {
      force: {
        label: "Lancer même si récent",
        description:
          "Ignore le garde-fou de 5 jours. Sans cette option, un scan de moins de 5 jours est renvoyé tel quel.",
      },
      sendEmail: {
        label: "Envoyer le rapport par e-mail",
        description: "Envoie le rapport à hi@ et thea@unbottled.ai.",
      },
    },
    success: {
      title: "Scan terminé",
      description: "Scan du catalogue de modèles enregistré.",
    },
  },

  response: {
    scan: "Scan",
    report: "Rapport",
    history: "Scans précédents",
    skipped: "Ignoré (scan récent)",
    reportText: "Rapport",
  },

  widget: {
    back: "Retour",
    runNow: "Lancer le scan",
    running: "Scan en cours...",
    empty: {
      title: "Aucun scan pour l'instant",
      message:
        "Le premier scan suit son planning quotidien. Lancez-en un maintenant pour voir ce qui a changé en amont.",
    },
    skipped:
      "Un scan de moins de 5 jours existe déjà, rien de nouveau n'a donc été récupéré. Cochez « Lancer même si récent » pour en forcer un.",
    scannedAt: "Scanné le",
    newSince: "Nouveau depuis",
    emailedTo: "Envoyé à",
    notEmailed: "Non envoyé",
    emailError: "Échec de l'envoi",
    metrics: {
      newModels: "Nouveaux modèles",
      uncensored: "Semblent non censurés",
      priceChanges: "Changements de prix",
      missing: "Disparus en amont",
      deprecations: "Arrêts annoncés",
      sourceErrors: "Sources en échec",
    },
    sections: {
      newModels: "Nouveaux modèles en amont",
      priceChanges: "Dérive des prix et du contexte",
      missing: "Disparus en amont",
      deprecations: "Arrêts annoncés",
      sources: "Sources",
      history: "Scans précédents",
    },
    legacy: "ancien",
    suspect: "suspect, vérifier le fetcher",
    uncensored: "non censuré",
    ok: "ok",
    failed: "échec",
    models: "modèles",
    perMillion: "par 1M",
    context: "ctx",
    nothing: "Rien ici.",
  },

  task: {
    name: "Scan du catalogue de modèles",
    description:
      "Tous les 5 jours : compare les listes de modèles et les prix des fournisseurs à notre catalogue, enregistre et envoie le rapport.",
  },

  errors: {
    scanFailed: "Échec du scan du catalogue de modèles : {{error}}",
    loadFailed:
      "Impossible de charger le scan du catalogue de modèles : {{error}}",
    server: {
      title: "Erreur serveur",
      description: "Le scan n'a pas pu aboutir. Consultez les logs du serveur.",
    },
    network: {
      title: "Erreur réseau",
      description: "Impossible de joindre le serveur.",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Un problème inattendu est survenu.",
    },
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les options du scan.",
    },
    unauthorized: {
      title: "Non connecté",
      description:
        "Connectez-vous en tant qu'admin pour voir les scans du catalogue.",
    },
    forbidden: {
      title: "Réservé aux admins",
      description:
        "Seuls les admins peuvent voir ou lancer les scans du catalogue.",
    },
    notFound: {
      title: "Introuvable",
      description: "Aucun scan du catalogue trouvé.",
    },
    conflict: {
      title: "Conflit",
      description: "Un autre scan est en cours. Réessayez dans un instant.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications.",
    },
  },
};
