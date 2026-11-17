import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed:
      "Impossible de trouver les rôles de l'utilisateur {{userId}} : {{error}}",
    batch_find_failed:
      "Impossible de rechercher en lot les rôles de {{count}} utilisateurs : {{error}}",
    not_found: "Rôle {{role}} introuvable pour l'utilisateur {{userId}}",
    lookup_failed:
      "Impossible de rechercher le rôle {{role}} de l'utilisateur {{userId}} : {{error}}",
    add_failed:
      "Impossible d'ajouter le rôle {{role}} à l'utilisateur {{userId}} : {{error}}",
    no_data_returned: "Aucune donnée renvoyée par la base de données",
    remove_failed:
      "Impossible de retirer le rôle {{role}} à l'utilisateur {{userId}} : {{error}}",
    check_failed:
      "Impossible de vérifier le rôle {{role}} de l'utilisateur {{userId}} : {{error}}",
    delete_failed:
      "Impossible de supprimer les rôles de l'utilisateur {{userId}} : {{error}}",
    endpoint_not_created:
      "L'endpoint des rôles utilisateur n'a pas encore été créé",
  },
  post: {
    title: "Rôles utilisateur",
    description: "Endpoint des rôles utilisateur",
    form: {
      title: "Configuration des rôles utilisateur",
      description: "Configurer les paramètres des rôles utilisateur",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse des rôles utilisateur",
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
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      database_connection_failed: {
        title: "Échec de connexion à la base de données",
        description: "Impossible de se connecter à la base de données",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Client",
      partnerAdmin: "Admin partenaire",
      partnerEmployee: "Employé partenaire",
      admin: "Admin",
      cliOff: "CLI désactivée",
      cliAuthBypass: "Contournement de l'auth CLI",
      aiToolOff: "Outil IA désactivé",
      webOff: "Web désactivé",
      mcpOff: "MCP désactivé",
      mcpVisible: "Visible sur MCP",
      productionOff: "Désactivé en production",
      skillOff: "Skill désactivée",
    },
  },
};
