import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    bank: "banque",
    reconciliation: "rapprochement",
  },
  fields: {
    exactAmount: "Montant exact",
    status: "État",
    company: "Entreprise",
    account: "Compte bancaire",
    csv: "Relevé CSV",
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
    csvFormat: "Format CSV",
    commaFormat: "Séparateur virgule et point décimal",
    semicolonFormat: "Séparateur point-virgule et virgule décimale",
    sameDay: "Même montant, même jour",
    upload: "Choisir un fichier CSV",
    dropCsv: "Ou déposez un CSV ici",
    pasteCsv: "Coller le texte CSV",
    supportedFormat: "Format accepté",
    mapping: "Associer les colonnes",
    chooseColumn: "Choisir une colonne CSV",
    preview: "Aperçu (5 premières opérations)",
    matchRow: "Rapprocher",
    unmatched: "En attente",
    csvHelp:
      "Associez un identifiant stable, une date (AAAA-MM-JJ ou JJ.MM.AAAA), un montant signé dans le format décimal choisi et un code devise en majuscules. Les montants positifs sont des entrées. Une opération par ligne, sans séparateur de milliers.",
    unsupported:
      "Convertissez au préalable les fichiers CAMT XML, OFX/QFX, MT940, les tableurs, les PDF et les CSV à autre séparateur ou à enregistrements multilignes.",
    chooseScope: "Sélectionnez une entreprise et un compte bancaire actif.",
    empty: "Aucune ligne à rapprocher",
    emptyHint: "Importez un relevé pour commencer le rapprochement.",
    review: "Examiner les correspondances",
    noCandidates: "Aucune ligne comptable correspondante",
    noCandidatesHint:
      "Vérifiez le compte bancaire, la devise et le montant de l’écriture.",
    alreadyMatched: "Cette ligne a déjà été rapprochée.",
    importAction: "Importer le CSV",
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
  },
  import: {
    title: "Importer un relevé bancaire",
    description: "Importez ou collez le CSV d’un compte bancaire.",
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
