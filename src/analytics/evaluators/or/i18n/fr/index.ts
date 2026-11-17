import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "OU",
    titleShort: "OU",
    description:
      "Se déclenche dès qu'un signal d'entrée se déclenche à un horodatage donné",
    fields: {
      signals: {
        label: "Flux de signaux",
        description: "Liste de flux de signaux à combiner par OU",
      },
      result: {
        label: "Résultat",
        description: "Événements de signal en sortie",
      },
    },
    success: {
      title: "OU évalué",
      description: "Événements de signal renvoyés",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      server: {
        title: "Erreur serveur",
        description: "Échec de l'évaluation OU",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de requête invalides",
      },
      notFound: { title: "Introuvable", description: "Introuvable" },
      conflict: { title: "Conflit", description: "Conflit" },
      network: {
        title: "Erreur réseau",
        description: "La requête réseau a échoué",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez d'abord vos modifications",
      },
    },
  },
};
