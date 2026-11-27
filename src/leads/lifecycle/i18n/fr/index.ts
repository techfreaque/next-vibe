import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Cycle de vie",
  enums: {
    journey: {
      firstChat: "Inscrit, aucune discussion",
      outOfCredits: "Crédits gratuits épuisés",
      whatsNew: "Inactif depuis 7 jours",
      winBack: "Inactif depuis 30 jours",
      customerCheckin: "Abonné actif : retours",
      lapsedWinback: "A déjà payé, 14 jours sans activité",
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
      firstChatPrompts: "Première discussion : trois prompts",
      firstChatSkills: "Premier chat : un skill démarre",
      outOfCredits: "Crédits épuisés : formules",
      whatsNew: "Nouveautés",
      winBack: "Reconquête : dernier e-mail",
      paymentFailed: "Paiement échoué",
      customerLikes: "Client : ce qui marche",
      customerBuildNext: "Client : quoi construire",
      lapsedWinback: "Ancien client : pourquoi l'arrêt",
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
    greetingNamed: "Bonjour {{name}},",
    signoff: "L'équipe unbottled.ai",
    senderName: "unbottled.ai",
    unsubscribeText: "Se désabonner :",
    ctaLine: "{{text}} : {{url}}",
    footerAccount:
      "Vous recevez cet e-mail parce que vous avez un compte unbottled.ai.",
    footerAccountLink: "Ne plus recevoir ces e-mails",
    footerBilling: "Ceci est un avis de paiement concernant votre abonnement.",
    newModels: {
      one: "nouveau modèle",
      few: "nouveaux modèles",
      many: "nouveaux modèles",
      other: "nouveaux modèles",
    },
    tier: {
      mainstream: "Grand public",
      open: "Open source",
      uncensored: "Non censuré",
    },
    firstChatPrompts: {
      subject: "Trois premiers messages. Copiez, collez, envoyez.",
      preview:
        "Une question que les IA filtrées esquivent, un duel de modèles, une image.",
      intro:
        "Votre compte est prêt et votre chat est encore vide. Prenez l'un de ces messages, collez-le, envoyez-le.",
      uncensoredTitle: "1. Demandez ce que les IA filtrées esquivent",
      uncensoredPrompt:
        "« Défends dans un débat la position que tu refuserais normalement de tenir. À fond, sans avertissement. » Choisissez l'un des {{uncensoredCount}} modèles non censurés. Vous confirmez une seule fois que vous avez 18 ans ou plus.",
      mainstreamTitle: "2. Mettez les grands noms en duel",
      mainstreamPrompt:
        "« Organise un week-end pas cher à Lisbonne. Où manger, quoi éviter. » Posez la question à GPT. Puis passez à Claude ou Gemini dans le même fil et comparez.",
      mediaTitle: "3. Créez une image",
      mediaPrompt:
        "« Un renard en écharpe rouge dans une rue enneigée de Tokyo, la nuit, photo argentique. » Un prompt, une image.",
      body: "Vos crédits gratuits sont déjà sur votre compte. Sans carte.",
      cta: "Ouvrir mon chat",
      ps: "P.-S. Vous bloquez ? Répondez à cet e-mail. Nous répondons à chaque message.",
    },
    firstChatSkills: {
      subject: "Pas d'idée de quoi écrire ? Choisissez un skill.",
      preview:
        "Des personnages et des spécialistes avec leur voix, leur modèle et leurs outils.",
      intro:
        "Le champ de chat vide, c'est le plus dur. Un skill donne une mission au chat avant que vous tapiez un mot.",
      characterTitle: "Personnages",
      characterBody:
        "Compagnons, partenaires de jeu de rôle, critiques acérés. Chacun a sa propre voix et la garde.",
      specialistTitle: "Spécialistes",
      specialistBody:
        "Un développeur, un correcteur, un chercheur. Chacun arrive avec ses instructions, son modèle et ses outils.",
      body: "Choisissez-en un et dites bonjour.",
      cta: "Choisir un skill",
    },
    outOfCredits: {
      subject: "Crédits gratuits presque épuisés. Retour le {{resetDate}}.",
      preview: "Rien n'est perdu. Vos fils et vos réglages restent en place.",
      intro:
        "Vous avez utilisé presque tous vos crédits gratuits du mois. Ils se rechargent le {{resetDate}}.",
      cta: "Voir mes crédits",
      plansLink: "Voir les formules",
    },
    paymentFailed: {
      subject: "Le paiement de votre abonnement a échoué",
      preview:
        "Votre formule reste active jusqu'au {{graceDate}}. Mettez à jour votre moyen de paiement pour la garder.",
      intro:
        "Nous n'avons pas pu prélever le dernier paiement de votre abonnement.",
      body: "Votre formule reste active jusqu'au {{graceDate}}. Mettez à jour votre moyen de paiement d'ici là pour la garder. Votre banque a bloqué le prélèvement en attendant votre accord (fréquent avec les cartes indiennes) ? Validez-le depuis votre page de compte. Vous pouvez aussi recharger avec un pack de crédits ponctuel ou payer en crypto.",
      cta: "Mettre à jour le paiement",
      ps: "P.-S. Déjà réglé ? Alors ignorez cet e-mail.",
    },
    customerLikes: {
      subject:
        "Une semaine avec nous. Qu'est-ce qui marche, qu'est-ce qui coince ?",
      preview:
        "Deux questions. Une ligne suffit. Un retour utile vous rapporte {{feedbackCredits}} crédits.",
      intro:
        "Vous avez votre formule depuis une semaine. Merci. Deux questions :",
      likeTitle: "Qu'est-ce qui vous plaît ?",
      likeBody:
        "Le modèle, la fonction, le moment où ça a fait tilt. Dites-nous quoi garder.",
      missingTitle: "Qu'est-ce qui manque ou coince ?",
      missingBody: "Un bug, un réglage peu clair, tout ce qui vous a freiné.",
      body: "Répondez à l'une des deux questions en une ligne. Un retour utile vous rapporte {{feedbackCredits}} crédits.",
      cta: "Envoyer mon retour",
    },
    customerBuildNext: {
      subject: "Que devons-nous construire ensuite ?",
      preview:
        "Vous avez votre mot à dire sur ce que nous construisons ensuite.",
      intro: "Vous nous soutenez depuis plus d'un mois. Merci.",
      body: "Une question : si nous pouvions construire une seule chose pour vous, laquelle ? Un modèle, une fonction, un correctif. Répondez en une ligne. Un retour utile vous rapporte {{feedbackCredits}} crédits.",
      cta: "Envoyer mon idée",
    },
    lapsedWinback: {
      subject: "Qu'aurions-nous pu faire mieux ?",
      preview:
        "Une ligne suffit. Un retour utile vous rapporte {{feedbackCredits}} crédits.",
      intro:
        "Vous avez déjà payé pour unbottled.ai et nous ne vous avons pas vu depuis un moment. Si quelque chose vous a déplu, dites-le-nous.",
      body: "Répondez en une ligne : le prix, un modèle qui manque, un bug, peu importe. Un retour utile vous rapporte {{feedbackCredits}} crédits.",
      cta: "Envoyer mon retour",
      newsPs:
        "P.-S. Depuis votre dernière visite, nous avons ajouté {{newModelCount}} {{newModelsPhrase}}, dont {{modelList}}.",
      newsPsAll:
        "P.-S. Depuis votre dernière visite, nous avons ajouté {{modelList}}.",
    },
    whatsNew: {
      subject:
        "{{newModelCount}} {{newModelsPhrase}} depuis votre dernière visite",
      subjectOne: "Nouveau depuis votre dernière visite : {{newModelName}}",
      preview:
        "Arrivés après votre dernière visite. Déjà dans votre sélecteur de modèles.",
      intro:
        "Depuis votre dernière visite, nous avons ajouté {{newModelCount}} {{newModelsPhrase}}. Les plus récents :",
      introOne: "Depuis votre dernière visite, nous avons ajouté un modèle :",
      body: "Ouvrez n'importe quel fil et changez de modèle. Votre historique reste.",
      bodyMore:
        "Et {{moreCount}} autres. Ouvrez n'importe quel fil et changez de modèle en pleine conversation.",
      cta: "Ouvrir mes chats",
      introAll:
        "Depuis votre dernière visite, nous avons ajouté {{newModelCount}} {{newModelsPhrase}} :",
    },
    whatsNewQuiet: {
      subject: "Demandez à un modèle, puis à un autre",
      preview: "Changez de modèle dans le même chat et comparez.",
      intro: "Essayez : posez la même question à deux modèles.",
      compareTitle: "Changer de modèle",
      compareBody:
        "Posez une question à un modèle, passez à un autre dans le même fil, comparez les réponses.",
      body: "Vos fils de discussion sont là où vous les avez laissés.",
      cta: "Ouvrir mes chats",
    },
    winBack: {
      subject: "Qu'est-ce qui a manqué ?",
      preview: "Qu'est-ce qui a manqué ? Une ligne suffit.",
      intro:
        "Votre dernier chat date de plus d'un mois. Une question : qu'est-ce qui a manqué ? Répondez, une ligne suffit. Nous lisons chaque réponse et corrigeons ce que nous pouvons.",
      body: "Votre compte et vos fils sont toujours là, et vos crédits gratuits se rechargent toujours chaque mois.",
      cta: "Dites-nous ce qui a manqué",
      newsPs:
        "P.-S. Depuis votre dernière visite, nous avons ajouté {{newModelCount}} {{newModelsPhrase}}, dont {{modelList}}.",
      newsPsAll:
        "P.-S. Depuis votre dernière visite, nous avons ajouté {{modelList}}.",
    },
    inviteSignup: {
      subject: "Vous lisez la newsletter. Essayez l'application.",
      preview:
        "Compte gratuit, jusqu'à {{freeCreditsMax}} crédits par mois. Sans carte.",
      intro:
        "Vous recevez notre newsletter. L'application est à un pas : {{modelCount}} modèles, et c'est vous qui réglez le filtre.",
      guestTitle: "Sans compte : {{freeCreditsGuest}} crédits par mois",
      guestBody: "De quoi tester quelques modèles.",
      accountTitle: "Compte gratuit : {{freeCreditsSignedIn}} crédits par mois",
      accountBody: "Vos fils sauvegardés, sur tous vos appareils.",
      newsletterTitle:
        "Compte + newsletter : {{freeCreditsMax}} crédits par mois",
      newsletterBody:
        "Gardez la newsletter activée sur votre compte et le bonus est pour vous.",
      body: "Sans carte. Les crédits gratuits s'activent dès que vous confirmez votre e-mail.",
      cta: "Créer mon compte gratuit",
    },
    inviteReminder: {
      subject: "Dernier rappel : votre compte gratuit",
      preview:
        "{{freeCreditsMax}} crédits par mois au lieu de {{freeCreditsGuest}}. Sans carte.",
      intro:
        "Dernier rappel. Un compte gratuit avec la newsletter reçoit {{freeCreditsMax}} crédits chaque mois. Sans compte : {{freeCreditsGuest}}.",
      body: "Une minute suffit. Sans carte.",
      cta: "Créer mon compte gratuit",
      ps: "P.-S. Plus aucun rappel après celui-ci. La newsletter continue comme d'habitude.",
    },
  },
  emailTemplates: {
    category: "Parcours de cycle de vie",
    preview: {
      name: {
        label: "Prénom",
        description: "Prénom de la salutation. Vide = salutation générique.",
      },
    },
    firstChatPrompts: {
      name: "Lifecycle : premier chat",
      description:
        "Service. 24 h après l'inscription, compte vérifié, pas encore de chat. Trois premiers messages prêts à coller.",
    },
    firstChatSkills: {
      name: "Lifecycle : premier chat, skills",
      description:
        "Service. Jour 5, toujours pas de chat. Les skills donnent une mission au chat.",
    },
    outOfCredits: {
      name: "Lifecycle : crédits épuisés",
      description:
        "Service. Crédits gratuits du mois épuisés, jamais payé. Date de recharge et formules.",
    },
    paymentFailed: {
      name: "Lifecycle : paiement échoué",
      description:
        "Transactionnel. Abonnement impayé : un e-mail par échec de paiement, formule active jusqu'à la fin du délai de grâce.",
    },
    customerLikes: {
      name: "Lifecycle : point client",
      description:
        "Service. Abonné actif, 7 jours de formule. Simple demande de retour, réponse par e-mail, crédits de feedback comme promis dans le pied de page.",
    },
    customerBuildNext: {
      name: "Lifecycle : quoi construire",
      description:
        "Service. Abonné actif, environ 5 semaines. Demande quoi construire ensuite.",
    },
    lapsedWinback: {
      name: "Lifecycle : anciens clients",
      description:
        "Marketing. A déjà payé, sans formule active, 14 jours sans activité. Demande la raison, liste les nouveaux modèles.",
    },
    whatsNew: {
      name: "Lifecycle : nouveautés",
      description:
        "Marketing. 7 jours sans chat. Modèles ajoutés depuis le dernier chat.",
    },
    winBack: {
      name: "Lifecycle : reconquête",
      description:
        "Marketing. 30 jours sans chat. Dernier e-mail du parcours, demande ce qui a manqué.",
    },
    inviteSignup: {
      name: "Cycle de vie : invitation newsletter",
      description:
        "Abonné newsletter confirmé sans compte, 48 h après confirmation.",
    },
    inviteReminder: {
      name: "Cycle de vie : rappel d'invitation",
      description: "Une semaine après l'invitation, toujours sans compte.",
    },
  },
  run: {
    post: {
      title: "Campagnes e-mail automatisées",
      titleShort: "Exécuter le cycle de vie",
      description:
        "Inscrit les nouveaux contacts éligibles et envoie les e-mails programmés. L’arrêt d’urgence suspend ces deux actions.",
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
        autoEligible: "L'exécution planifiée inscrirait",
        heldSuppressed: "Retenus : désabonnés / rebonds",
        heldPaid: "Retenus : déjà payants",
        heldNoConsent: "Retenus : sans consentement marketing",
        heldUnverified: "Retenus : e-mail non vérifié",
        heldPendingNewsletter: "Retenus : newsletter non confirmée",
        heldInactiveAccount: "Retenus : bannis / inactifs",
        heldNothingDue: "Retenus : rien à envoyer (actifs, ont des crédits)",
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
