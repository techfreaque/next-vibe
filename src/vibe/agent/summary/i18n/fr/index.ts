import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour accéder aux compétences personnalisées",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation d'accéder à cette ressource",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de la récupération des compétences",
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
        title: "Conflit",
        description: "Conflit avec l'état actuel",
      },
    },
  },
  title: "Activité IA",
  description:
    "Consultez le catalogue de modèles et les conversations créées ces sept derniers jours.",
  models: "Modèles au catalogue",
  providers: "Fournisseurs de modèles",
  skills: "Compétences communautaires publiées",
  conversations: "Nouvelles conversations",
  reported: "Compétences signalées",
  attention: "À vérifier",
  clear: "Aucune compétence signalée.",
  unavailable: "État de la modération indisponible.",
  recent: "Activité récente",
  loading: "Chargement de l’activité IA…",
  failed: "Impossible de charger l’activité IA.",
};
