import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Modération",
  },
  post: {
    title: "Signaler un contenu",
    titleShort: "Signaler",
    description:
      "Signaler un post public ou un fil partagé. Au-delà d'un certain nombre de signalements, il est masqué jusqu'à l'examen d'un admin.",
    reason: {
      label: "Motif",
      description: "Quel est le problème avec ce contenu ?",
    },
    note: {
      label: "Détails",
      description:
        "Facultatif. Ajoutez du contexte pour la personne qui examinera.",
      placeholder: "Que doit savoir la personne qui examinera ?",
    },
    reasons: {
      spam: "Spam",
      illegal: "Contenu illégal",
      abuse: "Abus ou harcèlement",
      csamFlag: "Protection de l'enfance",
      other: "Autre",
    },
    messageId: {
      label: "ID du message",
      description: "Message précis signalé (facultatif)",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Choisissez un motif",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous ne pouvez pas signaler ce contenu",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous ne pouvez pas signaler votre propre contenu",
      },
      notFound: {
        title: "Introuvable",
        description: "Ce contenu a été supprimé ou n'est pas disponible",
      },
      server: {
        title: "Erreur serveur",
        description: "Votre signalement n'a pas pu être envoyé",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Déjà signalé",
        description: "Vous avez déjà signalé ce contenu",
      },
      rateLimited: {
        title: "Trop de signalements",
        description: "Vous signalez trop vite. Réessayez plus tard.",
      },
    },
    success: {
      title: "Signalement envoyé",
      description: "Merci. Nous examinons chaque signalement.",
    },
    response: {
      reported: { content: "Signalé" },
      reportCount: { content: "Nombre de signalements" },
      hidden: { content: "Masqué" },
    },
    backButton: {
      label: "Retour",
    },
    button: {
      submit: "Envoyer le signalement",
      loading: "Envoi...",
    },
  },
};
