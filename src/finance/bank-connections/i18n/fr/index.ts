import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  possibleDuplicateBookings:
    "Des opérations peuvent recouper un import précédent. Vérifiez le compte bancaire dans le grand livre avant de réessayer. Aucune opération n’a été enregistrée.",
  privacyBeforeImport:
    "Définissez les règles de confidentialité avant de prévisualiser ou d’importer des opérations.",
  previewResult: "Résultat de l’aperçu",
  importResult: "Résultat de l’importation",
  bookingDay: "Date de comptabilisation {{date}}",
  bookingWindow: "Période comptable du {{from}} au {{to}}",
  providerBookings: "Opérations du prestataire contrôlées",
  eligibleBookings: "Opérations professionnelles admissibles",
  savedBookings: "Opérations enregistrées",
  previewPrivacyResult:
    "Les opérations écartées ne répondaient pas à vos règles de confidentialité. Le rapprochement avec les factures s’effectue à l’enregistrement. Les correspondances ambiguës restent ouvertes.",
  importPrivacyResult:
    "Les opérations écartées ne répondaient pas à vos règles de confidentialité. Les correspondances ambiguës avec des factures restent ouvertes.",
  setup: "Configurer le compte bancaire",
  setupHint:
    "Enregistrez le compte comptable et la date de début, puis configurez la confidentialité. La configuration ne lit aucune opération.",
  privacyAction: "Configurer la confidentialité",
  privacyRequired:
    "Enregistrez vos choix de confidentialité avant de consulter les opérations bancaires.",
  setupSaved:
    "Compte enregistré. Vous pouvez définir les règles de sélection des fournisseurs.",
  supplierTotals: "Totaux des fournisseurs identifiés sur la période",
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
  maintenance: "Entretien des connexions bancaires",
  maintenanceHint:
    "Efface les données privées arrivées à échéance, rappelle aux titulaires de renouveler leur consentement et actualise les connexions activées.",
  completed: "Connexions actualisées",
  failedFeeds: "Connexions à vérifier",
  notified: "Rappels envoyés",
  matchedOnly:
    "Conserver uniquement les opérations correspondant aux règles fournisseurs",
  discardedCount: "Écartées",
  autoMatched: "Rapprochées des factures",
  discardHint:
    "Les opérations sans correspondance sont écartées sans en conserver les détails. Désactivez cette option pour utiliser la boîte de vérification privée.",
  company: "Entreprise",
  account: "Compte bancaire du grand livre",
  start: "Premier jour comptable",
  daily: "Synchroniser chaque jour",
  connect: "Connecter une banque",
  review: "Vérifier les opérations",
  held: "À vérifier",
  privateCount: "Privées",
  connected:
    "4 sur 4 · Accès autorisé. Choisissez le compte à relier à votre comptabilité.",
  failed: "La connexion a échoué. Réessayez de connecter la banque.",
  check: "Vérifier l’application",
  active: "L’application est activée pour consulter les comptes.",
  inactive: "L’accès aux informations sur les comptes est inactif.",
  appUnavailable: "État de l’application indisponible.",
  linking:
    "Connectez une banque pour autoriser la consultation. Vous vérifierez les règles de confidentialité avant le premier import.",
  pick: "Sélectionnez un compte pour prévisualiser les opérations comptabilisées.",
  finishPeriod: "Clore cette période",
  apply: "Importer",
  previewAction: "Aperçu de l’import",
  dailyHint:
    "Choisissez une date de début et vérifiez les fournisseurs reconnus avant de lancer l’import.",
  title: "Comptes bancaires connectés",
  description:
    "Vérifiez ou importez les opérations comptabilisées sur un compte bancaire autorisé.",
  select: "Sélectionner une connexion bancaire",
  preview: "Aperçu uniquement",
  sync: "Synchroniser les opérations",
  connection: "Connexion bancaire",
  consentUntil: "Consentement valable jusqu’au",
  period: "Période comptable",
  imported: "Importées",
  skipped: "Déjà importées",
  unavailable:
    "Cette connexion bancaire est indisponible. Vérifiez la connexion et les droits d’accès.",
  consent: "Le consentement a expiré. Renouvelez-le auprès de la banque.",
  rateLimit: "La banque est occupée. Réessayez plus tard.",
  invalidResponse:
    "Le relevé bancaire est incomplet. Le point de reprise a été conservé.",
  windowTooLarge:
    "Cette période contient trop d’opérations. Importez un relevé plus court.",
  empty: "Aucun compte bancaire connecté",
  noBookings: "Aucune opération sur cette période.",
  newBookings: "Nouvelles opérations",
  through: "Dernier jour importé",
  viewTransactions: "Voir les opérations importées",
};
