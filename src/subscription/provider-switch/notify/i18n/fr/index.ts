import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Paiements",
  tag: "Avis de transfert de forfait",

  post: {
    title: "Avis de transfert de forfait",
    titleShort: "Avis de transfert",
    description:
      "Mail unique à chaque abonné payant par carte : transférer le forfait vers le nouveau prestataire de paiement. Le test liste les destinataires et génère un aperçu. Un envoi réel écrit une seule fois à chaque utilisateur et reste bloqué tant que le nouveau prestataire n'est pas actif.",
    container: {
      title: "Avis de transfert de forfait",
      description:
        "Abonnés par carte (actifs, en essai, en retard de paiement, se terminant en fin de période) pas encore contactés",
    },
    fields: {
      dryRun: {
        label: "Test",
        description:
          "Liste les destinataires et génère un aperçu. N'envoie rien.",
      },
      batchSize: {
        label: "Taille du lot",
        description:
          "Nombre maximal de mails pour cet envoi (aussi limité par le quota horaire)",
      },
      hourlyCap: {
        label: "Limite horaire",
        description:
          "Nombre maximal de mails de la plateforme par heure, tous mails confondus (limite de la boîte : 500)",
      },
      previewLocale: {
        label: "Langue de l'aperçu",
        description: "Générer le mail dans cette langue",
      },
      testRecipient: {
        label: "Destinataire de test",
        description:
          "Envoie le vrai mail à cette seule adresse. Sans vérifier que le prestataire est actif, personne n'est marqué comme prévenu.",
      },
    },
    response: {
      providerLive: "Nouveau prestataire actif",
      targetProvider: "Nouveau prestataire",
      totalRecipients: "Abonnés par carte",
      alreadyNotified: "Déjà contactés",
      pending: "Restant à contacter",
      planNotSupported:
        "Offre non proposée par le nouveau prestataire (ignorée)",
      hourlyBudget: "Quota horaire restant",
      sent: "Envoyés",
      failed: "Échecs",
      byLocale: "Par langue",
      locale: "Langue",
      count: "Nombre",
      recipients: "Destinataires de cet envoi",
      userId: "Utilisateur",
      email: "E-mail",
      status: "Statut",
      deadline: "Date limite",
      testSentTo: "Test envoyé à",
      previewSubject: "Objet de l'aperçu",
      previewHtml: "HTML de l'aperçu",
    },
    widget: {
      dryRunBadge: "Test",
      liveBadge: "Envoi réel",
      notLive:
        "Le nouveau prestataire n'est pas encore actif. Un envoi réel est refusé.",
      run: "Lancer",
      noRecipients: "Plus personne à contacter.",
    },
    errors: {
      notLive: {
        title: "Nouveau prestataire inactif",
        description:
          "Définissez SUBSCRIPTION_SWITCH_PROVIDER et SUBSCRIPTION_SWITCH_ENABLED=true et vérifiez que le prestataire accepte les paiements avant l'envoi.",
      },
      validation: {
        title: "Requête invalide",
        description: "Vérifiez les champs et réessayez.",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Réservé aux admins.",
      },
      forbidden: {
        title: "Non autorisé",
        description: "Réservé aux admins.",
      },
      server: {
        title: "Échec de l'envoi",
        description: "L'envoi des avis a échoué. Consultez les logs.",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème inattendu est survenu.",
      },
    },
    success: {
      title: "Envoi terminé",
      description: "Les chiffres sont ci-dessous.",
    },
  },

  emailTemplate: {
    name: "Avis de transfert de forfait",
    description:
      "Mail unique demandant aux abonnés par carte de transférer leur forfait vers le nouveau prestataire de paiement",
    category: "Abonnements",
    preview: {
      privateName: {
        label: "Nom",
        description: "Prénom de l'abonné",
      },
      planName: {
        label: "Forfait",
        description: "Nom du forfait",
      },
      deadline: {
        label: "Date limite",
        description: "Dernier jour de la période payée",
      },
    },
  },

  email: {
    subject:
      "Trop libre pour notre prestataire de cartes. Transférez votre forfait avant le {{deadline}}",
    subjectPastDue:
      "Trop libre pour notre prestataire de cartes. Transférez votre forfait maintenant",
    subjectNoDate:
      "Trop libre pour notre prestataire de cartes. Transférez votre forfait pour le garder",
    previewText:
      "Un clic et votre forfait continue. Même prix, crédits intacts.",
    headline: "Trop libre pour leurs règles. Parfait pour vous.",
    greeting: "Bonjour {{privateName}},",
    intro:
      "Notre prestataire de paiement par carte a décidé qu'une IA qui répond librement ne rentre pas dans ses règles, donc les paiements par carte de votre forfait {{planName}} sont arrêtés. Un clic le transfère vers notre nouvelle page de paiement avant le {{deadline}}, sinon le forfait prend fin le {{deadline}} et vos crédits restent sur votre compte.",
    introPastDue:
      "Notre prestataire de paiement par carte a décidé qu'une IA qui répond librement ne rentre pas dans ses règles, donc le dernier renouvellement de votre forfait {{planName}} n'est pas passé. Un clic le transfère dès maintenant vers notre nouvelle page de paiement, et vos crédits restent quoi qu'il arrive.",
    introNoDate:
      "Notre prestataire de paiement par carte a décidé qu'une IA qui répond librement ne rentre pas dans ses règles, donc les paiements par carte de votre forfait {{planName}} sont arrêtés. Un clic le transfère vers notre nouvelle page de paiement, sinon le forfait prend fin à l'issue de votre période payée et vos crédits restent sur votre compte.",
    cta: "Transférer mon forfait",
    reassurance:
      "Même forfait, même prix, et vos jours payés sont conservés. Jamais de double prélèvement. Chaque crédit reste à vous.",
    stance:
      "Nous changerons de prestataire plutôt que de censurer une seule réponse.",
    crypto: "Vous préférez payer en crypto ? C'est possible aussi.",
    cryptoCta: "Payer en crypto",
    help: "Une question ? Répondez simplement à ce mail. Un humain lit chaque réponse.",
    signoff: "Merci d'être à nos côtés,\nL'équipe {{appName}}",
  },
};
