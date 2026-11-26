import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Erreur de validation",
      description:
        "Vérifiez le pays de l’entreprise, le régime de TVA et la date d’effet.",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous devez être connecté",
    },
    forbidden: {
      title: "Accès refusé",
      description:
        "Seuls les propriétaires et les administrateurs de l’entreprise peuvent modifier le régime de TVA.",
    },
    notFound: {
      title: "Introuvable",
      description: "Entreprise introuvable",
    },
    conflict: {
      title: "Date d’effet déjà utilisée",
      description: "Un régime de TVA est déjà enregistré pour cette date.",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne est survenue",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau est survenue",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue est survenue",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
  },
  reviewDescription:
    "Consultez le régime de TVA applicable à cette entreprise à la date choisie.",
  view: "Consulter le régime de TVA",
  asOf: "Au",
  change: "Modifier le régime fiscal",
  regimes: {
    standard: "Régime normal de TVA",
    german: "Allemagne : franchise des petites entreprises (§ 19 UStG)",
    austrian:
      "Autriche : franchise des petites entreprises (§ 6, al. 1, point 27 UStG)",
    slovak: "Slovaquie : entreprise non immatriculée à la TVA",
    slovakSection7:
      "Slovaquie : immatriculée à la TVA selon le § 7 (non assujettie)",
    slovakSection7a:
      "Slovaquie : immatriculée à la TVA selon le § 7a (non assujettie)",
  },
  title: "Régime de TVA de l’entreprise",
  description:
    "Choisissez le régime de TVA des pièces à partir d’une date donnée.",
  company: "Entreprise",
  from: "Date d’effet",
  save: "Enregistrer le régime",
  regime: "Régime de TVA",
  saved: "Le régime s’applique à compter de la date choisie.",
  conflict: "Choisissez une autre date ou vérifiez le régime déjà enregistré.",
  foreign:
    "Consultez votre conseil fiscal pour les prestations étrangères. L’autoliquidation peut s’appliquer même en cas de franchise.",
  saleConflict:
    "La TVA facturée est incompatible avec la franchise. Vérifiez les lignes avant d’émettre la facture.",
  choose: "Choisir le régime de TVA",
  back: "Retour",
  appliesOn: "Régime de TVA au {{date}}",
  invoiceText: "Mention sur les factures",
  savedTitle: "{{regime}} s’applique à partir du {{date}}",
  pickCompany: {
    title: "Choisissez une entreprise",
    message:
      "Voyez quelles règles de TVA s’appliquent à ses factures à une date donnée.",
  },
  hints: {
    standard:
      "Les factures appliquent la TVA aux taux de l’entreprise. La TVA sur achats est déductible.",
    german: "Factures sans TVA, avec la mention d’exonération du § 19 UStG.",
    austrian:
      "Factures sans TVA, avec la mention de la franchise autrichienne des petites entreprises.",
    slovak:
      "Factures sans TVA, car l’entreprise n’est pas immatriculée à la TVA.",
    slovakSection7:
      "Factures nationales sans TVA. Les acquisitions de biens dans l’UE au-delà du seuil sont taxées par vous avec votre numéro de TVA SK.",
    slovakSection7a:
      "Factures nationales sans TVA. Les services aux entreprises de l’UE passent en autoliquidation avec votre numéro de TVA SK.",
  },
};
