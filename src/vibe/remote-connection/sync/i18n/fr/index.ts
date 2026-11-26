import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",
  tags: {
    remoteSync: "Synchronisation distante",
  },
  taskSync: {
    post: {
      title: "Synchronisation distante",
      titleShort: "Synchro",
      description:
        "Synchronisation bidirectionnelle par curseurs entre instances. Envoie les curseurs locaux, ne reçoit que les enregistrements plus récents.",
      instanceId: {
        label: "Nom de l'instance",
        description: "L'identifiant de l'instance appelante",
      },
      syncCursors: {
        label: "Curseurs de synchro",
        description:
          "Curseurs par domaine indiquant la dernière position synchronisée",
      },
      capabilitiesVersion: {
        label: "Version des capacités",
        description:
          "Version de l'instantané des capacités de l'instance réceptrice détenue par l'appelant",
      },
      senderCapabilitiesVersion: {
        label: "Version des capacités de l'émetteur",
        description:
          "Version de l'instantané des capacités propre à l'instance appelante",
      },
      capabilitiesJson: {
        label: "JSON des capacités",
        description:
          "Instantané du manifeste d'outils à enregistrer sur cette instance",
      },
      pushPayloads: {
        label: "Payloads envoyés",
        description:
          "Enregistrements de l'appelant plus récents que ses curseurs d'envoi, appliqués ici avant la sérialisation de la réponse (push-pull bidirectionnel)",
      },
      syncPayloads: {
        label: "Payloads de synchro",
        description:
          "Enregistrements plus récents que les curseurs fournis, par domaine",
      },
      syncCounts: {
        label: "Compteurs de synchro",
        description: "Nombre d'enregistrements renvoyés par domaine",
      },
      remoteCursors: {
        label: "Curseurs distants",
        description:
          "Curseurs actuels de cette instance : avancez les curseurs locaux jusqu'à ceux-ci",
      },
      remoteCapabilitiesVersion: {
        label: "Version des capacités distantes",
        description: "Version actuelle des capacités de cette instance",
      },
      capabilities: {
        label: "Capacités",
        description: "Instantané du manifeste d'outils de cette instance",
      },
      serverTime: {
        label: "Heure du serveur",
        description: "Horodatage actuel du serveur",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Requête de synchro invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        internal: {
          title: "Erreur de synchro",
          description: "Une erreur est survenue pendant la synchronisation",
        },
        forbidden: {
          title: "Interdit",
          description: "Vous n'avez pas l'autorisation de synchroniser",
        },
        notFound: {
          title: "Introuvable",
          description: "Cible de synchro introuvable",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre l'endpoint de synchro",
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
          description: "Conflit de synchro détecté",
        },
      },
      success: {
        title: "Synchronisé",
        description: "Synchronisation terminée",
      },
    },
  },
};
