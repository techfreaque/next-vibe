import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Export CSV du journal",
  description:
    "Exportez les écritures comptabilisées et leurs contrepassations pour une entreprise et une devise.",
  company: "Entreprise",
  currency: "Devise",
  currencyHint: "Saisissez un code de devise à trois lettres, par exemple EUR.",
  otherCurrency: "Autre devise",
  debitCount: "Lignes au débit",
  creditCount: "Lignes au crédit",
  invalidLine:
    "Une ligne enregistrée comporte un sens débit ou crédit invalide.",
  from: "Du",
  to: "Au",
  prepare: "Préparer le CSV",
  preparing: "Préparation du CSV…",
  download: "Télécharger le CSV",
  copy: "Copier le CSV",
  copied: "CSV copié",
  copyFailed: "La copie du CSV a échoué. Réessayez.",
  filename: "Nom du fichier",
  rowCount: "Lignes du journal",
  invalidDates:
    "Sélectionnez une période valide. La date de fin doit être égale ou postérieure à la date de début.",
  tooLarge:
    "L’export dépasse 10 000 lignes ou 5 Mio. Choisissez une période plus courte.",
  ready: "CSV prêt",
  headerEntry: "Numéro d’écriture",
  headerDate: "Date comptable",
  headerPosted: "Heure de comptabilisation (UTC)",
  headerSource: "Source",
  headerAccountCode: "Code du compte",
  headerAccountName: "Intitulé du compte",
  headerDescription: "Libellé de l’écriture",
  headerLineDescription: "Libellé de la ligne",
  headerCurrency: "Devise",
  headerDebit: "Débit",
  headerCredit: "Crédit",
  errors: {
    unauthorized: { title: "Non autorisé", description: "Connexion requise" },
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez tous les champs",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Permissions insuffisantes",
    },
    server: {
      title: "Erreur serveur",
      description: "L'opération a échoué. Veuillez réessayer",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    conflict: { title: "Conflit", description: "Conflit de données" },
    network: {
      title: "Erreur réseau",
      description: "Impossible de joindre le serveur",
    },
    notFound: { title: "Introuvable", description: "Ressource introuvable" },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
  },
  tags: { journal: "journal", export: "export" },
};
