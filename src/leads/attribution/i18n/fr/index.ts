import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tag: "Liaison par IP",
  task: {
    description:
      "Analyse les leads anonymes qui partagent la même adresse IP et les relie comme une seule personne",
  },
  post: {
    title: "Liaison par IP",
    titleShort: "Liaison IP",
    description: "Relier les leads anonymes qui partagent la même adresse IP",
    container: {
      title: "Liaison par IP",
      description:
        "Trouve les leads anonymes avec la même IP créés dans la fenêtre de temps et les relie",
    },
    fields: {
      dryRun: {
        label: "Simulation",
        description: "Exécuter sans rien modifier",
      },
      windowDays: {
        label: "Fenêtre (jours)",
        description:
          "Ne relier que les leads créés à moins de ce nombre de jours d'écart",
      },
    },
    response: {
      pairsFound: "Paires trouvées",
      pairsLinked: "Paires reliées",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite pendant la liaison par IP",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
    },
    success: {
      title: "Liaison par IP terminée",
      description: "Leads avec la même IP reliés",
    },
  },
};
