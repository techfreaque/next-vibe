import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  setup: {
    install: {
      post: {
        title: "Installer",
        description: "Endpoint d'installation",
        form: {
          title: "Configuration de l'installation",
          description: "Configurer les paramètres d'installation",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse de l'installation",
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
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données s'est produit",
          },
        },
        success: {
          title: "Succès",
          description: "Opération terminée",
        },
      },
    },
    status: {
      post: {
        title: "Statut d'installation de la CLI",
        description: "Vérifier l'état actuel de l'installation de la CLI Vibe",
        form: {
          title: "Configuration du statut",
          description: "Configurer les paramètres du statut",
        },
        response: {
          title: "Statut d'installation",
          description: "Détails de l'installation actuelle de la CLI",
          fields: {
            success: "Statut de l'opération",
            installed: "Installée",
            version: "Version de la CLI",
            path: "Chemin d'installation",
            message: "Message de statut",
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
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données s'est produit",
          },
        },
        success: {
          title: "Succès",
          description: "Opération terminée",
        },
      },
    },
    uninstall: {
      post: {
        title: "Désinstaller",
        description: "Endpoint de désinstallation",
        form: {
          title: "Configuration de la désinstallation",
          description: "Configurer les paramètres de désinstallation",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse de la désinstallation",
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
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données s'est produit",
          },
        },
        success: {
          title: "Succès",
          description: "Opération terminée",
        },
      },
    },
    update: {
      post: {
        title: "Mettre à jour",
        description: "Endpoint de mise à jour",
        form: {
          title: "Configuration de la mise à jour",
          description: "Configurer les paramètres de mise à jour",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse de la mise à jour",
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
            title: "Accès refusé",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Un conflit de données s'est produit",
          },
        },
        success: {
          title: "Succès",
          description: "Opération terminée",
        },
      },
    },
  },
  request: "Requête",
  response: {
    success: "Réponse",
    error: "Erreur",
  },
  auth: {
    errors: {
      userNotFound:
        "Utilisateur CLI avec l'e-mail {{email}} introuvable dans la base de données. Lancez d'abord 'vibe seed'.",
      databaseError:
        "Erreur de base de données lors de la récupération de l'utilisateur CLI : {{error}}",
      authNotAvailable: "L'authentification n'est pas disponible",
    },
  },
  vibe: {
    noFields: "Aucun champ à afficher",
    startingUp: "Démarrage de la CLI Vibe...",
    executeCommand: "Exécution de la commande",
    executing: "Exécution",
    listCommands: "Lister toutes les commandes disponibles",
    output: "Format de sortie",
    utils: {
      debug: {
        executionSummary:
          "Exécution : {{executionSeconds}} s | Surcoût : {{overheadSeconds}} s | Total : {{totalSeconds}} s",
      },
    },
    help: {
      title: "Aide de la CLI Vibe",
      description: "CLI Vibe : l'outil d'exécution d'API nouvelle génération",
      usage: "Utilisation : vibe <command> [options]",
      commands: "Commandes disponibles",
      options: "Options",
      examples: "Exemples",
      locale: "Langue à utiliser (en-GLOBAL, de-DE, pl-PL)",
      verbose: "Activer la sortie détaillée",
      target:
        "Cible d'exécution : dev (par défaut) ou local (base de preview avec --hermes)",
      thea: "Raccourci pour --remote (cible l'instance 'thea')",
      remote:
        "Exécuter sur une instance distante par ID (par défaut : thea). La connexion est lue dans la base active.",
      interactive: "Passer en mode interactif",
    },
    errors: {
      routeNotFound: "Outil introuvable : {{toolName}}",
      executionFailed: "Échec de l'exécution",
      executionFailedDetail: "Échec de l'exécution : {{error}}",
      unknownError: "Une erreur inconnue s'est produite",
      publicPayloadNotSupported: "Payload public non pris en charge",
      invalidTokenPayload: "Payload du jeton invalide",
      invalidToken: "Jeton invalide",
      signingFailed: "Échec de la signature du jeton",
      userNotFound: "Utilisateur introuvable",
      authenticationFailed: "Échec de l'authentification",
      invalidFormat: "Format de session invalide",
      sessionExpired: "Session expirée",
      notFound: "Session introuvable",
      readFailed: "Impossible de lire la session",
      invalidData: "Données de session invalides",
      writeFailed: "Impossible d'écrire la session : {{error}}",
      deleteFailed: "Impossible de supprimer la session : {{error}}",
      storeFailed: "Impossible d'enregistrer la session : {{error}}",
      clearFailed: "Impossible d'effacer la session : {{error}}",
      setLeadIdCookieFailed: "Impossible de définir le cookie lead ID",
      remoteNoToken: "La session distante n'a pas de jeton actif",
      remoteExpired: "Session distante expirée",
      remoteNotFound:
        "Aucune session distante trouvée. Lancez : vibe login --target remote",
      remoteReadFailed: "Impossible de lire la session distante",
      remoteWriteFailed: "Impossible d'écrire la session distante",
      remoteClearFailed: "Impossible d'effacer la session distante",
      remoteNoConnection:
        "Aucune connexion active pour l'instance '{{instanceId}}'. Lancez : vibe connect <url>",
      remoteNotLoggedIn:
        "Non connecté à l'hôte distant. Lancez : vibe --remote login",
      remoteNoLeadId:
        "Impossible d'obtenir une identité auprès de l'hôte distant",
      remoteServerError: "Erreur du serveur distant",
      remoteNotAvailable:
        "L'exécution distante n'est pas disponible dans ce build",
    },
    endpoints: {
      endpointHandler: {
        error: {
          form_validation_failed: "Échec de la validation du formulaire",
          unauthorized: "Accès non autorisé",
          errors: {
            unknown_validation_error: "Erreur de validation inconnue",
            invalid_request_data: "Données de requête invalides",
            invalid_url_parameters: "Paramètres d'URL invalides",
          },
          general: {
            internal_server_error: "Erreur interne du serveur",
          },
        },
      },
      renderers: {
        cliUi: {
          helpHandler: {
            noDescription: "Aucune description disponible",
            flagDataDesc: "Données de la requête au format JSON",
            flagUserTypeDesc: "Type d'utilisateur (admin, customer, public)",
            flagLocaleDesc: "Langue à utiliser (en-GLOBAL, de-DE, pl-PL)",
            flagOutputDesc: "Format de sortie (pretty, json)",
            flagVerboseDesc: "Activer la sortie détaillée",
            flagDryRunDesc: "Simulation sans exécution",
            usageLabel: "Utilisation",
            availableCommandsLabel: "Commandes disponibles",
            globalOptionsLabel: "Options globales",
            examplesLabel: "Exemples",
          },
          noEndpoint:
            "Cette fonctionnalité n'est pas encore disponible. Réessayez plus tard",
          widgets: {
            common: {
              noDataAvailable: "Aucune donnée disponible",
              noIssuesFound: "Aucun problème trouvé",
              invalidDataFormat: "Format de données invalide",
              invalidFormType:
                "Le contexte de formulaire n'est pas un état de formulaire Ink. Impossible d'afficher la saisie interactive.",
              info: "Info",
              items: "éléments",
              andMoreItems: "et {{count}} éléments de plus",
              affectedFiles: "Fichiers concernés",
              summary: "Résumé",
              files: "Fichiers",
              issues: "Problèmes",
              other: "Autres",
              error: "Erreur",
              errors: "Erreurs",
              warning: "Avertissement",
              warnings: "Avertissements",
              hints: {
                spaceToToggle: "(espace pour basculer)",
                arrowsToChange: "(←/→ pour changer)",
                dollarPrompt: "$ ",
                executing: "Exécution...",
                tabNextField:
                  "tab : champ suivant | entrée : valider | q/échap : quitter",
                ctrlCExitHint: "Appuyez de nouveau sur Ctrl+C pour quitter",
                escExitHint: "Appuyez de nouveau sur Échap pour quitter",
              },
            },
            pagination: {
              notImplemented:
                "Pagination non disponible en CLI. Utilisez des filtres pour affiner les résultats.",
            },
          },
        },
      },
    },
    interactive: {
      welcome: "Bienvenue dans le mode interactif de Vibe",
      goodbye: "Au revoir !",
      help: {
        selectCategory: "Choisissez une catégorie pour parcourir les outils",
        selectTool: "Choisissez un outil pour voir ses détails",
        category: "Catégorie ",
        method: "Méthode ",
        credits: "Crédits  ",
        callAs: "Appel     ",
        fields: "Champs",
        hintsNavSelect: "flèches : naviguer | entrée : choisir | q : quitter",
        hintsNavSelectBack:
          "flèches : naviguer | entrée : choisir | échap : retour | q : quitter",
        hintsExecuteBack: "entrée : exécuter | échap : retour | q : quitter",
        hintsBack: "entrée/échap : retour | q : quitter",
        success: "Succès",
        error: "Erreur",
        result: "Résultat",
      },
      navigation: {
        rootName: "Racine",
        directoryIcon: "📁",
        upIcon: "⬆️",
        goUp: "Remonter",
        routeIcon: "🔗",
        routes: "Routes",
        settingsIcon: "⚙️",
        settings: "Paramètres",
        exitIcon: "🚪",
        exit: "Quitter",
        navigate: "Naviguer",
        route: "Route",
        method: "Méthode",
        description: "Description",
        noDefinition: "Aucune définition trouvée",
        executionFailed: "Échec de l'exécution",
        executeAnother: "Exécuter autre chose",
        selectLocale: "Choisir la langue",
        englishGlobal: "Anglais (Global)",
        requestData: "Données de la requête",
        urlParameters: "Paramètres d'URL",
        preview: "Aperçu",
        executeWithParams: "Exécuter avec des paramètres",
        navigationError: "Erreur de navigation",
        chooseSettingToModify: "Choisissez le paramètre à modifier",
        outputFormatCurrent: "Format de sortie (actuel",
        verboseModeCurrent: "Mode détaillé (actuel",
        localeCurrent: "Langue (actuelle",
        backToMainMenu: "Retour au menu principal",
        chooseOutputFormat: "Choisissez le format de sortie",
        prettyFormatted: "Mise en forme lisible",
        jsonRaw: "JSON (brut)",
        enableVerboseOutput: "Activer la sortie détaillée",
        chooseLocale: "Choisissez la langue",
        german: "Allemand",
        polish: "Polonais",
        settingUpdated: "Paramètre mis à jour",
        viewAllRoutes: "Voir toutes les routes",
        selectRoute: "Choisissez une route à exécuter",
        backToNavigation: "Retour à la navigation",
      },
    },
  },
};
