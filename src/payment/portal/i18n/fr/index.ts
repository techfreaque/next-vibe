import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  success: {
    created: "Session du portail client créée",
  },
  post: {
    title: "Portail client",
    titleShort: "Portail client",
    description:
      "Créer une session du portail client pour gérer la facturation",
    form: {
      title: "Configuration du portail",
      description: "Configurer les paramètres du portail client",
    },
    returnUrl: {
      label: "URL de retour",
      description: "URL de redirection après la session du portail",
      placeholder: "https://example.com/dashboard",
    },
    response: {
      success: "Session du portail créée",
      message: "Message de statut",
      customerPortalUrl: "URL du portail client",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        detail: "Impossible d'ouvrir le portail de facturation : {{error}}",
        portalNotConfigured:
          "Le portail client Stripe n'est pas encore configuré. Configurez-le sur https://dashboard.stripe.com/test/settings/billing/portal",
        title: "Erreur serveur",
        description: "Une erreur interne du serveur est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      notFound: {
        noStripeCustomer: "Aucun client Stripe n'existe pour votre compte",
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données est survenu",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
};
