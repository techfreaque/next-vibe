import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Confidentialité bancaire",
  description:
    "Vérifiez les opérations des comptes mixtes avant leur transfert en comptabilité.",
  connection: "Connexion bancaire",
  empty: "Aucune opération n’attend d’examen pour cette connexion.",
  selectConnection:
    "Choisissez une connexion bancaire pour afficher ses réglages.",
  policy: "Paramètres de confidentialité",
  policyDescription:
    "Définissez quelles opérations peuvent être transférées en comptabilité.",
  mode: "Mode",
  retention: "Conservation en jours",
  rules: "Règles",
  suggestions: "Fournisseurs suggérés",
  inbox: "Opérations à examiner",
  decision: "Décision concernant cette opération",
  decisionDescription:
    "Importez l’opération professionnelle ou effacez les détails de l’opération privée.",
  operation: "Action sur la règle",
  ruleField: "Champ à comparer",
  ruleMatch: "Type de correspondance",
  literal: "Texte à comparer",
  outcome: "Résultat",
  ruleSupplier: "Fournisseur pour les totaux (facultatif)",
  chooseSupplier: "Choisir un fournisseur",
  clearSupplier: "Retirer le fournisseur",
  identity: "Identifiant de l’opération",
  always: "Toujours appliquer cette décision à ce même tiers",
  apply: "Appliquer",
  saved: "Enregistré",
  ruleSaved: "Règle enregistrée",
  ruleFailed: "La décision a été enregistrée. La règle n’a pas pu l’être.",
  addSuggestion: "Ajouter comme règle professionnelle",
  editPolicy: "Modifier les paramètres",
  editRule: "Ajouter ou modifier une règle",
  approving: "Import professionnel en attente",
  privateAction: "Garder cette opération privée",
  businessAction: "Transférer en comptabilité",
  expires: "Expire le {{date}}",
  businessExplanation:
    "En mode professionnel, les nouvelles opérations sans règle passent en comptabilité.",
  modes: {
    mixed: "Compte mixte",
    business: "Compte exclusivement professionnel",
  },
  outcomes: {
    business: "Professionnelle",
    private: "Privée",
  },
  ruleFields: {
    counterparty: "Tiers",
    iban: "IBAN",
    description: "Description",
  },
  matches: {
    equals: "Exacte",
    contains: "Contient",
    startsWith: "Commence par",
  },
  operations: {
    policy: "Modifier les paramètres",
    set: "Ajouter ou remplacer la règle",
    remove: "Supprimer la règle",
  },
  errors: {
    forbidden: "Cette connexion bancaire ne vous appartient pas.",
    invalid: "Vérifiez les champs et réessayez.",
    conflict: "L’opération a changé ou ses justificatifs ont expiré.",
    unavailable: "L’opération de confidentialité a échoué.",
    import: "L’opération approuvée n’a pas pu être importée.",
  },
};
