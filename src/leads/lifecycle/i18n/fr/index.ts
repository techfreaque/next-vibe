import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Cycle de vie",
  enums: {
    journey: {
      inactiveUser: "Inscrit, jamais discuté",
      engagedFree: "A discuté, jamais payé",
      newsletterInvite: "Newsletter, sans compte",
    },
    enrollmentStatus: {
      active: "Actif",
      completed: "Terminé",
      exited: "Sorti",
    },
    exitReason: {
      goalMet: "Objectif atteint",
      unsubscribed: "Désabonné",
      suppressed: "Supprimé",
      ineligible: "Plus éligible",
      sendFailed: "Échec de l'envoi",
    },
    sendStatus: {
      pending: "En attente",
      sent: "Envoyé",
    },
    template: {
      inactiveNudge: "Relance : lancer une discussion",
      inactiveModels: "Choix du modèle",
      inactiveUpgrade: "Rappel crédits",
      engagedValue: "Valeur : en tirer davantage",
      engagedUpgrade: "Upgrade : ne pas attendre la réinitialisation",
      engagedLast: "Dernier mot sur les crédits",
      inviteSignup: "Invitation : créer un compte",
      inviteReminder: "Invitation : rappel",
    },
  },
  errors: {
    unauthorized: {
      title: "Non autorisé",
      description: "Accès administrateur requis",
    },
    forbidden: { title: "Interdit", description: "Aucune autorisation" },
    server: {
      title: "Erreur serveur",
      description: "L'opération de cycle de vie a échoué",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite",
    },
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les valeurs et réessayez",
    },
    notFound: { title: "Introuvable", description: "Introuvable" },
    conflict: { title: "Conflit", description: "Conflit" },
    network: { title: "Erreur réseau", description: "Erreur réseau" },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Modifications non enregistrées",
    },
  },
  emails: {
    greeting: "Bonjour,",
    signature: "unbottled.ai",
    unsubscribeText: "Se désabonner :",
    inactiveNudge: {
      subject: "Vous êtes inscrit. Vous n'avez encore rien demandé.",
      preview: "Vos crédits gratuits vous attendent.",
      body1:
        "Votre compte est actif et vos crédits gratuits se renouvellent chaque mois. Aucun filtre que vous n'avez pas choisi.",
      body2:
        "Posez la question que vous ne pouviez poser nulle part ailleurs. Un seul message suffit.",
      cta: "Lancer une discussion",
    },
    inactiveModels: {
      subject: "{{modelCount}} modèles. Vous décidez de ce qui est filtré.",
      preview: "Grand public, open source ou non censuré. À vous de choisir.",
      body1:
        "La plupart des IA décident à votre place de ce que vous pouvez demander. Ici, c'est vous qui choisissez : modèles grand public, open source ou non censurés, côte à côte.",
      body2:
        "Choisissez un modèle, réglez votre propre niveau de filtrage, envoyez un prompt. C'est tout.",
      cta: "Choisir un modèle",
    },
    inactiveUpgrade: {
      subject:
        "Les crédits gratuits pour démarrer. Les crédits payants pour aller plus loin.",
      preview: "Des modèles plus puissants, des discussions plus longues.",
      body1:
        "Les crédits gratuits couvrent beaucoup. Pour les gros modèles et les longues conversations, rechargez et continuez.",
      body2:
        "Vous payez ce que vous utilisez. Achetez des crédits quand vous en avez besoin.",
      cta: "Voir les options de crédits",
    },
    engagedValue: {
      subject: "Vous discutez déjà. Voici comment en tirer davantage.",
      preview: "Essayez le même prompt sur un deuxième modèle.",
      body1:
        "Chaque modèle répond à sa manière. Lancez le même prompt sur un deuxième et comparez.",
      body2:
        "Vos crédits gratuits se renouvellent chaque mois. Quand vous atteignez la limite, inutile d'attendre.",
      cta: "Continuer la discussion",
    },
    engagedUpgrade: {
      subject: "Plus de crédits gratuits ? N'attendez pas la réinitialisation.",
      preview: "Rechargez en une minute.",
      body1:
        "Les crédits gratuits se renouvellent chaque mois. Les crédits payants ne vous font pas attendre : choisissez un pack ou un abonnement et poursuivez votre fil.",
      body2: "Vous payez à l'usage. Rien d'autre.",
      cta: "Obtenir plus de crédits",
    },
    engagedLast: {
      subject: "Notre dernier mot sur les crédits",
      preview: "Ensuite, on vous laisse tranquille.",
      body1:
        "C'est le dernier e-mail de cette série. Si les crédits gratuits vous suffisent, restez en gratuit. Si vous voulez plus de marge, les crédits sont à un clic.",
      body2: "Vous pouvez vous désabonner à tout moment en bas de cet e-mail.",
      cta: "Voir les options de crédits",
    },
    inviteSignup: {
      subject: "Vous êtes sur la liste. Passez maintenant au compte.",
      preview: "Compte gratuit. Jusqu'à {{freeCreditsMax}} crédits par mois.",
      body1:
        "Un compte gratuit vous donne {{freeCreditsSignedIn}} crédits par mois et l'accès à {{modelCount}} modèles, avec le niveau de filtrage que vous fixez.",
      body2:
        "Sans compte : {{freeCreditsGuest}} par mois. Compte gratuit : {{freeCreditsSignedIn}}. Compte + newsletter : {{freeCreditsMax}}.",
      cta: "Créer un compte gratuit",
    },
    inviteReminder: {
      subject: "Toujours pas de compte ? Ça prend une minute.",
      preview: "Gratuit pour commencer.",
      body1:
        "Vous nous lisez par e-mail. Vous pouvez aussi nous utiliser directement : choisissez un modèle, demandez ce que vous voulez, fixez votre propre filtre.",
      body2:
        "Les comptes gratuits reçoivent {{freeCreditsSignedIn}} crédits par mois. Gardez la newsletter sur le compte et vous passez à {{freeCreditsMax}}.",
      cta: "Créer un compte gratuit",
    },
  },
  run: {
    post: {
      title: "Exécuter les parcours de cycle de vie",
      titleShort: "Exécuter le cycle de vie",
      description:
        "Inscrit les contacts nouvellement éligibles et envoie les e-mails de parcours dus. Ne fait rien tant que le coupe-circuit est activé.",
      container: {
        title: "Exécuter le cycle de vie",
        description:
          "Inscrire et envoyer. Respecte le coupe-circuit et le plafond de fréquence.",
      },
      fields: {
        dryRun: {
          label: "Simulation",
          description: "Ne rien faire, seulement rapporter",
        },
      },
      response: {
        paused: "En pause",
        enrolled: "Inscrits",
        sent: "Envoyés",
        exited: "Sortis",
        deferred: "Reportés",
        failed: "Échecs",
      },
      success: {
        title: "Exécution du cycle de vie terminée",
        description: "Les étapes de parcours dues ont été traitées",
      },
    },
  },
  settings: {
    post: {
      title: "Paramètres du cycle de vie",
      titleShort: "Paramètres cycle de vie",
      description:
        "Coupe-circuit, plafond de fréquence, limitation d'envoi et mode de consentement pour les e-mails de cycle de vie.",
      container: {
        title: "Paramètres du cycle de vie",
        description: "Laissez un champ vide pour conserver sa valeur actuelle.",
      },
      fields: {
        paused: {
          label: "Suspendre tous les envois de cycle de vie",
          description: "Activé = rien n'est inscrit ni envoyé",
        },
        minHoursBetweenEmails: {
          label: "Heures min. entre e-mails",
          description:
            "Plafond de fréquence par contact, cycle de vie et campagnes confondus",
        },
        maxSendsPerRun: {
          label: "E-mails max. par exécution",
          description: "Limitation pour chaque exécution planifiée",
        },
        autoEnrollWindowDays: {
          label: "Fenêtre d'inscription auto (jours)",
          description:
            "L'exécution planifiée n'inscrit que les contacts dont le déclencheur est aussi récent. Les contacts plus anciens passent par le rattrapage.",
        },
        requireUserMarketingConsent: {
          label: "Exiger le consentement marketing des utilisateurs",
          description:
            "Activé = les utilisateurs inscrits doivent avoir un consentement marketing ou un opt-in newsletter confirmé",
        },
      },
      response: {
        paused: "En pause",
        minHoursBetweenEmails: "Heures min. entre e-mails",
        maxSendsPerRun: "E-mails max. par exécution",
        autoEnrollWindowDays: "Fenêtre d'inscription auto (jours)",
        requireUserMarketingConsent: "Consentement marketing requis",
      },
      success: {
        title: "Paramètres enregistrés",
        description: "Les paramètres du cycle de vie sont en vigueur",
      },
    },
  },
  backfill: {
    post: {
      title: "Rattrapage du cycle de vie",
      titleShort: "Rattrapage",
      description:
        "Prévisualisez, puis inscrivez les contacts éligibles existants dans le bon parcours. Démarre à l'étape 0, réparti sur une fenêtre d'envoi.",
      container: {
        title: "Rattraper les contacts existants",
        description:
          "La simulation est activée par défaut. Rien n'est envoyé en pause.",
      },
      fields: {
        dryRun: {
          label: "Simulation",
          description: "Compter uniquement. Désactivez pour inscrire.",
        },
        spreadHours: {
          label: "Répartir sur (heures)",
          description:
            "Fenêtre sur laquelle les premiers e-mails sont répartis",
        },
      },
      response: {
        dryRunResult: "Simulation",
        segments: "Segments",
        journey: "Parcours",
        eligible: "Éligibles",
        alreadyEnrolled: "Déjà inscrits",
        enrolled: "Inscrits",
        heldSuppressed: "Retenus : désabonnés / rebonds",
        heldPaid: "Retenus : déjà payants",
        heldNoConsent: "Retenus : sans consentement marketing",
        heldUnverified: "Retenus : e-mail non vérifié",
        heldPendingNewsletter: "Retenus : newsletter non confirmée",
        heldInactiveAccount: "Retenus : bannis / inactifs",
      },
      success: {
        title: "Rattrapage terminé",
        description: "Les comptes par segment figurent dans la réponse",
      },
    },
  },
  overview: {
    get: {
      title: "Parcours de cycle de vie",
      titleShort: "Cycle de vie",
      description:
        "Parcours, inscriptions, envois et conversions. Coupe-circuit et rattrapage.",
      response: {
        paused: "En pause",
        minHoursBetweenEmails: "Heures min. entre e-mails",
        maxSendsPerRun: "E-mails max. par exécution",
        autoEnrollWindowDays: "Fenêtre d'inscription auto (jours)",
        requireUserMarketingConsent: "Consentement marketing requis",
        journeys: "Parcours",
        steps: "Étapes",
        enrolled: "Inscrits",
        active: "Actifs",
        completed: "Terminés",
        exited: "Sortis",
        converted: "Convertis",
        unsubscribed: "Désabonnés",
        sent: "Envoyés",
        sent24h: "Envoyés (24 h)",
        attributedPaid: "Payants après inscription",
      },
      success: {
        title: "Cycle de vie chargé",
        description: "Compteurs des parcours chargés",
      },
    },
  },
  widget: {
    title: "Parcours de cycle de vie",
    refresh: "Actualiser",
    pausedTitle: "En pause",
    pausedBody: "Rien n'est inscrit ni envoyé.",
    liveTitle: "Actif",
    liveBody: "Les e-mails dus partent à chaque exécution.",
    pause: "Tout suspendre",
    resume: "Reprendre les envois",
    settings: "Paramètres",
    backfill: "Rattrapage",
    capLine:
      "Plafond : 1 e-mail toutes les {{hours}} h. Max. {{max}} par exécution.",
    consentOn: "Les utilisateurs doivent donner leur consentement marketing.",
    consentOff: "Le consentement marketing n'est pas requis.",
    noJourneys: "Aucun parcours.",
    stepsLine: "{{steps}} étapes",
    enrolled: "Inscrits",
    active: "Actifs",
    sent: "Envoyés",
    sent24h: "Envoyés (24 h)",
    converted: "Convertis",
    paid: "Payants après",
    unsubscribed: "Désab.",
  },
};
