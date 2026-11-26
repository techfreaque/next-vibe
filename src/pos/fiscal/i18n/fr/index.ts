import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { pos: "Caisse", fiscal: "Tickets fiscaux" },
  enums: {
    adapter: {
      sandbox: "Sandbox (tests uniquement, non certifié)",
    },
    deviceKind: {
      orp: "ORP (caisse avec mémoire matérielle)",
      sorp: "SORP (caisse logicielle, mémoire chez l'éditeur)",
      vrp: "VRP (caisse virtuelle gratuite de la Finančná správa)",
    },
    receiptStatus: {
      pending: "En attente d'enregistrement",
      registered: "Enregistré",
      offline: "Émis hors ligne",
      failed: "Échec",
    },
  },
  block: {
    ekasaRequired:
      "La loi slovaque impose d'enregistrer chaque vente en espèces ou par carte dans eKasa. Connectez une caisse eKasa certifiée dans les paramètres fiscaux de la caisse avant de vendre.",
  },
  title: "Tickets fiscaux",
  description:
    "Vérifiez si votre pays impose des tickets fiscaux en ligne et quelle caisse enregistre vos ventes.",
  saveTitle: "Caisse fiscale",
  saveDescription:
    "Connectez la caisse qui enregistre vos ventes auprès de l'administration fiscale.",
  company: "Entreprise",
  adapter: "Fournisseur",
  adapterPlaceholder: "Choisissez un fournisseur",
  adapterDescription:
    "Seuls les fournisseurs certifiés enregistrent de vraies ventes. La sandbox sert aux tests et ne débloque jamais la vente.",
  deviceKind: "Type de caisse",
  deviceKindDescription:
    "ORP stocke les tickets dans un CHDÚ matériel. SORP garde la mémoire protégée sur les serveurs de l'éditeur. VRP est le service gratuit de la Finančná správa.",
  cashRegisterCode: "Code de caisse",
  cashRegisterCodeDescription:
    "Le code attribué à cette caisse par l'administration fiscale (kód pokladnice).",
  cashRegisterCodePlaceholder: "p. ex. 88812345678900001",
  isEnabled: "Enregistrer les ventes avec ce fournisseur",
  isEnabledDescription:
    "Activé, chaque vente terminée est mise en file pour enregistrement.",
  certifiedUntil: "Certificat valable jusqu'au",
  certifiedUntilDescription:
    "Dernier jour de validité du certificat de caisse. Les ventes sont bloquées ensuite.",
  credentialRef: "Référence des identifiants",
  credentialRefDescription:
    "Nom de la clé ou du certificat enregistré. Ne collez jamais ici une clé privée ni un mot de passe.",
  offlineDeadlineHours: "Délai d'envoi hors ligne (heures)",
  offlineDeadlineHoursDescription:
    "Les tickets émis hors ligne doivent parvenir à l'administration fiscale dans ce délai.",
  response: {
    required: "Tickets fiscaux obligatoires",
    blocked: "Ventes bloquées",
    provider: "Caisse",
    counts: "File des tickets",
    adapters: "Fournisseurs disponibles",
    companyName: "Entreprise",
    country: "Pays",
    saved: "Enregistré",
  },
  widget: {
    requiredTitle: "eKasa est obligatoire pour cette entreprise",
    requiredMessage:
      "Chaque vente en espèces ou par carte doit être enregistrée en ligne dans eKasa (zákon 384/2025 Z. z.). Les tickets non confirmés sous 5 secondes sont stockés hors ligne et doivent être envoyés sous 96 heures.",
    notRequiredTitle: "Aucun ticket fiscal en ligne exigé",
    notRequiredMessage:
      "Notre bibliothèque ne prévoit aucun système fiscal en ligne pour le pays de cette entreprise. Les ventes en caisse fonctionnent comme d'habitude.",
    blockedTitle: "Les ventes en caisse sont bloquées",
    blockedMessage:
      "Connectez et activez une caisse eKasa certifiée. D'ici là, la caisse ne peut terminer aucune vente.",
    readyTitle: "Les ventes sont enregistrées",
    readyMessage:
      "Les ventes terminées sont mises en file et enregistrées par la caisse connectée.",
    noCertifiedProvider:
      "Aucun fournisseur eKasa certifié n'est encore disponible dans cette installation.",
    noProvider: "Aucune caisse connectée",
    configure: "Connecter une caisse",
    edit: "Modifier la caisse",
    certified: "Certifiée",
    notCertified: "Non certifiée",
    enabled: "Activée",
    disabled: "Désactivée",
    certifiedUntilValue: "Certificat valable jusqu'au {{date}}",
    pending: "En attente",
    offline: "Hors ligne",
    failed: "Échecs",
    overdue: "Délai dépassé",
    queueHint: "Tickets pas encore confirmés par l'administration fiscale.",
    disclaimer: "Nous fournissons des outils, pas de conseil fiscal.",
    pickCompany: {
      title: "Choisissez une entreprise",
      message: "Les règles fiscales dépendent du pays de l'entreprise.",
    },
    savedTitle: "Caisse enregistrée",
    savedBlocked:
      "Les ventes restent bloquées : ce fournisseur n'est pas certifié eKasa.",
    savedReady: "Les ventes terminées seront enregistrées par cette caisse.",
    back: "Retour",
    save: "Enregistrer la caisse",
    sectionProvider: "Fournisseur",
    sectionDevice: "Caisse",
  },
  errors: {
    validation: {
      title: "Vérifiez les données de la caisse",
      description: "Certaines valeurs manquent ou ne sont pas valides.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour gérer les tickets fiscaux.",
    },
    forbidden: {
      title: "Accès refusé",
      description:
        "Seuls les propriétaires et administrateurs de l'entreprise peuvent modifier les paramètres fiscaux.",
    },
    notFound: {
      title: "Entreprise introuvable",
      description: "L'entreprise n'existe pas ou vous n'en êtes pas membre.",
    },
    conflict: {
      title: "Paramètres modifiés",
      description: "Rechargez la page et réessayez.",
    },
    server: {
      title: "Paramètres fiscaux indisponibles",
      description: "Réessayez dans un instant.",
    },
    network: {
      title: "Pas de connexion",
      description: "Vérifiez votre connexion et réessayez.",
    },
    unknown: {
      title: "Une erreur est survenue",
      description: "Réessayez dans un instant.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications.",
    },
    deviceKindUnsupported:
      "Ce fournisseur ne prend pas en charge le type de caisse choisi.",
    adapterUnknown: "Ce fournisseur n'existe pas.",
    sandboxProduction:
      "La sandbox est interdite en production. Choisissez un fournisseur certifié.",
  },
  success: {
    title: "Paramètres fiscaux chargés",
    description: "État des tickets fiscaux de l'entreprise.",
    savedTitle: "Caisse enregistrée",
    savedDescription: "Les paramètres de la caisse fiscale sont enregistrés.",
  },
};
