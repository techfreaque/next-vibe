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
      showResults: "Afficher les résultats",
      saveChanges: "Enregistrer",
      saving: "Enregistrement...",
      result: "Résultat",
      fixFields: "Vérifiez les champs signalés, puis réessayez.",
      hiddenInvalid:
        "« {{field}} » est manquant ou invalide. Rechargez la page et réessayez.",
    },
    toolUnavailable: {
      permissionTitle: "Vous n’avez pas accès à cet outil",
      permissionMessage:
        "Votre rôle ne permet pas de l’ouvrir. Demandez l’accès à un propriétaire de l’espace.",
      instanceTitle: "Cet outil n’est pas sur cette instance",
      instanceMessage:
        "Il tourne sur une autre instance connectée. Changez d’instance dans la barre latérale pour l’ouvrir.",
      setupTitle: "Cet outil doit d’abord être configuré",
      setupMessage:
        "Un réglage obligatoire manque. Terminez la configuration, puis rouvrez l’outil.",
      unknownTitle: "Ce lien ne mène à aucun outil",
      unknownMessage: "Le lien est peut-être obsolète ou mal saisi.",
    },
    recordState: {
      loading: "Chargement",
      notFoundMessage:
        "L’élément a peut-être été supprimé, ou le lien n’est plus valide.",
      loadFailed: "Impossible de charger : {{title}}",
      serverError:
        "Un problème est survenu de notre côté. Réessayez dans un instant.",
      technicalDetails: "Détails techniques",
      moreActions: "Plus d’actions",
      more: "Plus",
      confirmCancel: "Annuler",
      details: "Détails",
      emptyTitle: "Rien pour l’instant",
      copy: "Copier",
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
        openCalendar: "Ouvrir le calendrier",
        time: "Heure",
        startDate: "Date de début",
        endDate: "Date de fin",
        decreaseValue: "Diminuer la valeur",
        increaseValue: "Augmenter la valeur",
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
  formErrors: {
    required: "Saisissez une valeur",
    invalid: "Cette valeur n’est pas valide",
    minLength: "Au moins {{min}} caractères",
    maxLength: "Au plus {{max}} caractères",
    minNumber: "Saisissez {{min}} ou plus",
    maxNumber: "Saisissez {{max}} ou moins",
    minItems: "Ajoutez-en au moins {{min}}",
    email: "Saisissez une adresse e-mail valide",
    url: "Saisissez un lien complet, par exemple https://example.com",
    choose: "Choisissez une des options",
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
      recordTimeout:
        "Le chargement de cette fiche prend trop de temps. Réessayez.",
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
