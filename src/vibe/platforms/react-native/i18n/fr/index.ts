import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam:
      "Paramètre d'URL {{paramName}} manquant pour l'endpoint {{endpoint}}",
    urlConstructionFailed: "Échec de la construction de l'URL : {{error}}",
    validationFailed: "Échec de la validation : {{error}}",
    htmlResponseReceived:
      "Réponse HTML reçue au lieu de JSON depuis {{url}} (statut {{status}}). Vérifiez que le serveur d'API tourne et que l'endpoint existe.",
    networkError: "Une erreur réseau s'est produite : {{error}}",
    failedToLoadPage: "Impossible de charger la page",
  },
  generate: {
    post: {
      title: "Générer les index Expo",
      titleShort: "Index Expo",
      description:
        "Générer les wrappers de compatibilité Expo Router pour les pages Next.js",
      response: {
        fields: {
          success: "Succès",
          created: "Fichiers créés",
          skipped: "Fichiers ignorés",
          errors: "Erreurs",
          message: "Message",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous n'êtes pas autorisé à effectuer cette action",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur s'est produite lors de la génération des index",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau s'est produite",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas la permission d'effectuer cette action",
        },
        notFound: {
          title: "Introuvable",
          description: "Répertoire source introuvable",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit s'est produit",
        },
      },
      success: {
        title: "Succès",
        description:
          "{{created}} fichiers générés, {{skipped}} fichiers ignorés, {{errors}} erreurs",
      },
    },
  },
};
