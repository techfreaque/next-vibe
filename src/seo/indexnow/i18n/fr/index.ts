import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Soumission IndexNow",
    titleShort: "IndexNow",
    description:
      "Signale à Bing, Yandex, Seznam, Naver et Yep chaque URL nouvelle ou modifiée du sitemap. Production uniquement, les URL déjà envoyées sont ignorées.",
    tag: "SEO",
    container: {
      title: "Exécution IndexNow",
      description: "Ce qui a été envoyé aux moteurs de recherche",
    },
    fields: {
      force: {
        label: "Tout renvoyer",
        description:
          "Renvoyer toutes les URL du sitemap, pas seulement les nouvelles ou modifiées.",
      },
      dryRun: {
        label: "Simulation",
        description: "Compter les URL en attente sans les envoyer.",
      },
    },
    response: {
      status: "Statut",
      host: "Hôte",
      totalUrls: "URL du sitemap",
      pendingUrls: "URL en attente",
      submittedUrls: "URL envoyées",
      requests: "Requêtes envoyées",
    },
    errors: {
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous en admin pour envoyer des URL.",
      },
      forbidden: {
        title: "Réservé aux admins",
        description: "Seuls les admins peuvent envoyer des URL à IndexNow.",
      },
      server: {
        title: "Échec de l'envoi",
        description:
          "IndexNow a refusé l'envoi ou le sitemap n'a pas pu être généré. Consultez le journal serveur.",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème est survenu pendant l'envoi des URL.",
      },
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez les options.",
      },
      keyUnreachable: {
        title: "Fichier de clé inaccessible",
        description:
          "Le fichier de clé IndexNow à la racine du site n'a pas répondu 200 avec la clé, rien n'a été envoyé. Vérifie le log du serveur.",
      },
      network: {
        title: "IndexNow injoignable",
        description:
          "L'API IndexNow n'a pas répondu. La prochaine exécution renverra les URL en attente.",
      },
    },
    success: { title: "Terminé", description: "Exécution IndexNow terminée." },
  },
  enums: {
    status: {
      submitted: "Envoyé",
      unchanged: "Rien de nouveau",
      dryRun: "Simulation",
      notProduction: "Ignoré (hors production)",
    },
  },
  task: {
    description:
      "Toutes les heures : envoie à IndexNow les URL nouvelles ou modifiées du sitemap (Bing, Yandex et partenaires).",
  },
};
