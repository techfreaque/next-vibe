import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Engagements sur les crédits clients",
  description:
    "Consultez les engagements comptabilisés pour les packs de crédits payés liés à cette entreprise.",
  tag: "Engagements sur crédits",
  company: "Entreprise",
  choose:
    "Sélectionnez une entreprise pour voir les engagements comptabilisés.",
  empty: "Aucune écriture liée à des crédits payés",
  account: "Compte comptable",
  currency: "Devise",
  amount: "Solde comptabilisé",
  asOf: "Situation au",
  reportDay: "Jusqu’au {{date}} (UTC)",
  scope:
    "Le rapport couvre les ventes, remboursements, produits constatés et extournes liés. Les crédits en portefeuille et les montants sans lien vérifié avec l’entreprise sont exclus.",
  ledgerScope:
    "Ouvrez un compte pour consulter son grand livre complet, y compris les écritures hors rapport.",
  supplierLink: "Consulter les avances aux fournisseurs",
  errors: {
    validation: {
      title: "Vérifier l’entreprise sélectionnée",
      description:
        "Sélectionnez une entreprise active à laquelle vous avez accès.",
    },
    forbidden: {
      title: "Accès à l’entreprise requis",
      description: "Vous n’avez pas accès à cette entreprise.",
    },
    server: {
      title: "Impossible de charger les engagements sur crédits",
      description: "Essayez de recharger le rapport.",
    },
  },
};
