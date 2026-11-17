import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Rechercher sur le web",
    titleShort: "Brave Search",
    dynamicTitle: "Recherche : {{query}}",
    description:
      "Cherche sur internet des informations à jour, des actualités, des faits ou des événements récents. À utiliser quand vous avez besoin d'informations récentes ou de vérifier des faits.",
    form: {
      title: "Paramètres de recherche",
      description: "Configurez votre requête de recherche web",
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
        description:
          "Requête claire et précise. Utilisez des mots-clés plutôt que des questions.",
        placeholder: "Saisissez votre recherche...",
      },
      maxResults: {
        title: "Résultats max",
        description: "Nombre de résultats à renvoyer (1 à 10)",
      },
      includeNews: {
        title: "Inclure l'actualité",
        description:
          "Inclure des résultats d'actualité pour les événements récents",
      },
      freshness: {
        title: "Fraîcheur",
        description: "Filtrer les résultats selon leur ancienneté",
        options: {
          day: "Dernières 24 heures",
          week: "Semaine dernière",
          month: "Mois dernier",
          year: "Année dernière",
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
      query: {
        title: "Requête",
        description: "La requête de recherche exécutée",
      },
      results: {
        title: "Résultats",
        description: "Liste des résultats de recherche",
        result: "Résultat",
        item: {
          title: "Résultat de recherche",
          description: "Résultat de recherche individuel",
          url: "URL",
          snippet: "Extrait",
          age: "Ancienneté",
          source: "Source",
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
        description: "Configurez {{label}} pour activer la recherche web",
      },
    },
    success: {
      title: "Recherche réussie",
      description: "La recherche web s'est bien terminée",
    },
  },
  tags: {
    search: "Recherche",
    web: "Web",
    internet: "Internet",
  },
};
