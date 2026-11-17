import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Récupérer le contenu d'une URL",
    titleShort: "Récupérer une URL",
    description:
      "Récupère et extrait le contenu de n'importe quelle URL en le convertissant en markdown lisible. À utiliser pour lire ou analyser le contenu d'une page web.",
    form: {
      title: "Paramètres de récupération",
      description: "Configurer l'URL dont récupérer le contenu",
    },
    fields: {
      url: {
        title: "URL",
        description:
          "L'URL complète à récupérer (doit inclure http:// ou https://)",
        placeholder: "https://example.com",
      },
      query: {
        title: "Requête de recherche (facultatif)",
        description:
          "Filtre regex appliqué après la récupération. Seuls les paragraphes correspondant au motif sont renvoyés, classés par nombre de correspondances, dans la limite de caractères. Laissez vide pour obtenir la page entière (tronquée au milieu si elle est longue). Syntaxe : n'importe quelle regex JS, 'authentication', '(login|signup)', 'class\\s+\\w+'. Une regex invalide bascule sur une correspondance littérale.",
        placeholder: "authentication",
      },
    },
    response: {
      message: {
        title: "Message",
        description: "Message d'état de la récupération",
      },
      content: {
        title: "Contenu",
        description: "Le contenu extrait au format markdown",
      },
      truncated: {
        title: "Tronqué",
        description: "Indique si le contenu a été tronqué à cause de sa taille",
      },
      truncatedNote: {
        title: "Note de troncature",
        description:
          "Détails sur la troncature et comment obtenir plus de contenu",
      },
      url: {
        title: "Voir l'original",
        description: "L'URL récupérée",
      },
      statusCode: {
        title: "Code de statut",
        description: "Code de statut HTTP de la réponse",
      },
      timeElapsed: {
        title: "Durée (ms)",
        description: "Temps de récupération du contenu en millisecondes",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'URL est invalide ou manquante",
      },
      internal: {
        title: "Erreur de récupération",
        description:
          "Une erreur s'est produite lors de la récupération de l'URL",
        detail: "Erreur de récupération : {{message}}",
      },
      notConfigured: {
        title:
          "Clé API {{label}} non configurée. Ajoutez {{envKey}}=<your-key> à votre fichier .env. Obtenez votre clé sur {{url}}",
        description: "Configurez {{label}} pour récupérer des pages web",
      },
      timeout: {
        title: "Délai de récupération dépassé",
        description: "La récupération de l'URL a expiré",
        detail:
          "La récupération de {{url}} a expiré. La page est peut-être trop lente ou indisponible.",
      },
    },
    success: {
      title: "Récupération réussie",
      description: "Le contenu de l'URL a bien été récupéré",
      detail: "{{url}} récupérée",
    },
  },
  tags: {
    scraping: "Scraping",
    web: "Web",
    content: "Contenu",
  },
  cleanup: {
    post: {
      title: "Nettoyage du cache d'URL",
      titleShort: "Nettoyage du cache d'URL",
      description: "Supprime les fichiers de cache d'URL de plus de 7 jours",
      container: {
        title: "Résultats du nettoyage",
        description: "Récapitulatif des fichiers de cache supprimés",
      },
      response: {
        deletedCount: "Fichiers supprimés",
        totalScanned: "Total analysé",
        retentionDays: "Jours de conservation",
      },
      success: {
        title: "Cache nettoyé",
        description: "Les fichiers de cache d'URL périmés ont été supprimés",
      },
    },
    errors: {
      server: {
        title: "Erreur de nettoyage",
        description:
          "Une erreur s'est produite lors du nettoyage du cache d'URL",
      },
    },
    name: "Nettoyage du cache d'URL",
    description:
      "Nettoyage hebdomadaire des fichiers de cache de récupération d'URL périmés",
  },
};
