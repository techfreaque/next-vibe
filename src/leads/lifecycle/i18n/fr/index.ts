import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Cycle de vie",
  enums: {
    journey: {
      firstChat: "Inscrit, aucune discussion",
      outOfCredits: "Crédits gratuits épuisés",
      whatsNew: "Inactif depuis 7 jours",
      winBack: "Inactif depuis 30 jours",
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
      outOfCredits: "Crédits épuisés : formules",
      whatsNew: "Nouveautés",
      winBack: "Reconquête : dernier e-mail",
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
    signoff: "Max",
    signature: "unbottled.ai",
    senderName: "Max d'unbottled.ai",
    unsubscribeText: "Se désabonner :",
    firstChatPrompts: {
      subject: "Trois premiers messages, prêts à copier",
      preview:
        "Un non censuré, un grand public, une image. Choisissez, envoyez.",
      intro:
        "Votre compte est prêt et le chat est encore vide. Voici trois messages pour démarrer. Copiez-en un, collez-le, envoyez.",
      uncensoredTitle: "Demander sans leçon de morale",
      uncensoredPrompt:
        "« Écris un polar bien noir où le méchant gagne. Pas de fin heureuse, pas de morale. » Choisissez l'un des {{uncensoredCount}} modèles non censurés. Vous confirmez une seule fois que vous avez 18 ans ou plus.",
      mainstreamTitle: "Comparer les grands noms",
      mainstreamPrompt:
        "« Organise-moi un week-end pas cher à Lisbonne. Où manger, quoi éviter ? » Posez la question à GPT. Passez ensuite à Claude ou Gemini dans le même fil et comparez.",
      mediaTitle: "Créer une image, une vidéo, un morceau",
      mediaPrompt:
        "« Un renard en écharpe rouge dans une rue enneigée de Tokyo, la nuit, photo argentique. » Un prompt, une image. Les vidéos courtes et la musique marchent pareil.",
      body: "Votre compte gratuit reçoit {{freeCreditsSignedIn}} crédits chaque mois, {{freeCreditsMax}} avec la newsletter. Sans carte bancaire.",
      cta: "Envoyer mon premier message",
      ps: "P.-S. Vous ne savez pas par où commencer ? Répondez à cet e-mail. Nous lisons les réponses.",
    },
    outOfCredits: {
      subject: "Vos crédits gratuits du mois sont épuisés",
      preview:
        "Ils reviennent le 1er. Ou continuez dès maintenant, formules dès {{subscriptionPrice}} par mois.",
      intro:
        "Vous avez utilisé tous vos crédits gratuits du mois. Ils reviennent le 1er. Pas envie d'attendre ? Choisissez une formule. Prix affichés.",
      starterTitle: "Starter : {{subscriptionPrice}}/mois",
      starterBody:
        "{{subscriptionCredits}} crédits chaque mois, résiliable à tout moment. Pour un usage presque quotidien.",
      moreTitle: "Besoin de plus ? Trois formules plus grandes",
      moreBody:
        "Plus : {{plusCredits}} crédits pour {{plusPrice}}. Pro : {{proCredits}} pour {{proPrice}}. Ultra : {{ultraCredits}} pour {{ultraPrice}}. Chaque formule peut se recharger avec des packs qui n'expirent jamais.",
      body: "Carte, PayPal ou crypto. Mêmes modèles, mêmes réglages de filtre.",
      cta: "{{subscriptionCredits}} crédits pour {{subscriptionPrice}}",
      ps: "P.-S. Attendre le 1er, c'est très bien aussi. Vos fils de discussion restent où ils sont.",
    },
    whatsNew: {
      subject: "Ce qui a changé pendant votre absence",
      preview:
        "{{modelCount}} modèles, vidéo et musique dans le chat, six langues.",
      intro:
        "Votre dernière discussion date de plus d'une semaine. Voici les nouveautés.",
      modelsTitle: "{{modelCount}} modèles de chat",
      modelsBody:
        "{{mainstreamCount}} grand public, {{openCount}} open source, {{uncensoredCount}} non censurés. Changez de modèle en plein fil.",
      mediaTitle: "Images, vidéos et musique",
      mediaBody:
        "Un prompt dans le chat, et vous récupérez une image, un clip court ou un morceau.",
      languagesTitle: "Six langues",
      languagesBody:
        "Toute l'application fonctionne en français, anglais, allemand, polonais, espagnol et italien.",
      body: "Vos fils de discussion sont restés là où vous les avez laissés.",
      cta: "Voir tous les modèles",
      ps: "P.-S. Vous connaissez quelqu'un que ça intéresserait ? Votre lien de parrainage vous rapporte {{referralPercent}} % de tout ce que cette personne dépense, chaque mois.",
    },
    winBack: {
      subject: "Un dernier e-mail de notre part",
      preview:
        "Votre compte, vos fils et vos crédits gratuits sont toujours là.",
      intro:
        "Votre dernière discussion remonte à plus d'un mois. C'est notre dernier rappel.",
      body: "Votre compte, vos fils de discussion et vos crédits gratuits mensuels sont toujours là. Plus de modèles qu'avant, et c'est toujours vous qui réglez le filtre.",
      cta: "Reprendre où vous en étiez",
      ps: "P.-S. Qu'est-ce qui vous a freiné ? Répondez et dites-le-nous. Nous lisons chaque réponse.",
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
      name: "Cycle de vie : première discussion",
      description:
        "48 h après l'inscription, compte vérifié, aucune discussion. Trois prompts concrets.",
    },
    outOfCredits: {
      name: "Cycle de vie : crédits épuisés",
      description:
        "Crédits gratuits du mois épuisés, jamais payé. Prix des formules.",
    },
    whatsNew: {
      name: "Cycle de vie : nouveautés",
      description: "7 jours sans discussion. Modèles, médias, langues.",
    },
    winBack: {
      name: "Cycle de vie : reconquête",
      description: "30 jours sans discussion. Dernier e-mail du parcours.",
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
