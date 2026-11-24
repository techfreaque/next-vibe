import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",

  post: {
    title: "Rappel d’inscription",
    titleShort: "Rappel d’inscription",
    description:
      "Envoie un rappel aux personnes qui ont commencé leur inscription sans jamais confirmer leur adresse. Le rappel contient un nouveau code et un lien valable 24 heures.",
    tag: "Rappel d’inscription",
    container: {
      title: "Rappel d’inscription",
      description:
        "Inscriptions en attente, dernier e-mail il y a 2 à 24 heures, jamais confirmées",
    },
    fields: {
      batchSize: {
        label: "Taille du lot",
        description: "Nombre maximal de rappels par exécution",
      },
      dryRun: {
        label: "Simulation",
        description: "Compter qui recevrait un rappel sans rien envoyer",
      },
    },
    response: {
      candidates: "Inscriptions non confirmées dans la fenêtre",
      sent: "Rappels envoyés",
      skipped: "Ignorés",
      failed: "Échecs",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Seul un admin peut envoyer des rappels d’inscription",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès refusé",
      },
      server: {
        title: "Erreur serveur",
        description: "L’envoi des rappels d’inscription a échoué",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      validation: {
        title: "Erreur de validation",
        description: "Réglages invalides",
      },
    },
    success: {
      title: "Rappels traités",
      description: "Rappels d’inscription traités",
    },
  },
  task: {
    name: "Rappel d’inscription",
    description:
      "Toutes les 30 minutes : un rappel aux inscriptions encore non confirmées 2 heures après le dernier e-mail",
  },
};
