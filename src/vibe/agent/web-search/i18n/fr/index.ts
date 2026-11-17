import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  enums: {
    provider: {
      AUTO: "Auto (recommandé)",
      BRAVE: "Brave Search",
      KAGI: "Kagi FastGPT",
    },
  },
  get: {
    title: "Rechercher sur le web",
    titleShort: "Recherche web",
    dynamicTitle: "Recherche : {{query}}",
    description:
      "Cherche sur internet des informations à jour, des actualités, des faits ou des événements récents. Passe automatiquement par votre fournisseur de recherche préféré.",
    form: {
      title: "Recherche web",
      description: "Cherchez sur le web avec votre fournisseur préféré",
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
      provider: {
        title: "Fournisseur de recherche",
        description:
          "Moteur de recherche à utiliser. Auto choisit votre fournisseur par défaut ou le moins cher disponible.",
        options: {
          auto: "Auto (recommandé)",
          brave: "Brave Search",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "Résultats max",
        description:
          "Nombre de résultats à renvoyer (1 à 10). Brave uniquement.",
      },
      includeNews: {
        title: "Inclure l'actualité",
        description:
          "Inclure des résultats d'actualité pour les événements récents. Brave uniquement.",
      },
      freshness: {
        title: "Fraîcheur",
        description:
          "Filtrer les résultats selon leur ancienneté. Brave uniquement.",
        options: {
          day: "Dernières 24 heures",
          week: "Semaine dernière",
          month: "Mois dernier",
          year: "Année dernière",
        },
      },
    },
    response: {
      provider: {
        title: "Fournisseur",
        description: "Fournisseur de recherche utilisé",
      },
      output: {
        title: "Réponse de l'IA",
        description: "Résumé généré par l'IA (Kagi uniquement)",
      },
      results: {
        title: "Résultats",
        description: "Résultats de la recherche web",
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
    },
    widget: {
      aiDefaultLabel: "Défaut de l'IA :",
      switchTo: "Passer à",
      separatorDot: "·",
      via: "via {{provider}}",
      braveBanner: "Votre IA cherche avec Kagi",
      kagiBanner: "Votre IA cherche avec Brave",
      useBrave: "Utiliser Brave",
      useKagi: "Utiliser Kagi",
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
      noProvider: {
        title: "Aucun fournisseur de recherche disponible",
        description:
          "Aucune clé API de recherche n'est configurée. Configurez Brave Search ou Kagi dans votre fichier .env.",
      },
      noProviderAdmin: {
        title:
          "Aucun fournisseur de recherche configuré. Ajoutez BRAVE_SEARCH_API_KEY ou KAGI_API_KEY à votre fichier .env.",
        description:
          "Brave Search : https://api.search.brave.com/app/keys | Kagi : https://kagi.com/settings?p=api",
      },
      noProviderUser: {
        title: "La recherche web n'est pas disponible pour le moment.",
        description:
          "L'administrateur n'a pas encore configuré de fournisseur de recherche.",
      },
      providerUnavailable: {
        title: "Fournisseur de recherche indisponible",
        description:
          "Le fournisseur choisi n'est pas configuré. Choisissez-en un autre ou utilisez auto.",
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
