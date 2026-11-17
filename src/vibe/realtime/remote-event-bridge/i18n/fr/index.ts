import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",
  tags: {
    remoteSync: "Synchronisation distante",
  },
  remoteEventBridge: {
    post: {
      title: "Pont d'événements distants",
      titleShort: "Pont d'événements",
      description:
        "Reçoit les événements des pairs distants et les transmet au handler onRemoteEvent de la route cible. Appelé en HTTP par les pairs direct-http ou via onRemoteEvent en WS inverse.",
      eventName: {
        label: "Nom de l'événement",
        description: "Type d'événement transmis à traiter",
      },
      leadId: {
        label: "ID du lead",
        description: "Identité inter-instances du pair émetteur",
      },
      originInstanceId: {
        label: "Instance d'origine",
        description: "Instance qui a émis l'événement (pour éviter l'écho)",
      },
      payload: {
        label: "Payload",
        description:
          "Payload brut de l'événement transmis par l'instance distante",
      },
      received: {
        label: "Reçu",
        description: "Indique si l'événement a été accepté et traité",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Payload d'événement invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        internal: {
          title: "Erreur de traitement",
          description:
            "Une erreur est survenue lors du traitement de l'événement",
        },
        forbidden: {
          title: "Interdit",
          description:
            "Vous n'avez pas l'autorisation d'envoyer des événements",
        },
        notFound: {
          title: "Introuvable",
          description: "Cible introuvable",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre l'endpoint du pont d'événements",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Certaines modifications ne sont pas enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit d'événement détecté",
        },
      },
      success: {
        title: "Événement reçu",
        description: "Événement distant traité",
      },
    },
  },
};
