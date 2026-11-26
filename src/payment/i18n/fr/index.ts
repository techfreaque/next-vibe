import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  checkout: {
    title: "Créer un paiement d'abonnement",
    description: "Crée une session de paiement Stripe pour un abonnement",
    category: "Abonnement",

    tags: {
      subscription: "abonnement",
      checkout: "paiement",
      stripe: "stripe",
    },

    form: {
      title: "Configuration du paiement",
      description: "Configurez les paramètres de la session de paiement",
      fields: {
        planId: {
          label: "Formule d'abonnement",
          description: "Choisissez la formule d'abonnement",
          placeholder: "Choisir une formule",
        },
        billingInterval: {
          label: "Périodicité de facturation",
          description: "Choisissez la fréquence de facturation",
          placeholder: "Choisir une périodicité",
        },
        provider: {
          label: "Moyen de paiement",
          description: "Choisissez comment vous souhaitez payer",
          placeholder: "Choisir un prestataire de paiement",
        },
        metadata: {
          label: "Métadonnées",
          description: "Métadonnées supplémentaires de la session de paiement",
          placeholder: "Saisir les métadonnées en JSON",
        },
      },
    },

    response: {
      success: "Session de paiement créée",
      sessionId: "ID de session Stripe",
      checkoutUrl: "URL de paiement",
      message: "Message d'état",
    },

    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur de connexion réseau",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données",
      },
    },

    success: {
      title: "Succès",
      description: "Session de paiement créée",
    },

    post: {
      title: "Créer une session de paiement",
      description: "Crée une nouvelle session de paiement d'abonnement",
      form: {
        title: "Configuration de la session de paiement",
        description: "Configurez les paramètres de la session de paiement",
      },
      response: {
        title: "Réponse du paiement",
        description: "Données de la session de paiement",
      },
      errors: {
        alreadySubscribed: {
          title: "Déjà abonné",
          description: "Vous avez déjà un abonnement actif",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de paiement invalides",
          reason: {
            enterpriseCustomPricing:
              "La formule ENTERPRISE nécessite une tarification sur mesure",
          },
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur de connexion réseau",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Session de paiement introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données",
        },
      },
      success: {
        title: "Succès",
        description: "Session de paiement créée",
      },
    },

    error: "Une erreur s'est produite pendant le paiement",

    plans: {
      starter: {
        title: "Starter",
      },
    },

    billing: {
      monthly: "Mensuel",
      yearly: "Annuel",
    },
  },
  invoice: {
    category: "Facturation",
    tags: {
      payment: "paiement",
      invoice: "facture",
      transactions: "transactions",
    },
    defaultItem: "Article de facture",
    success: {
      created: "Facture créée",
    },
    post: {
      title: "Facture",
      description: "Endpoint de facture",
      form: {
        title: "Configuration de la facture",
        description: "Configurez les paramètres de la facture",
      },
      response: {
        success: "Facture créée",
        message: "Message d'état",
        invoice: {
          title: "Détails de la facture",
          description: "Informations de la facture générée",
          id: "ID de facture",
          userId: "ID utilisateur",
          stripeInvoiceId: "ID de facture Stripe",
          invoiceNumber: "Numéro de facture",
          amount: "Montant",
          currency: "Devise",
          status: "Statut",
          invoiceUrl: "URL de la facture",
          invoicePdf: "PDF de la facture",
          dueDate: "Échéance",
          paidAt: "Payée le",
          createdAt: "Créée le",
          updatedAt: "Mise à jour le",
        },
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
          title: "Interdit",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données",
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
      widget: {
        back: "Retour",
      },
    },
    customerId: {
      label: "ID client",
      description: "Identifiant client Stripe",
      placeholder: "Saisir l'ID client",
    },
    amount: {
      label: "Montant",
      description: "Montant de la facture",
      placeholder: "Saisir le montant",
    },
    currency: {
      label: "Devise",
      description: "Code de devise",
      placeholder: "Choisir une devise",
      usd: "Dollar américain (USD)",
      eur: "Euro (EUR)",
      pln: "Złoty polonais (PLN)",
    },
    description: {
      label: "Description",
      description: "Description de la facture",
      placeholder: "Saisir une description",
    },
    dueDate: {
      label: "Échéance",
      description: "Date d'échéance du paiement",
      placeholder: "Choisir l'échéance",
    },
    metadata: {
      label: "Métadonnées",
      description: "Métadonnées supplémentaires",
      placeholder: "Saisir les métadonnées en JSON",
    },
  },
  portal: {
    success: {
      created: "Session du portail client créée",
    },
    post: {
      title: "Portail client",
      description:
        "Crée une session du portail client pour gérer la facturation",
      form: {
        title: "Configuration du portail",
        description: "Configurez les paramètres du portail client",
      },
      returnUrl: {
        label: "URL de retour",
        description: "URL de redirection après la session du portail",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "Session du portail créée",
        message: "Message d'état",
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
          title: "Interdit",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de données",
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
  },
  refund: {
    title: "Effectuer un remboursement",
    description: "Rembourse une transaction de paiement",
    category: "Remboursements",

    tags: {
      refund: "remboursement",
      transaction: "transaction",
    },

    success: {
      created: "Remboursement effectué",
    },

    reason: {
      requestedByCustomer: "Demandé par le client",
    },

    form: {
      title: "Formulaire de remboursement",
      description: "Saisissez les détails du remboursement",
      fields: {
        transactionId: {
          label: "ID de transaction",
          description: "ID de la transaction à rembourser",
          placeholder: "Saisir l'ID de transaction",
        },
        amount: {
          label: "Montant du remboursement",
          description:
            "Montant à rembourser (facultatif, montant total par défaut)",
          placeholder: "Saisir le montant",
        },
        reason: {
          label: "Motif du remboursement",
          description: "Motif du remboursement",
          placeholder: "Saisir le motif",
        },
        metadata: {
          label: "Métadonnées",
          description: "Métadonnées supplémentaires du remboursement",
          placeholder: "Saisir les métadonnées en JSON",
        },
      },
    },

    post: {
      title: "Effectuer un remboursement",
      description: "Rembourse un paiement",
      response: {
        success: "Remboursement effectué",
        message: "Message d'état",
        refund: {
          title: "Détails du remboursement",
          description: "Informations sur le remboursement effectué",
          id: "ID du remboursement",
          userId: "ID utilisateur",
          transactionId: "ID de transaction",
          stripeRefundId: "ID de remboursement Stripe",
          amount: "Montant du remboursement",
          currency: "Devise",
          status: "Statut du remboursement",
          reason: "Motif du remboursement",
          createdAt: "Créé le",
          updatedAt: "Mis à jour le",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de remboursement invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Interdit",
          description: "Permission refusée",
        },
        notFound: {
          title: "Introuvable",
          description: "Transaction introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur de connexion réseau",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de remboursement détecté",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Des modifications ne sont pas enregistrées",
        },
      },
      success: {
        title: "Succès",
        description: "Remboursement effectué",
      },
    },
  },
  providers: {
    stripe: {
      title: "Intégration Stripe CLI",
      description: "Gère les opérations Stripe CLI et l'écoute des webhooks",
      category: "Intégration de paiement",
      tags: {
        stripe: "Stripe",
        cli: "Ligne de commande",
        webhook: "Webhook",
      },

      operations: {
        check: "Vérifier l'installation",
        install: "Installer Stripe CLI",
        listen: "Démarrer l'écoute des webhooks",
        login: "Se connecter à Stripe",
        status: "Vérifier l'état",
      },

      form: {
        title: "Configuration Stripe CLI",
        description: "Configurez les opérations Stripe CLI et les webhooks",
        fields: {
          operation: {
            label: "Type d'opération",
            description: "Choisissez l'opération Stripe CLI à exécuter",
            placeholder: "Choisir une opération...",
          },
          port: {
            label: "Numéro de port",
            description: "Port de transfert des webhooks (1000-65535)",
            placeholder: "4242",
          },
          events: {
            label: "Événements webhook",
            description: "Choisissez les événements Stripe à écouter",
            placeholder: "Choisir les événements à surveiller...",
            paymentIntentSucceeded: "Payment Intent réussi",
            paymentIntentFailed: "Payment Intent échoué",
            subscriptionCreated: "Abonnement créé",
            subscriptionUpdated: "Abonnement mis à jour",
            invoicePaymentSucceeded: "Paiement de facture réussi",
            invoicePaymentFailed: "Paiement de facture échoué",
          },
          forwardTo: {
            label: "URL de transfert",
            description: "Endpoint local vers lequel transférer les webhooks",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "Ignorer la vérification SSL",
            description:
              "Ignore la vérification du certificat SSL en développement",
          },
        },
      },

      response: {
        success: "Opération réussie",
        installed: "État de l'installation de Stripe CLI",
        version: "Version installée de Stripe CLI",
        status: "État actuel de l'opération",
        output: "Sortie et logs de la commande",
        instructions: "Étapes suivantes et instructions",
        webhookEndpoint: "URL de l'endpoint webhook",
      },

      login: {
        instructions:
          "Pour vous authentifier auprès de Stripe, lancez 'stripe login' dans votre terminal et suivez les instructions pour connecter votre compte Stripe.",
      },

      status: {
        authenticated: "Authentifié et prêt",
        not_authenticated: "Non authentifié : lancez 'stripe login'",
        not_installed: "Stripe CLI n'est pas installé",
      },

      errors: {
        validation: {
          title: "Configuration invalide",
          description: "Vérifiez votre configuration Stripe CLI et réessayez",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre les services Stripe",
        },
        unauthorized: {
          title: "Non autorisé",
          description:
            "Vous n'avez pas l'autorisation d'effectuer cette opération",
        },
        forbidden: {
          title: "Accès interdit",
          description: "Cette opération n'est pas autorisée pour votre compte",
        },
        notFound: {
          title: "Ressource introuvable",
          description: "La ressource Stripe demandée est introuvable",
        },
        serverError: {
          title: "Erreur serveur",
          description: "Une erreur s'est produite pendant l'opération Stripe",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite avec Stripe CLI",
        },
        customerRetrievalFailed: {
          title: "Échec de la récupération du client",
          description:
            "Impossible de récupérer les informations du client Stripe",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description:
            "Vous avez des modifications de configuration non enregistrées",
        },
        conflict: {
          title: "Conflit d'opération",
          description: "Une autre opération Stripe est déjà en cours",
        },
        execution_failed: "L'opération Stripe CLI n'a pas pu s'exécuter",
        userNotFound: {
          title: "Utilisateur introuvable",
          description: "L'utilisateur indiqué est introuvable",
        },
        customerCreationFailed: {
          title: "Échec de la création du client",
          description: "Impossible de créer le client Stripe",
        },
        checkoutCreationFailed: {
          title: "Échec de la création du paiement",
          description: "Impossible de créer la session de paiement Stripe",
        },
        webhookVerificationFailed: {
          title: "Échec de la vérification du webhook",
          description: "Impossible de vérifier la signature du webhook",
        },
        subscriptionRetrievalFailed: {
          title: "Échec de la récupération de l'abonnement",
          description: "Impossible de récupérer l'abonnement chez Stripe",
        },
        subscriptionCancellationFailed: {
          title: "Échec de la résiliation de l'abonnement",
          description: "Impossible de résilier l'abonnement chez Stripe",
        },
        priceCreationFailed: {
          title: "Échec de la création du prix",
          description: "Impossible de créer le prix chez Stripe",
        },
        notConfigured: {
          title: "Stripe non configuré",
          description:
            "Stripe n'est pas configuré : définissez STRIPE_SECRET_KEY dans votre .env",
        },
        stripeCliNotInstalled: "Stripe CLI n'est pas installé",
        listenerFailed: "Impossible de démarrer l'écoute des webhooks Stripe",
      },

      success: {
        title: "Opération réussie",
        description: "Opération Stripe CLI réussie",
      },

      installInstructions: {
        documentation:
          "Installez Stripe CLI en suivant la documentation officielle : https://docs.stripe.com/stripe-cli",
        quickInstallation: "Installation rapide :",
        macOS: {
          title: "macOS (avec Homebrew) :",
          command: "brew install stripe/stripe-cli/stripe",
        },
        linux: {
          title: "Linux (avec le gestionnaire de paquets) :",
          debian: {
            title: "Debian/Ubuntu",
          },
          fedora: {
            title: "CentOS/RHEL/Fedora",
          },
        },
        windows: {
          title: "Windows :",
          scoop: {
            title: "Avec Scoop",
          },
          github: {
            title: "Ou téléchargez-le directement depuis les releases GitHub :",
            url: "https://github.com/stripe/stripe-cli/releases",
          },
        },
        authentication: {
          title: "Après l'installation, authentifiez-vous avec :",
          command: "stripe login",
        },
      },
    },
    nowpayments: {
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
          title: "Utilisateur introuvable",
          description: "L'utilisateur indiqué est introuvable",
        },
        customerCreationFailed: {
          title: "Échec de la création du client",
          description: "Impossible de créer le client NOWPayments : {error}",
        },
        productNotFound: {
          title: "Produit introuvable",
          description: "Le produit indiqué est introuvable : {productId}",
        },
        userEmailRequired: {
          title: "E-mail utilisateur requis",
          description:
            "L'e-mail de l'utilisateur est requis pour les abonnements : {userId}",
        },
        checkoutCreationFailed: {
          title: "Échec de la création du paiement",
          description:
            "Impossible de créer la session de paiement NOWPayments : {error}",
        },
        invoiceCreationFailed: {
          title: "Échec de la création de la facture",
          description: "Impossible de créer la facture NOWPayments : {error}",
        },
        invalidApiKey: {
          title: "Clé API invalide",
          description:
            "Clé API NOWPayments invalide. Vérifiez votre configuration et utilisez une clé API valide depuis https://nowpayments.io/app/dashboard",
        },
        planCreationFailed: {
          title: "Échec de la création de la formule",
          description:
            "Impossible de créer la formule d'abonnement NOWPayments : {error}",
        },
        subscriptionCreationFailed: {
          title: "Échec de la création de l'abonnement",
          description: "Impossible de créer l'abonnement NOWPayments : {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Échec de la récupération de l'abonnement",
          description:
            "Impossible de récupérer l'abonnement NOWPayments : {error}",
        },
        subscriptionCancellationFailed: {
          title: "Échec de la résiliation de l'abonnement",
          description:
            "Impossible de résilier l'abonnement NOWPayments : {error}",
        },
        subscriptionListFailed: {
          title: "Échec du listage des abonnements",
          description:
            "Impossible de lister les abonnements NOWPayments : {error}",
        },
        notConfigured: {
          title: "NOWPayments non configuré",
          description:
            "NOWPayments n'est pas configuré : définissez NOWPAYMENTS_API_KEY et NOWPAYMENTS_IPN_SECRET dans votre .env",
        },
        webhookVerificationFailed: {
          title: "Échec de la vérification du webhook",
          description:
            "Impossible de vérifier la signature du webhook NOWPayments : {error}",
        },
        paymentStatusFailed: {
          title: "Échec de la récupération du statut de paiement",
          description:
            "Impossible de récupérer le statut du paiement chez NOWPayments : {error}",
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
    },
  },

  category: "Facturation",

  form: {
    title: "Configuration du paiement",
    description: "Configurez les paramètres du paiement",
  },

  tags: {
    payment: "paiement",
    stripe: "stripe",
    checkout: "paiement en ligne",
    list: "liste",
    transactions: "transactions",
    info: "infos",
  },

  create: {
    title: "Créer une session de paiement",
    titleShort: "Créer une session",
    description: "Crée une nouvelle session de paiement avec Stripe",
    form: {
      title: "Configuration du paiement",
      description: "Configurez les paramètres de la session de paiement",
    },
    paymentMethodTypes: {
      label: "Moyens de paiement",
      description: "Choisissez les moyens de paiement acceptés",
    },
    successUrl: {
      label: "URL de succès",
      description: "URL de redirection après un paiement réussi",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "URL d'annulation",
      description: "URL de redirection si le paiement est annulé",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "E-mail du client",
      description: "Adresse e-mail du client pour ce paiement",
      placeholder: "client@example.com",
    },
    response: {
      success: "Session de paiement créée",
      sessionId: "ID de session Stripe",
      sessionUrl: "URL de session Stripe",
      checkoutUrl: "URL de paiement",
      message: "Message d'état",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de paiement invalides",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne s'est produite",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Permission refusée",
      },
      notFound: {
        detail: "Aucun compte trouvé pour l'utilisateur {{userId}}",
        title: "Introuvable",
        description: "Session de paiement introuvable",
      },
      server: {
        detail: "Impossible de créer la session de paiement : {{error}}",
        stripeNotConfigured:
          "Stripe n'est pas encore configuré. Ajoutez STRIPE_SECRET_KEY à votre environnement.",
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur de connexion réseau",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de paiement détecté",
      },
    },
    success: {
      title: "Succès",
      description: "Session de paiement créée",
      message: "Session de paiement créée",
    },
  },

  get: {
    title: "Vos paiements",
    titleShort: "Paiements",
    description:
      "Les dix dernières opérations de paiement de votre compte au maximum.",
    summary: {
      empty: "Aucun paiement",
      emptyDescription: "Vos paiements apparaîtront ici.",
      loading: "Chargement de vos paiements…",
      error: "Impossible de charger vos paiements",
      retry: "Réessayer",
      amountUnavailable: "Montant indisponible",
    },
    form: {
      title: "Recherche de paiements",
      description: "Consultez les informations de paiement",
    },
    response: {
      success: "Données de paiement récupérées",
      sessionUrl: "URL de la session de paiement",
      sessionId: "ID de la session de paiement",
      message: "Message d'état",
      transactions: "Transactions",
      paymentMethods: "Moyens de paiement",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de recherche invalides",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne s'est produite",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Permission refusée",
      },
      notFound: {
        title: "Introuvable",
        description: "Informations de paiement introuvables",
      },
      server: {
        detail:
          "Impossible de charger vos informations de paiement : {{error}}",
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur de connexion réseau",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de paiement détecté",
      },
    },
    success: {
      title: "Succès",
      description: "Informations de paiement récupérées",
    },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de paiement invalides",
    },
    notFound: {
      title: "Introuvable",
      description: "Paiement introuvable",
    },
    unauthorized: {
      signInRequired: "Connectez-vous pour gérer vos paiements",
      title: "Non autorisé",
      description: "Authentification requise",
    },
    forbidden: {
      title: "Interdit",
      description: "Permission refusée",
    },
    server: {
      detail: "Le webhook de paiement n'a pas pu être traité : {{error}}",
      title: "Erreur serveur",
      description: "Une erreur interne du serveur s'est produite",
    },
    network: {
      title: "Erreur réseau",
      description: "Erreur de connexion réseau",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Des modifications ne sont pas enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Conflit de paiement détecté",
    },
    notImplemented: {
      title: "Non implémenté",
      description:
        "Cette fonctionnalité du prestataire de paiement n'est pas encore disponible",
    },
    customerCreationFailed: "Impossible de créer le client Stripe",
    customerNotFound: "Client Stripe introuvable",
    localMode: "Le paiement est désactivé en mode de développement local.",
    webhookVerificationFailed:
      "Échec de la vérification de la signature du webhook : {{error}}",
  },

  success: {
    title: "Succès",
    description: "Opération réussie",
    sessionCreated: "Session de paiement créée",
    infoRetrieved: "Informations de paiement récupérées",
  },

  amount: {
    label: "Montant",
    description: "Montant du paiement dans la devise choisie",
    placeholder: "Saisir le montant",
  },
  currency: {
    label: "Devise",
    description: "Devise du paiement",
    placeholder: "Choisir une devise",
    usd: "Dollar américain (USD)",
    eur: "Euro (EUR)",
    pln: "Złoty polonais (PLN)",
  },
  mode: {
    label: "Mode de paiement",
    description: "Type de session de paiement",
    placeholder: "Choisir un mode de paiement",
  },
  successUrl: {
    label: "URL de succès",
    description: "URL de redirection après un paiement réussi",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "URL d'annulation",
    description: "URL de redirection si le paiement est annulé",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Métadonnées",
    description: "Métadonnées supplémentaires de la session de paiement",
    placeholder: "Saisir les métadonnées en JSON",
  },
  paymentId: {
    label: "ID de paiement",
    description: "ID du paiement à récupérer",
    placeholder: "Saisir l'ID de paiement",
  },
  sessionId: {
    label: "ID de session",
    description: "ID de session Stripe à consulter",
    placeholder: "Saisir l'ID de session",
  },
  limit: {
    label: "Limite",
    description: "Nombre maximal de résultats",
    placeholder: "20",
  },
  offset: {
    label: "Décalage",
    description: "Nombre de résultats à ignorer",
    placeholder: "0",
  },
  priceId: {
    label: "ID de prix",
    description: "Identifiant de prix Stripe du produit",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "Prestataire de paiement",
    description: "Choisissez votre moyen de paiement",
    placeholder: "Choisir un prestataire de paiement",
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "En attente",
      processing: "En cours",
      succeeded: "Réussi",
      failed: "Échoué",
      canceled: "Annulé",
      refunded: "Remboursé",
    },
    paymentMethodType: {
      card: "Carte bancaire",
      bankTransfer: "Virement bancaire",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "Prélèvement SEPA",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Moyen de paiement requis",
      requiresConfirmation: "Confirmation requise",
      requiresAction: "Action requise",
      processing: "En cours",
      requiresCapture: "Capture requise",
      canceled: "Annulé",
      succeeded: "Réussi",
    },
    checkoutMode: {
      payment: "Paiement",
      subscription: "Abonnement",
      setup: "Configuration",
    },
    refundStatus: {
      pending: "En attente",
      succeeded: "Réussi",
      failed: "Échoué",
      canceled: "Annulé",
    },
    disputeStatus: {
      warningNeedsResponse: "Alerte : réponse requise",
      warningUnderReview: "Alerte : en cours d'examen",
      warningClosed: "Alerte : clôturée",
      needsResponse: "Réponse requise",
      underReview: "En cours d'examen",
      chargeRefunded: "Débit remboursé",
      won: "Gagné",
      lost: "Perdu",
    },
    invoiceStatus: {
      draft: "Brouillon",
      open: "Ouverte",
      paid: "Payée",
      void: "Annulée",
      uncollectible: "Irrécouvrable",
    },
    taxStatus: {
      complete: "Complet",
      failed: "Échoué",
      requiresLocation: "Localisation requise",
    },
    paymentInterval: {
      month: "Mensuel",
      year: "Annuel",
      one_time: "Ponctuel",
    },
    manualPaymentMethod: {
      cash: "Espèces",
      bankTransfer: "Virement bancaire",
      other: "Autre",
    },
    billStatus: {
      DRAFT: "Brouillon",
      RECEIVED: "Reçue",
      APPROVED: "Approuvée",
      PAID: "Payée",
      DISPUTED: "Contestée",
    },
    estimateStatus: {
      DRAFT: "Brouillon",
      SENT: "Envoyé",
      ACCEPTED: "Accepté",
      DECLINED: "Refusé",
      EXPIRED: "Expiré",
      CONVERTED: "Converti",
    },
  },
};
