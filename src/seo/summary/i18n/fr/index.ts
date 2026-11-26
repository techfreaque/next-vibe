import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Requête invalide",
      description: "Vérifiez la requête.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour consulter l’aperçu des publications.",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Le rôle d’administrateur est requis.",
    },
    notFound: {
      title: "Aucune donnée",
      description: "Cette instance ne contient aucune donnée de publication.",
    },
    server: {
      title: "Aperçu des publications",
      description: "Impossible de charger l’aperçu des publications.",
    },
    network: {
      title: "Erreur réseau",
      description: "Impossible de joindre le serveur",
    },
    unknown: {
      title: "Aperçu des publications",
      description: "Impossible de charger l’aperçu des publications.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "La requête est en conflit avec les données actuelles",
    },
  },
  title: "Aperçu des publications",
  description: "Forum public et soumissions enregistrées dans IndexNow.",
  threads: "Discussions publiques",
  savedUrls: "URL enregistrées dans IndexNow",
  snapshotOn: "Situation au {{date}} (UTC)",
  newestThread: "Dernière discussion publique",
  indexingSnapshot: "État d’IndexNow",
  newestOn: "Dernière discussion publique le {{date}}.",
  noThreads: "Le forum ne compte encore aucune discussion publique.",
  indexingSavedOn:
    "Dernier enregistrement IndexNow le {{date}}. Les moteurs de recherche communiquent séparément l’état de l’indexation.",
  noIndexingSnapshot:
    "Cette instance n’a enregistré aucune soumission IndexNow.",
  noIndexingRecordsYet: "Aucun enregistrement",
  loading: "Chargement de l’aperçu des publications…",
};
