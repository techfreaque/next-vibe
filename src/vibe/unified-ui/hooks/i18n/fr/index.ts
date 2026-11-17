import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "Une erreur est survenue",
      defaultMessage: "Une erreur inattendue s'est produite",
      errorDetails: "Détails de l'erreur",
    },
    error: {
      title: "Erreur",
    },
    chart: {
      noDataAvailable: "Aucune donnée disponible",
      noDataToDisplay: "Aucune donnée à afficher",
    },
    codeQualityFiles: {
      affectedFiles: "Fichiers concernés",
      andMoreFiles: "... et {{count}} autre(s) fichier(s)",
    },
    codeQualityList: {
      noIssues: "Aucun problème trouvé",
    },
    codeQualitySummary: {
      errors: "Erreurs",
      files: "Fichiers",
      issues: "Problèmes",
      of: "sur",
      summary: "Résumé",
    },
    container: {
      noContent: "Aucun contenu",
    },
    endpointRenderer: {
      cancel: "Annuler",
      submit: "Envoyer",
      submitting: "Envoi...",
    },
    formField: {
      requiresContext: "Ce champ nécessite un contexte",
    },
    markdown: {
      noContent: "Aucun contenu",
    },
    pagination: {
      itemsPerPage: "Éléments par page",
      page: "Page",
      showing: "Affichage",
    },
    rangeSlider: {
      max: "Max",
      min: "Min",
    },
    toolCall: {
      creditsUsed_one: "{{count}} crédit utilisé",
      creditsUsed_other: "{{count}} crédits utilisés",
      actions: {
        confirm: "Confirmer",
        deny: "Refuser",
        runInBackground: "Exécuter en arrière-plan",
        resumeWhenDone: "Reprendre une fois terminé",
      },
      status: {
        complete: "Terminé",
        confirmed: "Confirmé",
        confirmedWakeUp: "Confirmé (réveil)",
        deferred: "Différé",
        denied: "Refusé",
        deniedWakeUp: "Refusé (réveil)",
        error: "Erreur",
        executing: "En cours d'exécution",
        pendingCancellation: "Annulation en attente",
        pendingConfirmation: "Confirmation en attente",
        sentToBackground: "Envoyé en arrière-plan",
        waitingForConfirmation: "En attente de confirmation",
        waitingForConfirmationWakeUp: "En attente de confirmation (réveil)",
        waitingForRemote: "En attente de l'instance distante",
        wakeUpBackground: "Réveil (arrière-plan)",
      },
      messages: {
        confirmationRequired: "Confirmation requise",
        confirmationRequiredWakeUp: "Confirmation requise (réveil)",
        deferredResult: "Résultat différé",
        errorLabel: "Erreur",
        executingTool: "Exécution de l'outil...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Saisissez un numéro de téléphone",
        required: "Obligatoire",
        selectDate: "Choisir une date",
        unknownFieldType: "Type de champ inconnu",
      },
      entityPicker: {
        change: "Modifier",
        loading: "Chargement...",
        noItems: "Aucun élément trouvé",
        required: "Obligatoire",
        select: "Sélectionner...",
        selectLabel: "Sélectionner {{label}}",
        useToFind: "Trouvez-le avec {{alias}}",
      },
      markdownTextarea: {
        edit: "Modifier",
        preview: "Aperçu",
        toolbar: {
          blockquote: "Citation",
          bold: "Gras",
          bulletList: "Liste à puces",
          code: "Code",
          heading1: "Titre 1",
          heading2: "Titre 2",
          heading3: "Titre 3",
          horizontalRule: "Ligne horizontale",
          italic: "Italique",
          link: "Lien",
          linkPrompt: "Saisissez l'URL",
          orderedList: "Liste numérotée",
          strike: "Barré",
        },
      },
    },
  },
  localstorage: {
    noCallback: "Aucun callback fourni pour l'opération localStorage",
  },
  apiUtils: {
    errors: {
      http_error: "Erreur HTTP",
      validation_error: "Erreur de validation",
      internal_error: "Erreur interne",
      auth_required: "Authentification requise",
      missingUrlParam: "Paramètre d'URL « {{param}} » manquant pour {{path}}",
      httpStatus: "La requête vers {{url}} a échoué avec le statut {{status}}",
      responseValidation:
        "La réponse du serveur n'a pas passé la validation : {{error}}",
      malformedResponse: "Réponse mal formée de {{url}}",
      requestFailed: "La requête vers {{path}} a échoué : {{error}}",
      endpointFailed: "{{reason}} ({{path}}) : {{error}}",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Échec de la modification",
        },
        validation_error: {
          title: "Erreur de validation",
          detail: "La validation du formulaire a échoué : {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure:
        "Erreur réseau dans le formulaire {{formId}} : {{error}}",
      validation_failed: "Échec de la validation",
      validationFailedDetail:
        "Échec de la validation dans le formulaire {{formId}} : {{error}}",
    },
  },
  store: {
    errors: {
      validation_failed: "Échec de la validation",
      request_failed: "Échec de la requête",
      mutation_failed: "Échec de la modification",
      unexpected_failure: "Échec inattendu",
      refetch_failed: "Échec du rechargement",
    },
    status: {
      loading_data: "Chargement des données...",
      cached_data: "Données en cache utilisées",
      success: "Succès",
      mutation_pending: "Modification en cours...",
      mutation_success: "Modification réussie",
    },
  },
};
