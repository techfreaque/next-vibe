import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Connecter une banque",
  description:
    "Autorisez la consultation du compte. À votre retour, choisissez les opérations professionnelles à conserver et vérifiez le premier import.",
  company: "Entreprise",
  ledgerAccount: "Compte bancaire du grand livre",
  bankCountry: "Pays de la banque",
  bankName: "Nom de la banque",
  psu: "Type d’accès bancaire",
  personal: "Compte bancaire personnel",
  business: "Professionnel",
  start: "Lancer l’autorisation bancaire",
  ready: "Autorisation prête",
  continueDescription:
    "Vérifiez la banque et le compte comptable sélectionnés avant de continuer.",
  starting: "Démarrage de l’autorisation…",
  authorize: "Continuer vers votre banque",
  unavailable:
    "Impossible de lancer l’autorisation. Vérifiez la banque choisie et réessayez.",
  forbidden:
    "Vous n’avez pas accès à cette entreprise et à ce compte bancaire.",
  invalidAccount: "Le consentement bancaire est indisponible ou a expiré.",
  expiryTitle: "Le consentement bancaire expire bientôt",
  bankStep: "1 sur 4 · Choisir la banque",
  ledgerStep: "2 sur 4 · Choisir le compte comptable",
  authorizeStep: "3 sur 4 · Autoriser la consultation",
  next: "Choisir le compte comptable",
  back: "Revenir au choix de la banque",
  createAccount: "Créer un compte bancaire dans le plan comptable",
  noLedger:
    "Aucun compte bancaire actif dans le plan comptable de cette entreprise. Créez-en un pour continuer.",
  search: "Rechercher votre banque",
  noBanks:
    "Aucune banque correspondante. Vérifiez le nom, le pays ou le type de compte.",
  loading: "Chargement des banques…",
  unconfigured:
    "Demandez à l’administrateur du serveur de configurer l’identifiant de l’application Enable Banking et sa clé de signature.",
  directoryUnavailable:
    "L’annuaire des banques est indisponible. Essayez de le recharger.",
  retry: "Réessayer",
};
