import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",

  post: {
    title: "Rappel de vérification d'e-mail",
    titleShort: "Rappel de vérification",
    description:
      "Envoie un rappel unique aux comptes qui n'ont pas confirmé leur e-mail 24 heures après l'inscription. Les crédits gratuits exigent un e-mail confirmé.",
    tag: "Rappel de vérification",
    container: {
      title: "Rappel de vérification d'e-mail",
      description:
        "Comptes créés il y a 24 à 25 heures et toujours non vérifiés",
    },
    fields: {
      batchSize: {
        label: "Taille du lot",
        description: "Nombre maximal de rappels par exécution",
      },
      dryRun: {
        label: "Simulation",
        description: "Compter les destinataires d'un rappel sans rien envoyer",
      },
    },
    response: {
      candidates: "Comptes non vérifiés dans la fenêtre",
      sent: "Rappels envoyés",
      skipped: "Ignorés",
      failed: "Échecs",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être administrateur pour envoyer des rappels de vérification",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      server: {
        title: "Erreur serveur",
        description: "L'envoi des rappels de vérification a échoué",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de rappel invalides",
      },
    },
    success: {
      title: "Rappels traités",
      description: "Rappels de vérification d'e-mail traités",
    },
  },
  task: {
    name: "verify-email-reminder",
    description:
      "Toutes les heures : un rappel aux comptes toujours non vérifiés 24 heures après l'inscription",
  },
};
