import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  saleType: "Vente",
  feeType: "Frais",
  refundType: "Remboursement",

  title: "Comptabilisation des paiements",
  review: "Vérifier ou comptabiliser les paiements",
  configure: "Associer une offre au catalogue",
  company: "Entreprise",
  product: "Produit du catalogue",
  providerStripe: "Stripe",
  providerNow: "NOWPayments",
  currencyEur: "EUR",
  currencyUsd: "USD",
  currencyPln: "PLN",
  provider: "Prestataire",
  merchant: "Identifiant vérifié du commerçant",
  offer: "Identifiant d’offre ou de prix",
  currency: "Devise",
  recognition: "Reconnaissance",
  immediate: "Constater à la vente",
  deferred: "Différer au passif",
  receivable: "Compte clients",
  clearing: "Compte de compensation",
  consideration: "Compte de produits ou de passif",
  vat: "Compte de TVA collectée",
  expense: "Compte de frais",
  zeroTax:
    "Confirmez que la TVA non indiquée sur ce produit à taux nul est égale à zéro",
  ids: "Identifiants des pièces vérifiées",
  dryRun: "Aperçu uniquement",
  submit: "Exécuter",
  sources: "Pièces vérifiées",
  gross: "Montant brut",
  tax: "Montant de la taxe",
  fee: "Frais du prestataire",
  receipt: "Références de facture et d’écriture",
  posted: "Comptabilisé",
  ready: "Prêt à comptabiliser",
  saved: "Offre associée",
  alreadyPosted: "Déjà comptabilisé",
  forbidden: "Vous n’avez pas les droits pour cette entreprise.",
  missingEvidence: "La pièce vérifiée est indisponible.",
  missingMapping: "Associez une offre et un produit correspondants.",
  unsupportedCurrency: "Vérifiez la devise et rapprochez le change séparément.",
  unmatchedTransaction:
    "Associez le paiement local vérifié avant de comptabiliser.",
  unverifiedTax:
    "Obtenez la ventilation fiscale vérifiée ou configurez explicitement un taux nul admissible.",
  invalidAccounts: "Vérifiez les comptes actifs et leur affectation.",
  periodClosed: "Ouvrez la période ou vérifiez la date de la pièce.",
  unverifiedRefundAllocation:
    "Obtenez la ventilation du remboursement ou rapprochez-le de la vente originale.",
  creditsGranted: "Crédits attribués",
  creditsConsumed: "Crédits utilisés",
  deferredRefundNeedsReview:
    "Vérifiez la part du service ou du pack de crédits déjà utilisée. Rapprochez le remboursement du passif restant et des produits comptabilisés.",
  feeBillLinked: "Facture fournisseur liée",
  openFeeEntry: "Rapprocher la facture de frais",
  openJournal: "Ouvrir l’écriture comptable",
  openInvoice: "Ouvrir la facture",
  openFeeBill: "Ouvrir la facture fournisseur",
  feeNeedsBill:
    "Saisissez la facture de frais dans les factures fournisseurs et vérifiez la taxe.",
  taxRegimeConflict:
    "Le prestataire a facturé la TVA pendant une exonération. Rapprochez la pièce.",
  inconsistentEvidence: "La pièce vérifiée diffère du paiement local.",
  postingFailed:
    "La comptabilisation a échoué. Vérifiez la pièce et réessayez.",
  missingProduct:
    "Choisissez un produit actif avec une référence et un taux corrects.",
  conflict: "L’offre est déjà associée.",
  empty: "Aucune pièce vérifiée correspondante.",
  intro:
    "Associez un produit à une offre vérifiée et examinez la pièce de vente.",
  stripeTest: "Commerçant Stripe de test",
  stripeLive: "Commerçant Stripe réel",
  nowMerchant: "Commerçant NOWPayments",
  listError: "Chargement des pièces impossible",
  detail: "Vérifiez l’entreprise et les données saisies.",
  recognizedRevenue: "Produits comptabilisés",
  remainingLiability: "Passif restant",
  recognitionTitle: "Comptabiliser les produits prépayés",
  recognitionDescription:
    "Ajoutez une règle datée pour cette offre ou laissez ces champs vides pour vérifier la consommation des crédits.",
  recognitionFrom: "Date d’effet (AAAA-MM-JJ)",
  recognitionAccount: "Compte de produits",
  recognitionServicePeriods:
    "Comptabiliser les périodes d’abonnement vérifiées",
  recognitionExpiry: "Comptabiliser les crédits expirés admissibles",
  recognitionEntries: "Mouvements de crédits",
  recognitionPreview: "Aperçu prêt",
  recognitionPosted: "Produit comptabilisé",
  recognitionCurrent: "Aucun nouveau mouvement admissible",
  recognitionPolicySaved: "Règle enregistrée",
  recognitionPolicyConflict:
    "La date recoupe une règle existante ou une ventilation comptabilisée.",
  recognitionPolicyMissing: "Ajoutez une règle valable à la date du mouvement.",
  recognitionEvidenceMissing:
    "Vérifiez la vente, l’encaissement et le mouvement de crédits.",
  recognitionExpiryReview: "Vérifiez l’expiration et la règle applicable.",
  recognitionServiceConflict:
    "Le prestataire a transmis des dates de service ou des montants contradictoires. Vérifiez la facture originale avant de comptabiliser les produits.",
  recognitionSubscriptionReview:
    "L’abonnement exige une ventilation vérifiée par période de service.",
  recognitionInvalidAccounts:
    "Sélectionnez les comptes de passif et de produits actifs de cette entreprise.",
  recognitionPeriodClosed: "Ouvrez la période comptable du mouvement.",
  recognitionForbidden:
    "Vous ne pouvez pas comptabiliser les produits de cette entreprise.",
  recognitionFailed:
    "Échec de la comptabilisation. Vérifiez le justificatif et réessayez.",
  chooseProvider: "Choisir un prestataire",
  chooseCurrency: "Choisir une devise",
  chooseRecognition: "Choisir quand comptabiliser les produits",
  noVatAccount:
    "Ajoutez un compte actif de TVA collectée au plan comptable pour le sélectionner ici.",
  saveOffer: "Enregistrer l’offre",
};
