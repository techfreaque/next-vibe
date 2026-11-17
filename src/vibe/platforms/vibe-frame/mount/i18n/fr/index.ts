import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Intégration",
    widget: "Widget",
    config: "Config",
  },
  post: {
    title: "Configuration Vibe Frame",
    titleShort: "Vibe Frame",
    description:
      "Renvoie les URL d'iframe des intégrations demandées. Le serveur lit les vrais cookies d'authentification (credentials: include) et émet des jetons d'échange à courte durée de vie : aucun secret n'apparaît dans les URL.",
    container: {
      title: "Configuration Vibe Frame",
      description:
        "Demander les URL d'iframe pour une ou plusieurs intégrations",
    },
    fields: {
      leadId: {
        label: "Lead ID",
        description:
          "Lead ID du visiteur fourni par la page hôte (cross-origin : illisible depuis les cookies)",
      },
      authToken: {
        label: "Jeton d'authentification",
        description:
          "Jeton JWT de la session de la page hôte (pour les widgets authentifiés)",
      },
      integrations: {
        label: "Intégrations",
        description: "Liste des intégrations à configurer",
      },
      integration: {
        label: "Intégration",
        description: "Configuration d'une intégration",
      },
      id: {
        label: "ID d'intégration",
        description: "Identifiant unique de cet emplacement d'intégration",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "Endpoint",
        description:
          "Identifiant d'endpoint à utiliser à la place (par défaut : id)",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "Déjà rendu",
        description:
          "true si cette intégration est déjà montée : le serveur peut l'ignorer",
      },
      theme: {
        label: "Thème",
        description: "Thème de couleurs du frame",
      },
      urlPathParams: {
        label: "Paramètres de chemin d'URL",
        description: "Paramètres de chemin d'URL encodés en JSON",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "Données",
        description: "Données de pré-remplissage encodées en JSON",
        placeholder: "{}",
      },
      widgets: {
        label: "Widgets",
        description: "Correspondance ID d'intégration vers config de widget",
      },
      widget: {
        label: "Widget",
        description: "Config du widget pour une intégration",
      },
      frameId: {
        label: "ID du frame",
        description: "ID unique du frame pour la communication via le bridge",
      },
      widgetUrl: {
        label: "URL du widget",
        description: "URL src de l'iframe avec jeton d'échange",
      },
    },
    errors: {
      validation: {
        title: "Paramètres invalides",
        description: "Les paramètres fournis sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Vous n'avez pas la permission",
      },
      notFound: {
        title: "Endpoint introuvable",
        description: "Un ou plusieurs endpoints n'existent pas",
      },
      internal: {
        title: "Échec de la configuration",
        description:
          "Une erreur s'est produite lors de la construction de la configuration",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
    },
    repository: {
      invalidUrlPathParams: "Format des paramètres de chemin d'URL invalide",
      invalidData: "Format de données invalide",
      endpointNotFound: "Endpoint introuvable",
      configFailed: "Impossible de construire la configuration du frame",
      tokenMintFailed: "Impossible d'émettre le jeton d'échange",
    },
    success: {
      configured: {
        title: "Configuration prête",
        description: "URL d'iframe générées",
      },
    },
  },
};
