import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
  },
  post: {
    title: "Émettre la facture",
    titleShort: "Émettre la facture",
    description: "Émettez le brouillon et comptabilisez la créance.",
    form: {
      title: "Émettre la facture",
      description: "Un lien client sera disponible après émission.",
    },
    response: {
      success: "Facture émise",
      message: "Message d'état",
      viewUrl: "URL de consultation client",
    },
    errors: {
      invoiceLines:
        "Ajoutez des lignes dont le total est positif avant d’émettre la facture.",
      posting:
        "Vérifiez le total de la facture, la devise de l’entreprise, la période comptable et les comptes d’imputation.",
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
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
        description: "Facture introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "La facture n'est pas à l'état de brouillon",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Facture émise",
      description: "Le lien de consultation peut être partagé.",
    },
  },
  invoiceId: {
    label: "ID de facture",
    description: "ID de la facture à envoyer",
    placeholder: "Saisir l'ID de facture",
  },
  delivery: {
    share: "Partager la facture",
    description:
      "Copiez le lien de consultation ou envoyez-le à l’adresse enregistrée sur la facture.",
    send: "Envoyer par e-mail",
    confirmDescription:
      "Envoyez le lien de la facture au destinataire confirmé.",
    recipient: "Destinataire de la facture",
    noRecipient:
      "Aucune adresse admissible ne figure sur cette facture. Vous pouvez copier le lien.",
    status: "État de l’e-mail",
    notIssued: "Seules les factures émises peuvent être partagées.",
    recipientChanged:
      "Le destinataire a changé ou reste indisponible. Rouvrez le partage de la facture.",
    emailSubject: "Facture {{number}}",
    emailText:
      "{{company}} a émis la facture {{number}}. Consultez-la ici :\n{{url}}",
    states: {
      ready: "Prêt à envoyer",
      pending:
        "L’envoi est en cours ou reste à confirmer. Les nouvelles tentatives sont suspendues.",
      accepted: "Le serveur de messagerie a accepté le message.",
      retryable:
        "Le serveur de messagerie n’a pas été contacté. Vous pouvez réessayer.",
      uncertain:
        "L’issue de l’envoi reste indéterminée. Vérifiez auprès du destinataire avant de partager le lien séparément.",
    },
  },
  widget: {
    back: "Retour",
    submit: "Émettre la facture",
    sent: "Partagez le lien avec votre client pour lui transmettre la facture.",
    copy: "Copier le lien client",
    copied: "Lien copié",
    copyError:
      "Impossible de copier le lien. Sélectionnez et copiez l’adresse ci-dessus.",
    viewUrl: "Lien de consultation client",
  },
};
