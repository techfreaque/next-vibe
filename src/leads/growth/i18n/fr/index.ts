import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Croissance",
  tags: {
    vibeSense: "vibe-sense",
    growth: "croissance",
    campaigns: "campagnes",
    spend: "dépenses",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "Première visite",
      chat: "Premier message de chat",
      signup: "Inscription",
      newsletter: "Newsletter confirmée",
      paid: "Premier paiement",
      retained: "Renouvellement du 2e mois",
    },
    attributionTouch: {
      first: "Premier contact",
      last: "Dernier contact",
    },
    channelType: {
      all: "Tous les canaux",
      campaign: "Campagne (UTM)",
      referral: "Code de parrainage",
      organic: "Référent organique",
      direct: "Direct",
    },
    paidKind: {
      subscription: "Abonnement",
      pack: "Pack de crédits",
    },
  },
  links: {
    get: {
      title: "Liens de campagne",
      titleShort: "Liens de campagne",
      description:
        "Liens tagués par canal marketing, avec les visites, inscriptions et utilisateurs payants apportés par chaque lien.",
      response: {
        links: "Liens",
      },
      widget: {
        title: "Liens de campagne",
        subtitle: "Taguez chaque test de canal. Jugez-le sur ceux qui paient.",
        create: "Nouveau lien",
        refresh: "Actualiser",
        loading: "Chargement des liens…",
        empty: {
          title: "Aucun lien de campagne",
          hint: "Créez un lien par test de canal. Chaque visite, inscription et paiement qu'il apporte arrive ici.",
          cta: "Créer le premier lien",
        },
        visits: "Visites",
        signups: "Inscriptions",
        paid: "Payants",
        funnel:
          "{{visits}} visites → {{signups}} inscriptions → {{paid}} payants",
        paidRate: "{{rate}} des visites ont payé",
        refCode: "Réf. {{code}}",
        landsOn: "Arrive sur {{path}}",
        copy: "Copier le lien",
        copied: "Copié",
        spend: "Dépenses du canal",
      },
    },
    post: {
      title: "Créer un lien de campagne",
      titleShort: "Nouveau lien",
      description:
        "Créer un lien tagué UTM pour un canal, éventuellement lié à un code de parrainage.",
      fields: {
        name: {
          label: "Nom",
          description:
            "Nom interne, par ex. « Post de lancement Reddit r/LocalLLaMA »",
          placeholder: "Post de lancement Reddit",
        },
        channel: {
          label: "Source (utm_source)",
          description: "Origine du trafic : reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "Support (utm_medium)",
          description: "Type de trafic : social, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "Campagne (utm_campaign)",
          description: "Le test auquel ce lien appartient",
          placeholder: "launch-nov",
        },
        content: {
          label: "Contenu (utm_content)",
          description: "Facultatif. Quel visuel ou quel emplacement",
          placeholder: "top-comment",
        },
        term: {
          label: "Terme (utm_term)",
          description: "Facultatif. Mot-clé payant",
          placeholder: "uncensored ai",
        },
        destinationPath: {
          label: "Chemin d'arrivée",
          description:
            "Chemin de ce site ouvert par le lien, par ex. / ou /en-US/story",
          placeholder: "/",
        },
        refCode: {
          label: "Code de parrainage",
          description:
            "Facultatif. Fait passer la visite par /track pour que le code de parrainage soit aussi crédité",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "ID du lien",
        url: "URL de campagne",
      },
      widget: {
        back: "Retour",
        hint: "Toujours la même source pour le même canal. Les dépenses et le coût par utilisateur payant sont regroupés par source.",
        created: "Lien prêt. Partagez exactement cette URL :",
        copy: "Copier le lien",
        copied: "Copié",
      },
    },
  },
  spend: {
    get: {
      title: "Dépenses par canal",
      titleShort: "Dépenses par canal",
      description:
        "Dépenses par canal et par période, avec inscriptions, utilisateurs payants et coût par utilisateur payant.",
      response: {
        rows: "Entrées de dépenses",
      },
      widget: {
        title: "Dépenses par canal",
        subtitle:
          "Ce que coûte chaque canal, et ce que vous coûte un utilisateur payant.",
        add: "Ajouter une dépense",
        refresh: "Actualiser",
        loading: "Chargement des dépenses…",
        empty: {
          title: "Aucune dépense enregistrée",
          hint: "Enregistrez le coût d'un test de canal. Le coût par utilisateur payant s'affiche dès qu'il amène quelqu'un qui paie.",
          cta: "Enregistrer la première dépense",
        },
        period: "du {{from}} au {{to}}",
        signups: "Inscriptions",
        paid: "Utilisateurs payants",
        costPerPaid: "Coût / utilisateur payant",
        costPerSignup: "Coût / inscription",
        none: "n.d.",
        attribution:
          "Les utilisateurs comptent pour le canal qui les a amenés en premier (premier contact), sur la période.",
      },
    },
    post: {
      title: "Enregistrer une dépense de canal",
      titleShort: "Enregistrer une dépense",
      description:
        "Enregistrer le coût d'un canal sur une période. Même canal et même date de début : l'entrée est écrasée.",
      fields: {
        channel: {
          label: "Canal",
          description:
            "utm_source du canal, ou ref:CODE pour un partenaire de parrainage",
          placeholder: "reddit",
        },
        periodStart: {
          label: "Du",
          description: "Premier jour de la période de dépense",
        },
        periodEnd: {
          label: "Au",
          description: "Dernier jour de la période de dépense",
        },
        amount: {
          label: "Montant",
          description: "Total dépensé sur la période",
        },
        currency: {
          label: "Devise",
          description: "Devise du montant",
        },
        note: {
          label: "Note",
          description: "Facultatif. Ce que l'argent a acheté",
          placeholder: "2 posts sponsorisés",
        },
      },
      response: {
        id: "ID de l'entrée",
      },
      widget: {
        back: "Retour",
        hint: "Utilisez exactement le nom de source de vos liens de campagne, sinon le graphe ne peut pas relier les dépenses aux utilisateurs.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: {
        label: "Résolution",
        description: "Taille de l'intervalle",
      },
      range: { label: "Plage", description: "Plage temporelle à interroger" },
      lookback: {
        label: "Historique",
        description: "Barres supplémentaires avant le début de la plage",
      },
      meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
      touch: {
        label: "Attribution",
        description: "Regrouper par premier ou dernier contact",
      },
      channelType: {
        label: "Type de canal",
        description: "Campagne, parrainage, organique, direct, ou tous",
      },
      channel: {
        label: "Canal",
        description:
          "Clé exacte du canal : utm_source, ref:CODE, hôte référent ou direct. Vide = tous",
      },
      currency: {
        label: "Devise",
        description:
          "Seules les dépenses saisies dans cette devise sont additionnées",
      },
    },
    funnelStep: {
      post: {
        title: "Étape du funnel",
        titleShort: "Étape du funnel",
        description:
          "Parcours atteignant une étape du funnel de croissance par intervalle, filtrables par canal",
        fields: {
          step: {
            label: "Étape",
            description:
              "Étape du funnel : visit, chat, signup, newsletter, paid, retained",
          },
          result: {
            label: "Parcours",
            description: "Nombre par étape et par intervalle",
          },
        },
      },
    },
    channelSpend: {
      post: {
        title: "Dépenses par canal",
        titleShort: "Dépenses par canal",
        description:
          "Dépenses marketing enregistrées par intervalle, réparties uniformément sur chaque période",
        fields: {
          result: { label: "Dépenses", description: "Dépenses par intervalle" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les champs en surbrillance",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en tant qu'admin",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Les outils de croissance nécessitent le rôle admin",
    },
    notFound: {
      title: "Introuvable",
      description: "Cette entrée n'existe pas",
    },
    conflict: {
      title: "Conflit",
      description: "L'entrée a changé entre-temps, rechargez et réessayez",
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
      description: "Un échec inattendu s'est produit",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    invalidRefCode:
      "Le code de parrainage {{code}} n'existe pas ou est inactif",
    invalidPeriod:
      "La fin de la période doit être égale ou postérieure à son début",
    invalidDestination:
      "Le chemin d'arrivée doit commencer par / et rester sur ce site",
  },
  success: {
    title: "Terminé",
    description: "Enregistré",
  },
};
