import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Parrainage",
  tags: {
    referral: "parrainage",
    admin: "admin",
  },
  post: {
    title: "Réattribuer un code de parrainage",
    titleShort: "Réattribuer le code",
    description:
      "Transférer un code de parrainage vers un autre compte. Les filleuls déjà parrainés restent rattachés au code : leurs futures commissions vont au nouveau propriétaire. Les gains passés restent à ceux qui les ont gagnés. Simulation par défaut.",
    fields: {
      code: {
        label: "Code de parrainage",
        description: "Le code exact à transférer",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "Nouveau propriétaire",
        description: "ID utilisateur ou e-mail du compte qui reçoit le code",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "Simulation",
        description: "Prévisualiser le transfert sans rien modifier",
      },
    },
    response: {
      dryRun: "Simulation",
      code: "Code",
      fromUserId: "ID de l'ancien propriétaire",
      fromEmail: "Ancien propriétaire",
      toUserId: "ID du nouveau propriétaire",
      toEmail: "Nouveau propriétaire",
      referralsMoved: "Filleuls transférés",
      selfReferralsKept: "Auto-parrainages conservés par l'ancien propriétaire",
      linksMoved: "Liens suivis transférés",
      linksTotal: "Liens de campagne utilisant le code",
    },
    widget: {
      back: "Retour",
      hint: "La commission suit le propriétaire du code. Lancez d'abord une simulation, puis désactivez-la pour transférer le code.",
      submit: "Réattribuer le code",
      preview: "Simulation. Rien n'a été modifié.",
      done: "Code transféré.",
      summary: "{{code}} : {{from}} → {{to}}",
    },
    note: "Code de parrainage {{code}} transféré de {{from}} à {{to}} par {{admin}} le {{at}}. Filleuls transférés : {{referrals}}. Liens suivis transférés : {{links}}. Gains passés inchangés.",
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez le code et le nouveau propriétaire",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en tant qu'admin pour réattribuer des codes",
    },
    forbidden: {
      title: "Réservé aux admins",
      description:
        "Seuls les admins peuvent réattribuer des codes de parrainage",
    },
    notFound: {
      title: "Introuvable",
      description: "Le code ou l'utilisateur n'existe pas",
    },
    conflict: {
      title: "Conflit",
      description: "Le nouveau propriétaire possède déjà ce code",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de réattribuer le code",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n'a pas atteint le serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    codeNotFound: "Le code de parrainage {{code}} n'existe pas",
    userNotFound: "Aucun utilisateur ne correspond à {{target}}",
    alreadyOwner: "{{target}} possède déjà le code de parrainage {{code}}",
  },
  success: {
    title: "Terminé",
    description: "Code de parrainage réattribué",
  },
};
