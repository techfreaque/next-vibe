import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description:
    "Prestataire de paiement en cryptomonnaies avec prise en charge des abonnements",

  cli: {
    post: {
      title: "NOWPayments CLI",
      description: "Gère le tunnel ngrok des webhooks NOWPayments",
      category: "Paiement",
      tags: {
        nowpayments: "NOWPayments",
        cli: "CLI",
        webhook: "Webhook",
      },
      operations: {
        check: "Vérifier",
        install: "Installer",
        tunnel: "Tunnel",
        status: "État",
      },
      form: {
        title: "Opérations NOWPayments CLI",
        description:
          "Configurez et gérez le tunnel ngrok des webhooks NOWPayments",
        fields: {
          operation: {
            label: "Opération",
            description: "Choisissez l'opération à exécuter",
            placeholder: "Choisir une opération",
          },
          port: {
            label: "Port",
            description: "Port local à exposer (par défaut : 3000)",
            placeholder: "3000",
          },
        },
      },
      errors: {
        validationFailed: {
          title: "Erreur de validation",
          description: "Opération ou paramètres invalides",
        },
        networkError: {
          title: "Erreur réseau",
          description: "Échec de la connexion réseau",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès refusé",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        serverError: {
          title: "Erreur serveur",
          description: "Impossible d'exécuter l'opération",
        },
        unknownError: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Des modifications ne sont pas enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de ressources",
        },
      },
      response: {
        title: "Réponse",
        description: "Résultat de l'opération",
        fields: {
          success: "Succès",
          installed: "Installé",
          version: "Version",
          status: "État",
          output: "Sortie",
          instructions: "Instructions",
          tunnelUrl: "URL du tunnel",
          webhookUrl: "URL du webhook",
        },
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
    },
  },

  errors: {
    userNotFound: {
      detail: "Aucun compte trouvé pour l'utilisateur {{userId}}",
      title: "Utilisateur introuvable",
      description: "L'utilisateur indiqué est introuvable",
    },
    customerCreationFailed: {
      detail:
        "Impossible de créer votre fiche client NOWPayments : {{error}} (utilisateur {{userId}})",
      title: "Échec de la création du client",
      description: "Impossible de créer le client NOWPayments : {{error}}",
    },
    productNotFound: {
      detail: "Produit inexistant : {{productId}}",
      title: "Produit introuvable",
      description: "Le produit indiqué est introuvable : {{productId}}",
    },
    userEmailRequired: {
      title: "E-mail utilisateur requis",
      description:
        "L'e-mail de l'utilisateur est requis pour les abonnements : {{userId}}",
    },
    checkoutCreationFailed: {
      detail: "Impossible de lancer le paiement en crypto : {{error}}",
      title: "Échec de la création du paiement",
      description:
        "Impossible de créer la session de paiement NOWPayments : {{error}}",
    },
    invoiceCreationFailed: {
      detail: "Impossible de créer la facture NOWPayments : {{error}}",
      title: "Échec de la création de la facture",
      description: "Impossible de créer la facture NOWPayments : {{error}}",
    },
    invalidApiKey: {
      detail:
        "Clé API NOWPayments invalide. Vérifiez NOWPAYMENTS_API_KEY dans votre environnement et contrôlez la clé sur https://nowpayments.io/app/dashboard",
      title: "Clé API invalide",
      description:
        "Clé API NOWPayments invalide. Vérifiez votre configuration et utilisez une clé API valide depuis https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Échec de la création de la formule",
      description:
        "Impossible de créer la formule d'abonnement NOWPayments : {{error}}",
    },
    subscriptionCreationFailed: {
      title: "Échec de la création de l'abonnement",
      description: "Impossible de créer l'abonnement NOWPayments : {{error}}",
    },
    subscriptionRetrievalFailed: {
      detail: "Impossible de charger l'abonnement NOWPayments : {{error}}",
      title: "Échec de la récupération de l'abonnement",
      description:
        "Impossible de récupérer l'abonnement NOWPayments : {{error}}",
    },
    subscriptionCancellationFailed: {
      detail: "Impossible de résilier l'abonnement NOWPayments : {{error}}",
      title: "Échec de la résiliation de l'abonnement",
      description:
        "Impossible de résilier l'abonnement NOWPayments : {{error}}",
    },
    subscriptionListFailed: {
      detail: "Impossible de lister les abonnements NOWPayments : {{error}}",
      title: "Échec du listage des abonnements",
      description:
        "Impossible de lister les abonnements NOWPayments : {{error}}",
    },
    notConfigured: {
      title: "NOWPayments non configuré",
      description:
        "NOWPayments n'est pas configuré : définissez NOWPAYMENTS_API_KEY et NOWPAYMENTS_IPN_SECRET dans votre .env",
    },
    webhookVerificationFailed: {
      detail: "Impossible de vérifier le webhook NOWPayments : {{error}}",
      invalidSignature: "La signature du webhook ne correspond pas",
      title: "Échec de la vérification du webhook",
      description:
        "Impossible de vérifier la signature du webhook NOWPayments : {{error}}",
    },
    paymentStatusFailed: {
      detail:
        "Impossible de lire le statut du paiement chez NOWPayments : {{error}}",
      title: "Échec de la récupération du statut de paiement",
      description:
        "Impossible de récupérer le statut du paiement chez NOWPayments : {{error}}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Facture créée",
      description: "Facture NOWPayments créée",
    },
    webhookVerified: {
      title: "Webhook vérifié",
      description: "Webhook NOWPayments vérifié",
    },
    paymentStatusRetrieved: {
      title: "Statut de paiement récupéré",
      description: "Statut du paiement NOWPayments récupéré",
    },
  },
};
