import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Rechercher avec Kagi",
    titleShort: "Recherche Kagi",
    dynamicTitle: "Kagi : {{query}}",
    description:
      "Cherche sur internet ou obtient des réponses générées par IA avec Kagi. Le mode FastGPT donne des réponses complètes avec sources, le mode recherche renvoie des résultats directs.",
    form: {
      title: "Paramètres de recherche",
      description: "Configurez votre requête de recherche Kagi",
    },
    submitButton: {
      label: "Rechercher",
      loadingText: "Recherche...",
    },
    backButton: {
      label: "Retour",
    },
    fields: {
      query: {
        title: "Requête",
        description: "Requête ou question claire et précise.",
        placeholder: "Saisissez votre recherche...",
      },
      mode: {
        title: "Mode de recherche",
        description:
          "Choisissez entre des réponses générées par IA (FastGPT) et des résultats de recherche directs",
        options: {
          fastgpt: "FastGPT (réponses par IA)",
          search: "Recherche (résultats directs)",
        },
      },
    },
    response: {
      success: {
        title: "Succès",
        description: "Indique si la recherche a réussi",
      },
      message: {
        title: "Message",
        description: "Message d'état de la recherche",
      },
      output: {
        title: "Réponse",
        description: "Réponse générée par FastGPT",
      },
      query: {
        title: "Requête",
        description: "La requête de recherche exécutée",
      },
      references: {
        title: "Références",
        description: "Sources et citations",
        reference: "Référence",
        item: {
          title: "Référence",
          description: "Source citée",
          url: "URL",
          snippet: "Extrait",
        },
      },
      cached: {
        title: "En cache",
        description: "Indique si les résultats viennent du cache",
      },
      timestamp: {
        title: "Horodatage",
        description: "Moment où la recherche a été effectuée",
      },
    },
    errors: {
      queryEmpty: {
        title: "Requête de recherche obligatoire",
        description: "Saisissez une requête de recherche",
      },
      queryTooLong: {
        title: "Requête trop longue ({{maxLength}} caractères max)",
        description: "La requête doit faire 400 caractères au maximum",
      },
      timeout: {
        title: "Délai de recherche dépassé",
        description: "La recherche a pris trop de temps",
      },
      searchFailed: {
        title: "Échec de la recherche",
        description: "Une erreur s'est produite pendant la recherche",
      },
      validation: {
        title: "Recherche invalide",
        description: "Vérifiez vos paramètres de recherche et réessayez",
      },
      internal: {
        title: "Une erreur s'est produite",
        description: "Impossible de terminer votre recherche. Réessayez",
      },
      notConfigured: {
        title:
          "Clé API {{label}} non configurée. Ajoutez {{envKey}}=<your-key> à votre fichier .env. Obtenez votre clé sur {{url}}",
        description: "Configurez {{label}} pour activer la recherche Kagi",
      },
    },
    success: {
      title: "Recherche réussie",
      description: "La recherche Kagi s'est bien terminée",
    },
  },
  tags: {
    search: "Recherche",
    web: "Web",
    ai: "IA",
  },
};
