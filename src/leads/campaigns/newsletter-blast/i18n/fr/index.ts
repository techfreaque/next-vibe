import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Newsletter",
  post: {
    title: "Envoi groupé de newsletter",
    titleShort: "Envoi groupé",
    description:
      "Envoyer une newsletter ponctuelle uniquement aux inscrits ayant confirmé leur consentement. La simulation affiche les effectifs par langue. L'envoi immédiat expédie cette newsletter tout de suite, rien d'autre.",
    container: {
      title: "Envoi groupé de newsletter",
      description:
        "Uniquement les inscrits confirmés. Compter, mettre en file, envoyer.",
    },
    fields: {
      dryRun: {
        label: "Simulation",
        description:
          "Compter l'audience consentante par langue. N'écrit rien, n'envoie rien.",
      },
      send: {
        label: "Envoyer maintenant",
        description:
          "Envoyer immédiatement cette newsletter à l'audience consentante. Les autres campagnes en attente ne sont pas touchées.",
      },
    },
    response: {
      audience: "Audience consentante",
      byLocale: "Destinataires par langue",
      scheduled: "Nouvellement mis en file",
      alreadyPending: "Déjà en file",
      cancelled: "Annulés (sans consentement)",
      alreadySent: "Ignorés (déjà reçue)",
      duplicates: "Doublons annulés",
      errors: "Erreurs",
      sent: "Envoyés",
      sendSkipped: "Ignorés à l'envoi (déjà reçue)",
      sendFailed: "Échec de l'envoi",
    },
    success: {
      title: "Envoi groupé mis en file",
      description:
        "Les destinataires consentants sont en file. Avec « Envoyer maintenant » activé, ils reçoivent l'e-mail pendant cette exécution.",
    },
  },
  errors: {
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous pour lancer l'envoi groupé de newsletter.",
    },
    forbidden: {
      title: "Non autorisé",
      description:
        "Seuls les administrateurs peuvent lancer l'envoi groupé de newsletter.",
    },
    server: {
      title: "Un problème est survenu",
      description:
        "L'envoi groupé de newsletter n'a pas pu s'exécuter. Réessayez.",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite.",
    },
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez la requête et réessayez.",
    },
    notFound: {
      title: "Introuvable",
      description: "La ressource demandée est introuvable.",
    },
    conflict: {
      title: "Conflit",
      description: "Cette action entre en conflit avec l'état actuel.",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau s'est produite. Réessayez.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées.",
    },
  },
};
