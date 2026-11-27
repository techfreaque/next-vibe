import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    recurring: "recurrent",
    settings: "parametres",
  },
  settings: {
    title: "Paramètres de paiement de la société",
    description:
      "Configurez l’IBAN/BIC pour les PDF et QR codes, les liens Stripe et la facturation récurrente.",
    saveTitle: "Enregistrer les paramètres",
    saveSuccess: "Paramètres enregistrés",
    loadSuccess: "Paramètres chargés",
    bankSection: "Coordonnées bancaires",
    bankAccountHolder: "Titulaire du compte",
    bankIban: "IBAN",
    bankBic: "BIC / SWIFT",
    stripeSection: "Liens de paiement Stripe",
    stripeEnabled:
      "Activer les liens de paiement Stripe sur les factures émises",
    stripeAccountLabel: "Nom du compte Stripe",
    stripeClearingAccountId: "Compte de compensation Stripe",
    autoBookStripePayments:
      "Comptabiliser automatiquement les règlements Stripe",
    recurringSection: "Automatisation des factures récurrentes",
    recurringInvoicesEnabled:
      "Activer l’émission automatique des factures récurrentes pour cette société",
    saveAction: "Enregistrer",
  },
  checkout: {
    title: "Créer un lien de paiement Stripe",
    description:
      "Préparez ou actualisez un lien Stripe Checkout pour cette facture émise.",
    success: "Lien de paiement Stripe prêt",
    paymentUrl: "Lien de paiement",
    sessionId: "Session Checkout",
    amountCents: "Montant ouvert (centimes)",
    reused: "Lien existant réutilisé",
    action: "Préparer le lien",
    openPay: "Payer en ligne",
  },
  recurring: {
    listTitle: "Factures récurrentes",
    listDescription:
      "Gérez les échéanciers mensuels, trimestriels et annuels. Désactivé par défaut par société.",
    listSuccess: "Échéanciers chargés",
    createTitle: "Nouvel échéancier de facturation",
    createDescription:
      "Définissez client, fréquence, prochaine date et lignes.",
    createSuccess: "Échéancier créé",
    toggleTitle: "Modifier l’échéancier",
    toggleDescription:
      "Activez, mettez en pause ou définissez une date de fin.",
    toggleSuccess: "Échéancier mis à jour",
    runTitle: "Exécuter les factures récurrentes dues",
    runDescription:
      "Prévisualisez ou émettez les factures pour tous les échéanciers actifs dus.",
    runSuccess: "Exécution terminée",
    companyDisabledBanner:
      "L’émission automatique est désactivée pour cette société. Activez-la dans les paramètres de paiement.",
    openSettings: "Paramètres de paiement",
    newSchedule: "Nouvel échéancier",
    runDue: "Exécuter les dus",
    previewRun: "Aperçu",
    applyRun: "Émettre les factures dues",
    empty: "Aucun échéancier récurrent",
    emptyHint:
      "Créez un échéancier mensuel ou annuel pour automatiser la facturation.",
    enabled: "Actif",
    paused: "En pause",
    enableAction: "Activer",
    pauseAction: "Mettre en pause",
    frequency: {
      MONTHLY: "Mensuelle",
      QUARTERLY: "Trimestrielle",
      YEARLY: "Annuelle",
    },
    status: {
      preview: "Dû (aperçu)",
      created: "Brouillon créé",
      issued: "Émise",
      skipped_ended: "Terminé",
      failed: "Échec",
    },
    cronName: "Exécuteur de factures récurrentes",
    cronDescription:
      "Émet automatiquement les factures récurrentes dues pour les sociétés activées.",
  },
  fields: {
    companyId: "Société",
    invoiceId: "Facture",
    scheduleId: "Échéancier",
    title: "Intitulé",
    customerName: "Nom du client",
    customerEmail: "E-mail du client",
    frequency: "Fréquence",
    nextRunDate: "Prochaine date",
    endDate: "Date de fin (facultatif)",
    dueDays: "Délai de paiement (jours)",
    currency: "Devise",
    notes: "Notes de facture",
    lineDescription: "Description de la ligne",
    lineQuantity: "Quantité",
    lineUnitPrice: "Prix unitaire",
    lineTaxRate: "Taux TVA (ex. 0.20)",
    isEnabled: "Activé",
    autoIssue: "Émettre automatiquement",
    autoSendEmail: "Envoyer le PDF par hi@",
    dryRun: "Aperçu uniquement",
    asOfDate: "À la date (YYYY-MM-DD)",
    schedules: "Échéanciers",
    companyEnabled: "Auto-émission société active",
    processedCount: "Traités",
    issuedCount: "Émises",
    failedCount: "Échecs",
    items: "Résultats",
    lastRunAt: "Dernière exécution",
  },
  errors: {
    validation: {
      title: "Vérifiez votre saisie",
      description: "Vérifiez les dates, montants et champs requis.",
    },
    network: {
      title: "Erreur réseau",
      description: "Vérifiez votre connexion et réessayez.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour gérer la facturation récurrente.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Votre rôle ne permet pas cette action.",
    },
    notFound: {
      title: "Introuvable",
      description: "La société, facture ou l’échéancier n’existe pas.",
    },
    server: {
      title: "Échec de l’opération",
      description: "Réessayez.",
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
      title: "Action bloquée",
      description: "Vérifiez l’état de la facture ou des paramètres.",
    },
  },
};
