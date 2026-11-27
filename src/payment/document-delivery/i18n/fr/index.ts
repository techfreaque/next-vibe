import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    pdf: "pdf",
    email: "email",
  },
  pdf: {
    invoiceTitle: "Facture PDF",
    invoiceDescription:
      "Téléchargez la facture PDF/A-3 avec mentions légales, QR code de paiement et XML ZUGFeRD intégré.",
    estimateTitle: "Devis PDF",
    estimateDescription: "Téléchargez le devis au format PDF.",
    success: "PDF généré",
    downloadAction: "Télécharger le PDF",
    zugferdBadge: "ZUGFeRD / Factur-X EN 16931 intégré",
    qrBadgeEpc: "QR SEPA EPC / GiroCode inclus",
    qrBadgePayBySquare: "QR PAY by square inclus",
    filename: "Nom du fichier",
    documentNumber: "Numéro de document",
    paymentUrl: "Lien de paiement en ligne",
    qrSection: "QR code de paiement",
    back: "Retour",
  },
  deliver: {
    logTitle: "Journal d’envoi e-mail",
    logDescription:
      "Consultez les factures envoyées et renvoyez le PDF via le serveur mail de la plateforme.",
    logSuccess: "Journal chargé",
    sendTitle: "Envoyer le document par e-mail",
    sendDescription: "Envoyez le PDF au client depuis le compte système hi@.",
    sendSuccess: "E-mail envoyé avec pièce jointe PDF",
    recipientEmail: "E-mail du destinataire",
    recipientName: "Nom du destinataire",
    customMessage: "Message personnel (facultatif)",
    isResend: "Renvoyer",
    sendAction: "Envoyer par e-mail avec PDF",
    resendAction: "Renvoyer le PDF",
    emptyLog: "Aucun e-mail envoyé",
    emptyLogHint: "Envoyez le PDF ci-dessus pour enregistrer l’envoi ici.",
    sentAt: "Envoyé le",
    sender: "Expéditeur",
    status: "Statut",
    attachment: "Pièce jointe",
    statusSent: "Envoyé",
    statusFailed: "Échec",
    resendBadge: "Renvoyé",
    subjectInvoice: "Facture {{number}} de {{company}}",
    subjectCreditNote: "Avoir {{number}} de {{company}}",
    subjectEstimate: "Devis {{number}} de {{company}}",
    bodyIntro: "Veuillez trouver {{document}} en pièce jointe au format PDF.",
    bodyPayOnline: "Payer en ligne :",
    bodyViewLink: "Consulter le document :",
    theaBlocked:
      "Les e-mails ERP doivent utiliser le compte hi@, jamais thea@.",
    mailerUnavailable:
      "Le serveur mail n’est pas configuré. Vérifiez le compte SMTP par défaut.",
  },
  fields: {
    invoiceId: "Facture",
    estimateId: "Devis",
    documentType: "Type de document",
    pdfBase64: "Données PDF",
    contentType: "Type de contenu",
    hasZugferd: "ZUGFeRD intégré",
    qrKind: "Format QR",
    qrSvg: "Aperçu QR",
    deliveries: "Envois",
    deliveryId: "Envoi",
    messageId: "ID du message",
  },
  errors: {
    validation: {
      title: "Vérifiez votre saisie",
      description: "Indiquez un document et une adresse e-mail valides.",
    },
    network: {
      title: "Erreur réseau",
      description: "Vérifiez votre connexion et réessayez.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour accéder aux PDF et aux envois.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Votre rôle ne permet pas cette action.",
    },
    notFound: {
      title: "Document introuvable",
      description: "La facture, l’avoir ou le devis demandé n’existe pas.",
    },
    server: {
      title: "Échec de l’envoi",
      description: "Impossible de générer le PDF ou d’envoyer l’e-mail.",
    },
    unknown: {
      title: "Erreur inattendue",
      description: "Réessayez.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vos modifications restent dans le formulaire.",
    },
    conflict: {
      title: "Document non prêt",
      description: "Émettez le document avant de l’envoyer par e-mail.",
    },
  },
};
