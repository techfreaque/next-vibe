import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Fiscalité", vatReturn: "Déclaration de TVA" },
  title: "Déclaration de TVA",
  titleShort: "Déclaration de TVA",
  description:
    "Votre déclaration de TVA pour la période, au format officiel de votre pays.",
  company: {
    label: "Entreprise",
    description: "L'entreprise concernée par la déclaration",
  },
  period: {
    label: "Période",
    description: "Mois ou trimestre de la déclaration",
    month: "{{month}} {{year}}",
    quarter: "T{{quarter}} {{year}}",
  },
  disclaimer:
    "Nous fournissons des outils, pas de conseil fiscal. Faites vérifier vos déclarations par votre conseiller avant dépôt.",
  summary: "{{company}}, du {{from}} au {{to}}",
  formats: {
    SK_DPH: "Lignes de la déclaration DPH (DPHv25)",
    DE_USTVA: "Umsatzsteuer-Voranmeldung (UStVA)",
    DE_EUR_SMALL_BUSINESS: "Synthèse EÜR (franchise § 19 UStG)",
    AT_UVA: "Umsatzsteuervoranmeldung (U30)",
    AT_EA_SMALL_BUSINESS: "Synthèse recettes-dépenses (§ 6 al. 1 Z 27 UStG)",
    GENERIC_VAT: "Synthèse de TVA par taux",
  },
  dueByFormat: {
    SK_DPH:
      "À déposer par voie électronique au plus tard le 25 du mois suivant.",
    DE_USTVA: "Échéance le 10 du mois suivant via ELSTER.",
    DE_EUR_SMALL_BUSINESS:
      "Synthèse annuelle EÜR avec la déclaration de revenus.",
    AT_UVA: "Échéance le 15 du deuxième mois suivant via FinanzOnline.",
    AT_EA_SMALL_BUSINESS: "Synthèse annuelle pour petites entreprises.",
    GENERIC_VAT:
      "Vérifiez la date limite auprès de votre administration fiscale.",
  },
  smallBusiness: {
    title: "Aucune déclaration de TVA requise (franchise petite entreprise)",
    body: {
      SK_DPH: "Cette entreprise n'est pas assujettie à la TVA.",
      DE_USTVA: "Aucune déclaration UStVA périodique n'est requise.",
      DE_EUR_SMALL_BUSINESS:
        "Cette entreprise applique le régime § 19 UStG. Aucune UStVA périodique n'est due. Voici votre synthèse EÜR pour la période.",
      AT_UVA: "Aucune déclaration UVA périodique n'est requise.",
      AT_EA_SMALL_BUSINESS:
        "Cette entreprise applique la franchise § 6 al. 1 Z 27 UStG. Voici votre synthèse recettes-dépenses pour la période.",
      GENERIC_VAT: "Aucune déclaration de TVA n'est requise pour ce régime.",
    },
  },
  xmlSection: {
    SK_DPH: "Relevé de contrôle (KV DPH)",
    DE_USTVA: "XML ELSTER UStVA",
    DE_EUR_SMALL_BUSINESS: "Export XML",
    AT_UVA: "XML FinanzOnline UVA (U30)",
    AT_EA_SMALL_BUSINESS: "Export XML",
    GENERIC_VAT: "Export XML",
  },
  xmlNote: {
    SK_DPH: "Téléversez le XML KVDPHv25 sur le portail eDane.",
    DE_USTVA:
      "XML ELSTER UStVA prêt pour l'import comptable ou la transmission ERiC. La transmission directe requiert un certificat ERiC; vous pouvez aussi saisir les cases dans Mein ELSTER ou télécharger le CSV.",
    DE_EUR_SMALL_BUSINESS: "Utilisez l'export CSV structuré ci-dessus.",
    AT_UVA:
      "XML FinanzOnline U30 prêt pour le dépôt sur le portail ou la revue comptable.",
    AT_EA_SMALL_BUSINESS: "Utilisez l'export CSV structuré ci-dessus.",
    GENERIC_VAT: "Utilisez l'export CSV structuré ci-dessus.",
  },
  lines: {
    title: "Lignes de déclaration",
    line: "Ligne",
    meaning: "Signification",
    base: "Base imposable",
    amount: "Montant",
    r01: "Base imposable à 19 %",
    r02: "TVA à 19 %",
    r01a: "Base imposable à 5 %",
    r02a: "TVA à 5 %",
    r03: "Base imposable à 23 %",
    r04: "TVA à 23 %",
    r09: "Autoliquidation, base à 19 % (vous payez la taxe)",
    r10: "Autoliquidation, TVA à 19 %",
    r09a: "Autoliquidation, base à 5 %",
    r10a: "Autoliquidation, TVA à 5 %",
    r09b: "Autoliquidation, base à 23 %",
    r10b: "Autoliquidation, TVA à 23 %",
    r13: "Opérations exonérées",
    r14: "dont livraisons intracommunautaires de biens (§ 43)",
    r15: "dont exportations (§§ 46, 47)",
    r17: "TVA collectée totale",
    r18: "TVA déductible à 19 %",
    r18a: "TVA déductible à 5 %",
    r19: "TVA déductible à 23 %",
    r20: "dont factures nationales à 19 %",
    r20a: "dont factures nationales à 5 %",
    r21: "dont factures nationales à 23 %",
    r24: "Régularisations de base (avoirs, § 25)",
    r25: "Régularisations de TVA (avoirs, § 25)",
    r32: "TVA à payer",
    r33: "Crédit de TVA (remboursement)",
  },
  sections: {
    title: "Relevé de contrôle",
    section: "Section",
    count: "Lignes",
    A1: "A.1 Factures émises à des assujettis",
    A2: "A.2 Factures émises en autoliquidation nationale",
    B1: "B.1 Factures reçues, vous payez la taxe",
    B2: "B.2 Factures nationales reçues avec déduction",
    B31: "B.3.1 Factures simplifiées reçues (total)",
    C1: "C.1 Avoirs émis",
    D1: "D.1 Chiffre d'affaires de caisse",
    D2: "D.2 Autres opérations (clients sans numéro de TVA)",
  },
  warnings: {
    noVatId:
      "L'entreprise n'a pas de numéro de TVA valide configuré. Ajoutez-le avant le dépôt.",
    noTaxId:
      "L'entreprise n'a pas de numéro fiscal configuré. Ajoutez-le avant l'export.",
    customerVatIds:
      "{{count}} factures concernent des clients sans numéro de TVA et sont déclarées en D.2.",
    unmappedRates:
      "{{count}} lignes utilisent des taux non standards et ne figurent pas dans les lignes mappées. Vérifiez-les.",
    b32Required:
      "La TVA déduite sur les factures simplifiées a atteint 3 000 EUR. Détaillez-les par fournisseur en B.3.2 avant le dépôt.",
  },
  actions: {
    downloadXml: "Télécharger le XML",
    downloadCsv: "Télécharger le CSV",
    showXml: "Afficher le XML",
    hideXml: "Masquer le XML",
    copy: "Copier",
    copied: "Copié",
    copyError:
      "Copie impossible. Sélectionnez le texte et copiez-le manuellement.",
  },
  pickCompany: "Choisissez une entreprise pour préparer sa déclaration de TVA.",
  empty: "Aucun document pertinent sur cette période.",
  errors: {
    validation: {
      title: "Requête invalide",
      description: "Choisissez une entreprise et un mois ou trimestre valide.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour préparer les déclarations de TVA.",
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
      description: "Les données ont changé pendant la préparation. Réessayez.",
    },
    server: {
      title: "Déclaration non préparée",
      description: "La déclaration de TVA n'a pas pu être préparée. Réessayez.",
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
    title: "Déclaration de TVA préparée",
    description:
      "Les lignes et les fichiers d'export reflètent les documents enregistrés.",
  },
};
