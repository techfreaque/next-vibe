import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Parrainage",
  tags: {
    referral: "parrainage",
    links: "liens",
  },
  get: {
    title: "Mes liens suivis",
    titleShort: "Liens suivis",
    description:
      "Vos liens de parrainage, un par emplacement, avec les visites, inscriptions et gains de chacun.",
    response: {
      links: "Liens",
    },
    widget: {
      title: "Liens suivis",
      subtitle:
        "Un lien par emplacement. Voyez quelle vidéo, quel post ou quelle newsletter rapporte vraiment.",
      create: "Nouveau lien",
      refresh: "Actualiser",
      loading: "Chargement de vos liens...",
      copy: "Copier",
      copied: "Copié",
      visits: "Visites",
      signups: "Inscriptions",
      paid: "Payants",
      earned: "Gagné",
      pending: "{{amount}} en attente",
      code: "Code {{code}}",
      landsOn: "Arrive sur {{path}}",
      empty: {
        title: "Aucun lien suivi pour l'instant",
        hint: "Créez-en un par vidéo, post ou numéro de newsletter. Chaque visite, inscription et paiement lui est attribué.",
        cta: "Créer votre premier lien",
      },
      cli: {
        header: "{{count}} liens suivis",
        funnel:
          "{{visits}} visites, {{signups}} inscriptions, {{paid}} payants, {{earned}} gagnés ({{pending}} en attente)",
      },
    },
  },
  post: {
    title: "Créer un lien suivi",
    titleShort: "Nouveau lien",
    description:
      "Créez un lien de parrainage pour un emplacement. Il contient votre code de parrainage et des tags UTM : chaque visite, inscription et paiement est compté par lien.",
    submit: "Créer le lien",
    fields: {
      name: {
        label: "Nom",
        description: "Visible par vous seul. Nommez l'emplacement.",
        placeholder: "Test YouTube, novembre",
      },
      source: {
        label: "Où vous le publiez",
        description: "La plateforme ou le site, ex. youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "Campagne",
        description:
          "Regroupe des liens, ex. une vidéo ou un numéro. Facultatif.",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "Support",
        description: "Type d'emplacement. Par défaut : referral.",
        placeholder: "video",
      },
      destinationPath: {
        label: "Page d'arrivée",
        description: "Chemin sur ce site où arrivent les visiteurs",
        placeholder: "/",
      },
      code: {
        label: "Code de parrainage",
        description:
          "L'un de vos codes. Vide : votre premier code actif est utilisé.",
        placeholder: "MYCODE",
      },
    },
    response: {
      id: "ID du lien",
      url: "Lien",
      code: "Code de parrainage",
    },
    widget: {
      back: "Retour",
      hint: "Un lien par emplacement. Vous voyez alors exactement lequel amène des utilisateurs payants.",
      presets: "Où allez-vous le partager ?",
      created: "Votre lien est prêt",
      copy: "Copier",
      copied: "Copié",
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les champs en surbrillance",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous pour gérer vos liens",
    },
    forbidden: {
      title: "Non autorisé",
      description: "Vous ne pouvez pas gérer ces liens",
    },
    notFound: {
      title: "Introuvable",
      description: "Ce lien n'existe pas",
    },
    conflict: {
      title: "Conflit",
      description:
        "Quelque chose a changé entre-temps. Rechargez et réessayez.",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de traiter la requête",
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
    noCode:
      "Créez d'abord votre code de parrainage. Vos liens suivis reposent dessus.",
    notYourCode:
      "Le code {{code}} ne fait pas partie de vos codes de parrainage actifs",
    invalidDestination:
      "Le chemin d'arrivée doit commencer par / et rester sur ce site",
  },
  success: {
    title: "Terminé",
    description: "Lien prêt",
  },
};
