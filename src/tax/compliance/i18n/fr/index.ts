import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { compliance: "Conformité", tax: "Fiscalité" },
  enums: {
    vatTreatment: {
      domestic: "Vente nationale avec TVA",
      reverseChargeDomestic: "Autoliquidation nationale",
      euServices: "Prestation à une entreprise de l'UE (autoliquidation)",
      euGoods: "Livraison intracommunautaire (exonérée)",
      export: "Exportation hors UE (exonérée)",
      exempt: "Opération exonérée de TVA",
    },
    severity: {
      error: "Bloque l'émission",
      warning: "À vérifier",
      info: "Remarque",
    },
  },
  issues: {
    issuerAddressMissing:
      "Ajoutez la rue, la ville et le code postal de l'entreprise. Les factures doivent indiquer l'adresse complète.",
    issuerRegistrationMissing:
      "Ajoutez le numéro d'immatriculation de l'entreprise (IČO). Il doit figurer sur chaque facture.",
    issuerRegistrationInvalid:
      "Le numéro d'immatriculation (IČO) n'est pas valide. Il compte 8 chiffres, dont une clé de contrôle.",
    issuerTaxIdMissing:
      "Ajoutez le numéro fiscal (DIČ). Il doit figurer sur chaque facture.",
    issuerTaxIdInvalid:
      "Le numéro fiscal (DIČ) n'est pas valide. Il compte 10 chiffres.",
    issuerVatIdMissing:
      "Ajoutez le numéro de TVA intracommunautaire (IČ DPH). Les entreprises assujetties doivent l'indiquer sur leurs factures.",
    issuerVatIdInvalid:
      "Le numéro de TVA (IČ DPH) n'est pas valide. Il se compose de SK suivi de 10 chiffres.",
    customerVatIdMissing:
      "Ajoutez le numéro de TVA du client à l'adresse de facturation. L'autoliquidation et les opérations intracommunautaires l'exigent.",
    customerVatIdInvalid: "Le numéro de TVA du client n'est pas valide.",
    customerNotForeignEu:
      "Les opérations intracommunautaires exigent un numéro de TVA client d'un autre pays de l'UE.",
    customerNotDomestic:
      "L'autoliquidation nationale exige un numéro de TVA client de votre pays.",
    treatmentNotAllowed:
      "Ce traitement TVA ne correspond pas au régime de TVA de l'entreprise. Choisissez un autre traitement ou modifiez le régime.",
    treatmentRequiresZeroRate:
      "L'autoliquidation et les opérations exonérées ne portent pas de TVA. Passez toutes les lignes à 0 %.",
    rateNotValidOnDate:
      "Le taux de TVA de {{rate}} % ne s'applique pas au {{date}}. Utilisez un taux en vigueur à la date de livraison.",
    zeroRateWithoutReason:
      "Une ligne porte 0 % de TVA sur une vente nationale. Choisissez l'exonération ou l'autoliquidation applicable.",
    issueDeadlinePassed:
      "Émise {{days}} jours après la livraison. Le délai légal est de {{limit}} jours.",
    regimeNotElected:
      "Aucun régime de TVA enregistré. Tant que vous n'en choisissez pas, l'ERP traite l'entreprise comme assujettie à la TVA.",
    chartTemplateMismatch:
      "Le plan comptable ne provient pas du modèle de ce pays.",
    taxRatesMissing:
      "Les taux de taxe de ce pays sont absents. Ajoutez-les pour que les documents puissent les utiliser.",
    taxRatesOutdated:
      "Certains taux actifs ne sont plus en vigueur. Désactivez-les ou fixez une date de fin.",
    fiscalProviderMissing:
      "Les ventes en espèces et par carte exigent une caisse enregistreuse eKasa certifiée. Les ventes en caisse restent bloquées jusqu'à son raccordement.",
    eInvoicingUpcoming:
      "La facture électronique structurée devient obligatoire le {{date}}. L'export Peppol UBL est prêt.",
    vatThresholdNear:
      "Le chiffre d'affaires de cette année civile s'élève à {{turnover}}. L'immatriculation à la TVA est obligatoire au-delà de {{threshold}}.",
    vatThresholdExceeded:
      "Le chiffre d'affaires de cette année civile s'élève à {{turnover}}, au-delà du seuil de TVA de {{threshold}}. Immatriculez l'entreprise à la TVA.",
  },
  review: {
    title: "Contrôle de conformité par pays",
    titleShort: "Contrôle de conformité",
    description:
      "Voyez quelles obligations légales du pays de l'entreprise sont remplies et ce qu'il faut corriger en priorité.",
    company: {
      label: "Entreprise",
      description: "L'entreprise à contrôler",
    },
    disclaimer:
      "Nous fournissons des outils, pas de conseil fiscal. Faites vérifier vos déclarations par votre conseiller fiscal.",
    country: "Règles du pays",
    regime: "Régime de TVA",
    findings: "Constats",
    findingCode: "Constat",
    findingSeverity: "Gravité",
    allClear: "Toutes les exigences de ce pays sont remplies.",
    countries: {
      SK: "Slovaquie",
      DE: "Allemagne",
      AT: "Autriche",
      XX: "Générique (sans règles nationales)",
    },
    facts: {
      title: "Ce que l'ERP prépare",
      vatReturn: "Déclaration de TVA et relevé de contrôle",
      statements: "Comptes annuels réglementaires",
      fiscal: "Reçus fiscaux (eKasa)",
      eInvoicing: "Facture électronique obligatoire à partir du",
      yes: "Disponible",
      no: "Non disponible pour ce pays",
      notRequired: "Non requis",
      required: "Requis, via une caisse enregistreuse eKasa certifiée",
    },
    actions: {
      company: "Modifier les données de l'entreprise",
      regime: "Choisir le régime de TVA",
      rates: "Vérifier les taux de taxe",
      chart: "Configurer le plan comptable",
      vatReturn: "Ouvrir la déclaration de TVA",
      fiscal: "Ouvrir les réglages fiscaux de la caisse",
    },
    pickCompany: "Choisissez une entreprise à contrôler.",
    errors: {
      validation: {
        title: "Requête invalide",
        description: "Choisissez une entreprise dont vous êtes membre.",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour contrôler la conformité.",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'êtes pas membre de cette entreprise.",
      },
      notFound: {
        title: "Entreprise introuvable",
        description: "L'entreprise n'existe pas ou est inactive.",
      },
      conflict: {
        title: "Conflit",
        description:
          "L'entreprise a été modifiée pendant le contrôle. Réessayez.",
      },
      server: {
        title: "Échec du contrôle",
        description:
          "Le contrôle de conformité n'a pas pu s'exécuter. Réessayez.",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion et réessayez.",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème est survenu. Réessayez.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord vos modifications.",
      },
    },
    success: {
      title: "Conformité contrôlée",
      description:
        "Les constats reflètent les données actuelles de l'entreprise.",
    },
  },
};
