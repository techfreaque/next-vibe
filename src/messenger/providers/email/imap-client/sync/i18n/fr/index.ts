import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Client IMAP",

  title: "Synchronisation IMAP",
  titleShort: "Synchro IMAP",
  description: "Service de synchronisation IMAP",
  container: {
    title: "Configuration de la synchronisation IMAP",
    description: "Paramétrez la synchronisation IMAP",
  },
  accountIds: {
    label: "ID des comptes",
    description: "ID des comptes IMAP à synchroniser",
    placeholder: "Saisir les ID de comptes, séparés par des virgules",
  },
  force: {
    label: "Forcer la synchronisation",
    description: "Synchroniser même si une synchronisation est récente",
  },
  dryRun: {
    label: "Simulation",
    description: "Exécuter un test sans rien modifier",
  },
  maxMessages: {
    label: "Messages max.",
    description: "Nombre maximal de messages à synchroniser par dossier",
    placeholder: "Saisir le nombre maximal de messages",
  },
  post: {
    title: "Synchroniser",
    description: "Endpoint de synchronisation",
    form: {
      title: "Configuration de la synchronisation",
      description: "Paramétrez la synchronisation",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de la synchronisation",
      result: {
        title: "Résultats de la synchronisation",
        description: "Résultats détaillés de la synchronisation",
        accountsProcessed: "Comptes traités",
        foldersProcessed: "Dossiers traités",
        messagesProcessed: "Messages traités",
        messagesAdded: "Messages ajoutés",
        messagesUpdated: "Messages mis à jour",
        messagesDeleted: "Messages supprimés",
        duration: "Durée",
      },
      errors: {
        error: {
          title: "Erreur de synchronisation",
          description: "Détails de l'erreur",
          code: "Code d'erreur",
          message: "Message d'erreur",
        },
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête non valides",
      },
      server: {
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
        title: "Accès refusé",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données est survenu",
      },
    },
    success: {
      title: "Succès",
      description: "Opération terminée",
    },
  },
  errors: {
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de requête non valides",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
      detail_sync: "Échec de la synchronisation : {{error}}",
      detail_status:
        "Impossible de lire le statut de synchronisation : {{error}}",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Accès interdit",
    },
  },
  success: {
    title: "Succès",
    description: "Opération terminée",
  },
  widget: {
    title: "Synchronisation IMAP complète",
    options: "Options de synchronisation",
    noAccounts: "Aucun compte IMAP configuré",
    result: "Résultat de la synchronisation",
    duration: "Durée",
    errors: "Erreurs",
    accountsProcessed: "Comptes traités",
    foldersProcessed: "Dossiers traités",
    messagesProcessed: "Messages traités",
    messagesAdded: "Messages ajoutés",
    messagesUpdated: "Messages mis à jour",
    messagesDeleted: "Messages supprimés",
    submit: "Lancer la synchronisation",
    submitting: "Synchronisation...",
  },
};
