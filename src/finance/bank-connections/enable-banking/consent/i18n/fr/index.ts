import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Connecter une banque",
  description:
    "Choisissez la banque et le compte comptable. Votre banque autorise la lecture pour une durée maximale de 180 jours.",
  company: "Entreprise",
  ledgerAccount: "Compte bancaire du grand livre",
  bankCountry: "Code pays de la banque",
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
};
