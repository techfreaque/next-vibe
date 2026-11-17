import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Maintenance",
  },
  post: {
    title: "Nettoyage des exécutions bloquées",
    titleShort: "Exécutions bloquées",
    description:
      "Libère les fils de discussion restés en « streaming » après la mort du processus qui rédigeait la réponse. Conserve la réponse partielle, la marque comme interrompue et lance les messages en file d'attente. Les exécutions actives, sur n'importe quel nœud, ne sont jamais touchées.",
    container: {
      title: "Nettoyage des exécutions bloquées",
      description: "Prévisualiser ou libérer les fils bloqués",
    },
    fields: {
      localThresholdMinutes: {
        label: "Seuil local (min)",
        description:
          "Libérer une exécution locale dont le propriétaire n'a plus envoyé de signal de vie depuis cette durée",
      },
      remoteThresholdMinutes: {
        label: "Seuil distant (min)",
        description:
          "Libérer une exécution tournant sur une autre instance quand rien n'est arrivé depuis cette durée",
      },
      batchSize: {
        label: "Fils max",
        description: "Nombre maximal de fils libérés par passage",
      },
      dryRun: {
        label: "Simulation",
        description: "Lister les fils bloqués sans rien modifier",
      },
    },
    response: {
      candidates: "Fils bloqués trouvés",
      reaped: "Fils libérés",
      lost: "Ignorés : revenus à la vie",
      failed: "Échecs",
      queuedStarted: "Messages en file lancés",
      threadIds: "ID des fils",
      executionTimeMs: "Durée d'exécution (ms)",
    },
    success: {
      title: "Nettoyage terminé",
      description: "Fils bloqués libérés",
    },
  },
  interrupted: {
    content:
      "Le serveur a redémarré pendant la rédaction de cette réponse. La réponse partielle est enregistrée. Relancez pour continuer.",
  },
  errors: {
    failed: "Échec du nettoyage des exécutions bloquées : {{error}}",
    server: {
      title: "Erreur de nettoyage",
      description: "Le nettoyage des exécutions bloquées a échoué",
    },
  },
  task: {
    name: "Nettoyage des exécutions bloquées",
    description:
      "Toutes les 5 minutes : libère les fils laissés en streaming par un processus mort en pleine réponse",
  },
};
