import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Maintenance",
  },
  post: {
    title: "Nettoyage des médias invités",
    titleShort: "Nettoyage des médias invités",
    description:
      "Supprime les médias générés par des invités dans les discussions incognito et les exécutions d'outils autonomes, une fois la durée de conservation dépassée. Uniquement pour les invités qui ne se sont jamais inscrits ni connectés. Les fils enregistrés et les fichiers des comptes ne sont jamais touchés.",
    container: {
      title: "Nettoyage des médias invités",
      description: "Lancer ou prévisualiser le nettoyage",
    },
    fields: {
      retentionDays: {
        label: "Conservation (jours)",
        description:
          "Supprimer les médias invités plus anciens que ce nombre de jours",
      },
      batchSize: {
        label: "Suppressions max.",
        description:
          "Nombre maximum de fichiers supprimés par exécution. Le reste attend la prochaine exécution.",
      },
      dryRun: {
        label: "Simulation",
        description:
          "Compter et journaliser ce qui serait supprimé, sans rien supprimer",
      },
    },
    response: {
      cutoff: "Date limite",
      namespacesScanned: "Espaces de noms analysés",
      storedThreadNamespaces: "Fils enregistrés ignorés",
      filesScanned: "Fichiers analysés",
      filesDeleted: "Fichiers supprimés",
      bytesDeleted: "Octets supprimés",
      skippedTooNew: "Conservés : dans la durée de conservation",
      skippedUserOwned: "Conservés : appartiennent à un compte",
      skippedUnowned: "Conservés : sans propriétaire",
      skippedAccountLead: "Conservés : lead lié à un compte",
      deferred: "Reportés à la prochaine exécution",
      failed: "Échecs",
      executionTimeMs: "Temps d'exécution (ms)",
    },
    success: {
      title: "Nettoyage terminé",
      description: "Médias invités expirés supprimés",
    },
  },
  errors: {
    failed: "Échec du nettoyage des médias invités : {{error}}",
    server: {
      title: "Erreur de nettoyage",
      description: "Échec du nettoyage des médias invités",
    },
  },
  task: {
    name: "Nettoyage des médias invités",
    description:
      "Suppression quotidienne des médias invités expirés des discussions incognito et des exécutions d'outils autonomes",
  },
};
