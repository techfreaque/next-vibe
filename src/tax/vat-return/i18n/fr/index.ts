import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Fiscalité", vatReturn: "Déclaration de TVA" },
  title: "Déclaration de TVA slovaque et relevé de contrôle",
  titleShort: "Déclaration de TVA (SK)",
  description:
    "Préparez les lignes de la déclaration DPH et le XML du relevé de contrôle (kontrolný výkaz) pour un mois ou un trimestre.",
  company: {
    label: "Entreprise",
    description: "L'entreprise assujettie à la TVA",
  },
  period: {
    label: "Période",
    description: "Mois ou trimestre de la déclaration",
    month: "{{month}} {{year}}",
    quarter: "T{{quarter}} {{year}}",
  },
  unsupportedCountry:
    "La déclaration de TVA est préparée uniquement pour les entreprises slovaques. Définissez la Slovaquie comme pays de l'entreprise pour l'utiliser.",
  disclaimer:
    "Nous fournissons des outils, pas de conseil fiscal. Faites vérifier vos déclarations par votre conseiller fiscal avant de les déposer dans eDane.",
  summary: "{{company}}, du {{from}} au {{to}}",
  due: "À déposer par voie électronique au plus tard le 25 du mois suivant.",
  lines: {
    title: "Lignes de la déclaration DPH (DPHv25)",
    line: "Ligne",
    meaning: "Signification",
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
    title: "Relevé de contrôle (KV DPH)",
    section: "Section",
    count: "Lignes",
    A1: "A.1 Factures émises à des assujettis",
    A2: "A.2 Factures émises en autoliquidation nationale",
    B1: "B.1 Factures reçues, vous payez la taxe",
    B2: "B.2 Factures nationales reçues avec déduction",
    B31: "B.3.1 Factures simplifiées reçues (total)",
    C1: "C.1 Avoirs émis",
    D1: "D.1 Chiffre d'affaires eKasa",
    D2: "D.2 Autres opérations (clients sans IČ DPH)",
  },
  warnings: {
    noVatId:
      "L'entreprise n'a pas de numéro de TVA (IČ DPH) valide. Le XML KV l'exige avant le dépôt.",
    customerVatIds:
      "{{count}} factures concernent des clients sans IČ DPH et sont déclarées en D.2.",
    unmappedRates:
      "{{count}} lignes utilisent des taux autres que 23 / 19 / 5 % et ne figurent pas dans la déclaration. Vérifiez-les.",
    b32Required:
      "La TVA déduite sur les factures simplifiées a atteint 3 000 EUR. Détaillez-les par fournisseur en B.3.2 avant le dépôt.",
  },
  actions: {
    downloadKv: "Télécharger le XML KV DPH",
    downloadCsv: "Télécharger les lignes de la déclaration (CSV)",
    showXml: "Afficher le XML",
    hideXml: "Masquer le XML",
    copy: "Copier",
    copied: "Copié",
    copyError:
      "Copie impossible. Sélectionnez le texte et copiez-le manuellement.",
  },
  pickCompany: "Choisissez une entreprise pour préparer sa déclaration de TVA.",
  empty: "Aucun document soumis à la TVA sur cette période.",
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
      "Les lignes et le relevé de contrôle reflètent les documents enregistrés.",
  },
};
