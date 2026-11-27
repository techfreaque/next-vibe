import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  adjustment: {
    confirmHint:
      "Confirmez pour lier la ligne bancaire et comptabiliser les ajustements affichés.",
    autoMatch: "Rapprocher automatiquement les paiements fournisseurs vérifiés",
    autoMatched: "Rapprochés automatiquement",
    followup: "Suite à donner au mouvement",
    followupHint:
      "Vérifiez la facture provisoire ou annulez un rapprochement confirmé.",
    vendor: "Fournisseur",
    expenseAccount: "Compte de charges",
    reversalDate: "Date d’extourne (AAAA-MM-JJ)",
    reason: "Motif de l’annulation",
    openDraft: "Ouvrir la facture fournisseur",
    settings: "Paramètres de rapprochement",
    settingsHint:
      "Définissez la devise du compte, la paire de devises, la fenêtre de dates et les limites.",
    settingsSaved: "Paramètres de rapprochement enregistrés",
    save: "Enregistrer les paramètres",
    foreignCurrency: "Devise de facture pour les écarts de change",
    absTolerance: "Écart de change maximal dans la devise du compte",
    bpsTolerance: "Écart de change maximal en points de base",
    days: "Fenêtre de rapprochement en jours",
    gainAccount: "Compte de gains de change",
    lossAccount: "Compte de pertes de change",
    feeAccount: "Compte de frais documentés",
    invalidSettings:
      "Vérifiez la paire de devises, les limites et les comptes actifs de cette société.",
    description: "Écriture de rapprochement {{reference}}",
    unavailable:
      "Écriture impossible. Vérifiez la date, la période ouverte et les comptes.",
    journal: "Écriture d’ajustement",
    kind: "Type de rapprochement",
    fxDifference: "Gain ou perte de change",
    release: "Annuler le rapprochement",
    releaseHint:
      "Dissociez la ligne et extournez l’écriture dans une période ouverte.",
    releaseSuccess: "Rapprochement annulé",
    draft: "Brouillon depuis un mouvement bancaire",
    draftHint:
      "Utilisez le montant comptabilisé comme justificatif provisoire. Ajoutez la facture originale avant toute déduction fiscale.",
    draftReady: "Brouillon fournisseur prêt",
    confirmDraft: "Créer un brouillon provisoire",
    sourceMemo:
      "Justificatif bancaire {{reference}}. Facture fournisseur originale en attente.",
  },
  statement: {
    projected: "Prêtes à importer",
    localPreview:
      "L’aperçu du fichier affiche les dates et les montants avant le filtrage de confidentialité.",
    screenedOut: "Écartées par le contrôle de confidentialité",
    screenedOutCount:
      "Le contrôle de confidentialité a écarté {{count}} lignes du registre bancaire.",
    format: "Format du relevé",
    mapping: "Correspondance des colonnes",
    preview: "Aperçu de l’import",
    previewSuccess: "Aperçu de l’import",
    invalid:
      "Le format sélectionné ne permet pas de lire le relevé (ligne {{row}}).",
    decimal: "Séparateur décimal",
    dotDecimal: "Point décimal",
    commaDecimal: "Virgule décimale",
    unmapped: "Aucune colonne",
    overlap:
      "Chevauchement possible avec un autre relevé. Vérifiez les références bancaires d’origine.",
    columns: {
      counterpartyIban: "IBAN de la contrepartie",
      id: "Référence bancaire",
      date: "Date de comptabilisation",
      valueDate: "Date de valeur",
      amount: "Montant comptabilisé",
      currency: "Devise comptabilisée",
      nativeAmount: "Montant d’origine",
      nativeCurrency: "Devise d’origine",
      feeAmount: "Frais documentés",
      feeCurrency: "Devise des frais",
      description: "Description",
      counterparty: "Contrepartie",
      status: "Statut",
    },
    formats: {
      normalized: "CSV standard",
      c24: "CSV C24",
      revolut: "CSV Revolut particulier",
      revolutBusiness: "CSV Revolut Business",
      mapped: "CSV personnalisé",
      camt053: "CAMT.053",
      mt940: "MT940",
    },
  },
  tags: {
    bank: "banque",
    reconciliation: "rapprochement",
  },
  fields: {
    exactAmount: "Montant exact",
    status: "État",
    company: "Entreprise",
    account: "Compte bancaire",
    csv: "Relevé bancaire",
    line: "Ligne bancaire",
    transactionId: "Identifiant de transaction",
    bookedDate: "Date de comptabilisation",
    amount: "Montant",
    currency: "Devise",
    journalLine: "Ligne comptable",
    entryNumber: "Écriture comptable",
    description: "Description",
    journalDate: "Date de l’écriture",
    confirm: "Confirmer le rapprochement",
    imported: "Importées",
    skipped: "Doublons ignorés",
    matchedAt: "Rapprochée le",
    page: "Page",
    pageSize: "Lignes par page",
    total: "Total",
  },
  ui: {
    exactMatch: "Rapprochement exact",
    csvFormat: "Séparateur de colonnes",
    commaFormat: "Virgule",
    semicolonFormat: "Point-virgule",
    sameDay: "Même montant, même jour",
    upload: "Choisir le fichier du relevé",
    dropCsv: "Ou déposez un relevé ici",
    pasteCsv: "Coller le texte du relevé",
    supportedFormat: "Formats pris en charge",
    mapping: "Associer les colonnes",
    chooseColumn: "Choisir une colonne CSV",
    preview: "Aperçu (5 premières opérations)",
    matchRow: "Rapprocher",
    unmatched: "En attente",
    matched: "Rapproché",
    allLines: "Toutes",
    splitMatched: "Ventilé",
    selectAccount: "Ouvrir le compte",
    csvHelp:
      "Choisissez un export bancaire ou associez les colonnes CSV. La date comptable et le montant signé sont requis.",
    unsupported:
      "Utilisez CSV, CAMT.053 XML ou le texte MT940. Convertissez les PDF, tableurs et autres formats au préalable.",
    chooseScope: "Sélectionnez une entreprise et un compte bancaire actif.",
    empty: "Aucune ligne à rapprocher",
    emptyHint: "Importez un relevé pour commencer le rapprochement.",
    review: "Examiner les correspondances",
    noCandidates: "Aucune ligne comptable correspondante",
    noCandidatesHint:
      "Vérifiez le compte bancaire, la devise et le montant de l’écriture.",
    alreadyMatched: "Cette ligne a déjà été rapprochée.",
    importAction: "Importer le relevé",
    listAction: "Afficher les lignes bancaires",
    back: "Retour",
    previous: "Précédente",
    next: "Suivante",
    matchAction: "Rapprocher cette écriture",
    confirmHint:
      "Le lien conserve l’auteur de la confirmation. Il ne crée aucune écriture et ne déclenche aucun virement.",
  },
  errors: {
    validation: {
      title: "Vérifiez les données",
      description:
        "Sélectionnez une entreprise et un compte bancaire actif et imputable dans sa devise.",
    },
    network: {
      title: "Erreur réseau",
      description: "Vérifiez votre connexion et réessayez.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour utiliser le rapprochement bancaire.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Votre rôle dans l’entreprise ne permet pas cette action.",
    },
    notFound: {
      title: "Compte ou ligne bancaire indisponible",
      description: "Vérifiez l’entreprise et le compte bancaire sélectionnés.",
    },
    server: {
      title: "Opération bancaire échouée",
      description: "Réessayez. En cas d’échec, les données restent inchangées.",
    },
    unknown: {
      title: "Erreur bancaire inattendue",
      description: "Réessayez.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vos modifications sont toujours dans le formulaire.",
    },
    conflict: {
      title: "Conflit de rapprochement bancaire",
      description: "Actualisez le relevé et vérifiez l’écriture sélectionnée.",
    },
  },
  check: {
    encoding: "Enregistrez le fichier en CSV UTF-8.",
    mappingHeader:
      "Choisissez le séparateur et indiquez au moins quatre colonnes nommées dans l’en-tête.",
    mapping: "Choisissez une colonne différente pour chaque champ obligatoire.",
    columns: "La ligne {{row}} doit avoir les mêmes colonnes que l’en-tête.",
    value: "La valeur de {{field}} est invalide à la ligne {{row}}.",
    size: "Utilisez un CSV de 256 Ko et 1 000 lignes de données au maximum.",
    header:
      "Utilisez exactement les en-têtes transactionId,date,amount,currency.",
    empty: "Ajoutez au moins une ligne de transaction.",
    row: "Vérifiez l’identifiant, la date, le montant signé et la devise de la ligne {{row}}.",
    duplicate:
      "La ligne {{row}} répète un identifiant de transaction avec des données différentes.",
    storedDuplicate:
      "Une ligne enregistrée utilise déjà cet identifiant avec d’autres données.",
    currency: "Toutes les lignes doivent utiliser la devise de l’entreprise.",
    journalTaken: "La ligne comptable sélectionnée est déjà rapprochée.",
    journalMatch:
      "Choisissez une ligne comptabilisée et non rapprochée du même compte, du même montant et de la même devise.",
    confirmation: "Confirmez le rapprochement avant de l’enregistrer.",
    splitTotalMismatch:
      "La somme des lignes ventilées doit égaler exactement le montant de la ligne bancaire.",
    splitTargetInvalid:
      "Vérifiez que chaque facture, dépense ou compte appartient à cette société et correspond au sens du flux.",
  },
  reconciliation: {
    statusTitle: "Statut du rapprochement",
    accountsTitle: "Statut des comptes bancaires",
    unmatchedLines: "En attente",
    matchedLines: "Rapprochées",
    statementNet: "Solde relevé",
    ledgerBalance: "Solde comptable",
    difference: "Écart",
  },
  autoMatch: {
    title: "Rapprochement automatique",
    description:
      "Associez les lignes bancaires ouvertes aux factures, dépenses et paiements comptabilisés selon le montant, la référence, l’IBAN, la fenêtre de dates et la tolérance de change.",
    success: "Rapprochement automatique terminé",
    action: "Auto-rapprocher",
    dryRun: "Aperçu uniquement",
    previewAction: "Prévisualiser",
    applyAction: "Appliquer les rapprochements",
    previewBanner:
      "Aperçu : {{count}} correspondances sans ambiguïté trouvées.",
    appliedBanner: "{{count}} lignes bancaires rapprochées automatiquement.",
    skippedHint: "{{count}} lignes ambiguës ignorées pour revue manuelle.",
    matchedCount: "Rapprochées",
    invoiceMatches: "Factures",
    billMatches: "Factures fournisseurs",
    journalMatches: "Écritures",
    skippedAmbiguous: "Ambiguës ignorées",
    items: "Éléments rapprochés",
    targetType: "Type",
    targetLabel: "Cible",
    basisLabel: "Critère",
    emptyTitle: "Aucune correspondance automatique",
    emptyHint:
      "Vérifiez les lignes manuellement ou ajustez la fenêtre de dates et la tolérance de change.",
    targets: {
      journal_line: "Ligne comptable",
      invoice: "Facture",
      bill: "Facture fournisseur",
    },
    basis: {
      reference: "Référence document",
      iban: "IBAN",
      amount_date: "Montant et date",
      fx_tolerance: "Tolérance change ou frais",
    },
  },
  split: {
    title: "Ventiler la ligne bancaire",
    description:
      "Répartissez une ligne bancaire sur plusieurs factures, dépenses, comptes ou écritures.",
    success: "Ligne bancaire ventilée et rapprochée",
    openAction: "Ventiler",
    allocations: "Lignes de ventilation",
    count: "Affectations",
    remaining: "Reste à affecter",
    selectTarget: "Choisir une cible",
    addRow: "Ajouter une ligne",
    removeRow: "Supprimer",
    confirmAction: "Confirmer la ventilation",
    documentCandidates: "Factures et dépenses ouvertes",
    types: {
      journal_line: "Ligne comptable",
      invoice: "Facture ouverte",
      bill: "Dépense ouverte",
      account: "Compte comptable",
    },
  },
  import: {
    title: "Importer un relevé bancaire",
    description: "Importez ou collez un relevé pour un compte bancaire.",
    success: "Relevé traité",
  },
  list: {
    title: "Lignes bancaires à rapprocher",
    description:
      "Consultez les lignes importées et associez-les aux écritures comptabilisées.",
    success: "Lignes bancaires chargées",
  },
  candidates: {
    title: "Trouver une écriture correspondante",
    description:
      "Consultez les écritures bancaires comptabilisées du même montant et du même sens.",
    success: "Écritures correspondantes chargées",
  },
  match: {
    title: "Confirmer le rapprochement bancaire",
    description: "Associez cette ligne bancaire à son écriture comptabilisée.",
    success: "Ligne bancaire rapprochée",
  },
};
